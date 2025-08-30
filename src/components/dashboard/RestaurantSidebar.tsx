import { useState } from "react";
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
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SearchTrigger } from "@/components/search/GlobalSearch";

const navigationItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "AI Agents", url: "/ai-agents", icon: Brain },
  { title: "Recipes", url: "/recipes", icon: ChefHat },
  { title: "Checklists", url: "/checklists", icon: ClipboardList },
  { title: "Manager Tools", url: "/manager", icon: Users },
  { title: "Communications", url: "/communications", icon: MessageSquare },
  { title: "Reminders", url: "/reminders", icon: Bell },
  { title: "Calendar", url: "/calendar", icon: CalendarIcon },
  { title: "Orders", url: "/orders", icon: ShoppingCart },
  { title: "Documents", url: "/documents", icon: FileText },
  { title: "Reservations", url: "/reservations", icon: TableProperties },
  { title: "Staff Schedule", url: "/staff-schedule", icon: Clock },
  { title: "Finance", url: "/finance", icon: DollarSign },
  { title: "Customers", url: "/customers", icon: BarChart3 },
  { title: "Settings", url: "/settings", icon: Settings },
];

interface RestaurantSidebarProps {
  onOpenSearch?: () => void;
}

export function RestaurantSidebar({ onOpenSearch }: RestaurantSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

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
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-muted-foreground hover:text-foreground"
        >
          {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      {/* Search */}
      {!isCollapsed && (
        <div className="px-4 py-2">
          <SearchTrigger onOpenSearch={() => onOpenSearch?.()} />
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {navigationItems.map((item) => (
            <li key={item.title}>
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
                {!isCollapsed && <span>{item.title}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
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
              <p className="text-sm font-medium text-foreground truncate">John Doe</p>
              <p className="text-xs text-muted-foreground truncate">Manager</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}