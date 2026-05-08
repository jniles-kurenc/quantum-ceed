import React from 'react';
import { View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop, G, Ellipse } from 'react-native-svg';
import { colors } from '../lib/theme';

interface Props {
  size?: number;
}

// A stylized re-creation of the Quantum Ceed mark: a teardrop seed
// with a vertical stem, sitting on a DNA double-helix base.
export function Logo({ size = 96 }: Props) {
  const w = size;
  const h = size * 1.15;
  return (
    <View style={{ width: w, height: h }}>
      <Svg width={w} height={h} viewBox="0 0 100 115">
        <Defs>
          <LinearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={colors.goldSoft} />
            <Stop offset="0.55" stopColor={colors.gold} />
            <Stop offset="1" stopColor={colors.goldDeep} />
          </LinearGradient>
          <LinearGradient id="green" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={colors.green} />
            <Stop offset="1" stopColor={colors.greenDeep} />
          </LinearGradient>
        </Defs>

        {/* Seed teardrop */}
        <Path
          d="M50 6 C30 22 22 38 30 56 C36 70 50 72 50 72 C50 72 64 70 70 56 C78 38 70 22 50 6 Z"
          fill="url(#gold)"
        />
        {/* Inner vertical stem */}
        <Path d="M50 16 L50 70" stroke={colors.bg} strokeWidth={4} strokeLinecap="round" />
        {/* Inner ellipse */}
        <Ellipse cx={50} cy={42} rx={10} ry={20} stroke={colors.bg} strokeWidth={3} fill="none" />

        {/* DNA helix base */}
        <G stroke="url(#green)" strokeWidth={3.2} strokeLinecap="round" fill="none">
          <Path d="M38 74 C58 82 42 94 62 102" />
          <Path d="M62 74 C42 82 58 94 38 102" />
          <Path d="M40 78 L60 78" />
          <Path d="M40 88 L60 88" />
          <Path d="M40 98 L60 98" />
        </G>
      </Svg>
    </View>
  );
}

interface WordmarkProps {
  size?: number;
  align?: 'center' | 'flex-start';
}

export function Wordmark({ size = 28, align = 'center' }: WordmarkProps) {
  // Simple text-based wordmark to keep the bundle light.
  return (
    <View style={{ alignItems: align as any }}>
      <Svg width={size * 6.5} height={size * 1.6} viewBox="0 0 220 50">
        <Defs>
          <LinearGradient id="wm" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={colors.goldSoft} />
            <Stop offset="1" stopColor={colors.gold} />
          </LinearGradient>
        </Defs>
        {/* Letters drawn as text using Path is overkill; use plain RN below */}
      </Svg>
    </View>
  );
}
