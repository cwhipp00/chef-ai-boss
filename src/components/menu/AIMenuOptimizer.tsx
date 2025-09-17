import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Target,
  BarChart3,
  Zap,
  Loader2,
  Plus,
  Minus,
  AlertTriangle,
  CheckCircle,
  Star
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  ingredients: string[];
  preparationTime: number;
  popularity: number;
  profitMargin: number;
  allergens: string[];
  dietaryInfo: string[];
  seasonality: string[];
}

interface OptimizedMenuItem extends MenuItem {
  optimizationScore: number;
  reasonKept: string;
  suggestedChanges: string[];
  projectedPerformance: {
    salesIncrease: number;
    profitIncrease: number;
    popularityScore: number;
  };
}

interface SuggestedMenuItem {
  name: string;
  category: string;
  description: string;
  suggestedPrice: number;
  estimatedCost: number;
  ingredients: string[];
  marketOpportunity: string;
  projectedPopularity: number;
  competitiveAdvantage: string;
}

interface OptimizedMenu {
  recommendedMenu: OptimizedMenuItem[];
  removedItems: Array<{
    item: MenuItem;
    reason: string;
    impactAnalysis: string;
    alternatives: string[];
  }>;
  newItems: SuggestedMenuItem[];
  analytics: {
    currentPerformance: {
      totalRevenue: number;
      averageMargin: number;
      popularityDistribution: any;
      categoryBalance: any;
    };
    optimizedPerformance: {
      projectedRevenue: number;
      projectedMargin: number;
      efficiencyGains: number;
      customerSatisfactionImpact: number;
    };
  };
  recommendations: string[];
  financialProjections: {
    revenueImpact: {
      monthly: number;
      quarterly: number;
      annual: number;
    };
    costSavings: {
      foodCosts: number;
      laborEfficiency: number;
      wasteReduction: number;
    };
    roi: {
      breakEvenPeriod: string;
      expectedRoi: number;
    };
  };
}

// Sample menu data
const sampleMenu: MenuItem[] = [
  {
    id: '1',
    name: 'Grilled Salmon',
    category: 'Main Course',
    price: 28,
    cost: 12,
    ingredients: ['salmon', 'lemon', 'herbs'],
    preparationTime: 20,
    popularity: 85,
    profitMargin: 57,
    allergens: ['Fish'],
    dietaryInfo: ['Gluten-Free'],
    seasonality: ['Spring', 'Summer']
  },
  {
    id: '2',
    name: 'Chicken Caesar Salad',
    category: 'Salad',
    price: 16,
    cost: 6,
    ingredients: ['chicken', 'romaine', 'parmesan'],
    preparationTime: 10,
    popularity: 92,
    profitMargin: 63,
    allergens: ['Dairy'],
    dietaryInfo: [],
    seasonality: ['All Year']
  },
  {
    id: '3',
    name: 'Truffle Risotto',
    category: 'Main Course',
    price: 24,
    cost: 8,
    ingredients: ['arborio rice', 'truffle oil', 'parmesan'],
    preparationTime: 30,
    popularity: 68,
    profitMargin: 67,
    allergens: ['Dairy'],
    dietaryInfo: ['Vegetarian'],
    seasonality: ['Fall', 'Winter']
  }
];

const OPTIMIZATION_TYPES = {
  profit: 'Maximize Profit',
  popularity: 'Increase Popularity',
  sustainability: 'Sustainability Focus',
  balanced: 'Balanced Approach'
};

const CATEGORIES = ['Appetizers', 'Salads', 'Main Course', 'Desserts', 'Beverages'];

export function AIMenuOptimizer() {
  const [currentMenu, setCurrentMenu] = useState<MenuItem[]>(sampleMenu);
  const [optimizationType, setOptimizationType] = useState<'profit' | 'popularity' | 'sustainability' | 'balanced'>('balanced');
  const [maxMenuItems, setMaxMenuItems] = useState(25);
  const [minProfitMargin, setMinProfitMargin] = useState(40);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedMenu, setOptimizedMenu] = useState<OptimizedMenu | null>(null);
  const { toast } = useToast();

  const addMenuItem = () => {
    const newItem: MenuItem = {
      id: Date.now().toString(),
      name: 'New Menu Item',
      category: 'Main Course',
      price: 20,
      cost: 8,
      ingredients: ['ingredient1', 'ingredient2'],
      preparationTime: 15,
      popularity: 50,
      profitMargin: 60,
      allergens: [],
      dietaryInfo: [],
      seasonality: ['All Year']
    };
    setCurrentMenu([...currentMenu, newItem]);
  };

  const removeMenuItem = (id: string) => {
    setCurrentMenu(currentMenu.filter(item => item.id !== id));
  };

  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    setCurrentMenu(currentMenu.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const optimizeMenu = async () => {
    if (currentMenu.length === 0) {
      toast({
        title: "No Menu Items",
        description: "Please add menu items to optimize",
        variant: "destructive",
      });
      return;
    }

    setIsOptimizing(true);

    try {
      // Generate mock sales data
      const salesData = {
        dailySales: currentMenu.reduce((acc, item) => ({ ...acc, [item.id]: Math.floor(Math.random() * 50) + 10 }), {}),
        weeklySales: currentMenu.reduce((acc, item) => ({ ...acc, [item.id]: Math.floor(Math.random() * 200) + 50 }), {}),
        monthlySales: currentMenu.reduce((acc, item) => ({ ...acc, [item.id]: Math.floor(Math.random() * 800) + 200 }), {}),
        customerFeedback: currentMenu.reduce((acc, item) => ({ 
          ...acc, 
          [item.id]: {
            averageRating: 3.5 + Math.random() * 1.5,
            reviewCount: Math.floor(Math.random() * 100) + 20,
            commonComments: ['Great taste', 'Good value', 'Fresh ingredients'],
            complaintsRate: Math.random() * 0.1
          }
        }), {}),
        trendsData: [{
          period: 'current',
          topItems: currentMenu.slice(0, 3).map(item => item.id),
          emergingTrends: ['Plant-based', 'Gluten-free', 'Local sourcing'],
          decliningItems: []
        }]
      };

      const inventory = currentMenu.flatMap(item => 
        item.ingredients.map(ingredient => ({
          id: ingredient,
          name: ingredient,
          category: 'Ingredient',
          currentStock: Math.floor(Math.random() * 100) + 50,
          cost: Math.random() * 5 + 1,
          spoilageRate: Math.random() * 0.1,
          seasonality: ['All Year']
        }))
      );

      const constraints = {
        maxMenuItems,
        minProfitMargin,
        requiredCategories: CATEGORIES,
        dietaryRequirements: ['Vegetarian', 'Gluten-Free'],
        budgetConstraints: {
          maxFoodCost: 15,
          maxPreparationTime: 25
        }
      };

      const { data, error } = await supabase.functions.invoke('ai-menu-optimizer', {
        body: {
          currentMenu,
          salesData,
          inventory,
          constraints,
          optimizationType
        }
      });

      if (error) throw error;

      if (data.success) {
        setOptimizedMenu(data.optimizedMenu);
        toast({
          title: "Menu Optimized!",
          description: `Menu optimized for ${optimizationType} with AI analysis`,
        });
      } else {
        throw new Error(data.error || 'Optimization failed');
      }
    } catch (error) {
      console.error('Menu optimization error:', error);
      toast({
        title: "Optimization Failed",
        description: "Failed to optimize menu. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            AI Menu Optimizer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Optimization Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Optimization Type</Label>
              <Select value={optimizationType} onValueChange={(value) => setOptimizationType(value as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(OPTIMIZATION_TYPES).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Max Menu Items</Label>
              <Input
                type="number"
                value={maxMenuItems}
                onChange={(e) => setMaxMenuItems(parseInt(e.target.value) || 25)}
                min="10"
                max="50"
              />
            </div>

            <div className="space-y-2">
              <Label>Min Profit Margin (%)</Label>
              <Input
                type="number"
                value={minProfitMargin}
                onChange={(e) => setMinProfitMargin(parseInt(e.target.value) || 40)}
                min="0"
                max="100"
              />
            </div>
          </div>

          <Separator />

          {/* Current Menu Management */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Current Menu ({currentMenu.length} items)</h3>
              <Button onClick={addMenuItem} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>

            <div className="grid gap-4 max-h-80 overflow-y-auto">
              {currentMenu.map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Input
                          value={item.name}
                          onChange={(e) => updateMenuItem(item.id, { name: e.target.value })}
                          className="font-medium"
                        />
                        <Badge variant="outline">{item.category}</Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        <div>
                          <Label className="text-xs">Price</Label>
                          <Input
                            type="number"
                            value={item.price}
                            onChange={(e) => updateMenuItem(item.id, { price: parseFloat(e.target.value) || 0 })}
                            className="h-8"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Cost</Label>
                          <Input
                            type="number"
                            value={item.cost}
                            onChange={(e) => updateMenuItem(item.id, { cost: parseFloat(e.target.value) || 0 })}
                            className="h-8"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Popularity</Label>
                          <Input
                            type="number"
                            value={item.popularity}
                            onChange={(e) => updateMenuItem(item.id, { popularity: parseInt(e.target.value) || 0 })}
                            className="h-8"
                            min="0"
                            max="100"
                          />
                        </div>
                        <div className="flex items-end">
                          <span className="text-sm font-medium text-success">
                            {item.profitMargin.toFixed(0)}% margin
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeMenuItem(item.id)}
                      className="ml-4"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <Button 
            onClick={optimizeMenu}
            disabled={isOptimizing || currentMenu.length === 0}
            size="lg"
            className="w-full"
          >
            {isOptimizing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Optimizing Menu...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Optimize Menu with AI
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Optimization Results */}
      {optimizedMenu && (
        <div className="space-y-6">
          {/* Financial Impact Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Financial Impact Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-success">
                    ${optimizedMenu.financialProjections.revenueImpact.monthly.toFixed(0)}
                  </div>
                  <p className="text-sm text-muted-foreground">Monthly Revenue Increase</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {optimizedMenu.financialProjections.roi.expectedRoi.toFixed(1)}x
                  </div>
                  <p className="text-sm text-muted-foreground">Expected ROI</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-warning">
                    {optimizedMenu.financialProjections.roi.breakEvenPeriod}
                  </div>
                  <p className="text-sm text-muted-foreground">Break-even Period</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="recommended" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="recommended">Recommended Menu</TabsTrigger>
              <TabsTrigger value="removed">Removed Items</TabsTrigger>
              <TabsTrigger value="new">New Suggestions</TabsTrigger>
              <TabsTrigger value="insights">AI Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="recommended" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-success" />
                    Optimized Menu Items ({optimizedMenu.recommendedMenu.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {optimizedMenu.recommendedMenu.map((item) => (
                      <Card key={item.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold">{item.name}</h4>
                              <Badge variant="outline">{item.category}</Badge>
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 text-warning" />
                                <span className="text-sm font-medium">{item.optimizationScore}/100</span>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{item.reasonKept}</p>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Price: </span>
                                <span className="font-medium">${item.price}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Margin: </span>
                                <span className="font-medium text-success">{item.profitMargin}%</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Popularity: </span>
                                <span className="font-medium">{item.popularity}%</span>
                              </div>
                            </div>
                            {item.suggestedChanges.length > 0 && (
                              <div className="mt-3">
                                <p className="text-xs font-medium text-primary mb-1">Suggested Improvements:</p>
                                <ul className="text-xs text-muted-foreground space-y-1">
                                  {item.suggestedChanges.map((change, index) => (
                                    <li key={index}>• {change}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-success">
                              +{item.projectedPerformance.salesIncrease.toFixed(1)}% sales
                            </div>
                            <div className="text-sm text-success">
                              +{item.projectedPerformance.profitIncrease.toFixed(1)}% profit
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="removed">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    Recommended Removals ({optimizedMenu.removedItems.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {optimizedMenu.removedItems.map((removedItem, index) => (
                      <Card key={index} className="p-4 border-destructive/20">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">{removedItem.item.name}</h4>
                            <Badge variant="destructive">Remove</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{removedItem.reason}</p>
                          <p className="text-sm text-destructive">{removedItem.impactAnalysis}</p>
                          {removedItem.alternatives.length > 0 && (
                            <div>
                              <p className="text-xs font-medium mb-1">Suggested Alternatives:</p>
                              <ul className="text-xs text-muted-foreground">
                                {removedItem.alternatives.map((alt, idx) => (
                                  <li key={idx}>• {alt}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="new">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    New Item Suggestions ({optimizedMenu.newItems.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {optimizedMenu.newItems.map((newItem, index) => (
                      <Card key={index} className="p-4 border-primary/20">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">{newItem.name}</h4>
                            <Badge variant="outline" className="bg-primary/10 text-primary">
                              New Opportunity
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{newItem.description}</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Suggested Price: </span>
                              <span className="font-medium">${newItem.suggestedPrice}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Est. Cost: </span>
                              <span className="font-medium">${newItem.estimatedCost}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Category: </span>
                              <span className="font-medium">{newItem.category}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Popularity: </span>
                              <span className="font-medium">{newItem.projectedPopularity}%</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div>
                              <p className="text-xs font-medium text-primary">Market Opportunity:</p>
                              <p className="text-xs text-muted-foreground">{newItem.marketOpportunity}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-success">Competitive Advantage:</p>
                              <p className="text-xs text-muted-foreground">{newItem.competitiveAdvantage}</p>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insights">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    AI Analysis & Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {optimizedMenu.recommendations.map((recommendation, index) => (
                    <div key={index} className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                      <p className="text-sm">{recommendation}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}