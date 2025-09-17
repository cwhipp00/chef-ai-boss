import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Video, 
  Search, 
  Download, 
  CheckCircle, 
  AlertCircle,
  Globe,
  Clock,
  Users
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface GenerationStats {
  totalCourses: number;
  successful: number;
  errors: number;
  currentCategory: string;
}

export const WebTrainingContentGenerator: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState<GenerationStats>({
    totalCourses: 0,
    successful: 0,
    errors: 0,
    currentCategory: ''
  });
  const [searchResults, setSearchResults] = useState<string>('');

  const categories = [
    {
      id: 'pos-training',
      name: 'POS System Training',
      description: 'Toast, Square, Clover, and other POS system tutorials',
      icon: <BookOpen className="w-5 h-5" />,
      estimatedCourses: 5
    },
    {
      id: 'food-safety',
      name: 'Food Safety & Compliance',
      description: 'ServSafe, HACCP, health department compliance',
      icon: <CheckCircle className="w-5 h-5" />,
      estimatedCourses: 5
    },
    {
      id: 'culinary-skills',
      name: 'Culinary Arts',
      description: 'Professional cooking techniques and skills',
      icon: <Video className="w-5 h-5" />,
      estimatedCourses: 5
    },
    {
      id: 'management',
      name: 'Restaurant Management',
      description: 'Leadership, operations, and team management',
      icon: <Users className="w-5 h-5" />,
      estimatedCourses: 5
    },
    {
      id: 'customer-service',
      name: 'Customer Service',
      description: 'Hospitality and service excellence training',
      icon: <Globe className="w-5 h-5" />,
      estimatedCourses: 5
    }
  ];

  const generateWebContent = async () => {
    setIsGenerating(true);
    setProgress(0);
    setStats({ totalCourses: 0, successful: 0, errors: 0, currentCategory: '' });
    
    try {
      let totalSuccessful = 0;
      let totalErrors = 0;
      
      for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        setStats(prev => ({ 
          ...prev, 
          currentCategory: category.name,
          totalCourses: prev.totalCourses + category.estimatedCourses
        }));
        
        try {
          const { data, error } = await supabase.functions.invoke('ai-web-training-content', {
            body: {
              category: category.id,
              action: 'generate_comprehensive_training'
            }
          });

          if (error) throw error;

          if (data?.success) {
            totalSuccessful += category.estimatedCourses;
            toast.success(`Generated ${category.name} courses`);
          }
        } catch (error) {
          console.error(`Error generating ${category.name}:`, error);
          totalErrors++;
          toast.error(`Failed to generate ${category.name} courses`);
        }

        setStats(prev => ({
          ...prev,
          successful: totalSuccessful,
          errors: totalErrors
        }));

        setProgress(((i + 1) / categories.length) * 100);
        
        // Add delay between categories
        if (i < categories.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
      }

      toast.success(`Content generation complete! Generated ${totalSuccessful} courses`);
      
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to generate training content');
    } finally {
      setIsGenerating(false);
    }
  };

  const searchVideoResources = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('ai-web-training-content', {
        body: {
          action: 'search_real_videos'
        }
      });

      if (error) throw error;

      if (data?.success) {
        setSearchResults(data.search_strategies);
        toast.success('Video search strategies generated');
      }
    } catch (error) {
      console.error('Video search error:', error);
      toast.error('Failed to generate video search strategies');
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-gradient-to-br from-background via-background to-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-6 h-6 text-primary" />
            Web-Sourced Training Content Generator
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Generate comprehensive training courses with real-world content sourced from industry standards and best practices.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <Card key={category.id} className="border-muted/50 hover:border-primary/30 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-primary">{category.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{category.name}</h3>
                      <p className="text-xs text-muted-foreground mb-2">{category.description}</p>
                      <Badge variant="secondary" className="text-xs">
                        {category.estimatedCourses} courses
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Progress Section */}
          {isGenerating && (
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Generating Content...</span>
                    <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    Current: {stats.currentCategory}
                  </div>
                  <div className="flex gap-4 text-xs">
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      {stats.successful} successful
                    </span>
                    <span className="flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-red-500" />
                      {stats.errors} errors
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              onClick={generateWebContent}
              disabled={isGenerating}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              {isGenerating ? 'Generating...' : 'Generate All Content'}
            </Button>
            
            <Button 
              variant="outline"
              onClick={searchVideoResources}
              disabled={isGenerating}
              className="flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Research Video Resources
            </Button>
          </div>

          {/* Video Search Results */}
          {searchResults && (
            <Card className="border-secondary/30">
              <CardHeader>
                <CardTitle className="text-lg">Video Search Strategies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 rounded-lg p-4 text-sm">
                  <pre className="whitespace-pre-wrap font-mono text-xs overflow-auto max-h-60">
                    {searchResults}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <Card className="p-4 border-muted/50">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Content Features
              </h4>
              <ul className="space-y-1 text-muted-foreground text-xs">
                <li>• Industry-standard training materials</li>
                <li>• Real-world scenarios and examples</li>
                <li>• Professional certification preparation</li>
                <li>• Interactive assessments and quizzes</li>
              </ul>
            </Card>
            
            <Card className="p-4 border-muted/50">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Video className="w-4 h-4 text-primary" />
                Multimedia Resources
              </h4>
              <ul className="space-y-1 text-muted-foreground text-xs">
                <li>• Professional training videos</li>
                <li>• Step-by-step tutorials</li>
                <li>• Industry expert instruction</li>
                <li>• Practical demonstration content</li>
              </ul>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};