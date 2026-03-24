import { Tabs } from 'expo-router';
import { useEffect } from 'react';
import { Text } from 'react-native';
import { Colors } from '../src/theme';
import { initAudio } from '../src/audio/audioEngine';

export default function RootLayout() {
  useEffect(() => {
    initAudio().catch(console.error);
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: Colors.cream },
        headerTitleStyle: { color: Colors.text, fontWeight: '600', fontSize: 17 },
        headerShadowVisible: false,
        tabBarStyle: { backgroundColor: Colors.cream, borderTopColor: Colors.warmGray, borderTopWidth: 0.5 },
        tabBarActiveTintColor: Colors.slate,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Learn', tabBarLabel: 'Learn', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>♩</Text> }} />
      <Tabs.Screen name="practice" options={{ title: 'Practice', tabBarLabel: 'Practice', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>⟳</Text> }} />
      <Tabs.Screen name="progress" options={{ title: 'Progress', tabBarLabel: 'Progress', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>◎</Text> }} />
    </Tabs>
  );
}