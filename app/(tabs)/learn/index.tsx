import { useState } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/Text';
import { PressableScale, Reveal } from '@/components/ui/Motion';
import { AppImage, AppImageBackground } from '@/components/ui/AppImage';
import { toast } from '@/lib/store/toastStore';
import { useTutorials, useFeaturedTutorial, useTutorialCategories } from '@/lib/data/hooks';
import { Colors } from '@/constants/colors';
import { Img } from '@/constants/images';

const LEVEL: Record<string, { bg: string; text: string }> = {
  Beginner:     { bg: '#EAF7EF', text: '#2F7D52' },
  Intermediate: { bg: '#FBF1E6', text: '#A06A2C' },
  Advanced:     { bg: Colors.blush, text: Colors.brand.plum },
};

export default function LearnScreen() {
  const [cat, setCat] = useState('All');
  const { data: categories = [] } = useTutorialCategories();
  const { data: tutorials = [] } = useTutorials({ category: cat });
  const { data: featured } = useFeaturedTutorial();

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <View style={s.header}>
        <View>
          <Text style={s.eyebrow}>TUTORIALS</Text>
          <Text style={s.title}>Learn</Text>
        </View>
        <PressableScale style={s.iconBtn} onPress={() => toast.info('Search coming soon')}>
          <Ionicons name="search-outline" size={18} color={Colors.text.secondary} />
        </PressableScale>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        {/* Featured */}
        <Reveal delay={50}>
          <PressableScale scaleTo={0.985} onPress={() => router.push(`/(tabs)/learn/${featured?.id ?? '1'}` as any)} style={s.featuredPad}>
            <AppImageBackground uri={featured?.img ?? Img.heroLook} style={s.featured} imageStyle={s.featuredImg}>
              <LinearGradient colors={['rgba(45,15,26,0.4)', 'rgba(45,15,26,0.9)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
              <View style={s.featuredText}>
                <Text style={s.featuredEyebrow}>{featured?.eyebrow ?? "THIS WEEK'S PICK"}</Text>
                <Text style={s.featuredTitle}>{featured?.title ?? 'Shade Matching Masterclass'}</Text>
                <Text style={s.featuredMeta}>{featured?.meta ?? 'AI-guided · All levels · 20 min'}</Text>
                <View style={s.featuredBtn}>
                  <Ionicons name="play" size={11} color={Colors.brand.plum} />
                  <Text style={s.featuredBtnText}>Watch Now</Text>
                </View>
              </View>
            </AppImageBackground>
          </PressableScale>
        </Reveal>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.catsScroll} style={s.cats}>
          {categories.map((c) => {
            const active = c === cat;
            return (
              <TouchableOpacity key={c} onPress={() => setCat(c)} style={[s.catChip, active && s.catActive]} activeOpacity={0.8}>
                <Text style={[s.catText, { color: active ? '#FFFFFF' : Colors.text.secondary }]}>{c}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Tutorial list */}
        <View style={s.listPad}>
          <Text style={s.listEye}>FOR YOU</Text>
          {tutorials.map((t, i) => (
            <Reveal key={t.id} delay={110 + i * 60}>
              <PressableScale onPress={() => router.push(`/(tabs)/learn/${t.id}` as any)} scaleTo={0.985} style={s.card}>
                <View>
                  <AppImage uri={t.img} style={s.cardThumb} />
                  <View style={s.playBadge}><Ionicons name="play" size={11} color="#FFFFFF" /></View>
                </View>
                <View style={s.cardContent}>
                  <Text style={s.cardTitle} numberOfLines={2}>{t.title}</Text>
                  <View style={s.cardMetaRow}>
                    <View style={[s.levelBadge, { backgroundColor: LEVEL[t.level].bg }]}>
                      <Text style={[s.levelText, { color: LEVEL[t.level].text }]}>{t.level}</Text>
                    </View>
                    <Text style={s.cardMeta}>{t.mins}</Text>
                    <View style={s.dot} />
                    <Ionicons name="eye-outline" size={11} color={Colors.text.muted} />
                    <Text style={s.cardMeta}>{t.views}</Text>
                  </View>
                </View>
              </PressableScale>
            </Reveal>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.ivory },
  scroll: { paddingBottom: 110 },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 14, paddingBottom: 10 },
  eyebrow: { fontFamily: 'DMSans_700Bold', fontSize: 10.5, color: Colors.brand.plum, letterSpacing: 1.4, marginBottom: 3 },
  title: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 21, color: Colors.text.primary },
  iconBtn: { width: 38, height: 38, borderRadius: 13, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', shadowColor: Colors.brand.plum, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 2 },

  featuredPad: { paddingHorizontal: 20, marginTop: 12, marginBottom: 16 },
  featured: { minHeight: 168, borderRadius: 20, overflow: 'hidden', justifyContent: 'flex-end' },
  featuredImg: { borderRadius: 20 },
  featuredText: { padding: 18, gap: 6 },
  featuredEyebrow: { fontFamily: 'DMSans_700Bold', fontSize: 9.5, color: 'rgba(255,255,255,0.55)', letterSpacing: 1.4 },
  featuredTitle: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 17, color: '#FFFFFF' },
  featuredMeta: { fontFamily: 'DMSans_400Regular', fontSize: 11, color: 'rgba(255,255,255,0.6)' },
  featuredBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FFFFFF', borderRadius: 10, paddingHorizontal: 13, paddingVertical: 8, alignSelf: 'flex-start', marginTop: 4 },
  featuredBtnText: { fontFamily: 'DMSans_700Bold', fontSize: 11.5, color: Colors.brand.plum },

  cats: { marginBottom: 6 },
  catsScroll: { paddingHorizontal: 20, gap: 8 },
  catChip: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 999, backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: Colors.border.light },
  catActive: { backgroundColor: Colors.brand.plum, borderColor: Colors.brand.plum },
  catText: { fontFamily: 'DMSans_700Bold', fontSize: 12 },

  listPad: { paddingHorizontal: 20, paddingTop: 8 },
  listEye: { fontFamily: 'DMSans_700Bold', fontSize: 10.5, color: Colors.text.muted, letterSpacing: 1.4, marginBottom: 12 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 10, marginBottom: 10, shadowColor: Colors.brand.plum, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  cardThumb: { width: 64, height: 64, borderRadius: 13 },
  playBadge: { position: 'absolute', bottom: 5, right: 5, width: 22, height: 22, borderRadius: 999, backgroundColor: 'rgba(45,15,26,0.7)', alignItems: 'center', justifyContent: 'center' },
  cardContent: { flex: 1, gap: 6 },
  cardTitle: { fontFamily: 'DMSans_700Bold', fontSize: 13.5, color: Colors.text.primary, lineHeight: 18 },
  cardMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  levelBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 999 },
  levelText: { fontFamily: 'DMSans_700Bold', fontSize: 9.5 },
  cardMeta: { fontFamily: 'DMSans_400Regular', fontSize: 11, color: Colors.text.muted },
  dot: { width: 3, height: 3, borderRadius: 2, backgroundColor: Colors.border.default },
});
