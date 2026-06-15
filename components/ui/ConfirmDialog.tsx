import { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Pressable } from 'react-native';
import { Text } from '@/components/ui/Text';
import { PressableScale } from '@/components/ui/Motion';
import { useConfirmStore } from '@/lib/store/confirmStore';
import { Colors } from '@/constants/colors';

export function ConfirmDialog() {
  const config = useConfirmStore((s) => s.config);
  const close = useConfirmStore((s) => s.close);
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(anim, { toValue: config ? 1 : 0, useNativeDriver: true, speed: 16, bounciness: 5 }).start();
  }, [config]);

  if (!config) return null;

  return (
    <View style={s.overlayWrap} pointerEvents="box-none">
      <Animated.View style={[s.backdrop, { opacity: anim }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={close} />
      </Animated.View>
      <Animated.View style={[s.dialog, { opacity: anim, transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] }) }] }]}>
        <Text style={s.title}>{config.title}</Text>
        <Text style={s.message}>{config.message}</Text>
        <View style={s.actions}>
          <PressableScale style={[s.btn, s.cancel]} onPress={close}>
            <Text style={s.cancelText}>{config.cancelLabel ?? 'Cancel'}</Text>
          </PressableScale>
          <PressableScale style={[s.btn, config.danger ? s.danger : s.confirm]} onPress={() => { config.onConfirm(); close(); }}>
            <Text style={s.confirmText}>{config.confirmLabel ?? 'Confirm'}</Text>
          </PressableScale>
        </View>
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  overlayWrap: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', zIndex: 99998, padding: 28 },
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(20,5,11,0.5)' },
  dialog: { width: '100%', maxWidth: 340, backgroundColor: '#FFFFFF', borderRadius: 22, padding: 22, shadowColor: '#000', shadowOffset: { width: 0, height: 16 }, shadowOpacity: 0.3, shadowRadius: 30, elevation: 20 },
  title: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 19, color: Colors.text.primary, marginBottom: 8 },
  message: { fontFamily: 'DMSans_400Regular', fontSize: 13.5, color: Colors.text.secondary, lineHeight: 20, marginBottom: 20 },
  actions: { flexDirection: 'row', gap: 10 },
  btn: { flex: 1, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  cancel: { backgroundColor: Colors.ivory, borderWidth: 1.5, borderColor: Colors.border.light },
  cancelText: { fontFamily: 'DMSans_700Bold', fontSize: 14, color: Colors.text.secondary },
  confirm: { backgroundColor: Colors.brand.plum },
  danger: { backgroundColor: Colors.status.error },
  confirmText: { fontFamily: 'DMSans_700Bold', fontSize: 14, color: '#FFFFFF' },
});
