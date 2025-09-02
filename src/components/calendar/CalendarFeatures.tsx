import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Bell, 
  Repeat, 
  Share2, 
  Globe, 
  Lock,
  UserPlus,
  Settings,
  Palette,
  Zap,
  Coffee,
  Utensils,
  Wrench,
  GraduationCap,
  Package,
  AlertCircle,
  CheckCircle2,
  Plus,
  Search,
  Filter,
  Eye,
  Download,
  Upload,
  Link,
  Smartphone,
  Mail,
  MessageSquare
} from 'lucide-react';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';

interface CalendarFeaturesProps {
  selectedDate: Date;
  events: any[];
  onEventCreate: (event: any) => void;
  onEventUpdate: (id: number, event: any) => void;
}

export function CalendarFeatures({ selectedDate, events, onEventCreate, onEventUpdate }: CalendarFeaturesProps) {
  const [activeFeature, setActiveFeature] = useState('overview');
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [showCalendarSettings, setShowCalendarSettings] = useState(false);
  const [showEventTemplates, setShowEventTemplates] = useState(false);
  const [showTimeZoneSettings, setShowTimeZoneSettings] = useState(false);

  const eventCategories = [
    { id: 'meetings', name: 'Staff Meetings', color: '#3B82F6', icon: Users },
    { id: 'events', name: 'Private Events', color: '#8B5CF6', icon: Utensils },
    { id: 'maintenance', name: 'Maintenance', color: '#F59E0B', icon: Wrench },
    { id: 'training', name: 'Training', color: '#10B981', icon: GraduationCap },
    { id: 'deliveries', name: 'Deliveries', color: '#EF4444', icon: Package },
  ];

  const eventTemplates = [
    {
      id: 1,
      name: 'Weekly Staff Meeting',
      duration: 60,
      attendees: 8,
      location: 'Main Office',
      recurrence: 'weekly',
      reminders: ['15min', '1day'],
      category: 'meetings'
    },
    {
      id: 2,
      name: 'Equipment Maintenance Check',
      duration: 120,
      attendees: 2,
      location: 'Kitchen',
      recurrence: 'weekly',
      reminders: ['30min'],
      category: 'maintenance'
    },
    {
      id: 3,
      name: 'New Staff Orientation',
      duration: 180,
      attendees: 5,
      location: 'Training Room',
      recurrence: 'none',
      reminders: ['1day', '2hours'],
      category: 'training'
    }
  ];

  const reminderOptions = [
    { value: '5min', label: '5 minutes before' },
    { value: '15min', label: '15 minutes before' },
    { value: '30min', label: '30 minutes before' },
    { value: '1hour', label: '1 hour before' },
    { value: '2hours', label: '2 hours before' },
    { value: '1day', label: '1 day before' },
    { value: '1week', label: '1 week before' }
  ];

  const timeZones = [
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'Europe/London', label: 'GMT (London)' },
    { value: 'Europe/Paris', label: 'CET (Paris)' },
    { value: 'Asia/Tokyo', label: 'JST (Tokyo)' }
  ];

  return (
    <div className="space-y-6">
      {/* Feature Navigation */}
      <Card className="glass-card">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeFeature === 'overview' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFeature('overview')}
            >
              <Calendar className="h-4 w-4 mr-1" />
              Overview
            </Button>
            <Button
              variant={activeFeature === 'availability' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFeature('availability')}
            >
              <Clock className="h-4 w-4 mr-1" />
              Availability
            </Button>
            <Button
              variant={activeFeature === 'rooms' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFeature('rooms')}
            >
              <MapPin className="h-4 w-4 mr-1" />
              Rooms
            </Button>
            <Dialog open={showEventTemplates} onOpenChange={setShowEventTemplates}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Zap className="h-4 w-4 mr-1" />
                  Templates
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Event Templates</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {eventTemplates.map((template) => {
                    const Icon = eventCategories.find(c => c.id === template.category)?.icon || Calendar;
                    return (
                      <div key={template.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Icon className="h-5 w-5 text-primary" />
                            <h4 className="font-medium">{template.name}</h4>
                          </div>
                          <Button size="sm" onClick={() => {
                            onEventCreate({
                              title: template.name,
                              startTime: '09:00',
                              endTime: format(addDays(new Date(`2024-01-01T09:00`), 0).setMinutes(template.duration), 'HH:mm'),
                              type: template.category,
                              attendees: template.attendees,
                              location: template.location,
                              description: `Auto-generated from template: ${template.name}`,
                              priority: 'medium',
                              assignedTo: 'System'
                            });
                            setShowEventTemplates(false);
                          }}>
                            Use Template
                          </Button>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>Duration: {template.duration} minutes • {template.attendees} attendees</p>
                          <p>Location: {template.location}</p>
                          <p>Recurrence: {template.recurrence}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={showNotificationSettings} onOpenChange={setShowNotificationSettings}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Bell className="h-4 w-4 mr-1" />
                  Notifications
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Notification Settings</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Default Reminders</h4>
                    {reminderOptions.map((option) => (
                      <div key={option.value} className="flex items-center justify-between">
                        <Label>{option.label}</Label>
                        <Switch />
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-medium">Notification Methods</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bell className="h-4 w-4" />
                          <Label>Push Notifications</Label>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <Label>Email Alerts</Label>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          <Label>SMS Notifications</Label>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-4 w-4" />
                          <Label>Mobile App Alerts</Label>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={showCalendarSettings} onOpenChange={setShowCalendarSettings}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-1" />
                  Settings
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Calendar Settings</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="general" className="space-y-4">
                  <TabsList className="grid grid-cols-4 w-full">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="sharing">Sharing</TabsTrigger>
                    <TabsTrigger value="import">Import/Export</TabsTrigger>
                    <TabsTrigger value="integrations">Integrations</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="general" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Default View</Label>
                        <Select defaultValue="month">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="day">Day View</SelectItem>
                            <SelectItem value="week">Week View</SelectItem>
                            <SelectItem value="month">Month View</SelectItem>
                            <SelectItem value="agenda">Agenda View</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Time Zone</Label>
                        <Select defaultValue="America/New_York">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {timeZones.map((tz) => (
                              <SelectItem key={tz.value} value={tz.value}>
                                {tz.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Show weekends</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>24-hour time format</Label>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Show declined events</Label>
                        <Switch />
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="sharing" className="space-y-4">
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-blue-500" />
                            <span className="font-medium">Public Link</span>
                          </div>
                          <Switch />
                        </div>
                        <p className="text-sm text-muted-foreground">Allow anyone with the link to view this calendar</p>
                        <div className="flex gap-2 mt-2">
                          <Input value="https://chef-ai.com/calendar/public/abc123" readOnly className="font-mono text-xs" />
                          <Button variant="outline" size="sm">
                            <Link className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Share with team members</Label>
                        <div className="space-y-2">
                          {['Sarah Johnson', 'Mike Rodriguez', 'Emily Chen'].map((member) => (
                            <div key={member} className="flex items-center justify-between p-2 border rounded">
                              <span className="text-sm">{member}</span>
                              <Select defaultValue="view">
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="view">View Only</SelectItem>
                                  <SelectItem value="edit">Can Edit</SelectItem>
                                  <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          ))}
                        </div>
                        <Button variant="outline" size="sm" className="w-full">
                          <UserPlus className="h-4 w-4 mr-2" />
                          Add Team Member
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="import" className="space-y-4">
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Import Calendar</h4>
                        <p className="text-sm text-muted-foreground mb-4">Import events from other calendar applications</p>
                        <div className="flex gap-2">
                          <Button variant="outline">
                            <Upload className="h-4 w-4 mr-2" />
                            Import from Google Calendar
                          </Button>
                          <Button variant="outline">
                            <Upload className="h-4 w-4 mr-2" />
                            Import .ics file
                          </Button>
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Export Calendar</h4>
                        <p className="text-sm text-muted-foreground mb-4">Export your events to use in other applications</p>
                        <div className="flex gap-2">
                          <Button variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Export as .ics
                          </Button>
                          <Button variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Export to CSV
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="integrations" className="space-y-4">
                    <div className="space-y-4">
                      {[
                        { name: 'Google Workspace', status: 'connected', icon: '📧' },
                        { name: 'Microsoft Outlook', status: 'available', icon: '📅' },
                        { name: 'Slack', status: 'connected', icon: '💬' },
                        { name: 'Zoom', status: 'available', icon: '📹' },
                        { name: 'POS System', status: 'connected', icon: '💳' },
                      ].map((integration) => (
                        <div key={integration.name} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{integration.icon}</span>
                            <div>
                              <p className="font-medium">{integration.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {integration.status === 'connected' ? 'Connected and syncing' : 'Available to connect'}
                              </p>
                            </div>
                          </div>
                          <Button variant={integration.status === 'connected' ? 'outline' : 'default'} size="sm">
                            {integration.status === 'connected' ? 'Disconnect' : 'Connect'}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Feature Content */}
      {activeFeature === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">Event Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {eventCategories.map((category) => {
                const Icon = category.icon;
                const categoryEvents = events.filter(e => e.type === category.id);
                return (
                  <div key={category.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                      <Icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{category.name}</span>
                    </div>
                    <Badge variant="secondary">{categoryEvents.length}</Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{events.length}</div>
                  <div className="text-xs text-muted-foreground">Total Events</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">{events.filter(e => e.status === 'confirmed').length}</div>
                  <div className="text-xs text-muted-foreground">Confirmed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-warning">{events.filter(e => e.status === 'pending').length}</div>
                  <div className="text-xs text-muted-foreground">Pending</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-info">{events.filter(e => e.recurrence !== 'none').length}</div>
                  <div className="text-xs text-muted-foreground">Recurring</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Deadlines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {events.slice(0, 4).map((event) => (
                <div key={event.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                  {event.status === 'confirmed' ? (
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-warning" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{event.title}</p>
                    <p className="text-xs text-muted-foreground">{event.date} • {event.startTime}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {activeFeature === 'availability' && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Team Availability Checker</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <Input type="date" className="w-40" />
                <Input type="time" className="w-32" />
                <Input type="time" className="w-32" />
                <Button>Check Availability</Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {['Sarah Johnson', 'Mike Rodriguez', 'Emily Chen', 'David Park'].map((member) => (
                  <div key={member} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{member}</span>
                      <Badge className="bg-success">Available</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">
                      Next conflict: Staff Meeting at 3:00 PM
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeFeature === 'rooms' && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Room & Resource Booking</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: 'Main Dining Room', capacity: 150, status: 'available', nextBooking: '6:00 PM - Wedding Reception' },
                { name: 'Private Dining', capacity: 25, status: 'occupied', currentEvent: 'Business Lunch' },
                { name: 'Training Room', capacity: 20, status: 'available', nextBooking: 'Tomorrow 9:00 AM - Staff Meeting' },
                { name: 'Kitchen', capacity: 8, status: 'maintenance', note: 'Equipment check until 4:00 PM' },
                { name: 'Office', capacity: 5, status: 'available', nextBooking: 'No upcoming bookings' },
                { name: 'Storage Area', capacity: 3, status: 'available', nextBooking: 'Weekly inventory check' },
              ].map((room) => (
                <div key={room.name} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{room.name}</h4>
                    <Badge variant={
                      room.status === 'available' ? 'default' : 
                      room.status === 'occupied' ? 'destructive' : 'secondary'
                    }>
                      {room.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Capacity: {room.capacity} people
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {room.currentEvent && `Current: ${room.currentEvent}`}
                    {room.nextBooking && `Next: ${room.nextBooking}`}
                    {room.note && room.note}
                  </p>
                  <Button size="sm" className="w-full mt-3" disabled={room.status !== 'available'}>
                    {room.status === 'available' ? 'Book Room' : 'View Details'}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}