import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import * as Notifications from 'expo-notifications';
import {
  getOnboarding,
  getProfile,
  saveOnboarding,
  saveProfile,
  resetAll,
} from './storage';
import {
  cancelAll as cancelAllNotifications,
  configureNotificationHandler,
  ensureNotificationSetup,
  rescheduleAll,
  type NotificationPayload,
} from './notifications';
import type { OnboardingState, UserProfile } from './types';

type CoachSlot = 'morning' | 'evening' | 'night';

interface PendingRoute {
  kind: 'coach' | 'tests';
  autoSpeakSlot?: CoachSlot;
}

interface AppContextValue {
  loading: boolean;
  profile: UserProfile | null;
  onboarding: OnboardingState;
  pendingRoute: PendingRoute | null;
  setPendingRoute: (r: PendingRoute | null) => void;
  setProfile: (p: UserProfile) => Promise<void>;
  updateProfile: (patch: Partial<UserProfile>) => Promise<void>;
  setOnboarding: (s: OnboardingState) => Promise<void>;
  reset: () => Promise<void>;
  enableNotifications: () => Promise<boolean>;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

configureNotificationHandler();

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfileState] = useState<UserProfile | null>(null);
  const [onboarding, setOnboardingState] = useState<OnboardingState>({
    completed: false,
    voiceSessionSecondsRecorded: 0,
  });
  const [pendingRoute, setPendingRoute] = useState<PendingRoute | null>(null);
  const lastReminderHash = useRef<string>('');

  // Initial load.
  useEffect(() => {
    (async () => {
      const [p, o] = await Promise.all([getProfile(), getOnboarding()]);
      setProfileState(p);
      setOnboardingState(o);
      setLoading(false);
    })();
  }, []);

  // Listen for notification taps. Route to coach (with autoSpeakSlot) or tests.
  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener((resp) => {
      const data = resp.notification.request.content.data as
        | NotificationPayload
        | undefined;
      if (!data) return;
      if (data.kind === 'reminder' && data.slot) {
        setPendingRoute({ kind: 'coach', autoSpeakSlot: data.slot });
      } else if (data.kind === 'test') {
        setPendingRoute({ kind: 'tests' });
      }
    });

    // Handle the case where the app was launched cold by tapping a notif.
    Notifications.getLastNotificationResponseAsync().then((resp) => {
      const data = resp?.notification.request.content.data as
        | NotificationPayload
        | undefined;
      if (!data) return;
      if (data.kind === 'reminder' && data.slot) {
        setPendingRoute({ kind: 'coach', autoSpeakSlot: data.slot });
      } else if (data.kind === 'test') {
        setPendingRoute({ kind: 'tests' });
      }
    });
    return () => sub.remove();
  }, []);

  // Reschedule notifications whenever the schedule-relevant fields change.
  useEffect(() => {
    if (!profile || !onboarding.completed) return;
    const hash = JSON.stringify({
      r: profile.reminders,
      s: profile.startDateISO,
    });
    if (hash === lastReminderHash.current) return;
    lastReminderHash.current = hash;
    (async () => {
      const ok = await ensureNotificationSetup();
      if (ok) {
        try {
          await rescheduleAll(profile);
        } catch {}
      }
    })();
  }, [
    profile,
    onboarding.completed,
  ]);

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
    await cancelAllNotifications().catch(() => {});
    await resetAll();
    setProfileState(null);
    setOnboardingState({ completed: false, voiceSessionSecondsRecorded: 0 });
    lastReminderHash.current = '';
  }, []);

  const enableNotifications = useCallback(async () => {
    const ok = await ensureNotificationSetup();
    if (ok && profile) {
      await rescheduleAll(profile);
    }
    return ok;
  }, [profile]);

  const value = useMemo<AppContextValue>(
    () => ({
      loading,
      profile,
      onboarding,
      pendingRoute,
      setPendingRoute,
      setProfile,
      updateProfile,
      setOnboarding,
      reset,
      enableNotifications,
    }),
    [
      loading,
      profile,
      onboarding,
      pendingRoute,
      setProfile,
      updateProfile,
      setOnboarding,
      reset,
      enableNotifications,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
