import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { SectionHeader } from '../../components/SectionHeader';
import { Card } from '../../components/Card';
import { Pill } from '../../components/Pill';
import { colors, spacing, typography } from '../../lib/theme';
import { useApp } from '../../lib/AppContext';
import { getDayNumber, getMealPlan, getPhase, getPhaseInfo } from '../../lib/program';
import { useDailyLog } from '../../lib/useDailyLog';

const MEAL_TASK_ID: Record<string, string> = {
  Breakfast: 'meal-breakfast',
  Lunch: 'meal-lunch',
  Dinner: 'meal-dinner',
  Snack: 'meal-snack',
};

export function PartnerMealsScreen() {
  const { profile } = useApp();
  const { log } = useDailyLog();
  if (!profile || !log) return null;

  const day = getDayNumber(profile.startDateISO);
  const phaseInfo = getPhaseInfo(getPhase(day));
  const plan = getMealPlan(day);

  return (
    <ScreenContainer>
      <SectionHeader
        eyebrow="His meals today"
        title="Eating schedule"
        subtitle={`Day ${day} · ${phaseInfo.label} phase`}
      />

      <Card>
        <Text style={styles.guide}>How you can support</Text>
        <Text style={styles.guideText}>
          Cook one meal together this week. Stock his snacks. Hide ultra-processed
          foods. Tiny gestures, huge results.
        </Text>
      </Card>

      {plan.map((m) => {
        const taskId = MEAL_TASK_ID[m.meal];
        const done = taskId ? log.completed[taskId] : false;
        return (
          <Card key={m.meal}>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.mealTitle}>{m.meal}</Text>
                <Text style={styles.time}>{m.time}</Text>
              </View>
              <Pill label={done ? 'Eaten' : 'Pending'} tone={done ? 'green' : 'muted'} />
            </View>
            <View style={{ marginTop: spacing.md, gap: spacing.xs }}>
              {m.items.map((it) => (
                <Text key={it} style={styles.item}>·  {it}</Text>
              ))}
            </View>
            {m.notes ? <Text style={styles.notes}>{m.notes}</Text> : null}
          </Card>
        );
      })}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  guide: { ...typography.h3, color: colors.text },
  guideText: { ...typography.body, color: colors.textMuted, marginTop: 4, lineHeight: 22 },
  row: { flexDirection: 'row', alignItems: 'center' },
  mealTitle: { ...typography.h3, color: colors.text },
  time: { ...typography.caption, color: colors.gold, marginTop: 2 },
  item: { ...typography.body, color: colors.text },
  notes: { ...typography.caption, color: colors.textMuted, fontStyle: 'italic', marginTop: spacing.md },
});
