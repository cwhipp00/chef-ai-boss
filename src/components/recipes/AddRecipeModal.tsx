import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Plus, 
  Upload, 
  FileText, 
  Image as ImageIcon, 
  Sparkles,
  Camera,
  FileSpreadsheet,
  Bot
} from 'lucide-react';
import { FileRecipeUpload } from './FileRecipeUpload';
import { AIRecipeGenerator } from './AIRecipeGenerator';
import { ImageRecipeCreator } from './ImageRecipeCreator';

interface AddRecipeModalProps {
  onRecipeCreated: (recipe: any) => void;
}

export function AddRecipeModal({ onRecipeCreated }: AddRecipeModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const handleRecipeCreated = (recipe: any) => {
    onRecipeCreated(recipe);
    setIsOpen(false);
    setSelectedMethod(null);
  };

  const uploadMethods = [
    {
      id: 'files',
      title: 'Upload Documents',
      description: 'Upload files like PDFs, Word docs, Excel sheets, CSV, or text files',
      icon: FileText,
      color: 'bg-blue-500/10 text-blue-600 border-blue-200',
      features: ['PDF files', 'Word documents', 'Excel spreadsheets', 'CSV files', 'Markdown & text files']
    },
    {
      id: 'ai-generator',
      title: 'AI Recipe Generator',
      description: 'Generate recipes from ingredients using AI',
      icon: Bot,
      color: 'bg-purple-500/10 text-purple-600 border-purple-200',
      features: ['Ingredient-based', 'Dietary restrictions', 'Cuisine preferences', 'Custom requirements']
    },
    {
      id: 'image',
      title: 'Image Analysis',
      description: 'Analyze food photos to create recipes',
      icon: ImageIcon,
      color: 'bg-green-500/10 text-green-600 border-green-200',
      features: ['Food photos', 'Recipe cards', 'Ingredient recognition', 'Camera capture']
    },
    {
      id: 'manual',
      title: 'Manual Entry',
      description: 'Create recipes manually with our form builder',
      icon: Plus,
      color: 'bg-orange-500/10 text-orange-600 border-orange-200',
      features: ['Step-by-step form', 'Ingredient calculator', 'Cost estimation', 'Nutrition tracking']
    }
  ];

  const renderSelectedMethod = () => {
    switch (selectedMethod) {
      case 'files':
        return <FileRecipeUpload onRecipesExtracted={handleRecipeCreated} />;
      case 'ai-generator':
        return <AIRecipeGenerator onRecipeGenerated={handleRecipeCreated} />;
      case 'image':
        return <ImageRecipeCreator onRecipeCreated={handleRecipeCreated} />;
      case 'manual':
        return (
          <div className="text-center py-8">
            <Plus className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Manual Recipe Entry</h3>
            <p className="text-muted-foreground">Manual recipe form coming soon!</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="bg-gradient-primary">
          <Plus className="h-4 w-4 mr-2" />
          Add Recipe
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Add New Recipe
          </DialogTitle>
          <DialogDescription>
            Choose how you'd like to create your recipe using our AI-powered tools
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {!selectedMethod ? (
            <>
              <div className="text-center pb-4">
                <p className="text-muted-foreground">
                  Choose how you'd like to create your recipe
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {uploadMethods.map((method) => (
                  <Card 
                    key={method.id}
                    className={`cursor-pointer transition-all hover:shadow-lg hover:scale-105 border-2 ${method.color}`}
                    onClick={() => setSelectedMethod(method.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${method.color}`}>
                          <method.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{method.title}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {method.description}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ul className="space-y-1">
                        {method.features.map((feature, index) => (
                          <li key={index} className="text-xs text-muted-foreground flex items-center gap-2">
                            <div className="w-1 h-1 bg-primary rounded-full" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedMethod(null)}
                >
                  ← Back to Methods
                </Button>
                <h3 className="text-lg font-semibold">
                  {uploadMethods.find(m => m.id === selectedMethod)?.title}
                </h3>
              </div>
              
              {renderSelectedMethod()}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}