import React, { useState, useCallback } from 'react';
import { FolderOpen, Plus, Calendar, Users, Clock, Target, Flag, MessageSquare, Paperclip, CheckCircle, Circle, AlertCircle, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ProjectTask {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee: string;
  dueDate: string;
  estimatedHours: number;
  actualHours?: number;
  tags: string[];
  attachments: string[];
  comments: number;
  dependencies: string[];
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'on-hold' | 'completed';
  startDate: string;
  endDate: string;
  progress: number;
  budget?: number;
  team: string[];
  tasks: ProjectTask[];
  color: string;
}

const sampleProjects: Project[] = [
  {
    id: '1',
    name: 'Summer Menu Launch',
    description: 'Complete overhaul of menu for summer season with new seasonal dishes',
    status: 'active',
    startDate: '2024-03-01',
    endDate: '2024-05-15',
    progress: 65,
    budget: 15000,
    team: ['chef-sarah', 'manager-mike', 'sous-chef-alex'],
    color: 'bg-blue-500',
    tasks: [
      {
        id: 't1',
        title: 'Recipe Development',
        description: 'Create and test 10 new seasonal recipes',
        status: 'in-progress',
        priority: 'high',
        assignee: 'chef-sarah',
        dueDate: '2024-03-25',
        estimatedHours: 40,
        actualHours: 28,
        tags: ['menu', 'recipes', 'testing'],
        attachments: ['recipe-drafts.pdf'],
        comments: 5,
        dependencies: []
      },
      {
        id: 't2',
        title: 'Cost Analysis',
        description: 'Calculate food costs and profit margins for new dishes',
        status: 'completed',
        priority: 'medium',
        assignee: 'manager-mike',
        dueDate: '2024-03-20',
        estimatedHours: 8,
        actualHours: 6,
        tags: ['finance', 'analysis'],
        attachments: ['cost-analysis.xlsx'],
        comments: 2,
        dependencies: ['t1']
      }
    ]
  },
  {
    id: '2',
    name: 'Kitchen Equipment Upgrade',
    description: 'Replace old equipment and optimize kitchen workflow',
    status: 'planning',
    startDate: '2024-04-01',
    endDate: '2024-06-30',
    progress: 15,
    budget: 50000,
    team: ['manager-mike', 'chef-sarah'],
    color: 'bg-green-500',
    tasks: [
      {
        id: 't3',
        title: 'Equipment Research',
        description: 'Research and compare commercial kitchen equipment options',
        status: 'todo',
        priority: 'medium',
        assignee: 'manager-mike',
        dueDate: '2024-04-15',
        estimatedHours: 20,
        tags: ['research', 'equipment'],
        attachments: [],
        comments: 0,
        dependencies: []
      }
    ]
  }
];

const teamMembers = [
  { id: 'chef-sarah', name: 'Sarah Johnson', role: 'Head Chef', avatar: 'SJ' },
  { id: 'manager-mike', name: 'Mike Rodriguez', role: 'Manager', avatar: 'MR' },
  { id: 'sous-chef-alex', name: 'Alex Chen', role: 'Sous Chef', avatar: 'AC' },
];

export const AdvancedProjectManagement = () => {
  const [projects, setProjects] = useState<Project[]>(sampleProjects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(projects[0]);
  const [activeTab, setActiveTab] = useState('overview');
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<ProjectTask['priority']>('medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  
  const { toast } = useToast();

  const createProject = useCallback(() => {
    if (!newProjectName.trim()) return;
    
    const newProject: Project = {
      id: Date.now().toString(),
      name: newProjectName,
      description: newProjectDescription,
      status: 'planning',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      progress: 0,
      team: [],
      tasks: [],
      color: 'bg-purple-500'
    };
    
    setProjects(prev => [...prev, newProject]);
    setSelectedProject(newProject);
    setIsCreateProjectOpen(false);
    
    setNewProjectName('');
    setNewProjectDescription('');
    
    toast({
      title: "Project Created",
      description: `"${newProjectName}" has been created successfully`,
    });
  }, [newProjectName, newProjectDescription, toast]);

  const createTask = useCallback(() => {
    if (!newTaskTitle.trim() || !selectedProject) return;
    
    const newTask: ProjectTask = {
      id: Date.now().toString(),
      title: newTaskTitle,
      description: newTaskDescription,
      status: 'todo',
      priority: newTaskPriority,
      assignee: newTaskAssignee,
      dueDate: newTaskDueDate,
      estimatedHours: 8,
      tags: [],
      attachments: [],
      comments: 0,
      dependencies: []
    };
    
    const updatedProject = {
      ...selectedProject,
      tasks: [...selectedProject.tasks, newTask]
    };
    
    setProjects(prev => prev.map(p => p.id === selectedProject.id ? updatedProject : p));
    setSelectedProject(updatedProject);
    setIsCreateTaskOpen(false);
    
    // Reset form
    setNewTaskTitle('');
    setNewTaskDescription('');
    setNewTaskAssignee('');
    setNewTaskPriority('medium');
    setNewTaskDueDate('');
    
    toast({
      title: "Task Created",
      description: `"${newTaskTitle}" has been added to the project`,
    });
  }, [newTaskTitle, newTaskDescription, newTaskAssignee, newTaskPriority, newTaskDueDate, selectedProject, toast]);

  const updateTaskStatus = useCallback((taskId: string, status: ProjectTask['status']) => {
    if (!selectedProject) return;
    
    const updatedProject = {
      ...selectedProject,
      tasks: selectedProject.tasks.map(task => 
        task.id === taskId ? { ...task, status } : task
      )
    };
    
    setProjects(prev => prev.map(p => p.id === selectedProject.id ? updatedProject : p));
    setSelectedProject(updatedProject);
    
    toast({
      title: "Task Updated",
      description: `Task status changed to ${status}`,
    });
  }, [selectedProject, toast]);

  const getStatusIcon = (status: ProjectTask['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-warning" />;
      case 'review': return <AlertCircle className="h-4 w-4 text-info" />;
      default: return <Circle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getPriorityColor = (priority: ProjectTask['priority']) => {
    switch (priority) {
      case 'urgent': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'high': return 'bg-warning/10 text-warning border-warning/20';
      case 'medium': return 'bg-primary/10 text-primary border-primary/20';
      case 'low': return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const getProjectStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'active': return 'bg-success/10 text-success';
      case 'completed': return 'bg-blue/10 text-blue';
      case 'on-hold': return 'bg-warning/10 text-warning';
      default: return 'bg-muted/10 text-muted-foreground';
    }
  };

  const getTeamMember = (id: string) => teamMembers.find(m => m.id === id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Project Management</h2>
          <p className="text-muted-foreground">Manage projects, tasks, and team collaboration</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCreateTaskOpen} onOpenChange={setIsCreateTaskOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" disabled={!selectedProject}>
                <Plus className="h-4 w-4 mr-2" />
                New Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="task-title">Task Title</Label>
                  <Input
                    id="task-title"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Enter task title"
                  />
                </div>
                <div>
                  <Label htmlFor="task-description">Description</Label>
                  <Textarea
                    id="task-description"
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    placeholder="Describe the task"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Assignee</Label>
                    <Select value={newTaskAssignee} onValueChange={setNewTaskAssignee}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select assignee" />
                      </SelectTrigger>
                      <SelectContent>
                        {teamMembers.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Priority</Label>
                    <Select value={newTaskPriority} onValueChange={(value: ProjectTask['priority']) => setNewTaskPriority(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="task-due-date">Due Date</Label>
                  <Input
                    id="task-due-date"
                    type="date"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIsCreateTaskOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={createTask} disabled={!newTaskTitle.trim()}>
                    Create Task
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isCreateProjectOpen} onOpenChange={setIsCreateProjectOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary">
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="project-name">Project Name</Label>
                  <Input
                    id="project-name"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="Enter project name"
                  />
                </div>
                <div>
                  <Label htmlFor="project-description">Description</Label>
                  <Textarea
                    id="project-description"
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                    placeholder="Describe the project"
                    rows={3}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIsCreateProjectOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={createProject} disabled={!newProjectName.trim()}>
                    Create Project
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Project Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5" />
                Projects
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className={`p-3 rounded-lg cursor-pointer transition-all hover:bg-muted/50 ${
                    selectedProject?.id === project.id ? 'bg-primary/10 border-primary/20 border' : 'border border-transparent'
                  }`}
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${project.color}`} />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{project.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getProjectStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{project.progress}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {selectedProject ? (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="team">Team</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Project Header */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${selectedProject.color}`} />
                        <CardTitle>{selectedProject.name}</CardTitle>
                        <Badge className={getProjectStatusColor(selectedProject.status)}>
                          {selectedProject.status}
                        </Badge>
                      </div>
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{selectedProject.description}</p>
                    
                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <Label className="text-xs text-muted-foreground">Progress</Label>
                        <div className="mt-1">
                          <Progress value={selectedProject.progress} className="h-2" />
                          <span className="text-sm font-medium">{selectedProject.progress}%</span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Timeline</Label>
                        <p className="text-sm font-medium">
                          {new Date(selectedProject.startDate).toLocaleDateString()} - {new Date(selectedProject.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Budget</Label>
                        <p className="text-sm font-medium">
                          {selectedProject.budget ? `$${selectedProject.budget.toLocaleString()}` : 'Not set'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Task Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Task Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-4">
                      {['todo', 'in-progress', 'review', 'completed'].map((status) => {
                        const count = selectedProject.tasks.filter(t => t.status === status).length;
                        return (
                          <div key={status} className="text-center">
                            <div className="text-2xl font-bold text-foreground">{count}</div>
                            <div className="text-xs text-muted-foreground capitalize">{status.replace('-', ' ')}</div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tasks" className="space-y-4">
                {selectedProject.tasks.map((task) => {
                  const assignee = getTeamMember(task.assignee);
                  return (
                    <Card key={task.id} className="hover:shadow-medium transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div
                              className="mt-1 cursor-pointer"
                              onClick={() => {
                                const nextStatus = task.status === 'todo' ? 'in-progress' :
                                                 task.status === 'in-progress' ? 'review' :
                                                 task.status === 'review' ? 'completed' : 'todo';
                                updateTaskStatus(task.id, nextStatus);
                              }}
                            >
                              {getStatusIcon(task.status)}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-foreground">{task.title}</h4>
                              <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                              
                              <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                                {assignee && (
                                  <div className="flex items-center gap-2">
                                    <Avatar className="w-4 h-4">
                                      <AvatarFallback className="text-xs">{assignee.avatar}</AvatarFallback>
                                    </Avatar>
                                    <span>{assignee.name}</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{task.estimatedHours}h estimated</span>
                                </div>
                                {task.comments > 0 && (
                                  <div className="flex items-center gap-1">
                                    <MessageSquare className="h-3 w-3" />
                                    <span>{task.comments} comments</span>
                                  </div>
                                )}
                                {task.attachments.length > 0 && (
                                  <div className="flex items-center gap-1">
                                    <Paperclip className="h-3 w-3" />
                                    <span>{task.attachments.length} files</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getPriorityColor(task.priority)}>
                              {task.priority}
                            </Badge>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </TabsContent>

              <TabsContent value="team" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Team Members</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {teamMembers.filter(member => selectedProject.team.includes(member.id)).map((member) => (
                        <div key={member.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>{member.avatar}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium">{member.name}</h4>
                              <p className="text-sm text-muted-foreground">{member.role}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              {selectedProject.tasks.filter(t => t.assignee === member.id).length} tasks
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {selectedProject.tasks.filter(t => t.assignee === member.id && t.status === 'completed').length} completed
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="timeline" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedProject.tasks
                        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                        .map((task, index) => {
                          const assignee = getTeamMember(task.assignee);
                          return (
                            <div key={task.id} className="flex items-center gap-4">
                              <div className="flex flex-col items-center">
                                <div className="w-3 h-3 rounded-full bg-primary" />
                                {index < selectedProject.tasks.length - 1 && (
                                  <div className="w-px h-12 bg-border mt-2" />
                                )}
                              </div>
                              <div className="flex-1 pb-8">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium">{task.title}</h4>
                                  <div className="flex items-center gap-2">
                                    {assignee && (
                                      <Avatar className="w-6 h-6">
                                        <AvatarFallback className="text-xs">{assignee.avatar}</AvatarFallback>
                                      </Avatar>
                                    )}
                                    <span className="text-sm text-muted-foreground">
                                      {new Date(task.dueDate).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <FolderOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Project Selected</h3>
                <p className="text-muted-foreground mb-4">Select a project from the sidebar or create a new one</p>
                <Button onClick={() => setIsCreateProjectOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Project
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};