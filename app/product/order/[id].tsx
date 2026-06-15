import { View, ScrollView, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/Text';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { ScreenLoader } from '@/components/ui/ScreenLoader';
import { PressableScale, Reveal } from '@/components/ui/Motion';
import { AppImage } from '@/components/ui/AppImage';
import { useCartStore } from '@/lib/store/cartStore';
import { confirm } from '@/lib/store/confirmStore';
import { toast } from '@/lib/store/toastStore';
import { ordersApi } from '@/lib/data/endpoints';
import { Colors } from '@/constants/colors';

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const qc = useQueryClient();
  const { data: order } = useQuery({ queryKey: ['order', id], queryFn: () => ordersApi.detail(id!), enabled: !!id });
  const { data: tracking } = useQuery({ queryKey: ['order', id, 'tracking'], queryFn: () => ordersApi.tracking(id!), enabled: !!id });

  if (!order) return <ScreenLoader />;
  const cancellable = !['SHIPPED', 'DELIVERED', 'CANCELLED'].includes(order.status);

  const onCancel = () => confirm({
    title: 'Cancel order?',
    message: 'This will cancel your order and refund any payment.',
    confirmLabel: 'Cancel Order', danger: true,
    onConfirm: async () => {
      await ordersApi.cancel(order.id);
      qc.invalidateQueries({ queryKey: ['order', id] });
      qc.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Order cancelled');
    },
  });

  const onReorder = async () => {
    await ordersApi.reorder(order.id);
    await useCartStore.getState().hydrate();
    toast.success('Items added to your bag');
    router.push('/product/cart');
  };

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <ScreenHeader title={`Order #${order.id.slice(-6).toUpperCase()}`} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* Tracking */}
        {tracking && order.status !== 'CANCELLED' && (
          <Reveal delay={30}>
            <View style={s.trackCard}>
              <Text style={s.trackEye}>{tracking.carrier} · {tracking.trackingNo}</Text>
              <View style={s.steps}>
                {tracking.steps.map((st, i) => (
                  <View key={st.label} style={s.step}>
                    <View style={[s.stepDot, st.done && s.stepDotDone]}>
                      {st.done ? <Ionicons name="checkmark" size={11} color="#FFFFFF" /> : <View style={s.stepInner} />}
                    </View>
                    {i < tracking.steps.length - 1 && <View style={[s.stepLine, st.done && s.stepLineDone]} />}
                    <Text style={[s.stepLabel, st.done && s.stepLabelDone]}>{st.label}</Text>
                  </View>
                ))}
              </View>
            </View>
          </Reveal>
        )}

        {/* Items */}
        <Reveal delay={80}>
          <View style={s.section}>
            <Text style={s.sectionEye}>ITEMS</Text>
            {order.items.map(it => (
              <View key={it.id} style={s.item}>
                {it.img ? <AppImage uri={it.img} style={s.thumb} /> : <View style={[s.thumb, s.thumbFallback]}><Ionicons name="bag-outline" size={18} color={Colors.brand.plum} /></View>}
                <View style={{ flex: 1 }}>
                  <Text style={s.itemName} numberOfLines={1}>{it.name}</Text>
                  <Text style={s.itemMeta}>{it.brand}{it.shade ? ` · ${it.shade}` : ''} · Qty {it.qty}</Text>
                </View>
                <Text style={s.itemPrice}>£{(it.price * it.qty).toFixed(2)}</Text>
              </View>
            ))}
          </View>
        </Reveal>

        {/* Totals */}
        <Reveal delay={120}>
          <View style={s.summary}>
            <Row label="Subtotal" value={`£${order.subtotal.toFixed(2)}`} />
            <Row label="Shipping" value={order.shipping === 0 ? 'Free' : `£${order.shipping.toFixed(2)}`} />
            <Row label="VAT" value={`£${order.tax.toFixed(2)}`} />
            <View style={s.divider} />
            <Row label="Total" value={`£${order.total.toFixed(2)}`} bold />
          </View>
        </Reveal>
      </ScrollView>

      <View style={s.footer}>
        {cancellable ? (
          <PressableScale style={[s.btn, s.btnGhost]} onPress={onCancel}><Text style={s.btnGhostText}>Cancel Order</Text></PressableScale>
        ) : (
          <PressableScale style={[s.btn, s.btnGhost]} onPress={onReorder}><Text style={s.btnGhostText}>Reorder</Text></PressableScale>
        )}
        <PressableScale style={[s.btn, s.btnPrimary]} onPress={() => router.replace('/product')}>
          <Text style={s.btnPrimaryText}>Continue Shopping</Text>
        </PressableScale>
      </View>
    </SafeAreaView>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <View style={s.sumRow}>
      <Text style={[s.sumLabel, bold && s.sumBold]}>{label}</Text>
      <Text style={[s.sumValue, bold && s.sumBold]}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.ivory },
  scroll: { padding: 20, paddingBottom: 24 },
  trackCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 16 },
  trackEye: { fontFamily: 'DMSans_700Bold', fontSize: 11, color: Colors.text.muted, letterSpacing: 0.6, marginBottom: 14 },
  steps: { gap: 0 },
  step: { flexDirection: 'row', alignItems: 'center', gap: 11, position: 'relative', paddingBottom: 16 },
  stepDot: { width: 22, height: 22, borderRadius: 999, backgroundColor: Colors.ivory, borderWidth: 2, borderColor: Colors.border.default, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  stepDotDone: { backgroundColor: Colors.brand.plum, borderColor: Colors.brand.plum },
  stepInner: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.border.default },
  stepLine: { position: 'absolute', left: 10, top: 22, width: 2, height: 16, backgroundColor: Colors.border.default },
  stepLineDone: { backgroundColor: Colors.brand.plum },
  stepLabel: { fontFamily: 'DMSans_500Medium', fontSize: 13, color: Colors.text.muted },
  stepLabelDone: { color: Colors.text.primary, fontFamily: 'DMSans_700Bold' },
  section: { marginBottom: 16 },
  sectionEye: { fontFamily: 'DMSans_700Bold', fontSize: 10.5, color: Colors.text.muted, letterSpacing: 1.4, marginBottom: 10 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FFFFFF', borderRadius: 14, padding: 10, marginBottom: 8 },
  thumb: { width: 48, height: 48, borderRadius: 11 },
  thumbFallback: { backgroundColor: Colors.blush, alignItems: 'center', justifyContent: 'center' },
  itemName: { fontFamily: 'DMSans_700Bold', fontSize: 13.5, color: Colors.text.primary },
  itemMeta: { fontFamily: 'DMSans_400Regular', fontSize: 11.5, color: Colors.text.muted, marginTop: 2 },
  itemPrice: { fontFamily: 'DMSans_700Bold', fontSize: 13.5, color: Colors.text.primary },
  summary: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, gap: 10 },
  sumRow: { flexDirection: 'row', justifyContent: 'space-between' },
  sumLabel: { fontFamily: 'DMSans_400Regular', fontSize: 13.5, color: Colors.text.secondary },
  sumValue: { fontFamily: 'DMSans_500Medium', fontSize: 13.5, color: Colors.text.primary },
  sumBold: { fontFamily: 'DMSans_700Bold', fontSize: 16, color: Colors.text.primary },
  divider: { height: 1, backgroundColor: Colors.border.light, marginVertical: 2 },
  footer: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, paddingTop: 10, paddingBottom: 14, backgroundColor: Colors.ivory, borderTopWidth: 1, borderTopColor: Colors.border.light },
  btn: { flex: 1, height: 50, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 },
  btnGhost: { backgroundColor: Colors.blush },
  btnGhostText: { fontFamily: 'DMSans_700Bold', fontSize: 14, color: Colors.brand.plum },
  btnPrimary: { backgroundColor: Colors.brand.plum },
  btnPrimaryText: { fontFamily: 'DMSans_700Bold', fontSize: 14, color: '#FFFFFF' },
});
