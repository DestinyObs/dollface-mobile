import { View, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/Text';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { ScreenLoader } from '@/components/ui/ScreenLoader';
import { EmptyView } from '@/components/shared/EmptyView';
import { Reveal } from '@/components/ui/Motion';
import { useScanHistory } from '@/lib/data/hooks';
import { Colors } from '@/constants/colors';

export default function ScanHistoryScreen() {
  const { data, isLoading } = useScanHistory();
  if (isLoading) return <ScreenLoader />;
  const items = data ?? [];

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <ScreenHeader title="Scan History" />
      {items.length === 0 ? (
        <View style={s.flex}>
          <EmptyView icon="scan-outline" title="No scan history" body="Selfie scans and face analyses will appear here." actionLabel="Try Shade Matching" onAction={() => router.push('/(tabs)/match' as any)} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={s.list} showsVerticalScrollIndicator={false}>
          {items.map((sc, i) => (
            <Reveal key={sc.id} delay={i * 50}>
              <View style={s.card}>
                <View style={s.icon}><Ionicons name="scan-outline" size={18} color={Colors.brand.plum} /></View>
                <View style={{ flex: 1 }}>
                  <Text style={s.tone}>{sc.tone}</Text>
                  <Text style={s.meta}>{sc.confidence} confidence</Text>
                </View>
                <Text style={s.date}>{sc.date}</Text>
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
  list: { padding: 20, gap: 10 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 13, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 13, shadowColor: Colors.brand.plum, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  icon: { width: 44, height: 44, borderRadius: 13, backgroundColor: Colors.blush, alignItems: 'center', justifyContent: 'center' },
  tone: { fontFamily: 'DMSans_700Bold', fontSize: 14, color: Colors.text.primary },
  meta: { fontFamily: 'DMSans_400Regular', fontSize: 12, color: Colors.text.muted, marginTop: 2 },
  date: { fontFamily: 'DMSans_500Medium', fontSize: 11.5, color: Colors.text.muted },
});
