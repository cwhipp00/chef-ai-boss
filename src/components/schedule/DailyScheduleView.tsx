import React from 'react';
import { format, startOfWeek, addDays, isToday } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clock, User, Calendar, TrendingUp } from 'lucide-react';
import type { Shift } from './ShiftCard';

interface DailyScheduleViewProps {
  shifts: Shift[];
  selectedWeek: Date;
}

const staff = [
  { id: 1, name: "Sarah Johnson", role: "Head Chef", hourlyRate: 28, maxHours: 40 },
  { id: 2, name: "Mike Rodriguez", role: "Sous Chef", hourlyRate: 22, maxHours: 40 },
  { id: 3, name: "Emily Chen", role: "Server", hourlyRate: 15, maxHours: 35 },
  { id: 4, name: "David Park", role: "Line Cook", hourlyRate: 18, maxHours: 40 },
  { id: 5, name: "Lisa Wong", role: "Server", hourlyRate: 15, maxHours: 30 },
  { id: 6, name: "James Wilson", role: "Dishwasher", hourlyRate: 14, maxHours: 35 }
];

export const DailyScheduleView: React.FC<DailyScheduleViewProps> = ({ 
  shifts, 
  selectedWeek 
}) => {
  const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getShiftDuration = (startTime: string, endTime: string, breakMinutes: number = 0) => {
    const start = new Date(`2024-01-01 ${startTime}`);
    const end = new Date(`2024-01-01 ${endTime}`);
    const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return Math.max(0, diff - (breakMinutes / 60));
  };

  const getWeeklyHoursForStaff = (staffId: number) => {
    return shifts
      .filter(shift => shift.staffId === staffId)
      .reduce((total, shift) => total + getShiftDuration(shift.startTime, shift.endTime, shift.break), 0);
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'head chef': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'sous chef': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'server': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'line cook': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'dishwasher': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-green-500/10 text-green-600';
      case 'needs_coverage': return 'bg-yellow-500/10 text-yellow-600';
      case 'time_off_requested': return 'bg-red-500/10 text-red-600';
      case 'covered': return 'bg-blue-500/10 text-blue-600';
      case 'open': return 'bg-gray-500/10 text-gray-600';
      default: return 'bg-gray-500/10 text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Weekly Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Weekly Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {shifts.reduce((total, shift) => total + getShiftDuration(shift.startTime, shift.endTime, shift.break), 0).toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">Total Hours</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">
                {new Set(shifts.map(s => s.staffId)).size}
              </div>
              <div className="text-sm text-muted-foreground">Staff Scheduled</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-500">
                {shifts.filter(s => s.status === 'needs_coverage').length}
              </div>
              <div className="text-sm text-muted-foreground">Need Coverage</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500">
                {shifts.filter(s => s.status === 'time_off_requested').length}
              </div>
              <div className="text-sm text-muted-foreground">Time Off Requests</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employee Weekly Schedules */}
      <div className="grid gap-6">
        {staff.map((employee) => {
          const employeeShifts = shifts.filter(shift => shift.staffId === employee.id);
          const weeklyHours = getWeeklyHoursForStaff(employee.id);
          const progressPercent = (weeklyHours / employee.maxHours) * 100;

          return (
            <Card key={employee.id} className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{employee.name}</CardTitle>
                      <Badge className={`${getRoleColor(employee.role)} border`}>
                        {employee.role}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {weeklyHours.toFixed(1)}h / {employee.maxHours}h
                    </div>
                    <Progress 
                      value={Math.min(progressPercent, 100)} 
                      className="w-24"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-7 gap-2">
                    {weekDays.map((day, index) => {
                      const dayShifts = employeeShifts.filter(shift => {
                        const shiftDate = new Date(shift.date);
                        return shiftDate.toDateString() === day.toDateString();
                      });

                      return (
                        <div key={index} className="text-center space-y-2">
                          <div className={`text-xs font-medium p-2 rounded ${isToday(day) ? 'bg-primary/20 text-primary' : 'text-muted-foreground'}`}>
                            <div>{format(day, 'EEE')}</div>
                            <div>{format(day, 'd')}</div>
                          </div>
                          <div className="space-y-1">
                            {dayShifts.length === 0 ? (
                              <div className="text-xs text-muted-foreground">Off</div>
                            ) : (
                              dayShifts.map((shift, shiftIndex) => (
                                <div key={shiftIndex} className="space-y-1">
                                  <div className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(shift.status)}`}>
                                    {shift.startTime}-{shift.endTime}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {getShiftDuration(shift.startTime, shift.endTime, shift.break).toFixed(1)}h
                                  </div>
                                  {shift.status !== 'scheduled' && (
                                    <div className={`text-xs px-1 py-0.5 rounded ${getStatusColor(shift.status)}`}>
                                      {shift.status.replace('_', ' ')}
                                    </div>
                                  )}
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {employeeShifts.length > 0 && (
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex gap-4 text-sm">
                        <span className="text-muted-foreground">
                          Rate: <span className="font-medium">${employee.hourlyRate}/hr</span>
                        </span>
                        <span className="text-muted-foreground">
                          Weekly Pay: <span className="font-medium">${(weeklyHours * employee.hourlyRate).toFixed(2)}</span>
                        </span>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};