import type { DailyTask, Habit, Reminder, SpermTest, Meal, Phase } from '../types';

export function getTodaysTasks(day: number): DailyTask[] {
  const phase = day <= 30 ? 1 : day <= 60 ? 2 : 3;
  const base: DailyTask[] = [
    {
      id: 'morning-water',
      title: 'Drink 500ml water upon waking',
      category: 'habit',
      completed: false,
      requiresPhoto: false,
      timeOfDay: 'morning',
    },
    {
      id: 'morning-supplement',
      title: 'Take morning supplements',
      category: 'supplement',
      completed: false,
      requiresPhoto: false,
      timeOfDay: 'morning',
    },
    {
      id: 'workout',
      title: phase === 1 ? 'Foundation workout (30 min)' : phase === 2 ? 'Activation strength training (40 min)' : 'Optimization HIIT circuit (45 min)',
      category: 'workout',
      completed: false,
      requiresPhoto: true,
      timeOfDay: 'morning',
    },
    {
      id: 'meal-log',
      title: 'Log your meals for today',
      category: 'nutrition',
      completed: false,
      requiresPhoto: true,
      timeOfDay: 'afternoon',
    },
    {
      id: 'evening-walk',
      title: '20-min evening walk',
      category: 'habit',
      completed: false,
      requiresPhoto: false,
      timeOfDay: 'evening',
    },
    {
      id: 'evening-supplement',
      title: 'Take evening supplements',
      category: 'supplement',
      completed: false,
      requiresPhoto: false,
      timeOfDay: 'evening',
    },
    {
      id: 'mindset',
      title: 'Evening reflection (5 min journaling)',
      category: 'mindset',
      completed: false,
      requiresPhoto: false,
      timeOfDay: 'evening',
    },
    {
      id: 'sleep',
      title: 'In bed by 10:30 PM',
      category: 'habit',
      completed: false,
      requiresPhoto: false,
      timeOfDay: 'evening',
    },
  ];

  if (day === 1 || day === 45 || day === 90) {
    base.push({
      id: 'sperm-test',
      title: `YO Sperm Test — Day ${day}`,
      category: 'habit',
      completed: false,
      requiresPhoto: true,
      timeOfDay: 'morning',
    });
  }

  return base;
}

export function getDefaultHabits(): Habit[] {
  return [
    { id: 'h1', name: 'Cold shower', icon: '🚿', streak: 0, completedToday: false },
    { id: 'h2', name: 'No alcohol', icon: '🚫', streak: 0, completedToday: false },
    { id: 'h3', name: 'No smoking', icon: '🚭', streak: 0, completedToday: false },
    { id: 'h4', name: 'Meditation', icon: '🧘', streak: 0, completedToday: false },
    { id: 'h5', name: '7+ hrs sleep', icon: '😴', streak: 0, completedToday: false },
    { id: 'h6', name: 'No junk food', icon: '🥗', streak: 0, completedToday: false },
    { id: 'h7', name: 'Supplements', icon: '💊', streak: 0, completedToday: false },
    { id: 'h8', name: 'Hydration 2L', icon: '💧', streak: 0, completedToday: false },
  ];
}

export function getDefaultReminders(): Reminder[] {
  return [
    { id: 'r1', time: '07:00', label: 'Good morning – start your day strong', enabled: true, type: 'morning' },
    { id: 'r2', time: '13:00', label: 'Midday check-in with your coach', enabled: true, type: 'evening' },
    { id: 'r3', time: '21:00', label: 'Evening reflection & wind-down', enabled: true, type: 'night' },
  ];
}

export function getDefaultSpermTests(): SpermTest[] {
  return [
    { day: 1, completed: false, notifiedPartner: false },
    { day: 45, completed: false, notifiedPartner: false },
    { day: 90, completed: false, notifiedPartner: false },
  ];
}

export function getMealPlan(phase: Phase): Meal[] {
  const meals: Record<Phase, Meal[]> = {
    1: [
      { id: 'm1', name: 'Fertility Smoothie Bowl', time: '7:30 AM', calories: 420, protein: 22, description: 'Banana, berries, spinach, hemp seeds, zinc-rich pumpkin seeds', category: 'breakfast', phase: 1 },
      { id: 'm2', name: 'Salmon & Quinoa Bowl', time: '12:30 PM', calories: 580, protein: 42, description: 'Wild salmon, quinoa, avocado, leafy greens, olive oil dressing', category: 'lunch', phase: 1 },
      { id: 'm3', name: 'Walnut Energy Snack', time: '3:30 PM', calories: 200, protein: 6, description: 'Raw walnuts, dark chocolate (85%), green tea', category: 'snack', phase: 1 },
      { id: 'm4', name: 'Grilled Chicken & Veg', time: '7:00 PM', calories: 620, protein: 48, description: 'Free-range chicken, roasted vegetables, sweet potato, turmeric', category: 'dinner', phase: 1 },
    ],
    2: [
      { id: 'm5', name: 'Egg & Veggie Scramble', time: '7:00 AM', calories: 480, protein: 32, description: 'Pasture eggs, bell peppers, spinach, feta, sourdough', category: 'breakfast', phase: 2 },
      { id: 'm6', name: 'Turkey & Avocado Wrap', time: '12:00 PM', calories: 560, protein: 40, description: 'Turkey breast, avocado, mixed greens, whole grain wrap', category: 'lunch', phase: 2 },
      { id: 'm7', name: 'Greek Yogurt & Seeds', time: '4:00 PM', calories: 220, protein: 14, description: 'Full-fat Greek yogurt, chia seeds, berries, honey', category: 'snack', phase: 2 },
      { id: 'm8', name: 'Beef & Broccoli Stir-fry', time: '7:00 PM', calories: 640, protein: 52, description: 'Grass-fed beef, broccoli, brown rice, ginger, garlic', category: 'dinner', phase: 2 },
    ],
    3: [
      { id: 'm9', name: 'Protein Power Bowl', time: '7:00 AM', calories: 520, protein: 38, description: 'Overnight oats, protein powder, maca root, blueberries, almond butter', category: 'breakfast', phase: 3 },
      { id: 'm10', name: 'Tuna & Sweet Potato', time: '12:00 PM', calories: 600, protein: 46, description: 'Yellowfin tuna, roasted sweet potato, arugula, lemon tahini', category: 'lunch', phase: 3 },
      { id: 'm11', name: 'Celery & Almond Butter', time: '3:30 PM', calories: 180, protein: 8, description: 'Celery sticks, natural almond butter, apple slices', category: 'snack', phase: 3 },
      { id: 'm12', name: 'Lamb & Lentils', time: '7:00 PM', calories: 660, protein: 55, description: 'Grass-fed lamb, lentils, roasted roots, mint yogurt sauce', category: 'dinner', phase: 3 },
    ],
  };
  return meals[phase];
}

export const PHASE_INFO = {
  1: {
    name: 'Foundation',
    subtitle: 'Days 1–30',
    description: 'Detox, establish habits, and build the base nutritional framework for sperm health.',
    color: 'from-forest-800 to-forest-900',
    accent: '#0d6249',
    icon: '🌱',
    focus: ['Detoxification', 'Basic nutrition', 'Sleep optimization', 'Stress reduction'],
  },
  2: {
    name: 'Activation',
    subtitle: 'Days 31–60',
    description: 'Intensify training, optimize hormones, and activate cellular repair mechanisms.',
    color: 'from-gold-700 to-gold-900',
    accent: '#D4A847',
    icon: '⚡',
    focus: ['Hormone optimization', 'Strength training', 'Targeted supplementation', 'Cold therapy'],
  },
  3: {
    name: 'Optimization',
    subtitle: 'Days 61–90',
    description: 'Peak performance phase—maximize sperm quality before final Day 90 test.',
    color: 'from-purple-800 to-purple-950',
    accent: '#9333ea',
    icon: '🏆',
    focus: ['Peak sperm optimization', 'Advanced protocols', 'Mind-body integration', 'Final test prep'],
  },
};

export const VOICE_MESSAGES = {
  morning: [
    "Good morning, champion. Today is another step toward your peak. Let's crush it.",
    "Rise and shine. Your cells are regenerating. Give them the best environment today.",
    "Morning. Your consistency is building something powerful. Don't stop now.",
  ],
  evening: [
    "Great work today. Rest is where the magic happens—protect your sleep.",
    "You showed up today. That's what matters. Tomorrow we go again.",
    "Evening check-in. How did today feel? Your body is transforming, trust the process.",
  ],
  coach: [
    "I'm here. What's on your mind today?",
    "Let's talk. How are you feeling on your journey?",
    "Your AI coach is listening. What do you need right now?",
  ],
};

export const SUPPORT_TIPS_FOR_PARTNER = [
  "Prepare his fertility smoothie in the morning—it takes 5 minutes and means the world.",
  "Remind him gently about his evening supplements, but don't nag. He's got this.",
  "Create a calm sleep environment—dim lights at 9 PM, phones down by 10 PM.",
  "Join him for evening walks when you can. Moving together builds connection.",
  "Stock the kitchen with his meal plan foods. Make healthy eating easy for him.",
  "Celebrate his streaks! A simple 'I'm proud of you' goes a long way.",
  "Reduce household stress. A calm man produces better results—in every way.",
  "Ask him how his coach sessions went. Show genuine curiosity about his journey.",
];
