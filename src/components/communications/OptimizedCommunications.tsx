import { useState, useMemo, useCallback, memo } from 'react';
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

// Static data - moved outside component to prevent re-creation
const MESSAGES = [
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

const CHANNELS = [
  { id: 1, name: "General", members: 12, unread: 3, active: true },
  { id: 2, name: "Kitchen", members: 8, unread: 1, active: true },
  { id: 3, name: "Service", members: 6, unread: 2, active: true },
  { id: 4, name: "Management", members: 4, unread: 0, active: false }
];

const ANNOUNCEMENTS = [
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

const TEAM_BROADCASTS = [
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

const TEAM_MEMBERS = [
  { id: '1', name: 'Sarah Johnson', role: 'Head Chef', avatar: undefined, status: 'active' },
  { id: '2', name: 'Mike Rodriguez', role: 'Manager', avatar: undefined, status: 'active' },
  { id: '3', name: 'Emily Chen', role: 'Server', avatar: undefined, status: 'busy' },
  { id: '4', name: 'David Park', role: 'Line Cook', avatar: undefined, status: 'active' },
  { id: '5', name: 'Lisa Wong', role: 'Host', avatar: undefined, status: 'away' },
];

// Memoized components
const QuickActionCard = memo(({ title, description, icon: Icon, gradient, stats, onClick }: any) => (
  <Card className={`hover-lift cursor-pointer ${gradient} transition-all`} onClick={onClick}>
    <CardContent className="p-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-lg text-white">{title}</h3>
          <p className="text-sm text-white/80">{description}</p>
        </div>
      </div>
      {stats && (
        <div className="flex justify-between items-center text-sm text-white/90">
          <span>{stats.left}</span>
          {stats.right && <Badge variant="secondary">{stats.right}</Badge>}
        </div>
      )}
    </CardContent>
  </Card>
));

const TeamMemberItem = memo(({ member, onStartChat, onStartCall }: any) => {
  const getInitials = useCallback((name: string) => 
    name.split(' ').map(n => n[0]).join(''), []
  );

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
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
        <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => onStartChat(member.id)}>
          <MessageSquare className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => onStartCall(member.id, 'video')}>
          <Video className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
});

const BroadcastItem = memo(({ broadcast, getBroadcastTypeColor }: any) => (
  <div className={`p-3 rounded-lg border-l-4 ${getBroadcastTypeColor(broadcast.type)}`}>
    <div className="flex items-start justify-between mb-2">
      <span className="text-xs font-medium text-muted-foreground">{broadcast.sender}</span>
      <span className="text-xs text-muted-foreground">{broadcast.timestamp}</span>
    </div>
    <p className="text-sm text-foreground line-clamp-2">{broadcast.message}</p>
  </div>
));

export default function OptimizedCommunications() {
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
  
  const currentUserId = 'current_user_123';

  // Memoized handlers
  const handleStartCall = useCallback((userId: string, type: 'audio' | 'video') => {
    const recipient = TEAM_MEMBERS.find(member => member.id === userId);
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
  }, [toast]);

  const handleStartChat = useCallback((userId: string) => {
    const recipient = TEAM_MEMBERS.find(member => member.id === userId);
    if (recipient) {
      setSelectedChannel('general');
      setSelectedView('chat');
      
      toast({
        title: "Opening Chat",
        description: `Starting conversation with ${recipient.name}`,
      });
    }
  }, [toast]);

  // Memoized utility functions
  const getPriorityColor = useCallback((priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-l-destructive bg-destructive/5';
      case 'high': return 'border-l-warning bg-warning/5';
      case 'normal': return 'border-l-primary bg-primary/5';
      default: return 'border-l-muted';
    }
  }, []);

  const getPriorityBadge = useCallback((priority: string) => {
    switch (priority) {
      case 'urgent': return <Badge variant="destructive">Urgent</Badge>;
      case 'high': return <Badge className="bg-warning text-warning-foreground">High</Badge>;
      case 'normal': return <Badge variant="secondary">Normal</Badge>;
      default: return null;
    }
  }, []);

  const getBroadcastTypeColor = useCallback((type: string) => {
    switch (type) {
      case 'celebration': return 'border-l-success bg-success/5';
      case 'urgent': return 'border-l-destructive bg-destructive/5';
      case 'policy': return 'border-l-accent bg-accent/5';
      case 'general': return 'border-l-primary bg-primary/5';
      default: return 'border-l-muted bg-muted/5';
    }
  }, []);

  const handleSendBroadcast = useCallback(() => {
    if (!broadcastMessage.trim()) return;
    
    toast({
      title: "Broadcast Sent",
      description: `Message sent to all ${12} team members`,
    });
    setBroadcastMessage('');
  }, [broadcastMessage, toast]);

  // Memoized filtered data
  const activeTeamMembers = useMemo(() => 
    TEAM_MEMBERS.filter(m => m.status === 'active'), []
  );

  const recentBroadcasts = useMemo(() => 
    TEAM_BROADCASTS.slice(0, 3), []
  );

  if (selectedView === 'dashboard') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/5">
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Team Communications</h1>
            <p className="text-muted-foreground">Connect with your team through chat, calls, and announcements</p>
          </div>

          {/* Quick Action Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <QuickActionCard
              title="Team Chat"
              description="Join conversations"
              icon={MessageSquare}
              gradient="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover:border-primary/40"
              stats={{ left: "4 active channels", right: "6 unread" }}
              onClick={() => setSelectedView('chat')}
            />

            <QuickActionCard
              title="Video Call"
              description="Start face-to-face meeting"
              icon={Video}
              gradient="bg-gradient-to-br from-success/5 to-success/10 border-success/20 hover:border-success/40"
              stats={{ 
                left: (
                  <span className="text-success flex items-center gap-2">
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                    {activeTeamMembers.length} online
                  </span>
                )
              }}
              onClick={() => setSelectedView('video-meeting')}
            />

            <QuickActionCard
              title="Announcements"
              description="Broadcast to team"
              icon={Megaphone}
              gradient="bg-gradient-to-br from-warning/5 to-warning/10 border-warning/20 hover:border-warning/40"
              stats={{ left: "2 recent posts" }}
              onClick={() => setSelectedView('announcements')}
            />
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
                  {TEAM_MEMBERS.map((member) => (
                    <TeamMemberItem
                      key={member.id}
                      member={member}
                      onStartChat={handleStartChat}
                      onStartCall={handleStartCall}
                    />
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
                  {recentBroadcasts.map((broadcast) => (
                    <BroadcastItem
                      key={broadcast.id}
                      broadcast={broadcast}
                      getBroadcastTypeColor={getBroadcastTypeColor}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Return other views (chat, video-meeting, announcements) with lazy loading
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/5">
      <div className="container mx-auto p-4">
        <Button onClick={() => setSelectedView('dashboard')} className="mb-4">
          ← Back to Dashboard
        </Button>
        <div className="text-center py-8">
          <p>Loading {selectedView}...</p>
        </div>
      </div>
    </div>
  );
}