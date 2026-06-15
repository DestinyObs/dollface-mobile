import { View, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/Text';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { ScreenLoader } from '@/components/ui/ScreenLoader';
import { EmptyView } from '@/components/shared/EmptyView';
import { Reveal } from '@/components/ui/Motion';
import { useRoutines } from '@/lib/data/hooks';
import { Colors } from '@/constants/colors';

export default function RoutinesScreen() {
  const { data, isLoading } = useRoutines();
  if (isLoading) return <ScreenLoader />;
  const items = data ?? [];

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <ScreenHeader title="My Routines" />
      {items.length === 0 ? (
        <View style={s.flex}>
          <EmptyView icon="calendar-outline" title="No routines yet" body="Build a personalised morning and evening beauty routine." actionLabel="Create a Routine" onAction={() => router.push('/(tabs)/learn' as any)} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={s.list} showsVerticalScrollIndicator={false}>
          {items.map((r, i) => (
            <Reveal key={r.id} delay={i * 60}>
              <View style={s.card}>
                <View style={s.cardHead}>
                  <View style={s.icon}><Ionicons name="time-outline" size={16} color={Colors.brand.plum} /></View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.name}>{r.name}</Text>
                    <Text style={s.time}>{r.time}</Text>
                  </View>
                  <View style={s.countPill}><Text style={s.countText}>{r.steps.length} steps</Text></View>
                </View>
                <View style={s.steps}>
                  {r.steps.map((step, si) => (
                    <View key={step} style={s.stepRow}>
                      <View style={s.stepDot}><Text style={s.stepNum}>{si + 1}</Text></View>
                      <Text style={s.stepText}>{step}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </Reveal>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.ivory },
  flex: { flex: 1 },
  list: { padding: 20, gap: 12 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 16, gap: 14, shadowColor: Colors.brand.plum, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: { width: 38, height: 38, borderRadius: 12, backgroundColor: Colors.blush, alignItems: 'center', justifyContent: 'center' },
  name: { fontFamily: 'DMSans_700Bold', fontSize: 15, color: Colors.text.primary },
  time: { fontFamily: 'DMSans_400Regular', fontSize: 12, color: Colors.text.muted, marginTop: 1 },
  countPill: { backgroundColor: Colors.blush, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  countText: { fontFamily: 'DMSans_700Bold', fontSize: 10.5, color: Colors.brand.plum },
  steps: { gap: 9 },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  stepDot: { width: 22, height: 22, borderRadius: 999, backgroundColor: Colors.ivory, borderWidth: 1, borderColor: Colors.border.light, alignItems: 'center', justifyContent: 'center' },
  stepNum: { fontFamily: 'DMSans_700Bold', fontSize: 11, color: Colors.brand.plum },
  stepText: { fontFamily: 'DMSans_500Medium', fontSize: 13, color: Colors.text.secondary },
});
