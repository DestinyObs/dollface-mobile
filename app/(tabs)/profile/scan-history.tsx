import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { EmptyView } from '@/components/shared/EmptyView';
import { Colors } from '@/constants/colors';

export default function Screen() {
  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <ScreenHeader title="Scan History" />
      <View style={s.flex}>
        <EmptyView icon="scan-outline" title="No scan history" body="Selfie scans and face analyses will appear here." actionLabel="Try Shade Matching" onAction={() => router.push('/(tabs)/match' as any)} />
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({ root: { flex: 1, backgroundColor: Colors.ivory }, flex: { flex: 1 } });
