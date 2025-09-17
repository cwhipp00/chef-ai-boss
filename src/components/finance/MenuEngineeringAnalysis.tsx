import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Star, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  AlertTriangle,
  Crown,
  ThumbsDown,
  DollarSign,
  PieChart,
  BarChart3,
  Lightbulb
} from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  profit: number;
  profitMargin: number;
  popularity: number;
  revenue: number;
  unitsSold: number;
  classification: 'star' | 'plow_horse' | 'puzzle' | 'dog';
  trend: number;
  competitors: string[];
}

interface MenuCategory {
  name: string;
  items: number;
  revenue: number;
  profit: number;
  avgMargin: number;
  performance: 'excellent' | 'good' | 'poor';
}

export const MenuEngineeringAnalysis = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('profit');

  // Mock data - will be enhanced with Toast POS integration
  const [menuItems] = useState<MenuItem[]>([
    {
      id: '1',
      name: 'Signature Pasta',
      category: 'Main Course',
      price: 24.95,
      cost: 7.20,
      profit: 17.75,
      profitMargin: 71.1,
      popularity: 92,
      revenue: 8420,
      unitsSold: 337,
      classification: 'star',
      trend: 12.5,
      competitors: ['Olive Garden', 'Maggianos']
    },
    {
      id: '2',
      name: 'Grilled Salmon',
      category: 'Main Course',
      price: 32.50,
      cost: 14.20,
      profit: 18.30,
      profitMargin: 56.3,
      popularity: 68,
      revenue: 6780,
      unitsSold: 208,
      classification: 'puzzle',
      trend: 8.2,
      competitors: ['Red Lobster', 'Ocean Prime']
    },
    {
      id: '3',
      name: 'Caesar Salad',
      category: 'Appetizer',
      price: 14.50,
      cost: 3.80,
      profit: 10.70,
      profitMargin: 73.8,
      popularity: 89,
      revenue: 3210,
      unitsSold: 221,
      classification: 'star',
      trend: 6.3,
      competitors: ['Panera', 'Cheesecake Factory']
    },
    {
      id: '4',
      name: 'Ribeye Steak',
      category: 'Main Course',
      price: 42.95,
      cost: 21.50,
      profit: 21.45,
      profitMargin: 49.9,
      popularity: 45,
      revenue: 5890,
      unitsSold: 137,
      classification: 'puzzle',
      trend: -3.2,
      competitors: ['Steakhouse Elite', 'Morton\'s']
    },
    {
      id: '5',
      name: 'Chicken Wings',
      category: 'Appetizer',
      price: 16.95,
      cost: 5.20,
      profit: 11.75,
      profitMargin: 69.3,
      popularity: 78,
      revenue: 4560,
      unitsSold: 269,
      classification: 'plow_horse',
      trend: 15.8,
      competitors: ['Buffalo Wild Wings', 'Hooters']
    },
    {
      id: '6',
      name: 'Lobster Bisque',
      category: 'Soup',
      price: 18.50,
      cost: 12.80,
      profit: 5.70,
      profitMargin: 30.8,
      popularity: 28,
      revenue: 1240,
      unitsSold: 67,
      classification: 'dog',
      trend: -8.5,
      competitors: ['Legal Sea Foods', 'Chart House']
    }
  ]);

  const [categories] = useState<MenuCategory[]>([
    {
      name: 'Main Course',
      items: 12,
      revenue: 45680,
      profit: 28420,
      avgMargin: 62.2,
      performance: 'excellent'
    },
    {
      name: 'Appetizer',
      items: 8,
      revenue: 15430,
      profit: 9890,
      avgMargin: 64.1,
      performance: 'excellent'
    },
    {
      name: 'Dessert',
      items: 6,
      revenue: 8920,
      profit: 6240,
      avgMargin: 69.9,
      performance: 'good'
    },
    {
      name: 'Beverage',
      items: 15,
      revenue: 12580,
      profit: 9840,
      avgMargin: 78.3,
      performance: 'excellent'
    },
    {
      name: 'Soup',
      items: 4,
      revenue: 3240,
      profit: 1580,
      avgMargin: 48.8,
      performance: 'poor'
    }
  ]);

  const getClassificationInfo = (classification: string) => {
    switch (classification) {
      case 'star':
        return {
          icon: <Crown className="h-4 w-4 text-yellow-500" />,
          label: 'Star',
          color: 'bg-yellow-500',
          description: 'High profit, high popularity'
        };
      case 'plow_horse':
        return {
          icon: <Target className="h-4 w-4 text-blue-500" />,
          label: 'Plow Horse',
          color: 'bg-blue-500',
          description: 'Low profit, high popularity'
        };
      case 'puzzle':
        return {
          icon: <AlertTriangle className="h-4 w-4 text-orange-500" />,
          label: 'Puzzle',
          color: 'bg-orange-500',
          description: 'High profit, low popularity'
        };
      case 'dog':
        return {
          icon: <ThumbsDown className="h-4 w-4 text-red-500" />,
          label: 'Dog',
          color: 'bg-red-500',
          description: 'Low profit, low popularity'
        };
      default:
        return {
          icon: <PieChart className="h-4 w-4" />,
          label: 'Unknown',
          color: 'bg-gray-500',
          description: ''
        };
    }
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent': return 'text-success';
      case 'good': return 'text-warning';
      case 'poor': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getTrendIcon = (trend: number) => {
    return trend >= 0 ? 
      <TrendingUp className="h-4 w-4 text-success" /> : 
      <TrendingDown className="h-4 w-4 text-destructive" />;
  };

  const getRecommendation = (item: MenuItem) => {
    switch (item.classification) {
      case 'star':
        return 'Promote heavily, maintain quality, consider premium positioning';
      case 'plow_horse':
        return 'Reduce costs, increase prices carefully, or reposition';
      case 'puzzle':
        return 'Increase marketing, improve presentation, or reduce price';
      case 'dog':
        return 'Consider removal, major repositioning, or replacement';
      default:
        return 'Monitor performance closely';
    }
  };

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'profit': return b.profit - a.profit;
      case 'popularity': return b.popularity - a.popularity;
      case 'revenue': return b.revenue - a.revenue;
      case 'margin': return b.profitMargin - a.profitMargin;
      default: return 0;
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Menu Engineering Analysis</h2>
          <p className="text-muted-foreground">Optimize menu profitability and performance</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Main Course">Main Course</SelectItem>
              <SelectItem value="Appetizer">Appetizer</SelectItem>
              <SelectItem value="Dessert">Dessert</SelectItem>
              <SelectItem value="Beverage">Beverage</SelectItem>
              <SelectItem value="Soup">Soup</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="profit">Sort by Profit</SelectItem>
              <SelectItem value="popularity">Sort by Popularity</SelectItem>
              <SelectItem value="revenue">Sort by Revenue</SelectItem>
              <SelectItem value="margin">Sort by Margin</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Category Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <Card key={index} className="glass-card hover-lift">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{category.name}</CardTitle>
                <Badge className={`${getPerformanceColor(category.performance)} bg-transparent border`}>
                  {category.performance}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Items</p>
                  <p className="font-medium">{category.items}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Revenue</p>
                  <p className="font-medium text-success">${category.revenue.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Profit</p>
                  <p className="font-medium">${category.profit.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Avg Margin</p>
                  <p className="font-medium">{category.avgMargin.toFixed(1)}%</p>
                </div>
              </div>
              <Progress value={category.avgMargin} className="h-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Menu Classification Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Menu Item Classifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {['star', 'plow_horse', 'puzzle', 'dog'].map((classification) => {
              const info = getClassificationInfo(classification);
              const count = menuItems.filter(item => item.classification === classification).length;
              
              return (
                <div key={classification} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className={`p-2 rounded-lg ${info.color.replace('bg-', 'bg-opacity-20 bg-')}`}>
                    {info.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{info.label}</h4>
                    <p className="text-xs text-muted-foreground">{info.description}</p>
                    <p className="text-xs font-medium mt-1">{count} items</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Menu Items Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Menu Items Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {sortedItems.map((item) => {
            const classification = getClassificationInfo(item.classification);
            
            return (
              <div key={item.id} className="p-4 border rounded-lg hover:shadow-sm transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${classification.color.replace('bg-', 'bg-opacity-20 bg-')}`}>
                      {classification.icon}
                    </div>
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">{item.category} • ${item.price}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(item.trend)}
                    <Badge className={`${classification.color} text-white`}>
                      {classification.label}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                    <p className="font-medium text-success">${item.revenue.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Profit</p>
                    <p className="font-medium">${item.profit.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Margin</p>
                    <p className="font-medium">{item.profitMargin.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Popularity</p>
                    <p className="font-medium">{item.popularity}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Units Sold</p>
                    <p className="font-medium">{item.unitsSold}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Trend</p>
                    <p className={`font-medium ${item.trend >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {item.trend >= 0 ? '+' : ''}{item.trend.toFixed(1)}%
                    </p>
                  </div>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-xs">
                    <span>Profitability Score</span>
                    <span>{item.profitMargin.toFixed(1)}%</span>
                  </div>
                  <Progress value={item.profitMargin} className="h-2" />
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-xs">
                    <span>Popularity Score</span>
                    <span>{item.popularity}%</span>
                  </div>
                  <Progress value={item.popularity} className="h-2" />
                </div>

                <div className="p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Recommendation</p>
                      <p className="text-sm text-muted-foreground">{getRecommendation(item)}</p>
                    </div>
                  </div>
                </div>

                {item.competitors.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-muted-foreground mb-1">Similar items at:</p>
                    <div className="flex flex-wrap gap-1">
                      {item.competitors.map((competitor, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {competitor}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Action Items */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Star className="h-5 w-5" />
            Priority Action Items
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex items-center gap-2 mb-1">
              <ThumbsDown className="h-4 w-4 text-red-600" />
              <span className="font-medium text-sm">Remove Underperformers</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Consider removing or replacing Lobster Bisque (Dog classification, -8.5% trend)
            </p>
            <p className="text-sm font-medium text-success mt-1">Menu space optimization</p>
          </div>

          <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center gap-2 mb-1">
              <Crown className="h-4 w-4 text-yellow-600" />
              <span className="font-medium text-sm">Promote Stars</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Feature Signature Pasta and Caesar Salad more prominently on menu
            </p>
            <p className="text-sm font-medium text-success mt-1">Expected revenue increase: 15-20%</p>
          </div>

          <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <span className="font-medium text-sm">Optimize Puzzles</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Increase marketing for Grilled Salmon and Ribeye Steak to boost popularity
            </p>
            <p className="text-sm font-medium text-success mt-1">High profit potential items</p>
          </div>

          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-1">
              <Target className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-sm">Cost Control</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Review ingredient costs for Chicken Wings to improve profit margins
            </p>
            <p className="text-sm font-medium text-success mt-1">Popular item with margin improvement potential</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};