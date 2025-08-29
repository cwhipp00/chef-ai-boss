import { useState } from 'react';
import { Send, Users, MessageSquare, Bell, Search, Filter, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

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

export default function Communications() {
  const [selectedChannel, setSelectedChannel] = useState('general');
  const [newMessage, setNewMessage] = useState('');
  const [selectedTab, setSelectedTab] = useState('messages');

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

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Communications</h1>
          <p className="text-muted-foreground">Team messaging and announcements</p>
        </div>
        <Button size="lg" className="bg-gradient-primary">
          <Plus className="h-4 w-4 mr-2" />
          New Announcement
        </Button>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="channels">Channels</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="messages" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Active Channels
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {channels.map((channel) => (
                    <div
                      key={channel.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedChannel === channel.name.toLowerCase()
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                      onClick={() => setSelectedChannel(channel.name.toLowerCase())}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${channel.active ? 'bg-success' : 'bg-muted-foreground'}`} />
                          <span className="font-medium">{channel.name}</span>
                        </div>
                        {channel.unread > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {channel.unread}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{channel.members} members</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="capitalize">#{selectedChannel}</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <Search className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-96 overflow-y-auto space-y-4 border rounded-lg p-4">
                  {messages.filter(m => m.channel === selectedChannel).map((message) => (
                    <div key={message.id} className={`p-3 border-l-4 rounded ${getPriorityColor(message.priority)}`}>
                      <div className="flex items-start gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs">
                            {getInitials(message.sender)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{message.sender}</span>
                            <span className="text-xs text-muted-foreground">{message.role}</span>
                            <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                            {getPriorityBadge(message.priority)}
                          </div>
                          <p className="text-sm">{message.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="min-h-[60px]"
                  />
                  <Button size="lg" className="bg-gradient-primary">
                    <Send className="h-4 w-4" />
                  </Button>
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