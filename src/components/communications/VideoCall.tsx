import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  Monitor, 
  Settings,
  Users,
  MessageCircle,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Camera,
  CameraOff
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VideoCallProps {
  isOpen: boolean;
  onClose: () => void;
  recipientId?: string;
  recipientName?: string;
  callId?: string;
  isIncoming?: boolean;
}

interface CallParticipant {
  id: string;
  name: string;
  avatar?: string;
  stream?: MediaStream;
  isMuted: boolean;
  isVideoOff: boolean;
}

export function VideoCall({ isOpen, onClose, recipientId, recipientName, callId, isIncoming }: VideoCallProps) {
  const { toast } = useToast();
  
  // Video elements
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  
  // WebRTC
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  
  // State
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [participants, setParticipants] = useState<CallParticipant[]>([]);
  const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'ringing' | 'connected' | 'ended'>('idle');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor'>('excellent');

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
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
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

  // Create peer connection
  const createPeerConnection = () => {
    const pc = new RTCPeerConnection(iceServers);
    
    // Add local stream tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        pc.addTrack(track, localStreamRef.current!);
      });
    }

    // Handle remote stream
    pc.ontrack = (event) => {
      console.log('Received remote stream:', event);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('Sending ICE candidate:', event.candidate);
        sendSignalingMessage({
          type: 'ice-candidate',
          candidate: event.candidate,
          callId
        });
      }
    };

    // Connection state changes
    pc.onconnectionstatechange = () => {
      console.log('Connection state:', pc.connectionState);
      setIsConnected(pc.connectionState === 'connected');
      
      if (pc.connectionState === 'connected') {
        setCallStatus('connected');
        setIsConnecting(false);
      } else if (pc.connectionState === 'failed') {
        setCallStatus('ended');
        toast({
          title: "Connection Failed",
          description: "Unable to establish video connection.",
          variant: "destructive",
        });
      }
    };

    // Monitor connection quality
    pc.oniceconnectionstatechange = () => {
      if (pc.iceConnectionState === 'connected') {
        setConnectionQuality('excellent');
      } else if (pc.iceConnectionState === 'checking') {
        setConnectionQuality('good');
      } else if (pc.iceConnectionState === 'disconnected') {
        setConnectionQuality('poor');
      }
    };

    return pc;
  };

  // Mock signaling message (in real app, would use Supabase or WebSocket)
  const sendSignalingMessage = async (message: any) => {
    console.log('Sending signaling message:', message);
    // Mock implementation - in real app this would use Supabase realtime or WebSocket
  };

  // Start outgoing call
  const startCall = async () => {
    try {
      setIsConnecting(true);
      setCallStatus('calling');

      // Initialize media
      await initializeLocalMedia();
      
      // Create peer connection
      pcRef.current = createPeerConnection();
      
      // Create offer
      const offer = await pcRef.current.createOffer();
      await pcRef.current.setLocalDescription(offer);
      
      // Send offer
      await sendSignalingMessage({
        type: 'offer',
        offer: offer,
        callId
      });

      toast({
        title: "Calling...",
        description: `Calling ${recipientName}`,
      });

    } catch (error) {
      console.error('Error starting call:', error);
      setIsConnecting(false);
      setCallStatus('ended');
    }
  };

  // Answer incoming call
  const answerCall = async (offer: RTCSessionDescriptionInit) => {
    try {
      setIsConnecting(true);
      setCallStatus('connected');

      // Initialize media
      await initializeLocalMedia();
      
      // Create peer connection
      pcRef.current = createPeerConnection();
      
      // Set remote description
      await pcRef.current.setRemoteDescription(offer);
      
      // Create answer
      const answer = await pcRef.current.createAnswer();
      await pcRef.current.setLocalDescription(answer);
      
      // Send answer
      await sendSignalingMessage({
        type: 'answer',
        answer: answer,
        callId
      });

    } catch (error) {
      console.error('Error answering call:', error);
      endCall();
    }
  };

  // End call
  const endCall = useCallback(() => {
    // Close peer connection
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }

    // Stop local media
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }

    // Reset state
    setIsConnected(false);
    setIsConnecting(false);
    setCallStatus('ended');
    setCallDuration(0);
    
    // Send end signal
    sendSignalingMessage({
      type: 'call-ended',
      callId
    });

    toast({
      title: "Call Ended",
      description: `Call with ${recipientName} ended`,
    });

    onClose();
  }, [callId, recipientName, onClose]);

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
        
        // Replace video track in peer connection
        if (pcRef.current && localStreamRef.current) {
          const videoTrack = screenStream.getVideoTracks()[0];
          const sender = pcRef.current.getSenders().find(s => 
            s.track && s.track.kind === 'video'
          );
          if (sender) {
            await sender.replaceTrack(videoTrack);
          }
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

  // Mock signaling listener (in real app, would use Supabase realtime)
  useEffect(() => {
    if (!isOpen || !callId) return;

    console.log('Listening for call signals on call:', callId);
    // Mock implementation - in real app this would subscribe to Supabase realtime
    // or use WebSocket connections for signaling

    // Simulate automatic connection after delay for demo
    if (!isIncoming && callStatus === 'calling') {
      setTimeout(() => {
        setIsConnected(true);
        setCallStatus('connected');
        setIsConnecting(false);
        toast({
          title: "Connected",
          description: `Connected to ${recipientName}`,
        });
      }, 3000);
    }

    return () => {
      console.log('Cleanup call signaling listener');
    };
  }, [isOpen, callId, isIncoming, callStatus, recipientName, toast]);

  // Auto-start call for outgoing calls
  useEffect(() => {
    if (isOpen && !isIncoming && callStatus === 'idle') {
      startCall();
    }
  }, [isOpen, isIncoming]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      endCall();
    };
  }, [endCall]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${isFullscreen ? 'max-w-full w-screen h-screen' : 'max-w-4xl w-full h-[600px]'} p-0 bg-black text-white overflow-hidden`}>
        <div className="relative h-full flex flex-col">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-10 bg-black/50 backdrop-blur-sm p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                  {recipientName?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold">{recipientName}</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant={isConnected ? 'default' : 'secondary'} className="text-xs">
                      {callStatus === 'calling' && 'Calling...'}
                      {callStatus === 'ringing' && 'Ringing...'}
                      {callStatus === 'connected' && formatDuration(callDuration)}
                      {callStatus === 'ended' && 'Call Ended'}
                    </Badge>
                    <div className={`w-2 h-2 rounded-full ${
                      connectionQuality === 'excellent' ? 'bg-green-500' :
                      connectionQuality === 'good' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
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

          {/* Video Area */}
          <div className="flex-1 relative">
            {/* Remote Video */}
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            
            {/* Local Video (Picture-in-Picture) */}
            <div className="absolute bottom-20 right-4 w-48 h-36 bg-gray-900 rounded-lg overflow-hidden border-2 border-white/20">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {isVideoOff && (
                <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                  <CameraOff className="h-8 w-8 text-white/50" />
                </div>
              )}
            </div>
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
                variant="secondary"
                size="lg"
                className="w-14 h-14 rounded-full"
              >
                <MessageCircle className="h-6 w-6" />
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
      </DialogContent>
    </Dialog>
  );
}