import { useFonts } from 'expo-font';
import * as Notifications from 'expo-notifications';
import { router, SplashScreen } from 'expo-router';
import { Stack } from 'expo-router/stack';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider, useAuth } from '@/lib/auth';
import { fontAssets } from '@/lib/fonts';
import { initLanguage } from '@/lib/lang';
import { PushTarget, targetOf } from '@/lib/push';
import { colors } from '@/lib/theme';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

export default function RootLayout() {
  const [langReady, setLangReady] = useState(false);
  const [fontsLoaded, fontError] = useFonts(fontAssets);

  useEffect(() => {
    initLanguage().finally(() => setLangReady(true));
  }, []);

  if (!langReady || (!fontsLoaded && !fontError)) {
    return null;
  }
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="dark" />
        <Navigation />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

function open(target: PushTarget | null) {
  if (!target) {
    return;
  }
  if (target.screen === 'appointment' && target.id) {
    router.push({ pathname: '/appointment/[id]', params: { id: String(target.id) } });
  } else if (target.screen === 'lab') {
    router.push('/lab');
  } else {
    router.push('/');
  }
}

function Navigation() {
  const { ready, me } = useAuth();
  const signedIn = !!me;

  useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync().catch(() => undefined);
    }
  }, [ready]);

  // tapping a notification opens the appointment or the lab list
  useEffect(() => {
    if (!signedIn || Platform.OS === 'web') {
      return undefined;
    }
    const last = Notifications.getLastNotificationResponse();
    if (last) {
      setTimeout(() => open(targetOf(last)), 300);
      Notifications.clearLastNotificationResponse?.();
    }
    const sub = Notifications.addNotificationResponseReceivedListener((response) => open(targetOf(response)));
    return () => sub.remove();
  }, [signedIn]);

  if (!ready) {
    return null;
  }
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.ground } }}>
      <Stack.Protected guard={signedIn}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="appointment/[id]" />
        <Stack.Screen name="patient/[id]" />
        <Stack.Screen name="session/[id]" />
        <Stack.Screen name="lab-request/[id]" />
        <Stack.Screen name="settings" />
      </Stack.Protected>
      <Stack.Protected guard={!signedIn}>
        <Stack.Screen name="login" />
      </Stack.Protected>
    </Stack>
  );
}
