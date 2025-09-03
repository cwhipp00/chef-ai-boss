import React, { useState } from 'react';
import { Zap, Play, Pause, Settings, Plus, Trash2, Clock, CheckCircle, AlertCircle, Bot } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

interface WorkflowTrigger {
  id: string;
  type: 'time' | 'event' | 'condition';
  name: string;
  config: any;
}

interface WorkflowAction {
  id: string;
  type: 'notification' | 'task' | 'report' | 'integration';
  name: string;
  config: any;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  triggers: WorkflowTrigger[];
  actions: WorkflowAction[];
  isActive: boolean;
  lastRun?: Date;
  runCount: number;
  status: 'idle' | 'running' | 'error' | 'completed';
}

const predefinedWorkflows: Workflow[] = [
  {
    id: '1',
    name: 'Daily Prep Reminder',
    description: 'Automatically remind kitchen staff of daily prep tasks',
    triggers: [
      { id: 't1', type: 'time', name: 'Daily at 6:00 AM', config: { time: '06:00', recurring: 'daily' } }
    ],
    actions: [
      { id: 'a1', type: 'notification', name: 'Send prep list to kitchen staff', config: { recipients: ['kitchen'], template: 'prep_reminder' } }
    ],
    isActive: true,
    lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000),
    runCount: 45,
    status: 'completed'
  },
  {
    id: '2',
    name: 'Inventory Low Stock Alert',
    description: 'Alert management when inventory items are running low',
    triggers: [
      { id: 't2', type: 'condition', name: 'Inventory below threshold', config: { condition: 'inventory_low', threshold: 10 } }
    ],
    actions: [
      { id: 'a2', type: 'notification', name: 'Email management', config: { recipients: ['management'], urgency: 'high' } },
      { id: 'a3', type: 'task', name: 'Create purchase order task', config: { assignee: 'manager', priority: 'high' } }
    ],
    isActive: true,
    lastRun: new Date(Date.now() - 4 * 60 * 60 * 1000),
    runCount: 12,
    status: 'completed'
  },
  {
    id: '3',
    name: 'End of Day Report',
    description: 'Generate and send daily performance report',
    triggers: [
      { id: 't3', type: 'time', name: 'Daily at 11:00 PM', config: { time: '23:00', recurring: 'daily' } }
    ],
    actions: [
      { id: 'a4', type: 'report', name: 'Generate daily report', config: { type: 'daily_summary', format: 'pdf' } },
      { id: 'a5', type: 'notification', name: 'Send to management', config: { recipients: ['management'], attachment: true } }
    ],
    isActive: false,
    lastRun: new Date(Date.now() - 24 * 60 * 60 * 1000),
    runCount: 30,
    status: 'idle'
  }
];

export const AIWorkflowAutomation = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>(predefinedWorkflows);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newWorkflowName, setNewWorkflowName] = useState('');
  const [newWorkflowDescription, setNewWorkflowDescription] = useState('');
  
  const { toast } = useToast();

  const toggleWorkflow = (workflowId: string) => {
    setWorkflows(prev => prev.map(workflow => 
      workflow.id === workflowId 
        ? { ...workflow, isActive: !workflow.isActive, status: !workflow.isActive ? 'idle' : 'idle' as const }
        : workflow
    ));
    
    const workflow = workflows.find(w => w.id === workflowId);
    toast({
      title: `Workflow ${workflow?.isActive ? 'Deactivated' : 'Activated'}`,
      description: `"${workflow?.name}" is now ${workflow?.isActive ? 'inactive' : 'active'}`,
    });
  };

  const runWorkflow = (workflowId: string) => {
    setWorkflows(prev => prev.map(workflow => 
      workflow.id === workflowId 
        ? { ...workflow, status: 'running' as const, lastRun: new Date() }
        : workflow
    ));

    // Simulate workflow execution
    setTimeout(() => {
      setWorkflows(prev => prev.map(workflow => 
        workflow.id === workflowId 
          ? { ...workflow, status: 'completed' as const, runCount: workflow.runCount + 1 }
          : workflow
      ));
      
      const workflow = workflows.find(w => w.id === workflowId);
      toast({
        title: "Workflow Executed",
        description: `"${workflow?.name}" has been executed successfully`,
      });
    }, 2000);
  };

  const deleteWorkflow = (workflowId: string) => {
    const workflow = workflows.find(w => w.id === workflowId);
    setWorkflows(prev => prev.filter(w => w.id !== workflowId));
    
    toast({
      title: "Workflow Deleted",
      description: `"${workflow?.name}" has been removed`,
    });
  };

  const createWorkflow = () => {
    if (!newWorkflowName.trim()) return;
    
    const newWorkflow: Workflow = {
      id: Date.now().toString(),
      name: newWorkflowName,
      description: newWorkflowDescription,
      triggers: [],
      actions: [],
      isActive: false,
      runCount: 0,
      status: 'idle'
    };
    
    setWorkflows(prev => [...prev, newWorkflow]);
    setNewWorkflowName('');
    setNewWorkflowDescription('');
    setIsCreateModalOpen(false);
    
    toast({
      title: "Workflow Created",
      description: `"${newWorkflowName}" has been created successfully`,
    });
  };

  const getStatusIcon = (status: Workflow['status']) => {
    switch (status) {
      case 'running': return <Clock className="h-4 w-4 text-warning animate-spin" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-destructive" />;
      default: return <Bot className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: Workflow['status']) => {
    switch (status) {
      case 'running': return 'bg-warning/10 text-warning border-warning/20';
      case 'completed': return 'bg-success/10 text-success border-success/20';
      case 'error': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted/10 text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">AI Workflow Automation</h2>
          <p className="text-muted-foreground">Automate repetitive tasks and streamline operations</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              Create Workflow
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Workflow</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="workflow-name">Workflow Name</Label>
                <Input
                  id="workflow-name"
                  value={newWorkflowName}
                  onChange={(e) => setNewWorkflowName(e.target.value)}
                  placeholder="Enter workflow name"
                />
              </div>
              <div>
                <Label htmlFor="workflow-description">Description</Label>
                <Textarea
                  id="workflow-description"
                  value={newWorkflowDescription}
                  onChange={(e) => setNewWorkflowDescription(e.target.value)}
                  placeholder="Describe what this workflow does"
                  rows={3}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={createWorkflow} disabled={!newWorkflowName.trim()}>
                  Create Workflow
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Workflow Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{workflows.length}</p>
                <p className="text-xs text-muted-foreground">Total Workflows</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <div>
                <p className="text-2xl font-bold">{workflows.filter(w => w.isActive).length}</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-warning" />
              <div>
                <p className="text-2xl font-bold">{workflows.filter(w => w.status === 'running').length}</p>
                <p className="text-xs text-muted-foreground">Running</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-accent" />
              <div>
                <p className="text-2xl font-bold">{workflows.reduce((sum, w) => sum + w.runCount, 0)}</p>
                <p className="text-xs text-muted-foreground">Total Runs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workflows List */}
      <div className="grid gap-4">
        {workflows.map((workflow) => (
          <Card key={workflow.id} className="transition-all hover:shadow-medium">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(workflow.status)}
                    <CardTitle className="text-lg">{workflow.name}</CardTitle>
                  </div>
                  <Badge className={getStatusColor(workflow.status)}>
                    {workflow.status}
                  </Badge>
                  {workflow.isActive && (
                    <Badge variant="default" className="bg-success/10 text-success">
                      Active
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={workflow.isActive}
                    onCheckedChange={() => toggleWorkflow(workflow.id)}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => runWorkflow(workflow.id)}
                    disabled={workflow.status === 'running'}
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedWorkflow(workflow)}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteWorkflow(workflow.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{workflow.description}</p>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span>{workflow.triggers.length} trigger{workflow.triggers.length !== 1 ? 's' : ''}</span>
                  <span>{workflow.actions.length} action{workflow.actions.length !== 1 ? 's' : ''}</span>
                  <span>Run {workflow.runCount} times</span>
                </div>
                {workflow.lastRun && (
                  <span>Last run: {workflow.lastRun.toLocaleString()}</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {workflows.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Bot className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Workflows Created</h3>
            <p className="text-muted-foreground mb-4">Create your first workflow to automate repetitive tasks</p>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Workflow
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};