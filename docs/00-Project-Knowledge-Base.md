# Thai Learning App - 项目知识库

**开发参考指南**

本文档是 Thai Learning App 项目的核心知识库。请将其作为理解代码库、架构和开发进度的主要参考。

---

## 📚 文档索引

1. **[Expo Router 详解](./01-Expo-Router-Explained.md)** - 基于文件的路由完整指南
2. **[项目路由与导航](./02-Project-Routing-Navigation.md)** - 本项目的路由工作原理
3. **[文件导入与依赖](./03-File-Import-Dependencies.md)** - 导入关系与架构
4. **[参数传递指南](./04-Parameter-Passing-Guide.md)** - Props, State 和 URL 参数
5. **[Zustand 状态管理](./05-Zustand-State-Management.md)** - 使用 Zustand 进行全局状态管理
6. **[前端设计哲学](./06-Frontend-Design-Philosophy.md)** - 设计原则与模式

---

## 🎯 项目概览

### 使命
构建一款移动应用程序，帮助用户学习泰语，专注于字母、词汇、发音和实用会话技能。

### 技术栈
- **框架:** React Native (0.76.9) + Expo (52.0.38)
- **路由:** Expo Router v4 (基于文件的路由)
- **状态管理:** Zustand (5.0.8) + AsyncStorage 持久化
- **国际化:** i18next + react-i18next
- **UI/动画:** React Native Reanimated, Expo Blur
- **图标:** Lucide React Native
- **排版:** 自定义字体 (Playfair Display, Noto Serif SC, Sarabun)

### 项目状态
**当前版本:** 1.0.2
**开发阶段:** MVP 实现中 (约 45% 完成)

**已完成功能:**
- ✅ 认证流程 (注册/登录/重置密码)
- ✅ 带有认证守卫的受保护路由
- ✅ 自定义标签导航 (凸起的中心按钮)
- ✅ 用户个人资料与统计
- ✅ 多语言 UI (中文/英文)
- ✅ 复习系统 UI (抽认卡界面)
- ✅ 进度跟踪结构
- ✅ 文化设计系统 (泰式纹样, 配色)
- ✅ 基础配置管理 (`src/config/constants.ts`)

**进行中:**
- 🔄 后端 API 集成 (部分完成)
- 🔄 课程内容管理
- 🔄 学习模块

**未开始:**
- ❌ 音频/TTS 实现
- ❌ 管理后台
- ❌ 分析仪表盘
- ❌ 社交功能
- ❌ 离线支持 (AsyncStorage 之外)

---

## 🏗️ 架构概览

### 高层结构

```
┌─────────────────────────────────────┐
│       用户界面 (React)              │
│  - 屏幕 (app/)                      │
│  - 组件 (src/components/)           │
└─────────────────────────────────────┘
              ↕
┌─────────────────────────────────────┐
│   状态管理 (Zustand)                │
│  - userStore (认证)                 │
│  - learningStore (进度)             │
│  - languageStore (国际化)           │
└─────────────────────────────────────┘
              ↕
┌─────────────────────────────────────┐
│    数据层                           │
│  - API 服务 (axios)                 │
│  - AsyncStorage (持久化)            │
│  - CloudBase (云开发后端)           │
└─────────────────────────────────────┘
```

### 路由架构

```
应用启动
    ↓
根布局 (/_layout.tsx)
    ├─→ 认证守卫
    │   ├─→ 未认证 → /(auth)/login
    │   └─→ 已认证 → /(tabs)/
    │
    ├─→ (auth)/ [公开路由]
    │   ├─→ login.tsx
    │   └─→ register.tsx
    │
    ├─→ (tabs)/ [受保护路由]
    │   ├─→ index.tsx (首页)
    │   ├─→ courses.tsx
    │   └─→ profile.tsx
    │
    └─→ review-modal.tsx [模态框]
```

### 状态管理架构

```
┌─────────────────┐
│   userStore     │ ← 认证, 用户资料
│   ↓ 持久化      │
│   AsyncStorage  │
└─────────────────┘

┌─────────────────┐
│ learningStore   │ ← 课程进度, 成就
│   ↓ 持久化      │
│   AsyncStorage  │
└─────────────────┘

┌─────────────────┐
│ languageStore   │ ← UI 语言 (zh/en)
│   ↓ 持久化      │ ← 同时更新 i18next
│   AsyncStorage  │
└─────────────────┘
```

---

## 📁 目录结构

```
ThaiLearningApp/
│
├── app/                          # Expo Router 路由
│   ├── _layout.tsx              # 根布局 + 认证守卫
│   ├── (auth)/                  # 认证路由 (公开)
│   │   ├── _layout.tsx         # 认证布局
│   │   ├── login.tsx           # 登录页
│   │   └── register.tsx        # 注册页
│   ├── (tabs)/                  # 主应用路由 (受保护)
│   │   ├── _layout.tsx         # 自定义标签栏
│   │   ├── index.tsx           # 首页/仪表盘
│   │   ├── courses.tsx         # 课程库
│   │   └── profile.tsx         # 用户个人资料
│   ├── admin/                   # 管理员路由 (空)
│   ├── learning/                # 学习模块 (空)
│   └── review-modal.tsx         # 复习模态框
│
├── src/
│   ├── components/              # 可复用 UI 组件
│   │   └── common/
│   │       ├── ThaiPatternBackground.tsx
│   │       ├── FloatingBubbles.tsx
│   │       ├── LanguageSwitcher.tsx
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       └── GlassCard.tsx
│   │
│   ├── config/                  # 应用配置 (新增)
│   │   ├── constants.ts        # 全局常量 (集合名, 错误信息等)
│   │   ├── api.endpoints.ts    # API 端点
│   │   └── backend.config.ts   # 后端配置
│   │
│   ├── constants/               # 设计 Token
│   │   ├── colors.ts           # 调色板
│   │   └── typography.ts       # 字体定义
│   │
│   ├── stores/                  # Zustand 状态仓库
│   │   ├── userStore.ts        # 认证状态
│   │   ├── learningStore.ts    # 学习进度
│   │   └── languageStore.ts    # UI 语言
│   │
│   ├── types/                   # TypeScript 类型 (旧)
│   │   └── entities.ts
│   │
│   ├── entities/                # 主要类型定义
│   │   └── types/
│   │       ├── entities.ts     # 用户, 课程, 进度类型
│   │       └── api.types.ts    # API 请求/响应类型
│   │
│   ├── i18n/                    # 国际化
│   │   ├── index.ts            # i18next 配置
│   │   └── locales/
│   │       ├── zh.ts           # 中文翻译
│   │       └── en.ts           # 英文翻译
│   │
│   ├── services/                # API 服务
│   ├── hooks/                   # 自定义 Hooks
│   └── utils/                   # 工具函数
│
├── assets/                      # 图片, 字体, 启动页
├── android/                     # Android 原生代码
├── ios/                         # iOS 原生代码
├── docs/                        # 文档 (本文件夹)
├── app.json                     # Expo 配置
├── package.json                 # 依赖
├── tsconfig.json               # TypeScript 配置
├── babel.config.js             # Babel 配置 (路径别名)
└── global.css                  # 全局样式
```

---

## 🔑 核心概念

### 1. 基于文件的路由 (Expo Router)

**概念:** `app/` 目录下的文件自动成为路由。

**示例:**
```
app/
├── index.tsx          → 路由: "/"
├── profile.tsx        → 路由: "/profile"
└── course/
    └── [id].tsx       → 路由: "/course/123"
```

**路由组:** `(groupName)/` 用于组织文件而不影响 URL。
```
app/(auth)/login.tsx   → 路由: "/login" (不是 "/auth/login")
```

**布局:** `_layout.tsx` 包裹所有兄弟路由。

**阅读更多:** [01-Expo-Router-Explained.md](./01-Expo-Router-Explained.md)

---

### 2. Zustand 状态管理

**概念:** 无需 Provider 的轻量级全局状态管理。

**模式:**
```typescript
// 1. 创建 store
const useStore = create((set, get) => ({
  count: 0,
  increment: () => set({ count: get().count + 1 }),
}));

// 2. 在组件中使用
const { count, increment } = useStore();
```

**持久化:**
```typescript
persist(
  (set, get) => ({ /* store */ }),
  { name: 'storage-key', storage: AsyncStorage }
)
```

**阅读更多:** [05-Zustand-State-Management.md](./05-Zustand-State-Management.md)

---

### 3. 认证流程

**登录过程:**
```
1. 用户输入凭据
2. userStore.login(email, password)
3. Store 更新: isAuthenticated = true
4. 根布局检测到变化
5. router.replace('/(tabs)')
6. 用户重定向到应用内
```

**启动自动登录:**
```
1. 应用打开
2. Zustand 从 AsyncStorage 加载状态
3. isAuthenticated 恢复
4. 根布局检查认证状态
5. 如果为真 → /(tabs), 如果为假 → /login
```

**阅读更多:** [02-Project-Routing-Navigation.md](./02-Project-Routing-Navigation.md)

---

### 4. 国际化 (i18n)

**支持语言:**
- 中文 (zh) - 默认
- 英文 (en)

**工作原理:**
```typescript
// 1. 获取翻译函数
const { t } = useTranslation();

// 2. 使用翻译键
<Text>{t('auth.loginButton')}</Text>  // "登录" 或 "Login"
```

**语言切换:**
```typescript
// 同时更新 Zustand store 和 i18next
languageStore.changeLanguage('en');
```

**翻译文件:**
- `src/i18n/locales/zh.ts` - 中文
- `src/i18n/locales/en.ts` - 英文

---

### 5. 组件模式

**基于 Props 的组件:**
```typescript
interface Props {
  reviews: ReviewItem[];
  onOpenReview: () => void;
}

export const FloatingBubbles: React.FC<Props> = ({ reviews, onOpenReview }) => {
  // 组件从父级接收数据
};
```

**基于 State 的组件:**
```typescript
export default function ProfileScreen() {
  // 组件从全局 store 读取
  const { currentUser } = useUserStore();
  const { progress } = useLearningStore();
};
```

**阅读更多:** [04-Parameter-Passing-Guide.md](./04-Parameter-Passing-Guide.md)

---

## 🎨 设计系统

### 调色板

| 名称 | Hex | 用途 |
|------|-----|-------|
| **Paper** | #FAF9F6 | 背景, 浅色卡片 |
| **Ink** | #1A1A1A | 主要文本, 深色卡片 |
| **Thai Gold** | #D4AF37 | 强调, 成就 |
| **Sand** | #E5E2DB | 边框, 分割线 |
| **Taupe** | #8E8B82 | 次要文本 |
| **White** | #FFFFFF | 高亮, 激活状态 |

### 排版

| 用途 | 字体 | 大小 |
|---------|------|------|
| 英文标题 | Playfair Display | 32px (h1) |
| 中文文本 | Noto Serif SC | 16px (body) |
| 泰语脚本 | Sarabun | 多种 |
| 标签 | Noto Serif SC | 14px (caption) |

### 间距比例

```
xs:  4px   sm:  8px   md: 16px
lg: 24px   xl: 32px  xxl: 48px
```

**阅读更多:** [06-Frontend-Design-Philosophy.md](./06-Frontend-Design-Philosophy.md)

---

## 🔄 数据流示例

### 示例 1: 登录流程

```
LoginScreen
    ↓ 用户点击 "登录"
userStore.login(email, password)
    ↓ set({ isAuthenticated: true })
AsyncStorage 保存状态
    ↓
根布局 (useEffect hook)
    ↓ 检测到 isAuthenticated = true
router.replace('/(tabs)')
    ↓
首页加载
    ↓ 从 userStore 读取
显示: "你好, {currentUser.displayName}"
```

### 示例 2: 语言切换

```
LanguageSwitcher
    ↓ 用户点击 EN
languageStore.changeLanguage('en')
    ↓ 更新 Zustand + i18next
AsyncStorage 保存偏好
    ↓
所有使用 useTranslation() 的组件
    ↓ 重新渲染新语言
文本更新: "登录" → "Login"
```

### 示例 3: 复习会话

```
首页
    ↓ 显示 FloatingBubbles
用户点击气泡
    ↓ router.push('/review-modal')
复习模态框打开
    ↓ 用户复习卡片
用户点击难度
    ↓ (未来) updateProgress('alphabet', 5)
learningStore 更新
    ↓ completedAlphabets += 1
AsyncStorage 保存进度
    ↓
个人资料页
    ↓ 自动重新渲染
显示更新后的计数
```

---

## 🧪 测试策略 (未来)

### 单元测试
- Zustand store action
- 工具函数
- 类型定义

### 组件测试
- 组件渲染
- Prop 处理
- 用户交互

### 集成测试
- 认证流程
- 导航流程
- 状态持久化

### E2E 测试
- 完整的用户旅程
- 多屏幕流程

**工具:** Jest, React Native Testing Library, Detox

---

## 🚀 部署清单

### 发布前任务

**代码质量:**
- [ ] 移除 console.log 语句
- [ ] 修复 TypeScript 错误
- [ ] 移除重复的类型定义
- [ ] 添加错误边界
- [ ] 实现适当的错误处理

**性能:**
- [ ] 优化图片 (WebP 格式)
- [ ] 添加加载状态
- [ ] 实现列表虚拟化
- [ ] 分析动画性能

**安全:**
- [ ] 实现真实认证
- [ ] 添加 JWT 令牌刷新
- [ ] 验证所有用户输入
- [ ] 清理 API 响应

**无障碍:**
- [ ] 添加无障碍标签
- [ ] 使用屏幕阅读器测试
- [ ] 验证颜色对比度
- [ ] 支持动态字体

**测试:**
- [ ] 编写 store 单元测试
- [ ] 测试认证流程
- [ ] 在 iOS 和 Android 上测试
- [ ] 在不同屏幕尺寸上测试

### 构建流程

**iOS:**
```bash
eas build --platform ios
eas submit --platform ios
```

**Android:**
```bash
eas build --platform android
eas submit --platform android
```

---

## 📊 当前指标

### 代码统计 (估算)

| 指标 | 数量 |
|--------|-------|
| 总文件数 | ~45 |
| TypeScript 文件 | ~35 |
| React 组件 | ~18 |
| Zustand Stores | 3 |
| 路由 | 7 活跃 |
| 翻译键 | ~60 |
| 自定义组件 | 8 |

### 包体积 (估算)
- **基础应用:** ~8 MB
- **含资源:** ~12 MB
- **含字体:** ~15 MB

---

## 🐛 已知问题

### 问题 1: 重复的类型定义
**位置:** `src/types/entities.ts` 和 `src/entities/types/entities.ts`
**影响:** 低 (两个文件导出相同的类型)
**修复:** 删除一个，更新导入

### 问题 2: 字体加载禁用
**位置:** `app/_layout.tsx:17`
**原因:** 未找到字体文件
**影响:** 中 (使用系统字体)
**修复:** 添加字体文件到 assets 或移除字体导入

### 问题 3: 模拟认证
**位置:** `src/stores/userStore.ts`
**影响:** 高 (无真实后端)
**修复:** 正在进行 API 集成 (v1.0.2 已修复部分问题)

### 问题 4: 课程屏幕不完整
**位置:** `app/(tabs)/courses.tsx`
**影响:** 中 (显示 "Coming Soon")
**修复:** 实现课程列表

---

## 🔮 路线图

### 阶段 1: MVP 完成 (当前)
- [ ] 后端 API 完全集成
- [ ] 真实认证 (已修复 userStore)
- [ ] 课程内容加载
- [ ] 基础学习模块

### 阶段 2: 核心功能
- [ ] 音频播放 (TTS)
- [ ] 发音练习
- [ ] 间隔重复算法
- [ ] 成就系统

### 阶段 3: 增强体验
- [ ] 离线支持
- [ ] 推送通知
- [ ] 每日目标和连胜
- [ ] 社交功能 (好友, 排行榜)

### 阶段 4: 高级功能
- [ ] AI 驱动的会话练习
- [ ] 语音识别
- [ ] 自适应学习路径
- [ ] 高级订阅

---

## 🛠️ 开发工作流

### 快速开始

**1. 克隆仓库**
```bash
git clone <repository-url>
cd ThaiLearningApp
```

**2. 安装依赖**
```bash
npm install
```

**3. 启动开发服务器**
```bash
npx expo start
```

**4. 在设备/模拟器上运行**
```bash
# iOS
npx expo run:ios

# Android
npx expo run:android
```

### 常用命令

```bash
# 清除缓存
npx expo start --clear

# 类型检查
npx tsc --noEmit

# 查看路由
npx expo start  # 然后按 'Shift + M'

# 构建生产版本
eas build --platform ios
eas build --platform android
```

---

## 📖 学习资源

### Expo Router
- 官方文档: https://docs.expo.dev/router/introduction/
- 迁移指南: https://docs.expo.dev/router/migrate/

### Zustand
- 官方文档: https://docs.pmnd.rs/zustand/getting-started/introduction
- 持久化中间件: https://docs.pmnd.rs/zustand/integrations/persisting-store-data

### i18next
- React i18next: https://react.i18next.com/
- Expo Localization: https://docs.expo.dev/versions/latest/sdk/localization/

### React Native
- 官方文档: https://reactnative.dev/
- Expo SDK: https://docs.expo.dev/versions/latest/

---

## 🤝 贡献指南

### 代码风格

**TypeScript:**
- Props 使用接口
- 避免 `any` 类型
- 共享时导出类型

**React:**
- 仅使用函数组件
- 使用 Hooks 进行状态管理
- Props 解构

**命名:**
- 组件使用 PascalCase
- 变量/函数使用 camelCase
- 常量使用 UPPER_CASE

**文件组织:**
```typescript
// 1. 导入 (分组)
import React from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';

import { useUserStore } from '@/src/stores/userStore';
import { Colors } from '@/src/constants/colors';

// 2. 类型/接口
interface Props {
  title: string;
}

// 3. 组件
export default function Component({ title }: Props) {
  // 逻辑
  return <View />;
}

// 4. 样式
const styles = StyleSheet.create({});
```

### Git 工作流

**分支命名:**
- `feature/description` - 新功能
- `fix/description` - Bug 修复
- `refactor/description` - 代码改进

**提交信息:**
```
feat: Add user profile screen
fix: Resolve login redirect loop
refactor: Extract FloatingBubbles component
docs: Update routing documentation
```

---

## 📞 支持与联系

### 文档
- **本文件夹:** `/docs` - 所有项目文档
- **README:** `/README.md` - 快速开始指南
- **内联注释:** 代码文件内

### 获取帮助
1. 检查相关文档文件
2. 搜索现有代码示例
3. 查阅官方库文档
4. 询问团队/维护者

---

## 🎓 新开发者关键要点

### 理解技术栈

**1. Expo Router = 移动端的 Next.js**
- `app/` 中的文件自动成为路由
- 无需手动配置路由
- 非常适合快速开发

**2. Zustand = 简单的 Redux**
- 无样板代码，直接创建和使用
- 通过中间件自动持久化
- 非常适合中小型应用

**3. TypeScript = 信心**
- 在运行时之前捕获错误
- 更好的 IDE 自动完成
- 自文档化代码

### 心理模型

**分层思考:**
```
UI (组件) → State (Zustand) → Data (API)
      ↑              ↑             ↑
    Props          Hooks       AsyncStorage
```

**导航流程:**
```
用户操作 → 状态改变 → 布局响应 → 路由更新
```

**状态更新:**
```
组件调用 action → Store 更新 → 所有订阅者重新渲染
```

---

## 📝 快速参考

### 路径别名
```typescript
import { Colors } from '@/src/constants/colors';
import { useUserStore } from '@/src/stores/userStore';
```

### Zustand Stores
```typescript
const { currentUser, login, logout } = useUserStore();
const { progress, updateProgress } = useLearningStore();
const { currentLanguage, changeLanguage } = useLanguageStore();
```

### 导航
```typescript
const router = useRouter();
router.push('/path');         // 向前导航
router.replace('/path');      // 替换当前屏幕
router.back();                // 返回
```

### 翻译
```typescript
const { t } = useTranslation();
<Text>{t('common.confirm')}</Text>
```

---

## 🎯 项目哲学

### 原则

**1. 用户至上**
- 学习效果 > 视觉花哨
- 从第一天起就考虑无障碍性
- 性能至关重要

**2. 开发者体验**
- 清晰的文档
- 一致的模式
- 无处不在的类型安全
