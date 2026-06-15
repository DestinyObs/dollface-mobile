import { useState } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/Text';
import { Input } from '@/components/ui/Input';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { PressableScale } from '@/components/ui/Motion';
import { AppImage } from '@/components/ui/AppImage';
import { searchApi } from '@/lib/data/endpoints';
import { Colors } from '@/constants/colors';

const SUGGESTIONS = ['Foundation', 'Glass skin', 'Soft glam', 'Fenty', 'Bronzer'];

export default function SearchScreen() {
  const [q, setQ] = useState('');
  const term = q.trim();
  const { data, isFetching } = useQuery({
    queryKey: ['search', term],
    queryFn: () => searchApi.global(term),
    enabled: term.length > 1,
  });

  const empty = data && !data.products.length && !data.tutorials.length && !data.looks.length && !data.brands.length;

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <ScreenHeader title="Search" />
      <View style={s.searchPad}>
        <Input placeholder="Products, tutorials, looks, brands…" value={q} onChangeText={setQ} autoFocus
          leftIcon={<Ionicons name="search-outline" size={17} color={Colors.text.muted} />} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        {term.length <= 1 ? (
          <View style={s.suggest}>
            <Text style={s.eyebrow}>TRY SEARCHING</Text>
            <View style={s.chips}>
              {SUGGESTIONS.map(x => (
                <PressableScale key={x} scaleTo={0.95} onPress={() => setQ(x)} style={s.chip}>
                  <Text style={s.chipText}>{x}</Text>
                </PressableScale>
              ))}
            </View>
          </View>
        ) : isFetching && !data ? (
          <ActivityIndicator style={{ marginTop: 40 }} color={Colors.brand.plum} />
        ) : empty ? (
          <View style={s.emptyWrap}>
            <Ionicons name="search-outline" size={28} color={Colors.text.muted} />
            <Text style={s.emptyText}>No results for “{term}”</Text>
          </View>
        ) : (
          <>
            {!!data?.products.length && (
              <Section title="Products">
                {data.products.map(p => (
                  <Row key={p.id} img={p.img} title={p.name} sub={`${p.brand} · ${p.price}`} onPress={() => router.push(`/product/${p.id}` as any)} />
                ))}
              </Section>
            )}
            {!!data?.tutorials.length && (
              <Section title="Tutorials">
                {data.tutorials.map(t => (
                  <Row key={t.id} img={t.img} title={t.title} sub={`${t.level} · ${t.mins}`} onPress={() => router.push(`/(tabs)/learn/${t.id}` as any)} />
                ))}
              </Section>
            )}
            {!!data?.looks.length && (
              <Section title="Looks">
                {data.looks.map(l => (
                  <Row key={l.id} img={l.img} title={l.label} sub={l.meta} onPress={() => router.push('/(tabs)/recreate' as any)} />
                ))}
              </Section>
            )}
            {!!data?.brands.length && (
              <Section title="Brands">
                {data.brands.map(b => (
                  <Row key={b.id} title={b.name} sub="Brand" onPress={() => router.push('/product' as any)} />
                ))}
              </Section>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={s.section}>
      <Text style={s.eyebrow}>{title.toUpperCase()}</Text>
      <View style={{ gap: 8 }}>{children}</View>
    </View>
  );
}

function Row({ img, title, sub, onPress }: { img?: string; title: string; sub: string; onPress: () => void }) {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={s.row}>
      {img ? <AppImage uri={img} style={s.thumb} /> : <View style={[s.thumb, s.thumbFallback]}><Ionicons name="pricetag-outline" size={18} color={Colors.brand.plum} /></View>}
      <View style={{ flex: 1 }}>
        <Text style={s.rowTitle} numberOfLines={1}>{title}</Text>
        <Text style={s.rowSub}>{sub}</Text>
      </View>
      <Ionicons name="chevron-forward" size={15} color={Colors.text.muted} />
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.ivory },
  searchPad: { paddingHorizontal: 20, paddingBottom: 6 },
  scroll: { paddingHorizontal: 20, paddingBottom: 28 },
  suggest: { marginTop: 14 },
  eyebrow: { fontFamily: 'DMSans_700Bold', fontSize: 10.5, color: Colors.text.muted, letterSpacing: 1.4, marginBottom: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 999, backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: Colors.border.light },
  chipText: { fontFamily: 'DMSans_700Bold', fontSize: 12.5, color: Colors.text.secondary },
  section: { marginTop: 18 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FFFFFF', borderRadius: 14, padding: 9, shadowColor: Colors.brand.plum, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 1 },
  thumb: { width: 48, height: 48, borderRadius: 11 },
  thumbFallback: { backgroundColor: Colors.blush, alignItems: 'center', justifyContent: 'center' },
  rowTitle: { fontFamily: 'DMSans_700Bold', fontSize: 13.5, color: Colors.text.primary },
  rowSub: { fontFamily: 'DMSans_400Regular', fontSize: 11.5, color: Colors.text.muted, marginTop: 2 },
  emptyWrap: { alignItems: 'center', marginTop: 50, gap: 10 },
  emptyText: { fontFamily: 'DMSans_500Medium', fontSize: 13.5, color: Colors.text.muted },
});
