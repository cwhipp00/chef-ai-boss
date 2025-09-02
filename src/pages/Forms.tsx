import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClipboardList, ShoppingCart, ChefHat, Wine, Store } from 'lucide-react';
import { PrepLists } from '@/components/recipes/PrepLists';
import ChecklistsContent from './Checklists';
import OrdersContent from './Orders';
import { InventoryDashboard } from '@/components/inventory';
import { StoreListDashboard } from '@/components/store/StoreListDashboard';

export default function Forms() {
  const [selectedTab, setSelectedTab] = useState('prep-lists');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Restaurant Forms</h1>
          <p className="text-muted-foreground">Manage checklists, orders, and prep lists in one place</p>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="prep-lists" className="flex items-center gap-2">
            <ChefHat className="h-4 w-4" />
            Prep Lists
          </TabsTrigger>
          <TabsTrigger value="checklists" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            Checklists
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Orders
          </TabsTrigger>
          <TabsTrigger value="store-lists" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            Store Lists
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex items-center gap-2">
            <Wine className="h-4 w-4" />
            Bar Inventory
          </TabsTrigger>
        </TabsList>

        <TabsContent value="prep-lists" className="space-y-6">
          <PrepLists />
        </TabsContent>

        <TabsContent value="checklists" className="mt-0">
          <ChecklistsContent />
        </TabsContent>

        <TabsContent value="orders" className="mt-0">
          <OrdersContent />
        </TabsContent>

        <TabsContent value="store-lists" className="mt-0">
          <StoreListDashboard />
        </TabsContent>

        <TabsContent value="inventory" className="mt-0">
          <InventoryDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}