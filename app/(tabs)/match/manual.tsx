import { useState } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/Text';
import { Input } from '@/components/ui/Input';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { PressableScale } from '@/components/ui/Motion';
import { matchApi } from '@/lib/data/endpoints';
import { toast } from '@/lib/store/toastStore';
import { Colors } from '@/constants/colors';

const CATEGORIES = ['Foundation', 'Concealer', 'Powder', 'Blush', 'Bronzer', 'Lip'];

export default function ManualShadeScreen() {
  const [shade, setShade] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('Foundation');
  const [busy, setBusy] = useState(false);

  const onFind = async () => {
    if (!shade.trim() || busy) return;
    setBusy(true);
    try {
      const result = await matchApi.manual({ shade: shade.trim(), brand: brand.trim() || undefined, category });
      router.push(`/(tabs)/match/results/${result.id}` as any);
    } catch {
      toast.error('Could not find matches. Try again.');
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <ScreenHeader title="Enter Shade" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        <Text style={s.lead}>Tell us what you're currently using and we'll find cross-brand alternatives that match.</Text>

        <View style={s.form}>
          <Input label="Your current shade" placeholder="e.g. NC35, 220 Natural Beige" value={shade} onChangeText={setShade}
            leftIcon={<Ionicons name="color-palette-outline" size={17} color={Colors.text.muted} />} />
          <Input label="Brand (optional)" placeholder="e.g. MAC, Fenty Beauty" value={brand} onChangeText={setBrand}
            leftIcon={<Ionicons name="pricetag-outline" size={17} color={Colors.text.muted} />} />

          <View>
            <Text style={s.label}>Category</Text>
            <View style={s.chips}>
              {CATEGORIES.map(c => (
                <PressableScale key={c} scaleTo={0.95} onPress={() => setCategory(c)} style={[s.chip, category === c && s.chipActive]}>
                  <Text style={[s.chipText, { color: category === c ? '#FFFFFF' : Colors.text.secondary }]}>{c}</Text>
                </PressableScale>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={s.footer}>
        <PressableScale style={[s.cta, (!shade.trim() || busy) && s.ctaDisabled]} onPress={onFind} disabled={!shade.trim() || busy}>
          {busy ? <ActivityIndicator color="#FFFFFF" /> : (
            <>
              <Text style={s.ctaText}>Find Matches</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
            </>
          )}
        </PressableScale>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.ivory },
  scroll: { paddingHorizontal: 22, paddingTop: 8, paddingBottom: 24 },
  lead: { fontFamily: 'DMSans_400Regular', fontSize: 13.5, color: Colors.text.secondary, lineHeight: 20, marginBottom: 22 },
  form: { gap: 18 },
  label: { fontFamily: 'DMSans_700Bold', fontSize: 12, color: Colors.text.secondary, marginBottom: 10 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 15, paddingVertical: 9, borderRadius: 999, backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: Colors.border.light },
  chipActive: { backgroundColor: Colors.brand.plum, borderColor: Colors.brand.plum },
  chipText: { fontFamily: 'DMSans_700Bold', fontSize: 12.5 },

  footer: { paddingHorizontal: 22, paddingTop: 10, paddingBottom: 14, backgroundColor: Colors.ivory, borderTopWidth: 1, borderTopColor: Colors.border.light },
  cta: { height: 54, borderRadius: 15, backgroundColor: Colors.brand.plum, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  ctaDisabled: { opacity: 0.45 },
  ctaText: { fontFamily: 'DMSans_700Bold', fontSize: 15, color: '#FFFFFF' },
});
