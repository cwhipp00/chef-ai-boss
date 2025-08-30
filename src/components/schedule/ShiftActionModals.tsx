import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User } from 'lucide-react';
import type { Shift } from './ShiftCard';

interface TimeOffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
  shift: Shift | null;
}

export const TimeOffRequestModal: React.FC<TimeOffModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  shift
}) => {
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    if (reason.trim()) {
      onSubmit(reason.trim());
      setReason('');
      onClose();
    }
  };

  if (!shift) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request Time Off</DialogTitle>
          <DialogDescription>
            Request time off for your scheduled shift
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-muted/30 p-3 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{new Date(shift.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{shift.startTime} - {shift.endTime}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{shift.role}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason for time off request</Label>
            <Textarea
              id="reason"
              placeholder="Please provide a reason for your time off request..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[80px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!reason.trim()}>
            Submit Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface SwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (targetShiftId: string, message: string) => void;
  shift: Shift | null;
  availableShifts: Shift[];
}

export const ShiftSwapModal: React.FC<SwapModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  shift,
  availableShifts
}) => {
  const [selectedShiftId, setSelectedShiftId] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (selectedShiftId && message.trim()) {
      onSubmit(selectedShiftId, message.trim());
      setSelectedShiftId('');
      setMessage('');
      onClose();
    }
  };

  if (!shift) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Request Shift Swap</DialogTitle>
          <DialogDescription>
            Request to swap your shift with another employee
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-muted/30 p-3 rounded-lg">
            <h4 className="font-medium mb-2">Your Shift</h4>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <span>{new Date(shift.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span>{shift.startTime} - {shift.endTime}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="target-shift">Select shift to swap with</Label>
            <Select value={selectedShiftId} onValueChange={setSelectedShiftId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a shift to swap with" />
              </SelectTrigger>
              <SelectContent>
                {availableShifts.map((availableShift) => (
                  <SelectItem key={availableShift.id} value={availableShift.id}>
                    <div className="flex items-center gap-2">
                      <span>{availableShift.staffName}</span>
                      <Badge variant="outline">
                        {new Date(availableShift.date).toLocaleDateString()}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {availableShift.startTime}-{availableShift.endTime}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="swap-message">Message to colleague</Label>
            <Textarea
              id="swap-message"
              placeholder="Hi! Would you be interested in swapping shifts? Let me know if this works for you."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[80px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!selectedShiftId || !message.trim()}>
            Send Swap Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface CoverageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  shift: Shift | null;
  type: 'offer' | 'take';
}

export const CoverageModal: React.FC<CoverageModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  shift,
  type
}) => {
  if (!shift) return null;

  const title = type === 'offer' ? 'Offer Shift Coverage' : 'Take Shift Coverage';
  const description = type === 'offer' 
    ? 'Make your shift available for other employees to cover'
    : 'Confirm that you want to cover this shift';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-muted/30 p-3 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{new Date(shift.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{shift.startTime} - {shift.endTime}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{shift.role}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Employee:</span>
              <span className="font-medium">{shift.staffName}</span>
            </div>
          </div>

          {type === 'offer' && (
            <div className="text-sm text-muted-foreground bg-blue-50 p-3 rounded-lg border border-blue-200">
              Your shift will be marked as "needs coverage" and other employees will be notified that they can take it.
            </div>
          )}

          {type === 'take' && (
            <div className="text-sm text-muted-foreground bg-green-50 p-3 rounded-lg border border-green-200">
              By taking this shift, you'll be responsible for covering it. Make sure you're available at this time.
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>
            {type === 'offer' ? 'Offer Coverage' : 'Take Shift'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};