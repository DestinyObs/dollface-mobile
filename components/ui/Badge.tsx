import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from './Text';
import { Colors } from '@/constants/colors';

interface Props {
  label: string;
  variant?: 'brand' | 'blush' | 'champagne' | 'success' | 'muted';
  size?: 'sm' | 'md';
}

const bgMap: Record<string, string> = {
  brand: Colors.brand.plum,
  blush: Colors.blush,
  champagne: Colors.champagne,
  success: '#F0FBF4',
  muted: Colors.ivory,
};

const textMap: Record<string, string> = {
  brand: Colors.text.inverse,
  blush: Colors.brand.plum,
  champagne: Colors.text.secondary,
  success: Colors.status.success,
  muted: Colors.text.muted,
};

export function Badge({ label, variant = 'blush', size = 'sm' }: Props) {
  return (
    <View
      style={[
        s.base,
        { backgroundColor: bgMap[variant] },
        size === 'md' && s.lg,
      ]}
    >
      <Text
        style={[s.text, { color: textMap[variant], fontSize: size === 'md' ? 13 : 11 }]}
      >
        {label}
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  base: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  lg: {
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  text: {
    fontSize: 11,
    fontWeight: '500',
  },
});
