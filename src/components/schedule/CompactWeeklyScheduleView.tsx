import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CompactShiftCard } from './CompactShiftCard';
import { Badge } from '@/components/ui/badge';
import type { Shift } from './ShiftCard';

interface CompactWeeklyScheduleViewProps {
  shifts: Shift[];
  onShiftMove: (result: DropResult) => void;
  onDeleteShift: (shiftId: string) => void;
  onEditShift: (shiftId: string) => void;
  onOfferCoverage: (shiftId: string) => void;
  onTakeCoverage: (shiftId: string) => void;
  onRequestTimeOff: (shiftId: string) => void;
  onSwapRequest: (shiftId: string) => void;
  currentUserId?: number;
}

const daysOfWeek = [
  'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'
];

const timeSlots = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', 
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', 
  '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
];

export const CompactWeeklyScheduleView: React.FC<CompactWeeklyScheduleViewProps> = ({
  shifts,
  onShiftMove,
  onDeleteShift,
  onEditShift,
  onOfferCoverage,
  onTakeCoverage,
  onRequestTimeOff,
  onSwapRequest,
  currentUserId = 1
}) => {
  // Group shifts by day
  const getShiftsForDay = (dayIndex: number) => {
    // For demo purposes, we'll just distribute shifts across days
    return shifts.filter((_, index) => index % 7 === dayIndex);
  };

  const getShiftsForTimeSlot = (dayIndex: number, timeSlot: string) => {
    const dayShifts = getShiftsForDay(dayIndex);
    const timeHour = parseInt(timeSlot.split(':')[0]);
    
    return dayShifts.filter(shift => {
      const startHour = parseInt(shift.startTime.split(':')[0]);
      const endHour = parseInt(shift.endTime.split(':')[0]);
      return timeHour >= startHour && timeHour < endHour;
    });
  };

  const getCoverageStats = () => {
    const total = shifts.length;
    const needsCoverage = shifts.filter(s => s.status === 'needs_coverage').length;
    const timeOffRequests = shifts.filter(s => s.status === 'time_off_requested').length;
    const covered = shifts.filter(s => s.status === 'covered').length;
    
    return { total, needsCoverage, timeOffRequests, covered };
  };

  const stats = getCoverageStats();

  return (
    <div className="space-y-4">
      {/* Compact Stats Overview */}
      <div className="grid grid-cols-4 gap-3">
        <Card className="p-3">
          <div className="text-center">
            <div className="text-lg font-bold text-primary">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
        </Card>
        <Card className="p-3">
          <div className="text-center">
            <div className="text-lg font-bold text-warning">{stats.needsCoverage}</div>
            <p className="text-xs text-muted-foreground">Coverage</p>
          </div>
        </Card>
        <Card className="p-3">
          <div className="text-center">
            <div className="text-lg font-bold text-destructive">{stats.timeOffRequests}</div>
            <p className="text-xs text-muted-foreground">Time Off</p>
          </div>
        </Card>
        <Card className="p-3">
          <div className="text-center">
            <div className="text-lg font-bold text-success">{stats.covered}</div>
            <p className="text-xs text-muted-foreground">Covered</p>
          </div>
        </Card>
      </div>

      {/* Compact Weekly Grid View */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-base">
            Weekly Schedule
            <div className="flex gap-1">
              <Badge variant="outline" className="bg-warning/10 text-warning text-xs px-1.5 py-0.5">
                Coverage
              </Badge>
              <Badge variant="outline" className="bg-destructive/10 text-destructive text-xs px-1.5 py-0.5">
                Time Off
              </Badge>
              <Badge variant="outline" className="bg-success/10 text-success text-xs px-1.5 py-0.5">
                Covered
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          <DragDropContext onDragEnd={onShiftMove}>
            <div className="overflow-x-auto">
              <div className="min-w-[1000px] grid grid-cols-8 gap-1">
                {/* Header */}
                <div className="font-medium p-2 text-center text-xs">Time</div>
                {daysOfWeek.map(day => (
                  <div key={day} className="font-medium p-2 text-center border-b text-xs">
                    {day}
                  </div>
                ))}
                
                {/* Time slots */}
                {timeSlots.map(timeSlot => (
                  <React.Fragment key={timeSlot}>
                    <div className="p-2 text-xs font-mono text-muted-foreground border-r bg-muted/20">
                      {timeSlot}
                    </div>
                    {daysOfWeek.map((day, dayIndex) => {
                      const dayShifts = getShiftsForTimeSlot(dayIndex, timeSlot);
                      const droppableId = `${day}-${timeSlot}`;
                      
                      return (
                        <Droppable key={droppableId} droppableId={droppableId}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className={`min-h-[50px] p-1 border-r border-b transition-colors ${
                                snapshot.isDraggingOver 
                                  ? 'bg-primary/5 border-primary/20' 
                                  : 'hover:bg-muted/20'
                              }`}
                            >
                              <div className="space-y-1">
                                {dayShifts.map((shift, index) => (
                                  <Draggable
                                    key={shift.id}
                                    draggableId={shift.id}
                                    index={index}
                                  >
                                    {(provided, snapshot) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                      >
                                        <CompactShiftCard
                                          shift={shift}
                                          onDeleteShift={onDeleteShift}
                                          onEditShift={onEditShift}
                                          onOfferCoverage={onOfferCoverage}
                                          onTakeCoverage={onTakeCoverage}
                                          onRequestTimeOff={onRequestTimeOff}
                                          onSwapRequest={onSwapRequest}
                                          isDragging={snapshot.isDragging}
                                          currentUserId={currentUserId}
                                        />
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                              </div>
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </DragDropContext>
        </CardContent>
      </Card>
    </div>
  );
};