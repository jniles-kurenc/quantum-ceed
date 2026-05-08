import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ScreenContainer } from '../../components/ScreenContainer';
import { SectionHeader } from '../../components/SectionHeader';
import { Card } from '../../components/Card';
import { Pill } from '../../components/Pill';
import { colors, radii, spacing, typography } from '../../lib/theme';
import { useApp } from '../../lib/AppContext';
import { getDailyTasks, getDayNumber, getPhase, getPhaseInfo } from '../../lib/program';
import { useDailyLog } from '../../lib/useDailyLog';
import type { DailyTask } from '../../lib/types';

export function TasksScreen() {
  const { profile } = useApp();
  const { log, toggle, setPhoto } = useDailyLog();
  if (!profile || !log) return null;

  const day = getDayNumber(profile.startDateISO);
  const phase = getPhase(day);
  const phaseInfo = getPhaseInfo(phase);
  const tasks = getDailyTasks(day);
  const completed = tasks.filter((t) => log.completed[t.id]).length;

  const groups: { title: string; cat: DailyTask['category']; tone: 'gold' | 'green' | 'muted' }[] = [
    { title: 'Test', cat: 'test', tone: 'gold' },
    { title: 'Movement', cat: 'workout', tone: 'green' },
    { title: 'Nutrition', cat: 'meal', tone: 'gold' },
    { title: 'Daily habits', cat: 'habit', tone: 'muted' },
    { title: 'Mindset', cat: 'mindset', tone: 'green' },
  ];

  return (
    <ScreenContainer>
      <SectionHeader
        eyebrow={`Day ${day} · ${phaseInfo.label}`}
        title="Today's plan"
        subtitle={`${completed} of ${tasks.length} complete`}
      />

      {groups.map((g) => {
        const items = tasks.filter((t) => t.category === g.cat);
        if (items.length === 0) return null;
        return (
          <View key={g.title} style={{ gap: spacing.md }}>
            <View style={styles.groupHeader}>
              <Text style={styles.groupTitle}>{g.title}</Text>
              <Pill label={`${items.filter((t) => log.completed[t.id]).length}/${items.length}`} tone={g.tone} />
            </View>
            {items.map((t) => (
              <TaskRow
                key={t.id}
                task={t}
                done={!!log.completed[t.id]}
                photoUri={log.photos[t.id]}
                onToggle={() => toggle(t.id)}
                onPickPhoto={async () => {
                  const perm = await ImagePicker.requestCameraPermissionsAsync();
                  if (!perm.granted) {
                    const lib = await ImagePicker.requestMediaLibraryPermissionsAsync();
                    if (!lib.granted) return;
                    const r = await ImagePicker.launchImageLibraryAsync({ quality: 0.6 });
                    if (!r.canceled && r.assets[0]) await setPhoto(t.id, r.assets[0].uri);
                    return;
                  }
                  const r = await ImagePicker.launchCameraAsync({ quality: 0.6 });
                  if (!r.canceled && r.assets[0]) await setPhoto(t.id, r.assets[0].uri);
                }}
              />
            ))}
          </View>
        );
      })}
    </ScreenContainer>
  );
}

function TaskRow({
  task,
  done,
  photoUri,
  onToggle,
  onPickPhoto,
}: {
  task: DailyTask;
  done: boolean;
  photoUri?: string;
  onToggle: () => void;
  onPickPhoto: () => void;
}) {
  return (
    <Card padded={false} style={styles.taskCard}>
      <View style={styles.taskRow}>
        <Pressable onPress={onToggle} style={[styles.checkbox, done && styles.checkboxDone]}>
          {done ? <Text style={styles.check}>✓</Text> : null}
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, done && { color: colors.textFaint }]}>{task.title}</Text>
          {task.description ? (
            <Text style={styles.desc}>{task.description}</Text>
          ) : null}
        </View>
        {task.requiresPhoto ? (
          <Pressable onPress={onPickPhoto} style={styles.photoBtn}>
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.photo} />
            ) : (
              <Text style={styles.photoIcon}>📷</Text>
            )}
          </Pressable>
        ) : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  groupTitle: { ...typography.h3, color: colors.text },
  taskCard: { padding: spacing.lg },
  taskRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: { backgroundColor: colors.gold, borderColor: colors.gold },
  check: { color: colors.bg, fontWeight: '900' },
  title: { ...typography.bodyStrong, color: colors.text },
  desc: { ...typography.caption, color: colors.textMuted, marginTop: 2, lineHeight: 18 },
  photoBtn: {
    width: 52,
    height: 52,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  photo: { width: '100%', height: '100%' },
  photoIcon: { fontSize: 22 },
});
