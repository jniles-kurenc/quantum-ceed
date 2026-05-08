export type PurchaseMode = 'gift' | 'self' | null;
export type VoiceGender = 'male' | 'female';
export type Phase = 1 | 2 | 3;

export interface UserProfile {
  name: string;
  age: number;
  partnerName?: string;
  purchaseMode: PurchaseMode;
  voiceGender: VoiceGender;
  startDate: string;
  currentDay: number;
  onboardingComplete: boolean;
}

export interface DailyTask {
  id: string;
  title: string;
  category: 'workout' | 'nutrition' | 'supplement' | 'habit' | 'mindset';
  completed: boolean;
  requiresPhoto: boolean;
  photoUrl?: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening';
}

export interface Habit {
  id: string;
  name: string;
  icon: string;
  streak: number;
  completedToday: boolean;
}

export interface SpermTest {
  day: 1 | 45 | 90;
  date?: string;
  motility?: number;
  concentration?: number;
  morphology?: number;
  completed: boolean;
  notifiedPartner: boolean;
}

export interface Meal {
  id: string;
  name: string;
  time: string;
  calories: number;
  protein: number;
  description: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  phase: Phase;
}

export interface PartnerUpdate {
  date: string;
  type: 'task_complete' | 'sperm_test' | 'phase_complete' | 'streak';
  message: string;
  read: boolean;
}

export interface Reminder {
  id: string;
  time: string;
  label: string;
  enabled: boolean;
  type: 'morning' | 'evening' | 'night';
}
