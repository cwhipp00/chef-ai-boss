import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { 
  Sparkles, 
  ChefHat, 
  Clock, 
  Users, 
  DollarSign,
  Utensils,
  Loader2,
  Wand2,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GeneratedRecipe {
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  servings: number;
  prepTime: number;
  cookTime: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  cost: number;
  allergens: string[];
  nutritionalInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

interface RecipePrompt {
  ingredients: string;
  cuisineType: string;
  dietaryRestrictions: string[];
  servings: number;
  cookingTime: number;
  difficulty: string;
  mealType: string;
  equipment: string;
  occasion: string;
}

const CUISINE_TYPES = [
  'Italian', 'French', 'Chinese', 'Japanese', 'Mexican', 'Indian', 
  'Thai', 'Mediterranean', 'American', 'Spanish', 'Korean', 'Vietnamese'
];

const DIETARY_RESTRICTIONS = [
  'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 
  'Low-Carb', 'Keto', 'Paleo', 'Halal', 'Kosher'
];

const MEAL_TYPES = [
  'Breakfast', 'Lunch', 'Dinner', 'Appetizer', 'Dessert', 'Snack', 'Brunch'
];

const OCCASIONS = [
  'Everyday', 'Date Night', 'Family Gathering', 'Party', 'Holiday', 'Picnic', 'Romantic'
];

export function AIRecipeGenerator({ onRecipeGenerated }: { onRecipeGenerated: (recipe: GeneratedRecipe) => void }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState<RecipePrompt>({
    ingredients: '',
    cuisineType: '',
    dietaryRestrictions: [],
    servings: 4,
    cookingTime: 30,
    difficulty: '',
    mealType: '',
    equipment: '',
    occasion: ''
  });
  const [generatedRecipe, setGeneratedRecipe] = useState<GeneratedRecipe | null>(null);
  const { toast } = useToast();

  const generateRecipe = async () => {
    if (!prompt.ingredients.trim()) {
      toast({
        title: "Missing Ingredients",
        description: "Please provide some ingredients to work with",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Call AI recipe generation edge function
      const response = await fetch('https://lfpnnlkjqpphstpcmcsi.supabase.co/functions/v1/ai-recipe-generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ingredients: prompt.ingredients,
          cuisineType: prompt.cuisineType,
          dietaryRestrictions: prompt.dietaryRestrictions,
          servings: prompt.servings,
          cookingTime: prompt.cookingTime,
          difficulty: prompt.difficulty,
          mealType: prompt.mealType,
          equipment: prompt.equipment,
          occasion: prompt.occasion
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate recipe');
      }

      const { recipe } = await response.json();
      
      // Convert to our interface format
      const generatedRecipe: GeneratedRecipe = {
        name: recipe.name,
        description: recipe.description,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        servings: prompt.servings,
        prepTime: recipe.prepTime || Math.max(10, prompt.cookingTime * 0.3),
        cookTime: recipe.cookTime || prompt.cookingTime,
        difficulty: recipe.difficulty as 'Easy' | 'Medium' | 'Hard',
        category: recipe.category || prompt.mealType || 'Main Course',
        cost: recipe.estimatedCost || calculateEstimatedCost(),
        allergens: recipe.allergens || [],
        nutritionalInfo: recipe.nutritionalInfo || {
          calories: 420,
          protein: 25,
          carbs: 35,
          fat: 15
        }
      };

      setGeneratedRecipe(generatedRecipe);
      onRecipeGenerated(generatedRecipe);
      
      toast({
        title: "Recipe Generated!",
        description: `Created "${generatedRecipe.name}" with AI assistance`,
      });
    } catch (error) {
      console.error('Recipe generation error:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate recipe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateRecipeName = (): string => {
    const baseIngredient = prompt.ingredients.split(',')[0]?.trim() || 'Special';
    const cuisinePrefix = prompt.cuisineType ? `${prompt.cuisineType} ` : '';
    const mealSuffix = prompt.mealType && prompt.mealType !== 'Dinner' ? ` ${prompt.mealType}` : '';
    
    const creativeSuffixes = ['Delight', 'Supreme', 'Fusion', 'Special', 'Sensation', 'Classic'];
    const suffix = creativeSuffixes[Math.floor(Math.random() * creativeSuffixes.length)];
    
    return `${cuisinePrefix}${baseIngredient} ${suffix}${mealSuffix}`;
  };

  const generateIngredients = (): string[] => {
    const baseIngredients = prompt.ingredients.split(',').map(i => i.trim()).filter(Boolean);
    const commonIngredients = [
      '2 tbsp olive oil', 
      '1 onion, diced', 
      '2 cloves garlic, minced',
      'Salt and pepper to taste',
      '1 cup broth',
      'Fresh herbs for garnish'
    ];
    
    return [...baseIngredients.map(ing => `1 cup ${ing}`), ...commonIngredients.slice(0, 4)];
  };

  const generateInstructions = (): string[] => {
    return [
      'Prepare all ingredients and preheat cooking equipment',
      'Heat oil in a large pan over medium heat',
      'Add aromatics and cook until fragrant',
      'Add main ingredients and cook according to recipe requirements',
      'Season with salt, pepper, and desired spices',
      'Simmer until ingredients are tender and flavors meld',
      'Adjust seasoning and garnish before serving'
    ];
  };

  const calculateEstimatedCost = (): number => {
    const baseCost = 8;
    const servingMultiplier = prompt.servings / 4;
    const difficultyMultiplier = prompt.difficulty === 'Hard' ? 1.5 : prompt.difficulty === 'Easy' ? 0.8 : 1;
    return Math.round((baseCost * servingMultiplier * difficultyMultiplier) * 100) / 100;
  };

  const generateAllergens = (): string[] => {
    const possibleAllergens = ['Gluten', 'Dairy', 'Eggs', 'Nuts', 'Soy'];
    const excludedAllergens = prompt.dietaryRestrictions
      .map(restriction => {
        if (restriction === 'Gluten-Free') return 'Gluten';
        if (restriction === 'Dairy-Free') return 'Dairy';
        if (restriction === 'Nut-Free') return 'Nuts';
        if (restriction === 'Vegan') return ['Dairy', 'Eggs'];
        return null;
      })
      .flat()
      .filter(Boolean);
    
    return possibleAllergens.filter(allergen => !excludedAllergens.includes(allergen))
      .slice(0, Math.floor(Math.random() * 3));
  };

  const regenerateRecipe = () => {
    if (generatedRecipe) {
      generateRecipe();
    }
  };

  const toggleDietaryRestriction = (restriction: string) => {
    setPrompt(prev => ({
      ...prev,
      dietaryRestrictions: prev.dietaryRestrictions.includes(restriction)
        ? prev.dietaryRestrictions.filter(r => r !== restriction)
        : [...prev.dietaryRestrictions, restriction]
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Recipe Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Main Ingredients Input */}
          <div className="space-y-2">
            <Label htmlFor="ingredients">Available Ingredients</Label>
            <Textarea
              id="ingredients"
              placeholder="Enter ingredients separated by commas (e.g., chicken breast, broccoli, garlic, onion)"
              value={prompt.ingredients}
              onChange={(e) => setPrompt(prev => ({ ...prev, ingredients: e.target.value }))}
              className="resize-none"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cuisine Type */}
            <div className="space-y-2">
              <Label>Cuisine Type</Label>
              <Select value={prompt.cuisineType} onValueChange={(value) => setPrompt(prev => ({ ...prev, cuisineType: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select cuisine" />
                </SelectTrigger>
                <SelectContent>
                  {CUISINE_TYPES.map(cuisine => (
                    <SelectItem key={cuisine} value={cuisine}>{cuisine}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Meal Type */}
            <div className="space-y-2">
              <Label>Meal Type</Label>
              <Select value={prompt.mealType} onValueChange={(value) => setPrompt(prev => ({ ...prev, mealType: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select meal type" />
                </SelectTrigger>
                <SelectContent>
                  {MEAL_TYPES.map(meal => (
                    <SelectItem key={meal} value={meal}>{meal}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Servings and Cooking Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Servings: {prompt.servings}
              </Label>
              <Slider
                value={[prompt.servings]}
                onValueChange={(value) => setPrompt(prev => ({ ...prev, servings: value[0] }))}
                min={1}
                max={12}
                step={1}
                className="w-full"
              />
            </div>
            
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Cooking Time: {prompt.cookingTime} minutes
              </Label>
              <Slider
                value={[prompt.cookingTime]}
                onValueChange={(value) => setPrompt(prev => ({ ...prev, cookingTime: value[0] }))}
                min={15}
                max={180}
                step={15}
                className="w-full"
              />
            </div>
          </div>

          {/* Dietary Restrictions */}
          <div className="space-y-3">
            <Label>Dietary Restrictions</Label>
            <div className="flex flex-wrap gap-2">
              {DIETARY_RESTRICTIONS.map(restriction => (
                <Badge
                  key={restriction}
                  variant={prompt.dietaryRestrictions.includes(restriction) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/10"
                  onClick={() => toggleDietaryRestriction(restriction)}
                >
                  {restriction}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Difficulty */}
            <div className="space-y-2">
              <Label>Difficulty Level</Label>
              <Select value={prompt.difficulty} onValueChange={(value) => setPrompt(prev => ({ ...prev, difficulty: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Occasion */}
            <div className="space-y-2">
              <Label>Occasion</Label>
              <Select value={prompt.occasion} onValueChange={(value) => setPrompt(prev => ({ ...prev, occasion: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select occasion" />
                </SelectTrigger>
                <SelectContent>
                  {OCCASIONS.map(occasion => (
                    <SelectItem key={occasion} value={occasion}>{occasion}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Equipment */}
          <div className="space-y-2">
            <Label htmlFor="equipment">Available Equipment (Optional)</Label>
            <Input
              id="equipment"
              placeholder="e.g., oven, stovetop, air fryer, slow cooker"
              value={prompt.equipment}
              onChange={(e) => setPrompt(prev => ({ ...prev, equipment: e.target.value }))}
            />
          </div>

          <Separator />

          {/* Generate Button */}
          <div className="flex gap-3">
            <Button 
              onClick={generateRecipe}
              disabled={isGenerating || !prompt.ingredients.trim()}
              size="lg"
              className="flex-1 bg-gradient-primary"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating Recipe...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Generate Recipe
                </>
              )}
            </Button>
            
            {generatedRecipe && (
              <Button 
                onClick={regenerateRecipe}
                variant="outline"
                disabled={isGenerating}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Generated Recipe Preview */}
      {generatedRecipe && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChefHat className="h-5 w-5 text-primary" />
              Generated Recipe Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-xl font-bold">{generatedRecipe.name}</h3>
              <p className="text-muted-foreground">{generatedRecipe.description}</p>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {generatedRecipe.servings} servings
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {generatedRecipe.prepTime + generatedRecipe.cookTime} min total
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                ${generatedRecipe.cost}
              </div>
              <Badge variant="secondary">{generatedRecipe.difficulty}</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Ingredients:</h4>
                <ul className="text-sm space-y-1">
                  {generatedRecipe.ingredients.slice(0, 5).map((ingredient, index) => (
                    <li key={index}>• {ingredient}</li>
                  ))}
                  {generatedRecipe.ingredients.length > 5 && (
                    <li className="text-primary">+ {generatedRecipe.ingredients.length - 5} more ingredients</li>
                  )}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Instructions Preview:</h4>
                <ol className="text-sm space-y-1">
                  {generatedRecipe.instructions.slice(0, 3).map((instruction, index) => (
                    <li key={index}>{index + 1}. {instruction}</li>
                  ))}
                  {generatedRecipe.instructions.length > 3 && (
                    <li className="text-primary">+ {generatedRecipe.instructions.length - 3} more steps</li>
                  )}
                </ol>
              </div>
            </div>

            {generatedRecipe.nutritionalInfo && (
              <div className="bg-muted/30 rounded-lg p-3">
                <h4 className="font-semibold mb-2 text-sm">Estimated Nutrition (per serving):</h4>
                <div className="grid grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="font-medium">Calories:</span>
                    <p>{generatedRecipe.nutritionalInfo.calories}</p>
                  </div>
                  <div>
                    <span className="font-medium">Protein:</span>
                    <p>{generatedRecipe.nutritionalInfo.protein}g</p>
                  </div>
                  <div>
                    <span className="font-medium">Carbs:</span>
                    <p>{generatedRecipe.nutritionalInfo.carbs}g</p>
                  </div>
                  <div>
                    <span className="font-medium">Fat:</span>
                    <p>{generatedRecipe.nutritionalInfo.fat}g</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}