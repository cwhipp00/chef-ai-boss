import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ChefHat, 
  Users, 
  Clock, 
  Brain, 
  Scale,
  Plus,
  Minus 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Recipe {
  id: string;
  name: string;
  servings: number;
  prepTime: number;
  difficulty: "Easy" | "Medium" | "Hard";
  ingredients: Array<{
    name: string;
    amount: number;
    unit: string;
  }>;
}

const sampleRecipe: Recipe = {
  id: "1",
  name: "Chicken Parmesan",
  servings: 4,
  prepTime: 25,
  difficulty: "Medium",
  ingredients: [
    { name: "Chicken breast", amount: 1.5, unit: "lbs" },
    { name: "Breadcrumbs", amount: 2, unit: "cups" },
    { name: "Parmesan cheese", amount: 1, unit: "cup" },
    { name: "Marinara sauce", amount: 2, unit: "cups" },
    { name: "Mozzarella cheese", amount: 1.5, unit: "cups" },
    { name: "Eggs", amount: 2, unit: "pieces" },
    { name: "Olive oil", amount: 0.25, unit: "cup" }
  ]
};

export function AIRecipeScaler() {
  const [recipe, setRecipe] = useState<Recipe>(sampleRecipe);
  const [targetServings, setTargetServings] = useState(recipe.servings);
  const [isScaling, setIsScaling] = useState(false);
  const { toast } = useToast();

  const scaleFactor = targetServings / recipe.servings;

  const handleScale = async () => {
    setIsScaling(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const scaledRecipe = {
      ...recipe,
      servings: targetServings,
      ingredients: recipe.ingredients.map(ingredient => ({
        ...ingredient,
        amount: Math.round((ingredient.amount * scaleFactor) * 100) / 100
      }))
    };
    
    setRecipe(scaledRecipe);
    setIsScaling(false);
    
    toast({
      title: "Recipe Scaled Successfully",
      description: `${recipe.name} scaled to ${targetServings} servings with AI optimization`,
    });
  };

  const adjustServings = (delta: number) => {
    const newServings = Math.max(1, targetServings + delta);
    setTargetServings(newServings);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-success";
      case "Medium": return "bg-warning";
      case "Hard": return "bg-destructive";
      default: return "bg-muted";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ChefHat className="h-5 w-5 text-primary" />
          AI Recipe Scaler
        </CardTitle>
        <CardDescription>
          Intelligently scale recipes with AI-powered portion calculations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Recipe Info */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">{recipe.name}</h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{recipe.servings} servings</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{recipe.prepTime} min</span>
              </div>
            </div>
          </div>
          <Badge className={getDifficultyColor(recipe.difficulty)}>
            {recipe.difficulty}
          </Badge>
        </div>

        <Separator />

        {/* Scaling Controls */}
        <div className="space-y-4">
          <Label htmlFor="servings" className="text-sm font-medium">
            Target Servings
          </Label>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => adjustServings(-1)}
              disabled={targetServings <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              id="servings"
              type="number"
              value={targetServings}
              onChange={(e) => setTargetServings(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20 text-center"
              min="1"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => adjustServings(1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Scale className="h-4 w-4" />
              <span>Scale factor: {scaleFactor.toFixed(2)}x</span>
            </div>
          </div>
        </div>

        {/* Ingredients List */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Ingredients</h4>
          <div className="grid gap-2">
            {recipe.ingredients.map((ingredient, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                <span className="text-sm text-foreground">{ingredient.name}</span>
                <span className="text-sm font-medium text-primary">
                  {Math.round((ingredient.amount * scaleFactor) * 100) / 100} {ingredient.unit}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        {targetServings !== recipe.servings && (
          <Button
            onClick={handleScale}
            disabled={isScaling}
            className="w-full"
            variant="glow"
          >
            {isScaling ? (
              <>
                <Brain className="h-4 w-4 mr-2 animate-pulse" />
                AI is scaling recipe...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4 mr-2" />
                Scale Recipe with AI
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}