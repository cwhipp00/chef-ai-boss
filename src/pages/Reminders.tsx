import { useState } from 'react';
import { Bell, Plus, Calendar, Clock, Wrench, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import AddReminderModal from '@/components/reminders/AddReminderModal';

const reminders = [
  {
    id: 1,
    title: "Temperature Log Check",
    description: "Record freezer and refrigerator temperatures",
    type: "daily",
    category: "safety",
    time: "6:00 AM, 2:00 PM, 10:00 PM",
    priority: "high",
    completed: false,
    nextDue: "Today, 2:00 PM"
  },
  {
    id: 2,
    title: "Oil Filter Change - Fryer #1",
    description: "Replace oil filter and clean fryer basin",
    type: "daily",
    category: "maintenance",
    time: "End of shift",
    priority: "medium",
    completed: true,
    nextDue: "Tomorrow, 11:00 PM"
  },
  {
    id: 3,
    title: "Deep Clean Walk-in Cooler",
    description: "Complete sanitization of walk-in refrigeration unit",
    type: "weekly",
    category: "cleaning",
    time: "Sunday, 2:00 PM",
    priority: "high",
    completed: false,
    nextDue: "This Sunday"
  },
  {
    id: 4,
    title: "Equipment Maintenance Inspection",
    description: "Monthly safety and maintenance check for all kitchen equipment",
    type: "monthly",
    category: "maintenance",
    time: "First Monday of month",
    priority: "high",
    completed: false,
    nextDue: "Next Monday"
  },
  {
    id: 5,
    title: "Inventory Count",
    description: "Complete inventory count and reconciliation",
    type: "weekly",
    category: "operations",
    time: "Sunday, 10:00 AM",
    priority: "medium",
    completed: false,
    nextDue: "This Sunday"
  },
  {
    id: 6,
    title: "HVAC Filter Replacement",
    description: "Replace air filters in kitchen ventilation system",
    type: "monthly",
    category: "maintenance",
    time: "15th of each month",
    priority: "medium",
    completed: true,
    nextDue: "Next month"
  }
];

const categoryIcons = {
  safety: AlertTriangle,
  maintenance: Wrench,
  cleaning: CheckCircle,
  operations: Calendar
};

const categoryColors = {
  safety: "text-destructive",
  maintenance: "text-warning",
  cleaning: "text-success",
  operations: "text-primary"
};

export default function Reminders() {
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [completedTasks, setCompletedTasks] = useState(new Set(reminders.filter(r => r.completed).map(r => r.id)));
  const [allReminders, setAllReminders] = useState(reminders);
  const [isAddReminderOpen, setIsAddReminderOpen] = useState(false);

  const handleReminderAdded = (newReminder: any) => {
    setAllReminders(prev => [...prev, newReminder]);
  };

  const filterReminders = () => {
    let filtered = allReminders;
    
    if (selectedTab !== 'all') {
      filtered = filtered.filter(reminder => {
        if (selectedTab === 'pending') return !reminder.completed;
        if (selectedTab === 'completed') return reminder.completed;
        if (selectedTab === 'overdue') {
          // Simple logic for demo - in real app would check actual dates
          return !reminder.completed && reminder.priority === 'high';
        }
        return true;
      });
    }
    
    if (selectedType !== 'all') {
      filtered = filtered.filter(reminder => reminder.type === selectedType);
    }
    
    return filtered;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-destructive bg-destructive/5';
      case 'medium': return 'border-l-warning bg-warning/5';
      case 'low': return 'border-l-success bg-success/5';
      default: return 'border-l-muted';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return <Badge variant="destructive">High</Badge>;
      case 'medium': return <Badge className="bg-warning text-warning-foreground">Medium</Badge>;
      case 'low': return <Badge className="bg-success text-success-foreground">Low</Badge>;
      default: return <Badge variant="outline">Normal</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'daily': return <Badge>Daily</Badge>;
      case 'weekly': return <Badge variant="secondary">Weekly</Badge>;
      case 'monthly': return <Badge variant="outline">Monthly</Badge>;
      default: return <Badge variant="outline">{type}</Badge>;
    }
  };

  const toggleTaskCompletion = (taskId: number) => {
    const newCompleted = new Set(completedTasks);
    if (newCompleted.has(taskId)) {
      newCompleted.delete(taskId);
    } else {
      newCompleted.add(taskId);
    }
    setCompletedTasks(newCompleted);
  };

  return (
    <div className="p-3 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 lg:space-y-8 bg-gradient-to-br from-background via-background/95 to-primary/5 min-h-screen">
      {/* Responsive Header - Optimized for Tablet */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-primary opacity-5 rounded-xl sm:rounded-2xl blur-xl"></div>
        <div className="relative glass-card p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl border-primary/20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 lg:gap-6">
            <div className="space-y-2 lg:space-y-3">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="p-2 lg:p-3 bg-gradient-primary rounded-xl flex-shrink-0">
                  <Bell className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-white" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    Reminders & Tasks
                  </h1>
                  <p className="text-sm sm:text-base lg:text-lg text-muted-foreground hidden sm:block">Operational excellence through systematic tracking</p>
                  <p className="text-xs text-muted-foreground sm:hidden">Track your daily operations</p>
                </div>
              </div>
            </div>
            <Button 
              size="sm" 
              className="bg-gradient-primary hover:shadow-glow transition-all hover:scale-105 w-full sm:w-auto lg:px-8 lg:py-6 lg:text-base touch-target"
              onClick={() => setIsAddReminderOpen(true)}
            >
              <Plus className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
              Add Reminder
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4 sm:space-y-6 lg:space-y-8">
        <div className="glass-card p-3 sm:p-4 lg:p-6 rounded-xl border-primary/10">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-background/50 backdrop-blur-sm gap-1 lg:gap-2 lg:p-2">
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-glow transition-all text-xs sm:text-sm lg:text-base lg:py-3 touch-target"
            >
              All
            </TabsTrigger>
            <TabsTrigger 
              value="pending"
              className="data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-glow transition-all text-xs sm:text-sm lg:text-base lg:py-3 touch-target" 
            >
              Pending
            </TabsTrigger>
            <TabsTrigger 
              value="completed"
              className="data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-glow transition-all text-xs sm:text-sm lg:text-base lg:py-3 touch-target"
            >
              Done
            </TabsTrigger>
            <TabsTrigger 
              value="overdue"
              className="data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-glow transition-all text-xs sm:text-sm lg:text-base lg:py-3 touch-target"
            >
              Overdue
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="glass-card p-3 sm:p-4 lg:p-6 rounded-xl border-primary/10">
          <div className="grid grid-cols-2 sm:flex gap-2 lg:gap-4">
            <Button
              variant={selectedType === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType('all')}
              className={`${selectedType === 'all' ? 'bg-gradient-primary text-white shadow-glow' : 'hover:bg-primary/10 transition-all'} text-xs sm:text-sm lg:text-base lg:px-6 lg:py-4 touch-target`}
            >
              All
            </Button>
            <Button
              variant={selectedType === 'daily' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType('daily')}
              className={`${selectedType === 'daily' ? 'bg-gradient-primary text-white shadow-glow' : 'hover:bg-primary/10 transition-all'} text-xs sm:text-sm lg:text-base lg:px-6 lg:py-4 touch-target`}
            >
              Daily
            </Button>
            <Button
              variant={selectedType === 'weekly' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType('weekly')}
              className={`${selectedType === 'weekly' ? 'bg-gradient-primary text-white shadow-glow' : 'hover:bg-primary/10 transition-all'} text-xs sm:text-sm lg:text-base lg:px-6 lg:py-4 touch-target`}
            >
              Weekly
            </Button>
            <Button
              variant={selectedType === 'monthly' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType('monthly')}
              className={`${selectedType === 'monthly' ? 'bg-gradient-primary text-white shadow-glow' : 'hover:bg-primary/10 transition-all'} text-xs sm:text-sm lg:text-base lg:px-6 lg:py-4 touch-target`}
            >
              Monthly
            </Button>
          </div>
        </div>

        <TabsContent value={selectedTab} className="space-y-3 sm:space-y-4 lg:space-y-6">
          {filterReminders().map((reminder) => {
            const CategoryIcon = categoryIcons[reminder.category as keyof typeof categoryIcons];
            const isCompleted = completedTasks.has(reminder.id);
            return (
              <Card key={reminder.id} className={`border-l-4 ${getPriorityColor(reminder.priority)} glass-card hover-lift transition-all duration-300 hover:shadow-elegant lg:p-2`}>
                <CardHeader className="pb-3 sm:pb-4 lg:pb-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 lg:gap-4 flex-1 min-w-0">
                      <Checkbox 
                        checked={isCompleted}
                        onCheckedChange={() => toggleTaskCompletion(reminder.id)}
                        className="mt-1 data-[state=checked]:bg-gradient-primary data-[state=checked]:border-primary transition-all flex-shrink-0 lg:scale-125 touch-target"
                      />
                      <div className="min-w-0 flex-1">
                        <CardTitle className={`text-base sm:text-lg lg:text-xl transition-all ${isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                          {reminder.title}
                        </CardTitle>
                        <p className={`text-sm lg:text-base text-muted-foreground mt-1 lg:mt-2 transition-all ${isCompleted ? 'line-through opacity-60' : ''}`}>
                          {reminder.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 lg:gap-3 flex-shrink-0">
                      {getPriorityBadge(reminder.priority)}
                      <div className="hidden sm:block">{getTypeBadge(reminder.type)}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 lg:gap-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 lg:gap-6">
                      <div className="flex items-center gap-2 px-2 sm:px-3 lg:px-4 py-1 lg:py-2 rounded-full bg-background/50 backdrop-blur-sm">
                        <CategoryIcon className={`h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 ${categoryColors[reminder.category as keyof typeof categoryColors]}`} />
                        <span className="text-xs sm:text-sm lg:text-base text-muted-foreground capitalize">{reminder.category}</span>
                      </div>
                      <div className="flex items-center gap-2 px-2 sm:px-3 lg:px-4 py-1 lg:py-2 rounded-full bg-background/50 backdrop-blur-sm">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-muted-foreground" />
                        <span className="text-xs sm:text-sm lg:text-base text-muted-foreground">{reminder.time}</span>
                      </div>
                      <div className="sm:hidden">{getTypeBadge(reminder.type)}</div>
                    </div>
                    <div className="flex items-center gap-2 px-2 sm:px-3 lg:px-4 py-1 lg:py-2 rounded-full bg-primary/10 backdrop-blur-sm">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-primary" />
                      <span className="text-xs sm:text-sm lg:text-base font-medium text-primary">{reminder.nextDue}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>

      {/* Tablet-Optimized Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8 mt-6 sm:mt-8 lg:mt-12">
        <Card className="glass-card hover-lift border-destructive/20 hover:border-destructive/40 transition-all duration-300 lg:p-2">
          <CardHeader className="pb-2 sm:pb-3 lg:pb-4">
            <CardTitle className="text-xs sm:text-sm lg:text-base font-medium flex items-center gap-2 lg:gap-3">
              <div className="p-1 lg:p-2 bg-destructive/10 rounded-lg">
                <Bell className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-destructive" />
              </div>
              <span className="hidden sm:inline">Overdue</span>
              <span className="sm:hidden">Due</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-destructive animate-pulse">
              {reminders.filter(r => !completedTasks.has(r.id) && r.priority === 'high').length}
            </div>
            <p className="text-xs lg:text-sm text-destructive/70 mt-1">High priority</p>
          </CardContent>
        </Card>

        <Card className="glass-card hover-lift border-warning/20 hover:border-warning/40 transition-all duration-300 lg:p-2">
          <CardHeader className="pb-2 sm:pb-3 lg:pb-4">
            <CardTitle className="text-xs sm:text-sm lg:text-base font-medium flex items-center gap-2 lg:gap-3">
              <div className="p-1 lg:p-2 bg-warning/10 rounded-lg">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-warning" />
              </div>
              <span className="hidden sm:inline">Due Today</span>
              <span className="sm:hidden">Today</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-warning">
              {reminders.filter(r => !completedTasks.has(r.id) && r.type === 'daily').length}
            </div>
            <p className="text-xs lg:text-sm text-warning/70 mt-1">Daily tasks</p>
          </CardContent>
        </Card>

        <Card className="glass-card hover-lift border-success/20 hover:border-success/40 transition-all duration-300 lg:p-2">
          <CardHeader className="pb-2 sm:pb-3 lg:pb-4">
            <CardTitle className="text-xs sm:text-sm lg:text-base font-medium flex items-center gap-2 lg:gap-3">
              <div className="p-1 lg:p-2 bg-success/10 rounded-lg">
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-success" />
              </div>
              <span className="hidden sm:inline">Completed</span>
              <span className="sm:hidden">Done</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-success">
              {completedTasks.size}
            </div>
            <p className="text-xs lg:text-sm text-success/70 mt-1">Tasks finished</p>
          </CardContent>
        </Card>

        <Card className="glass-card hover-lift border-primary/20 hover:border-primary/40 transition-all duration-300 lg:p-2">
          <CardHeader className="pb-2 sm:pb-3 lg:pb-4">
            <CardTitle className="text-xs sm:text-sm lg:text-base font-medium flex items-center gap-2 lg:gap-3">
              <div className="p-1 lg:p-2 bg-primary/10 rounded-lg">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-primary" />
              </div>
              <span className="hidden sm:inline">This Week</span>
              <span className="sm:hidden">Week</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">
              {reminders.filter(r => r.type === 'weekly').length}
            </div>
            <p className="text-xs lg:text-sm text-primary/70 mt-1">Weekly tasks</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}