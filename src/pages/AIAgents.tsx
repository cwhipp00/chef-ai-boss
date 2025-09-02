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
  Play,
  GraduationCap,
  HelpCircle,
  Shield,
  UserCheck,
  Clipboard,
  BookOpen,
  Award,
  PhoneCall,
  Search,
  Wrench
} from 'lucide-react';

interface AITool {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  status: 'available' | 'processing' | 'completed';
  accuracy?: number;
  type?: 'analysis' | 'assistant';
}

const aiTools: AITool[] = [
  {
    id: 'menu-optimizer',
    name: 'Menu Optimizer',
    description: 'AI-powered menu analysis and optimization suggestions',
    category: 'Operations',
    icon: <ChefHat className="h-5 w-5" />,
    status: 'available',
    accuracy: 94,
    type: 'analysis'
  },
  {
    id: 'demand-forecasting',
    name: 'Demand Forecasting',
    description: 'Predict customer demand and inventory needs',
    category: 'Analytics',
    icon: <TrendingUp className="h-5 w-5" />,
    status: 'available',
    accuracy: 89,
    type: 'analysis'
  },
  {
    id: 'staff-scheduler',
    name: 'Smart Staff Scheduler',
    description: 'Optimize staff scheduling based on demand patterns',
    category: 'Staff Management',
    icon: <Users className="h-5 w-5" />,
    status: 'available',
    accuracy: 92,
    type: 'analysis'
  },
  {
    id: 'cost-analyzer',
    name: 'Cost Analyzer',
    description: 'Analyze costs and identify savings opportunities',
    category: 'Finance',
    icon: <DollarSign className="h-5 w-5" />,
    status: 'available',
    accuracy: 96,
    type: 'analysis'
  },
  {
    id: 'customer-sentiment',
    name: 'Customer Sentiment Analysis',
    description: 'Analyze customer feedback and reviews for insights',
    category: 'Customer Experience',
    icon: <MessageSquare className="h-5 w-5" />,
    status: 'available',
    accuracy: 88,
    type: 'analysis'
  },
  {
    id: 'recipe-analyzer',
    name: 'Recipe Performance Analyzer',
    description: 'Analyze recipe performance and suggest improvements',
    category: 'Operations',
    icon: <BarChart3 className="h-5 w-5" />,
    status: 'available',
    accuracy: 91,
    type: 'analysis'
  }
];

const managerAssistants: AITool[] = [
  {
    id: 'training-coach',
    name: 'Training & Learning Coach',
    description: 'Get guidance on staff training, onboarding, and skill development',
    category: 'Training',
    icon: <GraduationCap className="h-5 w-5" />,
    status: 'available',
    type: 'assistant'
  },
  {
    id: 'problem-solver',
    name: 'Problem Solving Assistant',
    description: 'Ask questions about operational challenges and get step-by-step solutions',
    category: 'Operations',
    icon: <HelpCircle className="h-5 w-5" />,
    status: 'available',
    type: 'assistant'
  },
  {
    id: 'compliance-guide',
    name: 'Compliance & Safety Guide',
    description: 'Get help with health codes, safety protocols, and regulatory compliance',
    category: 'Compliance',
    icon: <Shield className="h-5 w-5" />,
    status: 'available',
    type: 'assistant'
  },
  {
    id: 'leadership-mentor',
    name: 'Leadership Mentor',
    description: 'Learn management techniques, team building, and leadership skills',
    category: 'Leadership',
    icon: <UserCheck className="h-5 w-5" />,
    status: 'available',
    type: 'assistant'
  },
  {
    id: 'procedure-builder',
    name: 'Procedure Builder',
    description: 'Create and optimize standard operating procedures and workflows',
    category: 'Operations',
    icon: <Clipboard className="h-5 w-5" />,
    status: 'available',
    type: 'assistant'
  },
  {
    id: 'knowledge-base',
    name: 'Restaurant Knowledge Base',
    description: 'Search through restaurant best practices, industry standards, and guides',
    category: 'Knowledge',
    icon: <BookOpen className="h-5 w-5" />,
    status: 'available',
    type: 'assistant'
  },
  {
    id: 'performance-coach',
    name: 'Performance Coach',
    description: 'Get advice on employee performance, feedback, and improvement plans',
    category: 'HR',
    icon: <Award className="h-5 w-5" />,
    status: 'available',
    type: 'assistant'
  },
  {
    id: 'crisis-manager',
    name: 'Crisis Management Assistant',
    description: 'Handle difficult situations, customer complaints, and emergency protocols',
    category: 'Crisis Management',
    icon: <PhoneCall className="h-5 w-5" />,
    status: 'available',
    type: 'assistant'
  },
  {
    id: 'research-assistant',
    name: 'Industry Research Assistant',
    description: 'Get current industry trends, competitor analysis, and market insights',
    category: 'Research',
    icon: <Search className="h-5 w-5" />,
    status: 'available',
    type: 'assistant'
  },
  {
    id: 'troubleshooter',
    name: 'Equipment & Systems Troubleshooter',
    description: 'Get help with equipment issues, POS systems, and technical problems',
    category: 'Technical',
    icon: <Wrench className="h-5 w-5" />,
    status: 'available',
    type: 'assistant'
  }
];

export default function AIAgents() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [inputText, setInputText] = useState('');
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const [activeTab, setActiveTab] = useState('tools');
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

  const handleAssistantChat = async () => {
    if (!inputText.trim()) return;

    const userMessage = inputText.trim();
    setInputText('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsProcessing(true);

    try {
      // Call AI assistant edge function
      const response = await fetch('https://lfpnnlkjqpphstpcmcsi.supabase.co/functions/v1/ai-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assistantType: selectedTool!,
          message: userMessage,
          conversationHistory: chatMessages
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get assistant response');
      }

      const { response: assistantResponse } = await response.json();
      setChatMessages(prev => [...prev, { role: 'assistant', content: assistantResponse }]);
    } catch (error) {
      console.error('Assistant chat error:', error);
      // Fallback response
      const fallbackResponse = generateAssistantResponse(selectedTool!, userMessage);
      setChatMessages(prev => [...prev, { role: 'assistant', content: fallbackResponse }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateAssistantResponse = (assistantId: string, question: string) => {
    const responses: Record<string, string[]> = {
      'training-coach': [
        "For new server training, I recommend a 3-day structured program: Day 1 covers menu knowledge and POS basics, Day 2 focuses on service standards and customer interaction, and Day 3 includes shadowing experienced staff. Always include a practical assessment before they work independently.",
        "When training staff on food safety, use visual aids and hands-on demonstrations. Cover the 4 key areas: personal hygiene, cross-contamination prevention, proper temperatures, and cleaning procedures. Schedule refresher training every 6 months.",
        "Create a training checklist for each position with clear objectives. Use role-playing exercises for customer service scenarios and provide immediate feedback. Document all training completion for compliance records."
      ],
      'problem-solver': [
        "For long wait times during peak hours, implement these solutions: 1) Cross-train staff for multiple positions, 2) Optimize your prep work schedule, 3) Consider a host/hostess system for better table management, 4) Use a kitchen display system to improve order flow.",
        "When dealing with inventory discrepancies, start with a systematic approach: Check receiving logs, review portion control standards, audit waste tracking, and implement daily counting procedures for high-value items.",
        "For customer complaints about food quality, follow the LEARN method: Listen actively, Empathize with their concern, Ask clarifying questions, Respond with a solution, and Note the feedback for kitchen improvement."
      ],
      'compliance-guide': [
        "For health department inspections, maintain these standards daily: Keep temperature logs current, ensure all staff have valid food handler certificates, maintain proper cleaning schedules, and keep pest control documentation updated. Post required certifications visibly.",
        "OSHA compliance requires: Proper storage of cleaning chemicals with SDS sheets accessible, slip-resistant mats in work areas, first aid kit maintained and accessible, and all equipment properly grounded and maintained.",
        "For liquor license compliance, ensure: All staff serving alcohol are properly certified, valid ID checking procedures are followed, no service to intoxicated customers, and all required licenses are current and displayed."
      ],
      'leadership-mentor': [
        "Effective team management starts with clear communication. Hold brief daily meetings to set expectations, provide regular feedback (both positive and constructive), and create opportunities for staff input on operational improvements.",
        "When dealing with staff conflicts, address issues immediately and privately. Use active listening, remain neutral, focus on behaviors not personalities, and work together to find mutually acceptable solutions.",
        "To improve employee retention, focus on: Fair scheduling practices, competitive compensation, recognition programs, clear career advancement paths, and creating a positive work environment where staff feel valued."
      ],
      'procedure-builder': [
        "For opening procedures, create a checklist including: Equipment safety checks, temperature verification, cash register setup, prep work review, cleanliness inspection, and staff briefing. Assign specific responsibilities to team members.",
        "Standard closing procedures should cover: Food storage and labeling, equipment cleaning and sanitizing, cash reconciliation, security checks, and next-day prep notes. Use a sign-off system for accountability.",
        "Create SOPs that are clear, concise, and include step-by-step instructions with photos when helpful. Review and update procedures quarterly based on staff feedback and operational changes."
      ],
      'knowledge-base': [
        "Industry best practices for food cost control: Target 28-32% food cost percentage, implement portion control standards, use recipe costing cards, conduct regular inventory counts, and negotiate with suppliers for better pricing.",
        "Customer service excellence requires: Greeting within 60 seconds, order accuracy above 95%, average service time under 20 minutes for casual dining, and proactive problem resolution. Train staff to anticipate customer needs.",
        "Revenue optimization strategies include: Dynamic pricing for peak hours, upselling training for staff, menu engineering to highlight profitable items, and loyalty programs to increase repeat visits."
      ],
      'performance-coach': [
        "When addressing performance issues, use the DESC method: Describe the specific behavior, Express how it impacts the team/customers, Specify what needs to change, and describe the Consequences of continued issues. Document all conversations.",
        "For positive reinforcement, provide specific praise immediately after good performance. Use the SBI model: Situation, Behavior, Impact. This helps employees understand exactly what they did well and encourages repetition.",
        "Create performance improvement plans with: Clear measurable goals, specific timelines, regular check-ins, additional training resources, and consequences for not meeting expectations. Always focus on behaviors that can be changed."
      ],
      'crisis-manager': [
        "For customer complaints, use the BLAST method: Believe the customer, Listen actively, Apologize sincerely, Satisfy with a solution, and Thank them for their feedback. Always follow up to ensure satisfaction.",
        "In case of food poisoning allegations: Document everything, preserve suspect food samples, contact your insurance company immediately, cooperate with health department investigations, and communicate transparently with affected customers.",
        "For equipment failures during peak service: Have backup plans ready, cross-train staff on manual procedures, maintain emergency contact lists for repair services, and communicate delays honestly to customers with compensation offers."
      ],
      'research-assistant': [
        "Current restaurant industry trends show: Increased demand for plant-based options (23% growth), contactless ordering/payment systems, ghost kitchens for delivery, sustainable practices, and personalized dining experiences through technology.",
        "Labor shortage solutions being implemented: Increased wages (15-20% average increase), flexible scheduling, employee referral bonuses, automation for repetitive tasks, and enhanced benefits packages including health insurance.",
        "Technology adoption in restaurants: 67% now use mobile ordering, 45% have implemented AI for inventory management, QR code menus remain popular post-pandemic, and customer data analytics for personalized marketing."
      ],
      'troubleshooter': [
        "For POS system issues: First check internet connectivity, restart the terminal, verify printer connections, and check for software updates. Keep printed backup order forms available for emergencies.",
        "Common refrigeration problems: Check door seals for proper closure, clean condenser coils monthly, monitor temperature logs, and ensure proper air circulation around units. Call for service if temperatures fluctuate.",
        "For ice machine maintenance: Clean weekly with sanitizer solution, replace water filters every 6 months, check for proper drainage, and descale quarterly. Poor ice quality often indicates filter or cleaning issues."
      ]
    };

    const assistantResponses = responses[assistantId] || ["I can help you with that! Let me provide some guidance based on restaurant industry best practices."];
    return assistantResponses[Math.floor(Math.random() * assistantResponses.length)];
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
        <TabsList className="grid w-full grid-cols-5 max-w-2xl">
          <TabsTrigger value="tools">AI Tools</TabsTrigger>
          <TabsTrigger value="assistants">Manager Assistants</TabsTrigger>
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

        <TabsContent value="assistants" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Manager Assistants Grid */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {managerAssistants.map((assistant) => (
                  <Card 
                    key={assistant.id} 
                    className={`hover-lift cursor-pointer transition-all ${
                      selectedTool === assistant.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedTool(assistant.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {assistant.icon}
                          <CardTitle className="text-base">{assistant.name}</CardTitle>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {assistant.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{assistant.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          <span className="text-xs text-muted-foreground">
                            Available
                          </span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          Interactive
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Chat Interface for Manager Assistants */}
            <div className="space-y-4">
              {selectedTool && managerAssistants.find(a => a.id === selectedTool) ? (
                <Card className="glass-card">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      {managerAssistants.find(a => a.id === selectedTool)?.icon}
                      <CardTitle className="text-lg">
                        {managerAssistants.find(a => a.id === selectedTool)?.name}
                      </CardTitle>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Ask me anything about {managerAssistants.find(a => a.id === selectedTool)?.category.toLowerCase()}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Chat Messages */}
                    <div className="max-h-60 overflow-y-auto space-y-3 p-3 bg-muted/20 rounded-lg">
                      {chatMessages.length === 0 ? (
                        <div className="text-center text-muted-foreground text-sm py-4">
                          <MessageSquare className="h-8 w-8 mx-auto mb-2" />
                          Start a conversation by asking a question below
                        </div>
                      ) : (
                        chatMessages.map((message, index) => (
                          <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-2 rounded-lg text-sm ${
                              message.role === 'user' 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-background border'
                            }`}>
                              {message.content}
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Chat Input */}
                    <div className="space-y-3">
                      <Textarea
                        placeholder="Ask your question here... (e.g., 'How do I handle a difficult customer complaint?')"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="min-h-[80px]"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleAssistantChat();
                          }
                        }}
                      />
                      <Button 
                        onClick={handleAssistantChat}
                        className="w-full"
                        disabled={!inputText.trim() || isProcessing}
                      >
                        {isProcessing ? (
                          <>
                            <Brain className="h-4 w-4 mr-2 animate-pulse" />
                            Thinking...
                          </>
                        ) : (
                          <>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Ask Question
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                      💡 Try asking: "What's the best way to train new servers?" or "How do I handle food safety violations?"
                    </div>
                  </CardContent>
                </Card>
              ) : selectedTool && aiTools.find(t => t.id === selectedTool) ? (
                // Show existing tool interface for analysis tools
                <Card className="glass-card">
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <Brain className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground text-center">
                      This is an analysis tool. Switch to the AI Tools tab to use it.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Card className="glass-card">
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <GraduationCap className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground text-center">
                      Select a manager assistant to start getting help with your questions
                    </p>
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