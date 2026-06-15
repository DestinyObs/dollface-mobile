import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Badge } from '@/components/ui/Badge';
import type { Product } from '@/types/product';

interface Props {
  product: Product;
  onPress: () => void;
}

const priceVariant = {
  BUDGET: 'success' as const,
  MID: 'champagne' as const,
  LUXURY: 'brand' as const,
};

export function ProductCard({ product, onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}
      className="w-44 bg-warm-white rounded-2xl overflow-hidden border border-border-light mr-3">
      <Image
        source={{ uri: product.imageUrl || 'https://placehold.co/180x180/F5EAEF/753248' }}
        className="w-full h-44"
        resizeMode="cover"
      />
      <View className="p-3 gap-1.5">
        <Text variant="caption" color="muted">{product.brand.name}</Text>
        <Text variant="body" weight="semibold" numberOfLines={2}>{product.name}</Text>
        <View className="flex-row items-center justify-between">
          <Badge label={product.priceRange} variant={priceVariant[product.brand.priceRange]} />
        </View>
      </View>
    </TouchableOpacity>
  );
}
