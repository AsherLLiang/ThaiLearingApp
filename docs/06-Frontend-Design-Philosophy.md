# 前端设计哲学

本文档解释了 Thai Learning App 用户界面背后的设计思维。

---

## 设计原则

### 1. **文化真实性**
融入泰语视觉元素，避免刻板印象。

**实现:**
- 泰语大象图案作为微妙的背景 (不卡通化)
- 泰语金 (#D4AF37) 作为主要强调色
- 支持泰语脚本 (Sarabun 字体系列)
- 双语 UI (主屏幕上的泰语问候: "ສະບາຍດີ")

**哲学:** 尊重文化，而不是讽刺它。

---

### 2. **纸墨美学**
灵感来自传统学习材料和书法。

**调色板:**
```typescript
{
  paper: '#FAF9F6',    // 米白色，像陈旧的纸张
  ink: '#1A1A1A',      // 深黑色用于文本
  sand: '#E5E2DB',     // 柔和的边框和分隔线
  taupe: '#8E8B82',    // 次要文本
  thaiGold: '#D4AF37', // 强调和高亮
}
```

**视觉语言:**
- 柔和、柔和的背景 (不是纯白色)
- 高对比度文本 (可读性优先)
- 微妙的边框 (不是刺眼的线条)
- 自然的颜色过渡

**灵感:** 日本文具、Moleskine 笔记本、传统泰语手稿

---

### 3. **极简主义的复杂性**
干净的界面，在交互时展现深度。

**方法:**
- **初看:** 简单、整洁
- **交互时:** 丰富的信息和反馈
- **渐进式披露:** 在需要时显示所需内容

**示例:**
- 主屏幕: 干净的主卡片，但在滚动时显示统计数据
- FloatingBubbles: 简单的堆叠，但在点击时显示详细复习
- 个人资料: 极简的部分，可展开以获取更多数据

---

### 4. **默认无障碍**
为所有用户设计，而不仅仅是理想条件。

**考虑因素:**
- **字体大小:** 正文最小 14px
- **触摸目标:** 交互元素最小 44px
- **颜色对比度:** 符合 WCAG AA 标准 (4.5:1 比例)
- **多语言:** 从第一天起就支持 i18n
- **安全区域:** 为刘海和主页指示器留出适当的插图

---

## 排版系统

### 字体系列

```typescript
// 英文和装饰性
playfairRegular: 'PlayfairDisplay_400Regular'  // 衬线，优雅
playfairBold: 'PlayfairDisplay_700Bold'

// 中文文本
notoSerifRegular: 'NotoSerifSC_400Regular'     // 针对 CJK 优化
notoSerifBold: 'NotoSerifSC_700Bold'

// 泰语脚本
sarabunRegular: 'Sarabun_400Regular'           // 泰语专用
sarabunBold: 'Sarabun_700Bold'
```

### 字体比例
```typescript
h1: 32,      // 页面标题
h2: 24,      // 章节标题
h3: 20,      // 卡片标题
body: 16,    // 主要内容
caption: 14, // 标签和元数据
small: 12,   // 辅助文本
```

### 排版规则

**1. 通过大小 + 粗细建立层级**
```typescript
// 标题
fontFamily: Typography.playfairRegular,
fontSize: 32,
// 不需要粗体 - 大小创造层级

// 正文
fontFamily: Typography.notoSerifRegular,
fontSize: 16,
```

**2. 语言适宜的字体**
```typescript
// 英文标题
fontFamily: Typography.playfairRegular  // ← 衬线

// 中文文本
fontFamily: Typography.notoSerifRegular  // ← CJK 优化

// 泰语字符
fontFamily: Typography.sarabunRegular    // ← 泰语脚本
```

**3. 优雅的字间距**
```typescript
// 标题: 稍微紧凑
letterSpacing: -0.5,

// 标签: 宽间距大写
letterSpacing: 1.5,
textTransform: 'uppercase',
```

---

## 布局模式

### 1. **安全区域优先**
始终尊重设备安全区域。

```typescript
import { SafeAreaView } from 'react-native-safe-area-context';

<SafeAreaView edges={['top']} style={styles.container}>
  {/* 内容避开刘海 */}
</SafeAreaView>
```

**为什么 `edges={['top']}`:**
- 顶部: 避开刘海/状态栏
- 底部: 自定义标签栏处理它

---

### 2. **一致的间距**
使用 8 的倍数以获得和谐感。

```typescript
// 间距比例
gap: 8,           // 紧凑
padding: 16,      // 舒适
margin: 24,       // 宽敞
marginTop: 32,    // 慷慨
```

**模式:**
- **内部间距 (padding):** 16px, 24px
- **外部间距 (margin):** 24px, 32px
- **间隙:** 8px, 16px

---

### 3. **基于卡片的设计**
内容组织在不同的卡片中。

**卡片解剖:**
```typescript
{
  backgroundColor: 'rgba(255, 255, 255, 0.8)',  // 半透明
  borderRadius: 24,                              // 柔和的角落
  padding: 24,                                   // 呼吸空间
  borderWidth: 1,
  borderColor: Colors.sand,                      // 微妙的轮廓
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.05,                           // 柔和的阴影
  shadowRadius: 4,
}
```

**类型:**
1. **主卡片** - 大，深色背景，特色内容
2. **统计卡片** - 中等，白色背景，指标
3. **玻璃卡片** - 模糊效果，覆盖内容

---

### 4. **网格系统**
具有一致比例的灵活布局。

```typescript
// 两列统计
<View style={{ flexDirection: 'row', gap: 16 }}>
  <View style={{ flex: 1 }}>{/* 统计 1 */}</View>
  <View style={{ flex: 1 }}>{/* 统计 2 */}</View>
</View>
```

**网格规则:**
- **移动端:** 最多 2 列
- **平板:** 最多 3 列 (未来)
- **间隙:** 项目之间一致的 16px

---

## 组件设计模式

### 1. **ThaiPatternBackground**
用于文化背景的装饰性 SVG 图案。

**设计决策:**
- **不透明度:** 0.1 - 0.15 (非常微妙，不分散注意力)
- **位置:** 绝对定位，覆盖屏幕
- **图案:** 泰语大象图案 (文化相关)
- **颜色:** 墨色 (匹配主题)

**何时使用:**
- 认证屏幕 (设置背景)
- 主屏幕 (品牌强化)
- **何时不使用:** 数据密集型屏幕 (避免视觉噪音)

---

### 2. **FloatingBubbles**
用于待处理复习的堆叠卡片界面。

**设计决策:**
- **3 卡片堆叠:** 显示深度而不压倒
- **旋转:** ±2° 增加趣味性
- **缩放:** 0.95, 0.9 用于透视
- **徽章:** 右上角的通知计数
- **阴影:** 深度提示

**交互:**
1. **空闲:** 温和的浮动动画 (如果已实现)
2. **点击:** 导航到复习模态框
3. **空:** 组件隐藏 (无占位符)

**灵感:** Duolingo 的练习提醒，Tinder 卡片堆叠

---

### 3. **LanguageSwitcher**
针对不同上下文的两种展示模式。

**紧凑变体 (认证屏幕):**
```
┌──────────┐
│ 🌐 中文  │  ← 地球图标 + 当前语言
└──────────┘
```

**完整变体 (个人资料屏幕):**
```
┌─────────────────────────┐
│  🇨🇳 中文  │  🇺🇸 EN  │  ← 两个选项的选择器
└─────────────────────────┘
```

**设计决策:**
- 紧凑: 节省空间，微妙
- 完整: 明确的选择，更容易理解
- 图标: 地球 (通用) vs 国旗 (特定)

---

### 4. **自定义标签栏**
带有凸起中心按钮的 3 标签布局。

**设计决策:**
```
         ┌───┐          ← 中心按钮凸起
    │        │        │
┌───┴────────┴────────┴───┐
│ 学习   首页   我的  │  ← 标签栏
└─────────────────────────┘
```

**特性:**
- **中心按钮:** 64px 直径，凸起 24px
- **模糊背景:** 仅 iOS (磨砂玻璃效果)
- **激活状态:** 深色图标 + 文本
- **标签:** 中文 (当前)，未来: i18n

**灵感:** Apple Music, Instagram (中心操作按钮模式)

---

## 颜色使用模式

### 颜色语义

| 颜色 | 用途 | 示例 |
|-------|-------|---------|
| **墨色** | 主要文本，深色卡片 | 标题，主卡片背景 |
| **纸色** | 背景，浅色卡片 | 屏幕背景，输入字段 |
| **泰语金** | 强调，成就 | 徽章，激活状态，高亮 |
| **灰褐色** | 次要文本，图标 | 标题，未激活标签 |
| **沙色** | 边框，分隔线 | 卡片轮廓，分隔符 |
| **白色** | 高亮，激活状态 | 标签栏，按钮背景 |

### 对比度 (WCAG AA)

```
墨色在纸色上:     17.2:1  ✅ (优秀)
泰语金在墨色上:  4.8:1  ✅ (通过)
灰褐色在纸色上:    4.1:1  ⚠️ (边缘，仅用于非关键文本)
```

---

## 动画哲学

### 当前方法: 极简

**理由:** 在添加动作之前建立稳固的信息架构。

**现有动画:**
1. **导航过渡** - Expo Router 默认 (滑动，模态框)
2. **可按压反馈** - 内置不透明度变化
3. **模糊效果** - 静态 iOS BlurView

### 未来动画机会

**候选元素:**
1. FloatingBubbles: 温和的浮动/漂移动画
2. 成就解锁: 五彩纸屑效果
3. 进度条: 填充动画
4. 卡片翻转: 复习模态框 (正面/背面)

**动画原则 (实施时):**
- **有目的:** 增强理解，不分散注意力
- **微妙:** 200-300ms 持续时间
- **自然:** 缓入缓出时间
- **高性能:** 使用 `react-native-reanimated` (已安装)

**灵感:** Duolingo (有趣但实用)，Headspace (平静且流畅)

---

## 交互模式

### 1. **点击目标**
最小 44x44px 以便舒适点击。

```typescript
// 标签按钮
<Pressable style={{ minHeight: 44, minWidth: 44 }}>
```

### 2. **反馈状态**
对所有交互的视觉响应。

```typescript
<Pressable
  style={({ pressed }) => [
    styles.button,
    pressed && { opacity: 0.7 }  // ← 按下状态
  ]}
>
```

### 3. **加载状态**
异步操作运行时始终显示。

```typescript
const [loading, setLoading] = useState(false);

{loading ? <ActivityIndicator /> : <Button />}
```

### 4. **空状态**
优雅地处理无数据。

```typescript
// 未来模式
{reviews.length === 0 ? (
  <EmptyState
    icon={BookOpen}
    message="今天没有复习任务！"
  />
) : (
  <FloatingBubbles reviews={reviews} />
)}
```

---

## 玻璃拟态元素

### BlurView 实现
```typescript
import { BlurView } from 'expo-blur';

<BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill}>
  <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}>
    {/* 内容 */}
  </View>
</BlurView>
```

**使用位置:**
- 主屏幕上的标题部分
- 标签栏背景 (仅 iOS)
- 未来: 模态框覆盖层

**平台差异:**
- **iOS:** 真正的模糊效果
- **Android:** 回退到纯色

---

## 响应式设计策略

### 当前: 移动优先
所有设计针对手机 (375-430px 宽度) 优化。

### 未来: 平板支持
```typescript
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

const styles = StyleSheet.create({
  container: {
    maxWidth: isTablet ? 672 : '100%',  // 在平板上限制
    alignSelf: 'center',
  }
});
```

**断点 (计划):**
- **手机:** < 768px (当前)
- **平板:** 768px - 1024px
- **大平板:** > 1024px

---

## 无障碍考虑

### 1. **屏幕阅读器支持** (未来)
```typescript
import { AccessibilityInfo } from 'react-native';

<Pressable
  accessibilityRole="button"
  accessibilityLabel="打开复习会话"
  accessibilityHint="双击开始复习抽认卡"
>
```

### 2. **动态类型支持** (未来)
尊重用户的字体大小偏好:
```typescript
import { useWindowDimensions } from 'react-native';

const { fontScale } = useWindowDimensions();
const fontSize = 16 * fontScale;
```

### 3. **色盲考虑**
不要仅依靠颜色来传递信息:
- ✅ 图标 + 颜色表示状态
- ❌ 仅颜色

**示例:**
```typescript
// 好: 图标 + 颜色
<View style={{ backgroundColor: Colors.thaiGold }}>
  <Star size={16} fill={Colors.ink} />  // ← 图标强化意义
  <Text>成就</Text>
</View>
```

---

## 灵感与参考

### 研究的设计系统
1. **Duolingo** - 游戏化，进度跟踪
2. **Headspace** - 平静美学，柔和色彩
3. **Apple Design** - 排版，间距，安全区域
4. **Material Design 3** - 抬起，表面
5. **日本文具** - 纸质纹理，柔和色调

### 泰语设计元素
1. **传统泰语手稿** - 金色强调色
2. **泰国寺庙建筑** - 几何图案
3. **泰国丝绸图案** - 大象图案

---

## 设计决策日志

### 为什么选择衬线字体?
**决策:** 使用 Playfair Display (衬线) 而不是无衬线
**理由:**
- 唤起传统学习 (教科书，手稿)
- 更优雅和独特
- 更利于品牌推广 (从典型应用中脱颖而出)

### 为什么选择米白色背景?
**决策:** 纸色 (#FAF9F6) 而不是纯白色 (#FFFFFF)
**理由:**
- 减少眼睛疲劳 (更柔和，更温暖)
- 匹配 "纸墨" 主题
- 更精致的外观

### 为什么选择凸起的标签按钮?
**决策:** 抬起的中心主页按钮而不是扁平标签
**理由:**
- 强调主要操作 (主页/仪表盘)
- 创造视觉兴趣
- 成功应用中的常见模式 (Instagram, TikTok)

### 为什么选择三个 Store?
**决策:** 分离 userStore, learningStore, languageStore
**理由:**
- 关注点分离
- 独立持久化
- 更容易测试和维护

---

## 组件库结构

### 原子设计方法 (非正式)

**原子:** (尚未实现)
- 文本
- 图标
- 间隔

**分子:**
- 按钮
- 卡片
- 语言切换器

**有机体:**
- FloatingBubbles
- ThaiPatternBackground
- CustomTabBar

**模板:**
- SafeAreaView 包装器
- ScrollView 容器

**页面:**
- HomeScreen
- ProfileScreen
- LoginScreen

---

## 设计 Tokens (未来)

### 计划的 Token 系统
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

**好处:**
- 跨组件的一致性
- 易于主题定制
- 集中式设计系统

---

## 性能考虑

### 图像优化
- 使用 WebP 格式 (更小的文件大小)
- 懒加载首屏以下的图像
- 缓存头像图像

### 动画性能
- 使用 `react-native-reanimated` (在 UI 线程上运行)
- 避免动画昂贵的属性 (避免 `height`，使用 `transform`)
- 限制并发动画

### 列表优化
- 对长列表使用 `FlatList` 和 `keyExtractor`
- 为固定大小的项目实现 `getItemLayout`
- 添加 `windowSize` 优化

---

## 暗黑模式策略 (未来)

### 计划的调色板
```typescript
const Colors = {
  light: {
    paper: '#FAF9F6',
    ink: '#1A1A1A',
    // ...
  },
  dark: {
    paper: '#1A1A1A',      // 深色背景
    ink: '#FAF9F6',        // 浅色文本
    thaiGold: '#FFD700',   // 更亮的金色
    // ...
  }
};

// 使用
const colorScheme = useColorScheme();
const colors = Colors[colorScheme ?? 'light'];
```

**挑战:**
- Thai Pattern Background 可见性
- 玻璃拟态效果
- 图像内容 (可能需要深色变体)

---

## 最佳实践总结

### ✅ 推荐
- 使用设计 tokens (颜色，排版)
- 尊重安全区域
- 在交互时提供视觉反馈
- 在多种屏幕尺寸上测试
- 从一开始就考虑无障碍性
- 保持动画微妙且有目的

### ❌ 避免
- 硬编码颜色或间距值
- 过度使用绝对定位
- 忽略平台差异 (iOS vs Android)
- 屏幕信息过载
- 为视觉效果牺牲性能
- 使用复杂的渐变 (难以维护)

---

## 设计系统成熟度

### 当前状态: **基础**
- ✅ 颜色调色板已定义
- ✅ 排版系统已建立
- ✅ 基础组件已创建
- ⚠️ 无正式文档
- ❌ 无 Storybook/组件预览
- ❌ 无设计 tokens 文件

### 下一步:
1. 创建设计 tokens 文件 (`src/constants/tokens.ts`)
2. 记录组件 API
3. 添加 Storybook 用于组件预览
4. 建立图标库标准
5. 创建暗黑模式变体

---

## 结论

Thai Learning App 的设计哲学集中于:

1. **文化尊重** - 真实的泰语元素，而非刻板印象
2. **极简优雅** - 纸墨美学，衬线排版
3. **功能美** - 每个设计决策都服务于学习目标
4. **无障碍** - 从第一天起就具有包容性
5. **可扩展性** - 为增长做好准备的架构

**设计不仅仅是它看起来如何 - 而是它如何为学习者服务。**
