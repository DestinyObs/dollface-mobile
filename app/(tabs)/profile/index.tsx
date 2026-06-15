import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/Text';
import { PressableScale, Reveal } from '@/components/ui/Motion';
import { AppImage } from '@/components/ui/AppImage';
import { useAuthStore } from '@/lib/store/authStore';
import { useBeautyProfileStore } from '@/lib/store/beautyProfileStore';
import { confirm } from '@/lib/store/confirmStore';
import { toast } from '@/lib/store/toastStore';
import { useCartStore } from '@/lib/store/cartStore';
import { Colors } from '@/constants/colors';
import { Img } from '@/constants/images';

type IName = React.ComponentProps<typeof Ionicons>['name'];

const PROFILE_CHIPS = [
  { label: 'Warm Ivory', sub: 'Shade' },
  { label: 'Neutral', sub: 'Undertone' },
  { label: 'Combination', sub: 'Skin type' },
];

const STATS = [
  { value: '12', label: 'Saved' },
  { value: '4',  label: 'Done' },
  { value: '3',  label: 'Matches' },
];

const MENU: { group: string; items: { label: string; icon: IName; route: string; color: string; bg: string }[] }[] = [
  {
    group: 'My activity',
    items: [
      { label: 'Saved Looks',     icon: 'heart-outline',         route: '/(tabs)/profile/saved-looks',     color: '#C0392B', bg: '#FFF0EE' },
      { label: 'Saved Tutorials', icon: 'bookmark-outline',      route: '/(tabs)/profile/saved-tutorials', color: '#3B5BDB', bg: '#EAF0FB' },
      { label: 'Saved Products',  icon: 'bag-outline',           route: '/(tabs)/profile/saved-products',  color: '#2D6A4F', bg: '#F0FBF4' },
      { label: 'My Routines',     icon: 'calendar-outline',      route: '/(tabs)/profile/routines',        color: '#A06A2C', bg: '#FBF1E6' },
      { label: 'Match History',   icon: 'color-palette-outline', route: '/(tabs)/profile/match-history',   color: Colors.brand.plum, bg: Colors.blush },
    ],
  },
  {
    group: 'Settings',
    items: [
      { label: 'App Settings', icon: 'settings-outline',    route: '/(tabs)/profile/settings',     color: Colors.text.secondary, bg: Colors.ivory },
      { label: 'Privacy',      icon: 'lock-closed-outline', route: '/(tabs)/profile/privacy',      color: Colors.text.secondary, bg: Colors.ivory },
      { label: 'Subscription', icon: 'diamond-outline',     route: '/(tabs)/profile/subscription', color: Colors.text.secondary, bg: Colors.ivory },
    ],
  },
];

export default function ProfileScreen() {
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);
  const clearProfile = useBeautyProfileStore(s => s.clearProfile);

  const handleLogout = () => {
    confirm({
      title: 'Sign out?',
      message: "You'll need to sign in again to access your beauty profile.",
      confirmLabel: 'Sign Out',
      danger: true,
      onConfirm: async () => {
        await logout();
        clearProfile();
        useCartStore.getState().clear();
        toast.success('Signed out');
        router.replace('/(auth)/welcome');
      },
    });
  };

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* Header */}
        <View style={s.header}>
          <Text style={s.screenTitle}>You</Text>
          <PressableScale onPress={() => router.push('/(tabs)/profile/settings')} style={s.iconBtn}>
            <Ionicons name="settings-outline" size={18} color={Colors.brand.plum} />
          </PressableScale>
        </View>

        {/* Identity card */}
        <Reveal delay={40}>
          <View style={s.identityCard}>
            <AppImage uri={Img.avatar} style={s.avatar} />
            <View style={{ flex: 1 }}>
              <Text style={s.userName}>{user?.name ?? 'Beauty Lover'}</Text>
              <Text style={s.userEmail}>{user?.email ?? 'hello@dollface.app'}</Text>
              <View style={s.planBadge}>
                <Ionicons name="diamond-outline" size={10} color={Colors.brand.plum} />
                <Text style={s.planText}>Free Plan</Text>
              </View>
            </View>
            <PressableScale onPress={() => router.push('/(tabs)/profile/settings')} style={s.editBtn}>
              <Ionicons name="create-outline" size={16} color={Colors.text.secondary} />
            </PressableScale>
          </View>
        </Reveal>

        {/* Beauty profile chips (creative content) */}
        <Reveal delay={100}>
          <View style={s.chipsRow}>
            {PROFILE_CHIPS.map(c => (
              <View key={c.sub} style={s.profileChip}>
                <Text style={s.chipLabel}>{c.label}</Text>
                <Text style={s.chipSub}>{c.sub}</Text>
              </View>
            ))}
          </View>
        </Reveal>

        {/* Stats strip */}
        <Reveal delay={150}>
          <View style={s.statsStrip}>
            {STATS.map((stat, i) => (
              <View key={stat.label} style={[s.stat, i < STATS.length - 1 && s.statDivider]}>
                <Text style={s.statValue}>{stat.value}</Text>
                <Text style={s.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </Reveal>

        {/* Premium banner */}
        <Reveal delay={200}>
          <PressableScale onPress={() => router.push('/premium')} scaleTo={0.98} style={s.premiumPad}>
            <LinearGradient colors={['#2D0F1A', '#753248']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.premiumBanner}>
              <View style={s.premiumOrb} />
              <View style={{ flex: 1 }}>
                <Text style={s.premiumEye}>DOLLFACE PRO</Text>
                <Text style={s.premiumTitle}>Unlock unlimited matches</Text>
                <Text style={s.premiumSub}>AI recreations · Ad-free · Priority shades</Text>
              </View>
              <View style={s.premiumIcon}><Ionicons name="diamond" size={18} color="#FFFFFF" /></View>
            </LinearGradient>
          </PressableScale>
        </Reveal>

        {/* Menu groups */}
        {MENU.map((group, gi) => (
          <Reveal key={group.group} delay={260 + gi * 60} style={s.section}>
            <Text style={s.sectionEye}>{group.group.toUpperCase()}</Text>
            <View style={s.menuCard}>
              {group.items.map((item, i) => (
                <TouchableOpacity
                  key={item.label}
                  onPress={() => router.push(item.route as any)}
                  style={[s.menuRow, i < group.items.length - 1 && s.menuDivider]}
                  activeOpacity={0.7}
                >
                  <View style={[s.menuIcon, { backgroundColor: item.bg }]}>
                    <Ionicons name={item.icon} size={16} color={item.color} />
                  </View>
                  <Text style={s.menuLabel}>{item.label}</Text>
                  <Ionicons name="chevron-forward" size={15} color={Colors.text.muted} />
                </TouchableOpacity>
              ))}
            </View>
          </Reveal>
        ))}

        <TouchableOpacity onPress={handleLogout} style={s.signOut} activeOpacity={0.7}>
          <Ionicons name="log-out-outline" size={16} color={Colors.status.error} />
          <Text style={s.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.ivory },
  scroll: { paddingBottom: 110 },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 14, paddingBottom: 12 },
  screenTitle: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 21, color: Colors.text.primary },
  iconBtn: { width: 38, height: 38, borderRadius: 13, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', shadowColor: Colors.brand.plum, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 2 },

  identityCard: { flexDirection: 'row', alignItems: 'center', gap: 13, marginHorizontal: 20, marginBottom: 12, backgroundColor: '#FFFFFF', borderRadius: 18, padding: 13, shadowColor: Colors.brand.plum, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 2 },
  avatar: { width: 56, height: 56, borderRadius: 999 },
  userName: { fontFamily: 'DMSans_700Bold', fontSize: 16, color: Colors.text.primary },
  userEmail: { fontFamily: 'DMSans_400Regular', fontSize: 11.5, color: Colors.text.muted, marginTop: 1, marginBottom: 6 },
  planBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.blush, borderRadius: 999, paddingHorizontal: 9, paddingVertical: 4, alignSelf: 'flex-start' },
  planText: { fontFamily: 'DMSans_700Bold', fontSize: 10.5, color: Colors.brand.plum },
  editBtn: { width: 36, height: 36, borderRadius: 12, backgroundColor: Colors.ivory, alignItems: 'center', justifyContent: 'center' },

  chipsRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 20, marginBottom: 12 },
  profileChip: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 14, paddingVertical: 11, paddingHorizontal: 10, alignItems: 'center', shadowColor: Colors.brand.plum, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 1 },
  chipLabel: { fontFamily: 'DMSans_700Bold', fontSize: 12.5, color: Colors.brand.plum },
  chipSub: { fontFamily: 'DMSans_400Regular', fontSize: 10, color: Colors.text.muted, marginTop: 2, letterSpacing: 0.3 },

  statsStrip: { flexDirection: 'row', marginHorizontal: 20, marginBottom: 16, backgroundColor: '#FFFFFF', borderRadius: 16, paddingVertical: 14, shadowColor: Colors.brand.plum, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  stat: { flex: 1, alignItems: 'center' },
  statDivider: { borderRightWidth: 1, borderRightColor: Colors.border.light },
  statValue: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 20, color: Colors.text.primary },
  statLabel: { fontFamily: 'DMSans_400Regular', fontSize: 10.5, color: Colors.text.muted, marginTop: 2 },

  premiumPad: { paddingHorizontal: 20, marginBottom: 20 },
  premiumBanner: { borderRadius: 18, padding: 16, flexDirection: 'row', alignItems: 'center', overflow: 'hidden' },
  premiumOrb: { position: 'absolute', top: -24, right: -24, width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.06)' },
  premiumEye: { fontFamily: 'DMSans_700Bold', fontSize: 9, color: 'rgba(255,255,255,0.5)', letterSpacing: 1.3 },
  premiumTitle: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 15, color: '#FFFFFF', marginTop: 2 },
  premiumSub: { fontFamily: 'DMSans_400Regular', fontSize: 10.5, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  premiumIcon: { width: 40, height: 40, borderRadius: 13, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center', marginLeft: 12 },

  section: { paddingHorizontal: 20, marginBottom: 18 },
  sectionEye: { fontFamily: 'DMSans_700Bold', fontSize: 10.5, color: Colors.text.muted, letterSpacing: 1.4, marginBottom: 10 },
  menuCard: { backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden', shadowColor: Colors.brand.plum, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 13, paddingVertical: 11 },
  menuDivider: { borderBottomWidth: 1, borderBottomColor: Colors.border.light },
  menuIcon: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, fontFamily: 'DMSans_500Medium', fontSize: 13.5, color: Colors.text.primary },

  signOut: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: 8, paddingVertical: 12 },
  signOutText: { fontFamily: 'DMSans_700Bold', fontSize: 14, color: Colors.status.error },
});
