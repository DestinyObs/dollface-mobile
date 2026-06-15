import { useState } from 'react';
import { View, ScrollView, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/Text';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { confirm } from '@/lib/store/confirmStore';
import { toast } from '@/lib/store/toastStore';
import { Colors } from '@/constants/colors';

type IName = React.ComponentProps<typeof Ionicons>['name'];

export default function PrivacyScreen() {
  const [analytics, setAnalytics] = useState(true);
  const [personalise, setPersonalise] = useState(true);
  const [storeScans, setStoreScans] = useState(false);

  const toggles: { icon: IName; label: string; desc: string; value: boolean; set: (v: boolean) => void }[] = [
    { icon: 'bar-chart-outline', label: 'Usage analytics', desc: 'Help improve DollFace with anonymous data', value: analytics, set: setAnalytics },
    { icon: 'sparkles-outline', label: 'Personalisation', desc: 'Tailor recommendations to your profile', value: personalise, set: setPersonalise },
    { icon: 'image-outline', label: 'Store scan history', desc: 'Keep selfie analyses for future reference', value: storeScans, set: setStoreScans },
  ];

  const actions: { icon: IName; label: string; danger?: boolean; onPress: () => void }[] = [
    { icon: 'download-outline', label: 'Download my data', onPress: () => toast.success("We'll email your data export shortly") },
    { icon: 'trash-outline', label: 'Delete account', danger: true, onPress: () => confirm({
      title: 'Delete account?',
      message: 'This permanently erases your profile, matches and saved items. This cannot be undone.',
      confirmLabel: 'Delete',
      danger: true,
      onConfirm: () => toast.error('Account deletion requested'),
    }) },
  ];

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <ScreenHeader title="Privacy & Data" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        <Text style={s.lead}>You control your data. Selfies are processed privately and never shared with third parties.</Text>

        <Text style={s.groupEye}>DATA CONTROLS</Text>
        <View style={s.card}>
          {toggles.map((t, i) => (
            <View key={t.label} style={[s.row, i < toggles.length - 1 && s.divider]}>
              <View style={s.icon}><Ionicons name={t.icon} size={16} color={Colors.brand.plum} /></View>
              <View style={{ flex: 1 }}>
                <Text style={s.rowLabel}>{t.label}</Text>
                <Text style={s.rowDesc}>{t.desc}</Text>
              </View>
              <Switch value={t.value} onValueChange={t.set} trackColor={{ false: '#E0D6DA', true: Colors.brand.plum }} thumbColor="#FFFFFF" />
            </View>
          ))}
        </View>

        <Text style={s.groupEye}>YOUR DATA</Text>
        <View style={s.card}>
          {actions.map((a, i) => (
            <TouchableOpacity key={a.label} activeOpacity={0.7} onPress={a.onPress} style={[s.row, i < actions.length - 1 && s.divider]}>
              <View style={[s.icon, a.danger && { backgroundColor: '#FFF0EE' }]}>
                <Ionicons name={a.icon} size={16} color={a.danger ? Colors.status.error : Colors.text.secondary} />
              </View>
              <Text style={[s.rowLabel, a.danger && { color: Colors.status.error }]}>{a.label}</Text>
              <Ionicons name="chevron-forward" size={15} color={Colors.text.muted} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity onPress={() => router.push('/(auth)/privacy')} style={s.policyLink} hitSlop={6}>
          <Text style={s.policyText}>Read our full Privacy Policy</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.ivory },
  scroll: { paddingHorizontal: 20, paddingBottom: 28 },
  lead: { fontFamily: 'DMSans_400Regular', fontSize: 13, color: Colors.text.secondary, lineHeight: 19, marginTop: 6 },
  groupEye: { fontFamily: 'DMSans_700Bold', fontSize: 10.5, color: Colors.text.muted, letterSpacing: 1.4, marginBottom: 10, marginTop: 20 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden', shadowColor: Colors.brand.plum, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 13, paddingVertical: 12, minHeight: 56 },
  divider: { borderBottomWidth: 1, borderBottomColor: Colors.border.light },
  icon: { width: 32, height: 32, borderRadius: 10, backgroundColor: Colors.blush, alignItems: 'center', justifyContent: 'center' },
  rowLabel: { fontFamily: 'DMSans_700Bold', fontSize: 13.5, color: Colors.text.primary },
  rowDesc: { fontFamily: 'DMSans_400Regular', fontSize: 11, color: Colors.text.muted, marginTop: 1 },
  policyLink: { alignItems: 'center', paddingVertical: 20 },
  policyText: { fontFamily: 'DMSans_700Bold', fontSize: 13, color: Colors.brand.plum },
});
