import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, spacing, typography } from '../lib/theme';

interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  style?: ViewStyle;
}

export function SectionHeader({ eyebrow, title, subtitle, style }: Props) {
  return (
    <View style={[styles.wrap, style]}>
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow.toUpperCase()}</Text> : null}
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.xs },
  eyebrow: {
    ...typography.micro,
    color: colors.gold,
  },
  title: {
    ...typography.title,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
  },
});
