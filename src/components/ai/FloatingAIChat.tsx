import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  Send, 
  X, 
  Minimize2,
  Maximize2,
  Sparkles,
  Camera,
  ImagePlus,
  Mic,
  Search,
  ChefHat
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  image?: string;
}

interface FloatingAIChatProps {
  className?: string;
}

export const FloatingAIChat = ({ className }: FloatingAIChatProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm ChefCentral AI, your intelligent restaurant assistant. I can help you with recipes, operations, staff management, finding information, and anything else you need. I can also analyze images you upload!",
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickActions = [
    { icon: Search, text: "Find information", prompt: "Help me find information about " },
    { icon: ChefHat, text: "Recipe help", prompt: "I need help with a recipe for " },
    { icon: Bot, text: "App guidance", prompt: "How do I use the " },
    { icon: Sparkles, text: "Suggestions", prompt: "Can you suggest ways to improve " }
  ];

  const handleSendMessage = async (messageText?: string, imageFile?: File) => {
    const textToSend = messageText || inputValue;
    if ((!textToSend.trim() && !imageFile) || isLoading) return;

    let imageUrl = '';
    if (imageFile) {
      // Handle image upload here - for now we'll use a placeholder
      imageUrl = URL.createObjectURL(imageFile);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend || 'Uploaded an image',
      sender: 'user',
      timestamp: new Date(),
      image: imageUrl || undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-assistant', {
        body: {
          message: textToSend,
          context: 'floating_chat',
          hasImage: !!imageFile,
          conversation_history: messages.slice(-5)
        }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || "I'm here to help! What would you like to know about the restaurant management platform?",
        sender: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble connecting right now. Please try again in a moment, or check your internet connection.",
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleSendMessage("Please analyze this image", file);
    } else {
      toast.error('Please select a valid image file.');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleSendMessage("Please analyze this image", imageFile);
    } else {
      toast.error('Please drop a valid image file.');
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
    <div className={cn("fixed bottom-6 right-6 z-50", className)}>
      {/* Floating AI Button */}
      {!isOpen && (
        <Button
          onClick={toggleChat}
          className="h-14 w-14 rounded-full shadow-xl bg-gradient-to-br from-primary via-primary to-accent hover:scale-105 transition-all duration-300 group relative overflow-hidden"
        >
          {/* Animated background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/30 to-primary/20 rounded-full blur-xl animate-pulse"></div>
          
          {/* Floating particles effect */}
          <div className="absolute top-1 left-2 w-1 h-1 bg-white/40 rounded-full animate-ping" style={{ animationDelay: '0s' }}></div>
          <div className="absolute top-3 right-1 w-0.5 h-0.5 bg-white/60 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-2 left-1 w-0.5 h-0.5 bg-white/40 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
          
          <div className="relative z-10 flex items-center justify-center">
            <Bot className="h-6 w-6 text-white group-hover:rotate-12 transition-transform duration-300" />
          </div>
          
          {/* Notification dot */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
        </Button>
      )}

      {/* Chat Interface */}
      {isOpen && (
        <Card className={cn(
          "w-80 lg:w-96 shadow-2xl border-primary/20 transition-all duration-300 bg-card/95 backdrop-blur-sm",
          isMinimized ? "h-16" : "h-[32rem]"
        )}>
          {/* Header */}
          <CardHeader className="pb-2 px-4 py-3 border-b border-primary/10 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                </div>
                <div>
                  <CardTitle className="text-sm font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    ChefCentral AI
                  </CardTitle>
                  <div className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-primary animate-pulse" />
                    <span className="text-xs text-muted-foreground">Always Ready</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMinimize}
                  className="h-7 w-7 p-0 hover:bg-primary/10"
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
                  className="h-7 w-7 p-0 hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardHeader>

          {/* Chat Content */}
          {!isMinimized && (
            <>
              {/* Messages */}
              <CardContent className="p-0">
                <div
                  className={cn(
                    "h-72 px-4 py-2 transition-colors duration-200",
                    dragActive && "bg-primary/5 border-2 border-dashed border-primary/20"
                  )}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <ScrollArea className="h-full">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={cn(
                            "flex gap-2 animate-in slide-in-from-bottom-2 duration-300",
                            message.sender === 'user' ? "justify-end" : "justify-start"
                          )}
                        >
                          {message.sender === 'assistant' && (
                            <div className="flex items-start justify-center w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent flex-shrink-0 mt-0.5">
                              <Bot className="w-4 h-4 text-white mt-1.5" />
                            </div>
                          )}
                          <div className="max-w-[85%] space-y-2">
                            {message.image && (
                              <img
                                src={message.image}
                                alt="Uploaded image"
                                className="max-w-full h-32 object-cover rounded-lg border border-primary/20"
                              />
                            )}
                            <div
                              className={cn(
                                "rounded-2xl px-4 py-2.5 text-sm shadow-sm",
                                message.sender === 'user'
                                  ? "bg-gradient-to-br from-primary to-accent text-white ml-auto rounded-br-md"
                                  : "bg-muted/80 text-foreground border border-primary/10 rounded-bl-md"
                              )}
                            >
                              <p className="break-words leading-relaxed">{message.text}</p>
                              <p className={cn(
                                "text-xs mt-2 opacity-70",
                                message.sender === 'user' ? "text-white/70" : "text-muted-foreground"
                              )}>
                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {isLoading && (
                        <div className="flex gap-2 justify-start">
                          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent flex-shrink-0">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                          <div className="bg-muted/80 rounded-2xl rounded-bl-md px-4 py-2.5 text-sm border border-primary/10">
                            <div className="flex items-center gap-2">
                              <Sparkles className="w-4 h-4 animate-spin text-primary" />
                              <span className="text-muted-foreground">Thinking...</span>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {dragActive && (
                        <div className="flex justify-center py-8">
                          <div className="flex flex-col items-center gap-2 text-primary">
                            <ImagePlus className="w-8 h-8" />
                            <p className="text-sm font-medium">Drop your image here</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div ref={messagesEndRef} />
                  </ScrollArea>
                </div>
              </CardContent>

              {/* Quick Actions */}
              <div className="px-4 py-2 border-t border-primary/10">
                <div className="grid grid-cols-2 gap-1">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      onClick={() => setInputValue(action.prompt)}
                      className="h-auto py-1.5 px-2 justify-start text-xs hover:bg-primary/10"
                      disabled={isLoading}
                    >
                      <action.icon className="w-3 h-3 mr-1.5 flex-shrink-0" />
                      <span className="truncate">{action.text}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <div className="border-t border-primary/10 p-3 bg-gradient-to-r from-card via-card to-primary/2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything or drag an image..."
                      className="pr-12 text-sm bg-background/50 border-primary/20 focus:border-primary/40"
                      disabled={isLoading}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 hover:bg-primary/10"
                      disabled={isLoading}
                    >
                      <Camera className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button
                    onClick={() => handleSendMessage()}
                    disabled={!inputValue.trim() || isLoading}
                    size="sm"
                    className="px-3 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                  >
                    <Send className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs py-0 px-2 border-primary/30">
                      <Sparkles className="w-3 h-3 mr-1" />
                      AI-Powered
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Press Enter to send
                  </span>
                </div>
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </>
          )}
        </Card>
      )}
    </div>
  );
};