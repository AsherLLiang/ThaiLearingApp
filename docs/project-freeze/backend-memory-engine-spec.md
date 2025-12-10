# 后端统一记忆引擎与模块解锁规格说明（Backend Memory Engine Spec, Freeze V2.0.1）

> 目录：`docs/project-freeze/backend-memory-engine-spec.md`  
> 范围：`cloudbase/functions/memory-engine`、`cloudbase/functions/learn-vocab` 中与记忆/进度相关的全部逻辑 + 数据库核心集合。  
> 目标：统一描述后端如何调度复习队列（SM‑2）、如何控制模块解锁，并与前端的 Alphabet / Vocabulary 模块规格对齐，避免前后端语义不一致。

---

## 1. 云函数与模块总览

### 1.1 memory-engine 云函数

**路径**：`cloudbase/functions/memory-engine`  
**入口**：`index.js`  
**触发方式**：HTTP 触发器，统一路由字段：

```js
// 请求体
{
  action: 'getTodayMemories' | 'submitMemoryResult' | 'submitRoundEvaluation'
        | 'checkModuleAccess' | 'getUserProgress' | 'getAlphabetLessons',
  data: { ... }
}
```

**主要 Action（现有 + 规划中的最小集合）：**

- `getTodayMemories`：统一获取“今日学习内容”（字母/单词/句子）。  
- `submitMemoryResult`：统一提交学习结果，**支持单条和批量**。  
- `submitRoundEvaluation`：字母模块专用三轮评估写入 `user_alphabet_progress`。  
- `checkModuleAccess`：检查模块访问权限（字母始终放行；其他模块需完成一定字母进度）。  
- `getUserProgress`：返回 `user_progress` 中的全局进度。  
- `getAlphabetLessons`：返回字母课程配置。  
- `registerStudySession`（**建议新增，支持前端记录学习时长与打卡**）：  
  - 由前端学习模块或壳层在一次学习结束时调用；  
  - 用于更新 `user_progress.totalStudyDays / streakDays / lastStudyDate` 以及 `LearningStore` 需要的总学习分钟数（可新增 `totalStudyMinutes` 字段）。

### 1.2 learn-vocab 云函数

**路径**：`cloudbase/functions/learn-vocab`  
**作用**：承载**词汇专用 API**（传统词汇模块），包括：

- `getTodayWords` / `updateMastery` / `toggleSkipWord` / `getVocabularyDetail`  
- `getReviewStatistics` / `getVocabularyList` / `getSkippedWords`

> 注意：`getTodayMemories` / `submitMemoryResult` 等**已经迁移至 `memory-engine`**。learn-vocab 文档仍然有效，但在项目冻结中，词汇模块优先使用 `memory-engine + vocabulary` 组合（详见 `vocabulary-module-spec.md`）。

### 1.3 核心数据库集合

重要集合见 `docs/database_schema.md`，与 memory-engine 直接相关的有：

- `memory_status`：统一记忆状态（字母/单词/句子）；  
- `user_progress`：整体模块解锁状态；  
- `user_alphabet_progress`：字母模块课程级进度（含三轮评估）；  
- `letters` / `vocabulary` / `sentences`：实体内容表。

---

## 2. 统一记忆引擎核心逻辑（memoryEngine.js + sm2.js）

### 2.1 createMemoryRecord / getOrCreateMemory

文件：`cloudbase/functions/memory-engine/utils/memoryEngine.js`

- `createMemoryRecord(db, userId, entityType, entityId, isLocked = false)`：
  - 在 `memory_status` 中插入一条新的记录：
    - `masteryLevel: 0.0`  
    - `reviewStage: 0`  
    - `easinessFactor: 2.5`  
    - `intervalDays: 1`  
    - `nextReviewAt`: 1 天后（若 `isLocked === false`）。  
- 若插入因唯一索引失败（重复 key），会退回到 `where({ userId, entityType, entityId }).get()` 并返回已有记录。

- `getOrCreateMemory(db, userId, entityType, entityId, isLocked = false)`：
  - 先 `where` 查询，如果存在则返回第一条；  
  - 否则调用 `createMemoryRecord`。

### 2.2 updateMemoryAfterReview（SM‑2 更新）

`updateMemoryAfterReview(db, userId, entityType, entityId, quality)`：

- 入参 `quality` 为中文字符串：`'陌生' | '模糊' | '记得'`。  
- 步骤：
  1. 通过 `getOrCreateMemory` 取得 `memory_status` 记录。  
  2. 使用 `calculateSM2Optimized(mastery, memory.intervalDays, memory.easinessFactor, memory.reviewStage)` 计算：  
     - `interval`（下次间隔天数）；  
     - `easinessFactor`（新的 EF）；  
     - `repetitions`（新的 reviewStage）。  
  3. 根据质量调整 `masteryLevel`：
     - `记得`：`+0.15`，上限 `1.0`；  
     - `模糊`：`+0.05`，下限 `0.0`；  
     - `陌生`：`-0.2`，下限 `0.0`。  
  4. 更新计数：
     - `streakCorrect`：记得则 `+1`，否则 `0`；  
     - `correctCount` / `wrongCount`：分别在记得 / 陌生时自增。  
  5. 计算 `nextReviewAt = now + intervalDays`。  
  6. 用 `update({ data: updateData })` 写回 `memory_status`。

返回给调用方的结构（被 `submitMemoryResult` 包装）：

```js
{
  entityType,
  entityId,
  quality,        // '陌生'/'模糊'/'记得'
  memoryState: {  // 更新后的关键字段
    masteryLevel,
    reviewStage,
    easinessFactor,
    intervalDays,
    nextReviewAt,
    correctCount,
    wrongCount,
    streakCorrect,
  }
}
```

### 2.3 SM‑2 优化算法（sm2.js）

`calculateSM2Optimized(mastery, currentInterval, easinessFactor, reviewCount)`：

- `mastery` 同样使用 `'陌生'/'模糊'/'记得'`；内部先映射到 **Quality**（1/3/5）。  
- 算法要点：

1. **陌生（quality < 3）**  
   - 视为“完全忘记”：  
     - `interval = 1`；  
     - `easinessFactor -= 0.2`（不低于 `1.3`）；  
     - 标记 `shouldResetCount = true`。

2. **模糊（quality === 3）**  
   - 缩短间隔，加强复习：  
     - `interval = currentInterval * FUZZY_MULTIPLIER（≈0.8）`，至少 1 天；  
     - `easinessFactor -= 0.1`，不低于 `1.3`。

3. **记得（quality > 3）**  
   - 若 `reviewCount < EARLY_INTERVALS.length`，使用早期固定间隔：`[1,2,4,7,14]`；  
   - 否则 `interval = round(currentInterval * EF)`。  
   - 按标准 SM‑2 公式更新 EF，并限制在合理区间。

返回：

```js
{
  interval,           // 用于 memory_status.intervalDays
  easinessFactor,     // 用于 memory_status.easinessFactor
  repetitions,        // 用于 memory_status.reviewStage
  nextInterval, nextEasinessFactor, nextReviewDate, shouldResetCount
}
```

### 2.4 今日待复习实体（getTodayReviewEntities）

`getTodayReviewEntities(db, userId, entityType, limit)`：

- 查询条件：

```js
where({
  userId,
  entityType,
  isLocked: false,
  nextReviewAt: db.command.lte(new Date())
})
.orderBy('nextReviewAt', 'asc')
.limit(limit)
```

- 返回 `memory_status` 文档数组，后续由 `getTodayMemories` 拼上实体详情。

---

## 3. getTodayMemories 行为（课程模式 + SRS 模式）

文件：`cloudbase/functions/memory-engine/handlers/getTodayMemories.js`

### 3.1 入口参数

```ts
{
  userId: string;
  entityType: 'letter' | 'word' | 'sentence';
  limit?: number;          // 默认 30
  includeNew?: boolean;    // 默认 true
  lessonId?: string;       // 字母课程模式下使用
}
```

### 3.2 步骤概览

1. **懒初始化**：
   - `entityType === 'letter'` → `ensureUserAlphabetProgress`（插入 `user_alphabet_progress` 占位记录）；  
   - `entityType === 'word'` → `ensureUserVocabularyProgress`（插入 `user_vocabulary_progress` 占位记录）。  

2. **模块访问检查**：`checkModuleAccess(db, userId, entityType)`：
   - 字母模块：永远允许访问；必要时自动调用 `initUserProgress` 创建 `user_progress`。  
   - 其他模块：要求 `letterCompleted === true` 或 `letterProgress >= 0.8`，否则返回 `MODULE_LOCKED`。  
   - 支持 `FORCE_UNLOCK` 环境变量强制放行；`userId === 'test-user'` 直接放行。

3. **每日学习量（limit）处理**：
   - 若后端 `user_progress.dailyLimit` 存在，则覆盖前端传入的 `limit`；  
   - `entityType === 'letter'` 时，始终以服务器配置为准（忽略前端动态调整）。  
   - 对其他实体，若前端传入 limit 与存量不同，会同时更新 `user_progress.dailyLimit`。

4. **获取今日复习实体（旧 + 新）**：
   - 旧实体：`getTodayReviewEntities(db, userId, entityType, effectiveLimit)`；  
   - 新实体（`includeNew === true` 且复习不足 `effectiveLimit`）：
     - `letter + lessonId`：从 `letters` 中按 `curriculumLessonIds: db.command.in([lessonId])` 取出课程中剩余所有字母（限 200），**不再按 limit 截断**；  
     - 其他情况：从对应集合（`vocabulary` 等）按 `lessonNumber` 与 `_id` 排序，取 `remainingSlots` 条。
   - 对每个新实体调用 `getOrCreateMemory(..., isLocked = false)` 生成 `memory_status` 记录。

5. **整合队列（3 新 1 复习）**：
   - 历史复习：`allMemories = [...reviewMemories]`；  
   - 新内容：

```js
for i in 0..newMemories.length-1:
  allMemories.push(newMemories[i]);
  if ((i + 1) % 3 === 0) {
    allMemories.push(newMemories[i - 2]); // 复习本组三字中的第1个
  }
```

> 这是一种“会话内小复习”实现，前端可以选择是否按该队列直接出题，或在自己的 Flow 中用作参考。

6. **拼接实体详情**：
   - 收集 `entityIds`，从对应集合（`letters`/`vocabulary` 等）查询；  
   - 为每个 memory 记录补上 `entity` 字段与 `memoryState`：

```js
memoryState: {
  masteryLevel,
  reviewStage,
  correctCount,
  wrongCount,
  streakCorrect,
  nextReviewAt,
  isNew: memory.reviewStage === 0
}
```

7. **字母课程元数据**（仅 `entityType === 'letter'`）：
   - 自动推导 `resolvedLessonId`（优先 `params.lessonId`，退化为实体上的 `curriculumLessonIds[0] / lessonId / lessonNumber`）；  
   - 通过 `getLessonMetadataFromDb` 与 `getPhonicsRuleByLessonFromDb` 返回 `lessonMetadata` 与 `phonicsRule`。

8. **响应结构：**

```ts
{
  items: Array<Letter | Vocabulary & { memoryState }>,
  summary: {
    total: number;
    reviewCount: number;
    newCount: number;
    entityType: 'letter' | 'word' | 'sentence';
  },
  lessonMetadata?: LessonMetadata;   // 仅字母
  phonicsRule?: PhonicsRule | null; // 仅字母
}
```

### 3.3 课程模式 vs 纯 SRS 模式

- **字母模块（课程模式）**：
  - 推荐前端在调用 `getTodayMemories` 时始终携带 `lessonId`；  
  - 后端对新字母“不再按 limit 截断”，而是一次性授权整课字母；  
  - `reviewMemories` 仍由 SM‑2 决定是否有“跨天复习”，但在项目冻结设计中，前端可以选择**忽略**这部分，只用 `memoryState` 做难度参考，将真正的课程队列逻辑放到前端（详见 `alphabet-module-spec.md` 第 11 章）。

- **词汇模块（纯 SRS 模式）**：
  - 前端不传 `lessonId`，只传 `entityType: 'word'`，由 `getTodayReviewEntities` + 新词逻辑共同决定今日队列；  
  - 词汇模块的详细行为由 `learn-vocab` 的 `getTodayWords` / `updateMastery` + `vocabulary-module-spec.md` 定义。

---

## 4. submitMemoryResult 行为（单条 + 批量）

文件：`cloudbase/functions/memory-engine/handlers/submitMemoryResult.js`

### 4.1 接口形态

支持两种用法：

1. **单条提交（旧版兼容）**

```json
{
  "action": "submitMemoryResult",
  "data": {
    "userId": "u_xxx",
    "entityType": "letter",
    "entityId": "TH_C_01",
    "quality": "记得"
  }
}
```

2. **批量提交（推荐）**

```json
{
  "action": "submitMemoryResult",
  "data": {
    "userId": "u_xxx",
    "results": [
      { "entityType": "letter", "entityId": "TH_C_01", "quality": "记得" },
      { "entityType": "letter", "entityId": "TH_C_02", "quality": "模糊" }
    ]
  }
}
```

### 4.2 行为

- 统一把参数转换为 `items[]` 数组；  
- 逐条调用 `updateMemoryAfterReview(db, userId, entityType, entityId, quality)`；  
- 聚合结果后使用 `createResponse(true, { updatedMemories }, '提交学习结果成功')` 返回。

> 与前端 Spec 对齐：  
> - **Alphabet 模块**：推荐在每个 Round 结束后，将“本轮出现过的字母 + 计算好的 `quality`”打包成 `results[]` 一次提交。  
> - **Vocabulary 模块**：推荐在一次会话结束后，对今日出现过的所有单词聚合为 `results[]` 一次提交，或使用 learn-vocab 的 `updateMastery`（二选一，保持一致即可）。

---

## 5. 学习会话登记（registerStudySession，规划中）

> 为了让前端 `LearningStore` 拥有可靠的数据来源，同时不在各模块中重复计算“打卡天数 / 总学习时长”，建议在 `memory-engine` 中新增 `registerStudySession` Action。  
> 该 Action 的逻辑足够简单，不涉及 SRS，只更新 `user_progress` 中的统计字段。

### 5.1 Action 设计

请求：

```ts
// action: 'registerStudySession'
interface RegisterStudySessionRequest {
  userId: string;
  module: 'letter' | 'word' | 'sentence' | 'article';
  minutes: number;              // 本次学习时长（向下取整的分钟数）
  finishedLessonId?: string;    // 若本次完成了某课，可选传入 lessonId
  date?: string;                // 可选，ISO 日期；缺省则使用服务器当天
}
```

行为：

- 按 `userId` 查找 `user_progress`；若不存在则先走 `initUserProgress`；  
- 计算当天是否首次学习：
  - 若 `lastStudyDate` 为 null 或早于当日，则 `totalStudyDays += 1`，`streakDays` 按天数是否连续递增或重置；  
  - 更新 `lastStudyDate = today`。  
- 增加新的字段（建议）：

```ts
user_progress.totalStudyMinutes += minutes;
```

- 若 `finishedLessonId` 存在，可选更新对应模块进度（例如字母课完成数），具体细节由各模块在前端处理。

响应：

```ts
interface RegisterStudySessionResponse {
  userId: string;
  totalStudyDays: number;
  streakDays: number;
  lastStudyDate: string;
  totalStudyMinutes?: number;
}
```

前端使用方式：

- 各学习模块在一次“正式学习结束”时调用：

```ts
await callCloudFunction('memory-engine', {
  action: 'registerStudySession',
  data: {
    userId,
    module: 'letter',        // 或 'word' ...
    minutes: sessionMinutes,
    finishedLessonId,
  },
});
```

- `LearningStore.registerStudySession` 可在内部调用此 Action，并同步更新本地仪表盘统计。

---

## 6. 模块解锁逻辑（checkModuleAccess）

文件：`cloudbase/functions/memory-engine/utils/memoryEngine.js` 中的 `checkModuleAccess`

### 5.1 特殊放行与初始化

- `userId === 'test-user'`：直接放行任意模块，返回一份最小进度对象，只用于本地开发。  
- 未找到 `user_progress`：
  - 若 `FORCE_UNLOCK === 'true'`：放行所有模块；  
  - 若 `moduleType === 'letter'`：自动调用 `initUserProgress`，初始化为：

```js
{
  letterCompleted: false,
  letterProgress: 0,
  wordUnlocked: false,
  wordProgress: 0,
  sentenceUnlocked: false,
  sentenceProgress: 0,
  articleUnlocked: false,
  currentStage: 'letter',
  ...
}
```

  - 其他模块：返回 `USER_PROGRESS_NOT_FOUND`。

### 5.2 正常判断

- 若设置了 `FORCE_UNLOCK`：直接放行所有模块，并将对应 `*Unlocked` 字段视为 true。  
- 字母模块：永远允许访问（用于补课或回顾）。  
- 其他模块（词汇/句子/文章）：使用统一规则：
  - 若 `letterCompleted === true` → 放行；  
  - 否则若 `letterProgress >= 0.8` → 放行；  
  - 否则返回 `MODULE_LOCKED`，附带当前 `letterProgress` 百分比。

> 与前端对齐：  
> - Courses 页在展示词汇课程时，可以根据 `getUserProgress` / `moduleAccessStore` 判断是否展示锁图标。  
> - 用户即使完成了字母课程，仍可随时返回字母模块继续练习；后端不会禁止。

---

## 6. 多模块切换与混合复习的约定

> 目前后端的设计**没有直接支持“混合字母 + 单词”的 getTodayMemories 队列**，所有调用都以 `entityType` 为粒度。  
> 如果未来需要“综合复习”页面，可以在前端按以下约定组合调用。

### 6.1 现状：按实体类型独立调度

- `getTodayMemories` 每次只接受一个 `entityType`：`letter` 或 `word`。  
- Alphabet 模块：建议始终在课程内部使用本地队列 + `submitMemoryResult`；  
- Vocabulary 模块：可以选择使用 `memory-engine`（`entityType: 'word'`），或沿用 `learn-vocab` 的 `getTodayWords`。

### 6.2 用户在模块间反复切换时的行为

1. 用户完成 Alphabet 某一课的三轮学习 → 前端聚合质量后调用 `submitMemoryResult`（letter），并在 `user_alphabet_progress` 中记录 Round3 通过结果 → 后端 `user_progress.letterCompleted` 或 `letterProgress` 被更新（由后续任务实现）。  
2. 当 `checkModuleAccess('word')` 返回 allowed 时，用户可以进入词汇模块学习。  
3. 若用户再次返回字母模块：
   - `checkModuleAccess('letter')` 永远允许；  
   - 若前端仍调用 `getTodayMemories(letter, { includeNew:true })`，后端会按 SM‑2 时间调度到期的字母 + 发现新字母时创建新 `memory_status`；  
   - 项目冻结方案中，推荐：**字母课程内不再依赖 `getTodayMemories` 的队列，而是以 lessonId + 本地 session 为主，`memory_status` 只存储质量结果**。

### 6.3 未来的“混合复习”页面（建议）

若未来要实现“每日综合复习页面（字母 + 单词）”，可以前端按以下方式实现，而无需改动后端：

1. 分别调用：

```ts
const letters = await getTodayMemories({ userId, entityType: 'letter', limit: L, includeNew: false });
const words   = await getTodayMemories({ userId, entityType: 'word',   limit: W, includeNew: false });
```

2. 在前端根据需要交错 `letters.items` 与 `words.items`，生成综合队列；  
3. 每道题结束后将结果记入本地 `perLetterStats` / `perWordStats`；  
4. 在会话结束时，将两类实体分别打包为：

```ts
submitMemoryResult({
  userId,
  results: [
    { entityType: 'letter', entityId, quality },
    { entityType: 'word',   entityId, quality },
    ...
  ]
});
```

后端无需关心题目是在哪个页面完成的，只要 `entityType` 与 `entityId` 一致即可。

---

## 7. 与前端 Spec 的一致性说明

### 7.1 字母模块

- 前端 Spec（`alphabet-module-spec.md` 第 11 章）中定义的：
  - “按字母 × 轮次聚合质量（FORGET/FUZZY/KNOW）”；  
  - “在 Round 结束时统一调用 `submitMemoryResult`（批量）”；  
  - “字母课程内的队列由前端负责，`getTodayMemories` 只作为课程初始化辅助”；  
 这些行为与后端现有接口完全兼容，并建议使用 **批量 results[] 提交**。

### 7.2 词汇模块

- 词汇模块可以选择两条路：
  1. 继续使用 `learn-vocab.getTodayWords + updateMastery`（完全独立于 memory-engine）；  
  2. 逐步迁移到 `memory-engine.getTodayMemories(entityType:'word') + submitMemoryResult`。  

- 项目冻结中，`vocabulary-module-spec.md` 采用的设计是：
  - 使用 `learn-vocab.getTodayWords` 获取当日单词列表（因为已有完善字段与 UI 需求）；  
  - 但在前端内部也可以使用 memory-engine 的 `submitMemoryResult` 进行统一 SM‑2 调度——只要将 `mastery` 映射为 `'陌生'/'模糊'/'记得'` 即可。

> 关键要求：  
> - 不论采用哪条路，**同一个单词的长期复习状态只能由一套表决定**（`user_vocabulary_progress` 或 `memory_status`），避免双源竞争；  
> - 若未来完全迁移到 `memory_status`，则 `user_vocabulary_progress` 可以逐步退化为统计表。

---

本规格文档冻结了后端统一记忆引擎与模块解锁的**真实行为**，并明确了与前端 Alphabet / Vocabulary 模块的契约与扩展方式。  
后续如需修改 memory-engine / learn-vocab 的逻辑，必须同步更新本文件及相应前端 Spec，保持“前后端单一真相”。***
