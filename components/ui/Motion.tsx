import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, Easing, ViewStyle, StyleProp, GestureResponderEvent } from 'react-native';

/* ──────────────────────────────────────────────
 * PressableScale — tactile press feedback (scale + dim).
 * Uses the core Animated API (reliable on web + native).
 * ────────────────────────────────────────────── */
export function PressableScale({
  children,
  onPress,
  style,
  scaleTo = 0.96,
  disabled,
  hitSlop,
}: {
  children: React.ReactNode;
  onPress?: (e: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
  scaleTo?: number;
  disabled?: boolean;
  hitSlop?: number;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const to = (v: number) =>
    Animated.spring(scale, { toValue: v, useNativeDriver: true, speed: 40, bounciness: 4 }).start();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={hitSlop}
      onPressIn={() => to(scaleTo)}
      onPressOut={() => to(1)}
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>{children}</Animated.View>
    </Pressable>
  );
}

/* ──────────────────────────────────────────────
 * Reveal — entrance animation (fade + rise).
 * Pass `delay` to stagger a list/grid.
 * ────────────────────────────────────────────── */
export function Reveal({
  children,
  delay = 0,
  y = 16,
  duration = 460,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [y, 0] });

  return (
    <Animated.View style={[style, { opacity: progress, transform: [{ translateY }] }]}>
      {children}
    </Animated.View>
  );
}
