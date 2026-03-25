import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { LightColors, Spacing, Radius, Typography } from '../src/theme';
import { getAllMastery } from '../src/store/masteryStore';
import IntervalExercise from '../src/components/exercises/IntervalExercise';

type PracticeView = 'menu' | 'interval_exercise';

export default function PracticeScreen() {
  const [view, setView] = useState<PracticeView>('menu');
  const [unlockedConcepts, setUnlockedConcepts] = useState<string[]>(['notes']);
  const [lastResult, setLastResult] = useState<{ correct: number; total: number } | null>(null);

  const colors = LightColors;

  useEffect(() => {
    getAllMastery().then((m) => {
      setUnlockedConcepts(Object.values(m.concepts).filter((c) => c.unlocked).map((c) => c.conceptId));
    });
  }, []);

  if (view === 'interval_exercise') {
    return (
      <View style={{ flex: 1, backgroundColor: colors.surface }}>
        <Pressable onPress={() => setView('menu')} style={{ padding: Spacing.lg, paddingBottom: 0 }}>
          <Text style={{ fontSize: 13, color: colors.slate, fontWeight: '500' }}>← Back</Text>
        </Pressable>
        <IntervalExercise
          useBasicOnly={!unlockedConcepts.includes('all_intervals')}
          onSessionComplete={(correct, total) => { setLastResult({ correct, total }); setView('menu'); }}
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {lastResult && (
        <View
          style={[
            styles.resultBanner,
            {
              backgroundColor:
                lastResult.correct / lastResult.total >= 0.8
                  ? colors.sageLight
                  : colors.blushLight,
            },
          ]}
        >
          <Text style={{ fontSize: 13, color: colors.text, fontWeight: '500' }}>
            Last session: {lastResult.correct}/{lastResult.total} correct ({Math.round((lastResult.correct / lastResult.total) * 100)}%)
          </Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>Available exercises</Text>

      {unlockedConcepts.includes('notes') && (
        <View style={[styles.card, { opacity: 0.6 }]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Note recognition</Text>
            <Text style={styles.cardDesc}>Hear a single note and identify it on the keyboard.</Text>
          </View>
          <View style={styles.comingSoonBadge}><Text style={styles.comingSoonText}>Phase 2</Text></View>
        </View>
      )}

      {unlockedConcepts.includes('basic_intervals') ? (
        <>
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Interval identification</Text>
              <Text style={styles.cardDesc}>Hear an interval and identify it from the options.</Text>
            </View>
            <Pressable style={styles.startBtn} onPress={() => setView('interval_exercise')}>
              <Text style={styles.startBtnText}>Start</Text>
            </Pressable>
          </View>
          <Pressable style={styles.quickStart} onPress={() => setView('interval_exercise')}>
            <Text style={styles.quickStartText}>▶  Start interval practice</Text>
          </Pressable>
        </>
      ) : (
        <View style={styles.lockedSection}>
          <Text style={styles.lockedTitle}>More exercises unlock as you progress</Text>
          <Text style={styles.lockedDesc}>Complete Note Recognition to unlock Interval Identification.</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: LightColors.surface },
  content: { padding: Spacing.lg },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: LightColors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  resultBanner: {
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginBottom: Spacing.lg,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: LightColors.white,
    borderRadius: Radius.lg,
    borderWidth: 0.5,
    borderColor: LightColors.warmGray,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: LightColors.text,
    marginBottom: 2,
  },
  cardDesc: {
    fontSize: 13,
    color: LightColors.textSecondary,
  },
  startBtn: {
    backgroundColor: LightColors.slate,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
  },
  startBtnText: {
    color: LightColors.cream,
    fontSize: 13,
    fontWeight: '600',
  },
  comingSoonBadge: {
    backgroundColor: LightColors.warmGray,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.md,
  },
  comingSoonText: {
    fontSize: 11,
    color: LightColors.textMuted,
    fontWeight: '500',
  },
  lockedSection: {
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  lockedTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: LightColors.textSecondary,
    textAlign: 'center',
  },
  lockedDesc: {
    fontSize: 13,
    color: LightColors.textMuted,
    textAlign: 'center',
  },
  quickStart: {
    backgroundColor: LightColors.slate,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  quickStartText: {
    color: LightColors.cream,
    fontSize: 17,
    fontWeight: '600',
  },
});