import { View, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/Text';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { PressableScale, Reveal } from '@/components/ui/Motion';
import { AppImage } from '@/components/ui/AppImage';
import { EmptyView } from '@/components/shared/EmptyView';
import { useCartStore } from '@/lib/store/cartStore';
import { toast } from '@/lib/store/toastStore';
import { Colors } from '@/constants/colors';

export default function CartScreen() {
  const items = useCartStore(s => s.items);
  const setQty = useCartStore(s => s.setQty);
  const remove = useCartStore(s => s.remove);
  const clear = useCartStore(s => s.clear);
  const subtotal = useCartStore(s => s.subtotal)();
  const shipping = items.length ? 3.95 : 0;

  if (items.length === 0) {
    return (
      <SafeAreaView style={s.root} edges={['top']}>
        <ScreenHeader title="Your Bag" />
        <View style={{ flex: 1 }}>
          <EmptyView icon="bag-handle-outline" title="Your bag is empty" body="Add products from the shop or your shade matches."
            actionLabel="Browse Shop" onAction={() => router.replace('/product')} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <ScreenHeader title={`Your Bag · ${items.length}`} rightIcon="trash-outline" onRightPress={() => { clear(); toast.info('Bag cleared'); }} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        {items.map((it, i) => (
          <Reveal key={it.id} delay={i * 50}>
            <View style={s.card}>
              <AppImage uri={it.img ?? ''} style={s.thumb} />
              <View style={{ flex: 1 }}>
                <Text style={s.brand}>{it.brand}</Text>
                <Text style={s.name} numberOfLines={2}>{it.name}</Text>
                {it.shade ? <Text style={s.shade}>Shade: {it.shade}</Text> : null}
                <Text style={s.price}>£{it.price.toFixed(2)}</Text>
              </View>
              <View style={s.qtyCol}>
                <PressableScale style={s.removeBtn} onPress={() => { remove(it.id); toast.info('Removed from bag'); }}>
                  <Ionicons name="close" size={15} color={Colors.text.muted} />
                </PressableScale>
                <View style={s.stepper}>
                  <PressableScale style={s.stepBtn} onPress={() => setQty(it.id, it.qty - 1)}>
                    <Ionicons name="remove" size={14} color={Colors.brand.plum} />
                  </PressableScale>
                  <Text style={s.qty}>{it.qty}</Text>
                  <PressableScale style={s.stepBtn} onPress={() => setQty(it.id, it.qty + 1)}>
                    <Ionicons name="add" size={14} color={Colors.brand.plum} />
                  </PressableScale>
                </View>
              </View>
            </View>
          </Reveal>
        ))}

        <View style={s.summary}>
          <View style={s.sumRow}><Text style={s.sumLabel}>Subtotal</Text><Text style={s.sumValue}>£{subtotal.toFixed(2)}</Text></View>
          <View style={s.sumRow}><Text style={s.sumLabel}>Shipping</Text><Text style={s.sumValue}>£{shipping.toFixed(2)}</Text></View>
          <View style={s.sumDivider} />
          <View style={s.sumRow}><Text style={s.totalLabel}>Total</Text><Text style={s.totalValue}>£{(subtotal + shipping).toFixed(2)}</Text></View>
        </View>
      </ScrollView>

      <View style={s.footer}>
        <PressableScale style={s.cta} onPress={() => { clear(); toast.success('Order placed — thank you!'); router.replace('/(tabs)'); }}>
          <Ionicons name="lock-closed" size={15} color="#FFFFFF" />
          <Text style={s.ctaText}>Checkout · £{(subtotal + shipping).toFixed(2)}</Text>
        </PressableScale>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.ivory },
  scroll: { paddingHorizontal: 20, paddingBottom: 24 },
  card: { flexDirection: 'row', gap: 12, backgroundColor: '#FFFFFF', borderRadius: 18, padding: 12, marginBottom: 11, shadowColor: Colors.brand.plum, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  thumb: { width: 70, height: 70, borderRadius: 14 },
  brand: { fontFamily: 'DMSans_700Bold', fontSize: 10.5, color: Colors.text.muted, letterSpacing: 0.3 },
  name: { fontFamily: 'DMSans_700Bold', fontSize: 13, color: Colors.text.primary, lineHeight: 17, marginTop: 1 },
  shade: { fontFamily: 'DMSans_400Regular', fontSize: 11, color: Colors.text.muted, marginTop: 2 },
  price: { fontFamily: 'DMSans_700Bold', fontSize: 13, color: Colors.brand.plum, marginTop: 4 },
  qtyCol: { alignItems: 'flex-end', justifyContent: 'space-between' },
  removeBtn: { width: 24, height: 24, borderRadius: 8, backgroundColor: Colors.ivory, alignItems: 'center', justifyContent: 'center' },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: Colors.blush, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 5 },
  stepBtn: { width: 22, height: 22, borderRadius: 999, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  qty: { fontFamily: 'DMSans_700Bold', fontSize: 13, color: Colors.text.primary, minWidth: 14, textAlign: 'center' },

  summary: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 16, marginTop: 6, gap: 9, shadowColor: Colors.brand.plum, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  sumRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sumLabel: { fontFamily: 'DMSans_400Regular', fontSize: 13, color: Colors.text.secondary },
  sumValue: { fontFamily: 'DMSans_700Bold', fontSize: 13, color: Colors.text.primary },
  sumDivider: { height: 1, backgroundColor: Colors.border.light, marginVertical: 2 },
  totalLabel: { fontFamily: 'DMSans_700Bold', fontSize: 14.5, color: Colors.text.primary },
  totalValue: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 18, color: Colors.brand.plum },

  footer: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 14, backgroundColor: Colors.ivory, borderTopWidth: 1, borderTopColor: Colors.border.light },
  cta: { height: 54, borderRadius: 15, backgroundColor: Colors.brand.plum, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  ctaText: { fontFamily: 'DMSans_700Bold', fontSize: 15, color: '#FFFFFF' },
});
