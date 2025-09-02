import { useState } from 'react';
import { Bell, Plus, Calendar, Clock, Wrench, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

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

  const filterReminders = () => {
    let filtered = reminders;
    
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
    <div className="p-6 space-y-6 bg-gradient-to-br from-background via-background/95 to-primary/5 min-h-screen">
      {/* Enhanced Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-primary opacity-5 rounded-2xl blur-xl"></div>
        <div className="relative glass-card p-6 rounded-2xl border-primary/20">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-primary rounded-xl">
                  <Bell className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    Reminders & Tasks
                  </h1>
                  <p className="text-muted-foreground">Operational excellence through systematic tracking</p>
                </div>
              </div>
            </div>
            <Button size="lg" className="bg-gradient-primary hover:shadow-glow transition-all hover:scale-105">
              <Plus className="h-4 w-4 mr-2" />
              Add Reminder
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <div className="glass-card p-4 rounded-xl border-primary/10">
          <TabsList className="grid w-full grid-cols-4 bg-background/50 backdrop-blur-sm">
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-glow transition-all"
            >
              All Tasks
            </TabsTrigger>
            <TabsTrigger 
              value="pending"
              className="data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-glow transition-all" 
            >
              Pending
            </TabsTrigger>
            <TabsTrigger 
              value="completed"
              className="data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-glow transition-all"
            >
              Completed
            </TabsTrigger>
            <TabsTrigger 
              value="overdue"
              className="data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-glow transition-all"
            >
              Overdue
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="glass-card p-4 rounded-xl border-primary/10">
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedType === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType('all')}
              className={selectedType === 'all' ? 'bg-gradient-primary text-white shadow-glow' : 'hover:bg-primary/10 transition-all'}
            >
              All Types
            </Button>
            <Button
              variant={selectedType === 'daily' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType('daily')}
              className={selectedType === 'daily' ? 'bg-gradient-primary text-white shadow-glow' : 'hover:bg-primary/10 transition-all'}
            >
              Daily
            </Button>
            <Button
              variant={selectedType === 'weekly' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType('weekly')}
              className={selectedType === 'weekly' ? 'bg-gradient-primary text-white shadow-glow' : 'hover:bg-primary/10 transition-all'}
            >
              Weekly
            </Button>
            <Button
              variant={selectedType === 'monthly' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType('monthly')}
              className={selectedType === 'monthly' ? 'bg-gradient-primary text-white shadow-glow' : 'hover:bg-primary/10 transition-all'}
            >
              Monthly
            </Button>
          </div>
        </div>

        <TabsContent value={selectedTab} className="space-y-4">
          {filterReminders().map((reminder) => {
            const CategoryIcon = categoryIcons[reminder.category as keyof typeof categoryIcons];
            const isCompleted = completedTasks.has(reminder.id);
            return (
              <Card key={reminder.id} className={`border-l-4 ${getPriorityColor(reminder.priority)} glass-card hover-lift transition-all duration-300 hover:shadow-elegant`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Checkbox 
                        checked={isCompleted}
                        onCheckedChange={() => toggleTaskCompletion(reminder.id)}
                        className="mt-1 data-[state=checked]:bg-gradient-primary data-[state=checked]:border-primary transition-all"
                      />
                      <div>
                        <CardTitle className={`text-lg transition-all ${isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                          {reminder.title}
                        </CardTitle>
                        <p className={`text-muted-foreground mt-1 transition-all ${isCompleted ? 'line-through opacity-60' : ''}`}>
                          {reminder.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {getPriorityBadge(reminder.priority)}
                      {getTypeBadge(reminder.type)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-background/50 backdrop-blur-sm">
                        <CategoryIcon className={`h-4 w-4 ${categoryColors[reminder.category as keyof typeof categoryColors]}`} />
                        <span className="text-sm text-muted-foreground capitalize">{reminder.category}</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-background/50 backdrop-blur-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{reminder.time}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 backdrop-blur-sm">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-primary">{reminder.nextDue}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <Card className="glass-card hover-lift border-destructive/20 hover:border-destructive/40 transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <div className="p-1 bg-destructive/10 rounded-lg">
                <Bell className="h-4 w-4 text-destructive" />
              </div>
              Overdue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive animate-pulse">
              {reminders.filter(r => !completedTasks.has(r.id) && r.priority === 'high').length}
            </div>
            <p className="text-xs text-destructive/70 mt-1">High priority tasks</p>
          </CardContent>
        </Card>

        <Card className="glass-card hover-lift border-warning/20 hover:border-warning/40 transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <div className="p-1 bg-warning/10 rounded-lg">
                <Clock className="h-4 w-4 text-warning" />
              </div>
              Due Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">
              {reminders.filter(r => !completedTasks.has(r.id) && r.type === 'daily').length}
            </div>
            <p className="text-xs text-warning/70 mt-1">Daily tasks pending</p>
          </CardContent>
        </Card>

        <Card className="glass-card hover-lift border-success/20 hover:border-success/40 transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <div className="p-1 bg-success/10 rounded-lg">
                <CheckCircle className="h-4 w-4 text-success" />
              </div>
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">
              {completedTasks.size}
            </div>
            <p className="text-xs text-success/70 mt-1">Tasks finished</p>
          </CardContent>
        </Card>

        <Card className="glass-card hover-lift border-primary/20 hover:border-primary/40 transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <div className="p-1 bg-primary/10 rounded-lg">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {reminders.filter(r => r.type === 'weekly').length}
            </div>
            <p className="text-xs text-primary/70 mt-1">Weekly schedule</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}