import { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, PieChart, BarChart3, Calculator } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const financialData = {
  revenue: {
    daily: 4250,
    weekly: 28750,
    monthly: 125600,
    change: 12.5
  },
  expenses: {
    foodCost: 35680,
    laborCost: 42300,
    rent: 8500,
    utilities: 2100,
    other: 5420
  },
  profit: {
    gross: 31500,
    net: 28400,
    margin: 22.6
  }
};

const menuItems = [
  { name: "Signature Pasta", revenue: 8420, cost: 2530, profit: 5890, margin: 70, orders: 156 },
  { name: "Grilled Salmon", revenue: 6730, cost: 2690, profit: 4040, margin: 60, orders: 98 },
  { name: "Caesar Salad", revenue: 3210, cost: 960, profit: 2250, margin: 70, orders: 214 },
  { name: "Ribeye Steak", revenue: 5890, cost: 2950, profit: 2940, margin: 50, orders: 76 },
  { name: "Chicken Parmesan", revenue: 4560, cost: 1370, profit: 3190, margin: 70, orders: 132 }
];

const dailySales = [
  { day: "Mon", sales: 3200, covers: 85 },
  { day: "Tue", sales: 2900, covers: 76 },
  { day: "Wed", sales: 3800, covers: 102 },
  { day: "Thu", sales: 4100, covers: 115 },
  { day: "Fri", sales: 5200, covers: 145 },
  { day: "Sat", sales: 6800, covers: 189 },
  { day: "Sun", sales: 4500, covers: 125 }
];

export default function FinanceDashboard() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const getMarginColor = (margin: number) => {
    if (margin >= 60) return 'text-success';
    if (margin >= 40) return 'text-warning';
    return 'text-destructive';
  };

  const getTrendIcon = (change: number) => {
    return change >= 0 ? 
      <TrendingUp className="h-4 w-4 text-success" /> : 
      <TrendingDown className="h-4 w-4 text-destructive" />;
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Financial Dashboard</h1>
          <p className="text-muted-foreground">Revenue tracking, P&L analysis, and cost management</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button size="lg" className="bg-gradient-primary hover-scale">
            <Calculator className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="profitability">Menu Analysis</TabsTrigger>
          <TabsTrigger value="expenses">Cost Management</TabsTrigger>
          <TabsTrigger value="trends">Sales Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-medium transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${financialData.revenue.monthly.toLocaleString()}</div>
                <div className="flex items-center gap-1 text-xs">
                  {getTrendIcon(financialData.revenue.change)}
                  <span className="text-success">+{financialData.revenue.change}% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-medium transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Gross Profit</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${financialData.profit.gross.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Margin: {financialData.profit.margin}%
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-medium transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Food Cost %</CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">28.4%</div>
                <p className="text-xs text-success">Target: 30% ✓</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-medium transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Labor Cost %</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">33.7%</div>
                <p className="text-xs text-warning">Target: 30%</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Food Sales</span>
                    <span className="font-medium">$89,200 (71%)</span>
                  </div>
                  <Progress value={71} className="h-2" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Beverage Sales</span>
                    <span className="font-medium">$28,400 (23%)</span>
                  </div>
                  <Progress value={23} className="h-2" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Other Revenue</span>
                    <span className="font-medium">$8,000 (6%)</span>
                  </div>
                  <Progress value={6} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Expense Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Labor Costs</span>
                    <span className="font-medium">$42,300 (45%)</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Food Costs</span>
                    <span className="font-medium">$35,680 (38%)</span>
                  </div>
                  <Progress value={38} className="h-2" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Fixed Costs</span>
                    <span className="font-medium">$16,020 (17%)</span>
                  </div>
                  <Progress value={17} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Daily Sales Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dailySales.map((day) => (
                    <div key={day.day} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 text-sm font-medium">{day.day}</div>
                        <div className="flex-1">
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all duration-500"
                              style={{ width: `${(day.sales / 6800) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <div className="font-medium">${day.sales.toLocaleString()}</div>
                        <div className="text-muted-foreground">{day.covers} covers</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Avg Check Size</span>
                    <span className="font-medium">$32.50</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Covers per Day</span>
                    <span className="font-medium">119</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Table Turnover</span>
                    <span className="font-medium">2.3x</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Revenue per Seat</span>
                    <span className="font-medium">$156</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="profitability" className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Menu Item Profitability</h3>
              <Select defaultValue="profit">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="profit">Sort by Profit</SelectItem>
                  <SelectItem value="margin">Sort by Margin</SelectItem>
                  <SelectItem value="volume">Sort by Volume</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {menuItems.map((item, index) => (
              <Card key={item.name} className="hover:shadow-medium transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-medium text-lg">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">{item.orders} orders this month</p>
                    </div>
                    <Badge className={`${getMarginColor(item.margin)} bg-transparent border`}>
                      {item.margin}% margin
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Revenue</p>
                      <p className="text-xl font-bold text-success">${item.revenue.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Cost</p>
                      <p className="text-xl font-bold text-destructive">${item.cost.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Profit</p>
                      <p className="text-xl font-bold text-primary">${item.profit.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Avg per Order</p>
                      <p className="text-xl font-bold">${(item.revenue / item.orders).toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Profitability</span>
                      <span>{item.margin}%</span>
                    </div>
                    <Progress value={item.margin} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cost Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { category: 'Labor Costs', amount: 42300, target: 40000, color: 'bg-destructive' },
                  { category: 'Food Costs', amount: 35680, target: 38000, color: 'bg-success' },
                  { category: 'Rent & Utilities', amount: 10600, target: 11000, color: 'bg-primary' },
                  { category: 'Other Expenses', amount: 5420, target: 6000, color: 'bg-warning' }
                ].map((item) => (
                  <div key={item.category} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{item.category}</span>
                      <div className="text-right">
                        <div className="font-medium">${item.amount.toLocaleString()}</div>
                        <div className={`text-xs ${item.amount <= item.target ? 'text-success' : 'text-destructive'}`}>
                          Target: ${item.target.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`${item.color} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${Math.min((item.amount / item.target) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Control Opportunities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 border-l-4 border-l-warning bg-warning/5 rounded">
                  <h4 className="font-medium text-sm">Labor Cost Optimization</h4>
                  <p className="text-sm text-muted-foreground">
                    Labor costs are 5.4% above target. Consider schedule optimization.
                  </p>
                  <p className="text-sm font-medium text-warning">Potential savings: $2,300/month</p>
                </div>
                
                <div className="p-3 border-l-4 border-l-success bg-success/5 rounded">
                  <h4 className="font-medium text-sm">Food Cost Control</h4>
                  <p className="text-sm text-muted-foreground">
                    Food costs are within target. Good portion control maintained.
                  </p>
                  <p className="text-sm font-medium text-success">On track</p>
                </div>
                
                <div className="p-3 border-l-4 border-l-primary bg-primary/5 rounded">
                  <h4 className="font-medium text-sm">Waste Reduction</h4>
                  <p className="text-sm text-muted-foreground">
                    Implement better inventory tracking to reduce waste by 15%.
                  </p>
                  <p className="text-sm font-medium text-primary">Potential savings: $890/month</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Cost Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <h4 className="font-medium text-lg">This Month</h4>
                  <p className="text-3xl font-bold">$94,000</p>
                  <p className="text-sm text-muted-foreground">Total Expenses</p>
                </div>
                <div className="text-center">
                  <h4 className="font-medium text-lg">Last Month</h4>
                  <p className="text-3xl font-bold">$89,500</p>
                  <p className="text-sm text-muted-foreground">Total Expenses</p>
                </div>
                <div className="text-center">
                  <h4 className="font-medium text-lg">Difference</h4>
                  <p className="text-3xl font-bold text-destructive">+$4,500</p>
                  <p className="text-sm text-muted-foreground">5% increase</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-success">$125,600</p>
                    <p className="text-sm text-muted-foreground">This Month</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-lg font-medium">$28,750</p>
                      <p className="text-xs text-muted-foreground">This Week</p>
                    </div>
                    <div>
                      <p className="text-lg font-medium">$4,250</p>
                      <p className="text-xs text-muted-foreground">Today</p>
                    </div>
                    <div>
                      <p className="text-lg font-medium">$32.50</p>
                      <p className="text-xs text-muted-foreground">Avg Check</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Growth Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { metric: 'Revenue Growth', value: '+12.5%', trend: 'up' },
                    { metric: 'Customer Count', value: '+8.2%', trend: 'up' },
                    { metric: 'Average Check', value: '+3.8%', trend: 'up' },
                    { metric: 'Cost Control', value: '-2.1%', trend: 'down' }
                  ].map((item) => (
                    <div key={item.metric} className="flex justify-between items-center">
                      <span className="text-sm">{item.metric}</span>
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${item.trend === 'up' ? 'text-success' : 'text-destructive'}`}>
                          {item.value}
                        </span>
                        {item.trend === 'up' ? 
                          <TrendingUp className="h-4 w-4 text-success" /> : 
                          <TrendingDown className="h-4 w-4 text-destructive" />
                        }
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Forecast & Projections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 border rounded-lg">
                  <h4 className="font-medium">Next Month Forecast</h4>
                  <p className="text-2xl font-bold text-primary">$138,200</p>
                  <p className="text-sm text-success">+10% projected growth</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <h4 className="font-medium">Quarterly Target</h4>
                  <p className="text-2xl font-bold text-warning">$410,000</p>
                  <p className="text-sm text-muted-foreground">92% on track</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <h4 className="font-medium">Annual Projection</h4>
                  <p className="text-2xl font-bold text-success">$1.62M</p>
                  <p className="text-sm text-success">Above target by 8%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}