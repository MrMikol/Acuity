# Acuity
### Sharpen your musical ear.

Adaptive ear training app built with React Native + Expo.

---

## Setup

```bash
cd C:\Users\micha\Documents\VSCode\APPS\Acuity
npm install
npx expo start
```

---

## Project structure

```
Acuity/
├── app/                        # Expo Router screens
│   ├── _layout.tsx             # Tab navigation shell
│   ├── index.tsx               # Learn tab
│   ├── practice.tsx            # Practice tab
│   └── progress.tsx            # Progress tab
│
├── src/
│   ├── theme/
│   │   └── index.ts            # Design tokens (colors, type, spacing)
│   │
│   ├── utils/
│   │   └── musicTheory.ts      # Notes, intervals, chords, concepts
│   │
│   ├── store/
│   │   └── masteryStore.ts     # Adaptive mastery logic + AsyncStorage
│   │
│   ├── audio/
│   │   └── audioEngine.ts      # Salamander piano sample engine
│   │
│   └── components/
│       ├── piano/
│       │   └── PianoKeyboard.tsx   # Reusable interactive keyboard
│       ├── exercises/
│       │   └── IntervalExercise.tsx # Phase 1 interval ID exercise
│       └── lessons/
│           └── lessonsData.ts      # Lesson content for Concept 1
│
└── assets/
    └── samples/
        └── salamander/         # ← Add your .mp3 sample files here
```

---

## Salamander Grand Piano samples

The audio engine expects samples in `assets/samples/salamander/` named:

```
C2.mp3   Eb2.mp3  Gb2.mp3  A2.mp3
C3.mp3   Eb3.mp3  Gb3.mp3  A3.mp3
C4.mp3   Eb4.mp3  Gb4.mp3  A4.mp3   ← most important (center octave)
C5.mp3   Eb5.mp3  Gb5.mp3  A5.mp3
C6.mp3
```

**Download:** https://freepats.zenvoid.org/Piano/acoustic-grand-piano.html  
License: Creative Commons Attribution (CC-BY) — Alexander Holm

The engine picks the nearest available sample and adjusts playback rate to
pitch-shift up or down. A smaller set works fine — more samples = better quality.

---

## Mastery system

Two unlock paths per concept. Either path unlocks the next concept.

| Path | Accuracy | Days needed | Window |
|------|----------|-------------|--------|
| A — Fast track | ≥ 90% | 5 days | 60 days |
| B — Consistent | ≥ 80% | 10 days | 60 days |

Rules:
- Multiple sessions on the same calendar day count as **one** day (last session wins)
- The 60-day window is rolling — old sessions expire
- Progress is stored in AsyncStorage under `@acuity/mastery_v1`

---

## Bundle ID

`com.michaelt.acuity`

---

## Phase 1 scope (this release)

- [x] Navigation shell (Learn / Practice / Progress)
- [x] Design tokens + Acuity color palette
- [x] AsyncStorage mastery store with dual-path logic
- [x] Salamander piano audio engine
- [x] Reusable `PianoKeyboard` component
- [x] 5 Learn lessons — Note Recognition
- [x] `IntervalExercise` component (Phase 1 core exercise)
- [x] Progress screen with path bars

## Phase 2 backlog

- [ ] Note recognition exercise (single notes)
- [ ] All intervals exercise (all 13)
- [ ] Chord recognition exercise
- [ ] Chord progression exercise
- [ ] Calendar heatmap on Progress screen
- [ ] Lesson screen (step-through reader with audio demos)
- [ ] Unlock celebration animation
- [ ] Haptic feedback on correct/wrong
- [ ] Dark mode
