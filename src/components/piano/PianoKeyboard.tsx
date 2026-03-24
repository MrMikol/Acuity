/**
 * PianoKeyboard
 *
 * A reusable interactive piano keyboard spanning a configurable range.
 * Shows white and black keys. Highlights pressed keys.
 * Fires onNotePress(midiNote) callback.
 *
 * Default range: C3–C6 (37 keys) — good for ear training.
 * Compact mode: C4–C5 (13 keys) — for simpler exercises.
 */

import React, { useCallback } from 'react';
import { View, Pressable, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../../theme';

const SCREEN_W = Dimensions.get('window').width;

// ─── Key geometry ─────────────────────────────────────────────────────────────

const OCTAVE_PATTERN = [
  { semitone: 0,  isBlack: false }, // C
  { semitone: 1,  isBlack: true  }, // C#
  { semitone: 2,  isBlack: false }, // D
  { semitone: 3,  isBlack: true  }, // D#
  { semitone: 4,  isBlack: false }, // E
  { semitone: 5,  isBlack: false }, // F
  { semitone: 6,  isBlack: true  }, // F#
  { semitone: 7,  isBlack: false }, // G
  { semitone: 8,  isBlack: true  }, // G#
  { semitone: 9,  isBlack: false }, // A
  { semitone: 10, isBlack: true  }, // A#
  { semitone: 11, isBlack: false }, // B
];

// Black key horizontal offset within each white key pair (fraction of white key width)
const BLACK_KEY_OFFSETS: Record<number, number> = {
  1:  0.6,  // C# sits 60% into C's width
  3:  0.6,  // D# sits 60% into D's width
  6:  0.6,  // F#
  8:  0.6,  // G#
  10: 0.6,  // A#
};

interface KeyInfo {
  midi: number;
  isBlack: boolean;
  whiteIndex: number; // position among white keys
}

function buildKeys(startMidi: number, endMidi: number): KeyInfo[] {
  const keys: KeyInfo[] = [];
  let whiteIndex = 0;
  for (let midi = startMidi; midi <= endMidi; midi++) {
    const semitone = midi % 12;
    const isBlack = [1, 3, 6, 8, 10].includes(semitone);
    keys.push({ midi, isBlack, whiteIndex: isBlack ? whiteIndex - 1 : whiteIndex });
    if (!isBlack) whiteIndex++;
  }
  return keys;
}

// ─── Component ────────────────────────────────────────────────────────────────

interface PianoKeyboardProps {
  startMidi?: number;  // default 48 = C3
  endMidi?: number;    // default 84 = C6
  pressedMidi?: Set<number>;
  highlightedMidi?: Set<number>; // shown in sage green (answer reveal)
  wrongMidi?: Set<number>;       // shown in blush (wrong answer)
  onNotePress: (midi: number) => void;
  disabled?: boolean;
  height?: number;     // total keyboard height (default 120)
}

export const PianoKeyboard: React.FC<PianoKeyboardProps> = ({
  startMidi = 48,
  endMidi = 84,
  pressedMidi = new Set(),
  highlightedMidi = new Set(),
  wrongMidi = new Set(),
  onNotePress,
  disabled = false,
  height = 120,
}) => {
  const keys = buildKeys(startMidi, endMidi);
  const whiteKeys = keys.filter((k) => !k.isBlack);
  const blackKeys = keys.filter((k) => k.isBlack);

  const padding = 12;
  const totalWidth = SCREEN_W - padding * 2;
  const whiteKeyW = totalWidth / whiteKeys.length;
  const blackKeyW = whiteKeyW * 0.6;
  const blackKeyH = height * 0.58;

  const keyColor = useCallback(
    (key: KeyInfo): string => {
      if (highlightedMidi.has(key.midi)) return Colors.sage;
      if (wrongMidi.has(key.midi)) return Colors.blush;
      if (pressedMidi.has(key.midi)) return Colors.slateLight;
      return key.isBlack ? Colors.slate : Colors.white;
    },
    [pressedMidi, highlightedMidi, wrongMidi]
  );

  return (
    <View style={[styles.keyboard, { height, paddingHorizontal: padding }]}>
      {/* White keys */}
      <View style={[styles.whiteRow, { height }]}>
        {whiteKeys.map((key, i) => (
          <Pressable
            key={key.midi}
            onPress={() => !disabled && onNotePress(key.midi)}
            style={({ pressed }) => [
              styles.whiteKey,
              {
                width: whiteKeyW - 2,
                height,
                backgroundColor: keyColor(key),
                opacity: pressed && !disabled ? 0.75 : 1,
              },
            ]}
          />
        ))}
      </View>

      {/* Black keys — absolute overlay */}
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        {blackKeys.map((key) => {
          const semitone = key.midi % 12;
          const offset = BLACK_KEY_OFFSETS[semitone] ?? 0.6;
          // Position: left edge of the white key it belongs to + offset
          const leftX = padding + key.whiteIndex * whiteKeyW + whiteKeyW * offset - blackKeyW / 2;

          return (
            <Pressable
              key={key.midi}
              onPress={() => !disabled && onNotePress(key.midi)}
              style={({ pressed }) => [
                styles.blackKey,
                {
                  left: leftX,
                  width: blackKeyW,
                  height: blackKeyH,
                  backgroundColor: keyColor(key),
                  opacity: pressed && !disabled ? 0.7 : 1,
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  keyboard: {
    position: 'relative',
    alignSelf: 'stretch',
  },
  whiteRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 2,
  },
  whiteKey: {
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: Colors.warmGray,
    // bottom rounded corners only (like a real piano key)
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  blackKey: {
    position: 'absolute',
    top: 0,
    borderRadius: 4,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    zIndex: 2,
  },
});

export default PianoKeyboard;
