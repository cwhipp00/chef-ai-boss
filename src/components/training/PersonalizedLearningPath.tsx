import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Clock, 
  Award,
  ArrowRight,
  CheckCircle,
  Star,
  Users,
  BookOpen,
  Zap,
  Calendar,
  Trophy,
  Lightbulb,
  RefreshCw
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface LearningPath {
  personalizedMessage: string;
  skillGaps: string[];
  immediatePath: CourseRecommendation[];
  shortTermGoals: CourseRecommendation[];
  longTermGoals: CourseRecommendation[];
  careerProgression: {
    currentLevel: string;
    nextLevel: string;
    requiredSkills: string[];
    timeframe: string;
  };
}

interface CourseRecommendation {
  courseTitle: string;
  priority: 'high' | 'medium' | 'low';
  reason: string;
  estimatedDuration: string;
  skillsGained: string[];
}

interface PersonalizedLearningPathProps {
  userEnrollments: any[];
  completedCourses: any[];
  userProfile?: any;
}

const PersonalizedLearningPath: React.FC<PersonalizedLearningPathProps> = ({
  userEnrollments,
  completedCourses,
  userProfile
}) => {
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'immediate' | 'shortterm' | 'longterm'>('overview');
  const { user } = useAuth();

  useEffect(() => {
    if (user && !learningPath) {
      generateLearningPath();
    }
  }, [user]);

  const generateLearningPath = async () => {
    setIsLoading(true);
    try {
      const performanceData = {
        averageScore: completedCourses.length > 0 
          ? completedCourses.reduce((acc, course) => acc + (course.final_score || 80), 0) / completedCourses.length
          : null,
        completionRate: userEnrollments.length > 0 
          ? (completedCourses.length / userEnrollments.length) * 100
          : 0
      };

      const { data, error } = await supabase.functions.invoke('ai-learning-path', {
        body: {
          userProfile: {
            experience: userProfile?.experience_level || 'beginner',
            role: userProfile?.role || 'staff',
            interests: userProfile?.interests || ['general restaurant operations'],
            ...userProfile
          },
          completedCourses: completedCourses.map(course => ({
            id: course.id,
            title: course.title,
            category: course.category,
            difficulty: course.difficulty_level,
            score: course.final_score
          })),
          performanceData,
          goals: userProfile?.learning_goals || 'improve overall restaurant skills'
        }
      });

      if (error) throw error;
      setLearningPath(data);
    } catch (error) {
      console.error('Error generating learning path:', error);
      toast.error('Failed to generate personalized learning path');
      
      // Fallback learning path
      setLearningPath({
        personalizedMessage: "Welcome to your personalized learning journey! We've created a custom path based on your current progress.",
        skillGaps: ["Food Safety", "POS Systems", "Customer Service"],
        immediatePath: [
          {
            courseTitle: "Food Safety Fundamentals",
            priority: "high",
            reason: "Essential foundation for restaurant operations",
            estimatedDuration: "3 hours",
            skillsGained: ["HACCP Knowledge", "Temperature Control", "Sanitation"]
          }
        ],
        shortTermGoals: [],
        longTermGoals: [],
        careerProgression: {
          currentLevel: "Team Member",
          nextLevel: "Shift Leader",
          requiredSkills: ["Leadership", "Food Safety Certification"],
          timeframe: "6 months"
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'low': return 'bg-green-500/10 text-green-600 border-green-500/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const CourseRecommendationCard: React.FC<{ course: CourseRecommendation; index: number }> = ({ course, index }) => (
    <Card className="hover-lift">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
              {index + 1}
            </div>
            <Badge className={getPriorityColor(course.priority)}>
              {course.priority} priority
            </Badge>
          </div>
          <Clock className="w-5 h-5 text-muted-foreground" />
        </div>
        
        <h3 className="text-lg font-semibold mb-2">{course.courseTitle}</h3>
        <p className="text-muted-foreground text-sm mb-4">{course.reason}</p>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-primary" />
            <span>{course.estimatedDuration}</span>
          </div>
          
          <div>
            <div className="text-sm font-medium mb-2">Skills you'll gain:</div>
            <div className="flex flex-wrap gap-1">
              {course.skillsGained.map((skill, skillIndex) => (
                <Badge key={skillIndex} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        
        <Button className="w-full mt-4" variant="outline">
          <BookOpen className="w-4 h-4 mr-2" />
          Start Learning
        </Button>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-12 text-center">
          <RefreshCw className="w-12 h-12 mx-auto mb-4 animate-spin text-primary" />
          <h3 className="text-lg font-semibold mb-2">Creating Your Learning Path</h3>
          <p className="text-muted-foreground">
            Our AI is analyzing your progress and creating a personalized learning journey...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!learningPath) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-12 text-center">
          <Brain className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h3 className="text-lg font-semibold mb-2">Personalized Learning Path</h3>
          <p className="text-muted-foreground mb-4">
            Get AI-powered course recommendations tailored to your goals and experience.
          </p>
          <Button onClick={generateLearningPath} className="bg-gradient-primary">
            Generate My Learning Path
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gradient-primary text-white">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Your Personalized Learning Path</h1>
              <p className="opacity-90">AI-powered recommendations just for you</p>
            </div>
          </div>
          
          <p className="text-white/90 leading-relaxed">
            {learningPath.personalizedMessage}
          </p>
        </CardContent>
      </Card>

      {/* Stats & Career Progression */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-8 h-8 text-primary" />
              <div>
                <h3 className="font-semibold">Current Level</h3>
                <p className="text-sm text-muted-foreground">{learningPath.careerProgression.currentLevel}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress to next level</span>
                <span>65%</span>
              </div>
              <Progress value={65} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-8 h-8 text-green-500" />
              <div>
                <h3 className="font-semibold">Next Level</h3>
                <p className="text-sm text-muted-foreground">{learningPath.careerProgression.nextLevel}</p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 inline mr-1" />
              Est. {learningPath.careerProgression.timeframe}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-8 h-8 text-yellow-500" />
              <div>
                <h3 className="font-semibold">Skill Gaps</h3>
                <p className="text-sm text-muted-foreground">{learningPath.skillGaps.length} areas to improve</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1">
              {learningPath.skillGaps.slice(0, 3).map((skill, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4 overflow-x-auto">
            <Button
              variant={activeTab === 'overview' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('overview')}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <Trophy className="w-4 h-4" />
              Overview
            </Button>
            <Button
              variant={activeTab === 'immediate' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('immediate')}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <Zap className="w-4 h-4" />
              Start Now ({learningPath.immediatePath.length})
            </Button>
            <Button
              variant={activeTab === 'shortterm' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('shortterm')}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <Target className="w-4 h-4" />
              Next 3-6 Months ({learningPath.shortTermGoals.length})
            </Button>
            <Button
              variant={activeTab === 'longterm' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('longterm')}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <Star className="w-4 h-4" />
              Long-term Goals ({learningPath.longTermGoals.length})
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Skills Required for Next Level */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Skills Needed for {learningPath.careerProgression.nextLevel}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {learningPath.careerProgression.requiredSkills.map((skill, index) => (
                    <div key={index} className="p-3 rounded-lg border text-center">
                      <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-500" />
                      <div className="text-sm font-medium">{skill}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Learning Journey Overview */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Your Learning Journey
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-primary/5 border-l-4 border-primary">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                      1
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">Immediate Action</div>
                      <div className="text-sm text-muted-foreground">
                        {learningPath.immediatePath.length} high-priority courses to start now
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/10 border-l-4 border-yellow-500">
                    <div className="w-8 h-8 rounded-full bg-yellow-500 text-white flex items-center justify-center font-bold text-sm">
                      2
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">Short-term Goals</div>
                      <div className="text-sm text-muted-foreground">
                        {learningPath.shortTermGoals.length} courses for the next 3-6 months
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-green-50 dark:bg-green-900/10 border-l-4 border-green-500">
                    <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-sm">
                      3
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">Long-term Mastery</div>
                      <div className="text-sm text-muted-foreground">
                        {learningPath.longTermGoals.length} advanced courses for career growth
                      </div>
                    </div>
                    <Trophy className="w-5 h-5 text-green-500" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'immediate' && (
            <div className="space-y-6">
              <div className="text-center">
                <Zap className="w-12 h-12 mx-auto mb-3 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Start Your Journey Now</h3>
                <p className="text-muted-foreground">
                  These high-priority courses will give you immediate impact and build essential foundations.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {learningPath.immediatePath.map((course, index) => (
                  <CourseRecommendationCard key={index} course={course} index={index} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'shortterm' && (
            <div className="space-y-6">
              <div className="text-center">
                <Target className="w-12 h-12 mx-auto mb-3 text-primary" />
                <h3 className="text-xl font-semibold mb-2">3-6 Month Goals</h3>
                <p className="text-muted-foreground">
                  Build on your foundation with these intermediate courses designed to advance your skills.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {learningPath.shortTermGoals.map((course, index) => (
                  <CourseRecommendationCard key={index} course={course} index={index} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'longterm' && (
            <div className="space-y-6">
              <div className="text-center">
                <Star className="w-12 h-12 mx-auto mb-3 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Long-term Mastery</h3>
                <p className="text-muted-foreground">
                  Advanced courses to achieve expertise and unlock career advancement opportunities.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {learningPath.longTermGoals.map((course, index) => (
                  <CourseRecommendationCard key={index} course={course} index={index} />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lightbulb className="w-6 h-6 text-primary" />
              <div>
                <div className="font-medium">Need a different path?</div>
                <div className="text-sm text-muted-foreground">
                  Update your goals or preferences to get new recommendations
                </div>
              </div>
            </div>
            <Button onClick={generateLearningPath} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Regenerate Path
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalizedLearningPath;