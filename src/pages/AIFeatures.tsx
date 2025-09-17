import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wine, Camera, Sparkles, Package } from 'lucide-react';
import AIDrinkPairingRecommendations from '@/components/bar/AIDrinkPairingRecommendations';
import PhotoBasedInventoryManager from '@/components/inventory/PhotoBasedInventoryManager';

export default function AIFeatures() {
  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">AI-Powered Features</h1>
        <p className="text-muted-foreground">
          Advanced AI tools to enhance your restaurant operations
        </p>
      </div>

      <Tabs defaultValue="drink-pairing" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="drink-pairing" className="flex items-center gap-2">
            <Wine className="w-4 h-4" />
            Drink Pairing
          </TabsTrigger>
          <TabsTrigger value="photo-inventory" className="flex items-center gap-2">
            <Camera className="w-4 h-4" />
            Photo Inventory
          </TabsTrigger>
        </TabsList>

        <TabsContent value="drink-pairing" className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              AI Bar Drink Pairing Recommendations
            </h2>
            <p className="text-muted-foreground">
              Get intelligent drink pairing suggestions based on food items, customer preferences, and occasions.
            </p>
          </div>
          <AIDrinkPairingRecommendations />
        </TabsContent>

        <TabsContent value="photo-inventory" className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Photo-Based Inventory Management
            </h2>
            <p className="text-muted-foreground">
              Upload photos of your inventory and let AI automatically identify and catalog items.
            </p>
          </div>
          <PhotoBasedInventoryManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}