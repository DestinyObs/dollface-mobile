import React from 'react';
import { TouchableOpacity, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { Text } from './Text';
import { Colors } from '@/constants/colors';

interface Props {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'white';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  className?: string;
}

const variantBg: Record<string, string> = {
  primary: Colors.brand.plum,
  secondary: Colors.blush,
  ghost: 'transparent',
  danger: '#C0392B',
  white: Colors.warmWhite,
};

const labelColor: Record<string, 'inverse' | 'brand' | 'primary'> = {
  primary: 'inverse',
  secondary: 'brand',
  ghost: 'inverse',
  danger: 'inverse',
  white: 'brand',
};

const sizePadding: Record<string, { paddingHorizontal: number; paddingVertical: number; borderRadius: number }> = {
  sm: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 },
  md: { paddingHorizontal: 24, paddingVertical: 14, borderRadius: 16 },
  lg: { paddingHorizontal: 32, paddingVertical: 16, borderRadius: 16 },
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  className: _className,
}: Props) {
  const bg = variantBg[variant];
  const sz = sizePadding[size];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        s.base,
        {
          backgroundColor: bg,
          ...sz,
          ...(fullWidth ? { width: '100%' } : {}),
          ...(variant === 'secondary' ? { borderWidth: 1, borderColor: Colors.brand.plum } : {}),
          ...(disabled || loading ? { opacity: 0.5 } : {}),
        },
        style,
      ]}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'danger' ? '#fff' : Colors.brand.plum}
        />
      )}
      <Text variant="label" weight="semibold" color={labelColor[variant]} style={s.label}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  label: { fontSize: 16 },
});
