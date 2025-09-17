import { useState, useRef, useCallback, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface VideoCallState {
  isConnected: boolean;
  isCallActive: boolean;
  localStream: MediaStream | null;
  remoteStreams: Map<string, MediaStream>;
  participants: string[];
  isMuted: boolean;
  isVideoOff: boolean;
  isScreenSharing: boolean;
}

interface SignalingMessage {
  type: string;
  roomId: string;
  userId: string;
  data?: any;
  targetUserId?: string;
  participantCount?: number;
  participants?: string[];
}

export const useVideoCall = (roomId: string, userId: string) => {
  const { toast } = useToast();
  
  const [state, setState] = useState<VideoCallState>({
    isConnected: false,
    isCallActive: false,
    localStream: null,
    remoteStreams: new Map(),
    participants: [],
    isMuted: false,
    isVideoOff: false,
    isScreenSharing: false
  });

  const wsRef = useRef<WebSocket | null>(null);
  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideosRef = useRef<Map<string, HTMLVideoElement>>(new Map());

  const pcConfig: RTCConfiguration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' }
    ]
  };

  const connectWebSocket = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    // Use the actual project URL - replace with your project ref
    const wsUrl = `wss://lfpnnlkjqpphstpcmcsi.functions.supabase.co/functions/v1/video-call-signaling`;
    
    console.log('Connecting to WebSocket:', wsUrl);
    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onopen = () => {
      console.log('WebSocket connected');
      setState(prev => ({ ...prev, isConnected: true }));
      
      // Join the room
      sendMessage({
        type: 'join',
        roomId,
        userId
      });
    };

    wsRef.current.onmessage = async (event) => {
      try {
        const message: SignalingMessage = JSON.parse(event.data);
        console.log('Received WebSocket message:', message.type);
        
        await handleSignalingMessage(message);
      } catch (error) {
        console.error('Error handling WebSocket message:', error);
      }
    };

    wsRef.current.onclose = () => {
      console.log('WebSocket disconnected');
      setState(prev => ({ ...prev, isConnected: false }));
      
      // Attempt to reconnect after 3 seconds
      setTimeout(() => {
        if (!wsRef.current || wsRef.current.readyState === WebSocket.CLOSED) {
          connectWebSocket();
        }
      }, 3000);
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to video call service",
        variant: "destructive",
      });
    };
  }, [roomId, userId, toast]);

  const sendMessage = useCallback((message: Partial<SignalingMessage>) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        roomId,
        userId,
        ...message
      }));
    }
  }, [roomId, userId]);

  const handleSignalingMessage = useCallback(async (message: SignalingMessage) => {
    switch (message.type) {
      case 'joined':
        console.log('Successfully joined room');
        break;

      case 'existing-participants':
        console.log('Existing participants:', message.participants);
        if (message.participants) {
          setState(prev => ({ ...prev, participants: message.participants || [] }));
          
          // Create peer connections for existing participants
          for (const participantId of message.participants) {
            await createPeerConnection(participantId, true);
          }
        }
        break;

      case 'user-joined':
        console.log('User joined:', message.userId);
        setState(prev => ({ 
          ...prev, 
          participants: [...prev.participants, message.userId] 
        }));
        
        // Create peer connection but don't initiate (they will)
        await createPeerConnection(message.userId, false);
        break;

      case 'user-left':
        console.log('User left:', message.userId);
        setState(prev => ({
          ...prev,
          participants: prev.participants.filter(p => p !== message.userId),
          remoteStreams: new Map([...prev.remoteStreams].filter(([key]) => key !== message.userId))
        }));
        
        // Clean up peer connection
        const pc = peerConnectionsRef.current.get(message.userId);
        if (pc) {
          pc.close();
          peerConnectionsRef.current.delete(message.userId);
        }
        break;

      case 'offer':
        await handleOffer(message.userId, message.data);
        break;

      case 'answer':
        await handleAnswer(message.userId, message.data);
        break;

      case 'ice-candidate':
        await handleIceCandidate(message.userId, message.data);
        break;

      default:
        console.log('Unknown message type:', message.type);
    }
  }, []);

  const createPeerConnection = useCallback(async (peerId: string, shouldCreateOffer: boolean) => {
    console.log(`Creating peer connection with ${peerId}, shouldCreateOffer: ${shouldCreateOffer}`);
    
    const pc = new RTCPeerConnection(pcConfig);
    peerConnectionsRef.current.set(peerId, pc);

    // Add local stream to peer connection
    if (state.localStream) {
      state.localStream.getTracks().forEach(track => {
        pc.addTrack(track, state.localStream!);
      });
    }

    // Handle remote stream
    pc.ontrack = (event) => {
      console.log('Received remote track from', peerId);
      const [remoteStream] = event.streams;
      
      setState(prev => ({
        ...prev,
        remoteStreams: new Map(prev.remoteStreams.set(peerId, remoteStream))
      }));
    };

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('Sending ICE candidate to', peerId);
        sendMessage({
          type: 'ice-candidate',
          targetUserId: peerId,
          data: event.candidate
        });
      }
    };

    // Handle connection state changes
    pc.onconnectionstatechange = () => {
      console.log(`Peer connection with ${peerId} state:`, pc.connectionState);
      
      if (pc.connectionState === 'failed') {
        // Restart ICE
        pc.restartIce();
      }
    };

    // Create offer if we should initiate
    if (shouldCreateOffer) {
      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        
        console.log('Sending offer to', peerId);
        sendMessage({
          type: 'offer',
          targetUserId: peerId,
          data: offer
        });
      } catch (error) {
        console.error('Error creating offer:', error);
      }
    }
  }, [state.localStream, sendMessage]);

  const handleOffer = useCallback(async (peerId: string, offer: RTCSessionDescriptionInit) => {
    console.log('Handling offer from', peerId);
    
    const pc = peerConnectionsRef.current.get(peerId);
    if (!pc) {
      console.error('No peer connection found for', peerId);
      return;
    }

    try {
      await pc.setRemoteDescription(offer);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      
      console.log('Sending answer to', peerId);
      sendMessage({
        type: 'answer',
        targetUserId: peerId,
        data: answer
      });
    } catch (error) {
      console.error('Error handling offer:', error);
    }
  }, [sendMessage]);

  const handleAnswer = useCallback(async (peerId: string, answer: RTCSessionDescriptionInit) => {
    console.log('Handling answer from', peerId);
    
    const pc = peerConnectionsRef.current.get(peerId);
    if (!pc) {
      console.error('No peer connection found for', peerId);
      return;
    }

    try {
      await pc.setRemoteDescription(answer);
    } catch (error) {
      console.error('Error handling answer:', error);
    }
  }, []);

  const handleIceCandidate = useCallback(async (peerId: string, candidate: RTCIceCandidateInit) => {
    console.log('Handling ICE candidate from', peerId);
    
    const pc = peerConnectionsRef.current.get(peerId);
    if (!pc) {
      console.error('No peer connection found for', peerId);
      return;
    }

    try {
      await pc.addIceCandidate(candidate);
    } catch (error) {
      console.error('Error adding ICE candidate:', error);
    }
  }, []);

  const startCall = useCallback(async () => {
    try {
      console.log('Starting video call...');
      
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      setState(prev => ({
        ...prev,
        localStream: stream,
        isCallActive: true
      }));

      // Set local video
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Connect WebSocket if not already connected
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        connectWebSocket();
      }

      toast({
        title: "Call Started",
        description: "You have joined the video call",
      });
    } catch (error) {
      console.error('Error starting call:', error);
      toast({
        title: "Call Failed",
        description: "Failed to access camera/microphone",
        variant: "destructive",
      });
    }
  }, [connectWebSocket, toast]);

  const endCall = useCallback(() => {
    console.log('Ending video call...');
    
    // Send leave message
    sendMessage({
      type: 'leave'
    });

    // Stop local stream
    if (state.localStream) {
      state.localStream.getTracks().forEach(track => track.stop());
    }

    // Close all peer connections
    peerConnectionsRef.current.forEach(pc => pc.close());
    peerConnectionsRef.current.clear();

    // Close WebSocket
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setState({
      isConnected: false,
      isCallActive: false,
      localStream: null,
      remoteStreams: new Map(),
      participants: [],
      isMuted: false,
      isVideoOff: false,
      isScreenSharing: false
    });

    toast({
      title: "Call Ended",
      description: "You have left the video call",
    });
  }, [state.localStream, sendMessage, toast]);

  const toggleMute = useCallback(() => {
    if (state.localStream) {
      const audioTracks = state.localStream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = state.isMuted;
      });
      
      setState(prev => ({ ...prev, isMuted: !prev.isMuted }));
    }
  }, [state.localStream, state.isMuted]);

  const toggleVideo = useCallback(() => {
    if (state.localStream) {
      const videoTracks = state.localStream.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = state.isVideoOff;
      });
      
      setState(prev => ({ ...prev, isVideoOff: !prev.isVideoOff }));
    }
  }, [state.localStream, state.isVideoOff]);

  const startScreenShare = useCallback(async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });

      setState(prev => ({ ...prev, isScreenSharing: true }));

      // Replace video track in all peer connections
      const videoTrack = screenStream.getVideoTracks()[0];
      peerConnectionsRef.current.forEach(async (pc) => {
        const sender = pc.getSenders().find(s => 
          s.track && s.track.kind === 'video'
        );
        if (sender) {
          await sender.replaceTrack(videoTrack);
        }
      });

      // Update local video
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = screenStream;
      }

      // Handle screen share end
      videoTrack.onended = () => {
        setState(prev => ({ ...prev, isScreenSharing: false }));
        
        // Restore camera
        if (state.localStream) {
          const cameraTrack = state.localStream.getVideoTracks()[0];
          peerConnectionsRef.current.forEach(async (pc) => {
            const sender = pc.getSenders().find(s => 
              s.track && s.track.kind === 'video'
            );
            if (sender && cameraTrack) {
              await sender.replaceTrack(cameraTrack);
            }
          });

          if (localVideoRef.current) {
            localVideoRef.current.srcObject = state.localStream;
          }
        }
      };
    } catch (error) {
      console.error('Error starting screen share:', error);
      toast({
        title: "Screen Share Failed",
        description: "Failed to start screen sharing",
        variant: "destructive",
      });
    }
  }, [state.localStream, toast]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (state.isCallActive) {
        endCall();
      }
    };
  }, []);

  return {
    ...state,
    localVideoRef,
    remoteVideosRef,
    startCall,
    endCall,
    toggleMute,
    toggleVideo,
    startScreenShare
  };
};