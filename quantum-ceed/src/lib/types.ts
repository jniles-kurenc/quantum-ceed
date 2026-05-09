export type PurchaseMode = 'gift' | 'self';
export type CoachVoice = 'male' | 'female';
export type Phase = 'foundation' | 'activation' | 'optimization';

export interface UserProfile {
  name: string;
  partnerName?: string;
  mode: PurchaseMode;
  coachVoice: CoachVoice;
  startDateISO: string; // ISO date string of program Day 1
  personality?: {
    motivation: string;
    challenges: string;
    style: 'gentle' | 'direct' | 'playful';
  };
  reminders: {
    morning: string; // HH:MM
    evening: string;
    night: string;
  };
}

export interface DailyTask {
  id: string;
  title: string;
  category: 'habit' | 'workout' | 'meal' | 'mindset' | 'test';
  description?: string;
  requiresPhoto?: boolean;
}

export interface DailyLog {
  dateISO: string; // YYYY-MM-DD
  completed: Record<string, boolean>; // taskId -> done
  photos: Record<string, string>; // taskId -> uri
  spermTest?: {
    taken: boolean;
    motilityPct?: number;
    concentrationMillionPerMl?: number;
    notes?: string;
  };
  mood?: 1 | 2 | 3 | 4 | 5;
}

export interface OnboardingState {
  completed: boolean;
  voiceSessionSecondsRecorded: number;
}
