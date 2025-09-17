import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, 
  Download, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Percent,
  Calendar,
  BarChart3,
  Target,
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';

interface PLLine {
  category: string;
  description: string;
  amount: number;
  percentage: number;
  trend: number;
  benchmark?: number;
  status: 'good' | 'warning' | 'poor';
}

interface PLPeriod {
  period: string;
  revenue: number;
  cogs: number;
  grossProfit: number;
  expenses: number;
  netProfit: number;
  margin: number;
}

export const AutomatedPLGeneration = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [comparisonPeriod, setComparisonPeriod] = useState('previous');
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock data - will be populated from Toast POS API
  const [plData] = useState<PLLine[]>([
    // Revenue
    { category: 'Revenue', description: 'Food Sales', amount: 89200, percentage: 71.0, trend: 8.5, benchmark: 70, status: 'good' },
    { category: 'Revenue', description: 'Beverage Sales', amount: 28400, percentage: 22.6, trend: 12.3, benchmark: 25, status: 'warning' },
    { category: 'Revenue', description: 'Other Revenue', amount: 8000, percentage: 6.4, trend: -2.1, benchmark: 5, status: 'good' },
    
    // Cost of Goods Sold
    { category: 'COGS', description: 'Food Costs', amount: -35680, percentage: -28.4, trend: -2.1, benchmark: -30, status: 'good' },
    { category: 'COGS', description: 'Beverage Costs', amount: -8520, percentage: -6.8, trend: 1.5, benchmark: -7, status: 'good' },
    
    // Operating Expenses
    { category: 'Expenses', description: 'Labor Costs', amount: -42300, percentage: -33.7, trend: 3.2, benchmark: -32, status: 'warning' },
    { category: 'Expenses', description: 'Rent & Utilities', amount: -10600, percentage: -8.4, trend: 0.5, benchmark: -8, status: 'good' },
    { category: 'Expenses', description: 'Marketing', amount: -2800, percentage: -2.2, trend: 15.8, benchmark: -3, status: 'good' },
    { category: 'Expenses', description: 'Insurance', amount: -1200, percentage: -1.0, trend: 0.0, benchmark: -1, status: 'good' },
    { category: 'Expenses', description: 'Equipment & Maintenance', amount: -1850, percentage: -1.5, trend: -8.2, benchmark: -2, status: 'good' },
    { category: 'Expenses', description: 'Professional Services', amount: -950, percentage: -0.8, trend: 5.5, benchmark: -1, status: 'good' },
    { category: 'Expenses', description: 'Other Operating Expenses', amount: -2420, percentage: -1.9, trend: -12.1, benchmark: -2, status: 'good' }
  ]);

  const [historicalData] = useState<PLPeriod[]>([
    { period: 'Jan 2024', revenue: 125600, cogs: 44200, grossProfit: 81400, expenses: 62000, netProfit: 19400, margin: 15.4 },
    { period: 'Feb 2024', revenue: 118200, cogs: 41300, grossProfit: 76900, expenses: 58500, netProfit: 18400, margin: 15.6 },
    { period: 'Mar 2024', revenue: 132800, cogs: 46800, grossProfit: 86000, expenses: 64200, netProfit: 21800, margin: 16.4 },
    { period: 'Apr 2024', revenue: 128900, cogs: 45100, grossProfit: 83800, expenses: 61800, netProfit: 22000, margin: 17.1 },
    { period: 'May 2024', revenue: 135400, cogs: 47600, grossProfit: 87800, expenses: 63500, netProfit: 24300, margin: 17.9 },
    { period: 'Current', revenue: 125600, cogs: 44200, grossProfit: 81400, expenses: 62000, netProfit: 19400, margin: 15.4 }
  ]);

  const calculateTotals = () => {
    const revenue = plData.filter(item => item.category === 'Revenue').reduce((sum, item) => sum + item.amount, 0);
    const cogs = Math.abs(plData.filter(item => item.category === 'COGS').reduce((sum, item) => sum + item.amount, 0));
    const expenses = Math.abs(plData.filter(item => item.category === 'Expenses').reduce((sum, item) => sum + item.amount, 0));
    const grossProfit = revenue - cogs;
    const netProfit = grossProfit - expenses;
    const grossMargin = (grossProfit / revenue) * 100;
    const netMargin = (netProfit / revenue) * 100;
    
    return {
      revenue,
      cogs,
      expenses,
      grossProfit,
      netProfit,
      grossMargin,
      netMargin
    };
  };

  const totals = calculateTotals();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-success';
      case 'warning': return 'text-warning';
      case 'poor': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'good': return { color: 'bg-success', text: 'On Target', icon: <CheckCircle className="h-3 w-3" /> };
      case 'warning': return { color: 'bg-warning', text: 'Review', icon: <AlertTriangle className="h-3 w-3" /> };
      case 'poor': return { color: 'bg-destructive', text: 'Action Needed', icon: <AlertTriangle className="h-3 w-3" /> };
      default: return { color: 'bg-muted', text: 'Unknown', icon: null };
    }
  };

  const getTrendIcon = (trend: number) => {
    return trend >= 0 ? 
      <TrendingUp className="h-3 w-3 text-success" /> : 
      <TrendingDown className="h-3 w-3 text-destructive" />;
  };

  const generatePLReport = async () => {
    setIsGenerating(true);
    // Simulate API call to generate comprehensive P&L
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(false);
  };

  const exportPL = () => {
    // In real implementation, this would generate and download a PDF/Excel report
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Category,Description,Amount,Percentage,Trend,Status\n" +
      plData.map(item => 
        `${item.category},"${item.description}",${item.amount},${item.percentage},${item.trend},${item.status}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `P&L_Report_${selectedPeriod}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Automated P&L Generation</h2>
          <p className="text-muted-foreground">Real-time profit & loss statements with insights</p>
        </div>
        <div className="flex items-center gap-3">
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
          <Select value={comparisonPeriod} onValueChange={setComparisonPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="previous">vs Previous</SelectItem>
              <SelectItem value="lastYear">vs Last Year</SelectItem>
              <SelectItem value="budget">vs Budget</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={generatePLReport} disabled={isGenerating} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Generating...' : 'Refresh'}
          </Button>
          <Button onClick={exportPL} className="bg-gradient-primary">
            <Download className="h-4 w-4 mr-2" />
            Export P&L
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gradient">
              ${totals.revenue.toLocaleString()}
            </div>
            <p className="text-xs text-success">+8.5% vs previous period</p>
          </CardContent>
        </Card>

        <Card className="glass-card hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gross Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              ${totals.grossProfit.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {totals.grossMargin.toFixed(1)}% margin
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              ${totals.netProfit.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {totals.netMargin.toFixed(1)}% net margin
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <BarChart3 className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              ${totals.expenses.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {((totals.expenses / totals.revenue) * 100).toFixed(1)}% of revenue
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed P&L Statement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Profit & Loss Statement - {selectedPeriod}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Revenue Section */}
            <div>
              <h3 className="font-semibold text-lg mb-3 text-success">Revenue</h3>
              <div className="space-y-2">
                {plData.filter(item => item.category === 'Revenue').map((item, index) => {
                  const badge = getStatusBadge(item.status);
                  
                  return (
                    <div key={index} className="flex items-center justify-between p-3 bg-success/5 rounded-lg border border-success/20">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{item.description}</span>
                        <Badge className={`${badge.color} text-white text-xs`}>
                          {badge.icon}
                          {badge.text}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="text-right">
                          <div className="font-medium">${item.amount.toLocaleString()}</div>
                          <div className="text-muted-foreground">{item.percentage.toFixed(1)}%</div>
                        </div>
                        <div className="flex items-center gap-1">
                          {getTrendIcon(item.trend)}
                          <span className={item.trend >= 0 ? 'text-success' : 'text-destructive'}>
                            {item.trend >= 0 ? '+' : ''}{item.trend.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 p-3 bg-success/10 rounded-lg border-2 border-success/30">
                <div className="flex justify-between items-center font-semibold">
                  <span>Total Revenue</span>
                  <span className="text-success">${totals.revenue.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* COGS Section */}
            <div>
              <h3 className="font-semibold text-lg mb-3 text-warning">Cost of Goods Sold</h3>
              <div className="space-y-2">
                {plData.filter(item => item.category === 'COGS').map((item, index) => {
                  const badge = getStatusBadge(item.status);
                  
                  return (
                    <div key={index} className="flex items-center justify-between p-3 bg-warning/5 rounded-lg border border-warning/20">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{item.description}</span>
                        <Badge className={`${badge.color} text-white text-xs`}>
                          {badge.icon}
                          {badge.text}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="text-right">
                          <div className="font-medium">${Math.abs(item.amount).toLocaleString()}</div>
                          <div className="text-muted-foreground">{Math.abs(item.percentage).toFixed(1)}%</div>
                        </div>
                        <div className="flex items-center gap-1">
                          {getTrendIcon(item.trend)}
                          <span className={item.trend >= 0 ? 'text-success' : 'text-destructive'}>
                            {item.trend >= 0 ? '+' : ''}{item.trend.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 p-3 bg-warning/10 rounded-lg border-2 border-warning/30">
                <div className="flex justify-between items-center font-semibold">
                  <span>Total COGS</span>
                  <span className="text-warning">${totals.cogs.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Gross Profit */}
            <div className="p-4 bg-primary/10 rounded-lg border-2 border-primary/30">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Gross Profit</span>
                <div className="text-right">
                  <div className="text-xl font-bold text-primary">${totals.grossProfit.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">{totals.grossMargin.toFixed(1)}% margin</div>
                </div>
              </div>
            </div>

            {/* Operating Expenses */}
            <div>
              <h3 className="font-semibold text-lg mb-3 text-destructive">Operating Expenses</h3>
              <div className="space-y-2">
                {plData.filter(item => item.category === 'Expenses').map((item, index) => {
                  const badge = getStatusBadge(item.status);
                  
                  return (
                    <div key={index} className="flex items-center justify-between p-3 bg-destructive/5 rounded-lg border border-destructive/20">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{item.description}</span>
                        <Badge className={`${badge.color} text-white text-xs`}>
                          {badge.icon}
                          {badge.text}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="text-right">
                          <div className="font-medium">${Math.abs(item.amount).toLocaleString()}</div>
                          <div className="text-muted-foreground">{Math.abs(item.percentage).toFixed(1)}%</div>
                        </div>
                        <div className="flex items-center gap-1">
                          {getTrendIcon(item.trend)}
                          <span className={item.trend >= 0 ? 'text-success' : 'text-destructive'}>
                            {item.trend >= 0 ? '+' : ''}{item.trend.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 p-3 bg-destructive/10 rounded-lg border-2 border-destructive/30">
                <div className="flex justify-between items-center font-semibold">
                  <span>Total Operating Expenses</span>
                  <span className="text-destructive">${totals.expenses.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Net Profit */}
            <div className="p-4 bg-gradient-to-r from-primary/20 to-success/20 rounded-lg border-2 border-primary/30">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold">Net Profit</span>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">${totals.netProfit.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">{totals.netMargin.toFixed(1)}% net margin</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Historical Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Historical Performance Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {historicalData.map((period, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{period.period}</h4>
                  <Badge variant={period.margin >= 16 ? "default" : period.margin >= 14 ? "secondary" : "outline"}>
                    {period.margin.toFixed(1)}% margin
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Revenue</p>
                    <p className="font-medium text-success">${period.revenue.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">COGS</p>
                    <p className="font-medium text-warning">${period.cogs.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Gross Profit</p>
                    <p className="font-medium">${period.grossProfit.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Expenses</p>
                    <p className="font-medium text-destructive">${period.expenses.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Net Profit</p>
                    <p className="font-medium text-primary">${period.netProfit.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};