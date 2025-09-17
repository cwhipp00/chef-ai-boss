import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  CalendarIcon,
  Clock, 
  Users, 
  MapPin, 
  Plus,
  Eye,
  Repeat
} from 'lucide-react';
import { format } from 'date-fns';

interface DayAgendaViewProps {
  selectedDate: Date;
  events: any[];
  onEventClick: (event: any) => void;
  onAddEvent: (date: Date) => void;
  getEventTypeColor: (type: string) => string;
  getPriorityColor: (priority: string) => string;
  getStatusIcon: (status: string) => React.ReactNode;
  formatTime: (time: string) => string;
}

export function DayAgendaView({ 
  selectedDate, 
  events, 
  onEventClick, 
  onAddEvent,
  getEventTypeColor,
  getPriorityColor, 
  getStatusIcon,
  formatTime
}: DayAgendaViewProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Day Agenda</h3>
        <p className="text-muted-foreground">
          Detailed schedule for {format(selectedDate, 'EEEE, MMMM d, yyyy')}
        </p>
      </div>
      
      {/* Calendar for visibility toggle */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-sm">Event Types</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {['meeting', 'private_event', 'maintenance', 'supplier', 'training'].map(type => (
            <div key={type} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-3 h-3 rounded-full",
                  getEventTypeColor(type).split(' ')[0]
                )} />
                <span className="text-sm capitalize">{type.replace('_', ' ')}</span>
              </div>
              <Eye className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-pointer" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Day Events List */}
      <div className="space-y-4">
        {events.length === 0 ? (
          <Card className="glass-card">
            <CardContent className="p-8 text-center">
              <CalendarIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-medium mb-2">No events scheduled</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add your first event for this day
              </p>
               <Button 
                 variant="outline" 
                 onClick={() => onAddEvent(selectedDate)}
                 className="gap-2 hover:bg-primary/10 transition-colors"
               >
                <Plus className="h-4 w-4" />
                Add Event
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <Card 
                key={event.id} 
                className={`glass-card border-l-4 cursor-pointer hover:shadow-md transition-all ${getEventTypeColor(event.type)}`}
                onClick={() => onEventClick(event)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{event.title}</h4>
                        {getStatusIcon(event.status)}
                        <div className={`w-2 h-2 rounded-full ${getPriorityColor(event.priority)}`} />
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTime(event.startTime)} - {formatTime(event.endTime)}
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
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {event.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {event.assignedTo}
                        </Badge>
                        {event.recurrence !== 'none' && (
                          <Badge variant="outline" className="text-xs flex items-center gap-1">
                            <Repeat className="w-2 h-2" />
                            {event.recurrence}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                    >
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}