import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useToastStore, type Toast as ToastT } from '@/lib/store/toastStore';
import { Colors } from '@/constants/colors';

const CONFIG = {
  success: { icon: 'checkmark-circle' as const, color: Colors.status.success },
  error: { icon: 'alert-circle' as const, color: Colors.status.error },
  info: { icon: 'information-circle' as const, color: Colors.brand.plum },
};

function ToastRow({ toast }: { toast: ToastT }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(anim, { toValue: 1, useNativeDriver: true, speed: 14, bounciness: 6 }).start();
  }, []);
  const cfg = CONFIG[toast.type];
  return (
    <Animated.View
      style={[
        s.toast,
        { opacity: anim, transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [-16, 0] }) }] },
      ]}
    >
      <Ionicons name={cfg.icon} size={18} color={cfg.color} />
      <Text style={s.text} numberOfLines={2}>{toast.message}</Text>
    </Animated.View>
  );
}

export function Toaster() {
  const toasts = useToastStore((st) => st.toasts);
  const insets = useSafeAreaInsets();
  if (toasts.length === 0) return null;
  return (
    <View style={[s.wrap, { top: insets.top + 6 }]} pointerEvents="none">
      {toasts.map((t) => <ToastRow key={t.id} toast={t} />)}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { position: 'absolute', left: 14, right: 14, alignItems: 'center', gap: 8, zIndex: 99999 },
  toast: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#FFFFFF', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12,
    maxWidth: 360, alignSelf: 'center',
    shadowColor: Colors.charcoal, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.16, shadowRadius: 20, elevation: 10,
    borderWidth: 1, borderColor: Colors.border.light,
  },
  text: { flex: 1, fontFamily: 'DMSans_700Bold', fontSize: 13, color: Colors.text.primary },
});
