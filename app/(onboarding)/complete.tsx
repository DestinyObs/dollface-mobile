import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/Text';
import { PressableScale, Reveal } from '@/components/ui/Motion';
import { AppImage } from '@/components/ui/AppImage';
import { useBeautyProfileStore } from '@/lib/store/beautyProfileStore';
import { useAuthStore } from '@/lib/store/authStore';
import { beautyProfileApi } from '@/lib/data/endpoints';
import { Colors } from '@/constants/colors';
import { Img } from '@/constants/images';

type IName = React.ComponentProps<typeof Ionicons>['name'];

const HIGHLIGHTS: { icon: IName; title: string }[] = [
  { icon: 'color-palette-outline', title: 'Personalised shade matching for your tone' },
  { icon: 'book-outline',          title: 'Tutorials matched to your skill level' },
  { icon: 'sparkles-outline',      title: 'Look recreation built for your features' },
  { icon: 'bag-handle-outline',    title: 'Product picks within your budget' },
];

export default function OnboardingCompleteScreen() {
  const insets = useSafeAreaInsets();
  const { profile, setOnboardingComplete } = useBeautyProfileStore();
  const { user } = useAuthStore();

  const handleStart = async () => {
    try {
      await beautyProfileApi.upsert(profile);
      await beautyProfileApi.complete();
    } catch {}
    setOnboardingComplete(true);
    router.replace('/(tabs)');
  };

  return (
    <View style={s.root}>
      <AppImage uri={Img.heroLook} style={StyleSheet.absoluteFill as any} />
      <LinearGradient
        colors={['rgba(45,15,26,0.7)', 'rgba(45,15,26,0.97)']}
        style={StyleSheet.absoluteFill}
      />
      <View style={[s.content, { paddingTop: insets.top + 40, paddingBottom: Math.max(insets.bottom, 20) + 20 }]}>

        <Reveal delay={40} style={s.top}>
          <View style={s.check}>
            <Ionicons name="checkmark" size={36} color={Colors.brand.plum} />
          </View>
          <Text style={s.title}>You're all set{user?.name ? `,\n${user.name.split(' ')[0]}` : ''}</Text>
          <Text style={s.sub}>DollFace has everything it needs to personalise your experience. Your beauty journey starts now.</Text>
        </Reveal>

        <Reveal delay={160} style={s.card}>
          {HIGHLIGHTS.map(h => (
            <View key={h.title} style={s.row}>
              <View style={s.rowIcon}>
                <Ionicons name={h.icon} size={16} color="#FFFFFF" />
              </View>
              <Text style={s.rowText}>{h.title}</Text>
            </View>
          ))}
        </Reveal>

        <PressableScale style={s.cta} onPress={handleStart}>
          <Text style={s.ctaText}>Start My Journey</Text>
          <Ionicons name="arrow-forward" size={16} color={Colors.brand.plum} />
        </PressableScale>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, width: '100%', backgroundColor: Colors.brand.plum },
  content: { flex: 1, paddingHorizontal: 28, justifyContent: 'space-between' },

  top: { alignItems: 'center', marginTop: 24 },
  check: {
    width: 84, height: 84, borderRadius: 999, backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center', marginBottom: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 8,
  },
  title: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 28, color: '#FFFFFF', textAlign: 'center', lineHeight: 34 },
  sub: { fontFamily: 'DMSans_400Regular', fontSize: 14.5, color: 'rgba(255,255,255,0.8)', textAlign: 'center', lineHeight: 21, marginTop: 14, paddingHorizontal: 8 },

  card: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 22, padding: 20, gap: 16 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  rowIcon: { width: 34, height: 34, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  rowText: { flex: 1, fontFamily: 'DMSans_500Medium', fontSize: 13.5, color: 'rgba(255,255,255,0.92)' },

  cta: {
    height: 58, borderRadius: 16, backgroundColor: '#FFFFFF',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  ctaText: { fontFamily: 'DMSans_700Bold', fontSize: 16, color: Colors.brand.plum },
});
