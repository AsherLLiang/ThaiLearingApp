# ThaiLearningApp 进度文档 V11（P0 + P1 总结）

> 版本：V11  
> 时间：2025-12-08  
> 覆盖范围：泰语字母模块（Alphabet）+ 统一记忆引擎（memory-engine）+ API/配置层

本进度文档用于让后续接手的同学快速了解：

- P0/P1 已完成了哪些工作（文件级别指引）；
+- 当前架构处于什么状态；
*- 后续可以考虑的工作项（建议，不是硬性计划）。

---

## 1. P0 目标与完成情况

### 1.1 P0 目标回顾

围绕字母模块，P0 的目标可以概括为：

1. 按 V3.0 课程方案完成字母课程重构（由 5 课 → 7 课）；
2. 实现「拼读规则卡片（PhonicsRuleCard）」在 Today Learning 阶段首次教学；
3. 实现 Mini Review（每 3 个字母触发，简化题型即可）；
4. 让 `getTodayMemories` 返回真实的 `lessonMetadata` 和 `phonicsRule`，并且前端按课程 id 请求字母；
5. 保持原有 SM-2 记忆算法不变，仅从「课程 → 记忆引擎」方向接入字母。

### 1.2 P0 前端改动（已完成）

1. **课程元数据（前端备份）**
   - 文件：`src/config/alphabet/lessonMetadata.config.ts`
   - 主要内容：
     - `LESSON_METADATA`：7 课的课程表与元数据（consonants / vowels / tones / phonicsRuleId / totalCount / miniReviewInterval 等）；
     - 工具函数：`getLessonMetadata` / `getAllLessons` / `getLessonByLetter` / `getLessonStatistics`。

2. **字母 Store（统一入口）**
   - 文件：`src/stores/alphabetStore.ts`
   - 主要内容：
     - 从 memory-engine 的 `getTodayMemories` 获取「今日字母队列」，映射成 `AlphabetLearningState`；
     - `initializeSession(userId, { lessonId })`：按课程拉取字母，并预下载音频；
     - `submitResult(userId, isCorrect)`：将「对/错」映射成 `QualityButton`，调用 `submitMemoryResult`；
     - 缓存 `lessonMetadata` / `phonicsRule`，供学习引擎使用。

3. **拼读规则卡片**
   - 文件：`src/components/learning/alphabet/PhonicsRuleCard.tsx`
   - 主要内容：
     - 展示 `PhonicsRule`（标题 + 多行内容）；
     - 可选交互示例（辅音 + 元音 = 音节 + 音频播放）；
     - 支持倒计时结束 / 点击「明白了，继续学习」触发 `onComplete`。

4. **学习引擎 Hook（7 阶段 + 拼读规则触发）**
   - 文件：`src/hooks/useAlphabetLearningEngine.ts`
   - 主要内容：
     - 状态机 `phase: Phase`，包含 7 个阶段；
     - 首次进入 `today-learning` 时，如果当前课有 `phonicsRule` 且尚未展示，则显示 `PhonicsRuleCard`；
     - `MINI_REVIEW_INTERVAL = 3`，在 Today Learning 中每学 3 个字母后切入 `today-mini-review` 阶段；
     - 回调 `onAnswer` / `next` 供 UI 使用。

5. **学习引擎视图层**
   - 文件：`src/components/learning/alphabet/AlphabetLearningEngineView.tsx`  
     `app/alphabet/[lessonId].tsx`
   - 主要内容：
     - 根据 `phase` 渲染不同的子组件：
       - 昨日复习 / 补救 / Final Review / Today Remedy → `AlphabetReviewView`
       - Mini Review → `MiniReviewQuestion`
       - Today Learning → `PhonicsRuleCard` 或 `AlphabetLearningView`
     - `[lessonId].tsx` 通过 `useLocalSearchParams` 读取课程 ID，并调用 `useAlphabetLearningEngine(lessonId)`。

### 1.3 P0 后端改动（已完成）

1. **课程元数据与拼读规则（后端）**
   - 文件：`cloudbase/functions/memory-engine/config/alphabetLessonConfig.js`
   - 主要内容：
     - 本地 `LESSON_METADATA` / `PHONICS_RULES` 定义，与前端完全一致；
     - DB 获取函数：
       - `getLessonMetadataFromDb(db, lessonId)` → 优先查 `alphabet_lessons`，失败回退本地；
       - `getPhonicsRuleByLessonFromDb(db, lessonId)` → 优先查 `phonics_rules`，失败回退本地。

2. **getTodayMemories（按课程获取字母）**
   - 文件：`cloudbase/functions/memory-engine/handlers/getTodayMemories.js`
   - 主要内容：
     - 支持 `entityType: 'letter'` 对应的课程逻辑：
       - 使用 `lessonId` 从 `alphabet_lessons` 中获取课程信息；
       - 按课程字段从 `letters` 集合中拿取本课所有字母（新字母）；
       - 结合 `memory_status` 装配复习队列；
       - 在响应中增加 `lessonMetadata` 与 `phonicsRule` 字段，供前端使用。

3. **DB 快照 / 导入**
   - 由你已完成：
     - 把 `LESSON_METADATA` / `PHONICS_RULES` 导出为 JSONL；
     - 导入 CloudBase `alphabet_lessons` / `phonics_rules` 集合；
   - 当前 memory-engine 正常命中 DB，而本地配置仅用于 fallback。

> 结论：P0 目标（字母课程 7 课 + Today Learning 拼读规则卡片 + Mini Review 触发 + 课程驱动 getTodayMemories）已经跑通，且前后端对课程和规则的来源统一指向 DB。

---

## 2. P1 目标与完成情况

### 2.1 P1 目标回顾

围绕文档与讨论，P1 主要包含：

1. **三轮评估系统（RoundEvaluationState + DB 字段）**  
   - 字母学习用户只有「对/错」按钮，需要在每一轮结束时上传一个整体分数，供后端记忆算法和统计使用。
2. **课程表完全由后端驱动，消除前后端双份配置风险**  
   - 前端课程总览页（Alphabet 课程列表）不再直接读本地配置，而是通过 API 从 `alphabet_lessons` 获取。
3. **Mini Review 题型的实际扩展（至少比「只有一个 sound-to-letter」更丰富一点）**  
   - 先用已有 mp3 实现简单扩展，后续再加入送气对比、元音长短、声调等高级题型。
4. **API / 集合名统一管理**  
   - `apiClient + EndpointMap` 与实际存在的 CloudBase 函数一致；
   - `COLLECTIONS` 与实际存在的集合一致；
   - 修复明显不一致的地方（如 `vocabularies` → `vocabulary`）。

### 2.2 三轮评估（前后端完整链路）——已完成

**类型定义：**

- 文件：`src/entities/types/phonicsRule.types.ts`
  - `RoundEvaluationState`
  - `RoundConfig`（当前未完全使用，为未来扩展预留）

**后端：submitRoundEvaluation**

- 文件：`cloudbase/functions/memory-engine/handlers/submitRoundEvaluation.js`
  - 接口：
    - `action: 'submitRoundEvaluation'`
    - 仅支持 `entityType === 'letter'`
  - 行为：
    - 计算 `accuracy`（如未传则根据 `totalQuestions` 与 `correctCount` 反算）；
    - 判定 `passed = accuracy >= 0.9`；
    - 在 `user_alphabet_progress` 中：
      - 无记录：创建带 `roundHistory: [roundEntry]` 的新记录；
      - 有记录：按 `lessonId + roundNumber` 合并 / 替换 `roundHistory`，更新 `currentRound`。
  - 不影响 SM-2 记忆算法，仅记录轮次统计。

**memory-engine 主入口注册：**

- 文件：`cloudbase/functions/memory-engine/index.js`
  - 已注册 `submitRoundEvaluation` 分支；
  - `supportedActions` 列表中包含 `'submitRoundEvaluation'`。

**前端：RoundEvaluationState 管理与上传**

- 文件：`src/hooks/useAlphabetLearningEngine.ts`
  - 维护状态：
    - `currentRound: number`（1~3）
    - `roundEvaluation: RoundEvaluationState`
  - 在 `today-remedy` 阶段，当错题池清空时：
    - 计算 `finalCorrectRate`；
    - 若 ≥ 0.9：
      1. 使用 `submitRoundResults` 遍历 `todayList` 中的每个字母，按错题次数映射 `QualityButton`，再调用 `submitResult`，让记忆引擎更新字母记忆状态；
      2. 更新本地 `roundEvaluation.rounds`；
      3. 调用 `alphabetStore.submitRoundEvaluation` 将轮次统计上传后端；
      4. 若 `currentRound < 3`，重置本轮状态并进入下一轮；
      5. 若 `currentRound === 3`，调用 `markAlphabetLessonCompleted(lessonId)` 并将 `phase` 置为 `'finished'`。

- 文件：`src/stores/alphabetStore.ts`
  - 方法 `submitRoundEvaluation(params)`：
    - 直接调用 `callCloudFunction('submitRoundEvaluation', {...}, { endpoint: API_ENDPOINTS.MEMORY.SUBMIT_ROUND_EVALUATION.cloudbase })`；
    - 不更改本地状态，仅日志记录错误。

- 文件：`src/stores/moduleAccessStore.ts`
  - `markAlphabetLessonCompleted(lessonId)`：依据完成课程数更新 `letterProgress` 和 `letterCompleted`，并在完成前 6 课时视为核心字母已学完（第 7 课不影响解锁）。

**UI 展示：**

- 文件：`src/components/learning/alphabet/AlphabetLearningEngineView.tsx`
  - 新增 `currentRound` / `roundEvaluation` props；
  - 在除 `finished` 外的阶段顶部显示当前轮次（`RoundHeader`）；
  - 在 `finished` 阶段展示三轮评估结果（轮次 + 准确率 + 是否通过），使用不同颜色区分。

### 2.3 课程表从后端驱动（课程总览）——已完成

**后端：getAlphabetLessons**

- 文件：`cloudbase/functions/memory-engine/handlers/getAlphabetLessons.js`
  - `action: 'getAlphabetLessons'`
  - 优先从 `alphabet_lessons` 集合按 `order` 读取所有课程，失败回退到本地 `LESSON_METADATA`；
  - 返回结构：`{ lessons: LessonMetadata[] }`。
- 文件：`cloudbase/functions/memory-engine/index.js`
  - 已注册 `getAlphabetLessons` 分支；
  - 已将 `'getAlphabetLessons'` 加入 `supportedActions`；
- 文件：`cloudbase/functions/memory-engine/utils/constants.js`
  - `SUPPORTED_ACTIONS` 中增加 `'getAlphabetLessons'`。

**前端：课程总览页使用后端数据**

- 文件：`app/alphabet/index.tsx`
  - 旧逻辑：`const lessonMetadataList = getAllLessons();`
  - 新逻辑：
    - 使用 `callCloudFunction('getAlphabetLessons', {}, { endpoint: API_ENDPOINTS.MEMORY.GET_TODAY_MEMORIES.cloudbase })` 获取 `lessons`；
    - 若调用失败或数据为空，则回退到 `getAllLessons()`；
    - 使用 `useState` 管理 `lessons` 与 `loading` 状态：
      - 加载中显示 `ActivityIndicator`；
      - 加载完成后使用从后端来的课程列表渲染卡片。
  - 课程卡片仍保留原有 UI 与解锁逻辑，仅数据来源变为「后端优先」。

### 2.4 Mini Review 题型轻量扩展——已完成（第一版）

**扩展位置：**

- 文件：`src/hooks/useAlphabetLearningEngine.ts`
  - 函数：`buildMiniReviewQuestionsFromLetters(letters, maxQuestions = 3)`

**旧行为：**

- 仅为每个选中字母生成一个 `SOUND_TO_LETTER` 题：
  - 题干：`"🔊 听音，选择刚才学过的字母"`
  - 选项：目标字母 + 若干干扰字母
  - 音频：字母发音。

**新行为（在旧基础上的轻量扩展）：**

1. 保留 `SOUND_TO_LETTER` 题型，对 `pool` 中的每个字母生成一题；
2. 尝试生成一题 `LETTER_TO_SOUND`：
   - 选择池中的第一个字母 `base`，该字母必须有 `initialSound`；
   - 从其他字母中随机选出 2–3 个有 `initialSound` 且不同于 `base.initialSound` 的字母作为干扰项；
   - 构造题目：
     - `type: QuestionTypeEnum.LETTER_TO_SOUND`
     - `question: 字母「X」的首音是？`
     - `options`: `[base.initialSound, ...distractor.initialSound]` （打乱顺序）
     - `correct: base.initialSound`
     - `audioUrl: getLetterAudioUrl(base, 'letter')`
   - 若干扰项不足则跳过，保持题目数不多于 `maxQuestions`。

3. 最终返回 `questions.slice(0, maxQuestions)`，确保 Mini Review 题目数量受上层控制。

> 说明：这一版扩展仍然是「最小可用」，重点是打通题型扩展链路，后续可以逐渐加入 aspirated-contrast / vowel-length-contrast / tone-perception 等题型。

### 2.5 API / 集合名统一管理——已完成主要部分

1. **集合名统一**
   - `src/config/constants.ts` 中的 `COLLECTIONS` 与 CloudBase 实际集合完全对齐；
   - 修复了 `learn-vocab` 中 `getSkippedWords` 对 `vocabularies` 集合的错误引用：
     - 文件：`cloudbase/functions/learn-vocab/handlers/getSkippedWords.js`
     - 改为使用 `db.collection('vocabulary')`。

2. **API 端点标记**
   - `src/config/api.endpoints.ts`：
     - 对所有 CloudBase 端点增加注释：
       - 已有函数：`/user-*`, `/learn-vocab`, `/memory-engine`, `/alphabet` 等；
       - 占位/未实现：`/course-get-*`, `/learning-*`, `/review-*` 等；
     - 避免未来误用未实现的云函数名称。

3. **字母相关调用统一走 memory-engine**
   - 所有新的字母模块 API 调用都通过：
     - `callCloudFunction(..., { endpoint: API_ENDPOINTS.MEMORY.GET_TODAY_MEMORIES.cloudbase })`
     - 或 `API_ENDPOINTS.MEMORY.SUBMIT_*`。

> 注意：单词模块（`vocabularyStore`）目前仍有部分逻辑直接把 `MEMORY_ENDPOINTS` 当 REST API 用，这一块逻辑在设计上稍有“错位”，但不影响当前字母模块的稳定运行，建议作为中期重构项处理。

---

## 3. 下一步建议（仅供参考）

> 以下是建议路线，不是必须严格执行的 TODO。  
> 如果以后有新成员接手，可以根据资源与优先级做取舍。

### 建议 1：Mini Review 深度扩展（基于现有框架）

在当前已经打通的 Mini Review 题型框架下，可以逐步引入更“语音学友好”的题型：

- `ASPIRATED_CONTRAST`（送气 vs 不送气）：
  - 选取 `ก/ข/ค`、`ป/ผ/พ` 等最小对立组；
  - 用现有 mp3 构建「听音选字」/「选择送气 or 不送气」题；
- `VOWEL_LENGTH_CONTRAST`（元音长短）：
  - 使用简单的 CVC 对，如 `กา` vs `กะ`；
  - 先用静态词库，后续再从 DB 或配置中抽取。

实现上建议：

- 在 `buildMiniReviewQuestionsFromLetters` 内按 lessonId 区分是否启用这些题型；
- 尽量复用 `MiniReviewQuestion` 现有 UI，暂不对样式做大改动。

### 建议 2：单词模块与 memory-engine / learn-vocab 契约梳理

当前单词模块主要问题：

- `useVocabularyStore` 有部分调用直接把 `API_ENDPOINTS.MEMORY.GET_TODAY_MEMORIES` 当成 REST API 使用；
- `learn-vocab` 和 `memory-engine` 都有记忆相关逻辑，长期看容易导致重复与不一致。

建议两种路线中择一：

1. **统一到 memory-engine**：
   - 将单词学习也迁移到 `memory-engine` 内，由统一的 SM-2 实现管理；
   - `learn-vocab` 只保留历史兼容或完全废弃。
2. **明确职责边界**：
   - `memory-engine` 专治「字母 + 通用 SRS」；
   - `learn-vocab` 专治「单词学习 + 课程逻辑」，并在 `api.endpoints` 中明确标记；
   - 重写 `VOCABULARY_ENDPOINTS` 与 `callCloudFunction` 之间的关系。

### 建议 3：配置清理与文档同步

- 随着 DB 已成为课程与规则的唯一来源，可以考虑：
  - 将前端的 `lessonMetadata.config.ts` 与后端的本地 `LESSON_METADATA` 标记为「仅供开发环境调试 / fallback 使用」；
  - 在未来版本中，如果确认 DB 稳定，可逐步移除本地副本。
- 定期更新 `docs/Document/project-snapshot-*.md` 与 `progress-*.md`：
  - 避免文档版本落后于代码，尤其是涉及课程表、解锁逻辑和题型系统时。

---

## 4. 总结

- **P0**：字母模块的课程表、拼读规则卡片、按课程获取字母、Mini Review 触发和记忆引擎对接，已经全部跑通，并与 CloudBase DB 中的 `alphabet_lessons` / `phonics_rules` 保持一致。
- **P1**：三轮评估系统（RoundEvaluationState + DB 字段）已经完全集成；课程总览页已改为从后端拉取课程列表；Mini Review 完成了第一版题型扩展；API / 集合名的主要不一致之处已经修复。
- 当前架构已经具备**可持续演进**的基础：  
  课程表、拼读规则、记忆引擎、前端学习引擎之间的边界清晰，后续可以在不破坏主流程的前提下，迭代题型系统和其他模块。  

如需了解更详细的架构与文件级说明，请参考：  
`docs/Document/project-snapshot-v2.0.0-V11.md`。

