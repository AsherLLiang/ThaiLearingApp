# 项目交接快照 (Project Handover Snapshot)

**生成时间**: 2025-12-04  
**当前版本**: v5.3 (Complete File Tree)

---

## 【一、项目总体说明】

- **项目名称**：ThaiLearningApp (泰语学习助手)
- **项目类型**：App (React Native / Expo)
- **核心目标**：提供沉浸式、基于间隔重复算法（SRS）的泰语单词与句子学习体验。
- **核心用户**：以中文/英文为母语的泰语初学者及进阶学习者。
- **当前阶段**：**开发中 / 原型验证阶段 (Development / Prototyping)**
    - 前端：核心学习流 UI/UX 已完成，目前使用 Mock 数据。
    - 后端：腾讯云开发 (CloudBase) 环境已就绪，核心云函数已部署，但尚未完全接入前端。

---

## 【二、详细项目文件目录】

```
ThaiLearningApp/
├── app/                          # Expo Router 页面路由 (文件即路由)
│   ├── (auth)/                   # 认证组 (登录/注册)，未登录用户可见
│   │   ├── login.tsx             # 登录页
│   │   ├── register.tsx          # 注册页
│   │   └── forgot-password.tsx   # 找回密码页
│   ├── (tabs)/                   # 底部导航组，登录用户可见
│   │   ├── index.tsx             # 首页 (Dashboard)
│   │   ├── courses.tsx           # 课程列表页
│   │   └── profile.tsx           # 个人中心页
│   ├── admin/                    # [空] 管理员后台页面 (计划中)
│   ├── learning/                 # 学习功能模块
│   │   └── index.tsx             # 核心学习会话页 (Session Loop)
│   ├── _layout.tsx               # 全局布局 & 路由守卫 (Auth Guard)
│   └── global.css                # 全局样式 (Tailwind 引入)
├── src/                          # 源代码目录
│   ├── components/               # UI 组件库
│   │   ├── common/               # 通用组件
│   │   │   ├── ThaiPatternBackground.tsx # 泰式花纹背景 SVG
│   │   │   ├── FloatingBubbles.tsx       # 浮动气泡动画
│   │   │   └── LanguageSwitcher.tsx      # 语言切换器
│   │   ├── learning/             # 学习业务组件
│   │   │   ├── NewWordView.tsx   # 新词学习卡片 (含释义/例句)
│   │   │   └── ReviewWordView.tsx # 复习卡片 (含 SRS 交互)
│   │   ├── progress/             # [空] 进度展示组件 (计划中)
│   │   └── pronunciation/        # [空] 发音评估组件 (计划中)
│   ├── config/                   # 项目配置
│   │   ├── backend.config.ts     # 后端环境切换 (CloudBase/Java)
│   │   ├── api.endpoints.ts      # API 接口地址管理
│   │   └── constants.ts          # 全局常量 (超时时间、错误码)
│   ├── entities/                 # 类型定义 (TypeScript Interfaces)
│   │   ├── enums/                # [空] 枚举定义 (计划中)
│   │   └── types/                # 核心类型定义
│   │       ├── api.types.ts      # API 请求/响应接口定义 (登录/注册/课程/学习/进度/发音)
│   │       ├── course.ts         # 课程相关类型 (Course, Level)
│   │       ├── entities.ts       # 类型导出入口 (Barrel File)
│   │       ├── learning.ts       # 学习相关类型 (ReviewItem, LearningProgress)
│   │       └── user.ts           # 用户相关类型 (User, LoginRequest)
│   ├── hooks/                    # [空] 自定义 Hooks (计划中)
│   ├── i18n/                     # 国际化配置
│   │   ├── index.ts              # i18next 初始化
│   │   └── locales/              # 语言包
│   │       ├── zh.ts             # 中文翻译
│   │       └── en.ts             # 英文翻译
│   ├── stores/                   # 状态管理 (Zustand)
│   │   ├── authStore.ts          # 用户认证状态
│   │   ├── learningStore.ts      # 学习进度与队列状态
│   │   └── languageStore.ts      # 语言设置状态
│   └── utils/                    # 工具函数
│       ├── apiClient.ts          # 统一 API 请求客户端 (Fetch 封装)
│       └── validation.ts         # 表单验证工具
├── cloudbase/                    # 腾讯云开发后端
│   ├── functions/                # 云函数目录
│   │   ├── user-login/           # 用户登录函数
│   │   ├── user-register/        # 用户注册函数
│   │   ├── user-reset-password/  # 重置密码函数
│   │   ├── user-update-profile/  # 更新用户信息函数
│   │   └── learn-vocab/          # 学习队列获取与结算函数
│   └── cloudbaserc.json          # 云开发配置
├── docs/                         # 项目文档
├── assets/                       # 静态资源 (图片/字体)
├── tailwind.config.js            # Tailwind CSS 配置
├── babel.config.js               # Babel 配置
└── package.json                  # 项目依赖定义
```

---

## 【三、关键技术栈与代码说明】

### 1. 路由与权限控制 (Expo Router)
**文件**: `app/_layout.tsx`
**说明**: 使用 Expo Router 的基于文件的路由系统。`_layout.tsx` 充当根组件，负责全局 Provider 和权限校验。

**关键代码片段**:
```typescript
// 路由守卫：根据认证状态强制跳转
useEffect(() => {
  if (!fontsLoaded) return;
  const inAuthGroup = segments[0] === '(auth)'; // 当前是否在认证组页面

  if (!isAuthenticated && !inAuthGroup) {
    // 未登录且不在登录页 -> 踢去登录
    router.replace('/(auth)/login');
  } else if (isAuthenticated && inAuthGroup) {
    // 已登录且在登录页 -> 踢回首页
    router.replace('/(tabs)');
  }
}, [isAuthenticated, segments, fontsLoaded]);
```

### 2. 状态管理 (Zustand)
**文件**: `src/stores/learningStore.ts`
**说明**: 使用 Zustand 进行轻量级全局状态管理，支持 `persist` 中间件将数据持久化到 `AsyncStorage`。

**关键代码片段**:
```typescript
export const useLearningStore = create<LearningState>()(
  persist(
    (set, get) => ({
      currentCourse: null,
      progress: null,
      
      // 更新学习进度
      updateProgress: (contentType, score) => {
        const progress = get().progress;
        if (!progress) return;
        // ... 更新逻辑
        set({ progress: updatedProgress });
      },
    }),
    {
      name: 'learning-storage', // 持久化 Key
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

### 3. API 请求封装 (Fetch + Singleton)
**文件**: `src/utils/apiClient.ts`
**说明**: 封装原生 `fetch`，统一处理 BaseURL、Token 注入、超时控制和错误解析。

**关键代码片段**:
```typescript
class ApiClient {
  // 统一请求方法
  private async request<T>(endpoint: string, method: string, data?: any) {
    const url = this.buildUrl(endpoint);
    const headers = {
      'Authorization': `Bearer ${this.authToken}`, // 自动注入 Token
      'Content-Type': 'application/json'
    };

    // ... Fetch 调用与错误处理
    if (!response.ok) {
        if (response.status === 401) {
            // 处理 Token 过期
        }
        throw new Error(responseData.message);
    }
    return responseData;
  }
}
export const apiClient = new ApiClient(); // 导出单例
```

### 4. 样式系统 (NativeWind / Tailwind)
**文件**: `tailwind.config.js`
**说明**: 使用 NativeWind 实现 React Native 中的 Tailwind 样式。配置了自定义主题色以符合泰式设计风格。

**关键配置片段**:
```javascript
module.exports = {
  // 自定义颜色系统
  theme: {
    extend: {
      colors: {
        paper: '#FAF9F6',  // 纸张白背景
        ink: '#1A1A1A',    // 墨黑文字
        thaiGold: '#D4AF37', // 泰金强调色
        sand: '#E5E2DB',   // 沙色边框
      },
    },
  },
}
```

---

## 【四、核心业务逻辑说明】

### 1. 核心学习主流程 (The Session)
**文件**: `app/learning/index.tsx`
用户点击“开始学习”后，进入一个统一的 Session，逻辑如下：

1.  **初始化队列**：
    -   `useEffect` 加载时，同时拉取 `reviewWords` (待复习) 和 `newWords` (新词)。
    -   将它们合并为一个 `queue`，复习词优先。
2.  **复习卡片逻辑 (ReviewWordView)**：
    -   展示单词 + 音标。
    -   用户选择：忘记了 / 模糊 / 认识。
    -   **如果** 选择“忘记了”或“模糊”，该词会在当前 Session 末尾再次出现（`repetitionsLeft > 0`）。
    -   **如果** 选择“认识”，该词移出当前 Session，并更新下次复习时间（SRS算法）。
3.  **新词学习逻辑 (NewWordView)**：
    -   展示单词 -> 用户点击“查看释义” -> 展示详细解释（基础/例句/用法）。
    -   用户点击“下一个”，该词进入“待复习”池，并在当前 Session 内可能再次出现以巩固记忆。

### 2. 后端环境切换
**文件**: `src/config/backend.config.ts`
支持在 "CloudBase (云开发)" 和 "Java SpringBoot" 之间无缝切换。

**关键配置**:
```typescript
export const CURRENT_BACKEND: BackendType = 
  (process.env.EXPO_PUBLIC_BACKEND as BackendType) || 'cloudbase';

export const BACKEND_CONFIG = {
  cloudbase: {
    apiBaseUrl: 'https://cloud1-xxx.app.tcloudbase.com',
  },
  java: {
    apiBaseUrl: 'http://localhost:8080',
  },
};
```

---

## 【五、数据库与数据结构总览】

后端采用 **NoSQL (Document DB)**，主要集合 (Collections) 如下：

### 1. `users` (用户表)
| 字段名 | 类型 | 含义 |
| :--- | :--- | :--- |
| `userId` | String | 用户唯一标识 (OpenID/UUID) |
| `email` | String | 登录邮箱 |
| `displayName` | String | 昵称 |

### 2. `user_progress` (学习进度表)
*记录用户在某个课程下的总体进度*
| 字段名 | 类型 | 含义 |
| :--- | :--- | :--- |
| `userId` | String | 关联用户 |
| `courseId` | String | 关联课程 |
| `completedVocabulary`| Number | 已掌握单词数 |
| `streakDays` | Number | 连续打卡天数 |

### 3. `words` (单词库 - 核心内容)
*注：目前主要以 Mock 形式存在于前端 `app/learning/index.tsx`，后端需建立对应集合*
| 字段名 | 类型 | 含义 |
| :--- | :--- | :--- |
| `id` | String | 单词 ID |
| `thai` | String | 泰语原文 |
| `phonetic` | String | 音标 |
| `definitions` | Object | 包含 basic(释义), examples(例句), usage(用法) |

---

## 【六、当前开发进度与缺口】

### ✅ 已完成模块
1.  **UI 交互框架**: 极具泰式风格的 UI 系统 (字体、配色、花纹背景)。
2.  **前端核心逻辑**: 完整的学习 Session 状态流转（队列管理、卡片切换）。
3.  **国际化**: 界面文案已全量支持中英切换。

### ⚠️ 可用但需优化模块 (Gap)
1.  **数据源 (Data Source)**:
    -   目前 `app/learning/index.tsx` 强依赖 `MOCK_OLD_WORDS`。
    -   **需优化**: 将 `useEffect` 中的 Mock 数据替换为调用 `cloudbase.callFunction('learn-vocab')`。
2.  **音频播放**:
    -   UI 有喇叭图标，但点击无实际发音。
    -   **需优化**: 接入 `expo-av` 播放 TTS 或云端音频文件。

### 🚨 当前最大技术风险点
-   **离线同步机制**: 目前架构假设永远在线。如果用户在弱网环境下学习，学习进度（复习结果）可能无法实时提交到云端，导致进度丢失。需要引入本地队列 (Offline Queue) 机制来缓存请求。
