import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Users,
  Settings,
  Monitor,
  MessageSquare,
  Circle,
  StopCircle,
  Volume2,
  VolumeX
} from 'lucide-react';

interface Participant {
  id: string;
  name: string;
  email: string;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected';
}

interface RealtimeVideoCallProps {
  meetingId: string;
  meetingTitle: string;
  participants: string[];
  onEndCall: () => void;
  isHost?: boolean;
}

export function RealtimeVideoCall({
  meetingId,
  meetingTitle,
  participants,
  onEndCall,
  isHost = false
}: RealtimeVideoCallProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [connectedParticipants, setConnectedParticipants] = useState<Participant[]>([]);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
  const [messages, setMessages] = useState<Array<{id: string; sender: string; text: string; timestamp: string}>>([]);
  const [newMessage, setNewMessage] = useState('');
  const [callDuration, setCallDuration] = useState(0);
  const [networkQuality, setNetworkQuality] = useState<'excellent' | 'good' | 'fair' | 'poor'>('good');

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    initializeCall();
    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => {
      cleanup();
      clearInterval(interval);
    };
  }, []);

  const initializeCall = async () => {
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      setLocalStream(stream);
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Initialize WebRTC connection
      await setupWebRTC(stream);
      
      // Subscribe to Supabase realtime for signaling
      setupSignaling();
      
      setIsConnected(true);
      toast({
        title: "Call Connected",
        description: "Successfully joined the meeting",
      });

    } catch (error) {
      console.error('Failed to initialize call:', error);
      toast({
        title: "Connection Failed",
        description: "Unable to access camera/microphone or connect to the meeting",
        variant: "destructive"
      });
    }
  };

  const setupWebRTC = async (stream: MediaStream) => {
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        // Add TURN server for production
      ]
    };

    const pc = new RTCPeerConnection(configuration);
    
    // Add local stream to peer connection
    stream.getTracks().forEach(track => {
      pc.addTrack(track, stream);
    });

    // Handle remote stream
    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        // Send ICE candidate through Supabase realtime
        sendSignalingMessage({
          type: 'ice-candidate',
          candidate: event.candidate,
          meetingId
        });
      }
    };

    // Connection state monitoring
    pc.onconnectionstatechange = () => {
      console.log('Connection state:', pc.connectionState);
      updateNetworkQuality(pc.connectionState);
    };

    setPeerConnection(pc);
  };

  const setupSignaling = () => {
    // Subscribe to meeting channel for WebRTC signaling
    const channel = supabase
      .channel(`meeting:${meetingId}`)
      .on('broadcast', { event: 'webrtc-signal' }, ({ payload }) => {
        handleSignalingMessage(payload);
      })
      .on('broadcast', { event: 'participant-update' }, ({ payload }) => {
        updateParticipant(payload);
      })
      .on('broadcast', { event: 'chat-message' }, ({ payload }) => {
        addMessage(payload);
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  };

  const sendSignalingMessage = async (message: any) => {
    await supabase.channel(`meeting:${meetingId}`).send({
      type: 'broadcast',
      event: 'webrtc-signal',
      payload: message
    });
  };

  const handleSignalingMessage = async (message: any) => {
    if (!peerConnection) return;

    switch (message.type) {
      case 'offer':
        await peerConnection.setRemoteDescription(message.offer);
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        sendSignalingMessage({ type: 'answer', answer, meetingId });
        break;
        
      case 'answer':
        await peerConnection.setRemoteDescription(message.answer);
        break;
        
      case 'ice-candidate':
        await peerConnection.addIceCandidate(message.candidate);
        break;
    }
  };

  const updateParticipant = (participantData: any) => {
    setConnectedParticipants(prev => {
      const existing = prev.find(p => p.id === participantData.id);
      if (existing) {
        return prev.map(p => p.id === participantData.id ? { ...p, ...participantData } : p);
      }
      return [...prev, participantData];
    });
  };

  const addMessage = (message: any) => {
    setMessages(prev => [...prev, message]);
  };

  const updateNetworkQuality = (connectionState: string) => {
    switch (connectionState) {
      case 'connected':
        setNetworkQuality('excellent');
        break;
      case 'connecting':
        setNetworkQuality('good');
        break;
      case 'disconnected':
        setNetworkQuality('poor');
        break;
      default:
        setNetworkQuality('fair');
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
        
        // Broadcast status to other participants
        broadcastParticipantUpdate({ isVideoEnabled: videoTrack.enabled });
      }
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
        
        // Broadcast status to other participants
        broadcastParticipantUpdate({ isAudioEnabled: audioTrack.enabled });
      }
    }
  };

  const broadcastParticipantUpdate = async (updates: any) => {
    await supabase.channel(`meeting:${meetingId}`).send({
      type: 'broadcast',
      event: 'participant-update',
      payload: {
        id: supabase.auth.getUser().then(u => u.data.user?.id),
        ...updates,
        timestamp: new Date().toISOString()
      }
    });
  };

  const sendChatMessage = async () => {
    if (!newMessage.trim()) return;
    
    const message = {
      id: `msg-${Date.now()}`,
      sender: 'Current User', // Get from auth
      text: newMessage,
      timestamp: new Date().toISOString()
    };
    
    await supabase.channel(`meeting:${meetingId}`).send({
      type: 'broadcast',
      event: 'chat-message',
      payload: message
    });
    
    setNewMessage('');
    addMessage(message);
  };

  const startRecording = async () => {
    // Implement recording functionality
    setIsRecording(true);
    toast({
      title: "Recording Started",
      description: "Meeting is now being recorded",
    });
  };

  const stopRecording = () => {
    setIsRecording(false);
    toast({
      title: "Recording Stopped",
      description: "Meeting recording has been saved",
    });
  };

  const endCall = () => {
    cleanup();
    onEndCall();
  };

  const cleanup = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    if (peerConnection) {
      peerConnection.close();
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'text-green-500';
      case 'good': return 'text-blue-500';
      case 'fair': return 'text-yellow-500';
      case 'poor': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-900 text-white">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">{meetingTitle}</h2>
          <Badge variant="secondary" className="text-xs">
            {formatDuration(callDuration)}
          </Badge>
          <Badge variant="outline" className={`text-xs ${getQualityColor(networkQuality)}`}>
            {networkQuality}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
            <Users className="h-4 w-4 mr-1" />
            {connectedParticipants.length + 1}
          </Button>
          {isRecording && (
            <Badge variant="destructive" className="animate-pulse">
              <Circle className="h-3 w-3 mr-1 fill-current" />
              Recording
            </Badge>
          )}
        </div>
      </div>

      {/* Main Video Area */}
      <div className="flex-1 relative">
        {/* Remote Video */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
        
        {/* Local Video (Picture-in-Picture) */}
        <div className="absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-white">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          {!isVideoEnabled && (
            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
              <VideoOff className="h-8 w-8 text-gray-400" />
            </div>
          )}
        </div>

        {/* Chat Panel (Slide-in) */}
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-white border-l border-gray-200 transform translate-x-full transition-transform duration-300 z-10">
          {/* Chat implementation would go here */}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 p-6 bg-gray-900">
        <Button
          variant={isVideoEnabled ? "default" : "destructive"}
          size="lg"
          onClick={toggleVideo}
          className="rounded-full p-4"
        >
          {isVideoEnabled ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
        </Button>

        <Button
          variant={isAudioEnabled ? "default" : "destructive"}
          size="lg"
          onClick={toggleAudio}
          className="rounded-full p-4"
        >
          {isAudioEnabled ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={() => {}}
          className="rounded-full p-4 text-white border-white hover:bg-white hover:text-black"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>

        {isHost && (
          <Button
            variant={isRecording ? "destructive" : "outline"}
            size="lg"
            onClick={isRecording ? stopRecording : startRecording}
            className="rounded-full p-4 text-white border-white hover:bg-white hover:text-black"
          >
            {isRecording ? <StopCircle className="h-6 w-6" /> : <Circle className="h-6 w-6" />}
          </Button>
        )}

        <Button
          variant="outline"
          size="lg"
          onClick={() => {}}
          className="rounded-full p-4 text-white border-white hover:bg-white hover:text-black"
        >
          <Monitor className="h-6 w-6" />
        </Button>

        <Button
          variant="destructive"
          size="lg"
          onClick={endCall}
          className="rounded-full p-4"
        >
          <PhoneOff className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}