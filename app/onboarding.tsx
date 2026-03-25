/**
 * Onboarding — first launch only, 3 slides.
 * Cross-platform: SVG visuals, safe area insets, dark mode colors.
 */

import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Path, Circle, Line, Rect, G } from 'react-native-svg';
import { LightColors, Spacing, Radius } from '../src/theme';

const { width: W } = Dimensions.get('window');
const ONBOARDING_KEY = '@acuity/onboarding_complete';

export async function hasSeenOnboarding(): Promise<boolean> {
  try {
    const val = await AsyncStorage.getItem(ONBOARDING_KEY);
    return val === 'true';
  } catch {
    return false;
  }
}

async function markOnboardingComplete() {
  await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
}

// ─── SVG Visuals ───────────────────────────────────────────────────────────────

function StaffVisual() {
    const C = LightColors;
  // Note positions: y offset from top of staff for each note
  const notes = [
    { x: 40,  y: 52, highlight: false },
    { x: 90,  y: 38, highlight: false },
    { x: 140, y: 45, highlight: true  },  // highlighted note
    { x: 190, y: 31, highlight: false },
    { x: 240, y: 38, highlight: false },
    { x: 290, y: 52, highlight: false },
    { x: 340, y: 45, highlight: false },
  ];
  const staffTop = 30;
  const lineGap = 12;

  return (
    <Svg width={W - 48} height={120} viewBox={`0 0 ${W - 48} 120`}>
      {/* Staff lines */}
      {[0, 1, 2, 3, 4].map((i) => (
        <Line
          key={i}
          x1="20" y1={staffTop + i * lineGap}
          x2={W - 68} y2={staffTop + i * lineGap}
          stroke={C.border}
          strokeWidth="1"
        />
      ))}
      {/* Note heads */}
      {notes.map((n, i) => (
        <G key={i}>
          {/* Stem */}
          <Line
            x1={n.x + 9} y1={n.y}
            x2={n.x + 9} y2={n.y - 28}
            stroke={n.highlight ? C.sage : C.slate}
            strokeWidth="1.5"
          />
          {/* Head */}
          <Path
            d={`M${n.x},${n.y} a9,7 -15 1,0 18,0 a9,7 -15 1,0 -18,0`}
            fill={n.highlight ? C.sage : C.slate}
          />
        </G>
      ))}
    </Svg>
  );
}

function ChainVisual() {
  const C = LightColors;
  const concepts = ['Note recognition', 'Basic intervals', 'All intervals', 'Chords', 'Progressions'];
  const itemH = 36;
  const gap = 10;
  const arrowH = 14;
  const totalH = concepts.length * itemH + (concepts.length - 1) * (gap + arrowH);
  const pillW = 200;
  const cx = (W - 48) / 2;

  return (
    <Svg width={W - 48} height={totalH} viewBox={`0 0 ${W - 48} ${totalH}`}>
      {concepts.map((label, i) => {
        const y = i * (itemH + gap + arrowH);
        const isFirst = i === 0;
        const fillColor = isFirst ? C.slate : 'transparent';
        const strokeColor = isFirst ? C.slate : C.borderStrong;
        const textColor = isFirst ? C.textOnSlate : C.textMuted;

        return (
          <G key={i}>
            {/* Connector arrow */}
            {i > 0 && (
              <G>
                <Line
                  x1={cx} y1={y - arrowH}
                  x2={cx} y2={y - 2}
                  stroke={C.borderStrong}
                  strokeWidth="1.5"
                />
                {/* Arrowhead */}
                <Path
                  d={`M${cx - 5},${y - 7} L${cx},${y - 1} L${cx + 5},${y - 7}`}
                  stroke={C.borderStrong}
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </G>
            )}
            {/* Pill */}
            <Rect
              x={cx - pillW / 2}
              y={y}
              width={pillW}
              height={itemH}
              rx={itemH / 2}
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth="1"
            />
            {/* Label */}
            <Path
              // We can't use <Text> in SVG on RN, so we use a foreign object workaround
              // Instead, we'll overlay React Native Text elements absolutely
              d=""
            />
          </G>
        );
      })}
    </Svg>
  );
}

// Chain visual using RN Views (more reliable for text than SVG text on Android)
function ChainVisualRN() {
    const C = LightColors;
  const concepts = ['Note recognition', 'Basic intervals', 'All intervals', 'Chords', 'Progressions'];
  return (
    <View style={{ alignItems: 'center', gap: 0 }}>
      {concepts.map((label, i) => (
        <View key={i} style={{ alignItems: 'center' }}>
          {i > 0 && (
            <View style={{ alignItems: 'center', height: 18, justifyContent: 'center' }}>
              <View style={{ width: 1.5, height: 10, backgroundColor: C.borderStrong }} />
              {/* Arrow tip using borders */}
              <View style={{
                width: 0, height: 0,
                borderLeftWidth: 5, borderRightWidth: 5, borderTopWidth: 6,
                borderLeftColor: 'transparent', borderRightColor: 'transparent',
                borderTopColor: C.borderStrong,
              }} />
            </View>
          )}
          <View style={[
            chainStyles.pill,
            {
              backgroundColor: i === 0 ? C.slate : 'transparent',
              borderColor: i === 0 ? C.slate : C.borderStrong,
            },
          ]}>
            <Text style={[chainStyles.pillText, { color: i === 0 ? C.textOnSlate : C.textMuted }]}>
              {label}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const chainStyles = StyleSheet.create({
  pill: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 99,
    borderWidth: 1,
    minWidth: 180,
    alignItems: 'center',
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
  },
});

function PathsVisual() {
    const C = LightColors;
  return (
    <View style={{ gap: 12, width: '100%' }}>
      {/* Path A */}
      <View style={[pathStyles.card, { backgroundColor: C.surface, borderColor: C.border }]}>
        <View style={pathStyles.cardHeader}>
          <Text style={[pathStyles.cardLabel, { color: C.text }]}>Path A — Fast track</Text>
          <Text style={[pathStyles.cardStat, { color: C.sage }]}>90%</Text>
        </View>
        <Text style={[pathStyles.cardSub, { color: C.textMuted }]}>5 qualifying days</Text>
        <View style={pathStyles.dotsRow}>
          {[...Array(5)].map((_, i) => (
            <View key={i} style={[pathStyles.dot, { backgroundColor: i < 2 ? C.sage : C.border }]} />
          ))}
        </View>
      </View>
      {/* Path B */}
      <View style={[pathStyles.card, { backgroundColor: C.surface, borderColor: C.border }]}>
        <View style={pathStyles.cardHeader}>
          <Text style={[pathStyles.cardLabel, { color: C.text }]}>Path B — Consistent</Text>
          <Text style={[pathStyles.cardStat, { color: C.slate }]}>80%</Text>
        </View>
        <Text style={[pathStyles.cardSub, { color: C.textMuted }]}>10 qualifying days</Text>
        <View style={pathStyles.dotsRow}>
          {[...Array(10)].map((_, i) => (
            <View key={i} style={[pathStyles.dot, { backgroundColor: i < 4 ? C.slate : C.border }]} />
          ))}
        </View>
      </View>
    </View>
  );
}

const pathStyles = StyleSheet.create({
  card: { borderRadius: Radius.md, padding: Spacing.md, borderWidth: 0.5, gap: 6 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardLabel: { fontSize: 13, fontWeight: '600' },
  cardStat: { fontSize: 20, fontWeight: '700' },
  cardSub: { fontSize: 11 },
  dotsRow: { flexDirection: 'row', gap: 5, marginTop: 4 },
  dot: { width: 13, height: 13, borderRadius: 7 },
});

// ─── Slide data ────────────────────────────────────────────────────────────────

const SLIDE_CONTENT = [
  {
    key: 'welcome',
    eyebrow: 'Welcome to',
    title: 'Acuity',
    subtitle: 'Sharpen your musical ear.',
    body: 'Train your ear to recognise notes, intervals, chords, and progressions — through short daily sessions that adapt to your pace.',
    Visual: StaffVisual,
  },
  {
    key: 'concepts',
    eyebrow: 'Five concepts',
    title: 'One at a time.',
    subtitle: null,
    body: 'Each concept unlocks the next. Master note recognition before intervals, intervals before chords.',
    Visual: ChainVisualRN,
  },
  {
    key: 'mastery',
    eyebrow: 'Your pace',
    title: 'Two ways to unlock.',
    subtitle: null,
    body: 'Hit 90% on 5 days, or 80% on 10 days. Sessions must be on different days within a 60-day window.',
    Visual: PathsVisual,
  },
];

// ─── Main screen ───────────────────────────────────────────────────────────────

export default function OnboardingScreen() {
    const C = LightColors;
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / W);
    setActiveIndex(idx);
  };

  const handleNext = async () => {
    if (activeIndex < SLIDE_CONTENT.length - 1) {
      scrollRef.current?.scrollTo({ x: (activeIndex + 1) * W, animated: true });
    } else {
      await markOnboardingComplete();
      router.replace('/');
    }
  };

  const handleSkip = async () => {
    await markOnboardingComplete();
    router.replace('/');
  };

  return (
    <View style={[styles.root, { backgroundColor: C.surface }]}>
      {/* Skip button */}
      {activeIndex < SLIDE_CONTENT.length - 1 && (
        <Pressable
          style={[styles.skipBtn, { top: insets.top + 12 }]}
          onPress={handleSkip}
        >
          <Text style={[styles.skipText, { color: C.textMuted }]}>Skip</Text>
        </Pressable>
      )}

      {/* Slides */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
      >
        {SLIDE_CONTENT.map((slide) => (
          <View key={slide.key} style={[styles.slide, { width: W, paddingTop: insets.top + 60 }]}>
            {/* Visual */}
            <View style={styles.visualArea}>
              <slide.Visual />
            </View>

            {/* Text */}
            <View style={styles.textArea}>
              <Text style={[styles.eyebrow, { color: C.textMuted }]}>{slide.eyebrow}</Text>
                            <Text style={[styles.title, { color: C.text }]}>{slide.title}</Text>
              {slide.subtitle && (
                                <Text style={[styles.subtitle, { color: C.textSecondary }]}>{slide.subtitle}</Text>
              )}
              <Text style={[styles.body, { color: C.textSecondary }]}>{slide.body}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom — dots + button */}
      <View style={[styles.bottom, { paddingBottom: insets.bottom + 24 }]}>
        <View style={styles.dots}>
          {SLIDE_CONTENT.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor: i === activeIndex ? C.slate : C.border,
                  width: i === activeIndex ? 24 : 6,
                },
              ]}
            />
          ))}
        </View>
        <Pressable
          style={[styles.ctaBtn, { backgroundColor: C.slate }]}
          onPress={handleNext}
        >
          <Text style={[styles.ctaBtnText, { color: C.textOnSlate }]}>
            {activeIndex === SLIDE_CONTENT.length - 1 ? "Let's go" : 'Next'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  skipBtn: {
    position: 'absolute',
    right: Spacing.xl,
    zIndex: 10,
    padding: Spacing.sm,
  },
  slide: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  visualArea: {
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  textArea: {
    gap: Spacing.sm,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 17,
    fontWeight: '500',
  },
  body: {
    fontSize: 15,
    lineHeight: 24,
    marginTop: Spacing.xs,
  },
  bottom: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.lg,
    alignItems: 'center',
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  ctaBtn: {
    paddingHorizontal: 48,
    paddingVertical: Spacing.lg,
    borderRadius: Radius.lg,
    width: '100%',
    alignItems: 'center',
  },
  ctaBtnText: {
    fontSize: 16,
    fontWeight: '600',
  },
  skipText: {
  fontSize: 14,
  fontWeight: '600',
  },
});