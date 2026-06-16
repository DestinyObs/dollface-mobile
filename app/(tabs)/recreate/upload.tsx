import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/Text';
import { PressableScale } from '@/components/ui/Motion';
import { AppImage } from '@/components/ui/AppImage';
import { toast } from '@/lib/store/toastStore';
import { Colors } from '@/constants/colors';

export default function UploadInspirationScreen() {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) { toast.error('Photo library access is needed to choose a photo.'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, quality: 0.8 });
    if (!result.canceled) setImage(result.assets[0].uri);
  };
  const takePhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) { toast.error('Camera access is needed to take a photo.'); return; }
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.8 });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <View style={s.header}>
        <PressableScale style={s.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={Colors.text.primary} />
        </PressableScale>
        <Text style={s.headerTitle}>Upload Inspiration</Text>
        <View style={s.backBtn} />
      </View>

      <View style={s.body}>
        {image ? (
          <>
            <AppImage uri={image} style={s.preview} />
            <View style={s.row}>
              <PressableScale style={[s.btn, s.btnGhost]} onPress={() => setImage(null)}>
                <Text style={s.btnGhostText}>Change</Text>
              </PressableScale>
              <PressableScale style={[s.btn, s.btnPrimary]} onPress={() => router.push({ pathname: '/(tabs)/recreate/analyzing', params: { uri: image } } as any)}>
                <Ionicons name="sparkles" size={15} color="#FFFFFF" />
                <Text style={s.btnPrimaryText}>Analyse Look</Text>
              </PressableScale>
            </View>
          </>
        ) : (
          <>
            <PressableScale style={s.dropzone} onPress={pickImage} scaleTo={0.98}>
              <View style={s.dropIcon}>
                <Ionicons name="images-outline" size={30} color={Colors.brand.plum} />
              </View>
              <Text style={s.dropTitle}>Choose from library</Text>
              <Text style={s.dropSub}>JPG, PNG or a screenshot from social</Text>
            </PressableScale>
            <PressableScale style={s.cameraBtn} onPress={takePhoto}>
              <Ionicons name="camera-outline" size={17} color={Colors.brand.plum} />
              <Text style={s.cameraText}>Take a Photo</Text>
            </PressableScale>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.ivory },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 8 },
  backBtn: { width: 40, height: 40, borderRadius: 13, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', shadowColor: Colors.brand.plum, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  headerTitle: { fontFamily: 'DMSans_700Bold', fontSize: 15, color: Colors.text.primary },

  body: { flex: 1, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16, gap: 12 },
  dropzone: {
    flex: 1, borderRadius: 24, backgroundColor: Colors.blush,
    borderWidth: 1.5, borderColor: Colors.rose, borderStyle: 'dashed',
    alignItems: 'center', justifyContent: 'center', gap: 12,
  },
  dropIcon: { width: 64, height: 64, borderRadius: 20, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  dropTitle: { fontFamily: 'DMSans_700Bold', fontSize: 15, color: Colors.brand.plum },
  dropSub: { fontFamily: 'DMSans_400Regular', fontSize: 12.5, color: Colors.text.muted },
  cameraBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 54, borderRadius: 16, backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: Colors.border.default },
  cameraText: { fontFamily: 'DMSans_700Bold', fontSize: 14.5, color: Colors.brand.plum },

  preview: { flex: 1, width: '100%', borderRadius: 24 },
  row: { flexDirection: 'row', gap: 12 },
  btn: { flex: 1, height: 54, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  btnGhost: { backgroundColor: Colors.blush },
  btnGhostText: { fontFamily: 'DMSans_700Bold', fontSize: 14.5, color: Colors.brand.plum },
  btnPrimary: { backgroundColor: Colors.brand.plum },
  btnPrimaryText: { fontFamily: 'DMSans_700Bold', fontSize: 14.5, color: '#FFFFFF' },
});
