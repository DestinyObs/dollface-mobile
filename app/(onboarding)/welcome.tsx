import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Text } from '@/components/ui/Text';
import { PressableScale, Reveal } from '@/components/ui/Motion';
import { Colors } from '@/constants/colors';

type IName = React.ComponentProps<typeof Ionicons>['name'];

const PERKS: { icon: IName; title: string; body: string }[] = [
  { icon: 'color-palette-outline', title: 'Shades matched to you', body: 'Foundation, concealer & more tuned to your skin tone.' },
  { icon: 'sparkles-outline', title: 'Looks you can actually do', body: 'Tutorials adapted to your skill level and features.' },
  { icon: 'bag-handle-outline', title: 'Smarter shopping', body: 'Only see products that suit your undertone and budget.' },
];

export default function OnboardingWelcomeScreen() {
  const start = () => {
    Haptics.selectionAsync().catch(() => {});
    router.replace('/(onboarding)/beauty-goals');
  };

  return (
    <View style={s.root}>
      <LinearGradient colors={['#2D0F1A', Colors.brand.plum]} style={s.hero}>
        <SafeAreaView edges={['top']}>
          <Reveal>
            <View style={s.heroInner}>
              <View style={s.badge}><Ionicons name="sparkles" size={26} color="#FFFFFF" /></View>
              <Text style={s.eyebrow}>WELCOME TO DOLLFACE</Text>
              <Text style={s.heroTitle}>Let's make it{'\n'}yours</Text>
              <Text style={s.heroSub}>A few quick questions so every shade, look and tip is personalised to you. Takes about a minute.</Text>
            </View>
          </Reveal>
        </SafeAreaView>
      </LinearGradient>

      <SafeAreaView style={s.sheet} edges={['bottom']}>
        <View style={s.perks}>
          {PERKS.map((p, i) => (
            <Reveal key={p.title} delay={120 + i * 80}>
              <View style={s.perkRow}>
                <View style={s.perkIcon}><Ionicons name={p.icon} size={20} color={Colors.brand.plum} /></View>
                <View style={{ flex: 1 }}>
                  <Text style={s.perkTitle}>{p.title}</Text>
                  <Text style={s.perkBody}>{p.body}</Text>
                </View>
              </View>
            </Reveal>
          ))}
        </View>

        <View style={s.cta}>
          <PressableScale style={s.primaryBtn} onPress={start}>
            <Text style={s.primaryText}>Personalise my beauty</Text>
            <Ionicons name="arrow-forward" size={17} color="#FFFFFF" />
          </PressableScale>
          <Text style={s.skip} onPress={() => router.replace('/(tabs)')}>I'll do this later</Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.ivory },
  hero: { paddingHorizontal: 28, paddingBottom: 38, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  heroInner: { paddingTop: 24, gap: 6 },
  badge: { width: 56, height: 56, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.14)', alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  eyebrow: { fontFamily: 'DMSans_700Bold', fontSize: 11, color: 'rgba(255,255,255,0.7)', letterSpacing: 1.6 },
  heroTitle: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 40, color: '#FFFFFF', lineHeight: 44, marginTop: 4 },
  heroSub: { fontFamily: 'DMSans_400Regular', fontSize: 14.5, color: 'rgba(255,255,255,0.8)', lineHeight: 21, marginTop: 12 },

  sheet: { flex: 1, justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: 28 },
  perks: { gap: 18 },
  perkRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  perkIcon: { width: 48, height: 48, borderRadius: 15, backgroundColor: Colors.blush, alignItems: 'center', justifyContent: 'center' },
  perkTitle: { fontFamily: 'DMSans_700Bold', fontSize: 15, color: Colors.text.primary, marginBottom: 2 },
  perkBody: { fontFamily: 'DMSans_400Regular', fontSize: 13, color: Colors.text.muted, lineHeight: 18 },

  cta: { paddingBottom: 8, gap: 14 },
  primaryBtn: {
    height: 56, borderRadius: 16, backgroundColor: Colors.brand.plum,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    shadowColor: Colors.brand.plum, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.25, shadowRadius: 14, elevation: 5,
  },
  primaryText: { fontFamily: 'DMSans_700Bold', fontSize: 15.5, color: '#FFFFFF' },
  skip: { fontFamily: 'DMSans_700Bold', fontSize: 13.5, color: Colors.text.muted, textAlign: 'center' },
});
