import { View, ScrollView, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/Text';
import { PressableScale, Reveal } from '@/components/ui/Motion';
import { AppImageBackground } from '@/components/ui/AppImage';
import { Colors } from '@/constants/colors';
import { Img } from '@/constants/images';

const width = Platform.OS === 'web' ? 393 : Dimensions.get('window').width;
const CAT_W = (width - 20 * 2 - 10 * 2) / 3;

type IName = React.ComponentProps<typeof Ionicons>['name'];

const CATEGORIES: { label: string; icon: IName; bg: string; color: string }[] = [
  { label: 'Foundation', icon: 'layers-outline',   bg: Colors.blush,    color: Colors.brand.plum },
  { label: 'Concealer',  icon: 'contrast-outline',  bg: '#FBF1E6',       color: '#8B6A4F' },
  { label: 'Blush',      icon: 'flower-outline',    bg: '#FFF0EE',       color: '#C0392B' },
  { label: 'Bronzer',    icon: 'sunny-outline',     bg: '#EAF7EF',       color: '#2F7D52' },
  { label: 'Lip',        icon: 'heart-outline',     bg: '#EAF0FB',       color: '#3B5BDB' },
  { label: 'Powder',     icon: 'sparkles-outline',  bg: Colors.blush,    color: Colors.brand.plum },
];

const RECENT = [
  { name: 'Warm Ivory 2.0', brand: 'NARS', pct: '92%', color: '#E8C9A8' },
  { name: 'Honey Beige',    brand: 'Fenty', pct: '88%', color: '#D2A878' },
  { name: 'Golden Sand',    brand: 'MAC',   pct: '85%', color: '#C99B68' },
];

export default function MatchScreen() {
  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        <View style={s.header}>
          <View>
            <Text style={s.eyebrow}>SHADE MATCHING</Text>
            <Text style={s.title}>Find Your Tone</Text>
          </View>
          <PressableScale style={s.iconBtn} onPress={() => router.push('/(tabs)/profile/match-history' as any)}>
            <Ionicons name="time-outline" size={18} color={Colors.brand.plum} />
          </PressableScale>
        </View>

        {/* Selfie hero */}
        <Reveal delay={50}>
          <PressableScale scaleTo={0.985} onPress={() => router.push('/(tabs)/match/selfie')} style={s.heroPad}>
            <AppImageBackground uri={Img.matchHero} style={s.hero} imageStyle={s.heroImg}>
              <LinearGradient colors={['rgba(74,22,40,0.5)', 'rgba(45,15,26,0.92)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
              <View style={s.heroContent}>
                <Text style={s.heroEye}>RECOMMENDED</Text>
                <Text style={s.heroTitle}>Scan via selfie</Text>
                <Text style={s.heroSub}>Our AI reads your skin tone, undertone and surface colour for the most accurate match.</Text>
                <View style={s.heroBtn}>
                  <Ionicons name="camera-outline" size={13} color={Colors.brand.plum} />
                  <Text style={s.heroBtnText}>Take Selfie</Text>
                </View>
              </View>
            </AppImageBackground>
          </PressableScale>
        </Reveal>

        {/* Manual entry */}
        <Reveal delay={110}>
          <PressableScale onPress={() => router.push('/(tabs)/match/manual')} scaleTo={0.98} style={s.manualCard}>
            <View style={s.manualIcon}><Ionicons name="create-outline" size={18} color={Colors.text.secondary} /></View>
            <View style={{ flex: 1 }}>
              <Text style={s.manualTitle}>Enter shade manually</Text>
              <Text style={s.manualSub}>Already know your shade number?</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={Colors.text.muted} />
          </PressableScale>
        </Reveal>

        {/* Recent matches (content) */}
        <Reveal delay={160}>
          <View style={s.section}>
            <View style={s.rowBetween}>
              <Text style={s.sectionTitle}>Recent matches</Text>
              <TouchableOpacity hitSlop={8}><Text style={s.seeAll}>History</Text></TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.recentRow}>
              {RECENT.map(r => (
                <View key={r.name} style={s.recentCard}>
                  <View style={[s.recentSwatch, { backgroundColor: r.color }]} />
                  <Text style={s.recentName} numberOfLines={1}>{r.name}</Text>
                  <Text style={s.recentBrand}>{r.brand} · {r.pct}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </Reveal>

        {/* Categories */}
        <Reveal delay={210}>
          <View style={s.section}>
            <Text style={s.sectionTitle}>Browse by category</Text>
            <View style={s.catGrid}>
              {CATEGORIES.map(c => (
                <PressableScale key={c.label} onPress={() => router.push('/(tabs)/match/selfie')} style={[s.catCard, { width: CAT_W }]}>
                  <View style={[s.catIcon, { backgroundColor: c.bg }]}>
                    <Ionicons name={c.icon} size={18} color={c.color} />
                  </View>
                  <Text style={s.catLabel}>{c.label}</Text>
                </PressableScale>
              ))}
            </View>
          </View>
        </Reveal>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.ivory },
  scroll: { paddingBottom: 110 },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 14, paddingBottom: 14 },
  eyebrow: { fontFamily: 'DMSans_700Bold', fontSize: 10.5, color: Colors.brand.plum, letterSpacing: 1.4, marginBottom: 3 },
  title: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 21, color: Colors.text.primary },
  iconBtn: { width: 38, height: 38, borderRadius: 13, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', shadowColor: Colors.brand.plum, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 2 },

  heroPad: { paddingHorizontal: 20, marginBottom: 14 },
  hero: { minHeight: 200, borderRadius: 20, overflow: 'hidden', justifyContent: 'flex-end' },
  heroImg: { borderRadius: 20 },
  heroContent: { padding: 18, gap: 6 },
  heroEye: { fontFamily: 'DMSans_700Bold', fontSize: 9.5, color: 'rgba(255,255,255,0.55)', letterSpacing: 1.4 },
  heroTitle: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 18, color: '#FFFFFF' },
  heroSub: { fontFamily: 'DMSans_400Regular', fontSize: 11.5, color: 'rgba(255,255,255,0.7)', lineHeight: 16 },
  heroBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FFFFFF', borderRadius: 10, paddingHorizontal: 13, paddingVertical: 9, alignSelf: 'flex-start', marginTop: 6 },
  heroBtnText: { fontFamily: 'DMSans_700Bold', fontSize: 12, color: Colors.brand.plum },

  manualCard: { flexDirection: 'row', alignItems: 'center', gap: 12, marginHorizontal: 20, marginBottom: 22, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 13, shadowColor: Colors.brand.plum, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  manualIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.ivory, alignItems: 'center', justifyContent: 'center' },
  manualTitle: { fontFamily: 'DMSans_700Bold', fontSize: 13.5, color: Colors.text.primary },
  manualSub: { fontFamily: 'DMSans_400Regular', fontSize: 11.5, color: Colors.text.muted, marginTop: 1 },

  section: { paddingHorizontal: 20, marginBottom: 22 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 16, color: Colors.text.primary, marginBottom: 12 },
  seeAll: { fontFamily: 'DMSans_700Bold', fontSize: 11.5, color: Colors.brand.plum },

  recentRow: { gap: 10, paddingRight: 8 },
  recentCard: { width: 110, backgroundColor: '#FFFFFF', borderRadius: 14, padding: 11, shadowColor: Colors.brand.plum, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 1 },
  recentSwatch: { width: '100%', height: 44, borderRadius: 10, marginBottom: 8, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
  recentName: { fontFamily: 'DMSans_700Bold', fontSize: 12, color: Colors.text.primary },
  recentBrand: { fontFamily: 'DMSans_400Regular', fontSize: 10.5, color: Colors.text.muted, marginTop: 2 },

  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  catCard: { backgroundColor: '#FFFFFF', borderRadius: 16, paddingVertical: 14, alignItems: 'center', gap: 8, shadowColor: Colors.brand.plum, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 1 },
  catIcon: { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  catLabel: { fontFamily: 'DMSans_700Bold', fontSize: 11.5, color: Colors.text.primary },
});
