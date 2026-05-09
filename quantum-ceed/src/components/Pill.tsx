import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, radii, spacing, typography } from '../lib/theme';

interface Props {
  label: string;
  tone?: 'gold' | 'green' | 'muted' | 'danger';
  style?: ViewStyle;
}

export function Pill({ label, tone = 'gold', style }: Props) {
  const palette = {
    gold: { bg: 'rgba(232, 199, 106, 0.15)', fg: colors.gold, bd: 'rgba(232, 199, 106, 0.4)' },
    green: { bg: 'rgba(46, 125, 91, 0.18)', fg: colors.greenSoft, bd: 'rgba(46, 125, 91, 0.5)' },
    muted: { bg: colors.surfaceAlt, fg: colors.textMuted, bd: colors.border },
    danger: { bg: 'rgba(224, 106, 106, 0.15)', fg: colors.danger, bd: 'rgba(224, 106, 106, 0.4)' },
  }[tone];
  return (
    <View
      style={[
        styles.pill,
        { backgroundColor: palette.bg, borderColor: palette.bd },
        style,
      ]}
    >
      <Text style={[styles.text, { color: palette.fg }]}>{label.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: radii.pill,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    ...typography.micro,
  },
});
