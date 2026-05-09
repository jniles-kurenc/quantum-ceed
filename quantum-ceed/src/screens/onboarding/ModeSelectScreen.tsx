import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { SectionHeader } from '../../components/SectionHeader';
import { QCButton } from '../../components/QCButton';
import { colors, radii, spacing, typography } from '../../lib/theme';
import type { PurchaseMode } from '../../lib/types';

interface Props {
  onSelect: (mode: PurchaseMode) => void;
}

const OPTIONS: {
  mode: PurchaseMode;
  title: string;
  badge: string;
  blurb: string;
  bullets: string[];
}[] = [
  {
    mode: 'gift',
    title: 'A Gift From Her',
    badge: 'Most popular',
    blurb: 'She gifted you this kit. You walk the path. She supports from her dashboard.',
    bullets: [
      'You use the full Voice AI Coach',
      'She sees your high-level progress',
      'She gets your meal plan & test reminders',
    ],
  },
  {
    mode: 'self',
    title: 'Self-Love Mode',
    badge: 'For yourself',
    blurb: 'You bought this for you. Private, focused, no partner dashboard.',
    bullets: [
      'Full Voice AI Coach experience',
      'Daily habits & workouts',
      'Sperm tests on Day 1, 45 & 90',
    ],
  },
];

export function ModeSelectScreen({ onSelect }: Props) {
  const [selected, setSelected] = useState<PurchaseMode | null>(null);
  return (
    <ScreenContainer>
      <SectionHeader
        eyebrow="Choose your path"
        title="How are you starting?"
        subtitle="You can change this later in settings."
      />

      {OPTIONS.map((opt) => {
        const active = selected === opt.mode;
        return (
          <Pressable
            key={opt.mode}
            onPress={() => setSelected(opt.mode)}
            style={[styles.card, active && styles.cardActive]}
          >
            <View style={styles.row}>
              <Text style={styles.title}>{opt.title}</Text>
              <View style={[styles.badge, active && styles.badgeActive]}>
                <Text style={[styles.badgeText, active && { color: colors.bg }]}>
                  {opt.badge}
                </Text>
              </View>
            </View>
            <Text style={styles.blurb}>{opt.blurb}</Text>
            <View style={{ gap: spacing.xs, marginTop: spacing.sm }}>
              {opt.bullets.map((b) => (
                <Text key={b} style={styles.bullet}>
                  ·  {b}
                </Text>
              ))}
            </View>
          </Pressable>
        );
      })}

      <QCButton
        title="Continue"
        onPress={() => selected && onSelect(selected)}
        disabled={!selected}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  cardActive: {
    borderColor: colors.gold,
    backgroundColor: '#1B1710',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { ...typography.h2, color: colors.text },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  badgeActive: {
    backgroundColor: colors.gold,
    borderColor: colors.gold,
  },
  badgeText: {
    ...typography.micro,
    color: colors.textMuted,
  },
  blurb: {
    ...typography.body,
    color: colors.textMuted,
    lineHeight: 21,
  },
  bullet: {
    ...typography.body,
    color: colors.text,
  },
});
