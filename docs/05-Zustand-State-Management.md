# Zustand State Management Guide

Complete guide to how Zustand works and how it's used in the Thai Learning App.

---

## What is Zustand?

**Zustand** (German for "state") is a lightweight state management library for React.

### Why Zustand Instead of Redux?

| Feature | Zustand | Redux |
|---------|---------|-------|
| **Boilerplate** | Minimal | Heavy (actions, reducers, types) |
| **Bundle Size** | 1.2 KB | 10+ KB |
| **Learning Curve** | Easy | Steep |
| **DevTools** | Built-in | Requires extension |
| **TypeScript** | First-class | Requires extra types |
| **Middleware** | Simple | Complex |

**Zustand Philosophy:** "Just use hooks, be happy"

---

## Core Concepts

### 1. Store Creation
```typescript
import { create } from 'zustand';

const useStore = create((set, get) => ({
  // STATE
  count: 0,

  // ACTIONS
  increment: () => set({ count: get().count + 1 }),
  decrement: () => set({ count: get().count - 1 }),
}));
```

### 2. Using the Store
```typescript
function Counter() {
  // Subscribe to specific state
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

### 3. Key Features
- **No providers** - Just import and use
- **Selective subscriptions** - Only re-render when selected state changes
- **Automatic batching** - Multiple `set()` calls batched together
- **Persistence** - Easy AsyncStorage integration

---

## Project Stores

The app has **3 Zustand stores**:

1. **userStore** - Authentication and user profile
2. **learningStore** - Learning progress and course data
3. **languageStore** - UI language preference

---

## Store 1: User Store

**File:** [src/stores/userStore.ts](../src/stores/userStore.ts)

### State Structure
```typescript
interface UserState {
  // DATA
  currentUser: User | null;
  isAuthenticated: boolean;
  authToken: string | null;

  // ACTIONS
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setUser: (user: User, token: string) => void;
  checkAuth: () => boolean;
}
```

### Full Implementation
```typescript
export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // INITIAL STATE
      currentUser: null,
      isAuthenticated: false,
      authToken: null,

      // LOGIN ACTION
      login: async (email: string, password: string) => {
        try {
          // TODO: Real API call
          // const response = await UserService.authenticateUser(email, password);

          // Mock login (for now)
          const mockUser: User = {
            userId: '001',
            email,
            displayName: 'Liang JianYu',
            role: 'LEARNER',
            registrationDate: new Date().toISOString(),
          };

          const mockToken = 'mock_jwt_token_' + Date.now();

          // UPDATE STATE
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

      // LOGOUT ACTION
      logout: () => {
        set({
          currentUser: null,
          isAuthenticated: false,
          authToken: null,
        });
      },

      // SET USER ACTION
      setUser: (user: User, token: string) => {
        set({
          currentUser: user,
          isAuthenticated: true,
          authToken: token,
        });
      },

      // CHECK AUTH ACTION
      checkAuth: () => {
        return get().isAuthenticated && get().authToken !== null;
      },
    }),
    {
      name: 'user-storage',  // ← AsyncStorage key
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

### How It Works

#### Login Flow
```typescript
// Component calls login
const login = useUserStore((state) => state.login);
await login('test@example.com', 'password123');

// Store updates:
// 1. set() called with new state
// 2. AsyncStorage automatically saves
// 3. All components using useUserStore re-render
// 4. app/_layout.tsx sees isAuthenticated = true
// 5. Navigation guard redirects to app
```

#### Logout Flow
```typescript
// Component calls logout
const logout = useUserStore((state) => state.logout);
logout();

// Store updates:
// 1. set() called with null values
// 2. AsyncStorage cleared
// 3. All components re-render
// 4. app/_layout.tsx sees isAuthenticated = false
// 5. Navigation guard redirects to login
```

### Usage Examples

**Get Single Value:**
```typescript
const isAuthenticated = useUserStore((state) => state.isAuthenticated);
```

**Get Multiple Values:**
```typescript
const { currentUser, isAuthenticated } = useUserStore((state) => ({
  currentUser: state.currentUser,
  isAuthenticated: state.isAuthenticated,
}));
```

**Get Action Only (No Re-Render):**
```typescript
const login = useUserStore((state) => state.login);
// This component won't re-render when currentUser changes
```

**Get Entire Store (Not Recommended):**
```typescript
const userStore = useUserStore();
// Re-renders on ANY state change - inefficient
```

---

## Store 2: Learning Store

**File:** [src/stores/learningStore.ts](../src/stores/learningStore.ts)

### State Structure
```typescript
interface LearningState {
  // DATA
  currentCourse: Course | null;
  progress: LearningProgress | null;
  completedContent: string[];

  // ACTIONS
  setCourse: (course: Course) => void;
  updateProgress: (contentType: string, score: number) => void;
  getCompletionRate: () => number;
  resetLearning: () => void;
}
```

### Progress Metrics
```typescript
interface LearningProgress {
  progressId: string;
  userId: string;
  courseId: string;
  currentLevel: Level;

  // COMPLETION METRICS
  completedAlphabets: number;    // Out of 76 total
  completedVocabulary: number;   // Out of 500 total
  completedSentences: number;    // Out of 100 total
  completedArticles: number;     // Out of 20 total

  // ACHIEVEMENT METRICS
  totalScore: number;
  totalStudyTime: number;        // Minutes
  streakDays: number;

  lastUpdated: Date;
}
```

### Key Actions

#### Set Course
```typescript
setCourse: (course: Course) => {
  set({ currentCourse: course });

  // Initialize progress if doesn't exist
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
      totalStudyTime: 1200,  // 20 hours
      streakDays: 7,
      lastUpdated: new Date(),
    };
    set({ progress: newProgress });
  }
},
```

#### Update Progress
```typescript
updateProgress: (contentType: string, score: number) => {
  const progress = get().progress;
  if (!progress) return;

  const updatedProgress = { ...progress };

  // Increment specific metric
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

#### Get Completion Rate
```typescript
getCompletionRate: () => {
  const progress = get().progress;
  if (!progress) return 0;

  // Total possible items: 76 + 500 + 100 + 20 = 696
  const total = 76 + 500 + 100 + 20;

  const completed =
    progress.completedAlphabets +
    progress.completedVocabulary +
    progress.completedSentences +
    progress.completedArticles;

  return (completed / total) * 100;
},
```

### Usage in Profile Screen
```typescript
// app/(tabs)/profile.tsx
const { progress, getCompletionRate } = useLearningStore();

// Display metrics
<Text>{progress?.completedVocabulary} / 500 words</Text>
<Text>{progress?.streakDays} day streak</Text>
<Text>{getCompletionRate()}% complete</Text>
```

---

## Store 3: Language Store

**File:** [src/stores/languageStore.ts](../src/stores/languageStore.ts)

### State Structure
```typescript
interface LanguageState {
  currentLanguage: 'zh' | 'en';
  changeLanguage: (lang: 'zh' | 'en') => void;
}
```

### Full Implementation
```typescript
export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      currentLanguage: 'zh',  // Default to Chinese

      changeLanguage: (lang: 'zh' | 'en') => {
        set({ currentLanguage: lang });  // Update store
        i18n.changeLanguage(lang);        // Update i18n
      },
    }),
    {
      name: 'language-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

### Initialization on App Start
```typescript
// src/i18n/index.ts
import * as Localization from 'expo-localization';

// Detect device language
const deviceLanguage = Localization.locale.startsWith('zh') ? 'zh' : 'en';

// Load saved preference from AsyncStorage (via Zustand persist)
const savedLanguage = useLanguageStore.getState().currentLanguage;

// Use saved preference, or fallback to device language
const initialLanguage = savedLanguage || deviceLanguage;

i18n.changeLanguage(initialLanguage);
```

### Usage in Components
```typescript
// src/components/common/LanguageSwitcher.tsx
const { currentLanguage, changeLanguage } = useLanguageStore();

const handleSwitch = () => {
  const newLang = currentLanguage === 'zh' ? 'en' : 'zh';
  changeLanguage(newLang);  // Updates both store AND i18n
};

return (
  <Pressable onPress={handleSwitch}>
    <Text>{currentLanguage === 'zh' ? '中文' : 'EN'}</Text>
  </Pressable>
);
```

---

## Persistence with AsyncStorage

### How It Works

**persist** middleware automatically saves state to AsyncStorage:

```typescript
persist(
  (set, get) => ({ /* store */ }),
  {
    name: 'user-storage',  // ← Key in AsyncStorage
    storage: createJSONStorage(() => AsyncStorage),
  }
)
```

**What Happens:**
1. **On `set()`**: State saved to AsyncStorage as JSON
2. **On app start**: State loaded from AsyncStorage
3. **On app close**: State remains in AsyncStorage

**AsyncStorage Keys Used:**
- `user-storage` - User authentication data
- `learning-storage` - Learning progress data
- `language-storage` - UI language preference

### Manual Access (If Needed)
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Read
const userData = await AsyncStorage.getItem('user-storage');
const user = JSON.parse(userData);

// Write
await AsyncStorage.setItem('user-storage', JSON.stringify(state));

// Clear
await AsyncStorage.removeItem('user-storage');
```

---

## Advanced Zustand Patterns

### Pattern 1: Selectors for Performance

**Problem:** Re-render on every state change
```typescript
// ❌ BAD: Re-renders when ANY user state changes
const userStore = useUserStore();
```

**Solution:** Select only what you need
```typescript
// ✅ GOOD: Only re-renders when displayName changes
const displayName = useUserStore((state) => state.currentUser?.displayName);
```

**With Multiple Values:**
```typescript
// ✅ GOOD: Only re-renders when these specific values change
const { email, displayName } = useUserStore((state) => ({
  email: state.currentUser?.email,
  displayName: state.currentUser?.displayName,
}));
```

---

### Pattern 2: Derived State

**Store Computed Values:**
```typescript
const useStore = create((set, get) => ({
  count: 0,
  increment: () => set({ count: get().count + 1 }),

  // DERIVED: Computed on access
  isEven: () => get().count % 2 === 0,
}));

// Usage
const isEven = useStore((state) => state.isEven());
```

**In Learning Store:**
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

### Pattern 3: Immer for Immutable Updates

**Without Immer (Manual Copy):**
```typescript
updateProgress: () => {
  const progress = get().progress;
  const updated = { ...progress };  // Manual spread
  updated.completedAlphabets += 1;
  set({ progress: updated });
},
```

**With Immer (Cleaner):**
```typescript
import { immer } from 'zustand/middleware/immer';

const useStore = create<State>()(
  immer((set) => ({
    progress: null,

    updateProgress: () => set((state) => {
      state.progress.completedAlphabets += 1;  // Direct mutation (safe)
    }),
  }))
);
```

**Not currently used in project, but available if needed.**

---

### Pattern 4: Middleware Composition

**Stack Multiple Middlewares:**
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

**Order Matters:**
- Outer → Inner during creation
- Inner → Outer during execution

---

## Zustand vs Other Solutions

### Zustand vs Redux

**Redux (Old Way):**
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

**Zustand (New Way):**
```typescript
// 1. Create store
const useStore = create((set, get) => ({
  count: 0,
  increment: () => set({ count: get().count + 1 }),
}));

// 2. Use in component
const { count, increment } = useStore();
```

**Lines of Code:** Redux ~30, Zustand ~5

---

### Zustand vs Context API

**Context API:**
```typescript
// 1. Create context
const UserContext = React.createContext();

// 2. Provider component
function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

// 3. Wrap app
<UserProvider><App /></UserProvider>

// 4. Use in component
const { user } = useContext(UserContext);
```

**Problems:**
- Requires provider wrapper
- All consumers re-render on any context change
- No persistence built-in

**Zustand Advantages:**
- No provider needed
- Selective subscriptions (only re-render on selected changes)
- Easy persistence
- Better DevTools

---

### Zustand vs useState

**useState (Component-Level):**
```typescript
function Counter() {
  const [count, setCount] = useState(0);  // ← Lost on unmount

  return <Text>{count}</Text>;
}
```

**Zustand (Global):**
```typescript
const useCountStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));

function Counter() {
  const count = useCountStore((state) => state.count);  // ← Persists

  return <Text>{count}</Text>;
}
```

**Use useState When:**
- State only used in one component
- State doesn't need to persist
- UI-only state (like "is modal open")

**Use Zustand When:**
- State shared across components
- State needs to persist across sessions
- Application data (user, progress, settings)

---

## Testing Zustand Stores

### Unit Testing Actions
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

### Reset Store Between Tests
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

## Common Patterns in This Project

### Pattern 1: Auth Guard with Zustand
```typescript
// app/_layout.tsx
const { isAuthenticated } = useUserStore();  // ← Subscribe

useEffect(() => {
  if (!isAuthenticated) {
    router.replace('/(auth)/login');  // ← React to changes
  }
}, [isAuthenticated]);
```

### Pattern 2: Action-Only Subscription
```typescript
// Login screen only calls actions, doesn't need state
const login = useUserStore((state) => state.login);

// This component won't re-render when user state changes
// (Because it's not subscribed to state, only action)
```

### Pattern 3: Multi-Store Composition
```typescript
// Profile screen uses 3 stores
const { currentUser } = useUserStore();
const { progress } = useLearningStore();
const { currentLanguage } = useLanguageStore();

// Each subscription is independent
// Component only re-renders when selected values change
```

---

## Debugging Zustand

### View Current State
```typescript
// In any component or console
console.log(useUserStore.getState());
console.log(useLearningStore.getState());
console.log(useLanguageStore.getState());
```

### Subscribe to Changes (Debugging)
```typescript
useUserStore.subscribe(
  (state) => console.log('State changed:', state)
);
```

### Check AsyncStorage
```bash
# React Native Debugger or Flipper
# View AsyncStorage → user-storage, learning-storage, language-storage
```

---

## Best Practices

### ✅ DO
- Use selective subscriptions: `useStore((state) => state.value)`
- Keep actions simple and focused
- Use TypeScript interfaces for state
- Persist important data with `persist` middleware
- Split large stores into multiple smaller ones

### ❌ DON'T
- Subscribe to entire store: `useStore()`
- Mutate state directly: `state.count++`
- Store derived data (compute on access instead)
- Put React components in store
- Mix UI state with application state

---

## Future Enhancements

### Ideas for Expansion

1. **Add Immer Middleware**
   ```typescript
   import { immer } from 'zustand/middleware/immer';
   // Easier nested state updates
   ```

2. **Add DevTools**
   ```typescript
   import { devtools } from 'zustand/middleware';
   // Redux DevTools integration
   ```

3. **Add Subscriptions Middleware**
   ```typescript
   import { subscribeWithSelector } from 'zustand/middleware';
   // More granular subscriptions
   ```

4. **Split Learning Store**
   ```typescript
   // Separate stores for different concerns
   useCourseStore()
   useProgressStore()
   useAchievementStore()
   ```

---

## Summary

**Why Zustand:**
- Minimal boilerplate (~5 lines to create store)
- No providers needed
- Built-in persistence
- TypeScript-first
- Selective subscriptions (performance)

**3 Stores in App:**
1. **userStore** - Auth and profile
2. **learningStore** - Progress tracking
3. **languageStore** - UI language

**Key Pattern:**
```typescript
// Create once
const useStore = create(persist((set, get) => ({
  state: value,
  action: () => set({ state: newValue }),
}), { name: 'storage-key' }));

// Use anywhere
const { state, action } = useStore();
```

**Simple, powerful, and perfect for React Native apps!**
