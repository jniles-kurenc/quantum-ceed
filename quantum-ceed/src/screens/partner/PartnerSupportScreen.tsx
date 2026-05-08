import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { SectionHeader } from '../../components/SectionHeader';
import { Card } from '../../components/Card';
import { Pill } from '../../components/Pill';
import { colors, spacing, typography } from '../../lib/theme';
import { useApp } from '../../lib/AppContext';
import { getDayNumber, getPhase, getPhaseInfo } from '../../lib/program';

interface Tip {
  title: string;
  body: string;
  tone: 'gold' | 'green';
}

function tipsFor(phase: ReturnType<typeof getPhase>, name: string): Tip[] {
  if (phase === 'foundation') {
    return [
      {
        tone: 'gold',
        title: 'Be his hydration ally',
        body: `Leave a fresh glass of water by ${name}'s bed. The first sip in the morning sets the tone.`,
      },
      {
        tone: 'green',
        title: 'Lights down by 9pm',
        body: 'Dim shared spaces. Switch to warm lamps. Sleep is fertility\'s quiet superpower.',
      },
      {
        tone: 'gold',
        title: 'Walk together',
        body: 'A 20-minute evening walk is connection + recovery. Phones away.',
      },
    ];
  }
  if (phase === 'activation') {
    return [
      {
        tone: 'gold',
        title: 'Celebrate the lifts',
        body: `Send a quick voice note when ${name} hits a workout. Specific praise > generic.`,
      },
      {
        tone: 'green',
        title: 'Cold-shower courage',
        body: 'Try a 30-second cold finish together. It rewires stress and feels like a wild date.',
      },
      {
        tone: 'gold',
        title: 'Protein-stocked kitchen',
        body: 'Eggs, salmon, grass-fed beef, plain yogurt. If it\'s in the fridge, he eats it.',
      },
    ];
  }
  return [
    {
      tone: 'gold',
      title: 'Cool boxers, real impact',
      body: 'Loose, breathable underwear and no laptop on the lap. Sperm love cool environments.',
    },
    {
      tone: 'green',
      title: 'Stress audit',
      body: `Ask ${name}: what\'s one thing draining you this week? Listen. No fixing.`,
    },
    {
      tone: 'gold',
      title: 'Plan the after',
      body: 'Talk about life after Day 90. The vision pulls you both forward.',
    },
  ];
}

export function PartnerSupportScreen() {
  const { profile } = useApp();
  if (!profile) return null;
  const day = getDayNumber(profile.startDateISO);
  const phase = getPhase(day);
  const info = getPhaseInfo(phase);
  const tips = tipsFor(phase, profile.name);

  return (
    <ScreenContainer>
      <SectionHeader
        eyebrow={info.month}
        title="Support tips"
        subtitle={`Small actions that move ${profile.name} forward.`}
      />

      <Card>
        <Pill label={info.label} tone="gold" />
        <Text style={styles.title}>This phase is about…</Text>
        <View style={{ marginTop: spacing.sm, gap: spacing.xs }}>
          {info.focus.map((f) => (
            <Text key={f} style={styles.bullet}>·  {f}</Text>
          ))}
        </View>
      </Card>

      {tips.map((t, i) => (
        <Card key={i}>
          <Pill label={`Tip ${i + 1}`} tone={t.tone} />
          <Text style={[styles.title, { marginTop: spacing.sm }]}>{t.title}</Text>
          <Text style={styles.body}>{t.body}</Text>
        </Card>
      ))}

      <Card style={{ borderColor: 'rgba(46, 125, 91, 0.45)' }}>
        <Text style={styles.bigTitle}>You're already doing the most</Text>
        <Text style={styles.body}>
          You bought him this kit. That is leadership. He'll feel it for the rest of his life.
        </Text>
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.h3, color: colors.text, marginTop: spacing.sm },
  bigTitle: { ...typography.title, color: colors.gold },
  body: { ...typography.body, color: colors.textMuted, marginTop: spacing.sm, lineHeight: 22 },
  bullet: { ...typography.body, color: colors.text },
});
