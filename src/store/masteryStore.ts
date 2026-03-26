import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ConceptId } from '../utils/musicTheory';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DaySession {
  date: string; // YYYY-MM-DD
  accuracy: number; // 0–1
  questionCount: number;
  correctCount: number;
}

export interface ConceptMastery {
  conceptId: ConceptId;
  sessions: DaySession[];
  unlocked: boolean;
  unlockedAt: string | null;
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

const UNLOCK_CHAIN: Partial<Record<ConceptId, ConceptId>> = {
  notes: 'basic_intervals',
  basic_intervals: 'all_intervals',
  all_intervals: 'chords',
  chords: 'progressions',
};

// ─── Date helpers ─────────────────────────────────────────────────────────────

export function todayString(): string {
  return new Date().toISOString().split('T')[0];
}

function parseDateOnly(dateStr: string): Date {
  return new Date(`${dateStr}T00:00:00`);
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

function isWithinWindow(dateStr: string): boolean {
  const sessionDate = parseDateOnly(dateStr);
  const cutoffDate = parseDateOnly(daysAgo(ROLLING_WINDOW_DAYS));
  return sessionDate >= cutoffDate;
}

function dateDiffInDays(a: string, b: string): number {
  const aDate = parseDateOnly(a);
  const bDate = parseDateOnly(b);
  const diffMs = Math.abs(bDate.getTime() - aDate.getTime());
  return Math.round(diffMs / 86400000);
}

// ─── Qualification helpers ────────────────────────────────────────────────────

function getQualifiedRecentSessions(
  sessions: DaySession[],
  accuracyThreshold: number
): DaySession[] {
  return sessions
    .filter((s) => isWithinWindow(s.date) && s.accuracy >= accuracyThreshold)
    .sort((a, b) => a.date.localeCompare(b.date));
}

function getNonConsecutiveQualifiedCount(
  sessions: DaySession[],
  accuracyThreshold: number
): number {
  const recent = getQualifiedRecentSessions(sessions, accuracyThreshold);

  let count = 0;
  let lastAcceptedDate: string | null = null;

  for (const session of recent) {
    if (!lastAcceptedDate) {
      count++;
      lastAcceptedDate = session.date;
      continue;
    }

    const diff = dateDiffInDays(lastAcceptedDate, session.date);

    if (diff > 1) {
      count++;
      lastAcceptedDate = session.date;
    }
  }

  return count;
}

// ─── Mastery evaluation ───────────────────────────────────────────────────────

function evaluateMastery(sessions: DaySession[]): {
  unlocked: boolean;
  path: 'path_a' | 'path_b' | null;
} {
  const pathADays = getNonConsecutiveQualifiedCount(sessions, PATH_A_ACCURACY);
  if (pathADays >= PATH_A_DAYS) {
    return { unlocked: true, path: 'path_a' };
  }

  const pathBDays = getNonConsecutiveQualifiedCount(sessions, PATH_B_ACCURACY);
  if (pathBDays >= PATH_B_DAYS) {
    return { unlocked: true, path: 'path_b' };
  }

  return { unlocked: false, path: null };
}

// ─── Path progress ────────────────────────────────────────────────────────────

export interface PathProgress {
  pathA: { daysQualified: number; daysNeeded: number; pct: number };
  pathB: { daysQualified: number; daysNeeded: number; pct: number };
}

export function getPathProgress(sessions: DaySession[]): PathProgress {
  const pathADays = getNonConsecutiveQualifiedCount(sessions, PATH_A_ACCURACY);
  const pathBDays = getNonConsecutiveQualifiedCount(sessions, PATH_B_ACCURACY);

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

  ALL_CONCEPTS.forEach((id) => {
    const isInitiallyUnlocked = id === 'notes' || id === 'basic_intervals';

    concepts[id] = {
      conceptId: id,
      sessions: [],
      unlocked: isInitiallyUnlocked,
      unlockedAt: isInitiallyUnlocked ? new Date().toISOString() : null,
      unlockedBy: null,
    };
  });

  return {
    concepts,
    lastUpdated: new Date().toISOString(),
  };
}

function normalizeStore(rawStore: MasteryStore | null | undefined): MasteryStore {
  const base = defaultStore();

  if (!rawStore || !rawStore.concepts) {
    return base;
  }

  for (const id of ALL_CONCEPTS) {
    const incoming = rawStore.concepts[id];

    if (incoming) {
      base.concepts[id] = {
        conceptId: id,
        sessions: Array.isArray(incoming.sessions)
          ? incoming.sessions
              .filter(
                (s) =>
                  typeof s?.date === 'string' &&
                  typeof s?.accuracy === 'number' &&
                  typeof s?.questionCount === 'number' &&
                  typeof s?.correctCount === 'number'
              )
              .sort((a, b) => a.date.localeCompare(b.date))
          : [],
        unlocked: Boolean(incoming.unlocked),
        unlockedAt: incoming.unlockedAt ?? null,
        unlockedBy: incoming.unlockedBy ?? null,
      };
    }
  }

  base.lastUpdated = rawStore.lastUpdated ?? new Date().toISOString();
  return base;
}

// ─── Storage API ──────────────────────────────────────────────────────────────

export async function loadStore(): Promise<MasteryStore> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultStore();

    const parsed = JSON.parse(raw) as MasteryStore;
    return normalizeStore(parsed);
  } catch {
    return defaultStore();
  }
}

async function saveStore(store: MasteryStore): Promise<void> {
  store.lastUpdated = new Date().toISOString();
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

// ─── Record session ───────────────────────────────────────────────────────────

export async function recordSession(
  conceptId: ConceptId,
  correctCount: number,
  questionCount: number
): Promise<{ masteryChanged: boolean; unlockedPath: 'path_a' | 'path_b' | null }> {
  const store = await loadStore();
  const concept = store.concepts[conceptId];
  const today = todayString();

  const safeCorrect = Math.max(0, correctCount);
  const safeQuestions = Math.max(0, questionCount);

  const existingIndex = concept.sessions.findIndex((s) => s.date === today);

  if (existingIndex >= 0) {
    const existing = concept.sessions[existingIndex];
    const mergedCorrect = existing.correctCount + safeCorrect;
    const mergedQuestions = existing.questionCount + safeQuestions;

    concept.sessions[existingIndex] = {
      date: today,
      correctCount: mergedCorrect,
      questionCount: mergedQuestions,
      accuracy: mergedQuestions > 0 ? mergedCorrect / mergedQuestions : 0,
    };
  } else {
    concept.sessions.push({
      date: today,
      correctCount: safeCorrect,
      questionCount: safeQuestions,
      accuracy: safeQuestions > 0 ? safeCorrect / safeQuestions : 0,
    });
  }

  concept.sessions = concept.sessions
    .filter((s) => isWithinWindow(s.date))
    .sort((a, b) => a.date.localeCompare(b.date));

  const wasUnlocked = concept.unlocked;
  const { unlocked, path } = evaluateMastery(concept.sessions);

  let masteryChanged = false;
  let unlockedPath: 'path_a' | 'path_b' | null = null;

  if (!wasUnlocked && unlocked && path) {
    concept.unlocked = true;
    concept.unlockedAt = new Date().toISOString();
    concept.unlockedBy = path;
    masteryChanged = true;
    unlockedPath = path;

    const next = UNLOCK_CHAIN[conceptId];
    if (next && !store.concepts[next].unlocked) {
      store.concepts[next].unlocked = true;
      store.concepts[next].unlockedAt = new Date().toISOString();
      store.concepts[next].unlockedBy = null;
    }
  } else if (conceptId === 'notes') {
    concept.unlocked = true;
    concept.unlockedAt = concept.unlockedAt ?? new Date().toISOString();
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

export async function getUnlockedConceptIds(): Promise<ConceptId[]> {
  const store = await loadStore();
  return ALL_CONCEPTS.filter((id) => store.concepts[id].unlocked);
}

export async function getConceptPathProgress(
  conceptId: ConceptId
): Promise<PathProgress> {
  const store = await loadStore();
  return getPathProgress(store.concepts[conceptId].sessions);
}

export async function __devResetMastery(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}