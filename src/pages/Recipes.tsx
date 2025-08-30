import { useState } from 'react';
import { Plus, Search, Filter, Scale, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AIRecipeScaler } from '@/components/dashboard/AIRecipeScaler';
import { RecipeDetailModal } from '@/components/recipes/RecipeDetailModal';
import { PrepLists } from '@/components/recipes/PrepLists';

const recipes = [
  {
    id: 1,
    name: "Signature Pasta Carbonara",
    category: "Pasta",
    servings: 4,
    prepTime: 15,
    cookTime: 20,
    difficulty: "Medium",
    ingredients: [
      "400g spaghetti",
      "200g pancetta",
      "4 large eggs",
      "100g Parmesan cheese",
      "Black pepper",
      "Salt"
    ],
    instructions: [
      "Boil water and cook spaghetti al dente",
      "Crisp pancetta in a large pan",
      "Whisk eggs with grated Parmesan",
      "Combine hot pasta with pancetta",
      "Add egg mixture off heat, tossing quickly"
    ],
    cost: 12.50,
    allergens: ["Gluten", "Eggs", "Dairy"]
  },
  {
    id: 2,
    name: "Grilled Salmon Teriyaki",
    category: "Seafood",
    servings: 2,
    prepTime: 10,
    cookTime: 12,
    difficulty: "Easy",
    ingredients: [
      "2 salmon fillets",
      "3 tbsp soy sauce",
      "2 tbsp mirin",
      "1 tbsp honey",
      "1 tsp ginger",
      "Sesame seeds"
    ],
    instructions: [
      "Mix teriyaki glaze ingredients",
      "Marinate salmon for 30 minutes",
      "Grill salmon 6 minutes per side",
      "Brush with glaze while cooking",
      "Garnish with sesame seeds"
    ],
    cost: 18.75,
    allergens: ["Fish", "Soy"]
  }
];

export default function Recipes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredRecipes = recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === 'All' || recipe.category === selectedCategory)
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Recipe Management</h1>
          <p className="text-muted-foreground">Manage and scale your restaurant recipes</p>
        </div>
        <Button size="lg" className="bg-gradient-primary">
          <Plus className="h-4 w-4 mr-2" />
          Add Recipe
        </Button>
      </div>

      <Tabs defaultValue="recipes" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="recipes">All Recipes</TabsTrigger>
          <TabsTrigger value="scaler">Recipe Scaler</TabsTrigger>
          <TabsTrigger value="prep">Prep Lists</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="recipes" className="space-y-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search recipes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <RecipeDetailModal key={recipe.id} recipe={recipe}>
                <Card className="hover:shadow-medium transition-all cursor-pointer hover:scale-105">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{recipe.name}</CardTitle>
                      <Badge variant="secondary">{recipe.category}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {recipe.servings}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {recipe.prepTime + recipe.cookTime}min
                      </div>
                      <div className="flex items-center gap-1">
                        <Scale className="h-3 w-3" />
                        ${recipe.cost}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium mb-2">Ingredients:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {recipe.ingredients.slice(0, 3).map((ingredient, index) => (
                            <li key={index}>• {ingredient}</li>
                          ))}
                          {recipe.ingredients.length > 3 && (
                            <li className="text-primary">+ {recipe.ingredients.length - 3} more</li>
                          )}
                        </ul>
                      </div>
                      <div className="flex gap-1 flex-wrap">
                        {recipe.allergens.map((allergen) => (
                          <Badge key={allergen} variant="outline" className="text-xs">
                            {allergen}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </RecipeDetailModal>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="scaler">
          <AIRecipeScaler />
        </TabsContent>

        <TabsContent value="prep">
          <PrepLists />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Most Popular</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Pasta Carbonara</span>
                    <span className="text-sm font-medium">89%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Grilled Salmon</span>
                    <span className="text-sm font-medium">76%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Cost Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Avg Cost per Dish</span>
                    <span className="text-sm font-medium">$15.63</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Profit Margin</span>
                    <span className="text-sm font-medium">68%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Recipe Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Total Recipes</span>
                    <span className="text-sm font-medium">127</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Active Recipes</span>
                    <span className="text-sm font-medium">89</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}