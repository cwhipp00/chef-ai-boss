import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Send, 
  Paperclip, 
  Smile, 
  MoreHorizontal, 
  Star, 
  Reply, 
  Edit, 
  Trash,
  Download,
  Image as ImageIcon,
  File,
  Check,
  CheckCheck,
  Clock,
  Pin,
  Hash,
  Users,
  Search,
  Filter
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  sender_name: string;
  sender_avatar?: string;
  channel_id: string;
  created_at: string;
  updated_at?: string;
  message_type: 'text' | 'image' | 'file' | 'system';
  file_url?: string;
  file_name?: string;
  file_size?: number;
  reply_to?: string;
  reactions?: MessageReaction[];
  read_by?: string[];
  edited: boolean;
}

interface MessageReaction {
  emoji: string;
  users: string[];
  count: number;
}

interface Channel {
  id: string;
  name: string;
  description?: string;
  type: 'public' | 'private' | 'direct';
  members: string[];
  created_by: string;
  created_at: string;
  unread_count: number;
  last_message?: Message;
}

interface RealTimeChatProps {
  selectedChannel: string;
  currentUserId: string;
  onChannelChange: (channelId: string) => void;
}

export function RealTimeChat({ selectedChannel, currentUserId, onChannelChange }: RealTimeChatProps) {
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load messages for selected channel
  useEffect(() => {
    if (!selectedChannel) return;

    const loadMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select(`
            *,
            reactions:message_reactions(*)
          `)
          .eq('channel_id', selectedChannel)
          .order('created_at', { ascending: true })
          .limit(100);

        if (error) throw error;
        setMessages(data || []);
      } catch (error) {
        console.error('Error loading messages:', error);
        toast({
          title: "Error",
          description: "Failed to load messages",
          variant: "destructive",
        });
      }
    };

    loadMessages();
  }, [selectedChannel, toast]);

  // Real-time message subscription
  useEffect(() => {
    if (!selectedChannel) return;

    const channel = supabase
      .channel(`messages_${selectedChannel}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `channel_id=eq.${selectedChannel}`
      }, (payload) => {
        const newMessage = payload.new as Message;
        setMessages(prev => [...prev, newMessage]);
        
        // Mark as read
        markMessageAsRead(newMessage.id);
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'messages',
        filter: `channel_id=eq.${selectedChannel}`
      }, (payload) => {
        const updatedMessage = payload.new as Message;
        setMessages(prev => prev.map(msg => 
          msg.id === updatedMessage.id ? updatedMessage : msg
        ));
      })
      .on('postgres_changes', {
        event: 'DELETE',
        schema: 'public',
        table: 'messages',
        filter: `channel_id=eq.${selectedChannel}`
      }, (payload) => {
        const deletedMessage = payload.old as Message;
        setMessages(prev => prev.filter(msg => msg.id !== deletedMessage.id));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedChannel]);

  // Typing indicator
  useEffect(() => {
    if (!selectedChannel) return;

    const channel = supabase
      .channel(`typing_${selectedChannel}`)
      .on('presence', { event: 'sync' }, () => {
        const newState = channel.presenceState();
        const typingUsers = Object.values(newState).flat()
          .filter((user: any) => user.typing && user.user_id !== currentUserId)
          .map((user: any) => user.user_name);
        setTypingUsers(typingUsers);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedChannel, currentUserId]);

  // Send typing indicator
  const sendTypingIndicator = async (isTyping: boolean) => {
    if (!selectedChannel) return;

    try {
      const channel = supabase.channel(`typing_${selectedChannel}`);
      await channel.track({
        user_id: currentUserId,
        user_name: 'Current User', // Replace with actual user name
        typing: isTyping,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error sending typing indicator:', error);
    }
  };

  // Handle input change with typing indicator
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
    
    if (!isTyping && e.target.value.length > 0) {
      setIsTyping(true);
      sendTypingIndicator(true);
      
      // Stop typing indicator after 3 seconds of inactivity
      setTimeout(() => {
        setIsTyping(false);
        sendTypingIndicator(false);
      }, 3000);
    } else if (isTyping && e.target.value.length === 0) {
      setIsTyping(false);
      sendTypingIndicator(false);
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChannel) return;

    try {
      const messageData: Partial<Message> = {
        content: newMessage,
        sender_id: currentUserId,
        sender_name: 'Current User', // Replace with actual user name
        channel_id: selectedChannel,
        message_type: 'text',
        reply_to: replyingTo?.id,
        edited: false
      };

      const { error } = await supabase
        .from('messages')
        .insert(messageData);

      if (error) throw error;

      setNewMessage('');
      setReplyingTo(null);
      setIsTyping(false);
      sendTypingIndicator(false);
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    if (!selectedChannel) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `chat-files/${selectedChannel}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('chat-attachments')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('chat-attachments')
        .getPublicUrl(filePath);

      const messageData: Partial<Message> = {
        content: `Shared a file: ${file.name}`,
        sender_id: currentUserId,
        sender_name: 'Current User', // Replace with actual user name
        channel_id: selectedChannel,
        message_type: file.type.startsWith('image/') ? 'image' : 'file',
        file_url: publicUrl,
        file_name: file.name,
        file_size: file.size,
        edited: false
      };

      const { error } = await supabase
        .from('messages')
        .insert(messageData);

      if (error) throw error;

      toast({
        title: "File Uploaded",
        description: `${file.name} has been shared`,
      });

    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Upload Error",
        description: "Failed to upload file",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Mark message as read
  const markMessageAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('message_reads')
        .upsert({
          message_id: messageId,
          user_id: currentUserId,
          read_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  // Add reaction to message
  const addReaction = async (messageId: string, emoji: string) => {
    try {
      const { error } = await supabase
        .from('message_reactions')
        .upsert({
          message_id: messageId,
          user_id: currentUserId,
          emoji: emoji
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  // Edit message
  const editMessage = async (messageId: string, newContent: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({
          content: newContent,
          edited: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', messageId);

      if (error) throw error;
      setEditingMessage(null);
    } catch (error) {
      console.error('Error editing message:', error);
    }
  };

  // Delete message
  const deleteMessage = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  // Format message timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return format(date, 'MMM d, yyyy');
  };

  // Render message content
  const renderMessageContent = (message: Message) => {
    switch (message.message_type) {
      case 'image':
        return (
          <div className="space-y-2">
            <p className="text-sm">{message.content}</p>
            {message.file_url && (
              <img 
                src={message.file_url} 
                alt={message.file_name}
                className="max-w-sm rounded-lg cursor-pointer hover:opacity-80"
                onClick={() => window.open(message.file_url, '_blank')}
              />
            )}
          </div>
        );
      
      case 'file':
        return (
          <div className="space-y-2">
            <p className="text-sm">{message.content}</p>
            {message.file_url && (
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg max-w-sm">
                <File className="h-8 w-8 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{message.file_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {message.file_size ? `${(message.file_size / 1024 / 1024).toFixed(2)} MB` : 'Unknown size'}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(message.file_url, '_blank')}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        );
      
      default:
        return <p className="text-sm">{message.content}</p>;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="flex gap-3 group hover:bg-muted/20 p-2 rounded-lg -mx-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={message.sender_avatar} />
              <AvatarFallback className="text-xs bg-gradient-to-br from-primary/20 to-accent/20">
                {message.sender_name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium">{message.sender_name}</span>
                <span className="text-xs text-muted-foreground">
                  {formatTimestamp(message.created_at)}
                </span>
                {message.edited && (
                  <Badge variant="outline" className="text-xs">edited</Badge>
                )}
              </div>
              
              {/* Reply indicator */}
              {message.reply_to && (
                <div className="mb-2 pl-4 border-l-2 border-muted">
                  <p className="text-xs text-muted-foreground">Replying to a message</p>
                </div>
              )}
              
              {/* Message content */}
              {editingMessage === message.id ? (
                <div className="space-y-2">
                  <Textarea
                    defaultValue={message.content}
                    className="text-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        editMessage(message.id, e.currentTarget.value);
                      }
                      if (e.key === 'Escape') {
                        setEditingMessage(null);
                      }
                    }}
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => setEditingMessage(null)}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                renderMessageContent(message)
              )}
              
              {/* Reactions */}
              {message.reactions && message.reactions.length > 0 && (
                <div className="flex gap-1 mt-2">
                  {message.reactions.map((reaction) => (
                    <Button
                      key={reaction.emoji}
                      variant="outline"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => addReaction(message.id, reaction.emoji)}
                    >
                      {reaction.emoji} {reaction.count}
                    </Button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Message actions */}
            <div className="opacity-0 group-hover:opacity-100 flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => addReaction(message.id, '👍')}
              >
                <Smile className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => setReplyingTo(message)}
              >
                <Reply className="h-3 w-3" />
              </Button>
              {message.sender_id === currentUserId && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => setEditingMessage(message.id)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => deleteMessage(message.id)}
                  >
                    <Trash className="h-3 w-3" />
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
        
        {/* Typing indicator */}
        {typingUsers.length > 0 && (
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
            <span>
              {typingUsers.length === 1 
                ? `${typingUsers[0]} is typing...` 
                : `${typingUsers.length} people are typing...`
              }
            </span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Reply indicator */}
      {replyingTo && (
        <div className="px-4 py-2 bg-muted/50 border-t">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <span className="text-muted-foreground">Replying to </span>
              <span className="font-medium">{replyingTo.sender_name}</span>
              <p className="text-xs text-muted-foreground truncate max-w-xs">
                {replyingTo.content}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReplyingTo(null)}
            >
              ✕
            </Button>
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Textarea
              placeholder={`Message #${selectedChannel}`}
              value={newMessage}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              className="min-h-[60px] pr-20 resize-none"
            />
            <div className="absolute bottom-2 right-2 flex gap-1">
              <input
                ref={fileInputRef}
                type="file"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
              />
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                <Paperclip className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
              >
                <Smile className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <Button
            size="sm"
            onClick={sendMessage}
            disabled={!newMessage.trim() || isUploading}
            className="bg-gradient-primary self-end h-10"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}