import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Target,
  Zap
} from 'lucide-react';

interface StaffMetrics {
  name: string;
  role: string;
  hoursWorked: number;
  salesGenerated: number;
  ordersServed: number;
  efficiencyScore: number;
  hourlyRate: number;
  salesPerHour: number;
  costPerSale: number;
}

interface ShiftPerformance {
  shift: string;
  staffCount: number;
  hoursTotal: number;
  salesTotal: number;
  laborCost: number;
  laborPercentage: number;
  efficiency: number;
  optimal: boolean;
}

export const LaborEfficiencyMetrics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedShift, setSelectedShift] = useState('all');

  // Mock data - will be enhanced with Toast POS integration
  const [staffMetrics] = useState<StaffMetrics[]>([
    {
      name: 'Sarah Johnson',
      role: 'Server',
      hoursWorked: 32,
      salesGenerated: 8420,
      ordersServed: 156,
      efficiencyScore: 92,
      hourlyRate: 15.50,
      salesPerHour: 263.13,
      costPerSale: 3.18
    },
    {
      name: 'Mike Chen',
      role: 'Bartender',
      hoursWorked: 28,
      salesGenerated: 6780,
      ordersServed: 234,
      efficiencyScore: 88,
      hourlyRate: 18.00,
      salesPerHour: 242.14,
      costPerSale: 2.76
    },
    {
      name: 'Emily Rodriguez',
      role: 'Server',
      hoursWorked: 30,
      salesGenerated: 7200,
      ordersServed: 142,
      efficiencyScore: 85,
      hourlyRate: 15.50,
      salesPerHour: 240.00,
      costPerSale: 3.25
    },
    {
      name: 'James Wilson',
      role: 'Cook',
      hoursWorked: 35,
      salesGenerated: 0, // Back of house
      ordersServed: 218,
      efficiencyScore: 91,
      hourlyRate: 20.00,
      salesPerHour: 0,
      costPerSale: 3.21
    },
    {
      name: 'Lisa Brown',
      role: 'Host',
      hoursWorked: 25,
      salesGenerated: 0, // Support role
      ordersServed: 89,
      efficiencyScore: 87,
      hourlyRate: 14.00,
      salesPerHour: 0,
      costPerSale: 3.93
    }
  ]);

  const [shiftPerformance] = useState<ShiftPerformance[]>([
    {
      shift: 'Morning (7-11 AM)',
      staffCount: 4,
      hoursTotal: 16,
      salesTotal: 2840,
      laborCost: 280,
      laborPercentage: 9.86,
      efficiency: 95,
      optimal: true
    },
    {
      shift: 'Lunch (11 AM-3 PM)',
      staffCount: 6,
      hoursTotal: 24,
      salesTotal: 8450,
      laborCost: 420,
      laborPercentage: 4.97,
      efficiency: 98,
      optimal: true
    },
    {
      shift: 'Dinner (3-9 PM)',
      staffCount: 8,
      hoursTotal: 48,
      salesTotal: 15680,
      laborCost: 840,
      laborPercentage: 5.36,
      efficiency: 87,
      optimal: false
    },
    {
      shift: 'Late Night (9 PM-Close)',
      staffCount: 3,
      hoursTotal: 12,
      salesTotal: 3200,
      laborCost: 210,
      laborPercentage: 6.56,
      efficiency: 82,
      optimal: false
    }
  ]);

  const getEfficiencyColor = (score: number) => {
    if (score >= 90) return 'text-success';
    if (score >= 80) return 'text-warning';
    return 'text-destructive';
  };

  const getEfficiencyBadge = (score: number) => {
    if (score >= 90) return { color: 'bg-success', text: 'Excellent' };
    if (score >= 80) return { color: 'bg-warning', text: 'Good' };
    return { color: 'bg-destructive', text: 'Needs Improvement' };
  };

  const getLaborPercentageColor = (percentage: number) => {
    if (percentage <= 5) return 'text-success';
    if (percentage <= 7) return 'text-warning';
    return 'text-destructive';
  };

  const calculateTeamMetrics = () => {
    const totalHours = staffMetrics.reduce((sum, staff) => sum + staff.hoursWorked, 0);
    const totalSales = staffMetrics.reduce((sum, staff) => sum + staff.salesGenerated, 0);
    const totalLaborCost = staffMetrics.reduce((sum, staff) => sum + (staff.hoursWorked * staff.hourlyRate), 0);
    const avgEfficiency = staffMetrics.reduce((sum, staff) => sum + staff.efficiencyScore, 0) / staffMetrics.length;
    
    return {
      totalHours,
      totalSales,
      totalLaborCost,
      avgEfficiency,
      laborPercentage: (totalLaborCost / totalSales) * 100,
      salesPerHour: totalSales / totalHours
    };
  };

  const teamMetrics = calculateTeamMetrics();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Labor Efficiency Metrics</h2>
          <p className="text-muted-foreground">Staff performance and labor cost optimization</p>
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
          <Select value={selectedShift} onValueChange={setSelectedShift}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Shifts</SelectItem>
              <SelectItem value="morning">Morning</SelectItem>
              <SelectItem value="lunch">Lunch</SelectItem>
              <SelectItem value="dinner">Dinner</SelectItem>
              <SelectItem value="late">Late Night</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Team Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Labor Cost %</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getLaborPercentageColor(teamMetrics.laborPercentage)}`}>
              {teamMetrics.laborPercentage.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Target: 28-32%</p>
          </CardContent>
        </Card>

        <Card className="glass-card hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales per Hour</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              ${teamMetrics.salesPerHour.toFixed(0)}
            </div>
            <p className="text-xs text-success">+12% vs last week</p>
          </CardContent>
        </Card>

        <Card className="glass-card hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Efficiency</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getEfficiencyColor(teamMetrics.avgEfficiency)}`}>
              {teamMetrics.avgEfficiency.toFixed(0)}%
            </div>
            <p className="text-xs text-muted-foreground">Average score</p>
          </CardContent>
        </Card>

        <Card className="glass-card hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Labor Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamMetrics.totalHours}h</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
      </div>

      {/* Staff Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Individual Staff Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {staffMetrics.map((staff, index) => {
            const efficiency = getEfficiencyBadge(staff.efficiencyScore);
            
            return (
              <div key={index} className="p-4 border rounded-lg hover:shadow-sm transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium">{staff.name}</h4>
                    <p className="text-sm text-muted-foreground">{staff.role}</p>
                  </div>
                  <Badge className={`${efficiency.color} text-white`}>
                    {efficiency.text}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Hours</p>
                    <p className="font-medium">{staff.hoursWorked}h</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Sales</p>
                    <p className="font-medium text-success">
                      {staff.salesGenerated > 0 ? `$${staff.salesGenerated.toLocaleString()}` : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Orders</p>
                    <p className="font-medium">{staff.ordersServed}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">$/Hour</p>
                    <p className="font-medium">
                      {staff.salesPerHour > 0 ? `$${staff.salesPerHour.toFixed(0)}` : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Cost/Sale</p>
                    <p className="font-medium">${staff.costPerSale.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Rate</p>
                    <p className="font-medium">${staff.hourlyRate}/hr</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Efficiency Score</span>
                    <span className={getEfficiencyColor(staff.efficiencyScore)}>
                      {staff.efficiencyScore}%
                    </span>
                  </div>
                  <Progress value={staff.efficiencyScore} className="h-2" />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Shift Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Shift Performance Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {shiftPerformance.map((shift, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-medium">{shift.shift}</h4>
                  <p className="text-sm text-muted-foreground">
                    {shift.staffCount} staff • {shift.hoursTotal} total hours
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {shift.optimal ? (
                    <CheckCircle className="h-4 w-4 text-success" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-warning" />
                  )}
                  <Badge variant={shift.optimal ? "default" : "secondary"}>
                    {shift.optimal ? 'Optimal' : 'Review'}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-3">
                <div>
                  <p className="text-xs text-muted-foreground">Sales</p>
                  <p className="font-medium text-success">${shift.salesTotal.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Labor Cost</p>
                  <p className="font-medium">${shift.laborCost}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Labor %</p>
                  <p className={`font-medium ${getLaborPercentageColor(shift.laborPercentage)}`}>
                    {shift.laborPercentage.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Efficiency</p>
                  <p className={`font-medium ${getEfficiencyColor(shift.efficiency)}`}>
                    {shift.efficiency}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">$/Hour</p>
                  <p className="font-medium">${(shift.salesTotal / shift.hoursTotal).toFixed(0)}</p>
                </div>
              </div>

              <Progress value={shift.efficiency} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Optimization Recommendations */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Zap className="h-5 w-5" />
            Labor Optimization Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-warning/10 rounded-lg border border-warning/20">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <span className="font-medium text-sm">Dinner Shift Overstaffed</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Reduce dinner staff by 1 server to optimize labor cost from 5.36% to 4.8%
            </p>
            <p className="text-sm font-medium text-success mt-1">Potential savings: $140/week</p>
          </div>

          <div className="p-3 bg-success/10 rounded-lg border border-success/20">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="h-4 w-4 text-success" />
              <span className="font-medium text-sm">Cross-Training Opportunity</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Train Sarah Johnson (top performer) as bartender for Friday nights
            </p>
            <p className="text-sm font-medium text-success mt-1">Expected efficiency gain: +8%</p>
          </div>

          <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm">Schedule Optimization</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Adjust late night shift start time from 9 PM to 8:30 PM for better coverage
            </p>
            <p className="text-sm font-medium text-success mt-1">Improved customer satisfaction expected</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};