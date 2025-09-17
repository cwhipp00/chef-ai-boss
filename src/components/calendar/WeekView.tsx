import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  Users, 
  MapPin, 
  Plus,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks, isSameDay, isToday } from 'date-fns';
import { cn } from '@/lib/utils';

interface WeekViewProps {
  selectedDate: Date;
  events: any[];
  onEventClick: (event: any) => void;
  onAddEvent: (date: Date) => void;
  onEditEvent: (event: any) => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export function WeekView({ selectedDate, events, onEventClick, onAddEvent, onEditEvent }: WeekViewProps) {
  const [currentWeek, setCurrentWeek] = React.useState(selectedDate);
  
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const getEventsForDate = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return events.filter(event => event.date === dateString);
  };

  const getEventsForDateTime = (date: Date, hour: number) => {
    const dayEvents = getEventsForDate(date);
    return dayEvents.filter(event => {
      const eventHour = parseInt(event.startTime.split(':')[0]);
      return eventHour === hour;
    });
  };

  const formatHour = (hour: number) => {
    if (hour === 0) return '12 AM';
    if (hour === 12) return '12 PM';
    if (hour < 12) return `${hour} AM`;
    return `${hour - 12} PM`;
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'bg-blue-500/20 text-blue-700 border-blue-500/30 dark:text-blue-300';
      case 'private_event': return 'bg-purple-500/20 text-purple-700 border-purple-500/30 dark:text-purple-300';
      case 'maintenance': return 'bg-orange-500/20 text-orange-700 border-orange-500/30 dark:text-orange-300';
      case 'supplier': return 'bg-green-500/20 text-green-700 border-green-500/30 dark:text-green-300';
      case 'training': return 'bg-indigo-500/20 text-indigo-700 border-indigo-500/30 dark:text-indigo-300';
      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30 dark:text-gray-300';
    }
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeek(prev => direction === 'prev' ? subWeeks(prev, 1) : addWeeks(prev, 1));
  };

  return (
    <div className="space-y-4">
      {/* Week Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              Week of {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => navigateWeek('prev')}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigateWeek('next')}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Week Grid */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Day Headers */}
              <div className="grid grid-cols-8 border-b">
                <div className="p-4 font-medium text-sm text-muted-foreground">Time</div>
                {weekDays.map((day) => (
                  <div 
                    key={day.toISOString()} 
                    className={cn(
                      "p-4 text-center border-l",
                      isToday(day) && "bg-primary/10"
                    )}
                  >
                    <div className="font-medium text-sm">
                      {format(day, 'EEE')}
                    </div>
                    <div className={cn(
                      "text-lg font-bold mt-1",
                      isToday(day) && "text-primary"
                    )}>
                      {format(day, 'd')}
                    </div>
                  </div>
                ))}
              </div>

              {/* Time Slots */}
              <div className="max-h-[600px] overflow-y-auto">
                {HOURS.filter(hour => hour >= 6 && hour <= 23).map((hour) => (
                  <div key={hour} className="grid grid-cols-8 border-b min-h-[60px]">
                    <div className="p-4 text-sm text-muted-foreground border-r">
                      {formatHour(hour)}
                    </div>
                    {weekDays.map((day) => {
                      const dayEvents = getEventsForDateTime(day, hour);
                      return (
                        <div 
                          key={`${day.toISOString()}-${hour}`}
                          className="border-l min-h-[60px] relative group hover:bg-muted/30 cursor-pointer"
                          onClick={() => onAddEvent(day)}
                        >
                          {dayEvents.length === 0 ? (
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <div className="p-1 space-y-1">
                              {dayEvents.map((event) => (
                                <div
                                  key={event.id}
                                  className={cn(
                                    "p-1 rounded text-xs border cursor-pointer hover:shadow-sm transition-all",
                                    getEventTypeColor(event.type)
                                  )}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onEventClick(event);
                                  }}
                                >
                                  <div className="font-medium truncate mb-1">
                                    {event.title}
                                  </div>
                                  <div className="flex items-center gap-1 text-xs opacity-75">
                                    <Clock className="h-2 w-2" />
                                    <span>{event.startTime}</span>
                                  </div>
                                  {event.attendees && (
                                    <div className="flex items-center gap-1 text-xs opacity-75">
                                      <Users className="h-2 w-2" />
                                      <span>{event.attendees}</span>
                                    </div>
                                  )}
                                  {event.location && (
                                    <div className="flex items-center gap-1 text-xs opacity-75 truncate">
                                      <MapPin className="h-2 w-2" />
                                      <span>{event.location}</span>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Week Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {weekDays.reduce((total, day) => total + getEventsForDate(day).length, 0)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Busiest Day</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">
              {weekDays.reduce((busiest, day) => {
                const dayEventCount = getEventsForDate(day).length;
                const busiestEventCount = getEventsForDate(busiest).length;
                return dayEventCount > busiestEventCount ? day : busiest;
              }, weekDays[0]) && format(
                weekDays.reduce((busiest, day) => {
                  const dayEventCount = getEventsForDate(day).length;
                  const busiestEventCount = getEventsForDate(busiest).length;
                  return dayEventCount > busiestEventCount ? day : busiest;
                }, weekDays[0]), 
                'EEEE'
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Event Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {Array.from(new Set(events.map(e => e.type))).slice(0, 3).map(type => (
                <Badge key={type} variant="outline" className="text-xs">
                  {type.replace('_', ' ')}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}