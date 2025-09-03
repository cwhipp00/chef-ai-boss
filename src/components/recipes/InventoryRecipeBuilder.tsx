import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Package, 
  Sparkles, 
  ChefHat, 
  Clock, 
  Users, 
  Wand2,
  Loader2,
  RefreshCw,
  Search,
  Plus,
  Minus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  expiresIn?: number; // days until expiration
}

interface GeneratedRecipe {
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  servings: number;
  prepTime: number;
  cookTime: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  usedIngredients: string[];
  missingIngredients: string[];
  costEstimate: number;
}

// Mock inventory data - in real app this would come from your inventory system
const mockInventory: InventoryItem[] = [
  { id: '1', name: 'Chicken Breast', category: 'Protein', quantity: 2, unit: 'lbs', expiresIn: 3 },
  { id: '2', name: 'Broccoli', category: 'Vegetables', quantity: 1, unit: 'head', expiresIn: 5 },
  { id: '3', name: 'Rice', category: 'Grains', quantity: 5, unit: 'cups', expiresIn: 30 },
  { id: '4', name: 'Onions', category: 'Vegetables', quantity: 3, unit: 'pieces', expiresIn: 7 },
  { id: '5', name: 'Garlic', category: 'Aromatics', quantity: 1, unit: 'bulb', expiresIn: 14 },
  { id: '6', name: 'Olive Oil', category: 'Oils', quantity: 1, unit: 'bottle', expiresIn: 90 },
  { id: '7', name: 'Eggs', category: 'Protein', quantity: 12, unit: 'pieces', expiresIn: 10 },
  { id: '8', name: 'Pasta', category: 'Grains', quantity: 2, unit: 'boxes', expiresIn: 60 },
  { id: '9', name: 'Tomatoes', category: 'Vegetables', quantity: 4, unit: 'pieces', expiresIn: 4 },
  { id: '10', name: 'Mushrooms', category: 'Vegetables', quantity: 1, unit: 'package', expiresIn: 6 },
  { id: '11', name: 'Bell Peppers', category: 'Vegetables', quantity: 2, unit: 'pieces', expiresIn: 8 },
  { id: '12', name: 'Cheese', category: 'Dairy', quantity: 1, unit: 'block', expiresIn: 14 }
];

const categories = ['All', 'Protein', 'Vegetables', 'Grains', 'Dairy', 'Oils', 'Aromatics'];

export function InventoryRecipeBuilder({ onRecipeGenerated }: { onRecipeGenerated: (recipe: GeneratedRecipe) => void }) {
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState<GeneratedRecipe | null>(null);
  const { toast } = useToast();

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === 'All' || item.category === selectedCategory)
  );

  const expiringItems = inventory.filter(item => (item.expiresIn ?? 0) <= 7);

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const selectExpiringItems = () => {
    const expiringIds = expiringItems.map(item => item.id);
    setSelectedItems(prev => [...new Set([...prev, ...expiringIds])]);
  };

  const clearSelection = () => {
    setSelectedItems([]);
  };

  const generateRecipe = async () => {
    if (selectedItems.length === 0) {
      toast({
        title: "No Ingredients Selected",
        description: "Please select ingredients from your inventory",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const selectedIngredients = inventory
        .filter(item => selectedItems.includes(item.id))
        .map(item => `${item.quantity} ${item.unit} ${item.name}`);

      // Call AI recipe generator with inventory items
      const response = await fetch('https://lfpnnlkjqpphstpcmcsi.supabase.co/functions/v1/ai-recipe-generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ingredients: selectedIngredients.join(', '),
          servings: 4,
          cookingTime: 30,
          difficulty: 'Medium',
          mealType: 'Dinner',
          cuisineType: '',
          dietaryRestrictions: [],
          equipment: '',
          occasion: 'Everyday',
          useOnlyAvailableIngredients: true
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate recipe');
      }

      const { recipe } = await response.json();
      
      // Process the response to match our interface
      const generatedRecipe: GeneratedRecipe = {
        name: recipe.name || `Recipe with ${selectedIngredients[0].split(' ').pop()}`,
        description: recipe.description || `A delicious recipe using ingredients from your inventory`,
        ingredients: recipe.ingredients || selectedIngredients,
        instructions: recipe.instructions || [
          "Prepare all selected ingredients",
          "Cook according to ingredient requirements",
          "Season to taste",
          "Serve hot"
        ],
        servings: recipe.servings || 4,
        prepTime: recipe.prepTime || 15,
        cookTime: recipe.cookTime || 30,
        difficulty: recipe.difficulty as 'Easy' | 'Medium' | 'Hard' || 'Medium',
        category: recipe.category || 'Main Course',
        usedIngredients: selectedIngredients,
        missingIngredients: recipe.additionalIngredients || [],
        costEstimate: calculateCostEstimate(selectedItems)
      };

      setGeneratedRecipe(generatedRecipe);
      onRecipeGenerated(generatedRecipe);

      toast({
        title: "Recipe Generated!",
        description: `Created "${generatedRecipe.name}" using ${selectedItems.length} ingredients from your inventory`,
      });

    } catch (error) {
      console.error('Recipe generation error:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate recipe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const calculateCostEstimate = (itemIds: string[]): number => {
    // Simple cost estimation based on ingredients
    const baseCost = itemIds.length * 2.5; // $2.50 per ingredient on average
    return Math.round(baseCost * 100) / 100;
  };

  const getExpirationColor = (days?: number) => {
    if (!days) return 'text-muted-foreground';
    if (days <= 2) return 'text-red-500';
    if (days <= 7) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Build Recipe from Inventory
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Expiring Items Alert */}
          {expiringItems.length > 0 && (
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>
                  {expiringItems.length} item(s) expiring soon. Use them first!
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={selectExpiringItems}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Select Expiring
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Search and Filters */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="text-xs"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Selection Summary */}
          {selectedItems.length > 0 && (
            <div className="flex items-center gap-4 p-3 bg-primary/5 rounded-lg">
              <div className="flex-1">
                <span className="text-sm font-medium">{selectedItems.length} ingredients selected</span>
              </div>
              <Button variant="outline" size="sm" onClick={clearSelection}>
                <Minus className="h-3 w-3 mr-1" />
                Clear All
              </Button>
            </div>
          )}

          {/* Inventory Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredInventory.map((item) => (
              <div 
                key={item.id}
                className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  selectedItems.includes(item.id) 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => toggleItemSelection(item.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleItemSelection(item.id)}
                    />
                    <span className="font-medium text-sm">{item.name}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {item.category}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>Qty: {item.quantity} {item.unit}</div>
                  {item.expiresIn && (
                    <div className={getExpirationColor(item.expiresIn)}>
                      Expires in {item.expiresIn} days
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Separator />

          {/* Generate Button */}
          <div className="flex gap-3">
            <Button 
              onClick={generateRecipe}
              disabled={isGenerating || selectedItems.length === 0}
              size="lg"
              className="flex-1 bg-gradient-primary"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating Recipe...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Generate Recipe ({selectedItems.length} ingredients)
                </>
              )}
            </Button>
            
            {generatedRecipe && (
              <Button 
                onClick={generateRecipe}
                variant="outline"
                disabled={isGenerating}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Generated Recipe Preview */}
      {generatedRecipe && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChefHat className="h-5 w-5 text-primary" />
              Generated Recipe from Your Inventory
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-xl font-bold">{generatedRecipe.name}</h3>
              <p className="text-muted-foreground">{generatedRecipe.description}</p>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {generatedRecipe.servings} servings
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {generatedRecipe.prepTime + generatedRecipe.cookTime} min total
              </div>
              <div className="flex items-center gap-1">
                <Package className="h-3 w-3" />
                ${generatedRecipe.costEstimate} estimated
              </div>
              <Badge variant="secondary">{generatedRecipe.difficulty}</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2 text-green-600">Used from Inventory:</h4>
                <ul className="text-sm space-y-1">
                  {generatedRecipe.usedIngredients.slice(0, 5).map((ingredient, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-green-500 rounded-full" />
                      {ingredient}
                    </li>
                  ))}
                  {generatedRecipe.usedIngredients.length > 5 && (
                    <li className="text-primary">+ {generatedRecipe.usedIngredients.length - 5} more</li>
                  )}
                </ul>
              </div>

              {generatedRecipe.missingIngredients.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 text-orange-600">Additional Items Needed:</h4>
                  <ul className="text-sm space-y-1">
                    {generatedRecipe.missingIngredients.slice(0, 3).map((ingredient, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-orange-500 rounded-full" />
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div>
              <h4 className="font-semibold mb-2">Instructions Preview:</h4>
              <ol className="text-sm space-y-1">
                {generatedRecipe.instructions.slice(0, 3).map((instruction, index) => (
                  <li key={index}>{index + 1}. {instruction}</li>
                ))}
                {generatedRecipe.instructions.length > 3 && (
                  <li className="text-primary">+ {generatedRecipe.instructions.length - 3} more steps</li>
                )}
              </ol>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}