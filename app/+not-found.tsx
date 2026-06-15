import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/Text';
import { PressableScale } from '@/components/ui/Motion';
import { Colors } from '@/constants/colors';

export default function NotFoundScreen() {
  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <View style={s.center}>
        <View style={s.halo}>
          <View style={s.iconWrap}><Ionicons name="compass-outline" size={34} color={Colors.brand.plum} /></View>
        </View>
        <Text style={s.title}>Page not found</Text>
        <Text style={s.body}>The page you're looking for doesn't exist or has moved.</Text>
        <PressableScale style={s.cta} onPress={() => router.replace('/(tabs)')}>
          <Ionicons name="home-outline" size={16} color="#FFFFFF" />
          <Text style={s.ctaText}>Go Home</Text>
        </PressableScale>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.ivory },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  halo: { width: 104, height: 104, borderRadius: 999, backgroundColor: Colors.blush, alignItems: 'center', justifyContent: 'center', marginBottom: 22 },
  iconWrap: { width: 78, height: 78, borderRadius: 999, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', shadowColor: Colors.brand.plum, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.1, shadowRadius: 14, elevation: 3 },
  title: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 22, color: Colors.text.primary, marginBottom: 8 },
  body: { fontFamily: 'DMSans_400Regular', fontSize: 13.5, color: Colors.text.muted, textAlign: 'center', lineHeight: 20, marginBottom: 26 },
  cta: { height: 52, borderRadius: 15, backgroundColor: Colors.brand.plum, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 32 },
  ctaText: { fontFamily: 'DMSans_700Bold', fontSize: 15, color: '#FFFFFF' },
});
