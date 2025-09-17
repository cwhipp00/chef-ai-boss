import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, DollarSign, Clock, Target, AlertCircle, CheckCircle, GraduationCap, AlertTriangle, Trophy, User, BookOpen, Star, Award, CreditCard, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import CashDrawer from '@/components/manager/CashDrawer';
import DailyCashSheet from '@/components/manager/DailyCashSheet';
import { AIMeetingNotes } from '@/components/manager/AIMeetingNotes';
import InjuryReportForm from '@/components/manager/InjuryReportForm';
import IncidentReportForm from '@/components/manager/IncidentReportForm';
import OnlineReviewTracker from '@/components/reviews/OnlineReviewTracker';

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty_level: string;
}

interface UserEnrollment {
  id: string;
  course_id: string;
  enrolled_at: string;
  completed_at?: string;
  progress_percent: number;
}

interface TrainingResult {
  employeeName: string;
  employeeRole: string;
  courseName: string;  
  courseCategory: string;
  completionDate: string | null;
  progress: number;
  quizScore: number;
  status: 'completed' | 'in-progress' | 'not-started';
}

const staffData = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Head Chef",
    status: "active",
    hoursWeek: 42,
    performance: 95,
    tasks: 8,
    tasksCompleted: 7
  },
  {
    id: 2,
    name: "Mike Rodriguez",
    role: "Sous Chef",
    status: "active",
    hoursWeek: 38,
    performance: 87,
    tasks: 6,
    tasksCompleted: 5
  },
  {
    id: 3,
    name: "Emily Chen",
    role: "Server",
    status: "break",
    hoursWeek: 32,
    performance: 92,
    tasks: 4,
    tasksCompleted: 4
  },
  {
    id: 4,
    name: "David Park",
    role: "Line Cook",
    status: "active",
    hoursWeek: 40,
    performance: 78,
    tasks: 5,
    tasksCompleted: 3
  }
];

const kpis = [
  {
    title: "Daily Revenue",
    value: "$4,250",
    change: "+12.5%",
    icon: DollarSign,
    color: "text-success"
  },
  {
    title: "Labor Cost %",
    value: "28.3%",
    change: "-2.1%",
    icon: TrendingUp,
    color: "text-success"
  },
  {
    title: "Customer Satisfaction",
    value: "4.7/5",
    change: "+0.2",
    icon: Target,
    color: "text-success"
  },
  {
    title: "Order Accuracy",
    value: "94.2%",
    change: "+1.8%",
    icon: CheckCircle,
    color: "text-success"
  }
];

const issues = [
  {
    id: 1,
    title: "Equipment Maintenance",
    description: "Fryer #2 scheduled for maintenance",
    priority: "high",
    dueDate: "Today, 3:00 PM",
    assignee: "Maintenance Team"
  },
  {
    id: 2,
    title: "Inventory Alert",
    description: "Salmon stock running low",
    priority: "medium",
    dueDate: "Tomorrow",
    assignee: "Kitchen Manager"
  },
  {
    id: 3,
    title: "Staff Schedule",
    description: "Sunday shift needs coverage",
    priority: "low",
    dueDate: "This Week",
    assignee: "HR Manager"
  }
];

export default function Manager() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [trainingResults, setTrainingResults] = useState<TrainingResult[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<UserEnrollment[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (selectedTab === 'training-results') {
      fetchTrainingData();
    }
  }, [selectedTab]);

  const fetchTrainingData = async () => {
    setLoading(true);
    try {
      // Fetch courses
      const { data: coursesData } = await supabase
        .from('courses')
        .select('*');
      
      // Fetch enrollments with user profiles
      const { data: enrollmentsData } = await supabase
        .from('user_enrollments')
        .select(`
          *,
          courses!inner(title, category, difficulty_level),
          profiles!inner(display_name, role)
        `);

      setCourses(coursesData || []);
      setEnrollments(enrollmentsData || []);

      // Transform data for training results
      const results: TrainingResult[] = (enrollmentsData || []).map((enrollment: any) => ({
        employeeName: enrollment.profiles?.display_name || 'Unknown Employee',
        employeeRole: enrollment.profiles?.role || 'Staff',
        courseName: enrollment.courses?.title || 'Unknown Course',
        courseCategory: enrollment.courses?.category || 'General',
        completionDate: enrollment.completed_at,
        progress: enrollment.progress_percent || 0,
        quizScore: Math.floor(Math.random() * 20) + 80, // Mock quiz score
        status: enrollment.completed_at ? 'completed' : 
                enrollment.progress_percent > 0 ? 'in-progress' : 'not-started'
      }));

      setTrainingResults(results);
    } catch (error) {
      console.error('Error fetching training data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-success text-success-foreground">Active</Badge>;
      case 'break': return <Badge variant="secondary">On Break</Badge>;
      case 'off': return <Badge variant="outline">Off Duty</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-destructive bg-destructive/5';
      case 'medium': return 'border-l-warning bg-warning/5';
      case 'low': return 'border-l-success bg-success/5';
      default: return 'border-l-muted';
    }
  };

  return (
    <div className="p-6 space-y-6 ml-0 sm:ml-8 lg:ml-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground ml-4 sm:ml-0">Manager Dashboard</h1>
          <p className="text-muted-foreground ml-4 sm:ml-0">Monitor operations, staff, and performance</p>
        </div>
        <Button size="lg" className="bg-gradient-primary mr-4 sm:mr-0">
          <AlertCircle className="h-4 w-4 mr-2" />
          Create Alert
        </Button>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        {/* Desktop tabs */}
        <TabsList className="hidden lg:grid w-full grid-cols-10">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="issues">Issues</TabsTrigger>
          <TabsTrigger value="training-results">Training</TabsTrigger>
          <TabsTrigger value="cash-management">Cash</TabsTrigger>
          <TabsTrigger value="ai-meeting-notes">Meetings</TabsTrigger>
          <TabsTrigger value="injury-reports">Injuries</TabsTrigger>
          <TabsTrigger value="incident-reports">Incidents</TabsTrigger>
          <TabsTrigger value="review-tracker">Reviews</TabsTrigger>
        </TabsList>

        {/* Mobile dropdown */}
        <div className="lg:hidden">
          <Select value={selectedTab} onValueChange={setSelectedTab}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select section" />
              <ChevronDown className="h-4 w-4 opacity-50" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overview">Overview</SelectItem>
              <SelectItem value="staff">Staff Management</SelectItem>
              <SelectItem value="performance">Performance</SelectItem>
              <SelectItem value="issues">Issues & Alerts</SelectItem>
              <SelectItem value="training-results">Training Results</SelectItem>
              <SelectItem value="cash-management">Cash Management</SelectItem>
              <SelectItem value="ai-meeting-notes">AI Meeting Notes</SelectItem>
              <SelectItem value="injury-reports">Injury Reports</SelectItem>
              <SelectItem value="incident-reports">Incident Reports</SelectItem>
              <SelectItem value="review-tracker">Review Tracker</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpis.map((kpi, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                  <kpi.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{kpi.value}</div>
                  <p className={`text-xs ${kpi.color}`}>
                    {kpi.change} from last week
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Staff Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {staffData.slice(0, 4).map((staff) => (
                    <div key={staff.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                          <span className="text-xs font-medium text-primary-foreground">
                            {staff.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-sm">{staff.name}</p>
                          <p className="text-xs text-muted-foreground">{staff.role}</p>
                        </div>
                      </div>
                      {getStatusBadge(staff.status)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Today's Priorities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {issues.slice(0, 3).map((issue) => (
                    <div key={issue.id} className={`p-3 border-l-4 rounded ${getPriorityColor(issue.priority)}`}>
                      <h4 className="font-medium text-sm">{issue.title}</h4>
                      <p className="text-xs text-muted-foreground">{issue.description}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-muted-foreground">{issue.assignee}</span>
                        <span className="text-xs font-medium">{issue.dueDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="staff" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {staffData.map((staff) => (
              <Card key={staff.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{staff.name}</CardTitle>
                      <p className="text-muted-foreground">{staff.role}</p>
                    </div>
                    {getStatusBadge(staff.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Weekly Hours</span>
                      <span className="font-medium">{staff.hoursWeek}h</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Performance</span>
                      <span className="font-medium">{staff.performance}%</span>
                    </div>
                    <Progress value={staff.performance} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Tasks Progress</span>
                      <span className="font-medium">{staff.tasksCompleted}/{staff.tasks}</span>
                    </div>
                    <Progress value={(staff.tasksCompleted / staff.tasks) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">$4,250</div>
                <p className="text-sm text-muted-foreground">Today's revenue</p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Target</span>
                    <span>$4,000</span>
                  </div>
                  <Progress value={106.25} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Kitchen Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">8.5 min</div>
                <p className="text-sm text-muted-foreground">Avg prep time</p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Target</span>
                    <span>10 min</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Satisfaction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">4.7/5</div>
                <p className="text-sm text-muted-foreground">Average rating</p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Target</span>
                    <span>4.5/5</span>
                  </div>
                  <Progress value={94} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="issues" className="space-y-6">
          <div className="space-y-4">
            {issues.map((issue) => (
              <Card key={issue.id} className={`border-l-4 ${getPriorityColor(issue.priority)}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{issue.title}</CardTitle>
                    <Badge variant={issue.priority === 'high' ? 'destructive' : issue.priority === 'medium' ? 'default' : 'secondary'}>
                      {issue.priority} priority
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">{issue.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{issue.assignee}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{issue.dueDate}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="training-results" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Employee Training Performance & Course Completion
              </CardTitle>
              <CardDescription>
                Real-time tracking of staff training progress and course completion across all modules
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Summary Stats */}
                  <div className="grid gap-4 md:grid-cols-4">
                    <Card className="p-4">
                      <div className="text-2xl font-bold text-green-600">
                        {trainingResults.filter(r => r.status === 'completed').length}
                      </div>
                      <p className="text-xs text-muted-foreground">Courses Completed</p>
                    </Card>
                    <Card className="p-4">
                      <div className="text-2xl font-bold text-blue-600">
                        {trainingResults.filter(r => r.status === 'in-progress').length}
                      </div>
                      <p className="text-xs text-muted-foreground">In Progress</p>
                    </Card>
                    <Card className="p-4">
                      <div className="text-2xl font-bold text-purple-600">
                        {trainingResults.length > 0 ? 
                          Math.round(trainingResults.reduce((sum, r) => sum + r.quizScore, 0) / trainingResults.length) : 0}%
                      </div>
                      <p className="text-xs text-muted-foreground">Average Quiz Score</p>
                    </Card>
                    <Card className="p-4">
                      <div className="text-2xl font-bold text-orange-600">
                        {trainingResults.length > 0 ? 
                          Math.round(trainingResults.reduce((sum, r) => sum + r.progress, 0) / trainingResults.length) : 0}%
                      </div>
                      <p className="text-xs text-muted-foreground">Overall Progress</p>
                    </Card>
                  </div>

                  {/* Individual Training Results */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Individual Course Performance</h3>
                    {trainingResults.length > 0 ? (
                      <div className="space-y-3">
                        {trainingResults.map((result, index) => (
                          <Card key={index} className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center">
                                  <User className="h-5 w-5" />
                                </div>
                                <div>
                                  <p className="font-medium">{result.employeeName}</p>
                                  <p className="text-sm text-muted-foreground">{result.employeeRole}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-6">
                                <div className="text-center">
                                  <p className="text-sm font-medium mb-1">Course</p>
                                  <div className="flex items-center gap-2">
                                    <BookOpen className="h-4 w-4 text-primary" />
                                    <span className="text-sm max-w-[200px] truncate" title={result.courseName}>
                                      {result.courseName}
                                    </span>
                                  </div>
                                  <Badge variant="outline" className="text-xs mt-1">
                                    {result.courseCategory.replace('pos-', '').replace('-', ' ')}
                                  </Badge>
                                </div>
                                
                                <div className="text-center">
                                  <p className="text-sm font-medium mb-1">Progress</p>
                                  <div className="flex items-center gap-2">
                                    <Progress value={result.progress} className="w-20" />
                                    <span className="text-xs text-muted-foreground w-12">
                                      {result.progress}%
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="text-center">
                                  <p className="text-sm font-medium mb-1">Quiz Score</p>
                                  <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 text-yellow-500" />
                                    <span className="text-sm font-bold">
                                      {result.quizScore}%
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="text-center">
                                  <p className="text-sm font-medium mb-1">Status</p>
                                  <Badge 
                                    variant={result.status === 'completed' ? "default" : 
                                            result.status === 'in-progress' ? "secondary" : "outline"}
                                    className="flex items-center gap-1"
                                  >
                                    {result.status === 'completed' && <CheckCircle className="h-3 w-3" />}
                                    {result.status === 'completed' ? 'Completed' :
                                     result.status === 'in-progress' ? 'In Progress' : 'Not Started'}
                                  </Badge>
                                  {result.completionDate && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {new Date(result.completionDate).toLocaleDateString()}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <Card className="p-8 text-center">
                        <GraduationCap className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-semibold mb-2">No Training Data Found</h3>
                        <p className="text-muted-foreground">
                          No employee training records found. Training data will appear here as employees enroll in and complete courses.
                        </p>
                      </Card>
                    )}
                  </div>

                  {/* POS System Training Filter */}
                  {trainingResults.some(r => r.courseCategory.startsWith('pos-')) && (
                    <div className="border rounded-lg p-4 bg-muted/50">
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <Award className="h-5 w-5 text-blue-500" />
                        POS System Training Performance
                      </h3>
                      <div className="grid gap-2 md:grid-cols-3">
                        {['pos-square', 'pos-toast', 'pos-clover'].map(posSystem => {
                          const systemResults = trainingResults.filter(r => r.courseCategory === posSystem);
                          const completed = systemResults.filter(r => r.status === 'completed').length;
                          const total = systemResults.length || 1;
                          
                          return systemResults.length > 0 ? (
                            <div key={posSystem} className="p-3 bg-card rounded border">
                              <p className="font-medium text-sm">
                                {posSystem.replace('pos-', '').toUpperCase()} POS
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <Progress value={(completed / total) * 100} className="flex-1" />
                                <span className="text-xs">{completed}/{total}</span>
                              </div>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cash-management" className="space-y-6">
          <Tabs defaultValue="cash-drawer" className="space-y-4">
            <TabsList>
              <TabsTrigger value="cash-drawer" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Cash Drawer
              </TabsTrigger>
              <TabsTrigger value="daily-sheet" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Daily Cash Sheet
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="cash-drawer">
              <CashDrawer />
            </TabsContent>
            
            <TabsContent value="daily-sheet">
              <DailyCashSheet />
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="ai-meeting-notes">
          <AIMeetingNotes />
        </TabsContent>

        <TabsContent value="injury-reports">
          <InjuryReportForm />
        </TabsContent>

        <TabsContent value="incident-reports">
          <IncidentReportForm />
        </TabsContent>

        <TabsContent value="review-tracker">
          <OnlineReviewTracker />
        </TabsContent>
      </Tabs>
    </div>
  );
}