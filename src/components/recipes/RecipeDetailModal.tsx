import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StepByStepInstructions } from './StepByStepInstructions';
import { 
  Clock, 
  Users, 
  Scale, 
  ChefHat, 
  CheckCircle2,
  Circle,
  Timer,
  Play
} from 'lucide-react';

interface Recipe {
  id: number;
  name: string;
  category: string;
  servings: number;
  prepTime: number;
  cookTime: number;
  difficulty: string;
  ingredients: string[];
  instructions: string[];
  cost: number;
  allergens: string[];
}

interface RecipeDetailModalProps {
  recipe: Recipe;
  children: React.ReactNode;
}

export function RecipeDetailModal({ recipe, children }: RecipeDetailModalProps) {
  const [servingScale, setServingScale] = useState([recipe.servings]);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [activeStep, setActiveStep] = useState(0);
  const [cookingMode, setCookingMode] = useState<'overview' | 'step-by-step'>('overview');

  const scaleFactor = servingScale[0] / recipe.servings;

  const toggleStepCompletion = (stepIndex: number) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepIndex)) {
      newCompleted.delete(stepIndex);
    } else {
      newCompleted.add(stepIndex);
      if (stepIndex === activeStep && stepIndex < recipe.instructions.length - 1) {
        setActiveStep(stepIndex + 1);
      }
    }
    setCompletedSteps(newCompleted);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const scaleIngredient = (ingredient: string) => {
    // Simple regex to find numbers in ingredients and scale them
    return ingredient.replace(/(\d+(?:\.\d+)?)/g, (match) => {
      const num = parseFloat(match);
      const scaled = Math.round((num * scaleFactor) * 100) / 100;
      return scaled.toString();
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <ChefHat className="h-6 w-6 text-primary" />
            {recipe.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Recipe Header Info */}
          <div className="flex items-center gap-4 flex-wrap">
            <Badge className={getDifficultyColor(recipe.difficulty)}>
              {recipe.difficulty}
            </Badge>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{servingScale[0]} servings</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Timer className="h-4 w-4" />
              <span>Prep: {recipe.prepTime}min</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Cook: {recipe.cookTime}min</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Scale className="h-4 w-4" />
              <span>${(recipe.cost * scaleFactor).toFixed(2)}</span>
            </div>
          </div>

          {/* Allergens */}
          <div className="flex gap-1 flex-wrap">
            {recipe.allergens.map((allergen) => (
              <Badge key={allergen} variant="outline" className="text-xs">
                {allergen}
              </Badge>
            ))}
          </div>

          {/* Serving Scale Slider */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Adjust Servings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium w-20">Servings:</span>
                  <Slider
                    value={servingScale}
                    onValueChange={setServingScale}
                    max={20}
                    min={1}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium w-12">{servingScale[0]}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Scale factor: {scaleFactor.toFixed(2)}x
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Ingredients */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ingredients</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                      {scaleIngredient(ingredient)}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Instructions</CardTitle>
                  <Button
                    onClick={() => setCookingMode('step-by-step')}
                    size="sm"
                    className="bg-gradient-primary"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Cook Mode
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs value={cookingMode} onValueChange={(value) => setCookingMode(value as 'overview' | 'step-by-step')}>
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="step-by-step">Step-by-Step</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview">
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground mb-3">
                        Click to mark steps as complete
                      </p>
                      {recipe.instructions.map((instruction, index) => (
                        <div key={index} className="space-y-2">
                          <div 
                            className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                              activeStep === index 
                                ? 'bg-primary/10 border-l-4 border-primary' 
                                : completedSteps.has(index)
                                ? 'bg-green-50 dark:bg-green-950/20'
                                : 'bg-muted/50 hover:bg-muted'
                            }`}
                            onClick={() => toggleStepCompletion(index)}
                          >
                            <div className="flex-shrink-0 mt-1">
                              {completedSteps.has(index) ? (
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                              ) : (
                                <Circle className="h-5 w-5 text-muted-foreground" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-medium text-primary">
                                  Step {index + 1}
                                </span>
                                {activeStep === index && (
                                  <Badge variant="secondary" className="text-xs">
                                    Current
                                  </Badge>
                                )}
                              </div>
                              <p className={`text-sm ${
                                completedSteps.has(index) 
                                  ? 'line-through text-muted-foreground' 
                                  : 'text-foreground'
                              }`}>
                                {instruction}
                              </p>
                            </div>
                          </div>
                          {index < recipe.instructions.length - 1 && (
                            <Separator className="ml-8" />
                          )}
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="step-by-step">
                    <StepByStepInstructions 
                      instructions={recipe.instructions}
                      onClose={() => setCookingMode('overview')}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Progress */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between text-sm">
                <span>Progress:</span>
                <span className="font-medium">
                  {completedSteps.size} of {recipe.instructions.length} steps completed
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mt-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${(completedSteps.size / recipe.instructions.length) * 100}%` 
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}