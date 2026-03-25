import React from 'react';
import { Pressable, Image } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../src/theme';

export default function RootLayout() {
  const router = useRouter();
  const colors = useTheme();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarActiveTintColor: colors.slate,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          height: 64,
          paddingTop: 6,
          paddingBottom: 8,
        },
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTitle: () => (
          <Image
            source={require('../assets/logo.png')}
            style={{ width: 120, height: 28, resizeMode: 'contain' }}
          />
        ),
        headerShadowVisible: false,
        sceneStyle: {
          backgroundColor: colors.surface,
        },
        headerRight: () => (
          <Pressable
            onPress={() => router.push('/settings')}
            style={{ paddingHorizontal: 14, paddingVertical: 6 }}
            hitSlop={10}
          >
            <Ionicons name="settings-outline" size={22} color={colors.slate} />
          </Pressable>
        ),
        tabBarIcon: ({ color, size, focused }) => {
          if (route.name === 'index') {
            return (
              <Ionicons
                name={focused ? 'book' : 'book-outline'}
                size={size}
                color={color}
              />
            );
          }

          if (route.name === 'practice') {
            return (
              <Ionicons
                name={focused ? 'musical-notes' : 'musical-notes-outline'}
                size={size}
                color={color}
              />
            );
          }

          if (route.name === 'progress') {
            return (
              <Ionicons
                name={focused ? 'bar-chart' : 'bar-chart-outline'}
                size={size}
                color={color}
              />
            );
          }

          if (route.name === 'onboarding') {
            return (
              <Ionicons
                name={focused ? 'sparkles' : 'sparkles-outline'}
                size={size}
                color={color}
              />
            );
          }

          return (
            <Ionicons
              name={focused ? 'ellipse' : 'ellipse-outline'}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Learn',
          tabBarLabel: 'Learn',
        }}
      />

      <Tabs.Screen
        name="practice"
        options={{
          title: 'Practice',
          tabBarLabel: 'Practice',
        }}
      />

      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          tabBarLabel: 'Progress',
        }}
      />

      <Tabs.Screen
        name="onboarding"
        options={{
          title: 'Onboarding',
          tabBarLabel: 'Onboarding',
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}