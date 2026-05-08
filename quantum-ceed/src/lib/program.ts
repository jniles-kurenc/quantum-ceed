import type { DailyTask, Phase } from './types';

export const PROGRAM_LENGTH_DAYS = 90;
export const SPERM_TEST_DAYS = [1, 45, 90] as const;

export function getDayNumber(startDateISO: string, now: Date = new Date()): number {
  const start = new Date(startDateISO + 'T00:00:00');
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(1, Math.min(PROGRAM_LENGTH_DAYS, diff + 1));
}

export function getPhase(day: number): Phase {
  if (day <= 30) return 'foundation';
  if (day <= 60) return 'activation';
  return 'optimization';
}

export function getPhaseInfo(phase: Phase): {
  label: string;
  month: string;
  description: string;
  focus: string[];
} {
  switch (phase) {
    case 'foundation':
      return {
        label: 'Foundation',
        month: 'Month 1',
        description: 'Lay the groundwork. Reset sleep, hydration, and morning rituals.',
        focus: ['Hydration', 'Sleep hygiene', 'Walking 8k steps', 'Cut alcohol & seed oils'],
      };
    case 'activation':
      return {
        label: 'Activation',
        month: 'Month 2',
        description: 'Activate strength and circulation. Add resistance training and cold exposure.',
        focus: ['Resistance training 4x/wk', 'Cold exposure', 'Heart-rate zone 2', 'Pelvic floor work'],
      };
    case 'optimization':
      return {
        label: 'Optimization',
        month: 'Month 3',
        description: 'Optimize hormones, recovery, and stress. Dial in your peak.',
        focus: ['HRV recovery', 'Targeted micronutrients', 'Stress mastery', 'Sperm-friendly cooling'],
      };
  }
}

export function getDailyTasks(day: number): DailyTask[] {
  const phase = getPhase(day);
  const base: DailyTask[] = [
    {
      id: 'hydrate',
      title: 'Drink 3L of clean water',
      category: 'habit',
      description: 'Add a pinch of sea salt to your first glass.',
    },
    {
      id: 'sleep',
      title: '7+ hours of sleep last night',
      category: 'habit',
    },
    {
      id: 'sun',
      title: '10 min of morning sunlight',
      category: 'habit',
      description: 'Get outside within 30 min of waking.',
    },
    {
      id: 'meal-breakfast',
      title: 'Protein-forward breakfast',
      category: 'meal',
      description: 'Target 35g protein. Eggs, salmon, or grass-fed beef.',
      requiresPhoto: true,
    },
    {
      id: 'meal-lunch',
      title: 'Whole-food lunch',
      category: 'meal',
      description: 'Plate: 1 palm protein, 2 fists greens, 1 thumb fats.',
      requiresPhoto: true,
    },
    {
      id: 'meal-dinner',
      title: 'Early dinner (before 7pm)',
      category: 'meal',
      requiresPhoto: true,
    },
    {
      id: 'mindset',
      title: '5-min breath + intention',
      category: 'mindset',
      description: 'Box breathing 4-4-4-4. Set one intention.',
    },
  ];

  if (phase === 'foundation') {
    base.push({
      id: 'walk',
      title: '8,000 steps walk',
      category: 'workout',
      requiresPhoto: true,
    });
  } else if (phase === 'activation') {
    base.push({
      id: 'lift',
      title: 'Strength session (45 min)',
      category: 'workout',
      description: 'Compound lifts: squat, hinge, push, pull, carry.',
      requiresPhoto: true,
    });
    base.push({
      id: 'cold',
      title: 'Cold exposure (2–3 min)',
      category: 'habit',
    });
  } else {
    base.push({
      id: 'lift',
      title: 'Strength + zone 2 cardio',
      category: 'workout',
      description: '30 min lift + 20 min zone 2.',
      requiresPhoto: true,
    });
    base.push({
      id: 'cool',
      title: 'Sperm-friendly cooling',
      category: 'habit',
      description: 'Loose-fit underwear, no laptop on lap, cool boxers.',
    });
  }

  if (day === 1 || day === 45 || day === 90) {
    base.unshift({
      id: 'spermtest',
      title: 'YO Sperm Test today',
      category: 'test',
      description: 'Use the YO Sperm Test kit and log the result.',
    });
  }

  return base;
}

export interface MealPlanEntry {
  meal: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  time: string;
  items: string[];
  notes?: string;
}

export function getMealPlan(day: number): MealPlanEntry[] {
  const phase = getPhase(day);
  const breakfast: MealPlanEntry = {
    meal: 'Breakfast',
    time: '7:30 AM',
    items: ['3 pasture eggs', 'Avocado', 'Sourdough', 'Sea salt + EVOO'],
    notes: 'Aim for 35g protein and healthy fats.',
  };
  const lunch: MealPlanEntry = {
    meal: 'Lunch',
    time: '12:30 PM',
    items:
      phase === 'foundation'
        ? ['Grilled chicken thigh', 'Mixed greens', 'Roasted sweet potato', 'Olive oil']
        : ['Wild salmon', 'Quinoa', 'Steamed broccoli', 'Tahini drizzle'],
  };
  const snack: MealPlanEntry = {
    meal: 'Snack',
    time: '3:30 PM',
    items: ['Brazil nuts (2)', 'Pumpkin seeds', 'Dark chocolate 85%'],
    notes: 'Selenium + zinc — both critical for sperm health.',
  };
  const dinner: MealPlanEntry = {
    meal: 'Dinner',
    time: '6:30 PM',
    items:
      phase === 'optimization'
        ? ['Grass-fed steak (6 oz)', 'Kale + garlic', 'Roasted carrots', 'Bone broth']
        : ['Roast chicken', 'Asparagus', 'Wild rice', 'Lemon + herbs'],
    notes: 'Finish eating 3+ hours before bed.',
  };
  return [breakfast, lunch, snack, dinner];
}

export interface CoachLine {
  slot: 'morning' | 'evening' | 'night';
  text: (name: string, day: number) => string;
}

export const COACH_REMINDERS: CoachLine[] = [
  {
    slot: 'morning',
    text: (n, d) =>
      `Good morning ${n}. It is day ${d} of your Quantum Ceed journey. Hydrate, get sunlight, and own the first hour.`,
  },
  {
    slot: 'evening',
    text: (n, d) =>
      `${n}, you're on day ${d}. Time to move your body. Strong man, strong sperm. Show up for yourself.`,
  },
  {
    slot: 'night',
    text: (n, d) =>
      `${n}, wind down. No screens for the next hour. Cool, dark room. Recovery is where transformation happens. Day ${d} done.`,
  },
];

export function nextSpermTestDay(day: number): number | null {
  const upcoming = SPERM_TEST_DAYS.find((d) => d >= day);
  return upcoming ?? null;
}
