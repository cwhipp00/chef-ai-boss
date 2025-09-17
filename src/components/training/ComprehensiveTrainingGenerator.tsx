import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Play, 
  BookOpen, 
  Award, 
  Video, 
  FileText, 
  CheckCircle,
  AlertCircle,
  Loader2,
  Brain,
  Users,
  ChefHat,
  Shield,
  Monitor,
  Star
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface GenerationResult {
  course: any;
  lessons_count: number;
  status: 'success' | 'error';
  error?: string;
}

interface GenerationStats {
  totalCourses: number;
  successfulCourses: number;
  errors: number;
  categoriesProcessed: string[];
}

export function ComprehensiveTrainingGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState('');
  const [results, setResults] = useState<GenerationResult[]>([]);
  const [stats, setStats] = useState<GenerationStats | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { toast } = useToast();

  const trainingCategories = [
    {
      id: 'pos-systems',
      name: 'POS System Training',
      icon: Monitor,
      description: 'Complete training for Toast, Square, Clover, and other POS systems',
      estimatedCourses: 8,
      color: 'bg-blue-500'
    },
    {
      id: 'food-safety',
      name: 'Food Safety & Compliance',
      icon: Shield,
      description: 'ServSafe, HACCP, and health department compliance training',
      estimatedCourses: 8,
      color: 'bg-green-500'
    },
    {
      id: 'culinary-skills',
      name: 'Culinary Skills Development',
      icon: ChefHat,
      description: 'Professional cooking techniques, knife skills, and culinary arts',
      estimatedCourses: 8,
      color: 'bg-orange-500'
    },
    {
      id: 'management',
      name: 'Restaurant Management',
      icon: Users,
      description: 'Leadership, operations, cost control, and team management',
      estimatedCourses: 8,
      color: 'bg-purple-500'
    },
    {
      id: 'customer-service',
      name: 'Customer Service Excellence',
      icon: Star,
      description: 'Guest relations, communication, and service recovery',
      estimatedCourses: 8,
      color: 'bg-pink-500'
    }
  ];

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const generateComprehensiveContent = async () => {
    if (selectedCategories.length === 0) {
      toast({
        title: "Selection Required",
        description: "Please select at least one training category to generate content for.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setResults([]);
    setStats(null);
    setCurrentTask('Initializing comprehensive training content generation...');

    try {
      const { data, error } = await supabase.functions.invoke('ai-comprehensive-training-generator', {
        body: {
          action: 'generate_comprehensive_training',
          selectedCategories: selectedCategories,
          includeVideos: true,
          includeAssessments: true,
          includeCertifications: true
        }
      });

      if (error) throw error;

      setResults(data.results || []);
      setStats({
        totalCourses: data.results?.length || 0,
        successfulCourses: data.results?.filter((r: GenerationResult) => r.status === 'success').length || 0,
        errors: data.results?.filter((r: GenerationResult) => r.status === 'error').length || 0,
        categoriesProcessed: data.categories_processed || []
      });

      setProgress(100);
      setCurrentTask('Generation complete!');

      toast({
        title: "Training Content Generated!",
        description: `Successfully created ${data.results?.filter((r: GenerationResult) => r.status === 'success').length || 0} comprehensive training courses with real industry content.`,
      });

    } catch (error) {
      console.error('Error generating training content:', error);
      toast({
        title: "Generation Error",
        description: "Failed to generate training content. Please try again.",
        variant: "destructive",
      });
      setCurrentTask('Generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateVideoContent = async () => {
    setIsGenerating(true);
    setCurrentTask('Researching real training video content...');

    try {
      const { data, error } = await supabase.functions.invoke('ai-comprehensive-training-generator', {
        body: {
          action: 'generate_video_content'
        }
      });

      if (error) throw error;

      toast({
        title: "Video Research Complete",
        description: "Found comprehensive video training resources from industry experts.",
      });

      setCurrentTask('Video content research completed');
    } catch (error) {
      console.error('Error researching video content:', error);
      toast({
        title: "Research Error",
        description: "Failed to research video content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Selection */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Select Training Categories</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trainingCategories.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategories.includes(category.id);
            
            return (
              <Card 
                key={category.id}
                className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                  isSelected ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'
                }`}
                onClick={() => toggleCategory(category.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${category.color} text-white`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm">{category.name}</h4>
                        {isSelected && <CheckCircle className="h-4 w-4 text-primary" />}
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {category.description}
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        ~{category.estimatedCourses} courses
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Generation Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={generateComprehensiveContent}
          disabled={isGenerating || selectedCategories.length === 0}
          className="flex-1"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating Content...
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Generate Comprehensive Training Content
            </>
          )}
        </Button>

        <Button
          variant="outline"
          onClick={generateVideoContent}
          disabled={isGenerating}
        >
          <Video className="h-4 w-4 mr-2" />
          Research Video Content
        </Button>
      </div>

      {/* Progress Display */}
      {isGenerating && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm font-medium">Generating Training Content</span>
              </div>
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground">{currentTask}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generation Stats */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Generation Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats.successfulCourses}</div>
                <div className="text-sm text-muted-foreground">Courses Created</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.totalCourses}</div>
                <div className="text-sm text-muted-foreground">Total Attempted</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">{stats.errors}</div>
                <div className="text-sm text-muted-foreground">Errors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.categoriesProcessed.length}</div>
                <div className="text-sm text-muted-foreground">Categories</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Categories Processed:</h4>
              <div className="flex flex-wrap gap-2">
                {stats.categoriesProcessed.map((category) => (
                  <Badge key={category} variant="secondary">
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Display */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Generated Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {results.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {result.status === 'success' ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                    <div>
                      <div className="font-medium text-sm">
                        {result.course?.title || 'Course Generation'}
                      </div>
                      {result.status === 'success' && (
                        <div className="text-xs text-muted-foreground">
                          {result.lessons_count} lessons created
                        </div>
                      )}
                      {result.error && (
                        <div className="text-xs text-red-500">{result.error}</div>
                      )}
                    </div>
                  </div>
                  <Badge 
                    variant={result.status === 'success' ? 'default' : 'destructive'}
                  >
                    {result.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Features Overview */}
      <Card>
        <CardHeader>
          <CardTitle>What This Generator Creates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <Video className="h-5 w-5 text-blue-500 mt-1" />
              <div>
                <h4 className="font-medium text-sm">Real Video Content</h4>
                <p className="text-xs text-muted-foreground">
                  Curated YouTube videos from industry experts and training providers
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <FileText className="h-5 w-5 text-green-500 mt-1" />
              <div>
                <h4 className="font-medium text-sm">Structured Lessons</h4>
                <p className="text-xs text-muted-foreground">
                  8-12 detailed lessons per course with practical exercises
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <Award className="h-5 w-5 text-purple-500 mt-1" />
              <div>
                <h4 className="font-medium text-sm">Certifications</h4>
                <p className="text-xs text-muted-foreground">
                  Industry-standard assessments and completion certificates
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}