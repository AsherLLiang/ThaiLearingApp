# 泰语学习应用 - 项目快照

**用途**：让AI助手在不读取源文件的情况下理解完整项目状态

**最后更新**：2025-11-23
**版本**：1.0.0
**进度**：MVP完成30%

---

## 🎯 项目速览

**类型**：React Native泰语学习移动应用
**框架**：Expo 52 + React Native 0.76.9
**路由**：Expo Router v4（文件式路由）
**状态**：Zustand 5.0.8 + AsyncStorage
**语言**：TypeScript（严格模式）
**UI**：自定义设计系统（纸墨主题）
**国际化**：i18next实现中英文切换

---

## 📁 完整文件结构及内容摘要

```
ThaiLearningApp/
│
├── app/                                    # 路由文件（Expo Router）
│   ├── _layout.tsx                        # 根布局，认证守卫，字体加载
│   │   └── 逻辑：检查isAuthenticated → 重定向到 /(auth)/login 或 /(tabs)/
│   │
│   ├── (auth)/                            # 公开路由
│   │   ├── _layout.tsx                   # 已认证则重定向到 /(tabs)/
│   │   ├── login.tsx                     # 邮箱/密码表单，模拟登录
│   │   │   └── 导入：userStore, ThaiPatternBackground, LanguageSwitcher
│   │   └── register.tsx                  # 注册表单（后端待实现）
│   │
│   ├── (tabs)/                            # 受保护路由（需要认证）
│   │   ├── _layout.tsx                   # 自定义标签栏：3个标签+凸起的中间按钮
│   │   │   └── 组件：CustomTabBar（iOS上使用BlurView）
│   │   ├── index.tsx                     # 首页：统计、FloatingBubbles、成就
│   │   │   └── 导入：FloatingBubbles, ThaiPatternBackground
│   │   ├── courses.tsx                   # "即将推出"占位页
│   │   └── profile.tsx                   # 用户资料、统计、设置、登出
│   │       └── 导入：userStore, learningStore, languageStore, LanguageSwitcher
│   │
│   ├── admin/                             # 空（未来功能）
│   ├── learning/                          # 空（未来功能）
│   └── review-modal.tsx                   # 闪卡复习（全屏模态窗口）
│       └── 功能：卡片翻转、3个难度按钮、进度显示
│
├── src/
│   ├── components/common/
│   │   ├── ThaiPatternBackground.tsx     # SVG大象图案，可配置透明度
│   │   ├── FloatingBubbles.tsx           # 3卡堆叠显示复习项，徽章计数
│   │   ├── LanguageSwitcher.tsx          # compact/full两种变体，更新languageStore
│   │   ├── Button.tsx                     # 通用按钮，主要/次要变体
│   │   ├── Card.tsx                       # 基础卡片包装器
│   │   └── GlassCard.tsx                  # 玻璃态卡片带模糊效果
│   │
│   ├── constants/
│   │   ├── colors.ts                      # Paper, Ink, Thai Gold, Sand, Taupe, White
│   │   └── typography.ts                  # 3种字体家族，6种尺寸，3种粗细
│   │
│   ├── stores/                            # Zustand存储（全部持久化到AsyncStorage）
│   │   ├── userStore.ts                   # currentUser, isAuthenticated, authToken
│   │   │   └── 动作：login（模拟）, logout, setUser, checkAuth
│   │   ├── learningStore.ts               # currentCourse, progress, completedContent
│   │   │   └── 动作：setCourse, updateProgress, getCompletionRate, resetLearning
│   │   └── languageStore.ts               # currentLanguage ('zh' | 'en')
│   │       └── 动作：changeLanguage（同时更新i18n）
│   │
│   ├── types/entities.ts                  # 重复（应该删除）
│   ├── entities/types/entities.ts         # 主要：User, Course, LearningProgress, Level, ReviewItem
│   │
│   ├── i18n/
│   │   ├── index.ts                       # i18next配置，设备语言检测
│   │   └── locales/
│   │       ├── zh.ts                      # 中文翻译（约30个键）
│   │       └── en.ts                      # 英文翻译（约30个键）
│   │
│   ├── services/                          # 空（未来API集成）
│   ├── hooks/                             # 空（未来自定义hooks）
│   └── utils/                             # 空（未来工具函数）
│
├── assets/                                # 图片、字体、启动画面
├── docs/                                  # 文档（9个MD文件）
├── app.json                               # Expo配置
├── package.json                           # 依赖项
├── tsconfig.json                          # TS配置，路径别名 @/*
├── babel.config.js                        # 路径解析插件
└── global.css                             # 全局样式
```

---

## 🏗️ 架构模式

### 路由模式
```typescript
// 根布局认证守卫模式
useEffect(() => {
  const inAuthGroup = segments[0] === '(auth)';
  if (!isAuthenticated && !inAuthGroup) {
    router.replace('/(auth)/login');  // 未登录 → 登录页
  } else if (isAuthenticated && inAuthGroup) {
    router.replace('/(tabs)');        // 已登录 → 应用内
  }
}, [isAuthenticated, segments]);
```

### 状态管理模式
```typescript
// 所有store遵循此模式
export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // 状态
      currentUser: null,
      isAuthenticated: false,

      // 动作
      login: async (email, password) => {
        // 目前是模拟
        set({ currentUser: mockUser, isAuthenticated: true });
      },
    }),
    {
      name: 'user-storage',  // AsyncStorage键
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

### 组件模式（Props vs State）
```typescript
// 基于Props（无状态）
export const FloatingBubbles: React.FC<Props> = ({ reviews, onOpenReview }) => {
  return <Pressable onPress={onOpenReview}>{/* UI */}</Pressable>;
};

// 基于State（Zustand）
export default function ProfileScreen() {
  const { currentUser } = useUserStore();  // 全局状态
  const [localState, setLocalState] = useState();  // 本地UI状态
  return <View />;
}
```

---

## 📦 完整类型定义

```typescript
// src/entities/types/entities.ts

enum UserRole {
  LEARNER = 'LEARNER',    // 学习者
  ADMIN = 'ADMIN'         // 管理员
}

enum Level {
  BEGINNER_A = 'BEGINNER_A',      // 初级A
  BEGINNER_B = 'BEGINNER_B',      // 初级B
  INTERMEDIATE = 'INTERMEDIATE',   // 中级
  ADVANCED = 'ADVANCED'            // 高级
}

interface User {
  userId: string;           // 用户ID
  email: string;            // 邮箱
  password: string;         // 密码
  displayName: string;      // 显示名称
  role: UserRole;           // 角色
  registrationDate: Date;   // 注册日期
  lastLoginDate: Date;      // 最后登录日期
}

interface Course {
  courseId: string;         // 课程ID
  courseName: string;       // 课程名称
  description: string;      // 描述
  level: Level;             // 等级
  isActive: boolean;        // 是否激活
}

interface LearningProgress {
  progressId: string;          // 进度ID
  userId: string;              // 用户ID
  courseId: string;            // 课程ID
  currentLevel: Level;         // 当前等级
  completedAlphabets: number;     // 已完成字母 (0-76)
  completedVocabulary: number;    // 已完成词汇 (0-500)
  completedSentences: number;     // 已完成句子 (0-100)
  completedArticles: number;      // 已完成文章 (0-20)
  totalScore: number;             // 总分
  totalStudyTime: number;         // 总学习时长（分钟）
  streakDays: number;             // 连续天数
  lastUpdated: Date;              // 最后更新
}

interface ReviewItem {
  id: string;              // ID
  char: string;            // 泰语字符
  phonetic: string;        // 罗马音
  meaning?: string;        // 翻译
  type: 'Review' | 'Hard' | 'New';  // 类型
  dueIn?: string;          // 到期时间
}
```

---

## 🎨 设计系统标记

```typescript
// src/constants/colors.ts
export const Colors = {
  paper: '#FAF9F6',        // 背景（米白色）
  ink: '#1A1A1A',          // 主要文本（深黑）
  sand: '#E5E2DB',         // 边框（沙色）
  taupe: '#8E8B82',        // 次要文本（灰褐色）
  thaiGold: '#D4AF37',     // 强调色（泰金色）
  accent: '#B8956A',       // 次要强调
  white: '#FFFFFF',        // 白色
  glassWhite: 'rgba(255, 255, 255, 0.85)',  // 玻璃白
  error: '#DC2626'         // 错误红
};

// src/constants/typography.ts
export const Typography = {
  // 字体
  playfairRegular: 'PlayfairDisplay_400Regular',   // 英文标题
  playfairBold: 'PlayfairDisplay_700Bold',
  notoSerifRegular: 'NotoSerifSC_400Regular',      // 中文
  notoSerifBold: 'NotoSerifSC_700Bold',
  sarabunRegular: 'Sarabun_400Regular',            // 泰文
  sarabunBold: 'Sarabun_700Bold',

  // 尺寸
  h1: 32, h2: 24, h3: 20,
  body: 16, caption: 14, small: 12,

  // 粗细
  regular: '400', semibold: '600', bold: '700'
};
```

---

## 🔧 代码风格与约定

### 文件组织
```typescript
// 1. 导入（分组：React → RN → 第三方 → 内部）
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/src/stores/userStore';
import { Colors } from '@/src/constants/colors';

// 2. 类型/接口
interface Props {
  title: string;
}

// 3. 组件
export default function Component({ title }: Props) {
  return <View />;
}

// 4. 样式
const styles = StyleSheet.create({});
```

### 命名约定
- **组件**：PascalCase（`FloatingBubbles.tsx`）
- **文件**：工具用camelCase，组件用PascalCase
- **变量**：camelCase（`currentUser`, `isAuthenticated`）
- **常量**：真常量用UPPER_CASE，对象用PascalCase（`Colors`, `Typography`）
- **类型**：PascalCase（`User`, `Course`）
- **Store hooks**：`useXxxStore`（`useUserStore`）

### TypeScript规则
```typescript
// ✅ 总是类型化props
interface Props { title: string; }
export const Component: React.FC<Props> = ({ title }) => {};

// ✅ 类型化store状态
interface UserState { currentUser: User | null; }

// ✅ 避免'any'
const data: ReviewItem[] = [];  // 不要：const data: any = [];

// ✅ 可选props用 ?
interface Props { onPress?: () => void; }
```

### 样式模式
```typescript
// ✅ 使用StyleSheet.create
const styles = StyleSheet.create({
  container: {
    padding: 24,                    // 8的倍数
    backgroundColor: Colors.paper,  // 来自常量
    borderRadius: 24,               // 柔和圆角（24, 16, 12, 8）
  }
});

// ✅ 响应式安全区域
import { SafeAreaView } from 'react-native-safe-area-context';
<SafeAreaView edges={['top']}>{/* 内容 */}</SafeAreaView>

// ✅ 平台特定代码
Platform.OS === 'ios' && <BlurView />
```

---

## 🔄 数据流示例

### 登录流程
```
1. 用户输入邮箱+密码
2. LoginScreen: await userStore.login(email, password)
3. userStore: set({ isAuthenticated: true, currentUser: {...} })
4. AsyncStorage: 自动保存状态（persist中间件）
5. 根布局：useEffect检测到isAuthenticated = true
6. 根布局：router.replace('/(tabs)')
7. 首页：从userStore读取currentUser
```

### 语言切换流程
```
1. LanguageSwitcher: changeLanguage('en')
2. languageStore: set({ currentLanguage: 'en' })
3. languageStore: i18n.changeLanguage('en')
4. AsyncStorage: 保存偏好
5. 所有使用useTranslation()的页面：重新渲染
6. 文本更新："登录" → "Login"
```

### 复习会话流程（当前）
```
1. 首页：显示FloatingBubbles和模拟复习项
2. 用户点击：router.push('/review-modal')
3. 模态窗口打开：显示闪卡
4. 用户复习：点击难度按钮
5. 模态窗口完成：router.back()
6. （未来）进度更新：learningStore.updateProgress('alphabet', 5)
```

---

## 🚦 当前实现状态

### ✅ 已完全实现
- **认证UI**：登录、注册页面（模拟后端）
- **认证守卫**：根布局基于isAuthenticated重定向
- **标签导航**：自定义3标签栏，中间凸起按钮
- **首页**：统计、FloatingBubbles、成就列表
- **个人中心**：用户信息、学习统计、语言切换、登出
- **复习模态窗口**：闪卡UI、难度按钮
- **状态持久化**：3个store全部保存到AsyncStorage
- **多语言**：中英文i18next切换
- **设计系统**：颜色、字体、可复用组件

### 🔄 部分实现
- **学习进度**：结构存在，无真实数据/更新
- **课程系统**：类型已定义，无内容加载
- **复习系统**：UI完成，无间隔重复算法

### ❌ 未实现
- **真实认证**：目前是模拟登录
- **后端API**：无服务实现
- **课程内容**：无真实课程/课时
- **音频/TTS**：UI存在（播放按钮），无音频实现
- **管理面板**：空文件夹
- **学习模块**：空文件夹
- **离线支持**：仅AsyncStorage，无完整离线模式
- **分析**：无跟踪
- **社交功能**：无好友/排行榜

---

## 🐛 已知问题与技术债务

### 问题1：重复的类型定义
**文件**：`src/types/entities.ts` + `src/entities/types/entities.ts`
**需要行动**：删除`src/types/entities.ts`，更新导入使用`src/entities/types/entities.ts`

### 问题2：字体加载已禁用
**文件**：`app/_layout.tsx:17-19`
**原因**：找不到字体文件，useFonts返回空对象
**当前状态**：使用系统字体，自定义字体未加载
**需要行动**：添加字体文件到assets或移除字体导入

### 问题3：模拟认证
**文件**：`src/stores/userStore.ts:41-63`
**当前**：硬编码模拟用户，无真实API调用
**需要行动**：在`src/services/`实现真实API集成

### 问题4：未使用的注册函数
**文件**：`src/stores/userStore.ts:32-40`
**问题**：`register`动作存在但未在接口中导出
**需要行动**：添加到UserState接口或删除

### 问题5：不一致的Tab索引
**文件**：`app/(tabs)/_layout.tsx:72,99`
**问题**：标签索引硬编码，文件顺序改变会出错
**需要行动**：使用路由名称而不是索引

---

## 🎯 下一步开发优先级

### 阶段1：后端集成（高优先级）
1. 在`src/services/`创建API服务层
2. 实现真实认证端点
3. 用真实API调用替换模拟登录
4. 添加JWT令牌处理和刷新

### 阶段2：课程内容（高优先级）
1. 设计课程数据结构
2. 实现课程列表页面
3. 添加课时详情页面
4. 创建学习模块组件

### 阶段3：学习功能（中优先级）
1. 实现间隔重复算法
2. 添加真实复习调度
3. 实现进度跟踪更新
4. 添加成就解锁逻辑

### 阶段4：音频与发音（中优先级）
1. 集成expo-av用于音频播放
2. 为泰语单词添加TTS
3. 实现发音录制
4. 添加音频对比功能

### 阶段5：优化与完善（低优先级）
1. 全局添加加载状态
2. 实现错误边界
3. 用Reanimated添加动画
4. 优化列表渲染
5. 添加离线模式

---

## 💡 代码生成指南

### 添加新功能时

**1. 新页面：**
- 在合适的`app/`目录创建文件
- 使用TypeScript接口定义props
- 从`@/`路径别名导入
- 遵循SafeAreaView + ScrollView模式
- 使用Colors和Typography常量
- 如需要添加到相关\_layout.tsx

**2. 新组件：**
- 放在`src/components/common/`
- 导出为命名或默认导出
- 用interface类型化所有props
- 使用StyleSheet.create
- 只导入需要的内容

**3. 新全局状态：**
- 在`src/stores/`创建store
- 遵循Zustand的persist模式
- 导出为`useXxxStore`
- 包含TypeScript接口
- 在PROJECT-SNAPSHOT.md中记录

**4. 新路由：**
- 添加到`app/`文件夹（自动路由）
- 如需分组更新\_layout.tsx
- 在PROJECT-SNAPSHOT.md中记录

### 代码风格要求

```typescript
// ✅ 总是使用TypeScript
export default function Screen(): JSX.Element {}

// ✅ 解构props
export const Component: React.FC<Props> = ({ title, onPress }) => {};

// ✅ 使用常量
backgroundColor: Colors.paper  // 不要：'#FAF9F6'

// ✅ 全部类型化
const [value, setValue] = useState<string>('');

// ✅ 处理加载/错误状态
{loading ? <ActivityIndicator /> : <Content />}

// ✅ 使用路径别名
import { useUserStore } from '@/src/stores/userStore';  // 不要：'../../../'
```

---

## 📋 组件API参考

### FloatingBubbles
```typescript
interface FloatingBubblesProps {
  reviews: ReviewItem[];       // 复习项数组
  onOpenReview: () => void;    // 点击时的回调
}
// 用法：<FloatingBubbles reviews={data} onOpenReview={() => router.push('/review-modal')} />
```

### ThaiPatternBackground
```typescript
interface ThaiPatternBackgroundProps {
  opacity?: number;  // 0-1，默认：0.1
}
// 用法：<ThaiPatternBackground opacity={0.15} />
```

### LanguageSwitcher
```typescript
interface LanguageSwitcherProps {
  variant?: 'compact' | 'full';  // 默认：'compact'
}
// compact：地球图标+语言代码
// full：双按钮选择器
// 用法：<LanguageSwitcher variant="full" />
```

### Button
```typescript
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  loading?: boolean;
  disabled?: boolean;
}
```

---

## 🔑 Store API参考

### useUserStore
```typescript
// 状态
currentUser: User | null
isAuthenticated: boolean
authToken: string | null

// 动作
login(email: string, password: string): Promise<boolean>
logout(): void
setUser(user: User, token: string): void
checkAuth(): boolean

// 用法
const { currentUser, login, logout } = useUserStore();
await login('test@example.com', 'password');
```

### useLearningStore
```typescript
// 状态
currentCourse: Course | null
progress: LearningProgress | null
completedContent: string[]

// 动作
setCourse(course: Course): void
updateProgress(contentType: string, score: number): void
getCompletionRate(): number
resetLearning(): void

// 用法
const { progress, updateProgress } = useLearningStore();
updateProgress('vocabulary', 10);
```

### useLanguageStore
```typescript
// 状态
currentLanguage: 'zh' | 'en'

// 动作
changeLanguage(lang: 'zh' | 'en'): void

// 用法
const { currentLanguage, changeLanguage } = useLanguageStore();
changeLanguage('en');  // 同时更新Zustand + i18n
```

---

## 🎨 常用UI模式

### 页面布局模式
```typescript
export default function Screen() {
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: Colors.paper }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}  // 为标签栏留空间
        showsVerticalScrollIndicator={false}
      >
        {/* 内容 */}
      </ScrollView>
    </SafeAreaView>
  );
}
```

### 卡片模式
```typescript
const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.sand,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  }
});
```

### 统计显示模式
```typescript
<View style={styles.statCard}>
  <View style={styles.iconContainer}>
    <Icon size={20} color={Colors.ink} />
  </View>
  <Text style={styles.statValue}>{value}</Text>
  <Text style={styles.statLabel}>{label}</Text>
</View>
```

---

## 📝 i18n翻译键

### 结构
```typescript
// src/i18n/locales/zh.ts 和 en.ts
export default {
  common: {
    confirm: '确认' / 'Confirm',
    cancel: '取消' / 'Cancel',
    loading: '加载中...' / 'Loading...',
    // ...
  },
  auth: {
    loginButton: '登录' / 'Login',
    registerButton: '注册' / 'Register',
    emailPlaceholder: '邮箱' / 'Email',
    // ...
  },
  tabs: {
    home: '首页' / 'Home',
    learn: '学习' / 'Learn',
    profile: '我的' / 'Profile',
  },
  // ...
};
```

### 用法
```typescript
const { t } = useTranslation();
<Text>{t('auth.loginButton')}</Text>  // "登录" 或 "Login"
```

---

## 🚀 开发快速入门

### 添加新的受保护页面
```bash
# 1. 创建文件
touch app/(tabs)/new-screen.tsx

# 2. 如需标签添加到tab布局
# 编辑 app/(tabs)/_layout.tsx

# 3. 实现组件
# 使用上面"页面布局模式"的模板

# 4. 更新此文档
# 添加到"文件结构"和"当前状态"
```

### 添加全局状态
```bash
# 1. 创建store
touch src/stores/newStore.ts

# 2. 遵循Zustand模式
# 从userStore.ts复制结构

# 3. 导出hook
# export const useNewStore = create(...)

# 4. 更新此文档
# 添加到"Store API参考"
```

### 添加组件
```bash
# 1. 创建文件
touch src/components/common/NewComponent.tsx

# 2. 类型化props
interface NewComponentProps { ... }

# 3. 导出组件
export const NewComponent: React.FC<Props> = ({ ... }) => {}

# 4. 更新此文档
# 添加到"组件API参考"
```

---

## 🎯 总结：AI需要知道什么

**这个项目是：**
- React Native + Expo + TypeScript
- 文件式路由（Expo Router v4）
- Zustand状态管理（3个store，全部持久化）
- 自定义UI（无组件库）
- MVP完成30%

**参考的关键文件：**
- 路由结构：见"文件结构"部分
- 类型：见"类型定义"部分
- Store：见"Store API参考"部分
- 设计：见"设计系统标记"部分

**生成代码时：**
- 使用TypeScript接口
- 遵循"代码风格与约定"
- 从`@/`路径别名导入
- 使用Colors/Typography常量
- 为页面添加SafeAreaView
- 如果是全局状态则持久化（Zustand + persist）

**当前优先级：**
1. 后端API集成
2. 课程内容加载
3. 真实认证

**此文档替代：**读取40多个源文件。理解和扩展项目所需的一切都在这里。

---

**最后更新**：2025-11-23
**维护者**：重大更改时自动更新
**用途**：无需完整代码库访问即可实现AI代码生成
