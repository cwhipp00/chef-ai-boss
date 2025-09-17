import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Brain, 
  ChefHat, 
  BarChart3, 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Bot,
  Zap,
  Target,
  Sparkles,
  Activity,
  Cpu,
  MessageSquare,
  FileText,
  Clock,
  Star
} from 'lucide-react';

interface AIAgent {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: 'analysis' | 'optimization' | 'automation' | 'assistance';
  isActive: boolean;
  lastUsed?: string;
  accuracy?: number;
  tasksCompleted?: number;
  color: string;
}

interface AIInsight {
  id: string;
  agent: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  action?: string;
  timestamp: string;
}

export function EnhancedAIAgentDashboard() {
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [aiAnalysisResults, setAiAnalysisResults] = useState<any>(null);
  const { toast } = useToast();

  const aiAgents: AIAgent[] = [
    {
      id: 'recipe-enhancer',
      name: 'Recipe Optimizer',
      description: 'Analyzes and improves recipes for cost, nutrition, and efficiency',
      icon: ChefHat,
      category: 'optimization',
      isActive: true,
      accuracy: 94,
      tasksCompleted: 127,
      color: 'bg-orange-500'
    },
    {
      id: 'scheduling-optimizer',
      name: 'Schedule Optimizer',
      description: 'Optimizes staff scheduling based on demand and labor costs',
      icon: Calendar,
      category: 'optimization',
      isActive: true,
      accuracy: 89,
      tasksCompleted: 43,
      color: 'bg-blue-500'
    },
    {
      id: 'menu-optimizer',
      name: 'Menu Analyzer',
      description: 'Analyzes menu performance and suggests improvements',
      icon: BarChart3,
      category: 'analysis',
      isActive: true,
      accuracy: 91,
      tasksCompleted: 67,
      color: 'bg-green-500'
    },
    {
      id: 'sentiment-analyzer',
      name: 'Customer Sentiment',
      description: 'Analyzes customer feedback and reviews for insights',
      icon: MessageSquare,
      category: 'analysis',
      isActive: true,
      accuracy: 87,
      tasksCompleted: 234,
      color: 'bg-purple-500'
    },
    {
      id: 'inventory-analyzer',
      name: 'Inventory Intelligence',
      description: 'Predicts inventory needs and optimizes ordering',
      icon: TrendingUp,
      category: 'optimization',
      isActive: true,
      accuracy: 92,
      tasksCompleted: 156,
      color: 'bg-red-500'
    },
    {
      id: 'voice-separator',
      name: 'Voice Processing',
      description: 'Separates and transcribes multiple speakers in meetings',
      icon: Users,
      category: 'automation',
      isActive: false,
      accuracy: 85,
      tasksCompleted: 12,
      color: 'bg-pink-500'
    }
  ];

  useEffect(() => {
    setAgents(aiAgents);
    generateMockInsights();
    setLoading(false);
  }, []);

  const generateMockInsights = () => {
    const mockInsights: AIInsight[] = [
      {
        id: '1',
        agent: 'Menu Analyzer',
        title: 'High-Performing Menu Items Identified',
        description: 'Your pasta dishes show 23% higher profit margins than average. Consider expanding this category.',
        priority: 'high',
        action: 'Review Menu Strategy',
        timestamp: '2 hours ago'
      },
      {
        id: '2',
        agent: 'Inventory Intelligence',
        title: 'Stock Level Alert',
        description: 'Tomatoes projected to run out in 3 days based on current usage patterns.',
        priority: 'medium',
        action: 'Place Order',
        timestamp: '4 hours ago'
      },
      {
        id: '3',
        agent: 'Customer Sentiment',
        title: 'Positive Trend in Reviews',
        description: 'Customer satisfaction increased 15% this week, particularly praising service speed.',
        priority: 'low',
        timestamp: '1 day ago'
      },
      {
        id: '4',
        agent: 'Schedule Optimizer',
        title: 'Optimal Staffing Suggestion',
        description: 'Friday lunch shift could reduce costs by 12% with current staff redistribution.',
        priority: 'medium',
        action: 'Adjust Schedule',
        timestamp: '6 hours ago'
      }
    ];
    setInsights(mockInsights);
  };

  const runAIAnalysis = async (agentId: string) => {
    setSelectedAgent(agentId);
    const agent = agents.find(a => a.id === agentId);
    
    if (!agent) return;

    toast({
      title: "AI Analysis Started",
      description: `${agent.name} is analyzing your data...`,
    });

    try {
      // Call the appropriate edge function based on agent
      const functionName = `ai-${agentId.replace('-', '-')}`;
      
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: {
          restaurantData: {
            location: 'Downtown Restaurant',
            cuisine: 'American',
            avgDailyOrders: 150,
            staffCount: 12
          },
          analysisType: 'comprehensive',
          timeframe: 'last_30_days'
        }
      });

      if (error) throw error;

      setAiAnalysisResults({
        agent: agent.name,
        results: data,
        timestamp: new Date().toISOString()
      });

      toast({
        title: "Analysis Complete",
        description: `${agent.name} has finished analyzing your data.`,
      });

    } catch (error) {
      console.error('AI Analysis Error:', error);
      toast({
        title: "Analysis Failed",
        description: "Unable to complete AI analysis. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-500 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-500 bg-green-50 border-green-200';
      default: return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Agent Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{agents.filter(a => a.isActive).length}</p>
                <p className="text-sm text-muted-foreground">Active Agents</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Brain className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{agents.reduce((acc, a) => acc + (a.tasksCompleted || 0), 0)}</p>
                <p className="text-sm text-muted-foreground">Tasks Completed</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">
                  {Math.round(agents.reduce((acc, a) => acc + (a.accuracy || 0), 0) / agents.length)}%
                </p>
                <p className="text-sm text-muted-foreground">Avg Accuracy</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Agents Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="h-5 w-5" />
            AI Agent Control Center
          </CardTitle>
          <CardDescription>
            Manage and deploy your AI agents for restaurant optimization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent) => {
              const Icon = agent.icon;
              return (
                <Card key={agent.id} className="relative overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-2 rounded-lg ${agent.color} text-white`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <Badge 
                        variant={agent.isActive ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {agent.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    
                    <h3 className="font-semibold mb-1">{agent.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {agent.description}
                    </p>
                    
                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between text-xs">
                        <span>Accuracy</span>
                        <span>{agent.accuracy}%</span>
                      </div>
                      <Progress value={agent.accuracy} className="h-2" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {agent.tasksCompleted} tasks
                      </span>
                      <Button
                        size="sm"
                        onClick={() => runAIAnalysis(agent.id)}
                        disabled={!agent.isActive || selectedAgent === agent.id}
                        className="h-7 px-3 text-xs"
                      >
                        {selectedAgent === agent.id ? (
                          <>
                            <Bot className="h-3 w-3 mr-1 animate-pulse" />
                            Running...
                          </>
                        ) : (
                          <>
                            <Zap className="h-3 w-3 mr-1" />
                            Analyze
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* AI Insights & Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI Insights & Recommendations
          </CardTitle>
          <CardDescription>
            Latest insights and actionable recommendations from your AI agents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.map((insight) => (
              <div key={insight.id} className="flex items-start gap-4 p-4 border rounded-lg">
                <div className={`p-2 rounded-full ${getPriorityColor(insight.priority)}`}>
                  {insight.priority === 'high' ? (
                    <AlertCircle className="h-4 w-4" />
                  ) : insight.priority === 'medium' ? (
                    <Clock className="h-4 w-4" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium">{insight.title}</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {insight.agent}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {insight.timestamp}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {insight.description}
                  </p>
                  {insight.action && (
                    <Button variant="outline" size="sm" className="h-7 px-3 text-xs">
                      {insight.action}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {aiAnalysisResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Latest Analysis Results: {aiAnalysisResults.agent}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(aiAnalysisResults.results, null, 2)}
                </pre>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Analysis completed: {new Date(aiAnalysisResults.timestamp).toLocaleString()}</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setAiAnalysisResults(null)}
                >
                  Clear Results
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}