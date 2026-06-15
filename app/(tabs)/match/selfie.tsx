import { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/Text';
import { PressableScale } from '@/components/ui/Motion';
import { matchApi } from '@/lib/data/endpoints';
import { toast } from '@/lib/store/toastStore';
import { Colors } from '@/constants/colors';

const TIPS = ['Natural light', 'No filter', 'Face forward', 'No glasses'];

export default function SelfieCaptureScreen() {
  const [busy, setBusy] = useState(false);

  const handleCapture = async () => {
    if (busy) return;
    setBusy(true);
    try {
      // Send the captured frame for analysis; the API returns the match result.
      const result = await matchApi.selfie(new FormData());
      router.replace(`/(tabs)/match/results/${result.id}` as any);
    } catch {
      toast.error('Scan failed — please try again.');
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <View style={s.topBar}>
        <PressableScale style={s.iconBtn} onPress={() => router.back()}>
          <Ionicons name="close" size={20} color="#FFFFFF" />
        </PressableScale>
        <Text style={s.topTitle}>Shade Scan</Text>
        <View style={s.iconBtn} />
      </View>

      <View style={s.viewfinderWrap}>
        <View style={s.viewfinder}>
          <View style={[s.corner, s.cornerTL]} />
          <View style={[s.corner, s.cornerTR]} />
          <View style={[s.corner, s.cornerBL]} />
          <View style={[s.corner, s.cornerBR]} />
          <View style={s.faceIcon}>
            <Ionicons name="happy-outline" size={64} color="rgba(255,255,255,0.4)" />
          </View>
          <Text style={s.hint}>Position your face in natural light{'\n'}for the most accurate match</Text>
        </View>

        <View style={s.tips}>
          {TIPS.map(t => (
            <View key={t} style={s.tipChip}>
              <Ionicons name="checkmark-circle" size={13} color={Colors.rose} />
              <Text style={s.tipText}>{t}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={s.controls}>
        <PressableScale style={s.shutter} onPress={handleCapture} scaleTo={0.92} disabled={busy}>
          {busy ? <ActivityIndicator color={Colors.brand.plum} /> : <View style={s.shutterInner} />}
        </PressableScale>
        <Text style={s.cancel} onPress={() => router.back()}>{busy ? 'Analysing…' : 'Cancel'}</Text>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.charcoal },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 8 },
  iconBtn: { width: 40, height: 40, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center' },
  topTitle: { fontFamily: 'DMSans_700Bold', fontSize: 15, color: '#FFFFFF' },

  viewfinderWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 28, paddingHorizontal: 24 },
  viewfinder: {
    width: 280, height: 380, borderRadius: 32, alignItems: 'center', justifyContent: 'center', gap: 18,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  corner: { position: 'absolute', width: 34, height: 34, borderColor: Colors.rose },
  cornerTL: { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 24 },
  cornerTR: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 24 },
  cornerBL: { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 24 },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 24 },
  faceIcon: { alignItems: 'center', justifyContent: 'center' },
  hint: { fontFamily: 'DMSans_400Regular', fontSize: 12.5, color: 'rgba(255,255,255,0.6)', textAlign: 'center', lineHeight: 18, paddingHorizontal: 24 },

  tips: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 },
  tipChip: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7 },
  tipText: { fontFamily: 'DMSans_500Medium', fontSize: 12, color: 'rgba(255,255,255,0.85)' },

  controls: { alignItems: 'center', paddingVertical: 20, gap: 16 },
  shutter: { width: 76, height: 76, borderRadius: 999, borderWidth: 4, borderColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  shutterInner: { width: 58, height: 58, borderRadius: 999, backgroundColor: '#FFFFFF' },
  cancel: { fontFamily: 'DMSans_700Bold', fontSize: 14, color: 'rgba(255,255,255,0.6)' },
});
