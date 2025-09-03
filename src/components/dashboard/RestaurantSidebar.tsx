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
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SearchTrigger } from "@/components/search/GlobalSearch";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { HelpChatDropdown } from "@/components/ai/HelpChatDropdown";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

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
  const location = useLocation();
  const currentPath = location.pathname;
  const { t } = useLanguage();
  const { user, signOut } = useAuth();

  const isActive = (path: string) => currentPath === path;
  
  // For now, assume all users are managers until Clerk is fully set up
  const isManager = true;

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
        className="fixed top-4 left-4 z-50 lg:hidden bg-card/95 backdrop-blur border border-primary/20 shadow-soft"
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
        <div className="p-4 sm:p-6 lg:p-8 border-b border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 relative overflow-hidden">
          {/* Ambient background effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-accent/3"></div>
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-accent/6 rounded-full blur-2xl"></div>
          
          {!isCollapsed && (
            <div className="relative flex flex-col items-center text-center space-y-4">
              {/* Premium Logo Design */}
              <div className="relative group">
                {/* Outer glow ring */}
                <div className="absolute inset-0 w-20 h-20 bg-gradient-to-br from-primary/30 via-accent/40 to-primary/30 rounded-full blur-xl scale-110 group-hover:scale-125 transition-all duration-700 animate-pulse"></div>
                
                {/* Main logo container */}
                <div className="relative w-20 h-20 bg-gradient-to-br from-background via-background/95 to-background/90 backdrop-blur-sm border-2 border-primary/30 rounded-full shadow-2xl group-hover:shadow-primary/40 transition-all duration-500 flex items-center justify-center">
                  
                  {/* Rotating outer ring */}
                  <div className="absolute inset-1 border border-accent/20 rounded-full animate-spin" style={{ animationDuration: '12s' }}>
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-primary rounded-full"></div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-1 h-1 bg-accent rounded-full"></div>
                    <div className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0.5 h-0.5 bg-primary rounded-full"></div>
                    <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-0.5 h-0.5 bg-accent rounded-full"></div>
                  </div>
                  
                  {/* Inner logo elements */}
                  <div className="relative z-10">
                    {/* Chef Hat with AI elements */}
                    <div className="relative">
                      <ChefHat className="h-8 w-8 text-primary drop-shadow-lg group-hover:scale-110 group-hover:text-accent transition-all duration-500" />
                      {/* AI neural connections */}
                      <div className="absolute -top-1 -right-0.5 w-2 h-2 bg-accent rounded-full animate-pulse shadow-lg"></div>
                      <div className="absolute -bottom-0.5 -left-1 w-1.5 h-1.5 bg-primary rounded-full animate-ping opacity-80" style={{ animationDelay: '0.8s' }}></div>
                      <div className="absolute top-1 left-2 w-1 h-1 bg-accent rounded-full animate-ping opacity-60" style={{ animationDelay: '1.6s' }}></div>
                    </div>
                  </div>
                  
                  {/* Orbiting particles */}
                  <div className="absolute inset-0 animate-spin" style={{ animationDuration: '20s', animationDirection: 'reverse' }}>
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary/60 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-2 right-3 w-0.5 h-0.5 bg-accent/80 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                  </div>
                </div>
              </div>
              
              {/* Premium Typography */}
              <div className="space-y-2">
                <div className="relative">
                  <h1 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent group-hover:from-accent group-hover:via-primary group-hover:to-accent transition-all duration-1000 tracking-tight leading-none">
                    Chef AI
                  </h1>
                  {/* Text glow effect */}
                  <div className="absolute inset-0 text-3xl lg:text-4xl font-black text-primary/10 blur-sm transition-all duration-1000 tracking-tight leading-none">
                    Chef AI
                  </div>
                </div>
                
                {/* Pro badge */}
                <div className="flex items-center justify-center gap-3">
                  <div className="h-px w-8 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
                  <div className="relative">
                    <span className="text-lg font-black text-accent tracking-[0.3em] uppercase relative z-10">
                      PRO
                    </span>
                    <div className="absolute inset-0 text-lg font-black text-accent/30 blur-sm tracking-[0.3em] uppercase">
                      PRO
                    </div>
                  </div>
                  <div className="h-px w-8 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
                </div>
                
                {/* Subtitle */}
                <p className="text-sm text-muted-foreground/90 font-medium tracking-wide leading-relaxed max-w-xs">
                  Restaurant Excellence Platform
                </p>
                
                {/* Animated status indicators */}
                <div className="flex items-center justify-center gap-2 pt-2">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
                    <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                  </div>
                  <span className="text-xs text-muted-foreground/70 font-medium ml-2">AI ACTIVE</span>
                </div>
              </div>
              
              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4/5 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
            </div>
          )}
          
          {/* Controls */}
          <div className={`${!isCollapsed ? 'absolute top-4 right-4' : ''} flex items-center gap-2 lg:gap-3`}>
            {!isCollapsed && <LanguageSwitcher />}
            {!isCollapsed && <HelpChatDropdown />}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex h-8 w-8 lg:h-10 lg:w-10 p-0 hover:bg-primary/10 touch-target"
            >
              {isCollapsed ? <Menu className="h-4 w-4 lg:h-5 lg:w-5" /> : <X className="h-4 w-4 lg:h-5 lg:w-5" />}
            </Button>
          </div>
        </div>

        {/* Search */}
        {!isCollapsed && (
          <div className="px-3 sm:px-4 lg:px-6 py-2 lg:py-3">
            <SearchTrigger onOpenSearch={() => onOpenSearch?.()} />
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-2 lg:p-3 overflow-y-auto">
          <div className="space-y-4 lg:space-y-6">
            {navigationSections.map((section) => (
              <div key={section.title}>
                {!isCollapsed && (
                  <h3 className="px-3 lg:px-4 mb-2 lg:mb-3 text-xs lg:text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    {t(section.title)}
                  </h3>
                )}
                <ul className="space-y-1 lg:space-y-2">
                  {section.items
                    .filter(item => !item.managerOnly || isManager)
                    .map((item) => (
                      <li key={item.titleKey}>
                        <NavLink
                          to={item.url}
                          end
                          className={({ isActive }) =>
                            cn(
                              "flex items-center gap-3 lg:gap-4 px-3 lg:px-4 py-2 lg:py-3 rounded-lg text-sm lg:text-base font-medium transition-all group hover-lift touch-target",
                              isActive
                                ? "bg-primary text-primary-foreground shadow-soft"
                                : "text-muted-foreground hover:text-foreground hover:bg-primary/10 hover:border-primary/20"
                            )
                          }
                        >
                          <item.icon className="h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0" />
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
        <div className="p-3 sm:p-4 lg:p-6 border-t border-primary/20 bg-gradient-to-r from-card via-card to-primary/5">
          <div className={cn(
            "flex items-center gap-3 lg:gap-4 p-2 lg:p-3 rounded-lg bg-card/50 backdrop-blur border border-primary/10 hover-lift touch-target",
            isCollapsed && "justify-center"
          )}>
            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-primary flex items-center justify-center">
              <span className="text-sm lg:text-base font-medium text-primary-foreground">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm lg:text-base font-medium text-foreground truncate">
                  {user?.email || 'User'}
                </p>
                <p className="text-xs lg:text-sm text-muted-foreground truncate">
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
              className="w-full mt-2 lg:mt-3 text-muted-foreground hover:text-foreground hover:bg-primary/10 lg:py-3 lg:text-base touch-target"
            >
              <LogOut className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
              Sign Out
            </Button>
          )}
        </div>
      </div>
    </>
  );
}