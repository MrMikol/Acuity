import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { Colors, Spacing, Radius } from '../src/theme';
import { getAllMastery, getPathProgress } from '../src/store/masteryStore';
import type { MasteryStore } from '../src/store/masteryStore';
import { CONCEPTS } from '../src/utils/musicTheory';

export default function ProgressScreen() {
  const [mastery, setMastery] = useState<MasteryStore | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => { setMastery(await getAllMastery()); }, []);
  useEffect(() => { load(); }, []);

  const onRefresh = useCallback(async () => { setRefreshing(true); await load(); setRefreshing(false); }, [load]);

  if (!mastery) return null;

  const allSessions = Object.values(mastery.concepts).flatMap((c) => c.sessions);
  const uniqueDays = new Set(allSessions.map((s) => s.date)).size;
  const totalQ = allSessions.reduce((a, s) => a + s.questionCount, 0);
  const totalC = allSessions.reduce((a, s) => a + s.correctCount, 0);
  const accuracy = totalQ > 0 ? Math.round((totalC / totalQ) * 100) : 0;

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View style={styles.statsRow}>
        <StatCard label="Practice days" value={String(uniqueDays)} />
        <StatCard label="Questions" value={String(totalQ)} />
        <StatCard label="Accuracy" value={totalQ > 0 ? `${accuracy}%` : '—'} color={accuracy >= 80 ? Colors.sage : undefined} />
      </View>

      <Text style={styles.sectionTitle}>Concept mastery</Text>

      {CONCEPTS.map((concept) => {
        const cm = mastery.concepts[concept.id];
        if (!cm) return null;
        const p = getPathProgress(cm.sessions);
        return (
          <View key={concept.id} style={[styles.conceptCard, !cm.unlocked && { opacity: 0.5 }]}>
            <View style={styles.conceptHeader}>
              <Text style={styles.conceptTitle}>{concept.title}</Text>
              {cm.unlocked
                ? <View style={styles.unlockedBadge}><Text style={styles.unlockedBadgeText}>Unlocked</Text></View>
                : <Text style={{ fontSize: 11, color: Colors.textMuted }}>Locked</Text>}
            </View>
            {cm.unlocked && (
              <>
                <MiniBar label={`Path A (90%)  ${p.pathA.daysQualified}/${p.pathA.daysNeeded} days`} pct={p.pathA.pct} color={Colors.sage} />
                <MiniBar label={`Path B (80%)  ${p.pathB.daysQualified}/${p.pathB.daysNeeded} days`} pct={p.pathB.pct} color={Colors.slate} />
                {cm.sessions.length > 0 && (
                  <Text style={{ fontSize: 11, color: Colors.textMuted, marginTop: 4 }}>
                    Last practice: {cm.sessions[cm.sessions.length - 1].date}{'  '}{Math.round(cm.sessions[cm.sessions.length - 1].accuracy * 100)}%
                  </Text>
                )}
              </>
            )}
          </View>
        );
      })}

      <View style={styles.explainer}>
        <Text style={styles.explainerTitle}>How mastery works</Text>
        <Text style={styles.explainerText}>
          {'Path A — Fast track: score 90%+ on 5 separate days within 60 days.\n\nPath B — Consistent: score 80%+ on 10 separate days within 60 days.\n\nSessions must be on different calendar days. The 60-day window rolls forward — old sessions expire.'}
        </Text>
      </View>
      <View style={{ height: Spacing['2xl'] }} />
    </ScrollView>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={[styles.statValue, color ? { color } : {}]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function MiniBar({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <View style={{ gap: 3, marginBottom: 4 }}>
      <Text style={{ fontSize: 11, color: Colors.textSecondary }}>{label}</Text>
      <View style={{ height: 5, backgroundColor: Colors.warmGray, borderRadius: 99, overflow: 'hidden' }}>
        <View style={{ height: '100%', width: `${pct * 100}%`, backgroundColor: color, borderRadius: 99 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.cream },
  content: { padding: Spacing.lg },
  statsRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.xl, marginTop: Spacing.sm },
  statCard: { flex: 1, backgroundColor: Colors.warmGray, borderRadius: Radius.md, padding: Spacing.md, alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: '700', color: Colors.slate, marginBottom: 2 },
  statLabel: { fontSize: 11, color: Colors.textSecondary, textAlign: 'center' },
  sectionTitle: { fontSize: 11, fontWeight: '600', color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: Spacing.md },
  conceptCard: { backgroundColor: Colors.white, borderRadius: Radius.lg, borderWidth: 0.5, borderColor: Colors.warmGray, padding: Spacing.lg, marginBottom: Spacing.md, gap: Spacing.sm },
  conceptHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xs },
  conceptTitle: { fontSize: 15, fontWeight: '600', color: Colors.text },
  unlockedBadge: { backgroundColor: Colors.sageLight, paddingHorizontal: Spacing.sm, paddingVertical: 3, borderRadius: 99 },
  unlockedBadgeText: { fontSize: 11, color: Colors.sageDark, fontWeight: '600' },
  explainer: { backgroundColor: Colors.warmGray, borderRadius: Radius.lg, padding: Spacing.lg, marginTop: Spacing.sm },
  explainerTitle: { fontSize: 13, fontWeight: '600', color: Colors.text, marginBottom: Spacing.sm },
  explainerText: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20 },
});