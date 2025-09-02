import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { 
  Plus, 
  Calendar, 
  MessageCircle, 
  FileCheck, 
  Zap,
  Brain,
  ChefHat,
  ShoppingCart,
  Clock,
  Users
} from "lucide-react";

const actions = [
  {
    title: "Add New Recipe",
    description: "Create and scale recipes with AI assistance",
    icon: Plus,
    variant: "glow" as const,
    route: "/recipes"
  },
  {
    title: "Schedule Staff",
    description: "Manage today's shift schedule",
    icon: Calendar,
    variant: "default" as const,
    route: "/staff-schedule"
  },
  {
    title: "Team Chat",
    description: "Send updates to your team",
    icon: MessageCircle,
    variant: "info" as const,
    route: "/communications"
  },
  {
    title: "AI Assistant",
    description: "Get intelligent recommendations",
    icon: Brain,
    variant: "success" as const,
    route: "/ai-agents"
  },
  {
    title: "Daily Checklist",
    description: "Complete opening procedures",
    icon: FileCheck,
    variant: "warning" as const,
    route: "/checklists"
  },
  {
    title: "Quick Order",
    description: "Place urgent supply order",
    icon: ShoppingCart,
    variant: "secondary" as const,
    route: "/orders"
  }
];

export function QuickActions() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [actionCounts, setActionCounts] = useState({
    recipes: 3,
    staff: 2,
    messages: 5,
    checklist: 8,
    orders: 1
  });

  const handleActionClick = (route: string, actionType: string, title: string) => {
    // Update counts for realistic interactions
    if (actionType === 'staff') {
      setActionCounts(prev => ({ ...prev, staff: prev.staff + 1 }));
    }
    
    toast({
      title: `${title} Opened`,
      description: "Taking you to " + title.toLowerCase(),
    });
    
    navigate(route);
  };

  const getActionDescription = (action: any) => {
    switch (action.title) {
      case "Schedule Staff":
        return `${actionCounts.staff} shifts need attention`;
      case "Team Chat":
        return `${actionCounts.messages} unread messages`;
      case "Daily Checklist":
        return `${actionCounts.checklist} items remaining`;
      case "Quick Order":
        return `${actionCounts.orders} urgent items`;
      case "Add New Recipe":
        return `${actionCounts.recipes} new recipes this week`;
      default:
        return action.description;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Quick Actions
        </CardTitle>
        <CardDescription>
          Streamline your daily operations with one-click actions
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant={action.variant}
            className="h-auto p-4 flex-col items-start text-left gap-2 hover-lift transition-all hover:scale-105 hover:shadow-glow relative group"
            onClick={() => handleActionClick(action.route, action.title.toLowerCase().replace(' ', ''), action.title)}
          >
            <div className="flex items-center gap-2 w-full">
              <action.icon className="h-4 w-4" />
              <span className="font-medium">{action.title}</span>
              {/* Live indicator badges */}
              {action.title === "Team Chat" && actionCounts.messages > 0 && (
                <div className="ml-auto w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
              )}
              {action.title === "Quick Order" && actionCounts.orders > 0 && (
                <div className="ml-auto w-2 h-2 bg-warning rounded-full animate-pulse"></div>
              )}
            </div>
            <span className="text-xs opacity-90 font-normal">
              {getActionDescription(action)}
            </span>
            
            {/* Hover enhancement */}
            <div className="absolute inset-0 bg-gradient-primary/5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}