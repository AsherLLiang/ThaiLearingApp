# Zustand 状态管理指南

关于 Zustand 如何工作以及如何在 Thai Learning App 中使用它的完整指南。

---

## 什么是 Zustand?

**Zustand** (德语“状态”) 是一个用于 React 的轻量级状态管理库。

### 为什么选择 Zustand 而不是 Redux?

| 特性 | Zustand | Redux |
|---------|---------|-------|
| **样板代码** | 极少 | 繁重 (actions, reducers, types) |
| **包大小** | 1.2 KB | 10+ KB |
| **学习曲线** | 简单 | 陡峭 |
| **DevTools** | 内置 | 需要扩展 |
| **TypeScript** | 一流支持 | 需要额外类型 |
| **中间件** | 简单 | 复杂 |

**Zustand 哲学:** "只使用 hooks，保持快乐"

---

## 核心概念

### 1. 创建 Store
```typescript
import { create } from 'zustand';

const useStore = create((set, get) => ({
  // 状态
  count: 0,

  // 动作
  increment: () => set({ count: get().count + 1 }),
  decrement: () => set({ count: get().count - 1 }),
}));
```

### 2. 使用 Store
```typescript
function Counter() {
  // 订阅特定状态
  const count = useStore((state) => state.count);
  const increment = useStore((state) => state.increment);

  return (
    <View>
      <Text>{count}</Text>
      <Button onPress={increment} title="+" />
    </View>
  );
}
```

### 3. 关键特性
- **无 Provider** - 直接导入并使用
- **选择性订阅** - 仅当所选状态更改时重新渲染
- **自动批处理** - 多个 `set()` 调用批处理在一起
- **持久化** - 易于集成的 AsyncStorage

---

## 项目 Stores

该应用有 **3 个 Zustand stores**:

1. **userStore** - 认证和用户个人资料
2. **learningStore** - 学习进度和课程数据
3. **languageStore** - UI 语言偏好

---

## Store 1: User Store (用户 Store)

**文件:** [src/stores/userStore.ts](../src/stores/userStore.ts)

### 状态结构
```typescript
interface UserState {
  // 数据
  currentUser: User | null;
  isAuthenticated: boolean;
  authToken: string | null;

  // 动作
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setUser: (user: User, token: string) => void;
  checkAuth: () => boolean;
}
```

### 完整实现
```typescript
export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // 初始状态
      currentUser: null,
      isAuthenticated: false,
      authToken: null,

      // 登录动作
      login: async (email: string, password: string) => {
        try {
          // TODO: 真实 API 调用
          // const response = await UserService.authenticateUser(email, password);

          // 模拟登录 (目前)
          const mockUser: User = {
            userId: '001',
            email,
            displayName: 'Liang JianYu',
            role: 'LEARNER',
            registrationDate: new Date().toISOString(),
          };

          const mockToken = 'mock_jwt_token_' + Date.now();

          // 更新状态
          set({
            currentUser: mockUser,
            isAuthenticated: true,
            authToken: mockToken,
          });

          return true;
        } catch (error) {
          console.error('Login failed:', error);
          return false;
        }
      },

      // 登出动作
      logout: () => {
        set({
          currentUser: null,
          isAuthenticated: false,
          authToken: null,
        });
      },

      // 设置用户动作
      setUser: (user: User, token: string) => {
        set({
          currentUser: user,
          isAuthenticated: true,
          authToken: token,
        });
      },

      // 检查认证动作
      checkAuth: () => {
        return get().isAuthenticated && get().authToken !== null;
      },
    }),
    {
      name: 'user-storage',  // ← AsyncStorage 键名
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

### 工作原理

#### 登录流程
```typescript
// 组件调用登录
const login = useUserStore((state) => state.login);
await login('test@example.com', 'password123');

// Store 更新:
// 1. set() 被调用，传入新状态
// 2. AsyncStorage 自动保存
// 3. 所有使用 useUserStore 的组件重新渲染
// 4. app/_layout.tsx 看到 isAuthenticated = true
// 5. 导航守卫重定向到应用
```

#### 登出流程
```typescript
// 组件调用登出
const logout = useUserStore((state) => state.logout);
logout();

// Store 更新:
// 1. set() 被调用，传入 null 值
// 2. AsyncStorage 被清除
// 3. 所有组件重新渲染
// 4. app/_layout.tsx 看到 isAuthenticated = false
// 5. 导航守卫重定向到登录
```

### 使用示例

**获取单个值:**
```typescript
const isAuthenticated = useUserStore((state) => state.isAuthenticated);
```

**获取多个值:**
```typescript
const { currentUser, isAuthenticated } = useUserStore((state) => ({
  currentUser: state.currentUser,
  isAuthenticated: state.isAuthenticated,
}));
```

**仅获取动作 (不重新渲染):**
```typescript
const login = useUserStore((state) => state.login);
// 当 currentUser 改变时，此组件不会重新渲染
```

**获取整个 Store (不推荐):**
```typescript
const userStore = useUserStore();
// 任何状态改变都会重新渲染 - 效率低
```

---

## Store 2: Learning Store (学习 Store)

**文件:** [src/stores/learningStore.ts](../src/stores/learningStore.ts)

### 状态结构
```typescript
interface LearningState {
  // 数据
  currentCourse: Course | null;
  progress: LearningProgress | null;
  completedContent: string[];

  // 动作
  setCourse: (course: Course) => void;
  updateProgress: (contentType: string, score: number) => void;
  getCompletionRate: () => number;
  resetLearning: () => void;
}
```

### 进度指标
```typescript
interface LearningProgress {
  progressId: string;
  userId: string;
  courseId: string;
  currentLevel: Level;

  // 完成指标
  completedAlphabets: number;    // 总共 76 个
  completedVocabulary: number;   // 总共 500 个
  completedSentences: number;    // 总共 100 个
  completedArticles: number;     // 总共 20 个

  // 成就指标
  totalScore: number;
  totalStudyTime: number;        // 分钟
  streakDays: number;

  lastUpdated: Date;
}
```

### 关键动作

#### 设置课程
```typescript
setCourse: (course: Course) => {
  set({ currentCourse: course });

  // 如果进度不存在则初始化
  if (!get().progress) {
    const newProgress: LearningProgress = {
      progressId: 'progress_' + Date.now(),
      userId: 'user_1',
      courseId: course.courseId,
      currentLevel: Level.BEGINNER_A,
      completedAlphabets: 30,
      completedVocabulary: 150,
      completedSentences: 20,
      completedArticles: 5,
      totalScore: 0,
      totalStudyTime: 1200,  // 20 小时
      streakDays: 7,
      lastUpdated: new Date(),
    };
    set({ progress: newProgress });
  }
},
```

#### 更新进度
```typescript
updateProgress: (contentType: string, score: number) => {
  const progress = get().progress;
  if (!progress) return;

  const updatedProgress = { ...progress };

  // 增加特定指标
  switch (contentType) {
    case 'alphabet':
      updatedProgress.completedAlphabets += 1;
      break;
    case 'vocabulary':
      updatedProgress.completedVocabulary += 1;
      break;
    case 'sentence':
      updatedProgress.completedSentences += 1;
      break;
    case 'article':
      updatedProgress.completedArticles += 1;
      break;
  }

  updatedProgress.totalScore += score;
  updatedProgress.lastUpdated = new Date();

  set({ progress: updatedProgress });
},
```

#### 获取完成率
```typescript
getCompletionRate: () => {
  const progress = get().progress;
  if (!progress) return 0;

  // 总项目数: 76 + 500 + 100 + 20 = 696
  const total = 76 + 500 + 100 + 20;

  const completed =
    progress.completedAlphabets +
    progress.completedVocabulary +
    progress.completedSentences +
    progress.completedArticles;

  return (completed / total) * 100;
},
```

### 在个人资料屏幕中使用
```typescript
// app/(tabs)/profile.tsx
const { progress, getCompletionRate } = useLearningStore();

// 显示指标
<Text>{progress?.completedVocabulary} / 500 词汇</Text>
<Text>{progress?.streakDays} 天连胜</Text>
<Text>{getCompletionRate()}% 完成</Text>
```

---

## Store 3: Language Store (语言 Store)

**文件:** [src/stores/languageStore.ts](../src/stores/languageStore.ts)

### 状态结构
```typescript
interface LanguageState {
  currentLanguage: 'zh' | 'en';
  changeLanguage: (lang: 'zh' | 'en') => void;
}
```

### 完整实现
```typescript
export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      currentLanguage: 'zh',  // 默认为中文

      changeLanguage: (lang: 'zh' | 'en') => {
        set({ currentLanguage: lang });  // 更新 store
        i18n.changeLanguage(lang);        // 更新 i18n
      },
    }),
    {
      name: 'language-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

### 应用启动时初始化
```typescript
// src/i18n/index.ts
import * as Localization from 'expo-localization';

// 检测设备语言
const deviceLanguage = Localization.locale.startsWith('zh') ? 'zh' : 'en';

// 从 AsyncStorage 加载保存的偏好 (通过 Zustand 持久化)
const savedLanguage = useLanguageStore.getState().currentLanguage;

// 使用保存的偏好，或回退到设备语言
const initialLanguage = savedLanguage || deviceLanguage;

i18n.changeLanguage(initialLanguage);
```

### 在组件中使用
```typescript
// src/components/common/LanguageSwitcher.tsx
const { currentLanguage, changeLanguage } = useLanguageStore();

const handleSwitch = () => {
  const newLang = currentLanguage === 'zh' ? 'en' : 'zh';
  changeLanguage(newLang);  // 更新 store 和 i18n
};

return (
  <Pressable onPress={handleSwitch}>
    <Text>{currentLanguage === 'zh' ? '中文' : 'EN'}</Text>
  </Pressable>
);
```

---

## 使用 AsyncStorage 持久化

### 工作原理

**persist** 中间件自动将状态保存到 AsyncStorage:

```typescript
persist(
  (set, get) => ({ /* store */ }),
  {
    name: 'user-storage',  // ← AsyncStorage 中的键名
    storage: createJSONStorage(() => AsyncStorage),
  }
)
```

**发生过程:**
1. **在 `set()` 时**: 状态作为 JSON 保存到 AsyncStorage
2. **在应用启动时**: 从 AsyncStorage 加载状态
3. **在应用关闭时**: 状态保留在 AsyncStorage 中

**使用的 AsyncStorage 键:**
- `user-storage` - 用户认证数据
- `learning-storage` - 学习进度数据
- `language-storage` - UI 语言偏好

### 手动访问 (如果需要)
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// 读取
const userData = await AsyncStorage.getItem('user-storage');
const user = JSON.parse(userData);

// 写入
await AsyncStorage.setItem('user-storage', JSON.stringify(state));

// 清除
await AsyncStorage.removeItem('user-storage');
```

---

## 高级 Zustand 模式

### 模式 1: 选择器用于性能优化

**问题:** 每次状态改变都重新渲染
```typescript
// ❌ 坏: 任何用户状态改变时都重新渲染
const userStore = useUserStore();
```

**解决方案:** 只选择你需要的
```typescript
// ✅ 好: 仅当 displayName 改变时重新渲染
const displayName = useUserStore((state) => state.currentUser?.displayName);
```

**多个值:**
```typescript
// ✅ 好: 仅当这些特定值改变时重新渲染
const { email, displayName } = useUserStore((state) => ({
  email: state.currentUser?.email,
  displayName: state.currentUser?.displayName,
}));
```

---

### 模式 2: 派生状态

**Store 计算值:**
```typescript
const useStore = create((set, get) => ({
  count: 0,
  increment: () => set({ count: get().count + 1 }),

  // 派生: 访问时计算
  isEven: () => get().count % 2 === 0,
}));

// 使用
const isEven = useStore((state) => state.isEven());
```

**在 Learning Store 中:**
```typescript
getCompletionRate: () => {
  const progress = get().progress;
  if (!progress) return 0;

  const total = 696;
  const completed = progress.completedAlphabets + /* ... */;

  return (completed / total) * 100;
},
```

---

### 模式 3: Immer 用于不可变更新

**不使用 Immer (手动复制):**
```typescript
updateProgress: () => {
  const progress = get().progress;
  const updated = { ...progress };  // 手动展开
  updated.completedAlphabets += 1;
  set({ progress: updated });
},
```

**使用 Immer (更干净):**
```typescript
import { immer } from 'zustand/middleware/immer';

const useStore = create<State>()(
  immer((set) => ({
    progress: null,

    updateProgress: () => set((state) => {
      state.progress.completedAlphabets += 1;  // 直接突变 (安全)
    }),
  }))
);
```

**目前项目中未使用，但如果需要可用。**

---

### 模式 4: 中间件组合

**堆叠多个中间件:**
```typescript
import { persist, devtools, immer } from 'zustand/middleware';

const useStore = create<State>()(
  devtools(              // ← Redux DevTools
    persist(             // ← AsyncStorage
      immer(             // ← Immer for mutations
        (set, get) => ({ /* store */ })
      ),
      { name: 'store' }
    )
  )
);
```

**顺序很重要:**
- 创建时: 外层 → 内层
- 执行时: 内层 → 外层

---

## Zustand vs 其他解决方案

### Zustand vs Redux

**Redux (旧方式):**
```typescript
// 1. Action types
const INCREMENT = 'INCREMENT';

// 2. Action creators
const increment = () => ({ type: INCREMENT });

// 3. Reducer
const reducer = (state = 0, action) => {
  switch (action.type) {
    case INCREMENT: return state + 1;
    default: return state;
  }
};

// 4. Store
const store = createStore(reducer);

// 5. Provider
<Provider store={store}><App /></Provider>

// 6. Connect component
connect(mapStateToProps, mapDispatchToProps)(Counter);
```

**Zustand (新方式):**
```typescript
// 1. 创建 store
const useStore = create((set, get) => ({
  count: 0,
  increment: () => set({ count: get().count + 1 }),
}));

// 2. 在组件中使用
const { count, increment } = useStore();
```

**代码行数:** Redux ~30, Zustand ~5

---

### Zustand vs Context API

**Context API:**
```typescript
// 1. 创建 context
const UserContext = React.createContext();

// 2. Provider 组件
function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

// 3. 包裹应用
<UserProvider><App /></UserProvider>

// 4. 在组件中使用
const { user } = useContext(UserContext);
```

**问题:**
- 需要 Provider 包裹
- 任何 context 改变都会导致所有消费者重新渲染
- 没有内置持久化

**Zustand 优势:**
- 无需 Provider
- 选择性订阅 (仅在选定更改时重新渲染)
- 易于持久化
- 更好的 DevTools

---

### Zustand vs useState

**useState (组件级):**
```typescript
function Counter() {
  const [count, setCount] = useState(0);  // ← 卸载时丢失

  return <Text>{count}</Text>;
}
```

**Zustand (全局):**
```typescript
const useCountStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));

function Counter() {
  const count = useCountStore((state) => state.count);  // ← 持久化

  return <Text>{count}</Text>;
}
```

**使用 useState 当:**
- 状态仅在一个组件中使用
- 状态不需要持久化
- 仅 UI 状态 (如 "模态框是否打开")

**使用 Zustand 当:**
- 状态跨组件共享
- 状态需要在会话间持久化
- 应用数据 (用户, 进度, 设置)

---

## 测试 Zustand Stores

### 单元测试 Actions
```typescript
import { useUserStore } from './userStore';

describe('userStore', () => {
  it('should login user', async () => {
    const { login, isAuthenticated } = useUserStore.getState();

    const success = await login('test@example.com', 'password');

    expect(success).toBe(true);
    expect(useUserStore.getState().isAuthenticated).toBe(true);
  });

  it('should logout user', () => {
    const { logout } = useUserStore.getState();

    logout();

    expect(useUserStore.getState().currentUser).toBe(null);
    expect(useUserStore.getState().isAuthenticated).toBe(false);
  });
});
```

### 在测试之间重置 Store
```typescript
beforeEach(() => {
  useUserStore.setState({
    currentUser: null,
    isAuthenticated: false,
    authToken: null,
  });
});
```

---

## 本项目中的常见模式

### 模式 1: 带 Zustand 的认证守卫
```typescript
// app/_layout.tsx
const { isAuthenticated } = useUserStore();  // ← 订阅

useEffect(() => {
  if (!isAuthenticated) {
    router.replace('/(auth)/login');  // ← 响应变化
  }
}, [isAuthenticated]);
```

### 模式 2: 仅动作订阅
```typescript
// 登录屏幕仅调用动作，不需要状态
const login = useUserStore((state) => state.login);

// 当用户状态改变时，此组件不会重新渲染
// (因为它没有订阅状态，只订阅了动作)
```

### 模式 3: 多 Store 组合
```typescript
// 个人资料屏幕使用 3 个 store
const { currentUser } = useUserStore();
const { progress } = useLearningStore();
const { currentLanguage } = useLanguageStore();

// 每个订阅都是独立的
// 组件仅在选定值改变时重新渲染
```

---

## 调试 Zustand

### 查看当前状态
```typescript
// 在任何组件或控制台中
console.log(useUserStore.getState());
console.log(useLearningStore.getState());
console.log(useLanguageStore.getState());
```

### 订阅更改 (调试)
```typescript
useUserStore.subscribe(
  (state) => console.log('State changed:', state)
);
```

### 检查 AsyncStorage
```bash
# 在终端中
adb shell
run-as com.thailearningapp
cat /data/data/com.thailearningapp/shared_prefs/RKStorage.xml
```
