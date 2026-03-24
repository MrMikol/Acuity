import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, StatusBar } from 'react-native';
import { Colors, Spacing, Radius, Typography } from '../src/theme';
import { CONCEPTS } from '../src/utils/musicTheory';
import { getAllMastery, getPathProgress } from '../src/store/masteryStore';
import type { MasteryStore } from '../src/store/masteryStore';

export default function LearnScreen() {
  const [mastery, setMastery] = useState<MasteryStore | null>(null);
  const [expandedConcept, setExpandedConcept] = useState<string | null>('notes');

  useEffect(() => {
    getAllMastery().then(setMastery);
  }, []);

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.tagline}>Sharpen your musical ear.</Text>
        <Text style={styles.subtitle}>Master 5 concepts through daily practice. Each concept unlocks the next.</Text>
      </View>

      {CONCEPTS.map((concept, idx) => {
        const isUnlocked = mastery?.concepts[concept.id].unlocked ?? idx === 0;
        const isExpanded = expandedConcept === concept.id;
        const m = mastery?.concepts[concept.id];
        const lastAccuracy = m?.sessions?.length
          ? m.sessions[m.sessions.length - 1].accuracy
          : null;

        return (
          <Pressable
            key={concept.id}
            style={[styles.card, !isUnlocked && styles.cardLocked, isExpanded && styles.cardExpanded]}
            onPress={() => isUnlocked && setExpandedConcept(isExpanded ? null : concept.id)}
            disabled={!isUnlocked}
          >
            <View style={styles.cardHeader}>
              <View style={styles.cardLeft}>
                <View style={[styles.badge, isUnlocked ? styles.badgeUnlocked : styles.badgeLocked]}>
                  <Text style={[styles.badgeText, !isUnlocked && styles.badgeTextLocked]}>{idx + 1}</Text>
                </View>
                <View style={styles.cardText}>
                  <Text style={[styles.cardTitle, !isUnlocked && styles.textLocked]}>{concept.title}</Text>
                  <Text style={[styles.cardDesc, !isUnlocked && styles.textLocked]}>
                    {isUnlocked ? concept.description : 'Locked — complete previous concept'}
                  </Text>
                </View>
              </View>
              <View style={styles.cardRight}>
                {isUnlocked && lastAccuracy !== null && (
                  <Text style={{ fontSize: 13, fontWeight: '600', color: lastAccuracy >= 0.8 ? Colors.sage : Colors.blush }}>
                    {Math.round(lastAccuracy * 100)}%
                  </Text>
                )}
                <Text style={styles.chevron}>{!isUnlocked ? '🔒' : isExpanded ? '∧' : '∨'}</Text>
              </View>
            </View>

            {isExpanded && isUnlocked && (
              <View style={styles.lessonsSection}>
                <View style={styles.lessonsDivider} />
                {[
                  'What is a note?',
                  'White and black keys',
                  'What is an octave?',
                  'Training your ear',
                  'Your first exercise',
                ].map((title, li) => (
                  <View key={li} style={styles.lessonRow}>
                    <View style={styles.lessonDot} />
                    <Text style={styles.lessonTitle}>Lesson {li + 1} — {title}</Text>
                    <Text style={styles.lessonMins}>3 min</Text>
                  </View>
                ))}
                {m && (
                  <View style={styles.masterySection}>
                    <Text style={styles.masterySectionTitle}>Mastery progress</Text>
                    {(() => {
                      const p = getPathProgress(m.sessions);
                      return (
                        <>
                          <PathBar label="Path A (90%)" current={p.pathA.daysQualified} goal={p.pathA.daysNeeded} pct={p.pathA.pct} color={Colors.sage} />
                          <PathBar label="Path B (80%)" current={p.pathB.daysQualified} goal={p.pathB.daysNeeded} pct={p.pathB.pct} color={Colors.slate} />
                        </>
                      );
                    })()}
                  </View>
                )}
              </View>
            )}
          </Pressable>
        );
      })}
      <View style={{ height: Spacing['2xl'] }} />
    </ScrollView>
  );
}

function PathBar({ label, current, goal, pct, color }: { label: string; current: number; goal: number; pct: number; color: string }) {
  return (
    <View style={{ gap: 3, marginBottom: 6 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ fontSize: 11, color: Colors.textSecondary }}>{label}</Text>
        <Text style={{ fontSize: 11, fontWeight: '600', color }}>{current}/{goal} days</Text>
      </View>
      <View style={{ height: 5, backgroundColor: Colors.warmGray, borderRadius: 99, overflow: 'hidden' }}>
        <View style={{ height: '100%', width: `${pct * 100}%`, backgroundColor: color, borderRadius: 99 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.cream },
  content: { padding: Spacing.lg },
  header: { marginBottom: Spacing.xl, paddingTop: Spacing.sm },
  tagline: { fontSize: 30, fontWeight: '700', color: Colors.slate, marginBottom: Spacing.xs },
  subtitle: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20 },
  card: { backgroundColor: Colors.white, borderRadius: Radius.lg, borderWidth: 0.5, borderColor: Colors.warmGray, marginBottom: Spacing.md, overflow: 'hidden' },
  cardExpanded: { borderColor: Colors.slate, borderWidth: 1 },
  cardLocked: { opacity: 0.5 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.lg },
  cardLeft: { flexDirection: 'row', alignItems: 'flex-start', flex: 1, gap: Spacing.md },
  cardRight: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '600', color: Colors.text, marginBottom: 2 },
  cardDesc: { fontSize: 13, color: Colors.textSecondary },
  textLocked: { color: Colors.textMuted },
  badge: { width: 28, height: 28, borderRadius: 99, alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 },
  badgeUnlocked: { backgroundColor: Colors.slate },
  badgeLocked: { backgroundColor: Colors.warmGray },
  badgeText: { fontSize: 13, fontWeight: '700', color: Colors.cream },
  badgeTextLocked: { color: Colors.textMuted },
  chevron: { fontSize: 14, color: Colors.textMuted },
  lessonsSection: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.lg },
  lessonsDivider: { height: 0.5, backgroundColor: Colors.warmGray, marginBottom: Spacing.md },
  lessonRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm, gap: Spacing.sm },
  lessonDot: { width: 6, height: 6, borderRadius: 99, backgroundColor: Colors.sage, flexShrink: 0 },
  lessonTitle: { flex: 1, fontSize: 13, color: Colors.text },
  lessonMins: { fontSize: 11, color: Colors.textMuted },
  masterySection: { marginTop: Spacing.lg, padding: Spacing.md, backgroundColor: Colors.warmGrayLight, borderRadius: Radius.md },
  masterySectionTitle: { fontSize: 11, fontWeight: '600', color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: Spacing.sm },
});