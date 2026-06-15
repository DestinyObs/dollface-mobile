import { router } from 'expo-router';
import { PermissionScreen } from '@/components/layout/PermissionScreen';

export default function SelfiePermissionScreen() {
  const next = () => router.push('/(onboarding)/camera-permission');

  return (
    <PermissionScreen
      icon="happy-outline"
      title="Shade matching uses your selfie"
      body="To give accurate recommendations, DollFace analyses your selfie. It's processed privately and never stored without your consent."
      bullets={[
        { icon: 'flash-outline',           text: 'Analysed in real-time, not stored permanently' },
        { icon: 'trash-outline',           text: 'You control your scan history — delete anytime' },
        { icon: 'shield-checkmark-outline',text: 'Never shared with third parties' },
        { icon: 'lock-closed-outline',     text: 'Runs on secure, encrypted servers' },
      ]}
      primaryLabel="Enable Shade Matching"
      onPrimary={next}
      onSkip={next}
    />
  );
}
