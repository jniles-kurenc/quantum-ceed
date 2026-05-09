import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { SectionHeader } from '../../components/SectionHeader';
import { Card } from '../../components/Card';
import { QCButton } from '../../components/QCButton';
import { colors, radii, spacing, typography } from '../../lib/theme';
import { useApp } from '../../lib/AppContext';
import type { CoachVoice } from '../../lib/types';

export function SettingsScreen() {
  const { profile, updateProfile, reset } = useApp();
  const [partnerEnabled, setPartnerEnabled] = useState(profile?.mode === 'gift');
  if (!profile) return null;

  const setVoice = (v: CoachVoice) => updateProfile({ coachVoice: v });

  const togglePartner = (val: boolean) => {
    setPartnerEnabled(val);
    updateProfile({ mode: val ? 'gift' : 'self' });
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
        <Text style={styles.label}>Voice reminders</Text>
        <View style={{ marginTop: spacing.sm, gap: spacing.xs }}>
          <Text style={styles.line}>Morning · {profile.reminders.morning}</Text>
          <Text style={styles.line}>Evening · {profile.reminders.evening}</Text>
          <Text style={styles.line}>Night · {profile.reminders.night}</Text>
        </View>
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
  line: { ...typography.body, color: colors.text, fontVariant: ['tabular-nums'] },
});
