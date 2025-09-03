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
  const isUnlimited = subscriptionTier === 'pro' || subscriptionTier === 'business';

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
              {isUnlimited ? <Crown className="h-5 w-5 text-primary" /> : <TrendingUp className="h-5 w-5" />}
              Current Plan
            </CardTitle>
            <Badge variant={isUnlimited ? "default" : "secondary"} className={isUnlimited ? "bg-primary" : ""}>
              {subscriptionTier.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            {isUnlimited 
              ? "You have unlimited access to all features with no restrictions." 
              : "You're on the free plan with limited feature usage."}
          </p>
          {!isUnlimited && (
            <div className="space-y-2">
              <Button onClick={handleUpgrade} className="w-full">
                <Crown className="h-4 w-4 mr-2" />
                Upgrade to Pro - $89/month
              </Button>
              <Button onClick={handleUpgrade} variant="outline" className="w-full">
                <Crown className="h-4 w-4 mr-2" />
                Upgrade to Business - $249/month
              </Button>
            </div>
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
                    {isUnlimited 
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

      {/* Unlimited Benefits */}
      {!isUnlimited && (
        <div className="grid gap-4 md:grid-cols-2">
          {/* Pro Plan */}
          <Card className="border-primary/20 bg-gradient-to-br from-card via-card to-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Pro Plan Benefits
              </CardTitle>
              <p className="text-2xl font-bold">$89/month</p>
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
                  <span>Unlimited team members</span>
                </div>
              </div>
              <Button onClick={handleUpgrade} className="w-full mt-4">
                <Sparkles className="h-4 w-4 mr-2" />
                Upgrade to Pro
              </Button>
            </CardContent>
          </Card>

          {/* Business Plan */}
          <Card className="border-amber-500/20 bg-gradient-to-br from-card via-card to-amber-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-amber-500" />
                Business Plan Benefits
              </CardTitle>
              <p className="text-2xl font-bold">$249/month</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-2">
                <div className="flex items-center gap-2 text-sm">
                  <Crown className="h-4 w-4 text-amber-500" />
                  <span>Everything in Pro + Enterprise features</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-amber-500" />
                  <span>Multi-location management</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-amber-500" />
                  <span>Dedicated account manager</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-amber-500" />
                  <span>White-label options</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-amber-500" />
                  <span>SLA guarantees & priority support</span>
                </div>
              </div>
              <Button onClick={handleUpgrade} variant="outline" className="w-full mt-4 border-amber-500 text-amber-600 hover:bg-amber-500 hover:text-white">
                <Crown className="h-4 w-4 mr-2" />
                Upgrade to Business
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};