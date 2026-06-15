import { View, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/Text';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { ScreenLoader } from '@/components/ui/ScreenLoader';
import { EmptyView } from '@/components/shared/EmptyView';
import { PressableScale, Reveal } from '@/components/ui/Motion';
import { ordersApi } from '@/lib/data/endpoints';
import { Colors } from '@/constants/colors';

const STATUS_COLOR: Record<string, string> = {
  PAID: '#2F7D52', PROCESSING: '#A06A2C', SHIPPED: '#3B5BDB', DELIVERED: '#2F7D52', CANCELLED: '#C0392B', PENDING: '#A06A2C', REFUNDED: '#8B6A4F',
};

export default function OrdersScreen() {
  const { data, isLoading } = useQuery({ queryKey: ['orders'], queryFn: ordersApi.list });
  if (isLoading) return <ScreenLoader />;
  const orders = data ?? [];

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <ScreenHeader title="My Orders" />
      {orders.length === 0 ? (
        <View style={{ flex: 1 }}>
          <EmptyView icon="bag-handle-outline" title="No orders yet" body="Your orders will appear here once you check out." actionLabel="Browse Shop" onAction={() => router.replace('/product')} />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
          {orders.map((o, i) => (
            <Reveal key={o.id} delay={i * 50}>
              <PressableScale scaleTo={0.985} onPress={() => router.push(`/product/order/${o.id}` as any)} style={s.card}>
                <View style={s.cardTop}>
                  <Text style={s.orderId}>Order #{o.id.slice(-6).toUpperCase()}</Text>
                  <View style={[s.statusPill, { backgroundColor: `${STATUS_COLOR[o.status] ?? Colors.text.muted}1A` }]}>
                    <Text style={[s.statusText, { color: STATUS_COLOR[o.status] ?? Colors.text.muted }]}>{o.status}</Text>
                  </View>
                </View>
                <Text style={s.meta}>{o.items.length} item{o.items.length === 1 ? '' : 's'} · {new Date(o.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</Text>
                <View style={s.cardBottom}>
                  <Text style={s.total}>£{o.total.toFixed(2)}</Text>
                  <Ionicons name="chevron-forward" size={16} color={Colors.text.muted} />
                </View>
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
  scroll: { padding: 20, gap: 12 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, gap: 8, shadowColor: Colors.brand.plum, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  orderId: { fontFamily: 'DMSans_700Bold', fontSize: 14.5, color: Colors.text.primary },
  statusPill: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  statusText: { fontFamily: 'DMSans_700Bold', fontSize: 10 },
  meta: { fontFamily: 'DMSans_400Regular', fontSize: 12, color: Colors.text.muted },
  cardBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  total: { fontFamily: 'DMSans_700Bold', fontSize: 16, color: Colors.text.primary },
});
