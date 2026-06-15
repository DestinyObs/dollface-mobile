import React from 'react';
import { Text as RNText, TextProps, TextStyle, StyleProp } from 'react-native';
import { Colors } from '@/constants/colors';

interface Props extends TextProps {
  variant?: 'heading' | 'subheading' | 'body' | 'caption' | 'label';
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  color?: 'primary' | 'secondary' | 'muted' | 'inverse' | 'brand';
  className?: string;
  style?: StyleProp<TextStyle>;
}

const variantClasses: Record<NonNullable<Props['variant']>, string> = {
  heading: 'text-2xl',
  subheading: 'text-lg',
  body: 'text-base',
  caption: 'text-sm',
  label: 'text-xs',
};

const weightClasses: Record<NonNullable<Props['weight']>, string> = {
  regular: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

// Colors applied via inline style so they always render correctly on web
const colorMap: Record<NonNullable<Props['color']>, string> = {
  primary: Colors.text.primary,
  secondary: Colors.text.secondary,
  muted: Colors.text.muted,
  inverse: Colors.text.inverse,
  brand: Colors.brand.plum,
};

export function Text({
  variant = 'body',
  weight = 'regular',
  color = 'primary',
  className = '',
  style,
  ...props
}: Props) {
  return (
    <RNText
      className={`${variantClasses[variant]} ${weightClasses[weight]} ${className}`}
      style={[{ color: colorMap[color] }, style]}
      {...props}
    />
  );
}
