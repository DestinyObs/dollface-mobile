import { useState } from 'react';
import { View } from 'react-native';
import { OnboardingStep } from '@/components/layout/OnboardingStep';
import { Chip } from '@/components/ui/Chip';
import { useBeautyProfileStore } from '@/lib/store/beautyProfileStore';

const BRANDS = [
  'MAC', 'NARS', 'Fenty Beauty', 'Charlotte Tilbury', 'Maybelline',
  'NYX', 'e.l.f.', 'Too Faced', 'Urban Decay', 'Rare Beauty',
  'Huda Beauty', 'Morphe', 'L\'Oreal', 'Bobbi Brown', 'Pat McGrath',
  'Armani Beauty', 'Dior Beauty', 'Benefit', 'ColourPop', 'No preference',
];

export default function PreferredBrandsScreen() {
  const [selected, setSelected] = useState<string[]>([]);
  const { setProfile, profile } = useBeautyProfileStore();

  const toggle = (b: string) => {
    if (b === 'No preference') { setSelected(['No preference']); return; }
    setSelected((prev) => {
      const without = prev.filter((x) => x !== 'No preference');
      return without.includes(b) ? without.filter((x) => x !== b) : [...without, b];
    });
  };

  return (
    <OnboardingStep
      step={7} totalSteps={13}
      title="Any favourite brands?"
      subtitle="We'll prioritise these in recommendations. You can always explore others."
      nextRoute="/(onboarding)/budget-range"
      canContinue={selected.length > 0}
      onNext={() => setProfile({ ...(profile as any), preferredBrands: selected })}
    >
      <View className="flex-row flex-wrap gap-2">
        {BRANDS.map((b) => (
          <Chip key={b} label={b} selected={selected.includes(b)} onPress={() => toggle(b)} />
        ))}
      </View>
    </OnboardingStep>
  );
}
