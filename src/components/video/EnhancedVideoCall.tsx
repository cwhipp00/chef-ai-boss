import { useState, useEffect, useRef } from 'react';
import DailyIframe, { DailyCall, DailyEvent } from '@daily-co/daily-js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  Users, 
  Settings, 
  Share,
  Monitor,
  MonitorOff
} from 'lucide-react';

interface Participant {
  session_id: string;
  user_name: string;
  audio: boolean;
  video: boolean;
  screen?: boolean;
  joined_at: string;
}

interface EnhancedVideoCallProps {
  roomName?: string;
  userName?: string;
  onCallEnd?: () => void;
}

export function EnhancedVideoCall({ 
  roomName = 'restaurant-meeting', 
  userName = 'User',
  onCallEnd 
}: EnhancedVideoCallProps) {
  const [callObject, setCallObject] = useState<DailyCall | null>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [localVideo, setLocalVideo] = useState(true);
  const [localAudio, setLocalAudio] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callStats, setCallStats] = useState<any>(null);
  
  const videoRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize Daily.co call object
    const daily = DailyIframe.createCallObject({
      iframeStyle: {
        position: 'relative',
        width: '100%',
        height: '400px',
        border: 'none',
        borderRadius: '8px'
      }
    });

    // Set up event listeners
    daily.on('joined-meeting', () => handleJoinedMeeting());
    daily.on('left-meeting', handleLeftMeeting);
    daily.on('participant-joined', (event: any) => handleParticipantJoined(event));
    daily.on('participant-left', (event: any) => handleParticipantLeft(event));
    daily.on('participant-updated', (event: any) => handleParticipantUpdated(event));
    daily.on('error', (event: any) => handleError(event));
    daily.on('network-quality-change', (event: any) => handleNetworkQualityChange(event));

    setCallObject(daily);

    return () => {
      if (daily) {
        daily.destroy();
      }
    };
  }, []);

  const handleJoinedMeeting = (event?: DailyEvent) => {
    console.log('Joined meeting:', event);
    setIsJoined(true);
    setIsConnecting(false);
    
    if (videoRef.current && callObject) {
      // Append the Daily iframe to our container
      callObject.iframe()?.then(iframe => {
        if (iframe && videoRef.current && !videoRef.current.contains(iframe)) {
          videoRef.current.appendChild(iframe);
        }
      });
    }

    toast({
      title: "Meeting Joined",
      description: "You've successfully joined the video call",
    });
    
    updateParticipants();
  };

  const handleLeftMeeting = () => {
    setIsJoined(false);
    setIsConnecting(false);
    setParticipants([]);
    onCallEnd?.();
    
    toast({
      title: "Call Ended",
      description: "You've left the video call",
    });
  };

  const handleParticipantJoined = (event: DailyEvent) => {
    console.log('Participant joined:', event);
    updateParticipants();
    
    toast({
      title: "Participant Joined",
      description: `${event.participant?.user_name || 'Someone'} joined the call`,
    });
  };

  const handleParticipantLeft = (event: DailyEvent) => {
    console.log('Participant left:', event);
    updateParticipants();
  };

  const handleParticipantUpdated = (event: DailyEvent) => {
    console.log('Participant updated:', event);
    updateParticipants();
  };

  const handleError = (event: DailyEvent) => {
    console.error('Daily.co error:', event);
    setIsConnecting(false);
    
    toast({
      title: "Video Call Error",
      description: event.errorMsg || "An error occurred during the video call",
      variant: "destructive"
    });
  };

  const handleNetworkQualityChange = (event: DailyEvent) => {
    setCallStats(event);
  };

  const updateParticipants = () => {
    if (!callObject) return;
    
    const currentParticipants = callObject.participants();
    const participantList: Participant[] = Object.values(currentParticipants).map(p => ({
      session_id: p.session_id,
      user_name: p.user_name || 'Unknown',
      audio: p.audio,
      video: p.video,
      screen: p.screen,
      joined_at: p.joined_at?.toISOString() || new Date().toISOString()
    }));
    
    setParticipants(participantList);
  };

  const joinCall = async () => {
    if (!callObject) return;
    
    setIsConnecting(true);
    
    try {
      // For demo purposes, we'll create a temporary room
      // In production, you'd get the room URL from your backend
      const roomUrl = `https://lovable.daily.co/${roomName}`;
      
      await callObject.join({
        url: roomUrl,
        userName: userName,
        videoSource: localVideo,
        audioSource: localAudio
      });
    } catch (error) {
      console.error('Error joining call:', error);
      setIsConnecting(false);
      
      toast({
        title: "Failed to Join Call",
        description: "Could not connect to the video call. Please try again.",
        variant: "destructive"
      });
    }
  };

  const leaveCall = async () => {
    if (!callObject) return;
    
    try {
      await callObject.leave();
    } catch (error) {
      console.error('Error leaving call:', error);
    }
  };

  const toggleVideo = async () => {
    if (!callObject) return;
    
    const newVideoState = !localVideo;
    await callObject.setLocalVideo(newVideoState);
    setLocalVideo(newVideoState);
  };

  const toggleAudio = async () => {
    if (!callObject) return;
    
    const newAudioState = !localAudio;
    await callObject.setLocalAudio(newAudioState);
    setLocalAudio(newAudioState);
  };

  const toggleScreenShare = async () => {
    if (!callObject) return;
    
    try {
      if (isScreenSharing) {
        await callObject.stopScreenShare();
        setIsScreenSharing(false);
      } else {
        await callObject.startScreenShare();
        setIsScreenSharing(true);
      }
    } catch (error) {
      console.error('Screen share error:', error);
      toast({
        title: "Screen Share Error",
        description: "Could not start screen sharing",
        variant: "destructive"
      });
    }
  };

  const getNetworkQuality = () => {
    if (!callStats?.quality) return 'Unknown';
    
    const quality = callStats.quality;
    if (quality > 80) return 'Excellent';
    if (quality > 60) return 'Good';
    if (quality > 40) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="space-y-4">
      {/* Video Container */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Restaurant Team Meeting
            </CardTitle>
            <div className="flex items-center gap-2">
              {callStats && (
                <Badge variant="outline" className="text-xs">
                  {getNetworkQuality()}
                </Badge>
              )}
              <Badge variant={isJoined ? "default" : "secondary"}>
                {isJoined ? "Connected" : "Disconnected"}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div 
            ref={videoRef} 
            className="w-full h-96 bg-muted flex items-center justify-center relative"
          >
            {!isJoined && !isConnecting && (
              <div className="text-center space-y-4">
                <Video className="h-16 w-16 mx-auto text-muted-foreground" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">Ready to Start Video Call</h3>
                  <p className="text-muted-foreground text-sm">
                    Connect with your team for meetings, training, or collaboration
                  </p>
                </div>
              </div>
            )}
            
            {isConnecting && (
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground">Connecting to meeting...</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {!isJoined ? (
                <Button 
                  onClick={joinCall} 
                  disabled={isConnecting}
                  className="bg-gradient-primary"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  {isConnecting ? 'Connecting...' : 'Join Call'}
                </Button>
              ) : (
                <>
                  <Button
                    variant={localVideo ? "default" : "secondary"}
                    size="sm"
                    onClick={toggleVideo}
                  >
                    {localVideo ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                  </Button>
                  
                  <Button
                    variant={localAudio ? "default" : "secondary"}
                    size="sm"
                    onClick={toggleAudio}
                  >
                    {localAudio ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                  </Button>
                  
                  <Button
                    variant={isScreenSharing ? "default" : "outline"}
                    size="sm"
                    onClick={toggleScreenShare}
                  >
                    {isScreenSharing ? <MonitorOff className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
                  </Button>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={leaveCall}
                  >
                    <PhoneOff className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>

            {/* Participants Count */}
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {participants.length} participant{participants.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Participants List */}
      {participants.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Participants</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {participants.map((participant) => (
              <div key={participant.session_id} className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">{participant.user_name}</span>
                </div>
                <div className="flex items-center gap-1">
                  {participant.video ? (
                    <Video className="h-3 w-3 text-success" />
                  ) : (
                    <VideoOff className="h-3 w-3 text-muted-foreground" />
                  )}
                  {participant.audio ? (
                    <Mic className="h-3 w-3 text-success" />
                  ) : (
                    <MicOff className="h-3 w-3 text-muted-foreground" />
                  )}
                  {participant.screen && (
                    <Share className="h-3 w-3 text-primary" />
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}