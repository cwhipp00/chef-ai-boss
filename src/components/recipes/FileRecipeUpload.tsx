import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Upload, 
  FileText, 
  FileSpreadsheet, 
  FileImage,
  AlertCircle,
  CheckCircle2,
  X,
  Download
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  extractedRecipes?: ParsedRecipe[];
  error?: string;
}

interface ParsedRecipe {
  name: string;
  ingredients: string[];
  instructions: string[];
  servings?: number;
  prepTime?: number;
  cookTime?: number;
  category?: string;
  cost?: number;
}

const SUPPORTED_FORMATS = {
  'application/pdf': { icon: FileText, label: 'PDF' },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { icon: FileText, label: 'Word' },
  'application/msword': { icon: FileText, label: 'Word' },
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { icon: FileSpreadsheet, label: 'Excel' },
  'application/vnd.ms-excel': { icon: FileSpreadsheet, label: 'Excel' },
  'text/csv': { icon: FileSpreadsheet, label: 'CSV' },
  'text/markdown': { icon: FileText, label: 'Markdown' },
  'text/plain': { icon: FileText, label: 'Text' },
  'application/json': { icon: FileText, label: 'JSON' },
  'application/rtf': { icon: FileText, label: 'RTF' },
  'text/html': { icon: FileText, label: 'HTML' },
  'application/xml': { icon: FileText, label: 'XML' },
};

export function FileRecipeUpload({ onRecipesExtracted }: { onRecipesExtracted: (recipes: ParsedRecipe[]) => void }) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const parseFileContent = async (file: File): Promise<ParsedRecipe[]> => {
    console.log(`Starting to parse file: ${file.name} (${file.type})`);
    
    try {
      // Read file content
      console.log('Reading file content...');
      const content = await readFileAsText(file);
      console.log('File content read, length:', content.length);
      
      // Call AI recipe parser edge function
      console.log('Calling AI recipe parser...');
      const response = await fetch('https://lfpnnlkjqpphstpcmcsi.supabase.co/functions/v1/ai-recipe-parser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          fileName: file.name,
          fileType: file.type
        })
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API response error:', errorText);
        throw new Error(`Failed to parse file: ${response.status} - ${errorText}`);
      }

      const responseData = await response.json();
      console.log('AI Parser Response:', responseData);
      
      if (responseData.success && responseData.recipes) {
        const { recipes } = responseData;
        console.log('Successfully extracted recipes:', recipes);
        return recipes;
      } else if (responseData.error) {
        console.error('AI Parser returned error:', responseData.error);
        throw new Error(responseData.error);
      } else {
        console.warn('Unexpected response format:', responseData);
        return [];
      }
    } catch (error) {
      console.error('File parsing error:', error);
      
      // Show toast with error
      toast({
        title: "Parsing Failed",
        description: `Failed to parse ${file.name}. Using fallback recipe.`,
        variant: "destructive",
      });
      
      // Fallback to basic recipe
      return [{
        name: `Recipe from ${file.name}`,
        ingredients: ["Main ingredient from file", "Salt to taste", "Oil for cooking"],
        instructions: ["Prepare ingredients", "Cook as needed", "Serve hot"],
        servings: 4,
        prepTime: 15,
        cookTime: 30,
        category: 'Main Course',
        cost: 10.00
      }];
    }
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          resolve(result);
        } else if (result instanceof ArrayBuffer) {
          // For binary files, convert to base64
          const uint8Array = new Uint8Array(result);
          const binaryString = String.fromCharCode.apply(null, Array.from(uint8Array));
          resolve(btoa(binaryString));
        } else {
          reject(new Error('Unable to read file'));
        }
      };
      reader.onerror = () => reject(new Error('File reading failed'));
      
      if (file.type.startsWith('text/') || file.name.endsWith('.md')) {
        reader.readAsText(file);
      } else {
        reader.readAsArrayBuffer(file);
      }
    });
  };

  const processFile = async (file: File) => {
    const fileId = Date.now().toString();
    const uploadedFile: UploadedFile = {
      id: fileId,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading',
      progress: 0
    };

    setFiles(prev => [...prev, uploadedFile]);

    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 20) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setFiles(prev => prev.map(f => 
          f.id === fileId ? { ...f, progress: i } : f
        ));
      }

      // Change to processing status
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, status: 'processing', progress: 0 } : f
      ));

      // Parse the file content
      const extractedRecipes = await parseFileContent(file);

      // Complete the processing
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { 
          ...f, 
          status: 'completed', 
          progress: 100, 
          extractedRecipes 
        } : f
      ));

      toast({
        title: "File Processed Successfully",
        description: `Extracted ${extractedRecipes.length} recipe(s) from ${file.name}`,
      });

      onRecipesExtracted(extractedRecipes);

    } catch (error) {
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { 
          ...f, 
          status: 'error', 
          error: 'Failed to process file' 
        } : f
      ));

      toast({
        title: "Processing Failed",
        description: `Failed to extract recipes from ${file.name}`,
        variant: "destructive",
      });
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = droppedFiles.filter(file => 
      Object.keys(SUPPORTED_FORMATS).includes(file.type)
    );

    if (validFiles.length !== droppedFiles.length) {
      toast({
        title: "Unsupported Files",
        description: "Some files were skipped due to unsupported format",
        variant: "destructive",
      });
    }

    validFiles.forEach(processFile);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter(file => 
      Object.keys(SUPPORTED_FORMATS).includes(file.type)
    );

    validFiles.forEach(processFile);
    e.target.value = ''; // Reset input
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const getFileIcon = (fileType: string) => {
    const format = SUPPORTED_FORMATS[fileType as keyof typeof SUPPORTED_FORMATS];
    return format?.icon || FileText;
  };

  const getStatusColor = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploading': return 'text-blue-500';
      case 'processing': return 'text-yellow-500';
      case 'completed': return 'text-green-500';
      case 'error': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'completed': return CheckCircle2;
      case 'error': return AlertCircle;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Upload Recipe Documents
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
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Drop files here or click to browse</h3>
            <p className="text-muted-foreground mb-4">
              Support for PDF, Word, Excel, CSV, Markdown, JSON, RTF, HTML, XML and text files
            </p>
            
            <Input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.md,.txt,.json,.rtf,.html,.xml"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <Button asChild>
              <label htmlFor="file-upload" className="cursor-pointer">
                Select Files
              </label>
            </Button>
          </div>

          {/* Supported Formats */}
          <div>
            <h4 className="text-sm font-medium mb-2">Supported Formats:</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(SUPPORTED_FORMATS).map(([type, config]) => (
                <Badge key={type} variant="outline" className="text-xs">
                  <config.icon className="h-3 w-3 mr-1" />
                  {config.label}
                </Badge>
              ))}
            </div>
          </div>

          {files.length > 0 && <Separator />}

          {/* File Processing Status */}
          {files.map((file) => {
            const StatusIcon = getStatusIcon(file.status);
            const FileIcon = getFileIcon(file.type);

            return (
              <div key={file.id} className="space-y-2">
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <FileIcon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium ${getStatusColor(file.status)}`}>
                          {file.status.charAt(0).toUpperCase() + file.status.slice(1)}
                        </span>
                        {StatusIcon && <StatusIcon className={`h-4 w-4 ${getStatusColor(file.status)}`} />}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(file.id)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{(file.size / 1024).toFixed(1)} KB</span>
                      {file.status !== 'completed' && file.status !== 'error' && (
                        <>
                          <span>•</span>
                          <span>{file.progress}%</span>
                        </>
                      )}
                    </div>
                    {(file.status === 'uploading' || file.status === 'processing') && (
                      <Progress value={file.progress} className="h-1 mt-2" />
                    )}
                  </div>
                </div>

                {file.status === 'error' && file.error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{file.error}</AlertDescription>
                  </Alert>
                )}

                {file.status === 'completed' && file.extractedRecipes && (
                  <div className="ml-8 space-y-2">
                    <h5 className="text-sm font-medium text-green-600">
                      Extracted {file.extractedRecipes.length} recipe(s):
                    </h5>
                    {file.extractedRecipes.map((recipe, index) => (
                      <div key={index} className="text-xs text-muted-foreground pl-4 border-l-2 border-green-200">
                        <span className="font-medium">{recipe.name}</span>
                        {recipe.servings && <span className="ml-2">• {recipe.servings} servings</span>}
                        {recipe.category && <span className="ml-2">• {recipe.category}</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}