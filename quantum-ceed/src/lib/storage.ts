import AsyncStorage from '@react-native-async-storage/async-storage';
import type { DailyLog, OnboardingState, UserProfile } from './types';

const KEYS = {
  profile: 'qc.profile.v1',
  onboarding: 'qc.onboarding.v1',
  log: (dateISO: string) => `qc.log.${dateISO}`,
  logIndex: 'qc.log.index.v1',
};

export async function getProfile(): Promise<UserProfile | null> {
  const raw = await AsyncStorage.getItem(KEYS.profile);
  return raw ? (JSON.parse(raw) as UserProfile) : null;
}

export async function saveProfile(profile: UserProfile): Promise<void> {
  await AsyncStorage.setItem(KEYS.profile, JSON.stringify(profile));
}

export async function clearProfile(): Promise<void> {
  await AsyncStorage.removeItem(KEYS.profile);
}

export async function getOnboarding(): Promise<OnboardingState> {
  const raw = await AsyncStorage.getItem(KEYS.onboarding);
  return raw
    ? (JSON.parse(raw) as OnboardingState)
    : { completed: false, voiceSessionSecondsRecorded: 0 };
}

export async function saveOnboarding(state: OnboardingState): Promise<void> {
  await AsyncStorage.setItem(KEYS.onboarding, JSON.stringify(state));
}

export async function getLog(dateISO: string): Promise<DailyLog> {
  const raw = await AsyncStorage.getItem(KEYS.log(dateISO));
  if (raw) return JSON.parse(raw) as DailyLog;
  return { dateISO, completed: {}, photos: {} };
}

export async function saveLog(log: DailyLog): Promise<void> {
  await AsyncStorage.setItem(KEYS.log(log.dateISO), JSON.stringify(log));
  const idxRaw = await AsyncStorage.getItem(KEYS.logIndex);
  const idx = new Set<string>(idxRaw ? JSON.parse(idxRaw) : []);
  idx.add(log.dateISO);
  await AsyncStorage.setItem(KEYS.logIndex, JSON.stringify(Array.from(idx)));
}

export async function getAllLogs(): Promise<DailyLog[]> {
  const idxRaw = await AsyncStorage.getItem(KEYS.logIndex);
  const idx: string[] = idxRaw ? JSON.parse(idxRaw) : [];
  const logs = await Promise.all(idx.map((d) => getLog(d)));
  return logs.sort((a, b) => a.dateISO.localeCompare(b.dateISO));
}

export async function resetAll(): Promise<void> {
  const idxRaw = await AsyncStorage.getItem(KEYS.logIndex);
  const idx: string[] = idxRaw ? JSON.parse(idxRaw) : [];
  await AsyncStorage.multiRemove([
    KEYS.profile,
    KEYS.onboarding,
    KEYS.logIndex,
    ...idx.map((d) => KEYS.log(d)),
  ]);
}
