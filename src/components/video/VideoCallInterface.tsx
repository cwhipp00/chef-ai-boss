import React, { useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff,
  Monitor,
  Users,
  Settings,
  Maximize,
  Minimize
} from 'lucide-react';
import { useVideoCall } from '@/hooks/useVideoCall';
import { cn } from '@/lib/utils';

interface VideoCallInterfaceProps {
  roomId: string;
  userId: string;
  userName: string;
  onCallEnd?: () => void;
}

export function VideoCallInterface({ roomId, userId, userName, onCallEnd }: VideoCallInterfaceProps) {
  const {
    isConnected,
    isCallActive,
    localStream,
    remoteStreams,
    participants,
    isMuted,
    isVideoOff,
    isScreenSharing,
    localVideoRef,
    remoteVideosRef,
    startCall,
    endCall,
    toggleMute,
    toggleVideo,
    startScreenShare
  } = useVideoCall(roomId, userId);

  const remoteVideoContainerRef = useRef<HTMLDivElement>(null);

  // Create video elements for remote streams
  useEffect(() => {
    remoteStreams.forEach((stream, peerId) => {
      let videoElement = remoteVideosRef.current.get(peerId);
      
      if (!videoElement) {
        videoElement = document.createElement('video');
        videoElement.autoplay = true;
        videoElement.playsInline = true;
        videoElement.muted = false;
        videoElement.className = 'w-full h-full object-cover rounded-lg';
        
        remoteVideosRef.current.set(peerId, videoElement);
        
        if (remoteVideoContainerRef.current) {
          const container = document.createElement('div');
          container.className = 'relative aspect-video bg-muted rounded-lg overflow-hidden';
          container.appendChild(videoElement);
          
          // Add participant label
          const label = document.createElement('div');
          label.className = 'absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm';
          label.textContent = peerId;
          container.appendChild(label);
          
          remoteVideoContainerRef.current.appendChild(container);
        }
      }
      
      if (videoElement.srcObject !== stream) {
        videoElement.srcObject = stream;
      }
    });

    // Clean up removed streams
    remoteVideosRef.current.forEach((videoElement, peerId) => {
      if (!remoteStreams.has(peerId)) {
        videoElement.remove();
        remoteVideosRef.current.delete(peerId);
        
        // Remove container as well
        const containers = remoteVideoContainerRef.current?.children;
        if (containers) {
          Array.from(containers).forEach(container => {
            if (container.querySelector('video') === videoElement) {
              container.remove();
            }
          });
        }
      }
    });
  }, [remoteStreams]);

  const handleStartCall = async () => {
    await startCall();
  };

  const handleEndCall = () => {
    endCall();
    onCallEnd?.();
  };

  const getGridCols = () => {
    const totalParticipants = participants.length + 1; // +1 for local user
    if (totalParticipants <= 2) return 'grid-cols-1 md:grid-cols-2';
    if (totalParticipants <= 4) return 'grid-cols-2';
    if (totalParticipants <= 6) return 'grid-cols-2 md:grid-cols-3';
    return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
  };

  if (!isCallActive) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-8 text-center space-y-6">
          <div className="space-y-2">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Video className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Join Video Call</h2>
            <p className="text-muted-foreground">
              Room: <code className="bg-muted px-2 py-1 rounded">{roomId}</code>
            </p>
          </div>

          <div className="flex items-center justify-center gap-2">
            <Badge variant={isConnected ? "default" : "secondary"}>
              {isConnected ? "Connected" : "Connecting..."}
            </Badge>
            {participants.length > 0 && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {participants.length} in call
              </Badge>
            )}
          </div>

          <Button 
            onClick={handleStartCall}
            disabled={!isConnected}
            size="lg"
            className="w-full max-w-xs"
          >
            <Video className="h-4 w-4 mr-2" />
            Join Call
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-black">
      {/* Header */}
      <div className="bg-card/95 backdrop-blur-sm border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="font-semibold">Video Call</h2>
          <Badge variant="outline" className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {participants.length + 1} participants
          </Badge>
          <code className="text-sm bg-muted px-2 py-1 rounded">{roomId}</code>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant={isConnected ? "default" : "destructive"}>
            {isConnected ? "Connected" : "Disconnected"}
          </Badge>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Video Grid */}
      <div className="flex-1 p-4">
        <div className={cn("grid gap-4 h-full", getGridCols())}>
          {/* Local Video */}
          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className={cn(
                "w-full h-full object-cover",
                isVideoOff && "hidden"
              )}
            />
            {isVideoOff && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted">
                <div className="text-center">
                  <VideoOff className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Camera off</p>
                </div>
              </div>
            )}
            
            {/* Local Video Controls Overlay */}
            <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm flex items-center gap-2">
              <span>{userName} (You)</span>
              {isMuted && <MicOff className="h-3 w-3" />}
              {isScreenSharing && <Monitor className="h-3 w-3" />}
            </div>
          </div>
          
          {/* Remote Videos Container */}
          <div 
            ref={remoteVideoContainerRef}
            className={cn(
              "contents",
              remoteStreams.size === 0 && "hidden"
            )}
          />
          
          {/* Placeholder for when no remote participants */}
          {participants.length === 0 && (
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Users className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">Waiting for others to join...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-card/95 backdrop-blur-sm border-t p-4">
        <div className="flex items-center justify-center gap-4">
          {/* Mute Button */}
          <Button
            variant={isMuted ? "destructive" : "secondary"}
            size="lg"
            onClick={toggleMute}
            className="rounded-full w-12 h-12"
          >
            {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>

          {/* Video Button */}
          <Button
            variant={isVideoOff ? "destructive" : "secondary"}
            size="lg"
            onClick={toggleVideo}
            className="rounded-full w-12 h-12"
          >
            {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
          </Button>

          {/* Screen Share Button */}
          <Button
            variant={isScreenSharing ? "default" : "secondary"}
            size="lg"
            onClick={startScreenShare}
            className="rounded-full w-12 h-12"
          >
            <Monitor className="h-5 w-5" />
          </Button>

          {/* End Call Button */}
          <Button
            variant="destructive"
            size="lg"
            onClick={handleEndCall}
            className="rounded-full w-12 h-12"
          >
            <PhoneOff className="h-5 w-5" />
          </Button>
        </div>

        {/* Additional Controls */}
        <div className="flex justify-center mt-4 gap-2">
          <Button variant="outline" size="sm">
            <Maximize className="h-4 w-4 mr-2" />
            Fullscreen
          </Button>
          
          {participants.length > 0 && (
            <Button variant="outline" size="sm">
              <Users className="h-4 w-4 mr-2" />
              Participants ({participants.length + 1})
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}