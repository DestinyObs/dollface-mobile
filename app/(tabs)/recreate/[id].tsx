import { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/Text';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { PressableScale, Reveal } from '@/components/ui/Motion';
import { useSavedStore } from '@/lib/store/savedStore';
import { toast } from '@/lib/store/toastStore';
import { Colors } from '@/constants/colors';

type IName = React.ComponentProps<typeof Ionicons>['name'];

const VERSIONS = ['Your Version', 'Beginner', 'Budget'];

const SECTIONS: { area: string; icon: IName; label: string; description: string; technique: string; products: { name: string; brand: string; shade: string; price: string }[] }[] = [
  { area: 'BASE', icon: 'sparkles-outline', label: 'Base Makeup', description: 'Full-coverage foundation blended seamlessly for a glass-skin effect.', technique: 'Apply with a damp beauty sponge using pressing motions for seamless coverage.', products: [ { name: "Pro Filt'r Soft Matte", brand: 'Fenty Beauty', shade: '220N', price: '£34' }, { name: "Instant Retouch Concealer", brand: 'Fenty Beauty', shade: '320W', price: '£27' } ] },
  { area: 'BROWS', icon: 'pencil-outline', label: 'Brows', description: 'Full, defined brows with a slightly arched shape. Focus definition at the tail.', technique: 'Use feathery strokes to mimic natural hairs. Brush up and set with clear gel.', products: [ { name: 'Gimme Brow+', brand: 'Benefit', shade: '4', price: '£26' } ] },
  { area: 'EYES', icon: 'eye-outline', label: 'Eye Look', description: 'Soft brown smoky eye with warm copper in the crease and black liner.', technique: 'Blend matte brown in the crease first, build depth with copper on the lid.', products: [ { name: 'Naked3 Palette', brand: 'Urban Decay', shade: 'Various', price: '£41' } ] },
  { area: 'CHEEKS', icon: 'flower-outline', label: 'Cheeks', description: 'Warm bronzer sculpted along the cheekbones. Peachy-pink blush on the apples.', technique: 'Bronzer in a 3-shape from temples to jaw. Blush on apples blended upward.', products: [ { name: 'Hoola Bronzer', brand: 'Benefit', shade: 'Medium', price: '£30' } ] },
  { area: 'LIPS', icon: 'heart-outline', label: 'Lips', description: 'Nude-mauve liner with a satin lipstick slightly overlined for fullness.', technique: 'Slightly overline the cupid\'s bow. Fill with liner before applying lipstick.', products: [ { name: 'Lip Cheat Liner', brand: 'Charlotte Tilbury', shade: 'Pillowtalk', price: '£19' } ] },
];

export default function LookRecreationScreen() {
  const [version, setVersion] = useState(0);

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <ScreenHeader title="Look Breakdown" rightIcon="bookmark-outline" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        <Reveal delay={40}>
          <View style={s.versionRow}>
            {VERSIONS.map((v, i) => (
              <PressableScale key={v} scaleTo={0.96} onPress={() => setVersion(i)} style={[s.versionChip, version === i && s.versionActive]}>
                <Text style={[s.versionText, { color: version === i ? '#FFFFFF' : Colors.text.muted }]}>{v}</Text>
              </PressableScale>
            ))}
          </View>
        </Reveal>

        <Reveal delay={90}>
          <View style={s.aiNote}>
            <View style={s.aiIcon}><Ionicons name="sparkles" size={14} color="#FFFFFF" /></View>
            <Text style={s.aiText}>This version adapts the look for your medium-tan skin tone and warm undertone. All shades re-matched to your profile.</Text>
          </View>
        </Reveal>

        {SECTIONS.map((sec, i) => (
          <Reveal key={sec.area} delay={140 + i * 60}>
            <View style={s.card}>
              <View style={s.cardHead}>
                <View style={s.cardIcon}><Ionicons name={sec.icon} size={18} color={Colors.brand.plum} /></View>
                <Text style={s.cardLabel}>{sec.label}</Text>
              </View>
              <Text style={s.cardDesc}>{sec.description}</Text>
              <View style={s.technique}>
                <Text style={s.techLabel}>TECHNIQUE</Text>
                <Text style={s.techText}>{sec.technique}</Text>
              </View>
              {sec.products.map(p => (
                <View key={p.name} style={s.productRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.productName} numberOfLines={1}>{p.name}</Text>
                    <Text style={s.productMeta}>{p.brand} · {p.shade}</Text>
                  </View>
                  <Text style={s.productPrice}>{p.price}</Text>
                </View>
              ))}
            </View>
          </Reveal>
        ))}
      </ScrollView>

      <View style={s.footer}>
        <PressableScale style={[s.btn, s.btnGhost]} onPress={() => { useSavedStore.getState().toggle('looks', { id: 'look-breakdown', title: 'Soft Glam Recreation', subtitle: 'Your version' }); toast.success('Look saved to your profile'); }}>
          <Text style={s.btnGhostText}>Save Look</Text>
        </PressableScale>
        <PressableScale style={[s.btn, s.btnPrimary]} onPress={() => router.push('/product')}>
          <Ionicons name="bag-handle-outline" size={16} color="#FFFFFF" />
          <Text style={s.btnPrimaryText}>Shop All</Text>
        </PressableScale>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.ivory },
  scroll: { paddingHorizontal: 20, paddingBottom: 24 },

  versionRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  versionChip: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: Colors.border.light },
  versionActive: { backgroundColor: Colors.brand.plum, borderColor: Colors.brand.plum },
  versionText: { fontFamily: 'DMSans_700Bold', fontSize: 12 },

  aiNote: { flexDirection: 'row', gap: 11, backgroundColor: Colors.blush, borderRadius: 16, padding: 14, marginBottom: 18, alignItems: 'flex-start' },
  aiIcon: { width: 28, height: 28, borderRadius: 9, backgroundColor: Colors.brand.plum, alignItems: 'center', justifyContent: 'center' },
  aiText: { flex: 1, fontFamily: 'DMSans_500Medium', fontSize: 12, color: Colors.brand.plum, lineHeight: 17 },

  card: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 16, marginBottom: 12, gap: 11, shadowColor: Colors.brand.plum, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  cardIcon: { width: 36, height: 36, borderRadius: 11, backgroundColor: Colors.blush, alignItems: 'center', justifyContent: 'center' },
  cardLabel: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 16, color: Colors.text.primary },
  cardDesc: { fontFamily: 'DMSans_400Regular', fontSize: 12.5, color: Colors.text.secondary, lineHeight: 19 },
  technique: { backgroundColor: Colors.blush, borderRadius: 12, padding: 11, gap: 3 },
  techLabel: { fontFamily: 'DMSans_700Bold', fontSize: 9.5, color: Colors.brand.plum, letterSpacing: 1 },
  techText: { fontFamily: 'DMSans_400Regular', fontSize: 11.5, color: Colors.text.secondary, lineHeight: 17 },
  productRow: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: Colors.ivory, borderRadius: 12, padding: 11 },
  productName: { fontFamily: 'DMSans_700Bold', fontSize: 12.5, color: Colors.text.primary },
  productMeta: { fontFamily: 'DMSans_400Regular', fontSize: 10.5, color: Colors.text.muted, marginTop: 1 },
  productPrice: { fontFamily: 'DMSans_700Bold', fontSize: 12.5, color: Colors.brand.plum },

  footer: { flexDirection: 'row', gap: 12, paddingHorizontal: 20, paddingTop: 10, paddingBottom: 14, backgroundColor: Colors.ivory, borderTopWidth: 1, borderTopColor: Colors.border.light },
  btn: { flex: 1, height: 52, borderRadius: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  btnGhost: { backgroundColor: Colors.blush },
  btnGhostText: { fontFamily: 'DMSans_700Bold', fontSize: 14.5, color: Colors.brand.plum },
  btnPrimary: { backgroundColor: Colors.brand.plum },
  btnPrimaryText: { fontFamily: 'DMSans_700Bold', fontSize: 14.5, color: '#FFFFFF' },
});
