import React, { useState, useRef, useCallback } from 'react';
import { Mic, MicOff, Square, Play, Pause, Upload, Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface VoiceRecordingProps {
  onTranscriptionComplete?: (text: string) => void;
  onAudioSave?: (audioBlob: Blob, transcription: string) => void;
  maxDuration?: number; // in seconds
}

export const VoiceRecording = ({ 
  onTranscriptionComplete, 
  onAudioSave, 
  maxDuration = 300 
}: VoiceRecordingProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [transcription, setTranscription] = useState<string>('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const { toast } = useToast();

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        }
      });
      
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        
        // Stop all audio tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current.start(1000); // Record in 1-second chunks
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1;
          if (newTime >= maxDuration) {
            stopRecording();
          }
          return newTime;
        });
      }, 1000);
      
      toast({
        title: "Recording Started",
        description: "Speak clearly into your microphone",
      });
    } catch (error) {
      toast({
        title: "Recording Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  }, [maxDuration, toast]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      toast({
        title: "Recording Stopped",
        description: "Audio ready for playback or transcription",
      });
    }
  }, [isRecording, toast]);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        setIsPaused(false);
        
        // Resume timer
        timerRef.current = setInterval(() => {
          setRecordingTime(prev => {
            const newTime = prev + 1;
            if (newTime >= maxDuration) {
              stopRecording();
            }
            return newTime;
          });
        }, 1000);
      } else {
        mediaRecorderRef.current.pause();
        setIsPaused(true);
        
        // Pause timer
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      }
    }
  }, [isRecording, isPaused, maxDuration, stopRecording]);

  const playAudio = useCallback(() => {
    if (audioBlob && !isPlaying) {
      const url = URL.createObjectURL(audioBlob);
      audioRef.current = new Audio(url);
      
      audioRef.current.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(url);
      };
      
      audioRef.current.play();
      setIsPlaying(true);
    } else if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [audioBlob, isPlaying]);

  const transcribeAudio = useCallback(async () => {
    if (!audioBlob) return;
    
    setIsTranscribing(true);
    
    try {
      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsArrayBuffer(audioBlob);
      
      reader.onloadend = async () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        const base64Audio = btoa(
          String.fromCharCode(...new Uint8Array(arrayBuffer))
        );
        
        // TODO: Replace with actual transcription service
        // For now, simulate transcription
        setTimeout(() => {
          const mockTranscription = "This is a mock transcription of your audio recording. The actual implementation would use a speech-to-text service.";
          setTranscription(mockTranscription);
          onTranscriptionComplete?.(mockTranscription);
          setIsTranscribing(false);
          
          toast({
            title: "Transcription Complete",
            description: "Your audio has been converted to text",
          });
        }, 2000);
      };
    } catch (error) {
      setIsTranscribing(false);
      toast({
        title: "Transcription Error",
        description: "Failed to transcribe audio. Please try again.",
        variant: "destructive",
      });
    }
  }, [audioBlob, onTranscriptionComplete, toast]);

  const saveRecording = useCallback(() => {
    if (audioBlob) {
      onAudioSave?.(audioBlob, transcription);
      toast({
        title: "Recording Saved",
        description: "Your voice recording has been saved successfully",
      });
    }
  }, [audioBlob, transcription, onAudioSave, toast]);

  const clearRecording = useCallback(() => {
    setAudioBlob(null);
    setTranscription('');
    setRecordingTime(0);
    setIsPlaying(false);
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    
    toast({
      title: "Recording Cleared",
      description: "Ready for a new recording",
    });
  }, [toast]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (recordingTime / maxDuration) * 100;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="h-5 w-5" />
          Voice Recording
          {isRecording && <Badge variant="destructive" className="animate-pulse">REC</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Recording Controls */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
            {!isRecording ? (
              <Button
                onClick={startRecording}
                size="lg"
                className="bg-destructive hover:bg-destructive/90 text-white"
                disabled={!!audioBlob}
              >
                <Mic className="h-5 w-5 mr-2" />
                Start Recording
              </Button>
            ) : (
              <>
                <Button
                  onClick={pauseRecording}
                  size="lg"
                  variant="outline"
                >
                  {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
                </Button>
                <Button
                  onClick={stopRecording}
                  size="lg"
                  variant="destructive"
                >
                  <Square className="h-5 w-5" />
                </Button>
              </>
            )}
          </div>

          {/* Recording Progress */}
          {(isRecording || recordingTime > 0) && (
            <div className="w-full max-w-xs space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{formatTime(recordingTime)}</span>
                <span>{formatTime(maxDuration)}</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}
        </div>

        {/* Playback Controls */}
        {audioBlob && (
          <div className="space-y-4">
            <div className="flex justify-center gap-3">
              <Button
                onClick={playAudio}
                variant="outline"
                size="sm"
              >
                {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
              <Button
                onClick={transcribeAudio}
                variant="outline"
                size="sm"
                disabled={isTranscribing}
              >
                <Upload className="h-4 w-4 mr-2" />
                {isTranscribing ? 'Transcribing...' : 'Transcribe'}
              </Button>
              <Button
                onClick={saveRecording}
                variant="outline"
                size="sm"
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button
                onClick={clearRecording}
                variant="outline"
                size="sm"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        )}

        {/* Transcription Result */}
        {transcription && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Transcription:</h4>
            <div className="p-3 bg-muted/30 rounded-lg border">
              <p className="text-sm text-foreground">{transcription}</p>
            </div>
          </div>
        )}

        {/* Status Indicators */}
        <div className="flex justify-center gap-2 text-xs text-muted-foreground">
          {isRecording && !isPaused && (
            <Badge variant="destructive" className="animate-pulse">
              Recording...
            </Badge>
          )}
          {isPaused && (
            <Badge variant="secondary">
              Paused
            </Badge>
          )}
          {isTranscribing && (
            <Badge variant="secondary" className="animate-pulse">
              Transcribing...
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};