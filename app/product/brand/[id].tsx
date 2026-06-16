import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/Text';
import { AppImage } from '@/components/ui/AppImage';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { ScreenLoader } from '@/components/ui/ScreenLoader';
import { EmptyView } from '@/components/shared/EmptyView';
import { ErrorView } from '@/components/shared/ErrorView';
import { PressableScale, Reveal } from '@/components/ui/Motion';
import { brandsApi } from '@/lib/data/endpoints';
import { Colors } from '@/constants/colors';

const COL_W = (Dimensions.get('window').width - 20 * 2 - 14) / 2;

export default function BrandDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['brand', id],
    queryFn: () => brandsApi.detail(String(id)),
    enabled: !!id,
  });

  if (isLoading) return <SafeAreaView style={s.root} edges={['top']}><ScreenHeader /><ScreenLoader /></SafeAreaView>;
  if (isError || !data) return <SafeAreaView style={s.root} edges={['top']}><ScreenHeader /><ErrorView onRetry={() => refetch()} /></SafeAreaView>;

  const products = data.products ?? [];

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <ScreenHeader title={data.name} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        {data.description ? <Text style={s.intro}>{data.description}</Text> : null}
        <Text style={s.count}>{products.length} product{products.length === 1 ? '' : 's'}</Text>
        {products.length === 0 ? (
          <View style={{ paddingTop: 60 }}>
            <EmptyView icon="bag-outline" title="No products yet" body="This brand's products will appear here soon." />
          </View>
        ) : (
          <View style={s.grid}>
            {products.map((p, i) => (
              <Reveal key={p.id} delay={i * 40}>
                <PressableScale scaleTo={0.97} style={s.tile} onPress={() => router.push(`/product/${p.id}` as any)}>
                  <AppImage uri={p.img} style={s.tileImg} />
                  <View style={s.tileBody}>
                    <Text style={s.tileBrand}>{p.brand}</Text>
                    <Text style={s.tileName} numberOfLines={2}>{p.name}</Text>
                    <View style={s.tileBottom}>
                      <Text style={s.tilePrice}>{p.price}</Text>
                      <View style={s.rating}><Ionicons name="star" size={11} color="#E6A817" /><Text style={s.ratingText}>{p.rating}</Text></View>
                    </View>
                  </View>
                </PressableScale>
              </Reveal>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.ivory },
  scroll: { padding: 20, paddingBottom: 48 },
  intro: { fontFamily: 'DMSans_400Regular', fontSize: 13.5, color: Colors.text.muted, lineHeight: 20, marginBottom: 12 },
  count: { fontFamily: 'DMSans_700Bold', fontSize: 13, color: Colors.text.secondary, marginBottom: 14 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  tile: { width: COL_W, backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden', shadowColor: Colors.brand.plum, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  tileImg: { width: COL_W, height: COL_W },
  tileBody: { padding: 10, gap: 3 },
  tileBrand: { fontFamily: 'DMSans_500Medium', fontSize: 11, color: Colors.text.muted },
  tileName: { fontFamily: 'DMSans_700Bold', fontSize: 13, color: Colors.text.primary, lineHeight: 17, minHeight: 34 },
  tileBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 },
  tilePrice: { fontFamily: 'DMSans_700Bold', fontSize: 13.5, color: Colors.brand.plum },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  ratingText: { fontFamily: 'DMSans_500Medium', fontSize: 11.5, color: Colors.text.secondary },
});
