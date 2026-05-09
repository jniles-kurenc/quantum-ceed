import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { SectionHeader } from '../../components/SectionHeader';
import { QCButton } from '../../components/QCButton';
import { Card } from '../../components/Card';
import { colors, radii, spacing, typography } from '../../lib/theme';

interface Props {
  onComplete: (reminders: { morning: string; evening: string; night: string }) => void;
}

const TIME_OPTIONS = {
  morning: ['06:00', '06:30', '07:00', '07:30', '08:00'],
  evening: ['16:30', '17:00', '17:30', '18:00', '18:30'],
  night: ['21:00', '21:30', '22:00', '22:30', '23:00'],
};

export function RemindersSetupScreen({ onComplete }: Props) {
  const [morning, setMorning] = useState('07:00');
  const [evening, setEvening] = useState('17:30');
  const [night, setNight] = useState('22:00');

  return (
    <ScreenContainer>
      <SectionHeader
        eyebrow="Voice reminders"
        title="When should your coach call?"
        subtitle="Three voice check-ins each day. You can talk back anytime."
      />

      <TimePickerCard
        title="Morning intention"
        description="Hydration, sunlight, and your one focus."
        options={TIME_OPTIONS.morning}
        value={morning}
        onChange={setMorning}
      />
      <TimePickerCard
        title="Evening movement"
        description="Workout reminder & meal accountability."
        options={TIME_OPTIONS.evening}
        value={evening}
        onChange={setEvening}
      />
      <TimePickerCard
        title="Night wind-down"
        description="Sleep prep and gratitude."
        options={TIME_OPTIONS.night}
        value={night}
        onChange={setNight}
      />

      <QCButton title="Set my schedule" onPress={() => onComplete({ morning, evening, night })} />
    </ScreenContainer>
  );
}

function TimePickerCard({
  title,
  description,
  options,
  value,
  onChange,
}: {
  title: string;
  description: string;
  options: string[];
  value: string;
  onChange: (t: string) => void;
}) {
  return (
    <Card>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDesc}>{description}</Text>
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
    </Card>
  );
}

const styles = StyleSheet.create({
  cardTitle: { ...typography.h3, color: colors.text },
  cardDesc: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: 4,
    marginBottom: spacing.md,
  },
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
