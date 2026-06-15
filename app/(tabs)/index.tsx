import {
  View, ScrollView, TouchableOpacity,
  StyleSheet, Dimensions, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/Text';
import { PressableScale, Reveal } from '@/components/ui/Motion';
import { AppImage, AppImageBackground } from '@/components/ui/AppImage';
import { useAuthStore } from '@/lib/store/authStore';
import { useNotificationStore } from '@/lib/store/notificationStore';
import { Colors } from '@/constants/colors';
import { Img } from '@/constants/images';

const width = Platform.OS === 'web' ? 393 : Dimensions.get('window').width;
const ACTION_W = (width - 20 * 2 - 10 * 3) / 4;
const LOOK_W = 128;

type IName = React.ComponentProps<typeof Ionicons>['name'];

const ACTIONS: { icon: IName; label: string; route: string; color: string; bg: string }[] = [
  { icon: 'color-palette', label: 'Match',    route: '/(tabs)/match',    color: Colors.brand.plum, bg: Colors.blush },
  { icon: 'sparkles',      label: 'Recreate', route: '/(tabs)/recreate', color: '#3B5BDB',         bg: '#EAF0FB' },
  { icon: 'book',          label: 'Learn',    route: '/(tabs)/learn',    color: '#2F7D52',         bg: '#EAF7EF' },
  { icon: 'bag-handle',    label: 'Shop',     route: '/product',         color: '#A06A2C',         bg: '#FBF1E6' },
];

const LOOKS = [
  { label: 'Soft Glam',  meta: '2.4k saves', level: 'Easy',   img: Img.looks.softGlam },
  { label: 'Glass Skin', meta: '1.9k saves', level: 'Medium', img: Img.looks.glassSkin },
  { label: 'Bold Lip',   meta: '3.1k saves', level: 'Easy',   img: Img.looks.boldLip },
  { label: 'Bronzed',    meta: '1.2k saves', level: 'Medium', img: Img.looks.bronzed },
];

const COURSES = [
  { title: 'Foundation Basics',   meta: '8 min left',  pct: 60, img: Img.tutorials.foundation },
  { title: 'Winged Liner Master', meta: '12 min left', pct: 25, img: Img.tutorials.smokyEye },
];

const LEVEL_COLOR: Record<string, string> = { Easy: '#2F7D52', Medium: '#A06A2C', Hard: Colors.brand.plum };

export default function HomeScreen() {
  const user = useAuthStore(s => s.user);
  const name = user?.name?.split(' ')[0] ?? 'Lovely';
  const unread = useNotificationStore(s => s.notifications.filter(n => !n.read).length);

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* ── Header ── */}
        <Reveal delay={0}>
          <View style={s.header}>
            <View style={{ flex: 1 }}>
              <Text style={s.greeting}>GOOD MORNING</Text>
              <Text style={s.name}>{name}</Text>
            </View>
            <View style={s.streak}>
              <Ionicons name="flame" size={13} color="#E8743B" />
              <Text style={s.streakText}>12</Text>
            </View>
            <PressableScale onPress={() => router.push('/notifications')} style={s.bellBtn}>
              <Ionicons name="notifications-outline" size={18} color={Colors.brand.plum} />
              {unread > 0 ? <View style={s.bellDot} /> : null}
            </PressableScale>
          </View>
        </Reveal>

        {/* ── Your shade (creative content) ── */}
        <Reveal delay={70}>
          <PressableScale scaleTo={0.99} onPress={() => router.push('/(tabs)/match')} style={s.shadeCard}>
            <View style={s.swatch} />
            <View style={{ flex: 1 }}>
              <Text style={s.shadeEye}>YOUR MATCHED SHADE</Text>
              <Text style={s.shadeName}>Warm Ivory 2.0</Text>
              <Text style={s.shadeMeta}>NARS Light Reflecting · 92% match</Text>
            </View>
            <View style={s.shadePct}><Text style={s.shadePctText}>92%</Text></View>
          </PressableScale>
        </Reveal>

        {/* ── Quick actions (compact row) ── */}
        <Reveal delay={130}>
          <View style={s.actionsRow}>
            {ACTIONS.map(a => (
              <PressableScale key={a.label} onPress={() => router.push(a.route as any)} style={[s.action, { width: ACTION_W }]}>
                <View style={[s.actionIcon, { backgroundColor: a.bg }]}>
                  <Ionicons name={a.icon} size={19} color={a.color} />
                </View>
                <Text style={s.actionLabel}>{a.label}</Text>
              </PressableScale>
            ))}
          </View>
        </Reveal>

        {/* ── Editorial hero ── */}
        <Reveal delay={190}>
          <View style={s.heroPad}>
            <PressableScale scaleTo={0.985} onPress={() => router.push('/(tabs)/match')}>
              <AppImageBackground uri={Img.heroLook} style={s.hero} imageStyle={s.heroImg}>
                <LinearGradient colors={['rgba(30,10,18,0.05)', 'rgba(30,10,18,0.82)']} style={StyleSheet.absoluteFill} />
                <View style={s.heroContent}>
                  <View style={s.heroBadge}>
                    <Ionicons name="sparkles" size={10} color={Colors.brand.plum} />
                    <Text style={s.heroBadgeText}>AI SHADE MATCH</Text>
                  </View>
                  <Text style={s.heroTitle}>Find your perfect shade in 60 seconds</Text>
                  <View style={s.heroBtn}>
                    <Text style={s.heroBtnText}>Start your match</Text>
                    <Ionicons name="arrow-forward" size={13} color={Colors.brand.plum} />
                  </View>
                </View>
              </AppImageBackground>
            </PressableScale>
          </View>
        </Reveal>

        {/* ── Trending Looks ── */}
        <Reveal delay={250}>
          <View style={s.section}>
            <View style={s.rowBetween}>
              <Text style={s.sectionTitle}>Trending looks</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/recreate')} hitSlop={8}>
                <Text style={s.seeAll}>See all</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.looksRow}>
              {LOOKS.map(l => (
                <PressableScale key={l.label} onPress={() => router.push('/(tabs)/recreate')} scaleTo={0.97} style={s.lookItem}>
                  <AppImageBackground uri={l.img} style={s.lookThumb} imageStyle={s.lookImg}>
                    <View style={[s.levelTag, { backgroundColor: LEVEL_COLOR[l.level] }]}>
                      <Text style={s.levelTagText}>{l.level}</Text>
                    </View>
                  </AppImageBackground>
                  <Text style={s.lookLabel}>{l.label}</Text>
                  <View style={s.lookMetaRow}>
                    <Ionicons name="heart" size={10} color={Colors.text.muted} />
                    <Text style={s.lookSub}>{l.meta}</Text>
                  </View>
                </PressableScale>
              ))}
            </ScrollView>
          </View>
        </Reveal>

        {/* ── Continue Learning ── */}
        <Reveal delay={310}>
          <View style={[s.section, { marginBottom: 4 }]}>
            <View style={s.rowBetween}>
              <Text style={s.sectionTitle}>Continue learning</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/learn')} hitSlop={8}>
                <Text style={s.seeAll}>See all</Text>
              </TouchableOpacity>
            </View>
            {COURSES.map(c => (
              <PressableScale key={c.title} onPress={() => router.push('/(tabs)/learn')} scaleTo={0.985} style={s.courseCard}>
                <AppImage uri={c.img} style={s.courseThumb} />
                <View style={s.courseContent}>
                  <Text style={s.courseTitle}>{c.title}</Text>
                  <View style={s.progTrack}><View style={[s.progFill, { width: `${c.pct}%` as any }]} /></View>
                  <Text style={s.courseMeta}>{c.pct}% · {c.meta}</Text>
                </View>
                <View style={s.coursePlay}><Ionicons name="play" size={12} color="#FFFFFF" /></View>
              </PressableScale>
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

  // Header
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 20, paddingTop: 14, paddingBottom: 16 },
  greeting: { fontFamily: 'DMSans_700Bold', fontSize: 10.5, color: Colors.text.muted, letterSpacing: 1.6, marginBottom: 3 },
  name: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 21, color: Colors.text.primary },
  streak: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FFF3EC', borderRadius: 999, paddingHorizontal: 10, height: 32 },
  streakText: { fontFamily: 'DMSans_700Bold', fontSize: 12.5, color: '#E8743B' },
  bellBtn: { width: 38, height: 38, borderRadius: 13, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', shadowColor: Colors.brand.plum, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 2 },
  bellDot: { position: 'absolute', top: 10, right: 11, width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.brand.plum, borderWidth: 1.5, borderColor: '#FFFFFF' },

  // Shade card
  shadeCard: { flexDirection: 'row', alignItems: 'center', gap: 13, marginHorizontal: 20, marginBottom: 18, backgroundColor: '#FFFFFF', borderRadius: 18, padding: 13, shadowColor: Colors.brand.plum, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 2 },
  swatch: { width: 44, height: 44, borderRadius: 13, backgroundColor: '#E8C9A8', borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
  shadeEye: { fontFamily: 'DMSans_700Bold', fontSize: 9.5, color: Colors.text.muted, letterSpacing: 1.2, marginBottom: 3 },
  shadeName: { fontFamily: 'DMSans_700Bold', fontSize: 14.5, color: Colors.text.primary },
  shadeMeta: { fontFamily: 'DMSans_400Regular', fontSize: 11.5, color: Colors.text.muted, marginTop: 2 },
  shadePct: { width: 42, height: 42, borderRadius: 999, backgroundColor: Colors.blush, alignItems: 'center', justifyContent: 'center' },
  shadePctText: { fontFamily: 'DMSans_700Bold', fontSize: 12.5, color: Colors.brand.plum },

  // Actions
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 22 },
  action: { alignItems: 'center', gap: 7 },
  actionIcon: { width: 54, height: 54, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  actionLabel: { fontFamily: 'DMSans_500Medium', fontSize: 11.5, color: Colors.text.secondary },

  // Hero
  heroPad: { paddingHorizontal: 20, marginBottom: 24 },
  hero: { height: 192, borderRadius: 22, overflow: 'hidden', justifyContent: 'flex-end' },
  heroImg: { borderRadius: 22 },
  heroContent: { padding: 16, gap: 9 },
  heroBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FFFFFF', borderRadius: 999, paddingHorizontal: 9, paddingVertical: 5, alignSelf: 'flex-start' },
  heroBadgeText: { fontFamily: 'DMSans_700Bold', fontSize: 9, color: Colors.brand.plum, letterSpacing: 0.8 },
  heroTitle: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 18, color: '#FFFFFF', lineHeight: 23 },
  heroBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FFFFFF', borderRadius: 11, paddingHorizontal: 14, paddingVertical: 9, alignSelf: 'flex-start', marginTop: 2 },
  heroBtnText: { fontFamily: 'DMSans_700Bold', fontSize: 12, color: Colors.brand.plum },

  // Sections
  section: { paddingHorizontal: 20, marginBottom: 24 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 13 },
  sectionTitle: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 16, color: Colors.text.primary },
  seeAll: { fontFamily: 'DMSans_700Bold', fontSize: 11.5, color: Colors.brand.plum },

  // Looks
  looksRow: { gap: 12, paddingRight: 8 },
  lookItem: { width: LOOK_W },
  lookThumb: { width: LOOK_W, height: 150, borderRadius: 16, overflow: 'hidden', marginBottom: 7 },
  lookImg: { borderRadius: 16 },
  levelTag: { position: 'absolute', top: 8, left: 8, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3 },
  levelTagText: { fontFamily: 'DMSans_700Bold', fontSize: 9, color: '#FFFFFF', letterSpacing: 0.3 },
  lookLabel: { fontFamily: 'DMSans_700Bold', fontSize: 13, color: Colors.text.primary },
  lookMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  lookSub: { fontFamily: 'DMSans_400Regular', fontSize: 11, color: Colors.text.muted },

  // Courses
  courseCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 10, marginBottom: 10, shadowColor: Colors.brand.plum, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  courseThumb: { width: 52, height: 52, borderRadius: 13 },
  courseContent: { flex: 1, gap: 6 },
  courseTitle: { fontFamily: 'DMSans_700Bold', fontSize: 13.5, color: Colors.text.primary },
  courseMeta: { fontFamily: 'DMSans_400Regular', fontSize: 11, color: Colors.text.muted },
  progTrack: { height: 4, backgroundColor: Colors.blush, borderRadius: 2, overflow: 'hidden' },
  progFill: { height: 4, backgroundColor: Colors.brand.plum, borderRadius: 2 },
  coursePlay: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.brand.plum, alignItems: 'center', justifyContent: 'center' },
});
