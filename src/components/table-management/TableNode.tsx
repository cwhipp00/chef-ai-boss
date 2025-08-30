import { memo, useState } from 'react';
import { Handle, Position, NodeToolbar } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Clock, Edit, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

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

interface TableNodeProps {
  data: TableData;
  selected: boolean;
}

const TableNode = ({ data, selected }: TableNodeProps) => {
  const [showToolbar, setShowToolbar] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-emerald-100 border-emerald-500 text-emerald-800';
      case 'occupied':
        return 'bg-red-100 border-red-500 text-red-800';
      case 'reserved':
        return 'bg-amber-100 border-amber-500 text-amber-800';
      case 'cleaning':
        return 'bg-blue-100 border-blue-500 text-blue-800';
      case 'out-of-order':
        return 'bg-gray-100 border-gray-500 text-gray-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-600';
    }
  };

  const getShapeClasses = (shape: string, capacity: number) => {
    const baseSize = Math.max(80, Math.min(120, capacity * 15));
    
    switch (shape) {
      case 'round':
        return `rounded-full w-${baseSize} h-${baseSize}`;
      case 'rectangle':
        return `rounded-lg w-${baseSize + 20} h-${baseSize - 20}`;
      default:
        return `rounded-lg w-${baseSize} h-${baseSize}`;
    }
  };

  const StatusBadge = () => {
    switch (data.status) {
      case 'available':
        return <Badge className="bg-emerald-500 text-white text-xs">Available</Badge>;
      case 'occupied':
        return <Badge className="bg-red-500 text-white text-xs">Occupied</Badge>;
      case 'reserved':
        return <Badge className="bg-amber-500 text-white text-xs">Reserved</Badge>;
      case 'cleaning':
        return <Badge className="bg-blue-500 text-white text-xs">Cleaning</Badge>;
      case 'out-of-order':
        return <Badge className="bg-gray-500 text-white text-xs">Out of Order</Badge>;
      default:
        return null;
    }
  };

  return (
    <>
      <NodeToolbar isVisible={selected || showToolbar} position={Position.Top}>
        <div className="flex gap-2 bg-white border rounded-lg p-2 shadow-lg">
          <Button size="sm" variant="outline" className="h-8 px-2">
            <Edit className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="outline" className="h-8 px-2">
            <MoreVertical className="h-3 w-3" />
          </Button>
        </div>
      </NodeToolbar>

      <Handle type="target" position={Position.Top} style={{ visibility: 'hidden' }} />
      <Handle type="source" position={Position.Bottom} style={{ visibility: 'hidden' }} />

      <Card 
        className={cn(
          'relative cursor-pointer transition-all duration-200 border-2',
          getStatusColor(data.status),
          getShapeClasses(data.shape, data.capacity),
          selected && 'ring-2 ring-primary ring-offset-2',
          'hover:shadow-lg'
        )}
        onClick={() => setShowToolbar(!showToolbar)}
      >
        <div className="absolute -top-2 -right-2">
          <StatusBadge />
        </div>

        <div className="h-full w-full flex flex-col items-center justify-center p-3 text-center">
          <div className="font-bold text-lg mb-1">
            {data.tableNumber}
          </div>
          
          <div className="flex items-center gap-1 text-xs mb-2">
            <Users className="h-3 w-3" />
            <span>{data.currentPartySize || 0}/{data.capacity}</span>
          </div>

          {data.reservationInfo && (
            <div className="text-xs space-y-1">
              <div className="font-medium truncate max-w-full">
                {data.reservationInfo.customerName}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-2 w-2" />
                <span>{data.reservationInfo.time}</span>
              </div>
            </div>
          )}

          {data.estimatedTurnTime && data.status === 'occupied' && (
            <div className="text-xs mt-1 px-2 py-1 bg-white/80 rounded">
              Est: {data.estimatedTurnTime}
            </div>
          )}
        </div>
      </Card>
    </>
  );
};

export default memo(TableNode);