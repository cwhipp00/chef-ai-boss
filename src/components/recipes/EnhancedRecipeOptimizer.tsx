import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Sparkles, 
  ChefHat, 
  Clock, 
  Users, 
  DollarSign,
  Zap,
  Loader2,
  Upload,
  Star,
  TrendingUp,
  Target,
  FileText
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface EnhancedRecipe {
  name: string;
  description: string;
  ingredients: Array<{
    name: string;
    amount: string;
    unit: string;
    cost?: number;
    allergens?: string[];
    substitutes?: string[];
  }>;
  instructions: Array<{
    step: number;
    instruction: string;
    duration?: string;
    temperature?: string;
    equipment?: string[];
  }>;
  metadata: {
    servings: number;
    prepTime: string;
    cookTime: string;
    totalTime: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    cuisine: string;
    mealType: string[];
    dietaryInfo: string[];
    allergens: string[];
    tags: string[];
  };
  nutrition?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    sugar?: number;
    sodium?: number;
  };
  costing?: {
    totalCost: number;
    costPerServing: number;
    ingredientCosts: Array<{ ingredient: string; cost: number }>;
    profitMargin?: number;
  };
  qualityScore: number;
  suggestions: string[];
}

const DIETARY_RESTRICTIONS = [
  'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 
  'Low-Carb', 'Keto', 'Paleo', 'Halal', 'Kosher'
];

const ENHANCEMENT_TYPES = {
  parse: 'Parse & Analyze',
  optimize: 'Optimize Recipe',
  scale: 'Scale for Volume',
  analyze: 'Deep Analysis'
};

export function EnhancedRecipeOptimizer() {
  const [recipeText, setRecipeText] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [enhancementType, setEnhancementType] = useState<'parse' | 'optimize' | 'scale' | 'analyze'>('parse');
  const [targetServings, setTargetServings] = useState(50);
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [costTarget, setCostTarget] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [enhancedRecipe, setEnhancedRecipe] = useState<EnhancedRecipe | null>(null);
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      toast({
        title: "Image Uploaded",
        description: "Recipe image will be analyzed with AI",
      });
    }
  };

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.readAsDataURL(file);
    });
  };

  const toggleDietaryRestriction = (restriction: string) => {
    setDietaryRestrictions(prev => 
      prev.includes(restriction)
        ? prev.filter(r => r !== restriction)
        : [...prev, restriction]
    );
  };

  const enhanceRecipe = async () => {
    if (!recipeText.trim()) {
      toast({
        title: "Recipe Required",
        description: "Please provide recipe text to enhance",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      let imageData = '';
      if (imageFile) {
        imageData = await convertImageToBase64(imageFile);
      }

      const { data, error } = await supabase.functions.invoke('ai-recipe-enhancer', {
        body: {
          recipeText,
          imageData: imageData || undefined,
          enhancementType,
          targetServings: enhancementType === 'scale' ? targetServings : undefined,
          dietaryRestrictions: dietaryRestrictions.length > 0 ? dietaryRestrictions : undefined,
          costTarget: costTarget > 0 ? costTarget : undefined
        }
      });

      if (error) throw error;

      if (data.success) {
        setEnhancedRecipe(data.recipe);
        toast({
          title: "Recipe Enhanced!",
          description: `Successfully ${enhancementType}d recipe with AI analysis`,
        });
      } else {
        throw new Error(data.error || 'Enhancement failed');
      }
    } catch (error) {
      console.error('Recipe enhancement error:', error);
      toast({
        title: "Enhancement Failed",
        description: "Failed to enhance recipe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getQualityColor = (score: number) => {
    if (score >= 90) return 'text-success';
    if (score >= 70) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Recipe Enhancer & Optimizer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={enhancementType} onValueChange={(value) => setEnhancementType(value as any)}>
            <TabsList className="grid w-full grid-cols-4">
              {Object.entries(ENHANCEMENT_TYPES).map(([key, label]) => (
                <TabsTrigger key={key} value={key}>{label}</TabsTrigger>
              ))}
            </TabsList>

            <div className="mt-6 space-y-6">
              {/* Recipe Input */}
              <div className="space-y-2">
                <Label htmlFor="recipe">Recipe Text</Label>
                <Textarea
                  id="recipe"
                  placeholder="Paste your recipe here or describe what you want to create..."
                  value={recipeText}
                  onChange={(e) => setRecipeText(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="image">Recipe Image (Optional)</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="flex-1"
                  />
                  {imageFile && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Upload className="h-3 w-3" />
                      {imageFile.name}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Enhancement-specific options */}
              <TabsContent value="scale" className="space-y-4 mt-0">
                <div className="space-y-2">
                  <Label htmlFor="servings">Target Servings</Label>
                  <Input
                    id="servings"
                    type="number"
                    value={targetServings}
                    onChange={(e) => setTargetServings(parseInt(e.target.value) || 50)}
                    min="1"
                    max="500"
                  />
                </div>
              </TabsContent>

              <TabsContent value="optimize" className="space-y-4 mt-0">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Target Cost per Serving ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={costTarget}
                      onChange={(e) => setCostTarget(parseFloat(e.target.value) || 0)}
                      placeholder="Enter target cost (optional)"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label>Dietary Restrictions</Label>
                    <div className="flex flex-wrap gap-2">
                      {DIETARY_RESTRICTIONS.map(restriction => (
                        <Badge
                          key={restriction}
                          variant={dietaryRestrictions.includes(restriction) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleDietaryRestriction(restriction)}
                        >
                          {restriction}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <Separator />

              <Button 
                onClick={enhanceRecipe}
                disabled={isProcessing || !recipeText.trim()}
                size="lg"
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Enhancing Recipe...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    {ENHANCEMENT_TYPES[enhancementType]} with AI
                  </>
                )}
              </Button>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Enhanced Recipe Results */}
      {enhancedRecipe && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ChefHat className="h-5 w-5 text-primary" />
                Enhanced Recipe Results
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                <span className={`font-bold ${getQualityColor(enhancedRecipe.qualityScore)}`}>
                  Quality Score: {enhancedRecipe.qualityScore}/100
                </span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Recipe Header */}
            <div>
              <h3 className="text-2xl font-bold mb-2">{enhancedRecipe.name}</h3>
              <p className="text-muted-foreground mb-4">{enhancedRecipe.description}</p>
              
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-primary" />
                  <span>{enhancedRecipe.metadata.servings} servings</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>{enhancedRecipe.metadata.totalTime}</span>
                </div>
                {enhancedRecipe.costing && (
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <span>${enhancedRecipe.costing.costPerServing}/serving</span>
                  </div>
                )}
                <Badge variant="secondary">{enhancedRecipe.metadata.difficulty}</Badge>
                <Badge variant="outline">{enhancedRecipe.metadata.cuisine}</Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Ingredients */}
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Ingredients
                </h4>
                <div className="space-y-2">
                  {enhancedRecipe.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                      <span className="font-medium">{ingredient.name}</span>
                      <div className="text-right">
                        <span className="text-sm">{ingredient.amount} {ingredient.unit}</span>
                        {ingredient.cost && (
                          <div className="text-xs text-muted-foreground">${ingredient.cost.toFixed(2)}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Instructions
                </h4>
                <div className="space-y-3">
                  {enhancedRecipe.instructions.map((instruction) => (
                    <div key={instruction.step} className="p-3 rounded-lg bg-muted/30">
                      <div className="flex items-start gap-3">
                        <Badge variant="outline" className="shrink-0">
                          {instruction.step}
                        </Badge>
                        <div className="flex-1">
                          <p className="text-sm mb-1">{instruction.instruction}</p>
                          {(instruction.duration || instruction.temperature) && (
                            <div className="flex gap-4 text-xs text-muted-foreground">
                              {instruction.duration && (
                                <span>⏱️ {instruction.duration}</span>
                              )}
                              {instruction.temperature && (
                                <span>🌡️ {instruction.temperature}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Nutrition & Costing */}
            {(enhancedRecipe.nutrition || enhancedRecipe.costing) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {enhancedRecipe.nutrition && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Nutritional Information (per serving)</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>Calories: <span className="font-bold">{enhancedRecipe.nutrition.calories}</span></div>
                        <div>Protein: <span className="font-bold">{enhancedRecipe.nutrition.protein}g</span></div>
                        <div>Carbs: <span className="font-bold">{enhancedRecipe.nutrition.carbs}g</span></div>
                        <div>Fat: <span className="font-bold">{enhancedRecipe.nutrition.fat}g</span></div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {enhancedRecipe.costing && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Cost Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Total Cost:</span>
                          <span className="font-bold">${enhancedRecipe.costing.totalCost.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Per Serving:</span>
                          <span className="font-bold">${enhancedRecipe.costing.costPerServing.toFixed(2)}</span>
                        </div>
                        {enhancedRecipe.costing.profitMargin && (
                          <div className="flex justify-between">
                            <span>Profit Margin:</span>
                            <span className="font-bold text-success">{enhancedRecipe.costing.profitMargin}%</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* AI Suggestions */}
            {enhancedRecipe.suggestions.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  AI Suggestions & Improvements
                </h4>
                <div className="space-y-2">
                  {enhancedRecipe.suggestions.map((suggestion, index) => (
                    <div key={index} className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                      <p className="text-sm">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags & Dietary Info */}
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {enhancedRecipe.metadata.dietaryInfo.map(info => (
                  <Badge key={info} variant="secondary" className="bg-success/10 text-success">
                    {info}
                  </Badge>
                ))}
                {enhancedRecipe.metadata.allergens.map(allergen => (
                  <Badge key={allergen} variant="destructive" className="bg-destructive/10">
                    ⚠️ {allergen}
                  </Badge>
                ))}
                {enhancedRecipe.metadata.tags.map(tag => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}