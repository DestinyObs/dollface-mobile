import { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/Text';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { ScreenLoader } from '@/components/ui/ScreenLoader';
import { PressableScale, Reveal } from '@/components/ui/Motion';
import { AppImage } from '@/components/ui/AppImage';
import { useCartStore } from '@/lib/store/cartStore';
import { useSavedStore } from '@/lib/store/savedStore';
import { toast } from '@/lib/store/toastStore';
import { useProduct } from '@/lib/data/hooks';
import { Colors } from '@/constants/colors';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: product } = useProduct(id ?? '1');
  const [shade, setShade] = useState(3);
  const add = useCartStore(s => s.add);
  const toggleSaved = useSavedStore(s => s.toggle);
  const saved = useSavedStore(s => s.isSaved('products', product?.id ?? ''));

  if (!product) return <ScreenLoader />;
  const SHADES = product.shades;
  const HIGHLIGHTS = product.highlights;
  const shadeIndex = Math.min(shade, SHADES.length - 1);

  const onSave = () => {
    const nowSaved = toggleSaved('products', { id: product.id, title: product.name, subtitle: product.brand, img: product.img });
    toast.success(nowSaved ? 'Saved to your products' : 'Removed from saved');
  };
  const onAddToBag = () => {
    add({ id: product.id, name: product.name, brand: product.brand, price: product.price, shade: SHADES[shadeIndex].name, img: product.img });
    toast.success('Added to bag');
  };

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <ScreenHeader rightIcon={saved ? 'heart' : 'heart-outline'} onRightPress={onSave} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        <Reveal delay={40} style={s.imgPad}>
          <AppImage uri={product.img} style={s.image} />
        </Reveal>

        <View style={s.body}>
          <Reveal delay={90}>
            <Text style={s.brand}>{product.brand.toUpperCase()}</Text>
            <Text style={s.name}>{product.name}</Text>
            <View style={s.metaRow}>
              <View style={s.ratingPill}><Ionicons name="star" size={12} color="#E8A838" /><Text style={s.ratingText}>{product.rating}</Text><Text style={s.ratingCount}>· {product.reviewCount}</Text></View>
              <Text style={s.price}>£{product.price}</Text>
            </View>

            <View style={s.highlightRow}>
              {HIGHLIGHTS.map(h => (
                <View key={h} style={s.highlight}><Text style={s.highlightText}>{h}</Text></View>
              ))}
            </View>

            <Text style={s.desc}>{product.description}</Text>
          </Reveal>

          <Reveal delay={150}>
            <View style={s.shadeHead}>
              <Text style={s.sectionTitle}>Shade</Text>
              <Text style={s.shadeName}>{SHADES[shadeIndex].name}</Text>
            </View>
            <View style={s.shadeRow}>
              {SHADES.map((sh, i) => (
                <PressableScale key={sh.name} scaleTo={0.9} onPress={() => setShade(i)} style={[s.shadeDot, { backgroundColor: sh.hex }, shadeIndex === i && s.shadeActive]}>
                  {shadeIndex === i ? <Ionicons name="checkmark" size={16} color="#FFFFFF" /> : null}
                </PressableScale>
              ))}
            </View>
          </Reveal>
        </View>
      </ScrollView>

      <View style={s.footer}>
        <PressableScale style={[s.btn, s.btnGhost]} onPress={onSave}>
          <Ionicons name={saved ? 'heart' : 'heart-outline'} size={17} color={Colors.brand.plum} />
          <Text style={s.btnGhostText}>{saved ? 'Saved' : 'Save'}</Text>
        </PressableScale>
        <PressableScale style={[s.btn, s.btnPrimary]} onPress={onAddToBag}>
          <Ionicons name="bag-handle-outline" size={16} color="#FFFFFF" />
          <Text style={s.btnPrimaryText}>Add to Bag · £{product.price}</Text>
        </PressableScale>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.ivory },
  scroll: { paddingBottom: 24 },
  imgPad: { paddingHorizontal: 20, marginTop: 4 },
  image: { width: '100%', height: 240, borderRadius: 24 },

  body: { paddingHorizontal: 20, paddingTop: 18 },
  brand: { fontFamily: 'DMSans_700Bold', fontSize: 11, color: Colors.text.muted, letterSpacing: 1.2, marginBottom: 5 },
  name: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 21, color: Colors.text.primary, lineHeight: 27 },
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },
  ratingPill: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontFamily: 'DMSans_700Bold', fontSize: 12.5, color: Colors.text.primary },
  ratingCount: { fontFamily: 'DMSans_400Regular', fontSize: 11.5, color: Colors.text.muted },
  price: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 22, color: Colors.brand.plum },

  highlightRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: 14 },
  highlight: { backgroundColor: Colors.blush, borderRadius: 999, paddingHorizontal: 11, paddingVertical: 6 },
  highlightText: { fontFamily: 'DMSans_700Bold', fontSize: 11, color: Colors.brand.plum },

  desc: { fontFamily: 'DMSans_400Regular', fontSize: 13, color: Colors.text.secondary, lineHeight: 20, marginTop: 16 },

  shadeHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 24, marginBottom: 12 },
  sectionTitle: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 16, color: Colors.text.primary },
  shadeName: { fontFamily: 'DMSans_700Bold', fontSize: 13, color: Colors.text.secondary },
  shadeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  shadeDot: { width: 40, height: 40, borderRadius: 999, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(0,0,0,0.06)' },
  shadeActive: { borderColor: Colors.brand.plum, borderWidth: 2.5 },

  footer: { flexDirection: 'row', gap: 12, paddingHorizontal: 20, paddingTop: 10, paddingBottom: 14, backgroundColor: Colors.ivory, borderTopWidth: 1, borderTopColor: Colors.border.light },
  btn: { height: 52, borderRadius: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  btnGhost: { width: 100, backgroundColor: Colors.blush },
  btnGhostText: { fontFamily: 'DMSans_700Bold', fontSize: 14, color: Colors.brand.plum },
  btnPrimary: { flex: 1, backgroundColor: Colors.brand.plum },
  btnPrimaryText: { fontFamily: 'DMSans_700Bold', fontSize: 14.5, color: '#FFFFFF' },
});
