import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, FormInput, Sparkles } from 'lucide-react';
import { AIFormCreator } from '@/components/ai/AIFormCreator';
import { AIAppAssistant } from '@/components/ai/AIAppAssistant';
import { useUserOrganization } from '@/hooks/useUserOrganization';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function AIAssistant() {
  const [selectedTab, setSelectedTab] = useState('app-assistant');
  const { organization, loading: orgLoading, error: orgError } = useUserOrganization();

  if (orgLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (orgError || !organization) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertDescription>
            {orgError || "No organization found. Please ensure you have completed your profile setup."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Bot className="h-8 w-8 text-primary" />
            AI Assistant
          </h1>
          <p className="text-muted-foreground">
            Let AI help you create forms and enhance your restaurant management app
          </p>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="app-assistant" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            App Assistant
          </TabsTrigger>
          <TabsTrigger value="form-creator" className="flex items-center gap-2">
            <FormInput className="h-4 w-4" />
            Form Creator
          </TabsTrigger>
        </TabsList>

        <TabsContent value="app-assistant" className="mt-0">
          <AIAppAssistant />
        </TabsContent>

        <TabsContent value="form-creator" className="mt-0">
          <AIFormCreator 
            organizationId={organization.id}
            onFormCreated={() => {
              // Could add a callback here to refresh forms if needed
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}