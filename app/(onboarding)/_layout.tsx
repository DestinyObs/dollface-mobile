import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="beauty-goals" />
      <Stack.Screen name="skill-level" />
      <Stack.Screen name="skin-tone" />
      <Stack.Screen name="undertone" />
      <Stack.Screen name="skin-type" />
      <Stack.Screen name="face-concerns" />
      <Stack.Screen name="preferred-brands" />
      <Stack.Screen name="budget-range" />
      <Stack.Screen name="style-preferences" />
      <Stack.Screen name="selfie-permission" />
      <Stack.Screen name="camera-permission" />
      <Stack.Screen name="notification-permission" />
      <Stack.Screen name="complete" />
    </Stack>
  );
}
