import { useRef, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Text } from '@/components/ui/Text';
import { PressableScale } from '@/components/ui/Motion';
import { matchApi } from '@/lib/data/endpoints';
import { toast } from '@/lib/store/toastStore';
import { Colors } from '@/constants/colors';

const TIPS = ['Natural light', 'No filter', 'Face forward', 'No glasses'];

/** Build the multipart payload the backend's upload.single('selfie') expects. */
function toForm(uri: string): FormData {
  const form = new FormData();
  // React Native file shape — RN serialises this to a real multipart file part.
  form.append('selfie', { uri, name: 'selfie.jpg', type: 'image/jpeg' } as any);
  return form;
}

export default function SelfieCaptureScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);

  const analyse = async (uri: string) => {
    setBusy(true);
    try {
      const result = await matchApi.selfie(toForm(uri));
      router.replace(`/(tabs)/match/results/${result.id}` as any);
    } catch {
      toast.error('Scan failed — please try again.');
      setBusy(false);
    }
  };

  const handleCapture = async () => {
    if (busy || !ready || !cameraRef.current) return;
    setBusy(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7, skipProcessing: true });
      if (!photo?.uri) throw new Error('no-photo');
      await analyse(photo.uri);
    } catch {
      toast.error('Could not capture — try again or pick from your library.');
      setBusy(false);
    }
  };

  const pickFromLibrary = async () => {
    if (busy) return;
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7 });
    if (!res.canceled && res.assets[0]?.uri) await analyse(res.assets[0].uri);
  };

  // ── Permission gate ──────────────────────────────────────
  if (!permission) {
    return <SafeAreaView style={s.root}><View style={s.center}><ActivityIndicator color="#FFFFFF" /></View></SafeAreaView>;
  }
  if (!permission.granted) {
    return (
      <SafeAreaView style={s.root} edges={['top', 'bottom']}>
        <View style={s.topBar}>
          <PressableScale style={s.iconBtn} onPress={() => router.back()}><Ionicons name="close" size={20} color="#FFFFFF" /></PressableScale>
          <Text style={s.topTitle}>Shade Scan</Text>
          <View style={s.iconBtn} />
        </View>
        <View style={s.center}>
          <Ionicons name="camera-outline" size={56} color="rgba(255,255,255,0.5)" />
          <Text style={s.permTitle}>Camera access needed</Text>
          <Text style={s.permBody}>We use your camera to analyse your skin tone for an accurate shade match. Your photo is processed for the match and not shared.</Text>
          <PressableScale style={s.permBtn} onPress={requestPermission}><Text style={s.permBtnText}>Enable camera</Text></PressableScale>
          <Text style={s.libLink} onPress={pickFromLibrary}>Or choose a photo instead</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ── Live camera ──────────────────────────────────────────
  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <View style={s.topBar}>
        <PressableScale style={s.iconBtn} onPress={() => router.back()}><Ionicons name="close" size={20} color="#FFFFFF" /></PressableScale>
        <Text style={s.topTitle}>Shade Scan</Text>
        <PressableScale style={s.iconBtn} onPress={pickFromLibrary}><Ionicons name="images-outline" size={18} color="#FFFFFF" /></PressableScale>
      </View>

      <View style={s.viewfinderWrap}>
        <View style={s.viewfinder}>
          <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing="front" onCameraReady={() => setReady(true)} />
          <View style={[s.corner, s.cornerTL]} />
          <View style={[s.corner, s.cornerTR]} />
          <View style={[s.corner, s.cornerBL]} />
          <View style={[s.corner, s.cornerBR]} />
        </View>
        <Text style={s.hint}>Position your face in natural light{'\n'}for the most accurate match</Text>
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
        <PressableScale style={s.shutter} onPress={handleCapture} scaleTo={0.92} disabled={busy || !ready}>
          {busy ? <ActivityIndicator color={Colors.brand.plum} /> : <View style={s.shutterInner} />}
        </PressableScale>
        <Text style={s.cancel} onPress={() => router.back()}>{busy ? 'Analysing…' : 'Cancel'}</Text>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.charcoal },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, paddingHorizontal: 36 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 8 },
  iconBtn: { width: 40, height: 40, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center' },
  topTitle: { fontFamily: 'DMSans_700Bold', fontSize: 15, color: '#FFFFFF' },

  permTitle: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 22, color: '#FFFFFF', marginTop: 6 },
  permBody: { fontFamily: 'DMSans_400Regular', fontSize: 13.5, color: 'rgba(255,255,255,0.65)', textAlign: 'center', lineHeight: 20 },
  permBtn: { marginTop: 10, height: 50, borderRadius: 15, backgroundColor: '#FFFFFF', paddingHorizontal: 30, alignItems: 'center', justifyContent: 'center' },
  permBtnText: { fontFamily: 'DMSans_700Bold', fontSize: 14.5, color: Colors.brand.plum },
  libLink: { fontFamily: 'DMSans_700Bold', fontSize: 13.5, color: 'rgba(255,255,255,0.7)', marginTop: 6 },

  viewfinderWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 24, paddingHorizontal: 24 },
  viewfinder: { width: 280, height: 380, borderRadius: 32, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.04)' },
  corner: { position: 'absolute', width: 34, height: 34, borderColor: Colors.rose },
  cornerTL: { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 24 },
  cornerTR: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 24 },
  cornerBL: { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 24 },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 24 },
  hint: { fontFamily: 'DMSans_400Regular', fontSize: 12.5, color: 'rgba(255,255,255,0.6)', textAlign: 'center', lineHeight: 18, paddingHorizontal: 24 },

  tips: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 },
  tipChip: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7 },
  tipText: { fontFamily: 'DMSans_500Medium', fontSize: 12, color: 'rgba(255,255,255,0.85)' },

  controls: { alignItems: 'center', paddingVertical: 20, gap: 16 },
  shutter: { width: 76, height: 76, borderRadius: 999, borderWidth: 4, borderColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  shutterInner: { width: 58, height: 58, borderRadius: 999, backgroundColor: '#FFFFFF' },
  cancel: { fontFamily: 'DMSans_700Bold', fontSize: 14, color: 'rgba(255,255,255,0.6)' },
});
