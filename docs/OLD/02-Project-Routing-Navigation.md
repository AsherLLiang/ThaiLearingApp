# 项目路由与导航流程

## 完整路由地图

本文档解释了 Thai Learning App 中的每个路由以及用户如何在它们之间导航。

---

## 可视化导航流程

```
应用启动
    ↓
┌─────────────────────────────────────┐
│   根布局 (app/_layout.tsx)          │
│   - 字体加载                        │
│   - 认证守卫                        │
└─────────────────────────────────────┘
    ↓
    ├── 未认证 → /(auth)/login
    └── 已认证 → /(tabs)/index
```

---

## 路由结构

```
app/
├── _layout.tsx                    [根布局]
│
├── (auth)/                        [认证组 - 公开路由]
│   ├── _layout.tsx               [认证布局]
│   ├── login.tsx                 [登录屏幕]
│   └── register.tsx              [注册屏幕]
│
├── (tabs)/                        [标签组 - 受保护路由]
│   ├── _layout.tsx               [自定义标签栏]
│   ├── index.tsx                 [主屏幕]
│   ├── courses.tsx               [课程屏幕]
│   └── profile.tsx               [个人资料屏幕]
│
├── review-modal.tsx               [复习模态框]
│
├── admin/                         [管理员路由 - 空]
│
└── learning/                      [学习路由 - 空]
```

---

## 详细路由分析

### 1. 根布局 (`app/_layout.tsx`)

**文件位置:** [app/_layout.tsx](../app/_layout.tsx)

**用途:**
- 应用程序入口点
- 全局导航容器
- 认证守卫
- 字体加载管理

**关键代码:**
```typescript
export default function RootLayout() {
  const segments = useSegments(); // 当前路由路径
  const router = useRouter();
  const { isAuthenticated } = useUserStore(); // 认证状态

  // 认证守卫逻辑
  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';

    // 未登录 + 不在认证屏幕 → 前往登录
    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    }
    // 已登录 + 在认证屏幕 → 前往应用
    else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, segments]);

  return (
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
  );
}
```

**导航决策:**
- `segments[0]` 告诉我们用户在哪个路由组
- 来自 Zustand 的认证状态触发自动重定向
- 使用 `replace()` 而不是 `push()` 以防止返回导航到错误的屏幕

---

### 2. 认证布局 (`app/(auth)/_layout.tsx`)

**文件位置:** [app/(auth)/_layout.tsx](../app/(auth)/_layout.tsx)

**用途:**
- 未认证屏幕的布局
- 如果用户在登录屏幕时登录，则自动重定向

**路由组名称:** `(auth)`
- 内部路由: `/login`, `/register`
- URL 保持干净 (无 `/auth/` 前缀)

**关键代码:**
```typescript
export default function AuthLayout() {
  const { isAuthenticated } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)'); // 重定向到应用
    }
  }, [isAuthenticated]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
```

**存在原因:**
如果用户点击“登录”按钮，store 更新 → 此布局检测到变化 → 立即重定向

---

### 3. 登录屏幕 (`app/(auth)/login.tsx`)

**文件位置:** [app/(auth)/login.tsx](../app/(auth)/login.tsx)

**路由:** `/(auth)/login`

**用途:** 用户认证

**导航操作:**
```typescript
// 1. 导航到注册
router.push('/(auth)/register');

// 2. 登录成功后 (由认证守卫处理)
await userStore.login(email, password);
// → 根布局检测到 isAuthenticated = true
// → 自动重定向到 /(tabs)
```

**使用的组件:**
- `ThaiPatternBackground` - 装饰性 SVG
- `LanguageSwitcher` (紧凑型) - 语言切换
- `Button` - 主要 CTA

**流程:**
1. 用户输入邮箱 + 密码
2. 点击“登录”按钮
3. 调用 `userStore.login()`
4. Store 更新 `isAuthenticated = true`
5. 根布局的认证守卫触发
6. 用户重定向到 `/(tabs)` (首页)

---

### 4. 注册屏幕 (`app/(auth)/register.tsx`)

**文件位置:** [app/(auth)/register.tsx](../app/(auth)/register.tsx)

**路由:** `/(auth)/register`

**用途:** 新用户注册

**导航操作:**
```typescript
// 导航回登录
router.back(); // 或 router.push('/(auth)/login')
```

**状态:** 后端集成待定 (表单 UI 已完成)

---

### 5. 标签布局 (`app/(tabs)/_layout.tsx`)

**文件位置:** [app/(tabs)/_layout.tsx](../app/(tabs)/_layout.tsx)

**用途:**
- 带有 3 个标签的自定义标签栏
- 凸起的中心主页按钮
- iOS 模糊效果

**路由组名称:** `(tabs)`
- 内部路由: `/`, `/courses`, `/profile`
- 受根认证守卫保护

**标签配置:**
```typescript
function CustomTabBar({ state, navigation }) {
  return (
    <View>
      {/* 左侧标签: 学习 */}
      <TabButton
        icon={BookOpen}
        label="学习"
        isActive={state.index === 1}
        onPress={() => navigation.navigate('courses')}
      />

      {/* 中间标签: 首页 (凸起) */}
      <Pressable onPress={() => navigation.navigate('index')}>
        <Home size={26} />
      </Pressable>

      {/* 右侧标签: 我的 */}
      <TabButton
        icon={User}
        label="我的"
        isActive={state.index === 2}
        onPress={() => navigation.navigate('profile')}
      />
    </View>
  );
}
```

**设计细节:**
- 中心按钮绝对定位 `bottom: 24`
- iOS 上使用 BlurView 实现磨砂玻璃效果
- 激活标签通过深色和粗体图标指示

---

### 6. 主屏幕 (`app/(tabs)/index.tsx`)

**文件位置:** [app/(tabs)/index.tsx](../app/(tabs)/index.tsx)

**路由:** `/(tabs)` 或 `/(tabs)/index`

**用途:**
- 主仪表盘
- 学习进度概览
- 快速访问复习

**导航操作:**
```typescript
// 打开复习模态框
const handleBubbleClick = () => {
  router.push('/review-modal');
  setTimeout(() => setReviews([]), 500); // 清除复习
};
```

**使用的组件:**
- `ThaiPatternBackground` - 背景装饰
- `FloatingBubbles` - 复习卡片堆叠
- 自定义统计卡片 (连胜, 学习时间)
- 成就列表

**数据流:**
1. 800ms 延迟后加载模拟复习
2. FloatingBubbles 显示 3 张卡片堆叠
3. 用户点击 → 导航到复习模态框
4. 导航后清除复习

---

### 7. 课程屏幕 (`app/(tabs)/courses.tsx`)

**文件位置:** [app/(tabs)/courses.tsx](../app/(tabs)/courses.tsx)

**路由:** `/(tabs)/courses`

**用途:** 课程库 (占位符)

**状态:** 即将推出屏幕 (实现待定)

**导航操作:** 目前无

---

### 8. 个人资料屏幕 (`app/(tabs)/profile.tsx`)

**文件位置:** [app/(tabs)/profile.tsx](../app/(tabs)/profile.tsx)

**路由:** `/(tabs)/profile`

**用途:**
- 用户个人资料信息
- 学习统计
- 成就徽章
- 设置 (语言, TTS)
- 登出

**导航操作:**
```typescript
// 登出
const handleLogout = () => {
  userStore.logout();
  // → 根布局检测到 isAuthenticated = false
  // → 自动重定向到 /(auth)/login
};
```

**使用的组件:**
- `LanguageSwitcher` (完整版) - 语言选择器
- 来自 `userStore` 和 `learningStore` 的个人资料统计
- 成就徽章 (模拟数据)

**数据源:**
- `useUserStore()` → 用户信息
- `useLearningStore()` → 进度指标

---

### 9. 复习模态框 (`app/review-modal.tsx`)

**文件位置:** [app/review-modal.tsx](../app/review-modal.tsx)

**路由:** `/review-modal`

**展示:** 全屏模态框 (从底部滑入)

**用途:** 带有间隔重复的抽认卡复习

**导航操作:**
```typescript
// 关闭模态框
router.back(); // 或 router.dismiss()
```

**特性:**
- 卡片翻转动画 (正面: 泰语字符, 背面: 翻译)
- 3 个难度按钮: 模糊, 记得, 简单
- 进度指示器
- 所有卡片复习完毕后的完成屏幕

**流程:**
1. 用户点击主页上的浮动气泡
2. 模态框打开并显示复习卡片
3. 用户复习每张卡片
4. 点击难度按钮 → 下一张卡片
5. 所有卡片完成 → 完成屏幕
6. 关闭模态框 → 返回主页

---

## 使用的导航模式

### 模式 1: 认证守卫 (自动重定向)
**位置:** 根布局
**触发:** 认证状态改变
**实现:** 监听 `isAuthenticated` 的 `useEffect`

```typescript
useEffect(() => {
  if (!isAuthenticated && !inAuthGroup) {
    router.replace('/(auth)/login'); // ← 自动
  }
}, [isAuthenticated]);
```

### 模式 2: 手动导航 (用户操作)
**示例:**
```typescript
// 按钮点击
<Pressable onPress={() => router.push('/profile')}>

// Link 组件
<Link href="/courses">前往课程</Link>

// 编程式
router.push('/review-modal');
router.back();
router.replace('/(tabs)');
```

### 模式 3: 模态框展示
**布局配置:**
```typescript
<Stack.Screen
  name="review-modal"
  options={{
    presentation: 'fullScreenModal', // ← 模态框样式
    animation: 'slide_from_bottom',
  }}
/>
```

---

## 路由保护总结

### 公开路由 (无需认证)
- `/(auth)/login`
- `/(auth)/register`

### 受保护路由 (需要认证)
- `/(tabs)/index` (首页)
- `/(tabs)/courses`
- `/(tabs)/profile`
- `/review-modal`

**保护机制:**
根布局在允许访问 `(tabs)` 组之前检查 `isAuthenticated`。

---

## 用户旅程示例

### 旅程 1: 首次用户
```
1. 应用打开 → 根布局
2. isAuthenticated = false → 重定向到 /login
3. 用户输入凭据 → 点击登录
4. userStore.login() → isAuthenticated = true
5. 根布局检测到变化 → 重定向到 /(tabs)
6. 用户看到主屏幕
```

### 旅程 2: 回访用户 (已登录)
```
1. 应用打开 → 根布局
2. AsyncStorage 加载 → isAuthenticated = true (来自上次会话)
3. 根布局 → 重定向到 /(tabs)
4. 用户立即看到主屏幕
```

### 旅程 3: 开始复习会话
```
1. 用户在主屏幕
2. 看到带有复习计数的浮动气泡
3. 点击气泡 → router.push('/review-modal')
4. 模态框滑入
5. 用户复习卡片
6. 点击 X 或 "完成" → router.back()
7. 返回主屏幕
```

### 旅程 4: 登出
```
1. 用户在个人资料屏幕
2. 点击 "退出登录"
3. userStore.logout() → isAuthenticated = false
4. 根布局检测到变化 → 重定向到 /login
5. 用户回到登录屏幕
```

---

## 导航状态管理

### Router Hook 使用
```typescript
import { useRouter, useSegments, useLocalSearchParams } from 'expo-router';

const router = useRouter();        // 在屏幕间导航
const segments = useSegments();    // 当前路由路径
const params = useLocalSearchParams(); // URL 参数
```

### 常用 Router 方法

| 方法 | 用途 | 示例 |
|--------|---------|---------|
| `push()` | 向前导航 | `router.push('/profile')` |
| `replace()` | 替换当前屏幕 | `router.replace('/login')` |
| `back()` | 返回上一屏幕 | `router.back()` |
| `dismiss()` | 关闭模态框 | `router.dismiss()` |

---

## 文件命名约定

| 文件名 | 用途 |
|-----------|---------|
| `index.tsx` | 目录的默认路由 |
| `_layout.tsx` | 兄弟组件的布局包装器 |
| `(groupName)/` | 路由组 (无 URL 影响) |
| `[id].tsx` | 动态路由参数 |
| `modal.tsx` | 常规屏幕 (可通过选项设为模态框) |

---

## 下一步 (待定路由)

### 待实现
1. **`app/learning/`** - 学习模块路由
   - 字母课程
   - 词汇练习
   - 句子构建

2. **`app/admin/`** - 管理面板
   - 用户管理
   - 内容创建
   - 分析

3. **动态路由**
   - `app/course/[id].tsx` - 单个课程视图
   - `app/lesson/[lessonId].tsx` - 课程详情

---

## 调试导航

### 常见问题

**问题:** 重定向循环
**解决方案:** 检查认证守卫逻辑，确保使用 `replace()` 而不是 `push()`

**问题:** 无法导航到路由
**解决方案:** 验证文件是否存在于 `app/` 中，检查布局是否包含屏幕

**问题:** 未收到参数
**解决方案:** 正确使用 `useLocalSearchParams()` hook

### 测试路由
```bash
# 查看所有路由
npx expo start
# 在终端按 Shift + M 查看路由树
```

---

## 总结

该应用使用 **3 层导航层级**:

1. **根布局** - 认证守卫和路由组
2. **组布局** - 认证屏幕 vs 应用屏幕
3. **屏幕组件** - 单个页面

**核心原则:** 让 Zustand 状态 (认证) 自动驱动导航，而不是到处手动重定向。
