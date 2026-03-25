import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, StatusBar } from 'react-native';
import { LightColors, Spacing, Radius } from '../src/theme';
import { CONCEPTS } from '../src/utils/musicTheory';

export default function LearnScreen() {
  const colors = LightColors;
  const [expandedConcept, setExpandedConcept] = useState<string | null>('notes');

  return (
    <ScrollView
      style={[styles.root, { backgroundColor: colors.surface }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle="dark-content" />

      <View
        style={[
          styles.heroCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.eyebrow, { color: colors.sage }]}>ACUITY</Text>
        <Text style={[styles.tagline, { color: colors.text }]}>
          Sharpen your musical ear.
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Build listening skill through short daily sessions and unlock each concept over time.
        </Text>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Learn concepts</Text>

      {CONCEPTS.map((concept, idx) => {
        const isUnlocked = idx === 0;
        const isExpanded = expandedConcept === concept.id;

        return (
          <Pressable
            key={concept.id}
            style={[
              styles.card,
              {
                backgroundColor: colors.surface,
                borderColor: isExpanded && isUnlocked ? colors.slate : colors.border,
              },
              !isUnlocked && styles.cardLocked,
            ]}
            onPress={() => isUnlocked && setExpandedConcept(isExpanded ? null : concept.id)}
            disabled={!isUnlocked}
          >
            <View style={styles.cardHeader}>
              <View style={styles.cardLeft}>
                <View
                  style={[
                    styles.badge,
                    {
                      backgroundColor: isUnlocked ? colors.slate : colors.surfaceAlt,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      {
                        color: isUnlocked ? colors.textOnSlate : colors.textMuted,
                      },
                    ]}
                  >
                    {idx + 1}
                  </Text>
                </View>

                <View style={styles.cardText}>
                  <Text
                    style={[
                      styles.cardTitle,
                      { color: isUnlocked ? colors.text : colors.textMuted },
                    ]}
                  >
                    {concept.title}
                  </Text>

                  <Text
                    style={[
                      styles.cardDesc,
                      { color: isUnlocked ? colors.textSecondary : colors.textMuted },
                    ]}
                  >
                    {isUnlocked
                      ? concept.description
                      : 'Locked — complete previous concept'}
                  </Text>
                </View>
              </View>

              <Text style={[styles.chevron, { color: colors.textMuted }]}>
                {!isUnlocked ? '🔒' : isExpanded ? '∧' : '∨'}
              </Text>
            </View>

            {isExpanded && isUnlocked && (
              <View
                style={[
                  styles.lessonsSection,
                  { backgroundColor: colors.surfaceAlt },
                ]}
              >
                <View
                  style={[
                    styles.lessonsDivider,
                    { backgroundColor: colors.border },
                  ]}
                />

                {[
                  'What is a note?',
                  'White and black keys',
                  'What is an octave?',
                  'Training your ear',
                  'Your first exercise',
                ].map((title, li) => (
                  <View key={li} style={styles.lessonRow}>
                    <View
                      style={[
                        styles.lessonDot,
                        { backgroundColor: colors.sage },
                      ]}
                    />
                    <Text style={[styles.lessonTitle, { color: colors.text }]}>
                      Lesson {li + 1} — {title}
                    </Text>
                    <View
                      style={[
                        styles.lessonTimePill,
                        {
                          backgroundColor: colors.background,
                          borderColor: colors.border,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.lessonMins,
                          { color: colors.textSecondary },
                        ]}
                      >
                        3 min
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing['3xl'],
  },
  heroCard: {
    borderWidth: 1,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 30,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: Spacing.md,
    paddingLeft: 2,
  },
  card: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  cardLocked: {
    opacity: 0.58,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    gap: Spacing.md,
  },
  cardText: {
    flex: 1,
  },
  badge: {
    width: 30,
    height: 30,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    lineHeight: 19,
  },
  chevron: {
    fontSize: 15,
    marginLeft: Spacing.sm,
  },
  lessonsSection: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  lessonsDivider: {
    height: 1,
    marginBottom: Spacing.md,
  },
  lessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  lessonDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  lessonTitle: {
    flex: 1,
    fontSize: 13,
  },
  lessonTimePill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  lessonMins: {
    fontSize: 11,
    fontWeight: '600',
  },
});