import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, FileText, ChefHat, Utensils } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Define the prep list data structure
const prepCategories = {
  'CAKES/FT/WAFFLES': [
    'Pancakes', 'Buckwheat Cakes', 'Multigrain Cakes', 'Special Cakes/FT/Waffle', 'French Toast Mix', 'Waffles'
  ],
  'MISC': [
    'Stack American Cheese', 'Shred Swiss', 'Toast Butters', 'HBE', 'Croutons', 'Pickles', 'Fish Batter',
    'Chicken Breader', 'Chicken Salad', 'Cook Potatoes', 'Potato Pancakes', 'Omelet Sausage', 'Gravy Sausage',
    'Turkey Sausage', 'Pjack Meat', 'Taco Meat', 'Burgers', 'Steaks', 'Cook Roast Beef', 'Special Sausage'
  ],
  'DICE': [
    'White Onions', 'Red Onions', 'Green Onions', 'QT Onions', 'Tomatoes', 'Enchilada Chicken'
  ],
  'SEASONINGS': [
    'Ranch', 'Taco', 'Enchilada', 'Burger', 'French Fry'
  ],
  'PORTION': [
    'Blue Topping', 'Strawberry Topping', 'Salsa', 'Sour Cream', 'Apple Sauce', 'Brown Sugar',
    'Sm. Ranch', 'Lg. Ranch', 'Sm. Blue Cheese', 'Lg. Blue Cheese', 'PJack Meat', 'Taco Meat'
  ],
  'SLICE': [
    'Italian Meat', 'Deli Turkey', 'Deli Ham', 'Ham Steaks', 'Corned Beef', 'Roast Beef', 'Ghoetta',
    'Canadian Bacon', 'Tomatoes', 'White Onions', 'Red Onions', 'Portobello Mushrooms', 'Slice Potatoes'
  ],
  'SAUCES/DRESSINGS': [
    'Enchilada Sauce', 'Hollandaise', 'Chipotle Hollandaise', 'Sweet Cream Cheese', 'Cinn Drizzle',
    'Ranch', 'Coleslaw Dressing', 'Sesame Dressing', 'Tartar', 'Red Pepper Mayo', '1000 Island',
    'Honey Lime Dressing', 'Garlic Horseradish Aioli', 'IPA', 'Bang Bang', 'Teriyaki', 'Buffalo',
    'BBQ', 'Hot Honey', 'Specials:'
  ]
};

const daysOfWeek = ['Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];

interface PrepItem {
  name: string;
  quantities: { [day: string]: number };
}

interface PrepData {
  [category: string]: PrepItem[];
}

export function PrepLists() {
  const { toast } = useToast();
  
  const [prepData, setPrepData] = useState<PrepData>(() => {
    const initialData: PrepData = {};
    Object.entries(prepCategories).forEach(([category, items]) => {
      initialData[category] = items.map(item => ({
        name: item,
        quantities: daysOfWeek.reduce((acc, day) => ({ ...acc, [day]: 0 }), {})
      }));
    });
    return initialData;
  });

  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [showReport, setShowReport] = useState(false);

  const updateQuantity = (category: string, itemIndex: number, day: string, quantity: number) => {
    setPrepData(prev => ({
      ...prev,
      [category]: prev[category].map((item, idx) => 
        idx === itemIndex 
          ? { ...item, quantities: { ...item.quantities, [day]: Math.max(0, quantity) } }
          : item
      )
    }));
  };

  const toggleDay = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const generateReport = () => {
    const reportItems = getReportData();
    
    toast({
      title: "Report Generated",
      description: `Found ${reportItems.length} items with quantities`,
    });
    
    // Simulate download
    const dataStr = JSON.stringify(reportItems, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `prep-report-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    setShowReport(true);
  };

  const getReportData = () => {
    const reportItems: { category: string; item: string; total: number; days: { [day: string]: number } }[] = [];
    
    Object.entries(prepData).forEach(([category, items]) => {
      items.forEach(item => {
        const dayTotals = daysOfWeek.reduce((acc, day) => {
          if (selectedDays.length === 0 || selectedDays.includes(day)) {
            acc[day] = item.quantities[day];
          }
          return acc;
        }, {} as { [day: string]: number });
        
        const total = Object.values(dayTotals).reduce((sum, qty) => sum + qty, 0);
        
        if (total > 0) {
          reportItems.push({
            category,
            item: item.name,
            total,
            days: dayTotals
          });
        }
      });
    });
    
    return reportItems;
  };

  if (showReport) {
    const reportData = getReportData();
    
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-prep-header" />
              <h1 className="text-3xl font-bold text-prep-header">Prep List Report</h1>
            </div>
            <Button onClick={() => setShowReport(false)} variant="outline">
              Back to Dashboard
            </Button>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                Report Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <span className="text-muted-foreground">Days:</span>
                {selectedDays.length === 0 ? (
                  <Badge variant="secondary">All Days</Badge>
                ) : (
                  selectedDays.map(day => (
                    <Badge key={day} variant="default">{day}</Badge>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {Object.keys(prepCategories).map(category => {
              const categoryItems = reportData.filter(item => item.category === category);
              if (categoryItems.length === 0) return null;

              return (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="text-lg text-prep-header">{category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {categoryItems.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center p-2 bg-prep-category rounded">
                          <span className="font-medium">{item.item}</span>
                          <div className="flex items-center gap-4">
                            <div className="flex gap-2">
                              {Object.entries(item.days).map(([day, qty]) => (
                                qty > 0 && (
                                  <Badge key={day} variant="outline">
                                    {day}: {qty}
                                  </Badge>
                                )
                              ))}
                            </div>
                            <Badge className="bg-prep-header text-white">
                              Total: {item.total}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <ChefHat className="h-8 w-8 text-prep-header" />
            <h1 className="text-3xl font-bold text-prep-header">Kitchen Prep Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={generateReport} className="bg-prep-header hover:bg-prep-header/90">
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* Day Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Select Days for Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {daysOfWeek.map(day => (
                <Button
                  key={day}
                  variant={selectedDays.includes(day) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleDay(day)}
                  className={selectedDays.includes(day) ? "bg-prep-header hover:bg-prep-header/90" : ""}
                >
                  {day}
                </Button>
              ))}
              {selectedDays.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedDays([])}
                  className="text-muted-foreground"
                >
                  Clear All
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Prep Grid */}
        <div className="grid gap-6">
          {Object.entries(prepCategories).map(([category, items]) => (
            <Card key={category} className="overflow-hidden">
              <CardHeader className="bg-prep-category">
                <CardTitle className="flex items-center gap-2 text-prep-header">
                  <Utensils className="h-5 w-5" />
                  {category}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-prep-grid">
                        <th className="text-left p-3 font-semibold">Item</th>
                        {daysOfWeek.map(day => (
                          <th key={day} className="text-center p-3 font-semibold min-w-20">{day}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {prepData[category]?.map((item, itemIndex) => (
                        <tr key={itemIndex} className="border-b hover:bg-muted/50">
                          <td className="p-3 font-medium">{item.name}</td>
                          {daysOfWeek.map(day => (
                            <td key={day} className="p-2 text-center">
                              <Input
                                type="number"
                                min="0"
                                value={item.quantities[day] || ''}
                                onChange={(e) => updateQuantity(category, itemIndex, day, parseInt(e.target.value) || 0)}
                                className="w-16 h-8 text-center"
                                placeholder="0"
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}