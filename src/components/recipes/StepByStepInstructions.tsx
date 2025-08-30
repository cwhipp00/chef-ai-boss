import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2,
  RotateCcw,
  X
} from 'lucide-react';

interface StepByStepInstructionsProps {
  instructions: string[];
  onClose?: () => void;
}

export function StepByStepInstructions({ instructions, onClose }: StepByStepInstructionsProps) {
  const [isStarted, setIsStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const startCooking = () => {
    setIsStarted(true);
    setCurrentStep(0);
  };

  const nextStep = () => {
    if (currentStep < instructions.length - 1) {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      setCurrentStep(prev => prev + 1);
    } else {
      // Mark final step as complete
      setCompletedSteps(prev => new Set([...prev, currentStep]));
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const resetCooking = () => {
    setIsStarted(false);
    setCurrentStep(0);
    setCompletedSteps(new Set());
  };

  const isLastStep = currentStep === instructions.length - 1;
  const allStepsCompleted = completedSteps.size === instructions.length;

  if (!isStarted) {
    return (
      <Card className="border-2 border-dashed border-muted-foreground/20">
        <CardHeader className="text-center">
          <CardTitle className="text-lg">Ready to Cook?</CardTitle>
          <p className="text-sm text-muted-foreground">
            Follow step-by-step instructions with guided cooking mode
          </p>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-sm text-muted-foreground">
            {instructions.length} steps • Tap anywhere to advance
          </div>
          <Button 
            onClick={startCooking}
            size="lg" 
            className="bg-gradient-primary hover:bg-primary/90"
          >
            <Play className="h-4 w-4 mr-2" />
            Start Cooking
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (allStepsCompleted) {
    return (
      <Card className="border-2 border-green-500/20 bg-green-50/50 dark:bg-green-950/20">
        <CardHeader className="text-center">
          <CardTitle className="text-lg text-green-700 dark:text-green-400">
            <CheckCircle2 className="h-6 w-6 mx-auto mb-2" />
            Recipe Complete!
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            You have completed all {instructions.length} steps
          </p>
        </CardHeader>
        <CardContent className="text-center space-y-3">
          <div className="flex justify-center gap-2">
            <Button 
              onClick={resetCooking}
              variant="outline"
              size="sm"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Cook Again
            </Button>
            {onClose && (
              <Button 
                onClick={onClose}
                variant="outline"
                size="sm"
              >
                <X className="h-4 w-4 mr-2" />
                Close
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Progress Header */}
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="text-sm">
          Step {currentStep + 1} of {instructions.length}
        </Badge>
        <div className="flex items-center gap-2">
          <div className="w-24 bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${((currentStep + 1) / instructions.length) * 100}%` 
              }}
            />
          </div>
          <span className="text-xs text-muted-foreground">
            {Math.round(((currentStep + 1) / instructions.length) * 100)}%
          </span>
        </div>
      </div>

      {/* Current Step Card */}
      <Card 
        className="border-2 border-primary/20 cursor-pointer hover:border-primary/40 transition-colors"
        onClick={nextStep}
      >
        <CardContent className="p-8 text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold">
              {currentStep + 1}
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              Step {currentStep + 1}
            </h3>
            <p className="text-base text-foreground leading-relaxed">
              {instructions[currentStep]}
            </p>
          </div>

          <div className="text-sm text-muted-foreground">
            {isLastStep ? "Tap to complete recipe" : "Tap anywhere to continue"}
          </div>
        </CardContent>
      </Card>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between">
        <Button 
          onClick={previousStep}
          variant="outline" 
          size="sm"
          disabled={currentStep === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {completedSteps.size > 0 && (
            <span>{completedSteps.size} completed</span>
          )}
        </div>

        <Button 
          onClick={nextStep}
          size="sm"
          className="bg-primary hover:bg-primary/90"
        >
          {isLastStep ? "Complete" : "Next"}
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="flex justify-center gap-2">
        <Button 
          onClick={resetCooking}
          variant="ghost" 
          size="sm"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Restart
        </Button>
        {onClose && (
          <Button 
            onClick={onClose}
            variant="ghost" 
            size="sm"
          >
            <X className="h-4 w-4 mr-2" />
            Exit
          </Button>
        )}
      </div>
    </div>
  );
}