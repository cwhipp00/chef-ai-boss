import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Shift } from './ShiftCard';

interface Staff {
  id: number;
  name: string;
  role: string;
  hourlyRate: number;
}

interface EditShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (shift: Shift) => void;
  shift: Shift | null;
  staff: Staff[];
}

export const EditShiftModal: React.FC<EditShiftModalProps> = ({
  isOpen,
  onClose,
  onSave,
  shift,
  staff,
}) => {
  const [selectedStaff, setSelectedStaff] = useState(shift?.staffId?.toString() || '');
  const [date, setDate] = useState<Date>(shift ? new Date(shift.date) : new Date());
  const [clockIn, setClockIn] = useState(shift?.startTime || '09:00');
  const [clockOut, setClockOut] = useState(shift?.endTime || '17:00');
  const [breakDuration, setBreakDuration] = useState(shift?.break?.toString() || '30');
  const [role, setRole] = useState(shift?.role || 'server');

  const handleSave = () => {
    if (!selectedStaff || !clockIn || !clockOut) return;

    const updatedShift: Shift = {
      id: shift?.id || `shift-${Date.now()}`,
      staffId: parseInt(selectedStaff),
      staffName: staff.find(s => s.id === parseInt(selectedStaff))?.name || '',
      date: format(date, 'yyyy-MM-dd'),
      startTime: clockIn,
      endTime: clockOut,
      role,
      status: shift?.status || 'scheduled',
      break: parseInt(breakDuration),
    };

    onSave(updatedShift);
    onClose();
  };

  const timeOptions = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minute = i % 2 === 0 ? '00' : '30';
    const time = `${hour.toString().padStart(2, '0')}:${minute}`;
    return time;
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            {shift ? 'Edit Shift' : 'Create New Shift'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Staff Selection */}
          <div className="space-y-2">
            <Label htmlFor="staff">Staff Member</Label>
            <Select value={selectedStaff} onValueChange={setSelectedStaff}>
              <SelectTrigger>
                <SelectValue placeholder="Select staff member" />
              </SelectTrigger>
              <SelectContent>
                {staff.map((member) => (
                  <SelectItem key={member.id} value={member.id.toString()}>
                    {member.name} - {member.role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => newDate && setDate(newDate)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time Selection Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clockIn">Clock In</Label>
              <Select value={clockIn} onValueChange={setClockIn}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="clockOut">Clock Out</Label>
              <Select value={clockOut} onValueChange={setClockOut}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Role and Break */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="server">Server</SelectItem>
                  <SelectItem value="kitchen">Kitchen</SelectItem>
                  <SelectItem value="bartender">Bartender</SelectItem>
                  <SelectItem value="host">Host</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="break">Break (minutes)</Label>
              <Input
                id="break"
                type="number"
                value={breakDuration}
                onChange={(e) => setBreakDuration(e.target.value)}
                min="0"
                max="120"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1"
              disabled={!selectedStaff || !clockIn || !clockOut}
            >
              {shift ? 'Update Shift' : 'Create Shift'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};