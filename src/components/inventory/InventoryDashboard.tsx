import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { InventoryCategory } from './InventoryCategory';
import { Filter, List, BarChart3 } from 'lucide-react';

export interface InventoryItem {
  id: string;
  name: string;
  par: number;
  open: number;
  stock: number;
  order: number;
}

export interface InventoryData {
  [category: string]: InventoryItem[];
}

const initialInventoryData: InventoryData = {
  'Spirits': [
    { id: '1', name: 'Buckeye', par: 8, open: 2, stock: 0, order: 4 },
    { id: '2', name: 'Titos', par: 8, open: 2, stock: 0, order: 4 },
    { id: '3', name: 'Stoli Vanilla', par: 8, open: 4, stock: 2, order: 2 },
  ],
  'Tequila': [
    { id: '4', name: '1800', par: 0, open: 1, stock: 0, order: 0 },
    { id: '5', name: 'El Jimador', par: 6, open: 3, stock: 0, order: 3 },
  ],
  'Rum': [
    { id: '6', name: 'Bacardi Gold', par: 2, open: 2, stock: 0, order: 0 },
    { id: '7', name: 'Captain Morgan', par: 0, open: 1, stock: 0, order: 0 },
  ],
  'Whiskey': [
    { id: '8', name: 'Jameson', par: 2, open: 2, stock: 0, order: 0 },
  ],
  'Wine': [
    { id: '9', name: 'Wycliff (12 Case)', par: 96, open: 24, stock: 12, order: 72 },
  ],
  'Cans': [
    { id: '10', name: 'High Noon Peach', par: 0, open: 16, stock: 0, order: 0 },
    { id: '11', name: 'High Noon Grapefruit', par: 0, open: 3, stock: 6, order: 0 },
    { id: '12', name: 'High Noon Watermelon', par: 0, open: 4, stock: 6, order: 0 },
    { id: '13', name: 'High Noon Pineapple', par: 0, open: 4, stock: 6, order: 0 },
    { id: '14', name: 'High Noon Black Cherry', par: 0, open: 5, stock: 6, order: 0 },
  ],
  'Lucky Lemon': [
    { id: '15', name: 'Original', par: 0, open: 6, stock: 2, order: 0 },
    { id: '16', name: 'Peach', par: 0, open: 5, stock: 2, order: 0 },
    { id: '17', name: 'Raspberry', par: 0, open: 6, stock: 2, order: 0 },
    { id: '18', name: 'Blueberry', par: 0, open: 5, stock: 2, order: 0 },
  ],
  'Mixers / Juices': [
    { id: '19', name: 'Strawberry', par: 12, open: 4, stock: 7, order: 0 },
    { id: '20', name: 'Raspberry', par: 12, open: 4, stock: 7, order: 0 },
    { id: '21', name: 'Peach', par: 9, open: 3, stock: 5, order: 0 },
    { id: '22', name: 'Mango', par: 12, open: 3, stock: 8, order: 0 },
    { id: '23', name: 'Ginger Beer', par: 24, open: 3, stock: 0, order: 21 },
    { id: '24', name: 'Grenadine', par: 2, open: 2, stock: 0, order: 0 },
    { id: '25', name: 'Lime Juice (Rose)', par: 0, open: 0, stock: 2, order: 0 },
    { id: '26', name: 'Lime Juice (Regal)', par: 0, open: 2, stock: 10, order: 0 },
  ],
  'Liquors': [
    { id: '27', name: 'Triple Sec', par: 12, open: 2, stock: 11, order: 0 },
    { id: '28', name: 'Kahlua', par: 4, open: 1, stock: 0, order: 4 },
    { id: '29', name: 'Peach Schnapps', par: 12, open: 2, stock: 10, order: 0 },
    { id: '30', name: 'Butter Schnapps', par: 4, open: 1, stock: 0, order: 0 },
  ],
};

export const InventoryDashboard: React.FC = () => {
  const [inventoryData, setInventoryData] = useState<InventoryData>(initialInventoryData);
  const [showFiltered, setShowFiltered] = useState(false);
  const { toast } = useToast();

  const updateItemQuantity = (categoryKey: string, itemId: string, field: keyof Pick<InventoryItem, 'par' | 'open' | 'stock' | 'order'>, value: number) => {
    setInventoryData(prev => ({
      ...prev,
      [categoryKey]: prev[categoryKey].map(item =>
        item.id === itemId ? { ...item, [field]: Math.max(0, value) } : item
      )
    }));
  };

  const filteredData = useMemo(() => {
    if (!showFiltered) return inventoryData;
    
    const filtered: InventoryData = {};
    Object.entries(inventoryData).forEach(([category, items]) => {
      const filteredItems = items.filter(item => 
        item.par > 0 || item.open > 0 || item.stock > 0 || item.order > 0
      );
      if (filteredItems.length > 0) {
        filtered[category] = filteredItems;
      }
    });
    return filtered;
  }, [inventoryData, showFiltered]);

  const totalItems = useMemo(() => {
    return Object.values(inventoryData).reduce((total, items) => total + items.length, 0);
  }, [inventoryData]);

  const itemsWithQuantity = useMemo(() => {
    return Object.values(inventoryData).reduce((total, items) => 
      total + items.filter(item => item.par > 0 || item.open > 0 || item.stock > 0 || item.order > 0).length, 0
    );
  }, [inventoryData]);

  const handleGenerateList = () => {
    setShowFiltered(true);
    toast({
      title: "Inventory List Generated",
      description: `Showing ${itemsWithQuantity} items with quantities above 0`,
    });
  };

  const handleShowAll = () => {
    setShowFiltered(false);
    toast({
      title: "Showing All Items",
      description: `Displaying all ${totalItems} inventory items`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Bar Inventory</h2>
          <p className="text-muted-foreground">Manage your bar inventory with ease</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant={showFiltered ? "outline" : "default"}
            onClick={handleShowAll}
            className="flex items-center gap-2"
          >
            <List className="h-4 w-4" />
            Show All Items
          </Button>
          <Button
            variant={showFiltered ? "default" : "outline"}
            onClick={handleGenerateList}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Generate List
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold text-foreground">{totalItems}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-inventory-category" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Items with Stock</p>
                <p className="text-2xl font-bold text-foreground">{itemsWithQuantity}</p>
              </div>
              <Badge variant="secondary" className="bg-success/10 text-success">
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Categories</p>
                <p className="text-2xl font-bold text-foreground">{Object.keys(filteredData).length}</p>
              </div>
              <Badge variant="outline" className={showFiltered ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"}>
                {showFiltered ? "Filtered" : "All"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Categories */}
      <div className="space-y-6">
        {Object.entries(filteredData).map(([categoryName, items]) => (
          <InventoryCategory
            key={categoryName}
            categoryName={categoryName}
            items={items}
            onUpdateQuantity={(itemId, field, value) => 
              updateItemQuantity(categoryName, itemId, field, value)
            }
          />
        ))}
      </div>

      {showFiltered && Object.keys(filteredData).length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-muted-foreground">
              <Filter className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No items with quantities found</h3>
              <p>All inventory items currently have zero quantities.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};