import { View, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
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

export default function BrandsScreen() {
  const { data, isLoading, isError, refetch } = useQuery({ queryKey: ['brands'], queryFn: brandsApi.list });
  const brands = data ?? [];

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <ScreenHeader title="Brands" />
      {isLoading ? (
        <ScreenLoader />
      ) : isError ? (
        <ErrorView onRetry={() => refetch()} />
      ) : brands.length === 0 ? (
        <EmptyView icon="pricetags-outline" title="No brands yet" body="Brands will appear here as our catalogue grows." />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
          {brands.map((b, i) => (
            <Reveal key={b.id} delay={i * 40}>
              <PressableScale scaleTo={0.985} style={s.card} onPress={() => router.push(`/product/brand/${b.id}` as any)}>
                <View style={s.logo}>
                  {b.logo ? <AppImage uri={b.logo} style={s.logoImg} /> : <Ionicons name="pricetag" size={22} color={Colors.brand.plum} />}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.name}>{b.name}</Text>
                  {b.description ? <Text style={s.desc} numberOfLines={2}>{b.description}</Text> : null}
                </View>
                <Ionicons name="chevron-forward" size={18} color={Colors.text.muted} />
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
  scroll: { padding: 20, gap: 12, paddingBottom: 48 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 14, shadowColor: Colors.brand.plum, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  logo: { width: 52, height: 52, borderRadius: 14, backgroundColor: Colors.blush, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  logoImg: { width: 52, height: 52 },
  name: { fontFamily: 'DMSans_700Bold', fontSize: 15, color: Colors.text.primary, marginBottom: 2 },
  desc: { fontFamily: 'DMSans_400Regular', fontSize: 12.5, color: Colors.text.muted, lineHeight: 18 },
});
