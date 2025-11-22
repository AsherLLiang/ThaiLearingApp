// app/_layout.tsx
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  useFonts,
  PlayfairDisplay_400Regular,
  PlayfairDisplay_700Bold
} from '@expo-google-fonts/playfair-display';
import {
  NotoSerifSC_400Regular,
  NotoSerifSC_700Bold
} from '@expo-google-fonts/noto-serif-sc';
import {
  Sarabun_400Regular,
  Sarabun_700Bold
} from '@expo-google-fonts/sarabun';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_700Bold,
    NotoSerifSC_400Regular,
    NotoSerifSC_700Bold,
    Sarabun_400Regular,
    Sarabun_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#FAF9F6' },
        }}
      >
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