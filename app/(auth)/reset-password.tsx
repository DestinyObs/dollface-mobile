import { useState } from 'react';
import { View, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/Text';
import { Input } from '@/components/ui/Input';
import { AuthHeader } from '@/components/layout/AuthHeader';
import { PressableScale } from '@/components/ui/Motion';
import { api } from '@/lib/api';
import { Colors } from '@/constants/colors';

const schema = z.object({
  password: z.string().min(8, 'At least 8 characters'),
  confirm: z.string(),
}).refine((d) => d.password === d.confirm, { message: 'Passwords do not match', path: ['confirm'] });
type FormData = z.infer<typeof schema>;

export default function ResetPasswordScreen() {
  const { token } = useLocalSearchParams<{ token: string }>();
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const insets = useSafeAreaInsets();

  const { control, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema), defaultValues: { password: '', confirm: '' },
  });

  const onSubmit = async (data: FormData) => {
    try { await api.post('/auth/reset-password', { token, password: data.password }); setSuccess(true); }
    catch (err: any) { setError('password', { message: err?.response?.data?.message ?? 'Reset failed. Try again.' }); }
  };

  if (success) {
    return (
      <View style={s.root}>
        <View style={[s.center, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
          <View style={s.successIcon}><Ionicons name="checkmark" size={40} color="#FFFFFF" /></View>
          <Text style={s.successTitle}>Password updated</Text>
          <Text style={s.successBody}>You can now sign in with your new password.</Text>
          <PressableScale style={s.primaryBtn} onPress={() => router.replace('/(auth)/login')}>
            <Text style={s.primaryText}>Sign In</Text>
          </PressableScale>
        </View>
      </View>
    );
  }

  return (
    <View style={s.root}>
      <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <AuthHeader eyebrow="ACCOUNT RECOVERY" title="Set new password" subtitle="Choose a strong password for your account." height={196} />

          <View style={[s.sheet, { paddingBottom: Math.max(insets.bottom, 16) + 20 }]}>
            <Controller control={control} name="password" render={({ field: { onChange, value, onBlur } }) => (
              <Input label="New password" placeholder="At least 8 characters" secureTextEntry={!showPassword} autoCapitalize="none"
                onChangeText={onChange} onBlur={onBlur} value={value} error={errors.password?.message}
                leftIcon={<Ionicons name="lock-closed-outline" size={17} color={Colors.text.muted} />}
                rightIcon={
                  <TouchableOpacity onPress={() => setShowPassword(v => !v)} hitSlop={8}>
                    <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color={Colors.text.muted} />
                  </TouchableOpacity>
                } />
            )} />
            <Controller control={control} name="confirm" render={({ field: { onChange, value, onBlur } }) => (
              <Input label="Confirm password" placeholder="Re-enter your password" secureTextEntry={!showPassword} autoCapitalize="none"
                onChangeText={onChange} onBlur={onBlur} value={value} error={errors.confirm?.message}
                leftIcon={<Ionicons name="shield-checkmark-outline" size={17} color={Colors.text.muted} />} />
            )} />

            <PressableScale style={s.primaryBtn} onPress={handleSubmit(onSubmit)} disabled={isSubmitting}>
              <Text style={s.primaryText}>{isSubmitting ? 'Updating…' : 'Update Password'}</Text>
              {!isSubmitting && <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />}
            </PressableScale>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.ivory },
  flex: { flex: 1 },
  scroll: { flexGrow: 1 },

  sheet: {
    flex: 1, marginTop: -26, backgroundColor: Colors.ivory,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingHorizontal: 22, paddingTop: 26, gap: 16,
  },
  primaryBtn: {
    height: 54, borderRadius: 15, backgroundColor: Colors.brand.plum,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 6,
    shadowColor: Colors.brand.plum, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.25, shadowRadius: 14, elevation: 5,
  },
  primaryText: { fontFamily: 'DMSans_700Bold', fontSize: 15, color: '#FFFFFF' },

  center: { flex: 1, paddingHorizontal: 32, alignItems: 'center', justifyContent: 'center' },
  successIcon: { width: 84, height: 84, borderRadius: 999, backgroundColor: Colors.status.success, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  successTitle: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 23, color: Colors.text.primary, textAlign: 'center', marginBottom: 10 },
  successBody: { fontFamily: 'DMSans_400Regular', fontSize: 14, color: Colors.text.secondary, textAlign: 'center', lineHeight: 21, marginBottom: 28 },
});
