import React from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/Text';
import { PressableScale } from '@/components/ui/Motion';
import { AppImage } from '@/components/ui/AppImage';
import { Colors } from '@/constants/colors';
import { Img } from '@/constants/images';

/**
 * Photographic auth banner — keeps sign-in / register / recovery cohesive
 * with the Welcome screen. Photo is an absolute-fill layer (never affects
 * content width), headline overlaid on a gradient scrim.
 */
export function AuthHeader({
  eyebrow,
  title,
  subtitle,
  height = 208,
  onBack,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  height?: number;
  onBack?: () => void;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[s.banner, { height }]}>
      <AppImage uri={Img.heroLook} style={StyleSheet.absoluteFill as any} />
      <LinearGradient
        colors={['rgba(30,8,16,0.45)', 'rgba(30,8,16,0.55)', 'rgba(30,8,16,0.9)']}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={[s.topRow, { paddingTop: insets.top + 8 }]}>
        <PressableScale style={s.back} onPress={onBack ?? (() => router.back())}>
          <Ionicons name="arrow-back" size={18} color="#FFFFFF" />
        </PressableScale>
        <View style={s.brand}>
          <View style={s.monogram}><View style={s.monoMark} /></View>
          <Text style={s.brandWord}>DOLLFACE</Text>
        </View>
      </View>

      <View style={s.head}>
        <Text style={s.eyebrow}>{eyebrow}</Text>
        <Text style={s.title}>{title}</Text>
        {subtitle ? <Text style={s.sub}>{subtitle}</Text> : null}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  banner: { width: '100%', justifyContent: 'space-between', overflow: 'hidden' },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18 },
  back: {
    width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  monogram: {
    width: 26, height: 26, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },
  monoMark: { width: 10, height: 10, borderRadius: 2.5, backgroundColor: '#FFFFFF', transform: [{ rotate: '45deg' }] },
  brandWord: { fontFamily: 'DMSans_700Bold', fontSize: 11.5, color: '#FFFFFF', letterSpacing: 2 },

  head: { paddingHorizontal: 22, paddingBottom: 40 },
  eyebrow: { fontFamily: 'DMSans_700Bold', fontSize: 10.5, color: 'rgba(255,255,255,0.7)', letterSpacing: 1.8, marginBottom: 7 },
  title: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 25, color: '#FFFFFF' },
  sub: { fontFamily: 'DMSans_400Regular', fontSize: 13, color: 'rgba(255,255,255,0.78)', marginTop: 6, lineHeight: 18 },
});
