import { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/Text';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { PressableScale, Reveal } from '@/components/ui/Motion';
import { AppImage } from '@/components/ui/AppImage';
import { useCartStore } from '@/lib/store/cartStore';
import { useSavedStore } from '@/lib/store/savedStore';
import { toast } from '@/lib/store/toastStore';
import { Colors } from '@/constants/colors';
import { Img } from '@/constants/images';

const PRODUCT = { id: 'p_fenty_220n', name: "Pro Filt'r Soft Matte Foundation", brand: 'Fenty Beauty', price: 34, img: Img.products.a };

const SHADES = [
  { name: 'Light Ivory', hex: '#F5DCBB' }, { name: '150W', hex: '#E8C49A' },
  { name: '210W', hex: '#D4A070' }, { name: '220N', hex: '#C4875A' },
  { name: '320W', hex: '#B0703A' }, { name: '420W', hex: '#8C5020' },
  { name: '490W', hex: '#5C2C08' },
];

const HIGHLIGHTS = ['Full coverage', 'Soft matte', 'Oil-free', '50 shades'];

export default function ProductDetailScreen() {
  const [shade, setShade] = useState(3);
  const add = useCartStore(s => s.add);
  const toggleSaved = useSavedStore(s => s.toggle);
  const saved = useSavedStore(s => s.isSaved('products', PRODUCT.id));

  const onSave = () => {
    const nowSaved = toggleSaved('products', { id: PRODUCT.id, title: PRODUCT.name, subtitle: PRODUCT.brand, img: PRODUCT.img });
    toast.success(nowSaved ? 'Saved to your products' : 'Removed from saved');
  };
  const onAddToBag = () => {
    add({ id: PRODUCT.id, name: PRODUCT.name, brand: PRODUCT.brand, price: PRODUCT.price, shade: SHADES[shade].name, img: PRODUCT.img });
    toast.success('Added to bag');
  };

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <ScreenHeader rightIcon={saved ? 'heart' : 'heart-outline'} onRightPress={onSave} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        <Reveal delay={40} style={s.imgPad}>
          <AppImage uri={Img.products.a} style={s.image} />
        </Reveal>

        <View style={s.body}>
          <Reveal delay={90}>
            <Text style={s.brand}>FENTY BEAUTY</Text>
            <Text style={s.name}>Pro Filt'r Soft Matte Foundation</Text>
            <View style={s.metaRow}>
              <View style={s.ratingPill}><Ionicons name="star" size={12} color="#E8A838" /><Text style={s.ratingText}>4.8</Text><Text style={s.ratingCount}>· 2.4k reviews</Text></View>
              <Text style={s.price}>£34</Text>
            </View>

            <View style={s.highlightRow}>
              {HIGHLIGHTS.map(h => (
                <View key={h} style={s.highlight}><Text style={s.highlightText}>{h}</Text></View>
              ))}
            </View>

            <Text style={s.desc}>A full-coverage, oil-free liquid foundation with a soft matte finish. Builds to full coverage without looking heavy, in 50 inclusive shades.</Text>
          </Reveal>

          <Reveal delay={150}>
            <View style={s.shadeHead}>
              <Text style={s.sectionTitle}>Shade</Text>
              <Text style={s.shadeName}>{SHADES[shade].name}</Text>
            </View>
            <View style={s.shadeRow}>
              {SHADES.map((sh, i) => (
                <PressableScale key={sh.name} scaleTo={0.9} onPress={() => setShade(i)} style={[s.shadeDot, { backgroundColor: sh.hex }, shade === i && s.shadeActive]}>
                  {shade === i ? <Ionicons name="checkmark" size={16} color="#FFFFFF" /> : null}
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
          <Text style={s.btnPrimaryText}>Add to Bag · £34</Text>
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
