import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShiftCard, type Shift } from './ShiftCard';
import { Badge } from '@/components/ui/badge';

interface WeeklyScheduleViewProps {
  shifts: Shift[];
  onShiftMove: (result: DropResult) => void;
  onOfferCoverage: (shiftId: string) => void;
  onTakeCoverage: (shiftId: string) => void;
  onRequestTimeOff: (shiftId: string) => void;
  onSwapRequest: (shiftId: string) => void;
  onEditShift: (shiftId: string) => void;
  currentUserId?: number;
}

const daysOfWeek = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

const timeSlots = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', 
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', 
  '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
];

export const WeeklyScheduleView: React.FC<WeeklyScheduleViewProps> = ({
  shifts,
  onShiftMove,
  onOfferCoverage,
  onTakeCoverage,
  onRequestTimeOff,
  onSwapRequest,
  onEditShift,
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
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{stats.total}</div>
            <p className="text-sm text-muted-foreground">Total Shifts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-warning">{stats.needsCoverage}</div>
            <p className="text-sm text-muted-foreground">Need Coverage</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-destructive">{stats.timeOffRequests}</div>
            <p className="text-sm text-muted-foreground">Time Off Requests</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-success">{stats.covered}</div>
            <p className="text-sm text-muted-foreground">Covered Shifts</p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Grid View */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Weekly Schedule
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-warning/10 text-warning">
                Needs Coverage
              </Badge>
              <Badge variant="outline" className="bg-destructive/10 text-destructive">
                Time Off
              </Badge>
              <Badge variant="outline" className="bg-success/10 text-success">
                Covered
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DragDropContext onDragEnd={onShiftMove}>
            <div className="overflow-x-auto">
              <div className="min-w-[1200px] grid grid-cols-8 gap-2">
                {/* Header */}
                <div className="font-medium p-3 text-center">Time</div>
                {daysOfWeek.map(day => (
                  <div key={day} className="font-medium p-3 text-center border-b-2">
                    {day}
                  </div>
                ))}
                
                {/* Time slots */}
                {timeSlots.map(timeSlot => (
                  <React.Fragment key={timeSlot}>
                    <div className="p-3 text-sm font-mono text-muted-foreground border-r">
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
                              className={`min-h-[80px] p-2 border-r border-b transition-colors ${
                                snapshot.isDraggingOver 
                                  ? 'bg-primary/5 border-primary/20' 
                                  : 'hover:bg-muted/30'
                              }`}
                            >
                              <div className="space-y-2">
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
                                        <ShiftCard
                                          shift={shift}
                                          onOfferCoverage={onOfferCoverage}
                                          onTakeCoverage={onTakeCoverage}
                                          onRequestTimeOff={onRequestTimeOff}
                                          onSwapRequest={onSwapRequest}
                                          onEdit={onEditShift}
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