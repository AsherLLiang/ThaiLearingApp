# 数据库结构说明文档（V2.1.0）

本文档基于 `assets/data/Final_DB_Data` 中由 `local_cleaner_v3.py` 脚本清洗后的实际数据结构整理。  
如无特别说明，所有时间字段均为 ISO 字符串或 CloudBase 内部的 `Date` 对象。

**核心变更（相对 V2.0.1）：**

- 主键策略：`_id` 与 `vocabularyId` 采用 `{source}_{OriginalID}` 组合（如 `BaseThai_1_7`），彻底解决不同教材间 ID 冲突问题。  
- 音频逻辑：`audioPath` 仅存储文件名（如 `7.mp3`），前端需结合 `source` 字段拼接云存储路径。  
- 富媒体结构：例句、对话、同源词等字段内部已注入对应的 `audioPath`，前端可直接使用。

---

## 1. 核心集合 (Collections)

> 以下字段为当前代码中**实际使用和写入**的字段，若未来需要新增字段，请同步更新本表。

### 1.1 Users (用户表)
**集合名**: `users`
**用途**: 存储用户基本信息。

| 字段名 | 类型 | 描述 | 备注 |
| :--- | :--- | :--- | :--- |
| `_id` | String | 记录ID | 自动生成 |
| `userId` | String | 用户唯一标识 | 核心索引字段 |
| `nickname` | String | 昵称 | |
| `avatarUrl` | String | 头像地址 | |
| `createdAt` | Date | 创建时间 | |

### 1.2 Vocabulary (词汇表)
**集合名**: `vocabulary`  
**用途**: 存储《基础泰语》系列教材单词，包含详细的富文本及音频信息。

| 字段名 | 类型 | 描述 | 备注 |
| :--- | :--- | :--- | :--- |
| `_id` | String | 全局唯一主键 | 格式：`{source}_{OriginalID}`，例：`"BaseThai_1_7"` |
| `vocabularyId` | String | 业务 ID | 与 `_id` 保持一致，用于前端逻辑 |
| `source` | String | 书名/来源 | 对应云存储文件夹名，如 `"BaseThai_1"`、`"BaseThai_2"` |
| `level` | String | 难度等级 | 例如 `"A1"`, `"A2"`, `"B1"` |
| `lessonNumber` | String | 课程编号 | 例如 `"1"`, `"15.3"`（字符串） |
| `thaiWord` | String | 泰语单词 | 例如 `"กะ"` |
| `meaning` | String | 中文含义 | 例如 `"估计"` |
| `startingLetter` | String | 泰语首字母 | 例如 `"ก"` |
| `pronunciation` | String | 发音/音标 | 例如 `"gà"` |
| `partOfSpeech` | String | 词性 | 例如 `"名词"` |
| `audioPath` | String | 单词主音频文件名 | 例如 `"7.mp3"`，前端拼接：`{source}/{audioPath}` |
| `exampleSentences` | Object | 例句集合 | Map 结构，详见下文 |
| `dialogue` | Object | 对话场景 | 包含场景描述及对话内容，详见下文 |
| `cognates` | Array\<Object\> | 同源词/相关词 | 结构见下文 |
| `mistakes` | Object | 常见错误/易错点 | 包含发音易错点、相似词区别、使用场合等 |
| `usage` | Object | 用法说明 | 包含语法示例、与中文差异等 |
| `analysis` | Object | 原始分析数据 | 保留原始清洗脚本输出，用于 debug/备份 |
| `createdAt` | Date\|String | 创建时间 | |

#### 1.2.1 `exampleSentences` 字段结构

- 类型：`Record<string, { 泰语: string; 中文: string; 发音: string; audioPath: string }>`  
- Key：场景名（例如 `"实用场景1"`、`"实用场景2"`）。  
- Value 示例：

```json
{
  "实用场景1": {
    "泰语": "ฉันกินน้ำมะละกอทุกวัน",
    "中文": "我每天喝木瓜汁",
    "发音": "chǎn gin náam má-là-kɔ̌ɔ tûu-kúu-wan",
    "audioPath": "207_sen_实用场景1.mp3"
  }
}
```

> 前端播放例句音频时应直接使用 `exampleSentences[key].audioPath`，并按 `{source}/{audioPath}` 拼接完整路径。

#### 1.2.2 `dialogue` 字段结构

- 类型：

```ts
{
  "场景描述": string;
  "对话内容": {
    [role: string]: {
      泰语: string;
      中文?: string;
      audioPath: string;
    };
  };
}
```

- 示例：

```json
{
  "场景描述": "在水果摊前顾客与摊主讨论购买木瓜",
  "对话内容": {
    "A": {
      "泰语": "พี่ครับ มะละกออันนี้สุกยังครับ?",
      "中文": "大哥，这个木瓜熟了吗？",
      "audioPath": "207_dia_A.mp3"
    },
    "B": {
      "泰语": "ยังครับ แต่ถ้าอยากกินเปรี้ยวๆ ใช้ได้เลย",
      "中文": "还没熟透，但如果你想吃酸一点的，这个正合适",
      "audioPath": "207_dia_B.mp3"
    }
  }
}
```

#### 1.2.3 `cognates` 字段结构

- 类型：`Array<{ text: string; audioPath: string }>`  
- 示例：

```json
[
  {
    "text": "น้ำมะละกอ (náam má-là-kɔ̌ɔ) - 木瓜汁",
    "audioPath": "207_cog_1.mp3"
  },
  {
    "text": "ส้มตำมะละกอ (sôm dtàm má-là-kɔ̌ɔ) - 木瓜沙拉",
    "audioPath": "207_cog_2.mp3"
  }
]
```

#### 1.2.4 `analysis` 字段结构（保留用）

- 该字段完整保留 local_cleaner 脚本生成的原始分析：

```ts
interface Analysis {
  pronunciation: string;
  part_of_speech: string;
  letter_pron_analysis?: string;
  phonetic_association?: {
    拆分?: string;
    记忆句?: string;
  };
  cognates?: string[];
  example_sentences?: Record<string, { 泰语: string; 中文: string; 发音: string }>;
  example_dialogue?: {
    场景描述: string;
    对话内容: Record<string, { 泰语: string; 中文: string }>;
  };
  common_mistakes?: Record<string, string>;
  usage_details?: {
    语法示例?: { 结构: string; 解释: string; 使用技巧?: string };
    与中文差异?: string;
  };
  mistakes?: Record<string, string>;
  usage?: {
    语法示例?: { 结构: string; 解释: string; 使用技巧?: string };
    与中文差异?: string;
  };
}
```

> 前端业务应优先使用顶层的 `exampleSentences` / `dialogue` / `mistakes` / `usage` 字段；`analysis` 主要用于调试与以后生成 AI 内容。

### 1.3 User Vocabulary Progress (用户单词进度表)

**集合名**: `user_vocabulary_progress`  
**用途**: 记录用户对每个单词的学习状态（旧版词汇 SRS 引擎）。

| 字段名 | 类型 | 描述 | 备注 |
| :--- | :--- | :--- | :--- |
| `_id` | String | 记录ID | 自动生成 |
| `userId` | String | 用户ID | 索引 |
| `vocabularyId` | String | 单词ID | 关联 `vocabulary._id`，例如 `BaseThai_1_7` |
| `mastery` | String\|null | 掌握程度 | `'UNFAMILIAR'`, `'FUZZY'`, `'REMEMBERED'` 或 `null` |
| `nextReviewDate` | Date\|null | 下次复习时间 | `getTodayWords` 用于筛选今日复习 |
| `intervalDays` | Number | 间隔天数 | |
| `easinessFactor` | Number | 易记系数 | 默认 2.5 |
| `reviewCount` | Number | 复习次数 | |
| `createdAt` | Date | 创建时间 | |
| `updatedAt` | Date | 更新时间 | |

### 1.4 Letters (字母表)
**集合名**: `letters`  
**用途**: 存储泰语字母、元音、声调符号及其音频与课程信息。

> 详细字段定义请参考 `src/entities/types/letter.types.ts` 与 `assets/courses/letters_final.enriched.json`。  
> 此处保持简要说明（主要用于理解与其他集合的关系）。

| 字段名 | 类型 | 描述 | 备注 |
| :--- | :--- | :--- | :--- |
| `_id` | String | 字母ID | 如 `TH_C_01` |
| `type` | String | 类型 | `'consonant' \| 'vowel' \| 'tone'` |
| `thaiChar` | String | 泰文字母/元音/声调字符 | 如 `"ก"` |
| `nameThai` | String | 泰文名称 | 如 `"ไก่"` |
| `nameEnglish` | String | 英文名称 | 如 `"ko kai"` |
| `initialSound` | String | 首辅音读音 | 如 `"k"`（可为空，对元音/声调） |
| `finalSound` | String | 收尾辅音读音 | 如 `"k"` |
| `class` | String\|null | 辅音类 | `'mid'`, `'high'`, `'low'`，元音/声调为 `null` |
| `audioPath` | String | 旧版音频路径 | 新版优先使用 `*SoundUrl` |
| `exampleWord` | String | 示例单词 | 如 `"ไก่"` |
| `exampleMeaning` | String | 示例含义 | 如 `"鸡"` |
| `strokeCount` | Number | 笔画数 | 预留 |
| `learningLevel` | String | 学习级别 | `'BEGINNER' \| 'INTERMEDIATE' \| 'ADVANCED'` |
| `lessonNumber` | Number | 旧课程编号 | 与新版 `lessonId` 并存 |
| `category` | String | 分类 | 如 `'mid_consonant'`, `'vowel'`, `'tone'` |
| `subCategory` | String | 子类别 | 如 `'lesson1_mid'` |
| `keyboardKey` | String\|undefined | 键盘对应按键 | 用于输入练习 |
| `fullSound` | String\|undefined | 完整发音 key | 如 `"consonant-ko-kai"` |
| `fullSoundUrl` | String\|undefined | 完整发音音频 key | 映射到 COS `/alphabet/{key}.mp3` |
| `syllableSoundName` | String\|undefined | 音节核心发音名称 | 如 `"k"` |
| `syllableSound` | String\|undefined | 音节发音 key | 如 `"sound-k"` |
| `syllableSoundUrl` | String\|undefined | 音节音频 key | |
| `endSyllableSoundName` | String\|undefined | 尾音节名称 | |
| `endSyllableSound` | String\|undefined | 尾音节发音 key | |
| `endSyllableSoundUrl` | String\|undefined | 尾音节音频 key | |
| `letterNamePronunciation` | String\|undefined | 字母名称发音文本 | 如 `"kay`"` |
| `letterPronunciationUrl` | String\|undefined | 字母名称发音音频 key | 如 `"word-kay"` |
| `letterImageUrl` | String\|undefined | 字母插图 URL | 预留 |
| `description` | String\|undefined | 说明 | |
| `curriculumLessonIds` | String[]\|undefined | 所属课程 ID 列表 | 如 `["lesson1"]` |
| `curriculumLessonOrders` | Number[]\|undefined | 各课程中的排序 | |
| `primaryCurriculumLessonId` | String\|undefined | 主课程 ID | 如 `"lesson1"` |
| `primaryCurriculumLessonOrder` | Number\|undefined | 主课程中的排序 | |
| `createdAt` | String | 创建时间 | |


### 1.5 Sentences (句子表)
**集合名**: `sentences` (推测)
**用途**: 存储例句数据。

| 字段名 | 类型 | 描述 | 备注 |
| :--- | :--- | :--- | :--- |
| `_id` | String | 句子ID | |
| `thai` | String | 泰语句子 | |
| `chinese` | String | 中文翻译 | |

### 1.6 Letter Test Bank (字母题库)
**集合名**: `letter_test_bank`
**用途**: 存储字母测试题目。

| 字段名 | 类型 | 描述 | 备注 |
| :--- | :--- | :--- | :--- |
| `_id` | String | 题目ID | |
| `question` | String | 题目内容 | |
| `options` | Array | 选项列表 | |
| `answer` | String | 正确答案 | |

### 1.7 memory_status (统一记忆状态表)
**集合名**: `memory_status`  
**用途**: 统一 SRS 引擎核心表，记录用户对任意实体（字母/单词/句子等）的记忆状态。

| 字段名 | 类型 | 描述 | 备注 |
| :--- | :--- | :--- | :--- |
| `_id` | String | 记录ID | 自动生成 |
| `userId` | String | 用户ID | 索引 |
| `entityType` | String | 实体类型 | `'letter'`、`'word'` 等 |
| `entityId` | String | 实体ID | 关联 `letters._id` / `vocabulary._id` 等，例如 `BaseThai_1_7` |
| `masteryLevel` | Number | 掌握度 | 0.0–1.0 |
| `reviewStage` | Number | 复习阶段 | 等价于 SM‑2 repetitions |
| `easinessFactor` | Number | 易记系数 | 初始 2.5 |
| `intervalDays` | Number | 间隔天数 | 下一次复习间隔（天） |
| `lastReviewAt` | String\|null | 上次复习时间 | ISO 字符串 |
| `nextReviewAt` | String\|null | 下次复习时间 | 用于筛选今日复习队列 |
| `correctCount` | Number | 累计答对次数 | |
| `wrongCount` | Number | 累计答错次数 | |
| `streakCorrect` | Number | 连续答对次数 | |
| `isLocked` | Boolean | 是否锁定 | 锁定时不安排复习 |
| `createdAt` | String | 创建时间 | |
| `updatedAt` | String | 最近更新时间 | |

### 1.8 user_progress (用户总进度表)
**集合名**: `user_progress`  
**用途**: 记录用户在各模块（字母/单词/句子/文章）的整体完成度与解锁状态。

| 字段名 | 类型 | 描述 | 备注 |
| :--- | :--- | :--- | :--- |
| `_id` | String | 记录ID | |
| `userId` | String | 用户ID | 唯一索引 |
| `letterCompleted` | Boolean | 是否完成字母模块 | 解锁后续模块的硬条件 |
| `letterProgress` | Number | 字母模块整体进度 | 0.0–1.0 |
| `wordUnlocked` | Boolean | 单词模块是否解锁 | |
| `wordProgress` | Number | 单词模块整体进度 | 0.0–1.0 |
| `sentenceUnlocked` | Boolean | 句子模块是否解锁 | |
| `sentenceProgress` | Number | 句子模块整体进度 | |
| `articleUnlocked` | Boolean | 文章模块是否解锁 | |
| `articleProgress` | Number\|undefined | 文章模块整体进度 | 旧记录可能无此字段 |
| `currentStage` | String | 当前学习阶段 | `'letter' \| 'word' \| 'sentence' \| 'article'` |
| `totalStudyDays` | Number | 总学习天数 | |
| `streakDays` | Number | 连续学习天数 | |
| `lastStudyDate` | String\|null | 最近学习日期 | |
| `createdAt` | Date | 创建时间 | |
| `updatedAt` | Date | 最近更新时间 | |

### 1.9 user_alphabet_progress (用户字母模块进度表)
**集合名**: `user_alphabet_progress`  
**用途**: 记录用户在 **字母课程模块** 的整体进度与三轮评估结果。

| 字段名 | 类型 | 描述 | 备注 |
| :--- | :--- | :--- | :--- |
| `_id` | String | 记录ID | |
| `userId` | String | 用户ID | 唯一索引 |
| `letterProgress` | Number | 字母课程整体进度 | 0.0–1.0，课程/轮次完成后更新 |
| `letterCompleted` | Boolean | 是否完成全部字母课程 | 完成后可解锁全部模块 |
| `completedLessons` | String[] | 已完成课程ID列表 | 如 `["lesson1","lesson2"]` |
| `masteredLetterCount` | Number | 已掌握字母数量 | |
| `totalLetterCount` | Number | 字母总数 | 当前约 80 |
| `currentRound` | Number | 最近一轮评估轮次 | 1、2 或 3 |
| `roundHistory` | Array\<Object\> | 各轮评估记录 | 见下表 |
| `createdAt` | String | 创建时间 | |
| `updatedAt` | String | 最近更新时间 | |

`roundHistory` 子结构：

| 字段名 | 类型 | 描述 |
| :--- | :--- | :--- |
| `lessonId` | String | 对应课程 ID，如 `lesson1` |
| `roundNumber` | Number | 轮次（1/2/3） |
| `totalQuestions` | Number | 本轮总题数 |
| `correctCount` | Number | 答对题数 |
| `accuracy` | Number | 正确率（0.0–1.0） |
| `passed` | Boolean | 是否通过（≥ 0.9） |
| `updatedAt` | String | 提交时间 |

---

## 2. 关联关系

- **用户 -> 单词进度**  
  `users.userId` → `user_vocabulary_progress.userId`
- **单词进度 -> 单词**  
  `user_vocabulary_progress.vocabularyId` → `vocabulary._id`
- **用户 -> 统一记忆状态**  
  `users.userId` → `memory_status.userId`
- **记忆状态 -> 实体**  
  `memory_status.entityId` → `letters._id` / `vocabulary._id` / 其他实体集合 `_id`
- **用户 -> 总进度**  
  `users.userId` → `user_progress.userId`
- **用户 -> 字母模块进度**  
  `users.userId` → `user_alphabet_progress.userId`

---

## 3. 索引配置 (Index Configuration)

> 以下索引需要在 CloudBase 控制台中为 `vocabulary` 集合手动创建，名称仅作参考。

| 索引名称 | 字段定义 | 唯一性 | 用途 |
| :--- | :--- | :--- | :--- |
| `unique_id` | `{ "vocabularyId": 1 }` | ✅ | 确保单词 ID 唯一，防止重复导入 |
| `book_lesson` | `{ "source": 1, "lessonNumber": 1, "_id": 1 }` | ❌ | 核心查询：按教材和课次加载单词列表 |
| `search_thai` | `{ "thaiWord": 1 }` | ❌ | 按泰语单词搜索 |
| `search_meaning` | `{ "meaning": 1 }` | ❌ | 按中文含义搜索 |
| `level_filter` | `{ "level": 1 }` | ❌ | 按难度等级跨书筛选 |

---

## 4. 前端资源路径拼接指南

> 音频文件按教材存放在云存储 `/audio/{source}/` 目录下，数据库仅记录文件名部分。

拼接公式示例：

```ts
const CLOUD_ROOT = 'cloud://<env-id>.tcloudbaseapp.com'; // 云环境根路径
const fullPath = `${CLOUD_ROOT}/audio/${word.source}/${word.audioPath}`;
```

- `word.source`：如 `"BaseThai_1"`；  
- `word.audioPath`：如 `"207.mp3"`、`"207_sen_实用场景1.mp3"` 等；  
- 例句、对话、同源词中的 `audioPath` 同样遵循 `{source}/{audioPath}` 规则。

> 注意：请确保云存储中的文件夹名称与 `source` 字段完全一致（大小写敏感），否则会导致音频无法正确加载。

---

## 3. 补充说明

- 实际索引配置可在 CloudBase 控制台中查看和管理；  
- 若新增字段或集合，请同步更新本文件，以避免前后端认知不一致。
