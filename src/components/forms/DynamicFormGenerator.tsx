import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Save, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  Plus,
  FileText,
  CheckCircle,
  FormInput
} from 'lucide-react';

interface FormField {
  name: string;
  type: 'text' | 'number' | 'select' | 'checkbox' | 'textarea' | 'date';
  label: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
  defaultValue?: any;
}

interface FormSchema {
  title: string;
  description?: string;
  fields: FormField[];
}

interface DynamicForm {
  id: string;
  name: string;
  category: string;
  form_schema: FormSchema;
  created_at: string;
  submissions_count?: number;
}

interface DynamicFormGeneratorProps {
  organizationId: string;
  category?: string;
}

export function DynamicFormGenerator({ organizationId, category }: DynamicFormGeneratorProps) {
  const [forms, setForms] = useState<DynamicForm[]>([]);
  const [selectedForm, setSelectedForm] = useState<DynamicForm | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadForms();
  }, [organizationId, category]);

  const loadForms = async () => {
    try {
      let query = supabase
        .from('dynamic_forms')
        .select(`
          *,
          form_submissions(count)
        `)
        .eq('organization_id', organizationId);

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;
      
      if (error) throw error;

      const formsWithCounts = data?.map((form: any) => ({
        ...form,
        form_schema: typeof form.form_schema === 'string' ? JSON.parse(form.form_schema) : form.form_schema,
        submissions_count: form.form_submissions?.[0]?.count || 0
      })) || [];

      setForms(formsWithCounts);
    } catch (error) {
      console.error('Error loading forms:', error);
      toast({
        title: "Error Loading Forms",
        description: "Could not load dynamic forms",
        variant: "destructive"
      });
    }
  };

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const submitForm = async (form: DynamicForm) => {
    try {
      setLoading(true);
      
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('form_submissions')
        .insert({
          form_id: form.id,
          submitted_data: formData,
          submitted_by: user.user.id
        });

      if (error) throw error;

      toast({
        title: "Form Submitted",
        description: `Your ${form.name} submission has been recorded`,
      });

      setFormData({});
      setSelectedForm(null);
      loadForms(); // Refresh to update submission counts

    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteForm = async (formId: string) => {
    try {
      const { error } = await supabase
        .from('dynamic_forms')
        .delete()
        .eq('id', formId);

      if (error) throw error;

      toast({
        title: "Form Deleted",
        description: "The form has been removed successfully",
      });

      loadForms();
    } catch (error) {
      console.error('Error deleting form:', error);
      toast({
        title: "Delete Failed",
        description: "Could not delete the form",
        variant: "destructive"
      });
    }
  };

  const renderFormField = (field: FormField) => {
    const value = formData[field.name] || field.defaultValue || '';

    switch (field.type) {
      case 'text':
        return (
          <Input
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => handleFieldChange(field.name, parseFloat(e.target.value) || 0)}
            placeholder={field.placeholder}
            required={field.required}
          />
        );

      case 'textarea':
        return (
          <Textarea
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            rows={3}
          />
        );

      case 'select':
        return (
          <Select
            value={value}
            onValueChange={(val) => handleFieldChange(field.name, val)}
            required={field.required}
          >
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={value || false}
              onCheckedChange={(checked) => handleFieldChange(field.name, checked)}
            />
            <Label htmlFor={field.name} className="text-sm">
              {field.label}
            </Label>
          </div>
        );

      case 'date':
        return (
          <Input
            type="date"
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            required={field.required}
          />
        );

      default:
        return null;
    }
  };

  const exportFormData = async (form: DynamicForm) => {
    try {
      const { data, error } = await supabase
        .from('form_submissions')
        .select('*')
        .eq('form_id', form.id);

      if (error) throw error;

      // Convert to CSV format
      const headers = form.form_schema.fields.map(field => field.label).join(',');
      const rows = data?.map(submission => 
        form.form_schema.fields.map(field => 
          submission.submitted_data[field.name] || ''
        ).join(',')
      ).join('\n');

      const csv = `${headers}\n${rows}`;
      
      // Download CSV file
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${form.name.replace(/\s+/g, '_')}_submissions.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Export Complete",
        description: "Form submissions have been exported to CSV",
      });

    } catch (error) {
      console.error('Error exporting form data:', error);
      toast({
        title: "Export Failed",
        description: "Could not export form data",
        variant: "destructive"
      });
    }
  };

  if (selectedForm) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FormInput className="h-5 w-5" />
              {selectedForm.form_schema.title}
            </CardTitle>
            <Button variant="outline" onClick={() => setSelectedForm(null)}>
              Back to Forms
            </Button>
          </div>
          {selectedForm.form_schema.description && (
            <p className="text-muted-foreground text-sm">
              {selectedForm.form_schema.description}
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedForm.form_schema.fields.map((field, index) => (
            <div key={index} className="space-y-2">
              {field.type !== 'checkbox' && (
                <Label htmlFor={field.name} className="text-sm font-medium">
                  {field.label}
                  {field.required && <span className="text-destructive ml-1">*</span>}
                </Label>
              )}
              {renderFormField(field)}
            </div>
          ))}
          
          <div className="flex gap-2 pt-4">
            <Button 
              onClick={() => submitForm(selectedForm)}
              disabled={loading}
              className="bg-gradient-primary"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Submitting...' : 'Submit Form'}
            </Button>
            <Button variant="outline" onClick={() => setFormData({})}>
              Clear Form
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Dynamic Forms</h2>
          <p className="text-muted-foreground">
            AI-generated forms from your company documents
          </p>
        </div>
      </div>

      {/* Forms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {forms.map((form) => (
          <Card key={form.id} className="hover-lift transition-all cursor-pointer group">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  {form.name}
                </CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {form.category}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{form.form_schema.fields.length} fields</span>
                <span>{form.submissions_count || 0} submissions</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={() => setSelectedForm(form)}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Fill Form
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => exportFormData(form)}
                  disabled={!form.submissions_count}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => deleteForm(form.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {forms.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FormInput className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Forms Generated Yet</h3>
            <p className="text-muted-foreground mb-4">
              Upload company documents to automatically generate forms with AI
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}