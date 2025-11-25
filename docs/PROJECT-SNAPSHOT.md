# Thai Learning App - Project Snapshot

**Purpose:** This document allows AI assistants to understand the complete project state without reading source files.

**Last Updated:** 2025-11-23
**Version:** 1.0.0
**Progress:** 30% MVP Complete

---

## 🎯 Quick Project Summary

**Type:** React Native mobile app for learning Thai language
**Framework:** Expo 52 + React Native 0.76.9
**Routing:** Expo Router v4 (file-based)
**State:** Zustand 5.0.8 + AsyncStorage
**Language:** TypeScript (strict mode)
**UI:** Custom design system (Paper & Ink theme)
**i18n:** Chinese/English with i18next

---

## 📁 Complete File Structure with Content Summary

```
ThaiLearningApp/
│
├── app/                                    # Routes (Expo Router)
│   ├── _layout.tsx                        # Root layout, auth guard, font loading
│   │   └── Logic: Check isAuthenticated → redirect to /(auth)/login or /(tabs)/
│   │
│   ├── (auth)/                            # Public routes
│   │   ├── _layout.tsx                   # Redirect to /(tabs)/ if authenticated
│   │   ├── login.tsx                     # Email/password form, mock login
│   │   │   └── Imports: userStore, ThaiPatternBackground, LanguageSwitcher
│   │   └── register.tsx                  # Registration form (backend pending)
│   │
│   ├── (tabs)/                            # Protected routes (require auth)
│   │   ├── _layout.tsx                   # Custom tab bar: 3 tabs + protruding center button
│   │   │   └── Components: CustomTabBar (BlurView on iOS)
│   │   ├── index.tsx                     # Home screen: stats, FloatingBubbles, achievements
│   │   │   └── Imports: FloatingBubbles, ThaiPatternBackground
│   │   ├── courses.tsx                   # "Coming Soon" placeholder
│   │   └── profile.tsx                   # User profile, stats, settings, logout
│   │       └── Imports: userStore, learningStore, languageStore, LanguageSwitcher
│   │
│   ├── admin/                             # Empty (future)
│   ├── learning/                          # Empty (future)
│   └── review-modal.tsx                   # Flashcard review (full-screen modal)
│       └── Features: Card flip, 3 difficulty buttons, progress
│
├── src/
│   ├── components/common/
│   │   ├── ThaiPatternBackground.tsx     # SVG elephant pattern, configurable opacity
│   │   ├── FloatingBubbles.tsx           # 3-card stack for reviews, badge count
│   │   ├── LanguageSwitcher.tsx          # compact/full variants, updates languageStore
│   │   ├── Button.tsx                     # Generic button, primary/secondary variants
│   │   ├── Card.tsx                       # Basic card wrapper
│   │   └── GlassCard.tsx                  # Glass-morphism card with blur
│   │
│   ├── constants/
│   │   ├── colors.ts                      # Paper, Ink, Thai Gold, Sand, Taupe, White
│   │   └── typography.ts                  # 3 font families, 6 sizes, 3 weights
│   │
│   ├── stores/                            # Zustand stores (all persisted to AsyncStorage)
│   │   ├── userStore.ts                   # currentUser, isAuthenticated, authToken
│   │   │   └── Actions: login (mock), logout, setUser, checkAuth
│   │   ├── learningStore.ts               # currentCourse, progress, completedContent
│   │   │   └── Actions: setCourse, updateProgress, getCompletionRate, resetLearning
│   │   └── languageStore.ts               # currentLanguage ('zh' | 'en')
│   │       └── Actions: changeLanguage (updates i18n too)
│   │
│   ├── types/entities.ts                  # DUPLICATE (should delete)
│   ├── entities/types/entities.ts         # PRIMARY: User, Course, LearningProgress, Level, ReviewItem
│   │
│   ├── i18n/
│   │   ├── index.ts                       # i18next config, device language detection
│   │   └── locales/
│   │       ├── zh.ts                      # Chinese translations (~30 keys)
│   │       └── en.ts                      # English translations (~30 keys)
│   │
│   ├── services/                          # Empty (future API integration)
│   ├── hooks/                             # Empty (future custom hooks)
│   └── utils/                             # Empty (future utilities)
│
├── assets/                                # Images, fonts, splash
├── docs/                                  # Documentation (7 MD files)
├── app.json                               # Expo config
├── package.json                           # Dependencies
├── tsconfig.json                          # TS config, path alias @/*
├── babel.config.js                        # Path resolver plugin
└── global.css                             # Global styles
```

---

## 🏗️ Architecture Patterns

### Routing Pattern
```typescript
// Root layout auth guard pattern
useEffect(() => {
  const inAuthGroup = segments[0] === '(auth)';
  if (!isAuthenticated && !inAuthGroup) {
    router.replace('/(auth)/login');  // Not logged in → login
  } else if (isAuthenticated && inAuthGroup) {
    router.replace('/(tabs)');        // Logged in → app
  }
}, [isAuthenticated, segments]);
```

### State Management Pattern
```typescript
// All stores follow this pattern
export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // STATE
      currentUser: null,
      isAuthenticated: false,

      // ACTIONS
      login: async (email, password) => {
        // Mock for now
        set({ currentUser: mockUser, isAuthenticated: true });
      },
    }),
    {
      name: 'user-storage',  // AsyncStorage key
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

### Component Pattern (Props vs State)
```typescript
// Prop-based (no state)
export const FloatingBubbles: React.FC<Props> = ({ reviews, onOpenReview }) => {
  return <Pressable onPress={onOpenReview}>{/* UI */}</Pressable>;
};

// State-based (Zustand)
export default function ProfileScreen() {
  const { currentUser } = useUserStore();  // Global state
  const [localState, setLocalState] = useState();  // Local UI state
  return <View />;
}
```

---

## 📦 Complete Type Definitions

```typescript
// src/entities/types/entities.ts

enum UserRole {
  LEARNER = 'LEARNER',
  ADMIN = 'ADMIN'
}

enum Level {
  BEGINNER_A = 'BEGINNER_A',
  BEGINNER_B = 'BEGINNER_B',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED'
}

interface User {
  userId: string;
  email: string;
  password: string;
  displayName: string;
  role: UserRole;
  registrationDate: Date;
  lastLoginDate: Date;
}

interface Course {
  courseId: string;
  courseName: string;
  description: string;
  level: Level;
  isActive: boolean;
}

interface LearningProgress {
  progressId: string;
  userId: string;
  courseId: string;
  currentLevel: Level;
  completedAlphabets: number;     // 0-76
  completedVocabulary: number;    // 0-500
  completedSentences: number;     // 0-100
  completedArticles: number;      // 0-20
  totalScore: number;
  totalStudyTime: number;         // minutes
  streakDays: number;
  lastUpdated: Date;
}

interface ReviewItem {
  id: string;
  char: string;           // Thai character
  phonetic: string;       // Romanization
  meaning?: string;       // Translation
  type: 'Review' | 'Hard' | 'New';
  dueIn?: string;
}
```

---

## 🎨 Design System Tokens

```typescript
// src/constants/colors.ts
export const Colors = {
  paper: '#FAF9F6',        // Background
  ink: '#1A1A1A',          // Primary text
  sand: '#E5E2DB',         // Borders
  taupe: '#8E8B82',        // Secondary text
  thaiGold: '#D4AF37',     // Accents
  accent: '#B8956A',       // Secondary accent
  white: '#FFFFFF',
  glassWhite: 'rgba(255, 255, 255, 0.85)',
  error: '#DC2626'
};

// src/constants/typography.ts
export const Typography = {
  // Fonts
  playfairRegular: 'PlayfairDisplay_400Regular',   // English headings
  playfairBold: 'PlayfairDisplay_700Bold',
  notoSerifRegular: 'NotoSerifSC_400Regular',      // Chinese
  notoSerifBold: 'NotoSerifSC_700Bold',
  sarabunRegular: 'Sarabun_400Regular',            // Thai
  sarabunBold: 'Sarabun_700Bold',

  // Sizes
  h1: 32, h2: 24, h3: 20,
  body: 16, caption: 14, small: 12,

  // Weights
  regular: '400', semibold: '600', bold: '700'
};
```

---

## 🔧 Code Style & Conventions

### File Organization
```typescript
// 1. Imports (grouped: React → RN → Third-party → Internal)
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/src/stores/userStore';
import { Colors } from '@/src/constants/colors';

// 2. Types/Interfaces
interface Props {
  title: string;
}

// 3. Component
export default function Component({ title }: Props) {
  return <View />;
}

// 4. Styles
const styles = StyleSheet.create({});
```

### Naming Conventions
- **Components:** PascalCase (`FloatingBubbles.tsx`)
- **Files:** camelCase for utils, PascalCase for components
- **Variables:** camelCase (`currentUser`, `isAuthenticated`)
- **Constants:** UPPER_CASE for true constants, PascalCase for objects (`Colors`, `Typography`)
- **Types:** PascalCase (`User`, `Course`)
- **Store hooks:** `useXxxStore` (`useUserStore`)

### TypeScript Rules
```typescript
// ✅ Always type props
interface Props { title: string; }
export const Component: React.FC<Props> = ({ title }) => {};

// ✅ Type store state
interface UserState { currentUser: User | null; }

// ✅ Avoid 'any'
const data: ReviewItem[] = [];  // Not: const data: any = [];

// ✅ Optional props with ?
interface Props { onPress?: () => void; }
```

### Styling Patterns
```typescript
// ✅ Use StyleSheet.create
const styles = StyleSheet.create({
  container: {
    padding: 24,                    // Multiples of 8
    backgroundColor: Colors.paper,  // From constants
    borderRadius: 24,               // Soft corners (24, 16, 12, 8)
  }
});

// ✅ Responsive safe areas
import { SafeAreaView } from 'react-native-safe-area-context';
<SafeAreaView edges={['top']}>{/* Content */}</SafeAreaView>

// ✅ Platform-specific code
Platform.OS === 'ios' && <BlurView />
```

---

## 🔄 Data Flow Examples

### Login Flow
```
1. User enters email + password
2. LoginScreen: await userStore.login(email, password)
3. userStore: set({ isAuthenticated: true, currentUser: {...} })
4. AsyncStorage: Saves state automatically (persist middleware)
5. Root layout: useEffect detects isAuthenticated = true
6. Root layout: router.replace('/(tabs)')
7. Home screen: Reads currentUser from userStore
```

### Language Change Flow
```
1. LanguageSwitcher: changeLanguage('en')
2. languageStore: set({ currentLanguage: 'en' })
3. languageStore: i18n.changeLanguage('en')
4. AsyncStorage: Saves preference
5. All screens using useTranslation(): Re-render
6. Text updates: "登录" → "Login"
```

### Review Session Flow (Current)
```
1. Home screen: Shows FloatingBubbles with mock reviews
2. User clicks: router.push('/review-modal')
3. Modal opens: Shows flashcards
4. User reviews: Clicks difficulty buttons
5. Modal completion: router.back()
6. (Future) Progress update: learningStore.updateProgress('alphabet', 5)
```

---

## 🚦 Current Implementation Status

### ✅ Fully Implemented
- **Authentication UI**: Login, register screens (mock backend)
- **Auth guards**: Root layout redirects based on isAuthenticated
- **Tab navigation**: Custom 3-tab bar with protruding center button
- **Home screen**: Stats, FloatingBubbles, achievements list
- **Profile screen**: User info, learning stats, language switcher, logout
- **Review modal**: Flashcard UI, difficulty buttons
- **State persistence**: All 3 stores save to AsyncStorage
- **Multi-language**: Chinese/English with i18next
- **Design system**: Colors, typography, reusable components

### 🔄 Partially Implemented
- **Learning progress**: Structure exists, no real data/updates
- **Course system**: Types defined, no content loading
- **Review system**: UI complete, no spaced repetition algorithm

### ❌ Not Implemented
- **Real authentication**: Currently mock login
- **Backend API**: No services implemented
- **Course content**: No real courses/lessons
- **Audio/TTS**: UI exists (play buttons), no audio implementation
- **Admin panel**: Empty folder
- **Learning modules**: Empty folder
- **Offline support**: Only AsyncStorage, no full offline mode
- **Analytics**: No tracking
- **Social features**: No friends/leaderboard

---

## 🐛 Known Issues & Technical Debt

### Issue 1: Duplicate Type Definitions
**Files:** `src/types/entities.ts` + `src/entities/types/entities.ts`
**Action Needed:** Delete `src/types/entities.ts`, update imports to use `src/entities/types/entities.ts`

### Issue 2: Font Loading Disabled
**File:** `app/_layout.tsx:17-19`
**Reason:** Font files not found, useFonts returns empty object
**Current State:** Using system fonts, custom fonts not loaded
**Action Needed:** Add font files to assets or remove font imports

### Issue 3: Mock Authentication
**File:** `src/stores/userStore.ts:41-63`
**Current:** Hardcoded mock user, no real API call
**Action Needed:** Implement real API integration in `src/services/`

### Issue 4: Unused Register Function
**File:** `src/stores/userStore.ts:32-40`
**Issue:** `register` action exists but not exported in interface
**Action Needed:** Add to UserState interface or remove

### Issue 5: Inconsistent Tab Index
**File:** `app/(tabs)/_layout.tsx:72,99`
**Issue:** Tab indices hardcoded, fragile if file order changes
**Action Needed:** Use route names instead of indices

---

## 📚 Dependencies & Versions

### Core
```json
{
  "expo": "~52.0.38",
  "react": "18.3.1",
  "react-native": "0.76.9",
  "expo-router": "~4.0.20",
  "typescript": "^5.1.3"
}
```

### State & Storage
```json
{
  "zustand": "^5.0.8",
  "@react-native-async-storage/async-storage": "1.23.1"
}
```

### UI & Animation
```json
{
  "react-native-reanimated": "~3.16.1",
  "react-native-gesture-handler": "~2.20.2",
  "expo-blur": "~14.0.3",
  "lucide-react-native": "^0.554.0",
  "react-native-svg": "15.8.0"
}
```

### i18n
```json
{
  "i18next": "^25.6.3",
  "react-i18next": "^16.3.4",
  "expo-localization": "~15.0.3"
}
```

---

## 🎯 Next Development Priorities

### Phase 1: Backend Integration (High Priority)
1. Create API service layer in `src/services/`
2. Implement real authentication endpoints
3. Replace mock login with real API calls
4. Add JWT token handling and refresh

### Phase 2: Course Content (High Priority)
1. Design course data structure
2. Implement course listing screen
3. Add lesson detail screens
4. Create learning module components

### Phase 3: Learning Features (Medium Priority)
1. Implement spaced repetition algorithm
2. Add real review scheduling
3. Implement progress tracking updates
4. Add achievement unlock logic

### Phase 4: Audio & Pronunciation (Medium Priority)
1. Integrate expo-av for audio playback
2. Add TTS for Thai words
3. Implement pronunciation recording
4. Add audio comparison feature

### Phase 5: Polish & Optimization (Low Priority)
1. Add loading states throughout
2. Implement error boundaries
3. Add animations with Reanimated
4. Optimize list rendering
5. Add offline mode

---

## 💡 Code Generation Guidelines

### When Adding New Features

**1. New Screen:**
- Create file in appropriate `app/` directory
- Use TypeScript interface for props
- Import from `@/` path alias
- Follow SafeAreaView + ScrollView pattern
- Use Colors and Typography constants
- Add to relevant \_layout.tsx if needed

**2. New Component:**
- Place in `src/components/common/`
- Export as named or default
- Type all props with interface
- Use StyleSheet.create
- Import only what's needed

**3. New Global State:**
- Create store in `src/stores/`
- Follow Zustand pattern with persist
- Export as `useXxxStore`
- Add TypeScript interface
- Include in PROJECT-SNAPSHOT.md

**4. New Route:**
- Add to `app/` folder (auto-routes)
- Update \_layout.tsx if grouping needed
- Document in PROJECT-SNAPSHOT.md

### Code Style Requirements

```typescript
// ✅ Always use TypeScript
export default function Screen(): JSX.Element {}

// ✅ Destructure props
export const Component: React.FC<Props> = ({ title, onPress }) => {};

// ✅ Use constants
backgroundColor: Colors.paper  // Not: '#FAF9F6'

// ✅ Type everything
const [value, setValue] = useState<string>('');

// ✅ Handle loading/error states
{loading ? <ActivityIndicator /> : <Content />}

// ✅ Use path aliases
import { useUserStore } from '@/src/stores/userStore';  // Not: '../../../'
```

---

## 📋 Component API Reference

### FloatingBubbles
```typescript
interface FloatingBubblesProps {
  reviews: ReviewItem[];       // Array of review items
  onOpenReview: () => void;    // Callback when clicked
}
// Usage: <FloatingBubbles reviews={data} onOpenReview={() => router.push('/review-modal')} />
```

### ThaiPatternBackground
```typescript
interface ThaiPatternBackgroundProps {
  opacity?: number;  // 0-1, default: 0.1
}
// Usage: <ThaiPatternBackground opacity={0.15} />
```

### LanguageSwitcher
```typescript
interface LanguageSwitcherProps {
  variant?: 'compact' | 'full';  // default: 'compact'
}
// compact: Globe icon + lang code
// full: Two-button selector
// Usage: <LanguageSwitcher variant="full" />
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

## 🔑 Store API Reference

### useUserStore
```typescript
// State
currentUser: User | null
isAuthenticated: boolean
authToken: string | null

// Actions
login(email: string, password: string): Promise<boolean>
logout(): void
setUser(user: User, token: string): void
checkAuth(): boolean

// Usage
const { currentUser, login, logout } = useUserStore();
await login('test@example.com', 'password');
```

### useLearningStore
```typescript
// State
currentCourse: Course | null
progress: LearningProgress | null
completedContent: string[]

// Actions
setCourse(course: Course): void
updateProgress(contentType: string, score: number): void
getCompletionRate(): number
resetLearning(): void

// Usage
const { progress, updateProgress } = useLearningStore();
updateProgress('vocabulary', 10);
```

### useLanguageStore
```typescript
// State
currentLanguage: 'zh' | 'en'

// Actions
changeLanguage(lang: 'zh' | 'en'): void

// Usage
const { currentLanguage, changeLanguage } = useLanguageStore();
changeLanguage('en');  // Updates Zustand + i18next
```

---

## 🎨 Common UI Patterns

### Screen Layout Pattern
```typescript
export default function Screen() {
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: Colors.paper }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}  // Account for tab bar
        showsVerticalScrollIndicator={false}
      >
        {/* Content */}
      </ScrollView>
    </SafeAreaView>
  );
}
```

### Card Pattern
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

### Stat Display Pattern
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

## 📝 i18n Translation Keys

### Structure
```typescript
// src/i18n/locales/zh.ts & en.ts
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

### Usage
```typescript
const { t } = useTranslation();
<Text>{t('auth.loginButton')}</Text>  // "登录" or "Login"
```

---

## 🚀 Quick Start for Development

### Adding a New Protected Screen
```bash
# 1. Create file
touch app/(tabs)/new-screen.tsx

# 2. Add to tab layout (if tab needed)
# Edit app/(tabs)/_layout.tsx

# 3. Implement component
# Use template from "Screen Layout Pattern" above

# 4. Update this document
# Add to "File Structure" and "Current Status"
```

### Adding Global State
```bash
# 1. Create store
touch src/stores/newStore.ts

# 2. Follow Zustand pattern
# Copy structure from userStore.ts

# 3. Export hook
# export const useNewStore = create(...)

# 4. Update this document
# Add to "Store API Reference"
```

### Adding a Component
```bash
# 1. Create file
touch src/components/common/NewComponent.tsx

# 2. Type props
interface NewComponentProps { ... }

# 3. Export component
export const NewComponent: React.FC<Props> = ({ ... }) => {}

# 4. Update this document
# Add to "Component API Reference"
```

---

## 🎯 Summary: What AI Needs to Know

**This project is:**
- React Native + Expo with TypeScript
- File-based routing (Expo Router v4)
- Zustand for state (3 stores, all persisted)
- Custom UI (no component library)
- 30% complete MVP

**Key files to reference:**
- Route structure: See "File Structure" section
- Types: See "Type Definitions" section
- Stores: See "Store API Reference" section
- Design: See "Design System Tokens" section

**When generating code:**
- Use TypeScript interfaces
- Follow "Code Style & Conventions"
- Import from `@/` path alias
- Use Colors/Typography constants
- Add SafeAreaView for screens
- Persist state if global (Zustand + persist)

**Current priorities:**
1. Backend API integration
2. Course content loading
3. Real authentication

**This document replaces:** Reading 40+ source files. Everything needed to understand and extend the project is here.

---

**Last Updated:** 2025-11-23
**Maintained By:** Auto-update when major changes occur
**Purpose:** Enable AI code generation without full codebase access
