# AI 模块轻量规格说明（AI Module Spec, Lite）

> 目录：`docs/project-freeze/ai-module-spec.md`  
> 范围：**AI 辅助能力设计，不作为首发版本的必需功能**。  
> 目标：在不阻塞当前 2 个月上线目标的前提下，冻结 AI 模块的接口与边界，方便后续迭代引入。

---

## 1. 模块概述与子模块划分

AI 模块包含三个子能力，全部通过一个 CloudBase 云函数统一暴露：

- 云函数：`ai-engine`（名称可调整，但必须单一入口 + 多 Action）。  
- Action 列表：
  1. `analyzePronunciation` – AI 发音反馈引擎（最重要）；  
  2. `generateWeaknessVocabulary` – 基于弱项的词汇强化建议；  
  3. `generateMicroReading` – 微阅读材料生成（1–2 句短文）。

### 1.1 与其他模块的关系

- Alphabet / Vocabulary 模块仍是**学习主角**；AI 模块只提供**额外练习 & 反馈**。  
- 所有调用都必须通过前端 `callCloudFunction('ai-engine', { action, data })` 完成；  
- AI 模块不直接修改 `memory_status` / `learningStatus`，只返回建议，由前端选择是否记入错题或提示。

---

## 2. 云函数接口设计：`ai-engine`

### 2.1 通用入口

```ts
// HTTP / CloudBase 入口规范
interface AiEngineRequest<T = unknown> {
  action: 'analyzePronunciation' | 'generateWeaknessVocabulary' | 'generateMicroReading';
  data: T;
}

interface AiEngineResponse<T = unknown> {
  success: boolean;
  data: T | null;
  message: string;
  errorCode: string | null;
}
```

前端调用示例：

```ts
await callCloudFunction<AiEngineResponse<PronunciationFeedback>>('ai-engine', {
  action: 'analyzePronunciation',
  data: { ... },
});
```

### 2.2 Action: analyzePronunciation（AI 发音反馈）

**用途：**  
在字母模块或词汇模块中，用户朗读某个字母 / 单词 / 句子后，将录音上传，获得 AI 生成的反馈与建议练习点。

请求体（初版）：

```ts
interface AnalyzePronunciationRequest {
  userId: string;
  targetType: 'letter' | 'word' | 'sentence';
  targetId: string;              // letterId 或 vocabularyId 或自定义句子 ID
  targetText: string;           // 目标文本（泰文）
  audioUrl: string;             // 已上传到 COS 的音频 URL / key
  alphabetContext?: {
    // 可选：当前字母的辅音类别、声调等信息，便于 LLM 使用术语
    consonantClass?: 'high' | 'mid' | 'low';
    toneMark?: string | null;
  };
}

interface PronunciationFeedback {
  overallScore: number;          // 0–100 综合评分
  level: '需要加强' | '合格' | '优秀';
  issues: Array<{
    type: 'tone' | 'vowel' | 'consonant' | 'rhythm';
    description: string;        // 中文解释问题
    suggestion: string;         // 中文练习建议
  }>;
  syllableBreakdown?: Array<{
    syllable: string;
    tone: string;
    score: number;
  }>;
  recommendedDrills?: string[];  // 建议重复练习的短词或短句
}
```

返回示例（简化）：

```json
{
  "success": true,
  "data": {
    "overallScore": 78,
    "level": "合格",
    "issues": [
      {
        "type": "tone",
        "description": "第一个音节声调偏低，听起来接近二声",
        "suggestion": "练习从中辅音平调向高调过渡，可以先夸张一点读高"
      }
    ],
    "syllableBreakdown": [
      { "syllable": "กะ", "tone": "高", "score": 70 },
      { "syllable": "ปี", "tone": "平", "score": 85 }
    ],
    "recommendedDrills": [
      "กะปี",
      "ปีใหม่"
    ]
  },
  "message": "分析成功",
  "errorCode": null
}
```

### 2.3 Action: generateWeaknessVocabulary（弱项词汇强化）

**用途：**  
基于用户在 `memory_status` / `learningStatus` 中的错误统计，为词汇模块生成**额外练习建议**（例句、记忆提示等），但不直接修改记忆队列。

请求体：

```ts
interface GenerateWeaknessVocabularyRequest {
  userId: string;
  topN?: number;                     // 默认 5
}

interface WeakVocabularySuggestion {
  vocabularyId: string;
  thaiWord: string;
  meaning: string;
  currentMastery: '陌生' | '模糊' | '记得';
  aiExamples: Array<{
    scene: string;
    thai: string;
    chinese: string;
  }>;
  mnemonic?: string;                 // AI 生成联想记忆
}
```

返回：

```ts
type GenerateWeaknessVocabularyResponse = WeakVocabularySuggestion[];
```

前端呈现方式（建议）：

- 在词汇模块完成页或“AI 推荐”页展示“你的薄弱词汇 TOP5”；  
- 用户可点击某个词直接进入 NewWordView / 复习题模式。

### 2.4 Action: generateMicroReading（微阅读材料）

**用途：**  
根据用户的弱项词汇/字母，自动生成 1–2 句短文，用于**朗读 + 发音反馈**的闭环练习。

请求体：

```ts
interface GenerateMicroReadingRequest {
  userId: string;
  focusType: 'letter' | 'word' | 'mixed';
  focusIds?: string[];          // letterId / vocabularyId
  length?: 'short' | 'medium';  // 1 句或 2 句，默认 short
}

interface MicroReading {
  id: string;
  thaiText: string;
  chineseHint: string;
  highlightWords: string[];     // 需要特别关注的词
}
```

返回：

```ts
type GenerateMicroReadingResponse = MicroReading;
```

前端流程建议：

1. AI 面板展示生成的短文；  
2. 用户点击“开始朗读”，录音完成后自动调用 `analyzePronunciation`；  
3. 将反馈结果与原文并排展示，形成 “AI → 用户 → AI → 用户” 循环。

---

## 3. 前端接入约束

### 3.1 统一调用路径

- 所有 AI 调用必须通过统一 util：

```ts
import { callCloudFunction } from '@/src/utils/apiClient';

await callCloudFunction('ai-engine', { action, data }, {
  endpoint: API_ENDPOINTS.AI.ENGINE.cloudbase,
});
```

- 不允许在组件中直接写死 URL 或使用 `fetch`。

### 3.2 状态管理

- AI 模块不单独建立大型 Store，原则上使用：
  - 局部组件状态（如当前反馈结果）；  
  - 或在 `learningStore` 中增加轻量字段：

```ts
interface AiUsageSnapshot {
  lastPronunciationScore?: number;
  lastMicroReadingId?: string;
  totalPronunciationSessions: number;
}
```

### 3.3 与记忆引擎的关系

- AI 模块不直接修改 `memory_status` / `learningStatus`；  
- 若需要把 AI 练习结果转化为记忆质量，必须走现有的 `submitMemoryResult` / `updateMastery` 接口，由前端决定什么时候提交（例如用户在 AI 练习中连续 3 次读对某个词）。

---

## 4. 任务清单与优先级

### 4.1 P0：接口占位与基础结构（可与首发并行，约 3–5 天）

- [ ] 创建 `cloudbase/functions/ai-engine` 云函数骨架，支持 `action` 分发和 `createResponse`。  
- [ ] 在 `API_ENDPOINTS` 中增加 `AI.ENGINE` 配置。  
- [ ] 在 `utils/apiClient.ts` 中增加 `callAiEngine` 轻量封装（可选）。  
- [ ] 在字母/词汇模块 UI 中预留入口按钮（点击后暂时只弹出“开发中”提示）。

### 4.2 P1：发音反馈 MVP（analyzePronunciation，约 2–3 周）

- [ ] 前端完成录音 → 上传 COS → 调用 `analyzePronunciation` 的完整链路。  
- [ ] 云函数内部先使用简单逻辑（例如只回传固定模板），再逐步接入真实 ASR/LLM。  
- [ ] 在 Alphabet / 词汇模块中各选一个场景接入，验证体验。

### 4.3 P2：弱项词汇强化与微阅读（约 2–3 周）

- [ ] 实现 `generateWeaknessVocabulary`，前端在词汇模块完成页展示“薄弱词汇 TopN”。  
- [ ] 实现 `generateMicroReading`，并与 `analyzePronunciation` 组合成一个闭环练习页面。  
- [ ] 将 AI 练习结果同步到 `learningStore` 作为统计信息。

---

本轻量规格文档只冻结 AI 模块的**边界、Action 名称与典型数据结构**，实现细节（具体模型、提示词、评分算法）可在后续迭代中逐步完善。  
首发版本可以完全不接入 AI 功能，而不会影响 Alphabet / Vocabulary 模块的核心流程。***
