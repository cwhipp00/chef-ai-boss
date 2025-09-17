import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Calendar,
  Users,
  MessageSquare,
  AlertTriangle,
  Eye,
  UserCheck,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

interface PendingRequest {
  id: string;
  type: 'time_off' | 'shift_swap' | 'shift_offer';
  employee: string;
  employeeId: string;
  status: 'pending' | 'approved' | 'denied';
  requestedAt: string;
  urgency: 'low' | 'medium' | 'high';
  details: any;
}

interface ApprovalAction {
  requestId: string;
  action: 'approve' | 'deny';
  response: string;
}

const mockRequests: PendingRequest[] = [
  {
    id: '1',
    type: 'time_off',
    employee: 'Alice Johnson',
    employeeId: 'emp_001',
    status: 'pending',
    requestedAt: new Date().toISOString(),
    urgency: 'medium',
    details: {
      startDate: '2024-03-25',
      endDate: '2024-03-27',
      reason: 'Family vacation planned months ago',
      daysRequested: 3,
      hasBackup: true
    }
  },
  {
    id: '2',
    type: 'shift_swap',
    employee: 'Bob Chen',
    employeeId: 'emp_002',
    status: 'pending',
    requestedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    urgency: 'high',
    details: {
      originalShift: {
        date: '2024-03-22',
        startTime: '14:00',
        endTime: '22:00',
        role: 'Chef'
      },
      swapWith: 'Carol Davis',
      targetShift: {
        date: '2024-03-23',
        startTime: '10:00',
        endTime: '18:00',
        role: 'Chef'
      },
      reason: 'Medical appointment that couldn\'t be rescheduled',
      bothPartiesAgree: true
    }
  },
  {
    id: '3',
    type: 'shift_offer',
    employee: 'Carol Davis',
    employeeId: 'emp_003',
    status: 'pending',
    requestedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    urgency: 'low',
    details: {
      shift: {
        date: '2024-03-24',
        startTime: '16:00',
        endTime: '23:00',
        role: 'Server'
      },
      reason: 'Personal commitment came up',
      interestedCoverage: ['Dave Wilson', 'Emma Brown'],
      impactLevel: 'minimal'
    }
  }
];

export function ManagerApprovalDashboard() {
  const [requests, setRequests] = useState<PendingRequest[]>(mockRequests);
  const [selectedRequest, setSelectedRequest] = useState<PendingRequest | null>(null);
  const [approvalForm, setApprovalForm] = useState<ApprovalAction>({
    requestId: '',
    action: 'approve',
    response: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleApproval = async (requestId: string, action: 'approve' | 'deny', response: string) => {
    setIsProcessing(true);

    try {
      // Update request status
      setRequests(requests.map(req => 
        req.id === requestId 
          ? { ...req, status: action === 'approve' ? 'approved' : 'denied' }
          : req
      ));

      toast({
        title: `Request ${action === 'approve' ? 'Approved' : 'Denied'}`,
        description: `${action === 'approve' ? 'Approved' : 'Denied'} request from ${requests.find(r => r.id === requestId)?.employee}`,
        variant: action === 'approve' ? 'default' : 'destructive'
      });

      // Reset form
      setApprovalForm({ requestId: '', action: 'approve', response: '' });
      setSelectedRequest(null);
    } catch (error) {
      toast({
        title: "Action Failed",
        description: "Failed to process request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const bulkApprove = async (requestIds: string[]) => {
    setIsProcessing(true);

    try {
      setRequests(requests.map(req => 
        requestIds.includes(req.id) 
          ? { ...req, status: 'approved' }
          : req
      ));

      toast({
        title: "Bulk Approval Complete",
        description: `Approved ${requestIds.length} requests`,
      });
    } catch (error) {
      toast({
        title: "Bulk Action Failed",
        description: "Failed to process bulk approval. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'time_off': return <Calendar className="h-4 w-4" />;
      case 'shift_swap': return <RefreshCw className="h-4 w-4" />;
      case 'shift_offer': return <Users className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'time_off': return 'Time Off';
      case 'shift_swap': return 'Shift Swap';
      case 'shift_offer': return 'Shift Offer';
      default: return 'Request';
    }
  };

  const pendingRequests = requests.filter(req => req.status === 'pending');
  const approvedRequests = requests.filter(req => req.status === 'approved');
  const deniedRequests = requests.filter(req => req.status === 'denied');

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-warning">{pendingRequests.length}</div>
            <p className="text-sm text-muted-foreground">Pending Approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-destructive">
              {pendingRequests.filter(r => r.urgency === 'high').length}
            </div>
            <p className="text-sm text-muted-foreground">High Priority</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-success">{approvedRequests.length}</div>
            <p className="text-sm text-muted-foreground">Approved Today</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-muted-foreground">{deniedRequests.length}</div>
            <p className="text-sm text-muted-foreground">Denied Today</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2">
        <Button 
          onClick={() => bulkApprove(pendingRequests.filter(r => r.urgency !== 'high').map(r => r.id))}
          disabled={isProcessing || pendingRequests.filter(r => r.urgency !== 'high').length === 0}
          variant="outline"
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Bulk Approve Low Priority
        </Button>
        <Button variant="outline">
          <Eye className="h-4 w-4 mr-2" />
          Schedule Impact View
        </Button>
      </div>

      {/* Requests Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-primary" />
            Employee Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pending">
                Pending ({pendingRequests.length})
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approved ({approvedRequests.length})
              </TabsTrigger>
              <TabsTrigger value="denied">
                Denied ({deniedRequests.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4">
              {pendingRequests.length > 0 ? (
                pendingRequests.map((request) => (
                  <Card key={request.id} className="p-4 border-l-4 border-l-warning">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(request.type)}
                          <span className="font-semibold">{request.employee}</span>
                          <Badge variant="outline">{getTypeLabel(request.type)}</Badge>
                          <Badge variant={getUrgencyColor(request.urgency) as any}>
                            {request.urgency} priority
                          </Badge>
                        </div>

                        {/* Request Details */}
                        <div className="text-sm text-muted-foreground">
                          {request.type === 'time_off' && (
                            <div className="space-y-1">
                              <p>📅 {format(new Date(request.details.startDate), 'MMM d')} - {format(new Date(request.details.endDate), 'MMM d')} ({request.details.daysRequested} days)</p>
                              <p>💬 {request.details.reason}</p>
                              {request.details.hasBackup && (
                                <p className="text-success">✓ Coverage arranged</p>
                              )}
                            </div>
                          )}
                          
                          {request.type === 'shift_swap' && (
                            <div className="space-y-1">
                              <p>🔄 Swap {format(new Date(request.details.originalShift.date), 'MMM d')} ({request.details.originalShift.startTime}-{request.details.originalShift.endTime}) with {request.details.swapWith}</p>
                              <p>💬 {request.details.reason}</p>
                              {request.details.bothPartiesAgree && (
                                <p className="text-success">✓ Both parties agreed</p>
                              )}
                            </div>
                          )}
                          
                          {request.type === 'shift_offer' && (
                            <div className="space-y-1">
                              <p>👥 Offering {format(new Date(request.details.shift.date), 'MMM d')} ({request.details.shift.startTime}-{request.details.shift.endTime})</p>
                              <p>💬 {request.details.reason}</p>
                              {request.details.interestedCoverage.length > 0 && (
                                <p className="text-success">✓ {request.details.interestedCoverage.length} employees interested</p>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="text-xs text-muted-foreground">
                          Requested {format(new Date(request.requestedAt), 'MMM d, h:mm a')}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="h-3 w-3 mr-1" />
                              Review
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Review Request - {request.employee}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              {/* Detailed Request View */}
                              <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                  {getTypeIcon(request.type)}
                                  <span className="font-medium">{getTypeLabel(request.type)} Request</span>
                                  <Badge variant={getUrgencyColor(request.urgency) as any}>
                                    {request.urgency} priority
                                  </Badge>
                                </div>
                                
                                {/* Request specific details would go here */}
                                <div className="p-4 bg-muted rounded-lg">
                                  <pre className="text-sm whitespace-pre-wrap">
                                    {JSON.stringify(request.details, null, 2)}
                                  </pre>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="managerResponse">Response Message (Optional)</Label>
                                <Textarea
                                  id="managerResponse"
                                  placeholder="Add a note for the employee..."
                                  value={approvalForm.response}
                                  onChange={(e) => setApprovalForm({ ...approvalForm, response: e.target.value, requestId: request.id })}
                                />
                              </div>

                              <div className="flex gap-2">
                                <Button 
                                  onClick={() => handleApproval(request.id, 'approve', approvalForm.response)}
                                  disabled={isProcessing}
                                  className="flex-1"
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Approve
                                </Button>
                                <Button 
                                  onClick={() => handleApproval(request.id, 'deny', approvalForm.response)}
                                  disabled={isProcessing}
                                  variant="destructive"
                                  className="flex-1"
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Deny
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button 
                          onClick={() => handleApproval(request.id, 'approve', '')}
                          disabled={isProcessing}
                          size="sm"
                          className="bg-success hover:bg-success/90"
                        >
                          <CheckCircle className="h-3 w-3" />
                        </Button>
                        <Button 
                          onClick={() => handleApproval(request.id, 'deny', '')}
                          disabled={isProcessing}
                          size="sm"
                          variant="destructive"
                        >
                          <XCircle className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="font-semibold">All Caught Up!</h3>
                  <p>No pending requests to review</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="approved" className="space-y-4">
              {approvedRequests.map((request) => (
                <Card key={request.id} className="p-4 border-l-4 border-l-success">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(request.type)}
                        <span className="font-semibold">{request.employee}</span>
                        <Badge variant="outline">{getTypeLabel(request.type)}</Badge>
                        <Badge variant="default" className="bg-success text-success-foreground">Approved</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Requested {format(new Date(request.requestedAt), 'MMM d, h:mm a')}
                      </div>
                    </div>
                    <CheckCircle className="h-5 w-5 text-success" />
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="denied" className="space-y-4">
              {deniedRequests.map((request) => (
                <Card key={request.id} className="p-4 border-l-4 border-l-destructive">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(request.type)}
                        <span className="font-semibold">{request.employee}</span>
                        <Badge variant="outline">{getTypeLabel(request.type)}</Badge>
                        <Badge variant="destructive">Denied</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Requested {format(new Date(request.requestedAt), 'MMM d, h:mm a')}
                      </div>
                    </div>
                    <XCircle className="h-5 w-5 text-destructive" />
                  </div>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Schedule Impact Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Schedule Impact Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-success">3</div>
              <p className="text-sm text-muted-foreground">Shifts Fully Covered</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-warning">1</div>
              <p className="text-sm text-muted-foreground">Shifts Need Coverage</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-destructive">0</div>
              <p className="text-sm text-muted-foreground">Critical Coverage Gaps</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}