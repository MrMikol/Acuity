/**
 * intervalLessons.ts
 *
 * Content data for Basic Intervals and All Intervals lessons.
 * Follows the same Lesson/LessonPage structure as noteLessons.ts.
 *
 * Teaching order follows Berklee ET1/ET2 curriculum:
 * Basic: 2nds → 3rds → 4ths/5ths → octave
 * All:   6ths → 7ths → tritone → full picture
 */

import type { Lesson } from './noteLessons';

// ─── Basic Intervals ──────────────────────────────────────────────────────────

export const BASIC_INTERVAL_LESSONS: Lesson[] = [
  {
    id: 'what-is-an-interval',
    title: 'What is an interval?',
    duration: '3 min',
    pages: [
      {
        type: 'intro',
        eyebrow: 'Lesson 1',
        heading: 'What is an interval?',
        body: 'An interval is the distance in pitch between two notes. Every melody you have ever heard is made of intervals — the steps and leaps between notes give music its shape, tension, and emotion.',
        visual: 'interval_intro',
      },
      {
        type: 'concept',
        eyebrow: 'How we measure',
        heading: 'Counting in half steps',
        body: 'The smallest interval in Western music is the half step — the distance between two adjacent keys on a piano (including black keys). Every other interval is counted in multiples of half steps. A whole step is two half steps.',
        visual: 'half_steps',
      },
      {
        type: 'concept',
        eyebrow: 'Naming',
        heading: 'Quality and size',
        body: 'Every interval has two properties: a size (second, third, fourth…) based on how many letter names it spans, and a quality (major, minor, perfect) based on the exact number of half steps. Together they give us names like "Major Third" or "Perfect Fifth."',
        visual: 'interval_intro',
      },
      {
        type: 'tip',
        eyebrow: 'The method',
        heading: 'Use a song as a crutch',
        body: 'Every interval has a characteristic sound. The fastest way to learn them is to associate each one with a familiar song. When in doubt, hum the tune — your brain will find the interval. Acuity will teach you the song for each one.',
      },
    ],
  },
  {
    id: 'seconds-the-smallest-steps',
    title: 'Seconds — the smallest steps',
    duration: '3 min',
    pages: [
      {
        type: 'intro',
        eyebrow: 'Lesson 2',
        heading: 'Seconds — the smallest steps',
        body: 'Seconds are the intervals that move step by step — the building blocks of melody. They come in two flavours: the minor second (1 half step) and the major second (2 half steps, a whole step).',
        visual: 'seconds',
      },
      {
        type: 'concept',
        eyebrow: 'Minor Second',
        heading: 'The half step — tense and close',
        body: 'The minor second is 1 half step — the distance from E to F, or B to C on a piano. It sounds tense and dissonant. Think of the two-note theme from Jaws: da-dum. That creeping half step is a minor second.',
        visual: 'seconds',
      },
      {
        type: 'concept',
        eyebrow: 'Major Second',
        heading: 'The whole step — the scale sound',
        body: 'The major second is 2 half steps — a whole step. It is the sound of adjacent notes in a major scale: C to D, D to E, F to G. Think of the first two notes of "Happy Birthday" (Hap-py) — that rising whole step is a major second.',
        visual: 'seconds',
      },
      {
        type: 'tip',
        eyebrow: 'Tell them apart',
        heading: 'Close but very different',
        body: 'Minor seconds sound tense and urgent — like something is about to happen. Major seconds sound natural and flowing — like a scale stepping forward. Train your ear to feel that difference in character, not just count the half steps.',
      },
    ],
  },
  {
    id: 'thirds-the-sound-of-emotion',
    title: 'Thirds — the sound of emotion',
    duration: '3 min',
    pages: [
      {
        type: 'intro',
        eyebrow: 'Lesson 3',
        heading: 'Thirds — the sound of emotion',
        body: 'Thirds are the most emotionally expressive intervals in Western music. They define whether music sounds major (happy, bright) or minor (sad, dark). Every chord you have ever heard is built on thirds.',
        visual: 'thirds',
      },
      {
        type: 'concept',
        eyebrow: 'Major Third',
        heading: 'Bright and happy — 4 half steps',
        body: 'The major third spans 4 half steps — C to E, G to B, F to A. It sounds open, bright, and confident. Think of the first two notes of "When the Saints Go Marching In" (Oh when) — that upward leap is a major third.',
        visual: 'thirds',
      },
      {
        type: 'concept',
        eyebrow: 'Minor Third',
        heading: 'Dark and tender — 3 half steps',
        body: 'The minor third spans 3 half steps — C to E♭, A to C, D to F. It sounds darker and more introspective than a major third. Think of the first two notes of "Smoke on the Water" by Deep Purple — that opening riff starts with a minor third.',
        visual: 'thirds',
      },
      {
        type: 'tip',
        eyebrow: 'Why thirds matter',
        heading: 'The root of all chords',
        body: 'Stack a major third on top of a minor third and you get a major chord. Reverse the order — minor third on bottom, major third on top — and you get a minor chord. Thirds are the DNA of harmony.',
      },
    ],
  },
  {
    id: 'fourths-and-fifths',
    title: 'Fourths and Fifths',
    duration: '4 min',
    pages: [
      {
        type: 'intro',
        eyebrow: 'Lesson 4',
        heading: 'Fourths and Fifths — power and stability',
        body: 'Perfect fourths and fifths are the most stable, open-sounding intervals in music. They are called "perfect" because they sound the same in both major and minor contexts — they carry no emotional bias.',
        visual: 'fourths_fifths',
      },
      {
        type: 'concept',
        eyebrow: 'Perfect Fourth',
        heading: 'Strong and open — 5 half steps',
        body: 'The perfect fourth spans 5 half steps — C to F, G to C, D to G. It sounds clear and strong. Think of the opening of "Amazing Grace" (A-ma-) or the bugle call. That upward leap of a fourth is immediately recognisable.',
        visual: 'fourths_fifths',
      },
      {
        type: 'concept',
        eyebrow: 'Perfect Fifth',
        heading: 'Noble and resonant — 7 half steps',
        body: 'The perfect fifth spans 7 half steps — C to G, G to D, D to A. It is the most consonant interval after the octave. Think of the opening two notes of the Star Wars theme (Bbbb-BUM) — that powerful leap is a perfect fifth.',
        visual: 'fourths_fifths',
      },
      {
        type: 'tip',
        eyebrow: 'Tell them apart',
        heading: 'Fourth vs Fifth — feel the space',
        body: 'Fourths feel "resolved" and grounded. Fifths feel broader and more powerful — like they could carry an entire orchestra. Practice hearing them back to back: the fifth always sounds like it has more air between the notes.',
      },
    ],
  },
  {
    id: 'your-first-interval-exercise',
    title: 'Your first interval exercise',
    duration: '3 min',
    pages: [
      {
        type: 'intro',
        eyebrow: 'Lesson 5',
        heading: 'Your first interval exercise',
        body: 'You have learned the six core intervals: minor 2nd, major 2nd, minor 3rd, major 3rd, perfect 4th, and perfect 5th. Now it is time to train your ear to recognise them by sound alone.',
        visual: 'interval_exercise',
      },
      {
        type: 'concept',
        eyebrow: 'How it works',
        heading: 'Hear it. Name it.',
        body: 'Each round plays two notes — one after the other. Your job is to identify the interval between them. The exercise starts with the most distinct intervals and gradually introduces harder comparisons.',
        visual: 'interval_exercise',
      },
      {
        type: 'tip',
        eyebrow: 'Strategy',
        heading: 'Hum the reference song',
        body: 'When you hear an interval, immediately try to hum the associated song in your head. Minor 2nd? Think Jaws. Major 3rd? Think When the Saints. Perfect 5th? Think Star Wars. These anchors will become automatic over time.',
      },
      {
        type: 'cta',
        eyebrow: 'Ready',
        heading: 'Train your ear.',
        body: 'Head to the Practice tab to begin your first Basic Intervals session. Ten questions, one interval at a time.',
        ctaLabel: 'Start Interval Practice →',
        ctaRoute: '/(tabs)/practice',
      },
    ],
  },
];

// ─── All Intervals ────────────────────────────────────────────────────────────

export const ALL_INTERVAL_LESSONS: Lesson[] = [
  {
    id: 'beyond-the-fifth',
    title: 'Beyond the fifth',
    duration: '3 min',
    pages: [
      {
        type: 'intro',
        eyebrow: 'Lesson 1',
        heading: 'Beyond the fifth',
        body: 'You can already hear seconds, thirds, fourths, and fifths. Now we add the wider intervals — sixths, sevenths, and the tritone — to complete your full picture of the interval system.',
        visual: 'interval_map',
      },
      {
        type: 'concept',
        eyebrow: 'The full octave',
        heading: '12 intervals, one octave',
        body: 'Within a single octave there are 12 distinct intervals — one for each half step from unison to octave. You know six of them. The remaining six are wider, less common in melody, but essential for recognising chords and complex harmonies.',
        visual: 'interval_map',
      },
      {
        type: 'concept',
        eyebrow: 'A useful trick',
        heading: 'Use inversions',
        body: 'Wide intervals can be hard to hear directly. A powerful shortcut: a major 6th is the inversion of a minor 3rd. A minor 7th is the inversion of a major 2nd. If you can\'t identify a wide interval, try hearing it "from the top" as a smaller interval going down.',
        visual: 'interval_map',
      },
      {
        type: 'tip',
        eyebrow: 'Patience',
        heading: 'Wide intervals take more time',
        body: 'Sixths and sevenths are harder to hear than thirds and fifths because the pitch distance is large enough that the ear has more options to consider. This is normal — even experienced musicians find wide intervals challenging. Keep practicing.',
      },
    ],
  },
  {
    id: 'sixths-wide-and-warm',
    title: 'Sixths — wide and warm',
    duration: '3 min',
    pages: [
      {
        type: 'intro',
        eyebrow: 'Lesson 2',
        heading: 'Sixths — wide and warm',
        body: 'Sixths are wide, romantic-sounding intervals that appear frequently in lyrical melodies. They have a characteristic warmth that distinguishes them from the more neutral sound of fourths and fifths.',
        visual: 'sixths',
      },
      {
        type: 'concept',
        eyebrow: 'Major Sixth',
        heading: 'Warm and nostalgic — 9 half steps',
        body: 'The major sixth spans 9 half steps — C to A, G to E. It has a wide, open, nostalgic quality. Think of the opening of "My Bonnie Lies Over the Ocean" (My Bon-) — that soaring leap up is a major sixth.',
        visual: 'sixths',
      },
      {
        type: 'concept',
        eyebrow: 'Minor Sixth',
        heading: 'Bittersweet and expressive — 8 half steps',
        body: 'The minor sixth spans 8 half steps — C to A♭, E to C. It sounds more tense and emotional than the major sixth. Think of the opening of the theme from "The Entertainer" by Scott Joplin — the ascending leap at the start is a minor sixth.',
        visual: 'sixths',
      },
      {
        type: 'tip',
        eyebrow: 'Inversion shortcut',
        heading: 'Flip it to a third',
        body: 'A major sixth sounds like a minor third played upside down. A minor sixth sounds like a major third upside down. When in doubt, hear the upper note going down to the lower note — you may recognize the third more easily than the sixth.',
      },
    ],
  },
  {
    id: 'sevenths-tension-and-pull',
    title: 'Sevenths — tension and pull',
    duration: '3 min',
    pages: [
      {
        type: 'intro',
        eyebrow: 'Lesson 3',
        heading: 'Sevenths — tension and pull',
        body: 'Sevenths are the most harmonically active intervals — they create strong tension that wants to resolve. They are the defining sound of dominant chords, jazz harmony, and blues music.',
        visual: 'sevenths',
      },
      {
        type: 'concept',
        eyebrow: 'Minor Seventh',
        heading: 'Bluesy tension — 10 half steps',
        body: 'The minor seventh spans 10 half steps — C to B♭, G to F. It sounds deeply tense and is the defining interval of dominant 7th chords. Think of the first two notes of "Somewhere" from West Side Story — that rising leap is a minor seventh.',
        visual: 'sevenths',
      },
      {
        type: 'concept',
        eyebrow: 'Major Seventh',
        heading: 'Lush and suspended — 11 half steps',
        body: 'The major seventh spans 11 half steps — just one half step below the octave. It sounds dreamy and unresolved, like it is straining to reach the octave. Think of the first two notes of "Take On Me" by A-ha — that opening leap is a major seventh.',
        visual: 'sevenths',
      },
      {
        type: 'tip',
        eyebrow: 'Inversion shortcut',
        heading: 'Flip it to a second',
        body: 'A minor seventh is the inversion of a major second. A major seventh is the inversion of a minor second. If you hear a very wide interval that sounds tense, ask yourself: if I flipped this, would it sound like a half step or a whole step?',
      },
    ],
  },
  {
    id: 'the-tritone',
    title: 'The Tritone',
    duration: '3 min',
    pages: [
      {
        type: 'intro',
        eyebrow: 'Lesson 4',
        heading: 'The Tritone — the odd one out',
        body: 'The tritone sits exactly halfway between the unison and the octave — 6 half steps. It is the only interval that is its own inversion, and it has the most distinctive, tense sound of any interval in Western music.',
        visual: 'tritone',
      },
      {
        type: 'concept',
        eyebrow: 'Augmented 4th / Diminished 5th',
        heading: 'Two names, one sound',
        body: 'The tritone goes by two names depending on context: augmented 4th (F to B going up) or diminished 5th (B to F going down). Both span exactly 6 half steps and sound identical. Historically it was called "diabolus in musica" — the devil in music — for its dissonant, unstable quality.',
        visual: 'tritone',
      },
      {
        type: 'concept',
        eyebrow: 'In practice',
        heading: 'You already know this sound',
        body: 'The tritone is the opening interval of "The Simpsons Theme" (the first two notes of the main melody). It is also heard in "Maria" from West Side Story — the jump from "Ma-" to "-ri-" is a tritone. Once you hear it, you will never mistake it.',
        visual: 'tritone',
      },
      {
        type: 'tip',
        eyebrow: 'Ear training tip',
        heading: 'It sounds unfinished',
        body: 'The tritone creates maximum harmonic tension — it wants to resolve more urgently than any other interval. If an interval sounds deeply unstable and almost uncomfortable, it is probably a tritone. That dissonance is its defining character.',
      },
    ],
  },
  {
    id: 'all-intervals-exercise',
    title: 'Full interval practice',
    duration: '4 min',
    pages: [
      {
        type: 'intro',
        eyebrow: 'Lesson 5',
        heading: 'Full interval practice',
        body: 'You now know all 12 intervals within the octave. This is a significant milestone — most casual musicians never develop this level of pitch awareness. Now it is time to put all of them together.',
        visual: 'interval_exercise',
      },
      {
        type: 'concept',
        eyebrow: 'The full set',
        heading: 'All 12 at once',
        body: 'The advanced interval exercise introduces all 12 intervals in a single session. The questions become harder as similar-sounding intervals (like major 6th vs minor 7th) are placed alongside each other. This is where real ear training begins.',
        visual: 'interval_map',
      },
      {
        type: 'tip',
        eyebrow: 'Strategy',
        heading: 'Group by character',
        body: 'When overwhelmed, sort intervals by character first: does it sound small and stepwise (2nds)? Emotionally charged (3rds and 6ths)? Powerful and open (4ths and 5ths)? Tense and unresolved (7ths and tritone)? Narrow it down before picking a name.',
      },
      {
        type: 'cta',
        eyebrow: 'Ready',
        heading: 'The full test.',
        body: 'Head to the Practice tab to begin your All Intervals session. All 12 intervals, ten questions at a time.',
        ctaLabel: 'Start Full Interval Practice →',
        ctaRoute: '/(tabs)/practice',
      },
    ],
  },
];