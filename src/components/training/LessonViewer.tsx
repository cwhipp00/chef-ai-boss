import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Play, 
  Pause, 
  CheckCircle, 
  Clock, 
  BookOpen, 
  FileText, 
  HelpCircle,
  ExternalLink,
  Lightbulb,
  ChefHat,
  Target,
  Award,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import AITrainingCoach from './AITrainingCoach';
import AIAssessment from './AIAssessment';
import { AutoGenerateTrainingButton } from './AutoGenerateTrainingButton';

interface Lesson {
  id: string;
  title: string;
  description: string;
  content: any;
  order_index: number;
  duration_minutes: number;
  course_id: string;
}

interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed_at?: string;
  score?: number;
  time_spent_minutes?: number;
}

interface LessonViewerProps {
  courseId: string;
  courseTitle: string;
  onBack: () => void;
}

export const LessonViewer: React.FC<LessonViewerProps> = ({ courseId, courseTitle, onBack }) => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [lessonProgress, setLessonProgress] = useState<LessonProgress[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: number }>({});
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAICoach, setShowAICoach] = useState(false);
  const [showAIAssessment, setShowAIAssessment] = useState(false);
  const [coachMinimized, setCoachMinimized] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchLessons();
    if (user) {
      fetchLessonProgress();
    }
  }, [courseId, user]);

  const fetchLessons = async () => {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index');
      
      if (error) throw error;
      setLessons(data || []);
    } catch (error) {
      console.error('Error fetching lessons:', error);
      toast.error('Failed to load lessons');
    } finally {
      setLoading(false);
    }
  };

  const fetchLessonProgress = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      setLessonProgress(data || []);
    } catch (error) {
      console.error('Error fetching lesson progress:', error);
    }
  };

  const markLessonComplete = async (lessonId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('lesson_progress')
        .upsert({
          user_id: user.id,
          lesson_id: lessonId,
          completed_at: new Date().toISOString(),
          time_spent_minutes: lessons[currentLessonIndex]?.duration_minutes || 0
        });
      
      if (error) throw error;
      
      toast.success('Lesson completed!');
      fetchLessonProgress();
    } catch (error) {
      console.error('Error marking lesson complete:', error);
      toast.error('Failed to mark lesson complete');
    }
  };

  const submitQuiz = async (lessonId: string, score: number) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('lesson_progress')
        .upsert({
          user_id: user.id,
          lesson_id: lessonId,
          completed_at: new Date().toISOString(),
          score: score,
          time_spent_minutes: lessons[currentLessonIndex]?.duration_minutes || 0
        });
      
      if (error) throw error;
      
      toast.success(`Quiz completed! Score: ${score}%`);
      fetchLessonProgress();
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.error('Failed to submit quiz');
    }
  };

  const isLessonCompleted = (lessonId: string) => {
    return lessonProgress.some(progress => 
      progress.lesson_id === lessonId && progress.completed_at
    );
  };

  const handleQuizSubmit = () => {
    const currentLesson = lessons[currentLessonIndex];
    if (!currentLesson?.content?.quiz) return;

    const quiz = currentLesson.content.quiz;
    let correctAnswers = 0;
    
    quiz.forEach((question: any, index: number) => {
      if (quizAnswers[index] === question.correct) {
        correctAnswers++;
      }
    });
    
    const score = Math.round((correctAnswers / quiz.length) * 100);
    setShowQuizResults(true);
    submitQuiz(currentLesson.id, score);
  };

  const getYouTubeEmbedUrl = (url: string) => {
    if (url.includes('embed')) return url;
    const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
    return `https://www.youtube.com/embed/${videoId}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (lessons.length === 0) {
    const courseForGeneration = {
      id: courseId,
      title: courseTitle,
      category: 'pos-toast' // Default category for Toast courses
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Courses
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div>
                <h1 className="text-2xl font-bold">{courseTitle}</h1>
                <p className="text-sm text-muted-foreground">No lessons available yet</p>
              </div>
            </div>
          </div>

          {/* Generate Training Content */}
          <AutoGenerateTrainingButton 
            course={courseForGeneration} 
            onLessonsGenerated={fetchLessons}
          />
        </div>
      </div>
    );
  }

  const currentLesson = lessons[currentLessonIndex];
  const completedCount = lessons.filter(lesson => isLessonCompleted(lesson.id)).length;
  const progressPercentage = (completedCount / lessons.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-6 py-4 mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Courses
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div>
                <h1 className="text-2xl font-bold">{courseTitle}</h1>
                <p className="text-sm text-muted-foreground">
                  Lesson {currentLessonIndex + 1} of {lessons.length}: {currentLesson.title}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Course Progress</div>
                <div className="flex items-center gap-2">
                  <Progress value={progressPercentage} className="w-24 h-2" />
                  <span className="text-sm font-medium">{Math.round(progressPercentage)}%</span>
                </div>
              </div>
              <Badge variant={isLessonCompleted(currentLesson.id) ? "default" : "secondary"}>
                {isLessonCompleted(currentLesson.id) ? "Completed" : "In Progress"}
              </Badge>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowAIAssessment(true)}
                  className="flex items-center gap-2"
                >
                  <Target className="w-4 h-4" />
                  AI Assessment
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCoachMinimized(false)}
                  className="flex items-center gap-2"
                >
                  <Lightbulb className="w-4 h-4" />
                  AI Coach
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Lesson Navigation Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-32">
              <CardHeader>
                <CardTitle className="text-lg">Course Lessons</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {lessons.map((lesson, index) => (
                  <button
                    key={lesson.id}
                    onClick={() => setCurrentLessonIndex(index)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      index === currentLessonIndex 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isLessonCompleted(lesson.id) ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-muted-foreground" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{lesson.title}</div>
                        <div className="text-xs opacity-75 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {lesson.duration_minutes}min
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Lesson Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Lesson Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-2xl">{currentLesson.title}</CardTitle>
                    <p className="text-muted-foreground">{currentLesson.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {currentLesson.duration_minutes} minutes
                      </span>
                      <span className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        Lesson {currentLessonIndex + 1} of {lessons.length}
                      </span>
                    </div>
                  </div>
                  
                  {!isLessonCompleted(currentLesson.id) && (
                    <Button 
                      onClick={() => markLessonComplete(currentLesson.id)}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Mark Complete
                    </Button>
                  )}
                </div>
              </CardHeader>
            </Card>

            {/* Video Player */}
            {currentLesson.content?.video_url && (
              <Card>
                <CardContent className="p-0">
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <iframe
                      src={getYouTubeEmbedUrl(currentLesson.content.video_url)}
                      title={currentLesson.title}
                      className="w-full h-full"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Lesson Content Tabs */}
            <Card>
              <Tabs defaultValue="overview" className="w-full">
                <CardHeader>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview" className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Overview
                    </TabsTrigger>
                    <TabsTrigger value="transcript" className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Transcript
                    </TabsTrigger>
                    <TabsTrigger value="resources" className="flex items-center gap-2">
                      <ExternalLink className="w-4 h-4" />
                      Resources
                    </TabsTrigger>
                    {(currentLesson.content?.quiz || 
                      (currentLesson.content?.sections && 
                       currentLesson.content.sections.some((s: any) => s.quiz && s.quiz.length > 0))) && (
                      <TabsTrigger value="quiz" className="flex items-center gap-2">
                        <HelpCircle className="w-4 h-4" />
                        Quiz
                      </TabsTrigger>
                    )}
                  </TabsList>
                </CardHeader>

                <CardContent>
                  <TabsContent value="overview" className="space-y-6">
                    {/* Display AI-Generated Sections */}
                    {currentLesson.content?.sections && (
                      <div className="space-y-6">
                        {currentLesson.content.sections.map((section: any, sectionIndex: number) => (
                          <div key={sectionIndex} className="space-y-4">
                            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                              <Target className="w-5 h-5 text-primary" />
                              {section.title}
                            </h3>
                            <div className="prose max-w-none">
                              <div className="p-4 bg-muted/50 rounded-lg text-sm leading-relaxed whitespace-pre-wrap">
                                {section.content}
                              </div>
                            </div>
                            
                            {/* Display section-specific quiz if exists */}
                            {section.quiz && section.quiz.length > 0 && (
                              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                                <h4 className="font-semibold mb-3">Quick Check</h4>
                                {section.quiz.map((question: any, qIndex: number) => (
                                  <div key={qIndex} className="mb-3">
                                    <p className="font-medium mb-2">{question.question}</p>
                                    <div className="space-y-1 text-sm">
                                      {question.options.map((option: string, oIndex: number) => (
                                        <div 
                                          key={oIndex} 
                                          className={`p-2 rounded ${
                                            oIndex === question.correct 
                                              ? 'bg-green-100 dark:bg-green-900/30 border-l-2 border-green-500' 
                                              : 'bg-gray-50 dark:bg-gray-800'
                                          }`}
                                        >
                                          {option} {oIndex === question.correct && '✓'}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Fallback for legacy content structure */}
                    {!currentLesson.content?.sections && (
                      <>
                        {/* Key Points */}
                        {currentLesson.content?.key_points && (
                          <div>
                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                              <Target className="w-5 h-5 text-primary" />
                              Key Learning Points
                            </h3>
                            <div className="grid gap-2">
                              {currentLesson.content.key_points.map((point: string, index: number) => (
                                <div key={index} className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                  <span>{point}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Practical Tips */}
                        {currentLesson.content?.practical_tips && (
                          <div>
                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                              <Lightbulb className="w-5 h-5 text-yellow-500" />
                              Practical Tips
                            </h3>
                            <div className="grid gap-2">
                              {currentLesson.content.practical_tips.map((tip: string, index: number) => (
                                <div key={index} className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-l-4 border-yellow-500">
                                  {tip}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {/* Practical Exercise - works for both structures */}
                    {currentLesson.content?.practical_exercise && (
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                          <Award className="w-5 h-5 text-blue-500" />
                          Practical Exercise
                        </h3>
                        <p>{currentLesson.content.practical_exercise}</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="transcript">
                    <div className="prose max-w-none">
                      <h3 className="text-lg font-semibold mb-4">Lesson Transcript</h3>
                      <div className="p-4 bg-muted/50 rounded-lg text-sm leading-relaxed">
                        {currentLesson.content?.transcript || "Transcript not available for this lesson."}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="resources">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Additional Resources</h3>
                      {currentLesson.content?.resources ? (
                        <div className="grid gap-3">
                          {currentLesson.content.resources.map((resource: any, index: number) => (
                            <Card key={index} className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-semibold">{resource.name}</h4>
                                  <p className="text-sm text-muted-foreground">External resource</p>
                                </div>
                                <Button variant="outline" size="sm" asChild>
                                  <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    Open
                                  </a>
                                </Button>
                              </div>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No additional resources available for this lesson.</p>
                      )}
                    </div>
                  </TabsContent>

                  {/* Updated quiz content to handle AI-generated structure */}
                  {(currentLesson.content?.quiz || 
                    (currentLesson.content?.sections && 
                     currentLesson.content.sections.some((s: any) => s.quiz && s.quiz.length > 0))) && (
                    <TabsContent value="quiz">
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">Knowledge Check</h3>
                          <Badge variant="outline">
                            {currentLesson.content?.quiz ? 
                              currentLesson.content.quiz.length : 
                              currentLesson.content.sections?.reduce((acc: number, s: any) => acc + (s.quiz?.length || 0), 0)
                            } Questions
                          </Badge>
                        </div>
                        
                        {!showQuizResults ? (
                          <div className="space-y-6">
                            {/* Handle root-level quiz (AI-generated) */}
                            {currentLesson.content?.quiz && currentLesson.content.quiz.map((question: any, questionIndex: number) => (
                              <Card key={questionIndex} className="p-4">
                                <h4 className="font-semibold mb-3">
                                  {questionIndex + 1}. {question.question}
                                </h4>
                                <div className="space-y-2">
                                  {question.options.map((option: string, optionIndex: number) => (
                                    <label
                                      key={optionIndex}
                                      className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-muted/50"
                                    >
                                      <input
                                        type="radio"
                                        name={`question-${questionIndex}`}
                                        value={optionIndex}
                                        onChange={() => setQuizAnswers(prev => ({
                                          ...prev,
                                          [questionIndex]: optionIndex
                                        }))}
                                        className="text-primary"
                                      />
                                      <span>{option}</span>
                                    </label>
                                  ))}
                                </div>
                              </Card>
                            ))}
                            
                            {/* Handle section-level quizzes (AI-generated) */}
                            {!currentLesson.content?.quiz && currentLesson.content?.sections && 
                             currentLesson.content.sections.map((section: any, sectionIndex: number) => 
                               section.quiz && section.quiz.map((question: any, questionIndex: number) => (
                                 <Card key={`${sectionIndex}-${questionIndex}`} className="p-4">
                                   <div className="text-sm text-muted-foreground mb-2">From section: {section.title}</div>
                                   <h4 className="font-semibold mb-3">
                                     Question {questionIndex + 1}: {question.question}
                                   </h4>
                                   <div className="space-y-2">
                                     {question.options.map((option: string, optionIndex: number) => (
                                       <label
                                         key={optionIndex}
                                         className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-muted/50"
                                       >
                                         <input
                                           type="radio"
                                           name={`question-${sectionIndex}-${questionIndex}`}
                                           value={optionIndex}
                                           onChange={() => setQuizAnswers(prev => ({
                                             ...prev,
                                             [`${sectionIndex}-${questionIndex}`]: optionIndex
                                           }))}
                                           className="text-primary"
                                         />
                                         <span>{option}</span>
                                       </label>
                                     ))}
                                   </div>
                                 </Card>
                               ))
                             )}
                             
                            <Button 
                              onClick={handleQuizSubmit}
                              disabled={Object.keys(quizAnswers).length === 0}
                              className="w-full"
                            >
                              Submit Quiz
                            </Button>
                          </div>
                        ) : (
                          <div className="text-center space-y-4">
                            <div className="text-2xl font-bold text-green-500">Quiz Completed!</div>
                            <p>Your answers have been submitted and your progress has been updated.</p>
                            <Button onClick={() => {
                              setShowQuizResults(false);
                              setQuizAnswers({});
                            }}>
                              Retake Quiz
                            </Button>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  )}
                </CardContent>
              </Tabs>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentLessonIndex(Math.max(0, currentLessonIndex - 1))}
                disabled={currentLessonIndex === 0}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous Lesson
              </Button>
              
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Lesson {currentLessonIndex + 1} of {lessons.length}
                </p>
              </div>
              
              <Button
                onClick={() => setCurrentLessonIndex(Math.min(lessons.length - 1, currentLessonIndex + 1))}
                disabled={currentLessonIndex === lessons.length - 1}
                className="flex items-center gap-2"
              >
                Next Lesson
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Assessment Modal */}
      {showAIAssessment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-xl font-semibold">AI Assessment</h2>
              <Button variant="ghost" onClick={() => setShowAIAssessment(false)}>
                ×
              </Button>
            </div>
            <div className="p-6">
              <AIAssessment
                lessonId={currentLesson.id}
                lessonTitle={currentLesson.title}
                lessonContent={currentLesson.content}
                onComplete={(score, passed) => {
                  if (passed) {
                    markLessonComplete(currentLesson.id);
                  }
                  setShowAIAssessment(false);
                  toast.success(`Assessment completed with ${score}%!`);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* AI Training Coach */}
      <AITrainingCoach
        lessonContext={{
          lessonId: currentLesson.id,
          lessonTitle: currentLesson.title,
          courseTitle: courseTitle,
          content: currentLesson.content
        }}
        isMinimized={coachMinimized}
        onToggleMinimize={() => setCoachMinimized(!coachMinimized)}
      />
    </div>
  );
};