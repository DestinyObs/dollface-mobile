import { useState } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/Text';
import { Input } from '@/components/ui/Input';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { PressableScale } from '@/components/ui/Motion';
import { AppImage } from '@/components/ui/AppImage';
import { useAuthStore } from '@/lib/store/authStore';
import { toast } from '@/lib/store/toastStore';
import { meApi } from '@/lib/data/endpoints';
import { Colors } from '@/constants/colors';
import { Img } from '@/constants/images';

export default function EditProfileScreen() {
  const user = useAuthStore(s => s.user);
  const setUser = useAuthStore(s => s.setUser);
  const [name, setName] = useState(user?.name ?? '');
  const [bio, setBio] = useState((user as any)?.bio ?? '');
  const [avatar, setAvatar] = useState<string | undefined>(user?.avatarUrl);
  const [saving, setSaving] = useState(false);

  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.8 });
    if (!result.canceled) setAvatar(result.assets[0].uri);
  };

  const onSave = async () => {
    if (!name.trim() || saving) return;
    setSaving(true);
    try {
      const updated = await meApi.update({ name: name.trim(), bio: bio.trim(), avatarUrl: avatar });
      if (user) setUser({ ...user, name: updated.name, avatarUrl: updated.avatarUrl });
      toast.success('Profile updated');
      router.back();
    } catch {
      toast.error('Could not save — try again.');
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <ScreenHeader title="Edit Profile" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        <View style={s.avatarWrap}>
          <AppImage uri={avatar ?? Img.avatar} style={s.avatar} />
          <PressableScale style={s.avatarBtn} onPress={pickAvatar}>
            <Ionicons name="camera" size={15} color="#FFFFFF" />
          </PressableScale>
        </View>
        <Text style={s.changePhoto} onPress={pickAvatar}>Change photo</Text>

        <View style={s.form}>
          <Input label="Name" placeholder="Your name" value={name} onChangeText={setName}
            leftIcon={<Ionicons name="person-outline" size={17} color={Colors.text.muted} />} />
          <Input label="Bio" placeholder="A little about you" value={bio} onChangeText={setBio} multiline
            leftIcon={<Ionicons name="create-outline" size={17} color={Colors.text.muted} />} />
          <Input label="Email" value={user?.email ?? ''} editable={false}
            leftIcon={<Ionicons name="mail-outline" size={17} color={Colors.text.muted} />} />
          <Text style={s.hint}>To change your email, go to Settings → Privacy.</Text>
        </View>
      </ScrollView>

      <View style={s.footer}>
        <PressableScale style={[s.cta, (!name.trim() || saving) && s.ctaDisabled]} onPress={onSave} disabled={!name.trim() || saving}>
          {saving ? <ActivityIndicator color="#FFFFFF" /> : <Text style={s.ctaText}>Save Changes</Text>}
        </PressableScale>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.ivory },
  scroll: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 24, alignItems: 'center' },
  avatarWrap: { width: 104, height: 104, marginTop: 8 },
  avatar: { width: 104, height: 104, borderRadius: 999 },
  avatarBtn: { position: 'absolute', bottom: 0, right: 0, width: 34, height: 34, borderRadius: 999, backgroundColor: Colors.brand.plum, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: Colors.ivory },
  changePhoto: { fontFamily: 'DMSans_700Bold', fontSize: 13, color: Colors.brand.plum, marginTop: 12, marginBottom: 18 },
  form: { width: '100%', gap: 4 },
  hint: { fontFamily: 'DMSans_400Regular', fontSize: 11.5, color: Colors.text.muted, marginTop: 6, marginLeft: 4 },
  footer: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 14, backgroundColor: Colors.ivory, borderTopWidth: 1, borderTopColor: Colors.border.light },
  cta: { height: 52, borderRadius: 15, backgroundColor: Colors.brand.plum, alignItems: 'center', justifyContent: 'center' },
  ctaDisabled: { opacity: 0.5 },
  ctaText: { fontFamily: 'DMSans_700Bold', fontSize: 15, color: '#FFFFFF' },
});
