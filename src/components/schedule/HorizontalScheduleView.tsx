import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, User, Plus, MoreVertical } from 'lucide-react';
import { ShiftActionsDropdown } from './ShiftActionsDropdown';
import type { Shift } from './ShiftCard';
import { format, parseISO } from 'date-fns';

interface Staff {
  id: number;
  name: string;
  role: string;
  hourlyRate: number;
}

interface HorizontalScheduleViewProps {
  shifts: Shift[];
  staff: Staff[];
  currentUserId?: number;
  onDeleteShift: (shiftId: string) => void;
  onEditShift: (shiftId: string) => void;
  onRequestTimeOff: (shiftId: string) => void;
  onOfferCoverage: (shiftId: string) => void;
  onTakeCoverage: (shiftId: string) => void;
  onSwapRequest: (shiftId: string) => void;
  onAddShift: (staffId: number, date: string, hour: string) => void;
}

export const HorizontalScheduleView: React.FC<HorizontalScheduleViewProps> = ({
  shifts,
  staff,
  currentUserId = 1,
  onDeleteShift,
  onEditShift,
  onRequestTimeOff,
  onOfferCoverage,
  onTakeCoverage,
  onSwapRequest,
  onAddShift,
}) => {
  // Get current week dates
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return date;
  });

  // Generate time slots (6 AM to 11 PM)
  const timeSlots = Array.from({ length: 34 }, (_, i) => {
    const hour = Math.floor(i / 2) + 6;
    const minute = i % 2 === 0 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${minute}`;
  });

  const getShiftForStaffAndTime = (staffId: number, date: Date, timeSlot: string) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return shifts.find(shift => 
      shift.staffId === staffId && 
      shift.date === dateStr &&
      shift.startTime <= timeSlot &&
      shift.endTime > timeSlot
    );
  };

  const getShiftDuration = (shift: Shift) => {
    const start = new Date(`2000-01-01T${shift.startTime}`);
    const end = new Date(`2000-01-01T${shift.endTime}`);
    return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 2)); // Half-hour slots
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-primary/10 text-primary border-primary/20';
      case 'needs_coverage': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'time_off_requested': return 'bg-warning/10 text-warning border-warning/20';
      case 'covered': return 'bg-success/10 text-success border-success/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with dates */}
      <div className="grid grid-cols-[200px_1fr] gap-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Staff Schedule</h3>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {weekDates.map((date, index) => (
            <div
              key={index}
              className="text-center p-2 rounded-lg bg-muted/50"
            >
              <div className="text-xs text-muted-foreground">
                {format(date, 'EEE')}
              </div>
              <div className="font-semibold">
                {format(date, 'MMM d')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Staff rows */}
      <div className="space-y-2">
        {staff.map((member) => (
          <Card key={member.id} className="overflow-hidden">
            <div className="grid grid-cols-[200px_1fr] gap-4 p-4">
              {/* Staff info */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">{member.name}</div>
                  <div className="text-sm text-muted-foreground">{member.role}</div>
                </div>
              </div>

              {/* Schedule grid */}
              <div className="grid grid-cols-7 gap-1">
                {weekDates.map((date, dayIndex) => {
                  const dayShifts = shifts.filter(
                    shift => shift.staffId === member.id && shift.date === format(date, 'yyyy-MM-dd')
                  );

                  return (
                    <div key={dayIndex} className="min-h-[60px] bg-muted/20 rounded p-1 space-y-1">
                      {dayShifts.length === 0 ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full h-8 text-xs"
                          onClick={() => onAddShift(member.id, format(date, 'yyyy-MM-dd'), '09:00')}
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add
                        </Button>
                      ) : (
                        dayShifts.map((shift) => (
                          <ShiftActionsDropdown
                            key={shift.id}
                            shift={shift}
                            currentUserId={currentUserId}
                            onDeleteShift={onDeleteShift}
                            onEditShift={onEditShift}
                            onRequestTimeOff={onRequestTimeOff}
                            onOfferCoverage={onOfferCoverage}
                            onTakeCoverage={onTakeCoverage}
                            onSwapRequest={onSwapRequest}
                          >
                            <div className={`p-2 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity ${getStatusColor(shift.status)}`}>
                              <div className="font-medium">
                                {shift.startTime} - {shift.endTime}
                              </div>
                              <div className="text-xs opacity-80">
                                {shift.role}
                              </div>
                              {shift.status !== 'scheduled' && (
                                <Badge variant="secondary" className="text-xs mt-1">
                                  {shift.status.replace('_', ' ')}
                                </Badge>
                              )}
                            </div>
                          </ShiftActionsDropdown>
                        ))
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Time reference bar */}
      <Card className="p-4">
        <div className="grid grid-cols-[200px_1fr] gap-4">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Time Reference</span>
          </div>
          <div className="grid grid-cols-12 gap-1 text-xs text-muted-foreground">
            {['6 AM', '8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM', '8 PM', '10 PM'].map((time, index) => (
              <div key={index} className="text-center">
                {time}
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};