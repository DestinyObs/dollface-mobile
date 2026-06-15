import React from 'react';
import { ScrollView, View, KeyboardAvoidingView, Platform, ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Props extends ViewProps {
  children: React.ReactNode;
  scroll?: boolean;
  keyboard?: boolean;
  padding?: boolean;
  background?: 'ivory' | 'white' | 'blush';
  className?: string;
}

const bgStyles = {
  ivory: 'bg-ivory',
  white: 'bg-warm-white',
  blush: 'bg-blush',
};

export function Screen({
  children,
  scroll = false,
  keyboard = false,
  padding = true,
  background = 'ivory',
  className = '',
}: Props) {
  const content = scroll ? (
    <ScrollView
      className={`flex-1 ${bgStyles[background]}`}
      contentContainerClassName={`${padding ? 'px-5 py-6' : ''} pb-10`}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View className={`flex-1 ${bgStyles[background]} ${padding ? 'px-5 py-6' : ''} ${className}`}>
      {children}
    </View>
  );

  const wrapped = keyboard ? (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {content}
    </KeyboardAvoidingView>
  ) : content;

  return (
    <SafeAreaView className={`flex-1 ${bgStyles[background]}`}>
      {wrapped}
    </SafeAreaView>
  );
}
