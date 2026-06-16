import { router } from 'expo-router';
import { PermissionScreen } from '@/components/layout/PermissionScreen';
import { registerPushToken } from '@/lib/push';

export default function NotificationPermissionScreen() {
  const next = () => router.push('/(onboarding)/complete');
  const request = async () => {
    // Requests the OS permission and registers the device's push token with the backend.
    await registerPushToken({ prompt: true });
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
