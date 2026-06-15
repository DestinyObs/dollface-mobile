import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';

interface Props extends ViewProps {
  variant?: 'default' | 'elevated' | 'outlined' | 'blush' | 'plum';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const variantStyle = {
  default: { backgroundColor: Colors.warmWhite },
  elevated: {
    backgroundColor: Colors.warmWhite,
    shadowColor: Colors.charcoal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  outlined: { backgroundColor: Colors.warmWhite, borderWidth: 1, borderColor: Colors.border.light },
  blush: { backgroundColor: Colors.blush },
  plum: { backgroundColor: Colors.brand.plum },
};

const paddingStyle = {
  none: 0,
  sm: 12,
  md: 16,
  lg: 24,
};

export function Card({ variant = 'default', padding = 'md', style, children, ...props }: Props) {
  return (
    <View
      style={[
        s.base,
        variantStyle[variant],
        { padding: paddingStyle[padding] },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

const s = StyleSheet.create({
  base: { borderRadius: 20 },
});
