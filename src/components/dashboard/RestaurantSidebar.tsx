import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
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
  GraduationCap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SearchTrigger } from "@/components/search/GlobalSearch";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { useLanguage } from "@/contexts/LanguageContext";

const navigationSections = [
  {
    title: "section.operations",
    items: [
      { titleKey: "nav.dashboard", url: "/", icon: LayoutDashboard },
      { titleKey: "nav.recipes", url: "/recipes", icon: ChefHat },
      { titleKey: "nav.checklists", url: "/checklists", icon: ClipboardList },
      { titleKey: "nav.calendar", url: "/calendar", icon: CalendarIcon },
      { titleKey: "nav.communications", url: "/communications", icon: MessageSquare },
      { titleKey: "nav.reminders", url: "/reminders", icon: Bell },
    ]
  },
  {
    title: "section.management",
    items: [
      { titleKey: "nav.ai-agents", url: "/ai-agents", icon: Brain, managerOnly: true },
      { titleKey: "nav.orders", url: "/orders", icon: ShoppingCart, managerOnly: true },
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
  const location = useLocation();
  const currentPath = location.pathname;
  const { user } = useUser();
  const { t } = useLanguage();

  const isActive = (path: string) => currentPath === path;
  
  const isManager = user?.publicMetadata?.role === 'manager' || user?.emailAddresses?.[0]?.emailAddress?.includes('manager');

  return (
    <div className={cn(
      "bg-card border-r border-border transition-all duration-300 h-screen flex flex-col shadow-medium",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <ChefHat className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg text-foreground">Chef Central</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          {!isCollapsed && <LanguageSwitcher />}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-muted-foreground hover:text-foreground"
          >
            {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Search */}
      {!isCollapsed && (
        <div className="px-4 py-2">
          <SearchTrigger onOpenSearch={() => onOpenSearch?.()} />
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-2">
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
                            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors group hover-lift",
                            isActive
                              ? "bg-primary text-primary-foreground glow-on-hover"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted"
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
      <div className="p-4 border-t border-border">
        <div className={cn(
          "flex items-center gap-3 p-2 rounded-lg bg-muted hover-lift",
          isCollapsed && "justify-center"
        )}>
          <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
            <span className="text-sm font-medium text-primary-foreground">JD</span>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {isManager ? t('common.manager') : 'Staff'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}