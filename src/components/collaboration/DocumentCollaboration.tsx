import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  FileText, 
  Plus, 
  Share, 
  Users, 
  Edit, 
  Save, 
  Download, 
  Upload, 
  MessageSquare,
  Eye,
  Clock,
  Search,
  Filter,
  Star,
  Trash2
} from 'lucide-react';

interface CollaborativeDocument {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'markdown' | 'code';
  created_by: string;
  created_at: string;
  updated_at: string;
  collaborators: DocumentCollaborator[];
  comments: DocumentComment[];
  version: number;
}

interface DocumentCollaborator {
  id: string;
  user_id: string;
  user_name: string;
  permission: 'view' | 'edit' | 'admin';
  cursor_position?: number;
  selection?: { start: number; end: number };
  last_seen: string;
  color: string;
}

interface DocumentComment {
  id: string;
  content: string;
  author: string;
  position: number;
  created_at: string;
  resolved: boolean;
}

interface DocumentChange {
  type: 'insert' | 'delete' | 'format';
  position: number;
  content?: string;
  length?: number;
  user_id: string;
  timestamp: string;
}

interface DocumentCollaborationProps {
  meetingId: string;
  userId: string;
  userName: string;
}

export function DocumentCollaboration({ 
  meetingId, 
  userId, 
  userName 
}: DocumentCollaborationProps) {
  const [documents, setDocuments] = useState<CollaborativeDocument[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<CollaborativeDocument | null>(null);
  const [documentContent, setDocumentContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [collaborators, setCollaborators] = useState<DocumentCollaborator[]>([]);
  const [comments, setComments] = useState<DocumentComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [selectedText, setSelectedText] = useState({ start: 0, end: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDocOpen, setIsCreateDocOpen] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocType, setNewDocType] = useState<'text' | 'markdown' | 'code'>('text');
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  // Mock documents for demonstration
  const mockDocuments: CollaborativeDocument[] = [
    {
      id: '1',
      title: 'Meeting Notes - Q4 Planning',
      content: `# Q4 Planning Meeting Notes

## Attendees
- Sarah Chen (Manager)
- John Smith (Chef)
- Emily Davis (Server)

## Agenda Items

### 1. Holiday Menu Planning
- Discuss seasonal dishes for Thanksgiving and Christmas
- Review pricing strategy for holiday specials
- Plan staff training for new menu items

### 2. Staff Scheduling
- Address holiday availability requests
- Plan coverage for peak holiday periods
- Discuss bonus structure for holiday shifts

### 3. Inventory Management
- Review supplier contracts for holiday ingredients
- Plan increased ordering for high-demand items
- Discuss storage solutions for additional inventory

## Action Items
- [ ] Finalize holiday menu by October 15th
- [ ] Send holiday availability forms to all staff
- [ ] Contact suppliers for bulk pricing
- [ ] Schedule staff training sessions

## Next Meeting
Date: October 20th, 2024
Time: 2:00 PM
Location: Manager Office`,
      type: 'markdown',
      created_by: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      collaborators: [
        {
          id: '1',
          user_id: userId,
          user_name: userName,
          permission: 'admin',
          last_seen: new Date().toISOString(),
          color: '#3B82F6'
        }
      ],
      comments: [
        {
          id: '1',
          content: 'Should we also discuss hiring seasonal staff?',
          author: 'John Smith',
          position: 450,
          created_at: new Date(Date.now() - 300000).toISOString(),
          resolved: false
        }
      ],
      version: 1
    },
    {
      id: '2',
      title: 'Restaurant Safety Protocols',
      content: `RESTAURANT SAFETY PROTOCOLS

1. FOOD SAFETY
   - Temperature monitoring every 2 hours
   - Hand washing stations must be stocked
   - Clean and sanitize surfaces after each use
   - First in, first out (FIFO) inventory rotation

2. WORKPLACE SAFETY
   - Non-slip mats in kitchen areas
   - Proper knife handling and storage
   - Emergency contact numbers posted
   - First aid kit locations marked

3. CUSTOMER SAFETY
   - Regular cleaning of dining areas
   - Allergen information clearly marked
   - Emergency evacuation procedures
   - Incident reporting process

4. CLEANING PROTOCOLS
   - Daily deep cleaning checklist
   - Weekly equipment maintenance
   - Monthly pest control inspection
   - Quarterly deep sanitization

5. EMERGENCY PROCEDURES
   - Fire evacuation plan
   - Medical emergency response
   - Power outage procedures
   - Security incident protocol

Last Updated: ${new Date().toLocaleDateString()}
Review Date: Monthly`,
      type: 'text',
      created_by: 'manager',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date(Date.now() - 3600000).toISOString(),
      collaborators: [
        {
          id: '2',
          user_id: 'manager',
          user_name: 'Restaurant Manager',
          permission: 'admin',
          last_seen: new Date(Date.now() - 1800000).toISOString(),
          color: '#10B981'
        }
      ],
      comments: [],
      version: 3
    }
  ];

  useEffect(() => {
    setDocuments(mockDocuments);
    if (mockDocuments.length > 0) {
      setSelectedDocument(mockDocuments[0]);
      setDocumentContent(mockDocuments[0].content);
      setCollaborators(mockDocuments[0].collaborators);
      setComments(mockDocuments[0].comments);
    }
  }, []);

  // Real-time collaboration setup
  useEffect(() => {
    if (!meetingId || !selectedDocument) return;

    const channel = supabase
      .channel(`document:${selectedDocument.id}`)
      .on('presence', { event: 'sync' }, () => {
        const newState = channel.presenceState();
        const users = Object.keys(newState).map(key => newState[key][0]).filter(Boolean) as unknown as DocumentCollaborator[];
        setCollaborators(users);
      })
      .on('broadcast', { event: 'document_change' }, ({ payload }) => {
        handleRemoteDocumentChange(payload as DocumentChange);
      })
      .on('broadcast', { event: 'cursor_position' }, ({ payload }) => {
        handleRemoteCursor(payload);
      })
      .on('broadcast', { event: 'comment_added' }, ({ payload }) => {
        handleRemoteComment(payload);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            id: userId,
            user_id: userId,
            user_name: userName,
            permission: 'edit',
            last_seen: new Date().toISOString(),
            color: '#3B82F6',
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [meetingId, selectedDocument, userId, userName]);

  const handleRemoteDocumentChange = (change: DocumentChange) => {
    if (change.user_id === userId) return;

    // Apply remote changes to document content
    switch (change.type) {
      case 'insert':
        if (change.content) {
          const newContent = 
            documentContent.slice(0, change.position) + 
            change.content + 
            documentContent.slice(change.position);
          setDocumentContent(newContent);
        }
        break;
      case 'delete':
        if (change.length) {
          const newContent = 
            documentContent.slice(0, change.position) + 
            documentContent.slice(change.position + change.length);
          setDocumentContent(newContent);
        }
        break;
    }
  };

  const handleRemoteCursor = (payload: any) => {
    if (payload.user_id === userId) return;
    // Update collaborator cursor positions
    setCollaborators(prev => prev.map(collab => 
      collab.user_id === payload.user_id 
        ? { ...collab, cursor_position: payload.position }
        : collab
    ));
  };

  const handleRemoteComment = (comment: DocumentComment) => {
    setComments(prev => [...prev, comment]);
    toast({
      title: "New Comment",
      description: `${comment.author} added a comment`,
    });
  };

  const handleContentChange = (newContent: string) => {
    if (!selectedDocument) return;

    const oldContent = documentContent;
    setDocumentContent(newContent);

    // Calculate diff and broadcast change
    const change: DocumentChange = {
      type: newContent.length > oldContent.length ? 'insert' : 'delete',
      position: findChangePosition(oldContent, newContent),
      content: newContent.length > oldContent.length ? 
        newContent.slice(oldContent.length) : undefined,
      length: newContent.length < oldContent.length ? 
        oldContent.length - newContent.length : undefined,
      user_id: userId,
      timestamp: new Date().toISOString()
    };

    broadcastDocumentChange(change);
  };

  const findChangePosition = (oldText: string, newText: string): number => {
    let i = 0;
    while (i < Math.min(oldText.length, newText.length) && oldText[i] === newText[i]) {
      i++;
    }
    return i;
  };

  const broadcastDocumentChange = (change: DocumentChange) => {
    if (!selectedDocument) return;
    
    supabase.channel(`document:${selectedDocument.id}`).send({
      type: 'broadcast',
      event: 'document_change',
      payload: change
    });
  };

  const handleTextSelection = () => {
    if (!textareaRef.current) return;
    
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    
    setSelectedText({ start, end });
    
    // Broadcast cursor position
    if (selectedDocument) {
      supabase.channel(`document:${selectedDocument.id}`).send({
        type: 'broadcast',
        event: 'cursor_position',
        payload: { user_id: userId, position: start }
      });
    }
  };

  const addComment = () => {
    if (!newComment.trim() || !selectedDocument) return;

    const comment: DocumentComment = {
      id: Date.now().toString(),
      content: newComment,
      author: userName,
      position: selectedText.start,
      created_at: new Date().toISOString(),
      resolved: false
    };

    setComments(prev => [...prev, comment]);
    setNewComment('');

    // Broadcast new comment
    supabase.channel(`document:${selectedDocument.id}`).send({
      type: 'broadcast',
      event: 'comment_added',
      payload: comment
    });

    toast({
      title: "Comment Added",
      description: "Your comment has been shared with all collaborators",
    });
  };

  const createDocument = () => {
    if (!newDocTitle.trim()) return;

    const newDoc: CollaborativeDocument = {
      id: Date.now().toString(),
      title: newDocTitle,
      content: newDocType === 'markdown' ? '# New Document\n\nStart writing here...' : 'Start writing here...',
      type: newDocType,
      created_by: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      collaborators: [{
        id: userId,
        user_id: userId,
        user_name: userName,
        permission: 'admin',
        last_seen: new Date().toISOString(),
        color: '#3B82F6'
      }],
      comments: [],
      version: 1
    };

    setDocuments(prev => [newDoc, ...prev]);
    setSelectedDocument(newDoc);
    setDocumentContent(newDoc.content);
    setNewDocTitle('');
    setIsCreateDocOpen(false);

    toast({
      title: "Document Created",
      description: `"${newDoc.title}" has been created successfully`,
    });
  };

  const saveDocument = () => {
    if (!selectedDocument) return;

    // Update document in state
    setDocuments(prev => prev.map(doc => 
      doc.id === selectedDocument.id 
        ? { 
            ...doc, 
            content: documentContent, 
            updated_at: new Date().toISOString(),
            version: doc.version + 1
          }
        : doc
    ));

    toast({
      title: "Document Saved",
      description: "Changes have been saved successfully",
    });
  };

  const filteredDocuments = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex gap-4">
      {/* Document List Sidebar */}
      <div className="w-80 flex flex-col gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Documents
              </CardTitle>
              <Dialog open={isCreateDocOpen} onOpenChange={setIsCreateDocOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Document</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Title</label>
                      <Input
                        value={newDocTitle}
                        onChange={(e) => setNewDocTitle(e.target.value)}
                        placeholder="Enter document title"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Type</label>
                      <select
                        value={newDocType}
                        onChange={(e) => setNewDocType(e.target.value as any)}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="text">Plain Text</option>
                        <option value="markdown">Markdown</option>
                        <option value="code">Code</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setIsCreateDocOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={createDocument}>Create</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="p-3">
            <div className="relative mb-3">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardContent className="p-3 space-y-2 overflow-y-auto">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className={`p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors ${
                  selectedDocument?.id === doc.id ? 'bg-primary/5 border-primary' : ''
                }`}
                onClick={() => {
                  setSelectedDocument(doc);
                  setDocumentContent(doc.content);
                  setCollaborators(doc.collaborators);
                  setComments(doc.comments);
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm truncate">{doc.title}</h4>
                  <Badge variant="secondary" className="text-xs">
                    {doc.type}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {doc.content.substring(0, 100)}...
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex -space-x-1">
                    {doc.collaborators.slice(0, 3).map((collab) => (
                      <div
                        key={collab.id}
                        className="w-4 h-4 rounded-full border border-background"
                        style={{ backgroundColor: collab.color }}
                        title={collab.user_name}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(doc.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Main Document Editor */}
      <div className="flex-1 flex flex-col gap-4">
        {selectedDocument ? (
          <>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{selectedDocument.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">v{selectedDocument.version}</Badge>
                      <span className="text-sm text-muted-foreground">
                        Last updated: {new Date(selectedDocument.updated_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={isEditing ? "default" : "outline"}
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      {isEditing ? 'View' : 'Edit'}
                    </Button>
                    <Button size="sm" onClick={saveDocument}>
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <div className="flex-1 grid grid-cols-4 gap-4">
              {/* Document Content */}
              <Card className="col-span-3">
                <CardContent className="p-4 h-full">
                  {isEditing ? (
                    <Textarea
                      ref={textareaRef}
                      value={documentContent}
                      onChange={(e) => handleContentChange(e.target.value)}
                      onSelect={handleTextSelection}
                      className="w-full h-full resize-none font-mono text-sm"
                      placeholder="Start writing..."
                    />
                  ) : (
                    <div className="w-full h-full overflow-auto">
                      {selectedDocument.type === 'markdown' ? (
                        <div className="prose max-w-none">
                          {documentContent.split('\n').map((line, index) => {
                            if (line.startsWith('# ')) {
                              return <h1 key={index} className="text-2xl font-bold mb-4">{line.substring(2)}</h1>;
                            } else if (line.startsWith('## ')) {
                              return <h2 key={index} className="text-xl font-semibold mb-3">{line.substring(3)}</h2>;
                            } else if (line.startsWith('### ')) {
                              return <h3 key={index} className="text-lg font-medium mb-2">{line.substring(4)}</h3>;
                            } else if (line.startsWith('- [ ]')) {
                              return <div key={index} className="flex items-center gap-2 mb-1">
                                <input type="checkbox" disabled />
                                <span>{line.substring(5)}</span>
                              </div>;
                            } else if (line.startsWith('- [x]')) {
                              return <div key={index} className="flex items-center gap-2 mb-1">
                                <input type="checkbox" checked disabled />
                                <span className="line-through">{line.substring(5)}</span>
                              </div>;
                            } else if (line.startsWith('- ')) {
                              return <li key={index} className="mb-1">{line.substring(2)}</li>;
                            } else {
                              return <p key={index} className="mb-2">{line}</p>;
                            }
                          })}
                        </div>
                      ) : (
                        <pre className="whitespace-pre-wrap font-mono text-sm">{documentContent}</pre>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Comments & Collaborators */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Collaboration</CardTitle>
                </CardHeader>
                <CardContent className="p-3 space-y-4">
                  {/* Active Collaborators */}
                  <div>
                    <h4 className="font-medium text-sm mb-2">Active Users</h4>
                    <div className="space-y-2">
                      {collaborators.map((collab) => (
                        <div key={collab.id} className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: collab.color }}
                          />
                          <span className="text-sm">{collab.user_name}</span>
                          <Badge variant="outline" className="text-xs">
                            {collab.permission}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Comments */}
                  <div>
                    <h4 className="font-medium text-sm mb-2">Comments</h4>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {comments.map((comment) => (
                        <div key={comment.id} className="p-2 bg-muted/50 rounded text-xs">
                          <div className="font-medium">{comment.author}</div>
                          <div className="mt-1">{comment.content}</div>
                          <div className="text-muted-foreground mt-1">
                            {new Date(comment.created_at).toLocaleTimeString()}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {isEditing && (
                      <div className="mt-3 space-y-2">
                        <Textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Add a comment..."
                          className="text-sm"
                          rows={2}
                        />
                        <Button size="sm" onClick={addComment} disabled={!newComment.trim()}>
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Comment
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <Card className="flex-1 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select a document to start collaborating</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}