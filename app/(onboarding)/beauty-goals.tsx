import { useState } from 'react';
import { View } from 'react-native';
import { OnboardingStep } from '@/components/layout/OnboardingStep';
import { Chip } from '@/components/ui/Chip';
import { useBeautyProfileStore } from '@/lib/store/beautyProfileStore';

const GOALS = [
  'Build a daily routine', 'Master the no-makeup look', 'Learn bold glam',
  'Perfect my base', 'Improve my brow game', 'Get better at eye looks',
  'Find my perfect lip colour', 'Recreate social media looks',
  'Understand my undertone', 'Shop smarter for my skin tone',
];

export default function BeautyGoalsScreen() {
  const [selected, setSelected] = useState<string[]>([]);
  const { setProfile, profile } = useBeautyProfileStore();

  const toggle = (g: string) =>
    setSelected((prev) => prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]);

  const handleNext = () => {
    setProfile({ ...(profile as any), beautyGoals: selected });
  };

  return (
    <OnboardingStep
      step={1} totalSteps={13}
      title="What are your beauty goals?"
      subtitle="Select all that apply. We'll personalise your entire experience around these."
      nextRoute="/(onboarding)/skill-level"
      canContinue={selected.length > 0}
      onNext={handleNext}
    >
      <View className="flex-row flex-wrap gap-2">
        {GOALS.map((g) => (
          <Chip key={g} label={g} selected={selected.includes(g)} onPress={() => toggle(g)} />
        ))}
      </View>
    </OnboardingStep>
  );
}
