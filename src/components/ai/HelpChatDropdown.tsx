import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  HelpCircle, 
  Send, 
  Bot, 
  User, 
  X, 
  Minimize2,
  Maximize2,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface HelpChatDropdownProps {
  className?: string;
}

export const HelpChatDropdown = ({ className }: HelpChatDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your Chef AI Assistant. I can help you with recipes, restaurant management, staff training, and any questions about using the platform. How can I assist you today?",
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (isOpen && !isMinimized) {
          setIsMinimized(true);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, isMinimized]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-assistant', {
        body: {
          message: inputValue,
          context: 'help_chat',
          conversation_history: messages.slice(-5) // Send last 5 messages for context
        }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || "I'm sorry, I couldn't process that request. Please try again.",
        sender: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble connecting right now. Please try again in a moment.",
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    if (isOpen) {
      setIsOpen(false);
      setIsMinimized(false);
    } else {
      setIsOpen(true);
      setIsMinimized(false);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      {/* Help Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleChat}
        className={cn(
          "relative h-8 w-8 lg:h-10 lg:w-10 p-0 hover:bg-primary/10 transition-all duration-200",
          isOpen && "bg-primary/10 text-primary"
        )}
        title="AI Assistant Help"
      >
        <HelpCircle className="h-4 w-4 lg:h-5 lg:w-5" />
        {isOpen && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
        )}
      </Button>

      {/* Chat Dropdown */}
      {isOpen && (
        <Card className={cn(
          "absolute right-0 top-12 w-80 lg:w-96 shadow-lg border-primary/20 z-50 transition-all duration-200",
          isMinimized ? "h-12" : "h-96",
          "bg-card/95 backdrop-blur-sm"
        )}>
          {/* Header */}
          <CardHeader className="pb-2 px-4 py-3 border-b border-primary/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-sm font-semibold">Chef AI Assistant</CardTitle>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-xs text-muted-foreground">Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMinimize}
                  className="h-6 w-6 p-0 hover:bg-primary/10"
                >
                  {isMinimized ? (
                    <Maximize2 className="h-3 w-3" />
                  ) : (
                    <Minimize2 className="h-3 w-3" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleChat}
                  className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardHeader>

          {/* Messages */}
          {!isMinimized && (
            <>
              <CardContent className="p-0">
                <ScrollArea className="h-64 px-4 py-2">
                  <div className="space-y-3">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "flex gap-2 animate-in slide-in-from-bottom-2 duration-200",
                          message.sender === 'user' ? "justify-end" : "justify-start"
                        )}
                      >
                        {message.sender === 'assistant' && (
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 flex-shrink-0 mt-1">
                            <Bot className="w-3 h-3 text-primary" />
                          </div>
                        )}
                        <div
                          className={cn(
                            "max-w-[85%] rounded-lg px-3 py-2 text-sm",
                            message.sender === 'user'
                              ? "bg-primary text-primary-foreground ml-auto"
                              : "bg-muted/50 text-foreground"
                          )}
                        >
                          <p className="break-words">{message.text}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        {message.sender === 'user' && (
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted/50 flex-shrink-0 mt-1">
                            <User className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex gap-2 justify-start">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 flex-shrink-0 mt-1">
                          <Bot className="w-3 h-3 text-primary" />
                        </div>
                        <div className="bg-muted/50 rounded-lg px-3 py-2 text-sm">
                          <div className="flex items-center gap-1">
                            <Sparkles className="w-3 h-3 animate-spin" />
                            <span className="text-muted-foreground">Thinking...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div ref={messagesEndRef} />
                </ScrollArea>
              </CardContent>

              {/* Input */}
              <div className="border-t border-primary/10 p-3">
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about the platform..."
                    className="flex-1 text-sm"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    size="sm"
                    className="px-3"
                  >
                    <Send className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs py-0">
                    <Sparkles className="w-3 h-3 mr-1" />
                    AI-Powered
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Press Enter to send
                  </span>
                </div>
              </div>
            </>
          )}
        </Card>
      )}
    </div>
  );
};