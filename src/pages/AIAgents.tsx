import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Brain, 
  MessageSquare, 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign,
  ChefHat,
  Calendar,
  FileText,
  Zap,
  Target,
  PieChart,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Lightbulb,
  Cpu,
  Database,
  Settings,
  Play
} from 'lucide-react';

interface AITool {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  status: 'available' | 'processing' | 'completed';
  accuracy?: number;
}

const aiTools: AITool[] = [
  {
    id: 'menu-optimizer',
    name: 'Menu Optimizer',
    description: 'AI-powered menu analysis and optimization suggestions',
    category: 'Operations',
    icon: <ChefHat className="h-5 w-5" />,
    status: 'available',
    accuracy: 94
  },
  {
    id: 'demand-forecasting',
    name: 'Demand Forecasting',
    description: 'Predict customer demand and inventory needs',
    category: 'Analytics',
    icon: <TrendingUp className="h-5 w-5" />,
    status: 'available',
    accuracy: 89
  },
  {
    id: 'staff-scheduler',
    name: 'Smart Staff Scheduler',
    description: 'Optimize staff scheduling based on demand patterns',
    category: 'Staff Management',
    icon: <Users className="h-5 w-5" />,
    status: 'available',
    accuracy: 92
  },
  {
    id: 'cost-analyzer',
    name: 'Cost Analyzer',
    description: 'Analyze costs and identify savings opportunities',
    category: 'Finance',
    icon: <DollarSign className="h-5 w-5" />,
    status: 'available',
    accuracy: 96
  },
  {
    id: 'customer-sentiment',
    name: 'Customer Sentiment Analysis',
    description: 'Analyze customer feedback and reviews for insights',
    category: 'Customer Experience',
    icon: <MessageSquare className="h-5 w-5" />,
    status: 'available',
    accuracy: 88
  },
  {
    id: 'recipe-analyzer',
    name: 'Recipe Performance Analyzer',
    description: 'Analyze recipe performance and suggest improvements',
    category: 'Operations',
    icon: <BarChart3 className="h-5 w-5" />,
    status: 'available',
    accuracy: 91
  }
];

export default function AIAgents() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [inputText, setInputText] = useState('');
  const { toast } = useToast();

  const handleRunAnalysis = async (toolId: string) => {
    setIsProcessing(true);
    setResults(null);

    // Simulate AI processing
    toast({
      title: "AI Analysis Started",
      description: "Processing your request with advanced AI algorithms...",
    });

    // Simulate processing time
    setTimeout(() => {
      const mockResults = generateMockResults(toolId);
      setResults(mockResults);
      setIsProcessing(false);
      
      toast({
        title: "Analysis Complete",
        description: "AI analysis completed successfully with actionable insights",
      });
    }, 3000);
  };

  const generateMockResults = (toolId: string) => {
    switch (toolId) {
      case 'menu-optimizer':
        return {
          recommendations: [
            { item: 'Pasta Carbonara', action: 'Increase price by 8%', impact: '+$2,400/month' },
            { item: 'Grilled Salmon', action: 'Add seasonal variant', impact: '+15% orders' },
            { item: 'Caesar Salad', action: 'Bundle with appetizers', impact: '+$1,200/month' }
          ],
          metrics: {
            totalPotentialIncrease: '$4,800',
            customerSatisfactionImpact: '+12%',
            profitMarginImprovement: '+8%'
          }
        };
      case 'demand-forecasting':
        return {
          forecasts: [
            { period: 'Next Week', demand: '2,340 orders', confidence: '94%' },
            { period: 'Next Month', demand: '9,750 orders', confidence: '87%' },
            { period: 'Holiday Season', demand: '15,200 orders', confidence: '91%' }
          ],
          insights: [
            'Friday evenings show 40% higher demand',
            'Seafood dishes peak on weekends',
            'Expect 25% increase during holiday season'
          ]
        };
      case 'customer-sentiment':
        return {
          sentiment: {
            positive: 78,
            neutral: 15,
            negative: 7
          },
          insights: [
            'Customers love the new seasonal menu',
            'Service speed mentioned in 23% of reviews',
            'Ambiance rated highly (4.6/5 average)'
          ],
          actionItems: [
            'Address service speed during peak hours',
            'Promote highly-rated seasonal dishes',
            'Consider extending happy hour'
          ]
        };
      default:
        return {
          message: 'Analysis completed successfully',
          data: 'Mock data for ' + toolId
        };
    }
  };

  const selectedToolData = aiTools.find(tool => tool.id === selectedTool);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient">AI Management Center</h1>
          <p className="text-muted-foreground">Leverage advanced AI to optimize your restaurant operations</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Cpu className="h-3 w-3" />
            AI Engine Active
          </Badge>
          <Badge className="bg-green-500">
            <Zap className="h-3 w-3 mr-1" />
            Ready
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="tools" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 max-w-lg">
          <TabsTrigger value="tools">AI Tools</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="tools" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* AI Tools Grid */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aiTools.map((tool) => (
                  <Card 
                    key={tool.id} 
                    className={`hover-lift cursor-pointer transition-all ${
                      selectedTool === tool.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedTool(tool.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {tool.icon}
                          <CardTitle className="text-base">{tool.name}</CardTitle>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {tool.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{tool.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            tool.status === 'available' ? 'bg-green-500' : 
                            tool.status === 'processing' ? 'bg-yellow-500' : 'bg-gray-500'
                          }`} />
                          <span className="text-xs text-muted-foreground capitalize">
                            {tool.status}
                          </span>
                        </div>
                        {tool.accuracy && (
                          <span className="text-xs font-medium">
                            {tool.accuracy}% Accuracy
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* AI Tool Detail Panel */}
            <div className="space-y-4">
              {selectedToolData ? (
                <Card className="glass-card">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      {selectedToolData.icon}
                      <CardTitle className="text-lg">{selectedToolData.name}</CardTitle>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {selectedToolData.description}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="ai-input">Input Parameters</Label>
                      <Textarea
                        id="ai-input"
                        placeholder="Enter specific parameters or leave blank for general analysis..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span>Processing Power</span>
                        <span>High</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Expected Duration</span>
                        <span>2-3 minutes</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Accuracy Level</span>
                        <span>{selectedToolData.accuracy}%</span>
                      </div>
                    </div>

                    <Button 
                      onClick={() => handleRunAnalysis(selectedTool!)}
                      disabled={isProcessing}
                      className="w-full bg-gradient-primary"
                    >
                      {isProcessing ? (
                        <>
                          <Brain className="h-4 w-4 mr-2 animate-pulse" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Run Analysis
                        </>
                      )}
                    </Button>

                    {isProcessing && (
                      <div className="space-y-2">
                        <Progress value={33} className="w-full" />
                        <p className="text-xs text-center text-muted-foreground">
                          AI analyzing your data...
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card className="glass-card">
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <Brain className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground text-center">
                      Select an AI tool to get started with intelligent analysis
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Results Panel */}
              {results && (
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      Analysis Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {results.recommendations && (
                        <div>
                          <h4 className="font-medium mb-2">Recommendations</h4>
                          <div className="space-y-2">
                            {results.recommendations.map((rec: any, index: number) => (
                              <div key={index} className="p-3 bg-muted/50 rounded-lg">
                                <div className="font-medium text-sm">{rec.item}</div>
                                <div className="text-xs text-muted-foreground">{rec.action}</div>
                                <div className="text-xs font-medium text-green-600">{rec.impact}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {results.insights && (
                        <div>
                          <h4 className="font-medium mb-2">Key Insights</h4>
                          <div className="space-y-1">
                            {results.insights.map((insight: string, index: number) => (
                              <div key={index} className="flex items-start gap-2 text-sm">
                                <Lightbulb className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                                {insight}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {results.metrics && (
                        <div>
                          <h4 className="font-medium mb-2">Impact Metrics</h4>
                          <div className="grid grid-cols-1 gap-2">
                            {Object.entries(results.metrics).map(([key, value]) => (
                              <div key={key} className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                </span>
                                <span className="font-medium">{value as string}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Performance Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Revenue Growth</span>
                    <span className="text-sm font-medium text-green-600">+12.3%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Customer Satisfaction</span>
                    <span className="text-sm font-medium text-green-600">+8.7%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Cost Efficiency</span>
                    <span className="text-sm font-medium text-green-600">+15.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  Action Required
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm">• Review inventory levels for weekend rush</div>
                  <div className="text-sm">• Update staff schedule for next week</div>
                  <div className="text-sm">• Address customer feedback on service speed</div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  Goal Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Monthly Revenue</span>
                      <span>84%</span>
                    </div>
                    <Progress value={84} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Cost Reduction</span>
                      <span>67%</span>
                    </div>
                    <Progress value={67} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Automated Workflows</CardTitle>
              <p className="text-sm text-muted-foreground">
                Set up AI-powered automation for routine tasks
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Auto-Schedule Staff</h4>
                      <Badge className="bg-green-500">Active</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Automatically optimize staff schedules based on demand forecasts
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Configure</Button>
                      <Button size="sm" variant="outline">Pause</Button>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Inventory Alerts</h4>
                      <Badge variant="outline">Inactive</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Get automated alerts when inventory levels are low
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm">Enable</Button>
                      <Button size="sm" variant="outline">Configure</Button>
                    </div>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Configuration</CardTitle>
              <p className="text-sm text-muted-foreground">
                Configure AI settings and preferences
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>AI Processing Power</Label>
                <div className="flex gap-4">
                  <Button variant="outline" size="sm">Standard</Button>
                  <Button size="sm">High Performance</Button>
                  <Button variant="outline" size="sm">Maximum</Button>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Data Sources</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">Sales Data</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">Customer Feedback</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" />
                    <span className="text-sm">External Market Data</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}