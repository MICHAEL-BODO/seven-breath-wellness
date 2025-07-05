import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Play } from 'lucide-react';
import { type BreathingTechnique } from '@/data/breathingTechniques';

interface TechniqueCardProps {
  technique: BreathingTechnique;
  onStart?: (technique: BreathingTechnique) => void;
}

export function TechniqueCard({ technique, onStart }: TechniqueCardProps) {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return minutes > 0 ? `${minutes} min` : `${seconds}s`;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'anxiety':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'sleep':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'focus':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'energy':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleStart = () => {
    if (onStart) {
      onStart(technique);
    }
  };

  return (
    <Card className="p-4 shadow-soft hover:shadow-breathing transition-shadow duration-300">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{technique.icon}</div>
          <div>
            <h3 className="font-semibold text-foreground">{technique.name}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <Badge className={getCategoryColor(technique.category)}>
                {technique.category}
              </Badge>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="w-3 h-3 mr-1" />
                {formatDuration(technique.duration)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
        {technique.description}
      </p>

      <div className="space-y-2 mb-4">
        <div className="text-xs font-medium text-foreground">Pattern:</div>
        <div className="flex items-center space-x-2 text-sm">
          <span className="px-2 py-1 bg-breathing-inhale/10 text-breathing-inhale rounded text-xs">
            Inhale {technique.pattern.inhale}s
          </span>
          {technique.pattern.hold && (
            <span className="px-2 py-1 bg-breathing-hold/10 text-breathing-hold rounded text-xs">
              Hold {technique.pattern.hold}s
            </span>
          )}
          <span className="px-2 py-1 bg-breathing-exhale/10 text-breathing-exhale rounded text-xs">
            Exhale {technique.pattern.exhale}s
          </span>
          {technique.pattern.pause && (
            <span className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs">
              Pause {technique.pattern.pause}s
            </span>
          )}
        </div>
      </div>

      <Button 
        onClick={handleStart}
        className="w-full group"
        size="lg"
      >
        <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
        Start Session
      </Button>
    </Card>
  );
}