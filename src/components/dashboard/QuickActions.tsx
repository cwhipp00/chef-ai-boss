import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Plus, 
  Calendar, 
  MessageCircle, 
  FileCheck, 
  Zap,
  Brain,
  ChefHat,
  ShoppingCart
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

  const handleActionClick = (route: string) => {
    navigate(route);
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
            className="h-auto p-4 flex-col items-start text-left gap-2 hover-lift transition-all"
            onClick={() => handleActionClick(action.route)}
          >
            <div className="flex items-center gap-2 w-full">
              <action.icon className="h-4 w-4" />
              <span className="font-medium">{action.title}</span>
            </div>
            <span className="text-xs opacity-90 font-normal">
              {action.description}
            </span>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}