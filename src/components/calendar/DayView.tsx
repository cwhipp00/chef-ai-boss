import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ArrowLeft, 
  Clock, 
  Plus, 
  Users, 
  MapPin, 
  Bell, 
  Calendar,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface Event {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  type: string;
  attendees: number;
  location: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  assignedTo: string;
}

interface DayViewProps {
  selectedDate: Date;
  onBack: () => void;
  events: Event[];
  onAddEvent: (event: Omit<Event, 'id'>) => void;
  onUpdateEvent: (id: number, event: Partial<Event>) => void;
  onDeleteEvent: (id: number) => void;
  onEditEvent?: (event: Event) => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export const DayView: React.FC<DayViewProps> = ({
  selectedDate,
  onBack,
  events,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  onEditEvent
}) => {
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    startTime: '',
    endTime: '',
    type: 'meeting',
    attendees: 1,
    location: '',
    description: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    assignedTo: ''
  });

  const formatHour = (hour: number) => {
    if (hour === 0) return '12:00 AM';
    if (hour === 12) return '12:00 PM';
    if (hour < 12) return `${hour}:00 AM`;
    return `${hour - 12}:00 PM`;
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'bg-blue-500/20 border-blue-500 text-blue-700 dark:text-blue-300';
      case 'private_event': return 'bg-purple-500/20 border-purple-500 text-purple-700 dark:text-purple-300';
      case 'maintenance': return 'bg-orange-500/20 border-orange-500 text-orange-700 dark:text-orange-300';
      case 'supplier': return 'bg-green-500/20 border-green-500 text-green-700 dark:text-green-300';
      case 'training': return 'bg-indigo-500/20 border-indigo-500 text-indigo-700 dark:text-indigo-300';
      default: return 'bg-gray-500/20 border-gray-500 text-gray-700 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getEventsForHour = (hour: number) => {
    return events.filter(event => {
      const eventHour = parseInt(event.startTime.split(':')[0]);
      return eventHour === hour;
    });
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.startTime || !newEvent.endTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    onAddEvent(newEvent);
    setNewEvent({
      title: '',
      startTime: '',
      endTime: '',
      type: 'meeting',
      attendees: 1,
      location: '',
      description: '',
      priority: 'medium',
      assignedTo: ''
    });
    setIsAddEventOpen(false);
    toast.success('Event added successfully!');
  };

  const handleTimeSlotClick = (hour: number) => {
    setSelectedHour(hour);
    const timeString = hour.toString().padStart(2, '0') + ':00';
    const endTimeString = (hour + 1).toString().padStart(2, '0') + ':00';
    setNewEvent(prev => ({
      ...prev,
      startTime: timeString,
      endTime: endTimeString
    }));
    setIsAddEventOpen(true);
  };

  const navigateDay = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    // This would need to be passed up to parent component
    // For now, we'll just show a toast
    toast.info(`Navigate to ${format(newDate, 'MMMM d, yyyy')}`);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-background via-background to-secondary/20">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Calendar
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateDay('prev')}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="text-center">
              <h1 className="text-2xl font-bold">
                {format(selectedDate, 'EEEE, MMMM d, yyyy')}
              </h1>
              <p className="text-sm text-muted-foreground">
                {events.length} events scheduled
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigateDay('next')}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Event</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Event Title *</Label>
                  <Input 
                    id="title" 
                    value={newEvent.title}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter event title" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Event Type</Label>
                  <Select 
                    value={newEvent.type}
                    onValueChange={(value) => setNewEvent(prev => ({ ...prev, type: value }))}
                  >
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
                  <Label htmlFor="startTime">Start Time *</Label>
                  <Input 
                    id="startTime" 
                    type="time" 
                    value={newEvent.startTime}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, startTime: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time *</Label>
                  <Input 
                    id="endTime" 
                    type="time" 
                    value={newEvent.endTime}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, endTime: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select 
                    value={newEvent.priority}
                    onValueChange={(value: 'high' | 'medium' | 'low') => setNewEvent(prev => ({ ...prev, priority: value }))}
                  >
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
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location" 
                    value={newEvent.location}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Event location" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="attendees">Expected Attendees</Label>
                  <Input 
                    id="attendees" 
                    type="number" 
                    value={newEvent.attendees}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, attendees: parseInt(e.target.value) || 1 }))}
                    placeholder="Number of attendees" 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="assignedTo">Assigned To</Label>
                <Input 
                  id="assignedTo" 
                  value={newEvent.assignedTo}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, assignedTo: e.target.value }))}
                  placeholder="Person responsible" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={newEvent.description}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Event description and notes" 
                />
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setIsAddEventOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddEvent}>
                Add Event
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Day Schedule */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4">
            <div className="space-y-1">
              {HOURS.map((hour) => {
                const hourEvents = getEventsForHour(hour);
                const isCurrentHour = new Date().getHours() === hour && 
                                     format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                
                return (
                  <div 
                    key={hour} 
                    className={`grid grid-cols-12 gap-4 min-h-[48px] border-b border-border/50 hover:bg-muted/30 transition-colors cursor-pointer ${
                      isCurrentHour ? 'bg-primary/10 border-primary/30' : ''
                    }`}
                    onClick={() => handleTimeSlotClick(hour)}
                  >
                    {/* Time Column */}
                    <div className="col-span-2 p-4 flex items-start justify-end">
                      <div className="text-right">
                        <div className={`text-lg font-medium ${isCurrentHour ? 'text-primary' : 'text-foreground'}`}>
                          {formatHour(hour)}
                        </div>
                        {isCurrentHour && (
                          <Badge variant="default" className="text-xs mt-1">
                            Now
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {/* Events Column */}
                    <div className="col-span-10 p-2 space-y-2">
                      {hourEvents.length === 0 ? (
                        <div className="flex items-center justify-center h-10 text-muted-foreground hover:text-foreground transition-colors">
                          <div className="flex items-center gap-2 text-sm">
                            <Plus className="w-4 h-4" />
                            Click to add event
                          </div>
                        </div>
                      ) : (
                        hourEvents.map((event) => (
                          <Card 
                            key={event.id} 
                            className={`${getEventColor(event.type)} border-l-4 hover:shadow-md transition-all cursor-pointer`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h3 className="font-semibold text-sm">{event.title}</h3>
                                    <div className={`w-2 h-2 rounded-full ${getPriorityColor(event.priority)}`} />
                                  </div>
                                  
                                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                                    <div className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      {event.startTime} - {event.endTime}
                                    </div>
                                    {event.location && (
                                      <div className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        {event.location}
                                      </div>
                                    )}
                                    <div className="flex items-center gap-1">
                                      <Users className="w-3 h-3" />
                                      {event.attendees}
                                    </div>
                                  </div>
                                  
                                  {event.description && (
                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                      {event.description}
                                    </p>
                                  )}
                                  
                                  {event.assignedTo && (
                                    <div className="mt-2">
                                      <Badge variant="secondary" className="text-xs">
                                        {event.assignedTo}
                                      </Badge>
                                    </div>
                                  )}
                                </div>
                                
                                <div className="flex items-center gap-1 ml-4">
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-8 w-8 p-0"
                                    onClick={() => onEditEvent?.(event)}
                                  >
                                    <Edit className="w-3 h-3" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                    onClick={() => {
                                      onDeleteEvent(event.id);
                                      toast.success('Event deleted');
                                    }}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};