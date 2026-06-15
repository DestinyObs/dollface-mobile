import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from './Text';
import { Colors } from '@/constants/colors';

interface Props {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}

export function Chip({ label, selected = false, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[s.chip, selected ? s.selected : s.unselected]}
    >
      <Text
        style={[
          s.label,
          { color: selected ? Colors.text.inverse : Colors.text.secondary },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 999,
    borderWidth: 1.5,
  },
  selected: {
    backgroundColor: Colors.brand.plum,
    borderColor: Colors.brand.plum,
    shadowColor: Colors.brand.plum,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 3,
  },
  unselected: {
    backgroundColor: Colors.warmWhite,
    borderColor: Colors.border.light,
  },
  label: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 13.5,
  },
});
