import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  Users, 
  Clock, 
  DollarSign, 
  Target,
  Calendar,
  Zap,
  AlertTriangle,
  CheckCircle,
  Activity,
  Globe,
  Smartphone,
  Monitor,
  RefreshCw
} from 'lucide-react';

interface AnalyticsMetric {
  label: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: React.ComponentType<any>;
  color: string;
}

interface UsageData {
  feature: string;
  usage: number;
  growth: number;
  category: 'core' | 'ai' | 'communication' | 'management';
}

interface PerformanceMetric {
  metric: string;
  value: number;
  benchmark: number;
  status: 'excellent' | 'good' | 'fair' | 'poor';
}

export default function Phase5Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [refreshing, setRefreshing] = useState(false);

  // Core Analytics Metrics
  const coreMetrics: AnalyticsMetric[] = [
    {
      label: 'Active Users',
      value: '247',
      change: 12.5,
      trend: 'up',
      icon: Users,
      color: 'text-primary'
    },
    {
      label: 'Recipe Views',
      value: '3,842',
      change: 8.3,
      trend: 'up',
      icon: BarChart3,
      color: 'text-success'
    },
    {
      label: 'AI Interactions',
      value: '1,256',
      change: 24.7,
      trend: 'up',
      icon: Zap,
      color: 'text-accent'
    },
    {
      label: 'Cost Savings',
      value: '$12,450',
      change: 15.2,
      trend: 'up',
      icon: DollarSign,
      color: 'text-warning'
    },
    {
      label: 'Efficiency Score',
      value: '94%',
      change: 5.1,
      trend: 'up',
      icon: Target,
      color: 'text-destructive'
    },
    {
      label: 'System Uptime',
      value: '99.9%',
      change: 0.1,
      trend: 'stable',
      icon: Activity,
      color: 'text-muted-foreground'
    }
  ];

  // Feature Usage Analytics
  const featureUsage: UsageData[] = [
    { feature: 'Recipe Management', usage: 89, growth: 12, category: 'core' },
    { feature: 'AI Recipe Generator', usage: 76, growth: 28, category: 'ai' },
    { feature: 'Staff Scheduling', usage: 82, growth: 8, category: 'management' },
    { feature: 'Team Communications', usage: 71, growth: 15, category: 'communication' },
    { feature: 'Inventory Tracking', usage: 65, growth: 22, category: 'core' },
    { feature: 'AI Meeting Notes', usage: 58, growth: 45, category: 'ai' },
    { feature: 'Menu Optimization', usage: 54, growth: 18, category: 'ai' },
    { feature: 'Cost Analysis', usage: 49, growth: 25, category: 'management' },
    { feature: 'Training Modules', usage: 43, growth: 31, category: 'management' },
    { feature: 'Customer Analytics', usage: 38, growth: 19, category: 'core' }
  ];

  // Performance Metrics
  const performanceMetrics: PerformanceMetric[] = [
    { metric: 'Page Load Time', value: 1.2, benchmark: 2.0, status: 'excellent' },
    { metric: 'API Response Time', value: 180, benchmark: 500, status: 'excellent' },
    { metric: 'Error Rate', value: 0.2, benchmark: 1.0, status: 'excellent' },
    { metric: 'User Satisfaction', value: 4.7, benchmark: 4.0, status: 'excellent' },
    { metric: 'Feature Adoption', value: 78, benchmark: 60, status: 'good' },
    { metric: 'Mobile Usage', value: 45, benchmark: 50, status: 'fair' }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'core': return 'bg-primary/10 text-primary border-primary/20';
      case 'ai': return 'bg-accent/10 text-accent border-accent/20';
      case 'communication': return 'bg-success/10 text-success border-success/20';
      case 'management': return 'bg-warning/10 text-warning border-warning/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-success';
      case 'good': return 'text-primary';
      case 'fair': return 'text-warning';
      case 'poor': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getTrendIcon = (trend: string, change: number) => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-success" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-destructive" />;
    return <div className="h-4 w-4" />;
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Comprehensive insights into your ChefCentral.Ai usage and performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <div className="flex rounded-md border">
            {(['7d', '30d', '90d', '1y'] as const).map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedPeriod(period)}
                className="rounded-none first:rounded-l-md last:rounded-r-md"
              >
                {period}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="features">Feature Usage</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Core Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coreMetrics.map((metric, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{metric.label}</p>
                      <p className="text-2xl font-bold">{metric.value}</p>
                      <div className="flex items-center gap-2 mt-2">
                        {getTrendIcon(metric.trend, metric.change)}
                        <span className={`text-sm ${
                          metric.trend === 'up' ? 'text-success' : 
                          metric.trend === 'down' ? 'text-destructive' : 
                          'text-muted-foreground'
                        }`}>
                          {metric.change > 0 ? '+' : ''}{metric.change}%
                        </span>
                        <span className="text-xs text-muted-foreground">vs last {selectedPeriod}</span>
                      </div>
                    </div>
                    <metric.icon className={`h-8 w-8 ${metric.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Usage Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Device Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Monitor className="h-4 w-4 text-primary" />
                      <span>Desktop</span>
                    </div>
                    <span className="font-medium">55%</span>
                  </div>
                  <Progress value={55} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4 text-success" />
                      <span>Mobile</span>
                    </div>
                    <span className="font-medium">35%</span>
                  </div>
                  <Progress value={35} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-accent" />
                      <span>Tablet</span>
                    </div>
                    <span className="font-medium">10%</span>
                  </div>
                  <Progress value={10} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Peak Usage Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { time: '8:00 AM', usage: 85, label: 'Morning Rush' },
                    { time: '12:00 PM', usage: 92, label: 'Lunch Peak' },
                    { time: '6:00 PM', usage: 78, label: 'Dinner Prep' },
                    { time: '10:00 PM', usage: 45, label: 'Close Down' }
                  ].map((hour) => (
                    <div key={hour.time} className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">{hour.time}</span>
                        <p className="text-xs text-muted-foreground">{hour.label}</p>
                      </div>
                      <div className="flex items-center gap-2 w-24">
                        <Progress value={hour.usage} className="h-2 flex-1" />
                        <span className="text-sm font-medium w-8 text-right">{hour.usage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Feature Adoption & Growth</CardTitle>
              <p className="text-sm text-muted-foreground">
                Track which features are most popular and growing fastest
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {featureUsage.map((feature, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border bg-card/50">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-8 bg-gradient-to-b from-primary to-accent rounded-full" 
                           style={{ opacity: feature.usage / 100 }} />
                      <div>
                        <p className="font-medium">{feature.feature}</p>
                        <Badge className={getCategoryColor(feature.category)}>
                          {feature.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{feature.usage}%</span>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3 text-success" />
                          <span className="text-sm text-success">+{feature.growth}%</span>
                        </div>
                      </div>
                      <Progress value={feature.usage} className="w-24 h-2 mt-1" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {performanceMetrics.map((metric, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{metric.metric}</p>
                        <p className="text-sm text-muted-foreground">
                          Benchmark: {metric.benchmark}{metric.metric.includes('Time') ? 'ms' : metric.metric.includes('Rate') ? '%' : metric.metric.includes('Satisfaction') ? '/5' : ''}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${getStatusColor(metric.status)}`}>
                          {metric.value}{metric.metric.includes('Time') ? 'ms' : metric.metric.includes('Rate') ? '%' : metric.metric.includes('Satisfaction') ? '/5' : ''}
                        </p>
                        <Badge variant="outline" className={getStatusColor(metric.status)}>
                          {metric.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-success/10">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-success" />
                      <span>All Systems Operational</span>
                    </div>
                    <Badge className="bg-success text-success-foreground">Healthy</Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Database Performance</span>
                      <span className="text-success">Excellent</span>
                    </div>
                    <Progress value={98} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>API Reliability</span>
                      <span className="text-success">Excellent</span>
                    </div>
                    <Progress value={99} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>AI Processing</span>
                      <span className="text-primary">Good</span>
                    </div>
                    <Progress value={87} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  AI Usage Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                    <h4 className="font-medium text-accent">Recipe AI Performance</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      AI-generated recipes have 23% higher ratings than manually created ones
                    </p>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <h4 className="font-medium text-primary">Cost Optimization</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      AI menu optimization saved $2,350 in food costs this month
                    </p>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                    <h4 className="font-medium text-success">Efficiency Gains</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Automated scheduling reduced planning time by 67%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-warning/10 border border-warning/20">
                    <AlertTriangle className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-warning">Increase Mobile Usage</p>
                      <p className="text-sm text-muted-foreground">
                        Consider promoting mobile app features to boost 35% mobile usage
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-primary">Expand AI Features</p>
                      <p className="text-sm text-muted-foreground">
                        High AI adoption suggests users want more automated features
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/10 border border-accent/20">
                    <TrendingUp className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-accent">Training Focus</p>
                      <p className="text-sm text-muted-foreground">
                        Lower training module usage indicates need for better onboarding
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}