import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { EmptyView } from '@/components/shared/EmptyView';
import { Colors } from '@/constants/colors';

export default function Screen() {
  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <ScreenHeader title="Match History" />
      <View style={s.flex}>
        <EmptyView icon="color-palette-outline" title="No match history" body="Your shade match results will appear here." actionLabel="Match Your Shades" onAction={() => router.push('/(tabs)/match' as any)} />
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({ root: { flex: 1, backgroundColor: Colors.ivory }, flex: { flex: 1 } });
