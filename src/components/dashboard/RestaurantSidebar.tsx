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
        <div className="p-3 sm:p-4 lg:p-5 border-b border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 relative overflow-hidden">
          {/* Ambient background effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/2 via-transparent to-accent/2"></div>
          <div className="absolute top-0 left-1/4 w-20 h-20 bg-primary/4 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 right-1/4 w-16 h-16 bg-accent/4 rounded-full blur-xl"></div>
          
          {!isCollapsed && (
            <div className="relative flex flex-col items-center text-center space-y-2">
              {/* Compact Premium Logo Design */}
              <div className="relative group">
                {/* Outer glow ring */}
                <div className="absolute inset-0 w-14 h-14 bg-gradient-to-br from-primary/25 via-accent/30 to-primary/25 rounded-full blur-lg scale-110 group-hover:scale-125 transition-all duration-500 animate-pulse"></div>
                
                {/* Main logo container */}
                <div className="relative w-14 h-14 bg-gradient-to-br from-background via-background/95 to-background/90 backdrop-blur-sm border border-primary/25 rounded-full shadow-xl group-hover:shadow-primary/30 transition-all duration-300 flex items-center justify-center">
                  
                  {/* Rotating outer ring */}
                  <div className="absolute inset-0.5 border border-accent/15 rounded-full animate-spin" style={{ animationDuration: '10s' }}>
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0.5 h-0.5 bg-primary rounded-full"></div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-0.5 h-0.5 bg-accent rounded-full"></div>
                  </div>
                  
                  {/* Inner logo elements */}
                  <div className="relative z-10">
                    <ChefHat className="h-6 w-6 text-primary drop-shadow-md group-hover:scale-105 group-hover:text-accent transition-all duration-300" />
                    {/* AI elements */}
                    <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-accent rounded-full animate-pulse shadow-sm"></div>
                    <div className="absolute -bottom-0.5 -left-0.5 w-1 h-1 bg-primary rounded-full animate-ping opacity-70" style={{ animationDelay: '0.6s' }}></div>
                  </div>
                </div>
              </div>
              
              {/* Compact Typography */}
              <div className="space-y-1">
                <div className="relative">
                  <h1 className="text-xl lg:text-2xl font-black bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent transition-all duration-700 tracking-tight leading-none">
                    Chef AI
                  </h1>
                  <div className="absolute inset-0 text-xl lg:text-2xl font-black text-primary/8 blur-sm transition-all duration-700 tracking-tight leading-none">
                    Chef AI
                  </div>
                </div>
                
                {/* Compact Pro badge */}
                <div className="flex items-center justify-center gap-2">
                  <div className="h-px w-4 bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
                  <span className="text-sm font-bold text-accent tracking-[0.2em] uppercase">PRO</span>
                  <div className="h-px w-4 bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
                </div>
                
                {/* Compact status */}
                <div className="flex items-center justify-center gap-1 pt-1">
                  <div className="flex gap-0.5">
                    <div className="w-1 h-1 bg-primary rounded-full animate-pulse"></div>
                    <div className="w-1 h-1 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                    <div className="w-1 h-1 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
                  </div>
                  <span className="text-xs text-muted-foreground/60 font-medium ml-1">AI ACTIVE</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Controls */}
          <div className={`${!isCollapsed ? 'absolute top-3 right-3' : ''} flex items-center gap-2`}>
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
        <div className="p-2 border-t border-primary/20 bg-gradient-to-r from-card via-card to-primary/5">
          <div className={cn(
            "flex items-center gap-2 p-2 rounded-lg bg-card/50 backdrop-blur border border-primary/10 hover-lift touch-target",
            isCollapsed && "justify-center"
          )}>
            <div className="w-6 h-6 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-medium text-primary-foreground">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">
                  {user?.email || 'User'}
                </p>
                <p className="text-xs text-muted-foreground/80 truncate">
                  {isManager ? t('common.manager') : 'Staff'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}