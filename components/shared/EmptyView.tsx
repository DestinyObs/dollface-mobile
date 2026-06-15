import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/Text';
import { PressableScale } from '@/components/ui/Motion';
import { Colors } from '@/constants/colors';

type IName = React.ComponentProps<typeof Ionicons>['name'];

export function EmptyView({
  icon,
  title,
  body,
  actionLabel,
  onAction,
}: {
  icon: IName;
  title: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={s.wrap}>
      <View style={s.halo}>
        <View style={s.iconWrap}><Ionicons name={icon} size={32} color={Colors.brand.plum} /></View>
      </View>
      <Text style={s.title}>{title}</Text>
      <Text style={s.body}>{body}</Text>
      {actionLabel && onAction ? (
        <PressableScale style={s.btn} onPress={onAction}>
          <Text style={s.btnText}>{actionLabel}</Text>
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
  btn: { marginTop: 24, height: 50, borderRadius: 15, backgroundColor: Colors.brand.plum, paddingHorizontal: 28, alignItems: 'center', justifyContent: 'center' },
  btnText: { fontFamily: 'DMSans_700Bold', fontSize: 14.5, color: '#FFFFFF' },
});
