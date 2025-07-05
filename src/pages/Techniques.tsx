import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { breathingTechniques, type BreathingTechnique } from '@/data/breathingTechniques';
import { TechniqueCard } from '@/components/TechniqueCard';
import { BreathingSession } from '@/components/BreathingSession';
import { Filter } from 'lucide-react';

export default function Techniques() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTechnique, setSelectedTechnique] = useState<BreathingTechnique | null>(null);
  const [showSession, setShowSession] = useState(false);

  const categories = [
    { value: 'all', label: 'All Techniques', count: breathingTechniques.length },
    { value: 'anxiety', label: 'Anxiety & Stress', count: breathingTechniques.filter(t => t.category === 'anxiety').length },
    { value: 'sleep', label: 'Sleep', count: breathingTechniques.filter(t => t.category === 'sleep').length },
    { value: 'focus', label: 'Focus', count: breathingTechniques.filter(t => t.category === 'focus').length },
    { value: 'energy', label: 'Energy', count: breathingTechniques.filter(t => t.category === 'energy').length }
  ];

  const filteredTechniques = selectedCategory === 'all' 
    ? breathingTechniques 
    : breathingTechniques.filter(t => t.category === selectedCategory);

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

  return (
    <div className="min-h-screen bg-gradient-breathing pb-20 p-4">
      <div className="max-w-md mx-auto pt-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">All Techniques</h1>
          <p className="text-muted-foreground">Choose from 7 evidence-based breathing methods</p>
        </div>

        {/* Category Filter */}
        <Card className="p-4 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <h2 className="font-semibold">Filter by Category</h2>
          </div>
          <div className="space-y-2">
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.value)}
                className="w-full justify-between"
              >
                <span>{category.label}</span>
                <Badge variant="secondary" className="ml-2">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </Card>

        {/* Techniques List */}
        <div className="space-y-4">
          {filteredTechniques.map((technique) => (
            <TechniqueCard
              key={technique.id}
              technique={technique}
              onStart={handleStartSession}
            />
          ))}
        </div>

        {filteredTechniques.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">
              No techniques found for the selected category.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}