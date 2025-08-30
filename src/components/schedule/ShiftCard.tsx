import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Clock, 
  User, 
  AlertCircle, 
  CheckCircle, 
  ArrowUpRight,
  UserX,
  Calendar
} from 'lucide-react';

export interface Shift {
  id: string;
  staffId: number;
  staffName: string;
  date: string;
  startTime: string;
  endTime: string;
  role: string;
  break: number;
  status: 'scheduled' | 'needs_coverage' | 'covered' | 'time_off_requested' | 'open';
  coverageOfferedBy?: number;
  coverageRequestedBy?: number;
  timeOffReason?: string;
}

interface ShiftCardProps {
  shift: Shift;
  onOfferCoverage: (shiftId: string) => void;
  onTakeCoverage: (shiftId: string) => void;
  onRequestTimeOff: (shiftId: string) => void;
  onSwapRequest: (shiftId: string) => void;
  onEdit: (shiftId: string) => void;
  isDragging?: boolean;
  currentUserId?: number;
}

export const ShiftCard: React.FC<ShiftCardProps> = ({
  shift,
  onOfferCoverage,
  onTakeCoverage,
  onRequestTimeOff,
  onSwapRequest,
  onEdit,
  isDragging = false,
  currentUserId = 1
}) => {
  const getStatusColor = () => {
    switch (shift.status) {
      case 'scheduled':
        return 'bg-success/10 text-success border-success/20';
      case 'needs_coverage':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'covered':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'time_off_requested':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'open':
        return 'bg-muted/10 text-muted-foreground border-border';
      default:
        return 'bg-muted/10 text-muted-foreground border-border';
    }
  };

  const getStatusIcon = () => {
    switch (shift.status) {
      case 'scheduled':
        return <CheckCircle className="h-3 w-3" />;
      case 'needs_coverage':
        return <AlertCircle className="h-3 w-3" />;
      case 'covered':
        return <User className="h-3 w-3" />;
      case 'time_off_requested':
        return <UserX className="h-3 w-3" />;
      case 'open':
        return <Calendar className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const getStatusText = () => {
    switch (shift.status) {
      case 'scheduled':
        return 'Scheduled';
      case 'needs_coverage':
        return 'Needs Coverage';
      case 'covered':
        return 'Covered';
      case 'time_off_requested':
        return 'Time Off Requested';
      case 'open':
        return 'Open Shift';
      default:
        return 'Unknown';
    }
  };

  const isMyShift = shift.staffId === currentUserId;
  const canTakeCoverage = shift.status === 'needs_coverage' && !isMyShift;
  const canOfferCoverage = shift.status === 'scheduled' && isMyShift;
  const canRequestTimeOff = shift.status === 'scheduled' && isMyShift;

  return (
    <Card 
      className={`relative transition-all duration-200 hover:shadow-md ${
        isDragging ? 'opacity-50 rotate-2 scale-105' : ''
      } ${shift.status !== 'scheduled' ? 'border-l-4' : ''}`}
      style={{
        borderLeftColor: shift.status === 'needs_coverage' ? 'hsl(var(--warning))' :
                        shift.status === 'time_off_requested' ? 'hsl(var(--destructive))' :
                        shift.status === 'covered' ? 'hsl(var(--primary))' : undefined
      }}
    >
      <CardContent className="p-3 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xs font-medium text-primary">
                {shift.staffName.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <p className="font-medium text-sm">{shift.staffName}</p>
              <p className="text-xs text-muted-foreground">{shift.role}</p>
            </div>
          </div>
          <Badge variant="outline" className={`text-xs ${getStatusColor()}`}>
            {getStatusIcon()}
            <span className="ml-1">{getStatusText()}</span>
          </Badge>
        </div>

        {/* Time */}
        <div className="flex items-center gap-1 text-sm">
          <Clock className="h-3 w-3 text-muted-foreground" />
          <span>{shift.startTime} - {shift.endTime}</span>
          {shift.break > 0 && (
            <span className="text-xs text-muted-foreground ml-2">
              ({shift.break}min break)
            </span>
          )}
        </div>

        {/* Additional Info */}
        {shift.status === 'time_off_requested' && shift.timeOffReason && (
          <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded">
            Reason: {shift.timeOffReason}
          </div>
        )}

        {shift.status === 'covered' && shift.coverageOfferedBy && (
          <div className="text-xs text-primary bg-primary/5 p-2 rounded">
            Covered by Staff ID: {shift.coverageOfferedBy}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-1 flex-wrap">
          {canOfferCoverage && (
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-7"
              onClick={() => onOfferCoverage(shift.id)}
            >
              <ArrowUpRight className="h-3 w-3 mr-1" />
              Offer Coverage
            </Button>
          )}
          
          {canTakeCoverage && (
            <Button
              variant="default"
              size="sm"
              className="text-xs h-7"
              onClick={() => onTakeCoverage(shift.id)}
            >
              <User className="h-3 w-3 mr-1" />
              Take Shift
            </Button>
          )}
          
          {canRequestTimeOff && (
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-7"
              onClick={() => onRequestTimeOff(shift.id)}
            >
              <UserX className="h-3 w-3 mr-1" />
              Time Off
            </Button>
          )}
          
          {isMyShift && shift.status === 'scheduled' && (
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-7"
              onClick={() => onSwapRequest(shift.id)}
            >
              Swap
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-7"
            onClick={() => onEdit(shift.id)}
          >
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};