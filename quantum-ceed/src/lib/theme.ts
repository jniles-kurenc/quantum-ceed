// Brand palette derived from the Quantum Ceed logo (matte black, warm gold, deep DNA green).
export const colors = {
  bg: '#0A0A0A',
  bgElevated: '#141414',
  surface: '#1A1A1A',
  surfaceAlt: '#222222',
  border: '#2A2A2A',
  borderSoft: '#1F1F1F',

  gold: '#E8C76A',
  goldDeep: '#B8923C',
  goldSoft: '#F2DE9B',

  green: '#2E7D5B',
  greenDeep: '#1F5B41',
  greenSoft: '#7FCBA5',

  text: '#F5F5F5',
  textMuted: '#A6A6A6',
  textFaint: '#6E6E6E',

  danger: '#E06A6A',
  warning: '#E8B86A',
  success: '#7FCBA5',
};

export const radii = {
  sm: 8,
  md: 12,
  lg: 18,
  xl: 24,
  pill: 999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const typography = {
  display: { fontSize: 32, fontWeight: '700' as const, letterSpacing: 0.2 },
  title: { fontSize: 24, fontWeight: '700' as const },
  h2: { fontSize: 20, fontWeight: '600' as const },
  h3: { fontSize: 17, fontWeight: '600' as const },
  body: { fontSize: 15, fontWeight: '400' as const },
  bodyStrong: { fontSize: 15, fontWeight: '600' as const },
  caption: { fontSize: 13, fontWeight: '400' as const },
  micro: { fontSize: 11, fontWeight: '500' as const, letterSpacing: 0.6 },
};

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
};
