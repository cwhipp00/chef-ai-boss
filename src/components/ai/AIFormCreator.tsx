import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Sparkles, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface AIFormCreatorProps {
  organizationId: string;
  onFormCreated?: () => void;
}

const FORM_CATEGORIES = [
  'checklist',
  'inspection',
  'training',
  'inventory',
  'safety',
  'maintenance',
  'customer_feedback',
  'incident_report',
  'employee',
  'other'
];

export function AIFormCreator({ organizationId, onFormCreated }: AIFormCreatorProps) {
  const [prompt, setPrompt] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastCreatedForm, setLastCreatedForm] = useState<any>(null);
  const { toast } = useToast();

  const handleGenerateForm = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Missing Information",
        description: "Please describe what kind of form you need",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      
      const { data, error } = await supabase.functions.invoke('ai-form-generator', {
        body: {
          prompt: prompt.trim(),
          organizationId,
          category: category || 'other'
        }
      });

      if (error) throw error;

      if (data.success) {
        setLastCreatedForm(data.form);
        toast({
          title: "Form Created Successfully!",
          description: data.message,
        });
        
        setPrompt('');
        setCategory('');
        onFormCreated?.();
      } else {
        throw new Error(data.error || 'Failed to generate form');
      }

    } catch (error) {
      console.error('Error generating form:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Could not generate form",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const suggestionPrompts = [
    "Daily kitchen cleaning checklist",
    "New employee onboarding form",
    "Customer feedback survey",
    "Equipment maintenance log",
    "Food safety temperature check",
    "Inventory count sheet",
    "Incident report form",
    "Health inspection checklist"
  ];

  return (
    <div className="space-y-6">
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Form Generator
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            Describe what kind of form you need, and AI will create it instantly
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prompt">What kind of form do you need?</Label>
            <Textarea
              id="prompt"
              placeholder="Example: Create a daily opening checklist for kitchen staff that includes equipment checks, temperature logs, and sanitation tasks..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              className="min-h-24"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category (optional)</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {FORM_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleGenerateForm}
            disabled={loading || !prompt.trim()}
            className="w-full bg-gradient-primary"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating Form...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Form with AI
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {lastCreatedForm && (
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-5 w-5" />
              Form Created Successfully
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <strong>Name:</strong> {lastCreatedForm.name}
                <Badge variant="secondary">{lastCreatedForm.category}</Badge>
              </div>
              <div>
                <strong>Fields:</strong> {lastCreatedForm.form_schema?.fields?.length || 0} fields
              </div>
              <p className="text-sm text-muted-foreground">
                {lastCreatedForm.form_schema?.description}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Suggestions</CardTitle>
          <p className="text-muted-foreground text-sm">
            Click any suggestion to use it as a starting point
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {suggestionPrompts.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setPrompt(suggestion)}
                className="justify-start text-left h-auto py-2 px-3"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}