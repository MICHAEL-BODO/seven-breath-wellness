import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { recommendTechniques, type BreathingTechnique } from '@/data/breathingTechniques';
import { TechniqueCard } from '@/components/TechniqueCard';
import { BreathingSession } from '@/components/BreathingSession';
import { ArrowRight, Sparkles } from 'lucide-react';

const Index = () => {
  const [userInput, setUserInput] = useState('');
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendations, setRecommendations] = useState<BreathingTechnique[]>([]);
  const [selectedTechnique, setSelectedTechnique] = useState<BreathingTechnique | null>(null);
  const [showSession, setShowSession] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim()) {
      const recommended = recommendTechniques(userInput);
      setRecommendations(recommended);
      setShowRecommendations(true);
    }
  };

  const handleQuickSelect = (issue: string) => {
    setUserInput(issue);
    const recommended = recommendTechniques(issue);
    setRecommendations(recommended);
    setShowRecommendations(true);
  };

  const resetToHome = () => {
    setShowRecommendations(false);
    setUserInput('');
    setRecommendations([]);
  };

  const handleStartSession = (technique: BreathingTechnique) => {
    setSelectedTechnique(technique);
    setShowSession(true);
  };

  const handleCloseSession = () => {
    setShowSession(false);
    setSelectedTechnique(null);
  };

  const handleCompleteSession = () => {
    // Here you would typically save the session data
    console.log('Session completed:', selectedTechnique?.name);
    setShowSession(false);
    setSelectedTechnique(null);
    // Could show a completion modal or redirect to journey page
  };

  if (showSession && selectedTechnique) {
    return (
      <BreathingSession
        technique={selectedTechnique}
        onClose={handleCloseSession}
        onComplete={handleCompleteSession}
      />
    );
  }

  if (showRecommendations) {
    return (
      <div className="min-h-screen bg-gradient-breathing pb-20 p-4">
        <div className="max-w-md mx-auto pt-8">
          <div className="text-center mb-8">
            <Button 
              variant="ghost" 
              onClick={resetToHome}
              className="mb-4 text-muted-foreground hover:text-foreground"
            >
              ← Back to Home
            </Button>
            <h2 className="text-2xl font-semibold mb-2">Recommended for You</h2>
            <p className="text-muted-foreground">
              Based on "{userInput}", here are the best techniques to help you feel better.
            </p>
          </div>
          
          <div className="space-y-4">
            {recommendations.map((technique) => (
              <TechniqueCard 
                key={technique.id} 
                technique={technique} 
                onStart={handleStartSession}
              />
            ))}
          </div>
          
          {recommendations.length === 0 && (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground">
                No specific recommendations found. Try describing how you're feeling differently.
              </p>
            </Card>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center pb-20 p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">7-Breaths</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            AI-powered breathing techniques for better living
          </p>
        </div>

        {/* iMessage-style prompt */}
        <Card className="p-6 shadow-soft">
          <div className="space-y-4">
            <h2 className="text-xl font-medium text-center">What brings you here today?</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Input
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="I'm feeling anxious about work..."
                  className="pr-12 text-base h-12 bg-muted/50 border-0 focus:bg-background transition-colors"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                  disabled={!userInput.trim()}
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </form>

            {/* Quick select options */}
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground text-center">Or choose a common issue:</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  'I feel anxious',
                  'Can\'t sleep',
                  'Need energy',
                  'Trouble focusing',
                  'Feeling stressed',
                  'Overwhelmed'
                ].map((issue) => (
                  <Button
                    key={issue}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickSelect(issue)}
                    className="text-sm h-10 bg-muted/30 hover:bg-muted border-border/50"
                  >
                    {issue}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Evidence-based breathing techniques</p>
          <p>tailored to your needs</p>
        </div>
      </div>
    </div>
  );
};

export default Index;