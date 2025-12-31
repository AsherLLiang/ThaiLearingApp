import { Stack } from 'expo-router';
import React from 'react';
import { View, Text } from 'react-native';

export default function DevLayout() {
    // 🛡️ 核心安全网：生产环境直接返回 null，确保路由不可达
    if (!__DEV__) {
        return null;
    }

    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#F5F5F5',
                },
                headerTintColor: '#333',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        >
            <Stack.Screen
                name="playground"
                options={{
                    title: '🛠️ Playground',
                    headerLargeTitle: true,
                }}
            />
            <Stack.Screen
                name="viewer"
                options={{
                    title: 'Component Viewer',
                    presentation: 'modal', // 模态展示感觉更像独立的 Debug 环境
                }}
            />
        </Stack>
    );
}
