import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Wand2, 
  BookOpen, 
  Clock, 
  ChefHat,
  Lightbulb,
  Target,
  Zap,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AICourseCreatorProps {
  onCourseCreated?: (course: any) => void;
}

export const AICourseCreator: React.FC<AICourseCreatorProps> = ({ onCourseCreated }) => {
  const [prompt, setPrompt] = useState('');
  const [contentType, setContentType] = useState<'course' | 'lesson'>('course');
  const [difficulty, setDifficulty] = useState('');
  const [duration, setDuration] = useState('');
  const [category, setCategory] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [progress, setProgress] = useState(0);

  const quickPrompts = [
    "Create a complete food safety course covering HACCP principles, temperature control, and sanitation",
    "Design a POS system training course for new restaurant staff",
    "Build a knife skills course with proper techniques and safety",
    "Create a customer service excellence course for restaurant staff",
    "Design a wine pairing course for servers and bartenders",
    "Build a cost control and inventory management course for managers"
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please provide a description for the course content');
      return;
    }

    setIsGenerating(true);
    setProgress(10);

    try {
      setProgress(30);
      
      const { data, error } = await supabase.functions.invoke('ai-course-creator', {
        body: {
          prompt,
          contentType,
          difficulty: difficulty || 'intermediate',
          duration: parseInt(duration) || 4,
          category: category || 'culinary-arts'
        }
      });

      setProgress(60);

      if (error) throw error;

      setProgress(80);

      if (data.content) {
        setGeneratedContent(data.content);
        setProgress(100);
        toast.success(`${contentType === 'course' ? 'Course' : 'Lesson'} generated successfully!`);
      } else {
        throw new Error('No content generated');
      }

    } catch (error) {
      console.error('Error generating content:', error);
      toast.error('Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const handleSaveToDB = async () => {
    if (!generatedContent) return;

    try {
      if (contentType === 'course' && generatedContent.course) {
        // Save course
        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .insert(generatedContent.course)
          .select()
          .single();

        if (courseError) throw courseError;

        // Save lessons
        if (generatedContent.lessons && courseData) {
          const lessonsWithCourseId = generatedContent.lessons.map((lesson: any) => ({
            ...lesson,
            course_id: courseData.id
          }));

          const { error: lessonsError } = await supabase
            .from('lessons')
            .insert(lessonsWithCourseId);

          if (lessonsError) throw lessonsError;
        }

        toast.success('Course and lessons saved successfully!');
        onCourseCreated?.(courseData);
        
      } else if (contentType === 'lesson' && generatedContent.lesson) {
        // For standalone lessons, user would need to specify course_id
        toast.info('Please select a course to add this lesson to');
      }

      setGeneratedContent(null);
      setPrompt('');
      
    } catch (error) {
      console.error('Error saving to database:', error);
      toast.error('Failed to save content to database');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-primary/20 via-primary/10 to-transparent">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">AI Course Creator</h1>
              <p className="text-muted-foreground">Generate complete courses and lessons with AI</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="w-5 h-5" />
              Content Generator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Content Type</label>
              <Select value={contentType} onValueChange={(value: 'course' | 'lesson') => setContentType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="course">Complete Course</SelectItem>
                  <SelectItem value="lesson">Single Lesson</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Difficulty</label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Duration (hours)</label>
                <Input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="4"
                  min="1"
                  max="20"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="culinary-arts">Culinary Arts</SelectItem>
                  <SelectItem value="pos-systems">POS Systems</SelectItem>
                  <SelectItem value="safety-compliance">Safety & Compliance</SelectItem>
                  <SelectItem value="management">Management</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Course Description</label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the course content, learning objectives, and specific topics to cover..."
                rows={4}
                className="min-h-[100px]"
              />
            </div>

            {progress > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Generating content...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating || !prompt.trim()}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Generate {contentType === 'course' ? 'Course' : 'Lesson'}
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Quick Prompts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Quick Start Ideas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickPrompts.map((promptText, index) => (
              <button
                key={index}
                onClick={() => setPrompt(promptText)}
                className="w-full text-left p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="text-sm">{promptText}</div>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Generated Content Preview */}
      {generatedContent && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Generated Content Preview
              </CardTitle>
              <Button onClick={handleSaveToDB} className="bg-green-600 hover:bg-green-700">
                <BookOpen className="w-4 h-4 mr-2" />
                Save to ChefAI University
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {contentType === 'course' && generatedContent.course && (
              <div>
                <h3 className="text-xl font-bold mb-2">{generatedContent.course.title}</h3>
                <p className="text-muted-foreground mb-4">{generatedContent.course.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge>{generatedContent.course.difficulty_level}</Badge>
                  <Badge variant="outline">{generatedContent.course.category}</Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {generatedContent.course.duration_hours}h
                  </Badge>
                </div>

                {generatedContent.course.tags && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {generatedContent.course.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {generatedContent.lessons && (
                  <div>
                    <h4 className="font-semibold mb-2">Lessons ({generatedContent.lessons.length})</h4>
                    <div className="space-y-2">
                      {generatedContent.lessons.map((lesson: any, index: number) => (
                        <div key={index} className="p-3 rounded-lg border">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">{lesson.title}</div>
                              <div className="text-sm text-muted-foreground">{lesson.description}</div>
                            </div>
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {lesson.duration_minutes}min
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {contentType === 'lesson' && generatedContent.lesson && (
              <div>
                <h3 className="text-xl font-bold mb-2">{generatedContent.lesson.title}</h3>
                <p className="text-muted-foreground mb-4">{generatedContent.lesson.description}</p>
                
                <Badge variant="outline" className="flex items-center gap-1 w-fit mb-4">
                  <Clock className="w-3 h-3" />
                  {generatedContent.lesson.duration_minutes} minutes
                </Badge>

                {generatedContent.lesson.content && (
                  <div className="space-y-3">
                    {generatedContent.lesson.content.key_points && (
                      <div>
                        <div className="font-medium mb-1">Key Points:</div>
                        <ul className="text-sm list-disc list-inside space-y-1">
                          {generatedContent.lesson.content.key_points.map((point: string, index: number) => (
                            <li key={index}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};