import { View, ScrollView, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/Text';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { ScreenLoader } from '@/components/ui/ScreenLoader';
import { PressableScale, Reveal } from '@/components/ui/Motion';
import { toast } from '@/lib/store/toastStore';
import { useMatchResult } from '@/lib/data/hooks';
import { Colors } from '@/constants/colors';

export default function ShadeMatchResultsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: result } = useMatchResult(id ?? 'mock-result-id');

  if (!result) return <ScreenLoader />;
  const RESULTS = result.items;

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <ScreenHeader title="Your Shade Matches" rightIcon="share-outline" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* Skin tone summary */}
        <Reveal delay={40}>
          <View style={s.summary}>
            <View style={[s.toneSwatch, { backgroundColor: result.tone.hex }]} />
            <View style={{ flex: 1 }}>
              <Text style={s.toneTitle}>{result.tone.label}</Text>
              <Text style={s.toneSub}>{result.tone.sub}</Text>
              <View style={s.confChip}>
                <Ionicons name="checkmark-circle" size={12} color={Colors.status.success} />
                <Text style={s.confText}>{result.tone.confidence}</Text>
              </View>
            </View>
          </View>
        </Reveal>

        {RESULTS.map((r, i) => (
          <Reveal key={r.category} delay={100 + i * 70}>
            <View style={s.card}>
              <View style={s.cardHead}>
                <Text style={s.cardCat}>{r.category}</Text>
                <View style={s.matchBadge}>
                  <Ionicons name="checkmark" size={11} color={Colors.status.success} />
                  <Text style={s.matchBadgeText}>{r.confidence} match</Text>
                </View>
              </View>

              <View style={s.matchedRow}>
                <View style={[s.matchedSwatch, { backgroundColor: r.hex }]} />
                <View style={{ flex: 1 }}>
                  <Text style={s.matchedBrand}>{r.brand}</Text>
                  <Text style={s.matchedProduct} numberOfLines={1}>{r.product}</Text>
                </View>
                <Text style={s.matchedShade}>{r.matchedShade}</Text>
              </View>

              <Text style={s.reason}>{r.reason}</Text>

              <Text style={s.altLabel}>BUDGET ALTERNATIVES</Text>
              {r.alternatives.map(alt => (
                <View key={alt.shade} style={s.altRow}>
                  <View style={[s.altSwatch, { backgroundColor: alt.hex }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={s.altName}>{alt.brand} — {alt.shade}</Text>
                    <Text style={s.altProduct}>{alt.product}</Text>
                  </View>
                  <Text style={s.altPrice}>{alt.price}</Text>
                </View>
              ))}
            </View>
          </Reveal>
        ))}
      </ScrollView>

      <View style={s.footer}>
        <PressableScale style={[s.btn, s.btnGhost]} onPress={() => toast.success('Matches saved to your profile')}>
          <Text style={s.btnGhostText}>Save</Text>
        </PressableScale>
        <PressableScale style={[s.btn, s.btnPrimary]} onPress={() => router.push('/product')}>
          <Ionicons name="bag-handle-outline" size={16} color="#FFFFFF" />
          <Text style={s.btnPrimaryText}>Shop Now</Text>
        </PressableScale>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.ivory },
  scroll: { paddingHorizontal: 20, paddingBottom: 24 },

  summary: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: '#FFFFFF', borderRadius: 18, padding: 14, marginBottom: 16, shadowColor: Colors.brand.plum, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  toneSwatch: { width: 56, height: 56, borderRadius: 999, borderWidth: 3, borderColor: '#FFFFFF', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6 },
  toneTitle: { fontFamily: 'DMSans_700Bold', fontSize: 14.5, color: Colors.text.primary },
  toneSub: { fontFamily: 'DMSans_400Regular', fontSize: 11.5, color: Colors.text.muted, marginTop: 2 },
  confChip: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  confText: { fontFamily: 'DMSans_700Bold', fontSize: 11, color: Colors.status.success },

  card: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 16, marginBottom: 14, gap: 12, shadowColor: Colors.brand.plum, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  cardHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardCat: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 17, color: Colors.text.primary },
  matchBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#EAF7EF', borderRadius: 999, paddingHorizontal: 9, paddingVertical: 4 },
  matchBadgeText: { fontFamily: 'DMSans_700Bold', fontSize: 10.5, color: Colors.status.success },

  matchedRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.blush, borderRadius: 14, padding: 12 },
  matchedSwatch: { width: 44, height: 44, borderRadius: 999, borderWidth: 2, borderColor: '#FFFFFF' },
  matchedBrand: { fontFamily: 'DMSans_700Bold', fontSize: 13, color: Colors.text.primary },
  matchedProduct: { fontFamily: 'DMSans_400Regular', fontSize: 11.5, color: Colors.text.secondary, marginTop: 1 },
  matchedShade: { fontFamily: 'DMSans_700Bold', fontSize: 12, color: Colors.brand.plum },

  reason: { fontFamily: 'DMSans_400Regular', fontSize: 12, color: Colors.text.muted, lineHeight: 18 },

  altLabel: { fontFamily: 'DMSans_700Bold', fontSize: 10, color: Colors.text.muted, letterSpacing: 1.2 },
  altRow: { flexDirection: 'row', alignItems: 'center', gap: 11, backgroundColor: Colors.ivory, borderRadius: 12, padding: 10 },
  altSwatch: { width: 32, height: 32, borderRadius: 999 },
  altName: { fontFamily: 'DMSans_700Bold', fontSize: 12, color: Colors.text.primary },
  altProduct: { fontFamily: 'DMSans_400Regular', fontSize: 10.5, color: Colors.text.muted },
  altPrice: { fontFamily: 'DMSans_700Bold', fontSize: 12.5, color: Colors.brand.plum },

  footer: { flexDirection: 'row', gap: 12, paddingHorizontal: 20, paddingTop: 10, paddingBottom: 14, backgroundColor: Colors.ivory, borderTopWidth: 1, borderTopColor: Colors.border.light },
  btn: { flex: 1, height: 52, borderRadius: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  btnGhost: { backgroundColor: Colors.blush },
  btnGhostText: { fontFamily: 'DMSans_700Bold', fontSize: 14.5, color: Colors.brand.plum },
  btnPrimary: { backgroundColor: Colors.brand.plum },
  btnPrimaryText: { fontFamily: 'DMSans_700Bold', fontSize: 14.5, color: '#FFFFFF' },
});
