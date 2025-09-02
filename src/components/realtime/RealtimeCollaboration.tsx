import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  MessageCircle, 
  Send, 
  Activity, 
  Clock,
  CheckCircle,
  AlertCircle,
  Eye
} from 'lucide-react';

interface RealtimeUser {
  user_id: string;
  display_name: string;
  status: 'online' | 'away' | 'busy';
  last_seen: string;
  current_page?: string;
}

interface RealtimeActivity {
  id: string;
  user_id: string;
  user_name: string;
  action: string;
  details: string;
  timestamp: string;
  type: 'document' | 'form' | 'system';
}

interface RealtimeCollaborationProps {
  organizationId: string;
  currentPage?: string;
}

export function RealtimeCollaboration({ 
  organizationId, 
  currentPage = 'dashboard' 
}: RealtimeCollaborationProps) {
  const [users, setUsers] = useState<RealtimeUser[]>([]);
  const [activities, setActivities] = useState<RealtimeActivity[]>([]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  
  const channelRef = useRef<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    initializeRealtime();
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [organizationId]);

  const initializeRealtime = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      // Create a channel for the organization
      const channel = supabase.channel(`org-${organizationId}`, {
        config: {
          presence: {
            key: user.user.id
          }
        }
      });

      channelRef.current = channel;

      // Track user presence
      channel
        .on('presence', { event: 'sync' }, () => {
          const presenceState = channel.presenceState();
          const onlineUsers: RealtimeUser[] = [];
          
          Object.keys(presenceState).forEach(userId => {
            const presences = presenceState[userId];
            if (presences && presences.length > 0) {
              const presence = presences[0] as any;
              onlineUsers.push({
                user_id: userId,
                display_name: presence?.display_name || 'Unknown User',
                status: presence?.status || 'online',
                last_seen: new Date().toISOString(),
                current_page: presence?.current_page
              });
            }
          });
          
          setUsers(onlineUsers);
        })
        .on('presence', { event: 'join' }, ({ newPresences }) => {
          console.log('User joined:', newPresences);
          newPresences.forEach(presence => {
            toast({
              title: "User Joined",
              description: `${presence.display_name || 'Someone'} joined the workspace`,
            });
          });
        })
        .on('presence', { event: 'leave' }, ({ leftPresences }) => {
          console.log('User left:', leftPresences);
        });

      // Listen to real-time messages
      channel.on('broadcast', { event: 'message' }, (payload) => {
        setMessages(prev => [...prev, payload.payload]);
      });

      // Listen to real-time activities
      channel.on('broadcast', { event: 'activity' }, (payload) => {
        setActivities(prev => [payload.payload, ...prev.slice(0, 49)]); // Keep last 50
      });

      // Subscribe to database changes for real-time updates
      channel
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'parsed_documents',
          filter: `organization_id=eq.${organizationId}`
        }, (payload) => {
          const activity: RealtimeActivity = {
            id: Date.now().toString(),
            user_id: payload.new.created_by,
            user_name: 'Someone', // Would need to join with profiles
            action: 'uploaded document',
            details: `New document processed: ${payload.new.target_category}`,
            timestamp: new Date().toISOString(),
            type: 'document'
          };
          setActivities(prev => [activity, ...prev]);
        })
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'form_submissions',
          filter: `form_id=in.(select id from dynamic_forms where organization_id = '${organizationId}')`
        }, (payload) => {
          const activity: RealtimeActivity = {
            id: Date.now().toString(),
            user_id: payload.new.submitted_by,
            user_name: 'Someone',
            action: 'submitted form',
            details: 'New form submission received',
            timestamp: new Date().toISOString(),
            type: 'form'
          };
          setActivities(prev => [activity, ...prev]);
        });

      // Subscribe and track presence
      await channel.subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          const { data: profile } = await supabase
            .from('profiles')
            .select('display_name')
            .eq('id', user.user.id)
            .single();

          await channel.track({
            user_id: user.user.id,
            display_name: profile?.display_name || 'Anonymous',
            status: 'online',
            current_page: currentPage,
            joined_at: new Date().toISOString()
          });

          setIsOnline(true);
        }
      });

    } catch (error) {
      console.error('Error initializing realtime:', error);
      setIsOnline(false);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || !channelRef.current) return;

    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return;

    const messageData = {
      id: Date.now().toString(),
      user_id: user.user.id,
      user_name: user.user.email?.split('@')[0] || 'Anonymous',
      message: message.trim(),
      timestamp: new Date().toISOString()
    };

    await channelRef.current.send({
      type: 'broadcast',
      event: 'message',
      payload: messageData
    });

    setMessage('');
  };

  const broadcastActivity = async (action: string, details: string, type: 'document' | 'form' | 'system' = 'system') => {
    if (!channelRef.current) return;

    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return;

    const activity: RealtimeActivity = {
      id: Date.now().toString(),
      user_id: user.user.id,
      user_name: user.user.email?.split('@')[0] || 'Anonymous',
      action,
      details,
      timestamp: new Date().toISOString(),
      type
    };

    await channelRef.current.send({
      type: 'broadcast',
      event: 'activity',
      payload: activity
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <div className="w-2 h-2 bg-green-500 rounded-full" />;
      case 'away': return <div className="w-2 h-2 bg-yellow-500 rounded-full" />;
      case 'busy': return <div className="w-2 h-2 bg-red-500 rounded-full" />;
      default: return <div className="w-2 h-2 bg-gray-400 rounded-full" />;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'document': return <CheckCircle className="h-4 w-4 text-primary" />;
      case 'form': return <AlertCircle className="h-4 w-4 text-success" />;
      default: return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Online Users */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Online Team Members
            <Badge variant={isOnline ? "default" : "secondary"}>
              {isOnline ? "Connected" : "Offline"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {users.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-4">
              No one else is online right now
            </p>
          ) : (
            users.map((user) => (
              <div key={user.user_id} className="flex items-center justify-between p-2 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {user.display_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{user.display_name}</p>
                    {user.current_page && (
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">{user.current_page}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(user.status)}
                  <Badge variant="outline" className="text-xs">
                    {user.status}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Real-time Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Live Activity Feed
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 max-h-80 overflow-y-auto">
          {activities.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground text-sm">No recent activity</p>
            </div>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-2 border rounded-lg">
                {getActivityIcon(activity.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user_name}</span> {activity.action}
                  </p>
                  <p className="text-xs text-muted-foreground">{activity.details}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {new Date(activity.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Quick Chat */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Team Chat
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-40 overflow-y-auto mb-4">
            {messages.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-4">
                No messages yet. Start a conversation!
              </p>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="flex items-start gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {msg.user_name[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{msg.user_name}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm">{msg.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1"
            />
            <Button onClick={sendMessage} disabled={!message.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}