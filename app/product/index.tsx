import { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/Text';
import { Input } from '@/components/ui/Input';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { PressableScale, Reveal } from '@/components/ui/Motion';
import { AppImage } from '@/components/ui/AppImage';
import { useCartStore } from '@/lib/store/cartStore';
import { toast } from '@/lib/store/toastStore';
import { Colors } from '@/constants/colors';
import { Img } from '@/constants/images';

const CATEGORIES = ['All', 'Foundation', 'Concealer', 'Blush', 'Bronzer', 'Lips', 'Primer'];

const PRODUCTS = [
  { id: '1', name: "Pro Filt'r Soft Matte Foundation", brand: 'Fenty Beauty', category: 'Foundation', price: '£34', rating: '4.8', img: Img.products.a },
  { id: '2', name: 'Studio Fix Fluid SPF15', brand: 'MAC', category: 'Foundation', price: '£31', rating: '4.6', img: Img.products.b },
  { id: '3', name: 'Fit Me Matte + Poreless', brand: 'Maybelline', category: 'Foundation', price: '£10', rating: '4.5', img: Img.products.c },
  { id: '4', name: 'Soft Pinch Liquid Blush', brand: 'Rare Beauty', category: 'Blush', price: '£22', rating: '4.9', img: Img.products.d },
  { id: '5', name: 'Hoola Matte Bronzer', brand: 'Benefit', category: 'Bronzer', price: '£30', rating: '4.7', img: Img.products.a },
  { id: '6', name: 'Pillow Talk Lipstick', brand: 'Charlotte Tilbury', category: 'Lips', price: '£30', rating: '4.8', img: Img.products.b },
];

export default function ProductBrowserScreen() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const add = useCartStore(s => s.add);
  const cartCount = useCartStore(s => s.count)();

  const filtered = PRODUCTS.filter(p =>
    (category === 'All' || p.category === category) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase()))
  );

  const addToBag = (p: typeof PRODUCTS[number]) => {
    add({ id: p.id, name: p.name, brand: p.brand, price: parseFloat(p.price.replace('£', '')), img: p.img });
    toast.success(`${p.brand} added to bag`);
  };

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <ScreenHeader title="Shop" rightIcon="bag-handle-outline" rightBadge={cartCount} onRightPress={() => router.push('/product/cart')} />
      <View style={s.searchPad}>
        <Input placeholder="Search products or brands…" value={search} onChangeText={setSearch}
          leftIcon={<Ionicons name="search-outline" size={17} color={Colors.text.muted} />} />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.cats} contentContainerStyle={s.catsScroll}>
        {CATEGORIES.map(c => (
          <PressableScale key={c} scaleTo={0.95} onPress={() => setCategory(c)} style={[s.chip, category === c && s.chipActive]}>
            <Text style={[s.chipText, { color: category === c ? '#FFFFFF' : Colors.text.secondary }]}>{c}</Text>
          </PressableScale>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.list}>
        {filtered.map((p, i) => (
          <Reveal key={p.id} delay={i * 50}>
            <PressableScale scaleTo={0.985} onPress={() => router.push(`/product/${p.id}` as any)} style={s.card}>
              <AppImage uri={p.img} style={s.thumb} />
              <View style={s.cardBody}>
                <Text style={s.brand}>{p.brand}</Text>
                <Text style={s.name} numberOfLines={2}>{p.name}</Text>
                <View style={s.cardMeta}>
                  <View style={s.ratingPill}>
                    <Ionicons name="star" size={10} color="#E8A838" />
                    <Text style={s.ratingText}>{p.rating}</Text>
                  </View>
                  <Text style={s.price}>{p.price}</Text>
                </View>
              </View>
              <PressableScale style={s.addBtn} onPress={() => addToBag(p)}><Ionicons name="add" size={18} color="#FFFFFF" /></PressableScale>
            </PressableScale>
          </Reveal>
        ))}
        {filtered.length === 0 && (
          <View style={s.empty}>
            <Ionicons name="search-outline" size={28} color={Colors.text.muted} />
            <Text style={s.emptyText}>No products found</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.ivory },
  searchPad: { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 8 },
  cats: { maxHeight: 52 },
  catsScroll: { paddingHorizontal: 20, gap: 8, alignItems: 'center' },
  chip: { paddingHorizontal: 15, height: 36, justifyContent: 'center', borderRadius: 999, backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: Colors.border.light },
  chipActive: { backgroundColor: Colors.brand.plum, borderColor: Colors.brand.plum },
  chipText: { fontFamily: 'DMSans_700Bold', fontSize: 12 },

  list: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 24, gap: 11 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 13, backgroundColor: '#FFFFFF', borderRadius: 18, padding: 11, shadowColor: Colors.brand.plum, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  thumb: { width: 66, height: 66, borderRadius: 14 },
  cardBody: { flex: 1, gap: 3 },
  brand: { fontFamily: 'DMSans_700Bold', fontSize: 10.5, color: Colors.text.muted, letterSpacing: 0.3 },
  name: { fontFamily: 'DMSans_700Bold', fontSize: 13.5, color: Colors.text.primary, lineHeight: 18 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 },
  ratingPill: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  ratingText: { fontFamily: 'DMSans_700Bold', fontSize: 11, color: Colors.text.secondary },
  price: { fontFamily: 'DMSans_700Bold', fontSize: 13, color: Colors.brand.plum },
  addBtn: { width: 34, height: 34, borderRadius: 11, backgroundColor: Colors.brand.plum, alignItems: 'center', justifyContent: 'center' },

  empty: { alignItems: 'center', gap: 8, paddingVertical: 60 },
  emptyText: { fontFamily: 'DMSans_500Medium', fontSize: 13, color: Colors.text.muted },
});
