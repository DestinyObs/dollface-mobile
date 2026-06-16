import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView, Animated, Easing } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Motion';
import { Colors } from '@/constants/colors';

interface Props {
  step: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
  nextRoute: string;
  nextLabel?: string;
  canContinue?: boolean;
  loading?: boolean;
  onNext?: () => void | Promise<void>;
  children: React.ReactNode;
  scrollable?: boolean;
}

/** Warm, progress-driven encouragement so the flow feels human, not like a form. */
function encouragement(step: number, total: number): string {
  if (step === 1) return "Let's get started";
  if (step >= total) return 'Last one — promise!';
  const r = step / total;
  if (r < 0.4) return "You're doing great";
  if (r < 0.7) return 'Halfway there';
  return 'Almost done';
}

export function OnboardingStep({
  step,
  totalSteps,
  title,
  subtitle,
  nextRoute,
  nextLabel = 'Continue',
  canContinue = true,
  loading = false,
  onNext,
  children,
  scrollable = true,
}: Props) {
  const target = step / totalSteps;
  const anim = useRef(new Animated.Value(Math.max(0, (step - 1) / totalSteps))).current;

  useEffect(() => {
    Animated.timing(anim, { toValue: target, duration: 520, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
  }, [target]);

  const handleNext = async () => {
    Haptics.selectionAsync().catch(() => {});
    if (onNext) await onNext();
    router.push(nextRoute as any);
  };

  const widthInterp = anim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  const Content = (
    <>
      <Reveal>
        <Text style={s.title}>{title}</Text>
        {subtitle && <Text style={s.subtitle}>{subtitle}</Text>}
      </Reveal>
      <Reveal delay={90}><View style={s.body}>{children}</View></Reveal>
    </>
  );

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      {/* ── Top nav ── */}
      <View style={s.topBar}>
        <TouchableOpacity
          onPress={() => (step > 1 ? router.back() : null)}
          style={[s.backBtn, step === 1 && s.invisible]}
          disabled={step === 1}
        >
          <Ionicons name="arrow-back" size={20} color={Colors.brand.plum} />
        </TouchableOpacity>

        <View style={s.stepCol}>
          <Text style={s.stepLabel}>STEP {step} OF {totalSteps}</Text>
          <Text style={s.encourage}>{encouragement(step, totalSteps)}</Text>
        </View>

        <View style={s.spacer} />
      </View>

      {/* Animated gradient progress bar */}
      <View style={s.progressTrack}>
        <Animated.View style={[s.progressFillWrap, { width: widthInterp }]}>
          <LinearGradient colors={[Colors.brand.plum, Colors.rose]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.progressFill} />
        </Animated.View>
      </View>

      {/* ── Content ── */}
      {scrollable ? (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={s.contentScroll} showsVerticalScrollIndicator={false}>
          {Content}
        </ScrollView>
      ) : (
        <View style={s.contentFixed}>{Content}</View>
      )}

      {/* ── CTA ── */}
      <View style={s.cta}>
        <Button label={nextLabel} onPress={handleNext} disabled={!canContinue} loading={loading} fullWidth size="lg" />
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.ivory },

  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: 10, paddingBottom: 14 },
  backBtn: {
    width: 44, height: 44, borderRadius: 15, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.brand.plum, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 2,
  },
  invisible: { opacity: 0, pointerEvents: 'none' as any },
  spacer: { width: 44, height: 44 },
  stepCol: { alignItems: 'center', gap: 2 },
  stepLabel: { fontFamily: 'DMSans_700Bold', fontSize: 10.5, color: Colors.text.muted, letterSpacing: 1.2 },
  encourage: { fontFamily: 'DMSans_500Medium', fontSize: 12.5, color: Colors.brand.plum },

  progressTrack: { height: 6, backgroundColor: Colors.border.light, marginHorizontal: 24, borderRadius: 3, marginBottom: 14, overflow: 'hidden' },
  progressFillWrap: { height: 6, borderRadius: 3, overflow: 'hidden' },
  progressFill: { flex: 1, borderRadius: 3 },

  contentScroll: { paddingHorizontal: 24, paddingTop: 18, paddingBottom: 12 },
  contentFixed: { flex: 1, paddingHorizontal: 24, paddingTop: 18 },

  title: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 24, color: Colors.text.primary, marginBottom: 9, lineHeight: 30 },
  subtitle: { fontFamily: 'DMSans_400Regular', fontSize: 14.5, color: Colors.text.secondary, lineHeight: 21, marginBottom: 26 },
  body: { gap: 0 },

  cta: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 8, backgroundColor: Colors.ivory },
});
