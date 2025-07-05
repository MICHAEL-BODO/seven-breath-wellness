import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X, Pause, Play, SkipForward } from 'lucide-react';
import { type BreathingTechnique } from '@/data/breathingTechniques';

interface BreathingSessionProps {
  technique: BreathingTechnique;
  onClose: () => void;
  onComplete: () => void;
}

type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'pause';

export function BreathingSession({ technique, onClose, onComplete }: BreathingSessionProps) {
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<BreathPhase>('inhale');
  const [timeLeft, setTimeLeft] = useState(technique.pattern.inhale);
  const [totalElapsed, setTotalElapsed] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout>();

  const totalDuration = technique.duration;
  const progress = (totalElapsed / totalDuration) * 100;

  const phaseInstructions = {
    inhale: 'Breathe In',
    hold: 'Hold',
    exhale: 'Breathe Out',
    pause: 'Pause'
  };

  const phaseColors = {
    inhale: 'breathing-inhale',
    hold: 'breathing-hold',
    exhale: 'breathing-exhale',
    pause: 'muted-foreground'
  };

  const getNextPhase = (current: BreathPhase): BreathPhase => {
    const { pattern } = technique;
    switch (current) {
      case 'inhale':
        return pattern.hold ? 'hold' : 'exhale';
      case 'hold':
        return 'exhale';
      case 'exhale':
        return pattern.pause ? 'pause' : 'inhale';
      case 'pause':
        return 'inhale';
      default:
        return 'inhale';
    }
  };

  const getPhaseDuration = (phase: BreathPhase): number => {
    const { pattern } = technique;
    switch (phase) {
      case 'inhale':
        return pattern.inhale;
      case 'hold':
        return pattern.hold || 0;
      case 'exhale':
        return pattern.exhale;
      case 'pause':
        return pattern.pause || 0;
      default:
        return pattern.inhale;
    }
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
        setTotalElapsed(prev => prev + 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Move to next phase
      const nextPhase = getNextPhase(currentPhase);
      setCurrentPhase(nextPhase);
      setTimeLeft(getPhaseDuration(nextPhase));
      
      if (nextPhase === 'inhale') {
        setCycleCount(prev => prev + 1);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft, currentPhase, technique]);

  useEffect(() => {
    if (totalElapsed >= totalDuration) {
      setIsActive(false);
      onComplete();
    }
  }, [totalElapsed, totalDuration, onComplete]);

  const toggleSession = () => {
    setIsActive(prev => !prev);
  };

  const skipPhase = () => {
    const nextPhase = getNextPhase(currentPhase);
    setCurrentPhase(nextPhase);
    setTimeLeft(getPhaseDuration(nextPhase));
    
    if (nextPhase === 'inhale') {
      setCycleCount(prev => prev + 1);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const avatarScale = currentPhase === 'inhale' ? 'scale-125' : 
                    currentPhase === 'exhale' ? 'scale-75' : 'scale-100';

  return (
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 shadow-breathing">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">{technique.name}</h2>
            <p className="text-sm text-muted-foreground">Cycle {cycleCount + 1}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Progress</span>
            <span className="text-sm text-muted-foreground">
              {formatTime(totalElapsed)} / {formatTime(totalDuration)}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Breathing Avatar */}
        <div className="text-center mb-8">
          <div 
            className={`w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-calm flex items-center justify-center transition-transform duration-1000 ease-breath ${avatarScale}`}
          >
            <div className="text-4xl">{technique.icon}</div>
          </div>
          
          <div className="space-y-2">
            <h3 className={`text-2xl font-medium text-${phaseColors[currentPhase]}`}>
              {phaseInstructions[currentPhase]}
            </h3>
            <div className="text-6xl font-light text-foreground">
              {timeLeft}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-4">
          <Button variant="outline" size="sm" onClick={skipPhase}>
            <SkipForward className="w-4 h-4" />
          </Button>
          
          <Button 
            onClick={toggleSession}
            size="lg"
            className="px-8"
          >
            {isActive ? (
              <>
                <Pause className="w-5 h-5 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                {totalElapsed > 0 ? 'Resume' : 'Start'}
              </>
            )}
          </Button>
        </div>

        {/* Instructions */}
        <div className="mt-6 p-3 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            {technique.instructions}
          </p>
        </div>
      </Card>
    </div>
  );
}