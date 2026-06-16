import { useState } from 'react';
import { View, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/Text';
import { Input } from '@/components/ui/Input';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { ScreenLoader } from '@/components/ui/ScreenLoader';
import { EmptyView } from '@/components/shared/EmptyView';
import { ErrorView } from '@/components/shared/ErrorView';
import { PressableScale, Reveal } from '@/components/ui/Motion';
import { paymentsApi } from '@/lib/data/endpoints';
import type { PaymentMethod } from '@/lib/data/types';
import { toast } from '@/lib/store/toastStore';
import { confirm } from '@/lib/store/confirmStore';
import { Colors } from '@/constants/colors';

const BRAND_ICON: Record<string, React.ComponentProps<typeof Ionicons>['name']> = {
  visa: 'card', mastercard: 'card', amex: 'card',
};
const EMPTY = { brand: 'visa', number: '', expMonth: '', expYear: '' };

export default function PaymentMethodsScreen() {
  const qc = useQueryClient();
  const { data, isLoading, isError, refetch } = useQuery({ queryKey: ['payment-methods'], queryFn: paymentsApi.methods });

  const [form, setForm] = useState(EMPTY);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const methods = data ?? [];
  const invalidate = () => qc.invalidateQueries({ queryKey: ['payment-methods'] });

  const digits = form.number.replace(/\D/g, '');
  const monthN = Number(form.expMonth);
  const yearN = Number(form.expYear);
  const valid = digits.length >= 12 && monthN >= 1 && monthN <= 12 && form.expYear.length === 4 && yearN >= 2024;

  const save = async () => {
    if (!valid || saving) return;
    setSaving(true);
    try {
      await paymentsApi.addMethod({ brand: form.brand, last4: digits.slice(-4), expMonth: monthN, expYear: yearN });
      toast.success('Card added');
      setShowForm(false); setForm(EMPTY); invalidate();
    } catch { toast.error("Couldn't add card. Try again."); }
    finally { setSaving(false); }
  };

  const remove = (m: PaymentMethod) => confirm({
    title: 'Remove card?',
    message: `${m.brand.toUpperCase()} ending ${m.last4}`,
    confirmLabel: 'Remove',
    danger: true,
    onConfirm: async () => {
      try { await paymentsApi.removeMethod(m.id); toast.success('Card removed'); invalidate(); }
      catch { toast.error("Couldn't remove card."); }
    },
  });

  const makeDefault = async (m: PaymentMethod) => {
    if (m.isDefault) return;
    try { await paymentsApi.setDefault(m.id); toast.success('Default card updated'); invalidate(); }
    catch { toast.error("Couldn't update default."); }
  };

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <ScreenHeader title="Payment Methods" rightIcon="add" onRightPress={() => setShowForm(true)} />
      {isLoading ? (
        <ScreenLoader />
      ) : isError ? (
        <ErrorView onRetry={() => refetch()} />
      ) : (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
            {showForm ? (
              <Reveal>
                <View style={s.card}>
                  <Text style={s.formTitle}>Add a card</Text>
                  <Input label="Card number" value={form.number} onChangeText={v => setForm(f => ({ ...f, number: v }))} placeholder="4242 4242 4242 4242" keyboardType="number-pad" maxLength={19} />
                  <View style={s.expRow}>
                    <View style={{ flex: 1 }}>
                      <Input label="Exp. month" value={form.expMonth} onChangeText={v => setForm(f => ({ ...f, expMonth: v }))} placeholder="12" keyboardType="number-pad" maxLength={2} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Input label="Exp. year" value={form.expYear} onChangeText={v => setForm(f => ({ ...f, expYear: v }))} placeholder="2030" keyboardType="number-pad" maxLength={4} />
                    </View>
                  </View>
                  <Text style={s.hint}>We never store full card numbers — only the last 4 digits and expiry.</Text>
                  <View style={s.formActions}>
                    <PressableScale style={[s.btn, s.btnGhost]} onPress={() => { setShowForm(false); setForm(EMPTY); }}>
                      <Text style={s.btnGhostText}>Cancel</Text>
                    </PressableScale>
                    <PressableScale style={[s.btn, s.btnPrimary, !valid && s.btnDisabled]} onPress={save}>
                      <Text style={s.btnPrimaryText}>{saving ? 'Saving…' : 'Add card'}</Text>
                    </PressableScale>
                  </View>
                </View>
              </Reveal>
            ) : null}

            {methods.length === 0 && !showForm ? (
              <View style={{ paddingTop: 80 }}>
                <EmptyView icon="card-outline" title="No saved cards" body="Add a card for faster checkout." actionLabel="Add card" onAction={() => setShowForm(true)} />
              </View>
            ) : (
              methods.map((m, i) => (
                <Reveal key={m.id} delay={i * 50}>
                  <View style={s.methodCard}>
                    <View style={s.methodLeft}>
                      <View style={s.cardIcon}><Ionicons name={BRAND_ICON[m.brand] ?? 'card'} size={20} color={Colors.brand.plum} /></View>
                      <View>
                        <View style={s.nameRow}>
                          <Text style={s.brandText}>{m.brand.toUpperCase()} •••• {m.last4}</Text>
                          {m.isDefault ? <View style={s.defaultPill}><Text style={s.defaultText}>Default</Text></View> : null}
                        </View>
                        <Text style={s.expText}>Expires {String(m.expMonth).padStart(2, '0')}/{m.expYear}</Text>
                      </View>
                    </View>
                    <View style={s.methodActions}>
                      {!m.isDefault ? (
                        <PressableScale style={s.iconAction} onPress={() => makeDefault(m)}>
                          <Ionicons name="star-outline" size={18} color={Colors.brand.plum} />
                        </PressableScale>
                      ) : null}
                      <PressableScale style={s.iconAction} onPress={() => remove(m)}>
                        <Ionicons name="trash-outline" size={18} color="#C0392B" />
                      </PressableScale>
                    </View>
                  </View>
                </Reveal>
              ))
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.ivory },
  scroll: { padding: 20, gap: 14, paddingBottom: 48 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 16, gap: 12, shadowColor: Colors.brand.plum, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  formTitle: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 18, color: Colors.text.primary, marginBottom: 2 },
  expRow: { flexDirection: 'row', gap: 10 },
  hint: { fontFamily: 'DMSans_400Regular', fontSize: 11.5, color: Colors.text.muted, lineHeight: 16 },
  formActions: { flexDirection: 'row', gap: 10, marginTop: 4 },
  btn: { flex: 1, height: 50, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  btnPrimary: { backgroundColor: Colors.brand.plum },
  btnPrimaryText: { fontFamily: 'DMSans_700Bold', fontSize: 14.5, color: '#FFFFFF' },
  btnGhost: { backgroundColor: Colors.blush },
  btnGhostText: { fontFamily: 'DMSans_700Bold', fontSize: 14.5, color: Colors.brand.plum },
  btnDisabled: { opacity: 0.5 },
  methodCard: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', shadowColor: Colors.brand.plum, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  methodLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  cardIcon: { width: 42, height: 42, borderRadius: 12, backgroundColor: Colors.blush, alignItems: 'center', justifyContent: 'center' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 3 },
  brandText: { fontFamily: 'DMSans_700Bold', fontSize: 14, color: Colors.text.primary },
  defaultPill: { backgroundColor: Colors.blush, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 },
  defaultText: { fontFamily: 'DMSans_700Bold', fontSize: 10.5, color: Colors.brand.plum },
  expText: { fontFamily: 'DMSans_400Regular', fontSize: 12.5, color: Colors.text.muted },
  methodActions: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  iconAction: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
});
