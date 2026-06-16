import { useEffect, useRef, useState } from 'react';
import { View, TextInput, StyleSheet, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Text } from '@/components/ui/Text';
import { AuthHeader } from '@/components/layout/AuthHeader';
import { PressableScale } from '@/components/ui/Motion';
import { authApi } from '@/lib/data/endpoints';
import { toast } from '@/lib/store/toastStore';
import { Colors } from '@/constants/colors';

const LEN = 6;
const RESEND_SECONDS = 30;

export default function VerifyEmailScreen() {
  const { email, devCode } = useLocalSearchParams<{ email: string; devCode?: string }>();
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);

  const [code, setCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const [hint, setHint] = useState<string | undefined>(devCode || undefined);

  // resend countdown
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  // focus the hidden input on mount
  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 350);
    return () => clearTimeout(t);
  }, []);

  const submit = async (value: string) => {
    if (verifying || value.length !== LEN) return;
    setVerifying(true);
    setError(false);
    try {
      await authApi.verifyEmail(value);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      router.replace('/(onboarding)/welcome' as any);
    } catch {
      setError(true);
      setCode('');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      setVerifying(false);
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  };

  const onChange = (raw: string) => {
    const next = raw.replace(/\D/g, '').slice(0, LEN);
    setCode(next);
    setError(false);
    if (next.length === LEN) submit(next);
  };

  const resend = async () => {
    if (countdown > 0) return;
    try {
      const res = await authApi.resendEmailCode();
      setCountdown(RESEND_SECONDS);
      setCode('');
      setHint(res?.devCode || hint);
      toast.success('New code sent to your inbox');
      inputRef.current?.focus();
    } catch {
      toast.error("Couldn't resend the code. Try again.");
    }
  };

  return (
    <View style={s.root}>
      <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <AuthHeader eyebrow="VERIFY YOUR EMAIL" title="Check your inbox" subtitle={email ? `We sent a 6-digit code to ${email}` : 'Enter the 6-digit code we just sent you.'} />

        <View style={[s.sheet, { paddingBottom: Math.max(insets.bottom, 16) + 20 }]}>
          {/* Hidden input drives the visible cells */}
          <TextInput
            ref={inputRef}
            value={code}
            onChangeText={onChange}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            autoComplete="sms-otp"
            maxLength={LEN}
            style={s.hiddenInput}
            caretHidden
          />

          <Pressable style={s.cells} onPress={() => inputRef.current?.focus()}>
            {Array.from({ length: LEN }).map((_, i) => {
              const char = code[i] ?? '';
              const active = i === code.length;
              return (
                <View key={i} style={[s.cell, char ? s.cellFilled : null, active ? s.cellActive : null, error ? s.cellError : null]}>
                  <Text style={s.cellText}>{char}</Text>
                  {active && !char ? <View style={s.caret} /> : null}
                </View>
              );
            })}
          </Pressable>

          {error ? <Text style={s.errorText}>That code didn't match. Try again.</Text> : <View style={{ height: 18 }} />}

          <PressableScale style={[s.primaryBtn, (verifying || code.length !== LEN) && s.btnDisabled]} onPress={() => submit(code)} disabled={verifying || code.length !== LEN}>
            <Text style={s.primaryText}>{verifying ? 'Verifying…' : 'Verify'}</Text>
            {!verifying && <Ionicons name="checkmark" size={17} color="#FFFFFF" />}
          </PressableScale>

          <View style={s.resendRow}>
            {countdown > 0 ? (
              <Text style={s.resendMuted}>Resend code in {countdown}s</Text>
            ) : (
              <Text style={s.resendLink} onPress={resend}>Resend code</Text>
            )}
          </View>

          {hint ? (
            <View style={s.devHint}>
              <Ionicons name="construct-outline" size={13} color={Colors.text.muted} />
              <Text style={s.devHintText}>Dev: your code is {hint}</Text>
            </View>
          ) : null}

          <View style={s.footer}>
            <Text style={s.footerLink} onPress={() => router.replace('/(auth)/register')}>Wrong email? Go back</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.ivory },
  flex: { flex: 1 },
  sheet: {
    flex: 1, marginTop: -26, backgroundColor: Colors.ivory,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingHorizontal: 22, paddingTop: 34,
  },
  hiddenInput: { position: 'absolute', opacity: 0, height: 1, width: 1 },

  cells: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  cell: {
    flex: 1, aspectRatio: 0.82, maxWidth: 54, borderRadius: 14, backgroundColor: '#FFFFFF',
    borderWidth: 1.5, borderColor: Colors.border.light,
    alignItems: 'center', justifyContent: 'center',
  },
  cellFilled: { borderColor: Colors.brand.plum, backgroundColor: Colors.blush },
  cellActive: { borderColor: Colors.brand.plum, shadowColor: Colors.brand.plum, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.18, shadowRadius: 10, elevation: 3 },
  cellError: { borderColor: Colors.status.error },
  cellText: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 24, color: Colors.text.primary },
  caret: { position: 'absolute', width: 2, height: 24, borderRadius: 1, backgroundColor: Colors.brand.plum },

  errorText: { fontFamily: 'DMSans_500Medium', fontSize: 12.5, color: Colors.status.error, textAlign: 'center', marginTop: 12, marginBottom: 6 },

  primaryBtn: {
    height: 54, borderRadius: 15, backgroundColor: Colors.brand.plum, marginTop: 18,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    shadowColor: Colors.brand.plum, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.25, shadowRadius: 14, elevation: 5,
  },
  btnDisabled: { opacity: 0.5 },
  primaryText: { fontFamily: 'DMSans_700Bold', fontSize: 15, color: '#FFFFFF' },

  resendRow: { alignItems: 'center', marginTop: 20 },
  resendMuted: { fontFamily: 'DMSans_400Regular', fontSize: 13.5, color: Colors.text.muted },
  resendLink: { fontFamily: 'DMSans_700Bold', fontSize: 13.5, color: Colors.brand.plum },

  devHint: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 18, opacity: 0.7 },
  devHintText: { fontFamily: 'DMSans_500Medium', fontSize: 12, color: Colors.text.muted },

  footer: { alignItems: 'center', marginTop: 'auto' },
  footerLink: { fontFamily: 'DMSans_700Bold', fontSize: 13.5, color: Colors.text.secondary },
});
