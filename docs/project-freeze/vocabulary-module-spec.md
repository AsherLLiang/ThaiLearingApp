# 词汇模块最终规格说明（Vocabulary Module Spec, Freeze Draft）

> 目录：`docs/project-freeze/vocabulary-module-spec.md`  
> 适用范围：**词汇学习前端 + `vocabulary` 云函数 + 统一记忆逻辑（SM‑2）**  
> 目标：冻结词汇模块的职责边界、流程、题型与记忆策略，让后续开发只需按本文档实现即可。

---

## 1. 模块定位与边界

### 1.1 模块职责

词汇模块负责：

- 提供基于课程的**泰语单词精讲 + 复习学习体验**；  
- 使用 `vocabulary` 云函数中的 SM‑2 记忆引擎管理**长期复习计划**；  
- 在前端实现**当日学习脚本 + 错题统计 + 质量聚合**，避免高频网络请求；  
- 与 Courses 模块 & LearningStore 协同，记录用户当前单词课程、学习时长与打卡信息。

### 1.2 与其他模块的关系

- 与 **Courses 模块**：
  - Courses 页负责展示“基础泰语 1/2/3 …”等单词课程；
  - 点击某个单词课程卡片后，导航到 `app/learning/index.tsx?module=word&source=COURSE_ID`；
  - Courses 不关心具体题型和记忆逻辑。

- 与 **LearningStore（全局学习状态）**：
  - 记录 `currentCourseId`、`streakDays`、`totalStudyMinutes` 等全局信息；
  - 词汇模块在会话开始/结束时调用 `learningStore.registerStudySession` 记录一条学习会话。

- 与 **Alphabet 模块 / memory-engine**：
  - Alphabet 模块负责“字母课程级训练”，内置三轮机制；  
  - 词汇模块负责“长期词汇 SRS”，使用 `vocabulary` 云函数维护 `learningStatus`；  
  - 课程级解锁（例如“必须完成字母课程后才能学习词汇”）由 `moduleAccessStore` 控制。

---

## 2. 相关代码文件与调用栈

### 2.1 前端路由与页面

- `app/(tabs)/courses.tsx`
  - 展示全部课程列表；
  - 对 `category === 'vocabulary'` 的课程使用 `CourseCard` 渲染；
  - 点击后：`router.push('/learning?module=word&source=' + course.source)`；
  - 同时调用 `learningStore.setCurrentCourse(course.source)`。

- `app/learning/index.tsx`
  - 统一学习入口；通过 query 参数 `module` 决定是字母模块还是词汇模块：
    - `module=word` → 词汇学习会话（WordSession）；
    - `module=letter` → 字母学习会话（AlphabetSession）。  
  - 当前实现仍有大量 mock 数据，本规范定义的为**目标行为**。

### 2.2 组件层

- `src/components/learning/NewWordView.tsx`
  - 展示单词的“精讲卡片”，包含：
    - 泰语词形 + 发音 + 词性；
    - 基础释义、联想拆分、记忆提示；
    - 例句、对话示例、用法详解、常见错误、相似词对比等 Tab。
  - 由词汇学习引擎在“新词讲解阶段”使用。

- `src/components/learning/ReviewWordView.tsx`
  - 现有版本主要展示“卡片 + 三个质量按钮（忘记/模糊/记得）”；  
  - 冻结版目标：
    - 重构为“题型容器”，支持 4 种选择题 + 2 种拼写题（见 4.1）；  
    - 每道题只负责：
      - 渲染题干 + 选项/输入框；  
      - 将 `isCorrect` / `questionType` 回调给上层。

### 2.3 Store 与 Hook

- `src/stores/vocabularyStore.ts`
  - 目前：混合了旧版 `memory-engine` 思路与本地进度逻辑。  
  - 冻结目标：将其重构为**词汇会话总控 Store**：
    - 维护 `VocabularySessionState`（见 3.3）；  
    - 暴露：
      - `initializeSession(userId, source)`：初始化 / 恢复会话；  
      - `answerQuestion(vocabularyId, isCorrect, questionType)`：记录一次答题；  
      - `revealHint(vocabularyId)`：用户查看提示/答案；  
      - `finishSession()`：结束今日学习并提交分数；  
      - `skipReviewAndLearnNew()`：跳过“今日复习，直接学新词”；  
      - `resetCourseProgress(source)`：清空某课程的本地/远端进度。

- `src/stores/learningPreferenceStore.ts`
  - 提供用户设定的每日单词学习上限：`dailyLimits.word`；  
  - 词汇模块通过它决定当日最多学习/复习多少个单词。

- `src/stores/learningStore.ts`（规划中）
  - 记录当前课程、学习时长、打卡天数等全局信息；  
  - 词汇会话开始/结束时调用：
    - `registerStudySession({ module: 'word', courseSource, durationMinutes })`。

### 2.4 云函数与后端

- `cloudbase/functions/vocabulary/index.js`
  - 多 Action 云函数，至少包含：
    - `getTodayWords`：返回今日需要学习/复习的单词列表；  
    - `updateMastery`：根据掌握程度更新 SM‑2 记忆状态；  
    - `getVocabularyDetail`：获取单词精讲卡片内容；  
    - `getReviewStatistics`：返回整体进度统计。  
  - 参照 `docs/08-Vocabulary-API-Documentation.md`。

---

## 3. 会话层设计：今日学习 / 复习流程

### 3.1 基本原则

- **统一入口**：每次进入 `/learning?module=word&source=XXX` 都启动一次“词汇学习会话”；  
- **先复习后新学**：优先处理 `getTodayWords` 返回的复习项，再分配新词；  
- **会话内多题型**：同一个单词在一次会话中可以出现多道题，但最终只产生一次质量值；  
- **失败补救**：每个单词至少出现一次答对记录才算“本次会话通过”；否则记为 `陌生`。

### 3.2 当日目标与队列构建

1. 读取用户设定：`dailyLimit = learningPreferenceStore.dailyLimits.word`（默认 20）。  
2. 调用云函数：

```ts
callCloudFunction<GetTodayWordsResponse>('vocabulary', {
  action: 'getTodayWords',
  data: {
    userId,
    limit: dailyLimit,
    level: courseLevel,        // 可选：由 courseSource 决定
  },
});
```

3. 云函数返回：

```ts
{
  words: TodayWordItem[];
  summary: {
    reviewCount: number;
    newCount: number;
  };
}
```

4. 前端队列划分：

- `reviewWords` = `words.filter(w => w.learningStatus?.isReview)`；  
- `newWords`    = `words.filter(w => w.learningStatus?.isNew)`；  
- 可以根据 `dailyLimit` 做再次裁剪（例如“至少一半是复习词”）。

### 3.3 VocabularySessionState（建议）

```ts
export type VocabularyQuestionType =
  | 'THAI_TO_CN_4CHOICE'      // 看泰语选中文
  | 'CN_TO_THAI_4CHOICE'      // 看中文选泰语
  | 'AUDIO_TO_THAI_4CHOICE'   // 听音选泰语
  | 'AUDIO_TO_CN_4CHOICE'     // 听音选中文
  | 'SPELL_THAI_FROM_CN'      // 看中文拼写泰语
  | 'SPELL_THAI_FROM_AUDIO';  // 听音拼写泰语

export interface VocabularyQuestionRecord {
  vocabularyId: string;
  questionType: VocabularyQuestionType;
  isCorrect: boolean;
  usedHint: boolean;
}

export interface VocabularyPerWordStats {
  attempts: number;
  wrongCount: number;
  usedHint: boolean;
  questionTypes: VocabularyQuestionType[];
}

export interface VocabularySessionState {
  userId: string;
  courseSource: string;           // 例如 'BASIC_THAI_1'
  dateKey: string;                // 'YYYY-MM-DD'

  reviewQueue: string[];          // vocabularyId[]
  newQueue: string[];             // vocabularyId[]
  currentIndex: number;
  mode: 'REVIEW' | 'LEARN_NEW';

  perWordStats: Record<string, VocabularyPerWordStats>;

  // 是否已提交到后端
  submitted: boolean;
}
```

持久化：

- 使用 `persist` + AsyncStorage，key 建议为：`vocabulary-session:${userId}:${courseSource}:${dateKey}`。  
- 若用户中途退出，再次进入同一课程、同一天时，优先恢复该 Session。

---

## 4. 题型与安排策略

### 4.1 可实现的 6 种题型

1. `THAI_TO_CN_4CHOICE`：**看泰语选中文**（4 选 1）。  
2. `CN_TO_THAI_4CHOICE`：**看中文选泰语**（4 选 1）。  
3. `AUDIO_TO_THAI_4CHOICE`：**听音选泰语**（4 选 1）。  
4. `AUDIO_TO_CN_4CHOICE`：**听音选中文**（4 选 1）。  
5. `SPELL_THAI_FROM_CN`：看中文，用户使用系统键盘**输入泰语拼写**。  
6. `SPELL_THAI_FROM_AUDIO`：听音，用户输入泰语拼写。

> 近似词干扰题暂不在本版本实现；干扰项优先从**同课程、同词性**单词中随机抽取。

### 4.2 会话中的题型顺序（MVP）

目标版本（2 个月内可完成）采用**轻量优先**策略：

- 对于**复习词**：
  - 默认安排 1–2 道题：
    - 第一道：`THAI_TO_CN_4CHOICE` 或 `CN_TO_THAI_4CHOICE`；  
    - 第二道（可选，高掌握度时）：`AUDIO_TO_THAI_4CHOICE` 或 `AUDIO_TO_CN_4CHOICE`。  
- 对于**新词**：
  - 先展示 `NewWordView` 讲解卡；  
  - 紧跟一题：`CN_TO_THAI_4CHOICE`（巩固形义对应）；  
  - 当该词在未来复习阶段掌握度较高时，才引入拼写题。

拼写题（5/6）暂规划为**后续迭代**，当前规格只要求预留类型与数据结构。

### 4.3 题型与质量评分关系

- 每道题结束后，Store 只记录：

```ts
answerQuestion(vocabularyId, isCorrect, questionType, { usedHint });
```

- 会话结束时，对每个单词聚合：

```ts
type MasteryLevel = '陌生' | '模糊' | '记得';

function computeMasteryFromStats(stats: VocabularyPerWordStats): MasteryLevel {
  if (stats.wrongCount === 0 && !stats.usedHint) return '记得';
  if (stats.wrongCount <= 1) return '模糊';
  return '陌生';
}
```

---

## 5. 与 `vocabulary` 云函数的互动

> ⚠️ 字段对齐说明：  
> - 后端 `vocabulary` 集合已更新为**富结构字段**（见 `docs/database_schema.md` 1.2 与 `src/entities/types/vocabulary.types.ts`）；  
> - `getTodayWords`、`getVocabularyDetail` 等接口返回的字段必须至少覆盖：
>   `_id / vocabularyId / thaiWord / meaning / pronunciation / partOfSpeech / level / lessonNumber / startingLetter / source / audioPath`  
>   以及 `exampleSentences / dialogue / usage / mistakes / cognates` 中用到的子字段；  
> - 若实际集合字段发生变化，必须**先更新 `vocabulary.types.ts` 和 `database_schema.md`，再同步修改本 Spec 和 08-Vocabulary-API 文档**。

### 5.1 获取今日单词：getTodayWords

在 `initializeSession` 中：

```ts
const response = await callCloudFunction<ApiResponse<GetTodayWordsResponse>>(
  'vocabulary',
  {
    action: 'getTodayWords',
    data: {
      userId,
      limit: dailyLimit,
      level: courseLevel,
    },
  },
);
```

- 若发现存在未提交的本地 Session（相同 userId + courseSource + dateKey 且 `submitted === false`），优先恢复本地状态，**不重复请求**；  
- 新的一天或首次进入时才调用 `getTodayWords`。

### 5.2 提交掌握程度：updateMastery（聚合提交）

在 `finishSession()` 中：

```ts
async function finishSession() {
  const { userId, courseSource, perWordStats } = getState().session;

  const entries = Object.entries(perWordStats);

  for (const [vocabularyId, stats] of entries) {
    const mastery = computeMasteryFromStats(stats); // 陌生/模糊/记得

    await callCloudFunction('vocabulary', {
      action: 'updateMastery',
      data: {
        userId,
        vocabularyId,
        mastery,
      },
    });
  }

  // 标记 submitted，避免重复提交
  setState((prev) => ({
    ...prev,
    session: { ...prev.session, submitted: true },
  }));
}
```

注意：

- 每个单词在一次会话内**仅提交一次 mastery**；  
- 再次进入时，如仍在同一天且 Session 已提交，则使用新的 `getTodayWords` 结果开始下一轮（通常不会发生）。

---

## 6. 典型用例与端到端时序

### 6.1 从 Courses 进入词汇学习

```text
用户
  │ 点击“基础泰语 1”课程卡片
  ▼
app/(tabs)/courses.tsx
  │ 调用 learningStore.setCurrentCourse('BASIC_THAI_1')
  │ router.push('/learning?module=word&source=BASIC_THAI_1')
  ▼
app/learning/index.tsx（WordSession）
  │ 读取 query.module='word', source='BASIC_THAI_1'
  │ 调用 vocabularyStore.initializeSession(userId, source)
  ▼
vocabularyStore.initializeSession
  │ 检查本地是否存在未提交 Session（同 userId+source+date）
  ├─ 有 → 直接恢复 VocabularySessionState（不调后端）
  └─ 无 → 调用 vocabulary.getTodayWords → 构建 reviewQueue/newQueue
  ▼
WordSession
  │ 根据当前队列渲染：
  ├─ review item → ReviewWordView + 选择题
  └─ new item    → NewWordView（讲解）→ ReviewWordView（轻量选择题）
```

### 6.2 做题、记录与提交

```text
ReviewWordView / 拼写组件
  │ 用户答题 → onResult({ isCorrect, questionType, usedHint })
  ▼
WordSession
  │ 调用 vocabularyStore.answerQuestion(vocabularyId, isCorrect, questionType, usedHint)
  ▼
vocabularyStore.answerQuestion
  │ 更新 session.perWordStats[vocabularyId]
  │ 按队列规则选择下一个单词
  ▼
WordSession
  │ 队列全部完成 → 显示“本次学习完成”页
  │ 用户点击“结束今天学习”
  ▼
vocabularyStore.finishSession
  │ 对所有 perWordStats 计算 mastery（陌生/模糊/记得）
  │ 为每个单词调用 vocabulary.updateMastery（一次会话只提交一次）
  │ 标记 session.submitted = true
  ▼
学习结束
  │ 调用 learningStore.registerStudySession({ module:'word', courseSource, durationMinutes })
  │ 跳转回首页或 Courses 页
```

---

## 7. 任务列表与里程碑（词汇模块）

> 目标：在剩余约 2 个月的周期内，完成一个**可上线的最小可用词汇模块**。

### 7.1 P0：接入 `vocabulary` 云函数基础能力（约 1 周）

- [ ] 将 `vocabularyStore.initSession` 从旧的 memory-engine 逻辑切换为 `vocabulary.getTodayWords`。  
- [ ] 增加 `vocabularyStore.finishSession`，调用 `updateMastery` 提交结果。  
- [ ] 在 `app/learning/index.tsx` 中移除 mock 数据，改为使用 `vocabularyStore` 提供的当前单词。

### 7.2 P1：实现 VocabularySessionState 与会话恢复（约 1–2 周）

- [ ] 定义并实现 `VocabularySessionState`、`perWordStats` 与持久化逻辑。  
- [ ] 实现 `answerQuestion` / `skipReviewAndLearnNew` / `resetCourseProgress` 等核心 API。  
- [ ] 手工测试：在复习阶段、新词讲解阶段、错题阶段中途退出，重新进入后能够恢复。

### 7.3 P2：题型容器与 4 种选择题（约 2 周）

- [ ] 重构 `ReviewWordView`，拆成：题目容器 + 具体题型 renderer。  
- [ ] 实现 4 种选择题（不含拼写题），支持传入干扰项。  
- [ ] 实现简单干扰项生成器：从同课程 + 同词性中随机选 3 个。  
- [ ] 将 `WordSession` 改为根据 `learningStatus` 与 `perWordStats` 选择题型。

### 7.4 P3：拼写题（可选，约 2 周）

- [ ] 实现 `SPELL_THAI_FROM_CN` 与 `SPELL_THAI_FROM_AUDIO` 题型组件。  
- [ ] 使用系统键盘输入泰语，不做模糊匹配，只接受**完全一致**的词形。  
- [ ] 将拼写题仅用于高掌握度单词，以减少用户负担。

### 7.5 P4：统计与优化（约 1 周）

- [ ] 集成 `getReviewStatistics`，在 Courses 或个人中心展示整体掌握率。  
- [ ] 为 `vocabulary` 云函数增加必要日志（userId、vocabularyId、mastery、source）。  
- [ ] 在 `docs/project-freeze/README.md` 中标记词汇模块为“已冻结架构”。

---

本规格文档定义了词汇模块从路由、组件、Store、云函数到记忆算法的完整链路，并给出了**按单词聚合质量 + 批量提交**的最终方案。  
后续所有关于词汇的 UI/题型/AI 拓展（例如 AI 例句生成、弱项强化）都必须建立在本规格之上，不得再引入第二套记忆 / 队列系统。***
