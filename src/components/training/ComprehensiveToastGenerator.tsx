import React, { useState, useEffect } from 'react';
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
  AlertCircle,
  Users,
  Star,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor_name: string;
  difficulty_level: string;
  duration_hours: number;
  category: string;
  tags: string[];
  is_featured: boolean;
  lesson_count: number;
}

export const ComprehensiveToastGenerator: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentCourse, setCurrentCourse] = useState<string | null>(null);
  const [completedCourses, setCompletedCourses] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchToastCourses();
  }, []);

  const fetchToastCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          lesson_count:lessons(count)
        `)
        .eq('category', 'pos-toast')
        .order('is_featured', { ascending: false });

      if (error) throw error;

      // Filter courses that have no lessons
      const coursesWithoutLessons = data?.filter(course => {
        const lessonCount = course.lesson_count?.[0]?.count || 0;
        return lessonCount === 0;
      }).map(course => ({
        ...course,
        lesson_count: course.lesson_count?.[0]?.count || 0
      })) || [];

      setCourses(coursesWithoutLessons);
      console.log(`Found ${coursesWithoutLessons.length} Toast courses without lessons`);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to load Toast courses');
    } finally {
      setLoading(false);
    }
  };

  const generateCoursePrompt = (course: Course) => {
    const prompts = {
      'Toast Inventory Management': 'Create a comprehensive 4-hour intermediate course on Toast Inventory Management. Cover inventory tracking setup, stock level monitoring, low inventory alerts, vendor management integration, cost control strategies, waste tracking and reduction, recipe costing analysis, purchase order management, inventory reports and analytics, and integration with Toast POS. Include hands-on exercises for setting up inventory items, configuring alerts, managing vendors, and analyzing inventory performance.',
      
      'Toast Hardware & Terminal Management': 'Create a comprehensive 3-hour intermediate course on Toast Hardware & Terminal Management. Cover terminal setup and configuration, printer setup and troubleshooting, network configuration, hardware maintenance, device management, troubleshooting common hardware issues, receipt and label printer management, barcode scanner integration, and system diagnostics. Include practical exercises for setting up terminals, configuring printers, and resolving hardware problems.',
      
      'Toast Security & Compliance': 'Create a comprehensive 2-hour advanced course on Toast Security & Compliance. Cover PCI DSS compliance requirements, data security best practices, user permission management, audit trail monitoring, payment security, data encryption, breach prevention strategies, compliance reporting, security policy implementation, and regulatory requirements. Include practical exercises for setting up secure user permissions, monitoring audit trails, and ensuring compliance.',
      
      'Toast Mobile Solutions': 'Create a comprehensive 3-hour intermediate course on Toast Mobile Solutions. Cover Toast Go mobile POS setup, staff mobile app features, mobile ordering configuration, remote management capabilities, offline functionality, mobile payment processing, tablet and smartphone setup, mobile reporting, and troubleshooting mobile issues. Include hands-on exercises for configuring mobile POS, setting up mobile ordering, and managing remote operations.',
      
      'Toast Advanced Reporting & Business Intelligence': 'Create a comprehensive 4-hour advanced course on Toast Advanced Reporting & Business Intelligence. Cover custom report creation, data visualization, business intelligence dashboards, trend analysis, forecasting, advanced analytics, data export capabilities, automated reporting, performance metrics, and decision-making insights. Include practical exercises for creating custom reports, building dashboards, and analyzing business performance.',
      
      'Toast Gift Cards & Promotions': 'Create a comprehensive 2-hour intermediate course on Toast Gift Cards & Promotions. Cover gift card program setup, promotional campaign creation, discount management, loyalty program integration, marketing automation, customer engagement strategies, promotion tracking, and performance analysis. Include hands-on exercises for setting up gift cards, creating promotions, and analyzing campaign effectiveness.',
      
      'Toast Customer Data & CRM': 'Create a comprehensive 3-hour intermediate course on Toast Customer Data & CRM. Cover customer profile creation, dining pattern analysis, customer segmentation, retention strategies, personalization techniques, customer communication, data privacy compliance, CRM integration, and customer lifetime value analysis. Include practical exercises for building customer profiles, creating segments, and developing retention campaigns.',
      
      'Toast for Quick Service Restaurants': 'Create a comprehensive 3-hour intermediate course on Toast for Quick Service Restaurants. Cover QSR-specific workflows, speed optimization techniques, drive-thru management, order accuracy improvement, kitchen display optimization, mobile ordering for QSR, efficiency metrics, and customer flow management. Include hands-on exercises for optimizing QSR operations, setting up drive-thru systems, and improving service speed.',
      
      'Toast for Bars & Nightlife': 'Create a comprehensive 3-hour intermediate course on Toast for Bars & Nightlife. Cover bar-specific features, age verification setup, complex cocktail modifiers, tab management, bottle service, event management, late-night operations, inventory for bars, and nightlife-specific reporting. Include practical exercises for setting up bar operations, managing tabs, and optimizing nightlife service.',
      
      'Toast Troubleshooting & System Maintenance': 'Create a comprehensive 2-hour advanced course on Toast Troubleshooting & System Maintenance. Cover diagnostic tools, common issue resolution, system optimization, performance monitoring, support escalation procedures, maintenance schedules, backup procedures, and preventive measures. Include hands-on exercises for diagnosing problems, optimizing performance, and implementing maintenance procedures.'
    };

    return prompts[course.title as keyof typeof prompts] || 
           `Create a comprehensive ${course.duration_hours}-hour ${course.difficulty_level} course on ${course.title}. ${course.description} Include practical exercises, real-world scenarios, and hands-on training materials.`;
  };

  const generateAllCourses = async () => {
    if (isGenerating || courses.length === 0) return;
    
    setIsGenerating(true);
    setProgress(0);
    setCompletedCourses([]);
    setErrors([]);
    
    const totalCourses = courses.length;
    console.log(`Starting generation for ${totalCourses} Toast courses`);
    
    for (let i = 0; i < totalCourses; i++) {
      const course = courses[i];
      setCurrentCourse(course.title);
      setProgress((i / totalCourses) * 100);
      
      try {
        console.log(`Generating content for: ${course.title}`);
        
        const { data, error } = await supabase.functions.invoke('ai-course-creator', {
          body: {
            prompt: generateCoursePrompt(course),
            contentType: 'course',
            difficulty: course.difficulty_level,
            duration: course.duration_hours,
            category: 'pos-toast',
            existingContent: {
              title: course.title,
              instructor: course.instructor_name,
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
      await new Promise(resolve => setTimeout(resolve, 2000));
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

    // Refresh the course list
    setTimeout(fetchToastCourses, 1000);
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'intermediate': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'advanced': return 'bg-red-500/10 text-red-600 border-red-500/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  if (loading) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-12 text-center">
          <RefreshCw className="w-12 h-12 mx-auto mb-4 animate-spin text-primary" />
          <h3 className="text-lg font-semibold mb-2">Loading Toast Courses</h3>
          <p className="text-muted-foreground">Fetching all Toast courses that need content...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-orange-500/20 via-orange-500/10 to-transparent">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Complete Toast Training Ecosystem</h1>
              <p className="text-muted-foreground">Generate comprehensive lessons for all Toast courses</p>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{courses.length}</div>
              <div className="text-sm text-muted-foreground">Courses Ready</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{completedCourses.length}</div>
              <div className="text-sm text-muted-foreground">Generated</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{errors.length}</div>
              <div className="text-sm text-muted-foreground">Errors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {courses.reduce((acc, course) => acc + course.duration_hours, 0)}h
              </div>
              <div className="text-sm text-muted-foreground">Total Content</div>
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
                <span className="font-medium">Generating Complete Toast Training Materials</span>
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

      {/* Action Button */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Toast Training Courses Without Content ({courses.length})</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Generate comprehensive lessons with videos, tutorials, quizzes, and hands-on exercises
              </p>
            </div>
            <Button 
              onClick={generateAllCourses}
              disabled={isGenerating || courses.length === 0}
              className="bg-orange-600 hover:bg-orange-700 px-6"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Generate All {courses.length} Courses
                </>
              )}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Course List */}
      {courses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => {
            const isCompleted = completedCourses.includes(course.id);
            const hasError = errors.some(error => error.startsWith(course.title));
            const isCurrent = currentCourse === course.title;
            
            return (
              <Card 
                key={course.id} 
                className={`transition-all ${
                  isCurrent ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/10' :
                  isCompleted ? 'border-green-500 bg-green-50 dark:bg-green-900/10' :
                  hasError ? 'border-red-500 bg-red-50 dark:bg-red-900/10' :
                  course.is_featured ? 'border-primary bg-primary/5' : 'border-border'
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {course.is_featured && (
                        <Badge className="bg-gradient-primary text-white">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                      <Badge className={getDifficultyColor(course.difficulty_level)}>
                        {course.difficulty_level}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {isCurrent && (
                        <div className="flex items-center gap-1 text-orange-600">
                          <Loader2 className="w-4 h-4 animate-spin" />
                        </div>
                      )}
                      
                      {isCompleted && (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                        </div>
                      )}
                      
                      {hasError && (
                        <div className="flex items-center gap-1 text-red-600">
                          <AlertCircle className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {course.duration_hours}h
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {course.instructor_name}
                    </span>
                  </div>

                  {course.tags && course.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {course.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs px-2 py-0.5">
                          {tag}
                        </Badge>
                      ))}
                      {course.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs px-2 py-0.5">
                          +{course.tags.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* No Courses Message */}
      {courses.length === 0 && !loading && (
        <Card>
          <CardContent className="p-12 text-center">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
            <h3 className="text-xl font-semibold mb-2">All Toast Courses Have Content!</h3>
            <p className="text-muted-foreground">
              Every Toast training course now has comprehensive lesson materials.
            </p>
          </CardContent>
        </Card>
      )}

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
    </div>
  );
};