import { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { OnboardingStep } from '@/components/layout/OnboardingStep';
import { Text } from '@/components/ui/Text';
import { useBeautyProfileStore } from '@/lib/store/beautyProfileStore';
import type { Undertone } from '@/types/beauty';

const UNDERTONES: { value: Undertone; label: string; desc: string; hex: string }[] = [
  { value: 'COOL', label: 'Cool', desc: 'Pink, red, or blue hints. Silver jewellery flatters you.', hex: '#C9A7C8' },
  { value: 'WARM', label: 'Warm', desc: 'Yellow, peachy, or golden hints. Gold jewellery flatters you.', hex: '#D4A96A' },
  { value: 'NEUTRAL', label: 'Neutral', desc: 'A mix of warm and cool. Both silver and gold work for you.', hex: '#C4A080' },
  { value: 'OLIVE', label: 'Olive', desc: 'Greenish or yellow-green cast. Common in Mediterranean, South Asian, and Latina complexions.', hex: '#B5A570' },
  { value: 'GOLDEN', label: 'Golden', desc: 'Rich golden warmth. Common in deeper African and South Asian skin tones.', hex: '#C8902A' },
  { value: 'RED', label: 'Red / Ruddy', desc: 'Reddish or pink-red undertones, often with rosacea or naturally flushed skin.', hex: '#C87070' },
];

export default function UndertoneScreen() {
  const [selected, setSelected] = useState<Undertone | null>(null);
  const { setProfile, profile } = useBeautyProfileStore();

  return (
    <OnboardingStep
      step={4} totalSteps={13}
      title="What's your undertone?"
      subtitle="Undertone is different from your skin tone — it's the subtle hue beneath the surface."
      nextRoute="/(onboarding)/skin-type"
      canContinue={!!selected}
      onNext={() => setProfile({ ...(profile as any), undertone: selected! })}
    >
      <View className="gap-3">
        {UNDERTONES.map((u) => (
          <TouchableOpacity
            key={u.value}
            onPress={() => setSelected(u.value)}
            activeOpacity={0.8}
            className={`flex-row items-center gap-4 p-4 rounded-2xl border ${selected === u.value ? 'border-brand-plum bg-blush' : 'border-border-light bg-warm-white'}`}
          >
            <View className="w-10 h-10 rounded-full" style={{ backgroundColor: u.hex }} />
            <View className="flex-1">
              <Text variant="body" weight="semibold" color={selected === u.value ? 'brand' : 'primary'}>{u.label}</Text>
              <Text variant="caption" color="muted" className="mt-0.5 leading-relaxed">{u.desc}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </OnboardingStep>
  );
}
