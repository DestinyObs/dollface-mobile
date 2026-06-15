import React from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
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
  const handleNext = async () => {
    if (onNext) await onNext();
    router.push(nextRoute as any);
  };

  const filled = Math.round((step / totalSteps) * 100);

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

        <Text style={s.stepLabel}>Step {step} of {totalSteps}</Text>

        <View style={s.spacer} />
      </View>

      {/* Progress bar */}
      <View style={s.progressTrack}>
        <View style={[s.progressFill, { width: `${filled}%` as any }]} />
      </View>

      {/* ── Content ── */}
      {scrollable ? (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={s.contentScroll}
          showsVerticalScrollIndicator={false}
        >
          <Text style={s.title}>{title}</Text>
          {subtitle && <Text style={s.subtitle}>{subtitle}</Text>}
          <View style={s.body}>{children}</View>
        </ScrollView>
      ) : (
        <View style={s.contentFixed}>
          <Text style={s.title}>{title}</Text>
          {subtitle && <Text style={s.subtitle}>{subtitle}</Text>}
          <View style={s.body}>{children}</View>
        </View>
      )}

      {/* ── CTA ── */}
      <View style={s.cta}>
        <Button
          label={nextLabel}
          onPress={handleNext}
          disabled={!canContinue}
          loading={loading}
          fullWidth
          size="lg"
        />
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.ivory },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 16,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.brand.plum,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  invisible: { opacity: 0, pointerEvents: 'none' as any },
  spacer: { width: 44, height: 44 },
  stepLabel: { fontFamily: 'DMSans_700Bold', fontSize: 12, color: Colors.text.muted, letterSpacing: 0.5 },

  progressTrack: {
    height: 4,
    backgroundColor: Colors.border.light,
    marginHorizontal: 24,
    borderRadius: 2,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressFill: { height: 4, backgroundColor: Colors.brand.plum, borderRadius: 2 },

  contentScroll: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 12 },
  contentFixed: { flex: 1, paddingHorizontal: 24, paddingTop: 20 },

  title: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 23, color: Colors.text.primary, marginBottom: 9, lineHeight: 29 },
  subtitle: { fontFamily: 'DMSans_400Regular', fontSize: 14.5, color: Colors.text.secondary, lineHeight: 21, marginBottom: 28 },
  body: { gap: 0 },

  cta: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: Colors.ivory,
  },
});
