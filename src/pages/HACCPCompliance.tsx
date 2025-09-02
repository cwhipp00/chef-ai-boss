import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Thermometer, 
  ClipboardCheck, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  Calendar, 
  FileText, 
  Shield, 
  Eye,
  Users,
  Clock,
  Download,
  Upload,
  Plus,
  Search,
  Filter,
  BarChart3
} from 'lucide-react';

interface TemperatureLog {
  id: string;
  equipment: string;
  location: string;
  temperature: number;
  target_min: number;
  target_max: number;
  recorded_by: string;
  recorded_at: string;
  status: 'normal' | 'warning' | 'critical';
  notes?: string;
}

interface HACCPChecklist {
  id: string;
  title: string;
  category: string;
  items: ChecklistItem[];
  assigned_to: string;
  due_date: string;
  completed_at?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
}

interface ChecklistItem {
  id: string;
  task: string;
  completed: boolean;
  completed_by: string;
  completed_at?: string;
  notes?: string;
}

interface CriticalControlPoint {
  id: string;
  name: string;
  description: string;
  hazard_type: string;
  critical_limit: string;
  monitoring_procedure: string;
  corrective_action: string;
  verification_procedure: string;
  status: 'compliant' | 'non_compliant' | 'monitoring';
  last_monitored: string;
}

export default function HACCPCompliance() {
  const [selectedTab, setSelectedTab] = useState('temperature');
  const [tempLogs, setTempLogs] = useState<TemperatureLog[]>([]);
  const [checklists, setChecklists] = useState<HACCPChecklist[]>([]);
  const [controlPoints, setControlPoints] = useState<CriticalControlPoint[]>([]);
  const [isLogDialogOpen, setIsLogDialogOpen] = useState(false);
  const [isChecklistDialogOpen, setIsChecklistDialogOpen] = useState(false);
  const { toast } = useToast();

  // Mock data
  const mockTempLogs: TemperatureLog[] = [
    {
      id: '1',
      equipment: 'Walk-in Freezer #1',
      location: 'Kitchen Storage',
      temperature: -18,
      target_min: -20,
      target_max: -15,
      recorded_by: 'Sarah Johnson',
      recorded_at: new Date().toISOString(),
      status: 'normal'
    },
    {
      id: '2',
      equipment: 'Refrigerator #2',
      location: 'Prep Station',
      temperature: 8,
      target_min: 1,
      target_max: 4,
      recorded_by: 'David Park',
      recorded_at: new Date(Date.now() - 3600000).toISOString(),
      status: 'critical',
      notes: 'Temperature too high - investigated and adjusted thermostat'
    }
  ];

  const mockChecklists: HACCPChecklist[] = [
    {
      id: '1',
      title: 'Daily Opening Checklist',
      category: 'Daily Operations',
      assigned_to: 'Sarah Johnson',
      due_date: new Date().toISOString(),
      status: 'completed',
      completed_at: new Date().toISOString(),
      items: [
        { id: '1', task: 'Check refrigerator temperatures', completed: true, completed_by: 'Sarah Johnson', completed_at: new Date().toISOString() },
        { id: '2', task: 'Inspect food storage areas', completed: true, completed_by: 'Sarah Johnson', completed_at: new Date().toISOString() },
        { id: '3', task: 'Verify hand washing stations', completed: true, completed_by: 'Sarah Johnson', completed_at: new Date().toISOString() }
      ]
    },
    {
      id: '2',
      title: 'Weekly Deep Clean',
      category: 'Sanitation',
      assigned_to: 'Mike Rodriguez',
      due_date: new Date(Date.now() + 86400000).toISOString(),
      status: 'in_progress',
      items: [
        { id: '1', task: 'Deep clean equipment', completed: false, completed_by: '' },
        { id: '2', task: 'Sanitize food contact surfaces', completed: true, completed_by: 'Mike Rodriguez', completed_at: new Date().toISOString() }
      ]
    }
  ];

  const mockControlPoints: CriticalControlPoint[] = [
    {
      id: '1',
      name: 'Cooking Temperature',
      description: 'Ensure all proteins reach safe internal temperatures',
      hazard_type: 'Biological',
      critical_limit: 'Poultry: 165°F, Ground meat: 160°F, Whole cuts: 145°F',
      monitoring_procedure: 'Use calibrated thermometer to check every batch',
      corrective_action: 'Continue cooking until proper temperature reached',
      verification_procedure: 'Daily thermometer calibration check',
      status: 'compliant',
      last_monitored: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Cold Storage',
      description: 'Maintain proper refrigeration temperatures',
      hazard_type: 'Biological',
      critical_limit: 'Refrigerator: 40°F or below, Freezer: 0°F or below',
      monitoring_procedure: 'Check temperatures every 4 hours',
      corrective_action: 'Adjust temperature, move products if necessary',
      verification_procedure: 'Weekly temperature log review',
      status: 'monitoring',
      last_monitored: new Date(Date.now() - 1800000).toISOString()
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
      case 'compliant':
      case 'completed':
        return 'text-success bg-success/10 border-success/20';
      case 'warning':
      case 'monitoring':
      case 'in_progress':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'critical':
      case 'non_compliant':
      case 'overdue':
        return 'text-destructive bg-destructive/10 border-destructive/20';
      default:
        return 'text-muted-foreground bg-muted/10 border-muted/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal':
      case 'compliant':
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'warning':
      case 'monitoring':
      case 'in_progress':
        return <Clock className="h-4 w-4" />;
      case 'critical':
      case 'non_compliant':
      case 'overdue':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-background via-background to-muted/10 flex flex-col">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gradient">HACCP Compliance</h1>
            <p className="text-muted-foreground">Hazard Analysis Critical Control Points Management</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="hover-scale">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline" className="hover-scale">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
            <Dialog open={isLogDialogOpen} onOpenChange={setIsLogDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-primary hover-scale">
                  <Plus className="h-4 w-4 mr-2" />
                  New Log Entry
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Temperature Log</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Equipment</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select equipment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="freezer1">Walk-in Freezer #1</SelectItem>
                        <SelectItem value="fridge1">Refrigerator #1</SelectItem>
                        <SelectItem value="fridge2">Refrigerator #2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Temperature (°C)</Label>
                    <Input type="number" placeholder="Enter temperature" />
                  </div>
                  <div>
                    <Label>Notes (optional)</Label>
                    <Textarea placeholder="Any observations or issues..." />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsLogDialogOpen(false)}>Cancel</Button>
                    <Button onClick={() => {
                      toast({ title: "Temperature logged successfully" });
                      setIsLogDialogOpen(false);
                    }}>Save Log</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-hidden">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl h-14 bg-gradient-to-r from-muted/20 via-muted/10 to-muted/20 backdrop-blur-sm border border-border/50 shadow-lg">
            <TabsTrigger value="temperature" className="text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg hover-scale transition-all duration-300">
              <Thermometer className="h-4 w-4 mr-2" />
              Temperature
            </TabsTrigger>
            <TabsTrigger value="checklists" className="text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg hover-scale transition-all duration-300">
              <ClipboardCheck className="h-4 w-4 mr-2" />
              Checklists
            </TabsTrigger>
            <TabsTrigger value="control-points" className="text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg hover-scale transition-all duration-300">
              <Shield className="h-4 w-4 mr-2" />
              Control Points
            </TabsTrigger>
            <TabsTrigger value="reports" className="text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg hover-scale transition-all duration-300">
              <FileText className="h-4 w-4 mr-2" />
              Reports
            </TabsTrigger>
          </TabsList>

          {/* Temperature Monitoring */}
          <TabsContent value="temperature" className="flex-1 pt-6">
            <div className="grid grid-cols-12 gap-6 h-full">
              <div className="col-span-8">
                <Card className="glass-card h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Thermometer className="h-5 w-5 text-primary" />
                      Temperature Logs
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {mockTempLogs.map((log) => (
                      <div key={log.id} className="p-4 rounded-lg border bg-gradient-to-r from-card/50 to-card/30 hover-scale">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className={`p-1 rounded-full ${getStatusColor(log.status)}`}>
                              {getStatusIcon(log.status)}
                            </div>
                            <div>
                              <h4 className="font-medium">{log.equipment}</h4>
                              <p className="text-sm text-muted-foreground">{log.location}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold">{log.temperature}°C</div>
                            <div className="text-xs text-muted-foreground">
                              Target: {log.target_min}°C to {log.target_max}°C
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">By {log.recorded_by}</span>
                          <span className="text-muted-foreground">
                            {new Date(log.recorded_at).toLocaleString()}
                          </span>
                        </div>
                        {log.notes && (
                          <div className="mt-2 p-2 bg-muted/50 rounded text-sm">
                            <strong>Notes:</strong> {log.notes}
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
              
              <div className="col-span-4 space-y-4">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-lg">Temperature Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-3 bg-success/10 rounded-lg">
                        <div className="text-2xl font-bold text-success">85%</div>
                        <div className="text-xs text-muted-foreground">Normal</div>
                      </div>
                      <div className="p-3 bg-warning/10 rounded-lg">
                        <div className="text-2xl font-bold text-warning">10%</div>
                        <div className="text-xs text-muted-foreground">Warning</div>
                      </div>
                      <div className="p-3 bg-destructive/10 rounded-lg">
                        <div className="text-2xl font-bold text-destructive">5%</div>
                        <div className="text-xs text-muted-foreground">Critical</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-lg">Equipment Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { name: 'Walk-in Freezer #1', status: 'normal', temp: '-18°C' },
                      { name: 'Refrigerator #1', status: 'normal', temp: '2°C' },
                      { name: 'Refrigerator #2', status: 'critical', temp: '8°C' },
                      { name: 'Display Cooler', status: 'warning', temp: '5°C' }
                    ].map((equipment, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(equipment.status).includes('success') ? 'bg-success' : equipment.status === 'warning' ? 'bg-warning' : 'bg-destructive'}`} />
                          <span className="text-sm">{equipment.name}</span>
                        </div>
                        <span className="text-sm font-medium">{equipment.temp}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Checklists */}
          <TabsContent value="checklists" className="flex-1 pt-6">
            <div className="grid grid-cols-2 gap-6">
              {mockChecklists.map((checklist) => (
                <Card key={checklist.id} className="glass-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <ClipboardCheck className="h-5 w-5 text-primary" />
                        {checklist.title}
                      </CardTitle>
                      <Badge className={getStatusColor(checklist.status)}>
                        {checklist.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Assigned to: {checklist.assigned_to} | Due: {new Date(checklist.due_date).toLocaleDateString()}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {checklist.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-2 rounded hover:bg-muted/50">
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                          item.completed ? 'bg-success border-success' : 'border-muted-foreground'
                        }`}>
                          {item.completed && <CheckCircle className="w-3 h-3 text-white" />}
                        </div>
                        <span className={`text-sm ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {item.task}
                        </span>
                      </div>
                    ))}
                    <div className="pt-2 border-t">
                      <div className="text-sm text-muted-foreground">
                        Progress: {checklist.items.filter(item => item.completed).length}/{checklist.items.length} completed
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Control Points */}
          <TabsContent value="control-points" className="flex-1 pt-6">
            <div className="space-y-4">
              {mockControlPoints.map((ccp) => (
                <Card key={ccp.id} className="glass-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        {ccp.name}
                      </CardTitle>
                      <Badge className={getStatusColor(ccp.status)}>
                        {ccp.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-sm">Description</h4>
                        <p className="text-sm text-muted-foreground">{ccp.description}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Hazard Type</h4>
                        <p className="text-sm text-muted-foreground">{ccp.hazard_type}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Critical Limit</h4>
                        <p className="text-sm text-muted-foreground">{ccp.critical_limit}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-sm">Monitoring Procedure</h4>
                        <p className="text-sm text-muted-foreground">{ccp.monitoring_procedure}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Corrective Action</h4>
                        <p className="text-sm text-muted-foreground">{ccp.corrective_action}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Last Monitored</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(ccp.last_monitored).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Reports */}
          <TabsContent value="reports" className="flex-1 pt-6">
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">HACCP Reports</h3>
              <p className="text-muted-foreground mb-6">Generate comprehensive compliance reports</p>
              <div className="flex gap-4 justify-center">
                <Button className="bg-gradient-primary hover-scale">
                  <Download className="h-4 w-4 mr-2" />
                  Daily Report
                </Button>
                <Button variant="outline" className="hover-scale">
                  <Download className="h-4 w-4 mr-2" />
                  Weekly Report
                </Button>
                <Button variant="outline" className="hover-scale">
                  <Download className="h-4 w-4 mr-2" />
                  Monthly Report
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}