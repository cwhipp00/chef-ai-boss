import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  Circle, 
  Phone, 
  Video, 
  MessageCircle, 
  MoreHorizontal,
  Clock,
  MapPin,
  Briefcase
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface UserStatus {
  user_id: string;
  name: string;
  avatar?: string;
  role: string;
  department: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  last_seen?: string;
  location?: string;
  activity?: string;
  is_available_for_calls: boolean;
  current_device?: string;
}

interface UserPresenceProps {
  currentUserId: string;
  onStartCall: (userId: string, type: 'audio' | 'video') => void;
  onStartChat: (userId: string) => void;
}

export function UserPresence({ currentUserId, onStartCall, onStartChat }: UserPresenceProps) {
  const [users, setUsers] = useState<UserStatus[]>([]);
  const [myStatus, setMyStatus] = useState<UserStatus['status']>('online');
  const [myActivity, setMyActivity] = useState<string>('');

  // Mock users data - replace with actual data from your backend
  const mockUsers: UserStatus[] = [
    {
      user_id: '1',
      name: 'Sarah Johnson',
      role: 'Head Chef',
      department: 'Kitchen',
      status: 'online',
      avatar: undefined,
      location: 'Main Kitchen',
      activity: 'Preparing lunch service',
      is_available_for_calls: true,
      current_device: 'Mobile App'
    },
    {
      user_id: '2',
      name: 'Mike Rodriguez',
      role: 'General Manager',
      department: 'Management',
      status: 'busy',
      avatar: undefined,
      location: 'Office',
      activity: 'In meeting with suppliers',
      is_available_for_calls: false,
      current_device: 'Desktop'
    },
    {
      user_id: '3',
      name: 'Emily Chen',
      role: 'Server',
      department: 'Front of House',
      status: 'online',
      avatar: undefined,
      location: 'Dining Room',
      activity: 'Serving customers',
      is_available_for_calls: true,
      current_device: 'Mobile App'
    },
    {
      user_id: '4',
      name: 'David Park',
      role: 'Line Cook',
      department: 'Kitchen',
      status: 'away',
      avatar: undefined,
      location: 'Break Room',
      activity: 'On break',
      is_available_for_calls: false,
      last_seen: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      current_device: 'Mobile App'
    },
    {
      user_id: '5',
      name: 'Lisa Wong',
      role: 'Host',
      department: 'Front of House',
      status: 'online',
      avatar: undefined,
      location: 'Reception',
      activity: 'Managing reservations',
      is_available_for_calls: true,
      current_device: 'Tablet'
    },
    {
      user_id: '6',
      name: 'James Miller',
      role: 'Sous Chef',
      department: 'Kitchen',
      status: 'offline',
      avatar: undefined,
      location: undefined,
      activity: undefined,
      is_available_for_calls: false,
      last_seen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      current_device: undefined
    }
  ];

  // Initialize with mock data
  useEffect(() => {
    setUsers(mockUsers.filter(user => user.user_id !== currentUserId));
  }, [currentUserId]);

  // Set up real-time presence tracking
  useEffect(() => {
    const channel = supabase.channel('user_presence');

    // Track current user's presence
    const trackPresence = async () => {
      const presenceData = {
        user_id: currentUserId,
        status: myStatus,
        activity: myActivity,
        timestamp: new Date().toISOString(),
        location: 'Restaurant', // This could be dynamic
        device: 'Web App'
      };

      await channel.track(presenceData);
    };

    // Listen for presence changes
    channel
      .on('presence', { event: 'sync' }, () => {
        const newState = channel.presenceState();
        console.log('Presence sync:', newState);
        
        // Update users list based on presence
        const onlineUsers = Object.entries(newState).map(([key, presence]: [string, any]) => {
          const user = presence[0];
          return {
            ...mockUsers.find(u => u.user_id === user.user_id),
            status: user.status,
            activity: user.activity,
            location: user.location,
            current_device: user.device
          };
        }).filter(user => user.user_id !== currentUserId);

        setUsers(prevUsers => {
          return prevUsers.map(user => {
            const onlineUser = onlineUsers.find(ou => ou.user_id === user.user_id);
            return onlineUser ? { ...user, ...onlineUser } : user;
          });
        });
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
        
        // Update user status to offline
        setUsers(prevUsers => 
          prevUsers.map(user => 
            leftPresences.some((p: any) => p.user_id === user.user_id)
              ? { ...user, status: 'offline' as const, last_seen: new Date().toISOString() }
              : user
          )
        );
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await trackPresence();
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId, myStatus, myActivity]);

  // Update presence when status or activity changes
  const updatePresence = async (newStatus: UserStatus['status'], newActivity?: string) => {
    setMyStatus(newStatus);
    if (newActivity !== undefined) {
      setMyActivity(newActivity);
    }

    const channel = supabase.channel('user_presence');
    await channel.track({
      user_id: currentUserId,
      status: newStatus,
      activity: newActivity || myActivity,
      timestamp: new Date().toISOString(),
      location: 'Restaurant',
      device: 'Web App'
    });
  };

  // Auto-detect user activity
  useEffect(() => {
    let inactivityTimer: NodeJS.Timeout;

    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      if (myStatus === 'away') {
        updatePresence('online');
      }
      
      inactivityTimer = setTimeout(() => {
        if (myStatus === 'online') {
          updatePresence('away', 'Away from keyboard');
        }
      }, 10 * 60 * 1000); // 10 minutes
    };

    // Listen for user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, resetInactivityTimer, { passive: true });
    });

    resetInactivityTimer();

    return () => {
      clearTimeout(inactivityTimer);
      events.forEach(event => {
        document.removeEventListener(event, resetInactivityTimer);
      });
    };
  }, [myStatus, myActivity]);

  // Get status color
  const getStatusColor = (status: UserStatus['status']) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'busy':
        return 'bg-red-500';
      case 'away':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Get status text
  const getStatusText = (status: UserStatus['status']) => {
    switch (status) {
      case 'online':
        return 'Online';
      case 'busy':
        return 'Busy';
      case 'away':
        return 'Away';
      case 'offline':
        return 'Offline';
      default:
        return 'Unknown';
    }
  };

  // Format last seen time
  const formatLastSeen = (lastSeen?: string) => {
    if (!lastSeen) return '';
    
    const now = new Date();
    const then = new Date(lastSeen);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return 'More than 24h ago';
  };

  return (
    <div className="space-y-4">
      {/* My Status */}
      <Card className="glass-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">My Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
                  ME
                </AvatarFallback>
              </Avatar>
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(myStatus)} rounded-full border-2 border-background`} />
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">You</p>
              <p className="text-xs text-muted-foreground">{getStatusText(myStatus)}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={myStatus === 'online' ? 'default' : 'outline'}
              size="sm"
              onClick={() => updatePresence('online')}
              className="justify-start"
            >
              <Circle className="h-3 w-3 mr-2 fill-green-500 text-green-500" />
              Online
            </Button>
            <Button
              variant={myStatus === 'busy' ? 'default' : 'outline'}
              size="sm"
              onClick={() => updatePresence('busy')}
              className="justify-start"
            >
              <Circle className="h-3 w-3 mr-2 fill-red-500 text-red-500" />
              Busy
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Team Members */}
      <Card className="glass-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            Team Members
            <Badge variant="secondary" className="text-xs">
              {users.filter(u => u.status === 'online').length}/{users.length} online
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 max-h-96 overflow-y-auto">
          {users.map((user) => (
            <div key={user.user_id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors">
              <div className="relative">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="text-xs bg-gradient-to-br from-primary/20 to-accent/20">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${getStatusColor(user.status)} rounded-full border border-background`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <Badge variant="outline" className="text-xs h-4">{user.role}</Badge>
                </div>
                
                <div className="text-xs text-muted-foreground space-y-0.5">
                  <div className="flex items-center gap-1">
                    <Circle className={`h-2 w-2 ${getStatusColor(user.status)} rounded-full`} />
                    <span>{getStatusText(user.status)}</span>
                    {user.status === 'offline' && user.last_seen && (
                      <span>• {formatLastSeen(user.last_seen)}</span>
                    )}
                  </div>
                  
                  {user.activity && user.status !== 'offline' && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-2 w-2" />
                      <span className="truncate">{user.activity}</span>
                    </div>
                  )}
                  
                  {user.location && user.status !== 'offline' && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-2 w-2" />
                      <span>{user.location}</span>
                    </div>
                  )}
                  
                  {user.current_device && user.status !== 'offline' && (
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-2 w-2" />
                      <span>{user.current_device}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Quick Actions */}
              {user.status !== 'offline' && (
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => onStartChat(user.user_id)}
                  >
                    <MessageCircle className="h-3 w-3" />
                  </Button>
                  
                  {user.is_available_for_calls && user.status !== 'busy' && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => onStartCall(user.user_id, 'audio')}
                      >
                        <Phone className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => onStartCall(user.user_id, 'video')}
                      >
                        <Video className="h-3 w-3" />
                      </Button>
                    </>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                  >
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}