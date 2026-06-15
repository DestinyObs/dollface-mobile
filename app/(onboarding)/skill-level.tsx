import { useState } from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { OnboardingStep } from '@/components/layout/OnboardingStep';
import { OptionCard } from '@/components/ui/OptionCard';
import { useBeautyProfileStore } from '@/lib/store/beautyProfileStore';
import type { SkillLevel } from '@/types/beauty';

type IName = React.ComponentProps<typeof Ionicons>['name'];

const LEVELS: { value: SkillLevel; label: string; desc: string; icon: IName }[] = [
  { value: 'BEGINNER',     label: 'Beginner',          desc: 'I barely know where to start',                       icon: 'leaf-outline' },
  { value: 'INTERMEDIATE', label: 'Everyday User',     desc: 'I have a routine but want to level up',               icon: 'brush-outline' },
  { value: 'ADVANCED',     label: 'Beauty Enthusiast', desc: 'I love makeup and want to master new techniques',     icon: 'sparkles-outline' },
];

export default function SkillLevelScreen() {
  const [selected, setSelected] = useState<SkillLevel | null>(null);
  const { setProfile, profile } = useBeautyProfileStore();

  return (
    <OnboardingStep
      step={2} totalSteps={13}
      title="What's your skill level?"
      subtitle="Be honest — this shapes everything from tutorial difficulty to product suggestions."
      nextRoute="/(onboarding)/skin-tone"
      canContinue={!!selected}
      onNext={() => setProfile({ ...(profile as any), skillLevel: selected! })}
    >
      <View>
        {LEVELS.map(l => (
          <OptionCard
            key={l.value}
            icon={l.icon}
            label={l.label}
            desc={l.desc}
            selected={selected === l.value}
            onPress={() => setSelected(l.value)}
          />
        ))}
      </View>
    </OnboardingStep>
  );
}
