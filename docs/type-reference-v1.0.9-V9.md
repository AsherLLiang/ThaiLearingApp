# 类型参考 Type Reference v1.0.9 / V9

> 本文为 **类型/枚举/数据结构专用参考手册**，配合  
> `docs/Document/project-snapshot-v1.0.9-V9.md` 一起使用。  
> 目标：让不了解项目源码的 AI / 开发者可以只看类型就推断出大部分业务语义。

---

## 1. 用户与身份相关类型

### 1.1 User

- 文件：`src/entities/types/user.ts:1`

```ts
export interface User {
  userId: string;
  email: string;
  displayName: string;
  role: 'LEARNER' | 'ADMIN';
  registrationDate: string;
  avatar?: string;
}
```

> 用途：  
> - `userStore` 内部 `currentUser` 类型  
> - 登录成功 / 注册成功返回体中的 `user` 字段  

### 1.2 认证请求类型

- 文件：`src/entities/types/user.ts:8`

```ts
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
}

export interface ResetPasswordRequest {
  email: string;
}
```

> 注意：`src/entities/types/api.types.ts` 中也定义了相同名字的请求类型，语义一致但用于 API 封装层；  
> 前端代码通常使用 `api.types.ts` 中的版本。

### 1.3 API 层认证类型

- 文件：`src/entities/types/api.types.ts:9`

```ts
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
}

export interface LoginResponse {
  user: {
    userId: string;
    email: string;
    displayName: string;
    role: string;
    registrationDate: string;
    avatar?: string;
  };
  token: string;
  expiresIn: number;
}

export interface RegisterResponse extends LoginResponse {}

export interface ResetPasswordRequest {
  email: string;
}

export interface ResetPasswordResponse {
  message?: string;
}
```

> 这些类型直接被 `userStore` 用作 `apiClient` / `callCloudFunction` 调用的泛型参数。

---

## 2. 课程与学习进度相关类型

### 2.1 Level & Course

- 文件：`src/entities/types/course.ts:1`

```ts
export enum Level {
  BEGINNER_A = 'Beginner A',
  BEGINNER_B = 'Beginner B',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced',
}

export interface Course {
  courseId: string;
  name: string;
  nameZh: string;
  level: Level;
  progress: number;        // 0-100
}
```

> `Level` 对应业务中的学习阶段；`Course` 可用于构建课程列表、展示学习进度。

### 2.2 LearningProgress（旧版课程层进度）

- 文件：`src/entities/types/learning.ts:6`

```ts
export interface LearningProgress {
  progressId: string;
  userId: string;
  courseId: string;
  currentLevel: Level;
  completedAlphabets: number;
  completedVocabulary: number;
  completedSentences: number;
  completedArticles: number;
  totalScore: number;
  totalStudyTime: number;
  streakDays: number;
  lastUpdated: Date;
}
```

> 该结构表达的是 **课程维度** 的整体进度；  
> 当前版本中，模块级进度主要由 `moduleAccessStore.UserProgress` 承担。

### 2.3 ModuleType 与模块级进度 UserProgress

- 文件：`src/stores/moduleAccessStore.ts:27,39`

```ts
export type ModuleType = 'alphabet' | 'word' | 'sentence' | 'article';

export interface UserProgress {
  letterProgress: number;
  letterCompleted: boolean;
  letterMasteredCount: number;
  letterTotalCount: number;

  wordProgress: number;
  wordMasteredCount: number;
  wordTotalCount: number;

  sentenceProgress: number;
  sentenceMasteredCount: number;
  sentenceTotalCount: number;

  articleProgress: number;
  articleMasteredCount: number;
  articleTotalCount: number;

  wordUnlocked: boolean;
  sentenceUnlocked: boolean;
  articleUnlocked: boolean;

  dailyLimit?: number;
}
```

> UserProgress 是 **模块维度进度 + 解锁状态** 的综合体，是 Home / Courses / 学习锁机制的基础。

---

## 3. 学习阶段与质量评分枚举

### 3.1 LearningPhase（全局学习阶段）

- 文件：`src/entities/enums/LearningPhase.enum.ts:1`

```ts
export enum LearningPhase {
  REVIEW = 'REVIEW',
  TEST_PROMPT = 'TEST_PROMPT',
  TESTING = 'TESTING',
  TEST_RESULT = 'TEST_RESULT',
  COMPLETED = 'COMPLETED',
}
```

> 在 `alphabetStore` / `vocabularyStore` 中用于标记当前学习阶段。  
> 注意：`src/entities/types/alphabet.types.ts` 里也定义了一份更细致的 `LearningPhase`，是早期版本遗留，实际使用以 `enums` 版本为准。

### 3.2 QualityButton & 质量映射（全局版）

- 文件：`src/entities/enums/QualityScore.enum.ts:1`

```ts
export enum QualityButton {
  KNOW = '记得',
  FUZZY = '模糊',
  FORGET = '陌生',
}

export const QUALITY_SCORE_MAP: Record<QualityButton, number> = {
  [QualityButton.KNOW]: 5,
  [QualityButton.FUZZY]: 3,
  [QualityButton.FORGET]: 1,
};

export const ATTEMPTS_INCREMENT_MAP: Record<QualityButton, number> = {
  [QualityButton.KNOW]: 3,
  [QualityButton.FUZZY]: 1,
  [QualityButton.FORGET]: 2,
};
```

> 此枚举被 `alphabetStore` / `vocabularyStore` / `AlphabetReviewView` 等视图统一使用；  
> 后端 `memory-engine` 期望的 `quality` 是 `'陌生' | '模糊' | '记得'` 文本值。

### 3.3 Alphabet types 中的旧版枚举（仅参考）

- 文件：`src/entities/types/alphabet.types.ts`  
  - 定义了一套较早的 `LearningPhase`, `QualityButton`, `QUALITY_SCORE_MAP` 等，与现用版本不完全一致；  
  - 当前架构主要使用 `src/entities/enums/*.ts`，Alphabet types 中的版本视为历史兼容。

---

## 4. 字母类型：Letter & AlphabetLearningState

### 4.1 Letter（字母基础结构）

- 文件：`src/entities/types/letter.types.ts:35`

```ts
export type LetterType = 'consonant' | 'vowel' | 'tone';
export type ConsonantClass = 'mid' | 'high' | 'low';
export type LearningLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type LetterCategory = 'mid_consonant' | 'high_consonant' | 'low_consonant' | 'vowel' | 'tone';

export interface Letter {
  _id: string;
  type: LetterType;
  thaiChar: string;
  nameThai: string;
  nameEnglish: string;
  initialSound: string;
  finalSound: string;
  class: ConsonantClass | null;
  audioPath: string;
  exampleWord: string;
  exampleMeaning: string;
  strokeCount: number;
  learningLevel: LearningLevel;
  createdAt: string;

  lessonNumber: number;
  category: LetterCategory;
  subCategory: string;

  keyboardKey?: string;

  fullSound?: string;
  fullSoundUrl?: string;
  syllableSoundName?: string;
  syllableSound?: string;
  syllableSoundUrl?: string;
  endSyllableSoundName?: string;
  endSyllableSound?: string;
  endSyllableSoundUrl?: string;
  letterNamePronunciation?: string;
  letterPronunciationUrl?: string;

  letterImageUrl?: string;
  description?: string;
}
```

### 4.2 LetterDisplayInfo（为 UI 提供的展示信息）

- 文件：`src/entities/types/letter.types.ts:104`

```ts
export interface LetterDisplayInfo {
  char: string;
  name: string;
  pronunciation: string;
  example: string;
  audioUrl: string;
  keyboardHint?: string;
}
```

> `getLetterDisplayInfo(letter)` 将原始 Letter 映射为该结构，供学习视图使用。

### 4.3 AlphabetLearningState（会话中的字母状态）

当前版本实际采用的是 **`alphabetStore` 中内联定义的 AlphabetLearningState**，其结构与 `alphabet.types.ts` 中定义的版本一致但字段名略有不同，关键字段：

- 文件：`src/stores/alphabetStore.ts`（注释部分 + 实际使用）

```ts
export interface AlphabetLearningState {
  alphabetId: string;
  thaiChar: string;
  category: string;
  pronunciation: string;
  example: string;
  audioPath: string;

  currentAttempts: number;
  requiredAttempts: number;
  qualityHistory: number[];
  isCompleted: boolean;
  timestamp: string;

  memoryState?: MemoryStatus;
  letterData?: Letter;
}
```

> **风险点**：  
> - `alphabet.types.ts` 中也定义了一份同名接口，字段含义基本一致但 `MemoryStatus` 结构不完全相同；  
> - 为避免歧义，未来建议统一导出自 `alphabet.types.ts` 并在 `alphabetStore` 中引用。

---

## 5. 单词类型：Vocabulary & VocabularyLearningState

### 5.1 Vocabulary（数据库中的单词文档）

- 文件：`src/entities/types/vocabulary.types.ts:5`

```ts
export interface Vocabulary {
  _id: string;
  vocabularyId: string;      // 如 "BEGINNER_A_7"
  thaiWord: string;
  pronunciation: string;
  meaning: string;
  partOfSpeech: string;
  level: string;
  lessonNumber: string;
  startingLetter: string;
  source: string;
  audioPath?: string;

  exampleSentences?: {
    [key: string]: {
      泰语: string;
      发音: string;
      中文: string;
    };
  };

  dialogue?: {
    场景描述: string;
    对话内容: {
      [speaker: string]: {
        泰语: string;
        中文: string;
      };
    };
  };

  usage?: {
    语法示例?: {
      结构: string;
      解释: string;
      使用技巧?: string;
    };
    与中文差异?: string;
  };

  mistakes?: {
    发音易错点?: string;
    使用场合?: string;
    相似词汇区别?: string;
  };

  cognates?: string[];
  createdAt?: Date | string;
}
```

### 5.2 VocabularyLearningState（前端学习状态）

- 文件：`src/entities/types/vocabulary.types.ts:54`

```ts
export interface VocabularyLearningState {
  vocabularyId: string;
  thaiWord: string;
  pronunciation: string;
  meaning: string;
  exampleSentences?: Vocabulary['exampleSentences'];
  audioPath?: string;

  currentAttempts: number;
  requiredAttempts: number;
  qualityHistory: number[];
  isCompleted: boolean;
  timestamp: string;
}
```

> `vocabularyStore` 会将后端返回的 `items` 映射为 `VocabularyLearningState`，并在会话中维护。

### 5.3 VocabularyProgress

- 文件：`src/entities/types/vocabulary.types.ts:83`

```ts
export interface VocabularyProgress {
  masteredCount: number;
  totalCount: number;
  accuracy: number;
  masteredIds: string[];
}
```

> `vocabularyStore` 中 `progress` 和 `courseProgressMap` 使用该结构缓存本地进度。

---

## 6. 记忆引擎相关类型（Memory）

### 6.1 MemoryStatus & UnlockInfo（通用版）

- 文件：`src/entities/types/memory.types.ts:3`

```ts
export interface MemoryStatus {
  userId: string;
  entityType: 'letter' | 'word' | 'sentence';
  entityId: string;
  masteryLevel: number;
  reviewStage: number;
  easinessFactor: number;
  intervalDays: number;
  nextReviewAt: string;
  correctCount: number;
  wrongCount: number;
  streakCorrect: number;
  isLocked: boolean;
}

export interface UnlockInfo {
  unlocked: boolean;
  stage?: 'word' | 'sentence' | 'article';
  message: string;
  letterProgress: number;
}
```

> 这些类型对应后端 `memory-engine` 的核心输出，用于在前端展示进度和解锁状态。

### 6.2 Alphabet 专用 MemoryStatus/UnlockInfo（会话版）

- 文件：`src/entities/types/alphabet.types.ts` 中有专门为字母学习定义的一套 MemoryStatus/UnlockInfo，用于早期版本的 `getTodayMemories` 返回值。  
> 当前 `alphabetStore` 实现中直接复用/兼容该结构，建议未来统一到 `memory.types.ts`。

---

## 7. 测试与评估类型

### 7.1 字母测试与通用测试结构

- 文件：`src/entities/types/test.types.ts:3`

```ts
export interface TestQuestion {
  questionId: string;
  type: 'multiple_choice' | 'audio_match' | 'sequence';
  content: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface AlphabetTest {
  testId: string;
  type: 'skip_test' | 'progress_test';
  difficulty: 'basic' | 'intermediate' | 'advanced';
  questions: TestQuestion[];
  passingScore: number;
  timeLimit: number;
}

export interface TestResult {
  score: number;
  passed: boolean;
  correctCount: number;
  totalQuestions: number;
  results: {
    questionId: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  unlocked: boolean;
  message: string;
}
```

> 与后端 `alphabet` 云函数的字母测试路由相对应。

---

## 8. API 通用类型

### 8.1 ApiResponse

- 文件：`src/entities/types/api.types.ts:1`

```ts
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}
```

> 所有 `apiClient` 与 `callCloudFunction` 调用均返回该结构。  
> 后端文档中的 `message` / `errorCode` 字段在 CloudBase 层由 `createResponse` 包装成此结构的 `data` 或 `error` + `code`。

### 8.2 内容与进度相关 API 类型（节选）

- `GetCoursesResponse` / `GetCourseContentResponse`  
- `GetVocabularyRequest` / `GetVocabularyResponse`  
- `RecordLearningRequest`  
- `GetProgressResponse`  
- `AssessPronunciationRequest` / `AssessPronunciationResponse`  
- `GetDueReviewsResponse` / `UpdateReviewRequest`

> 这些类型为未来与 Java 后端或 CloudBase REST API 对接预留的结构，目前前端主要使用 `memory-engine` / `learn-vocab` 云函数。

---

## 9. 状态管理层（Zustand Store）状态接口

本节不重复粘贴所有 Store 代码，只给出关键状态接口与设计重点。

### 9.1 userStore

- 文件：`src/stores/userStore.ts:14`

```ts
interface UserState {
  currentUser: User | null;
  isAuthenticated: boolean;
  authToken: string | null;
  isLoading: boolean;
  error: string | null;

  register: (data: RegisterRequest) => Promise<boolean>;
  login: (data: LoginRequest) => Promise<boolean>;
  logout: () => void;
  requestPasswordReset: (data: ResetPasswordRequest) => Promise<boolean>;
  updateProfile: (data: { displayName?: string; avatar?: string }) => Promise<boolean>;
  setUser: (user: User, token: string) => void;
  checkAuth: () => boolean;
  clearError: () => void;
}
```

### 9.2 moduleAccessStore

- 文件：`src/stores/moduleAccessStore.ts:61`

```ts
interface ModuleAccessStore {
  userProgress: UserProgress | null;
  accessCache: Map<ModuleType, boolean>;
  isLoading: boolean;
  error: string | null;

  checkAccess: (moduleType: ModuleType) => Promise<boolean>;
  checkAccessLocally: (moduleType: ModuleType) => boolean;
  getUserProgress: () => Promise<void>;
  clearCache: () => void;
  setError: (error: string | null) => void;
  setDailyLimit: (moduleType: ModuleType, limit: number) => void;
}
```

### 9.3 alphabetStore & vocabularyStore

- `alphabetStore`：参见主快照文档中的「新字母学习系统架构」部分。  
- `vocabularyStore`：管理 `VocabularyLearningState` 队列、课程进度及 `startCourse`、`submitAnswer` 等操作。

### 9.4 learningPreferenceStore

- 文件：`src/stores/learningPreferenceStore.ts:6`

```ts
type DailyLimitMap = Partial<Record<ModuleType, number>>;

interface LearningPreferenceStore {
  dailyLimits: DailyLimitMap;
  setDailyLimit: (module: ModuleType, limit: number) => void;
  hasDailyLimit: (module: ModuleType) => boolean;
}
```

> 用于 `/learning/setup`、课程页与 Session 中控制每日任务量。

---

## 10. 对未来 AI / 开发的注意事项

1. **类型重复风险**：  
   - `alphabet.types.ts` 与 `alphabetStore.ts` 中存在重复的 `AlphabetLearningState` / `LearningPhase` / `QualityButton` 定义；  
   - 统一使用 `src/entities/enums/*.ts` + `alphabet.types.ts` 版本更安全，避免混用。

2. **API 类型与云函数真实返回可能存在差异**：  
   - `ApiResponse<T>` 是前端统一包装；  
   - 云函数返回结构中常见字段还有 `message`, `errorCode`, `timestamp`，在前端层需要适当映射到 `error` / `code`。

3. **新增模块时优先扩展类型**：  
   - 先在 `entities/types` / `entities/enums` 中添加/扩展类型；  
   - 再在 Store 与组件中引用类型，而不是在组件内写字面量字符串。

> 阅读建议：  
> - 先通读 `docs/Document/project-snapshot-v1.0.9-V9.md` 获得架构全貌；  
> - 再根据需要查阅本类型参考文档中的具体结构；  
> - 对接后端接口时，再查看 `docs/api-reference-v1.0.9-V9.md` 与 `backend_integration_guide.md`。
