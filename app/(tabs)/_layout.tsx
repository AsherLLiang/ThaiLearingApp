// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

/**
 * 标签页布局组件
 * 作用:
 * 1. 底部导航栏
 * 2. 多语言标题
 * 3. 图标配置
 */
export default function TabsLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,  // 隐藏顶部导航栏
        tabBarActiveTintColor: '#4A90E2',  // 激活时的颜色
        tabBarInactiveTintColor: '#999',   // 未激活时的颜色
        tabBarStyle: {
          backgroundColor: '#FFF',
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
          height: 60,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      {/* 首页 */}
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),  // 🔥 动态标题
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      {/* 课程页 */}
      <Tabs.Screen
        name="courses"
        options={{
          title: t('tabs.courses'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book" size={size} color={color} />
          ),
        }}
      />

      {/* 个人中心 */}
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.profile'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}