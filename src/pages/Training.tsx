import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  BookOpen, 
  Star, 
  Clock, 
  Users, 
  Award, 
  Search, 
  Filter,
  Play,
  CheckCircle,
  TrendingUp,
  Calendar,
  Target,
  ChefHat,
  Flame,
  Trophy,
  PlayCircle,
  FileText,
  Grid3X3,
  List
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { LessonViewer } from '@/components/training/LessonViewer';
import { POSSystemSelector } from '@/components/training/POSSystemSelector';
import { POSSystemHub } from '@/components/training/POSSystemHub';
import PersonalizedLearningPath from '@/components/training/PersonalizedLearningPath';
import { AICourseCreator } from '@/components/training/AICourseCreator';
import { OptimizedCourseCard } from '@/components/training/OptimizedCourseCard';
import { AutoLessonGenerator } from '@/components/training/AutoLessonGenerator';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor_name: string;
  difficulty_level: string;
  duration_hours: number;
  thumbnail_url?: string;
  category: string;
  tags: string[];
  is_featured: boolean;
}

interface UserEnrollment {
  id: string;
  course_id: string;
  enrolled_at: string;
  completed_at?: string;
  progress_percent: number;
}

const Training = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<UserEnrollment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedPOSSystem, setSelectedPOSSystem] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'selector' | 'browse'>('selector');
  const [lessonCounts, setLessonCounts] = useState<{ [courseId: string]: number }>({});
  const { user } = useAuth();

  useEffect(() => {
    fetchCoursesOptimized();
    if (user) {
      fetchEnrollments();
    }
  }, [user]);

  const fetchCoursesOptimized = async () => {
    try {
      console.log('Fetching courses with optimized query...');
      
      // Single optimized query to get courses with lesson counts
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select(`
          *,
          lesson_count:lessons(count)
        `)
        .order('is_featured', { ascending: false });
      
      if (coursesError) {
        console.error('Supabase error:', coursesError);
        throw coursesError;
      }
      
      console.log('Courses fetched:', coursesData?.length || 0, 'courses');
      
      // Process the data to extract lesson counts
      const processedCourses = coursesData?.map(course => ({
        ...course,
        lesson_count: undefined // Remove the nested count object
      })) || [];
      
      const counts: { [courseId: string]: number } = {};
      coursesData?.forEach(course => {
        counts[course.id] = course.lesson_count?.[0]?.count || 0;
      });
      
      setCourses(processedCourses);
      setLessonCounts(counts);
      
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to load courses');
      
      // Fallback to basic course fetch
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .order('is_featured', { ascending: false });
        
        if (!error) {
          setCourses(data || []);
        }
      } catch (fallbackError) {
        console.error('Fallback fetch also failed:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrollments = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_enrollments')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      setEnrollments(data || []);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    }
  };

  const handleEnroll = async (courseId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('user_enrollments')
        .insert({
          user_id: user.id,
          course_id: courseId,
          progress_percent: 0
        });
      
      if (error) throw error;
      
      toast.success('Successfully enrolled in course!');
      fetchEnrollments();
    } catch (error) {
      console.error('Error enrolling:', error);
      toast.error('Failed to enroll in course');
    }
  };

  const isEnrolled = (courseId: string) => {
    return enrollments.some(enrollment => enrollment.course_id === courseId);
  };

  const getEnrollmentProgress = (courseId: string) => {
    const enrollment = enrollments.find(e => e.course_id === courseId);
    return enrollment?.progress_percent || 0;
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'intermediate': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'advanced': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.instructor_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'all' || course.difficulty_level === selectedDifficulty;
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    
    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  const featuredCourses = filteredCourses.filter(course => course.is_featured);
  const enrolledCourses = filteredCourses.filter(course => isEnrolled(course.id));
  const completedCourses = enrolledCourses.filter(course => getEnrollmentProgress(course.id) === 100);
  
  const categories = [...new Set(courses.map(course => course.category))];
  
  // Get POS course counts for the selector
  const posCategoryCounts = categories
    .filter(cat => cat.startsWith('pos-'))
    .reduce((acc, cat) => {
      acc[cat] = courses.filter(course => course.category === cat).length;
      return acc;
    }, {} as { [key: string]: number });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (selectedCourse) {
    return (
      <LessonViewer 
        courseId={selectedCourse.id}
        courseTitle={selectedCourse.title}
        onBack={() => setSelectedCourse(null)}
      />
    );
  }

  if (selectedPOSSystem) {
    return (
      <POSSystemHub 
        systemId={selectedPOSSystem}
        onBack={() => setSelectedPOSSystem(null)}
        onStartCourse={setSelectedCourse}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary/20 via-primary/10 to-transparent">
        <div className="absolute inset-0 bg-grid-white/10 bg-grid-16 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
        <div className="relative px-6 py-12 mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/20">
                  <ChefHat className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold tracking-tight">ChefAI University</h1>
                  <p className="text-lg text-muted-foreground">Master the culinary arts with world-class instruction</p>
                </div>
              </div>
              
              {user && (
                <div className="flex items-center space-x-6 mt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{enrolledCourses.length}</div>
                    <div className="text-sm text-muted-foreground">Enrolled</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">{completedCourses.length}</div>
                    <div className="text-sm text-muted-foreground">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-500">
                      {Math.round(enrolledCourses.reduce((acc, course) => acc + getEnrollmentProgress(course.id), 0) / (enrolledCourses.length || 1))}%
                    </div>
                    <div className="text-sm text-muted-foreground">Avg Progress</div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="hidden lg:block">
              <div className="flex items-center space-x-4">
                <Trophy className="w-16 h-16 text-yellow-500 animate-pulse" />
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Next Achievement</div>
                  <div className="font-semibold">Complete 3 courses</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="px-6 py-8 mx-auto max-w-7xl">
        {/* POS System Selection Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold">Choose Your POS System</h2>
            <Badge variant="secondary" className="text-xs">
              System-Specific Training
            </Badge>
          </div>
          {viewMode === 'selector' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode('browse')}
              className="flex items-center gap-2"
            >
              <List className="w-4 h-4" />
              Browse All Courses
            </Button>
          )}
        </div>

        {viewMode === 'selector' ? (
          <POSSystemSelector 
            onSelectSystem={setSelectedPOSSystem}
            courseCounts={posCategoryCounts}
          />
        ) : (
          <>
            {/* Enhanced POS System Filter */}
            <div className="mb-6">
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-lg border border-primary/20">
                <div className="flex items-center gap-2">
                  <Grid3X3 className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-primary">POS Systems Training</span>
                </div>
                <select 
                  value={selectedCategory.startsWith('pos-') ? selectedCategory : 'all-pos'}
                  onChange={(e) => {
                    if (e.target.value === 'all-pos') {
                      setSelectedCategory('all');
                    } else {
                      setSelectedCategory(e.target.value);
                    }
                  }}
                  className="px-3 py-2 text-sm border rounded-md bg-background border-border focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all-pos">All POS Systems</option>
                  {categories.filter(cat => cat.startsWith('pos-')).map(category => (
                    <option key={category} value={category}>
                      {category.replace('pos-', '').replace('-', ' ').split(' ').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')} ({courses.filter(c => c.category === category).length} courses)
                    </option>
                  ))}
                </select>
                {selectedCategory.startsWith('pos-') && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedCategory('all')}
                    className="text-xs"
                  >
                    Clear Filter
                  </Button>
                )}
              </div>
            </div>

            {/* Search and Filters */}
            <div className="py-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search courses, instructors, or topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                
                <div className="flex gap-2">
                  <select 
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="px-3 py-2 text-sm border rounded-md bg-background border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">All Levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                  
                  <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 text-sm border rounded-md bg-background border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">All Categories</option>
                    <optgroup label="POS Systems">
                      {categories.filter(cat => cat.startsWith('pos-')).map(category => (
                        <option key={category} value={category}>
                          {category.replace('pos-', '').replace('-', ' ').split(' ').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Safety & Compliance">
                      {categories.filter(cat => cat === 'safety-compliance' || cat === 'safety').map(category => (
                        <option key={category} value={category}>
                          {category === 'safety-compliance' ? 'Safety & Compliance' : category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Culinary Arts">
                      {categories.filter(cat => !cat.startsWith('pos-') && cat !== 'safety-compliance' && cat !== 'safety').map(category => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>
              </div>
            </div>

            <Tabs defaultValue="discover" className="space-y-8">
              <TabsList className="grid w-full grid-cols-5 lg:w-fit">
                <TabsTrigger value="discover" className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Discover
                </TabsTrigger>
                <TabsTrigger value="learning-path" className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  My Path
                </TabsTrigger>
                <TabsTrigger value="ai-creator" className="flex items-center gap-2">
                  <Flame className="w-4 h-4" />
                  AI Lesson Generator
                </TabsTrigger>
                <TabsTrigger value="my-courses" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  My Courses
                </TabsTrigger>
                <TabsTrigger value="achievements" className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Achievements
                </TabsTrigger>
              </TabsList>

              <TabsContent value="learning-path">
                <PersonalizedLearningPath 
                  userEnrollments={enrollments}
                  completedCourses={completedCourses}
                  userProfile={{
                    experience_level: 'intermediate',
                    role: 'staff',
                    interests: ['cooking', 'food safety', 'customer service'],
                    learning_goals: 'advance to management position'
                  }}
                />
              </TabsContent>

              <TabsContent value="ai-creator">
                <AutoLessonGenerator />
              </TabsContent>

              <TabsContent value="discover" className="space-y-8">

                {/* Featured Courses */}
                {featuredCourses.length > 0 ? (
                  <section>
                    <div className="flex items-center gap-2 mb-6">
                      <Flame className="w-5 h-5 text-orange-500" />
                      <h2 className="text-2xl font-bold">Featured Courses</h2>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                       {featuredCourses.map((course) => (
                         <OptimizedCourseCard 
                           key={course.id} 
                           course={course} 
                           lessonCount={lessonCounts[course.id] || 0}
                           isEnrolled={isEnrolled(course.id)}
                           progress={getEnrollmentProgress(course.id)}
                           onEnroll={handleEnroll}
                           onViewCourse={setSelectedCourse}
                         />
                       ))}
                    </div>
                  </section>
                ) : (
                  <section className="p-8 text-center bg-muted/20 rounded-lg">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No Featured Courses Found</h3>
                    <p className="text-muted-foreground">
                      {courses.length === 0 
                        ? "Loading courses..." 
                        : "No courses match your current filters. Try adjusting your search criteria."
                      }
                    </p>
                  </section>
                )}

                {/* All Courses Section */}
                {filteredCourses.length > 0 && (
                  <section>
                    <div className="flex items-center gap-2 mb-6">
                      <BookOpen className="w-5 h-5 text-primary" />
                      <h2 className="text-2xl font-bold">All Courses</h2>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                       {filteredCourses.map((course) => (
                         <OptimizedCourseCard 
                           key={course.id} 
                           course={course} 
                           lessonCount={lessonCounts[course.id] || 0}
                           isEnrolled={isEnrolled(course.id)}
                           progress={getEnrollmentProgress(course.id)}
                           onEnroll={handleEnroll}
                           onViewCourse={setSelectedCourse}
                         />
                       ))}
                    </div>
                  </section>
                )}

                {/* POS Systems University */}
                {filteredCourses.filter(course => course.category.startsWith('pos-')).length > 0 && (
                  <section>
                    <div className="flex items-center gap-2 mb-6">
                      <Target className="w-5 h-5 text-blue-500" />
                      <h2 className="text-2xl font-bold">POS Systems University</h2>
                      <Badge variant="secondary" className="ml-2">Specialized Training</Badge>
                    </div>
                    
                    {/* Group POS courses by provider */}
                    {['pos-square', 'pos-toast', 'pos-touchbistro', 'pos-clover', 'pos-lightspeed', 'pos-resy', 'pos-shopify', 'pos-aloha', 'pos-micros', 'pos-advanced'].map(posCategory => {
                      const posCourses = filteredCourses.filter(course => course.category === posCategory);
                      if (posCourses.length === 0) return null;
                      
                      const providerName = posCategory.replace('pos-', '').replace('-', ' ').split(' ').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ');
                      
                      return (
                        <div key={posCategory} className="mb-8">
                          <h3 className="text-lg font-semibold mb-4 text-primary">
                            {posCategory === 'pos-advanced' ? 'Advanced POS Topics' : `${providerName} Training`}
                          </h3>
                          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                             {posCourses.map((course) => (
                               <OptimizedCourseCard 
                                 key={course.id} 
                                 course={course} 
                                 lessonCount={lessonCounts[course.id] || 0}
                                 isEnrolled={isEnrolled(course.id)}
                                 progress={getEnrollmentProgress(course.id)}
                                 onEnroll={handleEnroll}
                                 onViewCourse={setSelectedCourse}
                               />
                             ))}
                          </div>
                        </div>
                      );
                    })}
                  </section>
                )}

                {/* Safety & Compliance */}
                {filteredCourses.filter(course => course.category === 'safety-compliance' || course.category === 'safety').length > 0 && (
                  <section>
                    <div className="flex items-center gap-2 mb-6">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <h2 className="text-2xl font-bold">Safety & Compliance</h2>
                      <Badge variant="secondary" className="ml-2">Required Training</Badge>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                       {filteredCourses.filter(course => course.category === 'safety-compliance' || course.category === 'safety').map((course) => (
                         <OptimizedCourseCard 
                           key={course.id} 
                           course={course} 
                           lessonCount={lessonCounts[course.id] || 0}
                           isEnrolled={isEnrolled(course.id)}
                           progress={getEnrollmentProgress(course.id)}
                           onEnroll={handleEnroll}
                           onViewCourse={setSelectedCourse}
                         />
                       ))}
                    </div>
                  </section>
                )}

                {/* Culinary Arts */}
                {filteredCourses.filter(course => !course.category.startsWith('pos-') && course.category !== 'safety-compliance' && course.category !== 'safety').length > 0 && (
                  <section>
                    <div className="flex items-center gap-2 mb-6">
                      <ChefHat className="w-5 h-5 text-purple-500" />
                      <h2 className="text-2xl font-bold">Culinary Arts</h2>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {filteredCourses.filter(course => 
                        !course.category.startsWith('pos-') && 
                        course.category !== 'safety-compliance' && 
                        course.category !== 'safety'
                       ).map((course) => (
                         <OptimizedCourseCard 
                           key={course.id} 
                           course={course} 
                           lessonCount={lessonCounts[course.id] || 0}
                           isEnrolled={isEnrolled(course.id)}
                           progress={getEnrollmentProgress(course.id)}
                           onEnroll={handleEnroll}
                           onViewCourse={setSelectedCourse}
                         />
                       ))}
                    </div>
                  </section>
                )}
              </TabsContent>

              <TabsContent value="my-courses" className="space-y-8">
                {enrolledCourses.length === 0 ? (
                  <Card className="p-12 text-center">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-semibold mb-2">No courses yet</h3>
                    <p className="text-muted-foreground mb-4">Start your culinary journey by enrolling in a course</p>
                    <Button onClick={() => {
                      const discoverTab = document.querySelector('[value="discover"]') as HTMLElement;
                      if (discoverTab) discoverTab.click();
                    }}>
                      Browse Courses
                    </Button>
                  </Card>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                     {enrolledCourses.map((course) => (
                       <OptimizedCourseCard 
                         key={course.id} 
                         course={course} 
                         lessonCount={lessonCounts[course.id] || 0}
                         isEnrolled={true}
                         progress={getEnrollmentProgress(course.id)}
                         onEnroll={handleEnroll}
                         onViewCourse={setSelectedCourse}
                         showProgress={true}
                       />
                     ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="achievements" className="space-y-8">
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h2 className="text-3xl font-bold">Your Achievements</h2>
                    <p className="text-muted-foreground">Track your learning milestones</p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[
                      { id: 1, title: "First Steps", description: "Complete your first course", icon: "🎯", unlocked: completedCourses.length >= 1 },
                      { id: 2, title: "Knowledge Seeker", description: "Complete 3 courses", icon: "📚", unlocked: completedCourses.length >= 3 },
                      { id: 3, title: "Culinary Scholar", description: "Complete 5 courses", icon: "🎓", unlocked: completedCourses.length >= 5 },
                      { id: 4, title: "Master Chef", description: "Complete 10 courses", icon: "👨‍🍳", unlocked: completedCourses.length >= 10 },
                      { id: 5, title: "Dedicated Student", description: "Enroll in 5 courses", icon: "⭐", unlocked: enrolledCourses.length >= 5 },
                    ].map((achievement) => (
                      <Card key={achievement.id} className={`transition-all duration-200 ${achievement.unlocked ? 'border-primary/20 bg-primary/5' : 'opacity-50'}`}>
                        <CardContent className="p-6 text-center space-y-2">
                          <div className="text-4xl mb-2">{achievement.icon}</div>
                          <h3 className="font-semibold">{achievement.title}</h3>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                          {achievement.unlocked && (
                            <Badge variant="default" className="mt-2">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Unlocked
                            </Badge>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
};

export default Training;