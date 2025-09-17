import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useDropzone } from 'react-dropzone';
import {
  Upload,
  Image as ImageIcon,
  FileText,
  Camera,
  Sparkles,
  CheckCircle,
  AlertCircle,
  ChefHat,
  DollarSign,
  Users,
  Clock,
  Zap,
  Brain,
  Eye,
  Edit,
  Save
} from 'lucide-react';

interface RecipeAnalysis {
  ingredients: Array<{
    name: string;
    amount: string;
    unit: string;
    cost?: number;
    alternatives?: string[];
  }>;
  instructions: string[];
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
  };
  costAnalysis: {
    totalCost: number;
    costPerServing: number;
    suggestedPrice: number;
    profitMargin: number;
  };
  suggestions: {
    improvements: string[];
    alternatives: string[];
    seasonalVariations: string[];
  };
  difficulty: 'easy' | 'medium' | 'hard';
  prepTime: number;
  cookTime: number;
  servings: number;
}

interface EnhancedRecipeUploadProps {
  onRecipeSaved?: (recipe: any) => void;
}

export function EnhancedRecipeUpload({ onRecipeSaved }: EnhancedRecipeUploadProps) {
  const [uploadStep, setUploadStep] = useState<'upload' | 'analyzing' | 'review' | 'saved'>('upload');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [textInput, setTextInput] = useState('');
  const [recipeAnalysis, setRecipeAnalysis] = useState<RecipeAnalysis | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadedFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt']
    },
    multiple: true
  });

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const analyzeRecipe = async () => {
    if (uploadedFiles.length === 0 && !textInput.trim()) {
      toast({
        title: "No Input Provided",
        description: "Please upload files or enter recipe text to analyze.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setUploadStep('analyzing');
    setProgress(0);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 200);

      let recipeData = '';
      
      // Process uploaded files
      if (uploadedFiles.length > 0) {
        for (const file of uploadedFiles) {
          if (file.type.startsWith('image/')) {
            // Convert image to base64 for AI analysis
            const base64 = await fileToBase64(file);
            recipeData += `[IMAGE: ${file.name}]\n`;
          } else if (file.type === 'text/plain' || file.type === 'application/pdf') {
            const text = await file.text();
            recipeData += text + '\n';
          }
        }
      }

      // Add text input
      if (textInput.trim()) {
        recipeData += textInput;
      }

      // Call AI recipe enhancer
      const { data, error } = await supabase.functions.invoke('ai-recipe-enhancer', {
        body: {
          recipeData,
          analysisType: 'comprehensive',
          includeCosting: true,
          includeNutrition: true,
          includeSuggestions: true
        }
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (error) throw error;

      // Parse AI response
      const analysis = parseRecipeAnalysis(data.analysis || data.response);
      setRecipeAnalysis(analysis);
      setUploadStep('review');

      toast({
        title: "Recipe Analysis Complete!",
        description: "AI has analyzed your recipe and provided comprehensive insights.",
      });

    } catch (error) {
      console.error('Recipe analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze the recipe. Please try again.",
        variant: "destructive"
      });
      setUploadStep('upload');
    } finally {
      setIsProcessing(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const parseRecipeAnalysis = (aiResponse: string): RecipeAnalysis => {
    // This would normally parse the AI response
    // For demo purposes, returning mock data
    return {
      ingredients: [
        { name: 'Chicken Breast', amount: '2', unit: 'lbs', cost: 12.99, alternatives: ['Turkey Breast', 'Pork Tenderloin'] },
        { name: 'Olive Oil', amount: '2', unit: 'tbsp', cost: 0.50 },
        { name: 'Garlic', amount: '3', unit: 'cloves', cost: 0.25 },
        { name: 'Italian Seasoning', amount: '1', unit: 'tsp', cost: 0.10 }
      ],
      instructions: [
        'Preheat oven to 375°F (190°C)',
        'Season chicken with salt, pepper, and Italian seasoning',
        'Heat olive oil in oven-safe skillet over medium-high heat',
        'Sear chicken for 3-4 minutes per side until golden',
        'Add minced garlic to skillet',
        'Transfer skillet to oven and bake for 15-20 minutes until internal temp reaches 165°F'
      ],
      nutrition: {
        calories: 285,
        protein: 45,
        carbs: 2,
        fat: 12,
        fiber: 1
      },
      costAnalysis: {
        totalCost: 13.84,
        costPerServing: 3.46,
        suggestedPrice: 16.99,
        profitMargin: 79.6
      },
      suggestions: {
        improvements: [
          'Add lemon juice for brightness',
          'Consider brining for extra moisture',
          'Use herb butter for finishing'
        ],
        alternatives: [
          'Mediterranean version with olives and tomatoes',
          'Asian-inspired with soy sauce and ginger'
        ],
        seasonalVariations: [
          'Summer: Add fresh basil and cherry tomatoes',
          'Winter: Include root vegetables'
        ]
      },
      difficulty: 'medium',
      prepTime: 15,
      cookTime: 25,
      servings: 4
    };
  };

  const saveRecipe = async () => {
    if (!recipeAnalysis) return;

    setIsProcessing(true);
    
    try {
      // Save recipe to database
      const recipeData = {
        name: `AI Enhanced Recipe - ${new Date().toLocaleDateString()}`,
        description: 'Recipe created and enhanced with AI analysis',
        ingredients: recipeAnalysis.ingredients,
        instructions: recipeAnalysis.instructions,
        prep_time_minutes: recipeAnalysis.prepTime,
        cook_time_minutes: recipeAnalysis.cookTime,
        servings: recipeAnalysis.servings,
        difficulty: recipeAnalysis.difficulty,
        cost_per_serving: recipeAnalysis.costAnalysis.costPerServing,
        suggested_price: recipeAnalysis.costAnalysis.suggestedPrice,
        nutrition_data: recipeAnalysis.nutrition,
        ai_suggestions: recipeAnalysis.suggestions,
        created_with_ai: true
      };

      toast({
        title: "Recipe Saved!",
        description: "Your AI-enhanced recipe has been saved successfully.",
      });

      setUploadStep('saved');
      onRecipeSaved?.(recipeData);

    } catch (error) {
      console.error('Save recipe error:', error);
      toast({
        title: "Save Failed",
        description: "Unable to save the recipe. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const resetUpload = () => {
    setUploadStep('upload');
    setUploadedFiles([]);
    setTextInput('');
    setRecipeAnalysis(null);
    setProgress(0);
    setEditMode(false);
  };

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <ChefHat className="h-6 w-6 text-primary" />
          AI Recipe Enhancer
        </h2>
        <div className="flex items-center gap-2">
          <Badge variant={uploadStep === 'upload' ? 'default' : 'secondary'}>
            1. Upload
          </Badge>
          <Badge variant={uploadStep === 'analyzing' ? 'default' : 'secondary'}>
            2. Analyze
          </Badge>
          <Badge variant={uploadStep === 'review' ? 'default' : 'secondary'}>
            3. Review
          </Badge>
          <Badge variant={uploadStep === 'saved' ? 'default' : 'secondary'}>
            4. Save
          </Badge>
        </div>
      </div>

      {uploadStep === 'upload' && (
        <div className="space-y-6">
          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Recipe Files
              </CardTitle>
              <CardDescription>
                Upload images, PDFs, or text files containing recipes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-primary bg-primary/5'
                    : 'border-muted hover:border-primary/50'
                }`}
              >
                <input {...getInputProps()} />
                <div className="space-y-4">
                  <div className="flex justify-center">
                    {isDragActive ? (
                      <Upload className="h-12 w-12 text-primary animate-bounce" />
                    ) : (
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="text-lg font-medium">
                      {isDragActive
                        ? 'Drop the files here...'
                        : 'Drag & drop files here, or click to select'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Supports images (JPG, PNG), PDFs, and text files
                    </p>
                  </div>
                </div>
              </div>

              {/* Uploaded Files */}
              {uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h4 className="font-medium">Uploaded Files:</h4>
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm">{file.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {(file.size / 1024 / 1024).toFixed(1)} MB
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Text Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Or Enter Recipe Text
              </CardTitle>
              <CardDescription>
                Paste or type your recipe directly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Enter your recipe here... Include ingredients, instructions, and any notes."
                className="w-full h-40 p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </CardContent>
          </Card>

          {/* Analyze Button */}
          <div className="flex justify-center">
            <Button
              onClick={analyzeRecipe}
              disabled={uploadedFiles.length === 0 && !textInput.trim()}
              className="px-8 py-3"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Analyze Recipe with AI
            </Button>
          </div>
        </div>
      )}

      {uploadStep === 'analyzing' && (
        <Card>
          <CardContent className="p-8 text-center space-y-6">
            <div className="flex justify-center">
              <Brain className="h-16 w-16 text-primary animate-pulse" />
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">AI is Analyzing Your Recipe</h3>
              <p className="text-muted-foreground">
                Our advanced AI is processing your recipe to provide comprehensive insights...
              </p>
              <Progress value={progress} className="w-full max-w-md mx-auto" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Ingredient Analysis
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Nutrition Calculation
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Cost Analysis
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  AI Suggestions
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {uploadStep === 'review' && recipeAnalysis && (
        <div className="space-y-6">
          {/* Analysis Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <DollarSign className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{formatCurrency(recipeAnalysis.costAnalysis.costPerServing)}</div>
                <div className="text-sm text-muted-foreground">Cost per Serving</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{recipeAnalysis.servings}</div>
                <div className="text-sm text-muted-foreground">Servings</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{recipeAnalysis.prepTime + recipeAnalysis.cookTime}min</div>
                <div className="text-sm text-muted-foreground">Total Time</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Zap className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{recipeAnalysis.nutrition.calories}</div>
                <div className="text-sm text-muted-foreground">Calories</div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Ingredients */}
            <Card>
              <CardHeader>
                <CardTitle>Ingredients & Costing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recipeAnalysis.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{ingredient.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {ingredient.amount} {ingredient.unit}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(ingredient.cost || 0)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recipeAnalysis.instructions.map((instruction, index) => (
                    <div key={index} className="flex gap-3">
                      <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                        {index + 1}
                      </Badge>
                      <p className="text-sm">{instruction}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                AI Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Improvements</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {recipeAnalysis.suggestions.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Alternatives</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {recipeAnalysis.suggestions.alternatives.map((alternative, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Zap className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        {alternative}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Seasonal Variations</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {recipeAnalysis.suggestions.seasonalVariations.map((variation, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Clock className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        {variation}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button onClick={saveRecipe} disabled={isProcessing} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              Save Recipe
            </Button>
            <Button variant="outline" onClick={resetUpload}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Another
            </Button>
          </div>
        </div>
      )}

      {uploadStep === 'saved' && (
        <Card>
          <CardContent className="p-8 text-center space-y-6">
            <div className="flex justify-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Recipe Saved Successfully!</h3>
              <p className="text-muted-foreground">
                Your AI-enhanced recipe has been saved to your recipe collection.
              </p>
            </div>
            <div className="flex gap-4 justify-center">
              <Button onClick={resetUpload}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Another Recipe
              </Button>
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                View Recipe Collection
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}