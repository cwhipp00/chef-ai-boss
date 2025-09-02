import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart, Plus, Trash2, Edit3, Calendar, MapPin, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StoreItem {
  id: string;
  name: string;
  category: string;
  quantity: string;
  notes?: string;
  purchased: boolean;
  estimatedPrice?: number;
}

interface StoreList {
  id: string;
  title: string;
  store: string;
  targetDate: string;
  items: StoreItem[];
  totalEstimated: number;
  completed: boolean;
  createdAt: string;
}

const storeCategories = [
  'Produce', 'Meat & Seafood', 'Dairy', 'Frozen', 'Pantry', 'Bakery', 
  'Beverages', 'Cleaning Supplies', 'Paper Products', 'Other'
];

const commonStores = [
  'Walmart', 'Target', 'Kroger', 'Safeway', 'Whole Foods', 'Costco', 
  'Sam\'s Club', 'Local Grocery', 'Restaurant Depot', 'Other'
];

const initialStoreLists: StoreList[] = [
  {
    id: '1',
    title: 'Weekly Produce Order',
    store: 'Restaurant Depot',
    targetDate: '2024-01-15',
    totalEstimated: 245.50,
    completed: false,
    createdAt: '2024-01-12',
    items: [
      { id: '1', name: 'Fresh Tomatoes', category: 'Produce', quantity: '20 lbs', purchased: true, estimatedPrice: 35.00 },
      { id: '2', name: 'Yellow Onions', category: 'Produce', quantity: '25 lbs', purchased: true, estimatedPrice: 18.75 },
      { id: '3', name: 'Bell Peppers (Mixed)', category: 'Produce', quantity: '10 lbs', purchased: false, estimatedPrice: 28.50 },
      { id: '4', name: 'Fresh Herbs Bundle', category: 'Produce', quantity: '1 case', purchased: false, estimatedPrice: 45.00 },
    ]
  },
  {
    id: '2', 
    title: 'Cleaning Supplies Restock',
    store: 'Costco',
    targetDate: '2024-01-16',
    totalEstimated: 125.00,
    completed: false,
    createdAt: '2024-01-13',
    items: [
      { id: '5', name: 'Industrial Degreaser', category: 'Cleaning Supplies', quantity: '4 bottles', purchased: false, estimatedPrice: 48.00 },
      { id: '6', name: 'Paper Towels', category: 'Paper Products', quantity: '2 cases', purchased: false, estimatedPrice: 35.00 },
      { id: '7', name: 'Sanitizer Spray', category: 'Cleaning Supplies', quantity: '6 bottles', purchased: true, estimatedPrice: 42.00 },
    ]
  }
];

export const StoreListDashboard: React.FC = () => {
  const [storeLists, setStoreLists] = useState<StoreList[]>(initialStoreLists);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingList, setEditingList] = useState<string | null>(null);
  const [newListTitle, setNewListTitle] = useState('');
  const [newListStore, setNewListStore] = useState('');
  const [newListDate, setNewListDate] = useState('');
  const { toast } = useToast();

  const toggleItemPurchased = (listId: string, itemId: string) => {
    setStoreLists(prev => prev.map(list => {
      if (list.id === listId) {
        const updatedItems = list.items.map(item =>
          item.id === itemId ? { ...item, purchased: !item.purchased } : item
        );
        const purchasedCount = updatedItems.filter(item => item.purchased).length;
        const isCompleted = purchasedCount === updatedItems.length && updatedItems.length > 0;
        
        if (!list.items.find(i => i.id === itemId)?.purchased) {
          toast({
            title: "Item Purchased",
            description: `"${list.items.find(i => i.id === itemId)?.name}" marked as purchased`,
          });
        }
        
        return { ...list, items: updatedItems, completed: isCompleted };
      }
      return list;
    }));
  };

  const addNewItem = (listId: string) => {
    const newItem: StoreItem = {
      id: Date.now().toString(),
      name: '',
      category: 'Other',
      quantity: '',
      purchased: false,
    };

    setStoreLists(prev => prev.map(list =>
      list.id === listId
        ? { ...list, items: [...list.items, newItem] }
        : list
    ));
  };

  const updateItem = (listId: string, itemId: string, updates: Partial<StoreItem>) => {
    setStoreLists(prev => prev.map(list =>
      list.id === listId
        ? {
            ...list,
            items: list.items.map(item =>
              item.id === itemId ? { ...item, ...updates } : item
            )
          }
        : list
    ));
  };

  const removeItem = (listId: string, itemId: string) => {
    setStoreLists(prev => prev.map(list =>
      list.id === listId
        ? { ...list, items: list.items.filter(item => item.id !== itemId) }
        : list
    ));
  };

  const createNewList = () => {
    if (!newListTitle.trim() || !newListStore || !newListDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newList: StoreList = {
      id: Date.now().toString(),
      title: newListTitle,
      store: newListStore,
      targetDate: newListDate,
      items: [],
      totalEstimated: 0,
      completed: false,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setStoreLists(prev => [newList, ...prev]);
    setNewListTitle('');
    setNewListStore('');
    setNewListDate('');
    setIsCreateModalOpen(false);

    toast({
      title: "Store List Created",
      description: `"${newList.title}" has been created successfully`,
    });
  };

  const getTotalEstimate = (list: StoreList) => {
    return list.items.reduce((total, item) => total + (item.estimatedPrice || 0), 0);
  };

  const getPurchasedProgress = (list: StoreList) => {
    if (list.items.length === 0) return 0;
    return Math.round((list.items.filter(item => item.purchased).length / list.items.length) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Store Lists</h2>
          <p className="text-muted-foreground">Manage shopping lists and track purchases</p>
        </div>
        
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="bg-gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              Create Store List
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Store List</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">List Title</label>
                <Input
                  placeholder="e.g., Weekly Grocery Run"
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Store</label>
                <Select value={newListStore} onValueChange={setNewListStore}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a store" />
                  </SelectTrigger>
                  <SelectContent>
                    {commonStores.map(store => (
                      <SelectItem key={store} value={store}>{store}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Target Date</label>
                <Input
                  type="date"
                  value={newListDate}
                  onChange={(e) => setNewListDate(e.target.value)}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={createNewList} className="flex-1">Create List</Button>
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Store Lists Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {storeLists.map((list) => (
          <Card key={list.id} className="hover-lift transition-all border-l-4 border-l-accent">
            <CardHeader className="bg-gradient-card">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <ShoppingCart className="h-5 w-5 text-accent" />
                    {list.title}
                  </CardTitle>
                  <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {list.store}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(list.targetDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      ${getTotalEstimate(list).toFixed(2)}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant={list.completed ? 'default' : 'secondary'}>
                    {getPurchasedProgress(list)}% Complete
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingList(editingList === list.id ? null : list.id)}
                  >
                    <Edit3 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {/* Items by Category */}
              <div className="divide-y">
                {storeCategories.map(category => {
                  const categoryItems = list.items.filter(item => item.category === category);
                  if (categoryItems.length === 0 && editingList !== list.id) return null;

                  return (
                    <div key={category} className="p-4">
                      <h4 className="font-medium text-sm text-primary mb-3 flex items-center justify-between">
                        {category}
                        {editingList === list.id && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => addNewItem(list.id)}
                            className="h-6 w-6 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        )}
                      </h4>
                      
                      <div className="space-y-2">
                        {categoryItems.map((item) => (
                          <div key={item.id} className="flex items-start gap-3 p-2 rounded hover:bg-muted/30">
                            <Checkbox 
                              checked={item.purchased}
                              onCheckedChange={() => toggleItemPurchased(list.id, item.id)}
                              className="mt-1 data-[state=checked]:bg-success data-[state=checked]:border-success"
                            />
                            
                            {editingList === list.id ? (
                              <div className="flex-1 space-y-2">
                                <div className="flex gap-2">
                                  <Input
                                    placeholder="Item name"
                                    value={item.name}
                                    onChange={(e) => updateItem(list.id, item.id, { name: e.target.value })}
                                    className="flex-1"
                                  />
                                  <Input
                                    placeholder="Qty"
                                    value={item.quantity}
                                    onChange={(e) => updateItem(list.id, item.id, { quantity: e.target.value })}
                                    className="w-24"
                                  />
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => removeItem(list.id, item.id)}
                                    className="text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                                <div className="flex gap-2">
                                  <Select 
                                    value={item.category} 
                                    onValueChange={(value) => updateItem(list.id, item.id, { category: value })}
                                  >
                                    <SelectTrigger className="w-40">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {storeCategories.map(cat => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <Input
                                    type="number"
                                    placeholder="$0.00"
                                    value={item.estimatedPrice || ''}
                                    onChange={(e) => updateItem(list.id, item.id, { estimatedPrice: parseFloat(e.target.value) || 0 })}
                                    className="w-20"
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <span className={`font-medium ${item.purchased ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                                    {item.name}
                                  </span>
                                  {item.estimatedPrice && (
                                    <span className="text-sm text-success font-medium">
                                      ${item.estimatedPrice.toFixed(2)}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                  <span>{item.quantity}</span>
                                </div>
                                {item.notes && (
                                  <p className="text-xs text-muted-foreground mt-1">{item.notes}</p>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {editingList === list.id && (
                  <div className="p-4 bg-muted/20">
                    <Button
                      onClick={() => addNewItem(list.id)}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Item
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {storeLists.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Store Lists Yet</h3>
            <p className="text-muted-foreground mb-4">Create your first store list to get started</p>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              Create Store List
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};