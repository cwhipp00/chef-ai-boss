import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  CheckCircle, 
  Clock, 
  BookOpen,
  Loader2,
  Play,
  AlertCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { toastCourses } from '@/scripts/generateToastCourses';

export const ToastCourseGenerator: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentCourse, setCurrentCourse] = useState<string | null>(null);
  const [completedCourses, setCompletedCourses] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const generateAllCourses = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    setProgress(0);
    setCompletedCourses([]);
    setErrors([]);
    
    const totalCourses = toastCourses.length;
    
    for (let i = 0; i < totalCourses; i++) {
      const course = toastCourses[i];
      setCurrentCourse(course.title);
      setProgress((i / totalCourses) * 100);
      
      try {
        console.log(`Generating content for: ${course.title}`);
        
        const { data, error } = await supabase.functions.invoke('ai-course-creator', {
          body: {
            prompt: course.prompt,
            contentType: 'course',
            difficulty: course.difficulty,
            duration: course.duration,
            category: 'pos-toast',
            existingContent: {
              title: course.title,
              instructor: course.instructor,
              description: course.description
            }
          }
        });

        if (error) {
          console.error(`Error generating content for ${course.title}:`, error);
          setErrors(prev => [...prev, `${course.title}: ${error.message}`]);
          continue;
        }

        if (data?.content?.lessons) {
          // Save lessons to database
          const lessonsWithCourseId = data.content.lessons.map((lesson: any) => ({
            ...lesson,
            course_id: course.id
          }));

          const { error: lessonsError } = await supabase
            .from('lessons')
            .insert(lessonsWithCourseId);

          if (lessonsError) {
            console.error(`Error saving lessons for ${course.title}:`, lessonsError);
            setErrors(prev => [...prev, `${course.title}: Database error - ${lessonsError.message}`]);
          } else {
            console.log(`✅ Successfully created ${data.content.lessons.length} lessons for ${course.title}`);
            setCompletedCourses(prev => [...prev, course.id]);
            toast.success(`Generated ${data.content.lessons.length} lessons for ${course.title}`);
          }
        } else {
          setErrors(prev => [...prev, `${course.title}: No lessons generated`]);
        }

      } catch (error: any) {
        console.error(`Error processing ${course.title}:`, error);
        setErrors(prev => [...prev, `${course.title}: ${error.message}`]);
      }
      
      // Small delay to prevent overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    setProgress(100);
    setCurrentCourse(null);
    setIsGenerating(false);
    
    const successCount = completedCourses.length;
    const errorCount = errors.length;
    
    if (successCount > 0) {
      toast.success(`Successfully generated course materials for ${successCount} Toast courses!`);
    }
    
    if (errorCount > 0) {
      toast.error(`${errorCount} courses had errors during generation`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-orange-500/20 via-orange-500/10 to-transparent">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Toast Course Material Generator</h1>
              <p className="text-muted-foreground">Generate comprehensive lessons for all Toast training courses</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Section */}
      {isGenerating && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Generating Course Materials</span>
                <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-3" />
              {currentCourse && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Currently generating: {currentCourse}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Course List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Toast Training Courses ({toastCourses.length})</CardTitle>
            <Button 
              onClick={generateAllCourses}
              disabled={isGenerating}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Generate All Course Materials
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {toastCourses.map((course) => {
            const isCompleted = completedCourses.includes(course.id);
            const hasError = errors.some(error => error.startsWith(course.title));
            const isCurrent = currentCourse === course.title;
            
            return (
              <div 
                key={course.id} 
                className={`p-4 rounded-lg border transition-all ${
                  isCurrent ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/10' :
                  isCompleted ? 'border-green-500 bg-green-50 dark:bg-green-900/10' :
                  hasError ? 'border-red-500 bg-red-50 dark:bg-red-900/10' :
                  'border-border'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{course.title}</h3>
                      <Badge className={`text-xs ${
                        course.difficulty === 'beginner' ? 'bg-green-500/10 text-green-600' :
                        course.difficulty === 'intermediate' ? 'bg-yellow-500/10 text-yellow-600' :
                        'bg-red-500/10 text-red-600'
                      }`}>
                        {course.difficulty}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">{course.description}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {course.duration}h
                      </span>
                      <span>Instructor: {course.instructor}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {isCurrent && (
                      <div className="flex items-center gap-1 text-orange-600">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-xs">Generating...</span>
                      </div>
                    )}
                    
                    {isCompleted && (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-xs">Complete</span>
                      </div>
                    )}
                    
                    {hasError && (
                      <div className="flex items-center gap-1 text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-xs">Error</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Errors Section */}
      {errors.length > 0 && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Generation Errors ({errors.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {errors.map((error, index) => (
                <div key={index} className="text-sm text-red-600 bg-red-50 dark:bg-red-900/10 p-2 rounded">
                  {error}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      {!isGenerating && (completedCourses.length > 0 || errors.length > 0) && (
        <Card className="bg-muted/50">
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">{completedCourses.length}</div>
                <div className="text-sm text-muted-foreground">Courses Generated</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{errors.length}</div>
                <div className="text-sm text-muted-foreground">Errors</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{toastCourses.length}</div>
                <div className="text-sm text-muted-foreground">Total Courses</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};