import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Brain
} from 'lucide-react';

interface CashFlowPrediction {
  date: string;
  predictedInflow: number;
  predictedOutflow: number;
  netCashFlow: number;
  runningBalance: number;
  confidence: number;
  factors: string[];
}

interface CashFlowAlert {
  type: 'warning' | 'success' | 'info';
  message: string;
  action?: string;
  impact: number;
}

export const CashFlowForecasting = () => {
  const [forecastPeriod, setForecastPeriod] = useState('7days');
  
  // Mock data - will be enhanced with Toast POS API integration
  const [currentBalance] = useState(45600);
  
  const [predictions] = useState<CashFlowPrediction[]>([
    {
      date: '2024-01-18',
      predictedInflow: 15200,
      predictedOutflow: 8900,
      netCashFlow: 6300,
      runningBalance: 51900,
      confidence: 92,
      factors: ['Historical Thursday patterns', 'Weather forecast: Clear', 'No major events']
    },
    {
      date: '2024-01-19',
      predictedInflow: 18600,
      predictedOutflow: 9400,
      netCashFlow: 9200,
      runningBalance: 61100,
      confidence: 88,
      factors: ['Friday peak day', 'Local event nearby', 'Staff overtime expected']
    },
    {
      date: '2024-01-20',
      predictedInflow: 22400,
      predictedOutflow: 11200,
      netCashFlow: 11200,
      runningBalance: 72300,
      confidence: 85,
      factors: ['Saturday peak', 'Weekend promotion active', 'Higher food costs']
    },
    {
      date: '2024-01-21',
      predictedInflow: 19800,
      predictedOutflow: 10600,
      netCashFlow: 9200,
      runningBalance: 81500,
      confidence: 84,
      factors: ['Sunday brunch popular', 'Staff schedule optimized', 'Vendor payment due']
    },
    {
      date: '2024-01-22',
      predictedInflow: 12800,
      predictedOutflow: 15400,
      netCashFlow: -2600,
      runningBalance: 78900,
      confidence: 79,
      factors: ['Monday slow day', 'Rent payment due', 'Inventory restock']
    },
    {
      date: '2024-01-23',
      predictedInflow: 13600,
      predictedOutflow: 9200,
      netCashFlow: 4400,
      runningBalance: 83300,
      confidence: 81,
      factors: ['Tuesday pickup', 'Reduced operating costs', 'Staff training day']
    },
    {
      date: '2024-01-24',
      predictedInflow: 14800,
      predictedOutflow: 8800,
      netCashFlow: 6000,
      runningBalance: 89300,
      confidence: 83,
      factors: ['Wednesday steady', 'Promotional discounts', 'Utility payment due']
    }
  ]);

  const [alerts] = useState<CashFlowAlert[]>([
    {
      type: 'warning',
      message: 'Cash flow dip predicted for Monday due to rent payment',
      action: 'Consider delaying non-essential purchases',
      impact: -2600
    },
    {
      type: 'success',
      message: 'Strong weekend performance expected',
      impact: 20400
    },
    {
      type: 'info',
      message: 'Vendor payment schedule optimization available',
      action: 'Review payment terms',
      impact: 1200
    }
  ]);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return 'text-success';
    if (confidence >= 70) return 'text-warning';
    return 'text-destructive';
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 85) return { color: 'bg-success', text: 'High' };
    if (confidence >= 70) return { color: 'bg-warning', text: 'Medium' };
    return { color: 'bg-destructive', text: 'Low' };
  };

  const getCashFlowTrend = (netFlow: number) => {
    return netFlow >= 0 ? 
      <TrendingUp className="h-4 w-4 text-success" /> : 
      <TrendingDown className="h-4 w-4 text-destructive" />;
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-success" />;
      default: return <Clock className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Cash Flow Forecasting</h2>
          <p className="text-muted-foreground">AI-powered cash flow predictions and optimization</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={forecastPeriod} onValueChange={setForecastPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">7 Days</SelectItem>
              <SelectItem value="14days">14 Days</SelectItem>
              <SelectItem value="30days">30 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-gradient-primary">
            <Brain className="h-4 w-4 mr-2" />
            Generate Forecast
          </Button>
        </div>
      </div>

      {/* Current Balance & Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gradient">
              ${currentBalance.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">As of today</p>
          </CardContent>
        </Card>

        <Card className="glass-card hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">7-Day Projection</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              ${predictions[predictions.length - 1]?.runningBalance.toLocaleString()}
            </div>
            <p className="text-xs text-success">+${(predictions[predictions.length - 1]?.runningBalance - currentBalance).toLocaleString()} projected growth</p>
          </CardContent>
        </Card>

        <Card className="glass-card hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
            <Brain className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {Math.round(predictions.reduce((acc, p) => acc + p.confidence, 0) / predictions.length)}%
            </div>
            <p className="text-xs text-muted-foreground">Prediction accuracy</p>
          </CardContent>
        </Card>
      </div>

      {/* Cash Flow Alerts */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            Cash Flow Alerts & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {alerts.map((alert, index) => (
            <div key={index} className={`p-4 rounded-lg border ${
              alert.type === 'warning' ? 'border-warning/20 bg-warning/5' :
              alert.type === 'success' ? 'border-success/20 bg-success/5' :
              'border-primary/20 bg-primary/5'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  {getAlertIcon(alert.type)}
                  <div>
                    <p className="font-medium text-sm">{alert.message}</p>
                    {alert.action && (
                      <p className="text-sm text-muted-foreground mt-1">{alert.action}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-medium ${alert.impact >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {alert.impact >= 0 ? '+' : ''}${alert.impact.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Daily Predictions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Daily Cash Flow Predictions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {predictions.map((prediction, index) => {
            const confidence = getConfidenceBadge(prediction.confidence);
            const date = new Date(prediction.date);
            
            return (
              <div key={prediction.date} className="p-4 border rounded-lg hover:shadow-sm transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-medium">
                      {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </div>
                    <Badge className={`${confidence.color} text-white text-xs`}>
                      {confidence.text} Confidence
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {getCashFlowTrend(prediction.netCashFlow)}
                    <span className={`font-medium ${prediction.netCashFlow >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {prediction.netCashFlow >= 0 ? '+' : ''}${prediction.netCashFlow.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Inflow</p>
                    <p className="font-medium text-success">${prediction.predictedInflow.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Outflow</p>
                    <p className="font-medium text-destructive">${prediction.predictedOutflow.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Net Flow</p>
                    <p className={`font-medium ${prediction.netCashFlow >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {prediction.netCashFlow >= 0 ? '+' : ''}${prediction.netCashFlow.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Balance</p>
                    <p className="font-medium">${prediction.runningBalance.toLocaleString()}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span>Confidence Level</span>
                    <span className={getConfidenceColor(prediction.confidence)}>
                      {prediction.confidence}%
                    </span>
                  </div>
                  <Progress value={prediction.confidence} className="h-1" />
                </div>

                <div className="mt-3">
                  <p className="text-xs text-muted-foreground mb-1">Key Factors:</p>
                  <div className="flex flex-wrap gap-1">
                    {prediction.factors.map((factor, factorIndex) => (
                      <Badge key={factorIndex} variant="outline" className="text-xs">
                        {factor}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Optimization Suggestions */}
      <Card className="border-success/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-success">
            <CheckCircle className="h-5 w-5" />
            Optimization Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-success/10 rounded-lg">
            <h4 className="font-medium text-sm">Payment Terms Negotiation</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Extend vendor payment terms from 15 to 30 days to improve cash flow by ~$8,400/month
            </p>
          </div>
          <div className="p-3 bg-primary/10 rounded-lg">
            <h4 className="font-medium text-sm">Inventory Optimization</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Reduce inventory holding by 15% to free up $12,000 in working capital
            </p>
          </div>
          <div className="p-3 bg-warning/10 rounded-lg">
            <h4 className="font-medium text-sm">Revenue Acceleration</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Implement happy hour promotions on slower days to boost cash flow by $1,800/week
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};