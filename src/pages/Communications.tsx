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
    <div className="h-screen bg-gradient-to-br from-background via-background/95 to-muted/5 flex flex-col">
      {/* Enhanced Header */}
      <div className="border-b bg-card/95 backdrop-blur-md shadow-soft">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  Communications Hub
                </h1>
                <div className="flex items-center gap-3">
                  <p className="text-sm text-muted-foreground">Team collaboration</p>
                  <div className="w-1 h-1 rounded-full bg-muted-foreground/50"></div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                    <span className="text-sm font-medium text-success">8 online</span>
                  </div>
                </div>
              </div>
              <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20">
                <div className="w-2.5 h-2.5 rounded-full bg-success"></div>
                <span className="text-xs font-medium text-success">System Healthy</span>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => handleStartCall('2', 'audio')}
                className="hover:bg-accent/10 hover:text-accent-foreground transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span className="sr-only">Start audio call</span>
              </Button>
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => handleStartCall('2', 'video')}
                className="hover:bg-accent/10 hover:text-accent-foreground transition-colors"
              >
                <Video className="h-4 w-4" />
                <span className="sr-only">Start video call</span>
              </Button>
              <Dialog open={isAnnouncementOpen} onOpenChange={setIsAnnouncementOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-gradient-primary hover:shadow-medium transition-all">
                    <Plus className="h-4 w-4 mr-2" />
                    Broadcast
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-xl bg-card border-border shadow-strong">
                  <DialogHeader className="space-y-2">
                    <DialogTitle className="flex items-center gap-3 text-xl">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Radio className="h-5 w-5 text-primary" />
                      </div>
                      Team Broadcast
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6 py-4">
                    <Select value={broadcastType} onValueChange={setBroadcastType}>
                      <SelectTrigger className="bg-muted/30 border-border/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="z-50 bg-card border border-border shadow-strong">
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
                      className="min-h-[120px] bg-muted/30 border-border/50 focus:border-primary/50 transition-colors resize-none"
                    />
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 text-sm text-muted-foreground">
                      <Users className="h-4 w-4 text-primary" />
                      <span>Sending to <strong className="text-foreground">12 team members</strong></span>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
                    <Button variant="outline" onClick={() => setIsAnnouncementOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSendBroadcast} className="bg-gradient-primary hover:shadow-medium">
                      <Send className="h-4 w-4 mr-2" />
                      Send Broadcast
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="flex-1 flex flex-col">
          {/* Enhanced Tab Navigation */}
          <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
            <div className="px-6 py-2">
              <TabsList className="h-11 bg-muted/30 p-1 rounded-lg shadow-soft border border-border/30">
                <TabsTrigger 
                  value="messages" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-soft transition-all font-medium px-4"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Messages
                </TabsTrigger>
                <TabsTrigger 
                  value="meetings" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-soft transition-all font-medium px-4"
                >
                  <Radio className="h-4 w-4 mr-2" />
                  Meetings
                </TabsTrigger>
                <TabsTrigger 
                  value="video-meeting" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-soft transition-all font-medium px-4"
                >
                  <Video className="h-4 w-4 mr-2" />
                  Video
                </TabsTrigger>
                <TabsTrigger 
                  value="announcements" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-soft transition-all font-medium px-4"
                >
                  <Megaphone className="h-4 w-4 mr-2" />
                  News
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          {/* Messages Tab - Enhanced Layout */}
          <TabsContent value="messages" className="flex-1 p-6 pt-4">
            <div className="grid grid-cols-12 gap-6 h-full">
              {/* Sidebar - Channels & Team */}
              <div className="col-span-3 space-y-4">
                {/* Channels */}
                <Card className="shadow-soft border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader className="pb-3 px-4 pt-4">
                    <CardTitle className="text-sm flex items-center gap-2 font-semibold">
                      <div className="p-1.5 rounded-md bg-primary/10">
                        <Hash className="h-3.5 w-3.5 text-primary" />
                      </div>
                      Channels
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {channels.map((channel) => (
                      <div
                        key={channel.id}
                        className={`p-3 cursor-pointer border-b border-border/30 last:border-b-0 hover:bg-accent/5 transition-colors ${
                          selectedChannel === channel.name.toLowerCase() 
                            ? 'bg-primary/10 border-r-2 border-r-primary shadow-sm' 
                            : ''
                        }`}
                        onClick={() => setSelectedChannel(channel.name.toLowerCase())}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-2.5 h-2.5 rounded-full ${
                              channel.active ? 'bg-success shadow-sm' : 'bg-muted-foreground/60'
                            }`} />
                            <span className="text-sm font-medium text-foreground">{channel.name}</span>
                          </div>
                          {channel.unread > 0 && (
                            <Badge variant="destructive" className="h-5 text-xs px-2 font-medium">
                              {channel.unread}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1.5 ml-5">
                          {channel.members} members
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Team Members */}
                <Card className="shadow-soft border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader className="pb-3 px-4 pt-4">
                    <CardTitle className="text-sm flex items-center gap-2 font-semibold">
                      <div className="p-1.5 rounded-md bg-success/10">
                        <Users className="h-3.5 w-3.5 text-success" />
                      </div>
                      Team
                      <Badge variant="secondary" className="ml-auto text-xs">8 online</Badge>
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
                      <div key={index} className="p-3 flex items-center gap-3 hover:bg-accent/5 cursor-pointer transition-colors border-b border-border/20 last:border-b-0">
                        <Avatar className="w-7 h-7 shadow-sm">
                          <AvatarFallback className="text-xs font-medium bg-gradient-primary text-primary-foreground">
                            {getInitials(member.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`w-2.5 h-2.5 rounded-full shadow-sm ${
                          member.status === 'active' ? 'bg-success' :
                          member.status === 'busy' ? 'bg-warning' : 'bg-muted-foreground/60'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate text-foreground">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.role}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Chat Area */}
              <div className="col-span-6">
                <div className="h-full rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm shadow-soft overflow-hidden">
                  <RealTimeChat 
                    selectedChannel={selectedChannel}
                    currentUserId={currentUserId}
                    onChannelChange={setSelectedChannel}
                  />
                </div>
              </div>

              {/* Right Panel - User Presence & Quick Info */}
              <div className="col-span-3 space-y-4">
                <div className="rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm shadow-soft overflow-hidden">
                  <UserPresence 
                    currentUserId={currentUserId}
                    onStartCall={handleStartCall}
                    onStartChat={handleStartChat}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Enhanced Video Meeting Tab */}
          <TabsContent value="video-meeting" className="flex-1 p-6 pt-4">
            <div className="grid grid-cols-12 gap-6 h-full">
              <div className="col-span-8">
                <div className="h-full rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm shadow-soft overflow-hidden">
                  <EnhancedVideoCall 
                    roomName="restaurant-team-meeting"
                    userName={`User_${currentUserId.slice(-3)}`}
                    onCallEnd={() => toast({ title: "Call Ended", description: "Thanks for joining!" })}
                  />
                </div>
              </div>
              <div className="col-span-4">
                <div className="h-full rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm shadow-soft overflow-hidden">
                  <RealtimeCollaboration 
                    organizationId="demo-org-123"
                    currentPage="communications"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* AI Meeting Recorder Tab */}
          <TabsContent value="meetings" className="flex-1 p-6 pt-4">
            <div className="h-full rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm shadow-soft overflow-hidden">
              <AIRecorder />
            </div>
          </TabsContent>

          {/* Enhanced Empty State Tabs */}
          <TabsContent value="announcements" className="flex-1 p-6 pt-4">
            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-md mx-auto space-y-4">
                <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto">
                  <Megaphone className="h-12 w-12 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">Company Announcements</h3>
                  <p className="text-muted-foreground">Important updates and news for the entire team</p>
                </div>
                <Button className="bg-gradient-primary hover:shadow-medium transition-all">
                  <Plus className="h-4 w-4 mr-2" />
                  New Announcement
                </Button>
              </div>
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