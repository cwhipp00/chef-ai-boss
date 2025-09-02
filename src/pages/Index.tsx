import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { AIRecipeScaler } from "@/components/dashboard/AIRecipeScaler";
import { SmartChecklist } from "@/components/dashboard/SmartChecklist";
import restaurantHeroImage from "@/assets/restaurant-hero.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="flex h-16 items-center justify-between px-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Restaurant Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome back, John! Here's your restaurant overview</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="flex flex-col items-end">
                <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent tracking-wider">
                  TBC
                </div>
                <p className="text-sm font-medium text-foreground -mt-1">The Breakfast Club</p>
                <p className="text-xs text-muted-foreground">Today • {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-40 overflow-hidden bg-gradient-to-br from-background via-primary/10 to-accent/20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        <div className="absolute inset-0 bg-grid-white/5" />
        
        <div className="relative flex h-full items-center justify-between px-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">🍳</span>
                </div>
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-accent rounded-full animate-pulse" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Chef AI Command Center
              </h2>
            </div>
            <p className="text-muted-foreground text-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              All systems operational • Next-gen culinary intelligence
            </p>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <div className="glass-card p-3 rounded-xl">
              <div className="text-xs text-muted-foreground mb-1">Active Sessions</div>
              <div className="text-lg font-bold text-foreground">12</div>
            </div>
            <div className="glass-card p-3 rounded-xl">
              <div className="text-xs text-muted-foreground mb-1">AI Efficiency</div>
              <div className="text-lg font-bold text-primary">98%</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <DashboardStats />

        {/* Quick Actions */}
        <QuickActions />

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
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
    </div>
  );
};

export default Index;
