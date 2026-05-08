import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  getOnboarding,
  getProfile,
  saveOnboarding,
  saveProfile,
  resetAll,
} from './storage';
import type { OnboardingState, UserProfile } from './types';

interface AppContextValue {
  loading: boolean;
  profile: UserProfile | null;
  onboarding: OnboardingState;
  setProfile: (p: UserProfile) => Promise<void>;
  updateProfile: (patch: Partial<UserProfile>) => Promise<void>;
  setOnboarding: (s: OnboardingState) => Promise<void>;
  reset: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfileState] = useState<UserProfile | null>(null);
  const [onboarding, setOnboardingState] = useState<OnboardingState>({
    completed: false,
    voiceSessionSecondsRecorded: 0,
  });

  useEffect(() => {
    (async () => {
      const [p, o] = await Promise.all([getProfile(), getOnboarding()]);
      setProfileState(p);
      setOnboardingState(o);
      setLoading(false);
    })();
  }, []);

  const setProfile = useCallback(async (p: UserProfile) => {
    await saveProfile(p);
    setProfileState(p);
  }, []);

  const updateProfile = useCallback(
    async (patch: Partial<UserProfile>) => {
      if (!profile) return;
      const next = { ...profile, ...patch };
      await saveProfile(next);
      setProfileState(next);
    },
    [profile],
  );

  const setOnboarding = useCallback(async (s: OnboardingState) => {
    await saveOnboarding(s);
    setOnboardingState(s);
  }, []);

  const reset = useCallback(async () => {
    await resetAll();
    setProfileState(null);
    setOnboardingState({ completed: false, voiceSessionSecondsRecorded: 0 });
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      loading,
      profile,
      onboarding,
      setProfile,
      updateProfile,
      setOnboarding,
      reset,
    }),
    [loading, profile, onboarding, setProfile, updateProfile, setOnboarding, reset],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
