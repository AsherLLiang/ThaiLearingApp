# Parameter Passing & Data Flow Guide

This document explains how data moves through the Thai Learning App - from user actions to state updates to UI rendering.

---

## Types of Data Flow

The app uses **3 main patterns** for passing data:

1. **Props** (Parent → Child components)
2. **State Hooks** (Global state via Zustand)
3. **URL Parameters** (Navigation with data)

---

## Pattern 1: Props (Component → Component)

### Example 1: FloatingBubbles Component

**Parent Component:** `app/(tabs)/index.tsx`
```typescript
export default function HomeScreen() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const router = useRouter();

  const handleBubbleClick = () => {
    router.push('/review-modal');
  };

  return (
    <FloatingBubbles
      reviews={reviews}              // ← PROP: Data
      onOpenReview={handleBubbleClick} // ← PROP: Callback function
    />
  );
}
```

**Child Component:** `src/components/common/FloatingBubbles.tsx`
```typescript
interface FloatingBubblesProps {
  reviews: ReviewItem[];          // ← RECEIVES: Array of review items
  onOpenReview: () => void;       // ← RECEIVES: Function to call on click
}

export const FloatingBubbles: React.FC<FloatingBubblesProps> = ({
  reviews,
  onOpenReview,
}) => {
  return (
    <Pressable onPress={onOpenReview}>  {/* ← USES: Callback */}
      <Text>{reviews.length}</Text>     {/* ← USES: Data */}
    </Pressable>
  );
};
```

**Data Flow:**
```
Home Screen (Parent)
    ↓ reviews={reviews}
FloatingBubbles (Child)
    ↓ User clicks
    ↓ onOpenReview() called
Home Screen (Parent)
    ↓ handleBubbleClick() executes
    ↓ router.push('/review-modal')
Navigation happens
```

---

### Example 2: ThaiPatternBackground Component

**Parent Component:** `app/(auth)/login.tsx`
```typescript
export default function LoginScreen() {
  return (
    <View>
      <ThaiPatternBackground opacity={0.15} />  {/* ← PROP: Number */}
    </View>
  );
}
```

**Child Component:** `src/components/common/ThaiPatternBackground.tsx`
```typescript
interface ThaiPatternBackgroundProps {
  opacity?: number;  // ← Optional prop with default
}

export const ThaiPatternBackground: React.FC<ThaiPatternBackgroundProps> = ({
  opacity = 0.1,  // ← Default value if not provided
}) => {
  return (
    <Svg style={{ opacity }}>  {/* ← USES: Prop value */}
      {/* SVG content */}
    </Svg>
  );
};
```

**Parameter Details:**
- **Type:** Number (0 to 1)
- **Purpose:** Control background visibility
- **Default:** 0.1 (very subtle)
- **Usage:** Login uses 0.15 (slightly more visible)

---

### Example 3: LanguageSwitcher Component

**Parent Component:** `app/(auth)/login.tsx`
```typescript
export default function LoginScreen() {
  return (
    <LanguageSwitcher variant="compact" />  {/* ← PROP: String literal */}
  );
}
```

**Parent Component:** `app/(tabs)/profile.tsx`
```typescript
export default function ProfileScreen() {
  return (
    <LanguageSwitcher variant="full" />  {/* ← PROP: Different variant */}
  );
}
```

**Child Component:** `src/components/common/LanguageSwitcher.tsx`
```typescript
interface LanguageSwitcherProps {
  variant?: 'compact' | 'full';  // ← Union type (only 2 options)
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'compact',  // ← Default
}) => {
  if (variant === 'compact') {
    return (/* Globe icon + language code */);
  }
  return (/* Two-option selector */);
};
```

**Prop Variants:**
- **compact**: Globe icon + "中文"/"EN" (for auth screens)
- **full**: Two buttons with flags (for profile screen)

---

## Pattern 2: State Hooks (Global State via Zustand)

### How Zustand Works

**Definition (Store Creation):**
```typescript
// src/stores/userStore.ts
export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // STATE
      currentUser: null,
      isAuthenticated: false,

      // ACTIONS
      login: async (email, password) => {
        const user = await authenticate(email, password);
        set({ currentUser: user, isAuthenticated: true });  // ← UPDATE STATE
      },

      logout: () => {
        set({ currentUser: null, isAuthenticated: false });  // ← UPDATE STATE
      },
    }),
    { name: 'user-storage' }  // ← PERSIST to AsyncStorage
  )
);
```

**Usage (Component Consumption):**
```typescript
// app/(auth)/login.tsx
import { useUserStore } from '@/src/stores/userStore';

export default function LoginScreen() {
  // ↓ SUBSCRIBE to specific parts of state
  const { login, isAuthenticated } = useUserStore();

  const handleLogin = async () => {
    await login(email, password);  // ← CALL ACTION
    // State updates automatically
    // All components using useUserStore re-render
  };
}
```

**Data Flow:**
```
User clicks "Login"
    ↓
login(email, password) called
    ↓
userStore.login() executes
    ↓
set({ isAuthenticated: true })
    ↓
AsyncStorage saves state
    ↓
ALL components using useUserStore() re-render
    ↓
app/_layout.tsx detects isAuthenticated = true
    ↓
router.replace('/(tabs)')
    ↓
Navigation happens
```

---

### Example: User State Flow

**1. Login Screen Updates State**
```typescript
// app/(auth)/login.tsx
const login = useUserStore((state) => state.login);

const handleLogin = async () => {
  const success = await login(email, password);
  // Don't need to manually redirect - auth guard handles it
};
```

**2. Root Layout Reacts to State Change**
```typescript
// app/_layout.tsx
const { isAuthenticated } = useUserStore();  // ← SUBSCRIBED

useEffect(() => {
  if (isAuthenticated) {
    router.replace('/(tabs)');  // ← AUTO REDIRECT
  }
}, [isAuthenticated]);  // ← TRIGGERS on state change
```

**3. Profile Screen Displays State**
```typescript
// app/(tabs)/profile.tsx
const { currentUser } = useUserStore();  // ← SUBSCRIBED

return (
  <Text>{currentUser?.displayName}</Text>  // ← RENDERS current value
);
```

**Key Point:** Multiple components react to the same state change automatically!

---

### Example: Learning Progress State Flow

**1. Update Progress (Future Implementation)**
```typescript
// app/learning/lesson.tsx (example)
const updateProgress = useLearningStore((state) => state.updateProgress);

const handleLessonComplete = () => {
  updateProgress('vocabulary', 10);  // ← UPDATE
};
```

**2. State Updated in Store**
```typescript
// src/stores/learningStore.ts
updateProgress: (contentType: string, score: number) => {
  const progress = get().progress;
  const updated = { ...progress };

  if (contentType === 'vocabulary') {
    updated.completedVocabulary += 1;  // ← INCREMENT
  }
  updated.totalScore += score;

  set({ progress: updated });  // ← SAVE
};
```

**3. Profile Screen Displays Updated Value**
```typescript
// app/(tabs)/profile.tsx
const { progress } = useLearningStore();  // ← AUTO RE-RENDERS

return (
  <Text>{progress?.completedVocabulary} words</Text>  // ← NEW VALUE
);
```

---

### Example: Language State Flow

**1. User Changes Language**
```typescript
// src/components/common/LanguageSwitcher.tsx
const changeLanguage = useLanguageStore((state) => state.changeLanguage);

const handleSwitch = () => {
  changeLanguage('en');  // ← TRIGGER CHANGE
};
```

**2. Store Updates i18n**
```typescript
// src/stores/languageStore.ts
changeLanguage: (lang: 'zh' | 'en') => {
  set({ currentLanguage: lang });  // ← UPDATE STATE
  i18n.changeLanguage(lang);       // ← UPDATE i18n
},
```

**3. All Screens Re-Render with New Language**
```typescript
// app/(auth)/login.tsx
const { t } = useTranslation();  // ← SUBSCRIBED to i18n

return (
  <Text>{t('auth.loginButton')}</Text>  // ← "登录" or "Login"
);
```

**Data Flow:**
```
LanguageSwitcher: changeLanguage('en')
    ↓
languageStore: set({ currentLanguage: 'en' })
    ↓
i18n.changeLanguage('en')
    ↓
ALL components using useTranslation() re-render
    ↓
Text changes from "登录" to "Login"
```

---

## Pattern 3: URL Parameters (Navigation with Data)

### Example 1: Search Parameters (Future Use)

**Navigate with Parameters:**
```typescript
// app/(tabs)/index.tsx
const router = useRouter();

const handleSearchCourse = () => {
  router.push('/courses?level=beginner&category=alphabet');
};
```

**Receive Parameters:**
```typescript
// app/courses.tsx
import { useLocalSearchParams } from 'expo-router';

export default function CoursesScreen() {
  const { level, category } = useLocalSearchParams();

  console.log(level);    // "beginner"
  console.log(category); // "alphabet"

  return <Text>Showing {level} courses in {category}</Text>;
}
```

**URL Generated:**
```
/courses?level=beginner&category=alphabet
```

---

### Example 2: Dynamic Route Parameters (Future Use)

**File Structure:**
```
app/
└── course/
    └── [id].tsx  ← Dynamic segment
```

**Navigate with Dynamic Parameter:**
```typescript
// app/(tabs)/courses.tsx
const router = useRouter();

const handleCourseClick = (courseId: string) => {
  router.push(`/course/${courseId}`);
};

// Usage
handleCourseClick('thai-101');  // → /course/thai-101
```

**Receive Dynamic Parameter:**
```typescript
// app/course/[id].tsx
import { useLocalSearchParams } from 'expo-router';

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams();

  console.log(id);  // "thai-101"

  // Fetch course data using ID
  const course = useCourseData(id);

  return <Text>{course.name}</Text>;
}
```

**URL Generated:**
```
/course/thai-101
```

---

### Example 3: Complex Parameters

**Navigate with Multiple Types:**
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

**Receive All Parameters:**
```typescript
// app/lesson/[lessonId].tsx
const { lessonId, section, mode } = useLocalSearchParams();

console.log(lessonId); // "42"
console.log(section);  // "vocabulary"
console.log(mode);     // "practice"
```

**URL Generated:**
```
/lesson/42?section=vocabulary&mode=practice
```

---

## Data Flow Patterns Comparison

### Pattern Comparison Table

| Pattern | Scope | Persistence | Re-renders | Use Case |
|---------|-------|-------------|------------|----------|
| **Props** | Parent → Child only | No | Child only | Component UI config |
| **Zustand State** | Global | Yes (AsyncStorage) | All subscribers | User auth, learning progress |
| **URL Params** | Navigation only | No (lost on app close) | Target screen only | Deep linking, search filters |

---

## Complete Data Flow Examples

### Example 1: Login Flow (All 3 Patterns)

```
1. USER ACTION
   User clicks "登录" button in LoginScreen

2. COMPONENT STATE (Local)
   const [email, setEmail] = useState('test@example.com');
   const [password, setPassword] = useState('password');

3. ZUSTAND ACTION CALLED
   await userStore.login(email, password);

4. STORE UPDATES
   set({ currentUser: {...}, isAuthenticated: true });
   AsyncStorage.setItem('user-storage', JSON.stringify(state));

5. ALL SUBSCRIBERS RE-RENDER
   - app/_layout.tsx receives isAuthenticated = true
   - app/(tabs)/profile.tsx receives currentUser = {...}

6. NAVIGATION TRIGGERED
   app/_layout.tsx: router.replace('/(tabs)');

7. NEW SCREEN LOADS
   app/(tabs)/index.tsx mounts

8. NEW SCREEN USES STATE
   const { currentUser } = useUserStore();
   <Text>ສະບາຍດີ, {currentUser?.displayName}</Text>
```

---

### Example 2: Review Session Flow

```
1. HOME SCREEN PASSES PROPS
   <FloatingBubbles
     reviews={mockReviews}
     onOpenReview={handleBubbleClick}
   />

2. USER CLICKS BUBBLE
   FloatingBubbles: onOpenReview() called

3. CALLBACK EXECUTES IN PARENT
   handleBubbleClick() {
     router.push('/review-modal');
     setReviews([]);
   }

4. NAVIGATION WITH IMPLICIT DATA
   Modal opens, reads reviews from future API/store

5. USER COMPLETES REVIEW
   Modal: updateProgress('alphabet', 5) called

6. ZUSTAND STORE UPDATES
   learningStore: completedAlphabets += 1

7. PROFILE SCREEN RE-RENDERS
   Shows updated alphabet count automatically

8. MODAL CLOSES
   router.back() → Returns to home
```

---

### Example 3: Language Change Flow

```
1. USER CLICKS LANGUAGE SWITCHER
   LanguageSwitcher: handleSwitch() called

2. ZUSTAND ACTION CALLED
   languageStore.changeLanguage('en')

3. STORE UPDATES TWO THINGS
   - Zustand state: set({ currentLanguage: 'en' })
   - i18n instance: i18n.changeLanguage('en')

4. ASYNCSTORAGE PERSISTENCE
   AsyncStorage.setItem('language-storage', '{"currentLanguage":"en"}')

5. ALL i18n SUBSCRIBERS RE-RENDER
   - LoginScreen: "登录" → "Login"
   - ProfileScreen: "我的成就" → "My Achievements"
   - TabBar: "学习" → "Learn"

6. NO NAVIGATION NEEDED
   UI updates in place
```

---

## Advanced Parameter Passing

### Callback Props (Functions as Props)

**Parent Passes Function:**
```typescript
// Parent
const handleComplete = (score: number) => {
  console.log('User scored:', score);
};

<LessonComponent onComplete={handleComplete} />
```

**Child Calls Function:**
```typescript
// Child
interface LessonProps {
  onComplete: (score: number) => void;
}

const LessonComponent: React.FC<LessonProps> = ({ onComplete }) => {
  const finishLesson = () => {
    const score = calculateScore();
    onComplete(score);  // ← CALL PARENT'S FUNCTION WITH DATA
  };
};
```

**Data flows upward:** Child → Parent

---

### Render Props Pattern

**Pass Component as Prop:**
```typescript
// Parent
<CardContainer
  renderHeader={() => <Text>Custom Header</Text>}
  renderContent={() => <Text>Custom Content</Text>}
/>
```

**Child Renders Prop:**
```typescript
// Child
interface CardProps {
  renderHeader: () => React.ReactNode;
  renderContent: () => React.ReactNode;
}

const CardContainer: React.FC<CardProps> = ({ renderHeader, renderContent }) => {
  return (
    <View>
      {renderHeader()}    {/* ← RENDER CUSTOM COMPONENT */}
      {renderContent()}
    </View>
  );
};
```

---

### Context Pattern (Not Used Yet, But Available)

**Alternative to Zustand for Component Trees:**
```typescript
// Create context
const ThemeContext = React.createContext(defaultTheme);

// Provider (high in tree)
<ThemeContext.Provider value={currentTheme}>
  <App />
</ThemeContext.Provider>

// Consumer (anywhere in tree)
const theme = useContext(ThemeContext);
```

**Why Not Used:** Zustand is simpler and more powerful for this app.

---

## Type Safety with Parameters

### Props Interface
```typescript
interface FloatingBubblesProps {
  reviews: ReviewItem[];          // ← TypeScript enforces array type
  onOpenReview: () => void;       // ← Must be function with no params
  maxCards?: number;              // ← Optional (? symbol)
}

// ✅ Valid
<FloatingBubbles reviews={mockReviews} onOpenReview={handleClick} />

// ❌ Invalid - TypeScript error
<FloatingBubbles reviews="not an array" onOpenReview={42} />
```

### Zustand State Typing
```typescript
interface UserState {
  currentUser: User | null;                               // ← Can be null
  isAuthenticated: boolean;                              // ← Must be boolean
  login: (email: string, password: string) => Promise<boolean>;  // ← Typed function
}

// ✅ Valid
const success = await login('test@mail.com', 'pass123');

// ❌ Invalid - TypeScript error
const success = await login(123, true);
```

### URL Params Typing
```typescript
// TypeScript infers types from useLocalSearchParams
const { id, level } = useLocalSearchParams();

// Both are string | string[] (could be single or array)
console.log(typeof id);  // "string" (usually)

// Type guard for safety
const courseId = Array.isArray(id) ? id[0] : id;
```

---

## Common Patterns in This Project

### Pattern 1: Component Receives Props, Doesn't Manage State
```typescript
// FloatingBubbles doesn't store reviews, just displays them
export const FloatingBubbles: React.FC<FloatingBubblesProps> = ({ reviews }) => {
  // No useState here - parent owns the data
  return <View>{reviews.map(...)}</View>;
};
```

**Philosophy:** "Dumb components" are easier to test and reuse.

---

### Pattern 2: Screen Manages Local State, Zustand for Global
```typescript
// Home screen
export default function HomeScreen() {
  // LOCAL state (UI only)
  const [reviews, setReviews] = useState<ReviewItem[]>([]);

  // GLOBAL state (shared across app)
  const { currentUser } = useUserStore();
  const { progress } = useLearningStore();
}
```

**Rule:** If only this screen needs it → useState. If multiple screens need it → Zustand.

---

### Pattern 3: Navigation Triggers State, State Triggers Navigation
```typescript
// Login screen triggers state change
await userStore.login(email, password);  // ← Action

// Root layout reacts to state change
useEffect(() => {
  if (isAuthenticated) {
    router.replace('/(tabs)');  // ← Navigation
  }
}, [isAuthenticated]);
```

**Two-way flow:** Actions cause state changes, state changes cause navigation.

---

## Debugging Data Flow

### Check Zustand State
```typescript
// Add temporary logging
const userStore = useUserStore();
console.log('Current state:', useUserStore.getState());
```

### Check Props Received
```typescript
export const FloatingBubbles: React.FC<FloatingBubblesProps> = (props) => {
  console.log('Props received:', props);  // ← Debug log
  // ...
};
```

### Check URL Parameters
```typescript
export default function Screen() {
  const params = useLocalSearchParams();
  console.log('URL params:', params);  // ← Debug log
}
```

---

## Best Practices

### ✅ DO
- Use props for component-specific UI configuration
- Use Zustand for global application state
- Use URL params for navigation context
- Type all props with interfaces
- Keep components pure (same props = same output)

### ❌ DON'T
- Pass entire store as prop (defeats purpose of global state)
- Store navigation state in Zustand (use router instead)
- Mutate props (they're read-only)
- Use props for deeply nested component trees (use Zustand instead)

---

## Summary

**3 Ways to Pass Data:**

1. **Props** (Parent → Child)
   - Explicit, type-safe
   - Good for component configuration
   - Example: `<FloatingBubbles reviews={data} />`

2. **Zustand Hooks** (Global State)
   - Automatic re-rendering
   - Persistent across app restarts
   - Example: `const { currentUser } = useUserStore()`

3. **URL Parameters** (Navigation)
   - Shareable URLs
   - Deep linking support
   - Example: `/course/123?section=vocab`

**Choose based on scope:** Local UI config → Props. Global app state → Zustand. Navigation context → URL params.
