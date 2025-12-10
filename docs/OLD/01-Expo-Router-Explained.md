# Expo Router - 完整指南

## 什么是 Expo Router?

**Expo Router** 是一个基于文件的路由系统，专为使用 Expo 构建的 React Native 应用程序设计。它将 Web 路由（如 Next.js）的简单性带到了移动应用中。

### 核心概念: 基于文件的路由

您无需在代码中手动配置路由，而是在 `app/` 目录中创建文件，Expo Router 会根据您的文件夹结构**自动**创建路由。

```
app/
├── index.tsx          → 路由: "/"
├── profile.tsx        → 路由: "/profile"
├── settings/
│   └── index.tsx      → 路由: "/settings"
└── user/
    └── [id].tsx       → 路由: "/user/123" (动态)
```

---

## 为什么要使用 Expo Router?

### 传统的 React Native 导航 (React Navigation)
```typescript
// 需要手动配置
const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### 使用 Expo Router
```
app/
├── index.tsx      ← 自动路由
├── profile.tsx    ← 自动路由
└── settings.tsx   ← 自动路由
```

**无需手动配置！** 路由会自动创建。

---

## 主要特性

### 1. **自动路由生成**
`app/` 中的每个文件都会自动成为一个路由。

### 2. **类型安全的导航**
TypeScript 知道您的所有路由，如果您导航到不存在的路由，将会显示错误。

```typescript
// ✅ 正确
router.push('/(tabs)/profile')

// ❌ 错误: 路由不存在
router.push('/nonexistent-route')
```

### 3. **嵌套布局**
使用 `_layout.tsx` 文件创建包裹多个屏幕的布局。

### 4. **路由组**
使用 `(groupName)/` 文件夹组织路由而不影响 URL。

### 5. **深度链接**
自动支持从 URL 打开您的应用。

---

## 基础路由模式

### 模式 1: 简单路由
```
app/
├── index.tsx       → "/"
├── about.tsx       → "/about"
└── contact.tsx     → "/contact"
```

### 模式 2: 嵌套路由
```
app/
├── index.tsx           → "/"
└── settings/
    ├── index.tsx       → "/settings"
    ├── account.tsx     → "/settings/account"
    └── privacy.tsx     → "/settings/privacy"
```

### 模式 3: 动态路由 (参数)
```
app/
└── user/
    └── [id].tsx        → "/user/123", "/user/456"
```

在组件中访问参数:
```typescript
import { useLocalSearchParams } from 'expo-router';

export default function UserScreen() {
  const { id } = useLocalSearchParams();
  return <Text>User ID: {id}</Text>;
}
```

### 模式 4: 捕获所有路由
```
app/
└── [...slug].tsx       → 匹配任何路径
```

---

## 使用 `_layout.tsx` 的布局

**布局** 是特殊的文件，用于包裹同一目录下的所有屏幕。

### 示例: 根布局
```typescript
// app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}
```
这将创建一个 **Stack Navigator** (屏幕从右侧滑入)。

### 布局类型

| 布局类型 | 导入 | 用途 |
|------------|--------|----------|
| Stack | `expo-router` | 标准的屏幕间导航 |
| Tabs | `expo-router` | 底部标签栏导航 |
| Drawer | `expo-router` | 侧边抽屉菜单 |

---

## 路由组: 组织而不影响 URL

**路由组** 使用括号 `()` 来组织文件，**而不会添加到 URL 路径中**。

### 不使用组
```
app/
├── login.tsx          → "/login"
├── register.tsx       → "/register"
├── home.tsx           → "/home"
└── profile.tsx        → "/profile"
```

### 使用组
```
app/
├── (auth)/
│   ├── login.tsx      → "/login" (不是 "/auth/login")
│   └── register.tsx   → "/register"
└── (tabs)/
    ├── home.tsx       → "/home"
    └── profile.tsx    → "/profile"
```

**好处:**
- 逻辑上对相关屏幕进行分组
- 为不同的组应用不同的布局
- 保持 URL 结构清晰

---

## 导航方法

### 1. **Push** - 添加到导航栈
```typescript
import { useRouter } from 'expo-router';

const router = useRouter();
router.push('/profile'); // 向前导航
```

### 2. **Replace** - 替换当前屏幕
```typescript
router.replace('/login'); // 无法返回
```

### 3. **Back** - 返回上一屏幕
```typescript
router.back();
```

### 4. **Link 组件** - 可点击的导航
```typescript
import { Link } from 'expo-router';

<Link href="/profile">
  <Text>前往个人资料</Text>
</Link>
```

---

## 高级特性

### 1. 模态框展示
```typescript
// app/_layout.tsx
<Stack>
  <Stack.Screen
    name="modal"
    options={{ presentation: 'modal' }}
  />
</Stack>
```

### 2. 搜索参数
```typescript
// 带参数导航
router.push('/search?query=thai&level=beginner');

// 访问参数
const { query, level } = useLocalSearchParams();
```

### 3. 编程式导航守卫
```typescript
// app/_layout.tsx
useEffect(() => {
  if (!isAuthenticated) {
    router.replace('/login');
  }
}, [isAuthenticated]);
```

---

## 对比: Web 路由 vs Expo Router

| Web (Next.js) | Expo Router | 结果 |
|--------------|-------------|---------|
| `pages/index.tsx` | `app/index.tsx` | 首页 |
| `pages/about.tsx` | `app/about.tsx` | `/about` |
| `pages/blog/[slug].tsx` | `app/blog/[slug].tsx` | `/blog/hello` |
| `pages/_app.tsx` | `app/_layout.tsx` | 根布局 |

**如果您了解 Next.js，您就已经理解了 Expo Router！**

---

## 常见模式

### 认证流程
```
app/
├── _layout.tsx         ← 认证守卫逻辑
├── (auth)/
│   ├── _layout.tsx     ← 如果已登录则重定向
│   ├── login.tsx
│   └── register.tsx
└── (app)/
    ├── _layout.tsx     ← 如果已登出则重定向
    ├── home.tsx
    └── profile.tsx
```

### 标签导航
```
app/
└── (tabs)/
    ├── _layout.tsx     ← 标签配置
    ├── index.tsx       ← 标签 1
    ├── search.tsx      ← 标签 2
    └── profile.tsx     ← 标签 3
```

---

## 最佳实践

### ✅ 推荐
- 使用路由组来组织屏幕
- 保持布局简单且专注
- 使用 TypeScript 以获得类型安全的路由
- 登录/登出重定向使用 `replace`
- 文件命名具有描述性

### ❌ 避免
- 在布局中放置业务逻辑
- 创建过深的嵌套路由结构
- 在导航守卫中使用复杂状态
- 混合使用导航库 (不要在 Expo Router 旁边使用 React Navigation)

---

## 调试路由

### 查看所有路由
```bash
# 启动 Expo 并清除缓存
npx expo start --clear
```

在终端中，按 `Shift + M` 查看所有生成的路由。

### 常见问题

**问题**: 屏幕未显示
- 检查文件是否在 `app/` 目录下
- 确保文件导出了默认组件
- 检查 `_layout.tsx` 是否包含该屏幕

**问题**: 导航不工作
- 验证路由路径是否正确
- 检查路由名称是否有拼写错误
- 确保 `_layout.tsx` 存在

---

## 从 React Navigation 迁移

如果您现有的应用使用了 React Navigation:

```typescript
// 旧方式
navigation.navigate('Profile', { userId: '123' });

// 新方式
router.push('/profile/123');
```

**迁移的好处:**
- 更少的样板代码
- 自动深度链接
- 更好的 TypeScript 支持
- 更简单的项目结构

---

## 总结

**Expo Router** 让 React Native 中的导航就像创建文件一样简单:

1. **文件 = 路由** - 只需在 `app/` 中创建文件
2. **文件夹 = 路径段** - `app/settings/account.tsx` → `/settings/account`
3. **`_layout.tsx` = 包装器** - 控制屏幕如何显示
4. **`(group)` = 组织** - 分组文件而不影响 URL
5. **`[param]` = 动态** - 创建带参数的路由

**主要优势:** 代码更少，效率更高，组织更好。
