import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { EmptyView } from '@/components/shared/EmptyView';
import { Colors } from '@/constants/colors';

export default function SavedTutorialsScreen() {
  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <ScreenHeader title="Saved Tutorials" />
      <View style={s.flex}>
        <EmptyView
          icon="bookmark-outline"
          title="No saved tutorials yet"
          body="Tap the bookmark on any tutorial to keep it here for later."
          actionLabel="Browse Tutorials"
          onAction={() => router.push('/(tabs)/learn')}
        />
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.ivory },
  flex: { flex: 1 },
});
