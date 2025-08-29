import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, Users, Calendar as CalendarIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';

const events = [
  {
    id: 1,
    title: "Staff Meeting",
    date: "2024-01-15",
    time: "3:00 PM",
    duration: "1 hour",
    type: "meeting",
    attendees: 8,
    description: "Weekly team meeting to discuss menu changes and upcoming events"
  },
  {
    id: 2,
    title: "Equipment Maintenance",
    date: "2024-01-16",
    time: "10:00 AM",
    duration: "2 hours",
    type: "maintenance",
    attendees: 3,
    description: "Scheduled maintenance for kitchen equipment"
  },
  {
    id: 3,
    title: "Food Safety Training",
    date: "2024-01-18",
    time: "2:00 PM",
    duration: "3 hours",
    type: "training",
    attendees: 12,
    description: "Mandatory food safety and hygiene training session"
  },
  {
    id: 4,
    title: "Inventory Audit",
    date: "2024-01-20",
    time: "9:00 AM",
    duration: "4 hours",
    type: "audit",
    attendees: 4,
    description: "Monthly inventory count and reconciliation"
  },
  {
    id: 5,
    title: "Private Event Setup",
    date: "2024-01-22",
    time: "4:00 PM",
    duration: "2 hours",
    type: "event",
    attendees: 15,
    description: "Setup for private dining event (50 guests)"
  }
];

const todayEvents = events.filter(event => event.date === "2024-01-15");
const upcomingEvents = events.filter(event => new Date(event.date) > new Date("2024-01-15"));

const getEventTypeColor = (type: string) => {
  switch (type) {
    case 'meeting': return 'bg-primary text-primary-foreground';
    case 'maintenance': return 'bg-warning text-warning-foreground';
    case 'training': return 'bg-success text-success-foreground';
    case 'audit': return 'bg-info text-info-foreground';
    case 'event': return 'bg-secondary text-secondary-foreground';
    default: return 'bg-muted text-muted-foreground';
  }
};

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Calendar</h1>
          <p className="text-muted-foreground">Schedule and manage restaurant events</p>
        </div>
        <Button size="lg" className="bg-gradient-primary">
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
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
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border pointer-events-auto"
                month={currentMonth}
                onMonthChange={setCurrentMonth}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
              <p className="text-sm text-muted-foreground">
                {formatDate("2024-01-15")}
              </p>
            </CardHeader>
            <CardContent>
              {todayEvents.length > 0 ? (
                <div className="space-y-4">
                  {todayEvents.map((event) => (
                    <div key={event.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{event.title}</h4>
                          <Badge className={getEventTypeColor(event.type)}>
                            {event.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {event.time} ({event.duration})
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {event.attendees} attendees
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No events scheduled for today</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.slice(0, 5).map((event) => (
                  <div key={event.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{event.title}</h4>
                      <Badge className={getEventTypeColor(event.type)} variant="outline">
                        {event.type}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" />
                        {formatDate(event.date)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {event.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {event.attendees} attendees
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Events This Week</span>
                  <span className="font-medium">{events.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Staff Training Hours</span>
                  <span className="font-medium">12h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Maintenance Sessions</span>
                  <span className="font-medium">2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Private Events</span>
                  <span className="font-medium">1</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Event Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {['meeting', 'maintenance', 'training', 'audit', 'event'].map((type) => (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getEventTypeColor(type).split(' ')[0]}`} />
                      <span className="text-sm capitalize">{type}</span>
                    </div>
                    <span className="text-sm font-medium">
                      {events.filter(e => e.type === type).length}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}