/**
 * noteLessons.ts
 *
 * Content data for the Note Recognition concept lessons.
 * Each lesson has multiple pages — the viewer steps through them.
 */

export interface LessonPage {
  type: 'intro' | 'concept' | 'visual' | 'tip' | 'cta';
  eyebrow?: string;
  heading: string;
  body: string;
  visual?: 'keyboard' | 'waveform' | 'octave' | 'ear' | 'exercise'
        | 'interval_intro' | 'half_steps' | 'seconds' | 'thirds'
        | 'fourths_fifths' | 'interval_exercise' | 'interval_map'
        | 'sixths' | 'sevenths' | 'tritone';
  ctaLabel?: string;
  ctaRoute?: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  pages: LessonPage[];
}

export const NOTE_LESSONS: Lesson[] = [
  {
    id: 'what-is-a-note',
    title: 'What is a note?',
    duration: '3 min',
    pages: [
      {
        type: 'intro',
        eyebrow: 'Lesson 1',
        heading: 'What is a note?',
        body: 'A musical note is a single, sustained pitch — a sound with a specific frequency that the human ear can identify and remember. Every melody, chord, and harmony is built from individual notes.',
        visual: 'waveform',
      },
      {
        type: 'concept',
        eyebrow: 'Pitch',
        heading: 'High and low',
        body: 'Pitch is how high or low a note sounds. It\'s determined by frequency — how fast the sound wave vibrates per second. A higher frequency means a higher pitch. A lower frequency means a lower pitch.',
        visual: 'waveform',
      },
      {
        type: 'concept',
        eyebrow: 'Names',
        heading: 'Seven letters, infinite music',
        body: 'In Western music, there are only 7 note names: A, B, C, D, E, F, and G. Every piece of music ever written uses only these seven letters — repeated across different octaves.',
        visual: 'keyboard',
      },
      {
        type: 'tip',
        eyebrow: 'Remember',
        heading: 'The musical alphabet',
        body: 'Unlike the regular alphabet, the musical alphabet loops: after G, it starts again at A. Think of it as a cycle, not a line.',
      },
    ],
  },
  {
    id: 'white-and-black-keys',
    title: 'White and black keys',
    duration: '3 min',
    pages: [
      {
        type: 'intro',
        eyebrow: 'Lesson 2',
        heading: 'White and black keys',
        body: 'A piano keyboard is one of the clearest visual maps of musical pitch. Understanding its layout will help you recognise notes faster and build stronger mental connections between sound and name.',
        visual: 'keyboard',
      },
      {
        type: 'concept',
        eyebrow: 'White keys',
        heading: 'The natural notes',
        body: 'The 7 white keys in each repeating group represent the 7 natural notes: C, D, E, F, G, A, B. These are the foundation of Western music — called "natural" because they carry no sharps or flats.',
        visual: 'keyboard',
      },
      {
        type: 'concept',
        eyebrow: 'Black keys',
        heading: 'The sharps and flats',
        body: 'The 5 black keys represent sharps and flats — notes that sit between the naturals. A sharp (♯) raises a note by a half step. A flat (♭) lowers it. For now, focus on the white keys.',
        visual: 'keyboard',
      },
      {
        type: 'tip',
        eyebrow: 'Landmark',
        heading: 'Find C first',
        body: 'Middle C is your anchor — it sits just to the left of any group of two black keys. Once you can spot C instantly, all other notes fall into place around it.',
      },
    ],
  },
  {
    id: 'what-is-an-octave',
    title: 'What is an octave?',
    duration: '3 min',
    pages: [
      {
        type: 'intro',
        eyebrow: 'Lesson 3',
        heading: 'What is an octave?',
        body: 'An octave is the distance between two notes that share the same name but sit 12 half-steps apart. They sound so similar that the human ear perceives them as the "same" note — just higher or lower.',
        visual: 'octave',
      },
      {
        type: 'concept',
        eyebrow: 'Why it matters',
        heading: 'Same name, different height',
        body: 'A C played low on a piano and a C played high are both called C. They\'re related by a 2:1 frequency ratio — the higher C vibrates exactly twice as fast. This relationship is universal across all musical cultures.',
        visual: 'octave',
      },
      {
        type: 'concept',
        eyebrow: 'Notation',
        heading: 'C4 — Middle C',
        body: 'To distinguish between octaves, we add a number. C4 is Middle C — the C closest to the middle of a standard piano. C5 is one octave higher. C3 is one octave lower. In Acuity, we start with C4 to B4.',
        visual: 'octave',
      },
      {
        type: 'tip',
        eyebrow: 'Listen',
        heading: 'Octaves sound like the same note',
        body: 'If you hum a note and someone else hums what feels like "the same note" but higher or lower, you\'re likely an octave apart. That sense of sameness is your ear recognising the frequency ratio.',
      },
    ],
  },
  {
    id: 'training-your-ear',
    title: 'Training your ear',
    duration: '3 min',
    pages: [
      {
        type: 'intro',
        eyebrow: 'Lesson 4',
        heading: 'Training your ear',
        body: 'Ear training is the practice of building a direct connection between a sound and its musical identity. It\'s a skill, not a gift — and like any skill, it responds to consistent, focused practice.',
        visual: 'ear',
      },
      {
        type: 'concept',
        eyebrow: 'How it works',
        heading: 'Repetition builds recognition',
        body: 'The first time you hear a note, it means nothing. After hundreds of exposures — hearing it, naming it, checking yourself — your brain builds a pattern. Eventually the name surfaces automatically, before you even think.',
        visual: 'ear',
      },
      {
        type: 'concept',
        eyebrow: 'Reference points',
        heading: 'Anchor to what you know',
        body: 'Most musicians start with a reference note — a pitch they know deeply — and reason outward from there. In Acuity, C4 (Middle C) is your anchor. Every session begins by hearing it, so your ear has a starting point.',
        visual: 'ear',
      },
      {
        type: 'tip',
        eyebrow: 'The method',
        heading: 'Short sessions beat long ones',
        body: 'Research on auditory learning consistently shows that 10–15 minutes daily outperforms hour-long weekly sessions. Acuity is built around this — every session is short, every day counts.',
      },
    ],
  },
  {
    id: 'your-first-exercise',
    title: 'Your first exercise',
    duration: '3 min',
    pages: [
      {
        type: 'intro',
        eyebrow: 'Lesson 5',
        heading: 'Your first exercise',
        body: 'You\'ve learned what notes are, how they\'re named, and how the ear learns. Now it\'s time to put it into practice. Your first exercise focuses entirely on the 7 natural notes in the C4 octave.',
        visual: 'exercise',
      },
      {
        type: 'concept',
        eyebrow: 'How it works',
        heading: 'Hear it. Name it.',
        body: 'Each round plays a single note. Your job is to identify it by name — A through G. You\'ll always start with a reference C4 so your ear has an anchor. Then the mystery notes begin.',
        visual: 'exercise',
      },
      {
        type: 'concept',
        eyebrow: 'Feedback',
        heading: 'Right or wrong, you learn',
        body: 'After each answer, you\'ll see whether you were correct and hear the note again if needed. Wrong answers are just as valuable as correct ones — they show your brain exactly where to focus.',
        visual: 'exercise',
      },
      {
        type: 'cta',
        eyebrow: 'Ready',
        heading: 'Let\'s train your ear.',
        body: 'Head to the Practice tab to begin your first Note Recognition session. Ten questions, one note at a time.',
        ctaLabel: 'Start Note Recognition →',
        ctaRoute: '/(tabs)/practice',
      },
    ],
  },
];