import { router } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { PermissionScreen } from '@/components/layout/PermissionScreen';

export default function NotificationPermissionScreen() {
  const next = () => router.push('/(onboarding)/complete');
  const request = async () => {
    try { await Notifications.requestPermissionsAsync(); } catch {}
    next();
  };

  return (
    <PermissionScreen
      icon="notifications-outline"
      title="Stay in the loop"
      body="Get notified about new tutorials tailored to your goals, shade match updates, and weekly beauty tips."
      bullets={[
        { icon: 'book-outline',          text: 'New tutorials for your goals & skill level' },
        { icon: 'color-palette-outline', text: 'Shade match updates when products fit you' },
        { icon: 'sparkles-outline',      text: 'Short, actionable weekly beauty tips' },
      ]}
      primaryLabel="Turn On Notifications"
      onPrimary={request}
      onSkip={next}
    />
  );
}
