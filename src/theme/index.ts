/**
 * Acuity Design Tokens — light + dark mode
 *
 * Use `useTheme()` in components instead of importing Colors directly.
 */

import { useColorScheme } from 'react-native';

// ─── Base palette ──────────────────────────────────────────────────────────────

const palette = {
  slate: '#4A5759',
  slateDark: '#3A4446',
  slateLight: '#5C6D6F',

  cream: '#F7E1D7',
  creamDark: '#EDD4C8',

  warmGray: '#DEDBD2',
  warmGrayLight: '#EDEAE3',
  warmGrayDark: '#C8C5BC',

  sage: '#B0C4B1',
  sageDark: '#8EAE8F',
  sageLight: '#D4E4D5',

  blush: '#EDAFB8',
  blushDark: '#D89AA3',
  blushLight: '#F7D5DA',
} as const;

// ─── Type ─────────────────────────────────────────────────────────────────────

export type ColorTheme = {
  slate: string;
  slateDark: string;
  slateLight: string;

  cream: string;
  creamDark: string;

  warmGray: string;
  warmGrayLight: string;
  warmGrayDark: string;

  sage: string;
  sageDark: string;
  sageLight: string;

  blush: string;
  blushDark: string;
  blushLight: string;

  background: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  borderStrong: string;

  text: string;
  textSecondary: string;
  textMuted: string;
  textOnSlate: string;

  correct: string;
  wrong: string;
  correctText: string;
  wrongText: string;

  white: string;
  black: string;
};

// ─── Light theme ───────────────────────────────────────────────────────────────

export const LightColors: ColorTheme = {
  ...palette,

  background: '#F7E1D7',
  surface: '#FFFFFF',
  surfaceAlt: '#EDEAE3',
  border: '#DEDBD2',
  borderStrong: '#C8C5BC',

  text: '#2A2E2F',
  textSecondary: '#5A6264',
  textMuted: '#8A9496',
  textOnSlate: '#F0D8CE',

  correct: '#B0C4B1',
  wrong: '#EDAFB8',
  correctText: '#3A5C3B',
  wrongText: '#7A3040',

  white: '#FFFFFF',
  black: '#000000',
};

// ─── Dark theme ────────────────────────────────────────────────────────────────

export const DarkColors: ColorTheme = {
  ...palette,

  background: '#1A1612',
  surface: '#242018',
  surfaceAlt: '#2E2A24',
  border: '#3A3530',
  borderStrong: '#4A4540',

  text: '#EDE0D4',
  textSecondary: '#A89888',
  textMuted: '#8A9496',
  textOnSlate: '#F7E1D7',

  correct: '#6A9E6B',
  wrong: '#C47A85',
  correctText: '#B0D4B1',
  wrongText: '#F0B0BC',

  white: '#FFFFFF',
  black: '#000000',
};

// ─── Hook ──────────────────────────────────────────────────────────────────────

export function useTheme(): ColorTheme {
  const scheme = useColorScheme();
  return scheme === 'dark' ? DarkColors : LightColors;
}

// ─── Static tokens ─────────────────────────────────────────────────────────────

export const Typography = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  '2xl': 30,
  '3xl': 38,

  tight: 1.2,
  normal: 1.5,
  relaxed: 1.7,

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

// ─── Legacy export (FIXED) ─────────────────────────────────────────────────────

// This makes ALL old files work without errors
export const Colors: ColorTheme = LightColors;