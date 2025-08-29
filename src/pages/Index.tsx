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
              <p className="text-sm font-medium text-foreground">Sunny Acres Restaurant</p>
              <p className="text-xs text-muted-foreground">Today • {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-32 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${restaurantHeroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/60" />
        </div>
        <div className="relative flex h-full items-center px-6">
          <div className="text-white">
            <h2 className="text-xl font-bold">AI-Powered Restaurant Management</h2>
            <p className="text-sm opacity-90">Streamline operations with intelligent automation</p>
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
