import { useState } from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { OnboardingStep } from '@/components/layout/OnboardingStep';
import { OptionCard } from '@/components/ui/OptionCard';
import { useBeautyProfileStore } from '@/lib/store/beautyProfileStore';

type IName = React.ComponentProps<typeof Ionicons>['name'];

const BUDGETS: { value: string; label: string; desc: string; icon: IName }[] = [
  { value: 'BUDGET', label: 'Budget-friendly',  desc: 'Under £15 per product. Drugstore and affordable brands.', icon: 'wallet-outline' },
  { value: 'MID',    label: 'Mid-range',         desc: '£15–£50 per product. A mix of accessible and premium.',   icon: 'card-outline' },
  { value: 'LUXURY', label: 'Luxury',            desc: '£50+ per product. High-end and prestige brands.',          icon: 'diamond-outline' },
  { value: 'MIXED',  label: 'Mixed — it depends',desc: 'I splurge on some things and save on others.',             icon: 'shuffle-outline' },
];

export default function BudgetRangeScreen() {
  const [selected, setSelected] = useState<string | null>(null);
  const { setProfile, profile } = useBeautyProfileStore();

  return (
    <OnboardingStep
      step={8} totalSteps={13}
      title="What's your beauty budget?"
      subtitle="We'll match recommendations to your price range without compromising on quality."
      nextRoute="/(onboarding)/style-preferences"
      canContinue={!!selected}
      onNext={() => setProfile({ ...(profile as any), budgetRange: selected as any })}
    >
      <View>
        {BUDGETS.map(b => (
          <OptionCard
            key={b.value}
            icon={b.icon}
            label={b.label}
            desc={b.desc}
            selected={selected === b.value}
            onPress={() => setSelected(b.value)}
          />
        ))}
      </View>
    </OnboardingStep>
  );
}
