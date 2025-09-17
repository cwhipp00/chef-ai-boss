import React, { memo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Clock, 
  Star, 
  PlayCircle,
  CheckCircle,
  Users,
  Award,
  AlertTriangle
} from 'lucide-react';
import { AutoGenerateTrainingButton } from './AutoGenerateTrainingButton';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor_name: string;
  difficulty_level: string;
  duration_hours: number;
  thumbnail_url?: string;
  category: string;
  tags: string[];
  is_featured: boolean;
}

interface OptimizedCourseCardProps {
  course: Course;
  lessonCount: number;
  isEnrolled: boolean;
  progress: number;
  onEnroll: (courseId: string) => void;
  onViewCourse: (course: Course) => void;
  onLessonsGenerated?: () => void;
  showProgress?: boolean;
}

export const OptimizedCourseCard = memo<OptimizedCourseCardProps>(({ 
  course, 
  lessonCount, 
  isEnrolled, 
  progress, 
  onEnroll, 
  onViewCourse,
  onLessonsGenerated,
  showProgress = false 
}) => {
  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'intermediate': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'advanced': return 'bg-red-500/10 text-red-600 border-red-500/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const isCompleted = progress >= 100;

  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 border-l-4 ${
      course.is_featured 
        ? 'border-l-primary bg-gradient-to-r from-primary/5 via-transparent to-transparent' 
        : 'border-l-transparent hover:border-l-primary/50'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {course.is_featured && (
                <Badge className="bg-gradient-primary text-white">
                  <Star className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              )}
              <Badge className={getDifficultyColor(course.difficulty_level)}>
                {course.difficulty_level}
              </Badge>
            </div>
            
            <h3 className="text-lg font-semibold leading-tight mb-1 group-hover:text-primary transition-colors">
              {course.title}
            </h3>
            
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {course.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {course.instructor_name}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {course.duration_hours}h
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            {lessonCount} lessons
          </span>
        </div>

        {course.tags && course.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {course.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs px-2 py-0.5">
                {tag}
              </Badge>
            ))}
            {course.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs px-2 py-0.5">
                +{course.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        {/* Show content generation when no lessons are available and enrolled */}
        {lessonCount === 0 && isEnrolled ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-warning">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">No lessons available - Generate content below</span>
            </div>
            <AutoGenerateTrainingButton 
              course={course} 
              onLessonsGenerated={onLessonsGenerated}
            />
          </div>
        ) : (
          <>
            {showProgress && isEnrolled && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            <div className="flex gap-2">
              {!isEnrolled ? (
                <Button 
                  onClick={() => onEnroll(course.id)}
                  className="flex-1 text-sm h-9"
                  variant="outline"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Enroll Now
                </Button>
              ) : (
                <Button 
                  onClick={() => onViewCourse(course)}
                  className="flex-1 text-sm h-9"
                  variant={isCompleted ? "default" : "outline"}
                  disabled={lessonCount === 0}
                >
                  {isCompleted ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Completed
                    </>
                  ) : (
                    <>
                      <PlayCircle className="w-4 h-4 mr-2" />
                      {lessonCount === 0 ? 'Generate Content First' : 'Continue Learning'}
                    </>
                  )}
                </Button>
              )}
              
              {course.is_featured && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onViewCourse(course)}
                  className="px-3"
                >
                  <Award className="w-4 h-4" />
                </Button>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
});

OptimizedCourseCard.displayName = 'OptimizedCourseCard';