import { ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/Text';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { PressableScale } from '@/components/ui/Motion';
import { View } from 'react-native';
import { Colors } from '@/constants/colors';

const SECTIONS = [
  { title: '1. Acceptance of Terms', body: 'By using DollFace, you agree to these terms. DollFace is a beauty technology platform providing personalised makeup guidance, shade matching, and look recreation.' },
  { title: '2. User Accounts', body: 'You are responsible for maintaining the confidentiality of your account credentials. You must be at least 13 years old to use DollFace.' },
  { title: '3. Privacy & Facial Data', body: 'Facial images used for shade matching are processed transiently and not permanently stored without your explicit consent. See our Privacy Policy for details.' },
  { title: '4. Intellectual Property', body: 'All content, tutorials and recommendations provided by DollFace are the property of DollFace and its licensors. Do not reproduce or redistribute without permission.' },
  { title: '5. Disclaimer', body: 'DollFace provides beauty guidance for informational purposes. Results may vary. We are not responsible for adverse reactions — always patch test new products.' },
  { title: '6. Changes to Terms', body: 'We may update these terms from time to time. Continued use after changes constitutes acceptance of the new terms.' },
];

export default function TermsScreen() {
  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <ScreenHeader title="Terms of Service" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        <Text style={s.updated}>Last updated June 2026</Text>
        {SECTIONS.map(sec => (
          <View key={sec.title} style={s.block}>
            <Text style={s.blockTitle}>{sec.title}</Text>
            <Text style={s.blockBody}>{sec.body}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={s.footer}>
        <PressableScale style={s.cta} onPress={() => router.back()}>
          <Text style={s.ctaText}>I Understand</Text>
        </PressableScale>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.ivory },
  scroll: { paddingHorizontal: 22, paddingBottom: 24 },
  updated: { fontFamily: 'DMSans_400Regular', fontSize: 12, color: Colors.text.muted, marginBottom: 18 },
  block: { marginBottom: 20 },
  blockTitle: { fontFamily: 'DMSans_700Bold', fontSize: 14.5, color: Colors.text.primary, marginBottom: 6 },
  blockBody: { fontFamily: 'DMSans_400Regular', fontSize: 13, color: Colors.text.secondary, lineHeight: 20 },
  footer: { paddingHorizontal: 22, paddingTop: 10, paddingBottom: 14, backgroundColor: Colors.ivory, borderTopWidth: 1, borderTopColor: Colors.border.light },
  cta: { height: 52, borderRadius: 15, backgroundColor: Colors.brand.plum, alignItems: 'center', justifyContent: 'center' },
  ctaText: { fontFamily: 'DMSans_700Bold', fontSize: 15, color: '#FFFFFF' },
});
