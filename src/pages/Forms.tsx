import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClipboardList, ShoppingCart, ChefHat, Wine, Store, Settings, Brain, Camera } from 'lucide-react';
import { PrepLists } from '@/components/recipes/PrepLists';
import ChecklistsContent from './Checklists';
import OrdersContent from './Orders';
import { InventoryDashboard } from '@/components/inventory';
import { StoreListDashboard } from '@/components/store/StoreListDashboard';
import { DynamicFormGenerator } from '@/components/forms/DynamicFormGenerator';
import { AIFormCreator } from '@/components/forms/AIFormCreator';
import PhotoBasedInventoryManager from '@/components/inventory/PhotoBasedInventoryManager';
import { useUserOrganization } from '@/hooks/useUserOrganization';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Forms() {
  const [selectedTab, setSelectedTab] = useState('prep-lists');
  const { organization, loading: orgLoading, error: orgError } = useUserOrganization();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Restaurant Forms</h1>
          <p className="text-muted-foreground">Manage checklists, orders, and prep lists in one place</p>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
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
          <TabsTrigger value="ai-form-creator" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Form Creator
          </TabsTrigger>
          <TabsTrigger value="dynamic-forms" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Dynamic Forms
          </TabsTrigger>
        </TabsList>

        <TabsContent value="prep-lists" className="space-y-6">
          <PrepLists />
        </TabsContent>

        <TabsContent value="checklists" className="mt-0">
          <ChecklistsContent />
        </TabsContent>

        <TabsContent value="orders" className="mt-0">
          <div className="space-y-6">
            <OrdersContent />
            
            {/* Photo-Based Inventory Management Section */}
            <div className="border-t pt-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Camera className="h-5 w-5 text-primary" />
                  Photo-Based Inventory Management
                </h3>
                <p className="text-sm text-muted-foreground">
                  Upload photos of your inventory and let AI automatically identify and catalog items.
                </p>
              </div>
              <PhotoBasedInventoryManager />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="store-lists" className="mt-0">
          <StoreListDashboard />
        </TabsContent>

        <TabsContent value="inventory" className="mt-0">
          <InventoryDashboard />
        </TabsContent>

        <TabsContent value="ai-form-creator" className="mt-0">
          {orgLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : orgError ? (
            <Alert variant="destructive">
              <AlertDescription>
                Error loading organization: {orgError}
              </AlertDescription>
            </Alert>
          ) : organization ? (
            <AIFormCreator organizationId={organization.id} />
          ) : (
            <Alert>
              <AlertDescription>
                No organization found. Please ensure you have completed your profile setup.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="dynamic-forms" className="mt-0">
          {orgLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : orgError ? (
            <Alert variant="destructive">
              <AlertDescription>
                Error loading organization: {orgError}
              </AlertDescription>
            </Alert>
          ) : organization ? (
            <DynamicFormGenerator organizationId={organization.id} />
          ) : (
            <Alert>
              <AlertDescription>
                No organization found. Please ensure you have completed your profile setup.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}