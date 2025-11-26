// app/_layout.js
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useUserStore } from '@/src/stores/userStore';
import "../global.css";

// Prevent the splash screen from auto-hiding before asset loading
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const segments = useSegments();
  const router = useRouter();
  const { isAuthenticated } = useUserStore();

  const [fontsLoaded, fontError] = useFonts({
    // Font loading temporarily disabled - font files not found
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Auth Guard
  /* 
  1. 依赖与触发时机
  useEffect 的依赖数组包含 isAuthenticated（用户是否登录）、segments（路由片段，比如 App Router 的路由路径拆分）、fontsLoaded（字体是否加载完成）、fontError（字体加载是否失败）。
  只有当这些状态变化时，权限校验逻辑才会执行。
  2. 前置条件：等待字体加载
  若 fontsLoaded 为 false 且 fontError 为 false（字体还在加载中，未成功也未失败），则直接返回，不执行任何权限校验 —— 避免字体未加载完成时页面闪烁或跳转。
  组件最后也有同样的判断：字体未加载 / 未出错时，返回 null（不渲染任何内容），保证加载期间页面空白或展示骨架屏（需配合其他逻辑）。
  3. 路由分组判断
  const inAuthGroup = segments[0] === '(auth)';
  这里是路由分组的判断（常见于 Next.js App Router）：
  (auth) 是一个路由分组（括号表示分组，不影响 URL 路径），通常存放登录、注册等 “未登录可访问” 的页面；
  inAuthGroup 为 true 表示当前路由在「auth 分组」内（如 /login 实际对应路由 /(auth)/login）。
  4. 权限校验与跳转规则
  核心是 “登录状态” 与 “路由分组” 的匹配校验：
  规则 1：未登录（!isAuthenticated）且不在 auth 分组（!inAuthGroup） → 跳转到登录页 / (auth)/login
  （比如未登录用户直接访问 /home，会被强制跳登录）
  规则 2：已登录（isAuthenticated）且在 auth 分组（inAuthGroup） → 跳转到主页面 / (tabs)
  （比如已登录用户再访问登录页，会被强制跳回首页）
  */
  useEffect(() => {
    if (!fontsLoaded && !fontError) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, segments, fontsLoaded, fontError]);

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