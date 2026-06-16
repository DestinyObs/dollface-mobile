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
import { addressesApi } from '@/lib/data/endpoints';
import type { Address } from '@/lib/data/types';
import { toast } from '@/lib/store/toastStore';
import { confirm } from '@/lib/store/confirmStore';
import { Colors } from '@/constants/colors';

const EMPTY = { name: '', line1: '', line2: '', city: '', postcode: '', phone: '' };

export default function AddressesScreen() {
  const qc = useQueryClient();
  const { data, isLoading, isError, refetch } = useQuery({ queryKey: ['addresses'], queryFn: addressesApi.list });

  const [editing, setEditing] = useState<Address | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const addresses = data ?? [];
  const invalidate = () => qc.invalidateQueries({ queryKey: ['addresses'] });

  const openAdd = () => { setEditing(null); setForm(EMPTY); setShowForm(true); };
  const openEdit = (a: Address) => {
    setEditing(a);
    setForm({ name: a.name, line1: a.line1, line2: a.line2 ?? '', city: a.city, postcode: a.postcode, phone: a.phone ?? '' });
    setShowForm(true);
  };

  const valid = form.name.trim() && form.line1.trim() && form.city.trim() && form.postcode.trim();

  const save = async () => {
    if (!valid || saving) return;
    setSaving(true);
    try {
      const body = { ...form, country: 'GB' };
      if (editing) { await addressesApi.update(editing.id, body); toast.success('Address updated'); }
      else { await addressesApi.create(body); toast.success('Address added'); }
      setShowForm(false); setForm(EMPTY); setEditing(null);
      invalidate();
    } catch { toast.error("Couldn't save address. Try again."); }
    finally { setSaving(false); }
  };

  const remove = (a: Address) => confirm({
    title: 'Delete address?',
    message: `${a.name}, ${a.line1}`,
    confirmLabel: 'Delete',
    danger: true,
    onConfirm: async () => {
      try { await addressesApi.remove(a.id); toast.success('Address removed'); invalidate(); }
      catch { toast.error("Couldn't remove address."); }
    },
  });

  const makeDefault = async (a: Address) => {
    if (a.isDefault) return;
    try { await addressesApi.setDefault(a.id); toast.success('Default address updated'); invalidate(); }
    catch { toast.error("Couldn't update default."); }
  };

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <ScreenHeader title="Delivery Addresses" rightIcon="add" onRightPress={openAdd} />
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
                  <Text style={s.formTitle}>{editing ? 'Edit address' : 'New address'}</Text>
                  <Input label="Full name" value={form.name} onChangeText={v => setForm(f => ({ ...f, name: v }))} placeholder="Jane Doe" />
                  <Input label="Address line 1" value={form.line1} onChangeText={v => setForm(f => ({ ...f, line1: v }))} placeholder="1 Beauty Street" />
                  <Input label="Address line 2 (optional)" value={form.line2} onChangeText={v => setForm(f => ({ ...f, line2: v }))} placeholder="Flat 2" />
                  <Input label="City" value={form.city} onChangeText={v => setForm(f => ({ ...f, city: v }))} placeholder="London" />
                  <Input label="Postcode" value={form.postcode} onChangeText={v => setForm(f => ({ ...f, postcode: v }))} placeholder="E1 6AN" autoCapitalize="characters" />
                  <Input label="Phone (optional)" value={form.phone} onChangeText={v => setForm(f => ({ ...f, phone: v }))} placeholder="+44 7700 900000" keyboardType="phone-pad" />
                  <View style={s.formActions}>
                    <PressableScale style={[s.btn, s.btnGhost]} onPress={() => { setShowForm(false); setEditing(null); }}>
                      <Text style={s.btnGhostText}>Cancel</Text>
                    </PressableScale>
                    <PressableScale style={[s.btn, s.btnPrimary, !valid && s.btnDisabled]} onPress={save}>
                      <Text style={s.btnPrimaryText}>{saving ? 'Saving…' : editing ? 'Update' : 'Save address'}</Text>
                    </PressableScale>
                  </View>
                </View>
              </Reveal>
            ) : null}

            {addresses.length === 0 && !showForm ? (
              <View style={{ paddingTop: 80 }}>
                <EmptyView icon="location-outline" title="No addresses yet" body="Add a delivery address to speed up checkout." actionLabel="Add address" onAction={openAdd} />
              </View>
            ) : (
              addresses.map((a, i) => (
                <Reveal key={a.id} delay={i * 50}>
                  <View style={s.addrCard}>
                    <View style={s.addrTop}>
                      <View style={{ flex: 1 }}>
                        <View style={s.nameRow}>
                          <Text style={s.addrName}>{a.name}</Text>
                          {a.isDefault ? <View style={s.defaultPill}><Text style={s.defaultText}>Default</Text></View> : null}
                        </View>
                        <Text style={s.addrLine}>{a.line1}{a.line2 ? `, ${a.line2}` : ''}</Text>
                        <Text style={s.addrLine}>{a.city}, {a.postcode}</Text>
                        {a.phone ? <Text style={s.addrLine}>{a.phone}</Text> : null}
                      </View>
                    </View>
                    <View style={s.addrActions}>
                      {!a.isDefault ? (
                        <PressableScale style={s.actionBtn} onPress={() => makeDefault(a)}>
                          <Ionicons name="star-outline" size={15} color={Colors.brand.plum} />
                          <Text style={s.actionText}>Set default</Text>
                        </PressableScale>
                      ) : <View style={{ flex: 1 }} />}
                      <PressableScale style={s.actionBtn} onPress={() => openEdit(a)}>
                        <Ionicons name="create-outline" size={15} color={Colors.text.secondary} />
                        <Text style={[s.actionText, { color: Colors.text.secondary }]}>Edit</Text>
                      </PressableScale>
                      <PressableScale style={s.actionBtn} onPress={() => remove(a)}>
                        <Ionicons name="trash-outline" size={15} color="#C0392B" />
                        <Text style={[s.actionText, { color: '#C0392B' }]}>Delete</Text>
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
  formActions: { flexDirection: 'row', gap: 10, marginTop: 4 },
  btn: { flex: 1, height: 50, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  btnPrimary: { backgroundColor: Colors.brand.plum },
  btnPrimaryText: { fontFamily: 'DMSans_700Bold', fontSize: 14.5, color: '#FFFFFF' },
  btnGhost: { backgroundColor: Colors.blush },
  btnGhostText: { fontFamily: 'DMSans_700Bold', fontSize: 14.5, color: Colors.brand.plum },
  btnDisabled: { opacity: 0.5 },
  addrCard: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 16, gap: 12, shadowColor: Colors.brand.plum, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  addrTop: { flexDirection: 'row' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  addrName: { fontFamily: 'DMSans_700Bold', fontSize: 15, color: Colors.text.primary },
  defaultPill: { backgroundColor: Colors.blush, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 },
  defaultText: { fontFamily: 'DMSans_700Bold', fontSize: 10.5, color: Colors.brand.plum },
  addrLine: { fontFamily: 'DMSans_400Regular', fontSize: 13, color: Colors.text.muted, lineHeight: 19 },
  addrActions: { flexDirection: 'row', alignItems: 'center', gap: 6, borderTopWidth: 1, borderTopColor: Colors.ivory, paddingTop: 12 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 6, paddingVertical: 4 },
  actionText: { fontFamily: 'DMSans_500Medium', fontSize: 12.5, color: Colors.brand.plum },
});
