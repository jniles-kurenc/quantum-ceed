import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Logo } from '../../components/Logo';
import { QCButton } from '../../components/QCButton';
import { colors, spacing, typography } from '../../lib/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Props {
  onContinue: () => void;
}

export function SplashScreen({ onContinue }: Props) {
  const fade = useRef(new Animated.Value(0)).current;
  const lift = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 900,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(lift, {
        toValue: 0,
        duration: 900,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fade, lift]);

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[colors.bg, '#111111', colors.bg]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <Animated.View
          style={[
            styles.center,
            { opacity: fade, transform: [{ translateY: lift }] },
          ]}
        >
          <Logo size={140} />
          <Text style={styles.brand}>Quantum Ceed</Text>
          <Text style={styles.tagline}>
            A 90-day men’s fertility transformation, guided by your Voice AI Coach.
          </Text>
        </Animated.View>

        <View style={styles.footer}>
          <QCButton title="Begin" onPress={onContinue} />
          <Text style={styles.fineprint}>
            Foundation · Activation · Optimization
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  safe: { flex: 1, paddingHorizontal: spacing.xl, justifyContent: 'space-between' },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
  },
  brand: {
    ...typography.display,
    fontSize: 38,
    color: colors.gold,
    letterSpacing: 0.5,
  },
  tagline: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    maxWidth: 320,
    lineHeight: 22,
  },
  footer: {
    paddingBottom: spacing.lg,
    gap: spacing.md,
    alignItems: 'center',
  },
  fineprint: {
    ...typography.micro,
    color: colors.textFaint,
    letterSpacing: 2,
  },
});
