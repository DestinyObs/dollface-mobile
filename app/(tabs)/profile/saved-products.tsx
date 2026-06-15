import { View, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/Text';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { EmptyView } from '@/components/shared/EmptyView';
import { PressableScale, Reveal } from '@/components/ui/Motion';
import { AppImage } from '@/components/ui/AppImage';
import { useSavedStore } from '@/lib/store/savedStore';
import { toast } from '@/lib/store/toastStore';
import { Colors } from '@/constants/colors';

export default function Screen() {
  const items = useSavedStore(s => s.products);
  const toggle = useSavedStore(s => s.toggle);

  if (items.length === 0) {
    return (
      <SafeAreaView style={s.root} edges={['top']}>
        <ScreenHeader title="Saved Products" />
        <View style={{ flex: 1 }}>
          <EmptyView icon="bag-outline" title="No saved products yet" body="Save products from shade matches or the shop." actionLabel="Browse Products" onAction={() => router.push('/product' as any)} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <ScreenHeader title={`Saved Products · ${items.length}`} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        {items.map((it, i) => (
          <Reveal key={it.id} delay={i * 50}>
            <View style={s.card}>
              {it.img ? <AppImage uri={it.img} style={s.thumb} /> : <View style={[s.thumb, s.thumbFallback]}><Ionicons name="bag-outline" size={22} color={Colors.brand.plum} /></View>}
              <View style={{ flex: 1 }}>
                <Text style={s.title} numberOfLines={2}>{it.title}</Text>
                {it.subtitle ? <Text style={s.sub}>{it.subtitle}</Text> : null}
              </View>
              <PressableScale style={s.removeBtn} onPress={() => { toggle('products', it); toast.info('Removed from saved'); }}>
                <Ionicons name="heart" size={18} color={Colors.brand.plum} />
              </PressableScale>
            </View>
          </Reveal>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.ivory },
  scroll: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 24 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 13, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 11, marginBottom: 10, shadowColor: Colors.brand.plum, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  thumb: { width: 60, height: 60, borderRadius: 13 },
  thumbFallback: { backgroundColor: Colors.blush, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: 'DMSans_700Bold', fontSize: 13.5, color: Colors.text.primary, lineHeight: 18 },
  sub: { fontFamily: 'DMSans_400Regular', fontSize: 11.5, color: Colors.text.muted, marginTop: 2 },
  removeBtn: { width: 36, height: 36, borderRadius: 12, backgroundColor: Colors.blush, alignItems: 'center', justifyContent: 'center' },
});
