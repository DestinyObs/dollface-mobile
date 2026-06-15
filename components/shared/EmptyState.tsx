import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';

interface Props {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export function EmptyState({ title, description, actionLabel, onAction, icon }: Props) {
  return (
    <View className="flex-1 items-center justify-center px-8 gap-4">
      {icon && <View className="mb-2">{icon}</View>}
      <Text variant="subheading" weight="semibold" color="primary" className="text-center">
        {title}
      </Text>
      {description && (
        <Text variant="body" color="muted" className="text-center leading-relaxed">
          {description}
        </Text>
      )}
      {actionLabel && onAction && (
        <View className="mt-4 w-full">
          <Button label={actionLabel} onPress={onAction} fullWidth />
        </View>
      )}
    </View>
  );
}
