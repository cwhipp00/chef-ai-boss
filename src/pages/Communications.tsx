import { useState } from 'react';
import { Send, Users, MessageSquare, Bell, Search, Filter, Plus, Megaphone, Clock, CheckCircle, AlertTriangle, Radio, UserCheck, Phone, Video, Mail, FileText, Archive, Star, Paperclip, Smile, MoreHorizontal, Pin, Hash } from 'lucide-react';
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
  const [selectedChannel, setSelectedChannel] = useState('general');
  const [newMessage, setNewMessage] = useState('');
  const [selectedTab, setSelectedTab] = useState('messages');
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
      // Create or switch to direct message channel
      setSelectedChannel(`dm_${userId}`);
      setSelectedTab('messages');
      
      toast({
        title: "Opening Chat",
        description: `Starting conversation with ${recipient.name}`,
      });
    }
  };

  // Team members data
  const teamMembers = [
    { id: '1', name: 'Sarah Johnson', role: 'Head Chef', avatar: undefined },
    { id: '2', name: 'Mike Rodriguez', role: 'Manager', avatar: undefined },
    { id: '3', name: 'Emily Chen', role: 'Server', avatar: undefined },
    { id: '4', name: 'David Park', role: 'Line Cook', avatar: undefined },
    { id: '5', name: 'Lisa Wong', role: 'Host', avatar: undefined },
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
    <div className="h-screen bg-gradient-to-br from-background via-background to-muted/10 flex flex-col">
      {/* Streamlined Header */}
      <div className="border-b bg-card/90 backdrop-blur-md p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Communications Hub</h1>
              <p className="text-sm text-muted-foreground">Team collaboration • 8 online</p>
            </div>
            <div className="hidden lg:flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
              <span className="text-xs font-medium text-success">System Healthy</span>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => handleStartCall('2', 'audio')}
              className="text-muted-foreground hover:text-foreground"
            >
              <Phone className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => handleStartCall('2', 'video')}
              className="text-muted-foreground hover:text-foreground"
            >
              <Video className="h-4 w-4" />
            </Button>
            <Dialog open={isAnnouncementOpen} onOpenChange={setIsAnnouncementOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-gradient-primary">
                  <Plus className="h-4 w-4 mr-1" />
                  Broadcast
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Radio className="h-5 w-5 text-primary" />
                    Team Broadcast
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <Select value={broadcastType} onValueChange={setBroadcastType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="z-50 bg-background border border-border shadow-lg">
                      <SelectItem value="general">💬 General Update</SelectItem>
                      <SelectItem value="urgent">⚠️ Urgent Notice</SelectItem>
                      <SelectItem value="celebration">🎉 Celebration</SelectItem>
                      <SelectItem value="policy">📋 Policy Update</SelectItem>
                    </SelectContent>
                  </Select>
                  <Textarea
                    placeholder="Type your team-wide message..."
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>Sending to 12 team members</span>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAnnouncementOpen(false)}>Cancel</Button>
                  <Button onClick={handleSendBroadcast}>
                    <Send className="h-4 w-4 mr-2" />
                    Send
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="flex-1 flex flex-col">
          {/* Clean Tab Navigation */}
          <div className="border-b bg-background/95 backdrop-blur-sm">
            <TabsList className="h-12 bg-transparent p-1 mx-4 mt-2">
              <TabsTrigger 
                value="messages" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Messages
              </TabsTrigger>
              <TabsTrigger 
                value="team" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all"
              >
                <Radio className="h-4 w-4 mr-2" />
                Broadcast
              </TabsTrigger>
              <TabsTrigger 
                value="video-meeting" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all"
              >
                <Video className="h-4 w-4 mr-2" />
                Video
              </TabsTrigger>
              <TabsTrigger 
                value="announcements" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all"
              >
                <Megaphone className="h-4 w-4 mr-2" />
                News
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Messages Tab - Improved Layout */}
          <TabsContent value="messages" className="flex-1 p-4 pt-2">
            <div className="grid grid-cols-12 gap-4 h-full">
              {/* Sidebar - Channels & Team */}
              <div className="col-span-3 space-y-4">
                {/* Channels */}
                <Card className="shadow-sm border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Hash className="h-4 w-4 text-primary" />
                      Channels
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {channels.map((channel) => (
                      <div
                        key={channel.id}
                        className={`p-3 cursor-pointer border-b last:border-b-0 hover:bg-muted/50 transition-colors ${
                          selectedChannel === channel.name.toLowerCase() ? 'bg-primary/5 border-r-2 border-r-primary' : ''
                        }`}
                        onClick={() => setSelectedChannel(channel.name.toLowerCase())}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${channel.active ? 'bg-success' : 'bg-muted-foreground'}`} />
                            <span className="text-sm font-medium">{channel.name}</span>
                          </div>
                          {channel.unread > 0 && (
                            <Badge variant="destructive" className="h-5 text-xs px-1.5">{channel.unread}</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 ml-4">{channel.members} members</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Team Members */}
                <Card className="shadow-sm border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      Team (8 online)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 max-h-48 overflow-y-auto">
                    {[
                      { name: 'Sarah Johnson', role: 'Head Chef', status: 'active' },
                      { name: 'Mike Rodriguez', role: 'Manager', status: 'active' },
                      { name: 'Emily Chen', role: 'Server', status: 'busy' },
                      { name: 'David Park', role: 'Line Cook', status: 'active' },
                      { name: 'Lisa Wong', role: 'Host', status: 'away' }
                    ].map((member, index) => (
                      <div key={index} className="p-2 flex items-center gap-2 hover:bg-muted/30 cursor-pointer">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs">{getInitials(member.name)}</AvatarFallback>
                        </Avatar>
                        <div className={`w-2 h-2 rounded-full ${
                          member.status === 'active' ? 'bg-success' :
                          member.status === 'busy' ? 'bg-warning' : 'bg-muted-foreground'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.role}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Chat Area */}
              <div className="col-span-6">
                <RealTimeChat 
                  selectedChannel={selectedChannel}
                  currentUserId={currentUserId}
                  onChannelChange={setSelectedChannel}
                />
              </div>

              {/* Right Panel - User Presence & Quick Info */}
              <div className="col-span-3 space-y-4">
                <UserPresence 
                  currentUserId={currentUserId}
                  onStartCall={handleStartCall}
                  onStartChat={handleStartChat}
                />
              </div>
            </div>
          </TabsContent>

          {/* Enhanced Video Meeting Tab */}
          <TabsContent value="video-meeting" className="flex-1 p-4 pt-2">
            <div className="grid grid-cols-12 gap-6 h-full">
              <div className="col-span-8">
                <EnhancedVideoCall 
                  roomName="restaurant-team-meeting"
                  userName={`User_${currentUserId.slice(-3)}`}
                  onCallEnd={() => toast({ title: "Call Ended", description: "Thanks for joining!" })}
                />
              </div>
              <div className="col-span-4">
                <RealtimeCollaboration 
                  organizationId="demo-org-123"
                  currentPage="communications"
                />
              </div>
            </div>
          </TabsContent>

          {/* Other tabs content remains similar but more compact */}
          <TabsContent value="team" className="flex-1 p-4 pt-2">
            <div className="text-center py-12">
              <Radio className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">Team Broadcast Center</h3>
              <p className="text-muted-foreground mb-4">Send messages to all team members</p>
              <Button>Send Broadcast</Button>
            </div>
          </TabsContent>

          <TabsContent value="channels" className="flex-1 p-4 pt-2">
            <div className="text-center py-12">
              <Hash className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">Channel Management</h3>
              <p className="text-muted-foreground mb-4">Create and manage team channels</p>
              <Button>Create Channel</Button>
            </div>
          </TabsContent>

          <TabsContent value="announcements" className="flex-1 p-4 pt-2">
            <div className="text-center py-12">
              <Megaphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">Announcements</h3>
              <p className="text-muted-foreground mb-4">Company-wide announcements</p>
              <Button>New Announcement</Button>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="flex-1 p-4 pt-2">
            <div className="text-center py-12">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">Notification Center</h3>
              <p className="text-muted-foreground mb-4">Manage your notification preferences</p>
              <Button>Configure Notifications</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Video Call Component */}
      <VideoCall 
        isOpen={isVideoCallOpen}
        onClose={() => {
          setIsVideoCallOpen(false);
          setVideoCallRecipient(null);
          setCurrentCallId(null);
        }}
        recipientId={videoCallRecipient?.id}
        recipientName={videoCallRecipient?.name}
        callId={currentCallId}
        isIncoming={false}
      />
    </div>
  );
}