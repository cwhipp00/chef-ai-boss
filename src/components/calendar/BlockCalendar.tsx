import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Plus,
  Clock,
  Users,
  MapPin,
  MoreVertical
} from 'lucide-react';
import { format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths
} from 'date-fns';

interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  duration: number; // minutes
  type: 'shift' | 'meeting' | 'training' | 'break' | 'delivery';
  attendees?: string[];
  location?: string;
  priority: 'low' | 'medium' | 'high';
}

interface BlockCalendarProps {
  events?: CalendarEvent[];
  onDateSelect?: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  onAddEvent?: (date: Date) => void;
}

const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Morning Shift',
    time: '08:00',
    duration: 480,
    type: 'shift',
    attendees: ['John', 'Sarah'],
    priority: 'high'
  },
  {
    id: '2', 
    title: 'Team Meeting',
    time: '14:00',
    duration: 60,
    type: 'meeting',
    location: 'Manager Office',
    attendees: ['All Staff'],
    priority: 'medium'
  },
  {
    id: '3',
    title: 'Food Safety Training',
    time: '10:00',
    duration: 120,
    type: 'training',
    location: 'Training Room',
    priority: 'high'
  }
];

export function BlockCalendar({ 
  events = mockEvents, 
  onDateSelect, 
  onEventClick,
  onAddEvent 
}: BlockCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd
  });

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'shift':
        return 'bg-primary/20 text-primary border-primary/30';
      case 'meeting':
        return 'bg-blue-500/20 text-blue-700 border-blue-500/30';
      case 'training':
        return 'bg-purple-500/20 text-purple-700 border-purple-500/30';
      case 'break':
        return 'bg-green-500/20 text-green-700 border-green-500/30';
      case 'delivery':
        return 'bg-orange-500/20 text-orange-700 border-orange-500/30';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getPriorityIndicator = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'w-2 h-2 bg-destructive rounded-full';
      case 'medium':
        return 'w-2 h-2 bg-warning rounded-full';
      case 'low':
        return 'w-2 h-2 bg-success rounded-full';
      default:
        return 'w-2 h-2 bg-muted rounded-full';
    }
  };

  const getEventsForDate = (date: Date) => {
    // Mock: return events for today as example
    return isToday(date) ? events : [];
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    onDateSelect?.(date);
  };

  const handlePrevMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
  };

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              {format(currentDate, 'MMMM yyyy')}
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handlePrevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-4">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((date, index) => {
              const dayEvents = getEventsForDate(date);
              const isCurrentMonth = isSameMonth(date, currentDate);
              const isSelected = selectedDate && isSameDay(date, selectedDate);
              const isTodayDate = isToday(date);

              return (
                <div
                  key={index}
                  className={cn(
                    "min-h-[120px] p-2 border border-border rounded-lg cursor-pointer transition-all duration-200",
                    "hover:border-primary/50 hover:shadow-md hover:scale-[1.02]",
                    "bg-gradient-to-br from-card to-card/80 backdrop-blur-sm",
                    {
                      "opacity-40": !isCurrentMonth,
                      "border-primary bg-primary/5 shadow-md": isSelected,
                      "border-primary/60 bg-primary/10 shadow-lg": isTodayDate,
                      "border-2 border-primary": isTodayDate && isSelected
                    }
                  )}
                  onClick={() => handleDateClick(date)}
                >
                  {/* Date Number */}
                  <div className="flex items-center justify-between mb-2">
                    <span className={cn(
                      "text-sm font-medium",
                      {
                        "text-muted-foreground": !isCurrentMonth,
                        "text-primary font-bold": isTodayDate,
                        "text-foreground": isCurrentMonth && !isTodayDate
                      }
                    )}>
                      {format(date, 'd')}
                    </span>
                    {dayEvents.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddEvent?.(date);
                        }}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    )}
                  </div>

                  {/* Events */}
                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        className={cn(
                          "p-1.5 rounded text-xs border cursor-pointer",
                          "hover:shadow-sm transition-all duration-200 hover:scale-105",
                          getEventTypeColor(event.type)
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick?.(event);
                        }}
                      >
                        <div className="flex items-center gap-1 mb-1">
                          <div className={getPriorityIndicator(event.priority)} />
                          <span className="font-medium truncate flex-1">
                            {event.title}
                          </span>
                          <MoreVertical className="h-3 w-3 opacity-50" />
                        </div>
                        
                        <div className="flex items-center gap-1 text-xs opacity-75">
                          <Clock className="h-2.5 w-2.5" />
                          <span>{event.time}</span>
                          {event.duration && (
                            <span className="text-xs">
                              ({Math.floor(event.duration / 60)}h {event.duration % 60}m)
                            </span>
                          )}
                        </div>
                        
                        {event.attendees && (
                          <div className="flex items-center gap-1 mt-1">
                            <Users className="h-2.5 w-2.5" />
                            <span className="truncate">
                              {event.attendees.slice(0, 2).join(', ')}
                              {event.attendees.length > 2 && ` +${event.attendees.length - 2}`}
                            </span>
                          </div>
                        )}
                        
                        {event.location && (
                          <div className="flex items-center gap-1 mt-1">
                            <MapPin className="h-2.5 w-2.5" />
                            <span className="truncate">{event.location}</span>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-muted-foreground text-center py-1">
                        +{dayEvents.length - 3} more
                      </div>
                    )}
                  </div>

                  {/* Add Event Button for Empty Days */}
                  {dayEvents.length === 0 && isCurrentMonth && (
                    <div className="flex items-center justify-center h-full">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddEvent?.(date);
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Event Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Event Types</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
            Shifts
          </Badge>
          <Badge variant="outline" className="bg-blue-500/20 text-blue-700 border-blue-500/30">
            Meetings
          </Badge>
          <Badge variant="outline" className="bg-purple-500/20 text-purple-700 border-purple-500/30">
            Training
          </Badge>
          <Badge variant="outline" className="bg-green-500/20 text-green-700 border-green-500/30">
            Breaks
          </Badge>
          <Badge variant="outline" className="bg-orange-500/20 text-orange-700 border-orange-500/30">
            Deliveries
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
}