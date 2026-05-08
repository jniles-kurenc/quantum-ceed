import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { SectionHeader } from '../../components/SectionHeader';
import { Card } from '../../components/Card';
import { Pill } from '../../components/Pill';
import { ProgressRing } from '../../components/ProgressRing';
import { colors, spacing, typography } from '../../lib/theme';
import { useApp } from '../../lib/AppContext';
import {
  getDailyTasks,
  getDayNumber,
  getPhase,
  getPhaseInfo,
  nextSpermTestDay,
  PROGRAM_LENGTH_DAYS,
  SPERM_TEST_DAYS,
} from '../../lib/program';
import { useDailyLog } from '../../lib/useDailyLog';
import { getAllLogs } from '../../lib/storage';
import type { DailyLog } from '../../lib/types';

export function PartnerHomeScreen() {
  const { profile } = useApp();
  const { log } = useDailyLog();
  const [history, setHistory] = useState<DailyLog[]>([]);

  useEffect(() => {
    getAllLogs().then(setHistory);
  }, [log]);

  if (!profile) return null;
  const day = getDayNumber(profile.startDateISO);
  const phase = getPhase(day);
  const phaseInfo = getPhaseInfo(phase);
  const tasks = getDailyTasks(day);
  const completedToday = tasks.filter((t) => log?.completed[t.id]).length;
  const completion = tasks.length ? completedToday / tasks.length : 0;

  const next = nextSpermTestDay(day);
  const tested = history.filter((h) => h.spermTest?.taken).length;

  // Recent streak: count last 7 days where >= 50% tasks done
  const last7 = history.slice(-7);
  const goodDays = last7.filter((l) => {
    const taskCount = Math.max(1, Object.keys(l.completed).length);
    const done = Object.values(l.completed).filter(Boolean).length;
    return done / taskCount >= 0.5;
  }).length;

  return (
    <ScreenContainer>
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.greeting}>Partner Dashboard</Text>
          <Text style={styles.title}>{profile.partnerName ?? 'You'} & {profile.name}</Text>
        </View>
        <Pill label="Gift Mode" tone="gold" />
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

      <Card>
        <Text style={styles.cardTitle}>Today, {profile.name} has done</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.lg, marginTop: spacing.md }}>
          <ProgressRing
            size={90}
            strokeWidth={8}
            progress={completion}
            label={`${Math.round(completion * 100)}%`}
            sublabel="today"
          />
          <View style={{ flex: 1, gap: spacing.xs }}>
            <Text style={styles.statBig}>{completedToday}/{tasks.length}</Text>
            <Text style={styles.statLabel}>tasks complete</Text>
            <Text style={styles.helper}>
              You'll get a gentle ping when he finishes today.
            </Text>
          </View>
        </View>
      </Card>

      <Card>
        <Text style={styles.cardTitle}>YO Sperm Tests</Text>
        <View style={styles.testRow}>
          {SPERM_TEST_DAYS.map((d) => {
            const startDate = new Date(profile.startDateISO + 'T00:00:00');
            const isDone = history.some((h) => {
              if (!h.spermTest?.taken) return false;
              const hd = new Date(h.dateISO + 'T00:00:00');
              const diff = Math.floor((hd.getTime() - startDate.getTime()) / 86400000) + 1;
              return diff === d;
            });
            return (
              <View key={d} style={[styles.testPill, isDone && styles.testPillDone]}>
                <Text style={[styles.testDay, isDone && { color: colors.bg }]}>Day {d}</Text>
                <Text style={[styles.testStatus, isDone && { color: colors.bg }]}>
                  {isDone ? 'Done' : d < day ? 'Pending' : 'Upcoming'}
                </Text>
              </View>
            );
          })}
        </View>
        <Text style={styles.helper}>
          {tested > 0
            ? `${tested} of 3 tests logged. We'll notify you the moment a new one comes in.`
            : `First test on Day 1. You'll get a notification when ${profile.name} completes it.`}
        </Text>
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Last 7 days</Text>
        <View style={styles.streakRow}>
          {Array.from({ length: 7 }).map((_, i) => {
            const offset = 6 - i;
            const date = new Date();
            date.setDate(date.getDate() - offset);
            const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            const l = history.find((h) => h.dateISO === iso);
            const filled = l ? Object.values(l.completed).filter(Boolean).length : 0;
            const ratio = filled === 0 ? 0 : Math.min(1, filled / 7);
            return (
              <View key={iso} style={styles.streakCol}>
                <View style={styles.streakBarBg}>
                  <View style={[styles.streakBar, { height: `${Math.max(8, ratio * 100)}%` }]} />
                </View>
                <Text style={styles.streakLabel}>
                  {date.toLocaleDateString('en', { weekday: 'short' })[0]}
                </Text>
              </View>
            );
          })}
        </View>
        <Text style={styles.helper}>
          {goodDays} of 7 strong days. {goodDays >= 5 ? 'He\'s flying.' : 'Send a kind word.'}
        </Text>
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  greeting: { ...typography.micro, color: colors.gold, letterSpacing: 1.5 },
  title: { ...typography.title, color: colors.text, marginTop: 4 },
  heroCard: { paddingVertical: spacing.xl },
  heroRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  phaseTitle: { ...typography.title, color: colors.gold },
  phaseDesc: { ...typography.body, color: colors.textMuted, lineHeight: 21 },
  cardTitle: { ...typography.h3, color: colors.text },
  statBig: { ...typography.display, color: colors.gold, fontVariant: ['tabular-nums'] },
  statLabel: { ...typography.caption, color: colors.textMuted, letterSpacing: 0.5 },
  helper: { ...typography.body, color: colors.textMuted, marginTop: spacing.md, lineHeight: 21 },
  testRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  testPill: {
    flex: 1,
    paddingVertical: spacing.md,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  testPillDone: { backgroundColor: colors.gold, borderColor: colors.gold },
  testDay: { ...typography.bodyStrong, color: colors.text },
  testStatus: { ...typography.micro, color: colors.textMuted, marginTop: 4 },
  streakRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    height: 100,
    marginTop: spacing.md,
    alignItems: 'flex-end',
  },
  streakCol: { flex: 1, alignItems: 'center', height: '100%' },
  streakBarBg: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.surfaceAlt,
    borderRadius: 6,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  streakBar: { width: '100%', backgroundColor: colors.gold, borderRadius: 6 },
  streakLabel: { ...typography.micro, color: colors.textMuted, marginTop: 4 },
});
