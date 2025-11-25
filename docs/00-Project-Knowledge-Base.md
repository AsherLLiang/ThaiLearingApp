# Thai Learning App - Project Knowledge Base

**Complete Reference Guide for Development**

This document serves as the central knowledge base for the Thai Learning App project. Use this as your primary reference for understanding the codebase, architecture, and development progress.

---

## 📚 Documentation Index

1. **[Expo Router Explained](./01-Expo-Router-Explained.md)** - Complete guide to file-based routing
2. **[Project Routing & Navigation](./02-Project-Routing-Navigation.md)** - How routes work in this app
3. **[File Import & Dependencies](./03-File-Import-Dependencies.md)** - Import relationships and architecture
4. **[Parameter Passing Guide](./04-Parameter-Passing-Guide.md)** - Props, state, and URL params
5. **[Zustand State Management](./05-Zustand-State-Management.md)** - Global state with Zustand
6. **[Frontend Design Philosophy](./06-Frontend-Design-Philosophy.md)** - Design principles and patterns

---

## 🎯 Project Overview

### Mission
Build a mobile application to help users learn the Thai language, focusing on alphabet, vocabulary, pronunciation, and practical conversation skills.

### Tech Stack
- **Framework:** React Native (0.76.9) with Expo (52.0.38)
- **Routing:** Expo Router v4 (file-based routing)
- **State Management:** Zustand (5.0.8) with AsyncStorage persistence
- **Internationalization:** i18next + react-i18next
- **UI/Animation:** React Native Reanimated, Expo Blur
- **Icons:** Lucide React Native
- **Typography:** Custom fonts (Playfair Display, Noto Serif SC, Sarabun)

### Project Status
**Development Phase:** MVP Implementation (30% complete)

**Completed Features:**
- ✅ Authentication flow (mock login/register)
- ✅ Protected routing with auth guards
- ✅ Custom tab navigation with protruding center button
- ✅ User profile with statistics
- ✅ Multi-language UI (Chinese/English)
- ✅ Review system UI (flashcard interface)
- ✅ Progress tracking structure
- ✅ Cultural design system (Thai patterns, colors)

**In Progress:**
- 🔄 Backend API integration
- 🔄 Course content management
- 🔄 Learning modules

**Not Started:**
- ❌ Audio/TTS implementation
- ❌ Admin panel
- ❌ Analytics dashboard
- ❌ Social features
- ❌ Offline support (beyond AsyncStorage)

---

## 🏗️ Architecture Overview

### High-Level Structure

```
┌─────────────────────────────────────┐
│       User Interface (React)        │
│  - Screens (app/)                   │
│  - Components (src/components/)     │
└─────────────────────────────────────┘
              ↕
┌─────────────────────────────────────┐
│   State Management (Zustand)        │
│  - userStore (auth)                 │
│  - learningStore (progress)         │
│  - languageStore (i18n)             │
└─────────────────────────────────────┘
              ↕
┌─────────────────────────────────────┐
│    Data Layer (Future)              │
│  - API Services (axios)             │
│  - AsyncStorage (persistence)       │
└─────────────────────────────────────┘
```

### Routing Architecture

```
App Start
    ↓
Root Layout (/_layout.tsx)
    ├─→ Auth Guard
    │   ├─→ Not Authenticated → /(auth)/login
    │   └─→ Authenticated → /(tabs)/
    │
    ├─→ (auth)/ [Public Routes]
    │   ├─→ login.tsx
    │   └─→ register.tsx
    │
    ├─→ (tabs)/ [Protected Routes]
    │   ├─→ index.tsx (Home)
    │   ├─→ courses.tsx
    │   └─→ profile.tsx
    │
    └─→ review-modal.tsx [Modal]
```

### State Management Architecture

```
┌─────────────────┐
│   userStore     │ ← Authentication, user profile
│   ↓ persisted   │
│   AsyncStorage  │
└─────────────────┘

┌─────────────────┐
│ learningStore   │ ← Course progress, achievements
│   ↓ persisted   │
│   AsyncStorage  │
└─────────────────┘

┌─────────────────┐
│ languageStore   │ ← UI language (zh/en)
│   ↓ persisted   │ ← Also updates i18next
│   AsyncStorage  │
└─────────────────┘
```

---

## 📁 Directory Structure

```
ThaiLearningApp/
│
├── app/                          # Expo Router routes
│   ├── _layout.tsx              # Root layout + auth guard
│   ├── (auth)/                  # Authentication routes (public)
│   │   ├── _layout.tsx         # Auth layout
│   │   ├── login.tsx           # Login screen
│   │   └── register.tsx        # Register screen
│   ├── (tabs)/                  # Main app routes (protected)
│   │   ├── _layout.tsx         # Custom tab bar
│   │   ├── index.tsx           # Home/Dashboard
│   │   ├── courses.tsx         # Course library
│   │   └── profile.tsx         # User profile
│   ├── admin/                   # Admin routes (empty)
│   ├── learning/                # Learning modules (empty)
│   └── review-modal.tsx         # Flashcard review modal
│
├── src/
│   ├── components/              # Reusable UI components
│   │   └── common/
│   │       ├── ThaiPatternBackground.tsx
│   │       ├── FloatingBubbles.tsx
│   │       ├── LanguageSwitcher.tsx
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       └── GlassCard.tsx
│   │
│   ├── constants/               # Design tokens
│   │   ├── colors.ts           # Color palette
│   │   └── typography.ts       # Font definitions
│   │
│   ├── stores/                  # Zustand state stores
│   │   ├── userStore.ts        # Authentication state
│   │   ├── learningStore.ts    # Learning progress
│   │   └── languageStore.ts    # UI language
│   │
│   ├── types/                   # TypeScript types (duplicate)
│   │   └── entities.ts
│   │
│   ├── entities/                # Primary type definitions
│   │   └── types/
│   │       └── entities.ts     # User, Course, Progress types
│   │
│   ├── i18n/                    # Internationalization
│   │   ├── index.ts            # i18next configuration
│   │   └── locales/
│   │       ├── zh.ts           # Chinese translations
│   │       └── en.ts           # English translations
│   │
│   ├── services/                # API services (empty)
│   ├── hooks/                   # Custom hooks (empty)
│   └── utils/                   # Utility functions (empty)
│
├── assets/                      # Images, fonts, splash screens
├── android/                     # Android native code
├── ios/                         # iOS native code
├── docs/                        # Documentation (this folder)
├── app.json                     # Expo configuration
├── package.json                 # Dependencies
├── tsconfig.json               # TypeScript config
├── babel.config.js             # Babel config (path aliases)
└── global.css                  # Global styles
```

---

## 🔑 Key Concepts

### 1. File-Based Routing (Expo Router)

**Concept:** Files in `app/` automatically become routes.

**Example:**
```
app/
├── index.tsx          → Route: "/"
├── profile.tsx        → Route: "/profile"
└── course/
    └── [id].tsx       → Route: "/course/123"
```

**Route Groups:** `(groupName)/` organizes files without affecting URLs.
```
app/(auth)/login.tsx   → Route: "/login" (NOT "/auth/login")
```

**Layouts:** `_layout.tsx` wraps all sibling routes.

**Read more:** [01-Expo-Router-Explained.md](./01-Expo-Router-Explained.md)

---

### 2. Zustand State Management

**Concept:** Lightweight global state without providers.

**Pattern:**
```typescript
// 1. Create store
const useStore = create((set, get) => ({
  count: 0,
  increment: () => set({ count: get().count + 1 }),
}));

// 2. Use in component
const { count, increment } = useStore();
```

**Persistence:**
```typescript
persist(
  (set, get) => ({ /* store */ }),
  { name: 'storage-key', storage: AsyncStorage }
)
```

**Read more:** [05-Zustand-State-Management.md](./05-Zustand-State-Management.md)

---

### 3. Authentication Flow

**Login Process:**
```
1. User enters credentials
2. userStore.login(email, password)
3. Store updates: isAuthenticated = true
4. Root layout detects change
5. router.replace('/(tabs)')
6. User redirected to app
```

**Auto-Login on App Start:**
```
1. App opens
2. Zustand loads state from AsyncStorage
3. isAuthenticated restored
4. Root layout checks auth
5. If true → /(tabs), if false → /login
```

**Read more:** [02-Project-Routing-Navigation.md](./02-Project-Routing-Navigation.md)

---

### 4. Internationalization (i18n)

**Supported Languages:**
- Chinese (zh) - Default
- English (en)

**How It Works:**
```typescript
// 1. Get translation function
const { t } = useTranslation();

// 2. Use translation keys
<Text>{t('auth.loginButton')}</Text>  // "登录" or "Login"
```

**Language Switching:**
```typescript
// Updates both Zustand store AND i18next
languageStore.changeLanguage('en');
```

**Translation Files:**
- `src/i18n/locales/zh.ts` - Chinese
- `src/i18n/locales/en.ts` - English

---

### 5. Component Patterns

**Prop-Based Components:**
```typescript
interface Props {
  reviews: ReviewItem[];
  onOpenReview: () => void;
}

export const FloatingBubbles: React.FC<Props> = ({ reviews, onOpenReview }) => {
  // Component receives data from parent
};
```

**State-Based Components:**
```typescript
export default function ProfileScreen() {
  // Component reads from global store
  const { currentUser } = useUserStore();
  const { progress } = useLearningStore();
};
```

**Read more:** [04-Parameter-Passing-Guide.md](./04-Parameter-Passing-Guide.md)

---

## 🎨 Design System

### Color Palette

| Name | Hex | Usage |
|------|-----|-------|
| **Paper** | #FAF9F6 | Background, light cards |
| **Ink** | #1A1A1A | Primary text, dark cards |
| **Thai Gold** | #D4AF37 | Accents, achievements |
| **Sand** | #E5E2DB | Borders, dividers |
| **Taupe** | #8E8B82 | Secondary text |
| **White** | #FFFFFF | Highlights, active states |

### Typography

| Purpose | Font | Size |
|---------|------|------|
| English headings | Playfair Display | 32px (h1) |
| Chinese text | Noto Serif SC | 16px (body) |
| Thai script | Sarabun | Various |
| Labels | Noto Serif SC | 14px (caption) |

### Spacing Scale

```
xs:  4px   sm:  8px   md: 16px
lg: 24px   xl: 32px  xxl: 48px
```

**Read more:** [06-Frontend-Design-Philosophy.md](./06-Frontend-Design-Philosophy.md)

---

## 🔄 Data Flow Examples

### Example 1: Login Flow

```
LoginScreen
    ↓ User clicks "Login"
userStore.login(email, password)
    ↓ set({ isAuthenticated: true })
AsyncStorage saves state
    ↓
Root Layout (useEffect hook)
    ↓ Detects isAuthenticated = true
router.replace('/(tabs)')
    ↓
Home Screen loads
    ↓ Reads from userStore
Displays: "ສະບາຍດີ, {currentUser.displayName}"
```

### Example 2: Language Change

```
LanguageSwitcher
    ↓ User clicks EN
languageStore.changeLanguage('en')
    ↓ Updates Zustand + i18next
AsyncStorage saves preference
    ↓
ALL components using useTranslation()
    ↓ Re-render with new language
Text updates: "登录" → "Login"
```

### Example 3: Review Session

```
Home Screen
    ↓ Shows FloatingBubbles
User clicks bubbles
    ↓ router.push('/review-modal')
Review Modal opens
    ↓ User reviews cards
User clicks difficulty
    ↓ (Future) updateProgress('alphabet', 5)
learningStore updates
    ↓ completedAlphabets += 1
AsyncStorage saves progress
    ↓
Profile Screen
    ↓ Re-renders automatically
Shows updated count
```

---

## 🧪 Testing Strategy (Future)

### Unit Tests
- Zustand store actions
- Utility functions
- Type definitions

### Component Tests
- Component rendering
- Prop handling
- User interactions

### Integration Tests
- Authentication flow
- Navigation flow
- State persistence

### E2E Tests
- Complete user journeys
- Multi-screen flows

**Tools:** Jest, React Native Testing Library, Detox

---

## 🚀 Deployment Checklist

### Pre-Release Tasks

**Code Quality:**
- [ ] Remove console.log statements
- [ ] Fix TypeScript errors
- [ ] Remove duplicate type definitions
- [ ] Add error boundaries
- [ ] Implement proper error handling

**Performance:**
- [ ] Optimize images (WebP format)
- [ ] Add loading states
- [ ] Implement list virtualization
- [ ] Profile animation performance

**Security:**
- [ ] Implement real authentication
- [ ] Add JWT token refresh
- [ ] Validate all user inputs
- [ ] Sanitize API responses

**Accessibility:**
- [ ] Add accessibility labels
- [ ] Test with screen readers
- [ ] Verify color contrast
- [ ] Support dynamic type

**Testing:**
- [ ] Write unit tests for stores
- [ ] Test authentication flow
- [ ] Test on iOS and Android
- [ ] Test on different screen sizes

### Build Process

**iOS:**
```bash
eas build --platform ios
eas submit --platform ios
```

**Android:**
```bash
eas build --platform android
eas submit --platform android
```

---

## 📊 Current Metrics

### Code Statistics (Estimated)

| Metric | Count |
|--------|-------|
| Total Files | ~40 |
| TypeScript Files | ~30 |
| React Components | ~15 |
| Zustand Stores | 3 |
| Routes | 7 active |
| Translation Keys | ~50 |
| Custom Components | 6 |

### Bundle Size (Estimated)
- **Base App:** ~8 MB
- **With Assets:** ~12 MB
- **With Fonts:** ~15 MB

---

## 🐛 Known Issues

### Issue 1: Duplicate Type Definitions
**Location:** `src/types/entities.ts` and `src/entities/types/entities.ts`
**Impact:** Low (both files export same types)
**Fix:** Delete one, update imports

### Issue 2: Font Loading Disabled
**Location:** `app/_layout.tsx:17`
**Reason:** Font files not found
**Impact:** Medium (using system fonts instead)
**Fix:** Add font files to assets or remove font imports

### Issue 3: Mock Authentication
**Location:** `src/stores/userStore.ts:41`
**Impact:** High (no real backend)
**Fix:** Implement API integration

### Issue 4: Incomplete Courses Screen
**Location:** `app/(tabs)/courses.tsx`
**Impact:** Medium (shows "Coming Soon")
**Fix:** Implement course listing

---

## 🔮 Roadmap

### Phase 1: MVP Completion (Current)
- [ ] Backend API integration
- [ ] Real authentication
- [ ] Course content loading
- [ ] Basic learning modules

### Phase 2: Core Features
- [ ] Audio playback (TTS)
- [ ] Pronunciation practice
- [ ] Spaced repetition algorithm
- [ ] Achievement system

### Phase 3: Enhanced Experience
- [ ] Offline support
- [ ] Push notifications
- [ ] Daily goals and streaks
- [ ] Social features (friends, leaderboards)

### Phase 4: Advanced Features
- [ ] AI-powered conversation practice
- [ ] Speech recognition
- [ ] Adaptive learning paths
- [ ] Premium subscription

---

## 🛠️ Development Workflow

### Getting Started

**1. Clone Repository**
```bash
git clone <repository-url>
cd ThaiLearningApp
```

**2. Install Dependencies**
```bash
npm install
```

**3. Start Development Server**
```bash
npx expo start
```

**4. Run on Device/Simulator**
```bash
# iOS
npx expo run:ios

# Android
npx expo run:android
```

### Common Commands

```bash
# Clear cache
npx expo start --clear

# Type checking
npx tsc --noEmit

# View routes
npx expo start  # Then press 'Shift + M'

# Build production
eas build --platform ios
eas build --platform android
```

---

## 📖 Learning Resources

### Expo Router
- Official Docs: https://docs.expo.dev/router/introduction/
- Migration Guide: https://docs.expo.dev/router/migrate/

### Zustand
- Official Docs: https://docs.pmnd.rs/zustand/getting-started/introduction
- Persist Middleware: https://docs.pmnd.rs/zustand/integrations/persisting-store-data

### i18next
- React i18next: https://react.i18next.com/
- Expo Localization: https://docs.expo.dev/versions/latest/sdk/localization/

### React Native
- Official Docs: https://reactnative.dev/
- Expo SDK: https://docs.expo.dev/versions/latest/

---

## 🤝 Contribution Guidelines

### Code Style

**TypeScript:**
- Use interfaces for props
- Avoid `any` type
- Export types when shared

**React:**
- Functional components only
- Hooks for state management
- Props destructuring

**Naming:**
- PascalCase for components
- camelCase for variables/functions
- UPPER_CASE for constants

**File Organization:**
```typescript
// 1. Imports (grouped)
import React from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';

import { useUserStore } from '@/src/stores/userStore';
import { Colors } from '@/src/constants/colors';

// 2. Types/Interfaces
interface Props {
  title: string;
}

// 3. Component
export default function Component({ title }: Props) {
  // Logic
  return <View />;
}

// 4. Styles
const styles = StyleSheet.create({});
```

### Git Workflow

**Branch Naming:**
- `feature/description` - New features
- `fix/description` - Bug fixes
- `refactor/description` - Code improvements

**Commit Messages:**
```
feat: Add user profile screen
fix: Resolve login redirect loop
refactor: Extract FloatingBubbles component
docs: Update routing documentation
```

---

## 📞 Support & Contact

### Documentation
- **This Folder:** `/docs` - All project documentation
- **README:** `/README.md` - Quick start guide
- **Inline Comments:** Within code files

### Getting Help
1. Check relevant documentation file
2. Search existing code for examples
3. Consult official library docs
4. Ask team/maintainers

---

## 🎓 Key Takeaways for New Developers

### Understanding the Stack

**1. Expo Router = Next.js for Mobile**
- Files in `app/` become routes automatically
- No manual route configuration needed
- Great for rapid development

**2. Zustand = Simple Redux**
- No boilerplate, just create and use
- Automatic persistence with middleware
- Perfect for small to medium apps

**3. TypeScript = Confidence**
- Catch errors before runtime
- Better IDE autocomplete
- Self-documenting code

### Mental Model

**Think in Layers:**
```
UI (Components) → State (Zustand) → Data (API)
         ↑              ↑             ↑
       Props        Hooks       AsyncStorage
```

**Navigation Flow:**
```
User Action → State Change → Layout Reacts → Route Updates
```

**State Updates:**
```
Component calls action → Store updates → All subscribers re-render
```

---

## 📝 Quick Reference

### Path Aliases
```typescript
import { Colors } from '@/src/constants/colors';
import { useUserStore } from '@/src/stores/userStore';
```

### Zustand Stores
```typescript
const { currentUser, login, logout } = useUserStore();
const { progress, updateProgress } = useLearningStore();
const { currentLanguage, changeLanguage } = useLanguageStore();
```

### Navigation
```typescript
const router = useRouter();
router.push('/path');         // Navigate forward
router.replace('/path');      // Replace current screen
router.back();                // Go back
```

### Translation
```typescript
const { t } = useTranslation();
<Text>{t('common.confirm')}</Text>
```

---

## 🎯 Project Philosophy

### Principles

**1. User First**
- Learning effectiveness > Visual flair
- Accessibility from day one
- Performance matters

**2. Developer Experience**
- Clear documentation
- Consistent patterns
- Type safety everywhere

**3. Cultural Respect**
- Authentic Thai elements
- Not stereotypical or cartoonish
- Bilingual by default

**4. Sustainable Code**
- Simple over clever
- Tested and documented
- Easy to maintain

---

## 📈 Success Metrics (Future)

### User Engagement
- Daily active users
- Lesson completion rate
- Retention (7-day, 30-day)

### Learning Effectiveness
- Average progress per week
- Quiz scores over time
- User-reported proficiency

### Technical Performance
- App load time < 2s
- Navigation smoothness (60fps)
- Crash-free rate > 99%

---

## 🏁 Final Notes

This project is a **work in progress** with a solid foundation. The architecture supports:

- ✅ Easy feature addition (just add files to `app/`)
- ✅ Scalable state management (Zustand stores)
- ✅ Type-safe development (TypeScript)
- ✅ International audience (i18n ready)
- ✅ Mobile-first design (Expo + React Native)

**Remember:** Good code tells a story. This documentation helps you understand that story.

**Happy coding! 🚀**

---

**Last Updated:** 2025-11-23
**Version:** 1.0.0
**Maintained By:** Project Team
