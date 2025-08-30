import { useCallback, useState, useMemo } from 'react';
import {
  ReactFlow,
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  ConnectionMode,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Square, 
  Circle, 
  Minus, 
  RotateCcw, 
  Save, 
  Eye, 
  Edit3,
  Users,
  Clock,
  MapPin,
  Settings
} from 'lucide-react';
import TableNode from './TableNode';

interface TableData {
  id: string;
  tableNumber: number;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning' | 'out-of-order';
  shape: 'square' | 'round' | 'rectangle';
  reservationInfo?: {
    customerName: string;
    time: string;
    partySize: number;
  };
  currentPartySize?: number;
  estimatedTurnTime?: string;
}

const nodeTypes = {
  table: TableNode,
};

// Initial table nodes with realistic restaurant layout
const initialNodes: Node[] = [
  {
    id: 'table-1',
    type: 'table',
    position: { x: 100, y: 100 },
    data: {
      id: 'table-1',
      tableNumber: 1,
      capacity: 2,
      status: 'available',
      shape: 'round',
    },
  },
  {
    id: 'table-2',
    type: 'table',
    position: { x: 250, y: 100 },
    data: {
      id: 'table-2',
      tableNumber: 2,
      capacity: 4,
      status: 'occupied',
      shape: 'square',
      currentPartySize: 3,
      estimatedTurnTime: '25 min',
    },
  },
  {
    id: 'table-3',
    type: 'table',
    position: { x: 400, y: 100 },
    data: {
      id: 'table-3',
      tableNumber: 3,
      capacity: 6,
      status: 'reserved',
      shape: 'rectangle',
      reservationInfo: {
        customerName: 'Smith Party',
        time: '7:30 PM',
        partySize: 5,
      },
    },
  },
  {
    id: 'table-4',
    type: 'table',
    position: { x: 100, y: 250 },
    data: {
      id: 'table-4',
      tableNumber: 4,
      capacity: 2,
      status: 'cleaning',
      shape: 'round',
    },
  },
  {
    id: 'table-5',
    type: 'table',
    position: { x: 250, y: 250 },
    data: {
      id: 'table-5',
      tableNumber: 5,
      capacity: 8,
      status: 'occupied',
      shape: 'rectangle',
      currentPartySize: 6,
      estimatedTurnTime: '15 min',
    },
  },
];

const initialEdges: Edge[] = [];

export default function FloorPlanEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isEditing, setIsEditing] = useState(true);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [newTableData, setNewTableData] = useState({
    tableNumber: '',
    capacity: '4',
    shape: 'square' as 'square' | 'round' | 'rectangle',
  });

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const addTable = () => {
    if (!newTableData.tableNumber) return;

    const newNode: Node = {
      id: `table-${Date.now()}`,
      type: 'table',
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
      data: {
        id: `table-${Date.now()}`,
        tableNumber: parseInt(newTableData.tableNumber),
        capacity: parseInt(newTableData.capacity),
        status: 'available',
        shape: newTableData.shape,
      },
    };

    setNodes((nds) => [...nds, newNode]);
    setNewTableData({ tableNumber: '', capacity: '4', shape: 'square' });
  };

  const removeTable = () => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
      setSelectedNode(null);
    }
  };

  const updateTableData = (updates: any) => {
    if (selectedNode) {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === selectedNode.id
            ? { 
                ...node, 
                data: { 
                  ...node.data, 
                  ...updates,
                  tableNumber: updates.tableNumber ? parseInt(updates.tableNumber) : node.data.tableNumber,
                  capacity: updates.capacity ? parseInt(updates.capacity) : node.data.capacity,
                }
              }
            : node
        )
      );
      setSelectedNode(prev => prev ? { ...prev, data: { ...prev.data, ...updates } } : null);
    }
  };

  const onNodeClick = useCallback((_event: any, node: Node) => {
    setSelectedNode(node);
  }, []);

  const tableStats = useMemo(() => {
    const stats = {
      total: nodes.length,
      available: 0,
      occupied: 0,
      reserved: 0,
      cleaning: 0,
      'out-of-order': 0,
      totalCapacity: 0,
    };

    nodes.forEach((node) => {
      const nodeData = node.data as unknown as TableData;
      const status = nodeData.status;
      if (status in stats) {
        (stats as any)[status]++;
      }
      stats.totalCapacity += nodeData.capacity;
    });

    return stats;
  }, [nodes]);

  return (
    <div className="h-full flex">
      {/* Sidebar */}
      <div className="w-80 border-r bg-background p-4 space-y-6 overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Floor Plan Editor</h3>
          <Button
            variant={isEditing ? "default" : "outline"}
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? <Eye className="h-4 w-4 mr-2" /> : <Edit3 className="h-4 w-4 mr-2" />}
            {isEditing ? 'Preview' : 'Edit'}
          </Button>
        </div>

        {/* Table Statistics */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Floor Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Total Tables:</span>
              <Badge variant="outline">{tableStats.total}</Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span>Total Capacity:</span>
              <Badge variant="outline">{tableStats.totalCapacity}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between">
                <span>Available:</span>
                <Badge className="bg-emerald-500">{tableStats.available}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Occupied:</span>
                <Badge className="bg-red-500">{tableStats.occupied}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Reserved:</span>
                <Badge className="bg-amber-500">{tableStats.reserved}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Cleaning:</span>
                <Badge className="bg-blue-500">{tableStats.cleaning}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {isEditing && (
          <Tabs defaultValue="add" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="add">Add Table</TabsTrigger>
              <TabsTrigger value="edit">Edit Table</TabsTrigger>
            </TabsList>

            <TabsContent value="add" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add New Table
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label htmlFor="tableNumber" className="text-sm">Table Number</Label>
                    <Input
                      id="tableNumber"
                      type="number"
                      value={newTableData.tableNumber}
                      onChange={(e) => setNewTableData(prev => ({ ...prev, tableNumber: e.target.value }))}
                      placeholder="Enter table number"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="capacity" className="text-sm">Capacity</Label>
                    <Select value={newTableData.capacity} onValueChange={(value) => setNewTableData(prev => ({ ...prev, capacity: value }))}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[2, 4, 6, 8, 10, 12].map(num => (
                          <SelectItem key={num} value={num.toString()}>{num} seats</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="shape" className="text-sm">Table Shape</Label>
                    <Select value={newTableData.shape} onValueChange={(value: any) => setNewTableData(prev => ({ ...prev, shape: value }))}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="square">
                          <div className="flex items-center gap-2">
                            <Square className="h-4 w-4" />
                            Square
                          </div>
                        </SelectItem>
                        <SelectItem value="round">
                          <div className="flex items-center gap-2">
                            <Circle className="h-4 w-4" />
                            Round
                          </div>
                        </SelectItem>
                        <SelectItem value="rectangle">Rectangle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={addTable} className="w-full" disabled={!newTableData.tableNumber}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Table
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="edit" className="space-y-4">
              {selectedNode ? (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Edit Table {(selectedNode.data as unknown as TableData).tableNumber}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label htmlFor="editTableNumber" className="text-sm">Table Number</Label>
                      <Input
                        id="editTableNumber"
                        type="number"
                        value={(selectedNode.data as unknown as TableData).tableNumber}
                        onChange={(e) => updateTableData({ tableNumber: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="editCapacity" className="text-sm">Capacity</Label>
                      <Select 
                        value={(selectedNode.data as unknown as TableData).capacity.toString()} 
                        onValueChange={(value) => updateTableData({ capacity: value })}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[2, 4, 6, 8, 10, 12].map(num => (
                            <SelectItem key={num} value={num.toString()}>{num} seats</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="editStatus" className="text-sm">Status</Label>
                      <Select 
                        value={(selectedNode.data as unknown as TableData).status} 
                        onValueChange={(value) => updateTableData({ status: value })}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="available">Available</SelectItem>
                          <SelectItem value="occupied">Occupied</SelectItem>
                          <SelectItem value="reserved">Reserved</SelectItem>
                          <SelectItem value="cleaning">Cleaning</SelectItem>
                          <SelectItem value="out-of-order">Out of Order</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="editShape" className="text-sm">Table Shape</Label>
                      <Select 
                        value={(selectedNode.data as unknown as TableData).shape} 
                        onValueChange={(value) => updateTableData({ shape: value })}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="square">Square</SelectItem>
                          <SelectItem value="round">Round</SelectItem>
                          <SelectItem value="rectangle">Rectangle</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={removeTable} variant="destructive" size="sm" className="flex-1">
                        <Minus className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                      <Button onClick={() => setSelectedNode(null)} variant="outline" size="sm" className="flex-1">
                        Done
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center text-muted-foreground">
                      <Settings className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">Select a table to edit its properties</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        )}

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button size="sm" className="flex-1">
            <Save className="h-4 w-4 mr-2" />
            Save Layout
          </Button>
        </div>
      </div>

      {/* Main Floor Plan */}
      <div className="flex-1 h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          connectionMode={ConnectionMode.Loose}
          fitView
          snapToGrid={true}
          snapGrid={[10, 10]}
          defaultEdgeOptions={{
            type: 'smoothstep',
            animated: false,
          }}
          className={isEditing ? '' : 'pointer-events-none'}
        >
          <MiniMap 
            zoomable 
            pannable 
            className="bg-background border"
            nodeClassName={(node) => {
              const nodeData = node.data as unknown as TableData;
              switch (nodeData.status) {
                case 'available': return 'bg-emerald-200';
                case 'occupied': return 'bg-red-200';
                case 'reserved': return 'bg-amber-200';
                case 'cleaning': return 'bg-blue-200';
                default: return 'bg-gray-200';
              }
            }}
          />
          <Controls className="bg-background border" />
          <Background 
            variant={BackgroundVariant.Dots} 
            gap={20} 
            size={1}
            className="bg-muted/20"
          />
        </ReactFlow>
      </div>
    </div>
  );
}