import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { SPERM_TEST_DAYS } from './program';
import type { UserProfile } from './types';

const ID_PREFIX = 'qc-';

type ReminderSlot = 'morning' | 'evening' | 'night';

export interface NotificationPayload {
  kind: 'reminder' | 'test';
  slot?: ReminderSlot;
  day?: number;
}

const REMINDER_BODY: Record<ReminderSlot, { title: string; body: string }> = {
  morning: {
    title: 'Morning intention',
    body: 'Hydrate, sunlight, own the first hour. Tap to talk with your coach.',
  },
  evening: {
    title: 'Evening movement',
    body: 'Time to move. Strong man, strong sperm. Tap to check in.',
  },
  night: {
    title: 'Night wind-down',
    body: 'Phone down, lights low. Recovery is where it happens. Tap to wrap up.',
  },
};

// Foreground behavior: still show banner + play sound.
export function configureNotificationHandler() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

export async function ensureNotificationSetup(): Promise<boolean> {
  const settings = await Notifications.getPermissionsAsync();
  let granted =
    settings.granted ||
    settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
  if (!granted) {
    const req = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowSound: true,
        allowBadge: false,
      },
    });
    granted = req.granted;
  }
  if (!granted) return false;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('coach', {
      name: 'Voice AI Coach',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 200, 150, 200],
      lightColor: '#E8C76A',
      sound: 'default',
    });
    await Notifications.setNotificationChannelAsync('tests', {
      name: 'Sperm tests',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
    });
  }
  return true;
}

export async function rescheduleAll(profile: UserProfile): Promise<void> {
  await cancelAll();

  const slots: { slot: ReminderSlot; time: string }[] = [
    { slot: 'morning', time: profile.reminders.morning },
    { slot: 'evening', time: profile.reminders.evening },
    { slot: 'night', time: profile.reminders.night },
  ];

  for (const s of slots) {
    const [h, m] = s.time.split(':').map((n) => parseInt(n, 10));
    if (Number.isNaN(h) || Number.isNaN(m)) continue;
    const body = REMINDER_BODY[s.slot];
    const data: NotificationPayload = { kind: 'reminder', slot: s.slot };
    await Notifications.scheduleNotificationAsync({
      identifier: `${ID_PREFIX}${s.slot}`,
      content: {
        title: body.title,
        body: body.body,
        data,
        sound: 'default',
        ...(Platform.OS === 'android' ? { channelId: 'coach' } : {}),
      },
      trigger: {
        hour: h,
        minute: m,
        repeats: true,
      } as Notifications.DailyTriggerInput,
    });
  }

  // Sperm-test reminders on Day 1, 45, 90 at 9:00 local.
  const start = new Date(profile.startDateISO + 'T09:00:00');
  for (const d of SPERM_TEST_DAYS) {
    const date = new Date(start);
    date.setDate(date.getDate() + (d - 1));
    if (date.getTime() <= Date.now() + 60 * 1000) continue; // skip past / too-soon
    const data: NotificationPayload = { kind: 'test', day: d };
    await Notifications.scheduleNotificationAsync({
      identifier: `${ID_PREFIX}test-${d}`,
      content: {
        title: 'YO Sperm Test today',
        body: `Day ${d} of Quantum Ceed — time to use your YO test kit.`,
        data,
        sound: 'default',
        ...(Platform.OS === 'android' ? { channelId: 'tests' } : {}),
      },
      trigger: { date } as Notifications.DateTriggerInput,
    });
  }
}

export async function cancelAll(): Promise<void> {
  const all = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    all
      .filter((n) => n.identifier.startsWith(ID_PREFIX))
      .map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier)),
  );
}

export async function listScheduled(): Promise<{ id: string; trigger: any }[]> {
  const all = await Notifications.getAllScheduledNotificationsAsync();
  return all
    .filter((n) => n.identifier.startsWith(ID_PREFIX))
    .map((n) => ({ id: n.identifier, trigger: n.trigger }));
}
