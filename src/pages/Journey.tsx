import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Award, TrendingUp, Clock } from 'lucide-react';

export default function Journey() {
  // Mock data for now - would come from state management/backend
  const stats = {
    totalSessions: 23,
    streakDays: 7,
    totalMinutes: 142,
    favoriteCategory: 'anxiety'
  };

  const recentSessions = [
    {
      id: 1,
      technique: 'Box Breathing',
      category: 'anxiety',
      duration: 240,
      completedAt: '2024-01-15T10:30:00Z',
      mood: 'calm'
    },
    {
      id: 2,
      technique: '4-7-8 Breathing',
      category: 'sleep',
      duration: 180,
      completedAt: '2024-01-14T22:15:00Z',
      mood: 'relaxed'
    }
  ];

  const badges = [
    { name: 'First Session', icon: '🌟', earned: true },
    { name: 'Week Warrior', icon: '📅', earned: true },
    { name: 'Anxiety Warrior', icon: '💙', earned: true },
    { name: 'Sleep Master', icon: '🌙', earned: false }
  ];

  return (
    <div className="min-h-screen bg-gradient-breathing pb-20 p-4">
      <div className="max-w-md mx-auto pt-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">My Journey</h1>
          <p className="text-muted-foreground">Track your breathing practice progress</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{stats.totalSessions}</div>
            <div className="text-sm text-muted-foreground">Total Sessions</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-accent">{stats.streakDays}</div>
            <div className="text-sm text-muted-foreground">Day Streak</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-breathing-exhale">{stats.totalMinutes}</div>
            <div className="text-sm text-muted-foreground">Minutes</div>
          </Card>
          <Card className="p-4 text-center">
            <Badge className="capitalize">{stats.favoriteCategory}</Badge>
            <div className="text-sm text-muted-foreground mt-1">Top Category</div>
          </Card>
        </div>

        {/* Badges */}
        <Card className="p-4 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Award className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-semibold">Achievements</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {badges.map((badge) => (
              <div 
                key={badge.name}
                className={`p-3 rounded-lg text-center ${
                  badge.earned 
                    ? 'bg-accent/10 border border-accent/20' 
                    : 'bg-muted/30 opacity-50'
                }`}
              >
                <div className="text-2xl mb-1">{badge.icon}</div>
                <div className="text-xs font-medium">{badge.name}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Sessions */}
        <Card className="p-4">
          <div className="flex items-center space-x-2 mb-4">
            <Clock className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Recent Sessions</h2>
          </div>
          <div className="space-y-3">
            {recentSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <div className="font-medium">{session.technique}</div>
                  <div className="text-sm text-muted-foreground">
                    {Math.floor(session.duration / 60)} min • Felt {session.mood}
                  </div>
                </div>
                <div className="text-right">
                  <Badge className="capitalize mb-1">{session.category}</Badge>
                  <div className="text-xs text-muted-foreground">
                    {new Date(session.completedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Journaling Prompt */}
        <Card className="p-4 mt-4 bg-gradient-calm">
          <h3 className="font-semibold mb-2">Reflection Prompt</h3>
          <p className="text-sm text-muted-foreground mb-3">
            After your last Box Breathing session, how did your anxiety levels change on a scale of 1-10?
          </p>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <button
                key={num}
                className="w-8 h-8 rounded-full border border-border hover:bg-primary hover:text-primary-foreground transition-colors text-sm"
              >
                {num}
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}