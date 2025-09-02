import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Crown, TrendingUp, Calendar, Upload, Video, FileText, Users, Sparkles } from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';

const featureIcons = {
  ai_requests: Sparkles,
  calendar_events: Calendar,
  document_uploads: Upload,
  video_call_minutes: Video,
  forms_created: FileText,
  team_members: Users,
};

const featureNames = {
  ai_requests: 'AI Requests',
  calendar_events: 'Calendar Events', 
  document_uploads: 'Document Uploads',
  video_call_minutes: 'Video Minutes',
  forms_created: 'Dynamic Forms',
  team_members: 'Team Members',
};

export const UsageDashboard = () => {
  const { isPremium, subscriptionTier, currentUsage, usageLimits, refreshSubscription } = useSubscription();

  const handleUpgrade = () => {
    // TODO: Integrate with Stripe checkout
    console.log('Upgrade to Premium');
  };

  return (
    <div className="space-y-6">
      {/* Subscription Status */}
      <Card className={isPremium ? "border-primary bg-gradient-to-r from-primary/5 to-primary/10" : ""}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {isPremium ? <Crown className="h-5 w-5 text-primary" /> : <TrendingUp className="h-5 w-5" />}
              Current Plan
            </CardTitle>
            <Badge variant={isPremium ? "default" : "secondary"} className={isPremium ? "bg-primary" : ""}>
              {subscriptionTier.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            {isPremium 
              ? "You have unlimited access to all premium features." 
              : "You're on the free plan with limited feature usage."}
          </p>
          {!isPremium && (
            <Button onClick={handleUpgrade} className="w-full">
              <Crown className="h-4 w-4 mr-2" />
              Upgrade to Premium
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Usage Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {(Object.keys(currentUsage) as Array<keyof typeof currentUsage>).map((feature) => {
          const usage = currentUsage[feature];
          const limit = usageLimits[feature];
          const percentage = limit === Infinity ? 0 : Math.min((usage / limit) * 100, 100);
          const Icon = featureIcons[feature];
          const isNearLimit = percentage > 80;
          const isAtLimit = percentage >= 100;

          return (
            <Card key={feature} className={isAtLimit ? "border-destructive/50" : ""}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {featureNames[feature]}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{usage}</span>
                    <Badge 
                      variant={isAtLimit ? "destructive" : isNearLimit ? "secondary" : "outline"}
                    >
                      {limit === Infinity ? '∞' : `/ ${limit}`}
                    </Badge>
                  </div>
                  {limit !== Infinity && (
                    <Progress 
                      value={percentage} 
                      className={`h-2 ${isAtLimit ? "bg-destructive/20" : ""}`}
                    />
                  )}
                  <p className="text-xs text-muted-foreground">
                    {isPremium 
                      ? "Unlimited usage" 
                      : limit === Infinity 
                        ? "Unlimited" 
                        : isAtLimit 
                          ? "Limit reached" 
                          : `${limit - usage} remaining`}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Premium Benefits */}
      {!isPremium && (
        <Card className="border-primary/20 bg-gradient-to-br from-card via-card to-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-primary" />
              Unlock Premium Benefits
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 text-sm">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>Unlimited AI requests and generations</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-primary" />
                <span>Unlimited calendar events and scheduling</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Video className="h-4 w-4 text-primary" />
                <span>Unlimited video call duration</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Upload className="h-4 w-4 text-primary" />
                <span>Unlimited document uploads and storage</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-primary" />
                <span>Unlimited team members and collaboration</span>
              </div>
            </div>
            <Button onClick={handleUpgrade} className="w-full mt-4">
              <Crown className="h-4 w-4 mr-2" />
              Upgrade to Premium - $29/month
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};