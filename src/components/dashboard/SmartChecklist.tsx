import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ClipboardList, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Brain,
  User
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  estimatedTime: number;
  assignee?: string;
  aiSuggestion?: string;
}

const initialItems: ChecklistItem[] = [
  {
    id: "1",
    title: "Turn on all kitchen equipment",
    description: "Ovens, grills, fryers, and warming stations",
    completed: true,
    priority: "high",
    estimatedTime: 15,
    assignee: "Maria R.",
  },
  {
    id: "2",
    title: "Check ingredient inventory",
    description: "Verify stock levels for today's menu",
    completed: true,
    priority: "high",
    estimatedTime: 10,
    assignee: "Kevin C.",
    aiSuggestion: "AI detected low tomato stock - consider prep priority"
  },
  {
    id: "3",
    title: "Sanitize all work surfaces",
    description: "Complete cleaning and sanitization protocol",
    completed: false,
    priority: "high",
    estimatedTime: 20,
    assignee: "Sarah M.",
  },
  {
    id: "4",
    title: "Prep vegetables for lunch service",
    description: "Dice, slice, and portion vegetables",
    completed: false,
    priority: "medium",
    estimatedTime: 45,
    assignee: "John D.",
  },
  {
    id: "5",
    title: "Set up POS systems",
    description: "Test all point-of-sale terminals",
    completed: false,
    priority: "medium",
    estimatedTime: 5,
    assignee: "Lisa K.",
  },
  {
    id: "6",
    title: "Review daily specials",
    description: "Brief staff on today's special menu items",
    completed: false,
    priority: "low",
    estimatedTime: 10,
    assignee: "Manager",
  }
];

export function SmartChecklist() {
  const [items, setItems] = useState<ChecklistItem[]>(initialItems);
  const { toast } = useToast();

  const completedCount = items.filter(item => item.completed).length;
  const totalCount = items.length;
  const completionPercentage = (completedCount / totalCount) * 100;

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, completed: !item.completed }
        : item
    ));

    const item = items.find(i => i.id === id);
    if (item && !item.completed) {
      toast({
        title: "Task Completed",
        description: `"${item.title}" has been marked as complete`,
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-destructive";
      case "medium": return "bg-warning";
      case "low": return "bg-info";
      default: return "bg-muted";
    }
  };

  const getTotalEstimatedTime = () => {
    return items
      .filter(item => !item.completed)
      .reduce((total, item) => total + item.estimatedTime, 0);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-primary" />
          Smart Checklist - Opening Procedures
        </CardTitle>
        <CardDescription>
          AI-enhanced daily operations checklist with time tracking
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Overview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {completedCount} of {totalCount} tasks completed
            </span>
            <span className="font-medium text-foreground">
              {Math.round(completionPercentage)}%
            </span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{getTotalEstimatedTime()} min remaining</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              <span>Auto-prioritized by AI</span>
            </div>
          </div>
        </div>

        {/* Checklist Items */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {items.map((item) => (
            <div
              key={item.id}
              className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors ${
                item.completed
                  ? "bg-muted/50 border-muted opacity-60"
                  : "bg-card border-border hover:bg-muted/30"
              }`}
            >
              <Checkbox
                id={item.id}
                checked={item.completed}
                onCheckedChange={() => toggleItem(item.id)}
                className="mt-0.5"
              />
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <label
                    htmlFor={item.id}
                    className={`text-sm font-medium cursor-pointer ${
                      item.completed
                        ? "line-through text-muted-foreground"
                        : "text-foreground"
                    }`}
                  >
                    {item.title}
                  </label>
                  <Badge 
                    variant="secondary" 
                    className={getPriorityColor(item.priority)}
                  >
                    {item.priority}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {item.description}
                </p>
                {item.aiSuggestion && (
                  <div className="flex items-start gap-1 p-2 bg-info/10 rounded-md">
                    <Brain className="h-3 w-3 text-info mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-info">
                      {item.aiSuggestion}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{item.estimatedTime} min</span>
                  </div>
                  {item.assignee && (
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{item.assignee}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1">
            <AlertTriangle className="h-4 w-4 mr-1" />
            Report Issue
          </Button>
          <Button variant="glow" size="sm" className="flex-1">
            <Brain className="h-4 w-4 mr-1" />
            AI Suggestions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}