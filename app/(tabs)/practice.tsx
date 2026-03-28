import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useTheme, Spacing, Radius, type ColorTheme } from '../../src/theme';
import { getAllMastery, recordSession } from '../../src/store/masteryStore';
import IntervalExercise from '../../src/components/exercises/IntervalExercise';
import NoteExercise from '../../src/components/exercises/NoteExercise';

type PracticeView = 'menu' | 'note_exercise' | 'interval_exercise';

export default function PracticeScreen() {
  const [view, setView] = useState<PracticeView>('menu');
  const [unlockedConcepts, setUnlockedConcepts] = useState<string[]>(['notes']);
  const [lastResult, setLastResult] = useState<{ correct: number; total: number } | null>(null);

  const colors = useTheme();
  const styles = createStyles(colors);

  const loadUnlockedConcepts = useCallback(async () => {
    const mastery = await getAllMastery();

    setUnlockedConcepts(
      Object.values(mastery.concepts)
        .filter((c) => c.unlocked)
        .map((c) => c.conceptId)
    );
  }, []);

  useEffect(() => {
    loadUnlockedConcepts();
  }, [loadUnlockedConcepts]);

  // ── Note Exercise ────────────────────────────────────────────────────────────

  if (view === 'note_exercise') {
    return (
      <View style={{ flex: 1, backgroundColor: colors.surface }}>
        <Pressable onPress={() => setView('menu')} style={{ padding: Spacing.lg, paddingBottom: 0 }}>
          <Text style={{ fontSize: 13, color: colors.slate, fontWeight: '500' }}>← Back</Text>
        </Pressable>

        <NoteExercise
          onSessionComplete={async (correct, total) => {
            await recordSession('notes', correct, total);
            await loadUnlockedConcepts();
            setLastResult({ correct, total });
          }}
        />
      </View>
    );
  }

  // ── Interval Exercise ────────────────────────────────────────────────────────

  if (view === 'interval_exercise') {
    return (
      <View style={{ flex: 1, backgroundColor: colors.surface }}>
        <Pressable onPress={() => setView('menu')} style={{ padding: Spacing.lg, paddingBottom: 0 }}>
          <Text style={{ fontSize: 13, color: colors.slate, fontWeight: '500' }}>← Back</Text>
        </Pressable>

        <IntervalExercise
          useBasicOnly={!unlockedConcepts.includes('all_intervals')}
          onSessionComplete={async (correct, total) => {
            const conceptId = unlockedConcepts.includes('all_intervals')
              ? 'all_intervals'
              : 'basic_intervals';

            await recordSession(conceptId, correct, total);
            await loadUnlockedConcepts();
            setLastResult({ correct, total });
          }}
        />
      </View>
    );
  }

  // ── Menu ─────────────────────────────────────────────────────────────────────

  const percent = lastResult && lastResult.total > 0
    ? Math.round((lastResult.correct / lastResult.total) * 100)
    : 0;

  const passed = lastResult ? lastResult.correct / lastResult.total >= 0.8 : false;

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {lastResult && (
        <View
          style={[
            styles.resultBanner,
            {
              backgroundColor: passed ? colors.sageLight : colors.blushLight,
              borderColor: passed ? colors.sage : colors.blush,
            },
          ]}
        >
          <Text style={styles.resultText}>
            Last session: {lastResult.correct}/{lastResult.total} correct ({percent}%)
          </Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>Available exercises</Text>

      {/* Note Recognition */}
      {unlockedConcepts.includes('notes') && (
        <View style={styles.card}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Note recognition</Text>
            <Text style={styles.cardDesc}>
              See a note on the staff, hear it play, then name it.
            </Text>
          </View>
          <Pressable style={styles.startBtn} onPress={() => setView('note_exercise')}>
            <Text style={styles.startBtnText}>Start</Text>
          </Pressable>
        </View>
      )}

      {/* Interval Identification */}
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
            <Text style={styles.quickStartText}>▶ Start interval practice</Text>
          </Pressable>
        </>
      ) : (
        <View style={styles.lockedSection}>
          <Text style={styles.lockedTitle}>More exercises unlock as you progress</Text>
          <Text style={styles.lockedDesc}>
            Complete Note Recognition to unlock Interval Identification.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

function createStyles(colors: ColorTheme) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.surface,
    },
    content: {
      padding: Spacing.lg,
    },
    sectionTitle: {
      fontSize: 11,
      fontWeight: '600',
      color: colors.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: Spacing.md,
      marginTop: Spacing.sm,
    },
    resultBanner: {
      padding: Spacing.md,
      borderRadius: Radius.md,
      marginBottom: Spacing.lg,
      borderWidth: 1,
    },
    resultText: {
      fontSize: 13,
      color: colors.text,
      fontWeight: '500',
    },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: Radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: Spacing.lg,
      marginBottom: Spacing.md,
      gap: Spacing.md,
    },
    cardTitle: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 2,
    },
    cardDesc: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    startBtn: {
      backgroundColor: colors.slate,
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.sm,
      borderRadius: Radius.md,
    },
    startBtnText: {
      color: colors.textOnSlate,
      fontSize: 13,
      fontWeight: '600',
    },
    lockedSection: {
      padding: Spacing.xl,
      alignItems: 'center',
      gap: Spacing.xs,
    },
    lockedTitle: {
      fontSize: 15,
      fontWeight: '500',
      color: colors.textSecondary,
      textAlign: 'center',
    },
    lockedDesc: {
      fontSize: 13,
      color: colors.textMuted,
      textAlign: 'center',
    },
    quickStart: {
      backgroundColor: colors.slate,
      padding: Spacing.lg,
      borderRadius: Radius.lg,
      alignItems: 'center',
      marginTop: Spacing.md,
    },
    quickStartText: {
      color: colors.textOnSlate,
      fontSize: 17,
      fontWeight: '600',
    },
  });
}