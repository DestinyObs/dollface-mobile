import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/Text';
import { PressableScale } from '@/components/ui/Motion';
import { AppImage } from '@/components/ui/AppImage';
import { Colors } from '@/constants/colors';
import { Img } from '@/constants/images';

const FEATURES: { icon: React.ComponentProps<typeof Ionicons>['name']; label: string }[] = [
  { icon: 'color-palette-outline', label: 'Shade Match' },
  { icon: 'sparkles-outline',      label: 'Recreate' },
  { icon: 'book-outline',          label: 'Learn' },
];

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={s.root}>
      {/* Background photo (absolute fill — never affects content width) */}
      <AppImage uri={Img.heroLook} style={StyleSheet.absoluteFill as any} />
      <LinearGradient
        colors={['rgba(30,8,16,0.55)', 'rgba(30,8,16,0.18)', 'rgba(30,8,16,0.7)', 'rgba(18,5,10,0.97)']}
        locations={[0, 0.34, 0.64, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Content */}
      <View style={[s.content, { paddingTop: insets.top + 18, paddingBottom: Math.max(insets.bottom, 16) + 18 }]}>
        {/* Brand */}
        <View style={s.brandRow}>
          <View style={s.monogram}><View style={s.monoMark} /></View>
          <Text style={s.brandWord}>DOLLFACE</Text>
        </View>

        {/* Bottom block */}
        <View style={s.bottom}>
          <View style={s.pillsRow}>
            {FEATURES.map(f => (
              <View key={f.label} style={s.pill}>
                <Ionicons name={f.icon} size={13} color="#FFFFFF" />
                <Text style={s.pillText}>{f.label}</Text>
              </View>
            ))}
          </View>

          <Text style={s.headline}>Beauty,</Text>
          <Text style={s.headlineAccent}>personalised</Text>
          <Text style={s.headline}>for you.</Text>

          <Text style={s.sub}>AI shade matching, look recreation and tutorials — all tuned to your features.</Text>

          <PressableScale style={s.primaryBtn} onPress={() => router.push('/(auth)/register')}>
            <Text style={s.primaryBtnText}>Get Started</Text>
            <Ionicons name="arrow-forward" size={16} color={Colors.brand.plum} />
          </PressableScale>

          <TouchableOpacity style={s.secondaryBtn} onPress={() => router.push('/(auth)/login')} activeOpacity={0.75}>
            <Text style={s.secondaryBtnText}>Already have an account? </Text>
            <Text style={s.secondaryBtnLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, width: '100%', backgroundColor: '#14050b' },

  content: { flex: 1, width: '100%', paddingHorizontal: 22, justifyContent: 'space-between' },

  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  monogram: {
    width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)',
  },
  monoMark: { width: 12, height: 12, borderRadius: 3, backgroundColor: '#FFFFFF', transform: [{ rotate: '45deg' }] },
  brandWord: { fontFamily: 'DMSans_700Bold', fontSize: 13, color: '#FFFFFF', letterSpacing: 2.5 },

  bottom: { width: '100%' },

  pillsRow: { flexDirection: 'row', gap: 7, marginBottom: 18 },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(255,255,255,0.14)', borderRadius: 999,
    paddingHorizontal: 11, paddingVertical: 7,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)',
  },
  pillText: { fontFamily: 'DMSans_500Medium', fontSize: 11.5, color: '#FFFFFF' },

  headline: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 32, color: '#FFFFFF', lineHeight: 37 },
  headlineAccent: { fontFamily: 'PlayfairDisplay_400Regular', fontStyle: 'italic', fontSize: 32, lineHeight: 37, color: Colors.rose },
  sub: { fontFamily: 'DMSans_400Regular', fontSize: 13.5, color: 'rgba(255,255,255,0.72)', lineHeight: 20, marginTop: 14, marginBottom: 22 },

  primaryBtn: {
    height: 56, borderRadius: 16, backgroundColor: '#FFFFFF',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 8,
  },
  primaryBtnText: { fontFamily: 'DMSans_700Bold', fontSize: 15.5, color: Colors.brand.plum, letterSpacing: 0.3 },
  secondaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14 },
  secondaryBtnText: { fontFamily: 'DMSans_400Regular', fontSize: 14, color: 'rgba(255,255,255,0.7)' },
  secondaryBtnLink: { fontFamily: 'DMSans_700Bold', fontSize: 14, color: '#FFFFFF' },
});
