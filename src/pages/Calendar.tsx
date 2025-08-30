import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  CalendarDays, 
  Clock, 
  Users, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  MapPin,
  Bell,
  Repeat,
  Zap,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

// Enhanced event data with more fields for robust scheduling
const events = [
  {
    id: 1,
    title: "Staff Meeting",
    date: "2024-03-18",
    time: "09:00",
    endTime: "10:00",
    type: "meeting",
    attendees: 8,
    location: "Main Office",
    description: "Weekly team coordination meeting",
    priority: "medium",
    status: "confirmed",
    recurrence: "weekly",
    reminders: ["15min", "1hour"],
    created: "2024-03-10",
    assignedTo: "Manager"
  },
  {
    id: 2,
    title: "Private Event - Johnson Wedding",
    date: "2024-03-18",
    time: "18:00",
    endTime: "23:00",
    type: "private_event",
    attendees: 150,
    location: "Main Dining Room",
    description: "Wedding reception with special menu",
    priority: "high",
    status: "confirmed",
    recurrence: "none",
    reminders: ["1day", "2hours"],
    created: "2024-02-15",
    assignedTo: "Event Coordinator"
  },
  {
    id: 3,
    title: "Inventory Check",
    date: "2024-03-19",
    time: "08:00",
    endTime: "11:00",
    type: "maintenance",
    attendees: 3,
    location: "Storage",
    description: "Monthly inventory audit",
    priority: "high",
    status: "pending",
    recurrence: "monthly",
    reminders: ["1day"],
    created: "2024-03-01",
    assignedTo: "Inventory Manager"
  },
  {
    id: 4,
    title: "Equipment Maintenance",
    date: "2024-03-20",
    time: "14:00",
    endTime: "16:00",
    type: "maintenance",
    attendees: 2,
    location: "Kitchen",
    description: "Routine equipment check and cleaning",
    priority: "medium",
    status: "scheduled",
    recurrence: "weekly",
    reminders: ["30min"],
    created: "2024-03-12",
    assignedTo: "Maintenance Team"
  },
  {
    id: 5,
    title: "Supplier Visit - Fresh Produce",
    date: "2024-03-21",
    time: "10:30",
    endTime: "11:30",
    type: "supplier",
    attendees: 2,
    location: "Loading Dock",
    description: "Weekly produce delivery and quality check",
    priority: "medium",
    status: "confirmed",
    recurrence: "weekly",
    reminders: ["15min"],
    created: "2024-03-14",
    assignedTo: "Procurement"
  },
  {
    id: 6,
    title: "Staff Training - Food Safety",
    date: "2024-03-22",
    time: "15:00",
    endTime: "17:00",
    type: "training",
    attendees: 12,
    location: "Training Room",
    description: "Mandatory food safety certification training",
    priority: "high",
    status: "confirmed",
    recurrence: "quarterly",
    reminders: ["1week", "1day"],
    created: "2024-03-08",
    assignedTo: "HR Manager"
  }
];

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedView, setSelectedView] = useState<'month' | 'week' | 'day'>('month');
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [conflictResolution, setConflictResolution] = useState<'auto' | 'manual'>('auto');
  const { toast } = useToast();

  // Today's events (for demo, using fixed date)
  const todayEvents = events.filter(event => event.date === "2024-03-18");
  const upcomingEvents = events.filter(event => event.date > "2024-03-18").slice(0, 5);
  const conflictingEvents = events.filter(event => event.status === "pending");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    return new Date(`2024-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'bg-blue-500';
      case 'private_event': return 'bg-purple-500';
      case 'maintenance': return 'bg-orange-500';
      case 'supplier': return 'bg-green-500';
      case 'training': return 'bg-indigo-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'pending': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'scheduled': return <Clock className="h-4 w-4 text-blue-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const handleAutoReschedule = (eventId: number) => {
    // Simulate AI-powered rescheduling
    toast({
      title: "AI Rescheduling",
      description: "Analyzing optimal time slots for conflicting events...",
    });

    setTimeout(() => {
      toast({
        title: "Event Rescheduled",
        description: "Event automatically moved to next available slot with AI optimization",
      });
    }, 2000);
  };

  const createNewEvent = () => {
    setIsCreateEventOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Calendar & Events</h1>
          <p className="text-muted-foreground">Manage restaurant events and scheduling with AI assistance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleAutoReschedule(0)}>
            <Zap className="h-4 w-4 mr-2" />
            AI Optimize
          </Button>
          <Dialog open={isCreateEventOpen} onOpenChange={setIsCreateEventOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-gradient-primary">
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Event Title</Label>
                    <Input id="title" placeholder="Enter event title" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Event Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="meeting">Meeting</SelectItem>
                        <SelectItem value="private_event">Private Event</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="supplier">Supplier Visit</SelectItem>
                        <SelectItem value="training">Training</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input id="startTime" type="time" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input id="endTime" type="time" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" placeholder="Event location" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="attendees">Expected Attendees</Label>
                    <Input id="attendees" type="number" placeholder="Number of attendees" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Event description" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recurrence">Recurrence</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select recurrence" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setIsCreateEventOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  toast({
                    title: "Event Created",
                    description: "New event has been added to the calendar",
                  });
                  setIsCreateEventOpen(false);
                }} className="bg-gradient-primary">
                  Create Event
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={selectedView} onValueChange={(value: any) => setSelectedView(value)} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 max-w-md">
          <TabsTrigger value="month">Month</TabsTrigger>
          <TabsTrigger value="week">Week</TabsTrigger>
          <TabsTrigger value="day">Day</TabsTrigger>
          <TabsTrigger value="conflicts">Conflicts</TabsTrigger>
        </TabsList>

        <TabsContent value="month" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5 text-primary" />
                    {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => navigateMonth('prev')}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => navigateMonth('next')}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Calendar
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  month={currentMonth}
                  onMonthChange={setCurrentMonth}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            {/* Events Summary */}
            <div className="space-y-6">
              {/* Today's Schedule */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Today's Schedule</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {formatDate("2024-03-18")}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {todayEvents.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No events scheduled for today</p>
                    ) : (
                      todayEvents.map((event) => (
                        <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors cursor-pointer">
                          <div className="flex-shrink-0">
                            {getStatusIcon(event.status)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-sm truncate">{event.title}</h4>
                              <Badge className={`${getEventTypeColor(event.type)} text-xs`}>
                                {event.type.replace('_', ' ')}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatTime(event.time)} - {formatTime(event.endTime)}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {event.location}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Users className="h-3 w-3" />
                                {event.attendees}
                              </div>
                              <span className={`text-xs ${getPriorityColor(event.priority)}`}>
                                {event.priority} priority
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Events */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Upcoming Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {upcomingEvents.map((event) => (
                      <div key={event.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                        <Badge className={getEventTypeColor(event.type)} />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{event.title}</h4>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{formatDate(event.date)}</span>
                            <span>•</span>
                            <span>{formatTime(event.time)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="conflicts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Scheduling Conflicts
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                AI-powered conflict detection and resolution suggestions
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conflictingEvents.map((event) => (
                  <div key={event.id} className="border border-orange-200 rounded-lg p-4 bg-orange-50 dark:bg-orange-950/20">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">{event.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(event.date)} at {formatTime(event.time)} - {formatTime(event.endTime)}
                        </p>
                        <p className="text-xs text-orange-600 mt-1">
                          Conflict: Overlaps with kitchen maintenance schedule
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleAutoReschedule(event.id)}>
                          <Zap className="h-3 w-3 mr-1" />
                          Auto-Fix
                        </Button>
                        <Button size="sm" variant="outline">
                          Manual
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {conflictingEvents.length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No scheduling conflicts detected</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}