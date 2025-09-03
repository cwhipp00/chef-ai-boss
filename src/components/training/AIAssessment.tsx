import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Brain, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Award, 
  Target,
  Lightbulb,
  RefreshCw,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Question {
  id: number;
  type: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  difficulty: string;
  points: number;
}

interface Assessment {
  questions: Question[];
  totalPoints: number;
  passingScore: number;
  timeLimit: number;
}

interface AIAssessmentProps {
  lessonId: string;
  lessonTitle: string;
  lessonContent: any;
  onComplete?: (score: number, passed: boolean) => void;
}

const AIAssessment: React.FC<AIAssessmentProps> = ({ 
  lessonId, 
  lessonTitle, 
  lessonContent,
  onComplete 
}) => {
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [passed, setPassed] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (hasStarted && timeRemaining > 0 && !showResults) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [hasStarted, timeRemaining, showResults]);

  const generateAssessment = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-assessment-generator', {
        body: {
          lessonContent: JSON.stringify(lessonContent).substring(0, 2000),
          difficulty: 'intermediate',
          assessmentType: 'quiz'
        }
      });

      if (error) throw error;
      
      setAssessment(data);
      setTimeRemaining(data.timeLimit * 60); // Convert to seconds
    } catch (error) {
      console.error('Error generating assessment:', error);
      toast.error('Failed to generate assessment');
    } finally {
      setIsLoading(false);
    }
  };

  const startAssessment = () => {
    setHasStarted(true);
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResults(false);
  };

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const handleNext = () => {
    if (assessment && currentQuestion < assessment.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleTimeUp = () => {
    toast.warning('Time is up! Submitting your assessment...');
    handleSubmit();
  };

  const handleSubmit = async () => {
    if (!assessment) return;

    let correctAnswers = 0;
    let totalPoints = 0;

    assessment.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correct) {
        correctAnswers++;
        totalPoints += question.points;
      }
    });

    const finalScore = Math.round((totalPoints / assessment.totalPoints) * 100);
    const hasPassed = finalScore >= assessment.passingScore;

    setScore(finalScore);
    setPassed(hasPassed);
    setShowResults(true);

    // Save assessment result
    if (user) {
      try {
        await supabase
          .from('lesson_progress')
          .upsert({
            user_id: user.id,
            lesson_id: lessonId,
            completed_at: new Date().toISOString(),
            score: finalScore,
            assessment_data: {
              questions: assessment.questions.length,
              correct: correctAnswers,
              totalPoints: assessment.totalPoints,
              earnedPoints: totalPoints,
              passed: hasPassed
            }
          });

        toast.success(hasPassed ? 'Assessment passed! Great work!' : 'Assessment completed. Review and try again if needed.');
      } catch (error) {
        console.error('Error saving assessment result:', error);
      }
    }

    onComplete?.(finalScore, hasPassed);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number, passingScore: number) => {
    if (score >= passingScore) return 'text-green-600';
    if (score >= passingScore * 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!assessment) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">AI-Powered Assessment</CardTitle>
          <p className="text-muted-foreground">
            Test your knowledge of "{lessonTitle}" with a personalized assessment generated by AI
          </p>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <div className="p-4 rounded-lg bg-muted/50">
              <Target className="w-6 h-6 mx-auto mb-2 text-primary" />
              <div className="text-sm font-medium">Adaptive</div>
              <div className="text-xs text-muted-foreground">Questions match your level</div>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <Clock className="w-6 h-6 mx-auto mb-2 text-primary" />
              <div className="text-sm font-medium">Timed</div>
              <div className="text-xs text-muted-foreground">15-minute assessment</div>
            </div>
          </div>
          <Button 
            onClick={generateAssessment} 
            disabled={isLoading}
            className="bg-gradient-primary"
            size="lg"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generating Assessment...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 mr-2" />
                Generate Assessment
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!hasStarted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <Brain className="w-6 h-6 text-primary" />
            Assessment Ready
          </CardTitle>
          <p className="text-muted-foreground">"{lessonTitle}" Knowledge Check</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border text-center">
              <div className="text-2xl font-bold text-primary">{assessment.questions.length}</div>
              <div className="text-sm text-muted-foreground">Questions</div>
            </div>
            <div className="p-4 rounded-lg border text-center">
              <div className="text-2xl font-bold text-primary">{assessment.timeLimit}min</div>
              <div className="text-sm text-muted-foreground">Time Limit</div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-primary" />
              <span className="font-medium">Assessment Guidelines</span>
            </div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• You need {assessment.passingScore}% to pass</li>
              <li>• Questions are based on the lesson content</li>
              <li>• You can navigate between questions</li>
              <li>• Timer starts when you begin</li>
            </ul>
          </div>

          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => setAssessment(null)}>
              Generate New Questions
            </Button>
            <Button onClick={startAssessment} className="bg-gradient-primary">
              Start Assessment
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showResults) {
    const currentQ = assessment.questions[currentQuestion];
    const correctAnswers = assessment.questions.filter((q, index) => 
      selectedAnswers[index] === q.correct
    ).length;

    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <div className={`text-6xl font-bold mb-2 ${getScoreColor(score, assessment.passingScore)}`}>
            {score}%
          </div>
          <CardTitle className="text-2xl">
            {passed ? (
              <span className="text-green-600 flex items-center justify-center gap-2">
                <CheckCircle className="w-6 h-6" />
                Assessment Passed!
              </span>
            ) : (
              <span className="text-red-600 flex items-center justify-center gap-2">
                <XCircle className="w-6 h-6" />
                Assessment Incomplete
              </span>
            )}
          </CardTitle>
          <p className="text-muted-foreground">
            You answered {correctAnswers} out of {assessment.questions.length} questions correctly
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border text-center">
              <div className="text-2xl font-bold text-primary">{correctAnswers}</div>
              <div className="text-sm text-muted-foreground">Correct</div>
            </div>
            <div className="p-4 rounded-lg border text-center">
              <div className="text-2xl font-bold text-muted-foreground">
                {assessment.questions.length - correctAnswers}
              </div>
              <div className="text-sm text-muted-foreground">Incorrect</div>
            </div>
            <div className="p-4 rounded-lg border text-center">
              <div className="text-2xl font-bold text-primary">{assessment.passingScore}%</div>
              <div className="text-sm text-muted-foreground">Required</div>
            </div>
          </div>

          {passed && (
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800 dark:text-green-200">Congratulations!</span>
              </div>
              <p className="text-green-700 dark:text-green-300 text-sm">
                You've successfully completed the assessment for "{lessonTitle}". 
                Your understanding of the material is excellent!
              </p>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Review Your Answers</h3>
            {assessment.questions.map((question, index) => {
              const userAnswer = selectedAnswers[index];
              const isCorrect = userAnswer === question.correct;
              
              return (
                <Card key={question.id} className={`border-l-4 ${
                  isCorrect ? 'border-l-green-500 bg-green-50/50 dark:bg-green-900/10' : 
                  'border-l-red-500 bg-red-50/50 dark:bg-red-900/10'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">Question {index + 1}</h4>
                      <Badge variant={isCorrect ? "default" : "destructive"}>
                        {isCorrect ? 'Correct' : 'Incorrect'}
                      </Badge>
                    </div>
                    <p className="mb-3">{question.question}</p>
                    
                    <div className="space-y-2 mb-3">
                      {question.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className={`p-2 rounded text-sm ${
                            optionIndex === question.correct
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                              : optionIndex === userAnswer && userAnswer !== question.correct
                              ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                              : 'bg-muted/50'
                          }`}
                        >
                          {option}
                          {optionIndex === question.correct && (
                            <CheckCircle className="w-4 h-4 inline-block ml-2" />
                          )}
                          {optionIndex === userAnswer && userAnswer !== question.correct && (
                            <XCircle className="w-4 h-4 inline-block ml-2" />
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded border-l-4 border-blue-500">
                      <div className="flex items-center gap-2 mb-1">
                        <Lightbulb className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-blue-800 dark:text-blue-200">Explanation</span>
                      </div>
                      <p className="text-blue-700 dark:text-blue-300 text-sm">{question.explanation}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => setAssessment(null)}>
              Try New Assessment
            </Button>
            {!passed && (
              <Button onClick={() => {
                setHasStarted(false);
                setShowResults(false);
                setSelectedAnswers({});
                setCurrentQuestion(0);
                setTimeRemaining(assessment.timeLimit * 60);
              }}>
                Retake Assessment
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentQ = assessment.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / assessment.questions.length) * 100;
  const answered = Object.keys(selectedAnswers).length;

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">
              Question {currentQuestion + 1} of {assessment.questions.length}
            </CardTitle>
            <p className="text-sm text-muted-foreground">"{lessonTitle}" Assessment</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">
              {formatTime(timeRemaining)}
            </div>
            <div className="text-xs text-muted-foreground">Time remaining</div>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="p-6 rounded-lg border">
          <div className="flex items-start justify-between mb-4">
            <Badge variant="outline">{currentQ.difficulty}</Badge>
            <Badge>{currentQ.points} points</Badge>
          </div>
          
          <h3 className="text-lg font-medium mb-4">{currentQ.question}</h3>
          
          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(currentQuestion, index)}
                className={`w-full p-4 text-left rounded-lg border transition-all ${
                  selectedAnswers[currentQuestion] === index
                    ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                    : 'border-muted hover:border-primary/50 hover:bg-muted/50'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Answered: {answered} of {assessment.questions.length}
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            <Button 
              onClick={handleNext}
              disabled={!(currentQuestion in selectedAnswers)}
              className="bg-gradient-primary"
            >
              {currentQuestion === assessment.questions.length - 1 ? 'Submit' : 'Next'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIAssessment;