import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { CollaborativeWhiteboard } from '@/components/collaboration/CollaborativeWhiteboard';
import { DocumentCollaboration } from '@/components/collaboration/DocumentCollaboration';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  Monitor,
  MonitorOff,
  Users,
  MessageSquare,
  FileText,
  Palette,
  Settings,
  Share,
  Download,
  Upload,
  Maximize,
  Minimize,
  Volume2,
  VolumeX,
  MoreVertical,
  UserPlus,
  Copy,
  ExternalLink,
  Presentation,
  PenTool,
  Grid3X3,
  Layout
} from 'lucide-react';

interface MeetingParticipant {
  id: string;
  name: string;
  email?: string;
  role: 'host' | 'presenter' | 'attendee';
  video: boolean;
  audio: boolean;
  screen: boolean;
  hand_raised: boolean;
  joined_at: string;
}

interface AdvancedMeetingPlatformProps {
  meetingId: string;
  roomName: string;
  userId: string;
  userName: string;
  userRole: 'host' | 'presenter' | 'attendee';
  onMeetingEnd?: () => void;
}

export function AdvancedMeetingPlatform({
  meetingId,
  roomName,
  userId,
  userName,
  userRole,
  onMeetingEnd
}: AdvancedMeetingPlatformProps) {
  // Meeting state
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [participants, setParticipants] = useState<MeetingParticipant[]>([]);
  
  // Media controls
  const [localVideo, setLocalVideo] = useState(true);
  const [localAudio, setLocalAudio] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isPresenting, setIsPresenting] = useState(false);
  
  // UI state
  const [activeView, setActiveView] = useState<'grid' | 'focus' | 'presentation'>('grid');
  const [activeTab, setActiveTab] = useState('participants');
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  
  // Collaboration features
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const [showDocuments, setShowDocuments] = useState(false);
  const [whiteboardActive, setWhiteboardActive] = useState(false);
  
  const videoRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Mock participants
  useEffect(() => {
    if (isConnected) {
      setParticipants([
        {
          id: 'host-1',
          name: 'Sarah Chen',
          email: 'sarah@restaurant.com',
          role: 'host',
          video: true,
          audio: true,
          screen: false,
          hand_raised: false,
          joined_at: new Date().toISOString()
        },
        {
          id: 'user-1',
          name: userName,
          role: userRole,
          video: localVideo,
          audio: localAudio,
          screen: isScreenSharing,
          hand_raised: false,
          joined_at: new Date().toISOString()
        },
        {
          id: 'user-2',
          name: 'John Smith',
          role: 'attendee',
          video: true,
          audio: true,
          screen: false,
          hand_raised: false,
          joined_at: new Date(Date.now() - 120000).toISOString()
        },
        {
          id: 'user-3',
          name: 'Emily Davis',
          role: 'attendee',
          video: false,
          audio: true,
          screen: false,
          hand_raised: true,
          joined_at: new Date(Date.now() - 300000).toISOString()
        }
      ]);
    }
  }, [isConnected, localVideo, localAudio, isScreenSharing, userName, userRole]);

  const joinMeeting = async () => {
    setIsConnecting(true);
    
    // Simulate connection
    setTimeout(() => {
      setIsConnected(true);
      setIsConnecting(false);
      toast({
        title: "Meeting Joined",
        description: `Connected to ${roomName}`,
      });
    }, 2000);
  };

  const leaveMeeting = () => {
    setIsConnected(false);
    setParticipants([]);
    onMeetingEnd?.();
    
    toast({
      title: "Left Meeting",
      description: "You've disconnected from the meeting",
    });
  };

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      setIsScreenSharing(false);
      setIsPresenting(false);
      setActiveView('grid');
      toast({
        title: "Screen Sharing Stopped",
        description: "You stopped sharing your screen",
      });
    } else {
      setIsScreenSharing(true);
      setIsPresenting(true);
      setActiveView('presentation');
      toast({
        title: "Screen Sharing Started",
        description: "Your screen is now being shared",
      });
    }
  };

  const startWhiteboardSession = () => {
    setShowWhiteboard(true);
    setWhiteboardActive(true);
    setActiveTab('whiteboard');
    toast({
      title: "Whiteboard Started",
      description: "Collaborative whiteboard is now active",
    });
  };

  const startDocumentSession = () => {
    setShowDocuments(true);
    setActiveTab('documents');
    toast({
      title: "Document Collaboration",
      description: "Document sharing is now active",
    });
  };

  const copyMeetingLink = () => {
    const meetingUrl = `${window.location.origin}/meeting/${meetingId}`;
    navigator.clipboard.writeText(meetingUrl);
    toast({
      title: "Link Copied",
      description: "Meeting link has been copied to clipboard",
    });
  };

  const getViewLayout = () => {
    switch (activeView) {
      case 'focus':
        return 'grid-cols-1';
      case 'presentation':
        return 'grid-cols-1';
      default:
        return participants.length <= 2 ? 'grid-cols-2' : 
               participants.length <= 4 ? 'grid-cols-2' : 'grid-cols-3';
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <Card className="rounded-none border-l-0 border-r-0 border-t-0">
        <CardHeader className="py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <CardTitle className="text-lg">{roomName}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={isConnected ? "default" : "secondary"}>
                    {isConnected ? `${participants.length} Connected` : "Disconnected"}
                  </Badge>
                  {isPresenting && (
                    <Badge variant="destructive">
                      <Presentation className="h-3 w-3 mr-1" />
                      Presenting
                    </Badge>
                  )}
                  {whiteboardActive && (
                    <Badge variant="outline">
                      <PenTool className="h-3 w-3 mr-1" />
                      Whiteboard Active
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* View Controls */}
              <div className="flex gap-1 bg-muted rounded-lg p-1">
                <Button
                  variant={activeView === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveView('grid')}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={activeView === 'focus' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveView('focus')}
                >
                  <Maximize className="h-4 w-4" />
                </Button>
                <Button
                  variant={activeView === 'presentation' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveView('presentation')}
                >
                  <Presentation className="h-4 w-4" />
                </Button>
              </div>

              {/* Invite Button */}
              <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <UserPlus className="h-4 w-4 mr-1" />
                    Invite
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Invite to Meeting</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="p-3 bg-muted rounded border">
                      <div className="text-sm font-medium mb-2">Meeting Link</div>
                      <div className="text-xs font-mono break-all">
                        {window.location.origin}/meeting/{meetingId}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={copyMeetingLink} className="flex-1">
                        <Copy className="h-4 w-4 mr-1" />
                        Copy Link
                      </Button>
                      <Button variant="outline">
                        <Share className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSidebarExpanded(!sidebarExpanded)}
              >
                <Layout className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Video Area */}
        <div className="flex-1 p-4">
          {showWhiteboard && activeTab === 'whiteboard' ? (
            <CollaborativeWhiteboard
              meetingId={meetingId}
              userId={userId}
              userName={userName}
              isHost={userRole === 'host'}
            />
          ) : showDocuments && activeTab === 'documents' ? (
            <DocumentCollaboration
              meetingId={meetingId}
              userId={userId}
              userName={userName}
            />
          ) : (
            <Card className="h-full">
              <CardContent className="p-4 h-full">
                <div 
                  ref={videoRef}
                  className="w-full h-full bg-gradient-to-br from-muted to-muted/50 rounded-lg overflow-hidden"
                >
                  {!isConnected && !isConnecting ? (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <Video className="h-24 w-24 mx-auto text-muted-foreground" />
                        <div>
                          <h3 className="text-xl font-semibold mb-2">Join Advanced Meeting</h3>
                          <p className="text-muted-foreground">
                            Experience enterprise-grade video conferencing with collaboration tools
                          </p>
                        </div>
                        <Button onClick={joinMeeting} size="lg" className="bg-gradient-primary">
                          <Phone className="h-5 w-5 mr-2" />
                          Join Meeting
                        </Button>
                      </div>
                    </div>
                  ) : isConnecting ? (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
                        <p className="text-muted-foreground">Connecting to meeting...</p>
                      </div>
                    </div>
                  ) : (
                    <div className={`grid ${getViewLayout()} gap-2 h-full p-2`}>
                      {participants.slice(0, activeView === 'focus' ? 1 : 9).map((participant, index) => (
                        <div key={participant.id} className="relative bg-black/10 rounded-lg overflow-hidden">
                          {participant.video ? (
                            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center relative">
                              {/* Simulated video feed */}
                              <div className="text-center">
                                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-2">
                                  <span className="text-primary-foreground font-bold text-lg">
                                    {participant.name.split(' ').map(n => n[0]).join('')}
                                  </span>
                                </div>
                                <p className="text-sm font-medium">{participant.name}</p>
                                <Badge variant="outline" className="text-xs mt-1">
                                  {participant.role}
                                </Badge>
                              </div>
                            </div>
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                              <div className="text-center">
                                <VideoOff className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                                <p className="text-sm font-medium">{participant.name}</p>
                                <Badge variant="outline" className="text-xs mt-1">
                                  {participant.role}
                                </Badge>
                              </div>
                            </div>
                          )}
                          
                          {/* Participant Status Indicators */}
                          <div className="absolute top-2 right-2 flex gap-1">
                            {!participant.audio && (
                              <div className="w-6 h-6 bg-destructive rounded-full flex items-center justify-center">
                                <MicOff className="h-3 w-3 text-white" />
                              </div>
                            )}
                            {participant.screen && (
                              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                <Monitor className="h-3 w-3 text-white" />
                              </div>
                            )}
                            {participant.hand_raised && (
                              <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">✋</span>
                              </div>
                            )}
                          </div>
                          
                          {/* Participant Name Overlay */}
                          <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                            {participant.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        {sidebarExpanded && (
          <div className="w-80 border-l">
            <Card className="h-full rounded-none border-l-0 border-r-0 border-t-0 border-b-0">
              <CardHeader className="pb-3">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="participants">
                      <Users className="h-4 w-4" />
                    </TabsTrigger>
                    <TabsTrigger value="chat">
                      <MessageSquare className="h-4 w-4" />
                    </TabsTrigger>
                    <TabsTrigger value="whiteboard">
                      <Palette className="h-4 w-4" />
                    </TabsTrigger>
                    <TabsTrigger value="documents">
                      <FileText className="h-4 w-4" />
                    </TabsTrigger>
                    <TabsTrigger value="settings">
                      <Settings className="h-4 w-4" />
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              
              <CardContent className="h-[500px] overflow-hidden">
                <Tabs value={activeTab} className="h-full">
                  {/* Participants Tab */}
                  <TabsContent value="participants" className="space-y-3 h-full overflow-y-auto">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Participants ({participants.length})</span>
                      <Button size="sm" variant="outline" onClick={() => setShowInviteDialog(true)}>
                        <UserPlus className="h-3 w-3" />
                      </Button>
                    </div>
                    {participants.map((participant) => (
                      <div key={participant.id} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                            <span className="text-xs text-primary-foreground font-bold">
                              {participant.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">{participant.name}</p>
                            <div className="flex items-center gap-1">
                              <Badge variant="outline" className="text-xs">
                                {participant.role}
                              </Badge>
                              {participant.hand_raised && (
                                <span className="text-xs">✋</span>
                              )}
                            </div>
                          </div>
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
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </TabsContent>

                  {/* Chat Tab */}
                  <TabsContent value="chat" className="h-full">
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Chat feature coming soon</p>
                    </div>
                  </TabsContent>

                  {/* Whiteboard Tab */}
                  <TabsContent value="whiteboard" className="h-full">
                    <div className="space-y-3">
                      <div className="text-center py-4">
                        <Palette className="h-12 w-12 mx-auto mb-4 text-primary" />
                        <h3 className="font-medium mb-2">Collaborative Whiteboard</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Start a shared whiteboard session for real-time collaboration
                        </p>
                        <Button onClick={startWhiteboardSession} className="w-full">
                          <PenTool className="h-4 w-4 mr-2" />
                          Start Whiteboard
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Documents Tab */}
                  <TabsContent value="documents" className="h-full">
                    <div className="space-y-3">
                      <div className="text-center py-4">
                        <FileText className="h-12 w-12 mx-auto mb-4 text-primary" />
                        <h3 className="font-medium mb-2">Document Collaboration</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Share and collaborate on documents in real-time
                        </p>
                        <Button onClick={startDocumentSession} className="w-full">
                          <FileText className="h-4 w-4 mr-2" />
                          Open Documents
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Settings Tab */}
                  <TabsContent value="settings" className="h-full overflow-y-auto">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Audio & Video</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Camera</span>
                            <Button
                              variant={localVideo ? "default" : "outline"}
                              size="sm"
                              onClick={() => setLocalVideo(!localVideo)}
                            >
                              {localVideo ? <Video className="h-3 w-3" /> : <VideoOff className="h-3 w-3" />}
                            </Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Microphone</span>
                            <Button
                              variant={localAudio ? "default" : "outline"}
                              size="sm"
                              onClick={() => setLocalAudio(!localAudio)}
                            >
                              {localAudio ? <Mic className="h-3 w-3" /> : <MicOff className="h-3 w-3" />}
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Meeting</h4>
                        <div className="space-y-2">
                          <Button variant="outline" size="sm" className="w-full justify-start">
                            <Download className="h-3 w-3 mr-2" />
                            Export Meeting Data
                          </Button>
                          <Button variant="outline" size="sm" className="w-full justify-start">
                            <ExternalLink className="h-3 w-3 mr-2" />
                            Open in New Tab
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Meeting Controls */}
      <Card className="rounded-none border-l-0 border-r-0 border-b-0">
        <CardContent className="py-4">
          <div className="flex items-center justify-center gap-3">
            {!isConnected ? (
              <Button 
                onClick={joinMeeting} 
                disabled={isConnecting}
                size="lg"
                className="bg-gradient-primary px-8"
              >
                <Phone className="h-5 w-5 mr-2" />
                {isConnecting ? 'Connecting...' : 'Join Meeting'}
              </Button>
            ) : (
              <>
                <Button
                  variant={localVideo ? "default" : "destructive"}
                  size="lg"
                  onClick={() => setLocalVideo(!localVideo)}
                >
                  {localVideo ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                </Button>
                
                <Button
                  variant={localAudio ? "default" : "destructive"}
                  size="lg"
                  onClick={() => setLocalAudio(!localAudio)}
                >
                  {localAudio ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                </Button>
                
                <Button
                  variant={isScreenSharing ? "default" : "outline"}
                  size="lg"
                  onClick={toggleScreenShare}
                >
                  {isScreenSharing ? <MonitorOff className="h-5 w-5" /> : <Monitor className="h-5 w-5" />}
                </Button>
                
                <Button
                  variant="destructive"
                  size="lg"
                  onClick={leaveMeeting}
                  className="px-8"
                >
                  <PhoneOff className="h-5 w-5 mr-2" />
                  Leave
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}