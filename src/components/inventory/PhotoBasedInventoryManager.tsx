import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Camera, Upload, CheckCircle, AlertCircle, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useDropzone } from 'react-dropzone';

interface InventoryItem {
  name: string;
  category: string;
  quantity: number;
  unit: string;
  confidence: number;
  condition: 'fresh' | 'good' | 'fair' | 'poor';
  expiryEstimate?: string;
  location?: string;
}

interface AnalysisResult {
  items: InventoryItem[];
  summary: {
    totalItems: number;
    categoriesFound: string[];
    averageConfidence: number;
  };
}

export default function PhotoBasedInventoryManager() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please upload an image file.",
        variant: "destructive",
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Analyze the image
    setIsAnalyzing(true);
    try {
      // Convert to base64
      const base64 = await fileToBase64(file);
      
      const { data, error } = await supabase.functions.invoke('ai-inventory-analyzer', {
        body: {
          image: base64,
          imageType: file.type
        }
      });

      if (error) throw error;

      setAnalysisResult(data);
      toast({
        title: "Analysis Complete",
        description: `Identified ${data.items?.length || 0} inventory items.`,
      });
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'fresh': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'fair': return 'bg-yellow-500';
      case 'poor': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const addToInventory = async (item: InventoryItem) => {
    try {
      // Here you would integrate with your existing inventory system
      // For now, we'll just show a success message
      toast({
        title: "Added to Inventory",
        description: `${item.name} has been added to your inventory.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to inventory.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-primary" />
            Photo-Based Inventory Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            <div className="space-y-4">
              {uploadedImage ? (
                <img
                  src={uploadedImage}
                  alt="Uploaded inventory"
                  className="mx-auto max-h-48 rounded-lg shadow-md"
                />
              ) : (
                <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
              )}
              
              {isAnalyzing ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">
                    Analyzing image and identifying inventory items...
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-lg font-medium">
                    {isDragActive
                      ? "Drop the image here"
                      : "Upload inventory photo"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Drag & drop an image or click to select. Max size: 10MB
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {analysisResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {analysisResult.summary.totalItems}
                </div>
                <div className="text-sm text-muted-foreground">Items Found</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {analysisResult.summary.categoriesFound.length}
                </div>
                <div className="text-sm text-muted-foreground">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {Math.round(analysisResult.summary.averageConfidence * 100)}%
                </div>
                <div className="text-sm text-muted-foreground">Avg Confidence</div>
              </div>
            </div>

            <div className="space-y-3">
              {analysisResult.items.map((item, index) => (
                <Card key={index} className="border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{item.name}</h3>
                          <Badge variant="outline">{item.category}</Badge>
                          <Badge className={`${getConditionColor(item.condition)} text-white`}>
                            {item.condition}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Quantity:</span>
                            <div className="font-medium">{item.quantity} {item.unit}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Confidence:</span>
                            <div className={`font-medium ${getConfidenceColor(item.confidence)}`}>
                              {Math.round(item.confidence * 100)}%
                            </div>
                          </div>
                          {item.expiryEstimate && (
                            <div>
                              <span className="text-muted-foreground">Expiry Est:</span>
                              <div className="font-medium">{item.expiryEstimate}</div>
                            </div>
                          )}
                          {item.location && (
                            <div>
                              <span className="text-muted-foreground">Location:</span>
                              <div className="font-medium">{item.location}</div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => addToInventory(item)}
                        size="sm"
                        className="ml-4"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Add to Inventory
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}