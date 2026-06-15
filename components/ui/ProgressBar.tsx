import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from './Text';
import { Colors } from '@/constants/colors';

interface Props {
  progress: number;
  showLabel?: boolean;
  label?: string;
  height?: number;
}

export function ProgressBar({ progress, showLabel = false, label, height = 6 }: Props) {
  const pct = Math.min(100, Math.max(0, progress));
  return (
    <View style={s.wrap}>
      {(showLabel || label) && (
        <View style={s.labelRow}>
          {label && <Text style={s.label}>{label}</Text>}
          {showLabel && <Text style={s.pct}>{pct}%</Text>}
        </View>
      )}
      <View style={[s.track, { height }]}>
        <View style={[s.fill, { width: `${pct}%` as any }]} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { gap: 4 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { fontSize: 12, color: Colors.text.muted },
  pct: { fontSize: 12, fontWeight: '600', color: Colors.brand.plum },
  track: { backgroundColor: Colors.blush, borderRadius: 999, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: Colors.brand.plum, borderRadius: 999 },
});
