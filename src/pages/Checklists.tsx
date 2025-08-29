import { useState } from 'react';
import { Plus, Upload, FileText, CheckSquare, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';

const checklists = [
  {
    id: 1,
    title: "Opening Checklist",
    type: "daily",
    priority: "high",
    progress: 75,
    dueTime: "6:00 AM",
    items: [
      { id: 1, task: "Turn on all equipment", completed: true, priority: "high" },
      { id: 2, task: "Check temperature logs", completed: true, priority: "high" },
      { id: 3, task: "Verify inventory levels", completed: true, priority: "medium" },
      { id: 4, task: "Set up workstations", completed: false, priority: "medium" },
      { id: 5, task: "Review daily specials", completed: false, priority: "low" }
    ]
  },
  {
    id: 2,
    title: "End of Day Closing",
    type: "daily",
    priority: "high",
    progress: 0,
    dueTime: "11:00 PM",
    items: [
      { id: 1, task: "Clean all cooking surfaces", completed: false, priority: "high" },
      { id: 2, task: "Store food properly", completed: false, priority: "high" },
      { id: 3, task: "Turn off equipment", completed: false, priority: "high" },
      { id: 4, task: "Count till and deposit", completed: false, priority: "high" },
      { id: 5, task: "Set security system", completed: false, priority: "high" },
      { id: 6, task: "Complete temperature logs", completed: false, priority: "medium" },
      { id: 7, task: "Update inventory counts", completed: false, priority: "medium" },
      { id: 8, task: "Document any issues", completed: false, priority: "low" }
    ]
  },
  {
    id: 3,
    title: "Weekly Deep Clean",
    type: "weekly",
    priority: "medium",
    progress: 30,
    dueTime: "Sunday 2:00 PM",
    items: [
      { id: 1, task: "Deep clean fryers", completed: true, priority: "high" },
      { id: 2, task: "Sanitize walk-in cooler", completed: true, priority: "high" },
      { id: 3, task: "Clean ventilation system", completed: false, priority: "high" },
      { id: 4, task: "Organize dry storage", completed: false, priority: "medium" },
      { id: 5, task: "Update MSDS sheets", completed: false, priority: "low" }
    ]
  }
];

export default function Checklists() {
  const [selectedTab, setSelectedTab] = useState('active');
  const [uploadingDocument, setUploadingDocument] = useState(false);

  const handleDocumentUpload = () => {
    setUploadingDocument(true);
    // Simulate document parsing and checklist creation
    setTimeout(() => {
      setUploadingDocument(false);
    }, 2000);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-destructive';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-success';
    if (progress >= 50) return 'bg-warning';
    return 'bg-destructive';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Checklists</h1>
          <p className="text-muted-foreground">Manage daily, weekly, and monthly operational tasks</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleDocumentUpload}
            disabled={uploadingDocument}
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploadingDocument ? 'Processing...' : 'Upload Document'}
          </Button>
          <Button size="lg" className="bg-gradient-primary">
            <Plus className="h-4 w-4 mr-2" />
            Create Checklist
          </Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {checklists.map((checklist) => (
              <Card key={checklist.id} className="hover:shadow-medium transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {checklist.title}
                        <AlertTriangle className={`h-4 w-4 ${getPriorityColor(checklist.priority)}`} />
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Due: {checklist.dueTime}</span>
                      </div>
                    </div>
                    <Badge variant={checklist.type === 'daily' ? 'default' : 'secondary'}>
                      {checklist.type}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{checklist.progress}%</span>
                    </div>
                    <Progress value={checklist.progress} className="h-2" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {checklist.items.slice(0, 5).map((item) => (
                      <div key={item.id} className="flex items-center space-x-2">
                        <Checkbox 
                          checked={item.completed}
                          className="data-[state=checked]:bg-success data-[state=checked]:border-success"
                        />
                        <span className={`text-sm flex-1 ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {item.task}
                        </span>
                        <AlertTriangle className={`h-3 w-3 ${getPriorityColor(item.priority)}`} />
                      </div>
                    ))}
                    {checklist.items.length > 5 && (
                      <div className="text-xs text-muted-foreground text-center pt-2">
                        +{checklist.items.length - 5} more items
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="daily">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {checklists.filter(c => c.type === 'daily').map((checklist) => (
              <Card key={checklist.id} className="hover:shadow-medium transition-shadow">
                <CardHeader>
                  <CardTitle>{checklist.title}</CardTitle>
                  <Progress value={checklist.progress} className="h-2" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {checklist.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-2">
                        <Checkbox checked={item.completed} />
                        <span className={`text-sm flex-1 ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {item.task}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="weekly">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {checklists.filter(c => c.type === 'weekly').map((checklist) => (
              <Card key={checklist.id}>
                <CardHeader>
                  <CardTitle>{checklist.title}</CardTitle>
                  <Progress value={checklist.progress} className="h-2" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {checklist.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-2">
                        <Checkbox checked={item.completed} />
                        <span className={`text-sm flex-1 ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {item.task}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="monthly">
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">No Monthly Checklists</h3>
            <p className="text-muted-foreground mb-4">Create monthly maintenance and audit checklists</p>
            <Button>Create Monthly Checklist</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}