// Music theory data for Acuity
// All notes, intervals, chords used across Learn and Practice screens

// ─── Notes ───────────────────────────────────────────────────────────────────

export const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;
export type NoteName = (typeof NOTES)[number];

export const NOTE_DISPLAY: Record<NoteName, string> = {
  C: 'C',
  'C#': 'C♯ / D♭',
  D: 'D',
  'D#': 'D♯ / E♭',
  E: 'E',
  F: 'F',
  'F#': 'F♯ / G♭',
  G: 'G',
  'G#': 'G♯ / A♭',
  A: 'A',
  'A#': 'A♯ / B♭',
  B: 'B',
};

// Chromatic index → is it a black key?
export const IS_BLACK_KEY: Record<number, boolean> = {
  0: false, // C
  1: true,  // C#
  2: false, // D
  3: true,  // D#
  4: false, // E
  5: false, // F
  6: true,  // F#
  7: false, // G
  8: true,  // G#
  9: false, // A
  10: true, // A#
  11: false, // B
};

// MIDI note numbers (octave 4 center octave)
export const MIDI_C4 = 60;
export function midiFromNote(note: NoteName, octave: number): number {
  return MIDI_C4 + (octave - 4) * 12 + NOTES.indexOf(note);
}

// ─── Intervals ────────────────────────────────────────────────────────────────

export type IntervalName =
  | 'Unison'
  | 'Minor 2nd'
  | 'Major 2nd'
  | 'Minor 3rd'
  | 'Major 3rd'
  | 'Perfect 4th'
  | 'Tritone'
  | 'Perfect 5th'
  | 'Minor 6th'
  | 'Major 6th'
  | 'Minor 7th'
  | 'Major 7th'
  | 'Octave';

export interface Interval {
  name: IntervalName;
  semitones: number;
  abbreviation: string;
  isBasic: boolean; // included in "Basic intervals" concept
  mnemonic?: string; // famous song reference for memory
}

export const INTERVALS: Interval[] = [
  { name: 'Unison',     semitones: 0,  abbreviation: 'P1', isBasic: true },
  { name: 'Minor 2nd',  semitones: 1,  abbreviation: 'm2', isBasic: false, mnemonic: 'Jaws theme' },
  { name: 'Major 2nd',  semitones: 2,  abbreviation: 'M2', isBasic: true,  mnemonic: 'Happy Birthday' },
  { name: 'Minor 3rd',  semitones: 3,  abbreviation: 'm3', isBasic: true,  mnemonic: 'Smoke on the Water' },
  { name: 'Major 3rd',  semitones: 4,  abbreviation: 'M3', isBasic: true,  mnemonic: 'When the Saints Go Marching' },
  { name: 'Perfect 4th',semitones: 5,  abbreviation: 'P4', isBasic: true,  mnemonic: 'Here Comes the Bride' },
  { name: 'Tritone',    semitones: 6,  abbreviation: 'TT', isBasic: false, mnemonic: 'The Simpsons theme' },
  { name: 'Perfect 5th',semitones: 7,  abbreviation: 'P5', isBasic: true,  mnemonic: 'Star Wars theme' },
  { name: 'Minor 6th',  semitones: 8,  abbreviation: 'm6', isBasic: false, mnemonic: 'The Entertainer' },
  { name: 'Major 6th',  semitones: 9,  abbreviation: 'M6', isBasic: false, mnemonic: 'My Way' },
  { name: 'Minor 7th',  semitones: 10, abbreviation: 'm7', isBasic: false, mnemonic: 'Somewhere (from West Side Story)' },
  { name: 'Major 7th',  semitones: 11, abbreviation: 'M7', isBasic: false, mnemonic: 'Take On Me' },
  { name: 'Octave',     semitones: 12, abbreviation: 'P8', isBasic: true,  mnemonic: 'Somewhere Over the Rainbow' },
];

export const BASIC_INTERVALS = INTERVALS.filter((i) => i.isBasic);

// ─── Chords ───────────────────────────────────────────────────────────────────

export type ChordQuality = 'major' | 'minor' | 'diminished' | 'augmented' | 'dominant7' | 'major7' | 'minor7';

export interface ChordType {
  quality: ChordQuality;
  name: string;
  intervals: number[]; // semitones from root
  symbol: string;
}

export const CHORD_TYPES: ChordType[] = [
  { quality: 'major',      name: 'Major',        intervals: [0, 4, 7],     symbol: '' },
  { quality: 'minor',      name: 'Minor',        intervals: [0, 3, 7],     symbol: 'm' },
  { quality: 'diminished', name: 'Diminished',   intervals: [0, 3, 6],     symbol: '°' },
  { quality: 'augmented',  name: 'Augmented',    intervals: [0, 4, 8],     symbol: '+' },
  { quality: 'dominant7',  name: 'Dominant 7th', intervals: [0, 4, 7, 10], symbol: '7' },
  { quality: 'major7',     name: 'Major 7th',    intervals: [0, 4, 7, 11], symbol: 'maj7' },
  { quality: 'minor7',     name: 'Minor 7th',    intervals: [0, 3, 7, 10], symbol: 'm7' },
];

// ─── Concepts (the 5 unlockable skill areas) ──────────────────────────────────

export type ConceptId = 'notes' | 'basic_intervals' | 'all_intervals' | 'chords' | 'progressions';

export interface Concept {
  id: ConceptId;
  title: string;
  description: string;
  order: number;
  unlockedBy: ConceptId | null; // null = always available
  lessonCount: number;
}

export const CONCEPTS: Concept[] = [
  {
    id: 'notes',
    title: 'Note recognition',
    description: 'Identify single notes on the piano by ear.',
    order: 1,
    unlockedBy: null,
    lessonCount: 5,
  },
  {
    id: 'basic_intervals',
    title: 'Basic intervals',
    description: 'Identify the most common musical intervals.',
    order: 2,
    unlockedBy: 'notes',
    lessonCount: 5,
  },
  {
    id: 'all_intervals',
    title: 'All intervals',
    description: 'Master all 13 intervals within an octave.',
    order: 3,
    unlockedBy: 'basic_intervals',
    lessonCount: 6,
  },
  {
    id: 'chords',
    title: 'Chord recognition',
    description: 'Identify major, minor, and extended chords.',
    order: 4,
    unlockedBy: 'all_intervals',
    lessonCount: 6,
  },
  {
    id: 'progressions',
    title: 'Chord progressions',
    description: 'Recognise common chord progressions in context.',
    order: 5,
    unlockedBy: 'chords',
    lessonCount: 5,
  },
];
