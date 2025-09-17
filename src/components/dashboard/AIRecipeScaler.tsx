import React, { useState } from "react";
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
  Minus,
  AlertCircle
} from "lucide-react";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from "@/hooks/use-toast";

interface Recipe {
  id?: string | number;
  name: string;
  servings: number;
  prepTime: number;
  cookTime?: number;
  difficulty: "Easy" | "Medium" | "Hard";
  category?: string;
  cost?: number;
  ingredients: Array<{
    name: string;
    amount: number;
    unit: string;
  }> | string[];
  instructions?: string[];
}

interface AIRecipeScalerProps {
  selectedRecipe?: Recipe;
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

export function AIRecipeScaler({ selectedRecipe }: AIRecipeScalerProps) {
  // Convert uploaded recipe to proper format
  const convertToRecipeFormat = (recipe: any): Recipe => {
    const convertedIngredients = recipe.ingredients?.map((ing: any, index: number) => {
      if (typeof ing === 'string') {
        // Parse string ingredients like "2 cups flour" or "1.5 lbs chicken"
        const match = ing.match(/^(\d*\.?\d+)\s*([a-zA-Z]*)\s+(.+)$/);
        if (match) {
          return {
            name: match[3],
            amount: parseFloat(match[1]),
            unit: match[2] || 'piece'
          };
        }
        return {
          name: ing,
          amount: 1,
          unit: 'piece'
        };
      }
      return ing;
    }) || [];

    return {
      id: recipe.id || `recipe-${Date.now()}`,
      name: recipe.name || 'Uploaded Recipe',
      servings: recipe.servings || 4,
      prepTime: recipe.prepTime || 30,
      cookTime: recipe.cookTime || 0,
      difficulty: recipe.difficulty || "Medium",
      category: recipe.category || 'Main Course',
      cost: recipe.cost || 0,
      ingredients: convertedIngredients,
      instructions: recipe.instructions || []
    };
  };

  const baseRecipe = selectedRecipe ? convertToRecipeFormat(selectedRecipe) : sampleRecipe;
  const originalServings = baseRecipe.servings; // Store the original serving size
  
  const [recipe, setRecipe] = useState<Recipe>(baseRecipe);
  const [targetServings, setTargetServings] = useState(originalServings); // Start from original servings
  const [isScaling, setIsScaling] = useState(false);
  const { toast } = useToast();

  // Update when selectedRecipe changes
  React.useEffect(() => {
    if (selectedRecipe) {
      const newRecipe = convertToRecipeFormat(selectedRecipe);
      setRecipe(newRecipe);
      setTargetServings(newRecipe.servings); // Reset to original serving size
    }
  }, [selectedRecipe]);

  const scaleFactor = targetServings / originalServings; // Scale from original, not current

  const handleScale = async () => {
    setIsScaling(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const scaledRecipe = {
      ...baseRecipe, // Use base recipe as reference
      servings: targetServings,
      ingredients: baseRecipe.ingredients.map(ingredient => ({
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
                <span>{originalServings} servings (original)</span>
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
              <span>Scale factor: {scaleFactor.toFixed(2)}x from original ({originalServings} servings)</span>
            </div>
          </div>
        </div>

        {/* Ingredients List */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Ingredients</h4>
          <div className="grid gap-2">
            {baseRecipe.ingredients.map((ingredient, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                <span className="text-sm text-foreground">{ingredient.name}</span>
                <div className="text-sm">
                  <span className="font-medium text-primary">
                    {Math.round((ingredient.amount * scaleFactor) * 100) / 100} {ingredient.unit}
                  </span>
                  {scaleFactor !== 1 && (
                    <span className="text-muted-foreground ml-2">
                      (was {ingredient.amount} {ingredient.unit})
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        {targetServings !== originalServings && (
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