import { Stack, useRouter, useSegments, useRootNavigationState } from 'expo-router';
import { useEffect, useRef } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useUserStore } from '@/src/stores/userStore';
import { useModuleAccessStore } from '@/src/stores/moduleAccessStore';
import '../global.css';
import { useState } from 'react';

// Prevent the splash screen from auto-hiding before asset loading
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();
  const { isAuthenticated } = useUserStore();
  const { checkAccess, getUserProgress } = useModuleAccessStore();
  const [navReady, setNavReady] = useState(false);
  const didInitDevAccessRef = useRef(false);

  const [fontsLoaded, fontError] = useFonts({
    // Font loading temporarily disabled - font files not found
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    const ready =
      !!navigationState?.key &&
      Array.isArray((navigationState as any)?.routes) &&
      (navigationState as any).routes.length > 0;
    if (ready) {
      setNavReady(true);
    }
  }, [navigationState?.key, (navigationState as any)?.routes?.length]);

  useEffect(() => {
    // 等待根导航完整挂载（key 存在且 routes 非空）后再做跳转，避免“未挂载先导航”崩溃
    if (!navReady) return;
    if (!fontsLoaded && !fontError) return;
    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, segments, fontsLoaded, fontError, navReady, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (didInitDevAccessRef.current) return;
    didInitDevAccessRef.current = true;

    (async () => {
      try {
        await getUserProgress();
        await checkAccess('word');
      } catch (error) {
        console.warn('⚠️ Dev access warmup failed:', error);
      }
    })();
  }, [isAuthenticated, checkAccess, getUserProgress]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="review-modal"
          options={{
            presentation: 'fullScreenModal',
            animation: 'slide_from_bottom',
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
