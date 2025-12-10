# Store 架构分析与说明

## 📚 什么是 Store？（初学者必读）

**Store** 就像一个"全局仓库"，用来存储应用的状态（数据）。

### 为什么需要 Store？

想象你在做一个购物应用：
- 用户登录后，很多页面都需要知道"谁登录了"
- 购物车里有什么商品，多个页面都要显示
- 如果每个页面都自己存一份数据，会很乱

**Store 的作用**：
1. **集中管理**：所有重要数据放在一个地方
2. **全局访问**：任何页面都能读取和修改
3. **持久化**：可以保存到手机存储，下次打开还在

---

## 🔍 当前项目中的 Store 分析

### 1. `alphabetLearningStore.ts` ❌ **建议删除**

**作用**：管理字母学习的"会话流程"

```typescript
// 它管理的是：
- 学习阶段（复习中/测试中/完成）
- 当前学习队列（今天要学哪些字母）
- 测试数据
- 解锁状态
```

**为什么要删除？**
1. **与后端强耦合**：它调用 API 获取"今日字母"，但现在我们用本地 JSON 数据
2. **功能重复**：`letterProgressStore` 已经能管理进度
3. **设计不匹配**：它是为"统一记忆引擎"设计的，但我们现在用简单的本地学习

**报错原因**：
```typescript
// 第 9-10 行引用的类型不存在
import type { 
  AlphabetLearningState,  // ❌ 这个类型在 alphabet.types.ts 中
  UnlockInfo 
} from '@/entities/types/alphabet.types';
```

---

### 2. `letterProgressStore.ts` ✅ **保留**

**作用**：管理字母学习的"本地进度"

```typescript
// 它管理的是：
progress: {
  masteredCount: 12,      // 已掌握 12 个字母
  totalCount: 76,         // 总共 76 个字母
  accuracy: 86,           // 正确率 86%
  masteredIds: ['TH_C_01', 'TH_C_02', ...]  // 哪些字母已掌握
}
```

**为什么保留？**
- ✅ 简单清晰，只管理进度数据
- ✅ 本地存储，不依赖后端
- ✅ 所有字母学习页面都在用它

**使用示例**：
```typescript
// 在组件中使用
const { progress, markAsMastered } = useLetterProgressStore();

// 显示进度
<Text>{progress.masteredCount} / {progress.totalCount}</Text>

// 标记为已掌握
await markAsMastered('TH_C_01');
```

---

### 3. `languageStore.ts` ✅ **保留**

**作用**：管理应用的"界面语言"

```typescript
// 它管理的是：
currentLanguage: 'zh'  // 当前语言：中文
// 或
currentLanguage: 'en'  // 当前语言：英文
```

**为什么保留？**
- ✅ 功能独立，管理国际化
- ✅ 全局需要，任何页面都可能切换语言
- ✅ 需要持久化，记住用户选择

**使用示例**：
```typescript
const { currentLanguage, changeLanguage } = useLanguageStore();

// 切换到英文
await changeLanguage('en');
```

---

### 4. `learningStore.ts` ⚠️ **建议重构或删除**

**作用**：管理"课程学习"的整体进度

```typescript
// 它管理的是：
currentCourse: { ... },           // 当前学习的课程
progress: {
  completedAlphabets: 30,        // 完成了 30 个字母
  completedVocabulary: 150,      // 完成了 150 个单词
  completedSentences: 20,        // 完成了 20 个句子
  totalScore: 1000,              // 总分
  streakDays: 7,                 // 连续学习 7 天
}
```

**问题**：
1. **数据硬编码**：初始化时写死了数据（第 33-40 行）
2. **与实际功能脱节**：现在只有字母学习在用，但它管理所有类型
3. **应该从后端获取**：这种整体进度应该从服务器同步

**建议**：
- 如果未来要做"整体学习统计"，保留但重构
- 如果只做字母学习，可以删除

---

## 📊 Store 对比表

| Store | 作用 | 数据来源 | 是否使用 | 建议 |
|-------|------|---------|---------|------|
| `alphabetLearningStore` | 字母学习会话流程 | 后端 API | ❌ 未使用 | **删除** |
| `letterProgressStore` | 字母学习本地进度 | 本地存储 | ✅ 正在使用 | **保留** |
| `languageStore` | 界面语言设置 | 本地存储 | ✅ 正在使用 | **保留** |
| `learningStore` | 整体学习进度 | 本地存储 | ⚠️ 部分使用 | **重构或删除** |

---

## 🛠️ 推荐的清理方案

### 方案 1：最小改动（推荐）

```bash
# 1. 删除 alphabetLearningStore.ts
rm src/stores/alphabetLearningStore.ts

# 2. 保留其他 Store
# - letterProgressStore.ts ✅
# - languageStore.ts ✅  
# - learningStore.ts ⚠️ 暂时保留，未来重构
```

### 方案 2：彻底清理

如果你确定只做字母学习功能：

```bash
# 删除不需要的 Store
rm src/stores/alphabetLearningStore.ts
rm src/stores/learningStore.ts

# 只保留
# - letterProgressStore.ts ✅
# - languageStore.ts ✅
```

---

## 💡 初学者建议

### 如何判断是否需要 Store？

**需要 Store 的情况**：
- ✅ 多个页面都要用这个数据
- ✅ 数据需要持久化保存
- ✅ 数据会频繁更新

**不需要 Store 的情况**：
- ❌ 只在一个页面用
- ❌ 临时数据，不需要保存
- ❌ 可以从 props 传递

### Store 的最佳实践

1. **职责单一**：一个 Store 只管一类数据
2. **命名清晰**：从名字就能看出管什么
3. **避免重复**：不要多个 Store 管同一件事

---

## 🔧 修复 alphabetLearningStore 报错的方法

如果你想保留它（不推荐），需要：

1. 检查 `alphabet.types.ts` 是否有这些类型定义
2. 确保 API 端点已实现
3. 更新类型导入路径

但**更好的做法是直接删除它**，因为：
- 功能已被 `letterProgressStore` 替代
- 依赖的后端 API 可能还没实现
- 增加了不必要的复杂度
