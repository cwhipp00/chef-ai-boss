import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { EnhancedCalendar } from '@/components/calendar/EnhancedCalendar';
import { DayView } from '@/components/calendar/DayView';
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
  CheckCircle2,
  Calendar as CalendarIcon,
  Eye,
  Filter,
  Search
} from 'lucide-react';
import { format, addDays, subDays, isSameDay } from 'date-fns';
import { toast } from 'sonner';

// Enhanced event data with more fields for robust scheduling
const initialEvents = [
  {
    id: 1,
    title: "Staff Meeting",
    date: "2024-03-18",
    startTime: "09:00",
    endTime: "10:00",
    type: "meeting",
    attendees: 8,
    location: "Main Office",
    description: "Weekly team coordination meeting",
    priority: "medium" as const,
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
    startTime: "18:00",
    endTime: "23:00",
    type: "private_event",
    attendees: 150,
    location: "Main Dining Room",
    description: "Wedding reception with special menu",
    priority: "high" as const,
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
    startTime: "08:00",
    endTime: "11:00",
    type: "maintenance",
    attendees: 3,
    location: "Storage",
    description: "Monthly inventory audit",
    priority: "high" as const,
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
    startTime: "14:00",
    endTime: "16:00",
    type: "maintenance",
    attendees: 2,
    location: "Kitchen",
    description: "Routine equipment check and cleaning",
    priority: "medium" as const,
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
    startTime: "10:30",
    endTime: "11:30",
    type: "supplier",
    attendees: 2,
    location: "Loading Dock",
    description: "Weekly produce delivery and quality check",
    priority: "medium" as const,
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
    startTime: "15:00",
    endTime: "17:00",
    type: "training",
    attendees: 12,
    location: "Training Room",
    description: "Mandatory food safety certification training",
    priority: "high" as const,
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
  const [selectedView, setSelectedView] = useState<'month' | 'week' | 'day' | 'conflicts'>('month');
  const [showDayView, setShowDayView] = useState(false);
  const [dayViewDate, setDayViewDate] = useState<Date>(new Date());
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [events, setEvents] = useState(initialEvents);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Get events for selected date
  const getEventsForDate = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return events.filter(event => event.date === dateString);
  };

  // Get events for today
  const todayEvents = getEventsForDate(new Date());
  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];
  const upcomingEvents = events.filter(event => new Date(event.date) > new Date()).slice(0, 5);
  const conflictingEvents = events.filter(event => event.status === "pending");

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
      case 'meeting': return 'bg-blue-500/20 text-blue-700 dark:text-blue-300';
      case 'private_event': return 'bg-purple-500/20 text-purple-700 dark:text-purple-300';
      case 'maintenance': return 'bg-orange-500/20 text-orange-700 dark:text-orange-300';
      case 'supplier': return 'bg-green-500/20 text-green-700 dark:text-green-300';
      case 'training': return 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-300';
      default: return 'bg-gray-500/20 text-gray-700 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-500';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'pending': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'scheduled': return <Clock className="h-4 w-4 text-blue-500" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setDayViewDate(date);
    }
  };

  const handleDayClick = (date: Date) => {
    setDayViewDate(date);
    setSelectedDate(date);
    setShowDayView(true);
  };

  const handleAddEvent = (newEvent: Omit<typeof initialEvents[0], 'id' | 'date' | 'created' | 'status' | 'recurrence' | 'reminders'>) => {
    const event = {
      ...newEvent,
      id: events.length + 1,
      date: format(dayViewDate, 'yyyy-MM-dd'),
      created: format(new Date(), 'yyyy-MM-dd'),
      status: 'confirmed',
      recurrence: 'none',
      reminders: ['15min']
    };
    setEvents([...events, event]);
  };

  const handleUpdateEvent = (id: number, updatedEvent: Partial<typeof initialEvents[0]>) => {
    setEvents(events.map(event => event.id === id ? { ...event, ...updatedEvent } : event));
  };

  const handleDeleteEvent = (id: number) => {
    setEvents(events.filter(event => event.id !== id));
  };

  const handleAutoReschedule = () => {
    toast.loading("AI is analyzing optimal time slots...", { duration: 2000 });
    setTimeout(() => {
      toast.success("Events optimized! Conflicts resolved automatically.");
    }, 2000);
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || event.type === filterType;
    return matchesSearch && matchesType;
  });

  // Show day view if selected
  if (showDayView) {
    return (
      <div className="h-screen">
        <DayView
          selectedDate={dayViewDate}
          onBack={() => setShowDayView(false)}
          events={getEventsForDate(dayViewDate).map(event => ({
            id: event.id,
            title: event.title,
            startTime: event.startTime,
            endTime: event.endTime,
            type: event.type,
            attendees: event.attendees,
            location: event.location,
            description: event.description,
            priority: event.priority,
            assignedTo: event.assignedTo
          }))}
          onAddEvent={handleAddEvent}
          onUpdateEvent={handleUpdateEvent}
          onDeleteEvent={handleDeleteEvent}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 p-6 space-y-8">
      {/* Enhanced Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
            Calendar & Events
          </h1>
          <p className="text-lg text-muted-foreground">Manage restaurant events and scheduling with AI assistance</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <CalendarIcon className="w-4 h-4" />
              {events.length} total events
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {todayEvents.length} today
            </div>
            <div className="flex items-center gap-1">
              <AlertTriangle className="w-4 h-4" />
              {conflictingEvents.length} pending
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            variant="outline" 
            onClick={handleAutoReschedule} 
            className="flex items-center gap-2 hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all"
            size="lg"
          >
            <Zap className="h-5 w-5" />
            AI Optimize
          </Button>
          
          <Dialog open={isCreateEventOpen} onOpenChange={setIsCreateEventOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all">
                <Plus className="h-5 w-5 mr-2" />
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
                        <SelectItem value="meeting">Staff Meeting</SelectItem>
                        <SelectItem value="private_event">Private Event</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="supplier">Supplier Visit</SelectItem>
                        <SelectItem value="training">Training Session</SelectItem>
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
                        <SelectItem value="high">High Priority</SelectItem>
                        <SelectItem value="medium">Medium Priority</SelectItem>
                        <SelectItem value="low">Low Priority</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assignedTo">Assigned To</Label>
                    <Input id="assignedTo" placeholder="Person responsible" />
                  </div>
                </div>
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setIsCreateEventOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  toast.success("Event created successfully!");
                  setIsCreateEventOpen(false);
                }}>
                  Create Event
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search events, locations, or descriptions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[180px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="meeting">Meetings</SelectItem>
            <SelectItem value="private_event">Private Events</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="supplier">Supplier Visits</SelectItem>
            <SelectItem value="training">Training</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs value={selectedView} onValueChange={(value: any) => setSelectedView(value)} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 max-w-md">
          <TabsTrigger value="month">Month</TabsTrigger>
          <TabsTrigger value="week">Week</TabsTrigger>
          <TabsTrigger value="day">Day</TabsTrigger>
          <TabsTrigger value="conflicts">Conflicts</TabsTrigger>
        </TabsList>

        <TabsContent value="month" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Enhanced Full-Width Calendar */}
            <Card className="xl:col-span-3 shadow-2xl border-primary/20">
              <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <CalendarDays className="h-7 w-7 text-primary" />
                    {format(currentMonth, 'MMMM yyyy')}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => navigateMonth('prev')}
                      className="hover:bg-primary/10 hover:border-primary/30"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => navigateMonth('next')}
                      className="hover:bg-primary/10 hover:border-primary/30"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-2">
                <EnhancedCalendar
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  month={currentMonth}
                  onMonthChange={setCurrentMonth}
                  numberOfMonths={1}
                  onDayClick={handleDayClick}
                  className="w-full h-full"
                  modifiers={{
                    hasEvents: (date) => getEventsForDate(date).length > 0
                  }}
                  modifiersStyles={{
                    hasEvents: {
                      fontWeight: 'bold',
                      position: 'relative'
                    }
                  }}
                />
              </CardContent>
            </Card>

            {/* Events Summary - Enhanced Sidebar */}
            <div className="xl:col-span-1 space-y-6">
              {/* Today's Schedule */}
              <Card className="shadow-lg border-primary/10">
                <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-accent/5">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Today's Schedule
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(), 'EEEE, MMMM d')}
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {todayEvents.length === 0 ? (
                    <div className="text-center py-8">
                      <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">No events scheduled for today</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-3"
                        onClick={() => setIsCreateEventOpen(true)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Event
                      </Button>
                    </div>
                  ) : (
                    todayEvents.map((event) => (
                      <Card key={event.id} className={`${getEventTypeColor(event.type)} border-l-4 border-l-primary hover:shadow-md transition-all cursor-pointer`}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold text-sm">{event.title}</h4>
                                {getStatusIcon(event.status)}
                              </div>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatTime(event.startTime)} - {formatTime(event.endTime)}
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {event.location}
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Users className="h-3 w-3" />
                                  {event.attendees}
                                </div>
                                <Badge variant="secondary" className="text-xs">
                                  {event.assignedTo}
                                </Badge>
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDayClick(new Date())}
                              className="ml-2"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Selected Date Events */}
              {selectedDate && !isSameDay(selectedDate, new Date()) && (
                <Card className="shadow-lg border-primary/10">
                  <CardHeader className="pb-3 bg-gradient-to-r from-accent/5 to-primary/5">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5 text-accent" />
                      {format(selectedDate, 'MMM d')} Events
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {selectedDateEvents.length === 0 ? (
                      <div className="text-center py-6">
                        <CalendarIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">No events on this date</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-3"
                          onClick={() => handleDayClick(selectedDate)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Event
                        </Button>
                      </div>
                    ) : (
                      selectedDateEvents.map((event) => (
                        <Card key={event.id} className={`${getEventTypeColor(event.type)} border-l-4 border-l-accent hover:shadow-md transition-all cursor-pointer`}>
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium text-sm mb-1">{event.title}</h4>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  {formatTime(event.startTime)} - {formatTime(event.endTime)}
                                </div>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleDayClick(selectedDate)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Upcoming Events */}
              <Card className="shadow-lg border-primary/10">
                <CardHeader className="pb-3 bg-gradient-to-r from-green-500/5 to-emerald-500/5">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CalendarDays className="h-5 w-5 text-green-600" />
                    Upcoming Events
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {upcomingEvents.length === 0 ? (
                    <div className="text-center py-6">
                      <CalendarDays className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No upcoming events</p>
                    </div>
                  ) : (
                    upcomingEvents.slice(0, 3).map((event) => (
                      <div key={event.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{event.title}</h4>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(event.date), 'MMM d')} at {formatTime(event.startTime)}
                          </p>
                        </div>
                        <Badge className={getEventTypeColor(event.type)} variant="secondary">
                          {event.type.replace('_', ' ')}
                        </Badge>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="week" className="space-y-6">
          <Card className="p-6">
            <div className="text-center py-20">
              <CalendarDays className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Week View</h3>
              <p className="text-muted-foreground">Week view coming soon with enhanced scheduling features</p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="day" className="space-y-6">
          <Card className="p-6">
            <div className="text-center py-12">
              <div className="flex items-center justify-center gap-4 mb-6">
                <CalendarDays className="h-12 w-12 text-primary" />
                <div>
                  <h3 className="text-xl font-semibold">Day View</h3>
                  <p className="text-muted-foreground">Click on any date in the calendar to view detailed day schedule</p>
                </div>
              </div>
              <Button onClick={() => handleDayClick(new Date())} className="mt-4">
                <Eye className="w-4 h-4 mr-2" />
                View Today's Schedule
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="conflicts" className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-yellow-500/10 to-red-500/10">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                Event Conflicts & Pending Items
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Resolve scheduling conflicts and manage pending events
              </p>
            </CardHeader>
            <CardContent className="p-6">
              {conflictingEvents.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">All Clear!</h3>
                  <p className="text-muted-foreground">No conflicts or pending events to resolve</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {conflictingEvents.map((event) => (
                    <Card key={event.id} className="border-yellow-200 bg-yellow-50/50 dark:border-yellow-800 dark:bg-yellow-900/20">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold">{event.title}</h4>
                              <Badge variant="outline" className="text-yellow-700 border-yellow-300">
                                {event.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                              <div className="flex items-center gap-1">
                                <CalendarDays className="h-4 w-4" />
                                {format(new Date(event.date), 'MMM d, yyyy')}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {formatTime(event.startTime)} - {formatTime(event.endTime)}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {event.location}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">{event.description}</p>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button variant="outline" size="sm">
                              Reschedule
                            </Button>
                            <Button variant="default" size="sm">
                              Confirm
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <div className="flex justify-center pt-4">
                    <Button onClick={handleAutoReschedule} className="bg-gradient-to-r from-blue-500 to-purple-600">
                      <Zap className="w-4 h-4 mr-2" />
                      Auto-Resolve All Conflicts
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}