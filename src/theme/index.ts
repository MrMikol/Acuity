/**
 * Acuity Design Tokens — with dark mode support
 *
 * Use `useTheme()` in components instead of importing Colors directly.
 * This ensures all colors adapt to the system color scheme.
 */

import { useColorScheme } from 'react-native';

// ─── Light palette ─────────────────────────────────────────────────────────────

const light = {
  // Brand
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

  // Semantics
  background: '#F7E1D7',       // cream
  surface: '#FFFFFF',          // white cards
  surfaceAlt: '#EDEAE3',       // warm gray light — subtle surfaces
  border: '#DEDBD2',           // warmGray
  borderStrong: '#C8C5BC',

  text: '#2A2E2F',
  textSecondary: '#5A6264',
  textMuted: '#8A9496',
  textOnSlate: '#F0D8CE',

  // Status
  correct: '#B0C4B1',          // sage
  wrong: '#EDAFB8',            // blush
  correctText: '#3A5C3B',
  wrongText: '#7A3040',
};

// ─── Dark palette ──────────────────────────────────────────────────────────────

const dark = {
  // Brand — shifted for dark backgrounds
  slate: '#7A9A9C',            // lighter so it reads on dark bg
  slateDark: '#5C7A7C',
  slateLight: '#8AACAE',
  cream: '#2A1F1B',            // dark cream becomes a deep warm brown
  creamDark: '#221A16',
  warmGray: '#3A3530',
  warmGrayLight: '#2E2A26',
  warmGrayDark: '#4A4540',
  sage: '#6A9E6B',
  sageDark: '#4E7E4F',
  sageLight: '#1E3A1F',
  blush: '#C47A85',
  blushDark: '#A46070',
  blushLight: '#3A1F25',

  // Semantics
  background: '#1A1612',       // very dark warm brown
  surface: '#242018',          // dark card surface
  surfaceAlt: '#2E2A24',
  border: '#3A3530',
  borderStrong: '#4A4540',

  text: '#EDE0D4',
  textSecondary: '#A89888',
  textMuted: '#6A5E54',
  textOnSlate: '#EDE0D4',

  // Status
  correct: '#6A9E6B',
  wrong: '#C47A85',
  correctText: '#B0D4B1',
  wrongText: '#F0B0BC',
};

export type ColorTheme = typeof light;

export const LightColors = light;
export const DarkColors = dark;

// ─── Hook — use this in all components ────────────────────────────────────────

export function useTheme(): ColorTheme {
  const scheme = useColorScheme();
  return scheme === 'dark' ? DarkColors : LightColors;
}

// ─── Static tokens (not color-dependent) ─────────────────────────────────────

export const Typography = {
  xs: 11, sm: 13, base: 15, md: 17, lg: 20, xl: 24, '2xl': 30, '3xl': 38,
  tight: 1.2, normal: 1.5, relaxed: 1.7,
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
} as const;

export const Spacing = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 24, '2xl': 32, '3xl': 48, '4xl': 64,
} as const;

export const Radius = {
  sm: 6, md: 10, lg: 16, xl: 24, full: 9999,
} as const;

// Legacy export — only use for non-themed static values (spacing, radius etc.)
// For colors, always use useTheme() instead.
export const Colors = {
  slate: '#4A5759',
  cream: '#F7E1D7',
  warmGray: '#DEDBD2',
  warmGrayLight: '#F2EFEA',
  sage: '#B0C4B1',
  blush: '#EDAFB8',

  text: '#243133',
  textSecondary: '#5F6B6D',
  textMuted: '#8A9496',

  white: '#FFFFFF',
  black: '#000000',
};