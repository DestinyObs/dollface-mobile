import { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/Text';
import { recreateApi } from '@/lib/data/endpoints';
import { Colors } from '@/constants/colors';

const STEPS = [
  'Detecting face features',
  'Analysing base makeup',
  'Reading eye & brow technique',
  'Matching shades to your profile',
  'Building your personalised look',
];

export default function AnalyzingScreen() {
  const [active, setActive] = useState(0);
  const spin = useRef(new Animated.Value(0)).current;
  const recId = useRef<string | null>(null);

  useEffect(() => {
    // Kick off the real analysis; navigate to whatever id the API returns.
    recreateApi.upload(new FormData()).then(r => { recId.current = r.id; }).catch(() => {});

    Animated.loop(Animated.timing(spin, { toValue: 1, duration: 1400, easing: Easing.linear, useNativeDriver: true })).start();
    const iv = setInterval(() => setActive(a => Math.min(a + 1, STEPS.length)), 680);
    const done = setTimeout(() => router.replace(`/(tabs)/recreate/${recId.current ?? 'mock-recreation-id'}` as any), 3600);
    return () => { clearInterval(iv); clearTimeout(done); };
  }, []);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <View style={s.root}>
      <LinearGradient colors={['#2D0F1A', '#753248']} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
        <View style={s.center}>
          <View style={s.ring}>
            <Animated.View style={[s.spinner, { transform: [{ rotate }] }]} />
            <Ionicons name="sparkles" size={30} color="#FFFFFF" />
          </View>
          <Text style={s.title}>Analysing your look</Text>
          <Text style={s.sub}>This takes a few seconds — we're personalising every step for your features.</Text>
        </View>

        <View style={s.steps}>
          {STEPS.map((step, i) => {
            const state = i < active ? 'done' : i === active ? 'active' : 'pending';
            return (
              <View key={step} style={[s.stepRow, state === 'pending' && s.stepPending]}>
                <View style={[s.stepDot, state === 'done' && s.stepDotDone, state === 'active' && s.stepDotActive]}>
                  {state === 'done'
                    ? <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                    : <Text style={s.stepNum}>{i + 1}</Text>}
                </View>
                <Text style={s.stepText}>{step}</Text>
              </View>
            );
          })}
        </View>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#2D0F1A' },
  safe: { flex: 1, paddingHorizontal: 28, justifyContent: 'center', gap: 36 },
  center: { alignItems: 'center' },
  ring: { width: 88, height: 88, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center', marginBottom: 22 },
  spinner: { position: 'absolute', width: 88, height: 88, borderRadius: 999, borderWidth: 3, borderColor: 'transparent', borderTopColor: Colors.rose },
  title: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 24, color: '#FFFFFF', marginBottom: 8 },
  sub: { fontFamily: 'DMSans_400Regular', fontSize: 13, color: 'rgba(255,255,255,0.7)', textAlign: 'center', lineHeight: 19, paddingHorizontal: 8 },

  steps: { gap: 8 },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12 },
  stepPending: { opacity: 0.45 },
  stepDot: { width: 22, height: 22, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  stepDotActive: { backgroundColor: Colors.rose },
  stepDotDone: { backgroundColor: Colors.status.success },
  stepNum: { fontFamily: 'DMSans_700Bold', fontSize: 11, color: '#FFFFFF' },
  stepText: { fontFamily: 'DMSans_500Medium', fontSize: 13, color: '#FFFFFF' },
});
