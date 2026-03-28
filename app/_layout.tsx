import { Stack } from 'expo-router';
import { useTheme } from '../src/theme';

export default function RootLayout() {
  const colors = useTheme();

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="learn/[lessonId]"
        options={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
    </Stack>
  );
}