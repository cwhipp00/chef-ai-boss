import { useState } from 'react';
import { Calendar, Clock, Users, Plus, Download, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { WeeklyScheduleView } from '@/components/schedule/WeeklyScheduleView';
import { DailyScheduleView } from '@/components/schedule/DailyScheduleView';
import { 
  TimeOffRequestModal, 
  ShiftSwapModal, 
  CoverageModal 
} from '@/components/schedule/ShiftActionModals';
import type { Shift } from '@/components/schedule/ShiftCard';
import type { DropResult } from 'react-beautiful-dnd';

const staff = [
  { id: 1, name: "Sarah Johnson", role: "Head Chef", hourlyRate: 28, maxHours: 40 },
  { id: 2, name: "Mike Rodriguez", role: "Sous Chef", hourlyRate: 22, maxHours: 40 },
  { id: 3, name: "Emily Chen", role: "Server", hourlyRate: 15, maxHours: 35 },
  { id: 4, name: "David Park", role: "Line Cook", hourlyRate: 18, maxHours: 40 },
  { id: 5, name: "Lisa Wong", role: "Server", hourlyRate: 15, maxHours: 30 },
  { id: 6, name: "James Wilson", role: "Dishwasher", hourlyRate: 14, maxHours: 35 }
];

const enhancedShifts: Shift[] = [
  { 
    id: '1', 
    staffId: 1, 
    staffName: "Sarah Johnson", 
    date: "2024-01-15", 
    startTime: "08:00", 
    endTime: "16:00", 
    role: "Head Chef", 
    break: 60, 
    status: 'scheduled' 
  },
  { 
    id: '2', 
    staffId: 2, 
    staffName: "Mike Rodriguez", 
    date: "2024-01-15", 
    startTime: "10:00", 
    endTime: "18:00", 
    role: "Sous Chef", 
    break: 30, 
    status: 'needs_coverage' 
  },
  { 
    id: '3', 
    staffId: 3, 
    staffName: "Emily Chen", 
    date: "2024-01-15", 
    startTime: "11:00", 
    endTime: "19:00", 
    role: "Server", 
    break: 30, 
    status: 'time_off_requested',
    timeOffReason: 'Doctor appointment'
  },
  { 
    id: '4', 
    staffId: 4, 
    staffName: "David Park", 
    date: "2024-01-15", 
    startTime: "09:00", 
    endTime: "17:00", 
    role: "Line Cook", 
    break: 60, 
    status: 'covered',
    coverageOfferedBy: 6 
  },
  { 
    id: '5', 
    staffId: 5, 
    staffName: "Lisa Wong", 
    date: "2024-01-15", 
    startTime: "17:00", 
    endTime: "23:00", 
    role: "Server", 
    break: 30, 
    status: 'scheduled' 
  },
  { 
    id: '6', 
    staffId: 1, 
    staffName: "Sarah Johnson", 
    date: "2024-01-16", 
    startTime: "08:00", 
    endTime: "16:00", 
    role: "Head Chef", 
    break: 60, 
    status: 'scheduled' 
  },
  { 
    id: '7', 
    staffId: 6, 
    staffName: "James Wilson", 
    date: "2024-01-16", 
    startTime: "14:00", 
    endTime: "22:00", 
    role: "Dishwasher", 
    break: 30, 
    status: 'open' 
  },
  { 
    id: '8', 
    staffId: 3, 
    staffName: "Emily Chen", 
    date: "2024-01-17", 
    startTime: "12:00", 
    endTime: "20:00", 
    role: "Server", 
    break: 30, 
    status: 'scheduled' 
  }
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
  const [shifts, setShifts] = useState<Shift[]>(enhancedShifts);
  const [timeOffModalOpen, setTimeOffModalOpen] = useState(false);
  const [swapModalOpen, setSwapModalOpen] = useState(false);
  const [coverageModalOpen, setCoverageModalOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [coverageType, setCoverageType] = useState<'offer' | 'take'>('offer');
  const { toast } = useToast();

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

  const handleShiftMove = (result: DropResult) => {
    if (!result.destination) return;
    
    const { draggableId, source, destination } = result;
    
    // Update shift timing based on drop location
    setShifts(prev => prev.map(shift => {
      if (shift.id === draggableId) {
        const [day, time] = destination.droppableId.split('-');
        // In a real app, you'd calculate the new date and time
        toast({
          title: "Shift Moved",
          description: `${shift.staffName}'s shift moved to ${day} at ${time}`,
        });
        return { ...shift, startTime: time };
      }
      return shift;
    }));
  };

  const handleOfferCoverage = (shiftId: string) => {
    const shift = shifts.find(s => s.id === shiftId);
    if (shift) {
      setSelectedShift(shift);
      setCoverageType('offer');
      setCoverageModalOpen(true);
    }
  };

  const handleTakeCoverage = (shiftId: string) => {
    const shift = shifts.find(s => s.id === shiftId);
    if (shift) {
      setSelectedShift(shift);
      setCoverageType('take');
      setCoverageModalOpen(true);
    }
  };

  const handleRequestTimeOff = (shiftId: string) => {
    const shift = shifts.find(s => s.id === shiftId);
    if (shift) {
      setSelectedShift(shift);
      setTimeOffModalOpen(true);
    }
  };

  const handleSwapRequest = (shiftId: string) => {
    const shift = shifts.find(s => s.id === shiftId);
    if (shift) {
      setSelectedShift(shift);
      setSwapModalOpen(true);
    }
  };

  const handleEditShift = (shiftId: string) => {
    toast({
      title: "Edit Shift",
      description: "Shift editing functionality would open here",
    });
  };

  const confirmCoverage = () => {
    if (!selectedShift) return;

    setShifts(prev => prev.map(shift => {
      if (shift.id === selectedShift.id) {
        if (coverageType === 'offer') {
          return { ...shift, status: 'needs_coverage' };
        } else {
          return { ...shift, status: 'covered', coverageOfferedBy: 1 }; // Current user ID
        }
      }
      return shift;
    }));

    toast({
      title: coverageType === 'offer' ? "Coverage Offered" : "Shift Taken",
      description: coverageType === 'offer' 
        ? "Your shift is now available for coverage"
        : "You've successfully taken this shift",
    });

    setCoverageModalOpen(false);
    setSelectedShift(null);
  };

  const submitTimeOffRequest = (reason: string) => {
    if (!selectedShift) return;

    setShifts(prev => prev.map(shift => {
      if (shift.id === selectedShift.id) {
        return { 
          ...shift, 
          status: 'time_off_requested',
          timeOffReason: reason 
        };
      }
      return shift;
    }));

    toast({
      title: "Time Off Requested",
      description: "Your time off request has been submitted for approval",
    });

    setSelectedShift(null);
  };

  const submitSwapRequest = (targetShiftId: string, message: string) => {
    toast({
      title: "Swap Request Sent",
      description: "Your shift swap request has been sent to your colleague",
    });
    setSelectedShift(null);
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
    <div className="p-6 space-y-6 animate-fade-in ml-0 sm:ml-8 lg:ml-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground ml-4 sm:ml-0">Staff Schedule</h1>
          <p className="text-muted-foreground ml-4 sm:ml-0">Manage employee schedules with drag & drop, shift coverage, and time-off requests</p>
        </div>
        <div className="flex gap-2 mr-4 sm:mr-0">
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
        <TabsList className="grid w-full grid-cols-5 bg-muted/30 h-12">
          <TabsTrigger value="schedule" className="text-xs data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground hover-scale">
            <Calendar className="h-4 w-4 mr-1" />
            Interactive Schedule
          </TabsTrigger>
          <TabsTrigger value="daily" className="text-xs data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground hover-scale">
            <Clock className="h-4 w-4 mr-1" />
            Daily View
          </TabsTrigger>
          <TabsTrigger value="staff" className="text-xs data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground hover-scale">
            <Users className="h-4 w-4 mr-1" />
            Staff Management
          </TabsTrigger>
          <TabsTrigger value="requests" className="text-xs data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground hover-scale">
            <Plus className="h-4 w-4 mr-1" />
            Coverage & Requests
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground hover-scale">
            <Filter className="h-4 w-4 mr-1" />
            Labor Analytics
          </TabsTrigger>
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

          <WeeklyScheduleView
            shifts={shifts}
            onShiftMove={handleShiftMove}
            onOfferCoverage={handleOfferCoverage}
            onTakeCoverage={handleTakeCoverage}
            onRequestTimeOff={handleRequestTimeOff}
            onSwapRequest={handleSwapRequest}
            onEditShift={handleEditShift}
            currentUserId={1}
          />
        </TabsContent>

        <TabsContent value="daily" className="space-y-6">
          <DailyScheduleView 
            shifts={shifts}
            selectedWeek={selectedWeek}
          />
        </TabsContent>

        <TabsContent value="requests" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Shifts Needing Coverage</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {shifts.filter(s => s.status === 'needs_coverage').map(shift => (
                  <div key={shift.id} className="p-3 border rounded-lg">
                    <div className="font-medium text-sm">{shift.staffName}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(shift.date).toLocaleDateString()} • {shift.startTime}-{shift.endTime}
                    </div>
                    <div className="text-xs text-warning mt-1">{shift.role}</div>
                    <Button 
                      size="sm" 
                      className="w-full mt-2"
                      onClick={() => handleTakeCoverage(shift.id)}
                    >
                      Take Shift
                    </Button>
                  </div>
                ))}
                {shifts.filter(s => s.status === 'needs_coverage').length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No shifts need coverage
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Time Off Requests</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {shifts.filter(s => s.status === 'time_off_requested').map(shift => (
                  <div key={shift.id} className="p-3 border rounded-lg border-destructive/20">
                    <div className="font-medium text-sm">{shift.staffName}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(shift.date).toLocaleDateString()} • {shift.startTime}-{shift.endTime}
                    </div>
                    <div className="text-xs text-destructive mt-1">
                      Reason: {shift.timeOffReason}
                    </div>
                    <div className="flex gap-1 mt-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        Deny
                      </Button>
                    </div>
                  </div>
                ))}
                {shifts.filter(s => s.status === 'time_off_requested').length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No time off requests
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recently Covered</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {shifts.filter(s => s.status === 'covered').map(shift => (
                  <div key={shift.id} className="p-3 border rounded-lg border-success/20">
                    <div className="font-medium text-sm">{shift.staffName}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(shift.date).toLocaleDateString()} • {shift.startTime}-{shift.endTime}
                    </div>
                    <div className="text-xs text-success mt-1">
                      Covered by Staff ID: {shift.coverageOfferedBy}
                    </div>
                  </div>
                ))}
                {shifts.filter(s => s.status === 'covered').length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No recently covered shifts
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
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

      {/* Modals */}
      <TimeOffRequestModal
        isOpen={timeOffModalOpen}
        onClose={() => {
          setTimeOffModalOpen(false);
          setSelectedShift(null);
        }}
        onSubmit={submitTimeOffRequest}
        shift={selectedShift}
      />

      <ShiftSwapModal
        isOpen={swapModalOpen}
        onClose={() => {
          setSwapModalOpen(false);
          setSelectedShift(null);
        }}
        onSubmit={submitSwapRequest}
        shift={selectedShift}
        availableShifts={shifts.filter(s => s.status === 'scheduled' && s.id !== selectedShift?.id)}
      />

      <CoverageModal
        isOpen={coverageModalOpen}
        onClose={() => {
          setCoverageModalOpen(false);
          setSelectedShift(null);
        }}
        onConfirm={confirmCoverage}
        shift={selectedShift}
        type={coverageType}
      />
    </div>
  );
}