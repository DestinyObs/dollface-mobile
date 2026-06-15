import { View, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/Text';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { PressableScale, Reveal } from '@/components/ui/Motion';
import { EmptyView } from '@/components/shared/EmptyView';
import { useNotificationStore } from '@/lib/store/notificationStore';
import { toast } from '@/lib/store/toastStore';
import { Colors } from '@/constants/colors';

export default function NotificationsScreen() {
  const notifs = useNotificationStore(s => s.notifications);
  const markRead = useNotificationStore(s => s.markRead);
  const markAllRead = useNotificationStore(s => s.markAllRead);
  const unread = notifs.filter(n => !n.read).length;

  const open = (id: string, route?: string) => {
    markRead(id);
    if (route) router.push(route as any);
  };

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <ScreenHeader
        title="Notifications"
        rightIcon={unread > 0 ? 'checkmark-done-outline' : undefined}
        onRightPress={() => { markAllRead(); toast.success('All marked as read'); }}
      />
      {notifs.length === 0 ? (
        <View style={{ flex: 1 }}>
          <EmptyView icon="notifications-outline" title="You're all caught up" body="New shade matches, tutorials and updates will appear here." />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
          <Text style={s.eye}>RECENT{unread > 0 ? ` · ${unread} NEW` : ''}</Text>
          {notifs.map((n, i) => (
            <Reveal key={n.id} delay={i * 60}>
              <PressableScale scaleTo={0.99} onPress={() => open(n.id, n.route)} style={[s.card, !n.read && s.cardUnread]}>
                <View style={[s.icon, { backgroundColor: n.bg }]}><Ionicons name={n.icon} size={18} color={n.color} /></View>
                <View style={{ flex: 1 }}>
                  <View style={s.titleRow}>
                    <Text style={s.title} numberOfLines={1}>{n.title}</Text>
                    <Text style={s.time}>{n.time}</Text>
                  </View>
                  <Text style={s.body} numberOfLines={2}>{n.body}</Text>
                </View>
                {!n.read ? <View style={s.dot} /> : null}
              </PressableScale>
            </Reveal>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.ivory },
  scroll: { paddingHorizontal: 20, paddingBottom: 28 },
  eye: { fontFamily: 'DMSans_700Bold', fontSize: 10.5, color: Colors.text.muted, letterSpacing: 1.4, marginTop: 6, marginBottom: 12 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 13, marginBottom: 10, shadowColor: Colors.brand.plum, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 1 },
  cardUnread: { backgroundColor: '#FFFDFE', borderWidth: 1, borderColor: Colors.blush },
  icon: { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  title: { flex: 1, fontFamily: 'DMSans_700Bold', fontSize: 13.5, color: Colors.text.primary },
  time: { fontFamily: 'DMSans_400Regular', fontSize: 11, color: Colors.text.muted },
  body: { fontFamily: 'DMSans_400Regular', fontSize: 12, color: Colors.text.secondary, lineHeight: 17, marginTop: 2 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.brand.plum },
});
