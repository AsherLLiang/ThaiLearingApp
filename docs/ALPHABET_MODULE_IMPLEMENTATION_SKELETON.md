# ALPHABET_MODULE_IMPLEMENTATION_SKELETON.md

> **用途说明（强制）**
>
> 本文档是 Alphabet 模块的【工程级实现骨架】。
> 任何 AI / 开发者在实现、重构 Alphabet 模块前，**必须完整阅读并严格遵循本文件**。
>
> 本文件的优先级：
> **ALPHABET_MODULE_IMPLEMENTATION_SKELETON.md**
> > ALPHABET_MODULE_FINAL_FACTS.md
> > alphabet-module-spec.md
> > 任何历史代码 / AI 建议
>
> 若实现与本文件冲突：**以本文件为准，修改代码，而不是修改骨架。**

---

## 0. 模块目标（冻结）

Alphabet 模块是 ThaiLearnApp 的**基础模块与论文亮点**，负责：

- 泰语字母的系统性学习
- 课程级解锁（逐步解锁、永久解锁）
- 控制其他所有模块（Vocabulary / Sentence / Article）的解锁入口
- 在完成后进入 **free-play（自由复习）模式**

---

## 1. 核心设计原则（冻结）

1. Alphabet **不使用 SM-2**
2. Alphabet 的学习节奏 **由前端控制**
3. Alphabet 有两种模式：
   - `learning`：首次学习 / 未完成模块
   - `free-play`：完成模块后的自由复习
4. 两种模式 **共用同一套 queue / phase 结构**
5. 不允许为 free-play 引入新阶段或新系统

---

## 2. 学习模式判定（冻结）

```ts
type AlphabetLearningMode = 'learning' | 'free-play'

mode =
  user_alphabet_progress.letterCompleted === true
    ? 'free-play'
    : 'learning'
```

---

## 3. buildAlphabetQueue（最终冻结骨架）

### 3.1 函数签名

```ts
function buildAlphabetQueue(params: {
  lessonId: string
  mode: AlphabetLearningMode
  round: 1 | 2 | 3
  lessonLetters: Letter[]
  previousRoundLetters?: Letter[]
  completedLessons: string[]
}): AlphabetQueueItem[]
```

---

### 3.2 常量（冻结）

```ts
const MINI_REVIEW_CHUNK = 3
const FREE_PLAY_REVIEW_LIMIT = 6
```

---

### 3.3 Queue Item 结构

```ts
interface AlphabetQueueItem {
  letter: Letter
  source:
    | 'previous-review'
    | 'new-learning'
    | 'mini-review'
    | 'final-review'
    | 'error-review'
}
```

---

### 3.4 队列构建伪代码（必须逐行实现）

```ts
function buildAlphabetQueue(params) {
  const {
    lessonId,
    mode,
    round,
    lessonLetters,
    previousRoundLetters = [],
    completedLessons,
  } = params

  const queue = []

  // Phase 1: previous-review
  let previousReviewLetters = []

  if (mode === 'learning') {
    if (round > 1) {
      previousReviewLetters = previousRoundLetters
    }
  }

  if (mode === 'free-play') {
    const masteredLetters = lessonLetters.filter(letter =>
      completedLessons.includes(lessonId)
    )

    previousReviewLetters =
      shuffle(masteredLetters).slice(0, FREE_PLAY_REVIEW_LIMIT)
  }

  previousReviewLetters.forEach(letter => {
    queue.push({ letter, source: 'previous-review' })
  })

  // Phase 2: new-learning + mini-review
  let newLearningLetters = lessonLetters

  for (let i = 0; i < newLearningLetters.length; i++) {
    const letter = newLearningLetters[i]
    queue.push({ letter, source: 'new-learning' })

    if ((i + 1) % MINI_REVIEW_CHUNK === 0) {
      const chunk =
        newLearningLetters.slice(i + 1 - MINI_REVIEW_CHUNK, i + 1)
      chunk.forEach(l => {
        queue.push({ letter: l, source: 'mini-review' })
      })
    }
  }

  // Phase 3: final-review
  newLearningLetters.forEach(letter => {
    queue.push({ letter, source: 'final-review' })
  })

  return queue
}
```

---

### 3.5 error-review 规则（冻结）

- error-review **不允许在 buildAlphabetQueue 中生成**
- 只能在 session 运行过程中追加
- 追加位置：queue 尾部
- source 固定为 `'error-review'`

---

## 4. Phase 推导规则（冻结）

- Phase **只允许**由 `currentItem.source` 推导
- 不再使用 LearningPhase enum

| source | UI Phase |
|------|---------|
| previous-review | previous-review |
| new-learning | new-learning |
| mini-review | mini-review |
| final-review | final-review |
| error-review | error-review |

---

## 5. Round / Progress 写入规则（冻结）

### 5.1 learning 模式

- 仅在 `round === 3 && passed === true` 时：
  - 标记课程完成
  - 更新 completedLessons
  - 可能解锁下一个课程

### 5.2 free-play 模式

- ❌ 禁止写入 round
- ❌ 禁止写入 completedLessons
- ❌ 禁止影响解锁逻辑
- free-play = 只读学习模式

---

## 6. Alphabet 模块 TODO 清单（严格顺序）

### TODO-01
统一 AlphabetLearningMode 判定

### TODO-02
修正 alphabetStore.initializeSession 对 buildAlphabetQueue 的调用

### TODO-03
移除旧的 round-based new/previous 拆分逻辑

### TODO-04
统一 Phase 推导来源为 queue.source

### TODO-05
禁止 free-play 写入进度

### TODO-06
仅在 learning + round3 完成课程

### TODO-07
课程解锁逻辑只基于 completedLessons

---

## 7. AI 强制执行指令（可直接复制）

```text
你正在实现 ThaiLearnApp 的 Alphabet 模块。

必须遵守：
- ALPHABET_MODULE_IMPLEMENTATION_SKELETON.md
- ALPHABET_MODULE_FINAL_FACTS.md

不允许：
- 引入 SM-2
- 新增 Phase
- 改动 queue 顺序
- 改动 free-play 行为

严格按 TODO-01 → TODO-07 顺序执行。
```

⸻

📜 Alphabet 模块执行模型冻结条款（正式版）

状态：冻结（Frozen）
适用范围：Alphabet 模块（含课程解锁、Round、free-play、与其他模块的交互）

本条款是 Alphabet 模块的最终执行模型定义。
任何实现、重构、补功能、AI 生成代码 必须严格遵守本条款。

若代码、历史文档、AI 建议与本条款冲突：
以本条款为准，修改代码，而不是修改条款。

⸻

1️⃣ 模块总原则（不可变）
	1.	Alphabet 模块是 整个系统的基础模块
	2.	Alphabet 的执行模型是：
	•	确定性队列播放器
	•	而非状态机 / FSM
	3.	Alphabet 不使用 SM-2
	4.	Alphabet 的学习节奏 完全由前端控制
	5.	Alphabet 只有两种学习模式：
	•	learning
	•	free-play
	6.	free-play ≠ 重复进入课程
	7.	free-play 是 Alphabet 教学整体完成后的全局状态

⸻

2️⃣ AlphabetLearningMode 的唯一判定规则（冻结）

type AlphabetLearningMode = 'learning' | 'free-play'

mode =
  user_alphabet_progress.letterCompleted === true
    ? 'free-play'
    : 'learning'

冻结约束
	•	❌ 不允许使用 round / phase / progress 百分比 推断 mode
	•	❌ 不允许通过“是否学过”“是否完成 round3”推断 mode
	•	❌ 不允许前端自行计算 letterCompleted
	•	✅ letterCompleted 是 唯一合法来源

⸻

3️⃣ free-play 的精确定义（冻结）

free-play 只在以下条件成立时启用
	•	Alphabet 教学 整体完成
	•	即：

user_alphabet_progress.letterCompleted === true



free-play 的语义是：
	•	Alphabet 教学阶段已结束
	•	进入 只读的自由复习阶段
	•	不再承担教学推进职责

⸻

4️⃣ 未完成 Alphabet 时的行为（重点冻结）

场景
	•	用户只完成了部分课程（例如 1～5 课）
	•	解锁了第 6 课
	•	其他模块可能已解锁（通过进度或测试）
	•	letterCompleted === false

冻结行为（必须遵守）

1️⃣ 用户进入 任何已解锁的字母课程
	•	mode 必须是 learning
	•	❌ 不进入 free-play
	•	❌ 不触发随机复习 / 限量复习逻辑

2️⃣ 用户进入 已 round3 完成的旧课程
	•	仍按 learning 模式运行
	•	队列构建规则：
	•	previous-review：仅来自该课程自身
	•	new-learning / mini-review / final-review：按 learning 队列规则生成
	•	❌ 不允许跨课程取字母
	•	❌ 不允许引用“最近访问课程”

3️⃣ 不得产生任何污染
	•	不影响下一课的 previous-review
	•	不影响课程解锁顺序
	•	不影响其他模块状态

📌 结论：
在 Alphabet 未整体完成前，用户的“乱点课程”行为只会影响当前课程，不会影响系统教学链

⸻

5️⃣ buildAlphabetQueue 的冻结职责边界

buildAlphabetQueue 是：
	•	唯一的队列构建器
	•	完全前端权威
	•	不依赖后端顺序
	•	不依赖 SM-2
	•	不感知“最近学习行为”

它只允许使用以下输入：

{
  lessonId,
  mode,                  // learning | free-play
  round,
  lessonLetters,
  previousRoundLetters,  // 仅 learning + round > 1
  completedLessons
}

严格禁止
	•	❌ 根据 round 推断 mode
	•	❌ 根据 previousRoundLetters.length 推断模式
	•	❌ 引入跨课程字母
	•	❌ 引入随机全量复习（除 free-play 限制逻辑）

⸻

6️⃣ free-play 模式下的冻结行为

free-play 是：
	•	只读模式
	•	不写入任何进度
	•	不影响解锁

free-play 下禁止行为
	•	❌ 写入 round
	•	❌ 写入 completedLessons
	•	❌ 解锁课程
	•	❌ 影响其他模块

free-play 队列规则（简述）
	•	previous-review：
	•	仅来自已掌握字母
	•	有数量上限
	•	不保证覆盖全部字母
	•	不追求教学完整性

⸻

7️⃣ Round 的最终地位（冻结）
	•	Round 是：
	•	统计字段
	•	教学流程的阶段标记
	•	Round 不是执行驱动
	•	Round 不参与 mode 判定
	•	Round 不参与 queue 选择逻辑（除 previous-review 条件）

⸻

8️⃣ Phase 的最终地位（冻结）
	•	Phase = currentItem.source
	•	Phase 仅用于 UI 展示
	•	Phase 不得参与执行决策

execution = queue[currentIndex]


⸻

9️⃣ 与 moduleAccessStore 的关系（冻结）
	•	moduleAccessStore 是 系统级访问控制层
	•	Alphabet 模块：
	•	❌ 不负责判断“是否允许进入其他模块”
	•	❌ 不负责全局解锁
	•	Alphabet 只负责：
	•	在 learning + round3 完成时
	•	正确写入 completedLessons / letterCompleted

⸻

🔚 冻结声明

Alphabet 模块的执行模型是：

“基于 mode 的确定性课程队列播放器”
	•	free-play 是 Alphabet 教学完成后的全局状态
	•	learning 模式下的“重进课程”不是自由复习
	•	用户行为不会破坏教学链
	•	解锁与执行彻底解耦

在本条款下完成 Alphabet 模块后，Vocabulary / Sentence / Article 模块才能安全对接。

好，这里我给你的是可以直接落地、可复制粘贴、可作为唯一权威追加到现有两个文件之一末尾的正式冻结条款文本。
它的定位非常清晰：不是再新增一个规范文件，而是“补上 Alphabet 模块最后一块宪法级缺失拼图”。

下面内容我已经帮你做了三件事：
	1.	彻底定性 free-play 的唯一含义（避免你担心的所有“手贱点课”“污染下一课”的问题）
	2.	明确 Alphabet ↔ moduleAccessStore 的职责边界与写入时机
	3.	正式引入 FORCE_UNLOCK（测试态）为“合法旁路”，而不是隐藏黑洞

⸻

📜 Alphabet 模块执行模型冻结条款（正式版｜补充条款）

状态：Frozen
适用范围：Alphabet 模块 + moduleAccessStore + 模块解锁体系
追加位置建议：
	•	ALPHABET_MODULE_IMPLEMENTATION_SKELETON.md 文件末尾
或
	•	ALPHABET_MODULE_FINAL_FACTS.md 文件末尾

优先级说明：
本条款与上述两个文件同级，若发生冲突，以最新追加条款为准。

⸻

0️⃣ 本补充条款的目的（冻结）

在完成 TODO-01 ~ TODO-03 后，系统已具备稳定的 Alphabet 内部执行模型，
但 Alphabet 的“完成态”尚未与全局模块解锁系统形成闭环。

本条款用于冻结以下三个问题的最终答案：
	1.	free-play 到底是什么、什么时候启用
	2.	Alphabet 未整体完成时，用户“乱点课程”的唯一合法行为
	3.	Alphabet 完成态 → moduleAccessStore → 其他模块解锁 的唯一写入链路

⸻

1️⃣ free-play 的唯一合法定义（冻结）

1.1 free-play 的判定条件（唯一）

AlphabetLearningMode = 
  user_alphabet_progress.letterCompleted === true
    ? 'free-play'
    : 'learning'

📌 冻结要点
	•	letterCompleted 是 唯一合法来源
	•	❌ 不允许使用：
	•	round
	•	phase
	•	letterProgress 百分比
	•	已完成课程数量
	•	❌ 不允许前端自行推断 free-play

⸻

1.2 free-play 的语义（非常重要）

free-play ≠ 重复进入已完成课程

free-play 表示：
	•	Alphabet 教学阶段整体结束
	•	用户进入 只读的自由复习状态
	•	Alphabet 不再承担：
	•	教学推进
	•	课程解锁
	•	进度计算

📌 free-play 是“全局状态”，不是“课程状态”

⸻

2️⃣ Alphabet 未整体完成时的冻结行为（重点）

场景定义
	•	用户只完成了部分课程（例如第 1～5 课）
	•	第 6 课已解锁
	•	第 7 课未解锁
	•	其他模块：
	•	可能未解锁
	•	也可能因测试绕过已解锁
	•	letterCompleted === false

⸻

冻结行为规则（必须全部遵守）

2.1 用户进入任何已解锁的字母课程
	•	mode 必须为 learning
	•	❌ 不得进入 free-play
	•	❌ 不得触发：
	•	随机复习
	•	限量复习
	•	已掌握字母池抽样

⸻

2.2 用户进入「已 round3 完成」的旧课程
	•	仍然按 learning 模式运行
	•	队列规则：

previous-review:
  仅来自该课程自身的 previousRoundLetters
new-learning / mini-review / final-review:
  按 learning 队列规则生成

📌 明确禁止：
	•	❌ 跨课程取字母
	•	❌ 使用“最近访问课程”的字母
	•	❌ 引用下一课 / 上一课的内容

⸻

2.3 不得产生任何系统污染
用户在 Alphabet 未整体完成前的任何行为：
	•	❌ 不影响下一课的 previous-review
	•	❌ 不影响课程解锁顺序
	•	❌ 不影响 moduleAccessStore 的状态
	•	❌ 不影响其他模块的解锁与否

结论冻结：
在 Alphabet 未整体完成前，用户的“手贱点课”行为
只作用于当前课程的本次 session，不得产生跨课程或跨模块影响

⸻

3️⃣ Alphabet → moduleAccessStore 的唯一写入链路（冻结）

3.1 唯一合法写入时机

Alphabet 模块 只允许在以下条件下写入 moduleAccessStore：

mode === 'learning'
AND
round === 3
AND
passed === true


⸻

3.2 唯一合法写入动作

在满足上述条件时，必须执行：

markAlphabetLessonCompleted(lessonId)

其结果必须包含：
	•	更新 completedAlphabetLessons
	•	计算并更新 letterProgress
	•	在满足核心课程数量时设置：
	•	letterCompleted = true

📌 Alphabet 模块禁止自行解锁其他模块
Alphabet 只负责更新进度字段，是否解锁由 moduleAccessStore 决定

⸻

4️⃣ FORCE_UNLOCK（测试旁路）冻结说明

4.1 旁路目的

FORCE_UNLOCK 仅用于：
	•	开发期
	•	测试期
	•	Demo / QA 环境

用于 绕过 Alphabet 教学链，直接解锁其他模块

⸻

4.2 冻结行为

当云函数环境变量满足：

FORCE_UNLOCK=true

允许：
	•	后端直接返回 allowed: true
	•	或直接设置：
	•	letterCompleted = true
	•	letterProgress = 1

📌 冻结约束
	•	FORCE_UNLOCK：
	•	❌ 不得作为默认行为
	•	❌ 不得在前端出现开关
	•	❌ 不得影响 Alphabet 内部执行模型
	•	FORCE_UNLOCK = false 时：
	•	系统必须严格遵循本冻结条款

⸻

5️⃣ moduleAccessStore 的最终定位（冻结）
	•	moduleAccessStore 是：
	•	系统级访问控制层
	•	Alphabet 模块：
	•	❌ 不负责判断“是否允许进入其他模块”
	•	❌ 不负责 UI 层提示
	•	Alphabet 的唯一职责：
	•	在合法时机写入进度字段

⸻

6️⃣ 本条款的法律效力（工程意义）
	•	本条款是 Alphabet 模块的 最终执行解释
	•	后续：
	•	Vocabulary
	•	Sentence
	•	Article
	•	AI 模块
必须以本条款的 Alphabet 行为为前提进行对接

📌 任何 AI / 开发者不得绕过本条款直接修改解锁逻辑

⸻

🔚 冻结结论
	•	free-play 的含义已唯一确定
	•	Alphabet 未完成时的所有边界行为已封死
	•	Alphabet ↔ moduleAccessStore 的写入职责已冻结
	•	FORCE_UNLOCK 被纳入“合法测试旁路”，不再是隐患


---

## 🔚 结束语

Alphabet 模块是整个系统的地基。
**在本模块完全跑通前，不允许进入 Vocabulary / Sentence / Article 模块开发。**
