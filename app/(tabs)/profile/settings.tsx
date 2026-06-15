import { useState } from 'react';
import { View, ScrollView, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/Text';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { toast } from '@/lib/store/toastStore';
import { Colors } from '@/constants/colors';

type IName = React.ComponentProps<typeof Ionicons>['name'];

export default function SettingsScreen() {
  const [push, setPush] = useState(true);
  const [email, setEmail] = useState(false);
  const [tips, setTips] = useState(true);

  const toggles: { icon: IName; label: string; value: boolean; set: (v: boolean) => void; bg: string; color: string }[] = [
    { icon: 'notifications-outline', label: 'Push notifications', value: push, set: setPush, bg: Colors.blush, color: Colors.brand.plum },
    { icon: 'mail-outline', label: 'Email updates', value: email, set: setEmail, bg: '#EAF0FB', color: '#3B5BDB' },
    { icon: 'sparkles-outline', label: 'Weekly beauty tips', value: tips, set: setTips, bg: '#EAF7EF', color: '#2F7D52' },
  ];

  const links: { group: string; items: { icon: IName; label: string; route?: string; toastMsg?: string }[] }[] = [
    { group: 'Account', items: [
      { icon: 'person-outline', label: 'Edit profile', route: '/(tabs)/profile/edit' },
      { icon: 'lock-closed-outline', label: 'Privacy & data', route: '/(tabs)/profile/privacy' },
      { icon: 'diamond-outline', label: 'Subscription', route: '/(tabs)/profile/subscription' },
    ]},
    { group: 'Support', items: [
      { icon: 'help-circle-outline', label: 'Help center', toastMsg: 'Opening help center…' },
      { icon: 'chatbubble-ellipses-outline', label: 'Contact us', toastMsg: 'support@dollface.app' },
      { icon: 'star-outline', label: 'Rate DollFace', toastMsg: 'Thanks for your support!' },
    ]},
    { group: 'About', items: [
      { icon: 'document-text-outline', label: 'Terms of Service', route: '/(auth)/terms' },
      { icon: 'shield-checkmark-outline', label: 'Privacy Policy', route: '/(auth)/privacy' },
    ]},
  ];

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <ScreenHeader title="Settings" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        <Text style={s.groupEye}>NOTIFICATIONS</Text>
        <View style={s.card}>
          {toggles.map((t, i) => (
            <View key={t.label} style={[s.row, i < toggles.length - 1 && s.divider]}>
              <View style={[s.icon, { backgroundColor: t.bg }]}><Ionicons name={t.icon} size={16} color={t.color} /></View>
              <Text style={s.rowLabel}>{t.label}</Text>
              <Switch value={t.value} onValueChange={t.set}
                trackColor={{ false: '#E0D6DA', true: Colors.brand.plum }} thumbColor="#FFFFFF" />
            </View>
          ))}
        </View>

        {links.map(group => (
          <View key={group.group}>
            <Text style={s.groupEye}>{group.group.toUpperCase()}</Text>
            <View style={s.card}>
              {group.items.map((item, i) => (
                <TouchableOpacity key={item.label} activeOpacity={0.7}
                  onPress={() => item.route ? router.push(item.route as any) : item.toastMsg && toast.info(item.toastMsg)}
                  style={[s.row, i < group.items.length - 1 && s.divider]}>
                  <View style={[s.icon, { backgroundColor: Colors.ivory }]}><Ionicons name={item.icon} size={16} color={Colors.text.secondary} /></View>
                  <Text style={s.rowLabel}>{item.label}</Text>
                  <Ionicons name="chevron-forward" size={15} color={Colors.text.muted} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <Text style={s.version}>DollFace · Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.ivory },
  scroll: { paddingHorizontal: 20, paddingBottom: 28 },
  groupEye: { fontFamily: 'DMSans_700Bold', fontSize: 10.5, color: Colors.text.muted, letterSpacing: 1.4, marginBottom: 10, marginTop: 18 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden', shadowColor: Colors.brand.plum, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 13, paddingVertical: 12, minHeight: 56 },
  divider: { borderBottomWidth: 1, borderBottomColor: Colors.border.light },
  icon: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  rowLabel: { flex: 1, fontFamily: 'DMSans_500Medium', fontSize: 13.5, color: Colors.text.primary },
  version: { fontFamily: 'DMSans_400Regular', fontSize: 11.5, color: Colors.text.muted, textAlign: 'center', marginTop: 24 },
});
