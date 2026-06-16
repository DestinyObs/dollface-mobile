import { useState } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/Text';
import { Input } from '@/components/ui/Input';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { ScreenLoader } from '@/components/ui/ScreenLoader';
import { ErrorView } from '@/components/shared/ErrorView';
import { PressableScale } from '@/components/ui/Motion';
import { useCartStore } from '@/lib/store/cartStore';
import { toast } from '@/lib/store/toastStore';
import { addressesApi, ordersApi, cartApi } from '@/lib/data/endpoints';
import { Colors } from '@/constants/colors';

export default function CheckoutScreen() {
  const cartCount = useCartStore(s => s.count)();
  const { data: addresses, refetch: refetchAddr } = useQuery({ queryKey: ['addresses'], queryFn: addressesApi.list });
  const { data: estimate, isLoading, isError, refetch } = useQuery({ queryKey: ['cart', 'estimate'], queryFn: cartApi.estimate });
  const { data: shipping = [] } = useQuery({ queryKey: ['shipping'], queryFn: ordersApi.shippingOptions });

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: '', line1: '', city: '', postcode: '' });
  const [shipId, setShipId] = useState('standard');
  const [placing, setPlacing] = useState(false);

  if (isLoading) return <ScreenLoader />;
  if (isError || !estimate) return (
    <SafeAreaView style={s.root} edges={['top']}>
      <ScreenHeader title="Checkout" />
      <ErrorView title="Couldn't load checkout" onRetry={() => refetch()} />
    </SafeAreaView>
  );

  const chosenAddress = selectedId ?? addresses?.find(a => a.isDefault)?.id ?? addresses?.[0]?.id ?? null;
  const formValid = form.name.trim() && form.line1.trim() && form.city.trim() && form.postcode.trim();

  const onPlaceOrder = async () => {
    if (placing || cartCount === 0) return;
    setPlacing(true);
    try {
      let addressId = chosenAddress;
      if (!addressId) {
        if (!formValid) { toast.error('Add a delivery address first.'); setPlacing(false); return; }
        const a = await addressesApi.create({ ...form, country: 'GB' });
        addressId = a.id;
      }
      const order = await ordersApi.place(addressId ?? undefined);
      await useCartStore.getState().hydrate(); // backend cleared the bag
      toast.success('Order placed — thank you!');
      router.replace(`/product/order/${order.id}` as any);
    } catch {
      toast.error('Could not place your order. Try again.');
      setPlacing(false);
    }
  };

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <ScreenHeader title="Checkout" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">

        {/* Delivery address */}
        <Text style={s.sectionEye}>DELIVERY ADDRESS</Text>
        {(addresses ?? []).map(a => {
          const active = a.id === chosenAddress;
          return (
            <TouchableOpacity key={a.id} activeOpacity={0.8} onPress={() => setSelectedId(a.id)} style={[s.addr, active && s.addrActive]}>
              <Ionicons name={active ? 'radio-button-on' : 'radio-button-off'} size={18} color={active ? Colors.brand.plum : Colors.text.muted} />
              <View style={{ flex: 1 }}>
                <Text style={s.addrName}>{a.name}</Text>
                <Text style={s.addrLine}>{a.line1}, {a.city} {a.postcode}</Text>
              </View>
            </TouchableOpacity>
          );
        })}

        {adding || !addresses?.length ? (
          <View style={s.form}>
            <Input label="Full name" value={form.name} onChangeText={v => setForm(f => ({ ...f, name: v }))} placeholder="Jane Doe" />
            <Input label="Address line" value={form.line1} onChangeText={v => setForm(f => ({ ...f, line1: v }))} placeholder="1 Beauty Street" />
            <View style={s.row2}>
              <View style={{ flex: 1.4 }}><Input label="City" value={form.city} onChangeText={v => setForm(f => ({ ...f, city: v }))} placeholder="London" /></View>
              <View style={{ flex: 1 }}><Input label="Postcode" value={form.postcode} onChangeText={v => setForm(f => ({ ...f, postcode: v }))} placeholder="E1 6AN" autoCapitalize="characters" /></View>
            </View>
            {!!addresses?.length && (
              <PressableScale style={s.saveAddr} onPress={async () => {
                if (!formValid) return;
                await addressesApi.create({ ...form, country: 'GB' });
                setForm({ name: '', line1: '', city: '', postcode: '' });
                setAdding(false);
                refetchAddr();
              }}>
                <Text style={s.saveAddrText}>Save address</Text>
              </PressableScale>
            )}
          </View>
        ) : (
          <TouchableOpacity onPress={() => setAdding(true)} style={s.addBtn} activeOpacity={0.7}>
            <Ionicons name="add" size={17} color={Colors.brand.plum} />
            <Text style={s.addBtnText}>Add a new address</Text>
          </TouchableOpacity>
        )}

        {/* Shipping */}
        <Text style={[s.sectionEye, { marginTop: 22 }]}>SHIPPING</Text>
        {shipping.map(opt => {
          const active = opt.id === shipId;
          return (
            <TouchableOpacity key={opt.id} activeOpacity={0.8} onPress={() => setShipId(opt.id)} style={[s.addr, active && s.addrActive]}>
              <Ionicons name={active ? 'radio-button-on' : 'radio-button-off'} size={18} color={active ? Colors.brand.plum : Colors.text.muted} />
              <View style={{ flex: 1 }}>
                <Text style={s.addrName}>{opt.label}</Text>
                <Text style={s.addrLine}>{opt.eta}</Text>
              </View>
              <Text style={s.shipPrice}>{opt.price === 0 ? 'Free' : `£${opt.price.toFixed(2)}`}</Text>
            </TouchableOpacity>
          );
        })}

        {/* Summary */}
        <Text style={[s.sectionEye, { marginTop: 22 }]}>ORDER SUMMARY</Text>
        <View style={s.summary}>
          <Row label="Subtotal" value={`£${estimate.subtotal.toFixed(2)}`} />
          {estimate.discount > 0 && <Row label="Discount" value={`–£${estimate.discount.toFixed(2)}`} />}
          <Row label="Shipping" value={estimate.shipping === 0 ? 'Free' : `£${estimate.shipping.toFixed(2)}`} />
          <Row label="VAT" value={`£${estimate.tax.toFixed(2)}`} />
          <View style={s.divider} />
          <Row label="Total" value={`£${estimate.total.toFixed(2)}`} bold />
        </View>
      </ScrollView>

      <View style={s.footer}>
        <PressableScale style={[s.cta, (placing || cartCount === 0) && s.ctaDisabled]} onPress={onPlaceOrder} disabled={placing || cartCount === 0}>
          {placing ? <ActivityIndicator color="#FFFFFF" /> : (
            <>
              <Ionicons name="lock-closed" size={15} color="#FFFFFF" />
              <Text style={s.ctaText}>Place Order · £{estimate.total.toFixed(2)}</Text>
            </>
          )}
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
  scroll: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 24 },
  sectionEye: { fontFamily: 'DMSans_700Bold', fontSize: 10.5, color: Colors.text.muted, letterSpacing: 1.4, marginBottom: 10 },
  addr: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14, marginBottom: 8, borderWidth: 1.5, borderColor: 'transparent' },
  addrActive: { borderColor: Colors.brand.plum },
  addrName: { fontFamily: 'DMSans_700Bold', fontSize: 14, color: Colors.text.primary },
  addrLine: { fontFamily: 'DMSans_400Regular', fontSize: 12, color: Colors.text.muted, marginTop: 2 },
  shipPrice: { fontFamily: 'DMSans_700Bold', fontSize: 13, color: Colors.brand.plum },
  form: { gap: 12, backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14 },
  row2: { flexDirection: 'row', gap: 10 },
  saveAddr: { height: 44, borderRadius: 12, backgroundColor: Colors.blush, alignItems: 'center', justifyContent: 'center' },
  saveAddrText: { fontFamily: 'DMSans_700Bold', fontSize: 13.5, color: Colors.brand.plum },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 12 },
  addBtnText: { fontFamily: 'DMSans_700Bold', fontSize: 13.5, color: Colors.brand.plum },
  summary: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, gap: 10 },
  sumRow: { flexDirection: 'row', justifyContent: 'space-between' },
  sumLabel: { fontFamily: 'DMSans_400Regular', fontSize: 13.5, color: Colors.text.secondary },
  sumValue: { fontFamily: 'DMSans_500Medium', fontSize: 13.5, color: Colors.text.primary },
  sumBold: { fontFamily: 'DMSans_700Bold', fontSize: 16, color: Colors.text.primary },
  divider: { height: 1, backgroundColor: Colors.border.light, marginVertical: 2 },
  footer: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 14, backgroundColor: Colors.ivory, borderTopWidth: 1, borderTopColor: Colors.border.light },
  cta: { height: 54, borderRadius: 15, backgroundColor: Colors.brand.plum, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  ctaDisabled: { opacity: 0.5 },
  ctaText: { fontFamily: 'DMSans_700Bold', fontSize: 15, color: '#FFFFFF' },
});
