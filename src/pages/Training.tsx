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
  Trophy
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

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
  const { user } = useAuth();

  useEffect(() => {
    fetchCourses();
    if (user) {
      fetchEnrollments();
    }
  }, [user]);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('is_featured', { ascending: false });
      
      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to load courses');
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
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

      <div className="px-6 mx-auto max-w-7xl">
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
          <TabsList className="grid w-full grid-cols-4 lg:w-fit">
            <TabsTrigger value="discover" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Discover
            </TabsTrigger>
            <TabsTrigger value="my-courses" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              My Courses
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Leaderboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="discover" className="space-y-8">
            {/* Featured Courses */}
            {featuredCourses.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <Flame className="w-5 h-5 text-orange-500" />
                  <h2 className="text-2xl font-bold">Featured Courses</h2>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {featuredCourses.map((course) => (
                    <CourseCard 
                      key={course.id} 
                      course={course} 
                      isEnrolled={isEnrolled(course.id)}
                      progress={getEnrollmentProgress(course.id)}
                      onEnroll={handleEnroll}
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
                          <CourseCard 
                            key={course.id} 
                            course={course} 
                            isEnrolled={isEnrolled(course.id)}
                            progress={getEnrollmentProgress(course.id)}
                            onEnroll={handleEnroll}
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
                    <CourseCard 
                      key={course.id} 
                      course={course} 
                      isEnrolled={isEnrolled(course.id)}
                      progress={getEnrollmentProgress(course.id)}
                      onEnroll={handleEnroll}
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
                    <CourseCard 
                      key={course.id} 
                      course={course} 
                      isEnrolled={isEnrolled(course.id)}
                      progress={getEnrollmentProgress(course.id)}
                      onEnroll={handleEnroll}
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
                  <CourseCard 
                    key={course.id} 
                    course={course} 
                    isEnrolled={true}
                    progress={getEnrollmentProgress(course.id)}
                    onEnroll={handleEnroll}
                    showProgress={true}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="achievements" className="space-y-8">
            <AchievementsSection completedCourses={completedCourses.length} totalProgress={enrolledCourses.length} />
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-8">
            <LeaderboardSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Course Card Component
const CourseCard = ({ 
  course, 
  isEnrolled, 
  progress, 
  onEnroll, 
  showProgress = false 
}: {
  course: Course;
  isEnrolled: boolean;
  progress: number;
  onEnroll: (courseId: string) => void;
  showProgress?: boolean;
}) => {
  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'intermediate': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'advanced': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  return (
    <Card className="group overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-primary/10">
      <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 bg-grid-8" />
        <div className="absolute top-4 left-4">
          <Badge className={`${course.is_featured ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : getDifficultyColor(course.difficulty_level)} border`}>
            {course.is_featured ? '⭐ Featured' : course.difficulty_level}
          </Badge>
        </div>
        <div className="absolute bottom-4 right-4">
          <Avatar className="h-8 w-8 border-2 border-white/20">
            <AvatarFallback className="text-xs bg-primary/20">
              {course.instructor_name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
            {course.title}
          </CardTitle>
          <Badge variant="outline" className="ml-2 text-xs">
            {course.category}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {course.description}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {course.duration_hours}h
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {course.instructor_name}
          </div>
        </div>

        {showProgress && isEnrolled && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <div className="flex gap-2">
          {course.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {isEnrolled ? (
          <Button className="w-full" size="sm">
            <Play className="w-4 h-4 mr-2" />
            Continue Learning
          </Button>
        ) : (
          <Button 
            className="w-full" 
            variant="outline" 
            size="sm"
            onClick={() => onEnroll(course.id)}
          >
            Enroll Now
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

// Achievements Section
const AchievementsSection = ({ completedCourses, totalProgress }: { completedCourses: number; totalProgress: number }) => {
  const achievements = [
    { id: 1, title: "First Steps", description: "Complete your first course", icon: "🎯", unlocked: completedCourses >= 1 },
    { id: 2, title: "Knowledge Seeker", description: "Complete 3 courses", icon: "📚", unlocked: completedCourses >= 3 },
    { id: 3, title: "Culinary Scholar", description: "Complete 5 courses", icon: "🎓", unlocked: completedCourses >= 5 },
    { id: 4, title: "Master Chef", description: "Complete 10 courses", icon: "👨‍🍳", unlocked: completedCourses >= 10 },
    { id: 5, title: "Dedicated Student", description: "Enroll in 5 courses", icon: "⭐", unlocked: totalProgress >= 5 },
    { id: 6, title: "Speed Learner", description: "Complete a course in one day", icon: "⚡", unlocked: false },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Your Achievements</h2>
        <p className="text-muted-foreground">Track your learning milestones</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {achievements.map((achievement) => (
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
  );
};

// Leaderboard Section
const LeaderboardSection = () => {
  const mockLeaderboard = [
    { rank: 1, name: "Alex Chen", courses: 12, points: 2400 },
    { rank: 2, name: "Sarah Johnson", courses: 10, points: 2100 },
    { rank: 3, name: "Mike Rodriguez", courses: 8, points: 1800 },
    { rank: 4, name: "Emma Davis", courses: 7, points: 1650 },
    { rank: 5, name: "David Kim", courses: 6, points: 1400 },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Leaderboard</h2>
        <p className="text-muted-foreground">See how you compare with other learners</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Top Learners This Month
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockLeaderboard.map((user, index) => (
              <div key={user.rank} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    index === 0 ? 'bg-yellow-500 text-white' :
                    index === 1 ? 'bg-gray-400 text-white' :
                    index === 2 ? 'bg-amber-600 text-white' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {user.rank}
                  </div>
                  <div>
                    <div className="font-semibold">{user.name}</div>
                    <div className="text-sm text-muted-foreground">{user.courses} courses completed</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-primary">{user.points}</div>
                  <div className="text-xs text-muted-foreground">points</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Training;