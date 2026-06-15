import { View, ScrollView, StyleSheet, Dimensions, Platform } from 'react-native';
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
const STEP_W = (width - 20 * 2 - 10 * 2) / 3;

type IName = React.ComponentProps<typeof Ionicons>['name'];

const FEATURES: { icon: IName; label: string; desc: string; bg: string; color: string }[] = [
  { icon: 'sparkles-outline', label: 'Base & Foundation', desc: 'Coverage, finish & skin prep',      bg: Colors.blush, color: Colors.brand.plum },
  { icon: 'pencil-outline',   label: 'Brows',             desc: 'Shape, thickness & technique',        bg: '#FBF1E6',    color: '#A06A2C' },
  { icon: 'eye-outline',      label: 'Eye Makeup',        desc: 'Shadow, liner & lashes',              bg: '#EAF0FB',    color: '#3B5BDB' },
  { icon: 'flower-outline',   label: 'Cheeks',            desc: 'Blush, bronzer & highlight',          bg: '#FFF0EE',    color: '#C0392B' },
  { icon: 'heart-outline',    label: 'Lips',              desc: 'Shape, liner & colour',               bg: '#EAF7EF',    color: '#2D6A4F' },
];

const STEPS: { icon: IName; label: string }[] = [
  { icon: 'cloud-upload-outline', label: 'Upload' },
  { icon: 'scan-outline',         label: 'Analyse' },
  { icon: 'list-outline',         label: 'Steps' },
];

export default function RecreateScreen() {
  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        <View style={s.header}>
          <View>
            <Text style={s.eyebrow}>AI RECREATION</Text>
            <Text style={s.title}>Recreate a Look</Text>
          </View>
        </View>

        {/* Upload hero */}
        <Reveal delay={50}>
          <PressableScale scaleTo={0.985} onPress={() => router.push('/(tabs)/recreate/upload')} style={s.heroPad}>
            <AppImageBackground uri={Img.heroLook} style={s.hero} imageStyle={s.heroImg}>
              <LinearGradient colors={['rgba(45,15,26,0.35)', 'rgba(45,15,26,0.92)']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={StyleSheet.absoluteFill} />
              <View style={s.heroContent}>
                <View style={s.heroIcon}><Ionicons name="camera-outline" size={22} color="#FFFFFF" /></View>
                <Text style={s.heroTitle}>Upload your inspiration</Text>
                <Text style={s.heroSub}>Screenshot from TikTok, Instagram or Pinterest — we'll build a version for your face.</Text>
                <View style={s.heroBtn}>
                  <Ionicons name="cloud-upload-outline" size={14} color={Colors.brand.plum} />
                  <Text style={s.heroBtnText}>Upload Image</Text>
                </View>
              </View>
            </AppImageBackground>
          </PressableScale>
        </Reveal>

        {/* How it works */}
        <Reveal delay={110}>
          <View style={s.section}>
            <Text style={s.sectionTitle}>How it works</Text>
            <View style={s.stepsRow}>
              {STEPS.map((st, i) => (
                <View key={st.label} style={[s.stepCard, { width: STEP_W }]}>
                  <View style={s.stepNum}><Text style={s.stepNumText}>{i + 1}</Text></View>
                  <Ionicons name={st.icon} size={20} color={Colors.brand.plum} />
                  <Text style={s.stepLabel}>{st.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </Reveal>

        {/* What we analyse */}
        <Reveal delay={160}>
          <View style={s.section}>
            <Text style={s.sectionTitle}>What we analyse</Text>
            {FEATURES.map(f => (
              <View key={f.label} style={s.featureRow}>
                <View style={[s.featureIcon, { backgroundColor: f.bg }]}>
                  <Ionicons name={f.icon} size={18} color={f.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.featureLabel}>{f.label}</Text>
                  <Text style={s.featureDesc}>{f.desc}</Text>
                </View>
                <Ionicons name="checkmark-circle" size={18} color={Colors.rose} />
              </View>
            ))}
          </View>
        </Reveal>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.ivory },
  scroll: { paddingBottom: 110 },

  header: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 8 },
  eyebrow: { fontFamily: 'DMSans_700Bold', fontSize: 10.5, color: Colors.brand.plum, letterSpacing: 1.4, marginBottom: 3 },
  title: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 21, color: Colors.text.primary },

  heroPad: { paddingHorizontal: 20, marginTop: 8, marginBottom: 22 },
  hero: { minHeight: 224, borderRadius: 22, overflow: 'hidden', justifyContent: 'flex-end' },
  heroImg: { borderRadius: 22 },
  heroContent: { padding: 18, gap: 7 },
  heroIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center', marginBottom: 2 },
  heroTitle: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 18, color: '#FFFFFF' },
  heroSub: { fontFamily: 'DMSans_400Regular', fontSize: 11.5, color: 'rgba(255,255,255,0.72)', lineHeight: 16 },
  heroBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, backgroundColor: '#FFFFFF', borderRadius: 11, paddingVertical: 11, marginTop: 6 },
  heroBtnText: { fontFamily: 'DMSans_700Bold', fontSize: 13, color: Colors.brand.plum },

  section: { paddingHorizontal: 20, marginBottom: 22 },
  sectionTitle: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 16, color: Colors.text.primary, marginBottom: 12 },

  stepsRow: { flexDirection: 'row', gap: 10 },
  stepCard: { backgroundColor: '#FFFFFF', borderRadius: 16, paddingVertical: 16, alignItems: 'center', gap: 8, shadowColor: Colors.brand.plum, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 1 },
  stepNum: { position: 'absolute', top: 8, right: 8, width: 18, height: 18, borderRadius: 999, backgroundColor: Colors.blush, alignItems: 'center', justifyContent: 'center' },
  stepNumText: { fontFamily: 'DMSans_700Bold', fontSize: 9.5, color: Colors.brand.plum },
  stepLabel: { fontFamily: 'DMSans_700Bold', fontSize: 11.5, color: Colors.text.primary },

  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FFFFFF', borderRadius: 14, padding: 11, marginBottom: 9, shadowColor: Colors.brand.plum, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 1 },
  featureIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  featureLabel: { fontFamily: 'DMSans_700Bold', fontSize: 13, color: Colors.text.primary },
  featureDesc: { fontFamily: 'DMSans_400Regular', fontSize: 11, color: Colors.text.muted, marginTop: 1 },
});
