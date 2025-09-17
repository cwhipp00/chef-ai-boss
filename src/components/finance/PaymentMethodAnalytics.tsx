import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  CreditCard, 
  Smartphone, 
  Banknote, 
  Gift,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface PaymentMethod {
  method: string;
  icon: React.ReactNode;
  volume: number;
  revenue: number;
  transactions: number;
  avgTicket: number;
  processingFee: number;
  netRevenue: number;
  marketShare: number;
  trend: number;
  customerPreference: number;
}

interface PaymentTrend {
  date: string;
  cash: number;
  credit: number;
  debit: number;
  mobile: number;
  gift: number;
}

interface ProcessingCost {
  method: string;
  rate: number;
  flatFee: number;
  totalCost: number;
  costPerTransaction: number;
}

export const PaymentMethodAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  
  // Mock data - will be populated from Toast POS API
  const [paymentMethods] = useState<PaymentMethod[]>([
    {
      method: 'Credit Cards',
      icon: <CreditCard className="h-4 w-4" />,
      volume: 11680.25,
      revenue: 11680.25,
      transactions: 387,
      avgTicket: 30.18,
      processingFee: 350.41,
      netRevenue: 11329.84,
      marketShare: 65.2,
      trend: 8.3,
      customerPreference: 78
    },
    {
      method: 'Debit Cards',
      icon: <CreditCard className="h-4 w-4" />,
      volume: 3260.00,
      revenue: 3260.00,
      transactions: 142,
      avgTicket: 22.96,
      processingFee: 42.80,
      netRevenue: 3217.20,
      marketShare: 18.2,
      trend: 12.1,
      customerPreference: 45
    },
    {
      method: 'Cash',
      icon: <Banknote className="h-4 w-4" />,
      volume: 2840.50,
      revenue: 2840.50,
      transactions: 89,
      avgTicket: 31.92,
      processingFee: 0,
      netRevenue: 2840.50,
      marketShare: 15.9,
      trend: -15.7,
      customerPreference: 22
    },
    {
      method: 'Mobile Pay',
      icon: <Smartphone className="h-4 w-4" />,
      volume: 890.00,
      revenue: 890.00,
      transactions: 32,
      avgTicket: 27.81,
      processingFee: 24.23,
      netRevenue: 865.77,
      marketShare: 5.0,
      trend: 45.2,
      customerPreference: 68
    },
    {
      method: 'Gift Cards',
      icon: <Gift className="h-4 w-4" />,
      volume: 450.00,
      revenue: 450.00,
      transactions: 18,
      avgTicket: 25.00,
      processingFee: 13.50,
      netRevenue: 436.50,
      marketShare: 2.5,
      trend: 22.8,
      customerPreference: 35
    }
  ]);

  const [weeklyTrends] = useState<PaymentTrend[]>([
    { date: 'Mon', cash: 320, credit: 1420, debit: 380, mobile: 120, gift: 60 },
    { date: 'Tue', cash: 280, credit: 1380, debit: 420, mobile: 140, gift: 45 },
    { date: 'Wed', cash: 350, credit: 1680, debit: 460, mobile: 180, gift: 80 },
    { date: 'Thu', cash: 400, credit: 1890, debit: 520, mobile: 200, gift: 75 },
    { date: 'Fri', cash: 480, credit: 2340, debit: 680, mobile: 280, gift: 120 },
    { date: 'Sat', cash: 620, credit: 2980, debit: 800, mobile: 320, gift: 90 },
    { date: 'Sun', cash: 390, credit: 2190, debit: 540, mobile: 150, gift: 70 }
  ]);

  const [processingCosts] = useState<ProcessingCost[]>([
    { method: 'Credit Cards', rate: 2.9, flatFee: 0.30, totalCost: 350.41, costPerTransaction: 0.91 },
    { method: 'Debit Cards', rate: 0.8, flatFee: 0.25, totalCost: 42.80, costPerTransaction: 0.30 },
    { method: 'Mobile Pay', rate: 2.7, flatFee: 0.25, totalCost: 24.23, costPerTransaction: 0.76 },
    { method: 'Gift Cards', rate: 3.0, flatFee: 0.00, totalCost: 13.50, costPerTransaction: 0.75 }
  ]);

  const getTrendIcon = (trend: number) => {
    return trend >= 0 ? 
      <TrendingUp className="h-4 w-4 text-success" /> : 
      <TrendingDown className="h-4 w-4 text-destructive" />;
  };

  const getTrendColor = (trend: number) => {
    return trend >= 0 ? 'text-success' : 'text-destructive';
  };

  const getPreferenceColor = (preference: number) => {
    if (preference >= 70) return 'text-success';
    if (preference >= 50) return 'text-warning';
    return 'text-destructive';
  };

  const calculateTotalProcessingCosts = () => {
    return processingCosts.reduce((sum, cost) => sum + cost.totalCost, 0);
  };

  const calculateOptimalMix = () => {
    // Calculate the most cost-effective payment mix
    const totalRevenue = paymentMethods.reduce((sum, method) => sum + method.revenue, 0);
    const totalCosts = calculateTotalProcessingCosts();
    const effectiveRate = (totalCosts / totalRevenue) * 100;
    
    return {
      totalRevenue,
      totalCosts,
      effectiveRate,
      potentialSavings: totalCosts * 0.15 // Estimated 15% savings with optimization
    };
  };

  const optimal = calculateOptimalMix();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Payment Method Analytics</h2>
          <p className="text-muted-foreground">Processing fees, trends, and optimization insights</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-gradient-primary">
            <DollarSign className="h-4 w-4 mr-2" />
            Cost Analysis
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-card hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gradient">
              ${optimal.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">All payment methods</p>
          </CardContent>
        </Card>

        <Card className="glass-card hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing Costs</CardTitle>
            <Percent className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              ${optimal.totalCosts.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {optimal.effectiveRate.toFixed(2)}% effective rate
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Revenue</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              ${(optimal.totalRevenue - optimal.totalCosts).toLocaleString()}
            </div>
            <p className="text-xs text-success">After processing fees</p>
          </CardContent>
        </Card>

        <Card className="glass-card hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Potential Savings</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              ${optimal.potentialSavings.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">With optimization</p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Method Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Method Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {paymentMethods.map((method, index) => (
            <div key={index} className="p-4 border rounded-lg hover:shadow-sm transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-muted/30">
                    {method.icon}
                  </div>
                  <div>
                    <h4 className="font-medium">{method.method}</h4>
                    <p className="text-sm text-muted-foreground">
                      {method.transactions} transactions
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getTrendIcon(method.trend)}
                  <Badge variant="outline">
                    {method.marketShare.toFixed(1)}% share
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-3">
                <div>
                  <p className="text-xs text-muted-foreground">Revenue</p>
                  <p className="font-medium text-success">${method.revenue.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Processing Fee</p>
                  <p className="font-medium text-destructive">${method.processingFee.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Net Revenue</p>
                  <p className="font-medium">${method.netRevenue.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Avg Ticket</p>
                  <p className="font-medium">${method.avgTicket.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Trend</p>
                  <p className={`font-medium ${getTrendColor(method.trend)}`}>
                    {method.trend >= 0 ? '+' : ''}{method.trend.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Customer Pref</p>
                  <p className={`font-medium ${getPreferenceColor(method.customerPreference)}`}>
                    {method.customerPreference}%
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Market Share</span>
                  <span>{method.marketShare.toFixed(1)}%</span>
                </div>
                <Progress value={method.marketShare} className="h-2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Weekly Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Weekly Payment Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weeklyTrends.map((day, index) => {
              const total = day.cash + day.credit + day.debit + day.mobile + day.gift;
              
              return (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{day.date}</h4>
                    <span className="text-sm font-medium">${total.toLocaleString()}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-20 text-xs">Credit</div>
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${(day.credit / total) * 100}%` }}
                        />
                      </div>
                      <div className="w-16 text-xs text-right">${day.credit}</div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="w-20 text-xs">Debit</div>
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div
                          className="bg-success h-2 rounded-full"
                          style={{ width: `${(day.debit / total) * 100}%` }}
                        />
                      </div>
                      <div className="w-16 text-xs text-right">${day.debit}</div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="w-20 text-xs">Cash</div>
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div
                          className="bg-warning h-2 rounded-full"
                          style={{ width: `${(day.cash / total) * 100}%` }}
                        />
                      </div>
                      <div className="w-16 text-xs text-right">${day.cash}</div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="w-20 text-xs">Mobile</div>
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: `${(day.mobile / total) * 100}%` }}
                        />
                      </div>
                      <div className="w-16 text-xs text-right">${day.mobile}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Processing Cost Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="h-5 w-5" />
            Processing Cost Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {processingCosts.map((cost, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">{cost.method}</h4>
                <Badge variant="outline" className="text-destructive">
                  ${cost.totalCost.toFixed(2)} total
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Rate</p>
                  <p className="font-medium">{cost.rate}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Flat Fee</p>
                  <p className="font-medium">${cost.flatFee.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Cost per Transaction</p>
                  <p className="font-medium">${cost.costPerTransaction.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Cost</p>
                  <p className="font-medium text-destructive">${cost.totalCost.toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
          
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Processing Costs:</span>
              <span className="text-xl font-bold text-destructive">
                ${calculateTotalProcessingCosts().toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Optimization Recommendations */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <AlertTriangle className="h-5 w-5" />
            Cost Optimization Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-success/10 rounded-lg border border-success/20">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="h-4 w-4 text-success" />
              <span className="font-medium text-sm">Promote Debit Card Usage</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Debit cards have the lowest processing cost (0.8% + $0.25). Promote with small discounts.
            </p>
            <p className="text-sm font-medium text-success mt-1">Potential monthly savings: $120</p>
          </div>

          <div className="p-3 bg-warning/10 rounded-lg border border-warning/20">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <span className="font-medium text-sm">Reduce Cash Handling Costs</span>
            </div>
            <p className="text-sm text-muted-foreground">
              While cash has no processing fees, consider hidden costs: time, security, banking fees.
            </p>
            <p className="text-sm font-medium text-warning mt-1">Evaluate: $150/month in handling costs</p>
          </div>

          <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm">Mobile Payment Growth</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Mobile payments growing 45% but still low volume. Consider customer incentives.
            </p>
            <p className="text-sm font-medium text-primary mt-1">Future revenue opportunity</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};