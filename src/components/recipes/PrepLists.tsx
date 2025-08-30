import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Plus, 
  FileText, 
  Download, 
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PrepItem {
  id: string;
  name: string;
  category: string;
  estimatedQuantity: number;
  actualQuantity: number;
  unit: string;
  completed: boolean;
  assignedTo?: string;
  priority: 'Low' | 'Medium' | 'High';
  estimatedTime: number; // in minutes
}

interface PrepList {
  id: string;
  name: string;
  date: string;
  shift: 'Morning' | 'Afternoon' | 'Evening';
  items: PrepItem[];
  createdBy: string;
  totalEstimatedTime: number;
}

const mockPrepLists: PrepList[] = [
  {
    id: '1',
    name: 'Monday Morning Prep',
    date: '2024-03-18',
    shift: 'Morning',
    createdBy: 'Chef Johnson',
    totalEstimatedTime: 180,
    items: [
      {
        id: '1',
        name: 'Dice Onions',
        category: 'Vegetables',
        estimatedQuantity: 5,
        actualQuantity: 0,
        unit: 'cups',
        completed: false,
        assignedTo: 'Maria',
        priority: 'High',
        estimatedTime: 15
      },
      {
        id: '2',
        name: 'Marinate Chicken',
        category: 'Proteins',
        estimatedQuantity: 3,
        actualQuantity: 0,
        unit: 'lbs',
        completed: false,
        assignedTo: 'Carlos',
        priority: 'High',
        estimatedTime: 30
      },
      {
        id: '3',
        name: 'Prepare Stock',
        category: 'Sauces',
        estimatedQuantity: 2,
        actualQuantity: 0,
        unit: 'quarts',
        completed: false,
        assignedTo: 'Sarah',
        priority: 'Medium',
        estimatedTime: 45
      },
      {
        id: '4',
        name: 'Chop Herbs',
        category: 'Garnish',
        estimatedQuantity: 1,
        actualQuantity: 0,
        unit: 'cup',
        completed: false,
        assignedTo: 'Tom',
        priority: 'Low',
        estimatedTime: 10
      }
    ]
  }
];

export function PrepLists() {
  const [prepLists, setPrepLists] = useState<PrepList[]>(mockPrepLists);
  const [selectedList, setSelectedList] = useState<string>('1');
  const [newItemName, setNewItemName] = useState('');
  const { toast } = useToast();

  const currentList = prepLists.find(list => list.id === selectedList);

  const updateItemQuantity = (itemId: string, quantity: number) => {
    setPrepLists(prev => prev.map(list => 
      list.id === selectedList 
        ? {
            ...list,
            items: list.items.map(item =>
              item.id === itemId 
                ? { ...item, actualQuantity: quantity }
                : item
            )
          }
        : list
    ));
  };

  const toggleItemCompletion = (itemId: string) => {
    setPrepLists(prev => prev.map(list => 
      list.id === selectedList 
        ? {
            ...list,
            items: list.items.map(item =>
              item.id === itemId 
                ? { ...item, completed: !item.completed }
                : item
            )
          }
        : list
    ));
  };

  const generateReport = () => {
    if (!currentList) return;

    const incompleteItems = currentList.items.filter(item => !item.completed);
    const completedItems = currentList.items.filter(item => item.completed);

    const reportData = {
      listName: currentList.name,
      date: currentList.date,
      shift: currentList.shift,
      totalItems: currentList.items.length,
      completedItems: completedItems.length,
      incompleteItems: incompleteItems.length,
      completionRate: Math.round((completedItems.length / currentList.items.length) * 100),
      itemsNeedingPrep: incompleteItems.map(item => ({
        name: item.name,
        quantity: item.estimatedQuantity,
        unit: item.unit,
        assignedTo: item.assignedTo,
        priority: item.priority
      }))
    };

    // In a real app, this would generate a PDF or send to backend
    console.log('Prep List Report:', reportData);
    
    toast({
      title: "Report Generated",
      description: `Found ${incompleteItems.length} items that need preparation`,
    });
    
    // Simulate download
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `prep-report-${currentList.date}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const addNewItem = () => {
    if (!newItemName.trim() || !currentList) return;

    const newItem: PrepItem = {
      id: Date.now().toString(),
      name: newItemName,
      category: 'Miscellaneous',
      estimatedQuantity: 1,
      actualQuantity: 0,
      unit: 'unit',
      completed: false,
      priority: 'Medium',
      estimatedTime: 10
    };

    setPrepLists(prev => prev.map(list => 
      list.id === selectedList 
        ? { ...list, items: [...list.items, newItem] }
        : list
    ));

    setNewItemName('');
    toast({
      title: "Item Added",
      description: `${newItemName} added to prep list`,
    });
  };

  if (!currentList) return null;

  const completionRate = Math.round((currentList.items.filter(item => item.completed).length / currentList.items.length) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Daily Prep Lists</h2>
          <p className="text-muted-foreground">Manage daily preparation tasks and quantities</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={generateReport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Button className="bg-gradient-primary">
            <Plus className="h-4 w-4 mr-2" />
            Create New List
          </Button>
        </div>
      </div>

      {/* Prep List Tabs */}
      <Tabs value={selectedList} onValueChange={setSelectedList}>
        <TabsList>
          {prepLists.map((list) => (
            <TabsTrigger key={list.id} value={list.id}>
              {list.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedList} className="space-y-6">
          {/* List Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  {currentList.name}
                </CardTitle>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  {completionRate}% Complete
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {currentList.date}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {currentList.shift} Shift
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {currentList.createdBy}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Add New Item */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Add Prep Item</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter prep item name..."
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addNewItem()}
                  className="flex-1"
                />
                <Button onClick={addNewItem} disabled={!newItemName.trim()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Prep Items */}
          <div className="grid gap-4">
            {currentList.items.map((item) => (
              <Card key={item.id} className={`transition-all ${item.completed ? 'opacity-75' : ''}`}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <Checkbox
                      checked={item.completed}
                      onCheckedChange={() => toggleItemCompletion(item.id)}
                      className="flex-shrink-0"
                    />
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <Label className="text-sm font-medium">{item.name}</Label>
                        <p className="text-xs text-muted-foreground">{item.category}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="text-xs">Estimated:</Label>
                        <span className="text-sm font-medium">
                          {item.estimatedQuantity} {item.unit}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`quantity-${item.id}`} className="text-xs">Actual:</Label>
                        <Input
                          id={`quantity-${item.id}`}
                          type="number"
                          value={item.actualQuantity}
                          onChange={(e) => updateItemQuantity(item.id, parseFloat(e.target.value) || 0)}
                          className="w-20 h-8 text-sm"
                          min="0"
                          step="0.1"
                        />
                        <span className="text-xs text-muted-foreground">{item.unit}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(item.priority)}>
                          {item.priority}
                        </Badge>
                        {item.assignedTo && (
                          <Badge variant="outline" className="text-xs">
                            {item.assignedTo}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {item.estimatedTime}min
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Prep Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <Label className="text-muted-foreground">Total Items</Label>
                  <p className="text-lg font-semibold">{currentList.items.length}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Completed</Label>
                  <p className="text-lg font-semibold text-green-600">
                    {currentList.items.filter(item => item.completed).length}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Remaining</Label>
                  <p className="text-lg font-semibold text-orange-600">
                    {currentList.items.filter(item => !item.completed).length}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Est. Time</Label>
                  <p className="text-lg font-semibold">{currentList.totalEstimatedTime}min</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}