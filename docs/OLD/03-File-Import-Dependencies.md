# 文件导入与依赖地图

本文档展示了项目中的文件如何相互导入和依赖。

---

## 导入关系图

```
根目录
│
├── app/_layout.tsx
│   ├── expo-router (Stack, useRouter, useSegments)
│   ├── expo-font (useFonts)
│   ├── expo-splash-screen
│   ├── react-native-gesture-handler (GestureHandlerRootView)
│   ├── @/src/stores/userStore ← 状态
│   └── @/global.css
│
├── app/(auth)/_layout.tsx
│   ├── expo-router (Stack, useRouter)
│   └── @/src/stores/userStore ← 状态
│
├── app/(auth)/login.tsx
│   ├── expo-router (useRouter)
│   ├── @/src/stores/userStore ← 状态
│   ├── @/src/components/common/ThaiPatternBackground ← 组件
│   ├── @/src/components/common/LanguageSwitcher ← 组件
│   ├── @/src/components/common/Button ← 组件
│   ├── @/src/constants/colors ← 常量
│   ├── @/src/constants/typography ← 常量
│   └── react-i18next (useTranslation) ← 国际化
│
├── app/(tabs)/_layout.tsx
│   ├── expo-router (Tabs)
│   ├── expo-blur (BlurView)
│   ├── lucide-react-native (Home, BookOpen, User) ← 图标
│   ├── react-native-safe-area-context (useSafeAreaInsets)
│   ├── @/src/constants/colors ← 常量
│   └── @/src/constants/typography ← 常量
│
├── app/(tabs)/index.tsx
│   ├── expo-router (useRouter)
│   ├── expo-blur (BlurView)
│   ├── lucide-react-native (Play, TrendingUp, Clock, Award, Star) ← 图标
│   ├── @/src/components/common/ThaiPatternBackground ← 组件
│   ├── @/src/components/common/FloatingBubbles ← 组件
│   ├── @/src/constants/colors ← 常量
│   ├── @/src/constants/typography ← 常量
│   └── @/src/types/entities (ReviewItem) ← 类型
│
├── app/(tabs)/profile.tsx
│   ├── @/src/stores/userStore ← 状态
│   ├── @/src/stores/learningStore ← 状态
│   ├── @/src/stores/languageStore ← 状态
│   ├── @/src/components/common/LanguageSwitcher ← 组件
│   ├── @/src/constants/colors ← 常量
│   ├── @/src/constants/typography ← 常量
│   ├── lucide-react-native (Award, TrendingUp, Clock, Trophy, Settings, LogOut) ← 图标
│   └── react-i18next (useTranslation) ← 国际化
│
├── src/stores/userStore.ts
│   ├── zustand (create)
│   ├── zustand/middleware (persist, createJSONStorage)
│   └── @react-native-async-storage/async-storage ← 持久化
│
├── src/stores/learningStore.ts
│   ├── zustand (create)
│   ├── zustand/middleware (persist, createJSONStorage)
│   ├── @react-native-async-storage/async-storage ← 持久化
│   └── @/src/types/entities (Course, LearningProgress, Level) ← 类型
│
├── src/stores/languageStore.ts
│   ├── zustand (create)
│   ├── zustand/middleware (persist, createJSONStorage)
│   ├── @react-native-async-storage/async-storage ← 持久化
│   └── @/src/i18n ← 国际化
│
├── src/components/common/ThaiPatternBackground.tsx
│   ├── react-native-svg (Svg, Defs, Pattern, Rect, Path)
│   └── @/src/constants/colors ← 常量
│
├── src/components/common/FloatingBubbles.tsx
│   ├── @/src/types/entities (ReviewItem) ← 类型
│   ├── @/src/constants/colors ← 常量
│   ├── @/src/constants/typography ← 常量
│   └── lucide-react-native (Play) ← 图标
│
├── src/components/common/LanguageSwitcher.tsx
│   ├── @/src/stores/languageStore ← 状态
│   ├── @/src/constants/colors ← 常量
│   ├── @/src/constants/typography ← 常量
│   ├── lucide-react-native (Globe) ← 图标
│   └── react-i18next (useTranslation) ← 国际化
│
└── src/i18n/index.ts
    ├── i18next
    ├── react-i18next
    ├── expo-localization
    ├── @/src/i18n/locales/zh ← 翻译
    └── @/src/i18n/locales/en ← 翻译
```

---

## 导入层级 (依赖层级)

### 第 1 层: 核心依赖 (无内部导入)
这些文件不导入项目中的任何内容：

```
src/constants/colors.ts              ← 纯数据
src/constants/typography.ts          ← 纯数据
src/i18n/locales/zh.ts               ← 纯翻译
src/i18n/locales/en.ts               ← 纯翻译
src/entities/types/entities.ts       ← 纯类型
src/config/constants.ts              ← 应用配置常量
```

### 第 2 层: 基础设施 (导入第 1 层)
这些文件仅导入常量和类型：

```
src/i18n/index.ts
├── imports: expo-localization
└── imports: locales/zh, locales/en

src/stores/userStore.ts
├── imports: zustand, AsyncStorage
└── (defines own types inline)

src/stores/learningStore.ts
├── imports: zustand, AsyncStorage
└── imports: src/types/entities

src/stores/languageStore.ts
├── imports: zustand, AsyncStorage
└── imports: src/i18n
```

### 第 3 层: 组件 (导入第 1 层 + 第 2 层)
这些文件导入常量、类型和 store：

```
src/components/common/ThaiPatternBackground.tsx
└── imports: src/constants/colors

src/components/common/FloatingBubbles.tsx
├── imports: src/constants/colors
├── imports: src/constants/typography
└── imports: src/types/entities

src/components/common/LanguageSwitcher.tsx
├── imports: src/constants/colors
├── imports: src/constants/typography
├── imports: src/stores/languageStore
└── imports: react-i18next

src/components/common/Button.tsx
├── imports: src/constants/colors
└── imports: src/constants/typography

src/components/common/Card.tsx
└── imports: src/constants/colors

src/components/common/GlassCard.tsx
└── imports: src/constants/colors
```

### 第 4 层: 屏幕 (导入所有内容)
这些文件导入组件、store、常量：

```
app/(auth)/login.tsx
├── imports: src/stores/userStore
├── imports: src/components/common/*
├── imports: src/constants/*
└── imports: react-i18next

app/(tabs)/index.tsx
├── imports: src/components/common/ThaiPatternBackground
├── imports: src/components/common/FloatingBubbles
├── imports: src/constants/*
└── imports: src/types/entities

app/(tabs)/profile.tsx
├── imports: src/stores/userStore
├── imports: src/stores/learningStore
├── imports: src/stores/languageStore
├── imports: src/components/common/LanguageSwitcher
├── imports: src/constants/*
└── imports: react-i18next
```

### 第 5 层: 布局 (导入 Store, 控制流程)
这些文件导入 store 并控制导航：

```
app/_layout.tsx
├── imports: src/stores/userStore
└── controls: entire app navigation

app/(auth)/_layout.tsx
├── imports: src/stores/userStore
└── controls: auth screen navigation

app/(tabs)/_layout.tsx
├── imports: src/constants/*
└── controls: tab bar navigation
```

---

## 详细的文件导入分析

### 根布局: `app/_layout.tsx`

```typescript
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useUserStore } from '@/src/stores/userStore';  ← 状态
import "../global.css";
```

**依赖:**
- **Expo Router**: 导航控制
- **User Store**: 认证状态监控
- **Fonts**: 自定义字体加载 (目前禁用)
- **Splash Screen**: 加载屏幕管理
- **Gesture Handler**: 触摸手势支持

---

### 登录屏幕: `app/(auth)/login.tsx`

```typescript
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '@/src/stores/userStore';  ← 状态
import { ThaiPatternBackground } from '@/src/components/common/ThaiPatternBackground';  ← 组件
import { LanguageSwitcher } from '@/src/components/common/LanguageSwitcher';  ← 组件
import { Button } from '@/src/components/common/Button';  ← 组件
import { Colors } from '@/src/constants/colors';  ← 常量
import { Typography } from '@/src/constants/typography';  ← 常量
```

**依赖:**
- **Stores**: 用户认证状态
- **Components**: 3 个自定义组件
- **Constants**: 颜色和排版
- **i18n**: 翻译
- **Router**: 登录后导航

---

### 主屏幕: `app/(tabs)/index.tsx`

```typescript
import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Play, TrendingUp, Clock, Award, Star } from 'lucide-react-native';  ← 图标
import { BlurView } from 'expo-blur';
import { ThaiPatternBackground } from '@/src/components/common/ThaiPatternBackground';  ← 组件
import { FloatingBubbles } from '@/src/components/common/FloatingBubbles';  ← 组件
import { Colors } from '@/src/constants/colors';  ← 常量
import { Typography } from '@/src/constants/typography';  ← 常量
import { ReviewItem } from '@/src/types/entities';  ← 类型
```

**依赖:**
- **Components**: 2 个自定义组件
- **Icons**: 5 个来自 lucide-react-native 的图标
- **Types**: ReviewItem 接口
- **Constants**: 颜色和排版
- **Router**: 导航到复习模态框

---

### 个人资料屏幕: `app/(tabs)/profile.tsx`

```typescript
import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Award, TrendingUp, Clock, Trophy, Settings, LogOut } from 'lucide-react-native';  ← 图标
import { useTranslation } from 'react-i18next';
import { useUserStore } from '@/src/stores/userStore';  ← 状态
import { useLearningStore } from '@/src/stores/learningStore';  ← 状态
import { useLanguageStore } from '@/src/stores/languageStore';  ← 状态
import { LanguageSwitcher } from '@/src/components/common/LanguageSwitcher';  ← 组件
import { Colors } from '@/src/constants/colors';  ← 常量
import { Typography } from '@/src/constants/typography';  ← 常量
```

**依赖:**
- **Stores**: 3 个 store (user, learning, language)
- **Component**: LanguageSwitcher
- **Icons**: 6 个图标
- **i18n**: 翻译
- **Constants**: 颜色和排版

**连接最多屏幕**: Profile 从 3 个不同的 store 导入！

---

### User Store: `src/stores/userStore.ts`

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
```

**依赖:**
- **Zustand**: 状态管理库
- **Middleware**: 持久化中间件
- **AsyncStorage**: 移动端本地存储

**导出:**
```typescript
export const useUserStore  // 用于组件的 Hook
```

**被使用:**
- `app/_layout.tsx`
- `app/(auth)/_layout.tsx`
- `app/(auth)/login.tsx`
- `app/(tabs)/profile.tsx`

---

### Learning Store: `src/stores/learningStore.ts`

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Course, LearningProgress, Level } from '../types/entities';  ← 类型
```

**依赖:**
- **Zustand**: 状态管理
- **Types**: 实体定义

**导出:**
```typescript
export const useLearningStore  // 用于组件的 Hook
```

**被使用:**
- `app/(tabs)/profile.tsx`
- (未来: 学习屏幕)

---

### Language Store: `src/stores/languageStore.ts`

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '@/src/i18n';  ← 国际化
```

**依赖:**
- **Zustand**: 状态管理
- **i18n**: 国际化实例

**导出:**
```typescript
export const useLanguageStore  // 用于组件的 Hook
```

**被使用:**
- `src/components/common/LanguageSwitcher.tsx`
- `app/(tabs)/profile.tsx`

---

### ThaiPatternBackground 组件: `src/components/common/ThaiPatternBackground.tsx`

```typescript
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Defs, Pattern, Rect, Path } from 'react-native-svg';
import { Colors } from '@/src/constants/colors';  ← 常量
```

**依赖:**
- **React Native SVG**: 矢量图形
- **Colors**: 颜色常量

**被使用:**
- `app/(auth)/login.tsx`
- `app/(tabs)/index.tsx`

---

### FloatingBubbles 组件: `src/components/common/FloatingBubbles.tsx`

```typescript
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Play } from 'lucide-react-native';  ← 图标
import { ReviewItem } from '@/src/types/entities';  ← 类型
import { Colors } from '@/src/constants/colors';  ← 常量
import { Typography } from '@/src/constants/typography';  ← 常量
```

**依赖:**
- **Types**: ReviewItem 接口
- **Icons**: 播放按钮图标
- **Constants**: 颜色和排版

**被使用:**
- 仅 `app/(tabs)/index.tsx`

---

### LanguageSwitcher 组件: `src/components/common/LanguageSwitcher.tsx`

```typescript
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Globe } from 'lucide-react-native';  ← 图标
import { useTranslation } from 'react-i18next';
import { useLanguageStore } from '@/src/stores/languageStore';  ← 状态
import { Colors } from '@/src/constants/colors';  ← 常量
import { Typography } from '@/src/constants/typography';  ← 常量
```

**依赖:**
- **Store**: 语言 store (状态 + i18n 更新)
- **i18n**: 翻译 hook
- **Constants**: 颜色和排版

**被使用:**
- `app/(auth)/login.tsx` (紧凑变体)
- `app/(tabs)/profile.tsx` (完整变体)

---

### i18n 配置: `src/i18n/index.ts`

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import zhTranslations from './locales/zh';  ← 翻译
import enTranslations from './locales/en';  ← 翻译
```

**依赖:**
- **i18next**: 核心 i18n 库
- **react-i18next**: React 集成
- **expo-localization**: 设备语言检测
- **Translation files**: 中文和英文

**导出:**
```typescript
export default i18n;  // i18n 实例
```

**被使用:**
- `src/stores/languageStore.ts`
- 所有使用 `useTranslation()` 的屏幕

---

## 路径别名: `@/`

项目使用配置在以下文件中的 **路径别名**:

### `tsconfig.json`
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### `babel.config.js`
```javascript
module.exports = {
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@': '.',
        },
      },
    ],
  ],
};
```

**使用示例:**
```typescript
// 而不是这样:
import { Colors } from '../../../src/constants/colors';

// 你可以这样写:
import { Colors } from '@/src/constants/colors';
```

**好处:**
- 更短的导入路径
- 无相对路径混淆 (`../../../`)
- 易于文件移动 (导入不会中断)

---

## 外部包依赖

### 导航与路由
```json
{
  "expo-router": "~4.0.20",
  "react-native-screens": "~4.4.0",
  "react-native-safe-area-context": "4.12.0",
  "expo-linking": "~7.0.5"
}
```

### 状态管理
```json
{
  "zustand": "^5.0.8",
  "@react-native-async-storage/async-storage": "1.23.1"
}
```

### UI 与动画
```json
{
  "react-native-reanimated": "~3.16.1",
  "react-native-gesture-handler": "~2.20.2",
  "expo-blur": "~14.0.3",
  "expo-linear-gradient": "~14.0.2",
  "lucide-react-native": "^0.554.0",
  "react-native-svg": "15.8.0"
}
```

### 国际化
```json
{
  "i18next": "^25.6.3",
  "react-i18next": "^16.3.4",
  "expo-localization": "~15.0.3"
}
```

### 排版
```json
{
  "expo-font": "~13.0.4",
  "@expo-google-fonts/playfair-display": "^0.4.2",
  "@expo-google-fonts/noto-serif-sc": "^0.4.2",
  "@expo-google-fonts/sarabun": "^0.4.1"
}
```

---

## 应避免的导入反模式

### ❌ 循环依赖
```typescript
// 不要: Store 导入组件, 组件导入 store
// userStore.ts
import { LoginButton } from '@/src/components/LoginButton';

// LoginButton.tsx
import { useUserStore } from '@/src/stores/userStore';
```

**解决方案:** 只有组件应该导入 store，绝不反过来。

### ❌ 深层相对路径
```typescript
// 不要
import { Colors } from '../../../src/constants/colors';

// 要
import { Colors } from '@/src/constants/colors';
```

### ❌ 从错误的 Barrel 导入
```typescript
// 不要: 从重复的类型文件导入
import { User } from '@/src/types/entities';

// 要: 从主要实体文件导入
import { User } from '@/src/entities/types/entities';
```

---

## 依赖图总结

```
CONSTANTS (colors, typography)
    ↓ 被导入
TYPES (entities)
    ↓ 被导入
STORES (userStore, learningStore, languageStore)
    ↓ 被导入
COMPONENTS (ThaiPatternBackground, FloatingBubbles, LanguageSwitcher)
    ↓ 被导入
SCREENS (login, index, profile)
    ↓ 被控制
LAYOUTS (_layout files)
```

**清晰的依赖流:** 下层绝不导入上层。

---

## 不从项目导入任何内容的文件

这些文件具有 **零内部依赖**:

1. `src/constants/colors.ts`
2. `src/constants/typography.ts`
3. `src/i18n/locales/zh.ts`
4. `src/i18n/locales/en.ts`
5. `src/entities/types/entities.ts`

**这些是基础** - 修改它们要小心，因为许多文件依赖它们！

---

## 连接最多的文件 (中心依赖)

### 被导入最多的前 5 个文件

1. **`src/constants/colors.ts`** - 几乎被每个组件导入
2. **`src/constants/typography.ts`** - 几乎被每个组件导入
3. **`src/stores/userStore.ts`** - 被 4 个文件导入
4. **`src/types/entities.ts`** - 被 3 个文件导入
5. **`src/i18n/index.ts`** - 被 2 个 store + 所有使用翻译的屏幕导入

### 导入最多的前 3 个文件

1. **`app/(tabs)/profile.tsx`** - 导入 3 个 store + 组件 + 常量
2. **`app/(tabs)/index.tsx`** - 导入 2 个组件 + 5 个图标 + 常量
3. **`app/(auth)/login.tsx`** - 导入 1 个 store + 3 个组件 + 常量

---

## 重构机会

### 问题 1: 重复的类型定义
**问题:** 两个位置有相同的类型:
- `src/types/entities.ts`
- `src/entities/types/entities.ts`

**解决方案:** 删除一个，更新导入

### 问题 2: userStore 中的内联类型
**问题:** `User` 接口定义在 `userStore.ts` 中，而不是使用共享类型

**解决方案:** 从 `entities.ts` 导入

---

## 总结

项目遵循 **清晰的分层架构**:

1. **常量 & 类型** - 基础层，无依赖
2. **i18n & Stores** - 基础设施层，依赖第 1 层
3. **组件** - UI 层，依赖第 1-2 层
4. **屏幕** - 功能层，依赖第 1-3 层
5. **布局** - 控制层，编排一切

**路径别名 `@/`** 使所有导入清晰一致。

**不存在循环依赖** - 代码库结构良好！
