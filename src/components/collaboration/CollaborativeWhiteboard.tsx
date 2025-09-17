import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Canvas as FabricCanvas, Circle, Rect, FabricText, Path, Line } from 'fabric';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Pen, 
  Square, 
  Circle as CircleIcon, 
  Type, 
  Eraser, 
  Undo, 
  Redo, 
  Download, 
  Upload, 
  Trash2, 
  MousePointer, 
  Minus,
  Palette,
  Users,
  Save,
  Share,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from 'lucide-react';

interface WhiteboardUser {
  id: string;
  name: string;
  color: string;
  cursor?: { x: number; y: number };
}

interface DrawingEvent {
  id: string;
  type: 'object_added' | 'object_modified' | 'object_removed' | 'canvas_cleared';
  userId: string;
  userName: string;
  data: any;
  timestamp: string;
}

interface CollaborativeWhiteboardProps {
  meetingId: string;
  userId: string;
  userName: string;
  isHost?: boolean;
}

const colors = [
  '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', 
  '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#008000',
  '#FFC0CB', '#A52A2A', '#808080', '#FFD700', '#4B0082'
];

const strokeWidths = [1, 2, 4, 8, 12, 16];

export function CollaborativeWhiteboard({ 
  meetingId, 
  userId, 
  userName, 
  isHost = false 
}: CollaborativeWhiteboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [activeTool, setActiveTool] = useState<'select' | 'pen' | 'rectangle' | 'circle' | 'text' | 'line' | 'eraser'>('pen');
  const [activeColor, setActiveColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [isDrawing, setIsDrawing] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState<WhiteboardUser[]>([]);
  const [undoStack, setUndoStack] = useState<any[]>([]);
  const [redoStack, setRedoStack] = useState<any[]>([]);
  const [zoom, setZoom] = useState(1);
  const [canvasHistory, setCanvasHistory] = useState<string[]>([]);

  const { toast } = useToast();

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 1200,
      height: 800,
      backgroundColor: '#ffffff',
    });

    // Configure drawing brush
    canvas.freeDrawingBrush.color = activeColor;
    canvas.freeDrawingBrush.width = strokeWidth;

    // Handle object events
    canvas.on('object:added', handleObjectAdded);
    canvas.on('object:modified', handleObjectModified);
    canvas.on('object:removed', handleObjectRemoved);
    canvas.on('mouse:move', handleMouseMove);
    canvas.on('path:created', handlePathCreated);

    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, []);

  // Initialize real-time collaboration
  useEffect(() => {
    if (!meetingId) return;

    const channel = supabase
      .channel(`whiteboard:${meetingId}`)
      .on('presence', { event: 'sync' }, () => {
        const newState = channel.presenceState();
        const users = Object.keys(newState).map(key => newState[key][0]).filter(Boolean) as unknown as WhiteboardUser[];
        setConnectedUsers(users);
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        toast({
          title: "User Joined",
          description: `${newPresences[0]?.name} joined the whiteboard`,
        });
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        toast({
          title: "User Left", 
          description: `${leftPresences[0]?.name} left the whiteboard`,
        });
      })
      .on('broadcast', { event: 'drawing' }, ({ payload }) => {
        handleRemoteDrawingEvent(payload as DrawingEvent);
      })
      .on('broadcast', { event: 'cursor' }, ({ payload }) => {
        handleRemoteCursor(payload);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            id: userId,
            name: userName,
            color: colors[Math.floor(Math.random() * colors.length)],
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [meetingId, userId, userName]);

  // Update tool settings
  useEffect(() => {
    if (!fabricCanvas) return;

    fabricCanvas.isDrawingMode = activeTool === 'pen';
    fabricCanvas.selection = activeTool === 'select';
    
    if (fabricCanvas.freeDrawingBrush) {
      fabricCanvas.freeDrawingBrush.color = activeColor;
      fabricCanvas.freeDrawingBrush.width = strokeWidth;
    }

    // Change cursor based on tool
    switch (activeTool) {
      case 'pen':
        fabricCanvas.defaultCursor = 'crosshair';
        break;
      case 'eraser':
        fabricCanvas.defaultCursor = 'not-allowed';
        break;
      case 'text':
        fabricCanvas.defaultCursor = 'text';
        break;
      default:
        fabricCanvas.defaultCursor = 'default';
    }
  }, [activeTool, activeColor, strokeWidth, fabricCanvas]);

  const handleObjectAdded = useCallback((e: any) => {
    if (!e.target || isDrawing) return;
    
    const event: DrawingEvent = {
      id: Date.now().toString(),
      type: 'object_added',
      userId,
      userName,
      data: e.target.toObject(),
      timestamp: new Date().toISOString()
    };
    
    broadcastDrawingEvent(event);
    saveToHistory();
  }, [userId, userName, isDrawing]);

  const handleObjectModified = useCallback((e: any) => {
    if (!e.target) return;
    
    const event: DrawingEvent = {
      id: Date.now().toString(),
      type: 'object_modified', 
      userId,
      userName,
      data: { id: e.target.id, ...e.target.toObject() },
      timestamp: new Date().toISOString()
    };
    
    broadcastDrawingEvent(event);
    saveToHistory();
  }, [userId, userName]);

  const handleObjectRemoved = useCallback((e: any) => {
    if (!e.target) return;
    
    const event: DrawingEvent = {
      id: Date.now().toString(),
      type: 'object_removed',
      userId,
      userName,
      data: { id: e.target.id },
      timestamp: new Date().toISOString()
    };
    
    broadcastDrawingEvent(event);
  }, [userId, userName]);

  const handleMouseMove = useCallback((e: any) => {
    const pointer = fabricCanvas?.getPointer(e.e);
    if (pointer) {
      broadcastCursor({ x: pointer.x, y: pointer.y });
    }
  }, [fabricCanvas]);

  const handlePathCreated = useCallback((e: any) => {
    if (e.path) {
      e.path.id = Date.now().toString();
    }
  }, []);

  const broadcastDrawingEvent = (event: DrawingEvent) => {
    supabase.channel(`whiteboard:${meetingId}`).send({
      type: 'broadcast',
      event: 'drawing',
      payload: event
    });
  };

  const broadcastCursor = (position: { x: number; y: number }) => {
    supabase.channel(`whiteboard:${meetingId}`).send({
      type: 'broadcast', 
      event: 'cursor',
      payload: { userId, userName, position }
    });
  };

  const handleRemoteDrawingEvent = (event: DrawingEvent) => {
    if (!fabricCanvas || event.userId === userId) return;

    switch (event.type) {
      case 'object_added':
        addRemoteObject(event.data);
        break;
      case 'object_modified':
        modifyRemoteObject(event.data);
        break;
      case 'object_removed':
        removeRemoteObject(event.data.id);
        break;
      case 'canvas_cleared':
        fabricCanvas.clear();
        fabricCanvas.backgroundColor = '#ffffff';
        fabricCanvas.renderAll();
        break;
    }
  };

  const handleRemoteCursor = (payload: any) => {
    if (payload.userId === userId) return;
    // Update remote user cursor position
    // Implementation for showing remote cursors
  };

  const addRemoteObject = async (objectData: any) => {
    if (!fabricCanvas) return;

    let fabricObject;
    switch (objectData.type) {
      case 'rect':
        fabricObject = new Rect(objectData);
        break;
      case 'circle':
        fabricObject = new Circle(objectData);
        break;
      case 'i-text':
        fabricObject = new FabricText(objectData.text, objectData);
        break;
      case 'path':
        fabricObject = new Path(objectData.path, objectData);
        break;
      case 'line':
        fabricObject = new Line([objectData.x1, objectData.y1, objectData.x2, objectData.y2], objectData);
        break;
      default:
        return;
    }

    if (fabricObject) {
      fabricObject.id = objectData.id;
      fabricCanvas.add(fabricObject);
      fabricCanvas.renderAll();
    }
  };

  const modifyRemoteObject = (objectData: any) => {
    if (!fabricCanvas) return;
    
    const object = fabricCanvas.getObjects().find((obj: any) => obj.id === objectData.id);
    if (object) {
      object.set(objectData);
      fabricCanvas.renderAll();
    }
  };

  const removeRemoteObject = (objectId: string) => {
    if (!fabricCanvas) return;
    
    const object = fabricCanvas.getObjects().find((obj: any) => obj.id === objectId);
    if (object) {
      fabricCanvas.remove(object);
      fabricCanvas.renderAll();
    }
  };

  const handleToolClick = (tool: typeof activeTool) => {
    setActiveTool(tool);

    if (!fabricCanvas) return;

    if (tool === 'rectangle') {
      const rect = new Rect({
        left: 100,
        top: 100,
        fill: 'transparent',
        stroke: activeColor,
        strokeWidth: strokeWidth,
        width: 100,
        height: 100,
      });
      (rect as any).id = Date.now().toString();
      fabricCanvas.add(rect);
    } else if (tool === 'circle') {
      const circle = new Circle({
        left: 100,
        top: 100,
        fill: 'transparent',
        stroke: activeColor,
        strokeWidth: strokeWidth,
        radius: 50,
      });
      (circle as any).id = Date.now().toString();
      fabricCanvas.add(circle);
    } else if (tool === 'text') {
      const text = new FabricText('Click to edit', {
        left: 100,
        top: 100,
        fill: activeColor,
        fontSize: 20,
        fontFamily: 'Arial',
      });
      (text as any).id = Date.now().toString();
      fabricCanvas.add(text);
    } else if (tool === 'line') {
      const line = new Line([50, 50, 150, 50], {
        stroke: activeColor,
        strokeWidth: strokeWidth,
      });
      (line as any).id = Date.now().toString();
      fabricCanvas.add(line);
    }
  };

  const saveToHistory = () => {
    if (!fabricCanvas) return;
    
    const canvasJSON = JSON.stringify(fabricCanvas.toJSON());
    setCanvasHistory(prev => [...prev.slice(-9), canvasJSON]); // Keep last 10 states
  };

  const handleUndo = () => {
    if (!fabricCanvas || canvasHistory.length === 0) return;
    
    const currentState = JSON.stringify(fabricCanvas.toJSON());
    const previousState = canvasHistory[canvasHistory.length - 1];
    
    setRedoStack(prev => [currentState, ...prev.slice(0, 9)]);
    setCanvasHistory(prev => prev.slice(0, -1));
    
    fabricCanvas.loadFromJSON(previousState, () => {
      fabricCanvas.renderAll();
    });
  };

  const handleRedo = () => {
    if (!fabricCanvas || redoStack.length === 0) return;
    
    const currentState = JSON.stringify(fabricCanvas.toJSON());
    const nextState = redoStack[0];
    
    setCanvasHistory(prev => [...prev, currentState]);
    setRedoStack(prev => prev.slice(1));
    
    fabricCanvas.loadFromJSON(nextState, () => {
      fabricCanvas.renderAll();
    });
  };

  const handleClear = () => {
    if (!fabricCanvas) return;
    
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = '#ffffff';
    fabricCanvas.renderAll();
    
    const event: DrawingEvent = {
      id: Date.now().toString(),
      type: 'canvas_cleared',
      userId,
      userName,
      data: {},
      timestamp: new Date().toISOString()
    };
    
    broadcastDrawingEvent(event);
    toast({ title: "Whiteboard cleared" });
  };

  const handleZoomIn = () => {
    if (!fabricCanvas) return;
    const newZoom = Math.min(zoom * 1.2, 3);
    setZoom(newZoom);
    fabricCanvas.setZoom(newZoom);
    fabricCanvas.renderAll();
  };

  const handleZoomOut = () => {
    if (!fabricCanvas) return;
    const newZoom = Math.max(zoom * 0.8, 0.1);
    setZoom(newZoom);
    fabricCanvas.setZoom(newZoom);
    fabricCanvas.renderAll();
  };

  const handleExport = () => {
    if (!fabricCanvas) return;
    
    const dataURL = fabricCanvas.toDataURL({
      format: 'png',
      quality: 0.8,
      multiplier: 2
    });
    
    const link = document.createElement('a');
    link.download = `whiteboard-${meetingId}-${Date.now()}.png`;
    link.href = dataURL;
    link.click();
    
    toast({ title: "Whiteboard exported successfully" });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Collaborative Whiteboard
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                <Users className="h-3 w-3 mr-1" />
                {connectedUsers.length} users
              </Badge>
              <Badge variant="secondary">
                Zoom: {Math.round(zoom * 100)}%
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="tools" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="tools">Tools</TabsTrigger>
              <TabsTrigger value="styles">Styles</TabsTrigger>
              <TabsTrigger value="actions">Actions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tools" className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={activeTool === 'select' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleToolClick('select')}
                >
                  <MousePointer className="h-4 w-4" />
                </Button>
                <Button
                  variant={activeTool === 'pen' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleToolClick('pen')}
                >
                  <Pen className="h-4 w-4" />
                </Button>
                <Button
                  variant={activeTool === 'rectangle' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleToolClick('rectangle')}
                >
                  <Square className="h-4 w-4" />
                </Button>
                <Button
                  variant={activeTool === 'circle' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleToolClick('circle')}
                >
                  <CircleIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant={activeTool === 'line' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleToolClick('line')}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Button
                  variant={activeTool === 'text' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleToolClick('text')}
                >
                  <Type className="h-4 w-4" />
                </Button>
                <Button
                  variant={activeTool === 'eraser' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleToolClick('eraser')}
                >
                  <Eraser className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="styles" className="space-y-3">
              <div className="flex flex-wrap gap-2 mb-3">
                {colors.map((color) => (
                  <Button
                    key={color}
                    className={`w-8 h-8 p-0 rounded-full border-2 ${
                      activeColor === color ? 'border-primary' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setActiveColor(color)}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Stroke Width:</span>
                <div className="flex gap-1">
                  {strokeWidths.map((width) => (
                    <Button
                      key={width}
                      variant={strokeWidth === width ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setStrokeWidth(width)}
                    >
                      {width}px
                    </Button>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="actions" className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Button size="sm" onClick={handleUndo} disabled={canvasHistory.length === 0}>
                  <Undo className="h-4 w-4 mr-1" />
                  Undo
                </Button>
                <Button size="sm" onClick={handleRedo} disabled={redoStack.length === 0}>
                  <Redo className="h-4 w-4 mr-1" />
                  Redo
                </Button>
                <Separator orientation="vertical" className="h-8" />
                <Button size="sm" onClick={handleZoomIn}>
                  <ZoomIn className="h-4 w-4 mr-1" />
                  Zoom In
                </Button>
                <Button size="sm" onClick={handleZoomOut}>
                  <ZoomOut className="h-4 w-4 mr-1" />
                  Zoom Out
                </Button>
                <Button size="sm" onClick={() => { setZoom(1); fabricCanvas?.setZoom(1); fabricCanvas?.renderAll(); }}>
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Reset Zoom
                </Button>
                <Separator orientation="vertical" className="h-8" />
                <Button size="sm" onClick={handleExport}>
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
                <Button size="sm" variant="destructive" onClick={handleClear}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Canvas Area */}
      <Card className="flex-1 overflow-hidden">
        <CardContent className="p-2 h-full">
          <div className="w-full h-full overflow-auto bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <canvas ref={canvasRef} className="block mx-auto my-4 shadow-lg rounded-lg" />
          </div>
        </CardContent>
      </Card>

      {/* Connected Users */}
      <Card className="mt-4">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="font-medium">Active collaborators:</span>
            <div className="flex gap-2">
              {connectedUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-1">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: user.color }}
                  />
                  <span className="text-sm">{user.name}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}