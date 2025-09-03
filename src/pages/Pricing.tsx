import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Check, 
  Crown, 
  Zap, 
  Users, 
  FileText, 
  Video, 
  Calendar,
  Bot,
  Sparkles,
  ArrowRight,
  Star
} from 'lucide-react';

interface PricingTier {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  popular?: boolean;
  features: string[];
  limits: {
    ai_requests: number | string;
    calendar_events: number | string;
    document_uploads: number | string;
    video_call_minutes: number | string;
    forms_created: number | string;
    team_members: number | string;
  };
  cta: string;
  icon: React.ElementType;
}

const pricingTiers: PricingTier[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'month',
    description: 'Perfect for trying out our platform',
    features: [
      'Basic restaurant management',
      'Limited AI assistance',
      'Basic document upload',
      'Standard support'
    ],
    limits: {
      ai_requests: '10',
      calendar_events: '25',
      document_uploads: '10',
      video_call_minutes: '60',
      forms_created: '3',
      team_members: '2'
    },
    cta: 'Current Plan',
    icon: FileText
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 89,
    period: 'month',
    description: 'Unlimited power for growing restaurants',
    popular: true,
    features: [
      'Everything in Free',
      'Unlimited AI assistance & generations',
      'Unlimited document uploads & storage',
      'Unlimited video calling',
      'Priority support',
      'Advanced analytics & reporting',
      'API access',
      'Custom integrations'
    ],
    limits: {
      ai_requests: 'Unlimited',
      calendar_events: 'Unlimited',
      document_uploads: 'Unlimited',
      video_call_minutes: 'Unlimited',
      forms_created: 'Unlimited',
      team_members: 'Unlimited'
    },
    cta: 'Upgrade to Pro',
    icon: Zap
  },
  {
    id: 'business',
    name: 'Business',
    price: 249,
    period: 'month',
    description: 'Enterprise-grade solution for restaurant chains',
    features: [
      'Everything in Pro',
      'Unlimited everything',
      'Multi-location management',
      'Advanced automation workflows',
      'Custom integrations & dedicated API',
      'Dedicated account manager',
      'White-label & branding options',
      'Advanced reporting & analytics',
      '99.9% SLA guarantees',
      'Custom training & onboarding',
      'Priority feature development'
    ],
    limits: {
      ai_requests: 'Unlimited',
      calendar_events: 'Unlimited',
      document_uploads: 'Unlimited',
      video_call_minutes: 'Unlimited',
      forms_created: 'Unlimited',
      team_members: 'Unlimited'
    },
    cta: 'Upgrade to Business',
    icon: Crown
  }
];

const Pricing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { subscriptionTier, isLoading } = useSubscription();
  const [processingTier, setProcessingTier] = useState<string | null>(null);

  const handleUpgrade = async (tier: PricingTier) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (tier.id === 'free') {
      navigate('/settings?tab=subscription');
      return;
    }

    setProcessingTier(tier.id);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { tier: tier.id }
      });

      if (error) throw error;

      if (data?.url) {
        // Open Stripe checkout in new tab
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast.error('Failed to start checkout process');
    } finally {
      setProcessingTier(null);
    }
  };

  const getCurrentTierBadge = (tierId: string) => {
    if (subscriptionTier === tierId) {
      return <Badge variant="default" className="ml-2">Current Plan</Badge>;
    }
    return null;
  };

  const getButtonText = (tier: PricingTier) => {
    if (subscriptionTier === tier.id) return 'Current Plan';
    if (tier.id === 'free') return 'Downgrade to Free';
    return tier.cta;
  };

  const getButtonVariant = (tier: PricingTier) => {
    if (subscriptionTier === tier.id) return 'outline';
    if (tier.popular) return 'default';
    return 'outline';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            <Sparkles className="w-4 h-4 mr-2" />
            Pricing Plans
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Choose Your Plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start free and scale as you grow. All plans include our core restaurant management features.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {pricingTiers.map((tier) => {
            const Icon = tier.icon;
            const isCurrentTier = subscriptionTier === tier.id;
            const isProcessing = processingTier === tier.id;
            
            return (
              <Card 
                key={tier.id} 
                className={`relative transition-all duration-300 hover:shadow-lg ${
                  tier.popular 
                    ? 'border-primary shadow-primary/10 ring-1 ring-primary/20 scale-105' 
                    : 'hover:border-primary/50'
                } ${isCurrentTier ? 'bg-primary/5 border-primary' : ''}`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">
                      <Star className="w-4 h-4 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-2">
                  <div className="mb-4">
                    <Icon className={`w-12 h-12 mx-auto ${
                      tier.id === 'business' ? 'text-amber-500' : 
                      tier.id === 'pro' ? 'text-primary' : 
                      'text-muted-foreground'
                    }`} />
                  </div>
                  <CardTitle className="flex items-center justify-center text-2xl">
                    {tier.name}
                    {getCurrentTierBadge(tier.id)}
                  </CardTitle>
                  <div className="mt-4">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold">${tier.price}</span>
                      <span className="text-muted-foreground ml-2">/{tier.period}</span>
                    </div>
                    <p className="text-muted-foreground mt-2">{tier.description}</p>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Features */}
                  <div>
                    <h4 className="font-semibold mb-3">Features included:</h4>
                    <ul className="space-y-2">
                      {tier.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Usage Limits */}
                  <div>
                    <h4 className="font-semibold mb-3">Usage limits:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="flex items-center">
                          <Bot className="w-4 h-4 mr-2" />
                          AI Requests
                        </span>
                        <span className="font-medium">{tier.limits.ai_requests}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          Calendar Events
                        </span>
                        <span className="font-medium">{tier.limits.calendar_events}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="flex items-center">
                          <FileText className="w-4 h-4 mr-2" />
                          Document Uploads
                        </span>
                        <span className="font-medium">{tier.limits.document_uploads}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="flex items-center">
                          <Video className="w-4 h-4 mr-2" />
                          Video Minutes
                        </span>
                        <span className="font-medium">{tier.limits.video_call_minutes}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          Team Members
                        </span>
                        <span className="font-medium">{tier.limits.team_members}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleUpgrade(tier)}
                    disabled={isLoading || isProcessing || isCurrentTier}
                    variant={getButtonVariant(tier)}
                    className="w-full"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        {getButtonText(tier)}
                        {!isCurrentTier && tier.id !== 'free' && (
                          <ArrowRight className="w-4 h-4 ml-2" />
                        )}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            All plans include a 7-day free trial. No credit card required for Free plan.
          </p>
          <p className="text-sm text-muted-foreground">
            Need help choosing? <Button variant="link" className="p-0 h-auto">Contact our sales team</Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;