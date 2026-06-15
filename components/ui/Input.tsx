import React, { useState } from 'react';
import { View, TextInput, TextInputProps, StyleSheet, Platform } from 'react-native';
import { Text } from './Text';
import { Colors } from '@/constants/colors';

interface Props extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Input({ label, error, hint, leftIcon, rightIcon, ...props }: Props) {
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? Colors.status.error
    : focused
    ? Colors.brand.plum
    : Colors.border.default;

  return (
    <View style={s.wrapper}>
      {label && <Text style={s.label}>{label}</Text>}
      <View style={[s.field, { borderColor }, focused && s.focused]}>
        {leftIcon && <View style={s.leftSlot}>{leftIcon}</View>}
        <TextInput
          style={s.input}
          placeholderTextColor={Colors.text.muted}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
        {rightIcon && <View style={s.rightSlot}>{rightIcon}</View>}
      </View>
      {error ? (
        <Text style={s.error}>{error}</Text>
      ) : hint ? (
        <Text style={s.hint}>{hint}</Text>
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  wrapper: { gap: 6 },
  label: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 12,
    color: Colors.text.secondary,
    letterSpacing: 0.2,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.warmWhite,
    borderWidth: 1.5,
    borderRadius: 13,
    paddingHorizontal: 14,
    height: 52,
  },
  focused: { backgroundColor: '#FFFBFD' },
  leftSlot: { marginRight: 10 },
  rightSlot: { marginLeft: 10 },
  input: {
    flex: 1,
    fontFamily: 'DMSans_400Regular',
    fontSize: 14.5,
    color: Colors.text.primary,
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' as any } : {}),
  },
  error: { fontFamily: 'DMSans_400Regular', fontSize: 11.5, color: Colors.status.error },
  hint: { fontFamily: 'DMSans_400Regular', fontSize: 11.5, color: Colors.text.muted },
});
