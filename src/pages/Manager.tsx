import { useState } from 'react';
import { Users, TrendingUp, DollarSign, Clock, Target, AlertCircle, CheckCircle, GraduationCap, AlertTriangle, Trophy, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

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
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manager Dashboard</h1>
          <p className="text-muted-foreground">Monitor operations, staff, and performance</p>
        </div>
        <Button size="lg" className="bg-gradient-primary">
          <AlertCircle className="h-4 w-4 mr-2" />
          Create Alert
        </Button>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="staff">Staff Management</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="issues">Issues & Alerts</TabsTrigger>
          <TabsTrigger value="training-results">Training Results</TabsTrigger>
        </TabsList>

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
                Employee Training & Quiz Results
              </CardTitle>
              <CardDescription>
                Monitor staff training progress and quiz performance across all modules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-4">
                  <Card className="p-4">
                    <div className="text-2xl font-bold text-green-600">85%</div>
                    <p className="text-xs text-muted-foreground">Overall Completion Rate</p>
                  </Card>
                  <Card className="p-4">
                    <div className="text-2xl font-bold text-blue-600">23</div>
                    <p className="text-xs text-muted-foreground">Active Training Modules</p>
                  </Card>
                  <Card className="p-4">
                    <div className="text-2xl font-bold text-purple-600">92%</div>
                    <p className="text-xs text-muted-foreground">Average Quiz Score</p>
                  </Card>
                  <Card className="p-4">
                    <div className="text-2xl font-bold text-orange-600">7</div>
                    <p className="text-xs text-muted-foreground">Pending Certifications</p>
                  </Card>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Individual Employee Results</h3>
                  <div className="space-y-3">
                    {staffData.map((staff) => (
                      <Card key={staff.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center">
                              <User className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-medium">{staff.name}</p>
                              <p className="text-sm text-muted-foreground">{staff.role}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <p className="text-sm font-medium">Training Progress</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Progress value={Math.floor(Math.random() * 40) + 60} className="w-24" />
                                <span className="text-xs text-muted-foreground">
                                  {Math.floor(Math.random() * 40) + 60}%
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">Quiz Average</p>
                              <div className="flex items-center gap-1 mt-1">
                                <Trophy className="h-4 w-4 text-yellow-500" />
                                <span className="text-sm font-bold">
                                  {Math.floor(Math.random() * 20) + 80}%
                                </span>
                              </div>
                            </div>
                            <Badge 
                              variant={Math.random() > 0.3 ? "default" : "secondary"}
                              className="flex items-center gap-1"
                            >
                              <CheckCircle className="h-3 w-3" />
                              {Math.random() > 0.3 ? "Certified" : "In Progress"}
                            </Badge>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="border rounded-lg p-6 bg-muted/50">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    Supabase Integration Required
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    The training results and quiz management system requires a database backend to store and track employee progress. 
                    Connect to Supabase to unlock full functionality including:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Real-time quiz result tracking</li>
                    <li>• Employee training assignment management</li>
                    <li>• Automated compliance reporting</li>
                    <li>• Performance analytics and insights</li>
                    <li>• Certification management and renewals</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}