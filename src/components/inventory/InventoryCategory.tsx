import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { QuantityInput } from './QuantityInput';
import type { InventoryItem } from './InventoryDashboard';

interface InventoryCategoryProps {
  categoryName: string;
  items: InventoryItem[];
  onUpdateQuantity: (itemId: string, field: keyof Pick<InventoryItem, 'par' | 'open' | 'stock' | 'order'>, value: number) => void;
}

export const InventoryCategory: React.FC<InventoryCategoryProps> = ({
  categoryName,
  items,
  onUpdateQuantity,
}) => {
  const getStockStatus = (item: InventoryItem) => {
    const totalStock = item.stock + item.open;
    if (totalStock === 0) return 'low';
    if (totalStock < item.par * 0.5) return 'medium';
    return 'high';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'low':
        return 'bg-inventory-low/10 text-inventory-low border-inventory-low/20';
      case 'medium':
        return 'bg-inventory-medium/10 text-inventory-medium border-inventory-medium/20';
      case 'high':
        return 'bg-inventory-high/10 text-inventory-high border-inventory-high/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-border';
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-inventory-category to-inventory-category/80 text-white">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">{categoryName}</CardTitle>
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            {items.length} items
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-semibold text-sm text-muted-foreground">Item</th>
                <th className="text-center p-4 font-semibold text-sm text-muted-foreground min-w-[120px]">Par</th>
                <th className="text-center p-4 font-semibold text-sm text-muted-foreground min-w-[120px]">Open</th>
                <th className="text-center p-4 font-semibold text-sm text-muted-foreground min-w-[120px]">Stock</th>
                <th className="text-center p-4 font-semibold text-sm text-muted-foreground min-w-[120px]">Order</th>
                <th className="text-center p-4 font-semibold text-sm text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => {
                const status = getStockStatus(item);
                return (
                  <tr 
                    key={item.id} 
                    className={`border-b border-border hover:bg-muted/30 transition-colors ${
                      index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                    }`}
                  >
                    <td className="p-4">
                      <div className="font-medium text-foreground">{item.name}</div>
                    </td>
                    <td className="p-4">
                      <QuantityInput
                        value={item.par}
                        onChange={(value) => onUpdateQuantity(item.id, 'par', value)}
                        min={0}
                      />
                    </td>
                    <td className="p-4">
                      <QuantityInput
                        value={item.open}
                        onChange={(value) => onUpdateQuantity(item.id, 'open', value)}
                        min={0}
                      />
                    </td>
                    <td className="p-4">
                      <QuantityInput
                        value={item.stock}
                        onChange={(value) => onUpdateQuantity(item.id, 'stock', value)}
                        min={0}
                      />
                    </td>
                    <td className="p-4">
                      <QuantityInput
                        value={item.order}
                        onChange={(value) => onUpdateQuantity(item.id, 'order', value)}
                        min={0}
                      />
                    </td>
                    <td className="p-4 text-center">
                      <Badge 
                        variant="outline" 
                        className={`${getStatusColor(status)} font-medium`}
                      >
                        {status === 'low' ? 'Low' : status === 'medium' ? 'Medium' : 'Good'}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};