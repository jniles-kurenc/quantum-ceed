import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Card } from '../../components/Card';
import { Pill } from '../../components/Pill';
import { ProgressRing } from '../../components/ProgressRing';
import { QCButton } from '../../components/QCButton';
import { colors, radii, spacing, typography } from '../../lib/theme';
import { useApp } from '../../lib/AppContext';
import {
  getDailyTasks,
  getDayNumber,
  getPhase,
  getPhaseInfo,
  nextSpermTestDay,
  PROGRAM_LENGTH_DAYS,
} from '../../lib/program';
import { useDailyLog } from '../../lib/useDailyLog';

interface Props {
  onOpenCoach: () => void;
  onOpenTasks: () => void;
  onOpenMeals: () => void;
  onOpenTests: () => void;
}

export function HomeScreen({ onOpenCoach, onOpenTasks, onOpenMeals, onOpenTests }: Props) {
  const { profile } = useApp();
  const { log } = useDailyLog();
  if (!profile) return null;

  const day = getDayNumber(profile.startDateISO);
  const phase = getPhase(day);
  const phaseInfo = getPhaseInfo(phase);
  const tasks = getDailyTasks(day);
  const completedCount = tasks.filter((t) => log?.completed[t.id]).length;
  const completion = tasks.length ? completedCount / tasks.length : 0;
  const nextTest = nextSpermTestDay(day);

  const greeting = greetingForHour(new Date().getHours());

  return (
    <ScreenContainer>
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.greeting}>{greeting},</Text>
          <Text style={styles.name}>{profile.name}</Text>
        </View>
        <Pill label={profile.mode === 'gift' ? 'Gift mode' : 'Self-Love mode'} tone="muted" />
      </View>

      <Card style={styles.heroCard}>
        <View style={styles.heroRow}>
          <View style={{ flex: 1, gap: spacing.sm }}>
            <Pill label={phaseInfo.month} tone="gold" />
            <Text style={styles.phaseTitle}>{phaseInfo.label}</Text>
            <Text style={styles.phaseDesc}>{phaseInfo.description}</Text>
          </View>
          <ProgressRing
            size={120}
            strokeWidth={10}
            progress={day / PROGRAM_LENGTH_DAYS}
            label={`${day}`}
            sublabel={`of ${PROGRAM_LENGTH_DAYS}`}
          />
        </View>
      </Card>

      <Pressable onPress={onOpenCoach}>
        <Card style={styles.coachCard}>
          <View style={styles.coachRow}>
            <View style={styles.coachOrb}>
              <View style={styles.coachOrbInner} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.coachLabel}>VOICE AI COACH</Text>
              <Text style={styles.coachTitle}>Tap to talk</Text>
              <Text style={styles.coachSub}>
                {profile.coachVoice === 'female' ? 'Female voice' : 'Male voice'} · {profile.personality?.style ?? 'direct'} style
              </Text>
            </View>
            <Text style={styles.chev}>›</Text>
          </View>
        </Card>
      </Pressable>

      <Pressable onPress={onOpenTasks}>
        <Card>
          <View style={styles.taskHeader}>
            <Text style={styles.cardTitle}>Today's tasks</Text>
            <Text style={styles.taskCounter}>
              {completedCount}/{tasks.length}
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${completion * 100}%` }]} />
          </View>
          <View style={{ marginTop: spacing.md, gap: spacing.sm }}>
            {tasks.slice(0, 3).map((t) => {
              const done = !!log?.completed[t.id];
              return (
                <View key={t.id} style={styles.taskRow}>
                  <View style={[styles.checkbox, done && styles.checkboxDone]} />
                  <Text
                    style={[styles.taskTitle, done && { color: colors.textFaint, textDecorationLine: 'line-through' }]}
                  >
                    {t.title}
                  </Text>
                </View>
              );
            })}
          </View>
          <Text style={styles.openLink}>Open today's plan →</Text>
        </Card>
      </Pressable>

      {nextTest ? (
        <Pressable onPress={onOpenTests}>
          <Card style={{ borderColor: 'rgba(232, 199, 106, 0.4)' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ flex: 1 }}>
                <Pill label="YO Sperm Test" tone="gold" />
                <Text style={[styles.cardTitle, { marginTop: spacing.sm }]}>
                  {nextTest === day
                    ? 'Test scheduled today'
                    : `Next test on day ${nextTest}`}
                </Text>
                <Text style={styles.cardDesc}>
                  Tests on day 1, 45, and 90 to track your transformation.
                </Text>
              </View>
              <Text style={styles.chev}>›</Text>
            </View>
          </Card>
        </Pressable>
      ) : null}

      <Pressable onPress={onOpenMeals}>
        <Card>
          <Text style={styles.cardTitle}>Today's meals</Text>
          <Text style={styles.cardDesc}>
            Your eating schedule and plate guide for {phaseInfo.label.toLowerCase()} phase.
          </Text>
          <Text style={styles.openLink}>View meal plan →</Text>
        </Card>
      </Pressable>

      <QCButton title="Talk to coach" onPress={onOpenCoach} />
    </ScreenContainer>
  );
}

function greetingForHour(h: number) {
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  greeting: { ...typography.body, color: colors.textMuted },
  name: { ...typography.title, color: colors.text, marginTop: 2 },
  heroCard: { paddingVertical: spacing.xl },
  heroRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  phaseTitle: { ...typography.title, color: colors.gold },
  phaseDesc: { ...typography.body, color: colors.textMuted, lineHeight: 21 },
  coachCard: {
    borderColor: 'rgba(232, 199, 106, 0.45)',
    backgroundColor: '#15110A',
  },
  coachRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  coachOrb: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(232, 199, 106, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coachOrbInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.gold,
  },
  coachLabel: { ...typography.micro, color: colors.gold },
  coachTitle: { ...typography.h2, color: colors.text },
  coachSub: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  chev: { fontSize: 32, color: colors.textFaint, lineHeight: 32 },
  cardTitle: { ...typography.h3, color: colors.text },
  cardDesc: { ...typography.body, color: colors.textMuted, marginTop: 4 },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskCounter: {
    ...typography.bodyStrong,
    color: colors.gold,
    fontVariant: ['tabular-nums'],
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: spacing.md,
  },
  progressFill: { height: '100%', backgroundColor: colors.gold },
  taskRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  checkboxDone: {
    backgroundColor: colors.gold,
    borderColor: colors.gold,
  },
  taskTitle: { ...typography.body, color: colors.text, flex: 1 },
  openLink: {
    ...typography.bodyStrong,
    color: colors.gold,
    marginTop: spacing.md,
  },
});
