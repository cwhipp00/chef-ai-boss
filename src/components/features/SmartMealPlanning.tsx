import React, { useState, useCallback } from 'react';
import { Calendar, ChefHat, ShoppingCart, Users, Clock, Target, Sparkles, Plus, Edit, Trash2, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

interface Recipe {
  id: string;
  name: string;
  servings: number;
  prepTime: number;
  cookTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  cuisine: string;
  dietary: string[];
  ingredients: string[];
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

interface MealPlan {
  id: string;
  name: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  recipe: Recipe;
  plannedServings: number;
  status: 'planned' | 'prepped' | 'completed';
  notes?: string;
}

interface WeeklyPlan {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  targetCalories: number;
  dietaryRestrictions: string[];
  meals: MealPlan[];
}

const sampleRecipes: Recipe[] = [
  {
    id: '1',
    name: 'Grilled Salmon with Quinoa',
    servings: 4,
    prepTime: 15,
    cookTime: 20,
    difficulty: 'medium',
    cuisine: 'Mediterranean',
    dietary: ['gluten-free', 'high-protein'],
    ingredients: ['salmon fillet', 'quinoa', 'asparagus', 'lemon', 'olive oil'],
    nutrition: { calories: 420, protein: 35, carbs: 25, fat: 22 }
  },
  {
    id: '2',
    name: 'Vegetarian Buddha Bowl',
    servings: 2,
    prepTime: 20,
    cookTime: 15,
    difficulty: 'easy',
    cuisine: 'Asian Fusion',
    dietary: ['vegetarian', 'vegan', 'gluten-free'],
    ingredients: ['brown rice', 'chickpeas', 'broccoli', 'carrots', 'tahini'],
    nutrition: { calories: 380, protein: 15, carbs: 45, fat: 18 }
  },
  {
    id: '3',
    name: 'Classic Caesar Salad',
    servings: 6,
    prepTime: 10,
    cookTime: 0,
    difficulty: 'easy',
    cuisine: 'Italian',
    dietary: ['vegetarian'],
    ingredients: ['romaine lettuce', 'parmesan', 'croutons', 'caesar dressing'],
    nutrition: { calories: 220, protein: 8, carbs: 12, fat: 16 }
  }
];

export const SmartMealPlanning = () => {
  const [weeklyPlans, setWeeklyPlans] = useState<WeeklyPlan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<WeeklyPlan | null>(null);
  const [isCreatePlanModalOpen, setIsCreatePlanModalOpen] = useState(false);
  const [isAddMealModalOpen, setIsAddMealModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedMealType, setSelectedMealType] = useState<MealPlan['mealType']>('lunch');
  
  const [newPlanName, setNewPlanName] = useState('');
  const [newPlanStartDate, setNewPlanStartDate] = useState('');
  const [targetCalories, setTargetCalories] = useState(2000);
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  
  const { toast } = useToast();

  const createWeeklyPlan = useCallback(() => {
    if (!newPlanName.trim() || !newPlanStartDate) return;
    
    const startDate = new Date(newPlanStartDate);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    
    const newPlan: WeeklyPlan = {
      id: Date.now().toString(),
      name: newPlanName,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      targetCalories,
      dietaryRestrictions,
      meals: []
    };
    
    setWeeklyPlans(prev => [...prev, newPlan]);
    setCurrentPlan(newPlan);
    setIsCreatePlanModalOpen(false);
    
    // Reset form
    setNewPlanName('');
    setNewPlanStartDate('');
    setTargetCalories(2000);
    setDietaryRestrictions([]);
    
    toast({
      title: "Meal Plan Created",
      description: `"${newPlanName}" has been created successfully`,
    });
  }, [newPlanName, newPlanStartDate, targetCalories, dietaryRestrictions, toast]);

  const addMealToPlan = useCallback((recipeId: string) => {
    if (!currentPlan || !selectedDate) return;
    
    const recipe = sampleRecipes.find(r => r.id === recipeId);
    if (!recipe) return;
    
    const newMeal: MealPlan = {
      id: Date.now().toString(),
      name: `${recipe.name} - ${selectedMealType}`,
      date: selectedDate,
      mealType: selectedMealType,
      recipe,
      plannedServings: recipe.servings,
      status: 'planned'
    };
    
    const updatedPlan = {
      ...currentPlan,
      meals: [...currentPlan.meals, newMeal]
    };
    
    setCurrentPlan(updatedPlan);
    setWeeklyPlans(prev => prev.map(plan => 
      plan.id === currentPlan.id ? updatedPlan : plan
    ));
    
    setIsAddMealModalOpen(false);
    toast({
      title: "Meal Added",
      description: `${recipe.name} added to ${selectedDate}`,
    });
  }, [currentPlan, selectedDate, selectedMealType, toast]);

  const updateMealStatus = useCallback((mealId: string, status: MealPlan['status']) => {
    if (!currentPlan) return;
    
    const updatedPlan = {
      ...currentPlan,
      meals: currentPlan.meals.map(meal => 
        meal.id === mealId ? { ...meal, status } : meal
      )
    };
    
    setCurrentPlan(updatedPlan);
    setWeeklyPlans(prev => prev.map(plan => 
      plan.id === currentPlan.id ? updatedPlan : plan
    ));
    
    toast({
      title: "Meal Status Updated",
      description: `Meal marked as ${status}`,
    });
  }, [currentPlan, toast]);

  const generateShoppingList = useCallback(() => {
    if (!currentPlan) return;
    
    const ingredients = new Map<string, number>();
    
    currentPlan.meals.forEach(meal => {
      if (meal.status !== 'completed') {
        meal.recipe.ingredients.forEach(ingredient => {
          const current = ingredients.get(ingredient) || 0;
          ingredients.set(ingredient, current + meal.plannedServings);
        });
      }
    });
    
    const shoppingList = Array.from(ingredients.entries())
      .map(([ingredient, quantity]) => `${ingredient} (${quantity} servings)`)
      .join('\n');
    
    // In a real app, this would open a new dialog or navigate to shopping list
    toast({
      title: "Shopping List Generated",
      description: `List created with ${ingredients.size} ingredients`,
    });
  }, [currentPlan, toast]);

  const generateAISuggestions = useCallback(() => {
    if (!currentPlan) return;
    
    // Simulate AI suggestions based on dietary restrictions and nutrition goals
    const availableRecipes = sampleRecipes.filter(recipe => {
      return currentPlan.dietaryRestrictions.every(restriction => 
        recipe.dietary.includes(restriction)
      );
    });
    
    toast({
      title: "AI Suggestions Generated",
      description: `Found ${availableRecipes.length} recipes matching your preferences`,
    });
  }, [currentPlan, toast]);

  const getWeekDates = (startDate: string) => {
    const dates = [];
    const start = new Date(startDate);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    
    return dates;
  };

  const getMealsForDate = (date: string) => {
    if (!currentPlan) return [];
    return currentPlan.meals.filter(meal => meal.date === date);
  };

  const getDailyNutrition = (date: string) => {
    const meals = getMealsForDate(date);
    return meals.reduce((total, meal) => ({
      calories: total.calories + (meal.recipe.nutrition.calories * meal.plannedServings / meal.recipe.servings),
      protein: total.protein + (meal.recipe.nutrition.protein * meal.plannedServings / meal.recipe.servings),
      carbs: total.carbs + (meal.recipe.nutrition.carbs * meal.plannedServings / meal.recipe.servings),
      fat: total.fat + (meal.recipe.nutrition.fat * meal.plannedServings / meal.recipe.servings),
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  const getStatusIcon = (status: MealPlan['status']) => {
    switch (status) {
      case 'completed': return <Check className="h-4 w-4 text-success" />;
      case 'prepped': return <Clock className="h-4 w-4 text-warning" />;
      default: return <Calendar className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getDifficultyColor = (difficulty: Recipe['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'bg-success/10 text-success';
      case 'medium': return 'bg-warning/10 text-warning';
      case 'hard': return 'bg-destructive/10 text-destructive';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Smart Meal Planning</h2>
          <p className="text-muted-foreground">AI-powered meal planning with nutrition tracking</p>
        </div>
        <div className="flex gap-2">
          {currentPlan && (
            <>
              <Button variant="outline" onClick={generateShoppingList}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Shopping List
              </Button>
              <Button variant="outline" onClick={generateAISuggestions}>
                <Sparkles className="h-4 w-4 mr-2" />
                AI Suggestions
              </Button>
            </>
          )}
          <Dialog open={isCreatePlanModalOpen} onOpenChange={setIsCreatePlanModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary">
                <Plus className="h-4 w-4 mr-2" />
                New Plan
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Weekly Meal Plan</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="plan-name">Plan Name</Label>
                  <Input
                    id="plan-name"
                    value={newPlanName}
                    onChange={(e) => setNewPlanName(e.target.value)}
                    placeholder="e.g., Week of March 15"
                  />
                </div>
                <div>
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={newPlanStartDate}
                    onChange={(e) => setNewPlanStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="target-calories">Daily Calorie Target</Label>
                  <Input
                    id="target-calories"
                    type="number"
                    value={targetCalories}
                    onChange={(e) => setTargetCalories(Number(e.target.value))}
                    placeholder="2000"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIsCreatePlanModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={createWeeklyPlan} disabled={!newPlanName.trim() || !newPlanStartDate}>
                    Create Plan
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Plan Selector */}
      {weeklyPlans.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Label htmlFor="plan-select">Current Plan:</Label>
              <Select
                value={currentPlan?.id || ''}
                onValueChange={(value) => {
                  const plan = weeklyPlans.find(p => p.id === value);
                  setCurrentPlan(plan || null);
                }}
              >
                <SelectTrigger className="w-[300px]">
                  <SelectValue placeholder="Select a meal plan" />
                </SelectTrigger>
                <SelectContent>
                  {weeklyPlans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {currentPlan ? (
        <>
          {/* Weekly Overview */}
          <div className="grid gap-4 md:grid-cols-7">
            {getWeekDates(currentPlan.startDate).map((date) => {
              const dayMeals = getMealsForDate(date);
              const nutrition = getDailyNutrition(date);
              const calorieProgress = (nutrition.calories / currentPlan.targetCalories) * 100;
              
              return (
                <Card key={date} className="min-h-[200px]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-center">
                      {new Date(date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-2 space-y-2">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span>Calories</span>
                        <span>{Math.round(nutrition.calories)}/{currentPlan.targetCalories}</span>
                      </div>
                      <Progress value={Math.min(calorieProgress, 100)} className="h-1" />
                    </div>
                    
                    <div className="space-y-1">
                      {dayMeals.map((meal) => (
                        <div
                          key={meal.id}
                          className="text-xs p-2 rounded bg-muted/20 border cursor-pointer hover:bg-muted/30 transition-colors"
                          onClick={() => updateMealStatus(meal.id, 
                            meal.status === 'planned' ? 'prepped' : 
                            meal.status === 'prepped' ? 'completed' : 'planned'
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{meal.mealType}</span>
                            {getStatusIcon(meal.status)}
                          </div>
                          <div className="text-muted-foreground">{meal.recipe.name}</div>
                        </div>
                      ))}
                    </div>
                    
                    <Dialog open={isAddMealModalOpen} onOpenChange={setIsAddMealModalOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full h-8"
                          onClick={() => setSelectedDate(date)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Meal</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Meal Type</Label>
                            <Select value={selectedMealType} onValueChange={(value: MealPlan['mealType']) => setSelectedMealType(value)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="breakfast">Breakfast</SelectItem>
                                <SelectItem value="lunch">Lunch</SelectItem>
                                <SelectItem value="dinner">Dinner</SelectItem>
                                <SelectItem value="snack">Snack</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Select Recipe</Label>
                            {sampleRecipes.map((recipe) => (
                              <Card key={recipe.id} className="p-3 cursor-pointer hover:bg-muted/20 transition-colors" onClick={() => addMealToPlan(recipe.id)}>
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h4 className="font-medium">{recipe.name}</h4>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                      <span>{recipe.cuisine}</span>
                                      <Badge className={getDifficultyColor(recipe.difficulty)}>
                                        {recipe.difficulty}
                                      </Badge>
                                      <span>{recipe.nutrition.calories} cal</span>
                                    </div>
                                  </div>
                                  <ChefHat className="h-4 w-4 text-muted-foreground" />
                                </div>
                              </Card>
                            ))}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Nutrition Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Weekly Nutrition Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                {getWeekDates(currentPlan.startDate).slice(0, 4).map((date) => {
                  const nutrition = getDailyNutrition(date);
                  return (
                    <div key={date} className="text-center">
                      <div className="text-sm font-medium mb-2">
                        {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span>Calories:</span>
                          <span>{Math.round(nutrition.calories)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Protein:</span>
                          <span>{Math.round(nutrition.protein)}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Carbs:</span>
                          <span>{Math.round(nutrition.carbs)}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Fat:</span>
                          <span>{Math.round(nutrition.fat)}g</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        /* Empty State */
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Meal Plans Created</h3>
            <p className="text-muted-foreground mb-4">Create your first weekly meal plan to get started</p>
            <Button onClick={() => setIsCreatePlanModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Plan
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};