import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  Clock, 
  Users, 
  UserMinus,
  RefreshCw,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Send
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { format, addDays } from 'date-fns';

interface EmployeeShift {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  role: string;
  status: 'scheduled' | 'offered' | 'needs_coverage' | 'time_off_requested';
  canOffer: boolean;
  canSwap: boolean;
}

interface TimeOffRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'denied';
  requestedAt: string;
  managerResponse?: string;
}

interface ShiftSwapRequest {
  id: string;
  requestingEmployee: string;
  targetEmployee: string;
  requestingShift: EmployeeShift;
  targetShift: EmployeeShift;
  status: 'pending' | 'approved' | 'denied';
  reason: string;
  requestedAt: string;
}

interface ShiftOfferRequest {
  id: string;
  offeringEmployee: string;
  shift: EmployeeShift;
  reason: string;
  status: 'pending' | 'approved' | 'taken';
  requestedAt: string;
  interestedEmployees: string[];
}

const sampleShifts: EmployeeShift[] = [
  {
    id: '1',
    date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    startTime: '09:00',
    endTime: '17:00',
    role: 'Server',
    status: 'scheduled',
    canOffer: true,
    canSwap: true
  },
  {
    id: '2',
    date: format(addDays(new Date(), 3), 'yyyy-MM-dd'),
    startTime: '14:00',
    endTime: '22:00',
    role: 'Server',
    status: 'scheduled',
    canOffer: true,
    canSwap: true
  }
];

export function EmployeeScheduleInterface() {
  const [shifts, setShifts] = useState<EmployeeShift[]>(sampleShifts);
  const [timeOffRequests, setTimeOffRequests] = useState<TimeOffRequest[]>([]);
  const [swapRequests, setSwapRequests] = useState<ShiftSwapRequest[]>([]);
  const [offerRequests, setOfferRequests] = useState<ShiftOfferRequest[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Time Off Request State
  const [timeOffForm, setTimeOffForm] = useState({
    startDate: '',
    endDate: '',
    reason: ''
  });

  // Shift Swap State
  const [swapForm, setSwapForm] = useState({
    targetEmployee: '',
    reason: '',
    selectedShift: ''
  });

  // Shift Offer State
  const [offerForm, setOfferForm] = useState({
    reason: '',
    selectedShift: ''
  });

  const requestTimeOff = async () => {
    if (!timeOffForm.startDate || !timeOffForm.endDate || !timeOffForm.reason.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const newRequest: TimeOffRequest = {
        id: Date.now().toString(),
        employeeId: 'current-user',
        employeeName: 'You',
        startDate: timeOffForm.startDate,
        endDate: timeOffForm.endDate,
        reason: timeOffForm.reason,
        status: 'pending',
        requestedAt: new Date().toISOString()
      };

      setTimeOffRequests([newRequest, ...timeOffRequests]);
      setTimeOffForm({ startDate: '', endDate: '', reason: '' });

      toast({
        title: "Time Off Requested",
        description: "Your time off request has been submitted for manager approval",
      });
    } catch (error) {
      toast({
        title: "Request Failed",
        description: "Failed to submit time off request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const offerShift = async () => {
    if (!offerForm.selectedShift || !offerForm.reason.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select a shift and provide a reason",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const shift = shifts.find(s => s.id === offerForm.selectedShift);
      if (!shift) return;

      const newOffer: ShiftOfferRequest = {
        id: Date.now().toString(),
        offeringEmployee: 'You',
        shift,
        reason: offerForm.reason,
        status: 'pending',
        requestedAt: new Date().toISOString(),
        interestedEmployees: []
      };

      setOfferRequests([newOffer, ...offerRequests]);
      
      // Update shift status
      setShifts(shifts.map(s => 
        s.id === offerForm.selectedShift 
          ? { ...s, status: 'offered' as const }
          : s
      ));

      setOfferForm({ reason: '', selectedShift: '' });

      toast({
        title: "Shift Offered",
        description: "Your shift has been offered for coverage",
      });
    } catch (error) {
      toast({
        title: "Offer Failed",
        description: "Failed to offer shift. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const requestShiftSwap = async () => {
    if (!swapForm.selectedShift || !swapForm.targetEmployee || !swapForm.reason.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const shift = shifts.find(s => s.id === swapForm.selectedShift);
      if (!shift) return;

      const newSwapRequest: ShiftSwapRequest = {
        id: Date.now().toString(),
        requestingEmployee: 'You',
        targetEmployee: swapForm.targetEmployee,
        requestingShift: shift,
        targetShift: shift, // Mock - would be selected in real app
        status: 'pending',
        reason: swapForm.reason,
        requestedAt: new Date().toISOString()
      };

      setSwapRequests([newSwapRequest, ...swapRequests]);
      setSwapForm({ targetEmployee: '', reason: '', selectedShift: '' });

      toast({
        title: "Swap Requested",
        description: `Shift swap request sent to ${swapForm.targetEmployee}`,
      });
    } catch (error) {
      toast({
        title: "Swap Request Failed",
        description: "Failed to request shift swap. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'denied': return 'destructive';
      case 'pending': return 'warning';
      case 'scheduled': return 'default';
      case 'offered': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-3 w-3" />;
      case 'denied': return <XCircle className="h-3 w-3" />;
      case 'pending': return <AlertCircle className="h-3 w-3" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* My Schedule Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            My Upcoming Shifts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {shifts.map((shift) => (
              <Card key={shift.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {format(new Date(shift.date), 'EEEE, MMM d')}
                      </span>
                      <Badge variant={getStatusColor(shift.status) as any}>
                        {shift.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {shift.startTime} - {shift.endTime}
                      </div>
                      <span>{shift.role}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {shift.canOffer && shift.status === 'scheduled' && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <UserMinus className="h-3 w-3 mr-1" />
                            Offer
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Offer Shift for Coverage</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>Shift Details</Label>
                              <div className="p-3 bg-muted rounded-lg text-sm">
                                {format(new Date(shift.date), 'EEEE, MMM d')} • {shift.startTime} - {shift.endTime} • {shift.role}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="reason">Reason for Offering</Label>
                              <Textarea
                                id="reason"
                                placeholder="Why do you need coverage for this shift?"
                                value={offerForm.reason}
                                onChange={(e) => setOfferForm({ ...offerForm, reason: e.target.value, selectedShift: shift.id })}
                              />
                            </div>
                            <Button 
                              onClick={offerShift} 
                              disabled={isSubmitting}
                              className="w-full"
                            >
                              {isSubmitting ? "Submitting..." : "Offer Shift"}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                    {shift.canSwap && shift.status === 'scheduled' && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Swap
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Request Shift Swap</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>Your Shift</Label>
                              <div className="p-3 bg-muted rounded-lg text-sm">
                                {format(new Date(shift.date), 'EEEE, MMM d')} • {shift.startTime} - {shift.endTime} • {shift.role}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="targetEmployee">Swap With</Label>
                              <Select onValueChange={(value) => setSwapForm({ ...swapForm, targetEmployee: value, selectedShift: shift.id })}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select employee" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="alice">Alice Johnson</SelectItem>
                                  <SelectItem value="bob">Bob Chen</SelectItem>
                                  <SelectItem value="carol">Carol Davis</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="swapReason">Reason for Swap</Label>
                              <Textarea
                                id="swapReason"
                                placeholder="Why do you want to swap this shift?"
                                value={swapForm.reason}
                                onChange={(e) => setSwapForm({ ...swapForm, reason: e.target.value })}
                              />
                            </div>
                            <Button 
                              onClick={requestShiftSwap} 
                              disabled={isSubmitting}
                              className="w-full"
                            >
                              {isSubmitting ? "Submitting..." : "Request Swap"}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Dialog>
          <DialogTrigger asChild>
            <Card className="p-6 cursor-pointer hover:bg-accent/50 transition-colors">
              <div className="text-center space-y-2">
                <Calendar className="h-8 w-8 text-primary mx-auto" />
                <h3 className="font-semibold">Request Time Off</h3>
                <p className="text-sm text-muted-foreground">Submit a time off request</p>
              </div>
            </Card>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request Time Off</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={timeOffForm.startDate}
                    onChange={(e) => setTimeOffForm({ ...timeOffForm, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={timeOffForm.endDate}
                    onChange={(e) => setTimeOffForm({ ...timeOffForm, endDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeOffReason">Reason</Label>
                <Textarea
                  id="timeOffReason"
                  placeholder="Please provide a reason for your time off request"
                  value={timeOffForm.reason}
                  onChange={(e) => setTimeOffForm({ ...timeOffForm, reason: e.target.value })}
                />
              </div>
              <Button 
                onClick={requestTimeOff} 
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Card className="p-6">
          <div className="text-center space-y-2">
            <Users className="h-8 w-8 text-success mx-auto" />
            <h3 className="font-semibold">Available Shifts</h3>
            <p className="text-sm text-muted-foreground">Pick up extra shifts</p>
            <Button size="sm" className="w-full">View Available</Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-center space-y-2">
            <MessageSquare className="h-8 w-8 text-info mx-auto" />
            <h3 className="font-semibold">My Requests</h3>
            <p className="text-sm text-muted-foreground">Track request status</p>
            <div className="flex gap-1 justify-center">
              <Badge variant="secondary" className="text-xs">
                {timeOffRequests.filter(r => r.status === 'pending').length} Pending
              </Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* Requests Tracking */}
      <Card>
        <CardHeader>
          <CardTitle>My Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="timeoff">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="timeoff">Time Off</TabsTrigger>
              <TabsTrigger value="swaps">Shift Swaps</TabsTrigger>
              <TabsTrigger value="offers">Shift Offers</TabsTrigger>
            </TabsList>

            <TabsContent value="timeoff" className="space-y-4">
              {timeOffRequests.length > 0 ? (
                timeOffRequests.map((request) => (
                  <Card key={request.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {format(new Date(request.startDate), 'MMM d')} - {format(new Date(request.endDate), 'MMM d')}
                          </span>
                          <Badge variant={getStatusColor(request.status) as any}>
                            {getStatusIcon(request.status)}
                            {request.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{request.reason}</p>
                        {request.managerResponse && (
                          <p className="text-sm text-primary">Manager: {request.managerResponse}</p>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(request.requestedAt), 'MMM d, h:mm a')}
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No time off requests yet</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="swaps" className="space-y-4">
              {swapRequests.length > 0 ? (
                swapRequests.map((request) => (
                  <Card key={request.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Swap with {request.targetEmployee}</span>
                          <Badge variant={getStatusColor(request.status) as any}>
                            {getStatusIcon(request.status)}
                            {request.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(request.requestingShift.date), 'MMM d')} • {request.requestingShift.startTime}-{request.requestingShift.endTime}
                        </p>
                        <p className="text-sm text-muted-foreground">{request.reason}</p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(request.requestedAt), 'MMM d, h:mm a')}
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <RefreshCw className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No swap requests yet</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="offers" className="space-y-4">
              {offerRequests.length > 0 ? (
                offerRequests.map((request) => (
                  <Card key={request.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Shift Offered</span>
                          <Badge variant={getStatusColor(request.status) as any}>
                            {request.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(request.shift.date), 'MMM d')} • {request.shift.startTime}-{request.shift.endTime}
                        </p>
                        <p className="text-sm text-muted-foreground">{request.reason}</p>
                        {request.interestedEmployees.length > 0 && (
                          <p className="text-sm text-success">
                            {request.interestedEmployees.length} employee(s) interested
                          </p>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(request.requestedAt), 'MMM d, h:mm a')}
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <UserMinus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No shift offers yet</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}