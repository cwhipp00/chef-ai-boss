import { useState } from 'react';
import { Calendar, Clock, Users, Plus, Download, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const staff = [
  { id: 1, name: "Sarah Johnson", role: "Head Chef", hourlyRate: 28, maxHours: 40 },
  { id: 2, name: "Mike Rodriguez", role: "Sous Chef", hourlyRate: 22, maxHours: 40 },
  { id: 3, name: "Emily Chen", role: "Server", hourlyRate: 15, maxHours: 35 },
  { id: 4, name: "David Park", role: "Line Cook", hourlyRate: 18, maxHours: 40 },
  { id: 5, name: "Lisa Wong", role: "Server", hourlyRate: 15, maxHours: 30 },
  { id: 6, name: "James Wilson", role: "Dishwasher", hourlyRate: 14, maxHours: 35 }
];

const shifts = [
  { id: 1, staffId: 1, date: "2024-01-15", startTime: "08:00", endTime: "16:00", role: "Head Chef", break: 60 },
  { id: 2, staffId: 2, date: "2024-01-15", startTime: "10:00", endTime: "18:00", role: "Sous Chef", break: 30 },
  { id: 3, staffId: 3, date: "2024-01-15", startTime: "11:00", endTime: "19:00", role: "Server", break: 30 },
  { id: 4, staffId: 4, date: "2024-01-15", startTime: "09:00", endTime: "17:00", role: "Line Cook", break: 60 },
  { id: 5, staffId: 5, date: "2024-01-15", startTime: "17:00", endTime: "23:00", role: "Server", break: 30 },
  { id: 6, staffId: 1, date: "2024-01-16", startTime: "08:00", endTime: "16:00", role: "Head Chef", break: 60 }
];

const timeSlots = [
  "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", 
  "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", 
  "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"
];

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function StaffSchedule() {
  const [selectedTab, setSelectedTab] = useState('schedule');
  const [selectedWeek, setSelectedWeek] = useState(new Date());

  const getStaffName = (staffId: number) => {
    const person = staff.find(s => s.id === staffId);
    return person ? person.name : "Unknown";
  };

  const getShiftDuration = (startTime: string, endTime: string, breakMinutes: number = 0) => {
    const start = new Date(`2024-01-01 ${startTime}`);
    const end = new Date(`2024-01-01 ${endTime}`);
    const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return Math.max(0, diff - (breakMinutes / 60));
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'head chef': return 'bg-destructive text-destructive-foreground';
      case 'sous chef': return 'bg-warning text-warning-foreground';
      case 'server': return 'bg-primary text-primary-foreground';
      case 'line cook': return 'bg-success text-success-foreground';
      case 'dishwasher': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const calculateWeeklyStats = () => {
    const totalHours = shifts.reduce((sum, shift) => 
      sum + getShiftDuration(shift.startTime, shift.endTime, shift.break), 0
    );
    const uniqueStaff = new Set(shifts.map(s => s.staffId)).size;
    const avgHours = uniqueStaff > 0 ? totalHours / uniqueStaff : 0;
    
    return { totalHours, uniqueStaff, avgHours };
  };

  const stats = calculateWeeklyStats();

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Staff Schedule</h1>
          <p className="text-muted-foreground">Manage employee schedules and time tracking</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="lg" className="bg-gradient-primary hover-scale">
            <Plus className="h-4 w-4 mr-2" />
            Add Shift
          </Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="schedule">Weekly Schedule</TabsTrigger>
          <TabsTrigger value="staff">Staff Management</TabsTrigger>
          <TabsTrigger value="timecard">Time Cards</TabsTrigger>
          <TabsTrigger value="analytics">Labor Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h3 className="text-lg font-medium">
                Week of {selectedWeek.toLocaleDateString()}
              </h3>
              <Button variant="outline" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="kitchen">Kitchen</SelectItem>
                  <SelectItem value="service">Service</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalHours.toFixed(1)}h</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Staff Scheduled</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.uniqueStaff}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Avg Hours/Person</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.avgHours.toFixed(1)}h</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Labor Cost</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$2,340</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Schedule Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="grid grid-cols-8 gap-2 min-w-[800px] text-sm">
                  <div className="font-medium p-2">Time</div>
                  {daysOfWeek.map(day => (
                    <div key={day} className="font-medium p-2 text-center">{day}</div>
                  ))}
                  
                  {timeSlots.map(time => (
                    <div key={time} className="contents">
                      <div className="p-2 font-mono text-xs text-muted-foreground">
                        {time}
                      </div>
                      {daysOfWeek.map((day, dayIndex) => {
                        const dayShifts = shifts.filter(shift => {
                          const shiftTime = parseInt(shift.startTime.split(':')[0]);
                          const currentTime = parseInt(time.split(':')[0]);
                          const endTime = parseInt(shift.endTime.split(':')[0]);
                          return shiftTime <= currentTime && currentTime < endTime;
                        });

                        return (
                          <div key={`${day}-${time}`} className="p-1 min-h-[40px] border-r border-b">
                            {dayShifts.map(shift => (
                              <div key={shift.id} className="mb-1">
                                <Badge className={`text-xs ${getRoleColor(shift.role)} block truncate`}>
                                  {getStaffName(shift.staffId).split(' ')[0]}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staff" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {staff.map((person) => (
              <Card key={person.id} className="hover:shadow-medium transition-all duration-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{person.name}</CardTitle>
                      <p className="text-muted-foreground">{person.role}</p>
                    </div>
                    <Badge className={getRoleColor(person.role)}>
                      {person.role}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Hourly Rate:</span>
                      <span className="font-medium">${person.hourlyRate}/hr</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Max Hours/Week:</span>
                      <span className="font-medium">{person.maxHours}h</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>This Week:</span>
                      <span className="font-medium">
                        {shifts.filter(s => s.staffId === person.id)
                          .reduce((sum, shift) => sum + getShiftDuration(shift.startTime, shift.endTime, shift.break), 0)
                          .toFixed(1)}h
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      View Schedule
                    </Button>
                    <Button size="sm" className="flex-1">
                      Add Shift
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="timecard" className="space-y-6">
          <div className="space-y-4">
            {shifts.map((shift) => (
              <Card key={shift.id} className="hover:shadow-medium transition-all duration-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-foreground">
                          {getStaffName(shift.staffId).split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium">{getStaffName(shift.staffId)}</h4>
                        <p className="text-sm text-muted-foreground">{shift.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {new Date(shift.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        {shift.startTime} - {shift.endTime}
                      </div>
                      <div className="font-medium">
                        {getShiftDuration(shift.startTime, shift.endTime, shift.break).toFixed(1)}h
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Weekly Labor Cost</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$2,340</div>
                <p className="text-xs text-success">-8% from last week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Labor Cost %</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">28.5%</div>
                <p className="text-xs text-warning">Target: 25%</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Overtime Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12.5h</div>
                <p className="text-xs text-destructive">+3h from last week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Productivity Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">87%</div>
                <p className="text-xs text-success">+5% from last week</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Labor Cost by Role</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Head Chef', 'Sous Chef', 'Server', 'Line Cook'].map((role, index) => {
                    const cost = [780, 660, 540, 360][index];
                    const percentage = (cost / 2340 * 100).toFixed(1);
                    return (
                      <div key={role} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{role}</span>
                          <span className="font-medium">${cost} ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Schedule Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Coverage Optimization</span>
                    <span className="font-medium text-success">92%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Staff Utilization</span>
                    <span className="font-medium text-warning">78%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Break Compliance</span>
                    <span className="font-medium text-success">95%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Overtime Management</span>
                    <span className="font-medium text-destructive">65%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}