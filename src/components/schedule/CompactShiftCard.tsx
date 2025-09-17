import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  UserX,
  Calendar,
  User,
  MoreVertical
} from 'lucide-react';
import { ShiftActionsDropdown } from './ShiftActionsDropdown';
import type { Shift } from './ShiftCard';

interface CompactShiftCardProps {
  shift: Shift;
  onDeleteShift: (shiftId: string) => void;
  onEditShift: (shiftId: string) => void;
  onOfferCoverage: (shiftId: string) => void;
  onTakeCoverage: (shiftId: string) => void;
  onRequestTimeOff: (shiftId: string) => void;
  onSwapRequest: (shiftId: string) => void;
  isDragging?: boolean;
  currentUserId?: number;
}

export const CompactShiftCard: React.FC<CompactShiftCardProps> = ({
  shift,
  onDeleteShift,
  onEditShift,
  onOfferCoverage,
  onTakeCoverage,
  onRequestTimeOff,
  onSwapRequest,
  isDragging = false,
  currentUserId = 1
}) => {
  const getStatusColor = () => {
    switch (shift.status) {
      case 'scheduled':
        return 'bg-success/15 text-success border-success/30';
      case 'needs_coverage':
        return 'bg-warning/15 text-warning border-warning/30';
      case 'covered':
        return 'bg-primary/15 text-primary border-primary/30';
      case 'time_off_requested':
        return 'bg-destructive/15 text-destructive border-destructive/30';
      case 'open':
        return 'bg-muted/15 text-muted-foreground border-border';
      default:
        return 'bg-muted/15 text-muted-foreground border-border';
    }
  };

  const getStatusIcon = () => {
    switch (shift.status) {
      case 'scheduled':
        return <CheckCircle className="h-2.5 w-2.5" />;
      case 'needs_coverage':
        return <AlertCircle className="h-2.5 w-2.5" />;
      case 'covered':
        return <User className="h-2.5 w-2.5" />;
      case 'time_off_requested':
        return <UserX className="h-2.5 w-2.5" />;
      case 'open':
        return <Calendar className="h-2.5 w-2.5" />;
      default:
        return <Clock className="h-2.5 w-2.5" />;
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2);
  };

  return (
    <ShiftActionsDropdown
      shift={shift}
      currentUserId={currentUserId}
      onDeleteShift={onDeleteShift}
      onEditShift={onEditShift}
      onRequestTimeOff={onRequestTimeOff}
      onOfferCoverage={onOfferCoverage}
      onTakeCoverage={onTakeCoverage}
      onSwapRequest={onSwapRequest}
    >
      <Card 
        className={`relative transition-all duration-200 hover:shadow-sm cursor-pointer group ${
          isDragging ? 'opacity-50 rotate-1 scale-105' : ''
        } ${shift.status !== 'scheduled' ? 'border-l-2' : ''}`}
        style={{
          borderLeftColor: shift.status === 'needs_coverage' ? 'hsl(var(--warning))' :
                          shift.status === 'time_off_requested' ? 'hsl(var(--destructive))' :
                          shift.status === 'covered' ? 'hsl(var(--primary))' : undefined
        }}
      >
        <CardContent className="p-2 space-y-1.5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-medium text-primary">
                  {getInitials(shift.staffName)}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-xs truncate">{shift.staffName}</p>
                <p className="text-[10px] text-muted-foreground truncate">{shift.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Badge variant="outline" className={`text-[10px] px-1 py-0 h-4 ${getStatusColor()}`}>
                {getStatusIcon()}
              </Badge>
              <MoreVertical className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* Time */}
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Clock className="h-2.5 w-2.5" />
            <span className="font-mono">{shift.startTime}-{shift.endTime}</span>
            {shift.break > 0 && (
              <span className="text-[9px]">({shift.break}m)</span>
            )}
          </div>

          {/* Additional Status Info */}
          {shift.status === 'time_off_requested' && shift.timeOffReason && (
            <div className="text-[9px] text-destructive bg-destructive/5 px-1.5 py-0.5 rounded truncate">
              {shift.timeOffReason}
            </div>
          )}

          {shift.status === 'covered' && shift.coverageOfferedBy && (
            <div className="text-[9px] text-primary bg-primary/5 px-1.5 py-0.5 rounded">
              Covered by ID: {shift.coverageOfferedBy}
            </div>
          )}
        </CardContent>
      </Card>
    </ShiftActionsDropdown>
  );
};