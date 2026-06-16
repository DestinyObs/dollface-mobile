import { Component, type ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/Text';
import { PressableScale } from '@/components/ui/Motion';
import { captureException } from '@/lib/monitoring';
import { Colors } from '@/constants/colors';

interface Props { children: ReactNode }
interface State { hasError: boolean }

/** Catches render crashes so the whole app never white-screens. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    captureException(error); // real Sentry capture when EXPO_PUBLIC_SENTRY_DSN is set
    console.error('Render error caught by boundary:', error);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <View style={s.root}>
        <View style={s.icon}><Ionicons name="sad-outline" size={30} color={Colors.brand.plum} /></View>
        <Text style={s.title}>Something went wrong</Text>
        <Text style={s.body}>An unexpected error occurred. Please try again.</Text>
        <PressableScale style={s.btn} onPress={() => this.setState({ hasError: false })}>
          <Text style={s.btnText}>Try Again</Text>
        </PressableScale>
      </View>
    );
  }
}

const s = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, backgroundColor: Colors.ivory, gap: 12 },
  icon: { width: 64, height: 64, borderRadius: 999, backgroundColor: Colors.blush, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  title: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 20, color: Colors.text.primary },
  body: { fontFamily: 'DMSans_400Regular', fontSize: 14, color: Colors.text.secondary, textAlign: 'center', lineHeight: 20 },
  btn: { marginTop: 10, height: 48, borderRadius: 14, backgroundColor: Colors.brand.plum, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28 },
  btnText: { fontFamily: 'DMSans_700Bold', fontSize: 15, color: '#FFFFFF' },
});
