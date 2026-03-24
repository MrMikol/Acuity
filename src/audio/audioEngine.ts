/**
 * Acuity — Audio Engine
 *
 * Loads Salamander Grand Piano samples from the assets/samples folder
 * and provides clean play/stop API for notes, intervals, and chords.
 *
 * Salamander Grand Piano is CC-BY license (Alexander Holm).
 * Samples are named: A0.mp3, Bb0.mp3, C1.mp3 ... C8.mp3
 * We use a subset — every 3rd note — and pitch-shift the rest in JS.
 *
 * HOW TO POPULATE SAMPLES:
 * 1. Download Salamander Grand Piano from https://freepats.zenvoid.org/Piano/
 * 2. Export one mp3 per sample note into assets/samples/salamander/
 * 3. File naming: A0.mp3, C1.mp3, D#1.mp3, F#1.mp3, A1.mp3, ... C8.mp3
 *    (every minor 3rd across the full range)
 * 4. The AudioEngine will pick the nearest sample and transpose.
 *
 * For development without samples, the engine gracefully no-ops.
 */

import { Audio } from 'expo-av';
import type { AVPlaybackSource } from 'expo-av';

// ─── Sample map ───────────────────────────────────────────────────────────────
// Map MIDI note number → require() path.
// Adjust these requires as you add sample files to assets/samples/salamander/.

type SampleMap = Record<number, AVPlaybackSource | null>;

// MIDI note numbers for our sample set (A0=21, C1=24, every minor 3rd up to C8=108)
// You can expand this as you add more sample files.
const SAMPLE_MIDI_NOTES = [21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54,
                            57, 60, 63, 66, 69, 72, 75, 78, 81, 84, 87, 90,
                            93, 96, 99, 102, 105, 108];

// Build the sample map at module load time.
// IMPORTANT: React Native requires static require() — no dynamic paths.
// Add each sample file here explicitly as you add the audio files.
const SAMPLE_SOURCES: Partial<Record<number, AVPlaybackSource>> = {
  // Octave 2
  36: require('../../assets/samples/salamander/C2.mp3'),
  39: require('../../assets/samples/salamander/Eb2.mp3'),
  42: require('../../assets/samples/salamander/Gb2.mp3'),
  45: require('../../assets/samples/salamander/A2.mp3'),
  // Octave 3
  48: require('../../assets/samples/salamander/C3.mp3'),
  51: require('../../assets/samples/salamander/Eb3.mp3'),
  54: require('../../assets/samples/salamander/Gb3.mp3'),
  57: require('../../assets/samples/salamander/A3.mp3'),
  // Octave 4 (center — most important)
  60: require('../../assets/samples/salamander/C4.mp3'),
  63: require('../../assets/samples/salamander/Eb4.mp3'),
  66: require('../../assets/samples/salamander/Gb4.mp3'),
  69: require('../../assets/samples/salamander/A4.mp3'),
  // Octave 5
  72: require('../../assets/samples/salamander/C5.mp3'),
  75: require('../../assets/samples/salamander/Eb5.mp3'),
  78: require('../../assets/samples/salamander/Gb5.mp3'),
  81: require('../../assets/samples/salamander/A5.mp3'),
  // Octave 6
  84: require('../../assets/samples/salamander/C6.mp3'),
};

// ─── Find nearest sample ──────────────────────────────────────────────────────

function nearestSample(midi: number): { midi: number; source: AVPlaybackSource } | null {
  const keys = Object.keys(SAMPLE_SOURCES).map(Number).sort((a, b) => a - b);
  if (keys.length === 0) return null;

  let nearest = keys[0];
  let minDist = Math.abs(midi - nearest);

  for (const k of keys) {
    const dist = Math.abs(midi - k);
    if (dist < minDist) {
      minDist = dist;
      nearest = k;
    }
  }

  const source = SAMPLE_SOURCES[nearest];
  return source ? { midi: nearest, source } : null;
}

// ─── Pitch rate calculation ────────────────────────────────────────────────────
// Expo-av supports `rate` for playback speed. 
// Pitch shifting via rate is approximate but good enough for ear training.
// Each semitone = 2^(1/12) ≈ 1.0595 rate multiplier.

function pitchRate(sampleMidi: number, targetMidi: number): number {
  const semitones = targetMidi - sampleMidi;
  return Math.pow(2, semitones / 12);
}

// ─── Sound pool ────────────────────────────────────────────────────────────────

const soundPool: Audio.Sound[] = [];
const MAX_POOL_SIZE = 6; // max simultaneous notes (for chords)

async function playSource(
  source: AVPlaybackSource,
  rate: number,
  volume: number = 1.0
): Promise<Audio.Sound | null> {
  try {
    // Recycle oldest sounds if pool full
    if (soundPool.length >= MAX_POOL_SIZE) {
      const old = soundPool.shift();
      old?.unloadAsync().catch(() => {});
    }

    const { sound } = await Audio.Sound.createAsync(source, {
      shouldPlay: true,
      volume,
      rate,
      pitchCorrectionQuality: Audio.PitchCorrectionQuality.High,
    });

    soundPool.push(sound);

    // Auto-unload after 4 seconds to prevent memory leak
    setTimeout(() => {
      sound.unloadAsync().catch(() => {});
      const idx = soundPool.indexOf(sound);
      if (idx >= 0) soundPool.splice(idx, 1);
    }, 4000);

    return sound;
  } catch {
    // No sample file present — graceful no-op
    return null;
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function initAudio(): Promise<void> {
  await Audio.setAudioModeAsync({
    playsInSilentModeIOS: true,
    staysActiveInBackground: false,
  });
}

/**
 * Play a single MIDI note.
 * @param midi MIDI note number (middle C = 60)
 * @param volume 0–1
 */
export async function playNote(midi: number, volume: number = 0.9): Promise<void> {
  const nearest = nearestSample(midi);
  if (!nearest) return;

  const rate = pitchRate(nearest.midi, midi);
  await playSource(nearest.source, rate, volume);
}

/**
 * Play two notes as a harmonic interval (simultaneously).
 */
export async function playInterval(
  rootMidi: number,
  semitones: number,
  harmonic: boolean = false
): Promise<void> {
  if (harmonic) {
    await Promise.all([
      playNote(rootMidi, 0.8),
      playNote(rootMidi + semitones, 0.8),
    ]);
  } else {
    // Melodic — play ascending with slight delay
    await playNote(rootMidi, 0.9);
    setTimeout(() => playNote(rootMidi + semitones, 0.9), 600);
  }
}

/**
 * Play a chord (all notes simultaneously).
 */
export async function playChord(rootMidi: number, intervals: number[]): Promise<void> {
  await Promise.all(
    intervals.map((semitones) => playNote(rootMidi + semitones, 0.75))
  );
}

/**
 * Stop and unload all active sounds.
 */
export async function stopAll(): Promise<void> {
  await Promise.all(soundPool.map((s) => s.unloadAsync().catch(() => {})));
  soundPool.length = 0;
}
