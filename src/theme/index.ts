// Acuity Design Tokens
// Tagline: Sharpen your musical ear.

export const Colors = {
  // Brand palette
  slate: '#4A5759',      // primary / buttons / active states
  cream: '#F7E1D7',      // background (light mode)
  warmGray: '#DEDBD2',   // surfaces / cards
  sage: '#B0C4B1',       // correct / progress / success
  blush: '#EDAFB8',      // wrong / weak spots / errors

  // Derived shades
  slateDark: '#3A4446',
  slateLight: '#5C6D6F',
  slateMuted: '#4A575933',

  creamDark: '#EDD4C8',
  creamDeep: '#E2C5B5',

  warmGrayDark: '#C8C5BC',
  warmGrayLight: '#EDEAE3',

  sageDark: '#8EAE8F',
  sageLight: '#D4E4D5',
  sageMuted: '#B0C4B130',

  blushDark: '#D89AA3',
  blushLight: '#F7D5DA',
  blushMuted: '#EDAFB820',

  // Neutrals
  text: '#2A2E2F',
  textSecondary: '#5A6264',
  textMuted: '#8A9496',
  textOnDark: '#F7E1D7',
  textOnSlate: '#F0D8CE',

  white: '#FFFFFF',
  black: '#1A1E1F',

  // Dark mode surfaces
  darkBg: '#1E2426',
  darkSurface: '#262C2E',
  darkCard: '#2E3436',
  darkBorder: '#3A4244',
} as const;

export const Typography = {
  // Font sizes
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  '2xl': 30,
  '3xl': 38,

  // Line heights
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.7,

  // Weights
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
  '4xl': 64,
} as const;

export const Radius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const Shadows = {
  sm: {
    shadowColor: Colors.slate,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: Colors.slate,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
} as const;

// Semantic theme object — use this in components
export const Theme = {
  colors: Colors,
  typography: Typography,
  spacing: Spacing,
  radius: Radius,
  shadows: Shadows,
} as const;

export type AppTheme = typeof Theme;
