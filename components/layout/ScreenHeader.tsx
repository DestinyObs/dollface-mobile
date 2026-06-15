import React from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/Text';
import { PressableScale } from '@/components/ui/Motion';
import { Colors } from '@/constants/colors';

type IName = React.ComponentProps<typeof Ionicons>['name'];

/**
 * Standard light header for content/sub-screens: back button, centered title,
 * optional right action. Sits below the device status bar (safe-area aware).
 */
export function ScreenHeader({
  title,
  rightIcon,
  onRightPress,
  onBack,
  rightBadge,
}: {
  title?: string;
  rightIcon?: IName;
  onRightPress?: () => void;
  onBack?: () => void;
  rightBadge?: number;
}) {
  return (
    <View style={s.row}>
      <PressableScale style={s.btn} onPress={onBack ?? (() => router.back())}>
        <Ionicons name="arrow-back" size={20} color={Colors.text.primary} />
      </PressableScale>
      {title ? <Text style={s.title} numberOfLines={1}>{title}</Text> : <View style={{ flex: 1 }} />}
      {rightIcon ? (
        <PressableScale style={s.btn} onPress={onRightPress}>
          <Ionicons name={rightIcon} size={19} color={Colors.text.primary} />
          {rightBadge && rightBadge > 0 ? (
            <View style={s.badge}><Text style={s.badgeText}>{rightBadge > 9 ? '9+' : rightBadge}</Text></View>
          ) : null}
        </PressableScale>
      ) : (
        <View style={s.btn} />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingTop: 10, paddingBottom: 10,
  },
  btn: {
    width: 40, height: 40, borderRadius: 13, backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.brand.plum, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  title: { flex: 1, textAlign: 'center', fontFamily: 'DMSans_700Bold', fontSize: 16, color: Colors.text.primary },
  badge: { position: 'absolute', top: 4, right: 4, minWidth: 16, height: 16, borderRadius: 999, backgroundColor: Colors.brand.plum, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4, borderWidth: 1.5, borderColor: '#FFFFFF' },
  badgeText: { fontFamily: 'DMSans_700Bold', fontSize: 9, color: '#FFFFFF' },
});
