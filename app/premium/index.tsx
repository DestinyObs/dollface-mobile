import { View, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/Text';
import { PressableScale, Reveal } from '@/components/ui/Motion';
import { Colors } from '@/constants/colors';

type IName = React.ComponentProps<typeof Ionicons>['name'];

const PERKS: { icon: IName; label: string; desc: string }[] = [
  { icon: 'color-palette-outline', label: 'Unlimited shade matching',   desc: 'Match every category with no daily limit' },
  { icon: 'sparkles-outline',      label: 'Unlimited look recreations', desc: 'Upload and analyse as many looks as you want' },
  { icon: 'book-outline',          label: 'Full tutorial library',      desc: 'Every advanced and exclusive tutorial' },
  { icon: 'chatbubbles-outline',   label: 'AI beauty advisor',          desc: 'Personalised guidance, on demand' },
  { icon: 'flash-outline',         label: 'Priority product updates',   desc: 'New shades matched to you instantly' },
];

export default function PremiumPaywallScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={s.root}>
      <LinearGradient colors={['#2D0F1A', '#753248', '#5C2739']} style={StyleSheet.absoluteFill} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[s.scroll, { paddingTop: insets.top + 8, paddingBottom: Math.max(insets.bottom, 20) + 24 }]}
      >
        <PressableScale style={s.closeBtn} onPress={() => router.back()}>
          <Ionicons name="close" size={20} color="rgba(255,255,255,0.85)" />
        </PressableScale>

        <Reveal delay={40} style={s.hero}>
          <View style={s.crest}>
            <Ionicons name="diamond" size={32} color="#FFFFFF" />
          </View>
          <Text style={s.title}>DollFace Pro</Text>
          <Text style={s.subtitle}>Unlock the full power of personalised beauty.</Text>
        </Reveal>

        <Reveal delay={140} style={s.perks}>
          {PERKS.map(p => (
            <View key={p.label} style={s.perkRow}>
              <View style={s.perkIcon}>
                <Ionicons name={p.icon} size={20} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.perkLabel}>{p.label}</Text>
                <Text style={s.perkDesc}>{p.desc}</Text>
              </View>
              <Ionicons name="checkmark-circle" size={20} color={Colors.rose} />
            </View>
          ))}
        </Reveal>

        <Reveal delay={240} style={s.pricing}>
          <View style={s.priceCard}>
            <View style={s.bestBadge}>
              <Text style={s.bestText}>BEST VALUE</Text>
            </View>
            <Text style={s.priceEye}>ANNUAL PLAN</Text>
            <Text style={s.price}>£49.99<Text style={s.priceUnit}> / yr</Text></Text>
            <Text style={s.priceNote}>Just £4.17 per month</Text>
          </View>

          <PressableScale style={s.primaryBtn} onPress={() => {}}>
            <Text style={s.primaryText}>Start 7-Day Free Trial</Text>
            <Ionicons name="arrow-forward" size={16} color={Colors.brand.plum} />
          </PressableScale>
          <PressableScale style={s.monthlyBtn} onPress={() => {}}>
            <Text style={s.monthlyText}>Monthly Plan — £7.99/mo</Text>
          </PressableScale>
          <Text style={s.legal}>7-day free trial · Cancel anytime</Text>
        </Reveal>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#2D0F1A' },
  scroll: { paddingHorizontal: 24 },

  closeBtn: {
    width: 40, height: 40, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-end', marginBottom: 8,
  },

  hero: { alignItems: 'center', marginBottom: 30 },
  crest: {
    width: 76, height: 76, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 18,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },
  title: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 27, color: '#FFFFFF', marginBottom: 8 },
  subtitle: { fontFamily: 'DMSans_400Regular', fontSize: 14.5, color: 'rgba(255,255,255,0.75)', textAlign: 'center', lineHeight: 21, paddingHorizontal: 12 },

  perks: { gap: 12, marginBottom: 28 },
  perkRow: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 18, padding: 16,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  perkIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center' },
  perkLabel: { fontFamily: 'DMSans_700Bold', fontSize: 14.5, color: '#FFFFFF' },
  perkDesc: { fontFamily: 'DMSans_400Regular', fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2 },

  pricing: { gap: 12 },
  priceCard: {
    backgroundColor: '#FFFFFF', borderRadius: 22, padding: 22, alignItems: 'center', marginBottom: 6,
  },
  bestBadge: { backgroundColor: Colors.blush, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 5, marginBottom: 12 },
  bestText: { fontFamily: 'DMSans_700Bold', fontSize: 10, color: Colors.brand.plum, letterSpacing: 1.2 },
  priceEye: { fontFamily: 'DMSans_700Bold', fontSize: 11, color: Colors.text.muted, letterSpacing: 1.5 },
  price: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 32, color: Colors.brand.plum, marginTop: 6 },
  priceUnit: { fontFamily: 'DMSans_500Medium', fontSize: 16, color: Colors.text.muted },
  priceNote: { fontFamily: 'DMSans_400Regular', fontSize: 13, color: Colors.text.muted, marginTop: 4 },

  primaryBtn: {
    height: 58, borderRadius: 16, backgroundColor: '#FFFFFF',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 6,
  },
  primaryText: { fontFamily: 'DMSans_700Bold', fontSize: 16, color: Colors.brand.plum },
  monthlyBtn: { height: 50, alignItems: 'center', justifyContent: 'center' },
  monthlyText: { fontFamily: 'DMSans_700Bold', fontSize: 14, color: 'rgba(255,255,255,0.8)' },
  legal: { fontFamily: 'DMSans_400Regular', fontSize: 12, color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginTop: 4 },
});
