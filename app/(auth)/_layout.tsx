import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useUserStore } from '../../src/stores/userStore';

/**
 * 认证布局组件
 * 作用:
 * 1. 提供无 Header 的页面布局
 * 2. 路由守卫:已登录用户自动跳转到主页
 */
export default function AuthLayout() {
    const router = useRouter();                                           // 获取路由实例
    const isAuthenticated = useUserStore(state => state.isAuthenticated);// 从状态管理获取登录状态

    // 【关键逻辑:检查登录状态】如果已登录,自动跳转到主页
    useEffect(() => {
        if (isAuthenticated) {
            router.replace('/(tabs)');  // replace = 不能后退
        }
    }, [isAuthenticated])

    return (
        <Stack screenOptions={
            {
                headerShown: false,               // 不显示 Header
                animation: 'slide_from_right'    // 从右侧滑动进入
            }
        } >
            <Stack.Screen name="login" options={{ title: '登录', headerShown: true }} />
            {/* <Stack.Screen name="register" options={{ title: '注册', headerShown: true }} /> */}
        </Stack>
    )

}
