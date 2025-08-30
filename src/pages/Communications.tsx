import { useState } from 'react';
import { Send, Users, MessageSquare, Bell, Search, Filter, Plus, Megaphone, Clock, CheckCircle, AlertTriangle, Radio, UserCheck } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6 space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Communications Hub
          </h1>
          <p className="text-lg text-muted-foreground">Keep your team connected and informed</p>
        </div>
        <div className="flex gap-3">
          <Dialog open={isAnnouncementOpen} onOpenChange={setIsAnnouncementOpen}>
            <DialogTrigger asChild>
              <Button size="lg" variant="outline" className="hover-lift">
                <Megaphone className="h-4 w-4 mr-2" />
                Broadcast
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Radio className="h-5 w-5 text-primary" />
                  Send Team Broadcast
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="broadcast-type">Message Type</Label>
                  <Select value={broadcastType} onValueChange={setBroadcastType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Update</SelectItem>
                      <SelectItem value="urgent">Urgent Notice</SelectItem>
                      <SelectItem value="celebration">Celebration</SelectItem>
                      <SelectItem value="policy">Policy Update</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="broadcast-message">Message</Label>
                  <Textarea
                    id="broadcast-message"
                    placeholder="Type your team-wide message here..."
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>This message will be sent to all 12 team members</span>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAnnouncementOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSendBroadcast} className="bg-gradient-primary">
                  <Send className="h-4 w-4 mr-2" />
                  Send Broadcast
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button size="lg" className="bg-gradient-primary hover-scale glow-on-hover">
            <Plus className="h-4 w-4 mr-2" />
            New Announcement
          </Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-8">
        <TabsList className="grid w-full grid-cols-5 max-w-2xl mx-auto glass-card h-14">
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Messages
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2">
            <Radio className="h-4 w-4" />
            Team
          </TabsTrigger>
          <TabsTrigger value="channels" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Channels
          </TabsTrigger>
          <TabsTrigger value="announcements" className="flex items-center gap-2">
            <Megaphone className="h-4 w-4" />
            Announcements
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="messages" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <Card className="lg:col-span-1 glass-card hover-lift">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Active Channels
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {channels.map((channel) => (
                    <div
                      key={channel.id}
                      className={`p-4 cursor-pointer transition-all duration-200 hover-lift ${
                        selectedChannel === channel.name.toLowerCase()
                          ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg'
                          : 'hover:bg-muted/60 border-b border-border/50'
                      }`}
                      onClick={() => setSelectedChannel(channel.name.toLowerCase())}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full shadow-sm ${channel.active ? 'bg-success animate-pulse' : 'bg-muted-foreground'}`} />
                          <span className="font-semibold">{channel.name}</span>
                        </div>
                        {channel.unread > 0 && (
                          <Badge variant="destructive" className="animate-bounce shadow-sm">
                            {channel.unread}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs opacity-75 mt-2">{channel.members} members online</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-3 glass-card">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
                <div className="flex items-center justify-between">
                  <CardTitle className="capitalize flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    #{selectedChannel}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="hover-scale">
                      <Search className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="hover-scale">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="h-[500px] overflow-y-auto space-y-4 border rounded-xl p-6 bg-gradient-to-b from-card to-muted/20">
                  {messages.filter(m => m.channel === selectedChannel).map((message) => (
                    <div key={message.id} className={`p-4 border-l-4 rounded-xl shadow-sm hover-lift ${getPriorityColor(message.priority)}`}>
                      <div className="flex items-start gap-4">
                        <Avatar className="w-10 h-10 ring-2 ring-primary/20">
                          <AvatarFallback className="text-sm font-semibold bg-gradient-to-br from-primary to-accent text-white">
                            {getInitials(message.sender)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-semibold">{message.sender}</span>
                            <Badge variant="outline" className="text-xs">
                              {message.role}
                            </Badge>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {message.timestamp}
                            </span>
                            {getPriorityBadge(message.priority)}
                          </div>
                          <p className="text-sm leading-relaxed">{message.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <Textarea
                    placeholder="Type your message to the team..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="min-h-[80px] border-2 focus:border-primary/30"
                  />
                  <Button size="lg" className="bg-gradient-primary hover-scale glow-on-hover px-6">
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="team" className="space-y-8">
          <div className="space-y-6">
            {/* Team Broadcast Section */}
            <Card className="glass-card hover-lift">
              <CardHeader className="bg-gradient-to-r from-accent/10 to-primary/10">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Radio className="h-5 w-5 text-accent" />
                      Team Broadcast Center
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Send messages to all team members instantly
                    </p>
                  </div>
                  <Badge className="bg-success/10 text-success border-success/20">
                    12 members online
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Quick Broadcast</Label>
                      <Select value={broadcastType} onValueChange={setBroadcastType}>
                        <SelectTrigger className="border-2 hover:border-primary/30">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">💬 General Update</SelectItem>
                          <SelectItem value="urgent">⚠️ Urgent Notice</SelectItem>
                          <SelectItem value="celebration">🎉 Celebration</SelectItem>
                          <SelectItem value="policy">📋 Policy Update</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Type your team-wide message..."
                        value={broadcastMessage}
                        onChange={(e) => setBroadcastMessage(e.target.value)}
                        className="min-h-[120px] border-2 focus:border-primary/30"
                      />
                    </div>
                    <Button 
                      onClick={handleSendBroadcast} 
                      className="w-full bg-gradient-primary hover-scale glow-on-hover"
                      size="lg"
                    >
                      <Megaphone className="h-4 w-4 mr-2" />
                      Broadcast to All Staff
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-sm">Quick Actions</h3>
                    <div className="grid grid-cols-1 gap-3">
                      <Button variant="outline" className="justify-start hover-lift">
                        <Clock className="h-4 w-4 mr-2 text-accent" />
                        Schedule Shift Changes
                      </Button>
                      <Button variant="outline" className="justify-start hover-lift">
                        <AlertTriangle className="h-4 w-4 mr-2 text-warning" />
                        Emergency Alert
                      </Button>
                      <Button variant="outline" className="justify-start hover-lift">
                        <CheckCircle className="h-4 w-4 mr-2 text-success" />
                        Daily Checklist Reminder
                      </Button>
                      <Button variant="outline" className="justify-start hover-lift">
                        <UserCheck className="h-4 w-4 mr-2 text-primary" />
                        Staff Recognition
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Team Messages */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Recent Team Messages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamBroadcasts.map((broadcast) => (
                    <div key={broadcast.id} className={`p-6 border-l-4 rounded-xl hover-lift ${getBroadcastTypeColor(broadcast.type)}`}>
                      <div className="flex items-start gap-4">
                        <div className="text-2xl">{getBroadcastTypeIcon(broadcast.type)}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-semibold">{broadcast.sender}</span>
                            <Badge variant="outline" className="text-xs">
                              {broadcast.role}
                            </Badge>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {broadcast.timestamp}
                            </span>
                          </div>
                          <p className="text-sm leading-relaxed mb-3">{broadcast.message}</p>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <CheckCircle className="h-3 w-3 text-success" />
                              <span>Read by {broadcast.readBy}/{broadcast.totalStaff} staff members</span>
                            </div>
                            <div className="flex-1">
                              <div className="w-full bg-muted rounded-full h-1.5">
                                <div 
                                  className="bg-success h-1.5 rounded-full transition-all duration-500"
                                  style={{ width: `${(broadcast.readBy / broadcast.totalStaff) * 100}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="channels" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {channels.map((channel) => (
              <Card key={channel.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${channel.active ? 'bg-success' : 'bg-muted-foreground'}`} />
                      {channel.name}
                    </CardTitle>
                    {channel.unread > 0 && (
                      <Badge variant="destructive">{channel.unread}</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{channel.members} active members</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      View Channel
                    </Button>
                    <Button size="sm" className="flex-1">
                      Join
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="announcements" className="space-y-6">
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <Card key={announcement.id} className={getPriorityColor(announcement.priority)}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{announcement.title}</CardTitle>
                    {getPriorityBadge(announcement.priority)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>By {announcement.author}</span>
                    <span>•</span>
                    <span>{announcement.timestamp}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>{announcement.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">Notification Center</h3>
            <p className="text-muted-foreground mb-4">Manage your notification preferences</p>
            <Button>Configure Notifications</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}