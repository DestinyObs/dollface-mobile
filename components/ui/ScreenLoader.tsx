import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';

/** Centered brand spinner for screens awaiting their first data load. */
export function ScreenLoader() {
  return (
    <View style={s.wrap}>
      <ActivityIndicator color={Colors.brand.plum} />
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.ivory },
});
