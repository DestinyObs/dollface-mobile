import { useState } from 'react';
import { View } from 'react-native';
import { OnboardingStep } from '@/components/layout/OnboardingStep';
import { Chip } from '@/components/ui/Chip';
import { useBeautyProfileStore } from '@/lib/store/beautyProfileStore';

const STYLES = [
  'Natural / No-makeup', 'Soft glam', 'Bold glam', 'Editorial',
  'African beauty', 'South Asian beauty', 'East Asian beauty',
  'Middle Eastern beauty', 'Black diaspora', 'Latin American beauty',
  'Bridal', 'Modest makeup', 'Everyday office look',
  'Festival / Creative', 'Western classic', 'Vintage / Retro',
];

export default function StylePreferencesScreen() {
  const [selected, setSelected] = useState<string[]>([]);
  const { setProfile, profile } = useBeautyProfileStore();

  const toggle = (s: string) =>
    setSelected((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);

  return (
    <OnboardingStep
      step={9} totalSteps={13}
      title="What styles inspire you?"
      subtitle="DollFace celebrates beauty across all cultures and aesthetics. Pick what speaks to you."
      nextRoute="/(onboarding)/selfie-permission"
      canContinue={selected.length > 0}
      onNext={() => setProfile({ ...(profile as any), stylePreferences: selected })}
    >
      <View className="flex-row flex-wrap gap-2">
        {STYLES.map((s) => (
          <Chip key={s} label={s} selected={selected.includes(s)} onPress={() => toggle(s)} />
        ))}
      </View>
    </OnboardingStep>
  );
}
