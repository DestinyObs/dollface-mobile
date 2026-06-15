import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/Text';
import { PressableScale, Reveal } from '@/components/ui/Motion';
import { Colors } from '@/constants/colors';

type IName = React.ComponentProps<typeof Ionicons>['name'];

export function PermissionScreen({
  icon,
  title,
  body,
  bullets,
  primaryLabel,
  onPrimary,
  onSkip,
}: {
  icon: IName;
  title: string;
  body: string;
  bullets?: { icon: IName; text: string }[];
  primaryLabel: string;
  onPrimary: () => void;
  onSkip: () => void;
}) {
  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <View style={s.content}>
        <Reveal delay={40} style={s.top}>
          <View style={s.iconHalo}>
            <View style={s.iconWrap}>
              <Ionicons name={icon} size={40} color={Colors.brand.plum} />
            </View>
          </View>
          <Text style={s.title}>{title}</Text>
          <Text style={s.body}>{body}</Text>
        </Reveal>

        {bullets ? (
          <Reveal delay={160} style={s.bullets}>
            {bullets.map(b => (
              <View key={b.text} style={s.bulletRow}>
                <View style={s.bulletIcon}>
                  <Ionicons name={b.icon} size={16} color={Colors.brand.plum} />
                </View>
                <Text style={s.bulletText}>{b.text}</Text>
              </View>
            ))}
          </Reveal>
        ) : null}
      </View>

      <View style={s.cta}>
        <PressableScale style={s.primaryBtn} onPress={onPrimary}>
          <Text style={s.primaryText}>{primaryLabel}</Text>
        </PressableScale>
        <PressableScale style={s.skipBtn} onPress={onSkip}>
          <Text style={s.skipText}>Skip for now</Text>
        </PressableScale>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.ivory },
  content: { flex: 1, paddingHorizontal: 28, justifyContent: 'center', gap: 32 },

  top: { alignItems: 'center' },
  iconHalo: {
    width: 116, height: 116, borderRadius: 999,
    backgroundColor: Colors.blush,
    alignItems: 'center', justifyContent: 'center', marginBottom: 28,
  },
  iconWrap: {
    width: 88, height: 88, borderRadius: 999, backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.brand.plum, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.12, shadowRadius: 16, elevation: 4,
  },
  title: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 24, color: Colors.text.primary, textAlign: 'center', marginBottom: 12 },
  body: { fontFamily: 'DMSans_400Regular', fontSize: 14.5, color: Colors.text.secondary, textAlign: 'center', lineHeight: 22, paddingHorizontal: 6 },

  bullets: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, gap: 16, shadowColor: Colors.brand.plum, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 2 },
  bulletRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  bulletIcon: { width: 34, height: 34, borderRadius: 11, backgroundColor: Colors.blush, alignItems: 'center', justifyContent: 'center' },
  bulletText: { flex: 1, fontFamily: 'DMSans_500Medium', fontSize: 13.5, color: Colors.text.primary },

  cta: { paddingHorizontal: 24, paddingBottom: 8, gap: 10 },
  primaryBtn: {
    height: 58, borderRadius: 16, backgroundColor: Colors.brand.plum,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.brand.plum, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.28, shadowRadius: 16, elevation: 6,
  },
  primaryText: { fontFamily: 'DMSans_700Bold', fontSize: 16, color: '#FFFFFF' },
  skipBtn: { height: 50, alignItems: 'center', justifyContent: 'center' },
  skipText: { fontFamily: 'DMSans_700Bold', fontSize: 15, color: Colors.text.muted },
});
