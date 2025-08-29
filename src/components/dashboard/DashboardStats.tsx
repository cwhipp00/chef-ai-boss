import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  DollarSign
} from "lucide-react";

const stats = [
  {
    title: "Daily Revenue",
    value: "$12,847",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    description: "Compared to yesterday"
  },
  {
    title: "Orders Completed",
    value: "147",
    change: "+8.2%",
    trend: "up",
    icon: CheckCircle,
    description: "Today's completed orders"
  },
  {
    title: "Avg. Prep Time",
    value: "8.4 min",
    change: "-2.1%",
    trend: "down",
    icon: Clock,
    description: "Kitchen efficiency improved"
  },
  {
    title: "Tasks Pending",
    value: "6",
    change: "-3",
    trend: "down",
    icon: AlertTriangle,
    description: "Daily checklist items"
  }
];

export function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-medium transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      ))}
    </div>
  );
}