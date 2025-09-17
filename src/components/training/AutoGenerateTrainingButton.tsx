import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Sparkles, 
  BookOpen, 
  Download, 
  CheckCircle,
  AlertTriangle,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Course {
  id: string;
  title: string;
  category: string;
  lesson_count?: [{ count: number }];
}

interface AutoGenerateTrainingButtonProps {
  course: Course;
  onLessonsGenerated?: () => void;
}

export const AutoGenerateTrainingButton = ({ course, onLessonsGenerated }: AutoGenerateTrainingButtonProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<'idle' | 'generating' | 'success' | 'error'>('idle');
  const [lessonsGenerated, setLessonsGenerated] = useState(0);

  const hasLessons = course.lesson_count && course.lesson_count[0]?.count > 0;

  const generateTrainingContent = async () => {
    setIsGenerating(true);
    setGenerationStatus('generating');
    
    try {
      toast.info('Generating live training content...', {
        description: 'Fetching real Toast POS materials from the internet'
      });

      const { data, error } = await supabase.functions.invoke('generate-toast-training-content', {
        body: {
          courseId: course.id,
          courseName: course.title
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.success) {
        setLessonsGenerated(data.lessonsGenerated);
        setGenerationStatus('success');
        
        toast.success('Training content generated!', {
          description: `Created ${data.lessonsGenerated} lessons with real Toast POS content`
        });
        
        // Trigger refresh of course data
        if (onLessonsGenerated) {
          onLessonsGenerated();
        }
      } else {
        throw new Error(data?.error || 'Failed to generate content');
      }

    } catch (error) {
      console.error('Error generating training content:', error);
      setGenerationStatus('error');
      
      toast.error('Failed to generate training content', {
        description: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const regenerateContent = async () => {
    // First, delete existing lessons
    try {
      await supabase
        .from('lessons')
        .delete()
        .eq('course_id', course.id);
      
      // Then generate new content
      await generateTrainingContent();
    } catch (error) {
      console.error('Error regenerating content:', error);
      toast.error('Failed to regenerate content');
    }
  };

  if (hasLessons && generationStatus !== 'success') {
    return (
      <Card className="border-success/20 bg-success/5">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-success" />
              <div>
                <p className="font-medium text-success">Content Available</p>
                <p className="text-sm text-muted-foreground">
                  {course.lesson_count?.[0]?.count} lessons ready
                </p>
              </div>
            </div>
            <Button 
              onClick={regenerateContent}
              variant="outline"
              size="sm"
              disabled={isGenerating}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Regenerate
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Generate Live Training Content
          </CardTitle>
          <Badge variant="outline" className="bg-primary/10">
            AI-Powered
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          <p className="mb-2">
            This course needs training content. We can automatically generate comprehensive lessons using:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Real Toast POS documentation and guides</li>
            <li>Industry best practices and workflows</li>
            <li>Interactive exercises and assessments</li>
            <li>Step-by-step tutorials with screenshots</li>
            <li>Current Toast feature updates and changes</li>
          </ul>
        </div>

        {generationStatus === 'generating' && (
          <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="font-medium text-primary">Generating Content...</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Fetching latest Toast POS training materials and creating interactive lessons
            </p>
          </div>
        )}

        {generationStatus === 'success' && (
          <div className="p-3 bg-success/10 rounded-lg border border-success/20">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-success" />
              <span className="font-medium text-success">Content Generated!</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Created {lessonsGenerated} comprehensive lessons with real Toast POS content
            </p>
          </div>
        )}

        {generationStatus === 'error' && (
          <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/20">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span className="font-medium text-destructive">Generation Failed</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Unable to generate training content. Please try again or contact support.
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <Button 
            onClick={generateTrainingContent}
            disabled={isGenerating}
            className="flex-1 bg-gradient-primary hover:opacity-90"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Generate Training Content
              </>
            )}
          </Button>
          
          {generationStatus === 'success' && (
            <Button variant="outline" asChild>
              <a href={`/training?course=${course.id}`}>
                <BookOpen className="h-4 w-4 mr-2" />
                View Lessons
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};