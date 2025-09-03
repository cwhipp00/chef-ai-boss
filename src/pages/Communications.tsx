import { useState } from 'react';
import { Send, Users, MessageSquare, Bell, Search, Filter, Plus, Megaphone, Clock, CheckCircle, AlertTriangle, Radio, UserCheck, Phone, Video, Mail, FileText, Archive, Star, Paperclip, Smile, MoreHorizontal, Pin, Hash, Settings, Mic, MicOff, VideoOff, ScreenShare, Volume2, Minimize2, Maximize2, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { VideoCall } from '@/components/communications/VideoCall';
import { RealTimeChat } from '@/components/communications/RealTimeChat';
import { UserPresence } from '@/components/communications/UserPresence';
import { EnhancedVideoCall } from '@/components/video/EnhancedVideoCall';
import { RealtimeCollaboration } from '@/components/realtime/RealtimeCollaboration';
import { AIRecorder } from '@/components/communications/AIRecorder';

const messages = [
  {
    id: 1,
    sender: "Sarah Johnson",
    role: "Head Chef",
    message: "Morning prep is complete. All stations ready for lunch service.",
    timestamp: "10:30 AM",
    priority: "normal",
    channel: "kitchen"
  },
  {
    id: 2,
    sender: "Mike Rodriguez",
    role: "Manager",
    message: "We're expecting a large party at 7 PM. Please prepare extra portions.",
    timestamp: "9:45 AM",
    priority: "high",
    channel: "general"
  },
  {
    id: 3,
    sender: "Emily Chen",
    role: "Server",
    message: "Customer at table 5 has dietary restrictions - no gluten.",
    timestamp: "11:15 AM",
    priority: "urgent",
    channel: "service"
  },
  {
    id: 4,
    sender: "David Park",
    role: "Line Cook",
    message: "Running low on salmon. Need to 86 salmon special after current orders.",
    timestamp: "11:20 AM",
    priority: "urgent",
    channel: "kitchen"
  }
];

const channels = [
  { id: 1, name: "General", members: 12, unread: 3, active: true },
  { id: 2, name: "Kitchen", members: 8, unread: 1, active: true },
  { id: 3, name: "Service", members: 6, unread: 2, active: true },
  { id: 4, name: "Management", members: 4, unread: 0, active: false }
];

const announcements = [
  {
    id: 1,
    title: "New Menu Items Launch",
    content: "Starting Monday, we'll be featuring three new seasonal dishes. Please review the prep guides.",
    author: "Mike Rodriguez",
    timestamp: "2 hours ago",
    priority: "high"
  },
  {
    id: 2,
    title: "Staff Meeting Reminder",
    content: "Weekly team meeting tomorrow at 3 PM in the break room. Attendance is mandatory.",
    author: "Sarah Johnson",
    timestamp: "1 day ago",
    priority: "normal"
  }
];

const teamBroadcasts = [
  {
    id: 1,
    message: "🎉 Great work everyone! We exceeded our sales target this week by 15%. Keep up the excellent teamwork!",
    sender: "Mike Rodriguez",
    role: "General Manager",
    timestamp: "1 hour ago",
    type: "celebration",
    readBy: 8,
    totalStaff: 12
  },
  {
    id: 2,
    message: "⚠️ Reminder: Health inspector visit scheduled for tomorrow at 2 PM. Please ensure all stations are clean and organized.",
    sender: "Sarah Johnson",
    role: "Head Chef",
    timestamp: "4 hours ago",
    type: "urgent",
    readBy: 12,
    totalStaff: 12
  },
  {
    id: 3,
    message: "📋 New safety protocols are now in effect. Please review the updated guidelines in your employee portal.",
    sender: "Lisa Wong",
    role: "HR Manager",
    timestamp: "1 day ago",
    type: "policy",
    readBy: 10,
    totalStaff: 12
  }
];

export default function Communications() {
  const [selectedView, setSelectedView] = useState('dashboard');
  const [selectedChannel, setSelectedChannel] = useState('general');
  const [newMessage, setNewMessage] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastType, setBroadcastType] = useState('general');
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false);
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const [videoCallRecipient, setVideoCallRecipient] = useState<{id: string, name: string} | null>(null);
  const [currentCallId, setCurrentCallId] = useState<string | null>(null);
  const { toast } = useToast();
  
  const currentUserId = 'current_user_123'; // Replace with actual user ID

  // Handle video call initiation
  const handleStartCall = (userId: string, type: 'audio' | 'video') => {
    const recipient = teamMembers.find(member => member.id === userId);
    if (recipient) {
      const callId = `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setVideoCallRecipient({ id: userId, name: recipient.name });
      setCurrentCallId(callId);
      setIsVideoCallOpen(true);
      
      toast({
        title: type === 'video' ? "Starting Video Call" : "Starting Audio Call",
        description: `Calling ${recipient.name}...`,
      });
    }
  };

  // Handle chat initiation
  const handleStartChat = (userId: string) => {
    const recipient = teamMembers.find(member => member.id === userId);
    if (recipient) {
      setSelectedChannel('general');
      setSelectedView('chat');
      
      toast({
        title: "Opening Chat",
        description: `Starting conversation with ${recipient.name}`,
      });
    }
  };

  // Team members data
  const teamMembers = [
    { id: '1', name: 'Sarah Johnson', role: 'Head Chef', avatar: undefined, status: 'active' },
    { id: '2', name: 'Mike Rodriguez', role: 'Manager', avatar: undefined, status: 'active' },
    { id: '3', name: 'Emily Chen', role: 'Server', avatar: undefined, status: 'busy' },
    { id: '4', name: 'David Park', role: 'Line Cook', avatar: undefined, status: 'active' },
    { id: '5', name: 'Lisa Wong', role: 'Host', avatar: undefined, status: 'away' },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-l-destructive bg-destructive/5';
      case 'high': return 'border-l-warning bg-warning/5';
      case 'normal': return 'border-l-primary bg-primary/5';
      default: return 'border-l-muted';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent': return <Badge variant="destructive">Urgent</Badge>;
      case 'high': return <Badge className="bg-warning text-warning-foreground">High</Badge>;
      case 'normal': return <Badge variant="secondary">Normal</Badge>;
      default: return null;
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  const getBroadcastTypeIcon = (type: string) => {
    switch (type) {
      case 'celebration': return '🎉';
      case 'urgent': return '⚠️';
      case 'policy': return '📋';
      case 'general': return '💬';
      default: return '💬';
    }
  };

  const getBroadcastTypeColor = (type: string) => {
    switch (type) {
      case 'celebration': return 'border-l-success bg-success/5';
      case 'urgent': return 'border-l-destructive bg-destructive/5';
      case 'policy': return 'border-l-accent bg-accent/5';
      case 'general': return 'border-l-primary bg-primary/5';
      default: return 'border-l-muted bg-muted/5';
    }
  };

  const handleSendBroadcast = () => {
    if (!broadcastMessage.trim()) return;
    
    toast({
      title: "Broadcast Sent",
      description: `Message sent to all ${12} team members`,
    });
    setBroadcastMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/5">
      {selectedView === 'dashboard' && (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Team Communications</h1>
            <p className="text-muted-foreground">Connect with your team through chat, calls, and announcements</p>
          </div>

          {/* Quick Action Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {/* Start a Chat */}
            <Card className="hover-lift cursor-pointer bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover:border-primary/40 transition-all"
                  onClick={() => setSelectedView('chat')}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Team Chat</h3>
                    <p className="text-sm text-muted-foreground">Join conversations</p>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">4 active channels</span>
                  <Badge variant="destructive" className="text-xs">6 unread</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Video Meeting */}
            <Card className="hover-lift cursor-pointer bg-gradient-to-br from-success/5 to-success/10 border-success/20 hover:border-success/40 transition-all"
                  onClick={() => setSelectedView('video-meeting')}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
                    <Video className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Video Call</h3>
                    <p className="text-sm text-muted-foreground">Start face-to-face meeting</p>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-success flex items-center gap-2">
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                    {teamMembers.filter(m => m.status === 'active').length} online
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Announcements */}
            <Card className="hover-lift cursor-pointer bg-gradient-to-br from-warning/5 to-warning/10 border-warning/20 hover:border-warning/40 transition-all"
                  onClick={() => setSelectedView('announcements')}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-warning/20 flex items-center justify-center">
                    <Megaphone className="h-6 w-6 text-warning" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Announcements</h3>
                    <p className="text-sm text-muted-foreground">Broadcast to team</p>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">2 recent posts</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Team Overview */}
          <div className="grid gap-6 md:grid-cols-2 mb-8">
            {/* Team Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Team Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-xs font-medium">
                              {getInitials(member.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${
                            member.status === 'active' ? 'bg-success' :
                            member.status === 'busy' ? 'bg-warning' :
                            member.status === 'away' ? 'bg-muted-foreground' : 'bg-muted-foreground/40'
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.role}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => handleStartChat(member.id)}>
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => handleStartCall(member.id, 'video')}>
                          <Video className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {teamBroadcasts.slice(0, 3).map((broadcast) => (
                    <div key={broadcast.id} className={`p-3 rounded-lg border-l-4 ${getBroadcastTypeColor(broadcast.type)}`}>
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-xs font-medium text-muted-foreground">{broadcast.sender}</span>
                        <span className="text-xs text-muted-foreground">{broadcast.timestamp}</span>
                      </div>
                      <p className="text-sm text-foreground line-clamp-2">{broadcast.message}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {selectedView === 'chat' && (
        <div className="h-screen bg-gradient-to-br from-background to-muted/5 flex">
          {/* Chat Sidebar */}
          <div className="w-80 border-r border-border/50 bg-card/30 backdrop-blur-sm flex flex-col">
            <div className="p-4 border-b border-border/30">
              <div className="flex items-center justify-between mb-4">
                <Button variant="ghost" size="sm" onClick={() => setSelectedView('dashboard')}>
                  ← Back to Dashboard
                </Button>
              </div>
              <h2 className="text-lg font-semibold">Team Chat</h2>
            </div>

            {/* Channels */}
            <div className="p-4 border-b border-border/20">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Hash className="h-4 w-4 text-primary" />
                Channels
              </h3>
              <div className="space-y-1">
                {channels.map((channel) => (
                  <div
                    key={channel.id}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all hover:bg-accent/10 ${
                      selectedChannel === channel.name.toLowerCase()
                        ? 'bg-primary/10 text-primary shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    onClick={() => setSelectedChannel(channel.name.toLowerCase())}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        channel.active ? 'bg-success' : 'bg-muted-foreground/40'
                      }`} />
                      <span className="text-sm font-medium">{channel.name}</span>
                    </div>
                    {channel.unread > 0 && (
                      <Badge variant="destructive" className="h-5 text-xs px-1.5">
                        {channel.unread}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Team Members in sidebar */}
            <div className="flex-1 overflow-hidden p-4">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Users className="h-4 w-4 text-success" />
                Team
              </h3>
              <div className="space-y-2">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/5 cursor-pointer transition-colors">
                    <div className="relative">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs font-medium">
                          {getInitials(member.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${
                        member.status === 'active' ? 'bg-success' :
                        member.status === 'busy' ? 'bg-warning' :
                        member.status === 'away' ? 'bg-muted-foreground' : 'bg-muted-foreground/40'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex">
            <RealTimeChat 
              selectedChannel={selectedChannel}
              currentUserId={currentUserId}
              onChannelChange={setSelectedChannel}
            />
          </div>
        </div>
      )}

      {selectedView === 'video-meeting' && (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/5 p-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <Button variant="ghost" onClick={() => setSelectedView('dashboard')}>
                ← Back to Dashboard
              </Button>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Video Meeting Room</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Video className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">Video Conference</h3>
                      <p className="text-muted-foreground mb-4">Start or join a video meeting with your team</p>
                      <Button>
                        <Video className="h-4 w-4 mr-2" />
                        Start Meeting
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedView === 'announcements' && (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/5">
          <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-4xl">
            <div className="mb-6">
              <Button variant="ghost" onClick={() => setSelectedView('dashboard')}>
                ← Back to Dashboard
              </Button>
            </div>
            
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-2">Team Announcements</h1>
              <p className="text-muted-foreground">Share important updates with your entire team</p>
            </div>

            {/* Create Announcement */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Megaphone className="h-5 w-5" />
                  Create Announcement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="announcement-type">Type</Label>
                    <Select value={broadcastType} onValueChange={setBroadcastType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="celebration">Celebration</SelectItem>
                        <SelectItem value="policy">Policy Update</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="announcement-message">Message</Label>
                    <Textarea
                      id="announcement-message"
                      placeholder="Write your announcement..."
                      value={broadcastMessage}
                      onChange={(e) => setBroadcastMessage(e.target.value)}
                      rows={4}
                    />
                  </div>
                  <Button onClick={handleSendBroadcast} className="w-full">
                    <Megaphone className="h-4 w-4 mr-2" />
                    Send Announcement
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Announcements */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Recent Announcements</h2>
              {teamBroadcasts.map((broadcast) => (
                <Card key={broadcast.id} className={`border-l-4 ${getBroadcastTypeColor(broadcast.type)}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getBroadcastTypeIcon(broadcast.type)}</span>
                        <div>
                          <p className="font-medium">{broadcast.sender}</p>
                          <p className="text-sm text-muted-foreground">{broadcast.role}</p>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">{broadcast.timestamp}</span>
                    </div>
                    <p className="text-foreground mb-3">{broadcast.message}</p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Read by {broadcast.readBy}/{broadcast.totalStaff} team members</span>
                      <Badge variant="secondary" className="capitalize">{broadcast.type}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Video Call Dialog */}
      <Dialog open={isVideoCallOpen} onOpenChange={setIsVideoCallOpen}>
        <DialogContent className="max-w-4xl h-[600px] p-0">
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <Video className="h-16 w-16 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">Calling {videoCallRecipient?.name}</h3>
              <p className="text-muted-foreground mb-4">Connecting to video call...</p>
              <Button variant="destructive" onClick={() => setIsVideoCallOpen(false)}>
                End Call
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}