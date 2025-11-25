# Project Routing & Navigation Flow

## Complete Route Map

This document explains every route in the Thai Learning App and how users navigate between them.

---

## Visual Navigation Flow

```
App Start
    ↓
┌─────────────────────────────────────┐
│   Root Layout (app/_layout.tsx)    │
│   - Font loading                    │
│   - Auth guard                      │
└─────────────────────────────────────┘
    ↓
    ├── Not Authenticated → /(auth)/login
    └── Authenticated → /(tabs)/index
```

---

## Route Structure

```
app/
├── _layout.tsx                    [Root Layout]
│
├── (auth)/                        [Auth Group - Public Routes]
│   ├── _layout.tsx               [Auth Layout]
│   ├── login.tsx                 [Login Screen]
│   └── register.tsx              [Register Screen]
│
├── (tabs)/                        [Tabs Group - Protected Routes]
│   ├── _layout.tsx               [Custom Tab Bar]
│   ├── index.tsx                 [Home Screen]
│   ├── courses.tsx               [Courses Screen]
│   └── profile.tsx               [Profile Screen]
│
├── review-modal.tsx               [Review Modal]
│
├── admin/                         [Admin Routes - Empty]
│
└── learning/                      [Learning Routes - Empty]
```

---

## Detailed Route Analysis

### 1. Root Layout (`app/_layout.tsx`)

**File Location:** [app/_layout.tsx](../app/_layout.tsx)

**Purpose:**
- Application entry point
- Global navigation container
- Authentication guard
- Font loading management

**Key Code:**
```typescript
export default function RootLayout() {
  const segments = useSegments(); // Current route path
  const router = useRouter();
  const { isAuthenticated } = useUserStore(); // Auth state

  // AUTH GUARD LOGIC
  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';

    // Not logged in + Not on auth screen → Go to login
    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    }
    // Logged in + On auth screen → Go to app
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

**Navigation Decisions:**
- `segments[0]` tells us which route group user is in
- Auth state from Zustand triggers automatic redirects
- Uses `replace()` not `push()` to prevent back navigation to wrong screens

---

### 2. Auth Layout (`app/(auth)/_layout.tsx`)

**File Location:** [app/(auth)/_layout.tsx](../app/(auth)/_layout.tsx)

**Purpose:**
- Layout for unauthenticated screens
- Auto-redirect if user logs in while on login screen

**Route Group Name:** `(auth)`
- Routes inside: `/login`, `/register`
- URL stays clean (no `/auth/` prefix)

**Key Code:**
```typescript
export default function AuthLayout() {
  const { isAuthenticated } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)'); // Redirect to app
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

**Why This Exists:**
If user clicks "Login" button, store updates → This layout detects change → Redirects immediately

---

### 3. Login Screen (`app/(auth)/login.tsx`)

**File Location:** [app/(auth)/login.tsx](../app/(auth)/login.tsx)

**Route:** `/(auth)/login`

**Purpose:** User authentication

**Navigation Actions:**
```typescript
// 1. Navigate to Register
router.push('/(auth)/register');

// 2. After successful login (handled by auth guard)
await userStore.login(email, password);
// → Root layout detects isAuthenticated = true
// → Auto-redirects to /(tabs)
```

**Components Used:**
- `ThaiPatternBackground` - Decorative SVG
- `LanguageSwitcher` (compact) - Language toggle
- `Button` - Primary CTA

**Flow:**
1. User enters email + password
2. Click "登录" button
3. `userStore.login()` called
4. Store updates `isAuthenticated = true`
5. Root layout's auth guard triggers
6. User redirected to `/(tabs)` (home)

---

### 4. Register Screen (`app/(auth)/register.tsx`)

**File Location:** [app/(auth)/register.tsx](../app/(auth)/register.tsx)

**Route:** `/(auth)/register`

**Purpose:** New user registration

**Navigation Actions:**
```typescript
// Navigate back to login
router.back(); // or router.push('/(auth)/login')
```

**Status:** Backend integration pending (form UI complete)

---

### 5. Tabs Layout (`app/(tabs)/_layout.tsx`)

**File Location:** [app/(tabs)/_layout.tsx](../app/(tabs)/_layout.tsx)

**Purpose:**
- Custom tab bar with 3 tabs
- Protruding center home button
- iOS blur effect

**Route Group Name:** `(tabs)`
- Routes inside: `/`, `/courses`, `/profile`
- Protected by root auth guard

**Tab Configuration:**
```typescript
function CustomTabBar({ state, navigation }) {
  return (
    <View>
      {/* Left Tab: Courses */}
      <TabButton
        icon={BookOpen}
        label="学习"
        isActive={state.index === 1}
        onPress={() => navigation.navigate('courses')}
      />

      {/* Center Tab: Home (Protruding) */}
      <Pressable onPress={() => navigation.navigate('index')}>
        <Home size={26} />
      </Pressable>

      {/* Right Tab: Profile */}
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

**Design Details:**
- Center button positioned absolutely with `bottom: 24`
- BlurView on iOS for frosted glass effect
- Active tab indicated by darker color and bold icon

---

### 6. Home Screen (`app/(tabs)/index.tsx`)

**File Location:** [app/(tabs)/index.tsx](../app/(tabs)/index.tsx)

**Route:** `/(tabs)` or `/(tabs)/index`

**Purpose:**
- Main dashboard
- Learning progress overview
- Quick access to reviews

**Navigation Actions:**
```typescript
// Open review modal
const handleBubbleClick = () => {
  router.push('/review-modal');
  setTimeout(() => setReviews([]), 500); // Clear reviews
};
```

**Components Used:**
- `ThaiPatternBackground` - Background decoration
- `FloatingBubbles` - Review cards stack
- Custom stats cards (streak, study time)
- Achievement list

**Data Flow:**
1. Mock reviews loaded after 800ms delay
2. FloatingBubbles shows 3-card stack
3. User clicks → Navigate to review modal
4. Reviews cleared after navigation

---

### 7. Courses Screen (`app/(tabs)/courses.tsx`)

**File Location:** [app/(tabs)/courses.tsx](../app/(tabs)/courses.tsx)

**Route:** `/(tabs)/courses`

**Purpose:** Course library (placeholder)

**Status:** Coming Soon screen (implementation pending)

**Navigation Actions:** None currently

---

### 8. Profile Screen (`app/(tabs)/profile.tsx`)

**File Location:** [app/(tabs)/profile.tsx](../app/(tabs)/profile.tsx)

**Route:** `/(tabs)/profile`

**Purpose:**
- User profile information
- Learning statistics
- Achievement badges
- Settings (language, TTS)
- Logout

**Navigation Actions:**
```typescript
// Logout
const handleLogout = () => {
  userStore.logout();
  // → Root layout detects isAuthenticated = false
  // → Auto-redirects to /(auth)/login
};
```

**Components Used:**
- `LanguageSwitcher` (full) - Language selector
- Profile stats from `userStore` and `learningStore`
- Achievement badges (mock data)

**Data Sources:**
- `useUserStore()` → User info
- `useLearningStore()` → Progress metrics

---

### 9. Review Modal (`app/review-modal.tsx`)

**File Location:** [app/review-modal.tsx](../app/review-modal.tsx)

**Route:** `/review-modal`

**Presentation:** Full-screen modal (slides from bottom)

**Purpose:** Flashcard review with spaced repetition

**Navigation Actions:**
```typescript
// Close modal
router.back(); // or router.dismiss()
```

**Features:**
- Card flip animation (front: Thai character, back: translation)
- 3 difficulty buttons: 模糊, 记得, 简单
- Progress indicator
- Completion screen when all cards reviewed

**Flow:**
1. User clicks floating bubbles on home
2. Modal opens with review cards
3. User reviews each card
4. Click difficulty button → Next card
5. All cards done → Completion screen
6. Close modal → Back to home

---

## Navigation Patterns Used

### Pattern 1: Auth Guard (Automatic Redirect)
**Location:** Root layout
**Trigger:** Auth state change
**Implementation:** `useEffect` watching `isAuthenticated`

```typescript
useEffect(() => {
  if (!isAuthenticated && !inAuthGroup) {
    router.replace('/(auth)/login'); // ← Automatic
  }
}, [isAuthenticated]);
```

### Pattern 2: Manual Navigation (User Action)
**Examples:**
```typescript
// Button click
<Pressable onPress={() => router.push('/profile')}>

// Link component
<Link href="/courses">Go to Courses</Link>

// Programmatic
router.push('/review-modal');
router.back();
router.replace('/(tabs)');
```

### Pattern 3: Modal Presentation
**Configuration in layout:**
```typescript
<Stack.Screen
  name="review-modal"
  options={{
    presentation: 'fullScreenModal', // ← Modal style
    animation: 'slide_from_bottom',
  }}
/>
```

---

## Route Protection Summary

### Public Routes (No Auth Required)
- `/(auth)/login`
- `/(auth)/register`

### Protected Routes (Auth Required)
- `/(tabs)/index` (Home)
- `/(tabs)/courses`
- `/(tabs)/profile`
- `/review-modal`

**Protection Mechanism:**
Root layout checks `isAuthenticated` before allowing access to `(tabs)` group.

---

## User Journey Examples

### Journey 1: First-Time User
```
1. App opens → Root layout
2. isAuthenticated = false → Redirect to /login
3. User enters credentials → Click login
4. userStore.login() → isAuthenticated = true
5. Root layout detects change → Redirect to /(tabs)
6. User sees home screen
```

### Journey 2: Returning User (Already Logged In)
```
1. App opens → Root layout
2. AsyncStorage loads → isAuthenticated = true (from previous session)
3. Root layout → Redirect to /(tabs)
4. User sees home screen immediately
```

### Journey 3: Start Review Session
```
1. User on home screen
2. Sees floating bubbles with review count
3. Clicks bubbles → router.push('/review-modal')
4. Modal slides up
5. User reviews cards
6. Clicks X or "完成" → router.back()
7. Back to home screen
```

### Journey 4: Logout
```
1. User on profile screen
2. Clicks "退出登录"
3. userStore.logout() → isAuthenticated = false
4. Root layout detects change → Redirect to /login
5. User back at login screen
```

---

## Navigation State Management

### Router Hook Usage
```typescript
import { useRouter, useSegments, useLocalSearchParams } from 'expo-router';

const router = useRouter();        // Navigate between screens
const segments = useSegments();    // Current route path
const params = useLocalSearchParams(); // URL parameters
```

### Common Router Methods

| Method | Purpose | Example |
|--------|---------|---------|
| `push()` | Navigate forward | `router.push('/profile')` |
| `replace()` | Replace current screen | `router.replace('/login')` |
| `back()` | Go to previous screen | `router.back()` |
| `dismiss()` | Close modal | `router.dismiss()` |

---

## File Naming Conventions

| File Name | Purpose |
|-----------|---------|
| `index.tsx` | Default route for directory |
| `_layout.tsx` | Layout wrapper for siblings |
| `(groupName)/` | Route group (no URL impact) |
| `[id].tsx` | Dynamic route parameter |
| `modal.tsx` | Regular screen (can be modal via options) |

---

## Next Steps (Pending Routes)

### To Be Implemented
1. **`app/learning/`** - Learning module routes
   - Alphabet lessons
   - Vocabulary practice
   - Sentence building

2. **`app/admin/`** - Admin panel
   - User management
   - Content creation
   - Analytics

3. **Dynamic Routes**
   - `app/course/[id].tsx` - Individual course view
   - `app/lesson/[lessonId].tsx` - Lesson detail

---

## Debugging Navigation

### Common Issues

**Issue:** Redirect loop
**Solution:** Check auth guard logic, ensure `replace()` not `push()`

**Issue:** Can't navigate to route
**Solution:** Verify file exists in `app/`, check layout includes screen

**Issue:** Params not received
**Solution:** Use `useLocalSearchParams()` hook correctly

### Testing Routes
```bash
# View all routes
npx expo start
# Press Shift + M in terminal to see route tree
```

---

## Summary

The app uses a **3-level navigation hierarchy**:

1. **Root Layout** - Auth guard and route groups
2. **Group Layouts** - Auth screens vs App screens
3. **Screen Components** - Individual pages

**Key Principle:** Let Zustand state (auth) drive navigation automatically, rather than manual redirects everywhere.
