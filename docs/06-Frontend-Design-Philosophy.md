# Frontend Design Philosophy

This document explains the design thinking behind the Thai Learning App's user interface.

---

## Design Principles

### 1. **Cultural Authenticity**
Incorporate Thai visual elements without stereotypes.

**Implementation:**
- Thai elephant pattern as subtle background (not cartoonish)
- Thai gold (#D4AF37) as primary accent color
- Support for Thai script (Sarabun font family)
- Bilingual UI (Thai greeting: "ສະບາຍດີ" on home screen)

**Philosophy:** Respect the culture, don't caricature it.

---

### 2. **Paper & Ink Aesthetic**
Inspired by traditional learning materials and calligraphy.

**Color Palette:**
```typescript
{
  paper: '#FAF9F6',    // Off-white, like aged paper
  ink: '#1A1A1A',      // Deep black for text
  sand: '#E5E2DB',     // Soft borders and dividers
  taupe: '#8E8B82',    // Secondary text
  thaiGold: '#D4AF37', // Accent and highlights
}
```

**Visual Language:**
- Soft, muted background (not pure white)
- High contrast text (readability first)
- Subtle borders (not harsh lines)
- Natural color transitions

**Inspiration:** Japanese stationery, Moleskine notebooks, traditional Thai manuscripts

---

### 3. **Minimalist Complexity**
Clean interface that reveals depth on interaction.

**Approach:**
- **First Glance:** Simple, uncluttered
- **On Interaction:** Rich information and feedback
- **Progressive Disclosure:** Show what's needed, when it's needed

**Examples:**
- Home screen: Clean hero card, but reveals stats on scroll
- FloatingBubbles: Simple stack, but shows detailed reviews on tap
- Profile: Minimal sections, expandable for more data

---

### 4. **Accessible by Default**
Design for all users, not just ideal conditions.

**Considerations:**
- **Font Sizes:** Minimum 14px for body text
- **Touch Targets:** Minimum 44px for interactive elements
- **Color Contrast:** WCAG AA compliant (4.5:1 ratio)
- **Multi-Language:** i18n from day one
- **Safe Areas:** Proper insets for notches and home indicators

---

## Typography System

### Font Families

```typescript
// English & Decorative
playfairRegular: 'PlayfairDisplay_400Regular'  // Serif, elegant
playfairBold: 'PlayfairDisplay_700Bold'

// Chinese Text
notoSerifRegular: 'NotoSerifSC_400Regular'     // Optimized for CJK
notoSerifBold: 'NotoSerifSC_700Bold'

// Thai Script
sarabunRegular: 'Sarabun_400Regular'           // Thai-specific
sarabunBold: 'Sarabun_700Bold'
```

### Font Scale
```typescript
h1: 32,      // Page titles
h2: 24,      // Section headers
h3: 20,      // Card titles
body: 16,    // Main content
caption: 14, // Labels and metadata
small: 12,   // Helper text
```

### Typography Rules

**1. Hierarchy Through Size + Weight**
```typescript
// Title
fontFamily: Typography.playfairRegular,
fontSize: 32,
// No bold needed - size creates hierarchy

// Body
fontFamily: Typography.notoSerifRegular,
fontSize: 16,
```

**2. Language-Appropriate Fonts**
```typescript
// English heading
fontFamily: Typography.playfairRegular  // ← Serif

// Chinese text
fontFamily: Typography.notoSerifRegular  // ← CJK-optimized

// Thai character
fontFamily: Typography.sarabunRegular    // ← Thai script
```

**3. Letter Spacing for Elegance**
```typescript
// Headings: Slightly condensed
letterSpacing: -0.5,

// Labels: Widely spaced uppercase
letterSpacing: 1.5,
textTransform: 'uppercase',
```

---

## Layout Patterns

### 1. **Safe Area First**
Always respect device safe areas.

```typescript
import { SafeAreaView } from 'react-native-safe-area-context';

<SafeAreaView edges={['top']} style={styles.container}>
  {/* Content safe from notch */}
</SafeAreaView>
```

**Why `edges={['top']}`:**
- Top: Avoid notch/status bar
- Bottom: Custom tab bar handles it

---

### 2. **Consistent Spacing**
Use multiples of 8 for harmony.

```typescript
// Spacing Scale
gap: 8,           // Tight
padding: 16,      // Comfortable
margin: 24,       // Spacious
marginTop: 32,    // Generous
```

**Pattern:**
- **Inner spacing (padding):** 16px, 24px
- **Outer spacing (margin):** 24px, 32px
- **Gaps:** 8px, 16px

---

### 3. **Card-Based Design**
Content organized in distinct cards.

**Card Anatomy:**
```typescript
{
  backgroundColor: 'rgba(255, 255, 255, 0.8)',  // Semi-transparent
  borderRadius: 24,                              // Soft corners
  padding: 24,                                   // Breathing room
  borderWidth: 1,
  borderColor: Colors.sand,                      // Subtle outline
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.05,                           // Gentle shadow
  shadowRadius: 4,
}
```

**Types:**
1. **Hero Card** - Large, dark background, featured content
2. **Stat Card** - Medium, white background, metrics
3. **Glass Card** - Blur effect, overlay content

---

### 4. **Grid System**
Flexible layouts with consistent proportions.

```typescript
// Two-column stats
<View style={{ flexDirection: 'row', gap: 16 }}>
  <View style={{ flex: 1 }}>{/* Stat 1 */}</View>
  <View style={{ flex: 1 }}>{/* Stat 2 */}</View>
</View>
```

**Grid Rules:**
- **Mobile:** Max 2 columns
- **Tablet:** Max 3 columns (future)
- **Gap:** Consistent 16px between items

---

## Component Design Patterns

### 1. **ThaiPatternBackground**
Decorative SVG pattern for cultural context.

**Design Decisions:**
- **Opacity:** 0.1 - 0.15 (very subtle, not distracting)
- **Position:** Absolute, covers screen
- **Pattern:** Thai elephant motif (culturally relevant)
- **Color:** Ink color (matches theme)

**When to Use:**
- Authentication screens (set context)
- Home screen (brand reinforcement)
- **When NOT to use:** Data-heavy screens (avoid visual noise)

---

### 2. **FloatingBubbles**
Stacked card interface for pending reviews.

**Design Decisions:**
- **3-card stack:** Shows depth without overwhelming
- **Rotation:** ±2° for playfulness
- **Scale:** 0.95, 0.9 for perspective
- **Badge:** Notification count in top-right
- **Shadow:** Depth cue

**Interaction:**
1. **Idle:** Gentle floating animation (if implemented)
2. **Tap:** Navigate to review modal
3. **Empty:** Component hidden (no placeholder)

**Inspiration:** Duolingo's practice reminders, Tinder card stack

---

### 3. **LanguageSwitcher**
Two presentation modes for different contexts.

**Compact Variant (Auth Screens):**
```
┌──────────┐
│ 🌐 中文  │  ← Globe icon + current language
└──────────┘
```

**Full Variant (Profile Screen):**
```
┌─────────────────────────┐
│  🇨🇳 中文  │  🇺🇸 EN  │  ← Two-option selector
└─────────────────────────┘
```

**Design Decisions:**
- Compact: Save space, subtle
- Full: Explicit choice, easier to understand
- Icons: Globe (universal) vs Flags (specific)

---

### 4. **Custom Tab Bar**
3-tab layout with protruding center button.

**Design Decisions:**
```
         ┌───┐          ← Center button elevated
    │        │        │
┌───┴────────┴────────┴───┐
│ Learn   Home   Profile  │  ← Tab bar
└─────────────────────────┘
```

**Features:**
- **Center button:** 64px diameter, elevated by 24px
- **Blur background:** iOS only (frosted glass effect)
- **Active state:** Darker icon + text
- **Labels:** Chinese (current), future: i18n

**Inspiration:** Apple Music, Instagram (center action button pattern)

---

## Color Usage Patterns

### Color Semantics

| Color | Usage | Example |
|-------|-------|---------|
| **Ink** | Primary text, dark cards | Headings, hero card background |
| **Paper** | Background, light cards | Screen background, input fields |
| **Thai Gold** | Accents, achievements | Badges, active states, highlights |
| **Taupe** | Secondary text, icons | Captions, inactive tabs |
| **Sand** | Borders, dividers | Card outlines, separators |
| **White** | Highlights, active states | Tab bar, button backgrounds |

### Contrast Ratios (WCAG AA)

```
Ink on Paper:     17.2:1  ✅ (Excellent)
Thai Gold on Ink:  4.8:1  ✅ (Pass)
Taupe on Paper:    4.1:1  ⚠️ (Borderline, use for non-critical text only)
```

---

## Animation Philosophy

### Current Approach: Minimal

**Rationale:** Establish solid information architecture before adding motion.

**Existing Animations:**
1. **Navigation transitions** - Expo Router defaults (slide, modal)
2. **Pressable feedback** - Built-in opacity changes
3. **Blur effects** - Static iOS BlurView

### Future Animation Opportunities

**Candidate Elements:**
1. FloatingBubbles: Gentle float/drift animation
2. Achievement unlock: Confetti effect
3. Progress bars: Fill animation
4. Card flip: Review modal (front/back)

**Animation Principles (When Implemented):**
- **Purposeful:** Enhance understanding, not distract
- **Subtle:** 200-300ms duration
- **Natural:** Ease-in-out timing
- **Performant:** Use `react-native-reanimated` (already installed)

**Inspiration:** Duolingo (playful but functional), Headspace (calm and smooth)

---

## Interaction Patterns

### 1. **Tap Targets**
Minimum 44x44px for comfortable tapping.

```typescript
// Tab button
<Pressable style={{ minHeight: 44, minWidth: 44 }}>
```

### 2. **Feedback States**
Visual response to all interactions.

```typescript
<Pressable
  style={({ pressed }) => [
    styles.button,
    pressed && { opacity: 0.7 }  // ← Pressed state
  ]}
>
```

### 3. **Loading States**
Always show when async operations run.

```typescript
const [loading, setLoading] = useState(false);

{loading ? <ActivityIndicator /> : <Button />}
```

### 4. **Empty States**
Graceful handling of no data.

```typescript
// Future pattern
{reviews.length === 0 ? (
  <EmptyState
    icon={BookOpen}
    message="No reviews due today!"
  />
) : (
  <FloatingBubbles reviews={reviews} />
)}
```

---

## Glass-Morphism Elements

### BlurView Implementation
```typescript
import { BlurView } from 'expo-blur';

<BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill}>
  <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}>
    {/* Content */}
  </View>
</BlurView>
```

**Where Used:**
- Header section on home screen
- Tab bar background (iOS only)
- Future: Modal overlays

**Platform Differences:**
- **iOS:** True blur effect
- **Android:** Fallback to solid color

---

## Responsive Design Strategy

### Current: Mobile-First
All designs optimized for phones (375-430px width).

### Future: Tablet Support
```typescript
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

const styles = StyleSheet.create({
  container: {
    maxWidth: isTablet ? 672 : '100%',  // Constrain on tablets
    alignSelf: 'center',
  }
});
```

**Breakpoints (Planned):**
- **Phone:** < 768px (current)
- **Tablet:** 768px - 1024px
- **Large Tablet:** > 1024px

---

## Accessibility Considerations

### 1. **Screen Reader Support** (Future)
```typescript
import { AccessibilityInfo } from 'react-native';

<Pressable
  accessibilityRole="button"
  accessibilityLabel="Open review session"
  accessibilityHint="Double tap to start reviewing flashcards"
>
```

### 2. **Dynamic Type Support** (Future)
Respect user's font size preferences:
```typescript
import { useWindowDimensions } from 'react-native';

const { fontScale } = useWindowDimensions();
const fontSize = 16 * fontScale;
```

### 3. **Color Blindness Consideration**
Don't rely solely on color for information:
- ✅ Icon + color for status
- ❌ Color only

**Example:**
```typescript
// Good: Icon + color
<View style={{ backgroundColor: Colors.thaiGold }}>
  <Star size={16} fill={Colors.ink} />  // ← Icon reinforces meaning
  <Text>Achievement</Text>
</View>
```

---

## Inspiration & References

### Design Systems Studied
1. **Duolingo** - Gamification, progress tracking
2. **Headspace** - Calm aesthetics, soft colors
3. **Apple Design** - Typography, spacing, safe areas
4. **Material Design 3** - Elevation, surfaces
5. **Japanese Stationery** - Paper textures, muted tones

### Thai Design Elements
1. **Traditional Thai Manuscripts** - Gold accent color
2. **Thai Temple Architecture** - Geometric patterns
3. **Thai Silk Patterns** - Elephant motif

---

## Design Decision Log

### Why Serif Fonts?
**Decision:** Use Playfair Display (serif) instead of sans-serif
**Rationale:**
- Evokes traditional learning (textbooks, manuscripts)
- More elegant and distinctive
- Better for branding (stands out from typical apps)

### Why Off-White Background?
**Decision:** Paper (#FAF9F6) instead of pure white (#FFFFFF)
**Rationale:**
- Less eye strain (softer, warmer)
- Matches "paper and ink" theme
- More sophisticated appearance

### Why Protruding Tab Button?
**Decision:** Elevated center home button instead of flat tabs
**Rationale:**
- Emphasizes primary action (home/dashboard)
- Creates visual interest
- Common pattern in successful apps (Instagram, TikTok)

### Why Three Stores?
**Decision:** Separate userStore, learningStore, languageStore
**Rationale:**
- Separation of concerns
- Independent persistence
- Easier testing and maintenance

---

## Component Library Structure

### Atomic Design Approach (Informal)

**Atoms:** (Not yet implemented)
- Text
- Icon
- Spacer

**Molecules:**
- Button
- Card
- LanguageSwitcher

**Organisms:**
- FloatingBubbles
- ThaiPatternBackground
- CustomTabBar

**Templates:**
- SafeAreaView wrappers
- ScrollView containers

**Pages:**
- HomeScreen
- ProfileScreen
- LoginScreen

---

## Design Tokens (Future)

### Planned Token System
```typescript
// spacing.ts
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// borderRadius.ts
export const BorderRadius = {
  sm: 8,
  md: 16,
  lg: 24,
  full: 9999,
};

// elevation.ts
export const Shadow = {
  low: { /* ... */ },
  medium: { /* ... */ },
  high: { /* ... */ },
};
```

**Benefits:**
- Consistency across components
- Easy theme customization
- Centralized design system

---

## Performance Considerations

### Image Optimization
- Use WebP format (smaller file size)
- Lazy load images below fold
- Cache avatar images

### Animation Performance
- Use `react-native-reanimated` (runs on UI thread)
- Avoid animating expensive properties (avoid `height`, use `transform`)
- Limit concurrent animations

### List Optimization
- Use `FlatList` with `keyExtractor` for long lists
- Implement `getItemLayout` for fixed-size items
- Add `windowSize` optimization

---

## Dark Mode Strategy (Future)

### Planned Color Palette
```typescript
const Colors = {
  light: {
    paper: '#FAF9F6',
    ink: '#1A1A1A',
    // ...
  },
  dark: {
    paper: '#1A1A1A',      // Dark background
    ink: '#FAF9F6',        // Light text
    thaiGold: '#FFD700',   // Brighter gold
    // ...
  }
};

// Usage
const colorScheme = useColorScheme();
const colors = Colors[colorScheme ?? 'light'];
```

**Challenges:**
- Thai Pattern Background visibility
- Glass-morphism effects
- Image content (may need dark variants)

---

## Best Practices Summary

### ✅ DO
- Use design tokens (colors, typography)
- Respect safe areas
- Provide visual feedback on interactions
- Test on multiple screen sizes
- Consider accessibility from the start
- Keep animations subtle and purposeful

### ❌ DON'T
- Hard-code colors or spacing values
- Use absolute positioning excessively
- Ignore platform differences (iOS vs Android)
- Overload screens with information
- Sacrifice performance for visual effects
- Use complex gradients (hard to maintain)

---

## Design System Maturity

### Current State: **Foundational**
- ✅ Color palette defined
- ✅ Typography system established
- ✅ Basic components created
- ⚠️ No formal documentation
- ❌ No Storybook/component preview
- ❌ No design tokens file

### Next Steps:
1. Create design tokens file (`src/constants/tokens.ts`)
2. Document component APIs
3. Add Storybook for component preview
4. Establish icon library standards
5. Create dark mode variants

---

## Conclusion

The Thai Learning App's design philosophy centers on:

1. **Cultural Respect** - Authentic Thai elements, not stereotypes
2. **Minimalist Elegance** - Paper & ink aesthetic, serif typography
3. **Functional Beauty** - Every design decision serves learning goals
4. **Accessibility** - Inclusive from day one
5. **Scalability** - Architecture ready for growth

**Design is not just how it looks - it's how it works for learners.**
