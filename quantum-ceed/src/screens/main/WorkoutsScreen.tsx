import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ScreenContainer } from '../../components/ScreenContainer';
import { SectionHeader } from '../../components/SectionHeader';
import { Card } from '../../components/Card';
import { Pill } from '../../components/Pill';
import { colors, radii, spacing, typography } from '../../lib/theme';
import { useApp } from '../../lib/AppContext';
import { getDayNumber, getPhase, getPhaseInfo } from '../../lib/program';
import { useDailyLog } from '../../lib/useDailyLog';

interface WorkoutBlock {
  name: string;
  detail: string;
  reps?: string;
}

function getWorkoutForPhase(phase: ReturnType<typeof getPhase>): {
  title: string;
  duration: string;
  blocks: WorkoutBlock[];
} {
  if (phase === 'foundation') {
    return {
      title: 'Foundation walk + mobility',
      duration: '40 min',
      blocks: [
        { name: 'Brisk walk outdoors', detail: 'Zone 2 — nasal breathing', reps: '30 min' },
        { name: 'Hip openers', detail: 'World\'s greatest stretch', reps: '5 each side' },
        { name: 'Pelvic tilts', detail: 'Activate deep core', reps: '2 × 10' },
        { name: 'Box breathing', detail: '4-4-4-4 to cool down', reps: '5 rounds' },
      ],
    };
  }
  if (phase === 'activation') {
    return {
      title: 'Strength: full body',
      duration: '45 min',
      blocks: [
        { name: 'Goblet squat', detail: 'Drive knees out, brace core', reps: '4 × 8' },
        { name: 'Romanian deadlift', detail: 'Hinge from hips', reps: '4 × 8' },
        { name: 'Push-ups', detail: 'Slow eccentric', reps: '4 × max' },
        { name: 'Single-arm row', detail: 'Squeeze shoulder blade', reps: '4 × 10' },
        { name: 'Farmer carry', detail: 'Heavy, posture tall', reps: '3 × 40m' },
      ],
    };
  }
  return {
    title: 'Optimization: lift + zone 2',
    duration: '55 min',
    blocks: [
      { name: 'Front squat', detail: 'Pause 1s at bottom', reps: '5 × 5' },
      { name: 'Pull-ups', detail: 'Full range, no kip', reps: '4 × max' },
      { name: 'Overhead press', detail: 'Glutes tight, ribs down', reps: '4 × 6' },
      { name: 'Zone 2 cardio', detail: 'Bike or row, nasal breath', reps: '20 min' },
      { name: 'Sauna or cold plunge', detail: 'Heat: 15 min · Cold: 2 min', reps: 'optional' },
    ],
  };
}

export function WorkoutsScreen() {
  const { profile } = useApp();
  const { log, setPhoto, toggle } = useDailyLog();
  if (!profile || !log) return null;

  const day = getDayNumber(profile.startDateISO);
  const phase = getPhase(day);
  const phaseInfo = getPhaseInfo(phase);
  const workout = getWorkoutForPhase(phase);
  const taskId = phase === 'foundation' ? 'walk' : 'lift';
  const done = !!log.completed[taskId];
  const photo = log.photos[taskId];

  const pick = async () => {
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
        title={workout.title}
        subtitle={`${workout.duration} · move with intent`}
      />

      <Card>
        <View style={styles.row}>
          <Pill label={done ? 'Complete' : 'Pending'} tone={done ? 'green' : 'muted'} />
          <Pressable
            style={[styles.toggleBtn, done && styles.toggleBtnDone]}
            onPress={() => toggle(taskId)}
          >
            <Text style={[styles.toggleText, done && { color: colors.bg }]}>
              {done ? 'Mark undone' : 'Mark complete'}
            </Text>
          </Pressable>
        </View>
      </Card>

      <View style={{ gap: spacing.md }}>
        {workout.blocks.map((b, i) => (
          <Card key={b.name}>
            <View style={styles.blockHead}>
              <View style={styles.idx}>
                <Text style={styles.idxText}>{i + 1}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.blockName}>{b.name}</Text>
                <Text style={styles.blockDetail}>{b.detail}</Text>
              </View>
              {b.reps ? <Text style={styles.reps}>{b.reps}</Text> : null}
            </View>
          </Card>
        ))}
      </View>

      <Card>
        <Text style={styles.verifyTitle}>Verify with a photo</Text>
        <Text style={styles.verifyHelper}>
          Snap a post-workout selfie or gym shot to lock in the win.
        </Text>
        <Pressable style={styles.photoBtn} onPress={pick}>
          {photo ? (
            <Image source={{ uri: photo }} style={styles.photoFull} />
          ) : (
            <View style={styles.photoEmpty}>
              <Text style={{ fontSize: 22 }}>📷</Text>
              <Text style={styles.photoLabel}>Add workout photo</Text>
            </View>
          )}
        </Pressable>
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  toggleBtn: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
  },
  toggleBtnDone: { backgroundColor: colors.gold, borderColor: colors.gold },
  toggleText: { ...typography.bodyStrong, color: colors.text },
  blockHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  idx: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(232, 199, 106, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  idxText: { ...typography.bodyStrong, color: colors.gold },
  blockName: { ...typography.bodyStrong, color: colors.text },
  blockDetail: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  reps: { ...typography.bodyStrong, color: colors.gold, fontVariant: ['tabular-nums'] },
  verifyTitle: { ...typography.h3, color: colors.text },
  verifyHelper: { ...typography.body, color: colors.textMuted, marginTop: 4 },
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
  photoLabel: { ...typography.body, color: colors.textMuted },
  photoFull: { width: '100%', height: 200 },
});
