import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from '@/components/ui/Text';

interface Props {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
}

export function Header({ title, subtitle, showBack = false, rightAction }: Props) {
  const router = useRouter();

  return (
    <View className="flex-row items-center justify-between px-5 pt-2 pb-4">
      <View className="flex-row items-center gap-3 flex-1">
        {showBack && (
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-blush items-center justify-center"
            activeOpacity={0.7}
          >
            <Text className="text-brand-plum text-lg">←</Text>
          </TouchableOpacity>
        )}
        <View className="flex-1">
          {title && (
            <Text variant="subheading" weight="bold" color="primary">
              {title}
            </Text>
          )}
          {subtitle && (
            <Text variant="caption" color="muted">
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {rightAction && <View>{rightAction}</View>}
    </View>
  );
}
