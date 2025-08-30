import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Camera, 
  Upload, 
  Scan,
  Image as ImageIcon,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Sparkles
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AnalyzedRecipe {
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  cookingTime: number;
  confidence: number;
  detectedItems: string[];
}

interface ImageAnalysis {
  id: string;
  file: File;
  preview: string;
  status: 'analyzing' | 'completed' | 'error';
  progress: number;
  recipe?: AnalyzedRecipe;
  error?: string;
}

export function ImageRecipeCreator({ onRecipeCreated }: { onRecipeCreated: (recipe: AnalyzedRecipe) => void }) {
  const [analyses, setAnalyses] = useState<ImageAnalysis[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const analyzeImage = async (file: File): Promise<AnalyzedRecipe> => {
    // Simulate AI image analysis
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockDetectedItems = [
          'pasta', 'tomatoes', 'basil', 'garlic', 'olive oil',
          'onion', 'cheese', 'herbs', 'vegetables'
        ];
        
        const detectedItems = mockDetectedItems
          .sort(() => Math.random() - 0.5)
          .slice(0, Math.floor(Math.random() * 4) + 3);

        const mockRecipe: AnalyzedRecipe = {
          name: `${detectedItems[0].charAt(0).toUpperCase() + detectedItems[0].slice(1)} Delight`,
          description: `A delicious dish featuring ${detectedItems.slice(0, 2).join(' and ')} with fresh ingredients.`,
          ingredients: [
            ...detectedItems.map(item => `Fresh ${item}`),
            '2 tbsp olive oil',
            'Salt and pepper to taste',
            '1 cup water or broth'
          ],
          instructions: [
            'Wash and prepare all fresh ingredients',
            'Heat olive oil in a large pan',
            'Add aromatics and cook until fragrant',
            'Incorporate main ingredients from the image',
            'Season with salt and pepper',
            'Cook until ingredients are tender',
            'Serve hot and enjoy'
          ],
          servings: 4,
          difficulty: ['Easy', 'Medium', 'Hard'][Math.floor(Math.random() * 3)] as 'Easy' | 'Medium' | 'Hard',
          cookingTime: 20 + Math.floor(Math.random() * 40),
          confidence: 75 + Math.floor(Math.random() * 20),
          detectedItems
        };

        resolve(mockRecipe);
      }, 3000);
    });
  };

  const processImage = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload an image file (JPG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    const analysisId = Date.now().toString();
    const preview = URL.createObjectURL(file);
    
    const analysis: ImageAnalysis = {
      id: analysisId,
      file,
      preview,
      status: 'analyzing',
      progress: 0
    };

    setAnalyses(prev => [...prev, analysis]);

    try {
      // Simulate progress
      for (let i = 0; i <= 90; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setAnalyses(prev => prev.map(a => 
          a.id === analysisId ? { ...a, progress: i } : a
        ));
      }

      const recipe = await analyzeImage(file);

      setAnalyses(prev => prev.map(a => 
        a.id === analysisId ? { 
          ...a, 
          status: 'completed', 
          progress: 100, 
          recipe 
        } : a
      ));

      toast({
        title: "Image Analysis Complete",
        description: `Generated "${recipe.name}" from your image with ${recipe.confidence}% confidence`,
      });

      onRecipeCreated(recipe);

    } catch (error) {
      setAnalyses(prev => prev.map(a => 
        a.id === analysisId ? { 
          ...a, 
          status: 'error', 
          error: 'Failed to analyze image' 
        } : a
      ));

      toast({
        title: "Analysis Failed",
        description: "Failed to analyze the image. Please try another image.",
        variant: "destructive",
      });
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    if (imageFiles.length !== files.length) {
      toast({
        title: "Non-image Files Skipped",
        description: "Only image files are supported for recipe analysis",
        variant: "destructive",
      });
    }

    imageFiles.forEach(processImage);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(processImage);
    e.target.value = '';
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const openCamera = () => {
    cameraInputRef.current?.click();
  };

  const removeAnalysis = (id: string) => {
    setAnalyses(prev => {
      const analysis = prev.find(a => a.id === id);
      if (analysis) {
        URL.revokeObjectURL(analysis.preview);
      }
      return prev.filter(a => a.id !== id);
    });
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-500';
    if (confidence >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 80) return 'High';
    if (confidence >= 60) return 'Medium';
    return 'Low';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Recipe from Image
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Upload Food Image</h3>
            <p className="text-muted-foreground mb-4">
              AI will analyze your image and generate a recipe
            </p>
            
            <div className="flex gap-2 justify-center">
              <Button onClick={openFileDialog} variant="default">
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </Button>
              <Button onClick={openCamera} variant="outline">
                <Camera className="h-4 w-4 mr-2" />
                Take Photo
              </Button>
            </div>
            
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              multiple
            />
            <Input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          <Alert>
            <Scan className="h-4 w-4" />
            <AlertDescription>
              For best results, upload clear images of prepared dishes, ingredients, or recipe cards.
              The AI will identify ingredients and cooking methods to generate an accurate recipe.
            </AlertDescription>
          </Alert>

          {analyses.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-semibold">Image Analysis Results:</h4>
              
              {analyses.map((analysis) => (
                <Card key={analysis.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {/* Image Preview */}
                      <div className="flex-shrink-0">
                        <img
                          src={analysis.preview}
                          alt="Uploaded food"
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      </div>

                      {/* Analysis Content */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                          <h5 className="font-medium">{analysis.file.name}</h5>
                          <div className="flex items-center gap-2">
                            {analysis.status === 'analyzing' && (
                              <Badge variant="secondary" className="animate-pulse">
                                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                Analyzing...
                              </Badge>
                            )}
                            {analysis.status === 'completed' && analysis.recipe && (
                              <Badge variant="default" className={getConfidenceColor(analysis.recipe.confidence)}>
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                {getConfidenceBadge(analysis.recipe.confidence)} Confidence
                              </Badge>
                            )}
                            {analysis.status === 'error' && (
                              <Badge variant="destructive">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Failed
                              </Badge>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAnalysis(analysis.id)}
                              className="h-8 w-8 p-0"
                            >
                              ×
                            </Button>
                          </div>
                        </div>

                        {analysis.status === 'analyzing' && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Analyzing image...</span>
                              <span>{analysis.progress}%</span>
                            </div>
                            <Progress value={analysis.progress} className="h-2" />
                          </div>
                        )}

                        {analysis.status === 'completed' && analysis.recipe && (
                          <div className="space-y-3">
                            <div>
                              <h6 className="font-medium text-green-600">{analysis.recipe.name}</h6>
                              <p className="text-sm text-muted-foreground">{analysis.recipe.description}</p>
                            </div>

                            <div className="flex items-center gap-4 text-xs">
                              <span>🍽️ {analysis.recipe.servings} servings</span>
                              <span>⏱️ {analysis.recipe.cookingTime} min</span>
                              <span>📊 {analysis.recipe.difficulty}</span>
                              <span className={getConfidenceColor(analysis.recipe.confidence)}>
                                🎯 {analysis.recipe.confidence}% confidence
                              </span>
                            </div>

                            <div>
                              <span className="text-xs font-medium text-muted-foreground">Detected items:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {analysis.recipe.detectedItems.map((item, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {item}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  // Preview functionality
                                  toast({
                                    title: "Recipe Preview",
                                    description: `${analysis.recipe.ingredients.length} ingredients, ${analysis.recipe.instructions.length} steps`,
                                  });
                                }}
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                Preview
                              </Button>
                            </div>
                          </div>
                        )}

                        {analysis.status === 'error' && (
                          <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>{analysis.error}</AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}