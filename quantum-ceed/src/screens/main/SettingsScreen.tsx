import React, { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import * as Notifications from 'expo-notifications';
import { ScreenContainer } from '../../components/ScreenContainer';
import { SectionHeader } from '../../components/SectionHeader';
import { Card } from '../../components/Card';
import { Pill } from '../../components/Pill';
import { QCButton } from '../../components/QCButton';
import { colors, radii, spacing, typography } from '../../lib/theme';
import { useApp } from '../../lib/AppContext';
import type { CoachVoice } from '../../lib/types';
import { listScheduled } from '../../lib/notifications';

const TIME_OPTIONS = {
  morning: ['06:00', '06:30', '07:00', '07:30', '08:00'],
  evening: ['16:30', '17:00', '17:30', '18:00', '18:30'],
  night: ['21:00', '21:30', '22:00', '22:30', '23:00'],
};

export function SettingsScreen() {
  const { profile, updateProfile, reset, enableNotifications } = useApp();
  const [partnerEnabled, setPartnerEnabled] = useState(profile?.mode === 'gift');
  const [notifStatus, setNotifStatus] = useState<'unknown' | 'granted' | 'denied'>('unknown');
  const [scheduledCount, setScheduledCount] = useState<number>(0);

  useEffect(() => {
    (async () => {
      const perm = await Notifications.getPermissionsAsync();
      setNotifStatus(perm.granted ? 'granted' : 'denied');
      const list = await listScheduled();
      setScheduledCount(list.length);
    })();
  }, [profile?.reminders.morning, profile?.reminders.evening, profile?.reminders.night]);

  if (!profile) return null;

  const setVoice = (v: CoachVoice) => updateProfile({ coachVoice: v });

  const togglePartner = (val: boolean) => {
    setPartnerEnabled(val);
    updateProfile({ mode: val ? 'gift' : 'self' });
  };

  const setReminder = (key: 'morning' | 'evening' | 'night', value: string) => {
    updateProfile({
      reminders: { ...profile.reminders, [key]: value },
    });
  };

  const requestNotifs = async () => {
    const ok = await enableNotifications();
    setNotifStatus(ok ? 'granted' : 'denied');
    const list = await listScheduled();
    setScheduledCount(list.length);
    if (!ok) {
      Alert.alert(
        'Notifications disabled',
        'Open Settings to enable notifications for Quantum Ceed so your coach can check in.',
      );
    }
  };

  return (
    <ScreenContainer>
      <SectionHeader eyebrow="Settings" title={profile.name} subtitle={`Started ${profile.startDateISO}`} />

      <Card>
        <Text style={styles.label}>Coach voice</Text>
        <View style={styles.row}>
          {(['male', 'female'] as CoachVoice[]).map((v) => {
            const active = profile.coachVoice === v;
            return (
              <Pressable
                key={v}
                onPress={() => setVoice(v)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && { color: colors.bg }]}>
                  {v === 'male' ? 'Male' : 'Female'}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Card>

      <Card>
        <View style={styles.toggleRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Partner Dashboard</Text>
            <Text style={styles.help}>
              Toggle Gift mode to share progress with a partner. Off = Self-Love mode.
            </Text>
          </View>
          <Switch
            value={partnerEnabled}
            onValueChange={togglePartner}
            trackColor={{ true: colors.gold, false: colors.surfaceAlt }}
            thumbColor={colors.bg}
          />
        </View>
      </Card>

      <Card>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
          <Text style={[styles.label, { flex: 1 }]}>Voice reminders</Text>
          <Pill
            label={
              notifStatus === 'granted'
                ? `${scheduledCount} scheduled`
                : notifStatus === 'denied'
                  ? 'Notifications off'
                  : 'Tap to enable'
            }
            tone={notifStatus === 'granted' ? 'green' : 'muted'}
          />
        </View>

        {notifStatus !== 'granted' ? (
          <View style={{ marginTop: spacing.md }}>
            <QCButton title="Enable notifications" onPress={requestNotifs} variant="secondary" />
          </View>
        ) : null}

        <ReminderRow
          title="Morning"
          options={TIME_OPTIONS.morning}
          value={profile.reminders.morning}
          onChange={(t) => setReminder('morning', t)}
        />
        <ReminderRow
          title="Evening"
          options={TIME_OPTIONS.evening}
          value={profile.reminders.evening}
          onChange={(t) => setReminder('evening', t)}
        />
        <ReminderRow
          title="Night"
          options={TIME_OPTIONS.night}
          value={profile.reminders.night}
          onChange={(t) => setReminder('night', t)}
        />

        <Text style={[styles.help, { marginTop: spacing.md }]}>
          Sperm-test pings auto-schedule for Day 1, Day 45, and Day 90.
        </Text>
      </Card>

      <Card>
        <Text style={styles.label}>Coaching style</Text>
        <View style={styles.row}>
          {(['gentle', 'direct', 'playful'] as const).map((s) => {
            const active = profile.personality?.style === s;
            return (
              <Pressable
                key={s}
                onPress={() =>
                  updateProfile({
                    personality: {
                      motivation: profile.personality?.motivation ?? '',
                      challenges: profile.personality?.challenges ?? '',
                      style: s,
                    },
                  })
                }
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text
                  style={[
                    styles.chipText,
                    active && { color: colors.bg },
                    { textTransform: 'capitalize' },
                  ]}
                >
                  {s}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Card>

      <QCButton
        title="Restart program (reset all data)"
        variant="danger"
        onPress={() =>
          Alert.alert(
            'Reset Quantum Ceed',
            'This will erase your profile, daily logs, and progress. Are you sure?',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Reset',
                style: 'destructive',
                onPress: async () => {
                  await reset();
                },
              },
            ],
          )
        }
      />
    </ScreenContainer>
  );
}

function ReminderRow({
  title,
  options,
  value,
  onChange,
}: {
  title: string;
  options: string[];
  value: string;
  onChange: (t: string) => void;
}) {
  return (
    <View style={{ marginTop: spacing.lg }}>
      <Text style={styles.rowTitle}>{title}</Text>
      <View style={styles.timeRow}>
        {options.map((t) => {
          const active = value === t;
          return (
            <Pressable
              key={t}
              onPress={() => onChange(t)}
              style={[styles.timeChip, active && styles.timeChipActive]}
            >
              <Text style={[styles.timeText, active && { color: colors.bg }]}>{t}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { ...typography.bodyStrong, color: colors.text },
  row: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  chip: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  chipActive: { backgroundColor: colors.gold, borderColor: colors.gold },
  chipText: { ...typography.bodyStrong, color: colors.text },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  help: { ...typography.caption, color: colors.textMuted, marginTop: 4, lineHeight: 18 },
  rowTitle: { ...typography.caption, color: colors.gold, letterSpacing: 1, marginBottom: spacing.sm },
  timeRow: { flexDirection: 'row', gap: spacing.xs, flexWrap: 'wrap' },
  timeChip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  timeChipActive: { backgroundColor: colors.gold, borderColor: colors.gold },
  timeText: { ...typography.bodyStrong, color: colors.text, fontVariant: ['tabular-nums'] },
});
