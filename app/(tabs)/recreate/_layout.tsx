import { Stack } from 'expo-router';
export default function RecreateLayout() {
  return <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }} />;
}
