import React from 'react';
import { Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors, typography } from '../lib/theme';

interface Props {
  size?: number;
  strokeWidth?: number;
  /** 0 to 1 */
  progress: number;
  label?: string;
  sublabel?: string;
}

export function ProgressRing({
  size = 160,
  strokeWidth = 12,
  progress,
  label,
  sublabel,
}: Props) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(1, progress));
  const offset = circumference * (1 - clamped);
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient id="ringGold" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={colors.goldSoft} />
            <Stop offset="1" stopColor={colors.goldDeep} />
          </LinearGradient>
        </Defs>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.surfaceAlt}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#ringGold)"
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="none"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={{ position: 'absolute', alignItems: 'center' }}>
        {label ? (
          <Text style={{ ...typography.display, color: colors.text }}>{label}</Text>
        ) : null}
        {sublabel ? (
          <Text style={{ ...typography.caption, color: colors.textMuted, letterSpacing: 1 }}>
            {sublabel.toUpperCase()}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
