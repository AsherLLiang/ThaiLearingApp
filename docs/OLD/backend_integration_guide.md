# 后端云函数集成指南

本文档旨在帮助前端开发者在不直接查看后端源代码的情况下，正确集成和调用后端云函数。

## 1. 云函数概览

目前系统主要包含以下三个核心云函数：

| 云函数名称 | 主要功能 | 对应 API 模块 |
| :--- | :--- | :--- |
| `learn-vocab` | 单词学习、复习、统计 (旧版入口，部分功能已迁移) | `VOCABULARY_ENDPOINTS` |
| `memory-engine` | **核心**：统一记忆引擎，处理字母、单词、句子的学习与复习 | `MEMORY_ENDPOINTS` |
| `alphabet` | 字母测试相关功能 | `ALPHABET_ENDPOINTS` |

## 2. API 调用方式

所有云函数均通过 `wx.cloud.callFunction` (小程序端) 或 HTTP 触发器调用。

### 通用调用格式

```javascript
// 示例：调用 memory-engine
const result = await wx.cloud.callFunction({
  name: 'memory-engine', // 云函数名称
  data: {
    action: 'getTodayMemories', // 操作指令
    data: {                     // 业务参数
      userId: 'user_123',
      entityType: 'word'
    }
  }
});
```

**注意**：
- `learn-vocab` 和 `memory-engine` 的参数结构通常为 `{ action, data: { ...params } }`。
- `alphabet` 的参数结构略有不同，部分接口直接在顶层传递参数 `{ action, userId, answers }`。

## 3. 响应格式 (Response Tool)

所有云函数返回统一的响应结构，前端应使用统一的工具函数处理。

### 标准响应结构

```typescript
interface ApiResponse<T> {
  success: boolean;      // 是否成功
  data?: T;              // 成功时的数据
  message?: string;      // 提示消息或错误描述
  errorCode?: string;    // 错误码 (仅失败时)
  timestamp: string;     // ISO 时间戳
}
```

### 常见错误码

- `INVALID_PARAMS`: 参数错误
- `USER_NOT_FOUND`: 用户不存在
- `INVALID_ACTION`: 无效的操作指令
- `SERVER_ERROR`: 服务器内部错误

## 4. 关键云函数详解

### 4.1 Memory Engine (统一记忆引擎)

**云函数名**: `memory-engine`
**主入口**: `index.js` -> `exports.main`

该函数是核心引擎，负责调度所有类型的学习内容（字母、单词、句子）。

#### API 列表

**1. 获取今日学习内容**
- **Action**: `getTodayMemories`
- **参数**:
  ```javascript
  {
    userId: string;
    entityType: 'letter' | 'word' | 'sentence';
    limit?: number;       // 可选，默认 20
    includeNew?: boolean; // 可选，是否包含新内容，默认 true
  }
  ```
- **返回**: `{ items: LearningItem[], summary: { total, reviewCount, newCount } }`

**2. 提交学习结果**
- **Action**: `submitMemoryResult`
- **参数**:
  ```javascript
  {
    userId: string;
    entityType: 'letter' | 'word' | 'sentence';
    entityId: string;
    quality: '陌生' | '模糊' | '记得'; // 记忆质量
  }
  ```
- **返回**: 更新后的记忆状态对象

**3. 检查模块访问权限**
- **Action**: `checkModuleAccess`
- **参数**:
  ```javascript
  {
    userId: string;
    moduleName: string; // e.g., 'word'
  }
  ```
- **返回**: `{ allowed: boolean, message?: string }`

### 4.2 Learn Vocab (单词学习 - 旧版/兼容)

**云函数名**: `learn-vocab`

主要处理单词特有的业务逻辑，部分通用逻辑已转发至 `memory-engine`。

#### API 列表

**1. 获取今日单词 (旧版逻辑)**
- **Action**: `getTodayWords`
- **参数**:
  ```javascript
  {
    userId: string;
    limit?: number;
    offset?: number;
    level?: string;
  }
  ```
- **返回**: `{ words: Vocabulary[], pagination: { ... } }`

**2. 更新单词掌握度**
- **Action**: `updateMastery`
- **参数**: `{ userId, vocabularyId, mastery }`

### 4.3 Alphabet (字母测试)

**云函数名**: `alphabet` (具体名称需参考 `cloudbaserc.json` 或目录名)

#### API 列表

**1. 获取字母测试题**
- **Action**: `getLetterTest`
- **参数**: 无 (直接传入 `{ action: 'getLetterTest' }`)
- **返回**: `{ questions: TestQuestion[], total: number }`

**2. 提交测试结果**
- **Action**: `submitLetterTest`
- **参数**:
  ```javascript
  {
    userId: string;
    answers: Record<string, string>; // 题目ID -> 答案
  }
  ```
- **注意**: 此接口参数直接在 `event` 顶层，而非 `data` 对象内。

## 5. 前端配置建议

建议在 `src/config/api.endpoints.ts` 中维护所有端点映射，并使用适配器模式处理不同云函数的参数差异。

```typescript
// 示例配置
export const MEMORY_ENDPOINTS = {
  GET_TODAY_MEMORIES: {
    cloudbase: '/memory-engine', // 映射到云函数名
    // ...
  }
};
```
