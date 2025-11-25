# Expo Router - Complete Guide

## What is Expo Router?

**Expo Router** is a file-based routing system for React Native applications built with Expo. It brings the simplicity of web routing (like Next.js) to mobile apps.

### Core Concept: File-Based Routing

Instead of manually configuring routes in code, you create files in the `app/` directory, and Expo Router **automatically** creates routes based on your folder structure.

```
app/
├── index.tsx          → Route: "/"
├── profile.tsx        → Route: "/profile"
├── settings/
│   └── index.tsx      → Route: "/settings"
└── user/
    └── [id].tsx       → Route: "/user/123" (dynamic)
```

---

## Why Use Expo Router?

### Traditional React Native Navigation (React Navigation)
```typescript
// Manual configuration required
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

### With Expo Router
```
app/
├── index.tsx      ← Automatic route
├── profile.tsx    ← Automatic route
└── settings.tsx   ← Automatic route
```

**No manual configuration needed!** Routes are created automatically.

---

## Key Features

### 1. **Automatic Route Generation**
Every file in `app/` becomes a route automatically.

### 2. **Type-Safe Navigation**
TypeScript knows all your routes and will show errors if you navigate to a non-existent route.

```typescript
// ✅ Correct
router.push('/(tabs)/profile')

// ❌ Error: Route doesn't exist
router.push('/nonexistent-route')
```

### 3. **Nested Layouts**
Create layouts that wrap multiple screens using `_layout.tsx` files.

### 4. **Route Groups**
Organize routes without affecting the URL using `(groupName)/` folders.

### 5. **Deep Linking**
Automatic support for opening your app from URLs.

---

## Basic Routing Patterns

### Pattern 1: Simple Routes
```
app/
├── index.tsx       → "/"
├── about.tsx       → "/about"
└── contact.tsx     → "/contact"
```

### Pattern 2: Nested Routes
```
app/
├── index.tsx           → "/"
└── settings/
    ├── index.tsx       → "/settings"
    ├── account.tsx     → "/settings/account"
    └── privacy.tsx     → "/settings/privacy"
```

### Pattern 3: Dynamic Routes (Parameters)
```
app/
└── user/
    └── [id].tsx        → "/user/123", "/user/456"
```

Access parameter in component:
```typescript
import { useLocalSearchParams } from 'expo-router';

export default function UserScreen() {
  const { id } = useLocalSearchParams();
  return <Text>User ID: {id}</Text>;
}
```

### Pattern 4: Catch-All Routes
```
app/
└── [...slug].tsx       → Matches any path
```

---

## Layouts with `_layout.tsx`

**Layouts** are special files that wrap all screens in the same directory.

### Example: Root Layout
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

This creates a **Stack Navigator** (screens slide in from the right).

### Layout Types

| Layout Type | Import | Use Case |
|------------|--------|----------|
| Stack | `expo-router` | Standard screen-to-screen navigation |
| Tabs | `expo-router` | Bottom tab bar navigation |
| Drawer | `expo-router` | Side drawer menu |

---

## Route Groups: Organizing Without URL Impact

**Route Groups** use parentheses `()` to organize files **without adding to the URL path**.

### Without Groups
```
app/
├── login.tsx          → "/login"
├── register.tsx       → "/register"
├── home.tsx           → "/home"
└── profile.tsx        → "/profile"
```

### With Groups
```
app/
├── (auth)/
│   ├── login.tsx      → "/login" (NOT "/auth/login")
│   └── register.tsx   → "/register"
└── (tabs)/
    ├── home.tsx       → "/home"
    └── profile.tsx    → "/profile"
```

**Benefits:**
- Group related screens logically
- Apply different layouts to different groups
- Keep URL structure clean

---

## Navigation Methods

### 1. **Push** - Add to navigation stack
```typescript
import { useRouter } from 'expo-router';

const router = useRouter();
router.push('/profile'); // Navigate forward
```

### 2. **Replace** - Replace current screen
```typescript
router.replace('/login'); // Can't go back
```

### 3. **Back** - Go to previous screen
```typescript
router.back();
```

### 4. **Link Component** - Clickable navigation
```typescript
import { Link } from 'expo-router';

<Link href="/profile">
  <Text>Go to Profile</Text>
</Link>
```

---

## Advanced Features

### 1. Modal Presentation
```typescript
// app/_layout.tsx
<Stack>
  <Stack.Screen
    name="modal"
    options={{ presentation: 'modal' }}
  />
</Stack>
```

### 2. Search Parameters
```typescript
// Navigate with params
router.push('/search?query=thai&level=beginner');

// Access params
const { query, level } = useLocalSearchParams();
```

### 3. Programmatic Navigation Guards
```typescript
// app/_layout.tsx
useEffect(() => {
  if (!isAuthenticated) {
    router.replace('/login');
  }
}, [isAuthenticated]);
```

---

## Comparison: Web Routing vs Expo Router

| Web (Next.js) | Expo Router | Result |
|--------------|-------------|---------|
| `pages/index.tsx` | `app/index.tsx` | Homepage |
| `pages/about.tsx` | `app/about.tsx` | `/about` |
| `pages/blog/[slug].tsx` | `app/blog/[slug].tsx` | `/blog/hello` |
| `pages/_app.tsx` | `app/_layout.tsx` | Root layout |

**If you know Next.js, you already understand Expo Router!**

---

## Common Patterns

### Authentication Flow
```
app/
├── _layout.tsx         ← Auth guard logic
├── (auth)/
│   ├── _layout.tsx     ← Redirect if logged in
│   ├── login.tsx
│   └── register.tsx
└── (app)/
    ├── _layout.tsx     ← Redirect if logged out
    ├── home.tsx
    └── profile.tsx
```

### Tab Navigation
```
app/
└── (tabs)/
    ├── _layout.tsx     ← Tabs config
    ├── index.tsx       ← Tab 1
    ├── search.tsx      ← Tab 2
    └── profile.tsx     ← Tab 3
```

---

## Best Practices

### ✅ DO
- Use route groups to organize screens
- Keep layouts simple and focused
- Use TypeScript for type-safe routes
- Use `replace` for login/logout redirects
- Name files descriptively

### ❌ DON'T
- Put business logic in layouts
- Create deeply nested route structures
- Use complex state in navigation guards
- Mix navigation libraries (don't use React Navigation alongside Expo Router)

---

## Debugging Routes

### View All Routes
```bash
# Start Expo with route debugging
npx expo start --clear
```

In terminal, press `Shift + M` to see all generated routes.

### Common Issues

**Issue**: Screen not appearing
- Check file is in `app/` directory
- Ensure file exports default component
- Check `_layout.tsx` includes the screen

**Issue**: Navigation not working
- Verify route path is correct
- Check for typos in route names
- Ensure `_layout.tsx` exists

---

## Migration from React Navigation

If you have an existing app with React Navigation:

```typescript
// Old way
navigation.navigate('Profile', { userId: '123' });

// New way
router.push('/profile/123');
```

**Benefits of migrating:**
- Less boilerplate code
- Automatic deep linking
- Better TypeScript support
- Simpler project structure

---

## Summary

**Expo Router** makes navigation in React Native as simple as creating files:

1. **File = Route** - Just create a file in `app/`
2. **Folder = Path segment** - `app/settings/account.tsx` → `/settings/account`
3. **`_layout.tsx` = Wrapper** - Controls how screens are displayed
4. **`(group)` = Organization** - Group files without affecting URLs
5. **`[param]` = Dynamic** - Create routes with parameters

**Key Advantage:** Less code, more productivity, better organization.
