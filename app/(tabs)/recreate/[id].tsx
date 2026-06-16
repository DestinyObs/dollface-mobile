import { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/Text';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { ScreenLoader } from '@/components/ui/ScreenLoader';
import { ErrorView } from '@/components/shared/ErrorView';
import { PressableScale, Reveal } from '@/components/ui/Motion';
import { useSavedStore } from '@/lib/store/savedStore';
import { toast } from '@/lib/store/toastStore';
import { useRecreation } from '@/lib/data/hooks';
import { Colors } from '@/constants/colors';

type IName = React.ComponentProps<typeof Ionicons>['name'];

export default function LookRecreationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: recreation, isLoading, isError, refetch } = useRecreation(id ?? '');
  const [version, setVersion] = useState(0);

  if (isLoading) return <ScreenLoader />;
  if (isError || !recreation) return (
    <SafeAreaView style={s.root} edges={['top']}>
      <ScreenHeader title="Look Breakdown" />
      <ErrorView title="Couldn't load this look" onRetry={() => refetch()} />
    </SafeAreaView>
  );
  const VERSIONS = recreation.versions;
  const SECTIONS = recreation.sections;

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
            <Text style={s.aiText}>{recreation.aiNote}</Text>
          </View>
        </Reveal>

        {SECTIONS.map((sec, i) => (
          <Reveal key={sec.area} delay={140 + i * 60}>
            <View style={s.card}>
              <View style={s.cardHead}>
                <View style={s.cardIcon}><Ionicons name={sec.icon as IName} size={18} color={Colors.brand.plum} /></View>
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
