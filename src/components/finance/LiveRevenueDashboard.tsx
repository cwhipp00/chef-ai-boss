import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Clock,
  RefreshCw,
  Zap,
  AlertTriangle
} from 'lucide-react';

interface RevenueGoal {
  period: string;
  target: number;
  current: number;
  timeRemaining: string;
}

interface HourlyData {
  hour: number;
  sales: number;
  transactions: number;
  avgTicket: number;
}

export const LiveRevenueDashboard = () => {
  const [isLive, setIsLive] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  
  // Mock data - will be replaced with Toast POS API integration
  const [revenueData, setRevenueData] = useState({
    currentSales: 12450,
    hourlyGrowth: 8.5,
    todayVsYesterday: 15.2,
    avgTicketSize: 28.75,
    transactionCount: 433
  });

  const [goals] = useState<RevenueGoal[]>([
    { period: 'Today', target: 15000, current: 12450, timeRemaining: '4h 23m' },
    { period: 'This Week', target: 85000, current: 67200, timeRemaining: '2d 4h' },
    { period: 'This Month', target: 320000, current: 285600, timeRemaining: '8d 12h' }
  ]);

  const [hourlyData] = useState<HourlyData[]>([
    { hour: 11, sales: 850, transactions: 28, avgTicket: 30.36 },
    { hour: 12, sales: 1420, transactions: 52, avgTicket: 27.31 },
    { hour: 13, sales: 1680, transactions: 61, avgTicket: 27.54 },
    { hour: 14, sales: 1150, transactions: 38, avgTicket: 30.26 },
    { hour: 15, sales: 890, transactions: 31, avgTicket: 28.71 },
    { hour: 16, sales: 1240, transactions: 44, avgTicket: 28.18 },
    { hour: 17, sales: 1580, transactions: 56, avgTicket: 28.21 },
    { hour: 18, sales: 2100, transactions: 72, avgTicket: 29.17 },
    { hour: 19, sales: 1740, transactions: 59, avgTicket: 29.49 }
  ]);

  const toggleLiveMode = () => {
    setIsLive(!isLive);
    if (!isLive) {
      // Start simulated live updates
      const interval = setInterval(() => {
        setRevenueData(prev => ({
          ...prev,
          currentSales: prev.currentSales + Math.random() * 50,
          transactionCount: prev.transactionCount + Math.floor(Math.random() * 3)
        }));
        setLastUpdate(new Date());
      }, 30000); // Update every 30 seconds

      return () => clearInterval(interval);
    }
  };

  const getTrendColor = (value: number) => {
    return value >= 0 ? 'text-success' : 'text-destructive';
  };

  const getTrendIcon = (value: number) => {
    return value >= 0 ? 
      <TrendingUp className="h-4 w-4 text-success" /> : 
      <TrendingDown className="h-4 w-4 text-destructive" />;
  };

  const getGoalProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getGoalStatus = (current: number, target: number) => {
    const progress = (current / target) * 100;
    if (progress >= 90) return { color: 'text-success', status: 'On Track' };
    if (progress >= 70) return { color: 'text-warning', status: 'At Risk' };
    return { color: 'text-destructive', status: 'Behind' };
  };

  return (
    <div className="space-y-6">
      {/* Header with Live Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Live Revenue Dashboard</h2>
          <p className="text-muted-foreground">Real-time sales tracking and goal monitoring</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-muted-foreground">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
          <Button
            onClick={toggleLiveMode}
            variant={isLive ? "default" : "outline"}
            className={isLive ? "bg-success hover:bg-success/90" : ""}
          >
            {isLive ? (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Live Mode
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Start Live
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Current Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-primary">
              <DollarSign className="h-4 w-4 text-primary-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gradient">
              ${revenueData.currentSales.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-xs">
              {getTrendIcon(revenueData.todayVsYesterday)}
              <span className={`font-medium ${getTrendColor(revenueData.todayVsYesterday)}`}>
                {revenueData.todayVsYesterday > 0 ? '+' : ''}{revenueData.todayVsYesterday}% vs yesterday
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hourly Growth</CardTitle>
            <div className="p-2 rounded-lg bg-success">
              <TrendingUp className="h-4 w-4 text-success-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              +{revenueData.hourlyGrowth}%
            </div>
            <p className="text-xs text-muted-foreground">Last hour performance</p>
          </CardContent>
        </Card>

        <Card className="glass-card hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Ticket Size</CardTitle>
            <div className="p-2 rounded-lg bg-primary">
              <Target className="h-4 w-4 text-primary-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${revenueData.avgTicketSize}</div>
            <p className="text-xs text-muted-foreground">Target: $30.00</p>
          </CardContent>
        </Card>

        <Card className="glass-card hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <div className="p-2 rounded-lg bg-warning">
              <Clock className="h-4 w-4 text-warning-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{revenueData.transactionCount}</div>
            <p className="text-xs text-muted-foreground">Total today</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Goals Tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Revenue Goals Tracking
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {goals.map((goal) => {
            const progress = getGoalProgress(goal.current, goal.target);
            const status = getGoalStatus(goal.current, goal.target);
            
            return (
              <div key={goal.period} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{goal.period}</h4>
                    <p className="text-sm text-muted-foreground">
                      ${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className={`${status.color} bg-transparent border`}>
                      {status.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {goal.timeRemaining} remaining
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>{progress.toFixed(1)}% complete</span>
                    <span>${(goal.target - goal.current).toLocaleString()} to go</span>
                  </div>
                  <Progress value={progress} className="h-3" />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Hourly Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Hourly Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {hourlyData.map((hour) => (
              <div key={hour.hour} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-16 text-sm font-medium">
                    {hour.hour}:00
                  </div>
                  <div className="flex-1">
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(hour.sales / 2100) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-6 text-sm">
                  <div className="text-center">
                    <div className="font-medium">${hour.sales}</div>
                    <div className="text-muted-foreground text-xs">Sales</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{hour.transactions}</div>
                    <div className="text-muted-foreground text-xs">Orders</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">${hour.avgTicket}</div>
                    <div className="text-muted-foreground text-xs">Avg Ticket</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Alerts */}
      <Card className="border-warning">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-warning">
            <AlertTriangle className="h-5 w-5" />
            Performance Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-warning/10 rounded-lg border border-warning/20">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-warning" />
              <span className="font-medium text-sm">Peak Hour Underperformance</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              7PM sales are 15% below average. Consider staff adjustments or promotions.
            </p>
          </div>
          <div className="p-3 bg-success/10 rounded-lg border border-success/20">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-success" />
              <span className="font-medium text-sm">Strong Lunch Performance</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Lunch sales exceeded target by 22%. Great job team!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};