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
  const { toast } = useToast();

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
      {/* Compact Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gradient">Communications Hub</h1>
            <p className="text-sm text-muted-foreground">Real-time team collaboration</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="hover-scale">
              <Phone className="h-4 w-4 mr-1" />
              Call
            </Button>
            <Button size="sm" variant="outline" className="hover-scale">
              <Video className="h-4 w-4 mr-1" />
              Meet
            </Button>
            <Dialog open={isAnnouncementOpen} onOpenChange={setIsAnnouncementOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-gradient-primary hover-scale">
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
                    <SelectContent>
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

      {/* Main Content Area - Single Row Layout */}
      <div className="flex-1 flex overflow-hidden">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="flex-1 flex flex-col">
          {/* Compact Tab Navigation */}
          <TabsList className="grid grid-cols-5 w-full h-12 bg-muted/30 mx-4 mt-3 mb-0">
            <TabsTrigger value="messages" className="text-xs">
              <MessageSquare className="h-4 w-4 mr-1" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="team" className="text-xs">
              <Radio className="h-4 w-4 mr-1" />
              Broadcast
            </TabsTrigger>
            <TabsTrigger value="channels" className="text-xs">
              <Hash className="h-4 w-4 mr-1" />
              Channels
            </TabsTrigger>
            <TabsTrigger value="announcements" className="text-xs">
              <Megaphone className="h-4 w-4 mr-1" />
              News
            </TabsTrigger>
            <TabsTrigger value="notifications" className="text-xs">
              <Bell className="h-4 w-4 mr-1" />
              Alerts
            </TabsTrigger>
          </TabsList>

          {/* Messages Tab - Three Column Layout */}
          <TabsContent value="messages" className="flex-1 p-4 pt-2">
            <div className="grid grid-cols-12 gap-4 h-full">
              {/* Sidebar - Channels & Online Users */}
              <div className="col-span-3 space-y-4">
                {/* Channels */}
                <Card className="glass-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      Channels
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {channels.map((channel) => (
                      <div
                        key={channel.id}
                        className={`p-3 cursor-pointer border-b last:border-b-0 hover:bg-muted/50 transition-colors ${
                          selectedChannel === channel.name.toLowerCase() ? 'bg-primary/10 border-r-4 border-r-primary' : ''
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
                        <p className="text-xs text-muted-foreground mt-1">{channel.members} online</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Online Team Members */}
                <Card className="glass-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Online (8/12)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {[
                      { name: 'Sarah Johnson', role: 'Head Chef', status: 'active' },
                      { name: 'Mike Rodriguez', role: 'Manager', status: 'active' },
                      { name: 'Emily Chen', role: 'Server', status: 'busy' },
                      { name: 'David Park', role: 'Line Cook', status: 'active' },
                      { name: 'Lisa Wong', role: 'Host', status: 'away' }
                    ].map((member, index) => (
                      <div key={index} className="p-2 flex items-center gap-2 hover:bg-muted/30">
                        <div className={`w-2 h-2 rounded-full ${
                          member.status === 'active' ? 'bg-success' :
                          member.status === 'busy' ? 'bg-warning' : 'bg-muted-foreground'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{member.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{member.role}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Chat Area */}
              <div className="col-span-6">
                <Card className="h-full flex flex-col glass-card">
                  <CardHeader className="border-b bg-muted/10 pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Hash className="h-4 w-4" />
                        <span className="font-semibold capitalize">{selectedChannel}</span>
                        <Badge variant="outline" className="text-xs">Live</Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Pin className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Search className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.filter(m => m.channel === selectedChannel).map((message) => (
                      <div key={message.id} className="flex gap-3 group hover:bg-muted/20 p-2 rounded-lg -mx-2">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs bg-gradient-to-br from-primary/20 to-accent/20">
                            {getInitials(message.sender)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium">{message.sender}</span>
                            <Badge variant="outline" className="text-xs h-4">{message.role}</Badge>
                            <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                            {getPriorityBadge(message.priority)}
                          </div>
                          <p className="text-sm text-foreground">{message.message}</p>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Star className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="border-t p-4">
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <Textarea
                          placeholder={`Message #${selectedChannel}`}
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          className="min-h-[60px] pr-20 resize-none"
                        />
                        <div className="absolute bottom-2 right-2 flex gap-1">
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Paperclip className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Smile className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <Button size="sm" className="bg-gradient-primary self-end h-10">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Right Panel - Quick Info */}
              <div className="col-span-3 space-y-4">
                {/* Today's Activity */}
                <Card className="glass-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Today's Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Messages Sent</span>
                      <Badge variant="secondary">147</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Active Channels</span>
                      <Badge variant="secondary">4</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Team Online</span>
                      <Badge className="bg-success">8/12</Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="glass-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Share Document
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Video className="h-4 w-4 mr-2" />
                      Start Meeting
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Archive className="h-4 w-4 mr-2" />
                      Archive Channel
                    </Button>
                  </CardContent>
                </Card>

                {/* Recent Broadcasts */}
                <Card className="glass-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Recent Broadcasts</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {teamBroadcasts.slice(0, 3).map((broadcast) => (
                      <div key={broadcast.id} className="p-2 rounded-lg bg-muted/30">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs">{getBroadcastTypeIcon(broadcast.type)}</span>
                          <span className="text-xs font-medium truncate">{broadcast.sender}</span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{broadcast.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{broadcast.timestamp}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
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
    </div>
  );
}