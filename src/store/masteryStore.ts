/**
 * Acuity — Mastery Store
 *
 * Implements the dual mastery path system:
 *   Path A: 90%+ accuracy on 5 separate days within 60 days
 *   Path B: 80%+ accuracy on 10 separate days within 60 days
 *
 * Sessions are keyed by calendar day (YYYY-MM-DD). Multiple sessions
 * on the same day count as ONE day entry (last session wins).
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ConceptId } from '../utils/musicTheory';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DaySession {
  date: string;       // YYYY-MM-DD
  accuracy: number;   // 0–1
  questionCount: number;
  correctCount: number;
}

export interface ConceptMastery {
  conceptId: ConceptId;
  sessions: DaySession[];          // one per calendar day
  unlocked: boolean;
  unlockedAt: string | null;       // ISO timestamp
  unlockedBy: 'path_a' | 'path_b' | null;
}

export interface MasteryStore {
  concepts: Record<ConceptId, ConceptMastery>;
  lastUpdated: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY = '@acuity/mastery_v1';
const ROLLING_WINDOW_DAYS = 60;
const PATH_A_ACCURACY = 0.9;
const PATH_A_DAYS = 5;
const PATH_B_ACCURACY = 0.8;
const PATH_B_DAYS = 10;

const ALL_CONCEPTS: ConceptId[] = [
  'notes',
  'basic_intervals',
  'all_intervals',
  'chords',
  'progressions',
];

// ─── Date helpers ─────────────────────────────────────────────────────────────

export function todayString(): string {
  return new Date().toISOString().split('T')[0];
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

function isWithinWindow(dateStr: string): boolean {
  return dateStr >= daysAgo(ROLLING_WINDOW_DAYS);
}

// ─── Mastery evaluation ───────────────────────────────────────────────────────

function evaluateMastery(sessions: DaySession[]): {
  unlocked: boolean;
  path: 'path_a' | 'path_b' | null;
} {
  const recent = sessions.filter((s) => isWithinWindow(s.date));

  const pathADays = recent.filter((s) => s.accuracy >= PATH_A_ACCURACY).length;
  if (pathADays >= PATH_A_DAYS) {
    return { unlocked: true, path: 'path_a' };
  }

  const pathBDays = recent.filter((s) => s.accuracy >= PATH_B_ACCURACY).length;
  if (pathBDays >= PATH_B_DAYS) {
    return { unlocked: true, path: 'path_b' };
  }

  return { unlocked: false, path: null };
}

// ─── Path progress (for UI display) ──────────────────────────────────────────

export interface PathProgress {
  pathA: { daysQualified: number; daysNeeded: number; pct: number };
  pathB: { daysQualified: number; daysNeeded: number; pct: number };
}

export function getPathProgress(sessions: DaySession[]): PathProgress {
  const recent = sessions.filter((s) => isWithinWindow(s.date));
  const pathADays = recent.filter((s) => s.accuracy >= PATH_A_ACCURACY).length;
  const pathBDays = recent.filter((s) => s.accuracy >= PATH_B_ACCURACY).length;

  return {
    pathA: {
      daysQualified: pathADays,
      daysNeeded: PATH_A_DAYS,
      pct: Math.min(1, pathADays / PATH_A_DAYS),
    },
    pathB: {
      daysQualified: pathBDays,
      daysNeeded: PATH_B_DAYS,
      pct: Math.min(1, pathBDays / PATH_B_DAYS),
    },
  };
}

// ─── Default state ────────────────────────────────────────────────────────────

function defaultStore(): MasteryStore {
  const concepts = {} as Record<ConceptId, ConceptMastery>;
  ALL_CONCEPTS.forEach((id, idx) => {
    concepts[id] = {
      conceptId: id,
      sessions: [],
      unlocked: idx === 0, // only 'notes' unlocked at start
      unlockedAt: idx === 0 ? new Date().toISOString() : null,
      unlockedBy: null,
    };
  });
  return { concepts, lastUpdated: new Date().toISOString() };
}

// ─── Storage API ──────────────────────────────────────────────────────────────

export async function loadStore(): Promise<MasteryStore> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultStore();
    return JSON.parse(raw) as MasteryStore;
  } catch {
    return defaultStore();
  }
}

async function saveStore(store: MasteryStore): Promise<void> {
  store.lastUpdated = new Date().toISOString();
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

// ─── Record a practice session ────────────────────────────────────────────────

export async function recordSession(
  conceptId: ConceptId,
  correctCount: number,
  questionCount: number
): Promise<{ masteryChanged: boolean; unlockedPath: 'path_a' | 'path_b' | null }> {
  const store = await loadStore();
  const concept = store.concepts[conceptId];
  const today = todayString();
  const accuracy = questionCount > 0 ? correctCount / questionCount : 0;

  // Upsert today's session (last-write-wins for same-day entries)
  const existing = concept.sessions.findIndex((s) => s.date === today);
  const session: DaySession = { date: today, accuracy, questionCount, correctCount };

  if (existing >= 0) {
    concept.sessions[existing] = session;
  } else {
    concept.sessions.push(session);
  }

  // Prune sessions outside the 60-day window to keep storage lean
  concept.sessions = concept.sessions.filter((s) => isWithinWindow(s.date));

  // Re-evaluate mastery if not yet unlocked
  let masteryChanged = false;
  let unlockedPath: 'path_a' | 'path_b' | null = null;

  if (!concept.unlocked) {
    const { unlocked, path } = evaluateMastery(concept.sessions);
    if (unlocked) {
      concept.unlocked = true;
      concept.unlockedAt = new Date().toISOString();
      concept.unlockedBy = path;
      unlockedPath = path;
      masteryChanged = true;

      // Also unlock the next concept if there is one
      const UNLOCK_CHAIN: Partial<Record<ConceptId, ConceptId>> = {
        notes: 'basic_intervals',
        basic_intervals: 'all_intervals',
        all_intervals: 'chords',
        chords: 'progressions',
      };
      const next = UNLOCK_CHAIN[conceptId];
      if (next) {
        store.concepts[next].unlocked = true;
        store.concepts[next].unlockedAt = new Date().toISOString();
      }
    }
  }

  await saveStore(store);
  return { masteryChanged, unlockedPath };
}

// ─── Query helpers ────────────────────────────────────────────────────────────

export async function getConceptMastery(conceptId: ConceptId): Promise<ConceptMastery> {
  const store = await loadStore();
  return store.concepts[conceptId];
}

export async function getAllMastery(): Promise<MasteryStore> {
  return loadStore();
}

export async function isConceptUnlocked(conceptId: ConceptId): Promise<boolean> {
  const store = await loadStore();
  return store.concepts[conceptId].unlocked;
}

// Dev helper — reset all mastery (useful during development)
export async function __devResetMastery(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
