import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  FileText, 
  Sparkles, 
  Download,
  Eye,
  Trash2,
  Brain,
  FileSpreadsheet,
  File,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface FormField {
  id: string;
  type: 'text' | 'email' | 'number' | 'select' | 'checkbox' | 'textarea' | 'date' | 'radio';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
}

interface GeneratedForm {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
  sourceFile?: string;
  createdAt: Date;
}

interface AIFormCreatorProps {
  organizationId: string;
}

export const AIFormCreator = ({ organizationId }: AIFormCreatorProps) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedForms, setGeneratedForms] = useState<GeneratedForm[]>([]);
  const [previewForm, setPreviewForm] = useState<GeneratedForm | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supportedFileTypes = [
    '.pdf', '.doc', '.docx', '.xls', '.xlsx', 
    '.csv', '.txt', '.json', '.xml'
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!supportedFileTypes.includes(fileExtension)) {
      toast.error(`Unsupported file type. Please upload: ${supportedFileTypes.join(', ')}`);
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('File size must be less than 10MB');
      return;
    }

    setUploadedFile(file);
    toast.success(`File "${file.name}" ready for processing`);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const generateFormFromFile = async () => {
    if (!uploadedFile) {
      toast.error('Please upload a file first');
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      // Convert file to base64
      const fileBase64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]); // Remove data URL prefix
        };
        reader.readAsDataURL(uploadedFile);
      });

      setProgress(25);

      // Call AI form generator edge function
      const { data, error } = await supabase.functions.invoke('ai-form-generator', {
        body: {
          fileName: uploadedFile.name,
          fileType: uploadedFile.type,
          fileContent: fileBase64,
          organizationId
        }
      });

      setProgress(75);

      if (error) {
        throw new Error(error.message || 'Failed to generate form');
      }

      if (!data.success) {
        throw new Error(data.error || 'Form generation failed');
      }

      const newForm: GeneratedForm = {
        id: Date.now().toString(),
        title: data.form.title,
        description: data.form.description,
        fields: data.form.fields,
        sourceFile: uploadedFile.name,
        createdAt: new Date()
      };

      setGeneratedForms(prev => [newForm, ...prev]);
      setProgress(100);
      
      toast.success('Form generated successfully!');
      setUploadedFile(null);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error) {
      console.error('Error generating form:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate form');
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const previewFormInModal = (form: GeneratedForm) => {
    setPreviewForm(form);
  };

  const deleteForm = (formId: string) => {
    setGeneratedForms(prev => prev.filter(f => f.id !== formId));
    toast.success('Form deleted successfully');
  };

  const exportForm = (form: GeneratedForm) => {
    const formData = {
      title: form.title,
      description: form.description,
      fields: form.fields,
      metadata: {
        sourceFile: form.sourceFile,
        createdAt: form.createdAt,
        organizationId
      }
    };

    const blob = new Blob([JSON.stringify(formData, null, 2)], { 
      type: 'application/json' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${form.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_form.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Form exported successfully');
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (['xls', 'xlsx', 'csv'].includes(extension || '')) {
      return <FileSpreadsheet className="h-6 w-6 text-green-500" />;
    }
    return <FileText className="h-6 w-6 text-blue-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-primary/20 bg-gradient-to-r from-card via-card to-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            AI Form Creator
            <Badge variant="outline" className="ml-2">
              <Sparkles className="h-3 w-3 mr-1" />
              AI-Powered
            </Badge>
          </CardTitle>
          <p className="text-muted-foreground">
            Upload documents, spreadsheets, or data files to automatically generate interactive forms
          </p>
        </CardHeader>
      </Card>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Upload Document</CardTitle>
          <p className="text-sm text-muted-foreground">
            Supported formats: {supportedFileTypes.join(', ')}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Drag and Drop Area */}
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200",
              dragActive 
                ? "border-primary bg-primary/5" 
                : "border-muted-foreground/25 hover:border-primary/50"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <div className="space-y-2">
              <p className="text-lg font-medium">
                {dragActive ? 'Drop your file here' : 'Drag and drop your file here'}
              </p>
              <p className="text-sm text-muted-foreground">
                or click to browse files
              </p>
            </div>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => fileInputRef.current?.click()}
            >
              <File className="h-4 w-4 mr-2" />
              Browse Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept={supportedFileTypes.join(',')}
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>

          {/* Selected File */}
          {uploadedFile && (
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  {getFileIcon(uploadedFile.name)}
                  <div className="flex-1">
                    <p className="font-medium">{uploadedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setUploadedFile(null)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Processing Progress */}
          {isProcessing && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 animate-spin text-primary" />
                <span className="text-sm font-medium">Processing document with AI...</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {/* Generate Button */}
          <Button
            onClick={generateFormFromFile}
            disabled={!uploadedFile || isProcessing}
            className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                Generating Form...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4 mr-2" />
                Generate Form with AI
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Forms */}
      {generatedForms.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Generated Forms ({generatedForms.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {generatedForms.map((form) => (
                  <Card key={form.id} className="bg-muted/30">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{form.title}</h4>
                            <Badge variant="outline" className="text-xs">
                              {form.fields.length} fields
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {form.description}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>Source: {form.sourceFile}</span>
                            <span>•</span>
                            <span>Created: {form.createdAt.toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => previewFormInModal(form)}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Preview
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => exportForm(form)}
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Export
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteForm(form.id)}
                            className="text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Form Preview Modal */}
      {previewForm && (
        <Card className="fixed inset-4 z-50 bg-background shadow-2xl border-primary/20">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle>{previewForm.title} - Preview</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPreviewForm(null)}
              >
                ✕
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <ScrollArea className="h-96">
              <div className="space-y-4">
                <p className="text-muted-foreground mb-6">{previewForm.description}</p>
                
                {previewForm.fields.map((field) => (
                  <div key={field.id} className="space-y-2">
                    <label className="text-sm font-medium">
                      {field.label}
                      {field.required && <span className="text-destructive ml-1">*</span>}
                    </label>
                    
                    {field.type === 'textarea' ? (
                      <Textarea placeholder={field.placeholder} disabled />
                    ) : field.type === 'select' ? (
                      <select className="w-full p-2 border rounded-md bg-background" disabled>
                        <option>{field.placeholder || 'Select an option...'}</option>
                        {field.options?.map((option, idx) => (
                          <option key={idx} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : field.type === 'radio' ? (
                      <div className="space-y-2">
                        {field.options?.map((option, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <input type="radio" name={field.id} disabled />
                            <span className="text-sm">{option}</span>
                          </div>
                        ))}
                      </div>
                    ) : field.type === 'checkbox' ? (
                      <div className="flex items-center gap-2">
                        <input type="checkbox" disabled />
                        <span className="text-sm">{field.placeholder}</span>
                      </div>
                    ) : (
                      <Input 
                        type={field.type} 
                        placeholder={field.placeholder}
                        disabled
                      />
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Background overlay for modal */}
      {previewForm && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setPreviewForm(null)}
        />
      )}
    </div>
  );
};