import { Audio } from 'expo-av';
import type { AVPlaybackSource } from 'expo-av';

// Sample map — add entries here as you download Salamander files.
// Using a function wrapper so missing files don't crash the bundler.
function buildSampleSources(): Partial<Record<number, AVPlaybackSource>> {
  const sources: Partial<Record<number, AVPlaybackSource>> = {};
  // Uncomment each line after adding the corresponding file to assets/samples/salamander/
  // sources[36] = require('../../assets/samples/salamander/C2.mp3');
  // sources[39] = require('../../assets/samples/salamander/Eb2.mp3');
  // sources[42] = require('../../assets/samples/salamander/Gb2.mp3');
  // sources[45] = require('../../assets/samples/salamander/A2.mp3');
  // sources[48] = require('../../assets/samples/salamander/C3.mp3');
  // sources[51] = require('../../assets/samples/salamander/Eb3.mp3');
  // sources[54] = require('../../assets/samples/salamander/Gb3.mp3');
  // sources[57] = require('../../assets/samples/salamander/A3.mp3');
  // sources[60] = require('../../assets/samples/salamander/C4.mp3');
  // sources[63] = require('../../assets/samples/salamander/Eb4.mp3');
  // sources[66] = require('../../assets/samples/salamander/Gb4.mp3');
  // sources[69] = require('../../assets/samples/salamander/A4.mp3');
  // sources[72] = require('../../assets/samples/salamander/C5.mp3');
  // sources[75] = require('../../assets/samples/salamander/Eb5.mp3');
  // sources[78] = require('../../assets/samples/salamander/Gb5.mp3');
  // sources[81] = require('../../assets/samples/salamander/A5.mp3');
  // sources[84] = require('../../assets/samples/salamander/C6.mp3');
  return sources;
}

const SAMPLE_SOURCES = buildSampleSources();

function nearestSample(midi: number): { midi: number; source: AVPlaybackSource } | null {
  const keys = Object.keys(SAMPLE_SOURCES).map(Number).sort((a, b) => a - b);
  if (keys.length === 0) return null;
  let nearest = keys[0];
  let minDist = Math.abs(midi - nearest);
  for (const k of keys) {
    const dist = Math.abs(midi - k);
    if (dist < minDist) { minDist = dist; nearest = k; }
  }
  const source = SAMPLE_SOURCES[nearest];
  return source ? { midi: nearest, source } : null;
}

function pitchRate(sampleMidi: number, targetMidi: number): number {
  return Math.pow(2, (targetMidi - sampleMidi) / 12);
}

const soundPool: Audio.Sound[] = [];
const MAX_POOL_SIZE = 6;

async function playSource(source: AVPlaybackSource, rate: number, volume: number = 1.0): Promise<Audio.Sound | null> {
  try {
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
    setTimeout(() => {
      sound.unloadAsync().catch(() => {});
      const idx = soundPool.indexOf(sound);
      if (idx >= 0) soundPool.splice(idx, 1);
    }, 4000);
    return sound;
  } catch {
    return null;
  }
}

export async function initAudio(): Promise<void> {
  await Audio.setAudioModeAsync({
    playsInSilentModeIOS: true,
    staysActiveInBackground: false,
  });
}

export async function playNote(midi: number, volume: number = 0.9): Promise<void> {
  const nearest = nearestSample(midi);
  if (!nearest) return; // no samples loaded yet — silent
  await playSource(nearest.source, pitchRate(nearest.midi, midi), volume);
}

export async function playInterval(rootMidi: number, semitones: number, harmonic: boolean = false): Promise<void> {
  if (harmonic) {
    await Promise.all([playNote(rootMidi, 0.8), playNote(rootMidi + semitones, 0.8)]);
  } else {
    await playNote(rootMidi, 0.9);
    setTimeout(() => playNote(rootMidi + semitones, 0.9), 600);
  }
}

export async function playChord(rootMidi: number, intervals: number[]): Promise<void> {
  await Promise.all(intervals.map((s) => playNote(rootMidi + s, 0.75)));
}

export async function stopAll(): Promise<void> {
  await Promise.all(soundPool.map((s) => s.unloadAsync().catch(() => {})));
  soundPool.length = 0;
}