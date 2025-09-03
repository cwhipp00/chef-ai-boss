import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface UsageLimits {
  ai_requests: number;
  calendar_events: number;
  document_uploads: number;
  video_call_minutes: number;
  forms_created: number;
  team_members: number;
}

interface CurrentUsage {
  ai_requests: number;
  calendar_events: number;
  document_uploads: number;
  video_call_minutes: number;
  forms_created: number;
  team_members: number;
}

interface SubscriptionContextType {
  isLoading: boolean;
  isPremium: boolean;
  subscriptionTier: 'free' | 'pro' | 'business';
  currentUsage: CurrentUsage;
  usageLimits: UsageLimits;
  canUseFeature: (feature: keyof UsageLimits) => boolean;
  incrementUsage: (feature: keyof UsageLimits, amount?: number) => Promise<boolean>;
  refreshSubscription: () => Promise<void>;
}

const FREE_LIMITS: UsageLimits = {
  ai_requests: 10,
  calendar_events: 25,
  document_uploads: 10,
  video_call_minutes: 60,
  forms_created: 3,
  team_members: 2,
};

const PRO_LIMITS: UsageLimits = {
  ai_requests: Infinity,
  calendar_events: Infinity,
  document_uploads: Infinity,
  video_call_minutes: Infinity,
  forms_created: Infinity,
  team_members: Infinity,
};

const BUSINESS_LIMITS: UsageLimits = {
  ai_requests: Infinity,
  calendar_events: Infinity,
  document_uploads: Infinity,
  video_call_minutes: Infinity,
  forms_created: Infinity,
  team_members: Infinity,
};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionTier, setSubscriptionTier] = useState<'free' | 'pro' | 'business'>('free');
  const [currentUsage, setCurrentUsage] = useState<CurrentUsage>({
    ai_requests: 0,
    calendar_events: 0,
    document_uploads: 0,
    video_call_minutes: 0,
    forms_created: 0,
    team_members: 0,
  });

  const isPremium = subscriptionTier === 'pro' || subscriptionTier === 'business';
  const usageLimits = subscriptionTier === 'business' ? BUSINESS_LIMITS :
                     subscriptionTier === 'pro' ? PRO_LIMITS : FREE_LIMITS;

  const refreshSubscription = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Get subscription info
      const { data: subscriptionData } = await supabase
        .from('subscribers')
        .select('subscription_tier, trial_end')
        .eq('user_id', user.id)
        .single();

      // Get current usage
      const { data: usageData } = await supabase
        .from('user_usage')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (subscriptionData) {
        // Map database tier to frontend tier
        const dbTier = subscriptionData.subscription_tier as string;
        let frontendTier: 'free' | 'pro' | 'business' = 'free';
        
        if (dbTier === 'basic' || dbTier === 'premium' || dbTier === 'pro') {
          frontendTier = 'pro';
        } else if (dbTier === 'business') {
          frontendTier = 'business';
        }
        
        setSubscriptionTier(frontendTier);
      }

      if (usageData) {
        setCurrentUsage({
          ai_requests: usageData.ai_requests || 0,
          calendar_events: usageData.calendar_events || 0,
          document_uploads: usageData.document_uploads || 0,
          video_call_minutes: usageData.video_call_minutes || 0,
          forms_created: usageData.forms_created || 0,
          team_members: usageData.team_members || 0,
        });
      }
    } catch (error) {
      console.error('Error refreshing subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const canUseFeature = (feature: keyof UsageLimits): boolean => {
    if (isPremium) return true;
    return currentUsage[feature] < usageLimits[feature];
  };

  const incrementUsage = async (feature: keyof UsageLimits, amount = 1): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { data, error } = await supabase.rpc('increment_usage', {
        p_user_id: user.id,
        p_feature_type: feature,
        p_amount: amount,
      });

      if (error) throw error;
      
      // Update local state
      setCurrentUsage(prev => ({
        ...prev,
        [feature]: prev[feature] + amount,
      }));

      return true;
    } catch (error) {
      console.error(`Error incrementing ${feature} usage:`, error);
      toast.error(`Failed to track ${feature} usage`);
      return false;
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      refreshSubscription();
    } else if (!authLoading && !user) {
      setIsLoading(false);
      setSubscriptionTier('free');
      setCurrentUsage({
        ai_requests: 0,
        calendar_events: 0,
        document_uploads: 0,
        video_call_minutes: 0,
        forms_created: 0,
        team_members: 0,
      });
    }
  }, [user, authLoading]);

  const value = {
    isLoading,
    isPremium,
    subscriptionTier,
    currentUsage,
    usageLimits,
    canUseFeature,
    incrementUsage,
    refreshSubscription,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};