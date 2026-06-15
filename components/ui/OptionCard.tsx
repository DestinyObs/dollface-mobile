import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from './Text';
import { PressableScale } from './Motion';
import { Colors } from '@/constants/colors';

type IName = React.ComponentProps<typeof Ionicons>['name'];

export function OptionCard({
  icon,
  label,
  desc,
  selected,
  onPress,
}: {
  icon: IName;
  label: string;
  desc?: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <PressableScale onPress={onPress} scaleTo={0.98} style={[s.card, selected && s.cardSelected]}>
      <View style={[s.iconWrap, selected && s.iconWrapSelected]}>
        <Ionicons name={icon} size={22} color={selected ? '#FFFFFF' : Colors.brand.plum} />
      </View>
      <View style={s.textWrap}>
        <Text style={[s.label, selected ? s.labelSelected : null]}>{label}</Text>
        {desc ? <Text style={[s.desc, selected ? s.descSelected : null]}>{desc}</Text> : null}
      </View>
      <View style={[s.check, selected && s.checkSelected]}>
        {selected && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
      </View>
    </PressableScale>
  );
}

const s = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: Colors.border.light,
  },
  cardSelected: {
    borderColor: Colors.brand.plum,
    backgroundColor: '#FFFFFF',
    shadowColor: Colors.brand.plum,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 3,
  },
  iconWrap: {
    width: 48, height: 48, borderRadius: 15,
    backgroundColor: Colors.blush,
    alignItems: 'center', justifyContent: 'center',
  },
  iconWrapSelected: { backgroundColor: Colors.brand.plum },
  textWrap: { flex: 1 },
  label: { fontFamily: 'DMSans_700Bold', fontSize: 15.5, color: Colors.text.primary },
  labelSelected: { color: Colors.brand.plum },
  desc: { fontFamily: 'DMSans_400Regular', fontSize: 12.5, color: Colors.text.muted, marginTop: 3, lineHeight: 17 },
  descSelected: { color: Colors.text.secondary },
  check: {
    width: 24, height: 24, borderRadius: 999,
    borderWidth: 1.5, borderColor: Colors.border.default,
    alignItems: 'center', justifyContent: 'center',
  },
  checkSelected: { backgroundColor: Colors.brand.plum, borderColor: Colors.brand.plum },
});
