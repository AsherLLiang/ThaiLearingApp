# ThaiLearningApp 项目快照 v5
**日期**: 2025-12-04  
**版本**: v5  
**状态**: 学习流程重构完成，国际化集成完成

---

## 📋 目录
1. [项目概述](#项目概述)
2. [技术栈](#技术栈)
3. [项目架构](#项目架构)
4. [UI 设计系统](#ui-设计系统)
5. [核心功能模块](#核心功能模块)
6. [关键代码示例](#关键代码示例)
7. [后端接入指南](#后端接入指南)
8. [国际化 (i18n)](#国际化-i18n)
9. [状态管理](#状态管理)
10. [开发规范](#开发规范)

---

## 项目概述

**ThaiLearningApp** 是一款泰语学习应用，采用 React Native + Expo 构建，提供沉浸式的泰语学习体验。

### 核心特性
- ✅ 统一学习会话流程（复习 + 新词学习）
- ✅ 间隔重复算法（Mock 实现，每个单词重复 3 次）
- ✅ 完整的国际化支持（中文/英文）
- ✅ 泰国风格 UI 设计（金色/墨色主题）
- ✅ 腾讯云开发后端集成准备

---

## 技术栈

### 前端框架
```json
{
  "expo": "~52.0.11",
  "react": "18.3.1",
  "react-native": "0.76.5",
  "expo-router": "~4.0.9"
}
```

### 核心依赖
- **UI**: `expo-blur`, `lucide-react-native`, `react-native-safe-area-context`
- **国际化**: `i18next`, `react-i18next`, `expo-localization`
- **状态管理**: `zustand`
- **后端**: `@cloudbase/js-sdk` (腾讯云开发)

### 开发工具
- TypeScript
- ESLint
- Jest (测试)

---

## 项目架构

### 目录结构
```
ThaiLearningApp/
├── app/                          # Expo Router 页面
│   ├── (auth)/                   # 认证相关页面
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── forgot-password.tsx
│   ├── (tabs)/                   # 底部导航页面
│   │   ├── index.tsx             # 首页
│   │   ├── courses.tsx           # 课程列表
│   │   └── profile.tsx           # 个人中心
│   ├── learning/                 # 学习模块
│   │   └── index.tsx             # 统一学习会话
│   └── _layout.tsx               # 根布局
├── src/
│   ├── components/               # 组件库
│   │   ├── common/               # 通用组件
│   │   │   ├── ThaiPatternBackground.tsx
│   │   │   ├── FloatingBubbles.tsx
│   │   │   └── LanguageSwitcher.tsx
│   │   ├── learning/             # 学习组件
│   │   │   ├── NewWordView.tsx   # 新词学习视图
│   │   │   └── ReviewWordView.tsx # 复习视图
│   │   ├── progress/             # 进度组件
│   │   └── pronunciation/        # 发音组件
│   ├── constants/                # 常量
│   │   ├── colors.ts             # 颜色系统
│   │   └── typography.ts         # 字体系统
│   ├── i18n/                     # 国际化
│   │   ├── index.ts
│   │   └── locales/
│   │       ├── zh.ts             # 中文翻译
│   │       └── en.ts             # 英文翻译
│   ├── stores/                   # Zustand 状态管理
│   │   ├── authStore.ts
│   │   ├── languageStore.ts
│   │   └── learningStore.ts
│   ├── entities/                 # 类型定义
│   │   └── types/
│   │       └── entities.ts
│   └── utils/                    # 工具函数
└── cloudbase/                    # 腾讯云开发
    └── functions/                # 云函数
```

---

## UI 设计系统

### 颜色系统 (`src/constants/colors.ts`)

```typescript
export const Colors = {
  // 主色调 - 泰国风格
  paper: '#FAF9F6',        // 纸张白 - 背景色
  ink: '#1A1A1A',          // 墨黑 - 主文本
  sand: '#E5E2DB',         // 沙色 - 边框/分隔
  taupe: '#8E8B82',        // 灰褐 - 次要文本
  thaiGold: '#D4AF37',     // 泰金 - 强调色
  accent: '#B8956A',       // 辅助金
  white: '#FFFFFF',
  glassWhite: 'rgba(255, 255, 255, 0.85)',
  
  // 功能色
  error: '#DC2626',
  red: {
    50: '#FEF2F2',
    600: '#DC2626',
  },
} as const;
```

### 字体系统 (`src/constants/typography.ts`)

```typescript
export const Typography = {
  // 字体家族
  playfairRegular: 'PlayfairDisplay_400Regular',
  playfairBold: 'PlayfairDisplay_700Bold',
  notoSerifRegular: 'NotoSerifSC_400Regular',
  notoSerifBold: 'NotoSerifSC_700Bold',
  sarabunRegular: 'Sarabun_400Regular',    // 泰文专用
  sarabunBold: 'Sarabun_700Bold',
  
  // 字号
  h1: 32,
  h2: 24,
  h3: 20,
  body: 16,
  caption: 14,
  small: 12,
  
  // 字重
  regular: '400' as const,
  semibold: '600' as const,
  bold: '700' as const,
} as const;
```

### UI 组件模式

#### 1. 卡片样式
```typescript
const cardStyle = {
  backgroundColor: Colors.white,
  borderRadius: 16,
  padding: 24,
  borderWidth: 1,
  borderColor: Colors.sand,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.05,
  shadowRadius: 8,
  elevation: 2,
};
```

#### 2. 按钮样式
```typescript
// 主按钮
const primaryButton = {
  backgroundColor: Colors.ink,
  borderRadius: 12,
  paddingVertical: 14,
  paddingHorizontal: 32,
  shadowColor: Colors.thaiGold,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.2,
  shadowRadius: 8,
};

// 次要按钮
const secondaryButton = {
  backgroundColor: 'rgba(212, 175, 55, 0.1)',
  borderRadius: 12,
  paddingVertical: 14,
  paddingHorizontal: 32,
  borderWidth: 1,
  borderColor: Colors.thaiGold,
};
```

#### 3. 输入框样式
```typescript
const inputStyle = {
  backgroundColor: Colors.white,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: Colors.sand,
  paddingHorizontal: 16,
  paddingVertical: 12,
  fontFamily: Typography.notoSerifRegular,
  fontSize: 16,
  color: Colors.ink,
};
```

---

## 核心功能模块

### 1. 学习会话系统 (`app/learning/index.tsx`)

#### 功能描述
统一的学习会话，包含复习和新词学习两个阶段。

#### 核心逻辑
```typescript
// 队列项类型
interface QueueItem {
  word: WordData;
  type: 'review' | 'new';
  repetitionsLeft: number;  // 剩余重复次数
}

// 初始化会话
useEffect(() => {
  // 1. 加载旧词（复习）
  const reviewItems: QueueItem[] = oldWords.map(w => ({
    word: w,
    type: 'review',
    repetitionsLeft: 3  // 每个词重复 3 次
  }));

  // 2. 加载新词
  const newItems: QueueItem[] = newWords.map(w => ({
    word: w,
    type: 'new',
    repetitionsLeft: 3
  }));

  // 3. 合并队列（复习在前）
  setQueue([...reviewItems, ...newItems]);
}, []);

// 处理下一个
const handleNext = () => {
  const nextQueue = [...queue];
  const currentQueueItem = nextQueue[currentIndex];
  
  // 减少重复次数
  currentQueueItem.repetitionsLeft -= 1;
  
  // 如果还需要重复，加入队列末尾
  if (currentQueueItem.repetitionsLeft > 0) {
    nextQueue.push({ ...currentQueueItem });
  }
  
  // 移动到下一项
  if (currentIndex < nextQueue.length - 1) {
    setQueue(nextQueue);
    setCurrentIndex(prev => prev + 1);
  } else {
    setIsSessionComplete(true);
  }
};
```

#### UI 结构
```tsx
<SafeAreaView>
  <ThaiPatternBackground opacity={0.05} />
  
  {/* 顶部进度条 */}
  <View style={styles.header}>
    <Pressable onPress={handleClose}>
      <X size={24} color={Colors.taupe} />
    </Pressable>
    
    <View style={styles.progressBarContainer}>
      <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
    </View>
    
    {mode === 'REVIEW' && (
      <Pressable onPress={handleSkipReview}>
        <Text>{t('learning.skipReview')}</Text>
      </Pressable>
    )}
  </View>
  
  {/* 主内容区 */}
  <View style={styles.content}>
    {currentItem.type === 'review' ? (
      <ReviewWordView word={currentItem.word} onNext={handleNext} />
    ) : (
      <NewWordView word={currentItem.word} onNext={handleNext} />
    )}
  </View>
</SafeAreaView>
```

### 2. 新词学习组件 (`src/components/learning/NewWordView.tsx`)

#### 功能特性
- 三个标签页：基础释义、例句示例、用法详解
- 模糊遮罩，点击"查看释义"后显示
- 完全国际化

#### 核心代码
```tsx
export const NewWordView: React.FC<NewWordViewProps> = ({ word, onNext }) => {
  const { t } = useTranslation();
  const [isRevealed, setIsRevealed] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'examples' | 'usage'>('basic');

  return (
    <View style={styles.container}>
      {/* 单词卡片 */}
      <View style={styles.wordCard}>
        <Text style={styles.thaiWord}>{word.thai}</Text>
        <View style={styles.phoneticRow}>
          <Pressable style={styles.audioButton}>
            <Volume2 size={20} color={Colors.thaiGold} />
          </Pressable>
          <Text style={styles.phoneticText}>{word.phonetic}</Text>
        </View>
      </View>

      {/* 释义区域 */}
      <View style={styles.detailsContainer}>
        {/* 标签页 */}
        <View style={styles.tabs}>
          <Pressable onPress={() => setActiveTab('basic')}>
            <Text>{t('learning.basicDefinition')}</Text>
          </Pressable>
          {/* ... 其他标签 */}
        </View>

        {/* 内容区（带模糊遮罩） */}
        <View style={styles.scrollAreaWrapper}>
          <ScrollView>
            {activeTab === 'basic' && <Text>{word.definitions.basic}</Text>}
            {/* ... 其他内容 */}
          </ScrollView>
          
          {!isRevealed && (
            <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="light">
              <View style={styles.blurOverlayContent} />
            </BlurView>
          )}
        </View>
      </View>

      {/* 底部按钮 */}
      <View style={styles.bottomBar}>
        {!isRevealed ? (
          <Pressable onPress={() => setIsRevealed(true)}>
            <Text>{t('learning.viewDefinition')}</Text>
          </Pressable>
        ) : (
          <Pressable onPress={onNext}>
            <Text>{t('learning.nextEnter')}</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};
```

### 3. 复习组件 (`src/components/learning/ReviewWordView.tsx`)

#### 功能特性
- 显示单词 + 音标 + 例句
- 三个按钮：忘记了、模糊、认识
- 点击任意按钮后显示释义

#### 核心代码
```tsx
export const ReviewWordView: React.FC<ReviewWordViewProps> = ({ word, onAnswer, onNext }) => {
  const { t } = useTranslation();
  const [isRevealed, setIsRevealed] = useState(false);

  const handleReveal = (quality: 'know' | 'unsure' | 'forgot') => {
    setIsRevealed(true);
    onAnswer(quality);  // 回调给父组件记录答案
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* 单词 */}
        <Text style={styles.thaiWord}>{word.thai}</Text>
        
        {/* 音标 */}
        <View style={styles.phoneticRow}>
          <Pressable style={styles.audioButton}>
            <Volume2 size={20} color={Colors.thaiGold} />
          </Pressable>
          <Text style={styles.phoneticText}>{word.phonetic}</Text>
        </View>

        {/* 例句 */}
        <View style={styles.contextContainer}>
          <Text style={styles.contextThai}>{exampleSentence.thai}</Text>
          <Text style={styles.contextMeaning}>{exampleSentence.meaning}</Text>
        </View>

        {/* 模糊的释义区 */}
        <View style={styles.blurredAreaContainer}>
          <View style={styles.blurredContent}>
            <Text style={styles.mainMeaning}>{word.meaning}</Text>
            <Text style={styles.definitionText}>{word.definitions.basic}</Text>
          </View>
          
          {!isRevealed && (
            <BlurView intensity={60} style={StyleSheet.absoluteFill} tint="dark">
              <View style={styles.blurOverlay} />
            </BlurView>
          )}
        </View>
      </ScrollView>

      {/* 底部按钮 */}
      <View style={styles.bottomBar}>
        {!isRevealed ? (
          <View style={styles.buttonGrid}>
            <Pressable onPress={() => handleReveal('forgot')}>
              <Text>{t('learning.forgot')}</Text>
            </Pressable>
            <Pressable onPress={() => handleReveal('unsure')}>
              <Text>{t('learning.unsure')}</Text>
            </Pressable>
            <Pressable onPress={() => handleReveal('know')}>
              <Text>{t('learning.know')}</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable onPress={onNext}>
            <Text>{t('learning.next')}</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};
```

---

## 关键代码示例

### 数据类型定义

```typescript
// 单词数据结构
export interface WordData {
  id: string;
  thai: string;           // 泰文
  phonetic: string;       // 罗马音
  type: string;           // 词性
  meaning: string;        // 中文释义
  definitions: {
    basic: string;        // 基础释义
    examples: {           // 例句
      thai: string;
      meaning: string;
    }[];
    usage: {              // 用法详解
      grammar: {
        label: string;
        content: string;
        example?: string;
      }[];
      diff: string;       // 与中文差异
      mistakes: string;   // 常见错误
      similar: string;    // 相似词汇
    };
  };
}
```

### 通用组件模式

#### ThaiPatternBackground
```tsx
export const ThaiPatternBackground: React.FC<{ opacity?: number }> = ({ opacity = 0.1 }) => {
  return (
    <View style={[styles.container, { opacity }]}>
      {/* SVG 泰式花纹 */}
    </View>
  );
};
```

#### 使用示例
```tsx
<SafeAreaView style={styles.container}>
  <ThaiPatternBackground opacity={0.05} />
  {/* 其他内容 */}
</SafeAreaView>
```

---

## 后端接入指南

### 腾讯云开发配置

#### 1. 初始化 SDK
```typescript
// src/config/cloudbase.ts
import cloudbase from '@cloudbase/js-sdk';

const app = cloudbase.init({
  env: process.env.EXPO_PUBLIC_CLOUDBASE_ENV_ID,
});

export const auth = app.auth();
export const db = app.database();
export const callFunction = app.callFunction;
```

#### 2. 认证集成
```typescript
// src/stores/authStore.ts
import { auth } from '@/src/config/cloudbase';

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  
  login: async (email: string, password: string) => {
    try {
      const result = await auth.signInWithEmailAndPassword(email, password);
      set({ user: result.user });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  logout: async () => {
    await auth.signOut();
    set({ user: null });
  },
}));
```

### API 接口设计

#### 1. 获取学习队列
```typescript
// 前端调用
const fetchLearningQueue = async (userId: string) => {
  const result = await callFunction({
    name: 'getLearningQueue',
    data: { userId }
  });
  
  return result.result as {
    reviewWords: WordData[];
    newWords: WordData[];
  };
};
```

#### 2. 云函数示例 (`cloudbase/functions/getLearningQueue/index.js`)
```javascript
const cloud = require('@cloudbase/node-sdk');
const app = cloud.init({ env: cloud.SYMBOL_CURRENT_ENV });
const db = app.database();

exports.main = async (event) => {
  const { userId } = event;
  
  // 1. 获取用户学习进度
  const userProgress = await db.collection('user_progress')
    .where({ userId })
    .get();
  
  // 2. 获取需要复习的单词（根据间隔重复算法）
  const reviewWords = await db.collection('words')
    .where({
      userId,
      nextReviewDate: db.command.lte(new Date())
    })
    .limit(5)
    .get();
  
  // 3. 获取新词
  const newWords = await db.collection('words')
    .where({
      courseId: userProgress.data[0].currentCourseId,
      learned: false
    })
    .limit(5)
    .get();
  
  return {
    reviewWords: reviewWords.data,
    newWords: newWords.data
  };
};
```

#### 3. 提交学习结果
```typescript
// 前端调用
const submitLearningResult = async (data: {
  userId: string;
  wordId: string;
  quality: 'know' | 'unsure' | 'forgot';
  timestamp: number;
}) => {
  await callFunction({
    name: 'submitLearningResult',
    data
  });
};
```

#### 4. 云函数示例 (`cloudbase/functions/submitLearningResult/index.js`)
```javascript
exports.main = async (event) => {
  const { userId, wordId, quality, timestamp } = event;
  
  // 1. 记录学习历史
  await db.collection('learning_history').add({
    userId,
    wordId,
    quality,
    timestamp,
    createdAt: new Date()
  });
  
  // 2. 更新单词的下次复习时间（间隔重复算法）
  const intervals = {
    'forgot': 1,      // 1 天后
    'unsure': 3,      // 3 天后
    'know': 7         // 7 天后
  };
  
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + intervals[quality]);
  
  await db.collection('words').doc(wordId).update({
    nextReviewDate,
    lastReviewDate: new Date(),
    reviewCount: db.command.inc(1)
  });
  
  return { success: true };
};
```

### 数据库设计

#### 集合：`words`
```javascript
{
  _id: "word_001",
  courseId: "course_001",
  thai: "กิน",
  phonetic: "Kin",
  type: "动词",
  meaning: "吃",
  definitions: {
    basic: "吃，食用",
    examples: [
      { thai: "กินข้าวหรือยัง", meaning: "吃饭了吗？" }
    ],
    usage: { /* ... */ }
  },
  createdAt: ISODate("2025-12-01"),
  updatedAt: ISODate("2025-12-01")
}
```

#### 集合：`user_progress`
```javascript
{
  _id: "progress_001",
  userId: "user_001",
  currentCourseId: "course_001",
  learnedWords: ["word_001", "word_002"],
  totalWordsLearned: 2,
  streakDays: 12,
  lastStudyDate: ISODate("2025-12-04"),
  createdAt: ISODate("2025-11-01"),
  updatedAt: ISODate("2025-12-04")
}
```

#### 集合：`learning_history`
```javascript
{
  _id: "history_001",
  userId: "user_001",
  wordId: "word_001",
  quality: "know",  // 'know' | 'unsure' | 'forgot'
  timestamp: 1733270400000,
  createdAt: ISODate("2025-12-04")
}
```

---

## 国际化 (i18n)

### 配置 (`src/i18n/index.ts`)
```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import zh from './locales/zh';
import en from './locales/en';

const LANGUAGE_KEY = 'user-language';

const getStoredLanguage = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(LANGUAGE_KEY);
  } catch (error) {
    return null;
  }
};

const getDeviceLanguage = (): string => {
  const locale = Localization.locale;
  const languageCode = locale.split('-')[0];
  return languageCode === 'zh' ? 'zh' : 'en';
};

const initI18n = async () => {
  const storedLanguage = await getStoredLanguage();
  const initialLanguage = storedLanguage || getDeviceLanguage();

  i18n
    .use(initReactI18next)
    .init({
      resources: {
        zh: { translation: zh },
        en: { translation: en },
      },
      lng: initialLanguage,
      fallbackLng: 'zh',
      interpolation: {
        escapeValue: false,
      },
    });
};

initI18n();

export default i18n;
```

### 翻译文件结构 (`src/i18n/locales/zh.ts`)
```typescript
export default {
  common: {
    confirm: '确认',
    cancel: '取消',
    loading: '加载中...',
  },
  learning: {
    basicDefinition: '基础释义',
    exampleSentences: '例句示例',
    usageDetails: '用法详解',
    viewDefinition: '查看释义',
    nextEnter: '下一个 (Enter)',
    next: '下一个',
    forgot: '忘记了',
    unsure: '模糊',
    know: '认识',
    skipReview: '跳过复习',
    sessionComplete: '学习完成！',
    backToHome: '返回首页',
  },
  // ... 其他模块
};
```

### 使用示例
```tsx
import { useTranslation } from 'react-i18next';

export const MyComponent = () => {
  const { t } = useTranslation();
  
  return (
    <View>
      <Text>{t('learning.viewDefinition')}</Text>
      <Text>{t('common.loading')}</Text>
    </View>
  );
};
```

---

## 状态管理

### Zustand Store 示例

#### 语言 Store (`src/stores/languageStore.ts`)
```typescript
import { create } from 'zustand';
import i18n from '@/src/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Language = 'zh' | 'en';

interface LanguageStore {
  currentLanguage: Language;
  changeLanguage: (lang: Language) => Promise<void>;
}

export const useLanguageStore = create<LanguageStore>((set) => ({
  currentLanguage: i18n.language as Language,
  
  changeLanguage: async (lang: Language) => {
    await i18n.changeLanguage(lang);
    await AsyncStorage.setItem('user-language', lang);
    set({ currentLanguage: lang });
  },
}));
```

#### 学习 Store (`src/stores/learningStore.ts`)
```typescript
import { create } from 'zustand';
import { WordData } from '@/src/entities/types/entities';

interface LearningStore {
  currentQueue: WordData[];
  currentIndex: number;
  setQueue: (queue: WordData[]) => void;
  nextWord: () => void;
  reset: () => void;
}

export const useLearningStore = create<LearningStore>((set) => ({
  currentQueue: [],
  currentIndex: 0,
  
  setQueue: (queue) => set({ currentQueue: queue, currentIndex: 0 }),
  
  nextWord: () => set((state) => ({
    currentIndex: state.currentIndex + 1
  })),
  
  reset: () => set({ currentQueue: [], currentIndex: 0 }),
}));
```

---

## 开发规范

### 1. 组件开发规范

#### 文件命名
- 组件文件：`PascalCase.tsx` (例: `NewWordView.tsx`)
- 工具文件：`camelCase.ts` (例: `formatDate.ts`)
- 常量文件：`camelCase.ts` (例: `colors.ts`)

#### 组件结构
```tsx
// 1. 导入
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

// 2. 类型定义
interface MyComponentProps {
  title: string;
  onPress: () => void;
}

// 3. 组件
export const MyComponent: React.FC<MyComponentProps> = ({ title, onPress }) => {
  const { t } = useTranslation();
  const [state, setState] = useState(false);
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

// 4. 样式
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.paper,
  },
  title: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 24,
    color: Colors.ink,
  },
});
```

### 2. 样式规范

#### 使用常量
```typescript
// ✅ 正确
const styles = StyleSheet.create({
  text: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: Typography.body,
    color: Colors.ink,
  },
});

// ❌ 错误
const styles = StyleSheet.create({
  text: {
    fontFamily: 'Arial',
    fontSize: 16,
    color: '#000000',
  },
});
```

#### 命名规范
```typescript
// 容器类
container, wrapper, content, section

// 布局类
row, column, grid, flex

// 文本类
title, subtitle, body, caption, label

// 交互类
button, input, card, modal

// 状态类
active, disabled, selected, focused
```

### 3. 国际化规范

#### 所有用户可见文本必须使用 i18n
```tsx
// ✅ 正确
<Text>{t('learning.viewDefinition')}</Text>

// ❌ 错误
<Text>查看释义</Text>
```

#### 翻译键命名
```typescript
// 格式: <模块>.<功能>.<具体文本>
'learning.viewDefinition'
'common.confirm'
'profile.editProfile'
```

### 4. 类型安全

#### 严格类型定义
```typescript
// ✅ 正确
interface WordData {
  id: string;
  thai: string;
  phonetic: string;
}

const word: WordData = {
  id: '001',
  thai: 'กิน',
  phonetic: 'Kin',
};

// ❌ 错误
const word: any = { /* ... */ };
```

---

## 快照总结

### v5 版本亮点
1. ✅ **学习流程重构**: 统一的学习会话，支持复习 + 新词学习
2. ✅ **间隔重复算法**: Mock 实现，每个单词重复 3 次
3. ✅ **完整国际化**: 所有用户界面文本支持中英文切换
4. ✅ **泰国风格 UI**: 金色/墨色主题，优雅的视觉设计
5. ✅ **组件化架构**: `NewWordView` 和 `ReviewWordView` 可复用组件

### 后端集成准备
- 腾讯云开发 SDK 已配置
- 云函数模板已提供
- 数据库设计已完成
- API 接口规范已定义

### 下一步建议
1. 实现真实的间隔重复算法（SM-2 或 Anki 算法）
2. 接入后端 API，替换 Mock 数据
3. 实现音频播放功能
4. 添加学习统计和进度可视化
5. 实现离线缓存

---

**文档版本**: v5  
**最后更新**: 2025-12-04  
**维护者**: ThaiLearningApp Team
