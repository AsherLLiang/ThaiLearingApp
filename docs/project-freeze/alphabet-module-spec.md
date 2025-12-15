# 泰语字母模块最终规格说明（Alphabet Module Spec, Freeze V2.0.1）

> 目录：`docs/project-freeze/alphabet-module-spec.md`  
> 适用范围：**字母模块前端 + memory-engine 中与字母相关的全部逻辑**  
> 目标：让任何开发者在不通读全部代码的前提下，仅凭本规格 + 相关类型定义，即可实现 / 重构 / 扩展字母模块的所有功能，而不会破坏全局架构。

---

## 0. 首发版冻结声明（当前真实实现）

> 禁止在此阶段合并题型体系 / 重构 Phase / 单边删除队列插入逻辑。

- 单一权威（Source of Truth）
  - 课程字母：DB `letters.curriculumLessonIds` + `getTodayMemories` (handlers/getTodayMemories.js 167-184)；前后端 `lessonMetadata` 仅展示/回退，且 **lesson1 元音存在不一致**（前端 ['า','ี','ู']，后端 ['า','ะ','ิ']）。
  - 队列生成：后端 `getTodayMemories` 先取复习（不按 lesson 过滤，存在跨课混入风险）+ 3新1复插入，然后前端 `buildAlphabetQueue` 再做 mini-review(每3个新字母回放) + final-review 全量 + error-review 追加。
  - 题型：实际渲染使用 `AlphabetGameType` + `lettersQuestionGenerator`（SOUND_TO_LETTER / LETTER_TO_SOUND / CONSONANT_CLASS / INITIAL_SOUND / FINAL_SOUND；TONE_CALCULATION/PHONICS_MATH 仍为占位）。`QuestionType` / `alphabetQuestionTypes` / `alphabetQuestionGenerator` 为历史定义，未在首发版生效。
  - Phase：UI/逻辑以 `queue.source`（new/mini-review/final-review/error-review）派生，`LearningPhase` 枚举的 7 阶段未被当前实现驱动。

- 已知偏差（需后续治理，当前不改代码）
  - 课程元数据前后端不一致；`SEQUENCE_LESSONS` 与课程列表数量不对齐。
  - 复习池不按 lesson 过滤，可能将其他课到期字母混入本课队列。
  - 双层 3新1复插入导致节奏与冻结设计不完全一致。
  - 多套题型/Phase 定义并存，可能导致新代码误用历史接口。

- 文档使用提示
  - 本节描述的是“首发版现状”，作为冻结记录；后续迭代需在明确治理计划后再调整权威定义。

## 1. 模块定位与边界

### 1.1 模块职责

字母模块（Alphabet Module）负责：

- 提供一套 **循序渐进的泰语字母课程**（当前为 Lesson1~7）；  
- 通过 memory-engine 的统一记忆队列，实现：
  - 昨日复习 → 今日学习 → 小复习（Mini Review）→ 末尾复习（Final Review）→ 今日补救（Today Remedy）→ 三轮评估（Round Evaluation）；
  - 将每个字母的记忆情况写入 `memory_status`，并将每课三轮统计写入 `user_alphabet_progress`；
- 提供题型驱动的学习体验（当前由 `lettersQuestionGenerator` 提供多种题型，未来由 6 大题型协议接管）。

### 1.2 模块边界（与其他模块的关系）

- **字母模块使用的共享设施：**
  - 统一记忆引擎：`cloudbase/functions/memory-engine`
  - 全局进度 / 解锁：`moduleAccessStore` + memory-engine handlers
  - 全局课程入口：Courses 页 + `learningStore`（当前学习的主课程 / 字母大课程）
  - 课程元数据：`alphabet_lessons` + `phonics_rules`（DB） + `lessonMetadata.config.ts`（前端回退）
  - 字母实体数据：`letters` 集合（来源于 `assets/courses/letters_final.enriched.json`）

- **字母模块不做的事情：**
  - 不直接操作 `memory_status` / `user_*_progress`（全部交给 memory-engine handlers）；
  - 不在组件中直接拼接云函数 URL（统一通过 `callCloudFunction`）；
  - 不定义用户认证 / 主课程选择（由 Auth 模块 + Courses 模块处理）。

---

## 2. 相关代码文件总览（“类图视角”）

本节列出字母模块涉及的所有关键文件和其职责，类似“类图 + 包图”的文字版本。

### 2.1 前端路由层（app/）

- `app/(tabs)/courses.tsx`
  - 职责：
    - 展示全部课程（基础泰语 1~4 + 字母项目等）；
    - 字母入口使用 `AlphabetCourseCard` 渲染；
    - 点击字母卡片时导航到 `app/alphabet/index.tsx`。
  - 与字母模块的关系：
    - 只作为“入口触发器”，本身不包含字母逻辑。

- `app/alphabet/index.tsx`（当前：**字母课程总览页，小课程列表**）
  - 职责：
    - 展示当前字母课程列表（Lesson1~7）；
    - 计算整体完成度（使用 `useAlphabetStore` 的 `completedCount` / `totalCount`）；
    - 从后端拉取课程元数据（`getAlphabetLessons`）或回退到前端 `lessonMetadata.config.ts`；
    - 按“累计已完成字母数”决定课程解锁与“当前课程”状态；
    - 点击“开始学习”按钮时跳转到 `/alphabet/[lessonId]`。
  - 未来规划：
    - 可以演化为“大课程入口页 + 小课程列表页”的组合，目前仍作为“小课程列表页”使用。

- `app/alphabet/[lessonId].tsx`
  - 职责：
    - 从路由参数获取 `lessonId`；
    - 调用 `useAlphabetLearningEngine(lessonId)` 初始化学习引擎；
    - 将 Hook 返回的状态与回调全部传入 `AlphabetLearningEngineView`；
    - 处理“返回”导航（`router.back()`）。

### 2.2 字母模块调用栈概览

```text
┌──────────────────────────────────────────────┐
│ React Native Screens / Components           │
│ app/(tabs)/courses.tsx                      │
│ app/alphabet/*                              │
│ src/components/learning/alphabet/*          │
└──────────────────────────────────────────────┘
                      │
                      │ 通过 props / 事件调用
                      ▼
┌──────────────────────────────────────────────┐
│ 业务 Hooks                                   │
│ src/hooks/useAlphabetLearningEngine.ts       │
└──────────────────────────────────────────────┘
                      │
                      │ 调用 Zustand Store
                      ▼
┌──────────────────────────────────────────────┐
│ Zustand Stores                              │
│ src/stores/alphabetStore.ts                 │
│ src/stores/moduleAccessStore.ts             │
│ src/stores/userStore.ts                     │
└──────────────────────────────────────────────┘
                      │
                      │ 使用 apiClient / callCloudFunction
                      ▼
┌──────────────────────────────────────────────┐
│ apiClient / callCloudFunction               │
│ src/utils/apiClient.ts                      │
└──────────────────────────────────────────────┘
                      │
                      │ HTTP 调用 CloudBase HTTP 触发器
                      ▼
┌──────────────────────────────────────────────┐
│ CloudBase Functions                         │
│ cloudbase/functions/memory-engine           │
└──────────────────────────────────────────────┘
                      │
                      │ 通过 wx-server-sdk 访问 DB
                      ▼
┌──────────────────────────────────────────────┐
│ CloudBase DB                                │
│ letters, alphabet_lessons, phonics_rules    │
│ memory_status, user_alphabet_progress       │
└──────────────────────────────────────────────┘
```

### 2.2 前端组件层（src/components/learning/alphabet）

- `AlphabetLearningEngineView.tsx`
  - 职责：
    - **字母学习 UI 容器**：小课内所有 Phase 的统一渲染入口；
    - 按 `phase` 决定渲染哪种子视图：
      - 昨日复习 / 昨日补救 / Final Review / Today Remedy → `AlphabetReviewView`
      - Mini Review → `MiniReviewQuestionComponent`（mini 题型组件）
      - 今日学习 → `PhonicsRuleCard` 或 `AlphabetLearningView`
      - 完成 → 成绩汇总视图（展示三轮评估结果）
    - 不直接调用 Store 或 cloud function，所有业务行为通过 props 回调上浮给 Hook。

- `AlphabetLearningView.tsx`
  - 职责：
    - “教学卡”视图：展示单个字母的详细信息（字形、罗马音、音节、例词、键盘键等）并支持播放发音；
    -使用 `AlphabetLearningState` 作为输入，内部从 `letter` 字段中拆出需要展示的各种属性；
    - 利用 Expo AV 播放本地音频：
      - 优先使用 `letter.fullSoundLocalPath / syllableSoundLocalPath / letterPronunciationLocalPath`；
      - 回退时可使用 `alphabet.audioUrl`（由 Store 预下载填充）。

- `AlphabetReviewView.tsx`
  - 职责：
    - “复习题目视图”：针对当前字母生成一道题目并展示；
    - 使用 `generateAlphabetQuestion(letter, pool, preferredType)` 生成题目；
    - 渲染多种“基础题型”（听音选字、看字选音、syllable 拼读等）；
    - 在用户答题后调用 `onAnswer(isCorrect)`，再根据需要调用 `onNext()` / `onBack()`。

> 注意：当前 `AlphabetReviewView`+`lettersQuestionGenerator` 提供的是“旧版题型系统”，  
> 未来会被 `docs/project-freeze/DESIGN_SPEC.md` 中定义的 6 大题型协议和 Question Engine 渐进替换。

### 2.3 Hooks 层（src/hooks）

- `useAlphabetLearningEngine.ts`
  - 职责：
    - **课程级学习引擎**，即你设计的 8 Phase + 3 轮评估逻辑的前端实现；
    - 关键职责拆分：
      1) 初始化当前 Lesson 的会话状态：调用 `alphabetStore.initializeSession(userId, { lessonId })`；
      2) 管理 Phase 状态机：
         - `phase: 'yesterday-review' | 'yesterday-remedy' | 'today-learning' | 'today-mini-review' | 'today-final-review' | 'today-remedy' | 'finished'` 等；
         - 决定何时触发 Mini Review、Final Review、Today Remedy、三轮评估；
      3) 处理答题逻辑：
         - 将 UI 的 isCorrect 映射到 `alphabetStore.submitResult(userId, isCorrect)`；
         - 维护错题集合 `wrongAnswers`，供 Round Evaluation 使用；
      4) 管理三轮评估：
         - `currentRound: 1 | 2 | 3`；
         - `roundEvaluation` 记录每轮正确率与是否通过；
         - 当三轮完成且通过时，调用 `markAlphabetLessonCompleted(lessonId)`（来自 `moduleAccessStore`）。
    - 对外暴露：
      - `initialized`：是否完成初始化；
      - `phase` / `currentRound` / `roundEvaluation`；
      - `currentItem: AlphabetLearningState | null`；
      - `currentQuestionType`（复习题型偏好）；
      - `letterPool: Letter[]`（今日涉及的所有字母，供题型引擎使用）；
      - 回调：
        - `onAnswer(isCorrect, questionType)`；
        - `onNext()`；
        - `onSkipYesterdayReview()`；
        - `onCompletePhonicsRule()`；
        - `onMiniReviewAnswer()` / `onMiniReviewNext()`。

- `useModuleAccess.ts`
  - 与字母模块关系：
    - 提供 `markAlphabetLessonCompleted(lessonId)` 给 `useAlphabetLearningEngine` 使用；
    - 实际写入 `user_alphabet_progress` / `user_progress` 相关字段的职责在后端 memory-engine + learn-vocab。

### 2.4 Store 层（src/stores）

- `alphabetStore.ts`
  - 已在 snapshot 文档中有详细介绍，这里聚焦与字母模块的连接点：
  - 核心状态（节选）：
    - `queue: AlphabetLearningState[]`：本次会话的字母队列；
    - `currentIndex: number` / `currentItem: AlphabetLearningState | null`；
    - `completedCount: number` / `totalCount: number`：本设备上已完成字母数量和总数（用于课程解锁）；
    - `lessonMetadata: LessonMetadata | null`：当前 Lesson 的元数据；
    - `phonicsRule: PhonicsRule | null`：当前 Lesson 的拼读规则；
    - `cachedAudioKeys: string[]`：已预下载音频的 key 列表；
    - `phase: LearningPhase`：会话级别（IDLE/COMPLETED 等）。
  - 关键方法：
    - `initializeSession(userId, { limit?, lessonId? })`
      - 调用 `callCloudFunction('getTodayMemories', { userId, entityType: 'letter', limit, includeNew: true, lessonId }, { endpoint: API_ENDPOINTS.MEMORY.GET_TODAY_MEMORIES.cloudbase })`；
      - 将返回的 `items` 映射为 `AlphabetLearningState` 队列；
      - 设置 `lessonMetadata` / `phonicsRule`；
      - 启动预下载任务，将 COS 音频下载到本地并更新 `letter.*LocalPath` 和 `audioUrl`。
    - `submitResult(userId, isCorrect)`
      - 将 `isCorrect` 映射为 `QualityButton.KNOW | QualityButton.FORGET`；
      - 调用 `callCloudFunction('submitMemoryResult', { userId, entityType: 'letter', entityId: currentItem.alphabetId, quality }, { endpoint: API_ENDPOINTS.MEMORY.SUBMIT_MEMORY_RESULT.cloudbase })`；
      - 更新本地 `currentAttempts` / `qualityHistory` / `isCompleted`；
      - 调用 `next()` 自动进入下一题或标记 `phase=COMPLETED`。
    - `submitRoundEvaluation(params)`
      - 调用 `callCloudFunction('submitRoundEvaluation', { userId, entityType: 'letter', lessonId, roundNumber, totalQuestions, correctCount, accuracy }, { endpoint: API_ENDPOINTS.MEMORY.SUBMIT_ROUND_EVALUATION.cloudbase })`；
      - 不改变记忆队列，只做统计写入。

### 2.5 配置 / 类型 / 工具层

- `src/config/alphabet/lessonMetadata.config.ts`
  - 前端版课程元数据（Lesson1~7）：
    - `LESSON_METADATA: Record<string, LessonMetadata>`；
    - `LessonMetadata` 定义（来自 `phonicsRule.types.ts`）包括：
      - lessonId, title, description, consonants[], vowels[], tones[];
      - phonicsRuleId, totalCount, minPassRate, miniReviewInterval, order。
  - 提供辅助函数：
    - `getLessonMetadata(lessonId)`：按 id 获取；
    - `getAllLessons()`：按 order 排序返回所有课程；
    - `getLessonByLetter(thaiChar)`：通过字母反查课程。

- `src/entities/types/alphabet.types.ts`
  - 定义与字母模块相关的 TypeScript 类型：
    - `AlphabetLearningState`：与 `alphabetStore` 中同名类型相对应；
    - `AlphabetTest`, `AlphabetTestQuestion`, `AlphabetTestResult`：用于单独字母测试功能（非 3-Round 主流）。

- `src/entities/enums/LearningPhase.enum.ts`
  - 定义全局学习阶段枚举 `LearningPhase`，字母模块使用其中的 IDLE / COMPLETED 等状态。

- `src/utils/lettersQuestionGenerator.ts`
  - 职责：
    - 针对单个 `Letter` + 字母池 `pool` 生成复习题目；
    - 题型 `QuestionType` 包括：SOUND_TO_LETTER、LETTER_TO_SOUND、SYLLABLE、REVERSE_SYLLABLE、MISSING_LETTER、FINAL_CONSONANT、CLASS_CHOICE、LETTER_NAME 等；
    - 生成结构：
      - `AlphabetQuestion`：包含 `type`, `stem`, `options`, `correct`, `audioUrl`；
    - 使用 `getLetterAudioUrl(letter, 'letter' | 'syllable')` 决定播放哪个音频。
  - 当前作用：
    - 被 `AlphabetReviewView` 使用，作为“基础题型”生成器；
    - 在未来会与 `project-freeze/DESIGN_SPEC.md` 中的 6 大题型整合。

### 2.6 后端 memory-engine（cloudbase/functions/memory-engine）

- `index.js`
  - 职责：
    - CloudBase 云函数入口；
    - 解析 HTTP 请求 body，抽取 `{ action, data }`；
    - 根据 action 分发至：
      - `getTodayMemories`, `submitMemoryResult`, `submitRoundEvaluation`, `checkModuleAccess`, `getUserProgress`, `getAlphabetLessons` 等。

- `handlers/getTodayMemories.js`
  - 字母分支逻辑：
    - 当 `entityType === 'letter'` 时：
      1. 从 `alphabet_lessons` 中读取 `lessonId` 对应配置（consonants/vowels/tones）；
      2. 从 `letters` 集合查询属于该课程的字母（使用 curriculumLessonIds 字段）；
      3. 从 `memory_status` 中读取每个字母的记忆状态；
      4. 可从 `user_alphabet_progress` / `phonics_rules` 中补充 lessonMetadata / phonicsRule；
      5. 返回：
         - `items: Array<Letter & { memoryState?: MemoryStatus }>`；
         - `summary: { total, newCount, reviewCount, entityType: 'letter' }`；
         - `lessonMetadata`；
         - `phonicsRule`。

- `handlers/submitMemoryResult.js`
  - 字母分支逻辑：
    - 根据 `userId + entityType = 'letter' + entityId` 查找 `memory_status` 文档；
    - 使用统一算法 `computeNextReview(doc, quality)` 更新 masteryLevel / reviewStage / nextReviewAt 等；
    - 更新或插入该文档。

- `handlers/submitRoundEvaluation.js`
  - 字母专用：
    - 将 `{ userId, entityType: 'letter', lessonId, roundNumber, totalQuestions, correctCount, accuracy }` 写入 `user_alphabet_progress`；
    - 更新 `currentRound`，在 `roundHistory` 数组中追加新记录。

- `handlers/getAlphabetLessons.js`
  - 职责：
    - 返回 `alphabet_lessons` 集合中的所有课程配置；
    - 在前端 `app/alphabet/index.tsx` 中用作课程总览数据源。

---

## 3. 页面与导航逻辑（前端路由 Flow）

本节从“用户进入字母模块”的角度，梳理路由与组件的调用次序。

### 3.1 从 Courses 页进入字母模块

（当前实现；未来大课程页会增加一层，但总体路线不变）

```text
┌──────────────────────────────────────────────┐
│ app/(tabs)/courses.tsx                      │
│ 课程总览页                                  │
└──────────────────────────────────────────────┘
                    │
                    │ 点击“泰语字母”卡片
                    ▼
┌──────────────────────────────────────────────┐
│ app/alphabet/index.tsx                      │
│ 字母课程总览（Lesson1~7 列表）              │
└──────────────────────────────────────────────┘
                    │
                    │ 点击某个 Lesson 卡片的“开始学习”
                    ▼
┌──────────────────────────────────────────────┐
│ app/alphabet/[lessonId].tsx                │
│ 单课学习流（3 轮 + Phase 状态机）           │
└──────────────────────────────────────────────┘
```

### 3.2 字母课程总览页：`app/alphabet/index.tsx`

- 初始化流程：
  1. 组件挂载后，调用 `callCloudFunction('getAlphabetLessons')`：
     - endpoint 使用 `API_ENDPOINTS.MEMORY.GET_TODAY_MEMORIES.cloudbase`（复用 memory-engine HTTP 入口）；
     - 若成功，使用返回的 `lessons: LessonMetadata[]`；
     - 若失败，使用 `getAllLessons()` 从本地 `lessonMetadata.config.ts` 获取课程表；
  2. 将 `LessonMetadata[]` 映射为本地 `LessonCardProps[]`：
     - `id` = lessonId；
     - `title` / `description` = 元数据；
     - `letterKeys` = `consonants + vowels + tones`；
     - `progress.total` = `lesson.totalCount`。

- 解锁逻辑：
  - 从 `useAlphabetStore()` 读取：
    - `completedCount`：本地已完成字母数；
    - `totalCount`：当前会话中字母总数。
  - 通过 `lessons.reduce` 计算每课的累计字母数量 `cumulativeCounts`；
  - 对于第 i 课：
    - `unlocked = index === 0 || completedCount >= cumulativeCounts[index - 1]`；
    - `isCurrent = completedCount < cumulativeCounts[index] && unlocked`。

- UI 行为：
  - 每个 Lesson 卡片显示：
    - 标题 / 描述；
    - 本课字母数；
    - 当前进度（暂以 completedCount 与 cumulativeCounts 计算）。
  - 点击“开始学习”按钮：
    - `router.push(`/alphabet/${lesson.id}`)`；
    - 不直接操作 Store，Store 初始化在 `[lessonId]` 页面进行。

### 3.3 单课学习入口：`app/alphabet/[lessonId].tsx`

```ts
// 关键伪代码结构
const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
const router = useRouter();

const engine = useAlphabetLearningEngine(lessonId);

return (
  <AlphabetLearningEngineView
    {...engine}
    onBack={() => router.back()}
  />
);
```

- `[lessonId]` 页面不直接关心：
  - 队列如何生成；
  - Phase 如何切换；
  - 题型如何渲染。
- 全部交给：
  - `useAlphabetLearningEngine`（业务状态机）；
  - `AlphabetLearningEngineView`（视图路由器）。

---

## 4. 学习引擎：useAlphabetLearningEngine（Phase 逻辑）

### 4.1 Phase 状态与 Round 概念

在 Hook 内部，我们有两层“阶段”：

- **Phase（阶段）**：代表当前 UI 所在的业务阶段：
  - `yesterday-review`：昨日复习；
  - `yesterday-remedy`：昨日错题补救；
  - `today-learning`：今日学习；
  - `today-mini-review`：今日小复习（每学 3 个字母触发一次）；
  - `today-final-review`：今日末尾复习；
  - `today-remedy`：今日错题补救；
  - `finished`：课程三轮评估结束。
- **Round（三轮评估轮次）**：
  - `currentRound: 1 | 2 | 3`；
  - 对应你设计的：
    - Round1：认知（认字/听音）；
    - Round2：属性（辅音类别等）；
    - Round3：应用（变形/声调等，未来由 Question Engine 体现）。

### 4.1.0 字母课程整体阶段流程图（类似第一张图）

> 这张图是 **“理想状态 / 目标设计”** 的线性流程图，  
> 展示从 Lesson Start 到三轮评估完成的 Phase 流程与关键方法调用。

```text
┌──────────────────────────────────────────────┐
│ Lesson Start                                │
│ 首次进入 /alphabet/[lessonId]               │
└──────────────────────────────────────────────┘
                       │
                       │ 调用 useAlphabetLearningEngine(lessonId)
                       ▼
┌──────────────────────────────────────────────┐
│ 初始化后端队列                               │
│ alphabetStore.initializeSession(userId,{    │
│   lessonId                                  │
│ })                                          │
│ → callCloudFunction('getTodayMemories',…)   │
└──────────────────────────────────────────────┘
                       │
                       │ 返回 items[] = 昨日需复习 + 今日新字母
                       │ （memory-engine 按课程 + SRS 过滤）
                       ▼
┌──────────────────────────────────────────────┐
│ Phase 1: yesterday-review（昨日复习）       │
└──────────────────────────────────────────────┘
        │                     │
        │ 答对                │ 答错
        ▼                     ▼
  nextInQueue()      wrongAnswers.add(alphabetId)
        │
        ▼
┌──────────────────────────────────────────────┐
│ Phase 2: yesterday-remedy（昨日补救）       │
│ 按 wrongAnswers 出复习题                    │
└──────────────────────────────────────────────┘
        │
        ├── 仍有错题 → 回到补救阶段出题
        │
        └── 错题清空 → 进入今日学习
                       ▼
┌──────────────────────────────────────────────┐
│ Phase 3: today-learning（今日学习）         │
│ 三新一复习 + Mini Review                    │
└──────────────────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────────────────┐
│ Phase 4: today-mini-review / final-review   │
└──────────────────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────────────────┐
│ Phase 5: today-remedy（今日补救）           │
│ 针对今日错题继续出题                        │
└──────────────────────────────────────────────┘
        │
        ├── 仍有错题 → 留在补救阶段
        └── 错题清空 → 进入三轮判定
                       ▼
┌──────────────────────────────────────────────┐
│ Phase 6: round-evaluation（三轮评估）       │
│ submitRoundResults() → submitRoundEvaluation│
└──────────────────────────────────────────────┘
        │
        ├── 若 currentRound < 3 且本轮通过 →   │
        │    currentRound + 1, phase='yesterday-review'
        │
        └── 若 currentRound = 3 且通过 →       │
                       ▼
┌──────────────────────────────────────────────┐
│ Phase 7: finished（课程完成）               │
│ markAlphabetLessonCompleted(lessonId)       │
└──────────────────────────────────────────────┘
```

### 4.1.1 字母学习 Phase + 方法调用总览（Mermaid）

```text
【调用关系概览】

app/alphabet/[lessonId].tsx
  └─ 调用 useAlphabetLearningEngine(lessonId)
       ├─ 初始化阶段：
       │    └─ alphabetStore.initializeSession(userId,{ lessonId })
       │         └─ callCloudFunction('getTodayMemories', { entityType:'letter', lessonId })
       │              └─ memory-engine.handlers.getTodayMemories
       │                   └─ 返回 items + memoryState + lessonMetadata + phonicsRule
       │
       ├─ Phase = 'yesterday-review' / 'today-final-review' / 'today-remedy'
       │    └─ AlphabetLearningEngineView → AlphabetReviewView
       │         └─ 用户答题 onAnswer(isCorrect, qType)
       │              └─ useAlphabetLearningEngine.handleAnswer
       │                   └─ alphabetStore.submitResult(userId, isCorrect)
       │                        ├─ callCloudFunction('submitMemoryResult', {...})
       │                        └─ 更新本地 currentAttempts / isCompleted
       │                             └─ alphabetStore.nextInQueue()
       │                                  └─ 切换 currentItem
       │
       ├─ Phase = 'today-learning'
       │    ├─ 若 showPhonicsRuleCard → PhonicsRuleCard
       │    └─ 否则 → AlphabetLearningView（教学卡）
       │
       ├─ Phase = 'today-mini-review'
       │    └─ MiniReviewQuestionComponent
       │         └─ onMiniReviewAnswer / onMiniReviewNext
       │            （当前只影响本地 miniReview 队列，不调用后端）
       │
       └─ 三轮结束：
            └─ submitRoundResults()
                 ├─ alphabetStore.submitRoundEvaluation({ userId, lessonId, ... })
                 │    └─ callCloudFunction('submitRoundEvaluation', {...})
                 │         └─ memory-engine.handlers.submitRoundEvaluation
                 └─ 若 currentRound < 3 → currentRound++，phase='yesterday-review'
                    若 = 3 → moduleAccessStore.markAlphabetLessonCompleted(lessonId)，phase='finished'
```

### 4.2 初始化：调用 alphabetStore.initializeSession

核心逻辑（伪代码）：

```ts
const { queue, currentItem, lessonMetadata, phonicsRule, initializeSession, submitResult, submitRoundEvaluation: submitRoundToStore, next: nextInQueue } = useAlphabetStore();
const { markAlphabetLessonCompleted } = useModuleAccessStore();
const { currentUser } = useUserStore();
const userId = currentUser?.userId ?? 'test-user';

useEffect(() => {
  let cancelled = false;

  (async () => {
    try {
      await initializeSession(userId, { lessonId });  // 调用 memory-engine.getTodayMemories
    } catch (e) {
      if (!cancelled) {
        setInitialized(true);
        setPhase('finished'); // 出错时视为无法学习，直接完成
      }
      return;
    }
    if (!cancelled) setInitialized(true);
  })();

  return () => { cancelled = true; };
}, [lessonId, userId, initializeSession]);
```

- 依赖：
  - `alphabetStore.initializeSession(...)` 完成与 memory-engine 的交互，准备好 `queue` 和 `currentItem`；
  - `lessonMetadata` / `phonicsRule` 被保存在 `alphabetStore` 中，供 UI 使用。

### 4.3 昨日复习与跳过逻辑

- 初始化后 Phase 默认进入 `'yesterday-review'`。
- 使用一个 effect 判断是否存在“非新字母”：

```ts
useEffect(() => {
  if (!initialized) return;
  if (phase !== 'yesterday-review') return;

  const hasNonNew = queue.some(
    (item) => item.memoryState && item.memoryState.isNew === false,
  );

  if (!hasNonNew) {
    setPhase('today-learning'); // 没有旧字母时跳过昨日复习
  }
}, [initialized, phase, queue]);
```

- `onSkipYesterdayReview`：
  - 暴露给 UI，在 `AlphabetLearningEngineView` 显示“跳过昨日复习”按钮；
  - 点击时直接 `setPhase('today-learning')`。

#### 4.3.1 yesterday-review 的数据来源与判定规则

- **数据来源：**
  - 所有题目数据都来自 `alphabetStore.queue`，而 `queue` 又完全由 `memory-engine.getTodayMemories` 返回的 `items` 映射而来：
    - `items: Array<Letter & { memoryState?: MemoryStatus }>`；
    - 每个 `item.memoryState` 由后端根据 `memory_status` 计算得到。
  - 前端本身**不会单独再查 DB**，所有“昨日复习/今日新字母”的判断都基于 `memoryState`。

- **什么内容会被认为是“昨日复习”？**
  - memory-engine 在字母分支中返回 `summary.newCount` / `summary.reviewCount`，并为每个字母附加：
    - `memoryState.isNew: boolean`：
      - `true`：后端认为该字母是“新字母”（没有历史记忆记录）；
      - `false`：已有记忆记录，需要复习。
  - 在前端：
    - **是否存在昨日复习阶段**：仅检查
      ```ts
      queue.some(
        (item) => item.memoryState && item.memoryState.isNew === false,
      );
      ```
      - 若存在任意 `isNew === false` 的字母，则保留 `'yesterday-review'` Phase；
      - 若所有字母 `isNew === true`，则认为没有“旧字母”，直接进入 `'today-learning'`。
    - **在 `'yesterday-review'` 阶段展示的内容**：
      - 当前实现中，`AlphabetLearningEngineView` 并不对 `queue` 再做分段，而是依赖 memory-engine 对队列顺序的约定：
        - 后端负责将“需复习的字母”与“新字母”混排/排序；
        - 前端在 `'yesterday-review'` Phase 下，对 `currentItem` 进行复习；
        - 一旦后端返回的队列中已无非新字母（所有剩余项 `isNew === true`），即可切换到 `'today-learning'`。
      - 简化理解：**凡是 `memoryState.isNew === false` 的字母，都会在 Yesterday Review 阶段被当作“复习项目”处理**，具体“是否真的来自昨天”由 memory-engine（SRS 算法）负责，前端不区分“昨天 vs 更早”。

- **与 Today Learning 的关系：**
  - `'today-learning'` 阶段主要面向 `isNew === true` 的字母；
  - 这些字母在本轮完成后会通过 `submitMemoryResult` 写入 `memory_status`，从下一次进入本课起，将被视为“有记忆记录”的复习对象。

### 4.4 今日学习 + Mini Review

- `handleNext()` 逻辑：

```ts
const handleNext = useCallback(() => {
  if (phase === 'today-learning') {
    setTodayList((prev) => [...prev, currentItem!]);
    setLearnedCount((prev) => prev + 1);

    const newCount = learnedCount + 1;
    if (newCount % MINI_REVIEW_INTERVAL === 0) {
      triggerMiniReview();   // 进入 today-mini-review
      return;
    }
  }

  nextInQueue(); // 调用 alphabetStore.next，切到下一个字母
}, [...]);
```

- Mini Review：
  - `triggerMiniReview()` 会使用最近学习过的若干字母构造 `miniReviewQuestions` 列表；
  - Phase 切换为 `'today-mini-review'`；
  - UI 使用 `MiniReviewQuestionComponent` 渲染；
  - 所有 mini 题答完且错题清空后，回到 `'today-learning'`。

### 4.5 答题提交与错题记录

- `handleAnswer(isCorrect, questionType)`：

```ts
const handleAnswer = useCallback(
  async (isCorrect: boolean, questionType: QuestionType) => {
    if (!currentItem) return;

    await submitResult(userId, isCorrect); // alphabetStore → memory-engine.submitMemoryResult

    if (!isCorrect) {
      setWrongAnswers((prev) => new Set(prev).add(currentItem.alphabetId));
    }
  },
  [currentItem, userId, submitResult]
);
```

- 注意：
  - 所有“题目对/错”信息都会传给 `alphabetStore.submitResult`，后者再调用 memory-engine；
  - 本地额外维护一个 `wrongAnswers: Set<string>`（按 alphabetId），供三轮评估使用。

### 4.6 三轮评估与结束条件

- `submitRoundResults()`：

```ts
const submitRoundResults = useCallback(async () => {
  const roundData = {
    roundNumber: currentRound,
    totalQuestions: todayList.length,
    correctCount: todayList.length - wrongAnswers.size,
    accuracy: (todayList.length - wrongAnswers.size) / todayList.length,
    passed: wrongAnswers.size / todayList.length <= 0.1, // 错题 ≤ 10%
  };

  setRoundEvaluation((prev) => ({
    ...prev,
    currentRound: currentRound,
    rounds: [...prev.rounds, roundData],
  }));

  await submitRoundToStore({
    userId,
    lessonId,
    ...roundData,
  });

  if (currentRound < 3) {
    setCurrentRound((currentRound + 1) as 1 | 2 | 3);
    setWrongAnswers(new Set());
    setPhase('yesterday-review');  // 新一轮从昨日复习开始
  } else {
    markAlphabetLessonCompleted(lessonId); // 通知模块访问 Store
    setPhase('finished');
  }
}, [...]);
```

- 结束条件：
  - 三轮都通过（每轮错题比例 ≤ 10%）；
  - Phase 进入 `'finished'`；
  - `AlphabetLearningEngineView` 在该 phase 展示三轮结果，并可提供“返回课程列表”等操作。

---

## 5. 视图层：AlphabetLearningEngineView 的 Phase 渲染

### 5.1 Props 接口

```ts
interface AlphabetLearningEngineViewProps {
  initialized: boolean;
  phase: Phase;                        // useAlphabetLearningEngine 中定义的类型
  currentRound: 1 | 2 | 3;
  roundEvaluation?: RoundEvaluationState;

  currentItem: AlphabetLearningState | null;
  currentQuestionType: QuestionType | null;
  letterPool: Letter[];

  // 核心交互
  onAnswer: (isCorrect: boolean, type: QuestionType) => void;
  onNext: () => void;
  onBack?: () => void;

  // 昨日复习控制
  onSkipYesterdayReview?: () => void;

  // 拼读规则卡
  phonicsRule: PhonicsRule | null;
  showPhonicsRuleCard: boolean;
  onCompletePhonicsRule?: () => void;

  // Mini Review
  miniReviewQuestion: MiniReviewQuestionType | null;
  onMiniReviewAnswer?: (isCorrect: boolean) => void;
  onMiniReviewNext?: () => void;
}
```

### 5.2 Phase → 视图映射

- `!initialized || !currentItem`：
  - 展示加载中的 `ActivityIndicator`。

- `phase === 'yesterday-review' | 'yesterday-remedy' | 'today-final-review' | 'today-remedy'`：
  - 渲染：

```tsx
<SafeAreaView style={{ flex: 1 }}>
  <RoundHeader currentRound={currentRound} />
  {phase === 'yesterday-review' && onSkipYesterdayReview && (
    // 右上角“跳过昨日复习”按钮
  )}
  <AlphabetReviewView
    alphabet={currentItem}
    letterPool={letterPool}
    preferredType={currentQuestionType ?? undefined}
    onAnswer={onAnswer}
    onNext={onNext}
    onBack={onBack}
  />
</SafeAreaView>
```

- `phase === 'today-mini-review'`：
  - 如果有 `miniReviewQuestion`：
    - 使用 `MiniReviewQuestionComponent` 渲染；
  - 否则回退为 `AlphabetReviewView`。

- `phase === 'today-learning'`：
  - 如果 `showPhonicsRuleCard && phonicsRule`：
    - 渲染 `PhonicsRuleCard`（展示拼读规则，用户读完后点击“完成”，调用 `onCompletePhonicsRule`）；
  - 否则渲染 `AlphabetLearningView`（单字母教学卡）。

- `phase === 'finished'`：
  - 展示三轮评估结果（`roundEvaluation.rounds`）；
  - 显示每一轮的正确率和是否通过；
  - 可以在此处添加“返回课程列表”等按钮。

---

## 6. 题型与 Question Engine（现状与规划）

### 6.1 现状：lettersQuestionGenerator 提供的题型

当前复习题主要由 `src/utils/lettersQuestionGenerator.ts` 提供：

- 输入：
  - `letter: Letter`：当前复习的字母；
  - `pool: Letter[]`：今日所有字母，用于生成干扰项；
  - `preferredType?: QuestionType`：可以指定题型。
- 输出：
  - `AlphabetQuestion`：
    - `type: QuestionType`；
    - `stem: string`：题干；
    - `options: string[]`：选项；
    - `correct: string`：正确答案；
    - `audioUrl?: string`：关联音频。

题型示例：

- SOUND_TO_LETTER：听音选字母；
- LETTER_TO_SOUND：看字选发音；
- SYLLABLE：字母 + 元音的拼读；
- REVERSE_SYLLABLE：给读音反推字母；
- MISSING_LETTER：缺字填空；
- FINAL_CONSONANT：考察尾辅音发音；
- CLASS_CHOICE：辅音类别选择（中/高/低）；
- LETTER_NAME：字母名称判断。

### 6.2 规划：统一 Question Engine（本模块内部定义）

本模块未来版本中，字母题型将由统一的 Question Engine 协议驱动：

- 枚举 `GameType`：映射 6 大题型（基础听觉/视觉题 + 拼读数学 + 声调计算器等）；  
- 结构化的 `QueueItem` / `InstructItem` / `QuizItem`；  
- 各题型的专用 payload（例如 ConsonantClassSort、SpellingMath、ToneCalculator 等）。

与字母模块的关系：

- 未来改造原则：
  - `useAlphabetLearningEngine` 不直接依赖 `lettersQuestionGenerator`；  
  - 而是在 Phase 内调用 `generateQueueItems(FlowContext)`；  
  - `AlphabetLearningEngineView` 不直接渲染 `AlphabetReviewView`，而是渲染 `GameContainer + StepRenderer`。

在当前版本，本 spec 只要求理解现有实现；  
后续真正迁移到 6 大题型时，应在本节内给出 `GameType` / payload 的正式定义，并据此实现。

### 6.3 Question Engine 集成流程图

> 本小节说明 Question Engine 将如何嵌入字母模块，是未来实现时的结构参考。

```text
AlphabetLessonFlow / app/alphabet/[lessonId].tsx
  └─ useAlphabetLearningEngine
       └─ 在每个 Phase / Round 内构造 FlowContext：
            { lessonId, round, phase, letters, userStats? }
             ▼
       调用 generateQueueItems(FlowContext)
             ▼
       返回 QueueItem[] = [
         { kind:'INSTRUCT', ... },
         { kind:'QUIZ', gameType:GameType.X, payload:{...} },
         ...
       ]
             ▼
       交给 GameContainer 渲染本轮队列：
         - 维护 currentIndex / 当前 QueueItem
         - 维护 wrongPool（错题池）
         - 将当前 QueueItem 交给 StepRenderer
             ▼
       StepRenderer:
         - 根据 gameType 决定具体组件：
             LISTEN_SELECT          → <ListenSelectView />
             CONSONANT_CLASS_SORT   → <ConsonantClassSorter />
             SPELLING_MATH          → <SpellingMathView />
             TONE_CALCULATOR        → <ToneCalculatorView />
             ...
         - 用户作答 → onAnswer(isCorrect)
             ▼
       GameContainer:
         - 若需要，调用 alphabetStore.submitResult(userId, isCorrect)
         - 若错误，将题目/字母加入 wrongPool
         - 队列结束时，回调 onQueueComplete({ stats, wrongPool })
             ▼
       useAlphabetLearningEngine:
         - 根据 stats / wrongPool 决定：
             * 是否进入补救阶段
             * 是否进入下一轮 Round
             * 是否进入 finished
```

- 在这一设计下：
  - **Hook 层**（`useAlphabetLearningEngine`）只负责 Phase 状态机，与题型无关；
  - **Question Engine 层**负责：
    - 根据 Round/Phase 决定使用哪些 `GameType`；
    - 为每种 `GameType` 生成结构化 payload；
  - **GameContainer + StepRenderer** 将 `QueueItem` 映射为具体 UI 组件，并在答题后统一调用 `submitResult`。

---

## 7. 数据结构与字段使用（Letters / Lessons / Memory）

### 7.1 字母实体：LETTERS 集合

- 来源：`assets/courses/letters_final.enriched.json`；
- 关键字段（节选）：
  - `_id: string`（如 `TH_C_01`）
  - `type: 'consonant' | 'vowel' | 'tone'`
  - `thaiChar: string`
  - `nameThai: string`
  - `nameEnglish: string`
  - `initialSound: string`
  - `finalSound: string`
  - `class: 'high' | 'mid' | 'low' | null`
  - `category: string`（如 `mid_consonant`, `vowel`）
  - `subCategory: string`
  - 音频相关：
    - `fullSoundUrl`, `syllableSoundUrl`, `endSyllableSoundUrl`, `letterPronunciationUrl`
    - 以及 Store 预下载后附加的 `fullSoundLocalPath`, `syllableSoundLocalPath`, `endSyllableSoundLocalPath`, `letterPronunciationLocalPath`
  - 课程映射：
    - `curriculumLessonIds: string[]`
    - `curriculumLessonOrders: number[]`
    - `primaryCurriculumLessonId: string`
    - `primaryCurriculumLessonOrder: number`

字母模块中：

- `alphabetStore.initializeSession` 会根据 `lessonId` 从后端取回包含这些字段的 `Letter` 文档；
- `AlphabetLearningState.letter` 中完整保存了 `Letter`，供 `AlphabetLearningView` / 题型引擎使用。

### 7.2 课程元数据：ALPHABET_LESSONS 集合 + lessonMetadata.config.ts

- 后端集合 `ALPHABET_LESSONS`：
  - 字段与 `LessonMetadata` 对齐；
  - 用于 memory-engine 和前端 `getAlphabetLessons` handler。

- 前端 `lessonMetadata.config.ts`：
  - 本地备份（回退逻辑使用）；
  - 字段：
    - `lessonId`, `title`, `description`；
    - `consonants[]`, `vowels[]`, `tones[]`；
    - `phonicsRuleId`, `totalCount`, `minPassRate`, `miniReviewInterval`, `order`。

### 7.3 记忆状态：MEMORY_STATUS + USER_ALPHABET_PROGRESS

- `MEMORY_STATUS`：
  - `userId`, `entityType = 'letter'`, `entityId`；
  - `masteryLevel`, `reviewStage`, `correctCount`, `wrongCount`, `streakCorrect`, `nextReviewAt`, `isNew`。
  - 所有对/错结果通过 `submitMemoryResult` 写入。

- `USER_ALPHABET_PROGRESS`：
  - `userId`, `lessonId`, `currentRound`, `roundHistory[]`；
  - 三轮评估结果通过 `submitRoundEvaluation` 写入。

### 7.4 字母模块“分数 / 统计”如何计算

字母模块目前有两层“分数/统计”，分别对应短期和长期：

1. **短期：单课三轮评估（RoundEvaluation）**
   - 在 `useAlphabetLearningEngine.submitRoundResults` 中按如下方式计算：
     - `totalQuestions = todayList.length`（本课当前轮次实际出现过的字母数量）；
     - `wrongAnswers: Set<string>` 记录当前轮中“曾经答错过的字母 ID”（按 alphabetId 去重）；
     - `correctCount = totalQuestions - wrongAnswers.size`；
     - `accuracy = correctCount / totalQuestions`（0~1 之间）；
     - `passed = wrongAnswers.size / totalQuestions <= 0.1`（错题比例 ≤ 10% 视为通过）。
   - 该统计结果：
     - 一方面保存在 Hook 的本地状态 `roundEvaluation.rounds` 中，用于完成页展示；
     - 另一方面通过 `alphabetStore.submitRoundEvaluation` 写入 `user_alphabet_progress.roundHistory`，供后端统计与解锁逻辑使用。

2. **长期：记忆曲线与 mastery（memory-engine）**
   - 每道题的对/错都会调用 `submitMemoryResult(userId, quality)`：
     - 前端只区分 `isCorrect: boolean`；
     - Store 将其映射为 `QualityButton.KNOW | QualityButton.FORGET`，发送给 memory-engine；
   - memory-engine 内部通过 `computeNextReview(doc, quality)`：
     - 更新 `masteryLevel`, `reviewStage`, `nextReviewAt`, `correctCount`, `wrongCount`, `streakCorrect` 等；
     - 这些字段决定未来该字母出现在“昨日复习 / 今日复习”的频率和时机。
   - 前端的 `alphabetStore.completedCount`：
     - 仅作为“本设备本次学习会话的完成数量统计”，用于课程解锁；
     - 不直接等同于 `masteryLevel`，而是一个更“粗粒度”的视角。

---

## 8. 典型用例与端到端时序（从点击“开始学习”到课程完成）

### 8.1 从 Lesson 卡片到开始刷题（更细致调用示意）

```text
步骤视图（上→下）：

  [User]
    点击 app/alphabet/index.tsx 中 LessonX 卡片上的「开始学习」按钮
        │
        ▼
  [app/alphabet/index.tsx]
    调用 router.push('/alphabet/lessonX')
        │
        ▼
  [expo-router]
    匹配到 app/alphabet/[lessonId].tsx
        │
        ▼
  [app/alphabet/[lessonId].tsx]
    1. 通过 useLocalSearchParams() 获取 lessonId='lessonX'
    2. 调用 const engine = useAlphabetLearningEngine(lessonId)
    3. 将 engine 返回的全部字段透传给 <AlphabetLearningEngineView {...engine} />
        │
        ▼
  [useAlphabetLearningEngine(lessonId)]
    首次渲染时 useEffect 触发：
      a. 调用 alphabetStore.initializeSession(userId, { lessonId })
           │
           ▼
      b. alphabetStore.initializeSession 内部：
           - 组装请求体：
               action = 'getTodayMemories'
               data   = { userId, entityType:'letter', limit, includeNew:true, lessonId }
           - 调用 callCloudFunction<TodayLettersResponse>(
               'getTodayMemories',
               data,
               { endpoint: API_ENDPOINTS.MEMORY.GET_TODAY_MEMORIES.cloudbase }
             )
               │
               ▼
      c. callCloudFunction：
           - 通过 apiClient.post() 调用后端 HTTP 触发器 /memory-engine
           - 发送 body: { action:'getTodayMemories', data:{...} }
               │
               ▼
  [memory-engine/index.js]
    - 解析 event.body，得到 { action:'getTodayMemories', data }
    - 分发到 handlers/getTodayMemories(db, data)
        │
        ▼
  [handlers/getTodayMemories.js]
    1. 从 alphabet_lessons 中查询 lessonId 对应的课程定义；
    2. 从 letters 集合中查询属于该 lessonId 的所有字母；
    3. 从 memory_status 中查询 userId + entityType:'letter' + entityId 的记忆状态；
    4. 组装：
       items: Array<Letter & { memoryState?: MemoryStatus }>
       summary: { total, newCount, reviewCount, entityType:'letter' }
       lessonMetadata: 当前课的元数据
       phonicsRule: 当前课的拼读规则
    5. 使用 createResponse(true, { items, summary, lessonMetadata, phonicsRule }, ...) 返回
        │
        ▼
  [callCloudFunction / alphabetStore.initializeSession]
    - 将 response.data.items 映射为 queue: AlphabetLearningState[]
    - 设置 currentItem = queue[0]
    - 写入 lessonMetadata / phonicsRule 到 alphabetStore
    - 启动预下载音频任务，填充 letter.*LocalPath / alphabet.audioUrl
        │
        ▼
  [useAlphabetLearningEngine]
    - 看到 initializeSession 成功，设置：
        initialized = true
        phase = 'yesterday-review'（若队列存在非新字母）；否则直接 'today-learning'
    - 计算 letterPool = queue.map(item => item.letter)
        │
        ▼
  [AlphabetLearningEngineView]
    - 根据 phase 渲染：
        'yesterday-review' → AlphabetReviewView（复习）
        'today-learning'   → AlphabetLearningView / PhonicsRuleCard
        ...
```

### 8.2 用户答题并完成一轮（单题粒度）

```text
参与者：
  User           用户
  AlphabetLearningEngineView（简称 EngineView）
  AlphabetReviewView / MiniReviewQuestionComponent / 其他题目组件
  useAlphabetLearningEngine（简称 Engine）
  alphabetStore（简称 Store）
  callCloudFunction（简称 API）
  memory-engine.submitMemoryResult（简称 CF）

详细步骤（以普通复习题为例）：

1. EngineView 根据当前 phase 渲染 AlphabetReviewView：
     - props 中带入：
         alphabet        = currentItem
         letterPool      = letterPool
         preferredType   = currentQuestionType
         onAnswer        = Engine.onAnswer
         onNext          = Engine.onNext

2. AlphabetReviewView 内：
     a. 调用 generateAlphabetQuestion(letter, pool, preferredType)
        得到 question: { stem, options, correct, audioUrl, type }
     b. 渲染题干和选项，用户点击某个选项。

3. 用户点击选项后，AlphabetReviewView 做本地判定：
     - isCorrect = (选中的 value === question.correct)
     - 调用 onAnswer(isCorrect, question.type)

4. Engine.onAnswer(isCorrect, questionType) 内部：
     a. 若 currentItem 为空则直接 return；
     b. 调用 Store.submitResult(userId, isCorrect)：
          - 质量映射：
              isCorrect === true  → QualityButton.KNOW
              isCorrect === false → QualityButton.FORGET
          - 调用 API.post('/memory-engine', {
                action: 'submitMemoryResult',
                data: { userId, entityType:'letter', entityId: currentItem.alphabetId, quality }
            })
     c. 如果 isCorrect === false：
          wrongAnswers = wrongAnswers ∪ { currentItem.alphabetId }

5. memory-engine.submitMemoryResult：
     a. 在 memory_status 集合中根据 { userId, entityType:'letter', entityId } 查询当前记录；
     b. 使用 computeNextReview(doc, quality) 计算下一次复习参数：
          - 更新 masteryLevel、reviewStage、nextReviewAt、correctCount、wrongCount 等；
     c. 更新或插入该记录；
     d. 返回 createResponse(true, null, '提交记忆结果成功')。

6. Store.submitResult 收到成功响应后：
     a. 在本地 queue[currentIndex] 上更新：
          currentAttempts += ATTEMPTS_INCREMENT_MAP[quality]
          qualityHistory.push(QUALITY_SCORE_MAP[quality])
          若 currentAttempts >= requiredAttempts → isCompleted = true
     b. 重新计算 completedCount = 队列中 isCompleted === true 的项数；
     c. 调用 Store.next()（即 Engine 看到的 nextInQueue）：
          - 若还有下一项：
              currentIndex++
              currentItem = queue[currentIndex]
          - 若队列结束：
              phase = LearningPhase.COMPLETED（会话级）

7. EngineView 在用户点击“下一题”按钮时调用 Engine.onNext()：
     a. Engine.onNext 内部：
          - 若 phase === 'today-learning'：
              将 currentItem 追加到 todayList，并递增 learnedCount；
              每学满 MINI_REVIEW_INTERVAL（3）个，调用 triggerMiniReview() 进入 today-mini-review；
          - 不满足上述条件时，直接调用 nextInQueue()（即 Store.next）；
     b. 下一次 render 时，EngineView 会使用新的 currentItem 渲染下一道题。
```

### 8.3 三轮评估结束并标记课程完成（课程粒度）

```text
参与者：
  useAlphabetLearningEngine（Engine）
  alphabetStore（Store）
  callCloudFunction（API）
  memory-engine.submitRoundEvaluation（CF）
  moduleAccessStore（ModuleStore）

背景：
  - 每一轮学习结束时，Engine 中会维护：
      todayList: AlphabetLearningState[]   // 本轮真正出过题的所有字母
      wrongAnswers: Set<string>           // 本轮曾经答错过的字母 ID 集合

步骤：

1. 一轮（currentRound）的所有 Phase 结束后，Engine 调用 submitRoundResults()：
     - totalQuestions = todayList.length
     - wrongCount     = wrongAnswers.size
     - correctCount   = totalQuestions - wrongCount
     - accuracy       = correctCount / totalQuestions
     - passed         = (wrongCount / totalQuestions) <= 0.1
     - roundData = {
         roundNumber: currentRound,
         totalQuestions,
         correctCount,
         accuracy,
         passed
       }

2. Engine 将 roundData 合并到本地 roundEvaluation 状态：
     roundEvaluation.rounds.push(roundData)
     roundEvaluation.currentRound = currentRound

3. Engine 调用 Store.submitRoundEvaluation({
       userId,
       entityType: 'letter',
       lessonId,
       roundNumber,
       totalQuestions,
       correctCount,
       accuracy,
     })。

4. Store.submitRoundEvaluation 通过 API 调用：
     callCloudFunction('submitRoundEvaluation', { ... }, { endpoint: /memory-engine })
     → memory-engine.handlers.submitRoundEvaluation：
         - 在 user_alphabet_progress 集合中：
             * 如果不存在 { userId, lessonId } 记录，则创建；
             * 更新 currentRound = roundNumber；
             * 使用 db.command.push(roundData) 将该轮结果追加到 roundHistory。

5. 成功返回后，Engine 根据 currentRound 与 passed 进行分支：
     a. 若 currentRound < 3 且 passed === true：
          - setCurrentRound(currentRound + 1 as 1|2|3)
          - setWrongAnswers(new Set())    // 清空错题池
          - setPhase('yesterday-review')  // 下一轮从昨日复习 Phase 再走一遍流程

     b. 若 currentRound == 3 且 passed === true：
          - 调用 moduleAccessStore.markAlphabetLessonCompleted(lessonId)：
               * 用于更新模块解锁状态（例如解锁后续课程/模块）
          - setPhase('finished')：
               * AlphabetLearningEngineView 在该 Phase 下展示三轮评估结果和课程完成提示。

     c. 若某轮 passed === false（错误率 > 10%）：
          - Engine 可以根据业务需要：
               * 回到 today-remedy / today-final-review 等 Phase 加强练习；
               * 或保持 currentRound 不变，要求用户重新刷一轮（实现细节可按后续设计补充）。
```
```

---

## 9. 扩展与实现注意事项

1. **不要在组件中直接调用云函数**  
   - 所有网络请求必须通过 Store / Hook（`alphabetStore` + `useAlphabetLearningEngine`）完成；
   - `AlphabetLearningView` / `AlphabetReviewView` 应保持纯 UI + 局部交互。

2. **不要在前端写死课程结构**  
   - 课程表以 `alphabet_lessons` + `phonics_rules` 为准；
   - `lessonMetadata.config.ts` 仅作为回退数据；
   - 若课程增减，请同时更新这两处并在此 spec 文档中注明。

3. **新增题型时遵守 Question Engine 协议**  
   - 新题型必须先在本 spec 的 Question Engine 小节中定义 `GameType` + payload 结构；  
   - 然后在 QuestionRenderer 中增加 case；  
   - 再由 FlowGenerator 决定在哪个 Round / Phase 使用。

4. **确保音频只从本地播放**  
   - 新增任何字母音频字段时，应遵守：
     - 后端：只存储 COS key / 相对路径；
     - 前端：在 `alphabetStore.initializeSession` 预下载到 `file://`，并写入 `*LocalPath` 字段；
     - 组件只使用本地路径。

5. **所有对/错都要进入 memory-engine**  
   - 禁止在前端“临时搞一个错题本集合”；  
   - 错题池只在 Hook 内存中存在，用于三轮评估，不进入 DB；  
   - 长期记忆/复习统一通过 `memory_status` 和后端算法管理。

---

### 9.1 Session 状态 vs 记忆引擎状态（前端 / 后端分工）

> 为避免“前端再造一套记忆引擎”，必须清晰区分：  
> 哪些状态只在本地 Session 使用，哪些必须写入 memory-engine。

**本地 Session 级状态（只影响当天该课的脚本与 UI，保存在 alphabetStore / Hook 中，可持久化）：**

- `queue`：本次进入该课时的字母队列（来自 getTodayMemories 整课返回）。  
- `todayList`：今日在 Round1 内已经学习过的新字母列表。  
- `todayNewLetters: Set<alphabetId>`：今日出现过的所有新字母 ID。  
- `todayReviewedLetters: Set<alphabetId>`：在当日轻量题 / Mini Review 中已经做过题的新字母 ID。  
- `wrongAnswers: Set<alphabetId>`：当前 Round 内曾经答错过的字母 ID（用于统计 & 补救）。  
- `currentRound: 1 | 2 | 3`：当前轮次。  
- `roundEvaluation`：仅用于 UI 展示每轮 accuracy/passed，不直接参与 SM-2。  
- `phase`：今日课程脚本的阶段（昨日复习 / 今日学习 / Mini Review / Final Review / Remedy / finished）。  

这些状态可以用 AsyncStorage 做轻量持久化，用于“中途退出 → 下次恢复到相近阶段”，但**不被后端依赖**。

**记忆引擎级状态（唯一真相，存放在 CloudBase DB 中）：**

- `memory_status`：per-letter 记忆状态，算法只关心：
  - `userId, entityType:'letter', entityId`；  
  - `masteryLevel, reviewStage, nextReviewAt, correctCount, wrongCount, streakCorrect, isNew` 等。  
- `user_alphabet_progress`：per-lesson 轮次统计，用于模块解锁 / 报告展示：  
  - `currentRound, roundHistory[]`。

**约束：**

- Session 级状态可以随前端版本演进而变化，只要不篡改 DB；  
- 记忆引擎级状态只能通过 `submitMemoryResult` / `submitRoundEvaluation` 修改；  
- `getTodayMemories(entityType:'letter', lessonId)` 的实现应按 lessonId 语义返回“整课字母集 + memoryState”，不读取前端 Session 状态。

### 9.2 轮次与评分规则（按字母聚合质量）

> 3 轮机制 = 课程级训练脚本；SM-2 = 跨天记忆调度，两者通过“质量值 Quality”衔接。

**当前策略（题级提交，已实现）：**

- 每道题结束时调用 `submitResult(userId, isCorrect)`：  
  - 前端将 `isCorrect` 映射为 `QualityButton.KNOW / FORGET`；  
  - Store 内部调用 `submitMemoryResult` 写入 `memory_status`；  
  - Session 级错题集合 `wrongAnswers` 只用于 RoundEvaluation 和补救逻辑。
- 优点：实现简单，已有代码可用；  
- 缺点：同一个字母在一轮内可能多次写入 quality，SM-2 算法需要考虑“高频观测”的影响。

**可选升级策略（每字母每轮一次提交，未来迭代）：**

- 在 Hook 中记录 per-letter / per-round 行为，例如：

  ```ts
  type LetterRoundStats = {
    attempts: number;
    wrongCount: number;
    everCorrect: boolean;
    usedHint: boolean;
  };
  // Map<alphabetId, LetterRoundStats>
  ```

- 当某个字母在当前 Round 的“所有题 + 错题补救”结束时：
  - 使用 `wrongCount / attempts / everCorrect / usedHint` 计算出 3 档质量：
    - 记得（KNOW）：全程无错，且曾答对；  
    - 模糊（FUZZY）：有 1~2 次错误，但最终答对且未依赖完整答案；  
    - 忘记（FORGET）：错误 ≥3 次，或需要看答案。  
  - 仅提交一次：

    ```ts
    submitMemoryResult({
      userId,
      entityType: 'letter',
      entityId: alphabetId,
      quality: QualityButton.KNOW | FUZZY | FORGET,
    });
    ```

- Round1/2/3 可以各提交一次质量；RoundEvaluation 仍只做课程级统计与解锁判定。

### 9.3 Round 与课程级复习 / 长期复习的关系（设计约定）

- **课程级训练模式（lessonId 模式）**：
  - 当前字母模块主要使用 `getTodayMemories(entityType:'letter', lessonId)`；  
  - 约定：只要该课 `currentRound < 3`，该接口应返回整课所有字母（不按 SM-2 过滤），以便完成课程内 3 轮训练脚本。  
  - 即便 Round 被拆成多天完成，仍视为“课程训练过程的一部分”，不强制按日切片。

- **长期 SRS 模式（未来可选，无 lessonId）**：
  - 若将来新增“字母综合复习中心”，可调用不带 lessonId 的：
    `getTodayMemories({ entityType:'letter', includeNew:false })`，让 SM-2 按 `nextReviewAt` 自由调度所有课中的到期字母。  
  - 该模式与课程级训练模式独立，不影响当前 Lesson 流程与解锁逻辑。

- **课程结束与“退役”字母：**
  - 当 `moduleAccessStore.userProgress.letterCompleted === true`（核心 6 课完成）时，  
    默认不再调用 `getTodayMemories(letter, lessonId)` 作为每日任务；  
  - 字母不会在日常学习（例如词汇模块）中反复出现，除非用户显式进入某个“字母复习模式”。

---

## 10. 实施工单与里程碑（Alphabet Module）

> 本小节为开发落地准备一个 checklist，按优先级规划迭代。

### 10.1 P0：保持现有行为，补齐解锁逻辑与文档

目标：在不大改代码的前提下，使当前实现与 Spec 的“解锁条件 / 课程流程”基本一致。

- [ ] 明确 `submitRoundResults` 调用时机，并在实现中确保只在完整轮次结束时调用。  
- [ ] 在 `useAlphabetLearningEngine` 中，只有当 `passed === true` 且 `currentRound === 3` 时才调用 `markAlphabetLessonCompleted(lessonId)`（或根据需要设置通过阈值），避免“未通过也解锁下一课”。  
- [ ] 根据实际实现，对文档中的 Round 流程与解锁条件进行一次最终核对（本 Spec 已给出目标设计，可据此比对代码）。

### 10.2 P1：完善 Phase 流程与错题补救（Round1 内）

目标：让 Round1 内的“昨日复习 → 今日学习 + 三新一复 → Final Review（补齐今日未复习字母）→ 今日错题补救”逻辑完整可用。

- [ ] 在 `useAlphabetLearningEngine` 中实现：  
  - `yesterday-remedy` Phase：基于昨日错题集合（例如 `yesterdayWrongIds`）出题，全部做对后才进入 `today-learning`；  
  - `today-final-review` Phase：  
    - 维护 `todayNewLetters` / `todayReviewedLetters` 集合；  
    - 对 `pendingFinal = todayNewLetters - todayReviewedLetters` 中的字母，每个出 2 道逻辑/整合题；  
  - `today-remedy` Phase：  
    - 针对今日所有错题出题，直到全部答对。  
- [ ] 在 Spec 中已有的 ASCII 流程图基础上，为新增 Phase 补充更详细的注释，便于对照实现。

### 10.3 P2：与 memory-engine 的质量提交策略统一

目标：决定并实现“题级提交 vs 字母/轮次级提交”的最终方案。

- [ ] 若继续使用“每题提交”方案：  
  - 将其在 Spec 中标记为“正式策略”；  
  - 确认 `alphabetStore.submitResult` 始终包含 `entityType:'letter'` 与正确的 `entityId`，并在 CloudBase 日志中验证。  
- [ ] 若演进为“每字母每轮一次质量”：  
  - 在 Hook 内增加 per-letter per-round 统计结构；  
  - 实现 `computeLetterQualityForRound(letterId, stats)`；  
  - 在该字母本轮所有题 + 补救题结束时调用一次 `submitMemoryResult`；  
  - 保留 `submitRoundEvaluation` 仅用于课程级展示/解锁。

### 10.4 P3：Question Engine 集成与题型升级

目标：将本 spec 中规划的 6 大题型逐步替换现有 `lettersQuestionGenerator` 题型。

- [ ] 在前端实现 `generateQueueItems(FlowContext)`，并在 `useAlphabetLearningEngine` 中对接。  
- [ ] 新增 `GameContainer + StepRenderer`，替换 `AlphabetReviewView` 与 MiniReview 单点逻辑。  
- [ ] 分阶段引入：  
  - 第一阶段：保持当前题型，仅通过 Question Engine 统一调度；  
  - 第二阶段：引入拼读数学、声调计算等逻辑题型。

### 10.5 里程碑规划

- **M1：解锁逻辑修正 + 文档对齐（约 1 周）**  
  - 完成 P0；  
  - 确保三轮通过后才解锁下一课；  
  - 更新文档与 UI 文案说明。  

- **M2：Phase + 错题补救完整落地（约 2–3 周）**  
  - 完成 P1；  
  - Round1 内 Phase 流程与错题补救可用；  
  - 回归测试所有 Phase 转移场景。  

- **M3：质量提交策略定版 + memory-engine 对齐（约 1–2 周）**  
  - 完成 P2（选择题级或字母/轮次级方案之一并实现）；  
  - 确认 CloudBase 日志中质量参数正常，`memory_status` 更新符合预期。  

- **M4：题型升级与 Question Engine 初步集成（后续迭代）**  
  - 完成 P3 的第一阶段；  
  - 视时间与产品规划决定是否引入新题型。  

---

本规格文档覆盖了字母模块从路由、组件、Hook、Store、云函数到数据库字段的完整链路，并对 Session 级状态与记忆引擎状态的分工、轮次评分策略及实施里程碑做出了约束。  
后续新增功能（如 6 大题型 Question Engine、AI 发音训练）必须在本规范基础上扩展，不得绕开既有边界。

---

## 11. V2 聚合评分与会话恢复方案（最终定稿）

> 本节是在与产品讨论后的**最终版字母记忆方案**，用于覆盖和细化上文 9.2 / 10.3 中的设计建议。  
> 如果本节与前文存在冲突，以本节为准。

### 11.1 设计目标回顾

- 降低网络调用频率：不再按“每题一次”调用 `submitMemoryResult`，改为**每字母每轮一次**。  
- 允许用户在 Round 中途退出，并在下一次进入时无缝恢复。  
- 让“字母课程”保持课程级的三轮训练逻辑，而不是严格的日级 SRS。  
- 为后续词汇模块复用同一套“前端聚合 + 统一提交”思路打基础。

### 11.2 AlphabetSessionState（建议结构）

```ts
export interface AlphabetSessionState {
  userId: string;
  lessonId: string;
  currentRound: 1 | 2 | 3;
  phase: Phase; // yesterday-review / today-learning / ...

  queue: AlphabetLearningState[];
  cursorIndex: number;

  todayNewLetters: string[];      // alphabetId[]
  todayReviewedLetters: string[]; // 已经在轻量题 / 逻辑题中被考过
  wrongLetterIds: string[];       // 本轮曾经出错过

  perLetterStats: Record<
    string,
    {
      attempts: number;
      wrongCount: number;
      lastPhase: Phase;
    }
  >;

  roundFinished: boolean;         // 本轮是否已经完成并成功提交
  updatedAt: string;              // ISO 时间戳，方便调试
}
```

- 实际实现时可以放在 `alphabetStore` 中，通过 `getState()` / `setState()` 管理，并定期写入 AsyncStorage。  
- 当 App 重新打开或用户再次进入该课时，若发现 `roundFinished === false` 的 Session，则直接恢复，不重新生成队列。

### 11.3 质量计算规则（FORGET / FUZZY / KNOW）

在一个 Round 内，对同一个字母可能出现多道题 + 多次错题补救，最终聚合为 3 档质量：

```ts
type LetterRoundQuality = 'FORGET' | 'FUZZY' | 'KNOW';

function computeLetterQuality(
  stats: { attempts: number; wrongCount: number },
): LetterRoundQuality {
  if (stats.attempts === 0) return 'FORGET';   // 理论兜底
  if (stats.wrongCount === 0) return 'KNOW';   // 全程无错
  if (stats.wrongCount === 1) return 'FUZZY';  // 轻度错误
  return 'FORGET';                             // 错误 ≥2 视为没掌握
}
```

映射到 memory-engine / SM‑2：

```ts
function mapQualityToSm2Score(q: LetterRoundQuality): number {
  if (q === 'KNOW') return 5;   // 记得
  if (q === 'FUZZY') return 3;  // 模糊
  return 0;                     // 忘记
}
```

### 11.4 批量提交时机与伪代码

在 Round 完成或用户点击“结束今天学习”时：

```ts
async function syncAlphabetRoundResults(state: AlphabetSessionState) {
  const { userId, lessonId, currentRound, perLetterStats } = state;

  const payloads = Object.entries(perLetterStats).map(([entityId, stats]) => ({
    userId,
    entityType: 'letter' as const,
    entityId,
    quality: mapQualityToSm2Score(computeLetterQuality(stats)),
  }));

  // 1. 批量 memory 结果
  for (const p of payloads) {
    await callCloudFunction('submitMemoryResult', p, {
      endpoint: API_ENDPOINTS.MEMORY.SUBMIT_MEMORY_RESULT.cloudbase,
    });
  }

  // 2. 课程级轮次统计
  const totalQuestions = Object.values(perLetterStats).reduce(
    (sum, s) => sum + s.attempts,
    0,
  );
  const wrongCount = Object.values(perLetterStats).reduce(
    (sum, s) => sum + s.wrongCount,
    0,
  );

  await callCloudFunction(
    'submitRoundEvaluation',
    {
      userId,
      entityType: 'letter',
      lessonId,
      roundNumber: currentRound,
      totalQuestions,
      correctCount: totalQuestions - wrongCount,
      accuracy: totalQuestions === 0 ? 0 : (totalQuestions - wrongCount) / totalQuestions,
    },
    { endpoint: API_ENDPOINTS.MEMORY.SUBMIT_ROUND_EVALUATION.cloudbase },
  );
}
```

实现约束：

- 同一个 `(userId, lessonId, currentRound)` 在一个自然日内只调用一次 `syncAlphabetRoundResults`。  
- 若网络错误，可在下次进入课程时重试，直到成功为止。  
- 当 Round3 的同步完成并通过阈值后，才允许解锁下一课。

### 11.5 与任务列表的关系

- 第 9 章中关于“Session 状态 vs 记忆引擎状态”的分工保持有效。  
- 第 10 章中的 P2（质量提交策略）应按本节方案实现，即**按字母聚合 + 批量提交**，不再推荐“每题提交”。  
- 若将来需要进一步优化，可在 memory-engine 增加 `submitBatchMemoryResults`，但前端协议（按字母聚合后提交）保持不变。

至此，字母模块的记忆策略已冻结：  
**前端负责题目脚本、错题统计与质量聚合；后端只负责持久化 SM‑2 状态与跨天调度。**
