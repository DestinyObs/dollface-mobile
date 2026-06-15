import { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '@/components/ui/Text';
import { Colors } from '@/constants/colors';

/**
 * Branded splash shown while fonts/state hydrate.
 * Monogram scales/fades in, wordmark rises, a hairline shimmer sweeps.
 */
export function BrandSplash() {
  const mark = useRef(new Animated.Value(0)).current;
  const word = useRef(new Animated.Value(0)).current;
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(mark, { toValue: 1, useNativeDriver: true, speed: 6, bounciness: 8 }),
      Animated.timing(word, { toValue: 1, duration: 480, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
    Animated.loop(
      Animated.timing(shimmer, { toValue: 1, duration: 1600, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
    ).start();
  }, []);

  const wordY = word.interpolate({ inputRange: [0, 1], outputRange: [14, 0] });
  const shimmerX = shimmer.interpolate({ inputRange: [0, 1], outputRange: [-60, 60] });

  return (
    <View style={s.root}>
      <LinearGradient colors={['#2D0F1A', '#753248', '#5C2739']} style={StyleSheet.absoluteFill} />
      <View style={s.glow} />

      <View style={s.center}>
        <Animated.View style={[s.monogram, { opacity: mark, transform: [{ scale: mark }] }]}>
          <View style={s.monoMark} />
        </Animated.View>

        <Animated.View style={{ opacity: word, transform: [{ translateY: wordY }] }}>
          <Text style={s.wordmark}>DollFace</Text>
          <View style={s.ruleRow}>
            <Animated.View style={[s.shimmer, { transform: [{ translateX: shimmerX }] }]} />
          </View>
          <Text style={s.tagline}>BEAUTY, PERSONALISED</Text>
        </Animated.View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#2D0F1A', alignItems: 'center', justifyContent: 'center' },
  glow: { position: 'absolute', width: 380, height: 380, borderRadius: 999, backgroundColor: 'rgba(216,167,184,0.12)' },
  center: { alignItems: 'center' },
  monogram: {
    width: 72, height: 72, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 22,
  },
  monoMark: { width: 26, height: 26, borderRadius: 7, backgroundColor: '#FFFFFF', transform: [{ rotate: '45deg' }] },
  wordmark: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 42, color: '#FFFFFF', textAlign: 'center', letterSpacing: 0.5 },
  ruleRow: { height: 2, width: 120, alignSelf: 'center', marginTop: 14, marginBottom: 14, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 1, overflow: 'hidden' },
  shimmer: { width: 40, height: 2, backgroundColor: 'rgba(255,255,255,0.7)' },
  tagline: { fontFamily: 'DMSans_700Bold', fontSize: 11, color: 'rgba(255,255,255,0.6)', letterSpacing: 3, textAlign: 'center' },
});
