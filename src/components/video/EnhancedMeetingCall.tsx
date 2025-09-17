import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  Users, 
  Monitor,
  MonitorOff,
  MessageSquare,
  FileText,
  Download,
  Share,
  Settings,
  Camera,
  Volume2,
  VolumeX,
  Square,
  Clock,
  Sparkles,
  Circle,
  CheckSquare,
  AlertTriangle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface MeetingParticipant {
  id: string;
  name: string;
  email?: string;
  role: 'host' | 'attendee';
  video: boolean;
  audio: boolean;
  screen: boolean;
  joined_at: string;
}

interface ChatMessage {
  id: string;
  participant_id: string;
  participant_name: string;
  message: string;
  timestamp: string;
}

interface MeetingNotes {
  id: string;
  content: string;
  author: string;
  timestamp: string;
}

interface ActionItem {
  id: string;
  task: string;
  assignee?: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
}

interface EnhancedMeetingCallProps {
  meetingId?: string;
  roomName?: string;
  userName?: string;
  userRole?: 'host' | 'attendee';
  onMeetingEnd?: () => void;
}

export function EnhancedMeetingCall({
  meetingId = 'meeting-' + Date.now(),
  roomName = 'Restaurant Team Meeting',
  userName = 'Team Member',
  userRole = 'attendee',
  onMeetingEnd
}: EnhancedMeetingCallProps) {
  // Video call states
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [localVideo, setLocalVideo] = useState(true);
  const [localAudio, setLocalAudio] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [participants, setParticipants] = useState<MeetingParticipant[]>([]);

  // Meeting features
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [meetingNotes, setMeetingNotes] = useState<MeetingNotes[]>([]);
  const [newNote, setNewNote] = useState('');
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [meetingTranscript, setMeetingTranscript] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);

  // UI state
  const [activeTab, setActiveTab] = useState('participants');
  const [showSettings, setShowSettings] = useState(false);

  const { toast } = useToast();
  const videoRef = useRef<HTMLDivElement>(null);

  // Mock participants
  useEffect(() => {
    if (isConnected) {
      setParticipants([
        {
          id: 'host-1',
          name: 'Sarah Chen',
          role: 'host',
          video: true,
          audio: true,
          screen: false,
          joined_at: new Date().toISOString()
        },
        {
          id: 'user-1',
          name: userName,
          role: userRole,
          video: localVideo,
          audio: localAudio,
          screen: isScreenSharing,
          joined_at: new Date().toISOString()
        }
      ]);
    }
  }, [isConnected, localVideo, localAudio, isScreenSharing, userName, userRole]);

  // Recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const joinMeeting = async () => {
    setIsConnecting(true);
    
    // Simulate connection delay
    setTimeout(() => {
      setIsConnected(true);
      setIsConnecting(false);
      toast({
        title: "Joined Meeting",
        description: `Connected to ${roomName}`,
      });
    }, 2000);
  };

  const leaveMeeting = () => {
    setIsConnected(false);
    setIsRecording(false);
    setRecordingTime(0);
    setParticipants([]);
    onMeetingEnd?.();
    
    toast({
      title: "Left Meeting",
      description: "You've disconnected from the meeting",
    });
  };

  const toggleRecording = async () => {
    if (!isRecording) {
      setIsRecording(true);
      setRecordingTime(0);
      toast({
        title: "Recording Started",
        description: "Meeting is now being recorded",
      });
      
      // Start AI transcription
      setIsTranscribing(true);
      setTimeout(() => {
        setMeetingTranscript("AI transcription will appear here during the actual meeting...");
        setIsTranscribing(false);
      }, 3000);
    } else {
      setIsRecording(false);
      toast({
        title: "Recording Stopped",
        description: "Meeting recording has been saved",
      });
      
      // Generate action items from transcript
      await generateActionItemsFromTranscript();
    }
  };

  const generateActionItemsFromTranscript = async () => {
    if (!meetingTranscript) return;

    try {
      const { data, error } = await supabase.functions.invoke('ai-meeting-transcription', {
        body: {
          audioData: '',
          meetingTitle: roomName,
          participants: participants.map(p => p.name),
          duration: recordingTime
        }
      });

      if (error) throw error;

      setActionItems(data.actionItems || []);
      toast({
        title: "Action Items Generated",
        description: `Found ${data.actionItems?.length || 0} action items`,
      });
    } catch (error) {
      console.error('Error generating action items:', error);
    }
  };

  const sendChatMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      participant_id: 'user-1',
      participant_name: userName,
      message: newMessage,
      timestamp: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const addNote = () => {
    if (!newNote.trim()) return;

    const note: MeetingNotes = {
      id: Date.now().toString(),
      content: newNote,
      author: userName,
      timestamp: new Date().toISOString()
    };

    setMeetingNotes(prev => [...prev, note]);
    setNewNote('');
  };

  const toggleActionItem = (actionId: string) => {
    setActionItems(prev => prev.map(item =>
      item.id === actionId 
        ? { ...item, completed: !item.completed }
        : item
    ));
  };

  const exportMeetingData = () => {
    const meetingData = {
      meeting_id: meetingId,
      room_name: roomName,
      duration: recordingTime,
      participants: participants,
      chat_messages: chatMessages,
      notes: meetingNotes,
      action_items: actionItems,
      transcript: meetingTranscript,
      created_at: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(meetingData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meeting-${meetingId}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Meeting Data Exported",
      description: "Meeting summary has been downloaded",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-screen max-h-[900px]">
      {/* Main Video Area */}
      <div className="lg:col-span-2 space-y-4">
        {/* Video Container */}
        <Card className="h-[500px]">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                {roomName}
              </CardTitle>
              <div className="flex items-center gap-2">
                {isRecording && (
                  <Badge variant="destructive" className="animate-pulse">
                    <Circle className="h-3 w-3 mr-1 fill-current" />
                    {formatTime(recordingTime)}
                  </Badge>
                )}
                <Badge variant={isConnected ? "default" : "secondary"}>
                  {isConnected ? `${participants.length} Connected` : "Disconnected"}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 h-[420px]">
            <div 
              ref={videoRef}
              className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center relative rounded-lg"
            >
              {!isConnected && !isConnecting && (
                <div className="text-center space-y-4">
                  <Video className="h-24 w-24 mx-auto text-muted-foreground" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Join Team Meeting</h3>
                    <p className="text-muted-foreground">
                      Connect with your restaurant team for training, planning, and collaboration
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

              {isConnected && (
                <div className="grid grid-cols-2 gap-2 p-4 w-full h-full">
                  {participants.slice(0, 4).map((participant) => (
                    <div key={participant.id} className="bg-black/20 rounded-lg flex items-center justify-center relative">
                      {participant.video ? (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-2">
                              <span className="text-primary-foreground font-bold">
                                {participant.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <p className="text-sm font-medium">{participant.name}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <VideoOff className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm">{participant.name}</p>
                        </div>
                      )}
                      
                      {/* Participant Controls Indicators */}
                      <div className="absolute bottom-2 right-2 flex gap-1">
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
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Meeting Controls */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {!isConnected ? (
                  <Button 
                    onClick={joinMeeting} 
                    disabled={isConnecting}
                    className="bg-gradient-primary"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    {isConnecting ? 'Connecting...' : 'Join Meeting'}
                  </Button>
                ) : (
                  <>
                    <Button
                      variant={localVideo ? "default" : "secondary"}
                      size="sm"
                      onClick={() => setLocalVideo(!localVideo)}
                    >
                      {localVideo ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                    </Button>
                    
                    <Button
                      variant={localAudio ? "default" : "secondary"}
                      size="sm"
                      onClick={() => setLocalAudio(!localAudio)}
                    >
                      {localAudio ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                    </Button>
                    
                    <Button
                      variant={isScreenSharing ? "default" : "outline"}
                      size="sm"
                      onClick={() => setIsScreenSharing(!isScreenSharing)}
                    >
                      {isScreenSharing ? <MonitorOff className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
                    </Button>

                    <Button
                      variant={isRecording ? "destructive" : "outline"}
                      size="sm"
                      onClick={toggleRecording}
                    >
                      {isRecording ? <Square className="h-4 w-4" /> : <Circle className="h-4 w-4 fill-current" />}
                    </Button>
                    
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={leaveMeeting}
                    >
                      <PhoneOff className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={exportMeetingData}>
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Share className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <Card className="h-full">
        <CardHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="participants">
                <Users className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="chat">
                <MessageSquare className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="notes">
                <FileText className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="actions">
                <CheckSquare className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        
        <CardContent className="h-[500px] overflow-hidden">
          <Tabs value={activeTab} className="h-full">
            {/* Participants Tab */}
            <TabsContent value="participants" className="space-y-3 h-full overflow-y-auto">
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
                      <p className="text-xs text-muted-foreground">{participant.role}</p>
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
                  </div>
                </div>
              ))}
            </TabsContent>

            {/* Chat Tab */}
            <TabsContent value="chat" className="h-full flex flex-col">
              <div className="flex-1 space-y-2 overflow-y-auto mb-3">
                {chatMessages.map((message) => (
                  <div key={message.id} className="p-2 border rounded">
                    <p className="text-xs font-medium text-muted-foreground">
                      {message.participant_name}
                    </p>
                    <p className="text-sm">{message.message}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                />
                <Button size="sm" onClick={sendChatMessage}>
                  Send
                </Button>
              </div>
            </TabsContent>

            {/* Notes Tab */}
            <TabsContent value="notes" className="h-full flex flex-col">
              <div className="flex-1 space-y-2 overflow-y-auto mb-3">
                {meetingNotes.map((note) => (
                  <div key={note.id} className="p-2 border rounded">
                    <p className="text-xs font-medium text-muted-foreground">
                      {note.author} • {new Date(note.timestamp).toLocaleTimeString()}
                    </p>
                    <p className="text-sm">{note.content}</p>
                  </div>
                ))}
                {isTranscribing && (
                  <div className="p-2 border rounded border-primary/20 bg-primary/5">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                      <span className="text-sm">AI is transcribing...</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Textarea
                  placeholder="Add meeting notes..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  rows={2}
                />
                <Button size="sm" onClick={addNote} className="w-full">
                  Add Note
                </Button>
              </div>
            </TabsContent>

            {/* Action Items Tab */}
            <TabsContent value="actions" className="h-full overflow-y-auto">
              <div className="space-y-2">
                {actionItems.map((item) => (
                  <div key={item.id} className="p-2 border rounded">
                    <div className="flex items-start gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 mt-1"
                        onClick={() => toggleActionItem(item.id)}
                      >
                        {item.completed ? (
                          <CheckSquare className="h-3 w-3 text-success" />
                        ) : (
                          <div className="h-3 w-3 border border-muted-foreground rounded" />
                        )}
                      </Button>
                      <div className="flex-1">
                        <p className={`text-sm ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {item.task}
                        </p>
                        {item.assignee && (
                          <p className="text-xs text-muted-foreground">
                            Assigned to: {item.assignee}
                          </p>
                        )}
                        {item.dueDate && (
                          <p className="text-xs text-muted-foreground">
                            Due: {item.dueDate}
                          </p>
                        )}
                        <Badge 
                          variant={item.priority === 'high' ? 'destructive' : item.priority === 'medium' ? 'default' : 'secondary'}
                          className="mt-1"
                        >
                          {item.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
                {actionItems.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No action items yet</p>
                    <p className="text-sm">Action items will be generated from the meeting</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}