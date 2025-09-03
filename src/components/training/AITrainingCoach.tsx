import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Lightbulb, 
  Target, 
  Clock,
  Sparkles,
  ChefHat,
  Brain
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Message {
  id: string;
  type: 'user' | 'coach';
  content: string;
  timestamp: Date;
  context?: string;
}

interface AITrainingCoachProps {
  lessonContext?: {
    lessonId: string;
    lessonTitle: string;
    courseTitle: string;
    content: any;
  };
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
}

const AITrainingCoach: React.FC<AITrainingCoachProps> = ({ 
  lessonContext, 
  isMinimized, 
  onToggleMinimize 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Welcome message when coach is opened
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        type: 'coach',
        content: lessonContext 
          ? `Hello! I'm your AI training coach. I'm here to help you master "${lessonContext.lessonTitle}" and answer any questions you have about the content. What would you like to know?`
          : `Hello! I'm your AI training coach. I'm here to help you with your culinary training journey. Ask me anything about cooking techniques, food safety, restaurant operations, or POS systems!`,
        timestamp: new Date(),
        context: lessonContext?.courseTitle
      };
      setMessages([welcomeMessage]);
    }
  }, [lessonContext]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const contextInfo = lessonContext 
        ? `Current lesson: ${lessonContext.lessonTitle} in ${lessonContext.courseTitle}. Lesson content includes: ${JSON.stringify(lessonContext.content).substring(0, 500)}...`
        : 'General training session';

      const { data, error } = await supabase.functions.invoke('ai-training-coach', {
        body: {
          prompt: userMessage.content,
          context: contextInfo,
          userId: user?.id,
          lessonId: lessonContext?.lessonId
        }
      });

      if (error) throw error;

      const coachMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'coach',
        content: data.response,
        timestamp: new Date(),
        context: lessonContext?.courseTitle
      };

      setMessages(prev => [...prev, coachMessage]);
    } catch (error) {
      console.error('Error getting coach response:', error);
      toast.error('Failed to get coach response');
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'coach',
        content: 'I apologize, but I encountered an error. Please try again or rephrase your question.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const suggestedQuestions = [
    "Can you explain this concept in simpler terms?",
    "What are the most important points to remember?",
    "How do I apply this in a real restaurant?",
    "What are common mistakes to avoid?",
    "Can you give me a practical example?"
  ];

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={onToggleMinimize}
          className="rounded-full w-16 h-16 bg-gradient-primary shadow-lg hover:shadow-xl transition-all"
        >
          <Bot className="w-8 h-8" />
        </Button>
      </div>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 h-[500px] z-50 flex flex-col shadow-2xl border-primary/20">
      <CardHeader className="bg-gradient-primary text-white p-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-lg">AI Training Coach</CardTitle>
              <p className="text-sm opacity-90">Your personalized culinary mentor</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleMinimize}
            className="text-white hover:bg-white/20"
          >
            ×
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.type === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className={
                    message.type === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-gradient-primary text-white'
                  }>
                    {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </AvatarFallback>
                </Avatar>
                
                <div className={`flex-1 ${message.type === 'user' ? 'text-right' : ''}`}>
                  <div
                    className={`inline-block p-3 rounded-lg max-w-[280px] ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground ml-auto'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex items-start gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-gradient-primary text-white">
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.1s]"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {messages.length <= 1 && (
          <div className="p-4 border-t bg-muted/30">
            <p className="text-sm text-muted-foreground mb-2">Try asking:</p>
            <div className="flex flex-wrap gap-1">
              {suggestedQuestions.slice(0, 3).map((question, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground text-xs"
                  onClick={() => setInputValue(question)}
                >
                  {question}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 border-t bg-background">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your training..."
              disabled={isLoading}
              className="flex-1 text-sm"
            />
            <Button
              onClick={sendMessage}
              disabled={!inputValue.trim() || isLoading}
              size="sm"
              className="px-3"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AITrainingCoach;