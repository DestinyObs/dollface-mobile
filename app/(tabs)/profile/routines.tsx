import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { EmptyView } from '@/components/shared/EmptyView';
import { Colors } from '@/constants/colors';

export default function Screen() {
  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <ScreenHeader title="My Routines" />
      <View style={s.flex}>
        <EmptyView icon="calendar-outline" title="No routines yet" body="Build a personalised morning and evening beauty routine." actionLabel="Create a Routine" onAction={() => router.push('/(tabs)/learn' as any)} />
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({ root: { flex: 1, backgroundColor: Colors.ivory }, flex: { flex: 1 } });
