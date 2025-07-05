import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Bell, Brain, Clock, Smartphone, Mail, Phone, Monitor } from 'lucide-react';

export default function Habits() {
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [selectedChannels, setSelectedChannels] = useState<string[]>(['push']);
  const [pausedUntil, setPausedUntil] = useState<string | null>(null);

  const reminderChannels = [
    { id: 'push', label: 'Push Notifications', icon: Smartphone, description: 'Phone notifications' },
    { id: 'email', label: 'Email', icon: Mail, description: 'Daily email reminders' },
    { id: 'call', label: 'Phone Call', icon: Phone, description: 'Gentle voice reminders' },
    { id: 'screen', label: 'Screen Overlay', icon: Monitor, description: 'On-screen breathing cues' }
  ];

  const suggestedReminders = [
    {
      id: 1,
      time: '9:00 AM',
      technique: 'Box Breathing',
      reason: 'You usually feel anxious around this time',
      category: 'anxiety',
      confidence: 85
    },
    {
      id: 2,
      time: '3:00 PM',
      technique: 'Extended Exhalation',
      reason: 'Afternoon focus dip detected',
      category: 'focus',
      confidence: 92
    },
    {
      id: 3,
      time: '10:30 PM',
      technique: '4-7-8 Breathing',
      reason: 'Based on your sleep schedule',
      category: 'sleep',
      confidence: 78
    }
  ];

  const toggleChannel = (channelId: string) => {
    setSelectedChannels(prev => 
      prev.includes(channelId)
        ? prev.filter(id => id !== channelId)
        : [...prev, channelId]
    );
  };

  const pauseReminders = (duration: string) => {
    const now = new Date();
    let until: Date;
    
    switch (duration) {
      case '1hour':
        until = new Date(now.getTime() + 60 * 60 * 1000);
        break;
      case '4hours':
        until = new Date(now.getTime() + 4 * 60 * 60 * 1000);
        break;
      case '1day':
        until = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        break;
      default:
        until = new Date(now.getTime() + 60 * 60 * 1000);
    }
    
    setPausedUntil(until.toISOString());
  };

  const isPaused = pausedUntil && new Date(pausedUntil) > new Date();

  return (
    <div className="min-h-screen bg-gradient-breathing pb-20 p-4">
      <div className="max-w-md mx-auto pt-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-calm rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">AI Habit Coach</h1>
          <p className="text-muted-foreground">Intelligent reminders that learn from your behavior</p>
        </div>

        {/* Master Toggle */}
        <Card className="p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-primary" />
              <div>
                <h3 className="font-semibold">Smart Reminders</h3>
                <p className="text-sm text-muted-foreground">AI-powered breathing prompts</p>
              </div>
            </div>
            <Switch 
              checked={remindersEnabled && !isPaused}
              onCheckedChange={setRemindersEnabled}
              disabled={isPaused}
            />
          </div>
        </Card>

        {/* Pause Controls */}
        {remindersEnabled && (
          <Card className="p-4 mb-6">
            <h3 className="font-semibold mb-3">Quick Pause</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {isPaused 
                ? `Reminders paused until ${new Date(pausedUntil!).toLocaleTimeString()}`
                : "Temporarily pause all reminders when you're busy"
              }
            </p>
            {!isPaused && (
              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" size="sm" onClick={() => pauseReminders('1hour')}>
                  1 Hour
                </Button>
                <Button variant="outline" size="sm" onClick={() => pauseReminders('4hours')}>
                  4 Hours
                </Button>
                <Button variant="outline" size="sm" onClick={() => pauseReminders('1day')}>
                  1 Day
                </Button>
              </div>
            )}
            {isPaused && (
              <Button variant="outline" size="sm" onClick={() => setPausedUntil(null)}>
                Resume Now
              </Button>
            )}
          </Card>
        )}

        {/* Reminder Channels */}
        {remindersEnabled && !isPaused && (
          <Card className="p-4 mb-6">
            <h3 className="font-semibold mb-4">Reminder Channels</h3>
            <div className="space-y-3">
              {reminderChannels.map((channel) => {
                const Icon = channel.icon;
                const isSelected = selectedChannels.includes(channel.id);
                
                return (
                  <div 
                    key={channel.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      isSelected 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:bg-muted/30'
                    }`}
                    onClick={() => toggleChannel(channel.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                      <div className="flex-1">
                        <div className="font-medium">{channel.label}</div>
                        <div className="text-sm text-muted-foreground">{channel.description}</div>
                      </div>
                      <Switch checked={isSelected} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* AI Suggestions */}
        {remindersEnabled && !isPaused && (
          <Card className="p-4">
            <div className="flex items-center space-x-2 mb-4">
              <Brain className="w-5 h-5 text-accent" />
              <h3 className="font-semibold">AI Suggestions</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Based on your patterns, here are personalized reminder times:
            </p>
            
            <div className="space-y-3">
              {suggestedReminders.map((reminder) => (
                <div key={reminder.id} className="p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="font-medium">{reminder.time}</span>
                      <Badge className="capitalize text-xs">{reminder.category}</Badge>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {reminder.confidence}% confident
                    </Badge>
                  </div>
                  <div className="font-medium mb-1">{reminder.technique}</div>
                  <div className="text-sm text-muted-foreground">{reminder.reason}</div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-gradient-calm rounded-lg">
              <p className="text-sm text-center text-muted-foreground">
                🧠 Your AI coach learns from each interaction and improves suggestions over time.
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}