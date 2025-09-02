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
    description: 'Master Square POS with comprehensive training from basic setup to advanced analytics. Square revolutionizes business with integrated payments, powerful analytics, and seamless omnichannel experiences.',
    website: 'https://squareup.com',
    founded: '2009',
    headquarters: 'San Francisco, CA',
    marketShare: '~18%',
    employeeCount: '8,000+',
    valuation: '$29.5 billion',
    processingVolume: '$200+ billion annually',
    
    strengths: [
      'Easy 5-minute setup process',
      'Integrated payment processing with competitive rates',
      'Comprehensive business analytics and insights',
      'Perfect for small to medium businesses',
      'Built-in inventory management',
      'Omnichannel selling (online, in-person, mobile)',
      'Robust developer API and ecosystem',
      'Free basic plan available',
      'Excellent customer support',
      'Hardware variety and flexibility'
    ],
    
    pricing: {
      free: {
        name: 'Free Plan',
        cost: '$0/month',
        features: ['Unlimited items', 'Basic analytics', 'Payment processing', 'Mobile app']
      },
      plus: {
        name: 'Plus Plan',
        cost: '$60/month',
        features: ['Advanced analytics', 'Staff management', 'Loyalty programs', 'Advanced inventory']
      },
      premium: {
        name: 'Premium Plan',
        cost: '$165/month',
        features: ['Multi-location management', 'Advanced reporting', 'Custom permissions', 'Priority support']
      }
    },
    
    hardwareOptions: [
      'Square Terminal ($299) - All-in-one card reader',
      'Square Stand ($169) - iPad-based register',
      'Square Reader ($10) - Magnetic stripe reader',
      'Square Register ($799) - Full POS system',
      'Kitchen Display System ($999) - Restaurant-specific'
    ],
    
    keyFeatures: {
      'Payment Processing': {
        description: 'Accept all payment types with competitive rates',
        details: ['2.6% + 10¢ in-person', '2.9% + 30¢ online', 'No monthly fees', 'Same-day deposits']
      },
      'Inventory Management': {
        description: 'Track stock levels, variants, and automated alerts',
        details: ['Real-time tracking', 'Low stock alerts', 'Variant management', 'Purchase orders']
      },
      'Analytics & Reporting': {
        description: 'Comprehensive business insights and custom reports',
        details: ['Sales trends', 'Customer insights', 'Staff performance', 'Tax reporting']
      },
      'Online Store': {
        description: 'Integrated e-commerce with synchronized inventory',
        details: ['Custom website', 'Social media integration', 'SEO optimization', 'Pickup/delivery']
      },
      'Team Management': {
        description: 'Staff scheduling, permissions, and time tracking',
        details: ['Role-based access', 'Time clock', 'Shift scheduling', 'Performance tracking']
      }
    },
    
    idealFor: [
      'Small to medium retail businesses',
      'Restaurants and food service',
      'Professional services',
      'Market vendors and pop-ups',
      'Multi-location businesses',
      'E-commerce + physical stores'
    ],
    
    integrations: [
      'QuickBooks', 'Xero', 'WooCommerce', 'BigCommerce', 'Mailchimp', 
      'Klaviyo', 'Zapier', '500+ third-party apps'
    ],
    
    learningPath: [
      {
        title: 'Square Fundamentals',
        duration: '2 hours',
        topics: ['Account setup', 'Basic navigation', 'Processing first sale', 'Hardware connection']
      },
      {
        title: 'Payment Processing Mastery',
        duration: '3 hours',
        topics: ['Card payments', 'Contactless payments', 'Digital wallets', 'Payment security']
      },
      {
        title: 'Inventory Management',
        duration: '4 hours',
        topics: ['Product catalog', 'Variants and modifiers', 'Stock tracking', 'Purchase orders']
      },
      {
        title: 'Customer Management & Loyalty',
        duration: '3 hours',
        topics: ['Customer profiles', 'Loyalty programs', 'Marketing campaigns', 'Customer insights']
      },
      {
        title: 'Analytics & Business Intelligence',
        duration: '4 hours',
        topics: ['Sales reporting', 'Performance metrics', 'Trend analysis', 'Custom dashboards']
      },
      {
        title: 'Advanced Features & Integrations',
        duration: '5 hours',
        topics: ['API development', 'Third-party integrations', 'Multi-location setup', 'Advanced permissions']
      }
    ],
    
    certifications: [
      {
        name: 'Square Certified Partner',
        description: 'Official Square partner certification for consultants and implementers',
        requirements: ['Complete all training modules', 'Pass certification exam', 'Implement 3 live systems'],
        benefits: ['Official Square partner status', 'Access to partner resources', 'Listed in partner directory']
      },
      {
        name: 'Square Payment Specialist',
        description: 'Expert-level certification in Square payment processing',
        requirements: ['Advanced payment training', 'Security compliance course', 'Real-world case studies'],
        benefits: ['Payment processing expertise badge', 'Priority technical support', 'Advanced API access']
      }
    ],
    
    officialResources: [
      { name: 'Square Help Center', url: 'https://squareup.com/help', description: 'Comprehensive help documentation' },
      { name: 'Square Developer Documentation', url: 'https://developer.squareup.com', description: 'APIs, SDKs, and integration guides' },
      { name: 'Square Community', url: 'https://community.squareup.com', description: 'User forums and discussions' },
      { name: 'Square Blog', url: 'https://squareup.com/us/en/townsquare', description: 'Business tips and industry insights' },
      { name: 'Webinar Library', url: 'https://squareup.com/us/en/webinars', description: 'Free educational webinars' }
    ]
  },
  
  'pos-toast': {
    name: 'Toast',
    logo: '🍞',
    description: 'Become a Toast expert with restaurant-focused training and kitchen management mastery. Toast is the all-in-one restaurant technology platform that combines POS, online ordering, payroll, and digital marketing.',
    website: 'https://pos.toasttab.com',
    founded: '2011',
    headquarters: 'Boston, MA',
    marketShare: '~8%',
    employeeCount: '4,000+',
    valuation: '$20+ billion',
    restaurantCount: '75,000+ locations',
    
    strengths: [
      'Built specifically for restaurants',
      'Integrated kitchen display systems',
      'Comprehensive online ordering platform',
      'Advanced staff and labor management',
      'Real-time menu synchronization',
      'Delivery management and logistics',
      'Built-in payroll and HR tools',
      'Powerful restaurant analytics',
      'Multi-location franchise support',
      'Offline mode functionality'
    ],
    
    pricing: {
      starter: {
        name: 'Toast Starter',
        cost: '$0/month',
        features: ['Basic POS', 'Payment processing', 'Menu management', 'Basic reporting']
      },
      essentials: {
        name: 'Toast Essentials',
        cost: '$165/month',
        features: ['Advanced reporting', 'Online ordering', 'Kitchen display', 'Staff management']
      },
      growth: {
        name: 'Toast Growth',
        cost: '$399/month',
        features: ['Advanced analytics', 'Loyalty programs', 'Marketing tools', 'Multi-location']
      }
    },
    
    hardwareOptions: [
      'Toast Flex ($799) - Handheld POS terminal',
      'Toast Terminal ($699) - Countertop all-in-one',
      'Kitchen Display System ($1,200) - Order management screens',
      'Toast Tap ($399) - Compact countertop device',
      'Toast Go ($399) - Mobile ordering device',
      'Self-Service Kiosk ($2,500) - Customer ordering station'
    ],
    
    keyFeatures: {
      'Kitchen Display System': {
        description: 'Digital order management replacing paper tickets',
        details: ['Real-time order tracking', 'Prep time management', 'Kitchen efficiency metrics', 'Integration with POS']
      },
      'Online Ordering': {
        description: 'Native online ordering with commission-free delivery',
        details: ['Branded ordering website', 'Mobile app ordering', 'Delivery management', 'Pickup scheduling']
      },
      'Staff Management': {
        description: 'Complete workforce management solution',
        details: ['Scheduling optimization', 'Time & attendance', 'Payroll integration', 'Performance tracking']
      },
      'Menu Management': {
        description: 'Dynamic menu control across all channels',
        details: ['Real-time updates', 'Ingredient tracking', 'Pricing optimization', 'Promotional items']
      },
      'Restaurant Analytics': {
        description: 'Advanced reporting tailored for restaurant operations',
        details: ['Sales performance', 'Labor cost analysis', 'Menu item profitability', 'Customer behavior']
      },
      'Toast Capital': {
        description: 'Restaurant-specific financing and cash advances',
        details: ['Quick funding approval', 'Revenue-based repayment', 'Equipment financing', 'Working capital loans']
      }
    },
    
    idealFor: [
      'Full-service restaurants',
      'Quick-service restaurants (QSR)',
      'Fast-casual dining',
      'Food trucks and mobile vendors',
      'Multi-location restaurant chains',
      'Franchises and restaurant groups',
      'Bars and nightlife venues',
      'Cafes and coffee shops'
    ],
    
    integrations: [
      'QuickBooks', 'Xero', 'DoorDash', 'Uber Eats', 'Grubhub', 'Postmates',
      'OpenTable', 'Resy', 'Yelp', 'Google My Business', 'Facebook', 'Instagram',
      'Mailchimp', 'Constant Contact', 'HotSchedules', 'When I Work', '200+ restaurant apps'
    ],
    
    learningPath: [
      {
        title: 'Toast Platform Fundamentals',
        duration: '3 hours',
        topics: ['Toast ecosystem overview', 'Hardware setup', 'Basic POS operations', 'Menu configuration']
      },
      {
        title: 'Menu Engineering & Management',
        duration: '4 hours',
        topics: ['Menu design principles', 'Item profitability analysis', 'Modifier management', 'Pricing strategies']
      },
      {
        title: 'Kitchen Operations & KDS',
        duration: '5 hours',
        topics: ['Kitchen display setup', 'Order flow optimization', 'Prep time management', 'Kitchen efficiency metrics']
      },
      {
        title: 'Online Ordering & Delivery',
        duration: '4 hours',
        topics: ['Online ordering setup', 'Delivery logistics', 'Third-party integration', 'Commission management']
      },
      {
        title: 'Staff & Labor Management',
        duration: '6 hours',
        topics: ['Employee onboarding', 'Schedule optimization', 'Payroll integration', 'Performance tracking']
      },
      {
        title: 'Advanced Analytics & Growth',
        duration: '5 hours',
        topics: ['Financial reporting', 'Customer analytics', 'Marketing automation', 'Multi-location management']
      }
    ],
    
    certifications: [
      {
        name: 'Toast Certified Administrator',
        description: 'Complete certification for Toast system administration',
        requirements: ['System setup training', 'Advanced configuration', 'Multi-location management', 'Certification exam'],
        benefits: ['Official Toast certification badge', 'Access to advanced features', 'Priority support queue']
      },
      {
        name: 'Toast Kitchen Operations Expert',
        description: 'Specialized certification for kitchen display and operations',
        requirements: ['Kitchen workflow training', 'KDS optimization course', 'Efficiency case studies', 'Practical assessment'],
        benefits: ['Kitchen operations expertise badge', 'Access to beta features', 'Restaurant efficiency consultation']
      },
      {
        name: 'Toast Growth Specialist',
        description: 'Advanced certification for restaurant growth and marketing',
        requirements: ['Marketing automation training', 'Analytics mastery', 'Growth strategy course', 'Portfolio review'],
        benefits: ['Growth specialist certification', 'Marketing tools access', 'Revenue optimization consultation']
      }
    ],
    
    officialResources: [
      { name: 'Toast Central', url: 'https://central.toasttab.com', description: 'Main Toast management portal' },
      { name: 'Toast University', url: 'https://university.toasttab.com', description: 'Official training platform' },
      { name: 'Toast Support Center', url: 'https://support.toasttab.com', description: '24/7 support documentation' },
      { name: 'Toast Blog', url: 'https://pos.toasttab.com/blog', description: 'Restaurant industry insights' },
      { name: 'Toast Webinar Series', url: 'https://pos.toasttab.com/webinars', description: 'Educational webinars for restaurateurs' },
      { name: 'Toast App Marketplace', url: 'https://pos.toasttab.com/integrations', description: 'Third-party app integrations' },
      { name: 'Restaurant Success Stories', url: 'https://pos.toasttab.com/customers', description: 'Case studies and success stories' }
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
              <CardContent className="space-y-8">
                <p className="text-lg">{systemData.description}</p>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-3 text-primary">Company Information</h3>
                      <div className="space-y-2 text-sm bg-muted/20 p-4 rounded-lg">
                        {systemData.founded && <div><span className="font-medium">Founded:</span> {systemData.founded}</div>}
                        {systemData.headquarters && <div><span className="font-medium">Headquarters:</span> {systemData.headquarters}</div>}
                        {systemData.marketShare && <div><span className="font-medium">Market Share:</span> {systemData.marketShare}</div>}
                        {systemData.employeeCount && <div><span className="font-medium">Employees:</span> {systemData.employeeCount}</div>}
                        {systemData.valuation && <div><span className="font-medium">Valuation:</span> {systemData.valuation}</div>}
                        {systemData.processingVolume && <div><span className="font-medium">Processing Volume:</span> {systemData.processingVolume}</div>}
                        {systemData.restaurantCount && <div><span className="font-medium">Restaurants:</span> {systemData.restaurantCount}</div>}
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

                    {systemData.pricing && (
                      <div>
                        <h3 className="font-semibold mb-3 text-primary">Pricing Plans</h3>
                        <div className="space-y-3">
                          {Object.values(systemData.pricing).map((plan: any, index: number) => (
                            <Card key={index} className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium">{plan.name}</h4>
                                <Badge variant="outline">{plan.cost}</Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {plan.features.slice(0, 3).map((feature: string, i: number) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <CheckCircle className="w-3 h-3 text-green-500" />
                                    {feature}
                                  </div>
                                ))}
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-3 text-primary">Key Strengths</h3>
                      <div className="space-y-2">
                         {systemData.strengths?.slice(0, 6).map((strength: string, index: number) => (
                           <div key={index} className="flex items-start gap-2">
                             <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                             <span className="text-sm">{strength}</span>
                           </div>
                         ))}
                       </div>
                     </div>

                     {systemData.idealFor && (
                       <div>
                         <h3 className="font-semibold mb-3 text-primary">Ideal For</h3>
                         <div className="space-y-2">
                           {systemData.idealFor.map((use: string, index: number) => (
                             <div key={index} className="flex items-center gap-2">
                               <Target className="w-4 h-4 text-blue-500 flex-shrink-0" />
                               <span className="text-sm">{use}</span>
                             </div>
                           ))}
                         </div>
                       </div>
                     )}
                   </div>
                 </div>

                 {systemData.keyFeatures && (
                   <div>
                     <h3 className="font-semibold mb-4 text-primary">Key Features & Capabilities</h3>
                     <div className="grid md:grid-cols-2 gap-4">
                       {Object.entries(systemData.keyFeatures).map(([feature, info]: [string, any]) => (
                         <Card key={feature} className="p-4">
                           <h4 className="font-medium mb-2">{feature}</h4>
                           <p className="text-sm text-muted-foreground mb-3">{info.description}</p>
                           <div className="space-y-1">
                             {info.details.slice(0, 3).map((detail: string, i: number) => (
                               <div key={i} className="flex items-center gap-2 text-xs">
                                 <div className="w-1 h-1 bg-primary rounded-full"></div>
                                 {detail}
                               </div>
                             ))}
                           </div>
                         </Card>
                       ))}
                     </div>
                   </div>
                 )}

                 {systemData.hardwareOptions && (
                   <div>
                     <h3 className="font-semibold mb-3 text-primary">Hardware Options</h3>
                     <div className="grid gap-3">
                       {systemData.hardwareOptions.map((hardware: string, index: number) => (
                         <div key={index} className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                           <div className="w-2 h-2 bg-primary rounded-full"></div>
                           <span className="text-sm">{hardware}</span>
                         </div>
                       ))}
                     </div>
                   </div>
                 )}

                 {systemData.integrations && (
                   <div>
                     <h3 className="font-semibold mb-3 text-primary">Popular Integrations</h3>
                     <div className="flex flex-wrap gap-2">
                       {systemData.integrations.slice(0, 12).map((integration: string, index: number) => (
                         <Badge key={index} variant="secondary" className="text-xs">
                           {integration}
                         </Badge>
                       ))}
                     </div>
                   </div>
                 )}
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