import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  UserProfile,
  DailyTask,
  Habit,
  SpermTest,
  PartnerUpdate,
  Reminder,
  PurchaseMode,
  VoiceGender,
} from '../types';
import { getTodaysTasks, getDefaultHabits, getDefaultReminders, getDefaultSpermTests } from '../data/defaults';

interface AppState {
  // User
  user: UserProfile | null;
  setUser: (user: UserProfile) => void;
  updateUser: (partial: Partial<UserProfile>) => void;

  // Onboarding
  purchaseMode: PurchaseMode;
  setPurchaseMode: (mode: PurchaseMode) => void;
  onboardingStep: number;
  setOnboardingStep: (step: number) => void;

  // Tasks
  tasks: DailyTask[];
  toggleTask: (id: string) => void;
  setTaskPhoto: (id: string, url: string) => void;

  // Habits
  habits: Habit[];
  toggleHabit: (id: string) => void;

  // Sperm Tests
  spermTests: SpermTest[];
  updateSpermTest: (day: 1 | 45 | 90, data: Partial<SpermTest>) => void;

  // Partner updates
  partnerUpdates: PartnerUpdate[];
  addPartnerUpdate: (update: PartnerUpdate) => void;
  markUpdateRead: (index: number) => void;

  // Reminders
  reminders: Reminder[];
  toggleReminder: (id: string) => void;
  updateReminderTime: (id: string, time: string) => void;

  // Voice
  voiceGender: VoiceGender;
  setVoiceGender: (gender: VoiceGender) => void;
  isListening: boolean;
  setIsListening: (v: boolean) => void;
  isSpeaking: boolean;
  setIsSpeaking: (v: boolean) => void;

  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Reset
  resetAll: () => void;
}

const initialHabits = getDefaultHabits();
const initialTasks = getTodaysTasks(1);
const initialReminders = getDefaultReminders();
const initialSpermTests = getDefaultSpermTests();

export const useAppStore = create<AppState>()(
  persist(
    (set, _get) => ({
      user: null,
      setUser: (user) => set({ user }),
      updateUser: (partial) =>
        set((s) => ({ user: s.user ? { ...s.user, ...partial } : null })),

      purchaseMode: null,
      setPurchaseMode: (mode) => set({ purchaseMode: mode }),

      onboardingStep: 0,
      setOnboardingStep: (step) => set({ onboardingStep: step }),

      tasks: initialTasks,
      toggleTask: (id) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t
          ),
        })),
      setTaskPhoto: (id, url) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === id ? { ...t, photoUrl: url, completed: true } : t
          ),
        })),

      habits: initialHabits,
      toggleHabit: (id) =>
        set((s) => ({
          habits: s.habits.map((h) =>
            h.id === id
              ? {
                  ...h,
                  completedToday: !h.completedToday,
                  streak: !h.completedToday ? h.streak + 1 : Math.max(0, h.streak - 1),
                }
              : h
          ),
        })),

      spermTests: initialSpermTests,
      updateSpermTest: (day, data) =>
        set((s) => ({
          spermTests: s.spermTests.map((t) =>
            t.day === day ? { ...t, ...data } : t
          ),
        })),

      partnerUpdates: [],
      addPartnerUpdate: (update) =>
        set((s) => ({ partnerUpdates: [update, ...s.partnerUpdates] })),
      markUpdateRead: (index) =>
        set((s) => ({
          partnerUpdates: s.partnerUpdates.map((u, i) =>
            i === index ? { ...u, read: true } : u
          ),
        })),

      reminders: initialReminders,
      toggleReminder: (id) =>
        set((s) => ({
          reminders: s.reminders.map((r) =>
            r.id === id ? { ...r, enabled: !r.enabled } : r
          ),
        })),
      updateReminderTime: (id, time) =>
        set((s) => ({
          reminders: s.reminders.map((r) =>
            r.id === id ? { ...r, time } : r
          ),
        })),

      voiceGender: 'male',
      setVoiceGender: (gender) => set({ voiceGender: gender }),
      isListening: false,
      setIsListening: (v) => set({ isListening: v }),
      isSpeaking: false,
      setIsSpeaking: (v) => set({ isSpeaking: v }),

      activeTab: 'home',
      setActiveTab: (tab) => set({ activeTab: tab }),

      resetAll: () =>
        set({
          user: null,
          purchaseMode: null,
          onboardingStep: 0,
          tasks: getTodaysTasks(1),
          habits: getDefaultHabits(),
          spermTests: getDefaultSpermTests(),
          partnerUpdates: [],
          reminders: getDefaultReminders(),
          activeTab: 'home',
        }),
    }),
    {
      name: 'quantum-ceed-storage',
      partialize: (state) => ({
        user: state.user,
        purchaseMode: state.purchaseMode,
        onboardingStep: state.onboardingStep,
        tasks: state.tasks,
        habits: state.habits,
        spermTests: state.spermTests,
        partnerUpdates: state.partnerUpdates,
        reminders: state.reminders,
        voiceGender: state.voiceGender,
      }),
    }
  )
);
