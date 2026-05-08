import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Card } from '../../components/Card';
import { Pill } from '../../components/Pill';
import { colors, radii, spacing, typography } from '../../lib/theme';
import { useApp } from '../../lib/AppContext';
import { getDayNumber, getPhase, getPhaseInfo, COACH_REMINDERS } from '../../lib/program';

interface Message {
  id: string;
  from: 'coach' | 'me';
  text: string;
}

export function CoachScreen() {
  const { profile, updateProfile } = useApp();
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [busy, setBusy] = useState(false);
  const pulse = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<ScrollView>(null);

  const day = profile ? getDayNumber(profile.startDateISO) : 1;
  const phaseInfo = getPhaseInfo(getPhase(day));

  useEffect(() => {
    if (!profile || messages.length > 0) return;
    const opener = `Hey ${profile.name}. Day ${day} of Quantum Ceed — ${phaseInfo.label} phase. How are you feeling? Tell me what's on your mind.`;
    setMessages([{ id: 'open', from: 'coach', text: opener }]);
    speak(opener);
    return () => {
      Speech.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.name]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 1200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [pulse]);

  const speak = (text: string) => {
    Speech.stop();
    Speech.speak(text, {
      pitch: profile?.coachVoice === 'female' ? 1.15 : 0.85,
      rate: 0.95,
    });
  };

  const startRec = async () => {
    try {
      const perm = await Audio.requestPermissionsAsync();
      if (!perm.granted) return;
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const rec = new Audio.Recording();
      await rec.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await rec.startAsync();
      setRecording(rec);
    } catch {}
  };

  const stopRec = async () => {
    if (!recording) return;
    setBusy(true);
    try {
      await recording.stopAndUnloadAsync();
    } catch {}
    setRecording(null);

    // Mock transcription + scripted coaching reply.
    const userLine = pickUserLine();
    const reply = generateReply(userLine, profile?.name ?? 'friend', day, phaseInfo.label);
    setMessages((m) => [
      ...m,
      { id: `u-${Date.now()}`, from: 'me', text: userLine },
      { id: `c-${Date.now() + 1}`, from: 'coach', text: reply },
    ]);
    speak(reply);
    setBusy(false);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
  };

  const sendQuickReminder = (slot: 'morning' | 'evening' | 'night') => {
    if (!profile) return;
    const line = COACH_REMINDERS.find((r) => r.slot === slot)?.text(profile.name, day) ?? '';
    setMessages((m) => [...m, { id: `c-${Date.now()}`, from: 'coach', text: line }]);
    speak(line);
  };

  const dotScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.4] });
  const dotOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.7, 0.15] });

  return (
    <ScreenContainer scroll={false} edges={['top']}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.eyebrow}>VOICE AI COACH</Text>
          <Text style={styles.title}>Day {day} · {phaseInfo.label}</Text>
        </View>
        <Pill
          label={profile?.coachVoice === 'female' ? 'Female' : 'Male'}
          tone="gold"
        />
        <Pressable
          onPress={() =>
            updateProfile({
              coachVoice: profile?.coachVoice === 'male' ? 'female' : 'male',
            })
          }
          style={styles.swap}
        >
          <Text style={styles.swapText}>swap</Text>
        </Pressable>
      </View>

      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={styles.feed}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((m) => (
          <View
            key={m.id}
            style={[
              styles.bubble,
              m.from === 'coach' ? styles.coachBubble : styles.meBubble,
            ]}
          >
            {m.from === 'coach' ? (
              <Text style={styles.coachLabel}>COACH</Text>
            ) : null}
            <Text style={[styles.bubbleText, m.from === 'me' && { color: colors.bg }]}>
              {m.text}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.quickRow}>
        <Pressable style={styles.quickChip} onPress={() => sendQuickReminder('morning')}>
          <Text style={styles.quickText}>Morning prompt</Text>
        </Pressable>
        <Pressable style={styles.quickChip} onPress={() => sendQuickReminder('evening')}>
          <Text style={styles.quickText}>Evening push</Text>
        </Pressable>
        <Pressable style={styles.quickChip} onPress={() => sendQuickReminder('night')}>
          <Text style={styles.quickText}>Night wind-down</Text>
        </Pressable>
      </View>

      <View style={styles.micWrap}>
        <Animated.View
          style={[
            styles.pulse,
            {
              transform: [{ scale: dotScale }],
              opacity: dotOpacity,
              backgroundColor: recording ? colors.gold : colors.surfaceAlt,
            },
          ]}
        />
        <Pressable
          style={[styles.mic, recording && styles.micActive]}
          onPress={recording ? stopRec : startRec}
          disabled={busy}
        >
          <Text style={styles.micIcon}>
            {busy ? '…' : recording ? '■' : '●'}
          </Text>
        </Pressable>
        <Text style={styles.micHint}>
          {recording ? 'Listening… tap to send' : 'Hold thoughts and tap to talk'}
        </Text>
      </View>
    </ScreenContainer>
  );
}

function pickUserLine() {
  const samples = [
    "Honestly tired. Slept maybe six hours.",
    "Feeling solid. Hit my workout already.",
    "Stressed about work. Skipped breakfast.",
    "Crushed it today, but I'm hungry.",
    "Not sure I can keep this up.",
  ];
  return samples[Math.floor(Math.random() * samples.length)];
}

function generateReply(userText: string, name: string, day: number, phase: string) {
  const t = userText.toLowerCase();
  if (t.includes('tired') || t.includes('sleep')) {
    return `${name}, sleep is your secret weapon. Tonight: phone outside the bedroom, lights dim by 9, and a cool room. We rebuild from rest. Day ${day} is still yours.`;
  }
  if (t.includes('stress')) {
    return `Take a beat with me. Box breathe for one minute — in four, hold four, out four, hold four. Then eat. Skipping breakfast is stealing from your testosterone. ${phase} phase is built on consistency.`;
  }
  if (t.includes('hung')) {
    return `Good. Hunger is fuel for discipline. Hit a 35g protein meal, two fists of greens, and water. Snack on Brazil nuts and pumpkin seeds — selenium and zinc, both fertility gold.`;
  }
  if (t.includes('crush') || t.includes('solid')) {
    return `That's the energy ${name}. Lock in tonight's wind-down. Big days come from small reps. Day ${day} of 90 — keep stacking.`;
  }
  return `I hear you ${name}. We're in ${phase}. One task at a time. Pick your next win — water, walk, or 10 deep breaths — and tell me when it's done.`;
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    gap: spacing.md,
  },
  eyebrow: { ...typography.micro, color: colors.gold },
  title: { ...typography.h2, color: colors.text, marginTop: 2 },
  swap: {
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  swapText: { ...typography.micro, color: colors.textMuted },
  feed: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    gap: spacing.md,
  },
  bubble: {
    maxWidth: '88%',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radii.lg,
  },
  coachBubble: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  meBubble: {
    alignSelf: 'flex-end',
    backgroundColor: colors.gold,
  },
  coachLabel: {
    ...typography.micro,
    color: colors.gold,
    marginBottom: 4,
  },
  bubbleText: { ...typography.body, color: colors.text, lineHeight: 22 },
  quickRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    flexWrap: 'wrap',
  },
  quickChip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickText: { ...typography.caption, color: colors.text },
  micWrap: {
    alignItems: 'center',
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.sm,
  },
  pulse: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    top: spacing.lg,
  },
  mic: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micActive: { backgroundColor: colors.gold, borderColor: colors.goldSoft },
  micIcon: { fontSize: 28, color: colors.gold, fontWeight: '700' },
  micHint: { ...typography.caption, color: colors.textMuted },
});
