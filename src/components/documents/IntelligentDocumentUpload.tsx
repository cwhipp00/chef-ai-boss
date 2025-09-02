import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Brain, 
  Loader2,
  File,
  Image,
  FileSpreadsheet
} from 'lucide-react';

interface UploadedDocument {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  category?: string;
  confidence?: number;
  extractedData?: any;
}

interface IntelligentDocumentUploadProps {
  organizationId: string;
  onDocumentProcessed?: (document: UploadedDocument) => void;
}

export function IntelligentDocumentUpload({ 
  organizationId, 
  onDocumentProcessed 
}: IntelligentDocumentUploadProps) {
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => processFile(file));
  }, [organizationId]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],  
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/csv': ['.csv'],
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: true
  });

  const processFile = async (file: File) => {
    const documentId = `${Date.now()}-${file.name}`;
    
    // Add document to state
    setDocuments(prev => [...prev, {
      id: documentId,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading',
      progress: 0
    }]);

    try {
      // Step 1: Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const filePath = `${organizationId}/${documentId}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('user-assignments')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Step 2: Read file content for AI processing
      setDocuments(prev => prev.map(doc => 
        doc.id === documentId 
          ? { ...doc, status: 'processing', progress: 60 }
          : doc
      ));

      const fileContent = await readFileContent(file);
      
      // Step 3: Process with AI
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data: aiResult, error: aiError } = await supabase.functions.invoke('parse-document-ai', {
        body: {
          documentContent: fileContent,
          fileName: file.name,
          organizationId,
          userId: user.user.id
        }
      });

      if (aiError) throw aiError;

      // Step 4: Store document metadata in documents table
      const { error: docError } = await supabase
        .from('documents')
        .insert({
          title: file.name,
          file_name: file.name,
          file_path: filePath,
          file_type: file.type,
          file_size: file.size,
          category: aiResult.analysis.category,
          user_id: user.user.id,
          tags: [aiResult.analysis.category]
        });

      if (docError) throw docError;

      // Update document state
      const processedDoc = {
        id: documentId,
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'completed' as const,
        progress: 100,
        category: aiResult.analysis.category,
        confidence: aiResult.analysis.confidence,
        extractedData: aiResult.analysis.extractedData
      };

      setDocuments(prev => prev.map(doc => 
        doc.id === documentId ? processedDoc : doc
      ));

      onDocumentProcessed?.(processedDoc);

      toast({
        title: "Document Processed Successfully",
        description: `${file.name} has been analyzed and categorized as "${aiResult.analysis.category}" with ${Math.round(aiResult.analysis.confidence * 100)}% confidence.`,
      });

    } catch (error) {
      console.error('Error processing document:', error);
      
      setDocuments(prev => prev.map(doc => 
        doc.id === documentId 
          ? { ...doc, status: 'error', progress: 0 }
          : doc
      ));

      toast({
        title: "Processing Failed",
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: "destructive"
      });
    }
  };

  const readFileContent = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === 'string') {
          resolve(result);
        } else {
          // Handle binary files by converting to base64
          resolve(btoa(String.fromCharCode(...new Uint8Array(result as ArrayBuffer))));
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      
      if (file.type.startsWith('text/') || file.type === 'application/json') {
        reader.readAsText(file);
      } else {
        reader.readAsArrayBuffer(file);
      }
    });
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (type.includes('spreadsheet') || type.includes('excel') || type === 'text/csv') {
      return <FileSpreadsheet className="h-4 w-4" />;
    }
    return <FileText className="h-4 w-4" />;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  const removeDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <Card className="border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors">
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`text-center cursor-pointer transition-colors rounded-lg p-8 ${
              isDragActive 
                ? 'bg-primary/10 border-primary' 
                : 'hover:bg-muted/50'
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {isDragActive ? 'Drop files here' : 'Upload Company Documents'}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Drag & drop files or click to browse. AI will automatically categorize and extract information.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="outline">PDF</Badge>
                  <Badge variant="outline">Word</Badge>
                  <Badge variant="outline">Excel</Badge>
                  <Badge variant="outline">Text</Badge>
                  <Badge variant="outline">Images</Badge>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Brain className="h-4 w-4 mr-2" />
                AI-Powered Processing
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Processing Queue */}
      {documents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Document Processing Queue
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center gap-4 p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  {getFileIcon(doc.type)}
                  {getStatusIcon(doc.status)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium truncate">{doc.name}</p>
                    <div className="flex items-center gap-2">
                      {doc.category && (
                        <Badge variant="secondary" className="text-xs">
                          {doc.category}
                        </Badge>
                      )}
                      {doc.confidence && (
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            doc.confidence > 0.8 ? 'text-success' : 
                            doc.confidence > 0.6 ? 'text-warning' : 'text-muted-foreground'
                          }`}
                        >
                          {Math.round(doc.confidence * 100)}% confident
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Progress value={doc.progress} className="flex-1 h-2" />
                    <span className="text-xs text-muted-foreground">
                      {Math.round(doc.progress)}%
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-muted-foreground">
                      {(doc.size / 1024).toFixed(1)} KB • {doc.status}
                    </p>
                    {doc.status === 'error' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDocument(doc.id)}
                        className="text-destructive"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* AI Processing Info */}
      <Card className="bg-gradient-card border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Brain className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-medium text-sm mb-1">AI-Powered Document Intelligence</h4>
              <p className="text-xs text-muted-foreground">
                Our AI automatically categorizes documents, extracts key information, and generates appropriate forms for your restaurant operations. 
                Supported categories include recipes, checklists, inventory lists, training materials, menus, and policies.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}