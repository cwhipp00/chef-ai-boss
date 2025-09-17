import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, Wine, Coffee, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface DrinkRecommendation {
  name: string;
  type: string;
  description: string;
  ingredients: string[];
  pairingReason: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export default function AIDrinkPairingRecommendations() {
  const [foodItem, setFoodItem] = useState('');
  const [customerPreferences, setCustomerPreferences] = useState('');
  const [occasion, setOccasion] = useState('');
  const [recommendations, setRecommendations] = useState<DrinkRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateRecommendations = async () => {
    if (!foodItem.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a food item to get drink recommendations.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-drink-pairing', {
        body: {
          foodItem: foodItem.trim(),
          customerPreferences: customerPreferences.trim(),
          occasion: occasion.trim()
        }
      });

      if (error) throw error;

      setRecommendations(data.recommendations || []);
      toast({
        title: "Recommendations Generated",
        description: `Found ${data.recommendations?.length || 0} drink pairing suggestions.`,
      });
    } catch (error) {
      console.error('Error generating drink recommendations:', error);
      toast({
        title: "Error",
        description: "Failed to generate drink recommendations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    if (type.toLowerCase().includes('wine')) return <Wine className="w-4 h-4" />;
    if (type.toLowerCase().includes('coffee') || type.toLowerCase().includes('tea')) return <Coffee className="w-4 h-4" />;
    return <Sparkles className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wine className="w-5 h-5 text-primary" />
            AI Drink Pairing Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground">Food Item *</label>
              <Input
                placeholder="e.g., Grilled Salmon, Chocolate Cake..."
                value={foodItem}
                onChange={(e) => setFoodItem(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Customer Preferences</label>
              <Input
                placeholder="e.g., prefers wine, no alcohol..."
                value={customerPreferences}
                onChange={(e) => setCustomerPreferences(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Occasion</label>
              <Input
                placeholder="e.g., date night, business dinner..."
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <Button 
            onClick={generateRecommendations} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Recommendations...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Get Drink Recommendations
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {recommendations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map((drink, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {getTypeIcon(drink.type)}
                    {drink.name}
                  </CardTitle>
                  <Badge className={`${getDifficultyColor(drink.difficulty)} text-white`}>
                    {drink.difficulty}
                  </Badge>
                </div>
                <Badge variant="outline" className="w-fit">
                  {drink.type}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {drink.description}
                </p>
                
                <div>
                  <h4 className="font-medium text-sm mb-2">Ingredients:</h4>
                  <div className="flex flex-wrap gap-1">
                    {drink.ingredients.map((ingredient, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {ingredient}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-1">Why this pairs well:</h4>
                  <p className="text-xs text-muted-foreground italic">
                    {drink.pairingReason}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}