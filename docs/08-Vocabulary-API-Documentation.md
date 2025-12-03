# 词汇学习 API 接口文档

> **版本**: 1.2.0
> **云函数名**: `vocabulary`
> **更新日期**: 2025-11-28

---

## 目录

1. [概述](#1-概述)
2. [调用方式](#2-调用方式)
3. [通用响应格式](#3-通用响应格式)
4. [错误码](#4-错误码)
5. [API 详细说明](#5-api-详细说明)
   - [getTodayWords](#51-gettodaywords)
   - [updateMastery](#52-updatemastery)
   - [toggleSkipWord](#53-toggleskipword)
   - [getVocabularyDetail](#54-getvocabularydetail)
   - [getReviewStatistics](#55-getreviewstatistics)
   - [getVocabularyList](#56-getvocabularylist)
   - [getSkippedWords](#57-getskippedwords)
6. [SM-2 算法说明](#6-sm-2-算法说明)
7. [前端集成示例](#7-前端集成示例)

---

## 1. 概述

词汇学习模块提供完整的单词学习和复习功能，支持:

- 📚 获取今日学习单词
- ✅ 记录掌握程度 (陌生/模糊/记得)
- 🔄 SM-2 间隔重复算法
- 📊 学习进度统计
- 🚫 划掉/恢复单词

### 架构特点

| 特性 | 说明 |
|------|------|
| **架构** | 单函数多Action模式 |
| **Action数** | 7个 |
| **算法** | 优化版SM-2 (基于艾宾浩斯遗忘曲线) |
| **响应格式** | 统一 `ApiResponse<T>` |

---

## 2. 调用方式

### 2.1 CloudBase SDK (推荐)

```javascript
import cloud from '@cloudbase/js-sdk';

const app = cloud.init({
  env: 'cloud1-1gjcyrdd7ab927c6'
});

const result = await app.callFunction({
  name: 'vocabulary',
  data: {
    action: 'getTodayWords',      // Action名称
    data: {                        // 参数对象
      userId: 'u_xxx',
      limit: 20
    }
  }
});
```

### 2.2 HTTP 调用

```bash
POST https://cloud1-1gjcyrdd7ab927c6.ap-shanghai.app.tcloudbase.com/vocabulary

Content-Type: application/json

{
  "action": "getTodayWords",
  "data": {
    "userId": "u_xxx",
    "limit": 20
  }
}
```

---

## 3. 通用响应格式

所有 API 返回统一的 `ApiResponse<T>` 格式:

```typescript
interface ApiResponse<T> {
  success: boolean;       // 操作是否成功
  data: T | null;         // 返回数据 (失败时为 null)
  message: string;        // 提示消息
  errorCode: string | null; // 错误码 (成功时为 null)
  timestamp: string;      // 服务器时间戳 (ISO 8601)
}
```

### 成功响应示例

```json
{
  "success": true,
  "data": { ... },
  "message": "操作成功",
  "errorCode": null,
  "timestamp": "2025-11-28T10:30:00.000Z"
}
```

### 失败响应示例

```json
{
  "success": false,
  "data": null,
  "message": "用户不存在，请检查用户ID或重新登录",
  "errorCode": "USER_NOT_FOUND",
  "timestamp": "2025-11-28T10:30:00.000Z"
}
```

---

## 4. 错误码

| 错误码 | 含义 | HTTP等效 | 处理建议 |
|--------|------|---------|----------|
| `USER_NOT_FOUND` | 用户不存在 | 404 | 检查userId或重新登录 |
| `VOCABULARY_NOT_FOUND` | 词汇不存在 | 404 | 检查vocabularyId |
| `INVALID_PARAMS` | 参数格式错误 | 400 | 检查请求参数 |
| `INVALID_MASTERY` | 无效的掌握程度 | 400 | 使用: 陌生/模糊/记得 |
| `UNKNOWN_ACTION` | 未知操作类型 | 400 | 检查action参数 |
| `SERVER_ERROR` | 服务器内部错误 | 500 | 稍后重试 |

---

## 5. API 详细说明

### 5.1 getTodayWords

获取用户今日需要学习和复习的单词列表。

#### 请求参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `userId` | string | ✅ | - | 用户ID |
| `limit` | number | ❌ | 30 | 返回数量上限 |
| `offset` | number | ❌ | 0 | 分页偏移 |
| `level` | string | ❌ | - | 难度筛选 |

#### 请求示例

```javascript
{
  action: 'getTodayWords',
  data: {
    userId: 'u_1764089012264_k3aqcbtc0',
    limit: 20,
    offset: 0,
    level: 'BEGINNER_B'
  }
}
```

#### 响应数据

```typescript
interface GetTodayWordsResponse {
  words: TodayWordItem[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
  summary: {
    reviewCount: number;   // 需复习数
    newCount: number;      // 新词数
    totalToday: number;    // 今日总数
  };
}

interface TodayWordItem {
  vocabularyId: string;
  thaiWord: string;
  meaning: string;
  pronunciation: string;
  audioPath: string;
  partOfSpeech: string;
  level: string;
  lessonNumber: string;
  learningStatus: {
    mastery: '陌生' | '模糊' | '记得' | null;
    reviewCount: number;
    lastReviewed: string | null;
    nextReviewDate: string | null;
    intervalDays: number;
    isReview: boolean;
    isNew: boolean;
  };
}
```

#### 响应示例

```json
{
  "success": true,
  "data": {
    "words": [
      {
        "vocabularyId": "BEGINNER_B_327",
        "thaiWord": "ซัวเถา",
        "meaning": "汕头",
        "pronunciation": "sǔa-tháo",
        "audioPath": "327.mp3",
        "partOfSpeech": "名词",
        "level": "BEGINNER_B",
        "lessonNumber": "1.1",
        "learningStatus": {
          "mastery": "模糊",
          "reviewCount": 3,
          "lastReviewed": "2025-11-27T10:00:00Z",
          "nextReviewDate": "2025-11-28T10:00:00Z",
          "intervalDays": 2,
          "isReview": true,
          "isNew": false
        }
      }
    ],
    "pagination": {
      "total": 25,
      "limit": 20,
      "offset": 0,
      "hasMore": true
    },
    "summary": {
      "reviewCount": 15,
      "newCount": 10,
      "totalToday": 25
    }
  },
  "message": "获取今日单词成功",
  "errorCode": null,
  "timestamp": "2025-11-28T10:30:00Z"
}
```

---

### 5.2 updateMastery

更新单词掌握状态，触发SM-2算法计算下次复习时间。

#### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `userId` | string | ✅ | 用户ID |
| `vocabularyId` | string | ✅ | 词汇ID |
| `mastery` | string | ✅ | 掌握程度: `陌生` / `模糊` / `记得` |

#### 请求示例

```javascript
{
  action: 'updateMastery',
  data: {
    userId: 'u_1764089012264_k3aqcbtc0',
    vocabularyId: 'BEGINNER_B_327',
    mastery: '记得'
  }
}
```

#### 响应数据

```typescript
interface UpdateMasteryResponse {
  vocabularyId: string;
  mastery: string;
  reviewCount: number;
  nextReviewDate: string;
  intervalDays: number;
  easinessFactor: number;
  isNewRecord: boolean;
  reviewTimeline: Array<{
    reviewNumber: number;
    intervalDays: number;
  }>;
}
```

#### 响应示例

```json
{
  "success": true,
  "data": {
    "vocabularyId": "BEGINNER_B_327",
    "mastery": "记得",
    "reviewCount": 4,
    "nextReviewDate": "2025-12-05T10:30:00Z",
    "intervalDays": 7,
    "easinessFactor": 2.6,
    "isNewRecord": false,
    "reviewTimeline": [
      { "reviewNumber": 5, "intervalDays": 14 },
      { "reviewNumber": 6, "intervalDays": 35 },
      { "reviewNumber": 7, "intervalDays": 87 }
    ]
  },
  "message": "更新掌握状态成功",
  "errorCode": null,
  "timestamp": "2025-11-28T10:30:00Z"
}
```

---

### 5.3 toggleSkipWord

将单词从复习队列中移除或重新加入。

#### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `userId` | string | ✅ | 用户ID |
| `vocabularyId` | string | ✅ | 词汇ID |
| `skipped` | boolean | ✅ | `true`=划掉, `false`=恢复 |

#### 请求示例

```javascript
{
  action: 'toggleSkipWord',
  data: {
    userId: 'u_xxx',
    vocabularyId: 'BEGINNER_B_327',
    skipped: true
  }
}
```

#### 响应示例

```json
{
  "success": true,
  "data": {
    "vocabularyId": "BEGINNER_B_327",
    "skipped": true,
    "message": "已从复习队列移除"
  },
  "message": "单词已划掉",
  "errorCode": null,
  "timestamp": "2025-11-28T10:30:00Z"
}
```

---

### 5.4 getVocabularyDetail

获取单词的完整学习内容。

#### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `vocabularyId` | string | ✅ | 词汇ID |
| `userId` | string | ❌ | 用户ID (可选，用于获取学习状态) |

#### 请求示例

```javascript
{
  action: 'getVocabularyDetail',
  data: {
    vocabularyId: 'BEGINNER_B_327',
    userId: 'u_xxx'
  }
}
```

#### 响应数据

```typescript
interface VocabularyDetail {
  // 基本信息
  vocabularyId: string;
  thaiWord: string;
  meaning: string;
  pronunciation: string;
  audioPath: string;
  partOfSpeech: string;
  level: string;
  lessonNumber: string;
  startingLetter: string;
  
  // 扩展内容
  cognates: string[];
  dialogue: object | null;
  exampleSentences: object;
  usage: object;
  mistakes: object;
  
  // 学习状态 (仅当提供userId时)
  learningStatus?: LearningStatus;
}
```

#### 响应示例

```json
{
  "success": true,
  "data": {
    "vocabularyId": "BEGINNER_B_327",
    "thaiWord": "ซัวเถา",
    "meaning": "汕头",
    "pronunciation": "sǔa-tháo",
    "audioPath": "327.mp3",
    "partOfSpeech": "名词",
    "level": "BEGINNER_B",
    "lessonNumber": "1.1",
    "startingLetter": "ซ",
    "cognates": [
      "กรุงเทพมหานคร - 曼谷",
      "เชียงใหม่ - 清迈"
    ],
    "dialogue": {
      "场景描述": "两位朋友在讨论中国城市",
      "对话内容": { ... }
    },
    "exampleSentences": {
      "实用场景1": {
        "中文": "我在汕头有个朋友",
        "泰语": "ฉันมีเพื่อนที่อยู่ในเมืองซัวเถา"
      }
    },
    "usage": { ... },
    "mistakes": { ... },
    "learningStatus": {
      "mastery": "模糊",
      "skipped": false,
      "reviewCount": 3,
      "lastReviewed": "2025-11-27T10:00:00Z",
      "nextReviewDate": "2025-11-29T10:00:00Z",
      "intervalDays": 2,
      "isNew": false
    }
  },
  "message": "获取词汇详情成功",
  "errorCode": null,
  "timestamp": "2025-11-28T10:30:00Z"
}
```

---

### 5.5 getReviewStatistics

获取用户学习进度统计数据。

#### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `userId` | string | ✅ | 用户ID |

#### 请求示例

```javascript
{
  action: 'getReviewStatistics',
  data: {
    userId: 'u_xxx'
  }
}
```

#### 响应数据

```typescript
interface ReviewStatistics {
  today: {
    reviewed: number;      // 今日已复习
    remaining: number;     // 今日待复习
    target: number;        // 每日目标 (30)
  };
  overall: {
    totalLearned: number;       // 已学习总数
    totalVocabulary: number;    // 词汇库总数
    progressPercentage: string; // 进度百分比
    skipped: number;            // 已划掉数
    avgReviewCount: number;     // 平均复习次数
  };
  masteryDistribution: {
    '陌生': number;
    '模糊': number;
    '记得': number;
  };
  masteryRate: number;          // 掌握率 (%)
  nextRecommendedWord: object | null;
  streakDays: number;           // 连续学习天数
  algorithmInfo: {
    name: string;
    earlyIntervals: number[];
    description: string;
  };
}
```

#### 响应示例

```json
{
  "success": true,
  "data": {
    "today": {
      "reviewed": 12,
      "remaining": 8,
      "target": 30
    },
    "overall": {
      "totalLearned": 85,
      "totalVocabulary": 500,
      "progressPercentage": "17.0",
      "skipped": 5,
      "avgReviewCount": 3.2
    },
    "masteryDistribution": {
      "陌生": 15,
      "模糊": 35,
      "记得": 35
    },
    "masteryRate": 41.2,
    "nextRecommendedWord": {
      "vocabularyId": "BEGINNER_B_100",
      "thaiWord": "สวัสดี",
      "meaning": "你好",
      "mastery": "陌生"
    },
    "streakDays": 7,
    "algorithmInfo": {
      "name": "Optimized SM-2",
      "earlyIntervals": [1, 2, 4, 7, 14],
      "description": "基于艾宾浩斯遗忘曲线优化的间隔重复算法"
    }
  },
  "message": "获取统计数据成功",
  "errorCode": null,
  "timestamp": "2025-11-28T10:30:00Z"
}
```

---

### 5.6 getVocabularyList

获取词汇库列表，支持筛选和分页。

#### 请求参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `filters` | object | ❌ | {} | 筛选条件 |
| `filters.level` | string | ❌ | - | 难度等级 |
| `filters.lessonNumber` | string | ❌ | - | 课程编号 |
| `filters.startingLetter` | string | ❌ | - | 首字母 |
| `filters.partOfSpeech` | string | ❌ | - | 词性 |
| `limit` | number | ❌ | 20 | 返回数量 |
| `offset` | number | ❌ | 0 | 分页偏移 |

#### 请求示例

```javascript
{
  action: 'getVocabularyList',
  data: {
    filters: {
      level: 'BEGINNER_B',
      lessonNumber: '1.1'
    },
    limit: 20,
    offset: 0
  }
}
```

#### 响应示例

```json
{
  "success": true,
  "data": {
    "vocabularies": [
      {
        "vocabularyId": "BEGINNER_B_327",
        "thaiWord": "ซัวเถา",
        "meaning": "汕头",
        "pronunciation": "sǔa-tháo",
        "audioPath": "327.mp3",
        "partOfSpeech": "名词",
        "level": "BEGINNER_B",
        "lessonNumber": "1.1"
      }
    ],
    "pagination": {
      "total": 50,
      "limit": 20,
      "offset": 0,
      "hasMore": true
    }
  },
  "message": "获取词汇列表成功",
  "errorCode": null,
  "timestamp": "2025-11-28T10:30:00Z"
}
```

---

### 5.7 getSkippedWords

获取用户已划掉的单词列表。

#### 请求参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `userId` | string | ✅ | - | 用户ID |
| `limit` | number | ❌ | 20 | 返回数量 |
| `offset` | number | ❌ | 0 | 分页偏移 |

#### 请求示例

```javascript
{
  action: 'getSkippedWords',
  data: {
    userId: 'u_xxx',
    limit: 20,
    offset: 0
  }
}
```

#### 响应示例

```json
{
  "success": true,
  "data": {
    "words": [
      {
        "vocabularyId": "BEGINNER_B_100",
        "thaiWord": "สวัสดี",
        "meaning": "你好",
        "pronunciation": "sà-wàt-dee",
        "audioPath": "100.mp3",
        "partOfSpeech": "感叹词",
        "level": "BEGINNER_B",
        "lessonNumber": "1.1",
        "skippedAt": "2025-11-27T15:00:00Z",
        "previousMastery": "模糊",
        "previousReviewCount": 2
      }
    ],
    "pagination": {
      "total": 5,
      "limit": 20,
      "offset": 0,
      "hasMore": false
    }
  },
  "message": "获取已划掉单词成功",
  "errorCode": null,
  "timestamp": "2025-11-28T10:30:00Z"
}
```

---

## 6. SM-2 算法说明

### 6.1 算法优化

基于艾宾浩斯遗忘曲线，对标准SM-2进行了优化:

| 复习次数 | SM-2 原版 | 优化版 | 改进 |
|----------|----------|--------|------|
| 第1次 | 1天 | 1天 | - |
| 第2次 | **6天** | **2天** | ↓4天 |
| 第3次 | 15天 | **4天** | ↓11天 |
| 第4次 | 38天 | **7天** | ↓31天 |
| 第5次 | 95天 | **14天** | ↓81天 |
| 第6次+ | EF计算 | EF计算 | 指数增长 |

### 6.2 掌握程度处理

| 选择 | Quality | 算法效果 |
|------|---------|----------|
| **陌生** | 1-2 | 重置间隔为1天，EF-0.2，**重置复习次数** |
| **模糊** | 3 | 间隔×0.8（缩短20%），EF-0.1 |
| **记得** | 4-5 | 使用间隔序列或EF计算，EF+0.1 |

### 6.3 参数说明

| 参数 | 值 | 说明 |
|------|-----|------|
| 初始EF | 2.5 | 新词的简易度因子 |
| 最小EF | 1.3 | 防止间隔增长过慢 |
| 最大间隔 | 180天 | 防止间隔过长 |
| 模糊乘数 | 0.8 | 选"模糊"时间隔缩短比例 |

---

## 7. 前端集成示例

### 7.1 TypeScript 类型定义

```typescript
// src/entities/types/vocabulary.types.ts

export enum MasteryLevel {
  UNFAMILIAR = '陌生',
  FUZZY = '模糊',
  REMEMBERED = '记得',
}

export interface VocabularyListItem {
  vocabularyId: string;
  thaiWord: string;
  meaning: string;
  pronunciation: string;
  audioPath: string;
  partOfSpeech: string;
  level: string;
  lessonNumber: string;
}

export interface LearningStatus {
  mastery: MasteryLevel | null;
  reviewCount: number;
  lastReviewed: string | null;
  nextReviewDate: string | null;
  intervalDays: number;
  isReview: boolean;
  isNew: boolean;
}
```

### 7.2 服务层封装

```typescript
// src/services/VocabularyService.ts

import cloud from '@/utils/cloudbase';
import type { ApiResponse } from '@/entities/types/api.types';

export class VocabularyService {
  private static async callFunction<T>(
    action: string,
    data: object
  ): Promise<ApiResponse<T>> {
    const result = await cloud.callFunction({
      name: 'vocabulary',
      data: { action, data },
    });
    return result.result as ApiResponse<T>;
  }

  static async getTodayWords(userId: string, options = {}) {
    return this.callFunction('getTodayWords', { userId, ...options });
  }

  static async updateMastery(
    userId: string,
    vocabularyId: string,
    mastery: MasteryLevel
  ) {
    return this.callFunction('updateMastery', {
      userId,
      vocabularyId,
      mastery,
    });
  }

  static async skipWord(userId: string, vocabularyId: string) {
    return this.callFunction('toggleSkipWord', {
      userId,
      vocabularyId,
      skipped: true,
    });
  }

  static async getStatistics(userId: string) {
    return this.callFunction('getReviewStatistics', { userId });
  }
}
```

### 7.3 React 组件示例

```tsx
// src/components/vocabulary/WordCard.tsx

import { useState } from 'react';
import { VocabularyService, MasteryLevel } from '@/services/VocabularyService';

export function WordCard({ word, userId, onComplete }) {
  const [loading, setLoading] = useState(false);

  const handleMastery = async (mastery: MasteryLevel) => {
    setLoading(true);
    try {
      const result = await VocabularyService.updateMastery(
        userId,
        word.vocabularyId,
        mastery
      );
      
      if (result.success) {
        console.log(`下次复习: ${result.data.nextReviewDate}`);
        onComplete();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="word-card">
      <h2>{word.thaiWord}</h2>
      <p>{word.meaning}</p>
      
      <div className="mastery-buttons">
        <button 
          onClick={() => handleMastery(MasteryLevel.UNFAMILIAR)}
          disabled={loading}
        >
          陌生
        </button>
        <button 
          onClick={() => handleMastery(MasteryLevel.FUZZY)}
          disabled={loading}
        >
          模糊
        </button>
        <button 
          onClick={() => handleMastery(MasteryLevel.REMEMBERED)}
          disabled={loading}
        >
          记得
        </button>
      </div>
    </div>
  );
}
```

---

## 附录

### A. 数据库索引

为 `user_vocabulary_progress` 集合创建以下索引:

| 索引名 | 字段 | 类型 |
|--------|------|------|
| `idx_user_vocab_unique` | `userId + vocabularyId` | 唯一 |
| `idx_user_review_date` | `userId + nextReviewDate` | 普通 |
| `idx_user_skipped` | `userId + skipped` | 普通 |

### B. 部署命令

```bash
cd cloudbase/functions/vocabulary
npm install
tcb fn deploy vocabulary
```

---

*文档版本: 1.2.0*
*最后更新: 2025-11-28*
