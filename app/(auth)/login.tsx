import { useState } from 'react';
import { View, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/Text';
import { Input } from '@/components/ui/Input';
import { AuthHeader } from '@/components/layout/AuthHeader';
import { PressableScale } from '@/components/ui/Motion';
import { GoogleIcon, AppleIcon } from '@/components/ui/BrandIcons';
import { useAuthStore } from '@/lib/store/authStore';
import { useBeautyProfileStore } from '@/lib/store/beautyProfileStore';
import { api } from '@/lib/api';
import { authApi } from '@/lib/data/endpoints';
import { toast } from '@/lib/store/toastStore';
import { Colors } from '@/constants/colors';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'At least 8 characters'),
});
type F = z.infer<typeof schema>;

export default function LoginScreen() {
  const [showPw, setShowPw] = useState(false);
  const insets = useSafeAreaInsets();
  const { setUser, setTokens } = useAuthStore();
  const setOnboardingComplete = useBeautyProfileStore(s => s.setOnboardingComplete);

  const { control, handleSubmit, setError, formState: { errors, isSubmitting } } =
    useForm<F>({ resolver: zodResolver(schema), defaultValues: { email: '', password: '' } });

  const onSubmit = async (data: F) => {
    try {
      const res = await api.post('/auth/login', data);
      await setTokens(res.data.data.tokens);
      setUser(res.data.data.user);
      setOnboardingComplete(true); // returning users skip onboarding
      router.replace('/(tabs)');
    } catch (err: any) {
      setError('password', { message: err?.response?.data?.message ?? 'Invalid credentials.' });
    }
  };

  const [socialBusy, setSocialBusy] = useState(false);
  const social = async (provider: 'Google' | 'Apple') => {
    if (socialBusy) return;
    setSocialBusy(true);
    try {
      // Production: obtain idToken via expo-auth-session (Google/Apple).
      // Dev: the API derives a stable demo account from this token.
      const res = await authApi.social(provider.toLowerCase() as 'google' | 'apple', `dollface-${provider.toLowerCase()}-dev`);
      await setTokens(res.tokens);
      setUser(res.user);
      if (res.isNewUser) { router.replace('/(onboarding)/beauty-goals'); }
      else { setOnboardingComplete(true); router.replace('/(tabs)'); }
    } catch {
      toast.error(`${provider} sign-in failed.`);
      setSocialBusy(false);
    }
  };

  return (
    <View style={s.root}>
      <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <AuthHeader eyebrow="WELCOME BACK" title="Sign in" subtitle="Good to see you again." />

          <View style={[s.sheet, { paddingBottom: Math.max(insets.bottom, 16) + 20 }]}>
            <View style={s.form}>
              <Controller control={control} name="email" render={({ field: { onChange, value, onBlur } }) => (
                <Input label="Email address" placeholder="hello@example.com" keyboardType="email-address"
                  autoCapitalize="none" autoComplete="email" onChangeText={onChange} onBlur={onBlur} value={value}
                  error={errors.email?.message}
                  leftIcon={<Ionicons name="mail-outline" size={17} color={Colors.text.muted} />} />
              )} />

              <Controller control={control} name="password" render={({ field: { onChange, value, onBlur } }) => (
                <Input label="Password" placeholder="Your password" secureTextEntry={!showPw} autoCapitalize="none"
                  onChangeText={onChange} onBlur={onBlur} value={value} error={errors.password?.message}
                  leftIcon={<Ionicons name="lock-closed-outline" size={17} color={Colors.text.muted} />}
                  rightIcon={
                    <TouchableOpacity onPress={() => setShowPw(v => !v)} hitSlop={8}>
                      <Ionicons name={showPw ? 'eye-off-outline' : 'eye-outline'} size={18} color={Colors.text.muted} />
                    </TouchableOpacity>
                  } />
              )} />

              <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')} style={s.forgotWrap} hitSlop={6}>
                <Text style={s.forgot}>Forgot password?</Text>
              </TouchableOpacity>
            </View>

            <PressableScale style={s.primaryBtn} onPress={handleSubmit(onSubmit)} disabled={isSubmitting}>
              <Text style={s.primaryText}>{isSubmitting ? 'Signing in…' : 'Sign In'}</Text>
              {!isSubmitting && <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />}
            </PressableScale>

            <View style={s.divRow}>
              <View style={s.divLine} />
              <Text style={s.divText}>OR</Text>
              <View style={s.divLine} />
            </View>

            <View style={s.socialCol}>
              <PressableScale style={s.appleBtn} onPress={() => social('Apple')} disabled={socialBusy}>
                <AppleIcon size={17} color="#FFFFFF" />
                <Text style={s.appleText}>Sign in with Apple</Text>
              </PressableScale>
              <PressableScale style={s.googleBtn} onPress={() => social('Google')} disabled={socialBusy}>
                <GoogleIcon size={17} />
                <Text style={s.googleText}>Sign in with Google</Text>
              </PressableScale>
            </View>

            <View style={s.footer}>
              <Text style={s.footerText}>No account yet? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/register')} hitSlop={6}>
                <Text style={s.footerLink}>Create one</Text>
              </TouchableOpacity>
            </View>
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
    paddingHorizontal: 22, paddingTop: 26,
  },
  form: { gap: 16, marginBottom: 22 },
  forgotWrap: { alignSelf: 'flex-end' },
  forgot: { fontFamily: 'DMSans_700Bold', fontSize: 12.5, color: Colors.brand.plum },

  primaryBtn: {
    height: 54, borderRadius: 15, backgroundColor: Colors.brand.plum,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    shadowColor: Colors.brand.plum, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.25, shadowRadius: 14, elevation: 5,
  },
  primaryText: { fontFamily: 'DMSans_700Bold', fontSize: 15, color: '#FFFFFF' },

  divRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 20 },
  divLine: { flex: 1, height: 1, backgroundColor: Colors.border.light },
  divText: { fontFamily: 'DMSans_700Bold', fontSize: 10.5, color: Colors.text.muted, letterSpacing: 1 },

  socialCol: { gap: 10 },
  appleBtn: {
    height: 52, borderRadius: 14, backgroundColor: '#000000',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
  },
  appleText: { fontFamily: 'DMSans_700Bold', fontSize: 15, color: '#FFFFFF', letterSpacing: 0.2 },
  googleBtn: {
    height: 52, borderRadius: 14, backgroundColor: '#FFFFFF',
    borderWidth: 1.5, borderColor: Colors.border.default,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
  },
  googleText: { fontFamily: 'DMSans_700Bold', fontSize: 15, color: '#3C4043', letterSpacing: 0.2 },

  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 24 },
  footerText: { fontFamily: 'DMSans_400Regular', fontSize: 14, color: Colors.text.secondary },
  footerLink: { fontFamily: 'DMSans_700Bold', fontSize: 14, color: Colors.brand.plum },
});
