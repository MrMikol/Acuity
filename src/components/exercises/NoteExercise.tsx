/**
 * NoteExercise
 *
 * Audio-only note recognition exercise.
 *
 * Flow:
 *   1. Session opens with a reference note (C4) — plays automatically
 *   2. "What note is this?" — mystery note plays automatically
 *   3. User taps a note name (A–G)
 *   4. Instant feedback → auto-advance after 1.4s
 *   5. After 10 questions → results screen
 *
 * The reference note can be replayed at any time via a subtle chip button.
 * No staff is shown — this is purely an ear training exercise.
 *
 * Scope: C4–B4 (middle octave)
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useTheme, Spacing, Radius, Typography } from '../../theme';
import { playNote } from '../../audio/audioEngine';

// ─── Constants ────────────────────────────────────────────────────────────────

const QUESTIONS_PER_SESSION = 10;
const AUTO_ADVANCE_MS = 1400;
const REFERENCE_MIDI = 60; // C4
const REFERENCE_NAME = 'C4';

const NOTE_NAMES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const;
type NoteName = typeof NOTE_NAMES[number];

interface NoteDefinition {
  name: NoteName;
  midi: number;
}

const NOTES: NoteDefinition[] = [
  { name: 'C', midi: 60 },
  { name: 'D', midi: 62 },
  { name: 'E', midi: 64 },
  { name: 'F', midi: 65 },
  { name: 'G', midi: 67 },
  { name: 'A', midi: 69 },
  { name: 'B', midi: 71 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pickRandomNote(exclude?: NoteDefinition): NoteDefinition {
  const pool = exclude ? NOTES.filter((n) => n.name !== exclude.name) : NOTES;
  return pool[Math.floor(Math.random() * pool.length)];
}

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase = 'reference' | 'question';
type AnswerState = 'idle' | 'answered_correct' | 'answered_wrong';

// ─── Main Component ───────────────────────────────────────────────────────────

interface NoteExerciseProps {
  onSessionComplete?: (correct: number, total: number) => void;
}

export const NoteExercise: React.FC<NoteExerciseProps> = ({ onSessionComplete }) => {
  const colors = useTheme();
  const styles = createStyles(colors);

  const [phase, setPhase] = useState<Phase>('reference');
  const [question, setQuestion] = useState<NoteDefinition>(() => pickRandomNote());
  const [answerState, setAnswerState] = useState<AnswerState>('idle');
  const [selectedNote, setSelectedNote] = useState<NoteName | null>(null);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [referenceHeard, setReferenceHeard] = useState(false);

  const prevQuestionRef = useRef<NoteDefinition | null>(null);

  // ── Audio helpers ────────────────────────────────────────────────────────────

  const playMidi = useCallback(async (midi: number) => {
    setIsPlaying(true);
    try {
      await playNote(midi);
    } finally {
      setTimeout(() => setIsPlaying(false), 800);
    }
  }, []);

  const playReference = useCallback(async () => {
    await playMidi(REFERENCE_MIDI);
    setReferenceHeard(true);
  }, [playMidi]);

  const playCurrentQuestion = useCallback(async (note: NoteDefinition) => {
    await playMidi(note.midi);
  }, [playMidi]);

  // ── Session start: auto-play reference note ──────────────────────────────────

  useEffect(() => {
    playReference();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Begin questioning ────────────────────────────────────────────────────────

  const startQuestions = useCallback(() => {
    setPhase('question');
    const first = pickRandomNote();
    prevQuestionRef.current = first;
    setQuestion(first);
    playCurrentQuestion(first);
  }, [playCurrentQuestion]);

  // ── Advance to next question ─────────────────────────────────────────────────

  const advanceQuestion = useCallback(() => {
    const next = pickRandomNote(prevQuestionRef.current ?? undefined);
    prevQuestionRef.current = next;
    setQuestion(next);
    setAnswerState('idle');
    setSelectedNote(null);
    playCurrentQuestion(next);
  }, [playCurrentQuestion]);

  // ── Answer handler ───────────────────────────────────────────────────────────

  const handleAnswer = useCallback(
    (name: NoteName) => {
      if (answerState !== 'idle') return;

      const isCorrect = name === question.name;
      const newTotal = sessionTotal + 1;
      const newCorrect = isCorrect ? sessionCorrect + 1 : sessionCorrect;

      setSelectedNote(name);
      setAnswerState(isCorrect ? 'answered_correct' : 'answered_wrong');
      setSessionTotal(newTotal);
      setSessionCorrect(newCorrect);

      if (newTotal >= QUESTIONS_PER_SESSION) {
        setTimeout(() => {
          setIsFinished(true);
          onSessionComplete?.(newCorrect, newTotal);
        }, AUTO_ADVANCE_MS);
      } else {
        setTimeout(() => advanceQuestion(), AUTO_ADVANCE_MS);
      }
    },
    [answerState, question, sessionTotal, sessionCorrect, onSessionComplete, advanceQuestion]
  );

  // ── Replay handlers ──────────────────────────────────────────────────────────

  const handleReplayQuestion = useCallback(() => {
    if (isPlaying) return;
    playCurrentQuestion(question);
  }, [isPlaying, question, playCurrentQuestion]);

  const handleReplayReference = useCallback(() => {
    if (isPlaying) return;
    playReference();
  }, [isPlaying, playReference]);

  // ── Restart ──────────────────────────────────────────────────────────────────

  const handleRestart = useCallback(() => {
    setSessionCorrect(0);
    setSessionTotal(0);
    setIsFinished(false);
    setAnswerState('idle');
    setSelectedNote(null);
    setReferenceHeard(false);
    setPhase('reference');
    playReference();
  }, [playReference]);

  // ── Results screen ───────────────────────────────────────────────────────────

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
        <Text style={[styles.resultSub, { color: passed ? colors.sage : colors.blush }]}>
          {passed
            ? 'Counts toward your mastery path!'
            : 'Keep practicing to hit 80%'}
        </Text>
        <Pressable style={styles.primaryBtn} onPress={handleRestart}>
          <Text style={styles.primaryBtnText}>Practice again</Text>
        </Pressable>
      </View>
    );
  }

  // ── Reference phase ──────────────────────────────────────────────────────────

  if (phase === 'reference') {
    return (
      <View style={styles.referenceContainer}>
        <Text style={styles.referenceHeading}>Reference note</Text>
        <Text style={styles.referenceSubtitle}>
          Listen carefully. Use this as your anchor for the whole session.
        </Text>

        <View style={styles.referenceNoteCard}>
          <Text style={styles.referenceNoteName}>{REFERENCE_NAME}</Text>
          <Text style={styles.referenceNoteLabel}>Middle C</Text>
        </View>

        <Pressable
          style={[styles.playReferenceBtn, isPlaying && styles.btnDisabled]}
          onPress={playReference}
          disabled={isPlaying}
        >
          {isPlaying ? (
            <ActivityIndicator color={colors.textOnSlate} />
          ) : (
            <Text style={styles.playReferenceBtnText}>
              {referenceHeard ? '↺  Play again' : '▶  Play C4'}
            </Text>
          )}
        </Pressable>

        {referenceHeard && (
          <Pressable
            style={[styles.beginBtn, isPlaying && styles.btnDisabled]}
            onPress={startQuestions}
            disabled={isPlaying}
          >
            <Text style={styles.beginBtnText}>I'm ready →</Text>
          </Pressable>
        )}

        <Text style={styles.referenceFootnote}>
          You can replay this reference at any point during the session.
        </Text>
      </View>
    );
  }

  // ── Question phase ───────────────────────────────────────────────────────────

  const answered = answerState !== 'idle';
  const isCorrect = answerState === 'answered_correct';

  return (
    <ScrollView contentContainerStyle={styles.container} bounces={false}>

      {/* Progress row */}
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
          {sessionTotal > 0
            ? Math.round((sessionCorrect / sessionTotal) * 100)
            : '--'}%
        </Text>
      </View>

      {/* Reference replay chip — subtle, always accessible */}
      <Pressable
        style={[styles.referenceChip, isPlaying && { opacity: 0.5 }]}
        onPress={handleReplayReference}
        disabled={isPlaying}
      >
        <Text style={styles.referenceChipText}>♩ {REFERENCE_NAME} reference</Text>
      </Pressable>

      {/* Main play area */}
      <View style={styles.playArea}>
        <Text style={styles.prompt}>What note is this?</Text>

        <Pressable
          style={[styles.playBtn, (isPlaying || answered) && styles.btnDisabled]}
          onPress={handleReplayQuestion}
          disabled={isPlaying || answered}
        >
          {isPlaying ? (
            <ActivityIndicator color={colors.textOnSlate} />
          ) : (
            <Text style={styles.playBtnText}>
              {answered ? '▶  Play note' : '▶  Play note'}
            </Text>
          )}
        </Pressable>

        {!answered && (
          <Text style={styles.playHint}>Listen, then tap the note name below</Text>
        )}
      </View>

      {/* Feedback */}
      {answered && (
        <View
          style={[
            styles.feedbackBanner,
            {
              backgroundColor: isCorrect ? `${colors.sage}20` : `${colors.blush}20`,
              borderColor: isCorrect ? colors.sage : colors.blush,
            },
          ]}
        >
          <Text
            style={[
              styles.feedbackText,
              { color: isCorrect ? colors.sageDark : colors.blushDark },
            ]}
          >
            {isCorrect
              ? `Correct! That's ${question.name}4`
              : `That was ${question.name}4 — you tapped ${selectedNote}`}
          </Text>
        </View>
      )}

      {/* Note name buttons */}
      <View style={styles.buttonGrid}>
        {NOTE_NAMES.map((name) => {
          const isSelected = selectedNote === name;
          const isCorrectBtn = name === question.name;

          let bg = colors.surfaceAlt;
          let border = colors.border;
          let textColor = colors.text;

          if (answered) {
            if (isCorrectBtn) {
              bg = `${colors.sage}20`;
              border = colors.sage;
              textColor = colors.slate;
            } else if (isSelected && !isCorrectBtn) {
              bg = `${colors.blush}20`;
              border = colors.blush;
              textColor = colors.slate;
            }
          }

          return (
            <Pressable
              key={name}
              style={[styles.noteBtn, { backgroundColor: bg, borderColor: border }]}
              onPress={() => handleAnswer(name)}
              disabled={answered}
            >
              <Text style={[styles.noteBtnText, { color: textColor }]}>{name}</Text>
            </Pressable>
          );
        })}
      </View>

    </ScrollView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

function createStyles(colors: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
    container: {
      paddingHorizontal: Spacing.lg,
      paddingBottom: Spacing['3xl'],
      alignItems: 'stretch',
    },

    // ── Reference phase ──────────────────────────────────────────────────────
    referenceContainer: {
      flex: 1,
      alignItems: 'center',
      paddingHorizontal: Spacing['2xl'],
      paddingTop: Spacing['2xl'],
      gap: Spacing.lg,
    },
    referenceHeading: {
      fontSize: Typography.xl,
      fontWeight: Typography.bold,
      color: colors.text,
      textAlign: 'center',
    },
    referenceSubtitle: {
      fontSize: Typography.base,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: Typography.base * Typography.normal,
    },
    referenceNoteCard: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: Radius.xl,
      paddingHorizontal: Spacing['3xl'],
      paddingVertical: Spacing.xl,
      alignItems: 'center',
      gap: Spacing.xs,
    },
    referenceNoteName: {
      fontSize: Typography['3xl'],
      fontWeight: Typography.bold,
      color: colors.slate,
    },
    referenceNoteLabel: {
      fontSize: Typography.sm,
      color: colors.textMuted,
      fontWeight: Typography.medium,
    },
    playReferenceBtn: {
      backgroundColor: colors.slate,
      paddingHorizontal: Spacing['2xl'],
      paddingVertical: Spacing.lg,
      borderRadius: Radius.lg,
      minWidth: 180,
      alignItems: 'center',
    },
    playReferenceBtnText: {
      color: colors.textOnSlate,
      fontSize: Typography.md,
      fontWeight: Typography.semibold,
    },
    beginBtn: {
      borderWidth: 1,
      borderColor: colors.slate,
      paddingHorizontal: Spacing['2xl'],
      paddingVertical: Spacing.lg,
      borderRadius: Radius.lg,
      minWidth: 180,
      alignItems: 'center',
    },
    beginBtnText: {
      color: colors.slate,
      fontSize: Typography.md,
      fontWeight: Typography.semibold,
    },
    referenceFootnote: {
      fontSize: Typography.sm,
      color: colors.textMuted,
      textAlign: 'center',
    },

    // ── Progress ─────────────────────────────────────────────────────────────
    progressRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
      marginBottom: Spacing.lg,
      marginTop: Spacing.md,
    },
    progressText: {
      fontSize: Typography.sm,
      color: colors.textMuted,
      fontWeight: Typography.medium,
      minWidth: 32,
    },
    progressBar: {
      flex: 1,
      height: 4,
      borderRadius: Radius.full,
      backgroundColor: colors.border,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: colors.slate,
      borderRadius: Radius.full,
    },
    accuracyText: {
      fontSize: Typography.sm,
      color: colors.textMuted,
      fontWeight: Typography.medium,
      minWidth: 40,
      textAlign: 'right',
    },

    // ── Reference chip ───────────────────────────────────────────────────────
    referenceChip: {
      alignSelf: 'center',
      backgroundColor: colors.surfaceAlt,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: Radius.full,
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.xs,
      marginBottom: Spacing.xl,
    },
    referenceChipText: {
      fontSize: Typography.sm,
      color: colors.textSecondary,
      fontWeight: Typography.medium,
    },

    // ── Play area ────────────────────────────────────────────────────────────
    playArea: {
      alignItems: 'center',
      marginBottom: Spacing.xl,
      gap: Spacing.md,
    },
    prompt: {
      fontSize: Typography.lg,
      fontWeight: Typography.semibold,
      color: colors.text,
      textAlign: 'center',
    },
    playBtn: {
      backgroundColor: colors.slate,
      paddingHorizontal: Spacing['2xl'],
      paddingVertical: Spacing.lg,
      borderRadius: Radius.lg,
      minWidth: 200,
      alignItems: 'center',
    },
    btnDisabled: {
      opacity: 0.5,
    },
    playBtnText: {
      color: colors.textOnSlate,
      fontSize: Typography.md,
      fontWeight: Typography.semibold,
    },
    playHint: {
      fontSize: Typography.sm,
      color: colors.textMuted,
      textAlign: 'center',
    },

    // ── Feedback ─────────────────────────────────────────────────────────────
    feedbackBanner: {
      borderWidth: 1,
      borderRadius: Radius.md,
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
      marginBottom: Spacing.lg,
      alignItems: 'center',
    },
    feedbackText: {
      fontSize: Typography.base,
      fontWeight: Typography.semibold,
      textAlign: 'center',
    },

    // ── Note buttons ─────────────────────────────────────────────────────────
    buttonGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.sm,
      justifyContent: 'center',
    },
    noteBtn: {
      width: 52,
      height: 52,
      borderRadius: Radius.md,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    noteBtnText: {
      fontSize: Typography.lg,
      fontWeight: Typography.bold,
      textAlignVertical: 'center',
      includeFontPadding: false,
    },

    // ── Results ──────────────────────────────────────────────────────────────
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
      color: colors.slate,
    },
    resultLabel: {
      fontSize: Typography.md,
      color: colors.textSecondary,
    },
    resultSub: {
      fontSize: Typography.base,
      textAlign: 'center',
      marginTop: Spacing.sm,
    },
    primaryBtn: {
      marginTop: Spacing.xl,
      backgroundColor: colors.slate,
      paddingHorizontal: Spacing['2xl'],
      paddingVertical: Spacing.lg,
      borderRadius: Radius.lg,
    },
    primaryBtnText: {
      color: colors.textOnSlate,
      fontSize: Typography.md,
      fontWeight: Typography.semibold,
    },
  });
}

export default NoteExercise;