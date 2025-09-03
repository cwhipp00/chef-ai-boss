import { useState } from 'react';
import { Send, Users, MessageSquare, Bell, Search, Filter, Plus, Megaphone, Clock, CheckCircle, AlertTriangle, Radio, UserCheck, Phone, Video, Mail, FileText, Archive, Star, Paperclip, Smile, MoreHorizontal, Pin, Hash, Settings, Mic, MicOff, VideoOff, ScreenShare, Volume2, Minimize2, Maximize2 } from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
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
    <div className="h-screen bg-gradient-to-br from-background to-muted/5 flex">
      {/* Modern Sidebar */}
      <div className="w-80 border-r border-border/50 bg-card/30 backdrop-blur-sm flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-border/30">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-foreground">Communications</h1>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <Search className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search channels, people..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-muted/30 border-border/30 focus:border-primary/50 transition-colors"
            />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="p-2 border-b border-border/30">
          <div className="grid grid-cols-4 gap-1 p-1 bg-muted/20 rounded-lg">
            <Button
              size="sm"
              variant={selectedTab === 'messages' ? 'default' : 'ghost'}
              onClick={() => setSelectedTab('messages')}
              className="text-xs"
            >
              <MessageSquare className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="sm"
              variant={selectedTab === 'meetings' ? 'default' : 'ghost'}
              onClick={() => setSelectedTab('meetings')}
              className="text-xs"
            >
              <Radio className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="sm"
              variant={selectedTab === 'video-meeting' ? 'default' : 'ghost'}
              onClick={() => setSelectedTab('video-meeting')}
              className="text-xs"
            >
              <Video className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="sm"
              variant={selectedTab === 'announcements' ? 'default' : 'ghost'}
              onClick={() => setSelectedTab('announcements')}
              className="text-xs"
            >
              <Megaphone className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {selectedTab === 'messages' && (
          <>
            {/* Channels Section */}
            <div className="flex-1 overflow-hidden flex flex-col">
              <div className="p-3 border-b border-border/20">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Hash className="h-4 w-4 text-primary" />
                    Channels
                  </h3>
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                </div>
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
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-2 h-2 rounded-full ${
                          channel.active ? 'bg-success' : 'bg-muted-foreground/40'
                        }`} />
                        <span className="text-sm font-medium truncate">{channel.name}</span>
                      </div>
                      {channel.unread > 0 && (
                        <Badge variant="destructive" className="h-5 text-xs px-1.5 min-w-[20px] justify-center">
                          {channel.unread}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Team Members Section */}
              <div className="flex-1 overflow-hidden">
                <div className="p-3 border-b border-border/20">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Users className="h-4 w-4 text-success" />
                      Team
                      <Badge variant="secondary" className="text-xs">8</Badge>
                    </h3>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowOnlineOnly(!showOnlineOnly)}
                      className={`h-6 text-xs px-2 ${
                        showOnlineOnly ? 'bg-success/10 text-success' : ''
                      }`}
                    >
                      Online
                    </Button>
                  </div>
                </div>
                
                <div className="overflow-y-auto flex-1 p-2">
                  <div className="space-y-1">
                    {[
                      { id: '1', name: 'Sarah Johnson', role: 'Head Chef', status: 'active', avatar: 'SJ' },
                      { id: '2', name: 'Mike Rodriguez', role: 'Manager', status: 'active', avatar: 'MR' },
                      { id: '3', name: 'Emily Chen', role: 'Server', status: 'busy', avatar: 'EC' },
                      { id: '4', name: 'David Park', role: 'Line Cook', status: 'active', avatar: 'DP' },
                      { id: '5', name: 'Lisa Wong', role: 'Host', status: 'away', avatar: 'LW' },
                      { id: '6', name: 'Tom Wilson', role: 'Bartender', status: 'offline', avatar: 'TW' },
                    ]
                    .filter(member => !showOnlineOnly || member.status !== 'offline')
                    .map((member) => (
                      <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/5 cursor-pointer transition-colors group">
                        <div className="relative">
                          <Avatar className="w-8 h-8 shadow-sm">
                            <AvatarFallback className="text-xs font-medium bg-gradient-to-br from-primary/20 to-primary/5 text-foreground">
                              {member.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${
                            member.status === 'active' ? 'bg-success' :
                            member.status === 'busy' ? 'bg-warning' :
                            member.status === 'away' ? 'bg-muted-foreground' : 'bg-muted-foreground/40'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate text-foreground">{member.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{member.role}</p>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={() => handleStartChat(member.id)}
                          >
                            <MessageSquare className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={() => handleStartCall(member.id, 'video')}
                          >
                            <Video className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-3 border-t border-border/20">
              <div className="flex gap-2">
                <Dialog open={isAnnouncementOpen} onOpenChange={setIsAnnouncementOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="flex-1 bg-gradient-primary hover:shadow-medium transition-all">
                      <Radio className="h-3.5 w-3.5 mr-2" />
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
                <Button size="sm" variant="outline" onClick={() => handleStartCall('2', 'video')}>
                  <Video className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </>
        )}

        {selectedTab === 'meetings' && (
          <div className="flex-1 p-4 flex items-center justify-center">
            <div className="text-center space-y-4 max-w-sm">
              <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto">
                <Radio className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">AI Meeting Recorder</h3>
                <p className="text-sm text-muted-foreground">Record and transcribe meetings with automatic action items</p>
              </div>
              <Button size="sm" className="bg-gradient-primary">Start Recording</Button>
            </div>
          </div>
        )}

        {selectedTab === 'video-meeting' && (
          <div className="flex-1 p-4 flex items-center justify-center">
            <div className="text-center space-y-4 max-w-sm">
              <div className="p-4 rounded-full bg-accent/10 w-fit mx-auto">
                <Video className="h-8 w-8 text-accent" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">Video Conference</h3>
                <p className="text-sm text-muted-foreground">Start or join team video meetings</p>
              </div>
              <Button size="sm" className="bg-gradient-primary">Join Meeting</Button>
            </div>
          </div>
        )}

        {selectedTab === 'announcements' && (
          <div className="flex-1 p-4 flex items-center justify-center">
            <div className="text-center space-y-4 max-w-sm">
              <div className="p-4 rounded-full bg-warning/10 w-fit mx-auto">
                <Megaphone className="h-8 w-8 text-warning" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">Announcements</h3>
                <p className="text-sm text-muted-foreground">Company-wide updates and important news</p>
              </div>
              <Button size="sm" className="bg-gradient-primary">View All</Button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area - Dynamic Based on Tab */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedTab === 'messages' && (
          <div className="flex-1 flex">
            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-background/50">
              {/* Chat Header */}
              <div className="p-4 border-b border-border/50 bg-card/30 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Hash className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-foreground capitalize">{selectedChannel}</h2>
                      <p className="text-sm text-muted-foreground">
                        {channels.find(c => c.name.toLowerCase() === selectedChannel)?.members || 0} members
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Pin className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Chat Messages Area */}
              <div className="flex-1 overflow-hidden">
                <RealTimeChat 
                  selectedChannel={selectedChannel}
                  currentUserId={currentUserId}
                  onChannelChange={setSelectedChannel}
                />
              </div>
            </div>

            {/* Right Panel - User Presence */}
            <div className="w-72 border-l border-border/50 bg-card/20 backdrop-blur-sm">
              <UserPresence 
                currentUserId={currentUserId}
                onStartCall={handleStartCall}
                onStartChat={handleStartChat}
              />
            </div>
          </div>
        )}

        {selectedTab === 'meetings' && (
          <div className="flex-1 bg-background/50">
            <AIRecorder />
          </div>
        )}

        {selectedTab === 'video-meeting' && (
          <div className="flex-1 p-6 bg-background/50">
            <div className="grid grid-cols-12 gap-6 h-full">
              <div className="col-span-8">
                <div className="h-full rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm shadow-strong overflow-hidden">
                  <EnhancedVideoCall 
                    roomName="restaurant-team-meeting"
                    userName={`User_${currentUserId.slice(-3)}`}
                    onCallEnd={() => toast({ title: "Call Ended", description: "Thanks for joining!" })}
                  />
                </div>
              </div>
              <div className="col-span-4">
                <div className="h-full rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm shadow-strong overflow-hidden">
                  <RealtimeCollaboration 
                    organizationId="demo-org-123"
                    currentPage="communications"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'announcements' && (
          <div className="flex-1 bg-background/50 flex items-center justify-center">
            <div className="text-center max-w-md mx-auto space-y-6 p-8">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-warning/10 to-warning/5 w-fit mx-auto">
                <Megaphone className="h-16 w-16 text-warning" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-foreground">Company Announcements</h3>
                <p className="text-muted-foreground">Stay updated with important company news and updates</p>
              </div>
              <div className="space-y-3">
                <Button className="bg-gradient-primary hover:shadow-medium transition-all w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Announcement
                </Button>
                <Button variant="outline" className="w-full">
                  View All Announcements
                </Button>
              </div>
            </div>
          </div>
        )}
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