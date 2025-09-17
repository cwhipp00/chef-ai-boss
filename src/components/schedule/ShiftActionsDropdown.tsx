import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  Edit3,
  Trash2,
  UserX,
  ArrowUpRight,
  User,
  RefreshCw,
  MoreVertical,
} from 'lucide-react';
import type { Shift } from './ShiftCard';

interface ShiftActionsDropdownProps {
  shift: Shift;
  currentUserId?: number;
  onDeleteShift: (shiftId: string) => void;
  onEditShift: (shiftId: string) => void;
  onRequestTimeOff: (shiftId: string) => void;
  onOfferCoverage: (shiftId: string) => void;
  onTakeCoverage: (shiftId: string) => void;
  onSwapRequest: (shiftId: string) => void;
  children: React.ReactNode;
}

export const ShiftActionsDropdown: React.FC<ShiftActionsDropdownProps> = ({
  shift,
  currentUserId = 1,
  onDeleteShift,
  onEditShift,
  onRequestTimeOff,
  onOfferCoverage,
  onTakeCoverage,
  onSwapRequest,
  children,
}) => {
  const isMyShift = shift.staffId === currentUserId;
  const canTakeCoverage = shift.status === 'needs_coverage' && !isMyShift;
  const canOfferCoverage = shift.status === 'scheduled' && isMyShift;
  const canRequestTimeOff = shift.status === 'scheduled' && isMyShift;
  const canSwap = isMyShift && shift.status === 'scheduled';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-48 bg-background/95 backdrop-blur-sm border shadow-lg z-50"
      >
        {/* Edit option - always available */}
        <DropdownMenuItem
          onClick={() => onEditShift(shift.id)}
          className="cursor-pointer"
        >
          <Edit3 className="w-4 h-4 mr-2" />
          Change Shift
        </DropdownMenuItem>

        {/* Delete option - always available for managers */}
        <DropdownMenuItem
          onClick={() => onDeleteShift(shift.id)}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Shift
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Time off request - only for own scheduled shifts */}
        {canRequestTimeOff && (
          <DropdownMenuItem
            onClick={() => onRequestTimeOff(shift.id)}
            className="cursor-pointer"
          >
            <UserX className="w-4 h-4 mr-2" />
            Request Time Off
          </DropdownMenuItem>
        )}

        {/* Offer coverage - only for own scheduled shifts */}
        {canOfferCoverage && (
          <DropdownMenuItem
            onClick={() => onOfferCoverage(shift.id)}
            className="cursor-pointer"
          >
            <ArrowUpRight className="w-4 h-4 mr-2" />
            Offer Coverage
          </DropdownMenuItem>
        )}

        {/* Take coverage - only for shifts needing coverage that aren't yours */}
        {canTakeCoverage && (
          <DropdownMenuItem
            onClick={() => onTakeCoverage(shift.id)}
            className="cursor-pointer text-primary focus:text-primary"
          >
            <User className="w-4 h-4 mr-2" />
            Take Coverage
          </DropdownMenuItem>
        )}

        {/* Swap request - only for own scheduled shifts */}
        {canSwap && (
          <DropdownMenuItem
            onClick={() => onSwapRequest(shift.id)}
            className="cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Request Swap
          </DropdownMenuItem>
        )}

        {/* Show message if no actions available */}
        {!canRequestTimeOff && !canOfferCoverage && !canTakeCoverage && !canSwap && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled className="text-xs text-muted-foreground">
              No additional actions available
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};