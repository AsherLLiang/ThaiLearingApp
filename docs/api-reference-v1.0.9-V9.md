# API 参考 API Reference v1.0.9 / V9

> 本文聚焦 **前端可见的所有 API / 云函数 / 端点映射**，  
> 帮助 AI / 开发者在不打开后端仓库的情况下正确对接。

---

## 1. 通用约定

### 1.1 统一响应结构 `ApiResponse<T>`

- 文件：`src/entities/types/api.types.ts:1`

```ts
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}
```

> 前端所有封装（统一的 `apiClient` 与 `callCloudFunction`）都返回该结构。  
> CloudBase 层的 `createResponse` 通常会包含 `data`, `message`, `errorCode`, `timestamp`，在前端被映射/压缩为上述字段。

### 1.2 前端请求工具

**`apiClient`**（REST / HTTP + CloudBase HTTP 触发器）  
- 文件：`src/utils/apiClient.ts:1`
- 核心特性：
  - 使用 `getApiBaseUrl()` + `EndpointMap` 构建完整 URL；
  - 附带 Bearer Token（从 `userStore` 注入）；
  - 内置超时（`API_TIMEOUT`）与错误码映射。

核心接口：

```ts
class ApiClient {
  setAuthToken(token: string | null): void;
  getAuthToken(): string | null;

  async get<T>(endpoint: string | EndpointMap, options?: RequestOptions): Promise<ApiResponse<T>>;
  async post<T>(endpoint: string | EndpointMap, data?: any, options?: RequestOptions): Promise<ApiResponse<T>>;
  async put<T>(endpoint: string | EndpointMap, data?: any, options?: RequestOptions): Promise<ApiResponse<T>>;
  async delete<T>(endpoint: string | EndpointMap, options?: RequestOptions): Promise<ApiResponse<T>>;
}
```

**`callCloudFunction`**（基于 `apiClient` 的 CloudBase 函数适配器）  
- 文件：`src/utils/apiClient.ts`

```ts
export async function callCloudFunction<T>(
  action: string,
  data: Record<string, any>,
  options?: { endpoint?: string },
): Promise<ApiResponse<T>> {
  const endpoint = options?.endpoint ?? '/learn-vocab';
  const response = await apiClient.post<T>(endpoint, { action, data });
  return response;
}
```

> 默认端点为 `/learn-vocab`，实际用于统一记忆引擎时需要传入 `endpoint: API_ENDPOINTS.MEMORY.*.cloudbase`。

---

## 2. 端点映射：`src/config/api.endpoints.ts`

> 所有前端请求都应优先从这里取端点，而不是写死 URL。

### 2.1 后端类型

```ts
export type BackendType = 'cloudbase' | 'java';

export interface EndpointMap {
  cloudbase: string;  // CloudBase 云函数路径/HTTP 触发名
  java: string;       // Java Spring Boot 路径
}
```

`apiClient` 内部会根据 `CURRENT_BACKEND` 选择对应的字段并与 `getApiBaseUrl()` 拼接生成完整 URL。

### 2.2 分模块端点一览（前端视角）

#### AUTH_ENDPOINTS

| 名称 | CloudBase | Java |
|------|-----------|------|
| LOGIN | `/user-login` | `/api/auth/login` |
| REGISTER | `/user-register` | `/api/auth/register` |
| RESET_PASSWORD | `/user-reset-password` | `/api/auth/reset-password` |
| UPDATE_PROFILE | `/user-update-profile` | `/api/user/profile` |
| LOGOUT | `/user-logout` | `/api/auth/logout` |

#### COURSE_ENDPOINTS

| 名称 | CloudBase | Java |
|------|-----------|------|
| GET_ALL | `/course-get-all` | `/api/courses` |
| GET_DETAIL | `/course-get-detail` | `/api/courses/:id` |
| GET_CONTENT | `/course-get-content` | `/api/courses/:id/content` |

#### LEARNING_ENDPOINTS（旧版学习 API）

| 名称 | CloudBase | Java |
|------|-----------|------|
| GET_ALPHABETS | `/learning-get-alphabets` | `/api/learning/alphabets` |
| GET_VOCABULARY | `/learning-get-vocabulary` | `/api/learning/vocabulary` |
| GET_SENTENCES | `/learning-get-sentences` | `/api/learning/sentences` |
| GET_ARTICLES | `/learning-get-articles` | `/api/learning/articles` |
| RECORD_COMPLETION | `/learning-record-completion` | `/api/learning/record` |

> 当前版本主要通过 `memory-engine` 实现记忆调度，`LEARNING_ENDPOINTS` 偏向历史兼容或非 SRS 功能。

#### PRONUNCIATION_ENDPOINTS

| 名称 | CloudBase | Java |
|------|-----------|------|
| ASSESS | `/pronunciation-assess` | `/api/pronunciation/assess` |
| GET_HISTORY | `/pronunciation-get-history` | `/api/pronunciation/history` |

#### PROGRESS_ENDPOINTS

| 名称 | CloudBase | Java |
|------|-----------|------|
| GET | `/progress-get` | `/api/progress` |
| UPDATE | `/progress-update` | `/api/progress` |
| GET_STATISTICS | `/progress-get-statistics` | `/api/progress/statistics` |

#### REVIEW_ENDPOINTS（复习计划）

| 名称 | CloudBase | Java |
|------|-----------|------|
| GET_DUE | `/review-get-due` | `/api/reviews/due` |
| UPDATE | `/review-update` | `/api/reviews/:id` |
| GET_HISTORY | `/review-get-history` | `/api/reviews/history` |

#### ALPHABET_ENDPOINTS（字母测试 / 非记忆引擎模式）

| 名称 | CloudBase | Java |
|------|-----------|------|
| GET_TODAY | `/vocabulary-get-today-alphabets` | `/api/vocabulary/alphabets/today` |
| SUBMIT_RESULT | `/vocabulary-submit-alphabet-result` | `/api/vocabulary/alphabets/result` |
| GET_TEST | `/vocabulary-get-alphabet-test` | `/api/vocabulary/alphabets/test` |
| SUBMIT_TEST | `/vocabulary-submit-alphabet-test` | `/api/vocabulary/alphabets/test/submit` |

#### MODULE_ENDPOINTS（模块访问与进度）

| 名称 | CloudBase | Java |
|------|-----------|------|
| CHECK_ACCESS | `/learn-vocab` | `/api/modules/access` |
| GET_USER_PROGRESS | `/learn-vocab` | `/api/modules/progress` |

> 注意：前端通过 `callCloudFunction('checkModuleAccess' | 'getUserProgress', ...)` 调用 CloudBase 侧实际执行的 `memory-engine` 或 `learn-vocab` 逻辑。

#### VOCABULARY_ENDPOINTS（旧单词云函数 `learn-vocab`）

| 名称 | CloudBase | Java |
|------|-----------|------|
| GET_TODAY_WORDS | `/learn-vocab` | `/api/vocabulary/today` |
| UPDATE_MASTERY | `/learn-vocab` | `/api/vocabulary/mastery` |
| GET_VOCABULARY_LIST | `/learn-vocab` | `/api/vocabulary/list` |
| TOGGLE_SKIP_WORD | `/learn-vocab` | `/api/vocabulary/skip` |
| GET_SKIPPED_WORDS | `/learn-vocab` | `/api/vocabulary/skipped` |
| GET_VOCABULARY_DETAIL | `/learn-vocab` | `/api/vocabulary/:id` |
| GET_REVIEW_STATISTICS | `/learn-vocab` | `/api/vocabulary/statistics` |

#### MEMORY_ENDPOINTS（统一记忆引擎）

| 名称 | CloudBase | Java |
|------|-----------|------|
| GET_TODAY_MEMORIES | `/memory-engine` | `/api/memory/today` |
| SUBMIT_MEMORY_RESULT | `/memory-engine` | `/api/memory/result` |

> 当前版本中，**字母学习**已经明确依赖 `MEMORY_ENDPOINTS`；单词学习正在逐步迁移。

---

## 3. CloudBase 云函数：memory-engine

- 文件：`cloudbase/functions/memory-engine/index.js:1`

### 3.1 请求结构（前端）

```ts
// 前端调用示例
const res = await callCloudFunction<T>('getTodayMemories', {
  userId,
  entityType: 'letter' | 'word' | 'sentence',
  limit: 20,
}, {
  endpoint: API_ENDPOINTS.MEMORY.GET_TODAY_MEMORIES.cloudbase,
});
```

### 3.2 支持的 Action 与参数

#### 3.2.1 `getTodayMemories`

- 用途：获取今日需要复习/学习的实体（字母/单词/句子）。

请求参数：

```ts
{
  userId: string;
  entityType: 'letter' | 'word' | 'sentence';
  limit?: number;        // 默认 20
  includeNew?: boolean;  // 默认 true
}
```

返回结构（概念层）：

```ts
interface TodayMemoriesResponse<TMemoryItem> {
  items: TMemoryItem[];
  summary: {
    total: number;
    reviewCount: number;
    newCount: number;
    entityType: string;
  };
  unlockInfo?: {
    // 根据 entityType 区分，例如字母学习进度等
  };
}
```

> 前端在 `alphabetStore` 中对返回结构做了“宽松解析”（多种 data 包裹形态），并将 `items` 映射到 `AlphabetLearningState`。

#### 3.2.2 `submitMemoryResult`

- 用途：提交单次学习结果并更新记忆状态。

请求参数：

```ts
{
  userId: string;
  entityType: 'letter' | 'word' | 'sentence';
  entityId: string;
  quality: '陌生' | '模糊' | '记得';
}
```

返回示意：

```ts
interface SubmitMemoryResultResponse {
  memoryState: MemoryStatus; // 统一记忆引擎的最新状态
  unlockInfo?: UnlockInfo;   // 是否触发模块解锁
}
```

> 前端 `alphabetStore.submitResult` 目前主要关心调用是否成功，解锁信息可通过 `moduleAccessStore` 获取。

#### 3.2.3 `checkModuleAccess`

- 用途：检查用户是否有权限访问某个学习模块（字母/单词/句子/文章）。

请求参数：

```ts
{
  userId: string;
  moduleType: 'alphabet' | 'word' | 'sentence' | 'article';
}
```

返回结构：

```ts
interface CheckAccessResponse {
  allowed: boolean;
  reason?: string;
  requiredProgress?: number; // 解锁所需进度百分比
  currentProgress?: number;  // 当前进度百分比
}
```

> `moduleAccessStore.checkAccess` 使用该响应，并在失败时回退到本地 `checkAccessLocally`。

#### 3.2.4 `getUserProgress`

- 用途：获取用户当前的模块层进度数据。

请求参数：

```ts
{
  userId: string;
}
```

返回结构（前端视角）：

```ts
interface UserProgressResponse {
  progress: UserProgress; // 对应 moduleAccessStore.UserProgress
}
```

> `moduleAccessStore.getUserProgress` 在成功时把 `progress` 写入 Store。

---

## 4. CloudBase 云函数：learn-vocab

- 文件：`cloudbase/functions/learn-vocab/index.js:1`

### 4.1 旧/兼容模式

支持的主要 Action（详见 `docs/08-Vocabulary-API-Documentation.md`）：

- `getTodayWords`
- `updateMastery`
- `toggleSkipWord`
- `getVocabularyDetail`
- `getReviewStatistics`
- `getVocabularyList`
- `getSkippedWords`

### 4.2 已迁移到 memory-engine 的 Action

以下 Action 在 `learn-vocab` 中会返回 `MOVED_PERMANENTLY` 错误，提示客户端改用 `memory-engine`：

```js
if (['getTodayMemories', 'submitMemoryResult', 'checkModuleAccess', 'getUserProgress'].includes(action)) {
  return createResponse(
    false,
    null,
    `Action '${action}' has been moved to 'memory-engine' cloud function. Please update your client.`,
    'MOVED_PERMANENTLY'
  );
}
```

> **风险**：前端如果错误地用 `/learn-vocab` 调用这些 Action，会收到错误，需要切换到 `/memory-engine`。

---

## 5. CloudBase 云函数：alphabet

> 用于字母测试（非 SRS 学习流程），与 `ALPHABET_ENDPOINTS` 对应。

典型 Action：

- `getLetterTest`：获取字母测试题；  
- `submitLetterTest`：提交测试结果；

前端相关类型定义在 `src/entities/types/test.types.ts` 与 `src/entities/types/alphabet.types.ts` 中。

---

## 6. 前端调用示例与最佳实践

### 6.1 调用统一记忆引擎获取今日字母

```ts
import { callCloudFunction } from '@/src/utils/apiClient';
import { API_ENDPOINTS } from '@/src/config/api.endpoints';

const res = await callCloudFunction<TodayMemoriesResponse>(
  'getTodayMemories',
  { userId, entityType: 'letter', limit: 20 },
  { endpoint: API_ENDPOINTS.MEMORY.GET_TODAY_MEMORIES.cloudbase },
);

if (res.success && res.data) {
  // 将 res.data.items 映射到 AlphabetLearningState[]
} else {
  // 处理 error / code
}
```

### 6.2 提交字母学习结果

```ts
import { QualityButton } from '@/src/entities/enums/QualityScore.enum';

await callCloudFunction(
  'submitMemoryResult',
  {
    userId,
    entityType: 'letter',
    entityId: currentAlphabet.alphabetId,
    quality: '记得' as const, // 来自 QualityButton 映射
  },
  {
    endpoint: API_ENDPOINTS.MEMORY.SUBMIT_MEMORY_RESULT.cloudbase,
  },
);
```

### 6.3 检查模块访问

```ts
const res = await callCloudFunction<CheckAccessResponse>(
  'checkModuleAccess',
  { userId, moduleType: 'word' },
  { endpoint: API_ENDPOINTS.MEMORY.GET_TODAY_MEMORIES.cloudbase }, // 或 specific endpoint
);

if (!res.success || !res.data?.allowed) {
  // 显示锁定提示
}
```

---

## 7. 对未来 AI / 开发的接口设计建议

1. **所有新 API 必须在 `api.endpoints.ts` 中登记**：  
   - 新增模块（如 sentence/article）的端点，请添加对应的 `EndpointMap`；  
   - 避免在组件或 Store 中硬编码 URL。

2. **统一通过 `apiClient` / `callCloudFunction` 调用**：  
   - REST 风格接口走 `apiClient`；  
   - CloudBase 多 Action 云函数走 `callCloudFunction`。

3. **新增记忆实体时复用 memory-engine**：  
   - 在后端添加新的 `entityType` 支持；  
   - 前端仅需扩展 `entityType` 字面量与类型定义，无需新增云函数。

4. **错误处理建议**：  
   - 根据 `ApiResponse.code` / `error` 字段做分类，如：`TOKEN_EXPIRED`, `NETWORK_ERROR`, `TIMEOUT`；  
   - 对 `MOVED_PERMANENTLY` 这类错误，应提示“请切换到 memory-engine”并在前端配置中修正端点。

> 结论：  
> - 前端 API 层已通过 `api.endpoints.ts` + `apiClient` + `callCloudFunction` 封装出稳定的接口面；  
> - 新功能开发时，优先考虑如何映射到 **“端点映射 → 请求工具 → Store”** 三段式结构，而不是直接在组件中写请求逻辑。
