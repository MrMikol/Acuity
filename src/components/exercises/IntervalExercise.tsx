/**
 * IntervalExercise
 *
 * Core Phase 1 exercise: hear an interval, identify it.
 *
 * Flow:
 *   1. Press Play → interval plays (melodic ascending by default)
 *   2. Tap your answer from the option buttons
 *   3. See immediate feedback (correct/wrong + label)
 *   4. Press Next → repeat
 *
 * Tracks correct/total for session. On session end, records to masteryStore.
 */

import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Colors, Spacing, Radius, Typography } from '../../theme';
import { INTERVALS, BASIC_INTERVALS, type Interval } from '../../utils/musicTheory';
import { playInterval } from '../../audio/audioEngine';
import { recordSession } from '../../store/masteryStore';
import PianoKeyboard from '../piano/PianoKeyboard';

// ─── Constants ────────────────────────────────────────────────────────────────

const QUESTIONS_PER_SESSION = 10;
const ROOT_MIDI = 60; // always start from C4 — simpler for beginners

// ─── Types ────────────────────────────────────────────────────────────────────

type AnswerState = 'idle' | 'playing' | 'answered_correct' | 'answered_wrong';

interface Question {
  interval: Interval;
  rootMidi: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildQuestion(useBasicOnly: boolean): Question {
  const pool = useBasicOnly ? BASIC_INTERVALS : INTERVALS;
  return {
    interval: pickRandom(pool),
    // Vary root over C3–C5 to keep it interesting but not too high/low
    rootMidi: 48 + Math.floor(Math.random() * 24),
  };
}

function buildChoices(correct: Interval, useBasicOnly: boolean): Interval[] {
  const pool = useBasicOnly ? BASIC_INTERVALS : INTERVALS;
  const distractors = pool.filter((i) => i.name !== correct.name);
  const shuffled = [...distractors].sort(() => Math.random() - 0.5).slice(0, 3);
  const all = [...shuffled, correct].sort(() => Math.random() - 0.5);
  return all;
}

// ─── Component ────────────────────────────────────────────────────────────────

interface IntervalExerciseProps {
  useBasicOnly?: boolean;
  onSessionComplete?: (correct: number, total: number) => void;
}

export const IntervalExercise: React.FC<IntervalExerciseProps> = ({
  useBasicOnly = true,
  onSessionComplete,
}) => {
  const [question, setQuestion] = useState<Question>(() => buildQuestion(useBasicOnly));
  const [choices, setChoices] = useState<Interval[]>(() =>
    buildChoices(question.interval, useBasicOnly)
  );
  const [answerState, setAnswerState] = useState<AnswerState>('idle');
  const [selectedInterval, setSelectedInterval] = useState<Interval | null>(null);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Track pressed keys on the keyboard for visual feedback
  const [pressedKeys, setPressedKeys] = useState<Set<number>>(new Set());

  const advanceQuestion = useCallback(() => {
    const next = buildQuestion(useBasicOnly);
    setQuestion(next);
    setChoices(buildChoices(next.interval, useBasicOnly));
    setAnswerState('idle');
    setSelectedInterval(null);
    setPressedKeys(new Set());
  }, [useBasicOnly]);

  const handlePlay = useCallback(async () => {
    if (isPlaying) return;
    setIsPlaying(true);

    // Show the two keys being played
    const rootMidi = question.rootMidi;
    const topMidi = rootMidi + question.interval.semitones;
    setPressedKeys(new Set([rootMidi, topMidi]));

    await playInterval(question.rootMidi, question.interval.semitones, false);

    // Keep keys highlighted for a moment after playing
    setTimeout(() => {
      setPressedKeys(new Set());
      setIsPlaying(false);
    }, 1800);
  }, [question, isPlaying]);

  const handleAnswer = useCallback(
    async (choice: Interval) => {
      if (answerState !== 'idle' && answerState !== 'playing') return;

      const isCorrect = choice.name === question.interval.name;
      setSelectedInterval(choice);
      setAnswerState(isCorrect ? 'answered_correct' : 'answered_wrong');

      const newTotal = sessionTotal + 1;
      const newCorrect = isCorrect ? sessionCorrect + 1 : sessionCorrect;
      setSessionTotal(newTotal);
      if (isCorrect) setSessionCorrect(newCorrect);

      if (newTotal >= QUESTIONS_PER_SESSION) {
        // End of session
        setTimeout(async () => {
          await recordSession('basic_intervals', newCorrect, newTotal);
          onSessionComplete?.(newCorrect, newTotal);
          setIsFinished(true);
        }, 1200);
      }
    },
    [answerState, question, sessionTotal, sessionCorrect, onSessionComplete]
  );

  const handleRestart = useCallback(() => {
    setSessionCorrect(0);
    setSessionTotal(0);
    setIsFinished(false);
    advanceQuestion();
  }, [advanceQuestion]);

  // ─── Session complete screen ──────────────────────────────────────────────

  if (isFinished) {
    const pct = Math.round((sessionCorrect / QUESTIONS_PER_SESSION) * 100);
    const passed = pct >= 80;

    return (
      <View style={styles.resultContainer}>
        <Text style={styles.resultEmoji}>{passed ? '✓' : '○'}</Text>
        <Text style={styles.resultScore}>{pct}%</Text>
        <Text style={styles.resultLabel}>
          {sessionCorrect}/{QUESTIONS_PER_SESSION} correct
        </Text>
        <Text style={[styles.resultSub, { color: passed ? Colors.sage : Colors.blush }]}>
          {passed
            ? 'Counts toward your mastery path!'
            : 'Keep practicing to hit 80% or 90%'}
        </Text>
        <Pressable style={styles.primaryBtn} onPress={handleRestart}>
          <Text style={styles.primaryBtnText}>Practice again</Text>
        </Pressable>
      </View>
    );
  }

  // ─── Exercise screen ──────────────────────────────────────────────────────

  const topMidi = question.rootMidi + question.interval.semitones;
  const highlightedKeys =
    answerState.startsWith('answered')
      ? new Set([question.rootMidi, topMidi])
      : new Set<number>();
  const wrongKeys =
    answerState === 'answered_wrong' && selectedInterval
      ? new Set([question.rootMidi, question.rootMidi + selectedInterval.semitones])
      : new Set<number>();

  return (
    <ScrollView contentContainerStyle={styles.container} bounces={false}>
      {/* Session progress */}
      <View style={styles.progressRow}>
        <Text style={styles.progressText}>
          {sessionTotal}/{QUESTIONS_PER_SESSION}
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(sessionTotal / QUESTIONS_PER_SESSION) * 100}%` },
            ]}
          />
        </View>
        <Text style={styles.accuracyText}>
          {sessionTotal > 0 ? Math.round((sessionCorrect / sessionTotal) * 100) : '--'}%
        </Text>
      </View>

      {/* Play button */}
      <View style={styles.playSection}>
        <Pressable
          style={[styles.playBtn, isPlaying && styles.playBtnActive]}
          onPress={handlePlay}
          disabled={isPlaying}
        >
          {isPlaying ? (
            <ActivityIndicator color={Colors.cream} />
          ) : (
            <Text style={styles.playBtnText}>
              {answerState === 'idle' ? '▶  Play interval' : '↺  Play again'}
            </Text>
          )}
        </Pressable>
        {answerState === 'idle' && (
          <Text style={styles.playHint}>Listen carefully, then select below</Text>
        )}
      </View>

      {/* Piano keyboard visual */}
      <View style={styles.keyboardSection}>
        <PianoKeyboard
          startMidi={48}
          endMidi={72}
          pressedMidi={pressedKeys}
          highlightedMidi={answerState === 'answered_correct' ? highlightedKeys : new Set()}
          wrongMidi={answerState === 'answered_wrong' ? wrongKeys : new Set()}
          onNotePress={() => {}} // keyboard is visual-only in exercise mode
          disabled
          height={100}
        />
      </View>

      {/* Answer buttons */}
      <View style={styles.choicesGrid}>
        {choices.map((choice) => {
          const isSelected = selectedInterval?.name === choice.name;
          const isCorrectChoice = choice.name === question.interval.name;
          const showResult = answerState.startsWith('answered');

          let bg = Colors.warmGrayLight;
          let border = Colors.warmGray;
          let textColor = Colors.text;

          if (showResult) {
            if (isCorrectChoice) {
              bg = Colors.sageLight;
              border = Colors.sage;
              textColor = Colors.slateDark;
            } else if (isSelected && !isCorrectChoice) {
              bg = Colors.blushLight;
              border = Colors.blush;
              textColor = Colors.slateDark;
            }
          }

          return (
            <Pressable
              key={choice.name}
              style={[
                styles.choiceBtn,
                { backgroundColor: bg, borderColor: border },
              ]}
              onPress={() => handleAnswer(choice)}
              disabled={showResult}
            >
              <Text style={[styles.choiceBtnAbbr, { color: textColor }]}>
                {choice.abbreviation}
              </Text>
              <Text style={[styles.choiceBtnName, { color: textColor }]}>
                {choice.name}
              </Text>
              {showResult && isCorrectChoice && choice.mnemonic && (
                <Text style={styles.choiceMnemonic}>{choice.mnemonic}</Text>
              )}
            </Pressable>
          );
        })}
      </View>

      {/* Next button (shown after answer) */}
      {answerState.startsWith('answered') && sessionTotal < QUESTIONS_PER_SESSION && (
        <Pressable style={styles.nextBtn} onPress={advanceQuestion}>
          <Text style={styles.nextBtnText}>Next →</Text>
        </Pressable>
      )}
    </ScrollView>
  );
};

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing['3xl'],
    alignItems: 'stretch',
  },

  // Progress bar
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
    marginTop: Spacing.md,
  },
  progressText: {
    fontSize: Typography.sm,
    color: Colors.textMuted,
    fontWeight: Typography.medium,
    minWidth: 32,
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: Radius.full,
    backgroundColor: Colors.warmGray,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.slate,
    borderRadius: Radius.full,
  },
  accuracyText: {
    fontSize: Typography.sm,
    color: Colors.textMuted,
    fontWeight: Typography.medium,
    minWidth: 40,
    textAlign: 'right',
  },

  // Play section
  playSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  playBtn: {
    backgroundColor: Colors.slate,
    paddingHorizontal: Spacing['2xl'],
    paddingVertical: Spacing.lg,
    borderRadius: Radius.lg,
    minWidth: 200,
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  playBtnActive: {
    backgroundColor: Colors.slateLight,
  },
  playBtnText: {
    color: Colors.cream,
    fontSize: Typography.md,
    fontWeight: Typography.semibold,
  },
  playHint: {
    fontSize: Typography.sm,
    color: Colors.textMuted,
    textAlign: 'center',
  },

  // Keyboard
  keyboardSection: {
    marginBottom: Spacing.xl,
  },

  // Choices
  choicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  choiceBtn: {
    flex: 1,
    minWidth: '45%',
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: Spacing.md,
    alignItems: 'center',
  },
  choiceBtnAbbr: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    marginBottom: 2,
  },
  choiceBtnName: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    textAlign: 'center',
  },
  choiceMnemonic: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    marginTop: 4,
    textAlign: 'center',
  },

  // Next
  nextBtn: {
    alignSelf: 'flex-end',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.slate,
    borderRadius: Radius.lg,
  },
  nextBtnText: {
    color: Colors.cream,
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
  },

  // Result screen
  resultContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing['2xl'],
    gap: Spacing.sm,
  },
  resultEmoji: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  resultScore: {
    fontSize: Typography['3xl'],
    fontWeight: Typography.bold,
    color: Colors.slate,
  },
  resultLabel: {
    fontSize: Typography.md,
    color: Colors.textSecondary,
  },
  resultSub: {
    fontSize: Typography.base,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  primaryBtn: {
    marginTop: Spacing.xl,
    backgroundColor: Colors.slate,
    paddingHorizontal: Spacing['2xl'],
    paddingVertical: Spacing.lg,
    borderRadius: Radius.lg,
  },
  primaryBtnText: {
    color: Colors.cream,
    fontSize: Typography.md,
    fontWeight: Typography.semibold,
  },
});

export default IntervalExercise;
