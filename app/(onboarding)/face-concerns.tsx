import { useState } from 'react';
import { View } from 'react-native';
import { OnboardingStep } from '@/components/layout/OnboardingStep';
import { Chip } from '@/components/ui/Chip';
import { useBeautyProfileStore } from '@/lib/store/beautyProfileStore';

const CONCERNS = [
  'Dark circles', 'Hyperpigmentation', 'Uneven skin tone', 'Redness',
  'Acne or blemishes', 'Large pores', 'Fine lines', 'Dullness',
  'Sparse brows', 'Thin lips', 'Hooded eyes', 'Monolid eyes', 'None',
];

export default function FaceConcernsScreen() {
  const [selected, setSelected] = useState<string[]>([]);
  const { setProfile, profile } = useBeautyProfileStore();

  const toggle = (c: string) => {
    if (c === 'None') { setSelected(['None']); return; }
    setSelected((prev) => {
      const without = prev.filter((x) => x !== 'None');
      return without.includes(c) ? without.filter((x) => x !== c) : [...without, c];
    });
  };

  return (
    <OnboardingStep
      step={6} totalSteps={13}
      title="Any specific areas you'd like to work with?"
      subtitle="We'll tailor techniques to complement your unique features — no feature is a flaw."
      nextRoute="/(onboarding)/preferred-brands"
      canContinue={selected.length > 0}
      onNext={() => setProfile({ ...(profile as any), faceConcerns: selected })}
    >
      <View className="flex-row flex-wrap gap-2">
        {CONCERNS.map((c) => (
          <Chip key={c} label={c} selected={selected.includes(c)} onPress={() => toggle(c)} />
        ))}
      </View>
    </OnboardingStep>
  );
}
