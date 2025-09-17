import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  Users, 
  Clock,
  DollarSign,
  Zap,
  Loader2,
  Plus,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Brain,
  Target
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface StaffMember {
  id: string;
  name: string;
  role: string;
  hourlyRate: number;
  availability: Array<{
    day: string;
    startTime: string;
    endTime: string;
    shiftType?: string;
  }>;
  skills: string[];
  preferences: {
    preferredShifts: string[];
    maxHoursPerWeek: number;
    daysOff: string[];
  };
  performance: {
    rating: number;
    efficiency: number;
    reliability: number;
  };
}

interface OptimizedShift {
  staffId: string;
  staffName: string;
  role: string;
  date: string;
  startTime: string;
  endTime: string;
  shiftType: string;
  estimatedRevenue: number;
  cost: number;
  priority: 'high' | 'medium' | 'low';
  reasonAssigned: string;
}

interface ScheduleConflict {
  type: 'understaffed' | 'overstaffed' | 'skill_mismatch' | 'availability';
  severity: 'critical' | 'warning' | 'minor';
  description: string;
  affectedShifts: string[];
  suggestions: string[];
}

interface OptimizedSchedule {
  schedule: OptimizedShift[];
  metrics: {
    totalCost: number;
    coverageScore: number;
    satisfactionScore: number;
    efficiencyScore: number;
    conflicts: ScheduleConflict[];
  };
  recommendations: string[];
  alternatives: {
    costOptimized: OptimizedShift[];
    coverageOptimized: OptimizedShift[];
    balancedOptimized: OptimizedShift[];
  };
}

// Sample staff data
const sampleStaff: StaffMember[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    role: 'Manager',
    hourlyRate: 25,
    availability: [
      { day: 'Monday', startTime: '08:00', endTime: '18:00' },
      { day: 'Tuesday', startTime: '08:00', endTime: '18:00' },
      { day: 'Wednesday', startTime: '08:00', endTime: '18:00' },
    ],
    skills: ['Leadership', 'Customer Service', 'Inventory'],
    preferences: {
      preferredShifts: ['day'],
      maxHoursPerWeek: 40,
      daysOff: ['Sunday']
    },
    performance: {
      rating: 4.8,
      efficiency: 95,
      reliability: 98
    }
  },
  {
    id: '2',
    name: 'Bob Chen',
    role: 'Chef',
    hourlyRate: 22,
    availability: [
      { day: 'Tuesday', startTime: '10:00', endTime: '22:00' },
      { day: 'Wednesday', startTime: '10:00', endTime: '22:00' },
      { day: 'Thursday', startTime: '10:00', endTime: '22:00' },
      { day: 'Friday', startTime: '10:00', endTime: '22:00' },
      { day: 'Saturday', startTime: '10:00', endTime: '23:00' },
    ],
    skills: ['Cooking', 'Menu Planning', 'Food Safety'],
    preferences: {
      preferredShifts: ['dinner'],
      maxHoursPerWeek: 45,
      daysOff: ['Monday']
    },
    performance: {
      rating: 4.6,
      efficiency: 88,
      reliability: 92
    }
  },
  {
    id: '3',
    name: 'Carol Davis',
    role: 'Server',
    hourlyRate: 15,
    availability: [
      { day: 'Friday', startTime: '16:00', endTime: '23:00' },
      { day: 'Saturday', startTime: '16:00', endTime: '23:00' },
      { day: 'Sunday', startTime: '10:00', endTime: '20:00' },
    ],
    skills: ['Customer Service', 'POS Systems', 'Wine Knowledge'],
    preferences: {
      preferredShifts: ['dinner', 'weekend'],
      maxHoursPerWeek: 30,
      daysOff: ['Monday', 'Wednesday']
    },
    performance: {
      rating: 4.4,
      efficiency: 85,
      reliability: 90
    }
  }
];

const OPTIMIZATION_TYPES = {
  cost: 'Cost Optimization',
  coverage: 'Coverage Optimization',
  satisfaction: 'Staff Satisfaction',
  balanced: 'Balanced Approach'
};

const ROLES = ['Manager', 'Chef', 'Server', 'Host', 'Bartender', 'Prep Cook'];
const SHIFT_TYPES = ['breakfast', 'lunch', 'dinner', 'closing'];
const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function AIScheduleOptimizer() {
  const [staff, setStaff] = useState<StaffMember[]>(sampleStaff);
  const [optimizationType, setOptimizationType] = useState<'cost' | 'coverage' | 'satisfaction' | 'balanced'>('balanced');
  const [budgetLimit, setBudgetLimit] = useState(5000);
  const [minStaffPerShift, setMinStaffPerShift] = useState(2);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedSchedule, setOptimizedSchedule] = useState<OptimizedSchedule | null>(null);
  const { toast } = useToast();

  const addStaffMember = () => {
    const newStaff: StaffMember = {
      id: Date.now().toString(),
      name: 'New Staff Member',
      role: 'Server',
      hourlyRate: 15,
      availability: [
        { day: 'Monday', startTime: '09:00', endTime: '17:00' }
      ],
      skills: ['Customer Service'],
      preferences: {
        preferredShifts: ['day'],
        maxHoursPerWeek: 40,
        daysOff: ['Sunday']
      },
      performance: {
        rating: 4.0,
        efficiency: 80,
        reliability: 85
      }
    };
    setStaff([...staff, newStaff]);
  };

  const updateStaffMember = (id: string, updates: Partial<StaffMember>) => {
    setStaff(staff.map(member => 
      member.id === id ? { ...member, ...updates } : member
    ));
  };

  const removeStaffMember = (id: string) => {
    setStaff(staff.filter(member => member.id !== id));
  };

  const optimizeSchedule = async () => {
    if (staff.length === 0) {
      toast({
        title: "No Staff Available",
        description: "Please add staff members to optimize the schedule",
        variant: "destructive",
      });
      return;
    }

    setIsOptimizing(true);

    try {
      const constraints = {
        minStaffPerShift: {
          manager: 1,
          chef: Math.max(1, Math.floor(minStaffPerShift / 2)),
          server: minStaffPerShift
        },
        maxConsecutiveDays: 5,
        minRestHours: 10,
        budgetLimit,
        requiredCoverage: {
          breakfast: Math.max(1, minStaffPerShift - 1),
          lunch: minStaffPerShift,
          dinner: Math.max(minStaffPerShift, 3),
          closing: Math.max(1, minStaffPerShift - 1)
        }
      };

      const businessData = {
        historicalData: {
          dailyCustomerCounts: {
            Monday: 120,
            Tuesday: 150,
            Wednesday: 180,
            Thursday: 200,
            Friday: 280,
            Saturday: 320,
            Sunday: 250
          },
          peakHours: {
            Monday: ['12:00', '18:00'],
            Tuesday: ['12:00', '19:00'],
            Wednesday: ['12:00', '19:00'],
            Thursday: ['12:00', '19:00'],
            Friday: ['12:00', '19:00', '20:00'],
            Saturday: ['11:00', '18:00', '19:00', '20:00'],
            Sunday: ['11:00', '18:00', '19:00']
          },
          seasonalTrends: []
        },
        currentPeriod: {
          reservations: [],
          events: [],
          promotions: []
        }
      };

      const { data, error } = await supabase.functions.invoke('ai-scheduling-optimizer', {
        body: {
          currentSchedule: staff,
          constraints,
          businessData,
          optimizationType
        }
      });

      if (error) throw error;

      if (data.success) {
        setOptimizedSchedule(data.optimizedSchedule);
        toast({
          title: "Schedule Optimized!",
          description: `Schedule optimized for ${optimizationType} with AI analysis`,
        });
      } else {
        throw new Error(data.error || 'Optimization failed');
      }
    } catch (error) {
      console.error('Schedule optimization error:', error);
      toast({
        title: "Optimization Failed",
        description: "Failed to optimize schedule. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  const getConflictSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'warning': return 'warning';
      case 'minor': return 'secondary';
      default: return 'outline';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Schedule Optimizer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Optimization Settings */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Optimization Type</Label>
              <Select value={optimizationType} onValueChange={(value) => setOptimizationType(value as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(OPTIMIZATION_TYPES).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Weekly Budget Limit</Label>
              <Input
                type="number"
                value={budgetLimit}
                onChange={(e) => setBudgetLimit(parseInt(e.target.value) || 5000)}
                min="1000"
                max="20000"
              />
            </div>

            <div className="space-y-2">
              <Label>Min Staff per Shift</Label>
              <Input
                type="number"
                value={minStaffPerShift}
                onChange={(e) => setMinStaffPerShift(parseInt(e.target.value) || 2)}
                min="1"
                max="10"
              />
            </div>

            <div className="space-y-2">
              <Label>Total Staff</Label>
              <div className="h-10 flex items-center px-3 bg-muted rounded-md">
                <span className="font-medium">{staff.length} members</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Staff Management */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Staff Members</h3>
              <Button onClick={addStaffMember} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Staff
              </Button>
            </div>

            <div className="grid gap-4 max-h-80 overflow-y-auto">
              {staff.map((member) => (
                <Card key={member.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Input
                          value={member.name}
                          onChange={(e) => updateStaffMember(member.id, { name: e.target.value })}
                          className="font-medium w-48"
                        />
                        <Select 
                          value={member.role} 
                          onValueChange={(value) => updateStaffMember(member.id, { role: value })}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ROLES.map(role => (
                              <SelectItem key={role} value={role}>{role}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeStaffMember(member.id)}
                      >
                        Remove
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <Label className="text-xs">Hourly Rate</Label>
                        <Input
                          type="number"
                          value={member.hourlyRate}
                          onChange={(e) => updateStaffMember(member.id, { hourlyRate: parseFloat(e.target.value) || 15 })}
                          className="h-8"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Max Hours/Week</Label>
                        <Input
                          type="number"
                          value={member.preferences.maxHoursPerWeek}
                          onChange={(e) => updateStaffMember(member.id, { 
                            preferences: { 
                              ...member.preferences, 
                              maxHoursPerWeek: parseInt(e.target.value) || 40 
                            }
                          })}
                          className="h-8"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Performance</Label>
                        <div className="h-8 flex items-center text-sm">
                          <span className="font-medium">{member.performance.rating}/5.0</span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs">Efficiency</Label>
                        <div className="h-8 flex items-center text-sm">
                          <span className="font-medium">{member.performance.efficiency}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {member.skills.map(skill => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <Button 
            onClick={optimizeSchedule}
            disabled={isOptimizing || staff.length === 0}
            size="lg"
            className="w-full"
          >
            {isOptimizing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Optimizing Schedule...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Optimize Schedule with AI
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Optimization Results */}
      {optimizedSchedule && (
        <div className="space-y-6">
          {/* Metrics Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Schedule Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    ${optimizedSchedule.metrics.totalCost.toFixed(0)}
                  </div>
                  <p className="text-sm text-muted-foreground">Weekly Labor Cost</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-success">
                    {optimizedSchedule.metrics.coverageScore}%
                  </div>
                  <p className="text-sm text-muted-foreground">Coverage Score</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-warning">
                    {optimizedSchedule.metrics.satisfactionScore}%
                  </div>
                  <p className="text-sm text-muted-foreground">Staff Satisfaction</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-info">
                    {optimizedSchedule.metrics.efficiencyScore}%
                  </div>
                  <p className="text-sm text-muted-foreground">Efficiency Score</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="schedule" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="schedule">Optimized Schedule</TabsTrigger>
              <TabsTrigger value="conflicts">Conflicts & Issues</TabsTrigger>
              <TabsTrigger value="alternatives">Alternative Scenarios</TabsTrigger>
              <TabsTrigger value="insights">AI Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="schedule" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Weekly Schedule ({optimizedSchedule.schedule.length} shifts)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {DAYS_OF_WEEK.map(day => {
                      const dayShifts = optimizedSchedule.schedule.filter(shift => {
                        const shiftDay = new Date(shift.date).toLocaleDateString('en-US', { weekday: 'long' });
                        return shiftDay === day;
                      });

                      return (
                        <div key={day} className="space-y-2">
                          <h4 className="font-semibold text-primary">{day}</h4>
                          {dayShifts.length > 0 ? (
                            <div className="grid gap-2">
                              {dayShifts.map((shift, index) => (
                                <Card key={index} className="p-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                      <div>
                                        <div className="font-medium">{shift.staffName}</div>
                                        <div className="text-sm text-muted-foreground">{shift.role}</div>
                                      </div>
                                      <div className="text-sm">
                                        <div className="flex items-center gap-1">
                                          <Clock className="h-3 w-3" />
                                          {shift.startTime} - {shift.endTime}
                                        </div>
                                        <div className="text-muted-foreground capitalize">{shift.shiftType}</div>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <Badge variant={getPriorityColor(shift.priority) as any}>
                                        {shift.priority}
                                      </Badge>
                                      <div className="text-sm text-muted-foreground mt-1">
                                        ${shift.cost.toFixed(0)} cost
                                      </div>
                                    </div>
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-2">{shift.reasonAssigned}</p>
                                </Card>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground italic">No shifts scheduled</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="conflicts">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    Schedule Conflicts & Issues ({optimizedSchedule.metrics.conflicts.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {optimizedSchedule.metrics.conflicts.length > 0 ? (
                      optimizedSchedule.metrics.conflicts.map((conflict, index) => (
                        <Card key={index} className="p-4 border-destructive/20">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold capitalize">{conflict.type.replace('_', ' ')}</h4>
                              <Badge variant={getConflictSeverityColor(conflict.severity) as any}>
                                {conflict.severity}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{conflict.description}</p>
                            {conflict.suggestions.length > 0 && (
                              <div>
                                <p className="text-xs font-medium text-primary mb-2">Suggested Solutions:</p>
                                <ul className="text-xs text-muted-foreground space-y-1">
                                  {conflict.suggestions.map((suggestion, idx) => (
                                    <li key={idx}>• {suggestion}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
                        <h3 className="font-semibold text-success">No Conflicts Detected</h3>
                        <p className="text-sm text-muted-foreground">
                          The optimized schedule meets all constraints and requirements.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="alternatives">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Alternative Schedule Scenarios
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4">
                      <div className="text-center">
                        <DollarSign className="h-8 w-8 text-success mx-auto mb-2" />
                        <h4 className="font-semibold">Cost Optimized</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Minimized labor costs
                        </p>
                        <div className="text-2xl font-bold text-success">
                          ${(optimizedSchedule.metrics.totalCost * 0.85).toFixed(0)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {optimizedSchedule.alternatives.costOptimized.length} shifts
                        </p>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <div className="text-center">
                        <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                        <h4 className="font-semibold">Coverage Optimized</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Maximum service coverage
                        </p>
                        <div className="text-2xl font-bold text-primary">
                          {optimizedSchedule.alternatives.coverageOptimized.length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Total shifts scheduled
                        </p>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <div className="text-center">
                        <CheckCircle className="h-8 w-8 text-warning mx-auto mb-2" />
                        <h4 className="font-semibold">Balanced Approach</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Optimal cost-service balance
                        </p>
                        <div className="text-2xl font-bold text-warning">
                          {optimizedSchedule.alternatives.balancedOptimized.length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Recommended shifts
                        </p>
                      </div>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insights">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    AI Analysis & Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {optimizedSchedule.recommendations.map((recommendation, index) => (
                    <div key={index} className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                      <p className="text-sm">{recommendation}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}