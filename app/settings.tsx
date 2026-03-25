import React from 'react';
import { View, Text, ScrollView, StyleSheet, Switch } from 'react-native';
import Constants from 'expo-constants';
import { LightColors, Spacing, Radius } from '../src/theme';

export default function SettingsScreen() {
  const colors = LightColors;

  const appVersion =
    Constants.expoConfig?.version ??
    Constants.manifest2?.extra?.expoClient?.version ??
    '1.0.0';

  const bundleId =
    Constants.expoConfig?.ios?.bundleIdentifier ??
    Constants.expoConfig?.android?.package ??
    'com.michaelt.acuity';

  return (
    <ScrollView
      style={[styles.root, { backgroundColor: colors.surface }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={[
          styles.heroCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.eyebrow, { color: colors.sage }]}>SETTINGS</Text>
        <Text style={[styles.heroTitle, { color: colors.text }]}>Acuity</Text>
        <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
          Sharpen your musical ear.
        </Text>
      </View>

      <View
        style={[
          styles.sectionCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Audio</Text>

        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text style={[styles.rowTitle, { color: colors.text }]}>
              Sound effects
            </Text>
            <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>
              Play feedback sounds during practice.
            </Text>
          </View>
          <Switch value />
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text style={[styles.rowTitle, { color: colors.text }]}>
              Piano samples
            </Text>
            <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>
              Use the Salamander Grand Piano sample set.
            </Text>
          </View>
          <Switch value />
        </View>
      </View>

      <View
        style={[
          styles.sectionCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Practice</Text>

        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text style={[styles.rowTitle, { color: colors.text }]}>
              Auto replay
            </Text>
            <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>
              Replay the example automatically after a wrong answer.
            </Text>
          </View>
          <Switch value={false} />
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text style={[styles.rowTitle, { color: colors.text }]}>
              Show interval hints
            </Text>
            <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>
              Display extra help while learning.
            </Text>
          </View>
          <Switch value />
        </View>
      </View>

      <View
        style={[
          styles.sectionCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>

        <InfoRow label="App" value="Acuity" />
        <InfoRow label="Tagline" value="Sharpen your musical ear." />
        <InfoRow label="Developer" value="Michael Tan" />
        <InfoRow label="Version" value={appVersion} />
        <InfoRow label="Bundle ID" value={bundleId} />
        <InfoRow label="Stack" value="React Native + Expo" />

        <Text style={[styles.aboutText, { color: colors.textSecondary }]}>
          Acuity helps musicians improve note recognition, intervals, chords,
          and progressions through steady ear training.
        </Text>
      </View>
    </ScrollView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  const colors = LightColors;

  return (
    <View style={styles.infoRow}>
      <Text style={[styles.infoLabel, { color: colors.textMuted }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing['3xl'],
  },
  heroCard: {
    borderWidth: 1,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  sectionCard: {
    borderWidth: 1,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
    minHeight: 56,
  },
  rowText: {
    flex: 1,
    paddingRight: Spacing.md,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  rowSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.md,
  },
  infoRow: {
    marginBottom: Spacing.sm,
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: Spacing.md,
  },
});