# 参数传递与数据流指南

本文档解释了数据如何在 Thai Learning App 中流动 - 从用户操作到状态更新再到 UI 渲染。

---

## 数据流类型

该应用使用 **3 种主要模式** 来传递数据：

1. **Props** (父组件 → 子组件)
2. **State Hooks** (通过 Zustand 的全局状态)
3. **URL 参数** (带数据的导航)

---

## 模式 1: Props (组件 → 组件)

### 示例 1: FloatingBubbles 组件

**父组件:** `app/(tabs)/index.tsx`
```typescript
export default function HomeScreen() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const router = useRouter();

  const handleBubbleClick = () => {
    router.push('/review-modal');
  };

  return (
    <FloatingBubbles
      reviews={reviews}              // ← PROP: 数据
      onOpenReview={handleBubbleClick} // ← PROP: 回调函数
    />
  );
}
```

**子组件:** `src/components/common/FloatingBubbles.tsx`
```typescript
interface FloatingBubblesProps {
  reviews: ReviewItem[];          // ← 接收: 复习项目数组
  onOpenReview: () => void;       // ← 接收: 点击时调用的函数
}

export const FloatingBubbles: React.FC<FloatingBubblesProps> = ({
  reviews,
  onOpenReview,
}) => {
  return (
    <Pressable onPress={onOpenReview}>  {/* ← 使用: 回调 */}
      <Text>{reviews.length}</Text>     {/* ← 使用: 数据 */}
    </Pressable>
  );
};
```

**数据流:**
```
首页 (父组件)
    ↓ reviews={reviews}
FloatingBubbles (子组件)
    ↓ 用户点击
    ↓ onOpenReview() 被调用
首页 (父组件)
    ↓ handleBubbleClick() 执行
    ↓ router.push('/review-modal')
发生导航
```

---

### 示例 2: ThaiPatternBackground 组件

**父组件:** `app/(auth)/login.tsx`
```typescript
export default function LoginScreen() {
  return (
    <View>
      <ThaiPatternBackground opacity={0.15} />  {/* ← PROP: 数字 */}
    </View>
  );
}
```

**子组件:** `src/components/common/ThaiPatternBackground.tsx`
```typescript
interface ThaiPatternBackgroundProps {
  opacity?: number;  // ← 可选 prop，带默认值
}

export const ThaiPatternBackground: React.FC<ThaiPatternBackgroundProps> = ({
  opacity = 0.1,  // ← 如果未提供，则使用默认值
}) => {
  return (
    <Svg style={{ opacity }}>  {/* ← 使用: Prop 值 */}
      {/* SVG 内容 */}
    </Svg>
  );
};
```

**参数详情:**
- **类型:** 数字 (0 到 1)
- **用途:** 控制背景可见度
- **默认值:** 0.1 (非常微妙)
- **用法:** 登录页使用 0.15 (稍微明显一点)

---

### 示例 3: LanguageSwitcher 组件

**父组件:** `app/(auth)/login.tsx`
```typescript
export default function LoginScreen() {
  return (
    <LanguageSwitcher variant="compact" />  {/* ← PROP: 字符串字面量 */}
  );
}
```

**父组件:** `app/(tabs)/profile.tsx`
```typescript
export default function ProfileScreen() {
  return (
    <LanguageSwitcher variant="full" />  {/* ← PROP: 不同变体 */}
  );
}
```

**子组件:** `src/components/common/LanguageSwitcher.tsx`
```typescript
interface LanguageSwitcherProps {
  variant?: 'compact' | 'full';  // ← 联合类型 (仅 2 个选项)
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'compact',  // ← 默认值
}) => {
  if (variant === 'compact') {
    return (/* 地球图标 + 语言代码 */);
  }
  return (/* 两个选项的选择器 */);
};
```

**Prop 变体:**
- **compact**: 地球图标 + "中文"/"EN" (用于认证屏幕)
- **full**: 两个带国旗的按钮 (用于个人资料屏幕)

---

## 模式 2: State Hooks (通过 Zustand 的全局状态)

### Zustand 如何工作

**定义 (创建 Store):**
```typescript
// src/stores/userStore.ts
export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // 状态
      currentUser: null,
      isAuthenticated: false,

      // 动作
      login: async (email, password) => {
        const user = await authenticate(email, password);
        set({ currentUser: user, isAuthenticated: true });  // ← 更新状态
      },

      logout: () => {
        set({ currentUser: null, isAuthenticated: false });  // ← 更新状态
      },
    }),
    { name: 'user-storage' }  // ← 持久化到 AsyncStorage
  )
);
```

**使用 (组件消费):**
```typescript
// app/(auth)/login.tsx
import { useUserStore } from '@/src/stores/userStore';

export default function LoginScreen() {
  // ↓ 订阅状态的特定部分
  const { login, isAuthenticated } = useUserStore();

  const handleLogin = async () => {
    await login(email, password);  // ← 调用动作
    // 状态自动更新
    // 所有使用 useUserStore 的组件重新渲染
  };
}
```

**数据流:**
```
用户点击 "登录"
    ↓
login(email, password) 被调用
    ↓
userStore.login() 执行
    ↓
set({ isAuthenticated: true })
    ↓
AsyncStorage 保存状态
    ↓
所有使用 useUserStore() 的组件重新渲染
    ↓
app/_layout.tsx 检测到 isAuthenticated = true
    ↓
router.replace('/(tabs)')
    ↓
发生导航
```

---

### 示例: 用户状态流

**1. 登录屏幕更新状态**
```typescript
// app/(auth)/login.tsx
const login = useUserStore((state) => state.login);

const handleLogin = async () => {
  const success = await login(email, password);
  // 不需要手动重定向 - 认证守卫会处理
};
```

**2. 根布局响应状态变化**
```typescript
// app/_layout.tsx
const { isAuthenticated } = useUserStore();  // ← 已订阅

useEffect(() => {
  if (isAuthenticated) {
    router.replace('/(tabs)');  // ← 自动重定向
  }
}, [isAuthenticated]);  // ← 状态变化时触发
```

**3. 个人资料屏幕显示状态**
```typescript
// app/(tabs)/profile.tsx
const { currentUser } = useUserStore();  // ← 已订阅

return (
  <Text>{currentUser?.displayName}</Text>  // ← 渲染当前值
);
```

**关键点:** 多个组件自动响应同一个状态变化！

---

### 示例: 学习进度状态流

**1. 更新进度 (未来实现)**
```typescript
// app/learning/lesson.tsx (示例)
const updateProgress = useLearningStore((state) => state.updateProgress);

const handleLessonComplete = () => {
  updateProgress('vocabulary', 10);  // ← 更新
};
```

**2. Store 中更新状态**
```typescript
// src/stores/learningStore.ts
updateProgress: (contentType: string, score: number) => {
  const progress = get().progress;
  const updated = { ...progress };

  if (contentType === 'vocabulary') {
    updated.completedVocabulary += 1;  // ← 增加
  }
  updated.totalScore += score;

  set({ progress: updated });  // ← 保存
};
```

**3. 个人资料屏幕显示更新后的值**
```typescript
// app/(tabs)/profile.tsx
const { progress } = useLearningStore();  // ← 自动重新渲染

return (
  <Text>{progress?.completedVocabulary} 词汇</Text>  // ← 新值
);
```

---

### 示例: 语言状态流

**1. 用户更改语言**
```typescript
// src/components/common/LanguageSwitcher.tsx
const changeLanguage = useLanguageStore((state) => state.changeLanguage);

const handleSwitch = () => {
  changeLanguage('en');  // ← 触发更改
};
```

**2. Store 更新 i18n**
```typescript
// src/stores/languageStore.ts
changeLanguage: (lang: 'zh' | 'en') => {
  set({ currentLanguage: lang });  // ← 更新状态
  i18n.changeLanguage(lang);       // ← 更新 i18n
},
```

**3. 所有屏幕使用新语言重新渲染**
```typescript
// app/(auth)/login.tsx
const { t } = useTranslation();  // ← 订阅 i18n

return (
  <Text>{t('auth.loginButton')}</Text>  // ← "登录" 或 "Login"
);
```

**数据流:**
```
LanguageSwitcher: changeLanguage('en')
    ↓
languageStore: set({ currentLanguage: 'en' })
    ↓
i18n.changeLanguage('en')
    ↓
所有使用 useTranslation() 的组件重新渲染
    ↓
文本从 "登录" 变为 "Login"
```

---

## 模式 3: URL 参数 (带数据的导航)

### 示例 1: 搜索参数 (未来使用)

**带参数导航:**
```typescript
// app/(tabs)/index.tsx
const router = useRouter();

const handleSearchCourse = () => {
  router.push('/courses?level=beginner&category=alphabet');
};
```

**接收参数:**
```typescript
// app/courses.tsx
import { useLocalSearchParams } from 'expo-router';

export default function CoursesScreen() {
  const { level, category } = useLocalSearchParams();

  console.log(level);    // "beginner"
  console.log(category); // "alphabet"

  return <Text>显示 {category} 中的 {level} 课程</Text>;
}
```

**生成的 URL:**
```
/courses?level=beginner&category=alphabet
```

---

### 示例 2: 动态路由参数 (未来使用)

**文件结构:**
```
app/
└── course/
    └── [id].tsx  ← 动态段
```

**带动态参数导航:**
```typescript
// app/(tabs)/courses.tsx
const router = useRouter();

const handleCourseClick = (courseId: string) => {
  router.push(`/course/${courseId}`);
};

// 用法
handleCourseClick('thai-101');  // → /course/thai-101
```

**接收动态参数:**
```typescript
// app/course/[id].tsx
import { useLocalSearchParams } from 'expo-router';

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams();

  console.log(id);  // "thai-101"

  // 使用 ID 获取课程数据
  const course = useCourseData(id);

  return <Text>{course.name}</Text>;
}
```

**生成的 URL:**
```
/course/thai-101
```

---

### 示例 3: 复杂参数

**带多种类型导航:**
```typescript
router.push({
  pathname: '/lesson/[lessonId]',
  params: {
    lessonId: '42',
    section: 'vocabulary',
    mode: 'practice',
  }
});
```

**接收所有参数:**
```typescript
// app/lesson/[lessonId].tsx
const { lessonId, section, mode } = useLocalSearchParams();

console.log(lessonId); // "42"
console.log(section);  // "vocabulary"
console.log(mode);     // "practice"
```

**生成的 URL:**
```
/lesson/42?section=vocabulary&mode=practice
```

---

## 数据流模式比较

### 模式比较表

| 模式 | 范围 | 持久性 | 重新渲染 | 用例 |
|---------|-------|-------------|------------|----------|
| **Props** | 仅父 → 子 | 否 | 仅子组件 | 组件 UI 配置 |
| **Zustand State** | 全局 | 是 (AsyncStorage) | 所有订阅者 | 用户认证, 学习进度 |
| **URL Params** | 仅导航 | 否 (应用关闭时丢失) | 仅目标屏幕 | 深度链接, 搜索过滤 |

---

## 完整数据流示例

### 示例 1: 登录流程 (所有 3 种模式)

```
1. 用户操作
   用户点击 LoginScreen 中的 "登录" 按钮

2. 组件状态 (本地)
   const [email, setEmail] = useState('test@example.com');
   const [password, setPassword] = useState('password');

3. 调用 ZUSTAND 动作
   await userStore.login(email, password);

4. STORE 更新
   set({ currentUser: {...}, isAuthenticated: true });
   AsyncStorage.setItem('user-storage', JSON.stringify(state));

5. 所有订阅者重新渲染
   - app/_layout.tsx 接收 isAuthenticated = true
   - app/(tabs)/profile.tsx 接收 currentUser = {...}

6. 触发导航
   app/_layout.tsx: router.replace('/(tabs)');

7. 新屏幕加载
   app/(tabs)/index.tsx 挂载

8. 新屏幕使用状态
   const { currentUser } = useUserStore();
   <Text>你好, {currentUser?.displayName}</Text>
```

---

### 示例 2: 复习会话流程

```
1. 首页传递 PROPS
   <FloatingBubbles
     reviews={mockReviews}
     onOpenReview={handleBubbleClick}
   />

2. 用户点击气泡
   FloatingBubbles: onOpenReview() 被调用

3. 父组件执行回调
   handleBubbleClick() {
     router.push('/review-modal');
     setReviews([]);
   }

4. 隐式数据导航
   模态框打开，从未来 API/store 读取复习

5. 用户完成复习
   模态框: updateProgress('alphabet', 5) 被调用

6. ZUSTAND STORE 更新
   learningStore: completedAlphabets += 1

7. 个人资料屏幕重新渲染
   自动显示更新后的字母计数

8. 模态框关闭
   router.back() → 返回首页
```

---

### 示例 3: 语言更改流程

```
1. 用户点击语言切换器
   LanguageSwitcher: handleSwitch() 被调用

2. 调用 ZUSTAND 动作
   languageStore.changeLanguage('en')

3. STORE 更新两件事
   - Zustand 状态: set({ currentLanguage: 'en' })
   - i18n 实例: i18n.changeLanguage('en')

4. ASYNCSTORAGE 持久化
   AsyncStorage.setItem('language-storage', '{"currentLanguage":"en"}')

5. 所有 i18n 订阅者重新渲染
   - LoginScreen: "登录" → "Login"
   - ProfileScreen: "我的成就" → "My Achievements"
   - TabBar: "学习" → "Learn"

6. 无需导航
   UI 原地更新
```

---

## 高级参数传递

### 回调 Props (函数作为 Props)

**父组件传递函数:**
```typescript
// 父组件
const handleComplete = (score: number) => {
  console.log('用户得分:', score);
};

<LessonComponent onComplete={handleComplete} />
```

**子组件调用函数:**
```typescript
// 子组件
interface LessonProps {
  onComplete: (score: number) => void;
}

const LessonComponent: React.FC<LessonProps> = ({ onComplete }) => {
  const finishLesson = () => {
    const score = calculateScore();
    onComplete(score);  // ← 调用父组件的函数并传递数据
  };
};
```

**数据向上流动:** 子组件 → 父组件

---

### Render Props 模式

**将组件作为 Prop 传递:**
```typescript
// 父组件
<CardContainer
  renderHeader={() => <Text>自定义标题</Text>}
  renderContent={() => <Text>自定义内容</Text>}
/>
```

**子组件渲染 Prop:**
```typescript
// 子组件
interface CardProps {
  renderHeader: () => React.ReactNode;
  renderContent: () => React.ReactNode;
}

const CardContainer: React.FC<CardProps> = ({ renderHeader, renderContent }) => {
  return (
    <View>
      {renderHeader()}    {/* ← 渲染自定义组件 */}
      {renderContent()}
    </View>
  );
};
```

---

### Context 模式 (尚未使用，但可用)

**组件树的 Zustand 替代方案:**
```typescript
// 创建 context
const ThemeContext = React.createContext(defaultTheme);

// Provider (树的高层)
<ThemeContext.Provider value={currentTheme}>
  <App />
</ThemeContext.Provider>

// Consumer (树的任何位置)
const theme = useContext(ThemeContext);
```

**为什么不使用:** 对于此应用，Zustand 更简单且更强大。

---

## 参数类型安全

### Props 接口
```typescript
interface FloatingBubblesProps {
  reviews: ReviewItem[];          // ← TypeScript 强制数组类型
  onOpenReview: () => void;       // ← 必须是无参数函数
  maxCards?: number;              // ← 可选 (? 符号)
}

// ✅ 有效
<FloatingBubbles reviews={mockReviews} onOpenReview={handleClick} />

// ❌ 无效 - TypeScript 错误
<FloatingBubbles reviews="不是数组" onOpenReview={42} />
```

### Zustand 状态类型
```typescript
interface UserState {
  currentUser: User | null;                               // ← 可以为 null
  isAuthenticated: boolean;                              // ← 必须是布尔值
  login: (email: string, password: string) => Promise<boolean>;  // ← 类型化函数
}

// ✅ 有效
const success = await login('test@mail.com', 'pass123');

// ❌ 无效 - TypeScript 错误
const success = await login(123, true);
```

### URL 参数类型
```typescript
// TypeScript 从 useLocalSearchParams 推断类型
const { id, level } = useLocalSearchParams();

// 两者都是 string | string[] (可能是单个或数组)
console.log(typeof id);  // "string" (通常)

// 类型守卫以确保安全
const courseId = Array.isArray(id) ? id[0] : id;
```

---

## 本项目中的常见模式

### 模式 1: 组件接收 Props，不管理状态
```typescript
// FloatingBubbles 不存储复习，只是显示它们
export const FloatingBubbles: React.FC<FloatingBubblesProps> = ({ reviews }) => {
  // 这里没有 useState - 父组件拥有数据
  return <View>{reviews.map(...)}</View>;
};
```

**哲学:** "哑组件" 更容易测试和复用。

---

### 模式 2: 屏幕管理本地状态，Zustand 管理全局状态
```typescript
// 首页
export default function HomeScreen() {
  // 本地状态 (仅 UI)
  const [reviews, setReviews] = useState<ReviewItem[]>([]);

  // 全局状态 (跨应用共享)
  const { currentUser } = useUserStore();
  const { progress } = useLearningStore();
}
```

**规则:** 如果只有这个屏幕需要它 → useState。如果多个屏幕需要它 → Zustand。

---

### 模式 3: 导航触发状态，状态触发导航
```typescript
// 登录屏幕触发状态改变
await userStore.login(email, password);  // ← 动作

// 根布局响应状态改变
useEffect(() => {
  if (isAuthenticated) {
    router.replace('/(tabs)');  // ← 导航
  }
}, [isAuthenticated]);
```

**双向流:** 动作导致状态改变，状态改变导致导航。

---

## 调试数据流

### 检查 Zustand 状态
```typescript
// 添加临时日志
const userStore = useUserStore();
console.log('当前状态:', useUserStore.getState());
```

### 检查接收到的 Props
```typescript
export const FloatingBubbles: React.FC<FloatingBubblesProps> = (props) => {
  console.log('接收到的 Props:', props);  // ← 调试日志
  // ...
};
```

### 检查 URL 参数
```typescript
export default function Screen() {
  const params = useLocalSearchParams();
  console.log('URL 参数:', params);  // ← 调试日志
}
```

---

## 最佳实践

### ✅ 推荐
- 使用 props 进行特定于组件的 UI 配置
- 使用 Zustand 进行全局应用状态管理
- 使用 URL 参数进行导航上下文
- 使用接口为所有 props 类型化
- 保持组件纯净 (相同的 props = 相同的输出)

### ❌ 避免
- 将整个 store 作为 prop 传递 (违背了全局状态的目的)
- 在 Zustand 中存储导航状态 (改用 router)
- 突变 props (它们是只读的)
- 对深层嵌套的组件树使用 props (改用 Zustand)

---

## 总结

**3 种传递数据的方式:**

1. **Props** (父 → 子)
   - 显式，类型安全
   - 用于组件配置

2. **Zustand** (全局)
   - 隐式，随处可用
   - 用于用户数据、进度、设置

3. **URL 参数** (屏幕 → 屏幕)
   - 基于字符串，可共享
   - 用于 ID、搜索查询、深度链接
