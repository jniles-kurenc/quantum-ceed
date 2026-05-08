import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { SectionHeader } from '../../components/SectionHeader';
import { Card } from '../../components/Card';
import { Pill } from '../../components/Pill';
import { QCButton } from '../../components/QCButton';
import { colors, radii, spacing, typography } from '../../lib/theme';
import { useApp } from '../../lib/AppContext';
import { getDayNumber, SPERM_TEST_DAYS } from '../../lib/program';
import { getAllLogs } from '../../lib/storage';
import { useDailyLog } from '../../lib/useDailyLog';
import type { DailyLog } from '../../lib/types';

export function SpermTestScreen() {
  const { profile } = useApp();
  const { log, setSpermTest } = useDailyLog();
  const [history, setHistory] = useState<DailyLog[]>([]);
  const [motility, setMotility] = useState('');
  const [concentration, setConcentration] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    getAllLogs().then((logs) => setHistory(logs.filter((l) => l.spermTest?.taken)));
  }, [log]);

  if (!profile) return null;
  const day = getDayNumber(profile.startDateISO);
  const isTestDay = SPERM_TEST_DAYS.includes(day as any);
  const startDate = new Date(profile.startDateISO + 'T00:00:00');

  const submit = async () => {
    const m = parseInt(motility, 10);
    const c = parseFloat(concentration);
    await setSpermTest({
      taken: true,
      motilityPct: isNaN(m) ? undefined : m,
      concentrationMillionPerMl: isNaN(c) ? undefined : c,
      notes: notes.trim() || undefined,
    });
    setMotility('');
    setConcentration('');
    setNotes('');
    const logs = await getAllLogs();
    setHistory(logs.filter((l) => l.spermTest?.taken));
  };

  return (
    <ScreenContainer>
      <SectionHeader
        eyebrow="YO Sperm Test"
        title="Track your transformation"
        subtitle="Three tests: Day 1, Day 45, Day 90."
      />

      <Card>
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          {SPERM_TEST_DAYS.map((d) => {
            const tested = history.some((h) => {
              const hd = new Date(h.dateISO + 'T00:00:00');
              const diff = Math.floor((hd.getTime() - startDate.getTime()) / 86400000) + 1;
              return diff === d;
            });
            return (
              <View
                key={d}
                style={[
                  styles.milestone,
                  d === day && styles.milestoneActive,
                  tested && styles.milestoneDone,
                ]}
              >
                <Text style={[styles.milestoneDay, tested && { color: colors.bg }]}>Day {d}</Text>
                <Text
                  style={[
                    styles.milestoneStatus,
                    tested && { color: colors.bg },
                  ]}
                >
                  {tested ? 'Logged' : d < day ? 'Missed' : 'Upcoming'}
                </Text>
              </View>
            );
          })}
        </View>
      </Card>

      {isTestDay ? (
        <Card style={{ borderColor: 'rgba(232, 199, 106, 0.45)' }}>
          <Pill label="Test day" tone="gold" />
          <Text style={[styles.sectionTitle, { marginTop: spacing.sm }]}>Log today's results</Text>
          <Text style={styles.helper}>
            Use your YO Sperm Test kit. Enter the motility and concentration numbers below.
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Motile sperm concentration (M/ml)</Text>
            <TextInput
              value={concentration}
              onChangeText={setConcentration}
              keyboardType="decimal-pad"
              placeholder="e.g. 18.5"
              placeholderTextColor={colors.textFaint}
              style={styles.input}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Motility %</Text>
            <TextInput
              value={motility}
              onChangeText={setMotility}
              keyboardType="number-pad"
              placeholder="e.g. 42"
              placeholderTextColor={colors.textFaint}
              style={styles.input}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notes</Text>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="How did it go?"
              placeholderTextColor={colors.textFaint}
              multiline
              style={[styles.input, { minHeight: 80, textAlignVertical: 'top' }]}
            />
          </View>

          <QCButton title="Save test result" onPress={submit} />
        </Card>
      ) : (
        <Card>
          <Text style={styles.sectionTitle}>How the YO test works</Text>
          <Text style={styles.helper}>
            The YO Sperm Test is a smartphone-attached kit that scores motile sperm concentration in
            under 5 minutes. We'll remind you on Day 1, 45, and 90 — and your AI Coach will walk you
            through each step. {profile.mode === 'gift' ? 'Your partner will be notified of test completion.' : ''}
          </Text>
        </Card>
      )}

      {history.length > 0 ? (
        <View style={{ gap: spacing.md }}>
          <Text style={styles.sectionTitle}>History</Text>
          {history.map((h) => (
            <Card key={h.dateISO}>
              <Text style={styles.histDate}>{h.dateISO}</Text>
              <View style={styles.histRow}>
                <Stat label="Motile conc." value={h.spermTest?.concentrationMillionPerMl?.toString() ?? '—'} unit="M/ml" />
                <Stat label="Motility" value={h.spermTest?.motilityPct?.toString() ?? '—'} unit="%" />
              </View>
              {h.spermTest?.notes ? (
                <Text style={styles.notes}>"{h.spermTest.notes}"</Text>
              ) : null}
            </Card>
          ))}
        </View>
      ) : null}
    </ScreenContainer>
  );
}

function Stat({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statUnit}>{unit}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  milestone: {
    flex: 1,
    paddingVertical: spacing.md,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  milestoneActive: {
    borderColor: colors.gold,
  },
  milestoneDone: {
    backgroundColor: colors.gold,
    borderColor: colors.gold,
  },
  milestoneDay: { ...typography.bodyStrong, color: colors.text },
  milestoneStatus: { ...typography.micro, color: colors.textMuted, marginTop: 4 },
  sectionTitle: { ...typography.h3, color: colors.text },
  helper: { ...typography.body, color: colors.textMuted, marginTop: 4, lineHeight: 22 },
  inputGroup: { marginTop: spacing.md, gap: spacing.sm },
  label: { ...typography.bodyStrong, color: colors.text },
  input: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    color: colors.text,
    fontSize: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },
  histDate: { ...typography.caption, color: colors.gold, letterSpacing: 1 },
  histRow: { flexDirection: 'row', gap: spacing.lg, marginTop: spacing.sm },
  stat: { flex: 1 },
  statLabel: { ...typography.caption, color: colors.textMuted },
  statValue: { ...typography.title, color: colors.text },
  statUnit: { ...typography.caption, color: colors.textMuted },
  notes: { ...typography.body, color: colors.textMuted, fontStyle: 'italic', marginTop: spacing.sm },
});
