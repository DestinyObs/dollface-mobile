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
  name: z.string().min(2, 'At least 2 characters'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().regex(/^[+]?[\d][\d\s-]{6,15}$/, 'Enter a valid phone number'),
  password: z.string().min(8, 'Min 8 characters').regex(/[A-Z]/, 'Needs an uppercase letter').regex(/[0-9]/, 'Needs a number'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, { message: "Passwords don't match", path: ['confirmPassword'] });
type F = z.infer<typeof schema>;

function strength(pw: string) {
  let n = 0;
  if (pw.length >= 8) n++;
  if (/[A-Z]/.test(pw)) n++;
  if (/[0-9]/.test(pw)) n++;
  if (/[^A-Za-z0-9]/.test(pw)) n++;
  return n; // 0..4
}
const STRENGTH = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const STRENGTH_COLOR = ['#E0D6DA', '#C0392B', '#E8A838', '#4CAF6E', '#2D6A4F'];

export default function RegisterScreen() {
  const [showPw, setShowPw] = useState(false);
  const [socialBusy, setSocialBusy] = useState(false);
  const insets = useSafeAreaInsets();
  const { setUser, setTokens } = useAuthStore();
  const setOnboardingComplete = useBeautyProfileStore(s => s.setOnboardingComplete);

  const social = async (provider: 'Google' | 'Apple') => {
    if (socialBusy) return;
    setSocialBusy(true);
    try {
      const res = await authApi.social(provider.toLowerCase() as 'google' | 'apple', `dollface-${provider.toLowerCase()}-dev`);
      await setTokens(res.tokens);
      setUser(res.user);
      if (res.isNewUser) { router.replace('/(onboarding)/welcome'); }
      else { setOnboardingComplete(true); router.replace('/(tabs)'); }
    } catch {
      toast.error(`${provider} sign-up failed.`);
      setSocialBusy(false);
    }
  };

  const { control, handleSubmit, setError, watch, formState: { errors, isSubmitting } } =
    useForm<F>({ resolver: zodResolver(schema), defaultValues: { name: '', email: '', phone: '', password: '', confirmPassword: '' } });

  const pw = watch('password');
  const sLevel = strength(pw || '');

  const onSubmit = async (data: F) => {
    try {
      const res = await api.post('/auth/register', { name: data.name, email: data.email, phone: data.phone, password: data.password });
      await setTokens(res.data.data.tokens);
      setUser(res.data.data.user);
      // Email verification step — send the user to the OTP screen.
      router.replace({
        pathname: '/(auth)/verify-email',
        params: { email: data.email, devCode: res.data.data.devCode ?? '' },
      } as any);
    } catch (err: any) {
      setError('email', { message: err?.response?.data?.message ?? 'Something went wrong.' });
    }
  };

  return (
    <View style={s.root}>
      <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <AuthHeader eyebrow="JOIN DOLLFACE" title="Create account" subtitle="Personalised beauty, built around you." />

          <View style={[s.sheet, { paddingBottom: Math.max(insets.bottom, 16) + 20 }]}>
            <View style={s.form}>
              <Controller control={control} name="name" render={({ field: { onChange, value, onBlur } }) => (
                <Input label="Full name" placeholder="Your name" autoCapitalize="words" autoComplete="name"
                  onChangeText={onChange} onBlur={onBlur} value={value} error={errors.name?.message}
                  leftIcon={<Ionicons name="person-outline" size={17} color={Colors.text.muted} />} />
              )} />
              <Controller control={control} name="email" render={({ field: { onChange, value, onBlur } }) => (
                <Input label="Email address" placeholder="you@email.com" keyboardType="email-address" autoCapitalize="none"
                  autoComplete="email" onChangeText={onChange} onBlur={onBlur} value={value} error={errors.email?.message}
                  leftIcon={<Ionicons name="mail-outline" size={17} color={Colors.text.muted} />} />
              )} />
              <Controller control={control} name="phone" render={({ field: { onChange, value, onBlur } }) => (
                <Input label="Phone number" placeholder="+44 7700 900000" keyboardType="phone-pad"
                  autoComplete="tel" onChangeText={onChange} onBlur={onBlur} value={value} error={errors.phone?.message}
                  leftIcon={<Ionicons name="call-outline" size={17} color={Colors.text.muted} />} />
              )} />
              <Controller control={control} name="password" render={({ field: { onChange, value, onBlur } }) => (
                <View>
                  <Input label="Password" placeholder="Create a password" secureTextEntry={!showPw} autoCapitalize="none"
                    onChangeText={onChange} onBlur={onBlur} value={value} error={errors.password?.message}
                    leftIcon={<Ionicons name="lock-closed-outline" size={17} color={Colors.text.muted} />}
                    rightIcon={
                      <TouchableOpacity onPress={() => setShowPw(v => !v)} hitSlop={8}>
                        <Ionicons name={showPw ? 'eye-off-outline' : 'eye-outline'} size={18} color={Colors.text.muted} />
                      </TouchableOpacity>
                    } />
                  {pw ? (
                    <View style={s.strengthRow}>
                      <View style={s.strengthTrack}>
                        {[0, 1, 2, 3].map(i => (
                          <View key={i} style={[s.strengthSeg, { backgroundColor: i < sLevel ? STRENGTH_COLOR[sLevel] : '#ECE3E7' }]} />
                        ))}
                      </View>
                      <Text style={[s.strengthLabel, { color: STRENGTH_COLOR[sLevel] }]}>{STRENGTH[sLevel]}</Text>
                    </View>
                  ) : null}
                </View>
              )} />
              <Controller control={control} name="confirmPassword" render={({ field: { onChange, value, onBlur } }) => (
                <Input label="Confirm password" placeholder="Re-enter password" secureTextEntry={!showPw} autoCapitalize="none"
                  onChangeText={onChange} onBlur={onBlur} value={value} error={errors.confirmPassword?.message}
                  leftIcon={<Ionicons name="shield-checkmark-outline" size={17} color={Colors.text.muted} />} />
              )} />
            </View>

            <PressableScale style={s.primaryBtn} onPress={handleSubmit(onSubmit)} disabled={isSubmitting}>
              <Text style={s.primaryText}>{isSubmitting ? 'Creating…' : 'Create Account'}</Text>
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
                <Text style={s.appleText}>Sign up with Apple</Text>
              </PressableScale>
              <PressableScale style={s.googleBtn} onPress={() => social('Google')} disabled={socialBusy}>
                <GoogleIcon size={17} />
                <Text style={s.googleText}>Sign up with Google</Text>
              </PressableScale>
            </View>

            <Text style={s.terms}>
              By signing up you agree to our{' '}
              <Text style={s.termsLink} onPress={() => router.push('/(auth)/terms' as any)}>Terms</Text>
              {' '}and{' '}
              <Text style={s.termsLink} onPress={() => router.push('/(auth)/privacy' as any)}>Privacy Policy</Text>
            </Text>

            <View style={s.footer}>
              <Text style={s.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/login')} hitSlop={6}>
                <Text style={s.footerLink}>Sign in</Text>
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
    paddingHorizontal: 22, paddingTop: 24,
  },
  form: { gap: 14, marginBottom: 20 },

  strengthRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 },
  strengthTrack: { flex: 1, flexDirection: 'row', gap: 4 },
  strengthSeg: { flex: 1, height: 4, borderRadius: 2 },
  strengthLabel: { fontFamily: 'DMSans_700Bold', fontSize: 11, width: 44, textAlign: 'right' },

  primaryBtn: {
    height: 54, borderRadius: 15, backgroundColor: Colors.brand.plum,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    shadowColor: Colors.brand.plum, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.25, shadowRadius: 14, elevation: 5,
  },
  primaryText: { fontFamily: 'DMSans_700Bold', fontSize: 15, color: '#FFFFFF' },

  divRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 18 },
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

  terms: { fontFamily: 'DMSans_400Regular', fontSize: 11.5, color: Colors.text.muted, textAlign: 'center', lineHeight: 17, marginTop: 16 },
  termsLink: { fontFamily: 'DMSans_700Bold', fontSize: 11.5, color: Colors.brand.plum },

  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 18 },
  footerText: { fontFamily: 'DMSans_400Regular', fontSize: 14, color: Colors.text.secondary },
  footerLink: { fontFamily: 'DMSans_700Bold', fontSize: 14, color: Colors.brand.plum },
});
