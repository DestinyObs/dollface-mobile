import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Badge } from '@/components/ui/Badge';
import type { Tutorial } from '@/types/tutorial';

interface Props {
  tutorial: Tutorial;
  onPress: () => void;
  horizontal?: boolean;
}

export function TutorialCard({ tutorial, onPress, horizontal = false }: Props) {
  const difficultyVariant = {
    BEGINNER: 'success' as const,
    INTERMEDIATE: 'champagne' as const,
    ADVANCED: 'brand' as const,
  }[tutorial.difficulty];

  if (horizontal) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}
        className="flex-row bg-warm-white rounded-2xl overflow-hidden border border-border-light mb-3">
        <Image
          source={{ uri: tutorial.thumbnailUrl || 'https://placehold.co/100x100/F5EAEF/753248' }}
          className="w-24 h-24"
          resizeMode="cover"
        />
        <View className="flex-1 p-3 gap-1.5 justify-center">
          <Text variant="body" weight="semibold" numberOfLines={2}>{tutorial.title}</Text>
          <View className="flex-row items-center gap-2">
            <Badge label={tutorial.difficulty} variant={difficultyVariant} />
            <Text variant="caption" color="muted">{tutorial.duration} min</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}
      className="w-48 bg-warm-white rounded-2xl overflow-hidden border border-border-light mr-3">
      <Image
        source={{ uri: tutorial.thumbnailUrl || 'https://placehold.co/200x140/F5EAEF/753248' }}
        className="w-full h-32"
        resizeMode="cover"
      />
      <View className="p-3 gap-1.5">
        <Text variant="body" weight="semibold" numberOfLines={2}>{tutorial.title}</Text>
        <View className="flex-row items-center gap-2">
          <Badge label={tutorial.difficulty} variant={difficultyVariant} />
          <Text variant="caption" color="muted">{tutorial.duration} min</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
