# ALPHABET_MODULE_FINAL_FACTS.md

## ⚠️ 前置说明（重要）
本文件是**基于已实际上传的冻结规格文档与真实代码行为**生成的【事实约束文档】。
此前关于“冻结文档不存在”的问题判断是正确的：**在未读取真实冻结文档前的推断存在偏差**。
本版本已严格对齐以下真实来源：

- docs/project-freeze/alphabet-module-spec.md
- docs/project-freeze/courses-and-learningstore-spec.md
- docs/project-freeze/backend-memory-engine-spec.md
- project-snapshot-v2.0.1-architecture.md
- 实际前端代码（alphabetStore / useAlphabetLearningEngine / buildAlphabetQueue）

本文件的目的不是“理想设计”，而是：
👉 **冻结当前 Alphabet 模块“必须遵守的真实执行机制”**  
👉 作为后续所有编辑器 AI 的【单一事实源（SSOT）】

---

## G0｜工程级目标（冻结）
**对 Alphabet（字母）模块进行工程级执行机制审计，并形成不可违背的事实约束。**

该目标优先级高于：
- 重构建议
- 架构美化
- SM-2 理论完整性

---

## 一、Alphabet 模块的真实定位（已冻结）

### 1. 不再是 SM-2 驱动模块（首发版）
- Alphabet 模块 **不再依赖 memory-engine 进行逐字母 SRS 调度**
- getTodayMemories **退化为初始化数据获取工具**
- 队列、阶段、轮次（Round）**全部由前端控制**
- 后端仅承担：
  - round 统计
  - lesson 完成状态
  - 模块解锁依据

📌 这是一个**课程驱动模块（Curriculum-driven）**，不是记忆引擎驱动模块。

---

## 二、模块间真实职责边界（冻结）

| 模块 | 职责 | 是否允许修改 Alphabet 内部流程 |
|----|----|----|
| alphabetStore | 队列 / round / session 管理 | ❌ |
| useAlphabetLearningEngine | 执行引擎（单一入口） | ❌ |
| buildAlphabetQueue | 队列生成工具 | ❌ |
| memory-engine | 统计 + 解锁判断 | ❌ |
| Courses / LearningStore | 入口与仪表盘 | ❌ |

👉 **Alphabet 模块是一个自洽封闭系统**

---

## 三、字母学习完整执行流程（真实约束）

### Stage 0｜课程解锁（外部）
来源：`moduleAccessStore.userProgress`（后端 user_alphabet_progress）

解锁规则（冻结）：
- Alphabet 模块：永远允许访问
- Word / Sentence / Article：
  - letterCompleted === true
  - 或 letterProgress >= 0.8

Alphabet 模块 **不负责解锁其他模块**，只更新进度字段。

---

### Stage 1｜进入 Alphabet 课程列表
路径：`/alphabet`

真实逻辑：
- 获取 alphabet_lessons
- 根据 **已完成课程的字母总数** 判断 lesson 解锁
- ❌ 禁止使用 alphabetStore.completedCount（会话态）
- ✅ 必须使用：
  - user_alphabet_progress.completedLessons
  - 或 letterMasteredCount

---

### Stage 2｜进入具体 Lesson
路径：`/alphabet/[lessonId]`

统一入口：
```ts
useAlphabetLearningEngine(lessonId)
```

该 Hook 是：
> Alphabet 模块 **唯一合法执行引擎**

---

### Stage 3｜Session 初始化（冻结）

真实行为：
1. 从后端读取 currentRound（user_alphabet_progress.currentRound）
2. 调用 getTodayMemories 仅用于：
   - 获取 lesson 下的全部字母
   - 附带 lessonMetadata / phonicsRule
3. **不信任后端排序**
4. 在前端执行队列构建

---

### Stage 4｜队列构建事实（关键冻结点）

#### 当前真实规则（必须遵守）：

| Round | 队列组成 |
|----|----|
| Round 1 | new → mini-review → final-review |
| Round 2 / 3 | previous-round-review → mini-review → final-review |

📌 **重要修复结论**：
> Round 2 / 3 也必须包含 mini-review 与 final-review  
> 仅 previous-round-review 是 ❌ Bug 行为

buildAlphabetQueue 的职责：
- 决定 source（previous / new / mini / final）
- 队列顺序由前端完全掌控

---

### Stage 5｜Phase 派生机制（冻结）

📌 **Phase 不再是独立状态机**
Phase = derive(currentItem.source)

合法映射：

| source | phase |
|----|----|
| previous-round-review | yesterday-review |
| new | today-learning |
| mini-review | today-mini-review |
| final-review | today-final-review |
| error-review | today-remedy |
| finished | finished |

❌ 禁止恢复旧 spec 中的显式 Phase FSM

---

### Stage 6｜答题与状态更新（冻结）

- 答题结果仅记录于本地 session
- wrongAnswers 只服务于本轮
- ❌ 不调用 submitMemoryResult（首发版）
- ❌ 不依赖 SM-2

---

### Stage 7｜Round 结束（唯一后端写入点）

调用：
```ts
submitRoundEvaluation
```

后端职责：
- 更新 user_alphabet_progress.currentRound
- 记录 roundHistory

前端职责：
- 推进 currentRound
- 清除 session
- 决定是否课程完成

---

### Stage 8｜课程完成判定（冻结）

条件：
- lesson 的 Round1/2/3 均通过

完成后必须：
- 更新 completedLessons
- 更新 letterCompleted / letterProgress
- Courses 页才能正确解锁后续课程

---

## 四、明确禁止的行为（AI 强制约束）

❌ 新建 parallel queue builder  
❌ 引入新的 Phase 枚举系统  
❌ 在 Alphabet 模块内调用 submitMemoryResult  
❌ 使用 alphabetStore.completedCount 判断课程解锁  
❌ 假设 getTodayMemories 决定队列顺序  

---

## 五、AI 使用说明（你可以直接复制给编辑器 AI）

> 本项目 Alphabet 模块存在已冻结的工程级执行机制。  
> 你在修改任何 Alphabet 相关代码前，必须：  
> 1️⃣ 以 ALPHABET_MODULE_FINAL_FACTS.md 作为单一事实源  
> 2️⃣ 不得引入任何未在文档中出现的新字段 / 新阶段 / 新流程  
> 3️⃣ 若发现冲突，优先修正文档后再改代码  

---

**本文件即为 Alphabet 模块的“宪法级约束”。**
