import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  Calendar, 
  Clock, 
  MapPin, 
  Plus, 
  Mail, 
  Video, 
  Phone,
  UserCheck,
  UserX,
  Send,
  Copy,
  Settings,
  Bell
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, addDays } from 'date-fns';
import { EnhancedVideoCallManager } from '@/components/video/EnhancedVideoCallManager';

interface MeetingParticipant {
  id: string;
  name: string;
  email: string;
  role?: string;
  status: 'invited' | 'accepted' | 'declined' | 'pending';
  joinedAt?: Date;
}

interface Meeting {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location?: string;
  meetingType: 'in-person' | 'video' | 'phone';
  participants: MeetingParticipant[];
  organizer: string;
  agenda?: string[];
  recurring?: {
    type: 'daily' | 'weekly' | 'monthly';
    interval: number;
    endDate?: string;
  };
  reminders: string[];
  meetingLink?: string;
  createdAt: Date;
}

interface MeetingManagerProps {
  selectedDate: Date;
  onMeetingCreated: (meeting: Meeting) => void;
  existingMeetings?: Meeting[];
}

export function MeetingManager({ selectedDate, onMeetingCreated, existingMeetings = [] }: MeetingManagerProps) {
  const { toast } = useToast();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  
  // Meeting form state
  const [meetingForm, setMeetingForm] = useState({
    title: '',
    description: '',
    date: format(selectedDate, 'yyyy-MM-dd'),
    startTime: '09:00',
    endTime: '10:00',
    location: '',
    meetingType: 'video' as const,
    agenda: [''],
    recurring: null as Meeting['recurring'],
    reminders: ['15min', '1hour']
  });
  
  const [participants, setParticipants] = useState<Omit<MeetingParticipant, 'id' | 'status'>[]>([]);
  const [newParticipantEmail, setNewParticipantEmail] = useState('');

  // Common staff emails for quick selection
  const staffMembers = [
    { name: 'Sarah Johnson', email: 'sarah@restaurant.com', role: 'Head Chef' },
    { name: 'Mike Rodriguez', email: 'mike@restaurant.com', role: 'Sous Chef' },
    { name: 'Emily Chen', email: 'emily@restaurant.com', role: 'Server Lead' },
    { name: 'David Park', email: 'david@restaurant.com', role: 'Kitchen Manager' },
    { name: 'Lisa Thompson', email: 'lisa@restaurant.com', role: 'Front of House' },
    { name: 'James Wilson', email: 'james@restaurant.com', role: 'Assistant Manager' }
  ];

  // Add participant
  const addParticipant = (name: string, email: string, role?: string) => {
    if (participants.find(p => p.email === email)) {
      toast({
        title: "Already Added",
        description: `${name} is already in the participant list.`,
        variant: "destructive",
      });
      return;
    }

    setParticipants(prev => [...prev, { name, email, role }]);
    setNewParticipantEmail('');
  };

  // Remove participant
  const removeParticipant = (email: string) => {
    setParticipants(prev => prev.filter(p => p.email !== email));
  };

  // Add agenda item
  const addAgendaItem = () => {
    setMeetingForm(prev => ({
      ...prev,
      agenda: [...prev.agenda, '']
    }));
  };

  // Update agenda item
  const updateAgendaItem = (index: number, value: string) => {
    setMeetingForm(prev => ({
      ...prev,
      agenda: prev.agenda.map((item, i) => i === index ? value : item)
    }));
  };

  // Remove agenda item
  const removeAgendaItem = (index: number) => {
    setMeetingForm(prev => ({
      ...prev,
      agenda: prev.agenda.filter((_, i) => i !== index)
    }));
  };

  // Create meeting
  const createMeeting = async () => {
    if (!meetingForm.title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a meeting title.",
        variant: "destructive",
      });
      return;
    }

    if (participants.length === 0) {
      toast({
        title: "Participants Required",
        description: "Please add at least one participant.",
        variant: "destructive",
      });
      return;
    }

    const meeting: Meeting = {
      id: Date.now().toString(),
      ...meetingForm,
      participants: participants.map(p => ({
        ...p,
        id: `participant-${Date.now()}-${Math.random()}`,
        status: 'invited' as const
      })),
      organizer: 'Current User', // Would be actual user name
      meetingLink: meetingForm.meetingType === 'video' ? 
        `https://meet.restaurant.com/room/${Date.now()}` : undefined,
      createdAt: new Date()
    };

    // Send invitations
    await sendMeetingInvitations(meeting);
    
    onMeetingCreated(meeting);
    resetForm();
    setIsCreateDialogOpen(false);

    toast({
      title: "Meeting Created",
      description: `Meeting "${meeting.title}" has been scheduled and invitations sent.`,
    });
  };

  // Send meeting invitations
  const sendMeetingInvitations = async (meeting: Meeting) => {
    // In real implementation, this would call an email service
    console.log('Sending invitations for meeting:', meeting.title);
    
    // Mock email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Invitations Sent",
      description: `Meeting invitations sent to ${meeting.participants.length} participants.`,
    });
  };

  // Generate meeting link
  const generateMeetingLink = () => {
    const link = `https://meet.restaurant.com/room/${Date.now()}`;
    setMeetingForm(prev => ({ ...prev, location: link }));
    
    // Copy to clipboard
    navigator.clipboard.writeText(link);
    toast({
      title: "Meeting Link Generated",
      description: "Link copied to clipboard.",
    });
  };

  // Start video call
  const startVideoCall = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setIsVideoCallOpen(true);
  };

  // Reset form
  const resetForm = () => {
    setMeetingForm({
      title: '',
      description: '',
      date: format(selectedDate, 'yyyy-MM-dd'),
      startTime: '09:00',
      endTime: '10:00',
      location: '',
      meetingType: 'video',
      agenda: [''],
      recurring: null,
      reminders: ['15min', '1hour']
    });
    setParticipants([]);
    setNewParticipantEmail('');
  };

  // Get meetings for selected date
  const todaysMeetings = existingMeetings.filter(meeting => 
    meeting.date === format(selectedDate, 'yyyy-MM-dd')
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Meetings for {format(selectedDate, 'MMMM d, yyyy')}</h2>
          <p className="text-muted-foreground">Schedule and manage team meetings with video conferencing</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              Schedule Meeting
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

      {/* Today's Meetings */}
      <div className="grid gap-4">
        {todaysMeetings.map((meeting) => (
          <Card key={meeting.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {meeting.meetingType === 'video' && <Video className="h-4 w-4" />}
                    {meeting.meetingType === 'phone' && <Phone className="h-4 w-4" />}
                    {meeting.meetingType === 'in-person' && <MapPin className="h-4 w-4" />}
                    {meeting.title}
                  </CardTitle>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {meeting.startTime} - {meeting.endTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {meeting.participants.length} participants
                    </span>
                    {meeting.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {meeting.location}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {meeting.meetingType === 'video' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startVideoCall(meeting)}
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Join Call
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-3">{meeting.description}</p>
              <div className="flex flex-wrap gap-2">
                {meeting.participants.map((participant) => (
                  <Badge 
                    key={participant.id} 
                    variant={
                      participant.status === 'accepted' ? 'default' : 
                      participant.status === 'declined' ? 'destructive' : 'outline'
                    }
                    className="text-xs"
                  >
                    {participant.name} - {participant.status}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
        
        {todaysMeetings.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No meetings scheduled for this date</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create Meeting Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Schedule New Meeting</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Meeting Title *</Label>
                <Input
                  id="title"
                  placeholder="Weekly Team Standup"
                  value={meetingForm.title}
                  onChange={(e) => setMeetingForm(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Meeting Type</Label>
                <Select
                  value={meetingForm.meetingType}
                  onValueChange={(value: any) => setMeetingForm(prev => ({ ...prev, meetingType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Video Conference</SelectItem>
                    <SelectItem value="phone">Phone Call</SelectItem>
                    <SelectItem value="in-person">In-Person</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Meeting agenda and objectives"
                value={meetingForm.description}
                onChange={(e) => setMeetingForm(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={meetingForm.date}
                  onChange={(e) => setMeetingForm(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={meetingForm.startTime}
                  onChange={(e) => setMeetingForm(prev => ({ ...prev, startTime: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={meetingForm.endTime}
                  onChange={(e) => setMeetingForm(prev => ({ ...prev, endTime: e.target.value }))}
                />
              </div>
            </div>

            {/* Location/Link */}
            <div className="space-y-2">
              <Label htmlFor="location">
                {meetingForm.meetingType === 'video' ? 'Meeting Link' : 
                 meetingForm.meetingType === 'phone' ? 'Phone Number' : 'Location'}
              </Label>
              <div className="flex gap-2">
                <Input
                  id="location"
                  placeholder={
                    meetingForm.meetingType === 'video' ? 'Video conference link' :
                    meetingForm.meetingType === 'phone' ? 'Conference dial-in number' :
                    'Meeting room or address'
                  }
                  value={meetingForm.location}
                  onChange={(e) => setMeetingForm(prev => ({ ...prev, location: e.target.value }))}
                />
                {meetingForm.meetingType === 'video' && (
                  <Button type="button" variant="outline" onClick={generateMeetingLink}>
                    <Video className="h-4 w-4 mr-2" />
                    Generate Link
                  </Button>
                )}
              </div>
            </div>

            {/* Participants */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Participants *</Label>
                <Badge variant="outline">{participants.length} invited</Badge>
              </div>
              
              {/* Quick Add Staff */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">Quick add staff members:</p>
                <div className="flex flex-wrap gap-2">
                  {staffMembers.map((staff) => (
                    <Button
                      key={staff.email}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addParticipant(staff.name, staff.email, staff.role)}
                      disabled={participants.find(p => p.email === staff.email) !== undefined}
                    >
                      <UserCheck className="h-3 w-3 mr-1" />
                      {staff.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Manual Add */}
              <div className="flex gap-2">
                <Input
                  placeholder="Enter email address"
                  value={newParticipantEmail}
                  onChange={(e) => setNewParticipantEmail(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (newParticipantEmail.includes('@')) {
                        addParticipant(
                          newParticipantEmail.split('@')[0], 
                          newParticipantEmail
                        );
                      }
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (newParticipantEmail.includes('@')) {
                      addParticipant(
                        newParticipantEmail.split('@')[0], 
                        newParticipantEmail
                      );
                    }
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Participant List */}
              <div className="space-y-2">
                {participants.map((participant) => (
                  <div key={participant.email} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs text-primary-foreground">
                        {participant.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{participant.name}</p>
                        <p className="text-xs text-muted-foreground">{participant.email}</p>
                      </div>
                      {participant.role && (
                        <Badge variant="secondary" className="text-xs">{participant.role}</Badge>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeParticipant(participant.email)}
                    >
                      <UserX className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Agenda */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Meeting Agenda</Label>
                <Button type="button" variant="outline" size="sm" onClick={addAgendaItem}>
                  <Plus className="h-3 w-3 mr-1" />
                  Add Item
                </Button>
              </div>
              <div className="space-y-2">
                {meetingForm.agenda.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={`Agenda item ${index + 1}`}
                      value={item}
                      onChange={(e) => updateAgendaItem(index, e.target.value)}
                    />
                    {meetingForm.agenda.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeAgendaItem(index)}
                      >
                        ×
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={createMeeting} className="bg-gradient-primary">
              <Send className="h-4 w-4 mr-2" />
              Schedule & Send Invitations
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Video Call Manager */}
      {selectedMeeting && (
        <EnhancedVideoCallManager
          isOpen={isVideoCallOpen}
          onClose={() => setIsVideoCallOpen(false)}
          callId={selectedMeeting.id}
          isHost={true}
          meetingTitle={selectedMeeting.title}
          scheduledParticipants={selectedMeeting.participants.map(p => p.email)}
        />
      )}
    </div>
  );
}