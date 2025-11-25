# File Import & Dependency Map

This document shows how files in the project import and depend on each other.

---

## Import Relationship Diagram

```
Root
│
├── app/_layout.tsx
│   ├── expo-router (Stack, useRouter, useSegments)
│   ├── expo-font (useFonts)
│   ├── expo-splash-screen
│   ├── react-native-gesture-handler (GestureHandlerRootView)
│   ├── @/src/stores/userStore ← STATE
│   └── @/global.css
│
├── app/(auth)/_layout.tsx
│   ├── expo-router (Stack, useRouter)
│   └── @/src/stores/userStore ← STATE
│
├── app/(auth)/login.tsx
│   ├── expo-router (useRouter)
│   ├── @/src/stores/userStore ← STATE
│   ├── @/src/components/common/ThaiPatternBackground ← COMPONENT
│   ├── @/src/components/common/LanguageSwitcher ← COMPONENT
│   ├── @/src/components/common/Button ← COMPONENT
│   ├── @/src/constants/colors ← CONSTANTS
│   ├── @/src/constants/typography ← CONSTANTS
│   └── react-i18next (useTranslation) ← I18N
│
├── app/(tabs)/_layout.tsx
│   ├── expo-router (Tabs)
│   ├── expo-blur (BlurView)
│   ├── lucide-react-native (Home, BookOpen, User) ← ICONS
│   ├── react-native-safe-area-context (useSafeAreaInsets)
│   ├── @/src/constants/colors ← CONSTANTS
│   └── @/src/constants/typography ← CONSTANTS
│
├── app/(tabs)/index.tsx
│   ├── expo-router (useRouter)
│   ├── expo-blur (BlurView)
│   ├── lucide-react-native (Play, TrendingUp, Clock, Award, Star) ← ICONS
│   ├── @/src/components/common/ThaiPatternBackground ← COMPONENT
│   ├── @/src/components/common/FloatingBubbles ← COMPONENT
│   ├── @/src/constants/colors ← CONSTANTS
│   ├── @/src/constants/typography ← CONSTANTS
│   └── @/src/types/entities (ReviewItem) ← TYPE
│
├── app/(tabs)/profile.tsx
│   ├── @/src/stores/userStore ← STATE
│   ├── @/src/stores/learningStore ← STATE
│   ├── @/src/stores/languageStore ← STATE
│   ├── @/src/components/common/LanguageSwitcher ← COMPONENT
│   ├── @/src/constants/colors ← CONSTANTS
│   ├── @/src/constants/typography ← CONSTANTS
│   ├── lucide-react-native (Award, TrendingUp, Clock, Trophy, Settings, LogOut) ← ICONS
│   └── react-i18next (useTranslation) ← I18N
│
├── src/stores/userStore.ts
│   ├── zustand (create)
│   ├── zustand/middleware (persist, createJSONStorage)
│   └── @react-native-async-storage/async-storage ← PERSISTENCE
│
├── src/stores/learningStore.ts
│   ├── zustand (create)
│   ├── zustand/middleware (persist, createJSONStorage)
│   ├── @react-native-async-storage/async-storage ← PERSISTENCE
│   └── @/src/types/entities (Course, LearningProgress, Level) ← TYPES
│
├── src/stores/languageStore.ts
│   ├── zustand (create)
│   ├── zustand/middleware (persist, createJSONStorage)
│   ├── @react-native-async-storage/async-storage ← PERSISTENCE
│   └── @/src/i18n ← I18N
│
├── src/components/common/ThaiPatternBackground.tsx
│   ├── react-native-svg (Svg, Defs, Pattern, Rect, Path)
│   └── @/src/constants/colors ← CONSTANTS
│
├── src/components/common/FloatingBubbles.tsx
│   ├── @/src/types/entities (ReviewItem) ← TYPE
│   ├── @/src/constants/colors ← CONSTANTS
│   ├── @/src/constants/typography ← CONSTANTS
│   └── lucide-react-native (Play) ← ICON
│
├── src/components/common/LanguageSwitcher.tsx
│   ├── @/src/stores/languageStore ← STATE
│   ├── @/src/constants/colors ← CONSTANTS
│   ├── @/src/constants/typography ← CONSTANTS
│   ├── lucide-react-native (Globe) ← ICON
│   └── react-i18next (useTranslation) ← I18N
│
└── src/i18n/index.ts
    ├── i18next
    ├── react-i18next
    ├── expo-localization
    ├── @/src/i18n/locales/zh ← TRANSLATIONS
    └── @/src/i18n/locales/en ← TRANSLATIONS
```

---

## Import Layers (Dependency Hierarchy)

### Layer 1: Core Dependencies (No Internal Imports)
These files don't import anything from the project:

```
src/constants/colors.ts              ← Pure data
src/constants/typography.ts          ← Pure data
src/i18n/locales/zh.ts               ← Pure translations
src/i18n/locales/en.ts               ← Pure translations
src/entities/types/entities.ts       ← Pure types
```

### Layer 2: Infrastructure (Import Layer 1)
These files import only constants and types:

```
src/i18n/index.ts
├── imports: expo-localization
└── imports: locales/zh, locales/en

src/stores/userStore.ts
├── imports: zustand, AsyncStorage
└── (defines own types inline)

src/stores/learningStore.ts
├── imports: zustand, AsyncStorage
└── imports: src/types/entities

src/stores/languageStore.ts
├── imports: zustand, AsyncStorage
└── imports: src/i18n
```

### Layer 3: Components (Import Layer 1 + 2)
These files import constants, types, and stores:

```
src/components/common/ThaiPatternBackground.tsx
└── imports: src/constants/colors

src/components/common/FloatingBubbles.tsx
├── imports: src/constants/colors
├── imports: src/constants/typography
└── imports: src/types/entities

src/components/common/LanguageSwitcher.tsx
├── imports: src/constants/colors
├── imports: src/constants/typography
├── imports: src/stores/languageStore
└── imports: react-i18next

src/components/common/Button.tsx
├── imports: src/constants/colors
└── imports: src/constants/typography

src/components/common/Card.tsx
└── imports: src/constants/colors

src/components/common/GlassCard.tsx
└── imports: src/constants/colors
```

### Layer 4: Screens (Import Everything)
These files import components, stores, constants:

```
app/(auth)/login.tsx
├── imports: src/stores/userStore
├── imports: src/components/common/*
├── imports: src/constants/*
└── imports: react-i18next

app/(tabs)/index.tsx
├── imports: src/components/common/ThaiPatternBackground
├── imports: src/components/common/FloatingBubbles
├── imports: src/constants/*
└── imports: src/types/entities

app/(tabs)/profile.tsx
├── imports: src/stores/userStore
├── imports: src/stores/learningStore
├── imports: src/stores/languageStore
├── imports: src/components/common/LanguageSwitcher
├── imports: src/constants/*
└── imports: react-i18next
```

### Layer 5: Layouts (Import Stores, Control Flow)
These files import stores and control navigation:

```
app/_layout.tsx
├── imports: src/stores/userStore
└── controls: entire app navigation

app/(auth)/_layout.tsx
├── imports: src/stores/userStore
└── controls: auth screen navigation

app/(tabs)/_layout.tsx
├── imports: src/constants/*
└── controls: tab bar navigation
```

---

## Detailed File-by-File Import Analysis

### Root Layout: `app/_layout.tsx`

```typescript
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useUserStore } from '@/src/stores/userStore';  ← STATE
import "../global.css";
```

**Dependencies:**
- **Expo Router**: Navigation control
- **User Store**: Auth state monitoring
- **Fonts**: Custom font loading (currently disabled)
- **Splash Screen**: Loading screen management
- **Gesture Handler**: Touch gesture support

---

### Login Screen: `app/(auth)/login.tsx`

```typescript
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '@/src/stores/userStore';  ← STATE
import { ThaiPatternBackground } from '@/src/components/common/ThaiPatternBackground';  ← COMPONENT
import { LanguageSwitcher } from '@/src/components/common/LanguageSwitcher';  ← COMPONENT
import { Button } from '@/src/components/common/Button';  ← COMPONENT
import { Colors } from '@/src/constants/colors';  ← CONSTANTS
import { Typography } from '@/src/constants/typography';  ← CONSTANTS
```

**Dependencies:**
- **Stores**: User authentication state
- **Components**: 3 custom components
- **Constants**: Colors and typography
- **i18n**: Translations
- **Router**: Navigation after login

---

### Home Screen: `app/(tabs)/index.tsx`

```typescript
import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Play, TrendingUp, Clock, Award, Star } from 'lucide-react-native';  ← ICONS
import { BlurView } from 'expo-blur';
import { ThaiPatternBackground } from '@/src/components/common/ThaiPatternBackground';  ← COMPONENT
import { FloatingBubbles } from '@/src/components/common/FloatingBubbles';  ← COMPONENT
import { Colors } from '@/src/constants/colors';  ← CONSTANTS
import { Typography } from '@/src/constants/typography';  ← CONSTANTS
import { ReviewItem } from '@/src/types/entities';  ← TYPE
```

**Dependencies:**
- **Components**: 2 custom components
- **Icons**: 5 icons from lucide-react-native
- **Types**: ReviewItem interface
- **Constants**: Colors and typography
- **Router**: Navigation to review modal

---

### Profile Screen: `app/(tabs)/profile.tsx`

```typescript
import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Award, TrendingUp, Clock, Trophy, Settings, LogOut } from 'lucide-react-native';  ← ICONS
import { useTranslation } from 'react-i18next';
import { useUserStore } from '@/src/stores/userStore';  ← STATE
import { useLearningStore } from '@/src/stores/learningStore';  ← STATE
import { useLanguageStore } from '@/src/stores/languageStore';  ← STATE
import { LanguageSwitcher } from '@/src/components/common/LanguageSwitcher';  ← COMPONENT
import { Colors } from '@/src/constants/colors';  ← CONSTANTS
import { Typography } from '@/src/constants/typography';  ← CONSTANTS
```

**Dependencies:**
- **Stores**: 3 stores (user, learning, language)
- **Component**: LanguageSwitcher
- **Icons**: 6 icons
- **i18n**: Translations
- **Constants**: Colors and typography

**Most Connected Screen**: Profile imports from 3 different stores!

---

### User Store: `src/stores/userStore.ts`

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
```

**Dependencies:**
- **Zustand**: State management library
- **Middleware**: Persistence middleware
- **AsyncStorage**: Mobile local storage

**Exports:**
```typescript
export const useUserStore  // Hook for components
```

**Used By:**
- `app/_layout.tsx`
- `app/(auth)/_layout.tsx`
- `app/(auth)/login.tsx`
- `app/(tabs)/profile.tsx`

---

### Learning Store: `src/stores/learningStore.ts`

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Course, LearningProgress, Level } from '../types/entities';  ← TYPES
```

**Dependencies:**
- **Zustand**: State management
- **Types**: Entity definitions

**Exports:**
```typescript
export const useLearningStore  // Hook for components
```

**Used By:**
- `app/(tabs)/profile.tsx`
- (Future: learning screens)

---

### Language Store: `src/stores/languageStore.ts`

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '@/src/i18n';  ← I18N
```

**Dependencies:**
- **Zustand**: State management
- **i18n**: Internationalization instance

**Exports:**
```typescript
export const useLanguageStore  // Hook for components
```

**Used By:**
- `src/components/common/LanguageSwitcher.tsx`
- `app/(tabs)/profile.tsx`

---

### ThaiPatternBackground Component: `src/components/common/ThaiPatternBackground.tsx`

```typescript
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Defs, Pattern, Rect, Path } from 'react-native-svg';
import { Colors } from '@/src/constants/colors';  ← CONSTANTS
```

**Dependencies:**
- **React Native SVG**: Vector graphics
- **Colors**: Color constants

**Used By:**
- `app/(auth)/login.tsx`
- `app/(tabs)/index.tsx`

---

### FloatingBubbles Component: `src/components/common/FloatingBubbles.tsx`

```typescript
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Play } from 'lucide-react-native';  ← ICON
import { ReviewItem } from '@/src/types/entities';  ← TYPE
import { Colors } from '@/src/constants/colors';  ← CONSTANTS
import { Typography } from '@/src/constants/typography';  ← CONSTANTS
```

**Dependencies:**
- **Types**: ReviewItem interface
- **Icons**: Play button icon
- **Constants**: Colors and typography

**Used By:**
- `app/(tabs)/index.tsx` only

---

### LanguageSwitcher Component: `src/components/common/LanguageSwitcher.tsx`

```typescript
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Globe } from 'lucide-react-native';  ← ICON
import { useTranslation } from 'react-i18next';
import { useLanguageStore } from '@/src/stores/languageStore';  ← STATE
import { Colors } from '@/src/constants/colors';  ← CONSTANTS
import { Typography } from '@/src/constants/typography';  ← CONSTANTS
```

**Dependencies:**
- **Store**: Language store (state + i18n update)
- **i18n**: Translation hook
- **Constants**: Colors and typography

**Used By:**
- `app/(auth)/login.tsx` (compact variant)
- `app/(tabs)/profile.tsx` (full variant)

---

### i18n Configuration: `src/i18n/index.ts`

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import zhTranslations from './locales/zh';  ← TRANSLATIONS
import enTranslations from './locales/en';  ← TRANSLATIONS
```

**Dependencies:**
- **i18next**: Core i18n library
- **react-i18next**: React integration
- **expo-localization**: Device language detection
- **Translation files**: Chinese and English

**Exports:**
```typescript
export default i18n;  // i18n instance
```

**Used By:**
- `src/stores/languageStore.ts`
- All screens using `useTranslation()`

---

## Path Alias: `@/`

The project uses a **path alias** configured in:

### `tsconfig.json`
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### `babel.config.js`
```javascript
module.exports = {
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@': '.',
        },
      },
    ],
  ],
};
```

**Usage Example:**
```typescript
// Instead of this:
import { Colors } from '../../../src/constants/colors';

// You can write:
import { Colors } from '@/src/constants/colors';
```

**Benefits:**
- Shorter import paths
- No relative path confusion (`../../../`)
- Easy file relocation (imports don't break)

---

## External Package Dependencies

### Navigation & Routing
```json
{
  "expo-router": "~4.0.20",
  "react-native-screens": "~4.4.0",
  "react-native-safe-area-context": "4.12.0",
  "expo-linking": "~7.0.5"
}
```

### State Management
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
  "expo-linear-gradient": "~14.0.2",
  "lucide-react-native": "^0.554.0",
  "react-native-svg": "15.8.0"
}
```

### Internationalization
```json
{
  "i18next": "^25.6.3",
  "react-i18next": "^16.3.4",
  "expo-localization": "~15.0.3"
}
```

### Typography
```json
{
  "expo-font": "~13.0.4",
  "@expo-google-fonts/playfair-display": "^0.4.2",
  "@expo-google-fonts/noto-serif-sc": "^0.4.2",
  "@expo-google-fonts/sarabun": "^0.4.1"
}
```

---

## Import Anti-Patterns to Avoid

### ❌ Circular Dependencies
```typescript
// DON'T: Store imports component, component imports store
// userStore.ts
import { LoginButton } from '@/src/components/LoginButton';

// LoginButton.tsx
import { useUserStore } from '@/src/stores/userStore';
```

**Solution:** Only components should import stores, never the reverse.

### ❌ Deep Relative Paths
```typescript
// DON'T
import { Colors } from '../../../src/constants/colors';

// DO
import { Colors } from '@/src/constants/colors';
```

### ❌ Importing from Wrong Barrel
```typescript
// DON'T: Import from duplicate types file
import { User } from '@/src/types/entities';

// DO: Import from primary entities file
import { User } from '@/src/entities/types/entities';
```

---

## Dependency Graph Summary

```
CONSTANTS (colors, typography)
    ↓ imported by
TYPES (entities)
    ↓ imported by
STORES (userStore, learningStore, languageStore)
    ↓ imported by
COMPONENTS (ThaiPatternBackground, FloatingBubbles, LanguageSwitcher)
    ↓ imported by
SCREENS (login, index, profile)
    ↓ controlled by
LAYOUTS (_layout files)
```

**Clean Dependency Flow:** Lower layers never import from higher layers.

---

## Files That Import Nothing from Project

These files have **zero internal dependencies**:

1. `src/constants/colors.ts`
2. `src/constants/typography.ts`
3. `src/i18n/locales/zh.ts`
4. `src/i18n/locales/en.ts`
5. `src/entities/types/entities.ts`

**These are the foundation** - change them carefully, as many files depend on them!

---

## Most Connected Files (Central Dependencies)

### Top 5 Most Imported Files

1. **`src/constants/colors.ts`** - Imported by almost every component
2. **`src/constants/typography.ts`** - Imported by almost every component
3. **`src/stores/userStore.ts`** - Imported by 4 files
4. **`src/types/entities.ts`** - Imported by 3 files
5. **`src/i18n/index.ts`** - Imported by 2 stores + all screens using translations

### Top 3 Files That Import the Most

1. **`app/(tabs)/profile.tsx`** - Imports 3 stores + components + constants
2. **`app/(tabs)/index.tsx`** - Imports 2 components + 5 icons + constants
3. **`app/(auth)/login.tsx`** - Imports 1 store + 3 components + constants

---

## Refactoring Opportunities

### Issue 1: Duplicate Type Definitions
**Problem:** Same types in two locations:
- `src/types/entities.ts`
- `src/entities/types/entities.ts`

**Solution:** Delete one, update imports

### Issue 2: Inline Types in userStore
**Problem:** `User` interface defined in `userStore.ts` instead of using shared types

**Solution:** Import from `entities.ts`

---

## Summary

The project follows a **clean layered architecture**:

1. **Constants & Types** - Foundation layer, no dependencies
2. **i18n & Stores** - Infrastructure layer, depends on Layer 1
3. **Components** - UI layer, depends on Layers 1-2
4. **Screens** - Feature layer, depends on Layers 1-3
5. **Layouts** - Control layer, orchestrates everything

**Path Alias `@/`** makes all imports clean and consistent.

**No circular dependencies** exist - the codebase is well-structured!
