import { Redirect } from 'expo-router';
import { useAuthStore } from '@/lib/store/authStore';
import { useBeautyProfileStore } from '@/lib/store/beautyProfileStore';

export default function Index() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const onboardingComplete = useBeautyProfileStore((s) => s.onboardingComplete);

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/welcome" />;
  }

  if (!onboardingComplete) {
    return <Redirect href="/(onboarding)/beauty-goals" />;
  }

  return <Redirect href="/(tabs)" />;
}
