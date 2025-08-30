import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Play, Book, Trophy, Clock, Users, ExternalLink, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Training() {
  const { toast } = useToast();
  const [selectedPOS, setSelectedPOS] = useState("toast");
  const [quizProgress, setQuizProgress] = useState<{[key: string]: number}>({});
  const [completedTrainings, setCompletedTrainings] = useState<string[]>([]);

  const posProviders = [
    { value: "toast", label: "Toast POS" },
    { value: "square", label: "Square" },
    { value: "clover", label: "Clover" },
    { value: "lightspeed", label: "Lightspeed" },
    { value: "revel", label: "Revel Systems" },
    { value: "touchbistro", label: "TouchBistro" }
  ];

  const generalTrainingPoints = [
    {
      id: "customer-service",
      title: "Customer Service Excellence",
      description: "Master the art of creating memorable guest experiences through active listening, problem-solving, and genuine hospitality.",
      duration: "45 minutes",
      topics: ["Active listening techniques", "Handling complaints gracefully", "Upselling strategies", "Creating personal connections"],
      completed: false
    },
    {
      id: "food-safety",
      title: "Food Safety & Sanitation",
      description: "Essential food handling practices, temperature control, and sanitation protocols to ensure guest safety.",
      duration: "60 minutes",
      topics: ["Temperature control", "Cross-contamination prevention", "Hand hygiene", "Cleaning protocols"],
      completed: false
    },
    {
      id: "menu-knowledge",
      title: "Menu Knowledge & Allergens",
      description: "Comprehensive understanding of menu items, ingredients, preparation methods, and allergen awareness.",
      duration: "90 minutes",
      topics: ["Ingredient knowledge", "Preparation methods", "Common allergens", "Dietary restrictions"],
      completed: false
    },
    {
      id: "wine-beverage",
      title: "Wine & Beverage Service",
      description: "Professional beverage service techniques, wine pairing basics, and proper glassware handling.",
      duration: "75 minutes",
      topics: ["Wine service protocol", "Beer knowledge", "Cocktail basics", "Glassware selection"],
      completed: false
    },
    {
      id: "pos-basics",
      title: "POS System Fundamentals",
      description: "Master your point-of-sale system operations, order entry, payment processing, and troubleshooting.",
      duration: "120 minutes",
      topics: ["Order entry", "Payment processing", "Table management", "System troubleshooting"],
      completed: false
    },
    {
      id: "teamwork",
      title: "Teamwork & Communication",
      description: "Effective communication strategies, conflict resolution, and collaborative service delivery.",
      duration: "50 minutes",
      topics: ["Clear communication", "Team coordination", "Conflict resolution", "Shift handovers"],
      completed: false
    },
    {
      id: "sales-techniques",
      title: "Sales Techniques & Upselling",
      description: "Ethical sales approaches, suggestive selling, and techniques to increase average check size.",
      duration: "40 minutes",
      topics: ["Suggestive selling", "Reading customer cues", "Product knowledge", "Closing techniques"],
      completed: false
    },
    {
      id: "time-management",
      title: "Time Management & Efficiency",
      description: "Optimize service flow, prioritize tasks, and manage multiple tables effectively during peak hours.",
      duration: "35 minutes",
      topics: ["Task prioritization", "Multi-table management", "Rush hour strategies", "Workflow optimization"],
      completed: false
    },
    {
      id: "crisis-management",
      title: "Crisis Management & Emergency Procedures",
      description: "Handle emergencies, difficult situations, and maintain composure under pressure.",
      duration: "30 minutes",
      topics: ["Emergency protocols", "Difficult customer situations", "Medical emergencies", "Security procedures"],
      completed: false
    },
    {
      id: "hospitality-standards",
      title: "Hospitality Standards & Etiquette",
      description: "Professional service standards, proper etiquette, and creating an exceptional dining atmosphere.",
      duration: "55 minutes",
      topics: ["Service standards", "Professional appearance", "Greeting protocols", "Table etiquette"],
      completed: false
    }
  ];

  const toastTrainingMaterials = [
    {
      id: "toast-basic-operations",
      title: "Toast POS Basic Operations",
      description: "Learn the fundamentals of navigating the Toast POS system",
      videoUrl: "https://share.vidyard.com/watch/C7ai3JLFdwM6YiuRy76bH7",
      duration: "11 minutes",
      level: "Beginner"
    },
    {
      id: "order-entry",
      title: "Order Entry & Modifications",
      description: "Master taking orders, making modifications, and special requests",
      duration: "15 minutes",
      level: "Beginner"
    },
    {
      id: "table-management",
      title: "Table Management & Seating",
      description: "Efficiently manage tables, transfers, and seating arrangements",
      duration: "12 minutes",
      level: "Intermediate"
    },
    {
      id: "payment-processing",
      title: "Payment Processing & Splitting Bills",
      description: "Handle various payment methods and split check scenarios",
      duration: "18 minutes",
      level: "Beginner"
    },
    {
      id: "menu-modifications",
      title: "Menu Item Modifications",
      description: "Add modifiers, special instructions, and customizations",
      duration: "10 minutes",
      level: "Beginner"
    },
    {
      id: "discounts-comps",
      title: "Applying Discounts & Comps",
      description: "Learn when and how to apply discounts and complimentary items",
      duration: "8 minutes",
      level: "Intermediate"
    },
    {
      id: "gift-cards",
      title: "Gift Card Sales & Redemption",
      description: "Process gift card transactions and handle redemptions",
      duration: "6 minutes",
      level: "Beginner"
    },
    {
      id: "loyalty-programs",
      title: "Loyalty Program Management",
      description: "Enroll customers and apply loyalty rewards",
      duration: "9 minutes",
      level: "Intermediate"
    },
    {
      id: "takeout-orders",
      title: "Takeout & Delivery Orders",
      description: "Process off-premise orders and coordinate with delivery services",
      duration: "14 minutes",
      level: "Intermediate"
    },
    {
      id: "kitchen-communication",
      title: "Kitchen Communication Features",
      description: "Use kitchen display integration and order timing features",
      duration: "7 minutes",
      level: "Advanced"
    },
    {
      id: "reporting-basics",
      title: "Basic Reporting & End-of-Day",
      description: "Generate reports and complete end-of-day procedures",
      duration: "16 minutes",
      level: "Advanced"
    },
    {
      id: "cash-management",
      title: "Cash Drawer & Till Management",
      description: "Handle cash operations, drawer counts, and reconciliation",
      duration: "13 minutes",
      level: "Intermediate"
    },
    {
      id: "customer-profiles",
      title: "Customer Profile Management",
      description: "Create and manage customer profiles and preferences",
      duration: "5 minutes",
      level: "Beginner"
    },
    {
      id: "inventory-tracking",
      title: "Basic Inventory Tracking",
      description: "Understand how POS integrates with inventory management",
      duration: "11 minutes",
      level: "Advanced"
    },
    {
      id: "staff-functions",
      title: "Staff Functions & Permissions",
      description: "Understand user roles and permission levels",
      duration: "8 minutes",
      level: "Advanced"
    },
    {
      id: "troubleshooting",
      title: "Common Troubleshooting",
      description: "Resolve common POS issues and when to escalate",
      duration: "20 minutes",
      level: "Intermediate"
    },
    {
      id: "mobile-app",
      title: "Toast Go Mobile App",
      description: "Use the mobile app for tableside ordering and payments",
      duration: "12 minutes",
      level: "Intermediate"
    },
    {
      id: "reservations",
      title: "Reservation Management",
      description: "Handle reservations and waitlist management",
      duration: "9 minutes",
      level: "Intermediate"
    },
    {
      id: "online-ordering",
      title: "Online Ordering Integration",
      description: "Manage online orders and coordinate with kitchen",
      duration: "10 minutes",
      level: "Advanced"
    },
    {
      id: "analytics-insights",
      title: "Using Analytics & Insights",
      description: "Interpret basic sales data and performance metrics",
      duration: "15 minutes",
      level: "Advanced"
    }
  ];

  const quizQuestions = {
    "customer-service": [
      {
        question: "What is the most important aspect of customer service?",
        options: ["Speed", "Active listening", "Memorizing the menu", "Taking orders quickly"],
        correct: 1
      },
      {
        question: "When handling a complaint, you should:",
        options: ["Argue with the customer", "Listen actively and empathize", "Ignore the complaint", "Pass it to management immediately"],
        correct: 1
      }
    ],
    "food-safety": [
      {
        question: "What is the safe internal temperature for chicken?",
        options: ["145°F", "155°F", "165°F", "175°F"],
        correct: 2
      },
      {
        question: "How often should you wash your hands?",
        options: ["Once per shift", "Before handling food", "Only when visibly dirty", "Every 2 hours"],
        correct: 1
      }
    ]
  };

  const handleStartTraining = (trainingId: string) => {
    setCompletedTrainings([...completedTrainings, trainingId]);
    toast({
      title: "Training Started",
      description: "Training module has been marked as completed.",
    });
  };

  const handleQuizStart = (moduleId: string) => {
    setQuizProgress({ ...quizProgress, [moduleId]: 50 });
    toast({
      title: "Quiz Started",
      description: "Quiz progress will be tracked for management review.",
    });
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Training Center</h2>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Trophy className="h-3 w-3" />
            {completedTrainings.length} Completed
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General Training</TabsTrigger>
          <TabsTrigger value="pos">POS Training</TabsTrigger>
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5" />
                Restaurant Operations Training
              </CardTitle>
              <CardDescription>
                Essential training modules for all restaurant staff covering core competencies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {generalTrainingPoints.map((training) => (
                  <Card key={training.id} className="relative">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{training.title}</CardTitle>
                        {completedTrainings.includes(training.id) && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                      <CardDescription>{training.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {training.duration}
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Key Topics:</p>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            {training.topics.map((topic, index) => (
                              <li key={index}>• {topic}</li>
                            ))}
                          </ul>
                        </div>
                        <Button
                          size="sm"
                          className="w-full mt-2"
                          onClick={() => handleStartTraining(training.id)}
                          disabled={completedTrainings.includes(training.id)}
                        >
                          {completedTrainings.includes(training.id) ? "Completed" : "Start Training"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                POS System Training
              </CardTitle>
              <CardDescription>
                Comprehensive training materials for your point-of-sale system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <label className="text-sm font-medium">Select Your POS Provider:</label>
                <Select value={selectedPOS} onValueChange={setSelectedPOS}>
                  <SelectTrigger className="w-full max-w-xs mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {posProviders.map((provider) => (
                      <SelectItem key={provider.value} value={provider.value}>
                        {provider.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedPOS === "toast" && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {toastTrainingMaterials.map((material) => (
                    <Card key={material.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{material.title}</CardTitle>
                        <CardDescription>{material.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {material.duration}
                            </span>
                            <Badge variant={material.level === "Beginner" ? "default" : material.level === "Intermediate" ? "secondary" : "destructive"}>
                              {material.level}
                            </Badge>
                          </div>
                          <Button
                            size="sm"
                            className="w-full"
                            onClick={() => {
                              if (material.videoUrl) {
                                window.open(material.videoUrl, '_blank');
                              }
                              handleStartTraining(material.id);
                            }}
                          >
                            <Play className="h-4 w-4 mr-1" />
                            {material.videoUrl ? "Watch Video" : "Start Training"}
                            {material.videoUrl && <ExternalLink className="h-3 w-3 ml-1" />}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {selectedPOS !== "toast" && (
                <Card className="p-6 text-center">
                  <h3 className="text-lg font-semibold mb-2">Training Materials Coming Soon</h3>
                  <p className="text-muted-foreground mb-4">
                    We're working on comprehensive training materials for {posProviders.find(p => p.value === selectedPOS)?.label}.
                    In the meantime, check out our general restaurant training modules.
                  </p>
                  <Button variant="outline" onClick={() => setSelectedPOS("toast")}>
                    View Toast POS Training
                  </Button>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quizzes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Knowledge Assessment
              </CardTitle>
              <CardDescription>
                Test your knowledge with interactive quizzes. Results are tracked for management review.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(quizQuestions).map(([moduleId, questions]) => (
                  <Card key={moduleId}>
                    <CardHeader>
                      <CardTitle className="capitalize">{moduleId.replace('-', ' ')} Quiz</CardTitle>
                      <CardDescription>{questions.length} questions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {quizProgress[moduleId] && (
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{quizProgress[moduleId]}%</span>
                          </div>
                          <Progress value={quizProgress[moduleId]} />
                        </div>
                      )}
                      <Button
                        className="w-full"
                        onClick={() => handleQuizStart(moduleId)}
                        disabled={!!quizProgress[moduleId]}
                      >
                        {quizProgress[moduleId] ? "Quiz In Progress" : "Start Quiz"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="mt-6 p-4 border rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> Quiz results and employee progress tracking requires database integration. 
                  Connect to Supabase to enable full quiz management and reporting features.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Training Progress Overview
              </CardTitle>
              <CardDescription>
                Track training completion and quiz results across all staff members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <Card className="p-4">
                    <div className="text-2xl font-bold">{completedTrainings.length}</div>
                    <p className="text-xs text-muted-foreground">Modules Completed</p>
                  </Card>
                  <Card className="p-4">
                    <div className="text-2xl font-bold">{Object.keys(quizProgress).length}</div>
                    <p className="text-xs text-muted-foreground">Quizzes Started</p>
                  </Card>
                  <Card className="p-4">
                    <div className="text-2xl font-bold">
                      {Math.round((completedTrainings.length / generalTrainingPoints.length) * 100)}%
                    </div>
                    <p className="text-xs text-muted-foreground">Overall Progress</p>
                  </Card>
                </div>

                <div className="border rounded-lg p-6 bg-muted/50">
                  <h3 className="font-semibold mb-2">Manager Tools - Quiz Results & Employee Tracking</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    To access comprehensive employee quiz results, training progress tracking, and management reporting tools, 
                    you'll need to connect your project to Supabase for secure data storage and user management.
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-medium">Available with Supabase Integration:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                      <li>• Individual employee quiz scores and completion rates</li>
                      <li>• Department-wide training progress analytics</li>
                      <li>• Automated compliance tracking and reporting</li>
                      <li>• Custom training schedules and assignments</li>
                      <li>• Performance improvement identification</li>
                      <li>• Certification management and renewals</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}