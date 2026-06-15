import { View, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/Text';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { ScreenLoader } from '@/components/ui/ScreenLoader';
import { EmptyView } from '@/components/shared/EmptyView';
import { PressableScale, Reveal } from '@/components/ui/Motion';
import { useMatchHistory } from '@/lib/data/hooks';
import { Colors } from '@/constants/colors';

export default function MatchHistoryScreen() {
  const { data, isLoading } = useMatchHistory();
  if (isLoading) return <ScreenLoader />;
  const items = data ?? [];

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <ScreenHeader title="Match History" />
      {items.length === 0 ? (
        <View style={s.flex}>
          <EmptyView icon="color-palette-outline" title="No match history" body="Your shade match results will appear here." actionLabel="Match Your Shades" onAction={() => router.push('/(tabs)/match' as any)} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={s.list} showsVerticalScrollIndicator={false}>
          {items.map((m, i) => (
            <Reveal key={m.id} delay={i * 50}>
              <PressableScale scaleTo={0.985} onPress={() => router.push(`/(tabs)/match/results/${m.id}` as any)} style={s.card}>
                <View style={[s.swatch, { backgroundColor: m.color }]} />
                <View style={{ flex: 1 }}>
                  <Text style={s.name}>{m.name}</Text>
                  <Text style={s.meta}>{m.brand} · {m.pct} match</Text>
                </View>
                <Text style={s.date}>{m.date}</Text>
              </PressableScale>
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
  list: { padding: 20, gap: 10 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 13, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 13, shadowColor: Colors.brand.plum, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  swatch: { width: 44, height: 44, borderRadius: 13, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
  name: { fontFamily: 'DMSans_700Bold', fontSize: 14, color: Colors.text.primary },
  meta: { fontFamily: 'DMSans_400Regular', fontSize: 12, color: Colors.text.muted, marginTop: 2 },
  date: { fontFamily: 'DMSans_500Medium', fontSize: 11.5, color: Colors.text.muted },
});
