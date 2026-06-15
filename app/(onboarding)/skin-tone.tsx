import { useState } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { OnboardingStep } from '@/components/layout/OnboardingStep';
import { Text } from '@/components/ui/Text';
import { useBeautyProfileStore } from '@/lib/store/beautyProfileStore';

const TONES = [
  { label: 'Fair', hex: '#FDDCB0', depth: 'FAIR' },
  { label: 'Light', hex: '#F5C48A', depth: 'LIGHT' },
  { label: 'Light Medium', hex: '#E8A96A', depth: 'LIGHT' },
  { label: 'Medium', hex: '#D4895A', depth: 'MEDIUM' },
  { label: 'Medium Tan', hex: '#C47540', depth: 'TAN' },
  { label: 'Tan', hex: '#A85E30', depth: 'TAN' },
  { label: 'Deep Tan', hex: '#8C4A22', depth: 'DEEP' },
  { label: 'Deep', hex: '#6B3318', depth: 'DEEP' },
  { label: 'Rich', hex: '#4A1E0A', depth: 'RICH' },
  { label: 'Very Rich', hex: '#2D1008', depth: 'RICH' },
];

export default function SkinToneScreen() {
  const [selected, setSelected] = useState<string | null>(null);
  const { setProfile, profile } = useBeautyProfileStore();

  return (
    <OnboardingStep
      step={3} totalSteps={13}
      title="What's your skin tone?"
      subtitle="Pick the closest match. This is the foundation of your shade recommendations."
      nextRoute="/(onboarding)/undertone"
      canContinue={!!selected}
      onNext={() => setProfile({ ...(profile as any), skinToneHex: selected! })}
    >
      <View className="flex-row flex-wrap gap-3 justify-between">
        {TONES.map((t) => (
          <TouchableOpacity
            key={t.hex}
            onPress={() => setSelected(t.hex)}
            activeOpacity={0.8}
            className="items-center gap-2"
            style={{ width: '18%' }}
          >
            <View
              className={`w-14 h-14 rounded-full border-4 ${selected === t.hex ? 'border-brand-plum' : 'border-transparent'}`}
              style={{ backgroundColor: t.hex }}
            />
            <Text variant="label" color="muted" className="text-center text-xs">{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </OnboardingStep>
  );
}
