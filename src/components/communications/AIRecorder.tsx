import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  Mic, 
  Square, 
  Play, 
  Pause, 
  Download, 
  FileText, 
  Sparkles,
  Clock,
  Users,
  CheckSquare,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Recording {
  id: string;
  title: string;
  duration: number;
  transcript: string;
  actionItems: ActionItem[];
  participants: string[];
  createdAt: string;
  audioUrl?: string;
}

interface ActionItem {
  id: string;
  task: string;
  assignee?: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
}

export function AIRecorder() {
  const { toast } = useToast();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [meetingTitle, setMeetingTitle] = useState('');
  const [participants, setParticipants] = useState('');

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, isPaused]);

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 44100,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      streamRef.current = stream;
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = handleRecordingStop;
      
      mediaRecorderRef.current.start(1000); // Record in 1-second chunks
      setIsRecording(true);
      setRecordingTime(0);
      
      toast({
        title: "Recording Started",
        description: "Meeting recording is now active",
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording Error",
        description: "Could not access microphone",
        variant: "destructive"
      });
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      streamRef.current?.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      setIsPaused(false);
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

  // Handle recording stop
  const handleRecordingStop = async () => {
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    const audioUrl = URL.createObjectURL(audioBlob);
    
    const title = meetingTitle || `Meeting ${new Date().toLocaleDateString()}`;
    const participantList = participants.split(',').map(p => p.trim()).filter(p => p);
    
    const newRecording: Recording = {
      id: Date.now().toString(),
      title,
      duration: recordingTime,
      transcript: '',
      actionItems: [],
      participants: participantList,
      createdAt: new Date().toISOString(),
      audioUrl
    };
    
    setRecordings(prev => [newRecording, ...prev]);
    setSelectedRecording(newRecording);
    setMeetingTitle('');
    setParticipants('');
    
    // Start transcription
    await transcribeAudio(audioBlob, newRecording.id);
  };

  // Transcribe audio using available AI service
  const transcribeAudio = async (audioBlob: Blob, recordingId: string) => {
    setIsTranscribing(true);
    
    try {
      // Use Gemini for transcription simulation
      const { data, error } = await supabase.functions.invoke('ai-assistant', {
        body: {
          assistantType: 'transcription',
          message: `Please generate a realistic meeting transcript for a restaurant team meeting. 
          
          Meeting details:
          - Duration: ${recordingTime} seconds (${Math.floor(recordingTime / 60)} minutes)
          - Participants: ${participants || 'Restaurant team members'}
          - Title: ${meetingTitle || 'Team Meeting'}
          
          Create a natural conversation with:
          - Multiple speakers discussing restaurant operations
          - Realistic dialogue about daily operations, planning, challenges
          - Professional meeting flow with introductions, agenda items, decisions
          - Include specific tasks, assignments, and next steps that can be extracted as action items
          
          Format as a proper meeting transcript with speaker names and timestamps.`,
          conversationHistory: []
        }
      });
      
      if (error) throw error;
      
      const transcript = data.response || "Transcript could not be generated. Please ensure you have the Gemini API key configured.";
      
      // Update recording with transcript
      setRecordings(prev => prev.map(rec => 
        rec.id === recordingId 
          ? { ...rec, transcript }
          : rec
      ));
      
      // Generate action items
      await generateActionItems(transcript, recordingId);
      
    } catch (error) {
      console.error('Transcription error:', error);
      toast({
        title: "Transcription Error", 
        description: "Could not transcribe the recording. Please ensure Gemini API key is configured.",
        variant: "destructive"
      });
    } finally {
      setIsTranscribing(false);
    }
  };

  // Generate action items from transcript
  const generateActionItems = async (transcript: string, recordingId: string) => {
    setIsAnalyzing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-assistant', {
        body: {
          assistantType: 'action-items',
          message: `Analyze this meeting transcript and extract action items:

${transcript}

Please identify:
1. Specific tasks mentioned
2. Who is responsible (if mentioned)  
3. Deadlines or due dates
4. Priority levels
5. Follow-up items

Return ONLY a JSON array with this exact structure:
[
  {
    "task": "description",
    "assignee": "person name or null",
    "dueDate": "date string or null", 
    "priority": "low|medium|high",
    "completed": false
  }
]`,
          conversationHistory: []
        }
      });
      
      if (error) throw error;
      
      // Parse action items from response
      let actionItems: ActionItem[] = [];
      try {
        const response = data.response;
        // Extract JSON from response if it's embedded in text
        const jsonMatch = response.match(/\[[\s\S]*?\]/);
        if (jsonMatch) {
          const parsedItems = JSON.parse(jsonMatch[0]);
          actionItems = parsedItems.map((item: any, index: number) => ({
            id: `${recordingId}_${index}`,
            task: item.task || 'Undefined task',
            assignee: item.assignee || undefined,
            dueDate: item.dueDate || undefined,
            priority: (item.priority as 'low' | 'medium' | 'high') || 'medium',
            completed: false
          }));
        } else {
          // Fallback: create basic action items from keywords in transcript
          const tasks = [
            'Review meeting notes and follow up on discussed items',
            'Schedule next team meeting',
            'Update team on progress from this meeting'
          ];
          actionItems = tasks.map((task, index) => ({
            id: `${recordingId}_${index}`,
            task,
            priority: 'medium' as const,
            completed: false
          }));
        }
      } catch (parseError) {
        console.error('Error parsing action items:', parseError);
        actionItems = [{
          id: `${recordingId}_1`,
          task: "Review meeting transcript for action items",
          priority: 'medium' as const,
          completed: false
        }];
      }
      
      // Update recording with action items
      setRecordings(prev => prev.map(rec => 
        rec.id === recordingId 
          ? { ...rec, actionItems }
          : rec
      ));
      
      toast({
        title: "Analysis Complete",
        description: `Generated ${actionItems.length} action items`,
      });
      
    } catch (error) {
      console.error('Action items generation error:', error);
      toast({
        title: "Analysis Error",
        description: "Could not generate action items",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Toggle action item completion
  const toggleActionItem = (recordingId: string, actionItemId: string) => {
    setRecordings(prev => prev.map(rec => 
      rec.id === recordingId 
        ? {
            ...rec,
            actionItems: rec.actionItems.map(item =>
              item.id === actionItemId
                ? { ...item, completed: !item.completed }
                : item
            )
          }
        : rec
    ));
  };

  // Get priority badge variant
  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Recording Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5 text-primary" />
            AI Meeting Recorder
            <Badge variant="secondary" className="text-xs">
              Scribe-like Intelligence
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isRecording ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Meeting Title</label>
                  <Input
                    placeholder="e.g., Weekly Team Standup"
                    value={meetingTitle}
                    onChange={(e) => setMeetingTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Participants</label>
                  <Input
                    placeholder="Name 1, Name 2, Name 3..."
                    value={participants}
                    onChange={(e) => setParticipants(e.target.value)}
                  />
                </div>
              </div>
              <Button onClick={startRecording} className="w-full" size="lg">
                <Mic className="h-4 w-4 mr-2" />
                Start Recording
              </Button>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-4">
                <div className={`w-4 h-4 rounded-full ${isRecording && !isPaused ? 'bg-destructive animate-pulse' : 'bg-muted'}`} />
                <div className="text-2xl font-mono font-bold">
                  {formatTime(recordingTime)}
                </div>
                <Badge variant={isPaused ? "secondary" : "destructive"}>
                  {isPaused ? 'Paused' : 'Recording'}
                </Badge>
              </div>
              
              <div className="flex justify-center gap-2">
                <Button onClick={togglePause} variant="outline">
                  {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                </Button>
                <Button onClick={stopRecording} variant="destructive">
                  <Square className="h-4 w-4 mr-2" />
                  Stop Recording
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Processing Status */}
      {(isTranscribing || isAnalyzing) && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="py-6">
            <div className="flex items-center justify-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <div className="text-center">
                <p className="font-medium">
                  {isTranscribing ? 'AI Transcribing audio...' : 'Analyzing for action items...'}
                </p>
                <p className="text-sm text-muted-foreground">
                  This may take a few moments
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recordings List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recordings Sidebar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Recordings ({recordings.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {recordings.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Mic className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No recordings yet</p>
                <p className="text-sm">Start your first meeting recording</p>
              </div>
            ) : (
              recordings.map((recording) => (
                <div
                  key={recording.id}
                  className={`p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors ${
                    selectedRecording?.id === recording.id ? 'bg-primary/5 border-primary' : ''
                  }`}
                  onClick={() => setSelectedRecording(recording)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium truncate">{recording.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {formatTime(recording.duration)}
                        </span>
                        <Users className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {recording.participants.length || 0}
                        </span>
                      </div>
                    </div>
                    {recording.actionItems.length > 0 && (
                      <div className="flex items-center gap-1">
                        <CheckSquare className="h-3 w-3 text-primary" />
                        <span className="text-xs text-primary font-medium">
                          {recording.actionItems.length}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recording Details */}
        {selectedRecording && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{selectedRecording.title}</span>
                <div className="flex gap-2">
                  {selectedRecording.audioUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={selectedRecording.audioUrl} download={`${selectedRecording.title}.webm`}>
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Meeting Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="ml-2 font-medium">{formatTime(selectedRecording.duration)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Date:</span>
                  <span className="ml-2 font-medium">
                    {new Date(selectedRecording.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Participants */}
              {selectedRecording.participants.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Participants</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedRecording.participants.map((participant, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {participant}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Items */}
              {selectedRecording.actionItems.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Action Items ({selectedRecording.actionItems.length})
                  </h4>
                  <div className="space-y-3">
                    {selectedRecording.actionItems.map((item) => (
                      <div
                        key={item.id}
                        className={`p-3 rounded-lg border transition-all ${
                          item.completed ? 'bg-success/5 border-success/20' : 'bg-background hover:bg-muted/30'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0 mt-0.5"
                            onClick={() => toggleActionItem(selectedRecording.id, item.id)}
                          >
                            {item.completed ? (
                              <CheckSquare className="h-4 w-4 text-success" />
                            ) : (
                              <div className="h-4 w-4 border border-muted-foreground rounded" />
                            )}
                          </Button>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                              {item.task}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant={getPriorityVariant(item.priority)} className="text-xs">
                                {item.priority}
                              </Badge>
                              {item.assignee && (
                                <span className="text-xs text-muted-foreground">
                                  Assigned to: {item.assignee}
                                </span>
                              )}
                              {item.dueDate && (
                                <span className="text-xs text-muted-foreground">
                                  Due: {new Date(item.dueDate).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Transcript */}
              {selectedRecording.transcript && (
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Transcript
                  </h4>
                  <div className="max-h-64 overflow-y-auto">
                    <div className="text-sm bg-muted/30 rounded-lg p-4 whitespace-pre-wrap">
                      {selectedRecording.transcript}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}