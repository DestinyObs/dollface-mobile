import { router } from 'expo-router';
import { Camera } from 'expo-camera';
import { PermissionScreen } from '@/components/layout/PermissionScreen';

export default function CameraPermissionScreen() {
  const next = () => router.push('/(onboarding)/notification-permission');
  const request = async () => {
    try { await Camera.requestCameraPermissionsAsync(); } catch {}
    next();
  };

  return (
    <PermissionScreen
      icon="camera-outline"
      title="Allow camera access"
      body="DollFace uses your camera for live shade matching and to capture looks for recreation."
      bullets={[
        { icon: 'color-palette-outline', text: 'Live, real-time shade matching' },
        { icon: 'sparkles-outline',      text: 'Capture any look to recreate it' },
        { icon: 'lock-closed-outline',   text: 'Footage is never stored without consent' },
      ]}
      primaryLabel="Allow Camera Access"
      onPrimary={request}
      onSkip={next}
    />
  );
}
