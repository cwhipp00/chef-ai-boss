import { useState, useMemo } from 'react';
import { Star, DollarSign, Clock, Users, ChefHat, Heart, Zap, TrendingUp, Filter, SortAsc, SortDesc, BarChart3, PieChart, Calendar, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Recipe {
  id: number;
  name: string;
  category: string;
  servings: number;
  prepTime: number;
  cookTime: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  cost: number;
  sellPrice?: number;
  rating?: number;
  reviews?: number;
  popularity?: number;
  nutritionScore?: number;
  allergens: string[];
  ingredients: string[];
  instructions: string[];
  tags?: string[];
  lastMade?: string;
  profitMargin?: number;
}

interface AnalyticsData {
  totalRecipes: number;
  averageCost: number;
  averageRating: number;
  mostPopularCategory: string;
  profitMargin: number;
  topPerformers: Recipe[];
  costTrends: Array<{ month: string; avgCost: number }>;
  categoryDistribution: Array<{ category: string; count: number; percentage: number }>;
}

interface EnhancedRecipeManagementProps {
  recipes: Recipe[];
  onRecipeUpdate?: (recipe: Recipe) => void;
}

export default function EnhancedRecipeManagement({ recipes, onRecipeUpdate }: EnhancedRecipeManagementProps) {
  const [sortBy, setSortBy] = useState<'name' | 'cost' | 'rating' | 'popularity' | 'profit'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Enhanced recipe data with calculations
  const enhancedRecipes: Recipe[] = useMemo(() => {
    return recipes.map(recipe => ({
      ...recipe,
      sellPrice: recipe.sellPrice || recipe.cost * 3, // 3x markup default
      rating: recipe.rating || Math.random() * 2 + 3, // Random rating 3-5
      reviews: recipe.reviews || Math.floor(Math.random() * 100) + 10,
      popularity: recipe.popularity || Math.random() * 100,
      nutritionScore: recipe.nutritionScore || Math.random() * 100,
      profitMargin: recipe.profitMargin || ((recipe.sellPrice || recipe.cost * 3) - recipe.cost) / (recipe.sellPrice || recipe.cost * 3) * 100,
      lastMade: recipe.lastMade || '2024-01-15',
      tags: recipe.tags || ['signature', 'bestseller']
    }));
  }, [recipes]);

  // Analytics calculations
  const analytics: AnalyticsData = useMemo(() => {
    const totalRecipes = enhancedRecipes.length;
    const averageCost = enhancedRecipes.reduce((sum, r) => sum + r.cost, 0) / totalRecipes;
    const averageRating = enhancedRecipes.reduce((sum, r) => sum + (r.rating || 0), 0) / totalRecipes;
    
    const categoryCount = enhancedRecipes.reduce((acc, recipe) => {
      acc[recipe.category] = (acc[recipe.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const mostPopularCategory = Object.entries(categoryCount).reduce((a, b) => 
      categoryCount[a[0]] > categoryCount[b[0]] ? a : b
    )[0];

    const profitMargin = enhancedRecipes.reduce((sum, r) => sum + (r.profitMargin || 0), 0) / totalRecipes;
    
    const topPerformers = enhancedRecipes
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, 3);

    const categoryDistribution = Object.entries(categoryCount).map(([category, count]) => ({
      category,
      count,
      percentage: (count / totalRecipes) * 100
    }));

    const costTrends = [
      { month: 'Jan', avgCost: averageCost * 0.9 },
      { month: 'Feb', avgCost: averageCost * 0.95 },
      { month: 'Mar', avgCost: averageCost * 1.02 },
      { month: 'Apr', avgCost: averageCost * 1.05 },
      { month: 'May', avgCost: averageCost * 0.98 },
      { month: 'Jun', avgCost: averageCost }
    ];

    return {
      totalRecipes,
      averageCost,
      averageRating,
      mostPopularCategory,
      profitMargin,
      topPerformers,
      costTrends,
      categoryDistribution
    };
  }, [enhancedRecipes]);

  // Filtering and sorting
  const filteredAndSortedRecipes = useMemo(() => {
    let filtered = enhancedRecipes;

    if (filterCategory !== 'All') {
      filtered = filtered.filter(recipe => recipe.category === filterCategory);
    }

    if (filterDifficulty !== 'All') {
      filtered = filtered.filter(recipe => recipe.difficulty === filterDifficulty);
    }

    filtered.sort((a, b) => {
      let aValue: number | string, bValue: number | string;
      
      switch (sortBy) {
        case 'cost':
          aValue = a.cost || 0;
          bValue = b.cost || 0;
          break;
        case 'rating':
          aValue = a.rating || 0;
          bValue = b.rating || 0;
          break;
        case 'popularity':
          aValue = a.popularity || 0;
          bValue = b.popularity || 0;
          break;
        case 'profit':
          aValue = a.profitMargin || 0;
          bValue = b.profitMargin || 0;
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      const numA = typeof aValue === 'number' ? aValue : 0;
      const numB = typeof bValue === 'number' ? bValue : 0;
      return sortOrder === 'asc' ? numA - numB : numB - numA;
    });

    return filtered;
  }, [enhancedRecipes, filterCategory, filterDifficulty, sortBy, sortOrder]);

  const categories = ['All', ...Array.from(new Set(enhancedRecipes.map(r => r.category)))];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-success';
      case 'Medium': return 'text-warning';
      case 'Hard': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < Math.floor(rating) ? 'fill-warning text-warning' : 'text-muted-foreground'}`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Analytics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Recipes</p>
                <p className="text-2xl font-bold">{analytics.totalRecipes}</p>
              </div>
              <ChefHat className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Cost</p>
                <p className="text-2xl font-bold">${analytics.averageCost.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
                <p className="text-2xl font-bold">{analytics.averageRating.toFixed(1)}</p>
              </div>
              <Star className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Profit Margin</p>
                <p className="text-2xl font-bold">{analytics.profitMargin.toFixed(1)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map(diff => (
                    <SelectItem key={diff} value={diff}>{diff}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="cost">Cost</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="popularity">Popularity</SelectItem>
                  <SelectItem value="profit">Profit</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                Grid
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                List
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Recipe Grid/List */}
      <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
        {filteredAndSortedRecipes.map((recipe) => (
          <Card key={recipe.id} className="hover:shadow-lg transition-all cursor-pointer group">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {recipe.name}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary">{recipe.category}</Badge>
                    <Badge variant="outline" className={getDifficultyColor(recipe.difficulty)}>
                      {recipe.difficulty}
                    </Badge>
                    {recipe.tags?.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {getRatingStars(recipe.rating || 0)}
                  <span className="text-sm text-muted-foreground ml-1">
                    ({recipe.reviews})
                  </span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{recipe.servings} servings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{recipe.prepTime + recipe.cookTime}min</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-success" />
                    <span>${recipe.cost}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-accent" />
                    <span>{recipe.profitMargin?.toFixed(1)}%</span>
                  </div>
                </div>

                {/* Popularity & Nutrition Bars */}
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Popularity</span>
                      <span>{recipe.popularity?.toFixed(0)}%</span>
                    </div>
                    <Progress value={recipe.popularity} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Nutrition Score</span>
                      <span>{recipe.nutritionScore?.toFixed(0)}%</span>
                    </div>
                    <Progress value={recipe.nutritionScore} className="h-2" />
                  </div>
                </div>

                {/* Allergens */}
                <div className="flex flex-wrap gap-1">
                  {recipe.allergens.map(allergen => (
                    <Badge key={allergen} variant="destructive" className="text-xs">
                      {allergen}
                    </Badge>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Heart className="h-3 w-3 mr-1" />
                    Favorite
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Zap className="h-3 w-3 mr-1" />
                    Scale
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Top Performers Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Top Performing Recipes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {analytics.topPerformers.map((recipe, index) => (
              <div key={recipe.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{recipe.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {recipe.popularity?.toFixed(0)}% popularity
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${recipe.cost}</p>
                  <p className="text-sm text-success">
                    {recipe.profitMargin?.toFixed(1)}% margin
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}