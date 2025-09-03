import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { AIRecipeScaler } from "@/components/dashboard/AIRecipeScaler";
import { SmartChecklist } from "@/components/dashboard/SmartChecklist";
import { ResponsiveLayout, ResponsiveHeader, MobileFirstCard } from "@/components/layout/ResponsiveLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChefHat, Sparkles, Activity, TrendingUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import restaurantHeroImage from "@/assets/restaurant-hero.jpg";

const Index = () => {
  const { user } = useAuth();
  const { isPremium, subscriptionTier } = useSubscription();
  
  return (
    <ResponsiveLayout>
      {/* Animated Background Elements (like login screen) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-16 sm:w-20 lg:w-24 h-16 sm:h-20 lg:h-24 bg-primary/5 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-12 sm:w-16 lg:w-20 h-12 sm:h-16 lg:h-20 bg-accent/5 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-10 sm:w-12 lg:w-16 h-10 sm:h-12 lg:h-16 bg-secondary/5 rounded-full animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 space-y-4 sm:space-y-6 lg:space-y-8 xl:space-y-10">
        {/* Header */}
        <ResponsiveHeader
          title="Chef AI Dashboard"
          subtitle={`Welcome back, ${user?.email?.split('@')[0] || 'Chef'}! Here's your AI-powered restaurant overview`}
          badge={
            <Badge 
              variant={isPremium ? "default" : "secondary"} 
              className={`${isPremium ? "bg-primary" : ""} text-xs sm:text-sm lg:text-base touch-target`}
            >
              {isPremium && <Sparkles className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />}
              {subscriptionTier.toUpperCase()} PLAN
            </Badge>
          }
          actions={
            <div className="text-center sm:text-right">
              <div className="flex flex-col items-center sm:items-end">
                <div className="text-2xl sm:text-3xl lg:text-5xl xl:text-6xl font-bold text-gradient tracking-wider">
                  TBC
                </div>
                <p className="text-xs sm:text-sm lg:text-base font-medium text-foreground -mt-1">The Breakfast Club</p>
                <p className="text-xs lg:text-sm text-muted-foreground mt-1">Today • {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          }
        />

        {/* Hero Section with Auth Design */}
        <MobileFirstCard className="relative overflow-hidden bg-gradient-to-br from-card via-card to-primary/5 border-primary/20 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 lg:gap-6">
            <div className="space-y-2 lg:space-y-3">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="relative">
                  <div className="h-6 w-6 sm:h-8 sm:w-8 lg:h-12 lg:w-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                    <ChefHat className="h-3 w-3 sm:h-4 sm:w-4 lg:h-6 lg:w-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 h-2 w-2 sm:h-3 sm:w-3 lg:h-4 lg:w-4 bg-accent rounded-full animate-pulse" />
                </div>
                <h2 className="text-lg sm:text-xl lg:text-3xl xl:text-4xl font-bold text-gradient">
                  Chef AI Command Center
                </h2>
              </div>
              <p className="text-xs sm:text-sm lg:text-base text-muted-foreground flex items-center gap-2">
                <span className="w-2 h-2 lg:w-3 lg:h-3 bg-success rounded-full animate-pulse" />
                All systems operational • Next-gen culinary intelligence
              </p>
            </div>
            
            <div className="flex gap-3 sm:gap-4 lg:gap-6 justify-center sm:justify-end">
              <div className="bg-card/50 backdrop-blur p-2 sm:p-3 lg:p-4 rounded-lg border text-center touch-target">
                <div className="text-xs lg:text-sm text-muted-foreground mb-1">Active Sessions</div>
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">12</div>
              </div>
              <div className="bg-card/50 backdrop-blur p-2 sm:p-3 lg:p-4 rounded-lg border text-center touch-target">
                <div className="text-xs lg:text-sm text-muted-foreground mb-1">AI Efficiency</div>
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-primary">98%</div>
              </div>
            </div>
          </div>
        </MobileFirstCard>

        {/* Stats Grid */}
        <DashboardStats />

        {/* Quick Actions */}
        <QuickActions />

        {/* Main Content Grid */}
        <div className="grid gap-4 sm:gap-6 lg:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          {/* Left Column - Recipe Scaler */}
          <div className="lg:col-span-1">
            <AIRecipeScaler />
          </div>

          {/* Middle Column - Checklist */}
          <div className="lg:col-span-1">
            <SmartChecklist />
          </div>

          {/* Right Column - Recent Activity */}
          <div className="lg:col-span-1">
            <RecentActivity />
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default Index;
