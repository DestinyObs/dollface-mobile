import { useState } from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { OnboardingStep } from '@/components/layout/OnboardingStep';
import { OptionCard } from '@/components/ui/OptionCard';
import { useBeautyProfileStore } from '@/lib/store/beautyProfileStore';
import type { SkinType } from '@/types/beauty';

type IName = React.ComponentProps<typeof Ionicons>['name'];

const TYPES: { value: SkinType; label: string; desc: string; icon: IName }[] = [
  { value: 'NORMAL',      label: 'Normal',      desc: 'Balanced — not too oily or dry',                   icon: 'happy-outline' },
  { value: 'DRY',         label: 'Dry',         desc: 'Tight, sometimes flaky or dull',                   icon: 'sunny-outline' },
  { value: 'OILY',        label: 'Oily',        desc: 'Shiny, prone to breakouts',                        icon: 'water-outline' },
  { value: 'COMBINATION', label: 'Combination', desc: 'Oily T-zone, dry or normal cheeks',                icon: 'contrast-outline' },
  { value: 'SENSITIVE',   label: 'Sensitive',   desc: 'Reacts easily, prone to redness or irritation',    icon: 'flower-outline' },
];

export default function SkinTypeScreen() {
  const [selected, setSelected] = useState<SkinType | null>(null);
  const { setProfile, profile } = useBeautyProfileStore();

  return (
    <OnboardingStep
      step={5} totalSteps={13}
      title="What's your skin type?"
      subtitle="This affects which product formulas and primers we recommend."
      nextRoute="/(onboarding)/face-concerns"
      canContinue={!!selected}
      onNext={() => setProfile({ ...(profile as any), skinType: selected! })}
    >
      <View>
        {TYPES.map(t => (
          <OptionCard
            key={t.value}
            icon={t.icon}
            label={t.label}
            desc={t.desc}
            selected={selected === t.value}
            onPress={() => setSelected(t.value)}
          />
        ))}
      </View>
    </OnboardingStep>
  );
}
