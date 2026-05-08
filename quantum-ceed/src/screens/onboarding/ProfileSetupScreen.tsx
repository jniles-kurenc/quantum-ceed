import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Pressable } from 'react-native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { SectionHeader } from '../../components/SectionHeader';
import { QCButton } from '../../components/QCButton';
import { colors, radii, spacing, typography } from '../../lib/theme';
import type { CoachVoice, PurchaseMode } from '../../lib/types';

interface Props {
  mode: PurchaseMode;
  onComplete: (data: {
    name: string;
    partnerName?: string;
    coachVoice: CoachVoice;
  }) => void;
}

export function ProfileSetupScreen({ mode, onComplete }: Props) {
  const [name, setName] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [coachVoice, setCoachVoice] = useState<CoachVoice>('male');

  const isGift = mode === 'gift';
  const canContinue = name.trim().length > 1;

  return (
    <ScreenContainer>
      <SectionHeader
        eyebrow={isGift ? 'Set up his profile' : 'Set up your profile'}
        title={isGift ? 'Who is this for?' : 'What should we call you?'}
        subtitle="Just the basics to personalize your Voice AI Coach."
      />

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>{isGift ? 'His first name' : 'Your first name'}</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="e.g. Marcus"
          placeholderTextColor={colors.textFaint}
          style={styles.input}
          autoCapitalize="words"
          returnKeyType="next"
        />
      </View>

      {isGift ? (
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Your name (Partner)</Text>
          <TextInput
            value={partnerName}
            onChangeText={setPartnerName}
            placeholder="e.g. Lila"
            placeholderTextColor={colors.textFaint}
            style={styles.input}
            autoCapitalize="words"
          />
        </View>
      ) : null}

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Coach voice</Text>
        <View style={styles.toggleRow}>
          {(['male', 'female'] as CoachVoice[]).map((v) => {
            const active = coachVoice === v;
            return (
              <Pressable
                key={v}
                onPress={() => setCoachVoice(v)}
                style={[styles.toggle, active && styles.toggleActive]}
              >
                <Text style={[styles.toggleText, active && { color: colors.bg }]}>
                  {v === 'male' ? 'Male voice' : 'Female voice'}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={styles.helper}>
          Your AI Coach will speak with this voice during reminders and conversations.
        </Text>
      </View>

      <QCButton title="Continue" onPress={() =>
        onComplete({
          name: name.trim(),
          partnerName: partnerName.trim() || undefined,
          coachVoice,
        })
      } disabled={!canContinue} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  fieldGroup: { gap: spacing.sm },
  label: { ...typography.bodyStrong, color: colors.text },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    color: colors.text,
    fontSize: 16,
  },
  toggleRow: { flexDirection: 'row', gap: spacing.sm },
  toggle: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  toggleActive: { backgroundColor: colors.gold, borderColor: colors.gold },
  toggleText: { ...typography.bodyStrong, color: colors.text },
  helper: { ...typography.caption, color: colors.textMuted },
});
