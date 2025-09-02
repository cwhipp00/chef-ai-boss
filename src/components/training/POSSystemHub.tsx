import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft,
  BookOpen,
  Clock,
  Users,
  Award,
  Play,
  CheckCircle,
  Star,
  ExternalLink,
  Download,
  FileText,
  Video,
  Target,
  TrendingUp
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

interface POSSystemHubProps {
  systemId: string;
  onBack: () => void;
  onStartCourse: (course: Course) => void;
}

const systemInfo: { [key: string]: any } = {
  'pos-square': {
    name: 'Square',
    logo: '⬜',
    description: 'Master Square POS with comprehensive training from basic setup to advanced analytics',
    website: 'https://squareup.com',
    founded: '2009',
    headquarters: 'San Francisco, CA',
    marketShare: '~18%',
    strengths: ['Easy setup', 'Integrated payments', 'Strong analytics', 'Great for small business'],
    learningPath: [
      'Getting Started with Square',
      'Processing Payments & Sales',
      'Inventory Management',
      'Customer Management',
      'Analytics & Reporting',
      'Advanced Features'
    ],
    certifications: ['Square Certified Partner', 'Square Payment Specialist'],
    officialResources: [
      { name: 'Square Help Center', url: 'https://squareup.com/help' },
      { name: 'Square Developer Documentation', url: 'https://developer.squareup.com' },
      { name: 'Square Community', url: 'https://community.squareup.com' }
    ]
  },
  'pos-toast': {
    name: 'Toast',
    logo: '🍞',
    description: 'Become a Toast expert with restaurant-focused training and kitchen management mastery',
    website: 'https://pos.toasttab.com',
    founded: '2011',
    headquarters: 'Boston, MA',
    marketShare: '~8%',
    strengths: ['Restaurant-specific', 'Kitchen display systems', 'Online ordering', 'Staff management'],
    learningPath: [
      'Toast Platform Overview',
      'Menu Setup & Management',
      'Order Processing Workflow',
      'Kitchen Display Systems',
      'Payment Processing',
      'Staff & Labor Management'
    ],
    certifications: ['Toast Certified Administrator', 'Toast Kitchen Expert'],
    officialResources: [
      { name: 'Toast Central', url: 'https://central.toasttab.com' },
      { name: 'Toast University', url: 'https://university.toasttab.com' },
      { name: 'Toast Support', url: 'https://support.toasttab.com' }
    ]
  },
  'pos-touchbistro': {
    name: 'TouchBistro',
    logo: '📱',
    description: 'Excel in restaurant management with TouchBistro\'s iPad-based POS system training',
    website: 'https://www.touchbistro.com',
    founded: '2010',
    headquarters: 'Toronto, Canada',
    marketShare: '~5%',
    strengths: ['iPad-based interface', 'Table management', 'Reservation system', 'Menu engineering'],
    learningPath: [
      'TouchBistro Setup & Configuration',
      'Table & Reservation Management',
      'Menu Creation & Pricing',
      'Staff Training & Permissions',
      'Reporting & Analytics',
      'Integration Management'
    ],
    certifications: ['TouchBistro Certified User', 'TouchBistro Manager Certification'],
    officialResources: [
      { name: 'TouchBistro Support', url: 'https://support.touchbistro.com' },
      { name: 'TouchBistro Academy', url: 'https://academy.touchbistro.com' },
      { name: 'TouchBistro Blog', url: 'https://www.touchbistro.com/blog' }
    ]
  },
  'pos-clover': {
    name: 'Clover',
    logo: '🍀',
    description: 'Master Clover POS with training on apps, integrations, and business management',
    website: 'https://www.clover.com',
    founded: '2010',
    headquarters: 'Sunnyvale, CA',
    marketShare: '~15%',
    strengths: ['App marketplace', 'Hardware variety', 'Inventory tracking', 'Employee management'],
    learningPath: [
      'Clover System Setup',
      'App Marketplace Navigation',
      'Inventory & Product Management',
      'Employee & Permissions',
      'Customer Engagement',
      'Business Analytics'
    ],
    certifications: ['Clover Certified Partner', 'Clover App Developer'],
    officialResources: [
      { name: 'Clover Help', url: 'https://help.clover.com' },
      { name: 'Clover Developer', url: 'https://www.clover.com/developers' },
      { name: 'Clover Community', url: 'https://community.clover.com' }
    ]
  }
};

export const POSSystemHub: React.FC<POSSystemHubProps> = ({ systemId, onBack, onStartCourse }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<UserEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  const systemData = systemInfo[systemId] || {
    name: systemId.replace('pos-', '').toUpperCase(),
    description: 'Professional POS system training',
    learningPath: [],
    certifications: [],
    officialResources: []
  };

  useEffect(() => {
    fetchCourses();
    if (user) {
      fetchEnrollments();
    }
  }, [systemId, user]);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('category', systemId)
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
    if (!user) {
      toast.error('Please log in to enroll in courses');
      return;
    }
    
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

  const enrolledCourses = courses.filter(course => isEnrolled(course.id));
  const completedCourses = enrolledCourses.filter(course => getEnrollmentProgress(course.id) === 100);
  const averageProgress = enrolledCourses.length > 0 
    ? Math.round(enrolledCourses.reduce((acc, course) => acc + getEnrollmentProgress(course.id), 0) / enrolledCourses.length)
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-6 py-4 mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to POS Systems
              </Button>
              <div className="text-4xl">{systemData.logo}</div>
              <div>
                <h1 className="text-2xl font-bold">{systemData.name} Training Hub</h1>
                <p className="text-sm text-muted-foreground">
                  {courses.length} courses available
                </p>
              </div>
            </div>
            
            {user && enrolledCourses.length > 0 && (
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{enrolledCourses.length}</div>
                  <div className="text-xs text-muted-foreground">Enrolled</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">{completedCourses.length}</div>
                  <div className="text-xs text-muted-foreground">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-500">{averageProgress}%</div>
                  <div className="text-xs text-muted-foreground">Avg Progress</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 py-8 mx-auto max-w-7xl">
        <Tabs defaultValue="courses" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="courses" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Courses
            </TabsTrigger>
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              System Overview
            </TabsTrigger>
            <TabsTrigger value="learning-path" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Learning Path
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              Resources
            </TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Available Courses</h2>
              <Badge variant="outline">{courses.length} courses</Badge>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <Card key={course.id} className="group overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-grid-white/10 bg-grid-8" />
                    <div className="absolute top-4 left-4">
                      <Badge className={`${course.is_featured ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : getDifficultyColor(course.difficulty_level)} border`}>
                        {course.is_featured ? '⭐ Featured' : course.difficulty_level}
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <Video className="w-8 h-8 text-white/80" />
                    </div>
                  </div>
                  
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                      {course.title}
                    </CardTitle>
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

                    {isEnrolled(course.id) && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{getEnrollmentProgress(course.id)}%</span>
                        </div>
                        <Progress value={getEnrollmentProgress(course.id)} className="h-2" />
                      </div>
                    )}

                    <div className="flex gap-2">
                      {course.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {isEnrolled(course.id) ? (
                      <Button 
                        className="w-full" 
                        size="sm"
                        onClick={() => onStartCourse(course)}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Continue Learning
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button 
                          className="flex-1" 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEnroll(course.id)}
                        >
                          Enroll Now
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => onStartCourse(course)}
                          className="px-3"
                        >
                          <FileText className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="text-3xl">{systemData.logo}</div>
                  About {systemData.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-lg">{systemData.description}</p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">System Information</h3>
                    <div className="space-y-2 text-sm">
                      {systemData.founded && <div><span className="font-medium">Founded:</span> {systemData.founded}</div>}
                      {systemData.headquarters && <div><span className="font-medium">Headquarters:</span> {systemData.headquarters}</div>}
                      {systemData.marketShare && <div><span className="font-medium">Market Share:</span> {systemData.marketShare}</div>}
                      {systemData.website && (
                        <div>
                          <span className="font-medium">Website:</span> 
                          <a href={systemData.website} target="_blank" rel="noopener noreferrer" className="ml-1 text-primary hover:underline">
                            {systemData.website}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3">Key Strengths</h3>
                    <div className="space-y-2">
                      {systemData.strengths?.map((strength: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm">{strength}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="learning-path" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recommended Learning Path</CardTitle>
                <p className="text-muted-foreground">Follow this structured path to master {systemData.name}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemData.learningPath?.map((step: string, index: number) => (
                    <div key={index} className="flex items-center gap-4 p-4 rounded-lg border">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{step}</h4>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        2-4 hours
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {systemData.certifications?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-500" />
                    Available Certifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {systemData.certifications.map((cert: string, index: number) => (
                      <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                        <Award className="w-5 h-5 text-yellow-500" />
                        <span className="font-medium">{cert}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Official Resources</CardTitle>
                <p className="text-muted-foreground">Direct links to official documentation and support</p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {systemData.officialResources?.map((resource: any, index: number) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <ExternalLink className="w-5 h-5 text-primary" />
                          <div>
                            <h4 className="font-medium">{resource.name}</h4>
                            <p className="text-sm text-muted-foreground">Official resource</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <a href={resource.url} target="_blank" rel="noopener noreferrer">
                            Visit
                          </a>
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Learning Materials</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Download className="w-5 h-5 text-blue-500" />
                    <div>
                      <div className="font-medium">Quick Reference Guide</div>
                      <div className="text-sm text-muted-foreground">PDF Download</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Video className="w-5 h-5 text-red-500" />
                    <div>
                      <div className="font-medium">Video Tutorials</div>
                      <div className="text-sm text-muted-foreground">Step-by-step guides</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <FileText className="w-5 h-5 text-green-500" />
                    <div>
                      <div className="font-medium">Practice Exercises</div>
                      <div className="text-sm text-muted-foreground">Hands-on practice</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};