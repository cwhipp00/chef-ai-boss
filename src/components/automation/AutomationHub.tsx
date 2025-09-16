import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAutomation } from '@/hooks/useAutomation';
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
  Plus,
  Loader2
} from 'lucide-react';

export function AutomationHub() {
  const { rules, loading, createRule, toggleRule, executeRule } = useAutomation();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newRule, setNewRule] = useState({
    name: '',
    description: '',
    category: '',
    trigger_config: {},
    action_config: {}
  });
  const { toast } = useToast();

  const handleToggleRule = async (ruleId: string) => {
    const rule = rules.find(r => r.id === ruleId);
    if (rule) {
      await toggleRule(ruleId, !rule.is_active);
    }
  };

  const handleRunRule = async (ruleId: string) => {
    await executeRule(ruleId);
  };

  const handleCreateNewRule = async () => {
    if (!newRule.name || !newRule.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    await createRule({
      name: newRule.name,
      description: newRule.description,
      category: newRule.category || 'General',
      trigger_config: newRule.trigger_config,
      action_config: newRule.action_config,
      is_active: false
    });

    setNewRule({
      name: '',
      description: '',
      category: '',
      trigger_config: {},
      action_config: {}
    });
    setShowCreateForm(false);
  };

  const categories = ['Staff Management', 'Inventory', 'Customer Service', 'Revenue', 'Communication', 'Maintenance'];
  const activeRules = rules.filter(rule => rule.is_active).length;
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
                      value={(newRule.trigger_config as any)?.trigger || ''}
                      onChange={(e) => setNewRule({...newRule, trigger_config: { trigger: e.target.value }})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="action">Action</Label>
                    <Input
                      id="action"
                      placeholder="What should happen?"
                      value={(newRule.action_config as any)?.action || ''}
                      onChange={(e) => setNewRule({...newRule, action_config: { action: e.target.value }})}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCreateNewRule} className="bg-gradient-primary">
                    Create Rule
                  </Button>
                  <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading automation rules...</span>
            </div>
          ) : (
            <div className="grid gap-4">
              {rules.map((rule) => (
                <Card key={rule.id} className={`transition-all ${rule.is_active ? 'border-green-200 bg-green-50/50 dark:bg-green-950/10' : 'border-gray-200'}`}>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="flex-shrink-0 mt-1">
                          <Zap className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{rule.name}</h4>
                            <Badge variant="outline">{rule.category}</Badge>
                            <Badge className={rule.is_active ? 'bg-green-500' : 'bg-gray-500'}>
                              {rule.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{rule.description}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground">
                            <div>
                              <span className="font-medium">Executions:</span> {rule.execution_count || 0}
                            </div>
                            <div>
                              <span className="font-medium">Category:</span> {rule.category}
                            </div>
                          </div>
                          {rule.last_execution && (
                            <p className="text-xs text-muted-foreground mt-2">
                              Last run: {new Date(rule.last_execution).toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={rule.is_active}
                            onCheckedChange={() => handleToggleRule(rule.id)}
                          />
                          <Label className="text-xs">
                            {rule.is_active ? 'On' : 'Off'}
                          </Label>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRunRule(rule.id)}
                          disabled={!rule.is_active}
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Run Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {rules.length === 0 && !loading && (
                <div className="text-center py-12">
                  <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No automation rules</h3>
                  <p className="text-muted-foreground mb-4">Create your first automation rule to get started</p>
                  <Button onClick={() => setShowCreateForm(true)} className="bg-gradient-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Rule
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}