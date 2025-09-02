import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Crown, Lock, Sparkles, Zap } from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { toast } from 'sonner';

interface PremiumGateProps {
  feature: 'ai_requests' | 'calendar_events' | 'document_uploads' | 'video_call_minutes' | 'forms_created' | 'team_members';
  children?: React.ReactNode;
  customMessage?: string;
  showUsage?: boolean;
}

const featureNames = {
  ai_requests: 'AI Requests',
  calendar_events: 'Calendar Events',
  document_uploads: 'Document Uploads',
  video_call_minutes: 'Video Call Minutes',
  forms_created: 'Dynamic Forms',
  team_members: 'Team Members',
};

export const PremiumGate = ({ feature, children, customMessage, showUsage = true }: PremiumGateProps) => {
  const { isPremium, canUseFeature, currentUsage, usageLimits } = useSubscription();
  
  const usage = currentUsage[feature];
  const limit = usageLimits[feature];
  const canUse = canUseFeature(feature);
  const usagePercentage = limit === Infinity ? 0 : Math.min((usage / limit) * 100, 100);

  const handleUpgrade = () => {
    toast.info('Upgrade to Premium for unlimited access to all features!');
    // TODO: Integrate with Stripe checkout
  };

  if (isPremium || canUse) {
    return (
      <>
        {showUsage && !isPremium && (
          <div className="mb-4 p-3 bg-muted/50 rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{featureNames[feature]} Usage</span>
              <Badge variant={usagePercentage > 80 ? "destructive" : "default"}>
                {usage}/{limit === Infinity ? '∞' : limit}
              </Badge>
            </div>
            {limit !== Infinity && (
              <Progress value={usagePercentage} className="h-2" />
            )}
          </div>
        )}
        {children}
      </>
    );
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-card via-card to-primary/5">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Lock className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="flex items-center justify-center gap-2">
          <Crown className="h-5 w-5 text-primary" />
          Premium Feature
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-center">
        <p className="text-muted-foreground">
          {customMessage || `You've reached the limit for ${featureNames[feature].toLowerCase()}. Upgrade to Premium for unlimited access.`}
        </p>
        
        <div className="bg-muted/50 p-3 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Current Usage</span>
            <Badge variant="destructive">
              {usage}/{limit}
            </Badge>
          </div>
          <Progress value={100} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Zap className="h-4 w-4 text-primary" />
            <span>Unlimited {featureNames[feature].toLowerCase()}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Advanced AI features</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Crown className="h-4 w-4 text-primary" />
            <span>Priority support</span>
          </div>
        </div>

        <Button 
          onClick={handleUpgrade} 
          className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
        >
          <Crown className="h-4 w-4 mr-2" />
          Upgrade to Premium
        </Button>
      </CardContent>
    </Card>
  );
};