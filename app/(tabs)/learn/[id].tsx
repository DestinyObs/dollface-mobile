import { View, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/Text';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { PressableScale, Reveal } from '@/components/ui/Motion';
import { AppImageBackground } from '@/components/ui/AppImage';
import { useSavedStore } from '@/lib/store/savedStore';
import { toast } from '@/lib/store/toastStore';
import { Colors } from '@/constants/colors';
import { Img } from '@/constants/images';

const TUTORIAL = {
  title: 'Beginner Foundation Routine',
  level: 'Beginner',
  duration: '12 min',
  views: '24k',
  description: 'A step-by-step guide to applying foundation that looks natural, lasts all day, and works for your skin tone and type.',
  steps: [
    { title: 'Prep your skin', description: 'Start with clean, moisturised skin. Apply a primer suited for your skin type — mattifying for oily, hydrating for dry.', tip: 'Wait 2 minutes after primer before applying foundation.' },
    { title: 'Choose your tool', description: 'A damp beauty sponge gives the most natural finish. A brush builds more coverage. Fingers give a sheer, skin-like look.', tip: 'Always dampen your sponge so it doesn\'t absorb the product.' },
    { title: 'Apply foundation', description: 'Start at the centre of your face and blend outward with gentle pressing motions, not dragging.', tip: 'Less is more — build up in thin layers.' },
    { title: 'Blend the edges', description: 'Check your jawline, hairline and neck. Blend until there are no visible lines.', tip: 'Use a clean sponge edge to soften harsh lines.' },
  ],
};

export default function TutorialDetailScreen() {
  const toggleSaved = useSavedStore(s => s.toggle);
  const saved = useSavedStore(s => s.isSaved('tutorials', TUTORIAL.title));

  const onSave = () => {
    const now = toggleSaved('tutorials', { id: TUTORIAL.title, title: TUTORIAL.title, subtitle: `${TUTORIAL.level} · ${TUTORIAL.duration}`, img: Img.tutorials.foundation });
    toast.success(now ? 'Tutorial saved' : 'Removed from saved');
  };

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <ScreenHeader rightIcon={saved ? 'bookmark' : 'bookmark-outline'} onRightPress={onSave} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        <Reveal delay={40} style={s.heroPad}>
          <AppImageBackground uri={Img.tutorials.foundation} style={s.hero} imageStyle={s.heroImg}>
            <LinearGradient colors={['rgba(45,15,26,0.15)', 'rgba(45,15,26,0.85)']} style={StyleSheet.absoluteFill} />
            <View style={s.playWrap}><View style={s.play}><Ionicons name="play" size={22} color={Colors.brand.plum} /></View></View>
            <View style={s.heroBottom}>
              <View style={s.badgeRow}>
                <View style={[s.badge, { backgroundColor: '#EAF7EF' }]}><Text style={[s.badgeText, { color: '#2F7D52' }]}>{TUTORIAL.level}</Text></View>
                <View style={s.metaPill}><Ionicons name="time-outline" size={11} color="#FFFFFF" /><Text style={s.metaText}>{TUTORIAL.duration}</Text></View>
                <View style={s.metaPill}><Ionicons name="eye-outline" size={11} color="#FFFFFF" /><Text style={s.metaText}>{TUTORIAL.views}</Text></View>
              </View>
              <Text style={s.heroTitle}>{TUTORIAL.title}</Text>
            </View>
          </AppImageBackground>
        </Reveal>

        <Reveal delay={100}>
          <Text style={s.desc}>{TUTORIAL.description}</Text>
        </Reveal>

        <View style={s.section}>
          <Text style={s.sectionTitle}>Steps</Text>
          {TUTORIAL.steps.map((step, i) => (
            <Reveal key={step.title} delay={140 + i * 60}>
              <View style={s.stepCard}>
                <View style={s.stepHead}>
                  <View style={s.stepNum}><Text style={s.stepNumText}>{i + 1}</Text></View>
                  <Text style={s.stepTitle}>{step.title}</Text>
                </View>
                <Text style={s.stepDesc}>{step.description}</Text>
                <View style={s.tip}>
                  <Ionicons name="bulb-outline" size={14} color={Colors.brand.plum} />
                  <Text style={s.tipText}>{step.tip}</Text>
                </View>
              </View>
            </Reveal>
          ))}
        </View>
      </ScrollView>

      <View style={s.footer}>
        <PressableScale style={s.cta} onPress={() => { toast.success('Marked as complete · nice work!'); router.back(); }}>
          <Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF" />
          <Text style={s.ctaText}>Mark as Complete</Text>
        </PressableScale>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.ivory },
  scroll: { paddingBottom: 24 },

  heroPad: { paddingHorizontal: 20, marginTop: 4, marginBottom: 18 },
  hero: { height: 210, borderRadius: 22, overflow: 'hidden', justifyContent: 'flex-end' },
  heroImg: { borderRadius: 22 },
  playWrap: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  play: { width: 54, height: 54, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.95)', alignItems: 'center', justifyContent: 'center', paddingLeft: 3 },
  heroBottom: { padding: 16, gap: 8 },
  badgeRow: { flexDirection: 'row', gap: 7, alignItems: 'center' },
  badge: { borderRadius: 999, paddingHorizontal: 9, paddingVertical: 4 },
  badgeText: { fontFamily: 'DMSans_700Bold', fontSize: 10 },
  metaPill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 4 },
  metaText: { fontFamily: 'DMSans_700Bold', fontSize: 10, color: '#FFFFFF' },
  heroTitle: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 20, color: '#FFFFFF', lineHeight: 25 },

  desc: { fontFamily: 'DMSans_400Regular', fontSize: 13.5, color: Colors.text.secondary, lineHeight: 20, paddingHorizontal: 20, marginBottom: 22 },

  section: { paddingHorizontal: 20 },
  sectionTitle: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 16, color: Colors.text.primary, marginBottom: 14 },
  stepCard: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 16, marginBottom: 12, gap: 10, shadowColor: Colors.brand.plum, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  stepHead: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  stepNum: { width: 28, height: 28, borderRadius: 999, backgroundColor: Colors.brand.plum, alignItems: 'center', justifyContent: 'center' },
  stepNumText: { fontFamily: 'DMSans_700Bold', fontSize: 12.5, color: '#FFFFFF' },
  stepTitle: { fontFamily: 'DMSans_700Bold', fontSize: 14.5, color: Colors.text.primary, flex: 1 },
  stepDesc: { fontFamily: 'DMSans_400Regular', fontSize: 12.5, color: Colors.text.secondary, lineHeight: 19 },
  tip: { flexDirection: 'row', gap: 8, backgroundColor: Colors.blush, borderRadius: 12, padding: 11, alignItems: 'flex-start' },
  tipText: { flex: 1, fontFamily: 'DMSans_500Medium', fontSize: 12, color: Colors.brand.plum, lineHeight: 17 },

  footer: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 14, backgroundColor: Colors.ivory, borderTopWidth: 1, borderTopColor: Colors.border.light },
  cta: { height: 52, borderRadius: 15, backgroundColor: Colors.brand.plum, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  ctaText: { fontFamily: 'DMSans_700Bold', fontSize: 15, color: '#FFFFFF' },
});
