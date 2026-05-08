import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import { ScreenContainer } from '../../components/ScreenContainer';
import { SectionHeader } from '../../components/SectionHeader';
import { QCButton } from '../../components/QCButton';
import { Card } from '../../components/Card';
import { Pill } from '../../components/Pill';
import { colors, radii, spacing, typography } from '../../lib/theme';
import type { CoachVoice } from '../../lib/types';

const PROMPTS = [
  "Tell me your name and what brought you to Quantum Ceed.",
  "What's the biggest challenge you're facing with your health right now?",
  "Describe a typical day — your sleep, food, training, and stress.",
  "What does success look like for you in 90 days?",
  "How do you want me to coach you — gentle, direct, or playful?",
];

const TARGET_SECONDS = 5 * 60;

interface Props {
  name: string;
  coachVoice: CoachVoice;
  onComplete: (secondsRecorded: number, style: 'gentle' | 'direct' | 'playful') => void;
}

export function VoiceOnboardingScreen({ name, coachVoice, onComplete }: Props) {
  const [promptIndex, setPromptIndex] = useState(0);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [style, setStyle] = useState<'gentle' | 'direct' | 'playful'>('direct');
  const pulse = useRef(new Animated.Value(0)).current;
  const tickRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
      if (recording) recording.stopAndUnloadAsync().catch(() => {});
      Speech.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1400,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 1400,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [pulse]);

  const speakPrompt = (idx: number) => {
    Speech.stop();
    const intro = idx === 0 ? `${name}, this is your AI Coach. ` : '';
    Speech.speak(intro + PROMPTS[idx], {
      pitch: coachVoice === 'female' ? 1.15 : 0.85,
      rate: 0.95,
    });
  };

  const startRecording = async () => {
    try {
      const perm = await Audio.requestPermissionsAsync();
      if (!perm.granted) {
        setPermissionDenied(true);
        return;
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const rec = new Audio.Recording();
      await rec.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await rec.startAsync();
      setRecording(rec);
      tickRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
      speakPrompt(promptIndex);
    } catch (e) {
      setPermissionDenied(true);
    }
  };

  const stopRecording = async () => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
    if (recording) {
      try {
        await recording.stopAndUnloadAsync();
      } catch {}
      setRecording(null);
    }
    Speech.stop();
  };

  const next = () => {
    if (promptIndex < PROMPTS.length - 1) {
      const idx = promptIndex + 1;
      setPromptIndex(idx);
      speakPrompt(idx);
    }
  };

  const skipVoice = () => {
    onComplete(seconds, style);
  };

  const finish = async () => {
    await stopRecording();
    onComplete(seconds, style);
  };

  const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  const progress = Math.min(1, seconds / TARGET_SECONDS);

  const dotScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.35] });
  const dotOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.7, 0.2] });

  return (
    <ScreenContainer>
      <SectionHeader
        eyebrow="5-min Voice Onboarding"
        title="Let your AI Coach get to know you"
        subtitle="Speak naturally. Your voice trains the coach on your personality so reminders feel like a real conversation."
      />

      <Card style={{ alignItems: 'center', gap: spacing.lg, paddingVertical: spacing.xl }}>
        <View style={styles.micWrap}>
          <Animated.View
            style={[
              styles.pulseRing,
              {
                transform: [{ scale: dotScale }],
                opacity: dotOpacity,
                backgroundColor: recording ? colors.gold : colors.surfaceAlt,
              },
            ]}
          />
          <Pressable
            style={[styles.mic, recording && styles.micActive]}
            onPress={recording ? stopRecording : startRecording}
          >
            <Text style={styles.micIcon}>{recording ? '■' : '●'}</Text>
          </Pressable>
        </View>

        <Text style={styles.timer}>{mins}:{secs}</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
        <Pill
          tone={recording ? 'gold' : 'muted'}
          label={recording ? 'Listening' : 'Tap mic to start'}
        />
      </Card>

      <Card>
        <Text style={styles.promptLabel}>Coach asks</Text>
        <Text style={styles.prompt}>{PROMPTS[promptIndex]}</Text>
        <View style={styles.promptRow}>
          <Pressable onPress={() => speakPrompt(promptIndex)}>
            <Text style={styles.linkText}>Replay</Text>
          </Pressable>
          <Pressable onPress={next} disabled={promptIndex >= PROMPTS.length - 1}>
            <Text
              style={[
                styles.linkText,
                promptIndex >= PROMPTS.length - 1 && { opacity: 0.4 },
              ]}
            >
              Next prompt →
            </Text>
          </Pressable>
        </View>
      </Card>

      <Card>
        <Text style={styles.promptLabel}>Coaching style</Text>
        <View style={styles.styleRow}>
          {(['gentle', 'direct', 'playful'] as const).map((s) => {
            const active = style === s;
            return (
              <Pressable
                key={s}
                onPress={() => setStyle(s)}
                style={[styles.styleChip, active && styles.styleChipActive]}
              >
                <Text style={[styles.styleChipText, active && { color: colors.bg }]}>
                  {s}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Card>

      {permissionDenied ? (
        <Text style={styles.helper}>
          Microphone permission denied. You can still continue — voice training will resume later.
        </Text>
      ) : null}

      <View style={{ gap: spacing.sm }}>
        <QCButton
          title={seconds >= TARGET_SECONDS ? 'Finish onboarding' : 'I\'m done — finish'}
          onPress={finish}
          disabled={seconds < 30 && !permissionDenied}
        />
        <QCButton title="Skip for now" variant="ghost" onPress={skipVoice} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  micWrap: { width: 160, height: 160, alignItems: 'center', justifyContent: 'center' },
  pulseRing: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  mic: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micActive: {
    backgroundColor: colors.gold,
    borderColor: colors.goldSoft,
  },
  micIcon: {
    fontSize: 38,
    color: colors.gold,
    fontWeight: '700',
  },
  timer: {
    ...typography.display,
    color: colors.text,
    fontVariant: ['tabular-nums'],
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: colors.gold },
  promptLabel: {
    ...typography.micro,
    color: colors.gold,
    marginBottom: spacing.xs,
  },
  prompt: {
    ...typography.h3,
    color: colors.text,
    lineHeight: 24,
  },
  promptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  linkText: {
    ...typography.bodyStrong,
    color: colors.gold,
  },
  styleRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  styleChip: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  styleChipActive: { backgroundColor: colors.gold, borderColor: colors.gold },
  styleChipText: {
    ...typography.bodyStrong,
    color: colors.text,
    textTransform: 'capitalize',
  },
  helper: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
