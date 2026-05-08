import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ScreenContainer } from '../../components/ScreenContainer';
import { SectionHeader } from '../../components/SectionHeader';
import { Card } from '../../components/Card';
import { Pill } from '../../components/Pill';
import { colors, radii, spacing, typography } from '../../lib/theme';
import { useApp } from '../../lib/AppContext';
import { getDayNumber, getMealPlan, getPhase, getPhaseInfo } from '../../lib/program';
import { useDailyLog } from '../../lib/useDailyLog';

const MEAL_TASK_ID: Record<string, string> = {
  Breakfast: 'meal-breakfast',
  Lunch: 'meal-lunch',
  Dinner: 'meal-dinner',
  Snack: 'meal-snack',
};

export function MealsScreen() {
  const { profile } = useApp();
  const { log, setPhoto } = useDailyLog();
  if (!profile || !log) return null;

  const day = getDayNumber(profile.startDateISO);
  const phase = getPhase(day);
  const phaseInfo = getPhaseInfo(phase);
  const plan = getMealPlan(day);

  const pick = async (taskId: string) => {
    const camPerm = await ImagePicker.requestCameraPermissionsAsync();
    if (camPerm.granted) {
      const r = await ImagePicker.launchCameraAsync({ quality: 0.6 });
      if (!r.canceled && r.assets[0]) await setPhoto(taskId, r.assets[0].uri);
      return;
    }
    const lib = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (lib.granted) {
      const r = await ImagePicker.launchImageLibraryAsync({ quality: 0.6 });
      if (!r.canceled && r.assets[0]) await setPhoto(taskId, r.assets[0].uri);
    }
  };

  return (
    <ScreenContainer>
      <SectionHeader
        eyebrow={`Day ${day} · ${phaseInfo.label}`}
        title="Eating schedule"
        subtitle="Time-anchored, sperm-friendly nutrition. Snap a photo to log."
      />

      <Card>
        <Text style={styles.guide}>Plate guide</Text>
        <View style={styles.guideRow}>
          <GuideChip emoji="🥩" label="1 palm protein" />
          <GuideChip emoji="🥦" label="2 fists greens" />
          <GuideChip emoji="🥑" label="1 thumb fats" />
          <GuideChip emoji="💧" label="500ml water" />
        </View>
      </Card>

      {plan.map((m) => {
        const taskId = MEAL_TASK_ID[m.meal];
        const photo = taskId ? log.photos[taskId] : undefined;
        const done = taskId ? log.completed[taskId] : false;
        return (
          <Card key={m.meal}>
            <View style={styles.mealHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.mealTitle}>{m.meal}</Text>
                <Text style={styles.time}>{m.time}</Text>
              </View>
              {done ? <Pill label="Logged" tone="green" /> : <Pill label="Open" tone="muted" />}
            </View>
            <View style={{ marginTop: spacing.md, gap: spacing.xs }}>
              {m.items.map((it) => (
                <Text key={it} style={styles.item}>·  {it}</Text>
              ))}
            </View>
            {m.notes ? <Text style={styles.notes}>{m.notes}</Text> : null}

            {taskId ? (
              <Pressable style={styles.photoBtn} onPress={() => pick(taskId)}>
                {photo ? (
                  <Image source={{ uri: photo }} style={styles.photoFull} />
                ) : (
                  <View style={styles.photoEmpty}>
                    <Text style={styles.photoIcon}>📷</Text>
                    <Text style={styles.photoLabel}>Snap your plate to verify</Text>
                  </View>
                )}
              </Pressable>
            ) : null}
          </Card>
        );
      })}
    </ScreenContainer>
  );
}

function GuideChip({ emoji, label }: { emoji: string; label: string }) {
  return (
    <View style={styles.chip}>
      <Text style={{ fontSize: 18 }}>{emoji}</Text>
      <Text style={styles.chipLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  guide: { ...typography.bodyStrong, color: colors.text, marginBottom: spacing.md },
  guideRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipLabel: { ...typography.caption, color: colors.text },
  mealHeader: { flexDirection: 'row', alignItems: 'center' },
  mealTitle: { ...typography.h3, color: colors.text },
  time: { ...typography.caption, color: colors.gold, marginTop: 2 },
  item: { ...typography.body, color: colors.text },
  notes: {
    ...typography.caption,
    color: colors.textMuted,
    fontStyle: 'italic',
    marginTop: spacing.md,
  },
  photoBtn: {
    marginTop: spacing.md,
    borderRadius: radii.md,
    overflow: 'hidden',
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 80,
  },
  photoEmpty: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
  },
  photoIcon: { fontSize: 22 },
  photoLabel: { ...typography.body, color: colors.textMuted },
  photoFull: { width: '100%', height: 180 },
});
