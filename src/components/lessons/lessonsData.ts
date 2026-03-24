export interface LessonStep {
  type: 'text' | 'audio_demo' | 'interactive';
  content: string;
  audioMidi?: number[];
  audioPause?: number;
}

export interface Lesson {
  id: string;
  conceptId: string;
  order: number;
  title: string;
  subtitle: string;
  steps: LessonStep[];
  estimatedMinutes: number;
}

export const NOTE_RECOGNITION_LESSONS: Lesson[] = [
  {
    id: 'nr_01', conceptId: 'notes', order: 1, title: 'What is a note?', subtitle: 'Sound has pitch. Notes have names.', estimatedMinutes: 3,
    steps: [
      { type: 'text', content: 'Music is built from individual sounds called notes. Each note has a specific pitch — how high or low it sounds.\n\nOn a piano, pressing each key produces a different pitch. The piano keyboard repeats the same 12 notes — called the chromatic scale — across multiple octaves.' },
      { type: 'text', content: 'The 12 notes are named with letters:\n\nC · D · E · F · G · A · B\n\n…and five sharps (♯) or flats (♭) in between:\n\nC♯ · D♯ · F♯ · G♯ · A♯\n\nAfter B, the pattern repeats — the next note is C again, one octave higher.' },
      { type: 'audio_demo', content: 'Listen: here are all 12 notes in order, starting from C.', audioMidi: [60,61,62,63,64,65,66,67,68,69,70,71,72], audioPause: 500 },
    ],
  },
  {
    id: 'nr_02', conceptId: 'notes', order: 2, title: 'White keys and black keys', subtitle: 'Naturals and accidentals.', estimatedMinutes: 3,
    steps: [
      { type: 'text', content: 'The piano keyboard alternates white and black keys. The white keys are the natural notes — C, D, E, F, G, A, B. The black keys are the sharps and flats in between.' },
      { type: 'text', content: 'Notice the pattern of black keys: they appear in groups of 2 and 3. This is how you find your bearings on any piano.\n\n• C is always just to the left of a group of 2 black keys.\n• F is always just to the left of a group of 3 black keys.' },
      { type: 'audio_demo', content: 'Listen: the 7 white notes (C major scale) from C4 to C5.', audioMidi: [60,62,64,65,67,69,71,72], audioPause: 400 },
    ],
  },
  {
    id: 'nr_03', conceptId: 'notes', order: 3, title: 'What is an octave?', subtitle: 'The same note, higher or lower.', estimatedMinutes: 3,
    steps: [
      { type: 'text', content: 'When a note repeats after all 12 steps, we call that jump an octave. The notes sound similar — they share the same name — but one is higher or lower in pitch.' },
      { type: 'text', content: 'Octaves are numbered to distinguish them. Middle C — the most important reference point — is called C4. The C one octave lower is C3; one octave higher is C5.' },
      { type: 'audio_demo', content: 'Listen: C3, C4, and C5 — three octaves of the same note.', audioMidi: [48,60,72], audioPause: 700 },
    ],
  },
  {
    id: 'nr_04', conceptId: 'notes', order: 4, title: 'Training your ear', subtitle: 'Relative pitch vs. absolute pitch.', estimatedMinutes: 4,
    steps: [
      { type: 'text', content: 'Absolute pitch (perfect pitch) means you can name a note just by hearing it — no reference needed. Very rare, mostly innate.\n\nRelative pitch means you can identify notes in relation to a reference note. This is a trainable skill, and it\'s what professional musicians use.' },
      { type: 'text', content: 'Ear training is about building relative pitch. Once you hear a reference note, you can work out everything else by the intervals between notes.\n\nAcuity trains you systematically — starting with single notes, then intervals, then chords.' },
      { type: 'audio_demo', content: 'Listen: a reference C4, then an unknown note. Can you tell how far it is from C?', audioMidi: [60,64], audioPause: 900 },
    ],
  },
  {
    id: 'nr_05', conceptId: 'notes', order: 5, title: 'Your first exercise', subtitle: 'Put it into practice.', estimatedMinutes: 3,
    steps: [
      { type: 'text', content: 'You\'re ready to start practicing!\n\nIn the Practice tab, you\'ll hear a note played and need to identify it. The piano keyboard is always on screen — use it to check your answer.' },
      { type: 'text', content: 'Tips for your first session:\n\n• Press Play as many times as you need before answering.\n• Use the piano keys as a reference — tap them to compare pitches.\n• Don\'t worry about being perfect. Your ear adapts with repetition.\n\nAfter 5 high-accuracy days (90%+) or 10 good days (80%+), you\'ll unlock Basic Intervals — the next concept.' },
    ],
  },
];

export function getLessonsForConcept(conceptId: string): Lesson[] {
  return NOTE_RECOGNITION_LESSONS.filter((l) => l.conceptId === conceptId).sort((a, b) => a.order - b.order);
}