import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, Platform, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';

type IName = React.ComponentProps<typeof Ionicons>['name'];

const TABS: { name: string; icon: IName; iconFilled: IName; label: string }[] = [
  { name: 'index',    icon: 'home-outline',          iconFilled: 'home',          label: 'Home'     },
  { name: 'learn',    icon: 'book-outline',          iconFilled: 'book',          label: 'Learn'    },
  { name: 'match',    icon: 'color-palette-outline', iconFilled: 'color-palette', label: 'Match'    },
  { name: 'recreate', icon: 'sparkles-outline',      iconFilled: 'sparkles',      label: 'Recreate' },
  { name: 'profile',  icon: 'person-outline',        iconFilled: 'person',        label: 'You'      },
];

function FloatingTabBar({ state, navigation }: any) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[bar.wrap, { paddingBottom: Math.max(insets.bottom, 14) }]} pointerEvents="box-none">
      <View style={bar.pill}>
        {state.routes.map((route: any, index: number) => {
          const tab = TABS.find(t => t.name === route.name);
          if (!tab) return null;
          const focused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
          };

          return (
            <Pressable key={route.key} onPress={onPress} style={bar.item} hitSlop={6}>
              <View style={[bar.tab, focused && bar.tabActive]}>
                <Ionicons
                  name={focused ? tab.iconFilled : tab.icon}
                  size={20}
                  color={focused ? '#FFFFFF' : Colors.text.muted}
                />
                {focused && <Text style={bar.label} numberOfLines={1}>{tab.label}</Text>}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <FloatingTabBar {...props} />}
    >
      {TABS.map(tab => (
        <Tabs.Screen key={tab.name} name={tab.name} />
      ))}
    </Tabs>
  );
}

const bar = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
  },
  pill: {
    width: '100%',
    maxWidth: 380,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',   // fixed-width bar — never resizes per tab
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingHorizontal: 10,
    paddingVertical: 8,
    shadowColor: Colors.charcoal,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 12,
    borderWidth: Platform.OS === 'web' ? 1 : 0,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  item: { alignItems: 'center', justifyContent: 'center' },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    width: 44,
    borderRadius: 22,
  },
  tabActive: {
    width: 'auto',
    paddingHorizontal: 16,
    gap: 8,
    backgroundColor: Colors.brand.plum,
  },
  label: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 13,
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
});
