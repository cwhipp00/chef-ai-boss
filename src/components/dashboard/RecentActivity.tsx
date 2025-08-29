import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Clock, 
  ChefHat, 
  CheckCircle, 
  MessageSquare, 
  AlertCircle 
} from "lucide-react";

const activities = [
  {
    id: 1,
    type: "recipe",
    title: "Recipe scaled for dinner rush",
    description: "Chicken Parmesan portions increased by 40%",
    user: "AI Assistant",
    userInitials: "AI",
    time: "2 minutes ago",
    status: "success",
    icon: ChefHat
  },
  {
    id: 2,
    type: "checklist",
    title: "Opening checklist completed",
    description: "All 12 items checked off by morning staff",
    user: "Maria Rodriguez",
    userInitials: "MR",
    time: "15 minutes ago",
    status: "success",
    icon: CheckCircle
  },
  {
    id: 3,
    type: "communication",
    title: "Team message sent",
    description: "Reminder about today's special menu items",
    user: "John Doe",
    userInitials: "JD",
    time: "32 minutes ago",
    status: "info",
    icon: MessageSquare
  },
  {
    id: 4,
    type: "alert",
    title: "Inventory alert triggered",
    description: "Tomatoes running low - automatic reorder suggested",
    user: "System",
    userInitials: "SY",
    time: "1 hour ago",
    status: "warning",
    icon: AlertCircle
  },
  {
    id: 5,
    type: "task",
    title: "EOD checklist started",
    description: "Evening closing procedures initiated",
    user: "Kevin Chen",
    userInitials: "KC",
    time: "2 hours ago",
    status: "pending",
    icon: Clock
  }
];

const statusColors = {
  success: "bg-success text-success-foreground",
  info: "bg-info text-info-foreground",
  warning: "bg-warning text-warning-foreground",
  pending: "bg-muted text-muted-foreground"
};

export function RecentActivity() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Recent Activity
        </CardTitle>
        <CardDescription>
          Real-time updates from your restaurant operations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <activity.icon className="h-4 w-4 text-primary" />
              </div>
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-foreground truncate">
                  {activity.title}
                </h4>
                <Badge 
                  variant="secondary" 
                  className={statusColors[activity.status as keyof typeof statusColors]}
                >
                  {activity.status}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {activity.description}
              </p>
              <div className="flex items-center space-x-2">
                <Avatar className="h-4 w-4">
                  <AvatarFallback className="text-xs bg-secondary">
                    {activity.userInitials}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground">
                  {activity.user} • {activity.time}
                </span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}