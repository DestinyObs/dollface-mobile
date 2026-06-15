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
import { api } from '@/lib/api';
import { Colors } from '@/constants/colors';

const schema = z.object({ email: z.string().email('Enter a valid email address') });
type FormData = z.infer<typeof schema>;

export default function ForgotPasswordScreen() {
  const insets = useSafeAreaInsets();
  const { control, handleSubmit, setError, formState: { errors, isSubmitting, isSubmitSuccessful } } =
    useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { email: '' } });

  const onSubmit = async (data: FormData) => {
    try { await api.post('/auth/forgot-password', data); }
    catch (err: any) { setError('email', { message: err?.response?.data?.message ?? 'Something went wrong.' }); }
  };

  if (isSubmitSuccessful) {
    return (
      <View style={s.root}>
        <View style={[s.center, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
          <View style={s.successIcon}><Ionicons name="mail-open-outline" size={38} color={Colors.brand.plum} /></View>
          <Text style={s.successTitle}>Check your inbox</Text>
          <Text style={s.successBody}>We've sent a reset link to your email. Follow the instructions to set a new password.</Text>
          <PressableScale style={s.primaryBtn} onPress={() => router.replace('/(auth)/login')}>
            <Text style={s.primaryText}>Back to Sign In</Text>
          </PressableScale>
        </View>
      </View>
    );
  }

  return (
    <View style={s.root}>
      <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <AuthHeader eyebrow="ACCOUNT RECOVERY" title="Forgot password?" subtitle="We'll email you a secure reset link." height={196} />

          <View style={[s.sheet, { paddingBottom: Math.max(insets.bottom, 16) + 20 }]}>
            <Text style={s.lead}>Enter the email associated with your account and we'll send you a link to reset your password.</Text>
            <Controller control={control} name="email" render={({ field: { onChange, value, onBlur } }) => (
              <Input label="Email address" placeholder="you@email.com" keyboardType="email-address" autoCapitalize="none"
                autoComplete="email" onChangeText={onChange} onBlur={onBlur} value={value} error={errors.email?.message}
                leftIcon={<Ionicons name="mail-outline" size={17} color={Colors.text.muted} />} />
            )} />

            <PressableScale style={s.primaryBtn} onPress={handleSubmit(onSubmit)} disabled={isSubmitting}>
              <Text style={s.primaryText}>{isSubmitting ? 'Sending…' : 'Send Reset Link'}</Text>
              {!isSubmitting && <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />}
            </PressableScale>

            <TouchableOpacity onPress={() => router.back()} style={s.backLink} hitSlop={6}>
              <Text style={s.backLinkText}>Back to Sign In</Text>
            </TouchableOpacity>
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
    paddingHorizontal: 22, paddingTop: 26, gap: 18,
  },
  lead: { fontFamily: 'DMSans_400Regular', fontSize: 13.5, color: Colors.text.secondary, lineHeight: 20 },

  primaryBtn: {
    height: 54, borderRadius: 15, backgroundColor: Colors.brand.plum,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 4,
    shadowColor: Colors.brand.plum, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.25, shadowRadius: 14, elevation: 5,
  },
  primaryText: { fontFamily: 'DMSans_700Bold', fontSize: 15, color: '#FFFFFF' },
  backLink: { alignItems: 'center', paddingVertical: 14 },
  backLinkText: { fontFamily: 'DMSans_700Bold', fontSize: 14, color: Colors.brand.plum },

  center: { flex: 1, paddingHorizontal: 32, alignItems: 'center', justifyContent: 'center' },
  successIcon: { width: 84, height: 84, borderRadius: 26, backgroundColor: Colors.blush, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  successTitle: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 23, color: Colors.text.primary, textAlign: 'center', marginBottom: 10 },
  successBody: { fontFamily: 'DMSans_400Regular', fontSize: 14, color: Colors.text.secondary, textAlign: 'center', lineHeight: 21, marginBottom: 28 },
});
