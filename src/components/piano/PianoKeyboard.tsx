/**
 * PianoKeyboard
 *
 * A reusable interactive piano keyboard spanning a configurable range.
 * Shows white and black keys. Highlights pressed keys.
 * Fires onNotePress(midiNote) callback.
 */

import React, { useCallback, useState } from 'react';
import { View, Pressable, StyleSheet, LayoutChangeEvent } from 'react-native';
import { Colors } from '../../theme';

interface KeyInfo {
  midi: number;
  isBlack: boolean;
  whiteIndex: number;
}

function buildKeys(startMidi: number, endMidi: number): KeyInfo[] {
  const keys: KeyInfo[] = [];
  let whiteIndex = 0;

  for (let midi = startMidi; midi <= endMidi; midi++) {
    const semitone = midi % 12;
    const isBlack = [1, 3, 6, 8, 10].includes(semitone);

    keys.push({
      midi,
      isBlack,
      whiteIndex: isBlack ? whiteIndex - 1 : whiteIndex,
    });

    if (!isBlack) whiteIndex++;
  }

  return keys;
}

interface PianoKeyboardProps {
  startMidi?: number;
  endMidi?: number;
  pressedMidi?: Set<number>;
  highlightedMidi?: Set<number>;
  wrongMidi?: Set<number>;
  onNotePress: (midi: number) => void;
  disabled?: boolean;
  height?: number;
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
  const [containerWidth, setContainerWidth] = useState(0);

  const keys = buildKeys(startMidi, endMidi);
  const whiteKeys = keys.filter((k) => !k.isBlack);
  const blackKeys = keys.filter((k) => k.isBlack);

  const padding = 12;
  const usableWidth = Math.max(containerWidth - padding * 2, 0);
  const whiteKeyW = whiteKeys.length > 0 ? usableWidth / whiteKeys.length : 0;
  const blackKeyW = whiteKeyW * 0.62;
  const blackKeyH = height * 0.58;

  const keyColor = useCallback(
    (key: KeyInfo): string => {
      if (highlightedMidi.has(key.midi)) return Colors.sage;
      if (wrongMidi.has(key.midi)) return Colors.blush;

      if (pressedMidi.has(key.midi)) {
        return key.isBlack ? Colors.cream : Colors.slateLight;
      }

      return key.isBlack ? Colors.slate : Colors.white;
    },
    [pressedMidi, highlightedMidi, wrongMidi]
  );

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  }, []);

  return (
    <View
      style={[styles.keyboard, { height, paddingHorizontal: padding }]}
      onLayout={handleLayout}
    >
      {containerWidth > 0 && (
        <>
          <View style={[styles.whiteRow, { height }]}>
            {whiteKeys.map((key) => (
              <Pressable
                key={key.midi}
                onPress={() => !disabled && onNotePress(key.midi)}
                style={({ pressed }) => [
                  styles.whiteKey,
                  {
                    width: whiteKeyW,
                    height,
                    backgroundColor: keyColor(key),
                    opacity: pressed && !disabled ? 0.75 : 1,
                  },
                ]}
              />
            ))}
          </View>

          <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
            {blackKeys.map((key) => {
              const leftX =
                padding + key.whiteIndex * whiteKeyW + whiteKeyW - blackKeyW / 2;

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
        </>
      )}
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
  },
  whiteKey: {
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: Colors.warmGray,
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