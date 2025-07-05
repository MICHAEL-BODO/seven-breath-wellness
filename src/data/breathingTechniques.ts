export interface BreathingTechnique {
  id: string;
  name: string;
  description: string;
  category: 'anxiety' | 'sleep' | 'focus' | 'energy';
  duration: number; // in seconds
  pattern: {
    inhale: number;
    hold?: number;
    exhale: number;
    pause?: number;
  };
  instructions: string;
  benefits: string;
  icon: string;
}

export const breathingTechniques: BreathingTechnique[] = [
  {
    id: 'box-breathing',
    name: 'Box Breathing',
    description: 'Proven to activate the parasympathetic nervous system, reducing cortisol levels.',
    category: 'anxiety',
    duration: 240, // 4 minutes
    pattern: {
      inhale: 4,
      hold: 4,
      exhale: 4,
      pause: 4
    },
    instructions: 'Breathe in a square pattern: inhale, hold, exhale, pause - each for 4 counts.',
    benefits: 'Used in high-pressure environments like the military to manage acute stress.',
    icon: '⬜'
  },
  {
    id: 'physiological-sigh',
    name: 'Physiological Sigh',
    description: 'Double inhale followed by a long exhale that rapidly reduces stress arousal.',
    category: 'anxiety',
    duration: 60, // 1 minute
    pattern: {
      inhale: 2, // double inhale
      exhale: 8
    },
    instructions: 'Take two quick inhales through your nose, then one long exhale through your mouth.',
    benefits: 'Ideal for quick anxiety relief during the day by resetting blood CO₂ levels.',
    icon: '🌬️'
  },
  {
    id: 'coherence-breathing',
    name: 'Coherence Breathing',
    description: 'Balances the autonomic nervous system, improving heart rate variability.',
    category: 'anxiety',
    duration: 300, // 5 minutes
    pattern: {
      inhale: 6,
      exhale: 6
    },
    instructions: 'Breathe slowly and evenly: 6 seconds in, 6 seconds out.',
    benefits: 'Reduces long-term emotional and physiological stress.',
    icon: '⚖️'
  },
  {
    id: '4-7-8-breathing',
    name: '4-7-8 Breathing',
    description: 'Triggers the body relaxation response by extending the exhalation.',
    category: 'sleep',
    duration: 180, // 3 minutes
    pattern: {
      inhale: 4,
      hold: 7,
      exhale: 8
    },
    instructions: 'Inhale for 4, hold for 7, exhale for 8. Repeat the cycle.',
    benefits: 'Helps reduce nighttime cortisol spikes and promotes faster sleep onset.',
    icon: '🌙'
  },
  {
    id: 'buteyko-method',
    name: 'Buteyko Method',
    description: 'Focuses on nasal breathing and breath retention to improve oxygen efficiency.',
    category: 'sleep',
    duration: 600, // 10 minutes
    pattern: {
      inhale: 3,
      exhale: 3,
      pause: 3
    },
    instructions: 'Breathe gently through your nose with controlled pauses between breaths.',
    benefits: 'Improves sleep quality, especially useful for people with sleep apnea.',
    icon: '👃'
  },
  {
    id: 'wim-hof-breathing',
    name: 'Wim Hof Breathing',
    description: 'Cycles of hyperventilation and breath retention increase adrenaline.',
    category: 'energy',
    duration: 900, // 15 minutes
    pattern: {
      inhale: 2,
      exhale: 2
    },
    instructions: '30 deep breaths followed by breath retention. Repeat 3-4 cycles.',
    benefits: 'Oxygenates tissues, giving a short-term energy and alertness boost.',
    icon: '❄️'
  },
  {
    id: 'extended-exhalation',
    name: 'Extended Exhalation',
    description: 'Slow exhalations elevate GABA levels and calm internal chatter.',
    category: 'focus',
    duration: 360, // 6 minutes
    pattern: {
      inhale: 4,
      exhale: 8
    },
    instructions: 'Inhale normally, then exhale twice as long to activate your calm response.',
    benefits: 'Enhances focus—ideal for mentally overwhelmed users needing clarity.',
    icon: '🎯'
  }
];

export const painPointToTechniques = {
  'anxiety': ['box-breathing', 'physiological-sigh', 'coherence-breathing'],
  'sleep': ['4-7-8-breathing', 'buteyko-method'],
  'focus': ['extended-exhalation', 'coherence-breathing'],
  'energy': ['wim-hof-breathing'],
  'stress': ['box-breathing', 'physiological-sigh'],
  'overwhelmed': ['extended-exhalation', 'coherence-breathing'],
  'tired': ['wim-hof-breathing'],
  'restless': ['4-7-8-breathing', 'buteyko-method']
};

export function recommendTechniques(userInput: string): BreathingTechnique[] {
  const input = userInput.toLowerCase();
  
  // Simple keyword matching for MVP
  const keywords = Object.keys(painPointToTechniques);
  const matchedKeywords = keywords.filter(keyword => input.includes(keyword));
  
  if (matchedKeywords.length === 0) {
    // Default recommendations
    return breathingTechniques.slice(0, 3);
  }
  
  const recommendedIds = new Set<string>();
  matchedKeywords.forEach(keyword => {
    const techniques = painPointToTechniques[keyword as keyof typeof painPointToTechniques];
    if (techniques) {
      techniques.forEach(id => recommendedIds.add(id));
    }
  });
  
  const recommendedTechniques = Array.from(recommendedIds)
    .map(id => breathingTechniques.find(t => t.id === id))
    .filter((technique): technique is BreathingTechnique => technique !== undefined)
    .slice(0, 3);
  
  return recommendedTechniques;
}