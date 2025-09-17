import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  Monitor, 
  Users,
  MessageCircle,
  Settings,
  Maximize,
  Minimize,
  Camera,
  CameraOff,
  Volume2,
  VolumeX,
  UserPlus,
  Share2,
  Circle,
  MoreVertical
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CallParticipant {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  stream?: MediaStream;
  isMuted: boolean;
  isVideoOff: boolean;
  joinedAt: Date;
  role: 'host' | 'participant';
}

interface VideoCallManagerProps {
  isOpen: boolean;
  onClose: () => void;
  callId?: string;
  isHost?: boolean;
  meetingTitle?: string;
  scheduledParticipants?: string[];
}

export function EnhancedVideoCallManager({ 
  isOpen, 
  onClose, 
  callId, 
  isHost = false, 
  meetingTitle = "Video Conference",
  scheduledParticipants = []
}: VideoCallManagerProps) {
  const { toast } = useToast();
  
  // Video elements
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRefs = useRef<{ [key: string]: HTMLVideoElement }>({});
  
  // WebRTC
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnections = useRef<{ [key: string]: RTCPeerConnection }>({});
  
  // State
  const [participants, setParticipants] = useState<CallParticipant[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ id: string; sender: string; message: string; timestamp: Date }>>([]);
  const [showChat, setShowChat] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  // WebRTC Configuration
  const iceServers = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ]
  };

  // Initialize call duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isConnected) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isConnected]);

  // Format call duration
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Initialize local media
  const initializeLocalMedia = async (video = true, audio = true) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: video ? { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        } : false,
        audio: audio ? {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } : false
      });

      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      toast({
        title: "Camera/Microphone Error",
        description: "Unable to access camera or microphone. Please check permissions.",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Start call
  const startCall = async () => {
    try {
      setIsConnecting(true);
      
      // Initialize media
      await initializeLocalMedia();
      
      // Simulate connection for demo
      setTimeout(() => {
        setIsConnected(true);
        setIsConnecting(false);
        
        // Add mock participants if any scheduled
        if (scheduledParticipants.length > 0) {
          const mockParticipants: CallParticipant[] = scheduledParticipants.map((email, index) => ({
            id: `participant-${index}`,
            name: email.split('@')[0],
            email,
            isMuted: false,
            isVideoOff: false,
            joinedAt: new Date(),
            role: 'participant' as const
          }));
          setParticipants(mockParticipants);
        }
        
        toast({
          title: "Connected",
          description: `Joined ${meetingTitle}`,
        });
      }, 2000);

    } catch (error) {
      console.error('Error starting call:', error);
      setIsConnecting(false);
    }
  };

  // End call
  const endCall = useCallback(() => {
    // Close all peer connections
    Object.values(peerConnections.current).forEach(pc => pc.close());
    peerConnections.current = {};

    // Stop local media
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }

    // Stop recording if active
    if (isRecording && mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }

    // Reset state
    setIsConnected(false);
    setIsConnecting(false);
    setCallDuration(0);
    setParticipants([]);
    
    toast({
      title: "Call Ended",
      description: `Left ${meetingTitle}`,
    });

    onClose();
  }, [isRecording, mediaRecorder, meetingTitle, onClose]);

  // Toggle mute
  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  // Toggle video
  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  // Screen sharing
  const toggleScreenShare = async () => {
    try {
      if (isScreenSharing) {
        // Stop screen sharing, return to camera
        await initializeLocalMedia();
        setIsScreenSharing(false);
      } else {
        // Start screen sharing
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }
        
        localStreamRef.current = screenStream;
        setIsScreenSharing(true);

        // Handle screen share end
        screenStream.getVideoTracks()[0].addEventListener('ended', () => {
          toggleScreenShare();
        });
      }
    } catch (error) {
      console.error('Error toggling screen share:', error);
      toast({
        title: "Screen Share Error",
        description: "Unable to share screen.",
        variant: "destructive",
      });
    }
  };

  // Start/stop recording
  const toggleRecording = () => {
    if (isRecording) {
      if (mediaRecorder) {
        mediaRecorder.stop();
        setIsRecording(false);
        toast({
          title: "Recording Stopped",
          description: "Meeting recording has been saved.",
        });
      }
    } else {
      if (localStreamRef.current) {
        const recorder = new MediaRecorder(localStreamRef.current);
        recorder.start();
        setMediaRecorder(recorder);
        setIsRecording(true);
        toast({
          title: "Recording Started",
          description: "Meeting is now being recorded.",
        });
      }
    }
  };

  // Invite participant
  const inviteParticipant = async () => {
    if (!inviteEmail.trim()) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically send an email invitation via Supabase edge function
    toast({
      title: "Invitation Sent",
      description: `Meeting invitation sent to ${inviteEmail}`,
    });

    setInviteEmail('');
    setShowInviteDialog(false);
  };

  // Auto-start call when dialog opens
  useEffect(() => {
    if (isOpen && !isConnected && !isConnecting) {
      startCall();
    }
  }, [isOpen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      endCall();
    };
  }, [endCall]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${isFullscreen ? 'max-w-full w-screen h-screen' : 'max-w-6xl w-full h-[80vh]'} p-0 bg-black text-white overflow-hidden`}>
        <div className="relative h-full flex flex-col">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-10 bg-black/70 backdrop-blur-sm p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                  <Video className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">{meetingTitle}</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant={isConnected ? 'default' : 'secondary'} className="text-xs">
                      {isConnecting && 'Connecting...'}
                      {isConnected && formatDuration(callDuration)}
                      {!isConnected && !isConnecting && 'Disconnected'}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <Users className="h-3 w-3 mr-1" />
                      {participants.length + 1}
                    </Badge>
                    {isRecording && (
                      <Badge variant="destructive" className="text-xs animate-pulse">
                      <Circle className="h-3 w-3 mr-1" />
                      REC
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowChat(!showChat)}
                  className="text-white hover:bg-white/20"
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowInviteDialog(true)}
                  className="text-white hover:bg-white/20"
                >
                  <UserPlus className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="text-white hover:bg-white/20"
                >
                  {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Video Grid */}
          <div className="flex-1 grid grid-cols-2 gap-1 mt-16">
            {/* Main Video */}
            <div className="col-span-2 relative">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {isVideoOff && (
                <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                  <CameraOff className="h-16 w-16 text-white/50" />
                </div>
              )}
              {isScreenSharing && (
                <Badge className="absolute top-4 left-4 bg-primary">
                  <Monitor className="h-3 w-3 mr-1" />
                  Screen Share
                </Badge>
              )}
            </div>

            {/* Participant Videos */}
            {participants.map((participant) => (
              <div key={participant.id} className="relative bg-gray-900 rounded-lg overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                    {participant.name.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="absolute bottom-2 left-2">
                  <Badge variant="secondary" className="text-xs">
                    {participant.name}
                    {participant.isMuted && <MicOff className="h-3 w-3 ml-1" />}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
            <div className="flex items-center justify-center gap-4">
              <Button
                variant={isMuted ? 'destructive' : 'secondary'}
                size="lg"
                onClick={toggleMute}
                className="w-14 h-14 rounded-full"
              >
                {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
              </Button>

              <Button
                variant={isVideoOff ? 'destructive' : 'secondary'}
                size="lg"
                onClick={toggleVideo}
                className="w-14 h-14 rounded-full"
              >
                {isVideoOff ? <VideoOff className="h-6 w-6" /> : <Video className="h-6 w-6" />}
              </Button>

              <Button
                variant="destructive"
                size="lg"
                onClick={endCall}
                className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600"
              >
                <PhoneOff className="h-8 w-8" />
              </Button>

              <Button
                variant={isScreenSharing ? 'default' : 'secondary'}
                size="lg"
                onClick={toggleScreenShare}
                className="w-14 h-14 rounded-full"
              >
                <Monitor className="h-6 w-6" />
              </Button>

              <Button
                variant={isRecording ? 'destructive' : 'secondary'}
                size="lg"
                onClick={toggleRecording}
                className="w-14 h-14 rounded-full"
              >
                <Circle className="h-6 w-6" />
              </Button>
            </div>
          </div>

          {/* Connection Status */}
          {isConnecting && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-lg font-semibold">Connecting...</p>
              </div>
            </div>
          )}
        </div>

        {/* Invite Dialog */}
        <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Participant</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={inviteParticipant}>
                  Send Invitation
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
}