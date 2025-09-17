import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Users } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  role: string;
  email: string;
}

interface AddReminderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReminderAdded: (reminder: any) => void;
}

const mockEmployees: Employee[] = [
  { id: '1', name: 'Sarah Johnson', role: 'Head Chef', email: 'sarah@restaurant.com' },
  { id: '2', name: 'Mike Rodriguez', role: 'Manager', email: 'mike@restaurant.com' },
  { id: '3', name: 'Emily Chen', role: 'Server', email: 'emily@restaurant.com' },
  { id: '4', name: 'David Park', role: 'Line Cook', email: 'david@restaurant.com' },
  { id: '5', name: 'Lisa Wong', role: 'Host', email: 'lisa@restaurant.com' },
  { id: '6', name: 'James Miller', role: 'Dishwasher', email: 'james@restaurant.com' },
  { id: '7', name: 'Maria Garcia', role: 'Prep Cook', email: 'maria@restaurant.com' },
  { id: '8', name: 'Tom Wilson', role: 'Bartender', email: 'tom@restaurant.com' },
];

export default function AddReminderModal({ open, onOpenChange, onReminderAdded }: AddReminderModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [category, setCategory] = useState<'safety' | 'maintenance' | 'cleaning' | 'operations'>('operations');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [time, setTime] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>([]);
  const [isEmployeeSelectOpen, setIsEmployeeSelectOpen] = useState(false);
  const [specificDate, setSpecificDate] = useState('');
  const [notificationMethods, setNotificationMethods] = useState<string[]>(['app']);
  const { toast } = useToast();

  const handleEmployeeToggle = (employee: Employee) => {
    setSelectedEmployees(prev => {
      const exists = prev.find(emp => emp.id === employee.id);
      if (exists) {
        return prev.filter(emp => emp.id !== employee.id);
      } else {
        return [...prev, employee];
      }
    });
  };

  const removeEmployee = (employeeId: string) => {
    setSelectedEmployees(prev => prev.filter(emp => emp.id !== employeeId));
  };

  const handleNotificationMethodToggle = (method: string) => {
    setNotificationMethods(prev => {
      if (prev.includes(method)) {
        return prev.filter(m => m !== method);
      } else {
        return [...prev, method];
      }
    });
  };

  const handleSubmit = () => {
    if (!title.trim() || !description.trim() || !time.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (selectedEmployees.length === 0) {
      toast({
        title: "No Employees Selected",
        description: "Please select at least one employee to notify",
        variant: "destructive",
      });
      return;
    }

    const newReminder = {
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      type,
      category,
      time: time.trim(),
      priority,
      completed: false,
      nextDue: getNextDueDate(),
      assignedEmployees: selectedEmployees,
      notificationMethods,
      specificDate: specificDate || null,
      createdAt: new Date(),
      createdBy: 'Current User' // In real app, get from auth context
    };

    onReminderAdded(newReminder);

    // Send notifications to selected employees
    sendNotifications(newReminder);

    // Reset form
    setTitle('');
    setDescription('');
    setType('daily');
    setCategory('operations');
    setPriority('medium');
    setTime('');
    setSelectedEmployees([]);
    setSpecificDate('');
    setNotificationMethods(['app']);
    onOpenChange(false);

    toast({
      title: "Reminder Created",
      description: `Reminder created and notifications sent to ${selectedEmployees.length} employee(s)`,
    });
  };

  const getNextDueDate = () => {
    if (specificDate) {
      return new Date(specificDate).toLocaleDateString();
    }

    const now = new Date();
    switch (type) {
      case 'daily':
        return 'Today';
      case 'weekly':
        const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        return nextWeek.toLocaleDateString();
      case 'monthly':
        const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
        return nextMonth.toLocaleDateString();
      default:
        return 'Today';
    }
  };

  const sendNotifications = async (reminder: any) => {
    // In a real app, this would send actual notifications
    console.log('Sending notifications:', {
      reminder,
      employees: selectedEmployees,
      methods: notificationMethods
    });

    // Mock notification sending
    for (const employee of selectedEmployees) {
      for (const method of notificationMethods) {
        switch (method) {
          case 'app':
            // Send in-app notification
            console.log(`Sending app notification to ${employee.name}`);
            break;
          case 'email':
            // Send email notification
            console.log(`Sending email to ${employee.email}`);
            break;
          case 'sms':
            // Send SMS notification
            console.log(`Sending SMS to ${employee.name}`);
            break;
        }
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Reminder</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Temperature Log Check"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed description of the task..."
                rows={3}
              />
            </div>
          </div>

          {/* Scheduling */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Frequency *</Label>
              <Select value={type} onValueChange={(value: any) => setType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="time">Time *</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>

          {/* Optional Specific Date */}
          <div>
            <Label htmlFor="specificDate">Specific Date (Optional)</Label>
            <Input
              id="specificDate"
              type="date"
              value={specificDate}
              onChange={(e) => setSpecificDate(e.target.value)}
              placeholder="Leave empty for recurring reminders"
            />
            <p className="text-xs text-muted-foreground mt-1">
              If set, this reminder will only trigger once on this date
            </p>
          </div>

          {/* Category and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={(value: any) => setCategory(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="safety">Safety</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="cleaning">Cleaning</SelectItem>
                  <SelectItem value="operations">Operations</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Employee Selection */}
          <div>
            <Label>Assign to Employees *</Label>
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEmployeeSelectOpen(!isEmployeeSelectOpen)}
                className="w-full justify-between"
              >
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {selectedEmployees.length === 0 
                    ? 'Select employees...' 
                    : `${selectedEmployees.length} employee(s) selected`
                  }
                </span>
                <Plus className="h-4 w-4" />
              </Button>

              {/* Selected Employees */}
              {selectedEmployees.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedEmployees.map((employee) => (
                    <Badge key={employee.id} variant="secondary" className="flex items-center gap-1">
                      {employee.name}
                      <button
                        type="button"
                        onClick={() => removeEmployee(employee.id)}
                        className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              {/* Employee Selection Dropdown */}
              {isEmployeeSelectOpen && (
                <div className="border rounded-lg p-3 max-h-48 overflow-y-auto bg-background">
                  <div className="space-y-2">
                    {mockEmployees.map((employee) => (
                      <div key={employee.id} className="flex items-center space-x-3 p-2 hover:bg-muted/50 rounded">
                        <Checkbox
                          checked={selectedEmployees.some(emp => emp.id === employee.id)}
                          onCheckedChange={() => handleEmployeeToggle(employee)}
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{employee.name}</p>
                          <p className="text-xs text-muted-foreground">{employee.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Notification Methods */}
          <div>
            <Label>Notification Methods</Label>
            <div className="space-y-2 mt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={notificationMethods.includes('app')}
                  onCheckedChange={() => handleNotificationMethodToggle('app')}
                />
                <Label className="text-sm">In-App Notification</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={notificationMethods.includes('email')}
                  onCheckedChange={() => handleNotificationMethodToggle('email')}
                />
                <Label className="text-sm">Email</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={notificationMethods.includes('sms')}
                  onCheckedChange={() => handleNotificationMethodToggle('sms')}
                />
                <Label className="text-sm">SMS (Premium)</Label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Create Reminder
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}