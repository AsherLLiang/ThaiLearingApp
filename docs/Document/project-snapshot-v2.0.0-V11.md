# ThaiLearningApp 项目快照 V11（字母课程 7 课 + 三轮评估 + 统一配置）

> 版本：V11  
> 时间：2025-12-08（本地生成）  
> 目标读者：后续接手本项目的前后端工程师 / 架构师 / AI 助手  

本快照在 V10 的基础上，重点完成并梳理了：

- 字母课程从「本地 6 课配置」升级为「后端 DB 7 课 + 前后端统一源」；
- 字母学习流程完整支持 7 阶段 + 三轮评估（RoundEvaluationState + DB 字段）；
- 所有与字母/单词学习相关的 CloudBase 云函数、集合名、前端 API 调用，统一由 `apiClient` + `EndpointMap` + `COLLECTIONS` 管理；
- Mini Review 题型做了轻量扩展，保持「先能跑通，后续再深度优化」的原则。

---

## 1. 数据层与集合

### 1.1 CloudBase 集合现状

当前 CloudBase 环境中已确认存在的集合（截图 + 代码核对）：

- `alphabet_lessons` — 字母课程元数据（7 课）
- `letter_test_bank` — 字母测试题库
- `letters` — 字母实体（80 个字母，含课程字段等）
- `memory_status` — SRS 记忆状态（SM-2）
- `phonics_rules` — 拼读规则（6 条）
- `user_alphabet_progress` — 用户字母学习进度（含 roundHistory）
- `user_progress` — 用户总体模块进度（解锁状态等）
- `user_vocabulary_progress` — 用户单词学习进度
- `users` — 用户基本信息
- `vocabulary` — 词汇实体

### 1.2 前端集合常量（统一入口）

文件：`src/config/constants.ts:1`

```ts
export const COLLECTIONS = {
  // 已实际使用
  USERS: 'users',
  USER_PROGRESS: 'user_progress',
  USER_ALPHABET_PROGRESS: 'user_alphabet_progress',
  USER_VOCABULARY_PROGRESS: 'user_vocabulary_progress',

  LETTERS: 'letters',
  VOCABULARY: 'vocabulary',
  SENTENCES: 'sentences',
  MEMORY_STATUS: 'memory_status',

  ALPHABET_LESSONS: 'alphabet_lessons',
  PHONICS_RULES: 'phonics_rules',
  LETTER_TEST_BANK: 'letter_test_bank',

  // 预留 / 规划中的集合
  COURSES: 'courses',
  LESSONS: 'lessons',
  EXERCISES: 'exercises',
  ARTICLES: 'articles',
  PRONUNCIATION_RECORDS: 'pronunciationRecords',
  PROGRESS: 'progress',
  REVIEW_SCHEDULES: 'reviewSchedules',
  LEARNING_RECORDS: 'learningRecords',

  // 旧版字母集合（不再推荐使用）
  ALPHABETS: 'alphabets',
} as const;
```

后端 memory-engine 内部也有一份集合名常量（`cloudbase/functions/memory-engine/utils/constants.js`），但目前主要用于单词相关逻辑。字母模块新代码统一从前端 `COLLECTIONS` 出发，后端直接使用字符串集合名（已与实际 DB 对齐）。

---

## 2. API 层：ApiClient + EndpointMap + CloudFunctions

### 2.1 ApiClient 与 CloudFunction 适配

文件：`src/utils/apiClient.ts`

- `ApiClient`：统一 HTTP 请求工具，负责：
  - 基于 `EndpointMap` + `CURRENT_BACKEND` 选择具体路径；
  - 管理 Auth Token；
  - 处理超时、网络错误、统一返回 `ApiResponse<T>`。
- `callCloudFunction<T>(action, data, options)`：
  - 用于调用 CloudBase 多 action 云函数（`/memory-engine`、`/learn-vocab`）；
  - 请求体统一结构：`{ action, data }`；
  - `options.endpoint` 支持传入字符串或 `EndpointMap`；
  - 与普通 REST 调用保持同一返回结构。

### 2.2 API 端点统一配置

文件：`src/config/api.endpoints.ts`

定义了所有前端可见的端点映射（CloudBase / Java）：

- `AUTH_ENDPOINTS` — 用户注册 / 登录 / 重置密码 / 更新资料 / 登出
  - CloudBase 对应函数：`user-register`, `user-login`, `user-reset-password`, `user-update-profile`
  - `LOGOUT` 在 CloudBase 侧尚无实际函数，前端仅做本地登出。
- `MODULE_ENDPOINTS` / `VOCABULARY_ENDPOINTS`
  - CloudBase 统一指向 `/learn-vocab`，由多 action handler 处理单词学习和模块访问。
- `MEMORY_ENDPOINTS`
  - CloudBase 统一指向 `/memory-engine`：
    - `GET_TODAY_MEMORIES`
    - `SUBMIT_MEMORY_RESULT`
    - `SUBMIT_ROUND_EVALUATION`
- 其他端点（课程、学习、发音、进度、复习、旧版字母）：
  - 配置中保留，但在注释中标明「⚠️ 当前 CloudBase 未实现对应云函数，仅为占位 / Java 端使用」。

**字母模块实际调用链：**

- 今日记忆（字母）：  
  `useAlphabetStore.initializeSession` →  
  `callCloudFunction('getTodayMemories', { entityType: 'letter', lessonId, ... }, { endpoint: API_ENDPOINTS.MEMORY.GET_TODAY_MEMORIES.cloudbase })`

- 提交单个字母记忆结果：  
  `useAlphabetStore.submitResult` →  
  `callCloudFunction('submitMemoryResult', {...}, { endpoint: API_ENDPOINTS.MEMORY.SUBMIT_MEMORY_RESULT.cloudbase })`

- 提交三轮整体评估：  
  `useAlphabetStore.submitRoundEvaluation` →  
  `callCloudFunction('submitRoundEvaluation', {...}, { endpoint: API_ENDPOINTS.MEMORY.SUBMIT_ROUND_EVALUATION.cloudbase })`

- 获取字母课程列表（新）：  
  `app/alphabet/index.tsx` →  
  `callCloudFunction('getAlphabetLessons', {}, { endpoint: API_ENDPOINTS.MEMORY.GET_TODAY_MEMORIES.cloudbase })`

---

## 3. 字母课程与拼读规则（7 课方案）

### 3.1 前端课程元数据（本地备份 + 类型参考）

文件：`src/config/alphabet/lessonMetadata.config.ts`

- `LESSON_METADATA: Record<string, LessonMetadata>`  
  - `lesson1` ~ `lesson6`：常用字母课程（核心，影响模块解锁）  
  - `lesson7`：罕用/古体字母课程，仅作为补充，不影响解锁。
- 辅助函数：
  - `getLessonMetadata(lessonId)`
  - `getAllLessons()` — 按 `order` 排序返回 7 个 lesson
  - `getLessonByLetter(thaiChar)`
  - `getLessonStatistics()`

> 注意：前端课程总览页已经改为「优先使用后端 getAlphabetLessons 结果」，此文件主要作为类型与 fallback 存在。

### 3.2 后端课程元数据与拼读规则（DB + fallback）

文件：`cloudbase/functions/memory-engine/config/alphabetLessonConfig.js`

- 本地 `LESSON_METADATA` / `PHONICS_RULES` 定义与前端完全一致；
- 提供统一 DB 读取方法：
  - `getLessonMetadataFromDb(db, lessonId)`  
    → 优先查 `alphabet_lessons`（按 `doc(lessonId)`），失败落回本地 `LESSON_METADATA[lessonId]`；
  - `getPhonicsRuleByLessonFromDb(db, lessonId)`  
    → 优先查 `phonics_rules`（`where({ lessonId }).limit(1)`），失败在本地 `PHONICS_RULES` 中按 `lessonId` 查找。

你此前已通过 JSONL（`cloudbase/1.json`, `cloudbase/2.json`）把全部 lesson 与 rule 导入 DB，因此正常流程会命中 DB 而非本地 fallback。

### 3.3 getAlphabetLessons（新后端 handler）

文件：`cloudbase/functions/memory-engine/handlers/getAlphabetLessons.js`

- `action: 'getAlphabetLessons'`
- 行为：
  1. 尝试从 `alphabet_lessons` 集合读取所有课程（`orderBy('order','asc')`）；
  2. 若失败或集合为空，则回退到本地 `LESSON_METADATA`；
  3. 返回 `createResponse(true, { lessons }, '获取字母课程列表成功')`。
- 在 `memory-engine/index.js` 中注册：
  - 导入 `getAlphabetLessons`；
  - 增加 `if (action === 'getAlphabetLessons')` 分支；
  - 将 `'getAlphabetLessons'` 加入 `supportedActions` 列表。
- 在 `memory-engine/utils/constants.js` 中：
  - 将 `'getAlphabetLessons'` 加入 `SUPPORTED_ACTIONS`。

---

## 4. 记忆引擎（memory-engine）与字母模块

### 4.1 getTodayMemories（字母专用逻辑）

文件：`cloudbase/functions/memory-engine/handlers/getTodayMemories.js`

与本快照相关的关键点：

- 支持 `entityType: 'letter' | 'vocabulary' | ...`，其中字母逻辑已经重构为「按课程取字母」：
  - 参数：
    - `lessonId`：**前端必传**，优先决定本次学习/复习范围；
    - `limit`：对字母只作为复习上限（统一为 30），不再决定「新字母数量」。
  - 处理流程（字母）：
    1. 根据 `lessonId` 调用 `getLessonMetadataFromDb` → `lessonMetadata`；
    2. 根据 `lessonId` 调用 `getPhonicsRuleByLessonFromDb` → `phonicsRule`；
    3. 从 `letters` 集合中，按课程字段（例如 `curriculumLessonIds` 或 `lessonNumber` 等预处理字段）一次性拿够该课所有需学字母；
    4. 将 `items`、`summary`、`lessonMetadata`、`phonicsRule` 一并返回。
- 其他实体类型（如 `vocabulary`）仍保留原有逻辑。

### 4.2 submitRoundEvaluation（字母三轮评估结果）

文件：`cloudbase/functions/memory-engine/handlers/submitRoundEvaluation.js`

- `action: 'submitRoundEvaluation'`
- 仅支持 `entityType === 'letter'`；
- 参数：`{ userId, entityType, lessonId, roundNumber, totalQuestions, correctCount, accuracy }`
- 行为：
  - 计算 `passed = accuracy >= 0.9`；
  - 在 `user_alphabet_progress` 集合中：
    - 若不存在记录：创建初始记录（含 `letterProgress: 0.0` 等默认字段 + `roundHistory: [roundEntry]`）；
    - 若存在记录：按 `lessonId + roundNumber` 替换/追加 `roundHistory` 中的条目，并更新 `currentRound`、`updatedAt`。
- **不修改任何 SM-2 记忆字段**，仅为统计用途。

---

## 5. 前端字母 Store 与学习引擎

### 5.1 字母 Store：useAlphabetStore

文件：`src/stores/alphabetStore.ts`

职责：

- 负责从后端获取「今日字母队列」并映射为前端可用的 `AlphabetLearningState`；
- 管理当前字母、完成数量与音频预加载；
- 将「对/错」映射为 `QualityButton` 并调用 `submitMemoryResult`；
- 在每轮评估结束时，上传一个整体分数到 `submitRoundEvaluation`。

关键字段与方法：

- 状态：
  - `queue: AlphabetLearningState[]`
  - `currentItem`, `currentIndex`
  - `completedCount`, `totalCount`
  - `lessonMetadata: LessonMetadata | null`
  - `phonicsRule: PhonicsRule | null`
  - `cachedAudioKeys: string[]`（预下载去重）
- `initializeSession(userId, { lessonId })`：
  - 调用 `callCloudFunction<TodayLettersResponse>('getTodayMemories', { userId, entityType: 'letter', limit: 30, includeNew: true, lessonId }, { endpoint: API_ENDPOINTS.MEMORY.GET_TODAY_MEMORIES.cloudbase })`；
  - 映射 `Letter` → `AlphabetLearningState`，并预下载音频。
- `submitResult(userId, isCorrect)`：
  - 将 `isCorrect` 映射为 `QualityButton.KNOW` / `.FORGET`；
  - 调用 `callCloudFunction('submitMemoryResult', {...})`；
  - 本地更新队列中的 `currentAttempts` / `qualityHistory` / `isCompleted`。
- `submitRoundEvaluation({ userId, lessonId, roundNumber, totalQuestions, correctCount, accuracy })`：
  - 调用 `callCloudFunction('submitRoundEvaluation', {...})`，只做日志记录，不改变前端流程。

### 5.2 学习引擎 Hook：useAlphabetLearningEngine

文件：`src/hooks/useAlphabetLearningEngine.ts`

职责：

- 实现字母模块的「7 阶段」状态机 + 「三轮评估」；
- 把 memory-engine + alphabetStore 抽象成一个「学习引擎」，供页面和组件直接使用；
- 负责 Mini Review 题型生成（当前是简化版）。

对外返回的关键字段：

- `phase: Phase` — `'yesterday-review' | 'yesterday-remedy' | 'today-learning' | 'today-mini-review' | 'today-final-review' | 'today-remedy' | 'finished'`
- `currentRound: 1 | 2 | 3`
- `roundEvaluation: RoundEvaluationState`
- `initialized: boolean`
- `currentItem: AlphabetLearningState | null`
- `currentQuestionType: QuestionType | null`
- `letterPool: Letter[]`（用于 AlphabetReviewView 组题）
- `phonicsRule`, `showPhonicsRuleCard`, `onCompletePhonicsRule`
- `miniReviewQuestion`, `onMiniReviewAnswer`, `onMiniReviewNext`
- `onAnswer(isCorrect, questionType)` — 复习阶段答题回调
- `next()` — 推进阶段/题目
- `skipYesterdayReview()` — 跳过昨日复习（开发/体验用）

Mini Review 题型生成（简化扩展版）：

- 函数：`buildMiniReviewQuestionsFromLetters(letters, maxQuestions = 3)`
- 行为：
  1. 对若干随机字母生成 `sound-to-letter` 题：
     - `type: QuestionTypeEnum.SOUND_TO_LETTER`
     - 题干：`"🔊 听音，选择刚才学过的字母"`
     - 选项：目标字母 + 若干干扰字母（均来自当前课的字母池）
     - 音频：使用 `getLetterAudioUrl(letter, 'letter')`。
  2. 轻量扩展一个 `letter-to-sound` 题（若条件满足）：
     - 选择池中的第一个字母 `base`（有 `initialSound`）；
     - 从其他字母中抽取 2–3 个不同的 `initialSound` 作为干扰项；
     - `type: QuestionTypeEnum.LETTER_TO_SOUND`
     - 题干：`字母「X」的首音是？`
     - 选项：`[base.initialSound, ...distractor.initialSound]`（打乱顺序）；
     - 解释：`「X」的首音是 ...`
     - 音频：同样使用 `getLetterAudioUrl(base, 'letter')`（但在 UI 中不强依赖）。
- 最终返回 `questions.slice(0, maxQuestions)`，保证 Mini Review 题目数量不会超过上层期望。

三轮评估逻辑（简要）：

- 在 `today-remedy` 阶段，当 `wrongTodayMini` 与 `wrongTodayFinal` 均为空时：
  1. 计算本轮总题数与正确题数，得到 `finalCorrectRate`；
  2. 若 `finalCorrectRate >= 0.9`：
     - 对 `todayList` 中每个字母，根据错题次数映射出 `QualityButton`，再调用 `submitResult`；  
       （逻辑：错题 ≥3 → FORGET；≥1 → FUZZY；0 → KNOW）
     - 向 `roundEvaluation.rounds` 追加当前轮的统计；
     - 调用 `submitRoundEvaluation` 上传三轮成绩；
     - 若 `currentRound < 3`：`currentRound++`，并调用 `resetRoundState` / `resetLearningState`；
     - 若 `currentRound === 3`：
       - 调用 `markAlphabetLessonCompleted(lessonId)`；
       - 将 `phase` 置为 `'finished'`。

### 5.3 模块访问控制：useModuleAccessStore

文件：`src/stores/moduleAccessStore.ts`

- 从 memory-engine 获取用户总体进度：`getUserProgress`；
- 校验模块访问权限：`checkAccess('letter' | 'word' | 'sentence' | 'article')`；
- 本地降级逻辑：
  - 字母模块：始终可访问；
  - 其他模块：当 `letterCompleted === true` 或 `letterProgress >= 0.8` 时统一解锁。
- `markAlphabetLessonCompleted(lessonId)`：
  - 维护 `completedAlphabetLessons: string[]`；
  - 基于完成课数更新：
    - `letterProgress`：
      - ≥4 课 → 至少 0.8；
      - ≥6 课 → 至少 0.9；
      - 7 课 → 1.0。
    - `letterCompleted`：
      - 完成前 6 课即视为核心字母完成（第 7 课不影响解锁）。

---

## 6. 前端页面与组件

### 6.1 字母课程总览页：app/alphabet/index.tsx

文件：`app/alphabet/index.tsx`

行为变更：

- **旧版**：直接读取本地 `getAllLessons()` 构建课程列表；
- **新版**：优先从后端获取 `alphabet_lessons` 列表，失败时才回退本地配置。

核心逻辑：

```ts
const [lessons, setLessons] = useState<LessonCardProps[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  let mounted = true;

  const mapLessons = (list: LessonMetadata[]): LessonCardProps[] => { ... };

  (async () => {
    try {
      const res = await callCloudFunction<{ lessons: LessonMetadata[] }>(
        'getAlphabetLessons',
        {},
        { endpoint: API_ENDPOINTS.MEMORY.GET_TODAY_MEMORIES.cloudbase },
      );

      const list = (res.success && res.data?.lessons) || getAllLessons();
      if (!mounted) return;
      setLessons(mapLessons(list));
    } catch {
      if (!mounted) return;
      setLessons(mapLessons(getAllLessons()));
    } finally {
      if (mounted) setLoading(false);
    }
  })();

  return () => { mounted = false; };
}, []);
```

显示内容：

- 头部：课程总数 + 当前会话中已完成字母数的整体进度（来自 `useAlphabetStore`）；
- 课程卡片：
  - `lesson.title`, `lesson.description`
  - 「本课包含 X 个字母」
  - 「开始学习」按钮：根据累计完成数量及课程顺序判断是否解锁/当前课程。
- 底部：一键测试解锁入口 `/alphabet/test`（现有逻辑保留）。

### 6.2 字母课程学习页：app/alphabet/[lessonId].tsx

文件：`app/alphabet/[lessonId].tsx`

- 从路由获取 `lessonId`；
- 使用 `useAlphabetLearningEngine(lessonId)` 获取学习状态；
- 将 `phase`, `initialized`, `currentRound`, `roundEvaluation`, `currentItem` 等传入 `AlphabetLearningEngineView`；
- 提供 `router.back()` 作为返回操作。

### 6.3 学习引擎视图：AlphabetLearningEngineView

文件：`src/components/learning/alphabet/AlphabetLearningEngineView.tsx`

- 根据 `phase` 渲染不同阶段 UI：
  - `yesterday-review / yesterday-remedy / today-final-review / today-remedy`  
    → `AlphabetReviewView`
  - `today-mini-review` → `MiniReviewQuestion`
  - `today-learning` → `PhonicsRuleCard`（首次进入）或 `AlphabetLearningView`
  - `finished` → 显示三轮评估结果概览。
- 简单的轮次提示 `RoundHeader`：

```tsx
function RoundHeader({ currentRound }: { currentRound: number }) {
  return (
    <View ...>
      <Text>第 {currentRound} 轮 / 共 3 轮</Text>
    </View>
  );
}
```

- 完成阶段展示三轮统计（文字版）：
  - 每轮：轮次编号 + 准确率 + 是否通过，使用不同颜色标示；
  - 提示用户可以返回课程列表继续下一课。

### 6.4 Mini Review 组件：MiniReviewQuestion

文件：`src/components/learning/alphabet/MiniReviewQuestion.tsx`

- 支持的题型：通过枚举 `QuestionType`（包含 sound-to-letter / letter-to-sound / aspirated-contrast 等）；
- 根据 `QUESTION_TYPE_LABELS` 和 `QUESTION_TYPE_ICONS` 展示题型信息；
- 支持可选音频播放、声学提示（aspirated / voiceless / class）以及简单的音高可视化（tone-perception 预留）。

当前 Mini Review 实际使用的是：

- `SOUND_TO_LETTER`（必定存在）；
- 可选 `LETTER_TO_SOUND`（当 `initialSound` 足够生成选项时）。

---

## 7. 其他清理与修复

### 7.1 learn-vocab: getSkippedWords 集合名修复

文件：`cloudbase/functions/learn-vocab/handlers/getSkippedWords.js`

- 修复了错误的集合名：
  - 原：`db.collection('vocabularies')`
  - 现：`db.collection('vocabulary')`

确保与实际 DB 集合和 `COLLECTIONS.VOCABULARY` 保持一致。

---

## 8. 当前状态与建议（简要）

> 更详细的 P0/P1 进度与后续建议见 `docs/Document/progress-v2.0.0-V11.md`。

- P0 字母模块目标（课程表、拼读规则卡片、Mini Review 触发、课程驱动的 getTodayMemories）已跑通；
- P1 核心（三轮评估状态 + DB 字段、课程列表从 DB 拉取、Mini Review 轻量扩展）已完成；
- ApiClient + EndpointMap + COLLECTIONS 已经在主要路径上统一使用。

后续主要工作建议集中在：

1. 根据真实教学需求，逐步引入更丰富的 Mini Review 题型（送气对比、元音长短、声调感知），但在当前框架下实现相对容易；
2. 决定单词模块是否完全迁移到 memory-engine 统一记忆流，或继续保持 learn-vocab 专职单词，引入更清晰的 EndpointMap 映射；
3. 循序渐进地去除已标记为 Deprecated 的本地配置与旧集合名，降低未来维护成本。

