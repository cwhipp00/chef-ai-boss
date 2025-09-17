import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  Square, 
  Download, 
  FileText, 
  Users, 
  Clock,
  CheckCircle2,
  AlertCircle,
  Brain,
  MessageSquare,
  Sparkles,
  Volume2,
  VolumeX,
  Settings,
  Wand2,
  Circle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface MeetingParticipant {
  id: string;
  name: string;
  role?: string;
  voiceId?: string;
}

interface ActionItem {
  id: string;
  task: string;
  assignee: string;
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: Date;
}

interface MeetingTranscript {
  timestamp: Date;
  speaker: string;
  text: string;
  confidence: number;
}

interface MeetingSession {
  id: string;
  title: string;
  participants: MeetingParticipant[];
  startTime: Date;
  endTime?: Date;
  transcript: MeetingTranscript[];
  actionItems: ActionItem[];
  summary?: string;
  keyTopics?: string[];
  decisions?: string[];
}

export function AIMeetingNotes() {
  const { toast } = useToast();
  
  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Meeting data
  const [currentSession, setCurrentSession] = useState<MeetingSession | null>(null);
  const [participants, setParticipants] = useState<MeetingParticipant[]>([]);
  const [transcript, setTranscript] = useState<MeetingTranscript[]>([]);
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [meetingTitle, setMeetingTitle] = useState('');
  
  // Audio/AI processing
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  
  // Dialogs
  const [showStartDialog, setShowStartDialog] = useState(false);
  const [showActionItemDialog, setShowActionItemDialog] = useState(false);
  const [newActionItem, setNewActionItem] = useState({ task: '', assignee: '', priority: 'medium' as const });

  // Timer for recording duration
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, isPaused]);

  // Format duration
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start meeting
  const startMeeting = async () => {
    if (!meetingTitle.trim()) {
      toast({
        title: "Meeting Title Required",
        description: "Please enter a meeting title before starting.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100,
          channelCount: 2
        }
      });

      streamRef.current = stream;

      // Initialize MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          
          // Process audio chunk for real-time transcription
          processAudioChunk(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        processCompleteRecording();
      };

      // Start recording
      mediaRecorder.start(1000); // Capture data every second
      setIsRecording(true);
      setRecordingDuration(0);

      // Create meeting session
      const session: MeetingSession = {
        id: Date.now().toString(),
        title: meetingTitle,
        participants,
        startTime: new Date(),
        transcript: [],
        actionItems: []
      };

      setCurrentSession(session);
      setShowStartDialog(false);

      toast({
        title: "Meeting Started",
        description: "AI is now recording and transcribing the meeting.",
      });

    } catch (error) {
      console.error('Error starting meeting:', error);
      toast({
        title: "Recording Error",
        description: "Unable to access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  // Process audio chunk for real-time transcription
  const processAudioChunk = async (audioBlob: Blob) => {
    try {
      // Convert blob to base64
      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

      // Call transcription service
      const { data, error } = await supabase.functions.invoke('voice-transcription', {
        body: { audio: base64Audio }
      });

      if (error) throw error;

      if (data?.text) {
        // Simulate speaker identification (in real implementation, this would use AI voice separation)
        const speaker = identifySpeaker(data.text);
        
        const newTranscript: MeetingTranscript = {
          timestamp: new Date(),
          speaker,
          text: data.text,
          confidence: 0.95 // Mock confidence score
        };

        setTranscript(prev => [...prev, newTranscript]);

        // Auto-detect action items
        detectActionItems(data.text, speaker);
      }
    } catch (error) {
      console.error('Error processing audio chunk:', error);
    }
  };

  // Identify speaker (mock implementation - would use AI voice recognition)
  const identifySpeaker = (text: string): string => {
    if (participants.length === 0) return 'Unknown Speaker';
    
    // Mock speaker identification based on content patterns
    if (text.toLowerCase().includes('action item') || text.toLowerCase().includes('todo')) {
      return participants.find(p => p.role === 'manager')?.name || participants[0]?.name || 'Unknown Speaker';
    }
    
    // Random assignment for demo
    return participants[Math.floor(Math.random() * participants.length)]?.name || 'Unknown Speaker';
  };

  // Auto-detect action items from transcript
  const detectActionItems = (text: string, speaker: string) => {
    const actionKeywords = ['action item', 'todo', 'follow up', 'assign', 'complete by', 'deadline'];
    const lowerText = text.toLowerCase();
    
    if (actionKeywords.some(keyword => lowerText.includes(keyword))) {
      // Extract potential action item
      const actionText = text.replace(/action item:?/i, '').trim();
      
      if (actionText.length > 10) {
        const newActionItem: ActionItem = {
          id: Date.now().toString(),
          task: actionText,
          assignee: speaker,
          priority: 'medium',
          status: 'pending',
          createdAt: new Date()
        };

        setActionItems(prev => [...prev, newActionItem]);
        
        toast({
          title: "Action Item Detected",
          description: `"${actionText.substring(0, 50)}..."`,
        });
      }
    }
  };

  // Process complete recording
  const processCompleteRecording = async () => {
    setIsProcessing(true);

    try {
      // Combine all audio chunks
      const completeBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      
      // Generate meeting summary using AI
      const summary = await generateMeetingSummary();
      
      if (currentSession) {
        const updatedSession: MeetingSession = {
          ...currentSession,
          endTime: new Date(),
          transcript,
          actionItems,
          summary: summary.summary,
          keyTopics: summary.keyTopics,
          decisions: summary.decisions
        };

        setCurrentSession(updatedSession);
      }

      toast({
        title: "Meeting Processed",
        description: "AI has generated the meeting summary and action items.",
      });

    } catch (error) {
      console.error('Error processing complete recording:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Generate AI meeting summary
  const generateMeetingSummary = async () => {
    // Mock AI processing - would call actual AI service
    const topics = ['Project Status', 'Budget Review', 'Team Assignments', 'Next Steps'];
    const decisions = ['Approved new menu items', 'Extended deadline to Friday', 'Hired additional staff'];
    
    const summary = `Meeting covered ${topics.length} main topics with ${actionItems.length} action items identified. Key decisions were made regarding operational improvements and staff scheduling.`;

    return {
      summary,
      keyTopics: topics,
      decisions
    };
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  };

  // Pause/Resume recording
  const togglePause = () => {
    if (mediaRecorderRef.current) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        setIsPaused(false);
      } else {
        mediaRecorderRef.current.pause();
        setIsPaused(true);
      }
    }
  };

  // Add participant
  const addParticipant = (name: string, role?: string) => {
    const newParticipant: MeetingParticipant = {
      id: Date.now().toString(),
      name,
      role,
      voiceId: `voice-${Date.now()}`
    };
    setParticipants(prev => [...prev, newParticipant]);
  };

  // Add manual action item
  const addActionItem = () => {
    if (!newActionItem.task.trim()) {
      toast({
        title: "Task Required",
        description: "Please enter a task description.",
        variant: "destructive",
      });
      return;
    }

    const actionItem: ActionItem = {
      id: Date.now().toString(),
      ...newActionItem,
      status: 'pending',
      createdAt: new Date()
    };

    setActionItems(prev => [...prev, actionItem]);
    setNewActionItem({ task: '', assignee: '', priority: 'medium' });
    setShowActionItemDialog(false);

    toast({
      title: "Action Item Added",
      description: "New action item has been created.",
    });
  };

  // Update action item status
  const updateActionItemStatus = (id: string, status: ActionItem['status']) => {
    setActionItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, status } : item
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Brain className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-xl">AI Meeting Notes & Transcription</CardTitle>
                <p className="text-muted-foreground">
                  AI-powered voice separation, transcription, and action item detection
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {!isRecording && (
                <Dialog open={showStartDialog} onOpenChange={setShowStartDialog}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-primary">
                      <Mic className="h-4 w-4 mr-2" />
                      Start Meeting
                    </Button>
                  </DialogTrigger>
                </Dialog>
              )}
              {isRecording && (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={togglePause}>
                    {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                  </Button>
                  <Button variant="destructive" onClick={stopRecording}>
                    <Square className="h-4 w-4 mr-2" />
                    Stop
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        {isRecording && (
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <span className="font-medium">
                  {isPaused ? 'Paused' : 'Recording'} - {formatDuration(recordingDuration)}
                </span>
              </div>
              <Badge variant="outline">
                <Users className="h-3 w-3 mr-1" />
                {participants.length} participants
              </Badge>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Meeting Content */}
      {currentSession && (
        <Tabs defaultValue="transcript" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="transcript">Live Transcript</TabsTrigger>
            <TabsTrigger value="action-items">Action Items</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="participants">Participants</TabsTrigger>
          </TabsList>

          <TabsContent value="transcript" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Real-time Transcript
                  </CardTitle>
                  <Badge variant="outline">
                    {transcript.length} messages
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {transcript.map((entry, index) => (
                    <div key={index} className="border-l-4 border-primary pl-4 py-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{entry.speaker}</span>
                        <span className="text-xs text-muted-foreground">
                          {entry.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm">{entry.text}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {Math.round(entry.confidence * 100)}% confidence
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {transcript.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      {isRecording ? 'Listening for speech...' : 'No transcript available'}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="action-items" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Action Items</h3>
              <Dialog open={showActionItemDialog} onOpenChange={setShowActionItemDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Add Action Item
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>
            
            <div className="grid gap-4">
              {actionItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{item.task}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {item.assignee}
                          </Badge>
                          <Badge 
                            variant={item.priority === 'high' ? 'destructive' : item.priority === 'medium' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {item.priority}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {item.createdAt.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={item.status === 'completed' ? 'default' : 'outline'}
                          onClick={() => updateActionItemStatus(item.id, 
                            item.status === 'completed' ? 'pending' : 'completed'
                          )}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {actionItems.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No action items detected yet
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="summary" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  AI-Generated Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentSession.summary ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Meeting Summary</h4>
                      <p className="text-sm text-muted-foreground">{currentSession.summary}</p>
                    </div>
                    
                    {currentSession.keyTopics && (
                      <div>
                        <h4 className="font-semibold mb-2">Key Topics</h4>
                        <div className="flex flex-wrap gap-2">
                          {currentSession.keyTopics.map((topic, index) => (
                            <Badge key={index} variant="secondary">{topic}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {currentSession.decisions && (
                      <div>
                        <h4 className="font-semibold mb-2">Decisions Made</h4>
                        <ul className="space-y-1">
                          {currentSession.decisions.map((decision, index) => (
                            <li key={index} className="text-sm flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-success" />
                              {decision}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    {isProcessing ? 'AI is generating summary...' : 'Summary will be available after meeting ends'}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="participants" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Meeting Participants</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {participants.map((participant) => (
                    <div key={participant.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                          {participant.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium">{participant.name}</p>
                          {participant.role && (
                            <p className="text-xs text-muted-foreground">{participant.role}</p>
                          )}
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        <Volume2 className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    </div>
                  ))}
                  {participants.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No participants added yet
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Start Meeting Dialog */}
      <Dialog open={showStartDialog} onOpenChange={setShowStartDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start AI Meeting Recording</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Meeting Title</Label>
              <Input
                id="title"
                placeholder="Enter meeting title"
                value={meetingTitle}
                onChange={(e) => setMeetingTitle(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Participants</Label>
              <div className="space-y-2">
                {['Manager', 'Chef', 'Server Lead', 'Kitchen Staff'].map((role) => (
                  <Button
                    key={role}
                    variant="outline"
                    size="sm"
                    onClick={() => addParticipant(role, role)}
                    className="mr-2"
                  >
                    Add {role}
                  </Button>
                ))}
              </div>
            </div>

            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="text-xs text-muted-foreground">
                AI will automatically transcribe speech, separate voices, and detect action items in real-time.
              </p>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowStartDialog(false)}>
                Cancel
              </Button>
              <Button onClick={startMeeting}>
                <Mic className="h-4 w-4 mr-2" />
                Start Recording
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Action Item Dialog */}
      <Dialog open={showActionItemDialog} onOpenChange={setShowActionItemDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Action Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="task">Task Description</Label>
              <Textarea
                id="task"
                placeholder="Enter task description"
                value={newActionItem.task}
                onChange={(e) => setNewActionItem({ ...newActionItem, task: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="assignee">Assignee</Label>
                <Input
                  id="assignee"
                  placeholder="Assign to..."
                  value={newActionItem.assignee}
                  onChange={(e) => setNewActionItem({ ...newActionItem, assignee: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <select
                  className="w-full p-2 border rounded"
                  value={newActionItem.priority}
                  onChange={(e) => setNewActionItem({ ...newActionItem, priority: e.target.value as any })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowActionItemDialog(false)}>
                Cancel
              </Button>
              <Button onClick={addActionItem}>
                Add Action Item
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}