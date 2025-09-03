import { useState } from 'react';
import { Plus, Search, Filter, Scale, Clock, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AIRecipeScaler } from '@/components/dashboard/AIRecipeScaler';
import { RecipeDetailModal } from '@/components/recipes/RecipeDetailModal';
import { FileRecipeUpload } from '@/components/recipes/FileRecipeUpload';
import { AIRecipeGenerator } from '@/components/recipes/AIRecipeGenerator';
import { ImageRecipeCreator } from '@/components/recipes/ImageRecipeCreator';
import { AddRecipeModal } from '@/components/recipes/AddRecipeModal';
import { InventoryRecipeBuilder } from '@/components/recipes/InventoryRecipeBuilder';

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
  const [extractedRecipes, setExtractedRecipes] = useState<any[]>([]);

  const handleRecipesExtracted = (newRecipes: any[]) => {
    setExtractedRecipes(prev => [...prev, ...newRecipes]);
    // Here you could also save to your backend/database
  };

  const handleRecipeGenerated = (recipe: any) => {
    setExtractedRecipes(prev => [...prev, recipe]);
    // Here you could also save to your backend/database
  };

  const handleImageRecipeCreated = (recipe: any) => {
    setExtractedRecipes(prev => [...prev, recipe]);
    // Here you could also save to your backend/database
  };

  const filteredRecipes = recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === 'All' || recipe.category === selectedCategory)
  );

  return (
    <div className="p-4 sm:p-6 space-y-6 ml-0 sm:ml-4 lg:ml-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="min-w-0 flex-1 pl-4 sm:pl-0">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Recipe Management</h1>
          <p className="text-muted-foreground">Manage and scale your restaurant recipes</p>
        </div>
        <div className="flex-shrink-0 pr-4 sm:pr-0">
          <AddRecipeModal onRecipeCreated={handleRecipeGenerated} />
        </div>
      </div>

      <Tabs defaultValue="recipes" className="space-y-6">
        <div className="overflow-x-auto pl-4 sm:pl-0">
          <TabsList className="inline-flex w-max min-w-full bg-muted/30 h-12 p-1 gap-1">
            <TabsTrigger value="recipes" className="flex-shrink-0 text-xs px-2 sm:px-3 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground hover-scale">
              <Users className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">All Recipes</span>
              <span className="sm:hidden">Recipes</span>
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex-shrink-0 text-xs px-2 sm:px-3 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground hover-scale">
              <Users className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">From Inventory</span>
              <span className="sm:hidden">Inventory</span>
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex-shrink-0 text-xs px-2 sm:px-3 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground hover-scale">
              <Plus className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">Upload Files</span>
              <span className="sm:hidden">Upload</span>
            </TabsTrigger>
            <TabsTrigger value="ai-generator" className="flex-shrink-0 text-xs px-2 sm:px-3 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground hover-scale">
              <Zap className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">AI Generator</span>
              <span className="sm:hidden">AI Gen</span>
            </TabsTrigger>
            <TabsTrigger value="image-creator" className="flex-shrink-0 text-xs px-2 sm:px-3 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground hover-scale">
              <Scale className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">From Image</span>
              <span className="sm:hidden">Image</span>
            </TabsTrigger>
            <TabsTrigger value="scaler" className="flex-shrink-0 text-xs px-2 sm:px-3 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground hover-scale">
              <Scale className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">Recipe Scaler</span>
              <span className="sm:hidden">Scaler</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex-shrink-0 text-xs px-2 sm:px-3 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground hover-scale">
              <Users className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">Analytics</span>
              <span className="sm:hidden">Stats</span>
            </TabsTrigger>
          </TabsList>
        </div>

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

        <TabsContent value="inventory">
          <InventoryRecipeBuilder onRecipeGenerated={handleRecipeGenerated} />
        </TabsContent>

        <TabsContent value="upload">
          <FileRecipeUpload onRecipesExtracted={handleRecipesExtracted} />
        </TabsContent>

        <TabsContent value="ai-generator">
          <AIRecipeGenerator onRecipeGenerated={handleRecipeGenerated} />
        </TabsContent>

        <TabsContent value="image-creator">
          <ImageRecipeCreator onRecipeCreated={handleImageRecipeCreated} />
        </TabsContent>

        <TabsContent value="scaler">
          <AIRecipeScaler />
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