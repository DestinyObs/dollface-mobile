import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/Text';
import { PressableScale } from '@/components/ui/Motion';
import { Colors } from '@/constants/colors';

/**
 * Standard error state for data screens: a friendly message plus a retry action.
 * Mirrors EmptyView so loading → empty → error read as one visual family.
 */
export function ErrorView({
  title = "Couldn't load this",
  body = 'Something went wrong. Check your connection and try again.',
  onRetry,
  retryLabel = 'Try again',
}: {
  title?: string;
  body?: string;
  onRetry?: () => void;
  retryLabel?: string;
}) {
  return (
    <View style={s.wrap}>
      <View style={s.halo}>
        <View style={s.iconWrap}><Ionicons name="cloud-offline-outline" size={32} color={Colors.brand.plum} /></View>
      </View>
      <Text style={s.title}>{title}</Text>
      <Text style={s.body}>{body}</Text>
      {onRetry ? (
        <PressableScale style={s.btn} onPress={onRetry}>
          <Ionicons name="refresh" size={16} color="#FFFFFF" />
          <Text style={s.btnText}>{retryLabel}</Text>
        </PressableScale>
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, paddingBottom: 60 },
  halo: { width: 104, height: 104, borderRadius: 999, backgroundColor: Colors.blush, alignItems: 'center', justifyContent: 'center', marginBottom: 22 },
  iconWrap: { width: 78, height: 78, borderRadius: 999, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', shadowColor: Colors.brand.plum, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.1, shadowRadius: 14, elevation: 3 },
  title: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 21, color: Colors.text.primary, textAlign: 'center', marginBottom: 8 },
  body: { fontFamily: 'DMSans_400Regular', fontSize: 13.5, color: Colors.text.muted, textAlign: 'center', lineHeight: 20 },
  btn: { marginTop: 24, height: 50, borderRadius: 15, backgroundColor: Colors.brand.plum, paddingHorizontal: 28, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  btnText: { fontFamily: 'DMSans_700Bold', fontSize: 14.5, color: '#FFFFFF' },
});
