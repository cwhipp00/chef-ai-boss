import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Zap, 
  Clock, 
  Bell, 
  ShoppingCart, 
  Users, 
  Calendar,
  MessageSquare,
  FileText,
  Settings,
  Play,
  Pause,
  Plus
} from 'lucide-react';

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  category: string;
  isActive: boolean;
  trigger: string;
  action: string;
  lastRun?: string;
  icon: React.ReactNode;
}

const automationRules: AutomationRule[] = [
  {
    id: '1',
    name: 'Auto Staff Scheduling',
    description: 'Automatically adjust staff schedules based on demand forecasts',
    category: 'Staff Management',
    isActive: true,
    trigger: 'Daily at 6 AM',
    action: 'Optimize staff schedule',
    lastRun: '2 hours ago',
    icon: <Users className="h-4 w-4" />
  },
  {
    id: '2',
    name: 'Inventory Reorder',
    description: 'Automatically reorder supplies when stock levels are low',
    category: 'Inventory',
    isActive: true,
    trigger: 'Stock level < 20%',
    action: 'Create purchase order',
    lastRun: '4 hours ago',
    icon: <ShoppingCart className="h-4 w-4" />
  },
  {
    id: '3',
    name: 'Customer Feedback Alerts',
    description: 'Send notifications for negative reviews requiring immediate attention',
    category: 'Customer Service',
    isActive: false,
    trigger: 'Review rating < 3 stars',
    action: 'Alert management team',
    icon: <Bell className="h-4 w-4" />
  },
  {
    id: '4',
    name: 'Menu Price Optimization',
    description: 'Adjust menu prices based on demand and cost fluctuations',
    category: 'Revenue',
    isActive: true,
    trigger: 'Weekly analysis',
    action: 'Update menu prices',
    lastRun: '1 day ago',
    icon: <FileText className="h-4 w-4" />
  },
  {
    id: '5',
    name: 'Team Communication',
    description: 'Send daily briefings and updates to staff',
    category: 'Communication',
    isActive: true,
    trigger: 'Daily at 8 AM',
    action: 'Send team updates',
    lastRun: '6 hours ago',
    icon: <MessageSquare className="h-4 w-4" />
  },
  {
    id: '6',
    name: 'Equipment Maintenance Reminders',
    description: 'Schedule and remind staff about equipment maintenance',
    category: 'Maintenance',
    isActive: true,
    trigger: 'Based on usage hours',
    action: 'Create maintenance task',
    lastRun: '12 hours ago',
    icon: <Settings className="h-4 w-4" />
  }
];

export function AutomationHub() {
  const [rules, setRules] = useState<AutomationRule[]>(automationRules);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newRule, setNewRule] = useState({
    name: '',
    description: '',
    category: '',
    trigger: '',
    action: ''
  });
  const { toast } = useToast();

  const toggleRule = (ruleId: string) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId 
        ? { ...rule, isActive: !rule.isActive }
        : rule
    ));

    const rule = rules.find(r => r.id === ruleId);
    toast({
      title: `Automation ${rule?.isActive ? 'Disabled' : 'Enabled'}`,
      description: `${rule?.name} has been ${rule?.isActive ? 'disabled' : 'enabled'}`,
    });
  };

  const runRule = (ruleId: string) => {
    const rule = rules.find(r => r.id === ruleId);
    toast({
      title: "Automation Running",
      description: `${rule?.name} is now executing...`,
    });

    // Update last run time
    setTimeout(() => {
      setRules(prev => prev.map(r => 
        r.id === ruleId 
          ? { ...r, lastRun: 'Just now' }
          : r
      ));
      
      toast({
        title: "Automation Complete",
        description: `${rule?.name} executed successfully`,
      });
    }, 2000);
  };

  const createNewRule = () => {
    if (!newRule.name || !newRule.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const rule: AutomationRule = {
      id: Date.now().toString(),
      ...newRule,
      isActive: false,
      icon: <Zap className="h-4 w-4" />
    };

    setRules(prev => [...prev, rule]);
    setNewRule({
      name: '',
      description: '',
      category: '',
      trigger: '',
      action: ''
    });
    setShowCreateForm(false);

    toast({
      title: "Automation Created",
      description: `${rule.name} has been added to your automation rules`,
    });
  };

  const categories = ['Staff Management', 'Inventory', 'Customer Service', 'Revenue', 'Communication', 'Maintenance'];

  const activeRules = rules.filter(rule => rule.isActive).length;
  const totalRules = rules.length;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{activeRules}</div>
            <p className="text-xs text-muted-foreground">of {totalRules} total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tasks Automated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">247</div>
            <p className="text-xs text-muted-foreground">this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Time Saved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">18.5h</div>
            <p className="text-xs text-muted-foreground">this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">98%</div>
            <p className="text-xs text-muted-foreground">automation success</p>
          </CardContent>
        </Card>
      </div>

      {/* Automation Rules */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Automation Rules
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Manage and configure your automated processes
              </p>
            </div>
            <Button 
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-gradient-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Rule
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {showCreateForm && (
            <Card className="border-2 border-dashed border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">Create New Automation Rule</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ruleName">Rule Name</Label>
                    <Input
                      id="ruleName"
                      placeholder="Enter rule name"
                      value={newRule.name}
                      onChange={(e) => setNewRule({...newRule, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select onValueChange={(value) => setNewRule({...newRule, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Describe what this automation does"
                    value={newRule.description}
                    onChange={(e) => setNewRule({...newRule, description: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="trigger">Trigger</Label>
                    <Input
                      id="trigger"
                      placeholder="When should this run?"
                      value={newRule.trigger}
                      onChange={(e) => setNewRule({...newRule, trigger: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="action">Action</Label>
                    <Input
                      id="action"
                      placeholder="What should happen?"
                      value={newRule.action}
                      onChange={(e) => setNewRule({...newRule, action: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={createNewRule} className="bg-gradient-primary">
                    Create Rule
                  </Button>
                  <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4">
            {rules.map((rule) => (
              <Card key={rule.id} className={`transition-all ${rule.isActive ? 'border-green-200 bg-green-50/50 dark:bg-green-950/10' : 'border-gray-200'}`}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="flex-shrink-0 mt-1">
                        {rule.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{rule.name}</h4>
                          <Badge variant="outline">{rule.category}</Badge>
                          <Badge className={rule.isActive ? 'bg-green-500' : 'bg-gray-500'}>
                            {rule.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{rule.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground">
                          <div>
                            <span className="font-medium">Trigger:</span> {rule.trigger}
                          </div>
                          <div>
                            <span className="font-medium">Action:</span> {rule.action}
                          </div>
                        </div>
                        {rule.lastRun && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Last run: {rule.lastRun}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={rule.isActive}
                          onCheckedChange={() => toggleRule(rule.id)}
                        />
                        <Label className="text-xs">
                          {rule.isActive ? 'On' : 'Off'}
                        </Label>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => runRule(rule.id)}
                        disabled={!rule.isActive}
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Run Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}