import { ScrollView, View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/Text';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { PressableScale } from '@/components/ui/Motion';
import { Colors } from '@/constants/colors';

const SECTIONS = [
  { title: 'What We Collect', body: 'We collect your name, email and beauty profile preferences. When you use shade matching or recreation, we process images temporarily to generate results.' },
  { title: 'Facial Data', body: 'Facial images are never stored permanently unless you explicitly save a scan. Analysis is transient, and you can delete all scan history any time from your profile.' },
  { title: 'How We Use Your Data', body: 'To personalise recommendations, improve our AI models in aggregate, and send relevant beauty content. We never sell your personal data.' },
  { title: 'Your Rights', body: 'You can access, correct or delete your personal data at any time, and export your data or delete your account from Settings → Privacy.' },
  { title: 'Data Security', body: 'All data is encrypted in transit and at rest using industry-standard practices, with strict access controls on stored images.' },
  { title: 'GDPR & CCPA', body: 'DollFace is designed with GDPR and CCPA compliance in mind. EU and California residents have additional rights under their regulations.' },
  { title: 'Contact', body: 'For any privacy concerns, contact privacy@dollface.app. We respond within 72 hours.' },
];

export default function PrivacyPolicyScreen() {
  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <ScreenHeader title="Privacy Policy" />
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
          <Text style={s.ctaText}>Got It</Text>
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
