import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  ChefHat, 
  ClipboardList, 
  Users, 
  MessageSquare, 
  Bell, 
  FileText, 
  ShoppingCart,
  Settings,
  Menu,
  X,
  Calendar as CalendarIcon,
  DollarSign,
  Brain,
  TableProperties,
  Clock,
  BarChart3,
  GraduationCap,
  LogOut,
  Building2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SearchTrigger } from "@/components/search/GlobalSearch";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const navigationSections = [
  {
    title: "section.operations",
    items: [
      { titleKey: "nav.dashboard", url: "/", icon: LayoutDashboard },
      { titleKey: "nav.recipes", url: "/recipes", icon: ChefHat },
      { titleKey: "nav.forms", url: "/forms", icon: ClipboardList },
      { titleKey: "nav.calendar", url: "/calendar", icon: CalendarIcon },
      { titleKey: "nav.communications", url: "/communications", icon: MessageSquare },
      { titleKey: "nav.reminders", url: "/reminders", icon: Bell },
    ]
  },
  {
    title: "section.management",
    items: [
      { titleKey: "nav.ai-agents", url: "/ai-agents", icon: Brain, managerOnly: true },
      { titleKey: "nav.manager", url: "/manager", icon: Users, managerOnly: true },
      { titleKey: "nav.staff-schedule", url: "/staff-schedule", icon: Clock },
      { titleKey: "nav.training", url: "/training", icon: GraduationCap },
    ]
  },
  {
    title: "section.business",
    items: [
      { titleKey: "nav.reservations", url: "/reservations", icon: TableProperties },
      { titleKey: "nav.customers", url: "/customers", icon: BarChart3 },
      { titleKey: "nav.finance", url: "/finance", icon: DollarSign, managerOnly: true },
      { titleKey: "nav.documents", url: "/documents", icon: FileText },
    ]
  },
  {
    title: "section.system",
    items: [
      { titleKey: "nav.settings", url: "/settings", icon: Settings },
    ]
  },
];

interface RestaurantSidebarProps {
  onOpenSearch?: () => void;
}

export function RestaurantSidebar({ onOpenSearch }: RestaurantSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [companyName, setCompanyName] = useState<string>('');
  const location = useLocation();
  const currentPath = location.pathname;
  const { t } = useLanguage();
  const { user, signOut } = useAuth();

  const isActive = (path: string) => currentPath === path;
  
  // For now, assume all users are managers until Clerk is fully set up
  const isManager = true;

  // Fetch company name from user profile
  useEffect(() => {
    const fetchCompanyName = async () => {
      if (!user?.id) return;
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('company_name')
        .eq('id', user.id)
        .single();
      
      if (profile?.company_name) {
        setCompanyName(profile.company_name);
      }
    };

    fetchCompanyName();
  }, [user?.id]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [currentPath]);

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-50 lg:hidden bg-card/95 backdrop-blur border border-primary/20"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Sidebar */}
      <div className={cn(
        "bg-gradient-to-b from-card to-card/80 border-r border-primary/20 transition-all duration-300 flex flex-col shadow-elegant backdrop-blur",
        "fixed lg:relative z-50 h-screen overflow-hidden",
        // Mobile positioning
        isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        // Desktop sizing
        isCollapsed ? "lg:w-16" : "lg:w-64",
        // Mobile sizing
        "w-64"
      )}>
        {/* Header */}
        <div className="p-3 sm:p-4 border-b border-primary/20 flex items-center justify-between bg-gradient-to-r from-card via-card to-primary/5">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="relative w-8 h-10 flex items-center justify-center">
                {/* Chef Hat */}
                <ChefHat className="h-5 w-5 text-primary drop-shadow-sm" />
                
                {/* Connection Line with neuron effect */}
                <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-0.5 h-3 bg-gradient-to-t from-primary via-accent to-primary/60 shadow-sm">
                  {/* Animated neuron pulse */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-accent rounded-full animate-ping opacity-75"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0.5 h-0.5 bg-primary rounded-full animate-pulse"></div>
                </div>
                
                {/* Brain with glow effect */}
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
                  <div className="relative">
                    {/* Glow background */}
                    <div className="absolute inset-0 bg-accent/30 rounded-full blur-sm scale-150 animate-pulse"></div>
                    {/* Brain icon */}
                    <Brain className="relative h-4 w-4 text-accent drop-shadow-lg animate-pulse" />
                    {/* Neuron sparks */}
                    <div className="absolute -top-0.5 -right-0.5 w-1 h-1 bg-accent rounded-full animate-ping"></div>
                    <div className="absolute -bottom-0.5 -left-0.5 w-0.5 h-0.5 bg-primary rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base sm:text-lg text-gradient">
                  Chef AI Pro
                </span>
                {companyName && (
                  <span className="text-xs text-muted-foreground font-medium truncate max-w-[120px]">
                    {companyName}
                  </span>
                )}
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            {!isCollapsed && companyName && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 border border-primary/20">
                <Building2 className="h-3 w-3 text-primary" />
                <span className="text-xs font-medium text-primary truncate max-w-[80px]">
                  {companyName}
                </span>
              </div>
            )}
            {!isCollapsed && <LanguageSwitcher />}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex h-8 w-8 p-0 hover:bg-primary/10"
            >
              {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Search */}
        {!isCollapsed && (
          <div className="px-3 sm:px-4 py-2">
            <SearchTrigger onOpenSearch={() => onOpenSearch?.()} />
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-2 overflow-y-auto">
          <div className="space-y-4">
            {navigationSections.map((section) => (
              <div key={section.title}>
                {!isCollapsed && (
                  <h3 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {t(section.title)}
                  </h3>
                )}
                <ul className="space-y-1">
                  {section.items
                    .filter(item => !item.managerOnly || isManager)
                    .map((item) => (
                      <li key={item.titleKey}>
                        <NavLink
                          to={item.url}
                          end
                          className={({ isActive }) =>
                            cn(
                              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group hover-lift",
                              isActive
                                ? "bg-primary text-primary-foreground shadow-soft"
                                : "text-muted-foreground hover:text-foreground hover:bg-primary/10 hover:border-primary/20"
                            )
                          }
                        >
                          <item.icon className="h-4 w-4 flex-shrink-0" />
                          {!isCollapsed && <span>{t(item.titleKey)}</span>}
                        </NavLink>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </nav>

        {/* User Section */}
        <div className="p-3 sm:p-4 border-t border-primary/20 bg-gradient-to-r from-card via-card to-primary/5">
          <div className={cn(
            "flex items-center gap-3 p-2 rounded-lg bg-card/50 backdrop-blur border border-primary/10 hover-lift",
            isCollapsed && "justify-center"
          )}>
            <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
              <span className="text-sm font-medium text-primary-foreground">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user?.email || 'User'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {isManager ? t('common.manager') : 'Staff'}
                </p>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className="w-full mt-2 text-muted-foreground hover:text-foreground hover:bg-primary/10"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          )}
        </div>
      </div>
    </>
  );
}