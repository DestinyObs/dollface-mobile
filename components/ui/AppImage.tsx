import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, ImageStyle } from 'react-native';
import { Image } from 'expo-image';

/**
 * Neutral blur placeholder shown while the real image loads,
 * then a smooth crossfade in — kills the "pop-in" jank.
 */
const PLACEHOLDER = 'L9AwODxu00WB~qj[ayfQ00WB%MfQ';
const TRANSITION = 350;

export function AppImage({
  uri,
  style,
  contentFit = 'cover',
}: {
  uri: string;
  style?: StyleProp<ImageStyle>;
  contentFit?: 'cover' | 'contain' | 'fill';
}) {
  return (
    <Image
      source={{ uri }}
      style={style as any}
      contentFit={contentFit}
      transition={TRANSITION}
      placeholder={{ blurhash: PLACEHOLDER }}
      cachePolicy="memory-disk"
    />
  );
}

/**
 * Drop-in replacement for react-native's <ImageBackground>:
 * full-bleed expo-image behind, children overlaid on top.
 */
export function AppImageBackground({
  uri,
  style,
  imageStyle,
  children,
}: {
  uri: string;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  children?: React.ReactNode;
}) {
  return (
    <View style={style}>
      <Image
        source={{ uri }}
        style={[StyleSheet.absoluteFill, imageStyle] as any}
        contentFit="cover"
        transition={TRANSITION}
        placeholder={{ blurhash: PLACEHOLDER }}
        cachePolicy="memory-disk"
      />
      {children}
    </View>
  );
}
