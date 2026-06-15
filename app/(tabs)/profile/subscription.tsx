import { View, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/Text';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { PressableScale, Reveal } from '@/components/ui/Motion';
import { ScreenLoader } from '@/components/ui/ScreenLoader';
import { useSubscription } from '@/lib/data/hooks';
import { Colors } from '@/constants/colors';

export default function SubscriptionScreen() {
  const { data: sub } = useSubscription();
  if (!sub) return <ScreenLoader />;
  const FREE = sub.current.features;
  const PRO = sub.pro.features;

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <ScreenHeader title="Subscription" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        <Reveal delay={40}>
          <View style={s.currentCard}>
            <View style={s.currentTop}>
              <View>
                <Text style={s.currentEye}>CURRENT PLAN</Text>
                <Text style={s.currentName}>{sub.current.name}</Text>
              </View>
              <View style={s.freeBadge}><Text style={s.freeBadgeText}>{sub.status}</Text></View>
            </View>
            {FREE.map(f => (
              <View key={f} style={s.freeRow}>
                <Ionicons name="checkmark-circle" size={16} color={Colors.text.muted} />
                <Text style={s.freeText}>{f}</Text>
              </View>
            ))}
          </View>
        </Reveal>

        <Reveal delay={110}>
          <LinearGradient colors={['#2D0F1A', '#753248']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.proCard}>
            <View style={s.proOrb} />
            <View style={s.proHead}>
              <View style={s.proCrest}><Ionicons name="diamond" size={18} color="#FFFFFF" /></View>
              <View>
                <Text style={s.proEye}>{sub.pro.name.toUpperCase()}</Text>
                <Text style={s.proPrice}>{sub.pro.price}<Text style={s.proUnit}> {sub.pro.unit}</Text></Text>
              </View>
            </View>
            {PRO.map(p => (
              <View key={p} style={s.proRow}>
                <Ionicons name="checkmark-circle" size={16} color={Colors.rose} />
                <Text style={s.proText}>{p}</Text>
              </View>
            ))}
            <PressableScale style={s.upgradeBtn} onPress={() => router.push('/premium')}>
              <Text style={s.upgradeText}>Upgrade to Pro</Text>
              <Ionicons name="arrow-forward" size={16} color={Colors.brand.plum} />
            </PressableScale>
          </LinearGradient>
        </Reveal>

        <Text style={s.note}>Cancel anytime. Billed annually. 7-day free trial for new subscribers.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.ivory },
  scroll: { paddingHorizontal: 20, paddingBottom: 28 },

  currentCard: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 18, marginTop: 6, marginBottom: 16, gap: 10, shadowColor: Colors.brand.plum, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  currentTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  currentEye: { fontFamily: 'DMSans_700Bold', fontSize: 10, color: Colors.text.muted, letterSpacing: 1.2 },
  currentName: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 22, color: Colors.text.primary, marginTop: 2 },
  freeBadge: { backgroundColor: Colors.blush, borderRadius: 999, paddingHorizontal: 11, paddingVertical: 5 },
  freeBadgeText: { fontFamily: 'DMSans_700Bold', fontSize: 11, color: Colors.brand.plum },
  freeRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  freeText: { fontFamily: 'DMSans_400Regular', fontSize: 13, color: Colors.text.secondary },

  proCard: { borderRadius: 22, padding: 20, overflow: 'hidden', gap: 11 },
  proOrb: { position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.06)' },
  proHead: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 6 },
  proCrest: { width: 42, height: 42, borderRadius: 13, backgroundColor: 'rgba(255,255,255,0.14)', alignItems: 'center', justifyContent: 'center' },
  proEye: { fontFamily: 'DMSans_700Bold', fontSize: 10, color: 'rgba(255,255,255,0.55)', letterSpacing: 1.3 },
  proPrice: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 24, color: '#FFFFFF', marginTop: 2 },
  proUnit: { fontFamily: 'DMSans_500Medium', fontSize: 13, color: 'rgba(255,255,255,0.6)' },
  proRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  proText: { fontFamily: 'DMSans_500Medium', fontSize: 13, color: 'rgba(255,255,255,0.92)' },
  upgradeBtn: { height: 50, borderRadius: 14, backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8 },
  upgradeText: { fontFamily: 'DMSans_700Bold', fontSize: 15, color: Colors.brand.plum },

  note: { fontFamily: 'DMSans_400Regular', fontSize: 11.5, color: Colors.text.muted, textAlign: 'center', lineHeight: 17, marginTop: 18 },
});
