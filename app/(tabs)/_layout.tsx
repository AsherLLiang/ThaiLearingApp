import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Expo 自带的图标库

export default function TabsLayout() {
  // Tabs 是"标签栏导航"，就像微信底部的"微信、通讯录、发现、我"
  return (
    <Tabs
      screenOptions={{
        // 这些是所有标签页共享的样式
        tabBarActiveTintColor: '#4A90E2',  // 选中时的颜色（蓝色）
        tabBarInactiveTintColor: '#999',    // 未选中时的颜色（灰色）
      }}
    >
      {/* 首页标签 */}
      <Tabs.Screen 
        name="index"  // 对应 app/(tabs)/index.tsx
        options={{ 
          title: '首页',
          tabBarIcon: ({ color, size }) => (
            // 这是一个函数，根据选中状态返回不同颜色的图标
            <Ionicons name="home" size={size} color={color} />
          )
        }} 
      />
      
      {/* 课程标签 */}
      <Tabs.Screen 
        name="courses" 
        options={{ 
          title: '课程',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book" size={size} color={color} />
          )
        }} 
      />
      
      {/* 个人中心标签 */}
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: '我的',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          )
        }} 
      />
    </Tabs>
  );
}

/*

**导航结构：**

App 启动
   ↓
_layout.tsx (根导航)
   ↓
   ├─ (auth)/_layout.tsx (认证组)
   │     └─ login.tsx (登录页)
   │
   └─ (tabs)/_layout.tsx (标签组)
         ├─ index.tsx (首页)
         ├─ courses.tsx (课程页)
         └─ profile.tsx (个人中心)

*/