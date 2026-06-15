import '../global.css';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import * as SplashScreen from 'expo-splash-screen';
import { View, Text, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  useFonts,
  PlayfairDisplay_400Regular,
  PlayfairDisplay_700Bold,
} from '@expo-google-fonts/playfair-display';
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import { queryClient } from '@/lib/queryClient';
import { useAuthStore } from '@/lib/store/authStore';
import { useBeautyProfileStore } from '@/lib/store/beautyProfileStore';
import { useCartStore } from '@/lib/store/cartStore';
import { useSavedStore } from '@/lib/store/savedStore';
import { useNotificationStore } from '@/lib/store/notificationStore';
import { useState } from 'react';
import { BrandSplash } from '@/components/layout/BrandSplash';
import { Toaster } from '@/components/ui/Toaster';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

SplashScreen.preventAutoHideAsync();

const IS_WEB = Platform.OS === 'web';

// Phone dimensions match iPhone 14 Pro
const PHONE_W = 393;
const PHONE_H = 852;

// Safe area insets injected on web to simulate Dynamic Island + home bar
const WEB_INSETS = {
  frame: { x: 0, y: 0, width: PHONE_W, height: PHONE_H },
  insets: { top: 56, left: 0, right: 0, bottom: 30 },
};

function PhoneFrame({ children }: { children: React.ReactNode }) {
  const { width: ww, height: wh } = useWindowDimensions();
  if (!IS_WEB) return <>{children}</>;

  const BEZEL_W = PHONE_W + 28;
  const BEZEL_H = PHONE_H + 28;
  const scale = Math.min((ww - 32) / BEZEL_W, (wh - 32) / BEZEL_H, 1.12);

  return (
    <View style={s.outer}>
      <View style={[s.glow, { width: 480, height: 480, opacity: 0.12, top: -120, left: -80 }]} />
      <View style={[s.glow, { width: 320, height: 320, opacity: 0.07, bottom: -80, right: -60 }]} />

      <View style={[s.deviceWrap, { transform: [{ scale }] }]}>
        {/* Titanium side buttons (sit on the rail) */}
        <View style={[s.sideBtn, { top: 132, right: -2, height: 66 }]} />
        <View style={[s.sideBtn, { top: 110, left: -2, height: 32 }]} />
        <View style={[s.sideBtn, { top: 160, left: -2, height: 60 }]} />
        <View style={[s.sideBtn, { top: 234, left: -2, height: 60 }]} />

        {/* Brushed-titanium rail */}
        <LinearGradient
          colors={['#e7e7ec', '#9a9aa1', '#d6d6dc', '#7c7c83', '#cfcfd5']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={s.rail}
        >
          {/* Black bezel */}
          <View style={s.bezel}>
            {/* Screen */}
            <View style={s.screen}>
              {/* Dynamic Island with camera lens */}
              <View style={s.island} pointerEvents="none">
                <View style={s.lens} />
              </View>
              {/* Faux iOS status bar (time + signal/wifi/battery) */}
              <View style={s.statusBar} pointerEvents="none">
                <Text style={s.statusTime}>9:41</Text>
                <View style={s.statusIcons}>
                  <Ionicons name="cellular" size={15} color="#1F1A1C" />
                  <Ionicons name="wifi" size={15} color="#1F1A1C" />
                  <Ionicons name="battery-full" size={22} color="#1F1A1C" />
                </View>
              </View>
              {children}
            </View>
          </View>
        </LinearGradient>
      </View>
    </View>
  );
}

const nav = (
  <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right', animationDuration: 260 }}>
    <Stack.Screen name="index" options={{ animation: 'fade' }} />
    <Stack.Screen name="(auth)" />
    <Stack.Screen name="(onboarding)" />
    <Stack.Screen name="(tabs)" />
    <Stack.Screen name="product" />
    <Stack.Screen name="premium" />
    <Stack.Screen name="notifications" />
    <Stack.Screen name="+not-found" />
  </Stack>
);

export default function RootLayout() {
  const hydrate = useAuthStore(s => s.hydrate);
  const isLoading = useAuthStore(s => s.isLoading);

  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_700Bold,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });

  const [minTimePassed, setMinTimePassed] = useState(false);

  useEffect(() => {
    if (!fontsLoaded) return;
    (async () => {
      // Restore persisted state so a cold start (or web reload) keeps cart,
      // saved items and notifications. Onboarding before auth so the initial
      // redirect is correct; auth last (it flips isLoading, unblocking nav).
      await Promise.all([
        useCartStore.getState().hydrate(),
        useSavedStore.getState().hydrate(),
        useNotificationStore.getState().hydrate(),
      ]);
      await useBeautyProfileStore.getState().hydrate();
      await hydrate();
      SplashScreen.hideAsync();
    })();
  }, [fontsLoaded]);

  useEffect(() => {
    const t = setTimeout(() => setMinTimePassed(true), 1700);
    return () => clearTimeout(t);
  }, []);

  const showSplash = !fontsLoaded || isLoading || !minTimePassed;

  const app = (
    <PhoneFrame>
      {showSplash ? <BrandSplash /> : <>{nav}<ConfirmDialog /><Toaster /></>}
    </PhoneFrame>
  );

  return (
    <GestureHandlerRootView style={s.root}>
      <SafeAreaProvider initialMetrics={IS_WEB ? WEB_INSETS : undefined}>
        <QueryClientProvider client={queryClient}>
          <StatusBar style={showSplash ? 'light' : 'dark'} />
          {IS_WEB ? (
            // On web the browser reports 0 safe-area, which would let content
            // slide under the status bar / island. Force the device insets.
            <SafeAreaInsetsContext.Provider value={{ top: 52, bottom: 28, left: 0, right: 0 }}>
              {app}
            </SafeAreaInsetsContext.Provider>
          ) : app}
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },

  outer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0d0d0d',
  },

  glow: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: '#753248',
  },

  // Device wrapper (holds the floating shadow + side buttons)
  deviceWrap: {
    width: PHONE_W + 28,
    height: PHONE_H + 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 32 },
    shadowOpacity: 0.85,
    shadowRadius: 64,
    elevation: 24,
  },

  // Brushed-titanium outer rail (thin metallic band)
  rail: {
    width: PHONE_W + 28,
    height: PHONE_H + 28,
    borderRadius: 62,
    padding: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Black bezel between titanium and screen
  bezel: {
    flex: 1,
    alignSelf: 'stretch',
    borderRadius: 59,
    backgroundColor: '#050506',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },

  sideBtn: {
    position: 'absolute',
    width: 3,
    borderRadius: 3,
    backgroundColor: '#c7c7cd',
    zIndex: 2,
  },

  screen: {
    width: PHONE_W,
    height: PHONE_H,
    borderRadius: 50,
    overflow: 'hidden',
    backgroundColor: '#FAF7F5',
    position: 'relative',
  },

  statusBar: {
    position: 'absolute',
    top: 0, left: 0, right: 0, height: 47,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 28, paddingTop: 10,
    zIndex: 50,
  },
  statusTime: { fontFamily: 'DMSans_700Bold', fontSize: 14.5, color: '#1F1A1C', letterSpacing: 0.3 },
  statusIcons: { flexDirection: 'row', alignItems: 'center', gap: 5 },

  island: {
    position: 'absolute',
    top: 13,
    left: (PHONE_W - 110) / 2,
    width: 110,
    height: 31,
    borderRadius: 16,
    backgroundColor: '#000000',
    zIndex: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 11,
  },

  // Camera lens inside the island
  lens: {
    width: 9,
    height: 9,
    borderRadius: 999,
    backgroundColor: '#0a0a1a',
    borderWidth: 1,
    borderColor: '#222238',
  },
});
