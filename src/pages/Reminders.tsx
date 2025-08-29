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

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reminders & Tasks</h1>
          <p className="text-muted-foreground">Daily, weekly, and monthly operational reminders</p>
        </div>
        <Button size="lg" className="bg-gradient-primary">
          <Plus className="h-4 w-4 mr-2" />
          Add Reminder
        </Button>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Tasks</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
        </TabsList>

        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedType === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedType('all')}
          >
            All Types
          </Button>
          <Button
            variant={selectedType === 'daily' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedType('daily')}
          >
            Daily
          </Button>
          <Button
            variant={selectedType === 'weekly' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedType('weekly')}
          >
            Weekly
          </Button>
          <Button
            variant={selectedType === 'monthly' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedType('monthly')}
          >
            Monthly
          </Button>
        </div>

        <TabsContent value={selectedTab} className="space-y-4">
          {filterReminders().map((reminder) => {
            const CategoryIcon = categoryIcons[reminder.category as keyof typeof categoryIcons];
            return (
              <Card key={reminder.id} className={`border-l-4 ${getPriorityColor(reminder.priority)}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Checkbox 
                        checked={reminder.completed}
                        className="mt-1 data-[state=checked]:bg-success data-[state=checked]:border-success"
                      />
                      <div>
                        <CardTitle className={`text-lg ${reminder.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {reminder.title}
                        </CardTitle>
                        <p className={`text-muted-foreground mt-1 ${reminder.completed ? 'line-through' : ''}`}>
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
                      <div className="flex items-center gap-2">
                        <CategoryIcon className={`h-4 w-4 ${categoryColors[reminder.category as keyof typeof categoryColors]}`} />
                        <span className="text-sm text-muted-foreground capitalize">{reminder.category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{reminder.time}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{reminder.nextDue}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Bell className="h-4 w-4 text-destructive" />
              Overdue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {reminders.filter(r => !r.completed && r.priority === 'high').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-warning" />
              Due Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {reminders.filter(r => !r.completed && r.type === 'daily').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-success" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {reminders.filter(r => r.completed).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {reminders.filter(r => r.type === 'weekly').length}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}