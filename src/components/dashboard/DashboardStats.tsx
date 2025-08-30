import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  DollarSign,
  ExternalLink
} from "lucide-react";

const stats = [
  {
    title: "Daily Revenue",
    value: "$12,847",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    description: "Compared to yesterday",
    link: "/finance",
    aiInsight: "AI predicts 15% growth by month-end"
  },
  {
    title: "Orders Completed",
    value: "147",
    change: "+8.2%",
    trend: "up",
    icon: CheckCircle,
    description: "Today's completed orders",
    link: "/orders",
    aiInsight: "Peak hours: 12-2pm, 6-8pm"
  },
  {
    title: "Avg. Prep Time",
    value: "8.4 min",
    change: "-2.1%",
    trend: "down",
    icon: Clock,
    description: "Kitchen efficiency improved",
    link: "/recipes",
    aiInsight: "Optimization saved 18 mins today"
  },
  {
    title: "Tasks Pending",
    value: "6",
    change: "-3",
    trend: "down",
    icon: AlertTriangle,
    description: "Daily checklist items",
    link: "/checklists",
    aiInsight: "Auto-scheduling reduces pending by 40%"
  }
];

export function DashboardStats() {
  const navigate = useNavigate();

  const handleStatClick = (link: string) => {
    navigate(link);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card 
          key={index} 
          className="hover-lift cursor-pointer glow-on-hover transition-all group" 
          onClick={() => handleStatClick(stat.link)}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className="flex items-center gap-2">
              <stat.icon className="h-4 w-4 text-muted-foreground" />
              <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <div className="flex items-center space-x-2 text-xs">
              <Badge 
                variant={stat.trend === "up" ? "default" : "secondary"}
                className={stat.trend === "up" ? "bg-success" : "bg-info"}
              >
                {stat.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {stat.change}
              </Badge>
              <span className="text-muted-foreground">{stat.description}</span>
            </div>
            <div className="text-xs text-primary bg-primary/10 p-2 rounded border-l-2 border-primary">
              🤖 {stat.aiInsight}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}