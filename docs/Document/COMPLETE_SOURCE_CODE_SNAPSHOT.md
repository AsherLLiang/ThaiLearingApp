# Thai Learning App — 云函数真实源码快照

======================
【Part 1】alphabet - index.js
```javascript
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.SYMBOL_CURRENT_ENV });
const db = cloud.database();


// ✅ 处理函数
const { createResponse } = require('@thai-app/shared').response;
const getLetterTest = require('./handlers/getLetterTest');
const submitLetterTest = require('./handlers/submitLetterTest');
const passLetterTest = require('./handlers/passLetterTest');

exports.main = async (event, context) => {

    // ===== 解析 HTTP 请求 =====
    let requestData = event;

    // HTTP 触发器：body 可能是字符串或对象
    if (event.body) {
        if (typeof event.body === 'string') {
            try {
                requestData = JSON.parse(event.body);
            } catch (e) {
                console.error('[alphabet] JSON 解析失败:', e.message);
                return createResponse(false, null, 'Invalid JSON in request body', 'INVALID_JSON');
            }
        } else if (typeof event.body === 'object') {
            requestData = event.body;
        }
    }

    const { action, userId, answers } = requestData;

    try {
        switch (action) {

            // ✅ 1️⃣ 获取字母测试题（固定题）
            case 'getLetterTest':
                return await getLetterTest(db);

            // ✅ 2️⃣ 提交字母测试并判定
            case 'submitLetterTest':
                return await submitLetterTest(db, userId, answers);

            // ✅ 3️⃣ 直接通过字母测试（调试/特殊逻辑用）
            case 'passLetterTest':
                return await passLetterTest(db, userId);

            default:
                return createResponse(false, null, '未知 action', 'INVALID_ACTION');
        }
    } catch (err) {
        console.error('learn-alphabet error:', err);
        return createResponse(false, null, err.message || '服务器错误', 'SERVER_ERROR');
    }
};
```

======================
【Part 1.2】alphabet - handlers/getLetterTest.js
```javascript
// ✅ 获取固定字母测试题
const { createResponse } = require('@thai-app/shared').response;

async function getLetterTest(db) {
    const res = await db.collection('letter_test_bank')
        .limit(20) // 你说是固定题，不需要随机
        .get();

    return createResponse(true, {
        total: res.data.length,
        questions: res.data
    }, '获取字母测试题成功');
}

module.exports = getLetterTest;
```

======================
【Part 1.2】alphabet - handlers/submitLetterTest.js
```javascript
// ✅ 提交字母测试并判定是否通过
const { createResponse } = require('@thai-app/shared').response;
const passLetterTest = require('./passLetterTest');

async function submitLetterTest(db, userId, answers) {

    if (!userId || !Array.isArray(answers)) {
        return createResponse(false, null, '参数错误', 'INVALID_PARAMS');
    }

    // ✅ 取出标准答案（按 _id 对应）
    const ids = answers.map(a => a._id);

    const res = await db.collection('letter_test_bank')
        .where({
            _id: db.command.in(ids)
        })
        .get();

    const answerMap = {};
    res.data.forEach(q => {
        answerMap[q._id] = q.initialSound;
    });

    // ✅ 判分
    let correct = 0;
    const total = answers.length;

    answers.forEach(item => {
        if (answerMap[item._id] === item.answer) {
            correct++;
        }
    });

    const score = correct / total;

    // ✅ ✅ ✅ 通过条件：80%
    if (score >= 0.8) {
        const passResult = await passLetterTest(db, userId);

        return createResponse(true, {
            passed: true,
            score,
            correct,
            total
        }, '字母测试通过，已解锁');
    }

    // ❌ 未通过
    return createResponse(false, {
        passed: false,
        score,
        correct,
        total
    }, '测试未通过，请继续学习', 'LETTER_TEST_FAILED');
}

module.exports = submitLetterTest;
```

======================
【Part 1.2】alphabet - handlers/passLetterTest.js
```javascript
// ✅ 记录字母测试通过状态
async function passLetterTest(db, userId) {
    const now = new Date().toISOString();

    // 更新用户进度
    await db.collection('user_progress')
        .where({ userId })
        .update({
            data: {
                letterCompleted: true,
                letterProgress: 1,
                updatedAt: now
            }
        });

    // 如果记录不存在，可能需要创建（取决于业务逻辑，这里假设用户记录已存在）
    // 也可以使用 set() 或 upsert 逻辑，但 update 更安全，避免覆盖其他字段

    return {
        success: true,
        message: '已通过字母测试，字母模块已跳过，所有模块已解锁'
    };
}

module.exports = passLetterTest;
```

======================
【Part 2】memory-engine - index.js
```javascript
/**
 * memory-engine 云函数
 * 统一记忆引擎服务
 * 版本: 1.0.0
 * 
 * 触发方式: HTTP 触发器
 */

const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.SYMBOL_CURRENT_ENV });
const db = cloud.database();

// ===== Handlers =====
const getTodayMemories = require('./handlers/getTodayMemories');
const submitMemoryResult = require('./handlers/submitMemoryResult');
const checkModuleAccessHandler = require('./handlers/checkModuleAccess');
const getUserProgress = require('./handlers/getUserProgress');

// ===== Utils =====
const { createResponse } = require('@thai-app/shared').response;

/**
 * 云函数主入口
 */
exports.main = async (event, context) => {
    // ===== 解析 HTTP 请求 =====
    let requestData = event;

    // HTTP 触发器：body 可能是字符串或对象
    if (event.body) {
        if (typeof event.body === 'string') {
            try {
                requestData = JSON.parse(event.body);
            } catch (e) {
                console.error('[memory-engine] JSON 解析失败:', e.message);
                return createResponse(false, null, 'Invalid JSON in request body', 'INVALID_JSON');
            }
        } else if (typeof event.body === 'object') {
            requestData = event.body;
        }
    }

    const { action, data = {} } = requestData;

    console.log(`[memory-engine] Action: ${action}`, JSON.stringify(data));

    // 验证 action 参数
    if (!action) {
        return createResponse(
            false,
            null,
            '缺少必填参数: action',
            'MISSING_ACTION'
        );
    }

    try {
        /**
         * 获取今日学习内容 (统一接口)
         */
        if (action === 'getTodayMemories') {
            return await getTodayMemories(db, data);
        }

        /**
         * 提交学习结果 (统一接口)
         */
        if (action === 'submitMemoryResult') {
            return await submitMemoryResult(db, data);
        }

        /**
         * 检查模块访问权限
         */
        if (action === 'checkModuleAccess') {
            return await checkModuleAccessHandler(db, data);
        }

        /**
         * 获取用户学习进度
         */
        if (action === 'getUserProgress') {
            return await getUserProgress(db, data);
        }

        // ===== 未知Action =====
        const supportedActions = [
            'getTodayMemories',
            'submitMemoryResult',
            'checkModuleAccess',
            'getUserProgress'
        ];

        return createResponse(
            false,
            { supportedActions },
            `未知的操作类型: ${action}`,
            'UNKNOWN_ACTION'
        );

    } catch (error) {
        console.error(`[memory-engine] 云函数错误:`, error);
        console.error('错误堆栈:', error.stack);

        return createResponse(
            false,
            null,
            error.message || '服务器内部错误',
            'SERVER_ERROR'
        );
    }
};
```

======================
【Part 2.2】memory-engine - handlers/getTodayMemories.js
```javascript
/**
 * 统一获取今日学习内容 (字母/单词/句子)
 * Action: getTodayMemories
 */
'use strict';

// 假设 memoryEngine 内部没有严重的全局副作用，如果有问题，可能需要检查 memoryEngine
const { getTodayReviewEntities, getOrCreateMemory, checkModuleAccess } = require('@thai-app/shared').memoryEngine;
const { createResponse } = require('@thai-app/shared').response;

/**
 * @param {Object} db - 数据库实例
 * @param {Object} params - 请求参数
 */
async function getTodayMemories(db, params) {
  const { userId, entityType, limit = 20, includeNew = true } = params;

  if (!userId || !entityType) {
    return createResponse(false, null, 'Missing userId or entityType', 'INVALID_PARAMS');
  }

  try {
    // 1. 检查模块访问权限
    // 使用 memoryEngine 中的统一权限检查
    const accessCheck = await checkModuleAccess(db, userId, entityType);
    if (!accessCheck.allowed) {
      return createResponse(false, null, accessCheck.message, accessCheck.errorCode);
    }

    // 1.5 获取/更新用户每日学习量设置
    // "设置的今日学习的字母数量应该传入userProgress 中被getTodayMemory获取"
    let effectiveLimit = limit;
    const userProgress = accessCheck.progress; // checkModuleAccess returns progress

    if (userProgress) {
      // 如果请求中明确传入了 limit (且不是默认值/空)，则更新到 user_progress
      // 注意：这里假设前端传来的 limit 是用户意图的设置
      if (params.limit && params.limit !== userProgress.dailyLimit) {
        await db.collection('user_progress').where({ userId }).update({
          data: {
            dailyLimit: params.limit,
            updatedAt: new Date().toISOString()
          }
        });
        effectiveLimit = params.limit;
      } else if (!params.limit && userProgress.dailyLimit) {
        // 如果请求没传 limit，但数据库有存，则使用存储的值
        effectiveLimit = userProgress.dailyLimit;
      }
    }

    // 3. 获取今日复习实体
    const reviewMemories = await getTodayReviewEntities(db, userId, entityType, effectiveLimit);

    // 4. 获取新学习内容
    let newMemories = [];
    if (includeNew && reviewMemories.length < effectiveLimit) {
      const remainingSlots = effectiveLimit - reviewMemories.length;

      const collectionMap = {
        letter: 'letters',
        word: 'vocabulary',
        sentence: 'sentences'
      };

      const collectionName = collectionMap[entityType];
      if (!collectionName) {
        return createResponse(false, null, `不支持的实体类型: ${entityType}`, 'INVALID_ENTITY_TYPE');
      }

      // 优化：使用 nin 过滤已存在的实体，并按课程顺序排序
      const query = db.collection(collectionName);
      let queryRef = query;

      // 获取已存在的实体ID (包括复习队列中的)
      const existingEntityIds = reviewMemories.map(m => m.entityId);

      if (existingEntityIds.length > 0) {
        queryRef = queryRef.where({
          _id: db.command.nin(existingEntityIds)
        });
      }

      // 按课程顺序和ID排序 (确保符合课程表顺序)
      // "按固定的方式顺序获取字母，保证用户按难度学习字母"
      const newEntitiesResult = await queryRef
        .orderBy('lessonNumber', 'asc')
        .orderBy('_id', 'asc')
        .limit(remainingSlots)
        .get();

      const newEntities = newEntitiesResult.data;

      for (const entity of newEntities) {
        const memory = await getOrCreateMemory(
          db,
          userId,
          entityType,
          entity._id,
          false
        );
        newMemories.push(memory);
      }
    }

    // 5. 合并 & 穿插 (Interleave)
    // "单词和字母学习开始前，优先复习之前学的内容" -> 优先放入复习内容
    // "这部分内容复习完后才进入三新1复习的穿插学习" -> 复习完老内容后，新内容按 3新:1复习(新) 穿插
    let allMemories = [...reviewMemories];

    // 处理新内容 (3新 : 1复习)
    // 这里 "1复习" 指的是对刚刚学习的新内容的巩固复习 (Intra-session repetition)
    // 例如: N1, N2, N3, N1(复习), N4, N5, N6, N4(复习)...
    if (newMemories.length > 0) {
      for (let i = 0; i < newMemories.length; i++) {
        allMemories.push(newMemories[i]);

        // 每3个新词，插入一个复习 (复习这组的第一个)
        if ((i + 1) % 3 === 0) {
          // 插入 i-2 (即这组的第一个) 作为复习
          // 注意：这里直接push同一个对象，前端会再次渲染它
          allMemories.push(newMemories[i - 2]);
        }
      }
    }

    if (allMemories.length === 0) {
      return createResponse(true, { items: [], summary: { total: 0 } }, '今日无学习内容');
    }

    // 6. 获取详情
    const entityIds = allMemories.map(m => m.entityId);
    const collectionMap = {
      letter: 'letters',
      word: 'vocabulary',
      sentence: 'sentences'
    };

    const entitiesResult = await db.collection(collectionMap[entityType])
      .where({
        _id: db.command.in(entityIds)
      })
      .get();

    const entitiesMap = new Map(entitiesResult.data.map(e => [e._id, e]));

    // 7. 组装
    const data = allMemories.map(memory => {
      const entity = entitiesMap.get(memory.entityId);
      if (!entity) return null;

      return {
        ...entity,
        memoryState: {
          masteryLevel: memory.masteryLevel,
          reviewStage: memory.reviewStage,
          correctCount: memory.correctCount,
          wrongCount: memory.wrongCount,
          streakCorrect: memory.streakCorrect,
          nextReviewAt: memory.nextReviewAt,
          isNew: memory.reviewStage === 0
        }
      };
    }).filter(Boolean);

    const summary = {
      total: data.length,
      reviewCount: reviewMemories.length,
      newCount: newMemories.length,
      entityType
    };

    return createResponse(true, {
      items: data,
      summary
    }, '获取今日学习内容成功');

  } catch (error) {
    console.error('getTodayMemories error:', error);
    return createResponse(false, null, error.message, 'SERVER_ERROR');
  }
}

module.exports = getTodayMemories;
```

======================
【Part 2.2】memory-engine - handlers/submitMemoryResult.js
```javascript
/**
 * 统一提交学习结果 (字母/单词/句子)
 * Action: submitMemoryResult
 */

const { updateMemoryAfterReview } = require('@thai-app/shared').memoryEngine;
const { validateParams } = require('@thai-app/shared').validators;
const { createResponse } = require('@thai-app/shared').response;

/**
 * @param {Object} db - 数据库实例
 * @param {Object} params - 请求参数
 * @param {string} params.userId - 用户ID
 * @param {string} params.entityType - 实体类型: 'letter' | 'word' | 'sentence'
 * @param {string} params.entityId - 实体ID
 * @param {string} params.quality - 答题质量: '陌生' | '模糊' | '记得'
 */
async function submitMemoryResult(db, params) {

  // 1. 参数验证
  const validation = validateParams(params, ['userId', 'entityType', 'entityId', 'quality']);
  if (!validation.isValid) {
    return createResponse(false, null, validation.message, 'INVALID_PARAMS');
  }

  const { userId, entityType, entityId, quality } = params;

  // 2. 验证quality值
  const validQualities = ['陌生', '模糊', '记得'];
  if (!validQualities.includes(quality)) {
    return createResponse(
      false,
      null,
      `无效的答题质量: ${quality}, 请使用: 陌生/模糊/记得`,
      'INVALID_QUALITY'
    );
  }

  // 3. 验证entityType
  const validEntityTypes = ['letter', 'word', 'sentence'];
  if (!validEntityTypes.includes(entityType)) {
    return createResponse(
      false,
      null,
      `无效的实体类型: ${entityType}`,
      'INVALID_ENTITY_TYPE'
    );
  }

  try {
    // 4. 更新记忆状态
    const updatedMemory = await updateMemoryAfterReview(
      db,
      userId,
      entityType,
      entityId,
      quality
    );

    // 5. 检查是否需要解锁下一阶段
    // const unlockResult = await checkAndUnlockNextStage(db, userId);

    // 6. 返回结果
    return createResponse(true, {
      ...updatedMemory,
      // unlockInfo: unlockResult
    }, '学习结果已记录');

  } catch (error) {
    console.error('submitMemoryResult 错误:', error);
    return createResponse(false, null, error.message || '服务器错误', 'SERVER_ERROR');
  }
}

module.exports = submitMemoryResult;
```

======================
【Part 2.2】memory-engine - handlers/checkModuleAccess.js
```javascript
/**
 * 检查模块访问权限
 * Action: checkModuleAccess
 */

const { checkModuleAccess } = require('@thai-app/shared').memoryEngine;
const { validateParams } = require('@thai-app/shared').validators;
const { createResponse } = require('@thai-app/shared').response;

async function checkModuleAccessHandler(db, params) {

  // ✅ ✅ ✅ 正确的开发模式强制放行写法
  console.log('🔥 当前 NODE_ENV =', process.env.NODE_ENV);
  const env = process.env.NODE_ENV || 'development';

  if (env !== 'production') {
    return createResponse(true, {
      allowed: true,
      moduleType: params?.moduleType || 'unknown',
      progress: 100
    }, '【开发模式】模块已强制放行');
  }

  // ================== 以下为正式生产逻辑 ==================

  // 1️⃣ 参数验证
  const validation = validateParams(params, ['userId', 'moduleType']);
  if (!validation.isValid) {
    return createResponse(false, null, validation.message, 'INVALID_PARAMS');
  }

  const { userId, moduleType } = params;

  // 2️⃣ 验证 moduleType 合法性
  const validModules = ['letter', 'word', 'sentence', 'article'];
  if (!validModules.includes(moduleType)) {
    return createResponse(
      false,
      null,
      `无效的模块类型: ${moduleType}`,
      'INVALID_MODULE_TYPE'
    );
  }

  try {
    // 3️⃣ 正式校验模块权限
    const accessResult = await checkModuleAccess(db, userId, moduleType);

    if (!accessResult.allowed) {
      return createResponse(false, accessResult, accessResult.message, accessResult.errorCode);
    }

    // 4️⃣ 允许访问
    return createResponse(true, {
      allowed: true,
      moduleType,
      progress: accessResult.progress
    }, '模块已解锁,可以访问');

  } catch (error) {
    console.error('checkModuleAccess 错误:', error);
    return createResponse(false, null, error.message || '服务器错误', 'SERVER_ERROR');
  }
}

module.exports = checkModuleAccessHandler;
```

======================
【Part 2.2】memory-engine - handlers/getUserProgress.js
```javascript
/**
 * 获取用户学习进度
 * Action: getUserProgress
 */
'use strict';

const { createResponse } = require('@thai-app/shared').response;

/**
 * @param {Object} db - 数据库实例
 * @param {Object} params - 请求参数
 */
async function getUserProgress(db, params) {
  const { userId } = params;

  if (!userId) {
    return createResponse(false, null, 'Missing userId', 'INVALID_PARAMS');
  }

  try {
    // 2. 获取用户进度记录
    // ❌ 修正: 不要用 getOne(), 用 limit(1).get()
    const progressResult = await db.collection('user_progress')
      .where({ userId })
      .limit(1)
      .get();

    if (!progressResult.data || progressResult.data.length === 0) {
      return createResponse(false, null, '用户进度记录不存在', 'USER_PROGRESS_NOT_FOUND');
    }

    const progress = progressResult.data[0];

    // 3. 统计各模块学习数据
    // 注意: 如果数据量很大，count() 比 get() 更高效
    const letterCountResult = await db.collection('memory_status')
      .where({ userId, entityType: 'letter' })
      .count();

    const letterMasteredResult = await db.collection('memory_status')
      .where({ userId, entityType: 'letter', masteryLevel: db.command.gte(0.7) })
      .count();

    const wordCountResult = await db.collection('memory_status')
      .where({ userId, entityType: 'word' })
      .count();

    const wordMasteredResult = await db.collection('memory_status')
      .where({ userId, entityType: 'word', masteryLevel: db.command.gte(0.7) })
      .count();

    // 4. 组装
    const result = {
      ...progress,
      statistics: {
        letter: {
          total: 44,
          learned: letterCountResult.total,
          mastered: letterMasteredResult.total,
          progress: letterCountResult.total > 0 ? (letterMasteredResult.total / 44).toFixed(2) : 0
        },
        word: {
          total: 3500,
          learned: wordCountResult.total,
          mastered: wordMasteredResult.total,
          progress: wordCountResult.total > 0 ? (wordMasteredResult.total / 3500).toFixed(2) : 0
        }
      },
      unlockStatus: {
        letter: true,
        word: progress.wordUnlocked,
        sentence: progress.sentenceUnlocked,
        article: progress.articleUnlocked
      }
    };

    return createResponse(true, result, '获取用户进度成功');

  } catch (error) {
    console.error('getUserProgress error:', error);
    return createResponse(false, null, error.message, 'SERVER_ERROR');
  }
}

module.exports = getUserProgress;
```

======================
【Part 3】shared - package.json
```json
{
  "name": "@thai-app/shared",
  "version": "1.0.0",
  "description": "Shared utilities for CloudBase cloud functions",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [
    "cloudbase",
    "shared",
    "utilities"
  ],
  "author": "Liang JianYu",
  "license": "MIT",
  "dependencies": {
    "wx-server-sdk": "~2.6.3"
  },
  "engines": {
    "node": ">=16.0.0"
  }
}
```

======================
【Part 3.1】shared - index.js
```javascript
/**
 * Shared Utilities Package Entry Point
 * 
 * 统一导出所有共享模块
 * 使用方式: const { response, constants, sm2 } = require('@thai-app/shared');
 */

'use strict';

module.exports = {
    // 响应格式化模块
    response: require('./response'),

    // 常量定义模块
    constants: require('./constants'),

    // SM-2 算法模块
    sm2: require('./sm2'),

    // 参数验证模块
    validators: require('./validators'),

    // 统一记忆引擎模块
    memoryEngine: require('./memoryEngine'),

    // 数据库连接模块
    database: require('./database')
};
```

======================
【Part 3.2】shared - memoryEngine.js
```javascript
/**
 * 统一记忆引擎核心模块
 * 支持字母/单词/句子的统一记忆管理
 * 
 * 修复：wx-server-sdk 不支持 getOne()，改用 get() + data[0]
 */

const { calculateSM2Optimized } = require('./sm2');

/**
 * 创建新的记忆记录
 */
async function createMemoryRecord(db, userId, entityType, entityId, isLocked = false) {

    // 验证参数
    if (!userId || !entityType || !entityId) {
        console.error('[createMemoryRecord] 参数缺失:', { userId, entityType, entityId });
        throw new Error('userId, entityType, entityId 都是必需参数');
    }

    const now = new Date();
    const nextReviewAt = isLocked ? null : new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();

    const memoryRecord = {
        userId,
        entityType,
        entityId,
        masteryLevel: 0.0,
        reviewStage: 0,
        easinessFactor: 2.5,
        intervalDays: 1,
        lastReviewAt: null,
        nextReviewAt,
        correctCount: 0,
        wrongCount: 0,
        streakCorrect: 0,
        isLocked,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
    };

    try {
        // 尝试插入
        const result = await db.collection('memory_status').add(memoryRecord);

        console.log('[createMemoryRecord] 创建成功:', { userId, entityType, entityId });

        return {
            _id: result._id,
            ...memoryRecord
        };
    } catch (error) {
        // 如果是重复键错误，查询并返回现有记录
        if (error.errCode === -502001 || error.message.includes('duplicate key')) {
            console.log('[createMemoryRecord] 记录已存在，查询返回:', { userId, entityType, entityId });

            const existingResult = await db.collection('memory_status')
                .where({ userId, entityType, entityId })
                .get();

            if (existingResult.data && existingResult.data.length > 0) {
                return existingResult.data[0];
            }
        }

        // 其他错误继续抛出
        console.error('[createMemoryRecord] 创建失败:', error);
        throw error;
    }
}

/**
 * 获取或创建记忆记录
 * 修复：使用 get() 代替 getOne()
 */
async function getOrCreateMemory(db, userId, entityType, entityId, isLocked = false) {
    // 1. 尝试查询现有记录
    const existingMemory = await db.collection('memory_status')
        .where({
            userId,
            entityType,
            entityId
        })
        .get();

    // 2. 如果存在,直接返回第一条
    if (existingMemory.data && existingMemory.data.length > 0) {
        return existingMemory.data[0];
    }

    // 3. 不存在则创建新记录
    return await createMemoryRecord(db, userId, entityType, entityId, isLocked);
}

/**
 * 更新记忆状态(答题后调用)
 */
async function updateMemoryAfterReview(db, userId, entityType, entityId, quality) {
    console.log('【测试】updateMemoryAfterReview 被调用了！', { userId, quality });
    console.log('=== [updateMemoryAfterReview] 开始 ===');
    console.log('参数:', JSON.stringify({ userId, entityType, entityId, quality }));

    try {
        // 1. 获取当前记忆记录
        console.log('步骤1: 获取记忆记录');
        const memory = await getOrCreateMemory(db, userId, entityType, entityId);
        console.log('记忆记录:', JSON.stringify(memory));

        // 2. 映射质量到SM-2评分
        console.log('步骤2: 映射质量');
        const qualityMap = {
            '陌生': 1,
            '模糊': 3,
            '记得': 5
        };
        const sm2Quality = qualityMap[quality] || 3;
        console.log('SM-2质量:', sm2Quality);

        // 3. 计算新的SM-2参数
        console.log('步骤3: 调用 calculateSM2Optimized');
        console.log('调用参数:', {
            quality,
            intervalDays: memory.intervalDays,
            easinessFactor: memory.easinessFactor,
            reviewStage: memory.reviewStage
        });

        const sm2Result = calculateSM2Optimized(
            quality,
            memory.intervalDays,
            memory.easinessFactor,
            memory.reviewStage
        );

        console.log('SM-2结果:', JSON.stringify(sm2Result));

        // 4. 更新掌握度
        console.log('步骤4: 计算新掌握度');
        let newMasteryLevel = memory.masteryLevel;
        if (quality === '记得') {
            newMasteryLevel = Math.min(1.0, memory.masteryLevel + 0.15);
        } else if (quality === '模糊') {
            newMasteryLevel = Math.max(0.0, memory.masteryLevel + 0.05);
        } else {
            newMasteryLevel = Math.max(0.0, memory.masteryLevel - 0.2);
        }
        console.log('新掌握度:', newMasteryLevel);

        // 5. 更新连胜和计数
        console.log('步骤5: 计算连胜');
        const newStreakCorrect = quality === '记得' ? memory.streakCorrect + 1 : 0;
        const newCorrectCount = quality === '记得' ? memory.correctCount + 1 : memory.correctCount;
        const newWrongCount = quality === '陌生' ? memory.wrongCount + 1 : memory.wrongCount;

        // 6. 计算下次复习时间
        console.log('步骤6: 计算下次复习时间');
        const now = new Date();
        const nextReviewAt = new Date(now.getTime() + sm2Result.interval * 24 * 60 * 60 * 1000);
        console.log('下次复习时间:', nextReviewAt);

        // 7. 准备更新数据
        console.log('步骤7: 准备更新数据库');
        const updateData = {
            masteryLevel: newMasteryLevel,
            reviewStage: sm2Result.repetitions,
            easinessFactor: sm2Result.easinessFactor,
            intervalDays: sm2Result.interval,
            lastReviewAt: now.toISOString(),
            nextReviewAt: nextReviewAt.toISOString(),
            correctCount: newCorrectCount,
            wrongCount: newWrongCount,
            streakCorrect: newStreakCorrect,
            updatedAt: now.toISOString()
        };

        console.log('更新数据对象:', JSON.stringify(updateData));

        // 检查是否有 undefined
        for (const [key, value] of Object.entries(updateData)) {
            if (value === undefined) {
                console.error(`❌ 发现 undefined 值: ${key}`);
            }
        }

        // 8. 执行更新
        console.log('步骤8: 执行数据库更新');
        await db.collection('memory_status')
            .where({
                userId,
                entityType,
                entityId
            })
            .update({
                data: updateData   // ✅ CloudBase 必须这样写
            });

        console.log('✅ 更新成功');

        return {
            entityId,
            entityType,
            masteryLevel: newMasteryLevel,
            reviewStage: sm2Result.repetitions,
            easinessFactor: sm2Result.easinessFactor,
            intervalDays: sm2Result.interval,
            nextReviewAt: nextReviewAt.toISOString(),
            correctCount: newCorrectCount,
            wrongCount: newWrongCount,
            streakCorrect: newStreakCorrect
        };

    } catch (error) {
        console.error('❌ [updateMemoryAfterReview] 错误:', error);
        console.error('错误堆栈:', error.stack);
        throw error;
    }
}

/**
 * 获取今日待复习的实体
 */
async function getTodayReviewEntities(db, userId, entityType, limit = 20) {
    const now = new Date();

    const result = await db.collection('memory_status')
        .where({
            userId,
            entityType,
            isLocked: false,
            nextReviewAt: db.command.lte(now)
        })
        .orderBy('nextReviewAt', 'asc')
        .limit(limit)
        .get();

    return result.data || [];
}

/**
 * 初始化用户的学习进度记录
 */
async function initUserProgress(db, userId) {
    const now = new Date();

    const progressRecord = {
        userId,
        letterCompleted: false,
        letterProgress: 0.0,
        wordUnlocked: false,
        wordProgress: 0.0,
        sentenceUnlocked: false,
        sentenceProgress: 0.0,
        articleUnlocked: false,
        currentStage: 'letter',
        totalStudyDays: 0,
        streakDays: 0,
        lastStudyDate: null,
        createdAt: now,
        updatedAt: now
    };

    await db.collection('user_progress').add(progressRecord);
    return progressRecord;
}

/**
 * 检查模块访问权限
 * 修复：使用 get() + data[0]
 */
async function checkModuleAccess(db, userId, moduleType) {

    // ✅✅✅【调试总开关：跳过所有学习锁】
    if (process.env.FORCE_UNLOCK === 'true') {
        console.warn('⚠️ FORCE_UNLOCK 已开启, 强制放行模块:', moduleType);
        return {
            allowed: true,
            progress: {
                letterCompleted: true,
                letterProgress: 1,
                wordUnlocked: true,
                sentenceUnlocked: true,
                articleUnlocked: true,
                currentStage: moduleType
            }
        };
    }

    const progressResult = await db.collection('user_progress')
        .where({ userId })
        .get();

    if (!progressResult.data || progressResult.data.length === 0) {
        return {
            allowed: false,
            errorCode: 'USER_PROGRESS_NOT_FOUND',
            message: '用户学习进度不存在,请联系管理员'
        };
    }

    const progress = progressResult.data[0];

    // ✅ 字母模块永远允许访问
    if (moduleType === 'letter') {
        return {
            allowed: true,
            progress
        };
    }

    // ✅ 其他所有模块只依赖 letterCompleted
    if (!progress.letterCompleted) {
        return {
            allowed: false,
            errorCode: 'MODULE_LOCKED',
            message: `请先完成字母学习（当前进度：${Math.round(progress.letterProgress * 100)}%）`,
            progress
        };
    }

    // ✅ 字母完成 → 全部模块放行
    return {
        allowed: true,
        progress
    };
}

module.exports = {
    createMemoryRecord,
    getOrCreateMemory,
    updateMemoryAfterReview,
    getTodayReviewEntities,
    // checkAndUnlockNextStage,
    initUserProgress,
    checkModuleAccess
};
```

======================
【Part 3.2】shared - sm2.js
```javascript
/**
 * SM-2 间隔重复算法模块（优化版）
 * 
 * 基于艾宾浩斯遗忘曲线优化:
 * - 早期复习间隔更密集: 1→2→4→7→14 天
 * - "模糊"状态缩短间隔而非维持不变
 * - "陌生"状态重置复习进度
 * 
 * 算法论文: https://www.supermemo.com/en/archives1990-2015/english/ol/sm2
 */

'use strict';

const { MasteryLevel, SM2_PARAMS, EARLY_INTERVALS } = require('./constants');

/**
 * 将掌握程度映射到 SM-2 Quality 值
 * 
 * SM-2 Quality 定义:
 * 0 - 完全不记得
 * 1 - 错误回答，但看到正确答案后想起
 * 2 - 错误回答，正确答案看起来很熟悉
 * 3 - 正确回答，但困难较大
 * 4 - 正确回答，有些犹豫
 * 5 - 正确回答，毫无困难
 * 
 * @param {string} mastery - 掌握程度
 * @returns {number} Quality值 (1-5)
 */
function masteryToQuality(mastery) {
    switch (mastery) {
        case MasteryLevel.UNFAMILIAR:
            return 1;  // 完全不记得
        case MasteryLevel.FUZZY:
            return 3;  // 有印象但不确定
        case MasteryLevel.REMEMBERED:
            return 5;  // 完全记得
        default:
            return 1;
    }
}

/**
 * 计算下次复习日期（优化版 SM-2 算法）
 * 
 * 改进点:
 * 1. 早期阶段（前5次）使用固定的渐进间隔 [1,2,4,7,14]
 * 2. "模糊"时缩短间隔而非维持不变
 * 3. "陌生"时完全重置复习进度
 * 
 * @param {string} mastery - 掌握程度: 忘记/模糊/认识
 * @param {number} currentInterval - 当前复习间隔（天）
 * @param {number} easinessFactor - 简易度因子（1.3-2.5+）
 * @param {number} reviewCount - 已复习次数
 * @returns {Object} 算法计算结果
 * 
 * @example
 * const result = calculateSM2Optimized('认识', 2, 2.5, 1);
 * // {
 * //   nextInterval: 4,
 * //   nextEasinessFactor: 2.6,
 * //   nextReviewDate: "2025-12-01T10:00:00Z",
 * //   shouldResetCount: false
 * // }
 * */
function calculateSM2Optimized(
    mastery,
    currentInterval = 1,
    easinessFactor = SM2_PARAMS.INITIAL_EASINESS_FACTOR,
    reviewCount = 0
) {
    let nextInterval = currentInterval;
    let nextEF = easinessFactor;
    let shouldResetCount = false;

    const quality = masteryToQuality(mastery);

    // ==================== 核心算法逻辑 ====================

    if (quality < 3) {
        // ========== 忘记: 完全重置 ==========
        // 用户完全不记得，需要从头开始学习
        nextInterval = 1;
        nextEF = Math.max(SM2_PARAMS.MIN_EASINESS_FACTOR, nextEF - 0.2);
        shouldResetCount = true;

    } else if (quality === 3) {
        // ========== 模糊: 缩短间隔，加强复习 ==========
        // 改进: 不是维持不变，而是缩短20%
        nextInterval = Math.max(1, Math.round(currentInterval * SM2_PARAMS.FUZZY_MULTIPLIER));
        nextEF = Math.max(SM2_PARAMS.MIN_EASINESS_FACTOR, nextEF - 0.1);

    } else {
        // ========== 记得: 使用优化的间隔序列 ==========
        if (reviewCount < EARLY_INTERVALS.length) {
            // 早期阶段: 使用预定义的渐进间隔
            // 这是关键改进: 1→2→4→7→14 而非原版的 1→6
            nextInterval = EARLY_INTERVALS[reviewCount];
        } else {
            // 后期阶段: 使用 EF 计算指数增长
            nextInterval = Math.round(currentInterval * nextEF);
        }

        // 提高简易度 (标准 SM-2 公式)
        nextEF = nextEF + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
        nextEF = Math.max(SM2_PARAMS.MIN_EASINESS_FACTOR, nextEF);
    }

    // 限制最大间隔
    nextInterval = Math.min(nextInterval, SM2_PARAMS.MAX_INTERVAL_DAYS);

    // 计算下次复习日期
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + nextInterval);

    // 计算新的复习次数
    const newRepetitions = shouldResetCount ? 0 : reviewCount + 1;

    return {
        // === 兼容 memoryEngine.js 的旧接口 ===
        interval: nextInterval,
        easinessFactor: parseFloat(nextEF.toFixed(2)),
        repetitions: newRepetitions,

        // === 新接口（保留供未来使用）===
        nextInterval,
        nextEasinessFactor: parseFloat(nextEF.toFixed(2)),
        nextReviewDate: nextReviewDate.toISOString(),
        shouldResetCount,
    };
}

/**
 * 生成预计复习时间线
 * 
 * 用于前端展示未来的复习计划
 * 
 * @param {number} currentReviewCount - 当前复习次数
 * @param {number} maxItems - 返回的时间线项数 (默认5)
 * @returns {Array} 未来复习计划
 * 
 * @example
 * generateReviewTimeline(2);
 * // [
 * //   { reviewNumber: 3, intervalDays: 4 },
 * //   { reviewNumber: 4, intervalDays: 7 },
 * //   { reviewNumber: 5, intervalDays: 14 },
 * //   ...
 * // ]
 * */
function generateReviewTimeline(currentReviewCount, maxItems = 5) {
    const timeline = [];
    let interval = 1;
    let ef = SM2_PARAMS.INITIAL_EASINESS_FACTOR;

    for (let i = currentReviewCount; i < currentReviewCount + maxItems; i++) {
        if (i < EARLY_INTERVALS.length) {
            interval = EARLY_INTERVALS[i];
        } else {
            interval = Math.round(interval * ef);
        }
        interval = Math.min(interval, SM2_PARAMS.MAX_INTERVAL_DAYS);

        timeline.push({
            reviewNumber: i + 1,
            intervalDays: interval,
        });
    }

    return timeline;
}

/**
 * 获取今天的时间范围 (UTC)
 * 
 * @returns {Object} { startOfDay, endOfDay, timestamp }
 */
function getTodayRange() {
    const now = new Date();
    const startOfDay = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        0, 0, 0, 0
    ));
    const endOfDay = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() + 1,
        0, 0, 0, 0
    ));

    return {
        startOfDay: startOfDay.toISOString(),
        endOfDay: endOfDay.toISOString(),
        timestamp: now.toISOString(),
    };
}

/**
 * 获取算法信息 (用于前端展示)
 * 
 * @returns {Object} 算法元信息
 */
function getAlgorithmInfo() {
    return {
        name: 'Optimized SM-2',
        version: '1.1.0',
        earlyIntervals: EARLY_INTERVALS,
        maxInterval: SM2_PARAMS.MAX_INTERVAL_DAYS,
        description: '基于艾宾浩斯遗忘曲线优化的间隔重复算法',
    };
}

module.exports = {
    calculateSM2Optimized,
    generateReviewTimeline,
    getTodayRange,
    getAlgorithmInfo,
    masteryToQuality,
};
```

======================
【Part 3.2】shared - database.js
```javascript
const cloud = require('wx-server-sdk');

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

const collections = {
    users: db.collection('users'),
    vocabulary: db.collection('vocabulary'),
    letters: db.collection('letters'),
    sentences: db.collection('sentences'),
    memory_status: db.collection('memory_status'),
    user_progress: db.collection('user_progress'),
    user_vocabulary_progress: db.collection('user_vocabulary_progress')
};

module.exports = {
    db,
    _,
    userCollection: collections.users,
    vocabularyCollection: collections.vocabulary,
    letterCollection: collections.letters,
    sentenceCollection: collections.sentences,
    memoryStatusCollection: collections.memory_status,
    userProgressCollection: collections.user_progress,
    progressCollection: collections.user_vocabulary_progress,
    collections
};
```

======================
【Part 3.2】shared - validators.js
```javascript
/**
 * 参数验证模块
 * 
 * 用户、词汇验证及通用验证工具
 */

'use strict';

const { userCollection, vocabularyCollection } = require('./database');
const { MasteryLevel } = require('./constants');

/**
 * 验证用户是否存在
 * 
 * @param {string} userId - 用户ID
 * @returns {Promise<Object|null>} 用户对象或 null
 */
async function validateUser(userId) {
    if (!userId || typeof userId !== 'string') {
        return null;
    }

    try {
        const { data } = await userCollection
            .where({ userId })
            .limit(1)
            .get();

        return data.length > 0 ? data[0] : null;
    } catch (error) {
        console.error('[validateUser] Error:', error);
        return null;
    }
}

/**
 * 验证词汇是否存在
 * 
 * @param {string} vocabularyId - 词汇ID
 * @returns {Promise<Object|null>} 词汇对象或 null
 */
async function validateVocabulary(vocabularyId) {
    if (!vocabularyId || typeof vocabularyId !== 'string') {
        return null;
    }

    try {
        const { data } = await vocabularyCollection
            .where({ vocabularyId })
            .limit(1)
            .get();

        return data.length > 0 ? data[0] : null;
    } catch (error) {
        console.error('[validateVocabulary] Error:', error);
        return null;
    }
}

/**
 * 验证掌握程度是否有效
 * 
 * @param {string} mastery - 掌握程度
 * @returns {boolean} 是否有效
 */
function isValidMastery(mastery) {
    const validValues = Object.values(MasteryLevel);
    return validValues.includes(mastery);
}

/**
 * 验证并规范化分页参数
 * 
 * @param {number} limit - 限制数量
 * @param {number} offset - 偏移量
 * @param {number} maxLimit - 最大限制 (默认100)
 * @returns {Object} 验证后的分页参数
 */
function validatePagination(limit, offset, maxLimit = 100) {
    return {
        limit: Math.min(Math.max(1, parseInt(limit) || 20), maxLimit),
        offset: Math.max(0, parseInt(offset) || 0),
    };
}

/**
 * 验证必填字符串参数
 * 
 * @param {string} value - 参数值
 * @param {string} name - 参数名 (用于错误消息)
 * @returns {Object} { valid: boolean, error?: string }
 */
function validateRequiredString(value, name) {
    if (!value || typeof value !== 'string' || value.trim() === '') {
        return {
            valid: false,
            error: `${name} 是必填参数且不能为空`,
        };
    }
    return { valid: true };
}

/**
 * 验证布尔参数
 * 
 * @param {any} value - 参数值
 * @param {string} name - 参数名
 * @returns {Object} { valid: boolean, error?: string }
 */
function validateBoolean(value, name) {
    if (typeof value !== 'boolean') {
        return {
            valid: false,
            error: `${name} 必须是布尔值`,
        };
    }
    return { valid: true };
}
/**
 * 通用参数验证函数
 * 
 * @param {Object} params - 需要验证的参数对象
 * @param {Array<string>} requiredFields - 必需字段列表
 * @returns {Object} { isValid: boolean, message?: string }
 */
function validateParams(params, requiredFields) {
    const missing = [];

    for (const field of requiredFields) {
        if (params[field] === undefined || params[field] === null || params[field] === '') {
            missing.push(field);
        }
    }

    if (missing.length > 0) {
        return {
            isValid: false,
            message: `缺少必填参数: ${missing.join(', ')}`
        };
    }

    return { isValid: true };
}

module.exports = {
    validateUser,
    validateVocabulary,
    isValidMastery,
    validatePagination,
    validateRequiredString,
    validateBoolean,
    validateParams,
};
```

======================
【Part 3.2】shared - constants.js
```javascript
/**
 * 常量定义模块
 * 
 * 与前端 src/config/constants.ts 保持一致的设计风格
 * 集中管理所有云函数常量
 */

'use strict';

// ==================== 数据库集合名称 ====================
// 与前端 COLLECTIONS 保持一致
const COLLECTIONS = {
  USERS: 'users',
  VOCABULARY: 'vocabulary',
  USER_VOCABULARY_PROGRESS: 'user_vocabulary_progress',
  LETTERS: 'letters',
  USER_ALPHABET_PROGRESS: 'user_alphabet_progress',
  LETTER_TEST_BANK: 'letter_test_bank',
  COURSES: 'courses',
  LESSONS: 'lessons',
  PROGRESS: 'progress',
};

// ==================== 掌握程度 ====================
// 使用中文值，便于前端直接显示
const MasteryLevel = Object.freeze({
  UNFAMILIAR: '陌生',
  FUZZY: '模糊',
  REMEMBERED: '记得',
});

// ==================== 学习等级 ====================
// 与前端 LEVELS 保持一致
const LEVELS = Object.freeze({
  BEGINNER_A: 'BEGINNER_A',
  BEGINNER_B: 'BEGINNER_B',
  INTERMEDIATE: 'INTERMEDIATE',
  ADVANCED: 'ADVANCED',
});

// ==================== SM-2 算法参数 ====================
// 优化版参数，基于艾宾浩斯遗忘曲线
const SM2_PARAMS = Object.freeze({
  INITIAL_EASINESS_FACTOR: 2.5,   // 初始简易度
  MIN_EASINESS_FACTOR: 1.3,       // 最小简易度
  MAX_INTERVAL_DAYS: 180,         // 最大间隔（天）
  FUZZY_MULTIPLIER: 0.8,          // "模糊"时间隔缩短比例
});

// ==================== 早期复习间隔序列 ====================
// 基于艾宾浩斯遗忘曲线优化: 1→2→4→7→14 天
const EARLY_INTERVALS = Object.freeze([1, 2, 4, 7, 14]);

// ==================== 每日学习配置 ====================
const DAILY_LEARNING_CONFIG = Object.freeze({
  MAX_NEW_WORDS: 10,              // 每日新词上限
  MAX_REVIEW_WORDS: 20,           // 每日复习上限
  TOTAL_WORDS_LIMIT: 30,          // 每日总词数上限
});

// ==================== 错误码 ====================
// 统一错误码定义
const ErrorCodes = Object.freeze({
  SUCCESS: 'SUCCESS',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  VOCABULARY_NOT_FOUND: 'VOCABULARY_NOT_FOUND',
  INVALID_PARAMS: 'INVALID_PARAMS',
  INVALID_MASTERY: 'INVALID_MASTERY',
  UNKNOWN_ACTION: 'UNKNOWN_ACTION',
  SERVER_ERROR: 'SERVER_ERROR',
});

// ==================== 错误消息 ====================
// 与前端 ERROR_MESSAGES 风格一致
const ERROR_MESSAGES = Object.freeze({
  USER_NOT_FOUND: '用户不存在，请检查用户ID或重新登录',
  VOCABULARY_NOT_FOUND: '词汇不存在，请检查词汇ID',
  INVALID_PARAMS: '参数格式错误，请检查输入',
  INVALID_MASTERY: '无效的掌握程度，允许值: 陌生/模糊/记得',
  UNKNOWN_ACTION: '未知操作类型',
  SERVER_ERROR: '服务器内部错误，请稍后重试',
});

// ==================== 支持的 Actions ====================
const SUPPORTED_ACTIONS = Object.freeze([
  'getTodayWords',
  'updateMastery',
  'toggleSkipWord',
  'getVocabularyDetail',
  'getReviewStatistics',
  'getVocabularyList',
  'getSkippedWords',
  'getLetterTest',
  'submitLetterTest',
  'passLetterTest',
  'getTodayMemories',
  'submitMemoryResult',
  'checkModuleAccess',
  'getUserProgress'
]);

module.exports = {
  // 集合
  COLLECTIONS,

  // 枚举
  MasteryLevel,
  LEVELS,
  ErrorCodes,

  // 算法参数
  SM2_PARAMS,
  EARLY_INTERVALS,

  // 配置
  DAILY_LEARNING_CONFIG,

  // 消息
  ERROR_MESSAGES,
  SUPPORTED_ACTIONS,
};
```

======================
【Part 3.2】shared - response.js
```javascript
/**
 * 响应格式化模块
 * 
 * 统一 API 响应格式
 * 与前端 ApiResponse<T> 类型定义保持一致
 */

'use strict';

const { ErrorCodes, ERROR_MESSAGES } = require('./constants');

/**
 * 创建标准化 API 响应
 * 
 * 对应前端类型:
 * interface ApiResponse<T> {
 *   success: boolean;
 *   data?: T;
 *   message?: string;
 *   errorCode?: string;
 *   timestamp: string;
 * }
 * 
 * @param {boolean} success - 是否成功
 * @param {Object} data - 返回数据
 * @param {string} message - 提示消息
 * @param {string} errorCode - 错误码
 * @returns {Object} 标准化响应对象
 */
function createResponse(success, data = null, message = '', errorCode = null) {
  return {
    success,
    data,
    message,
    errorCode,
    timestamp: new Date().toISOString(),
  };
}

/**
 * 创建成功响应
 * 
 * @param {Object} data - 返回数据
 * @param {string} message - 成功消息
 * @returns {Object} 成功响应对象
 */
function successResponse(data, message = '操作成功') {
  return createResponse(true, data, message, null);
}

/**
 * 创建错误响应
 * 
 * @param {string} errorCode - 错误码 (来自 ErrorCodes)
 * @param {string} customMessage - 自定义消息 (可选)
 * @returns {Object} 错误响应对象
 */
function errorResponse(errorCode, customMessage = null) {
  const message = customMessage || ERROR_MESSAGES[errorCode] || '未知错误';
  return createResponse(false, null, message, errorCode);
}

/**
 * 创建参数错误响应
 * 
 * @param {string} detail - 错误详情
 * @returns {Object} 错误响应对象
 */
function invalidParamsResponse(detail) {
  return errorResponse(ErrorCodes.INVALID_PARAMS, detail);
}

/**
 * 创建用户不存在响应
 * 
 * @returns {Object} 错误响应对象
 */
function userNotFoundResponse() {
  return errorResponse(ErrorCodes.USER_NOT_FOUND);
}

/**
 * 创建词汇不存在响应
 * 
 * @returns {Object} 错误响应对象
 */
function vocabularyNotFoundResponse() {
  return errorResponse(ErrorCodes.VOCABULARY_NOT_FOUND);
}

/**
 * 创建服务器错误响应
 * 
 * @param {Error} error - 错误对象
 * @returns {Object} 错误响应对象
 */
function serverErrorResponse(error) {
  // 生产环境不暴露错误详情
  const message = process.env.NODE_ENV === 'development' 
    ? `服务器错误: ${error.message}`
    : ERROR_MESSAGES.SERVER_ERROR;
  
  return errorResponse(ErrorCodes.SERVER_ERROR, message);
}

module.exports = {
  createResponse,
  successResponse,
  errorResponse,
  invalidParamsResponse,
  userNotFoundResponse,
  vocabularyNotFoundResponse,
  serverErrorResponse,
};
```

======================
【Part 4】user-register - index.js
```javascript
const cloud = require('wx-server-sdk');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

//JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d'; // 7 days

exports.main = async (event, context) => {
  // Parse request body if coming from HTTP trigger
  let requestData = event;
  if (typeof event.body === 'string') {
    try {
      requestData = JSON.parse(event.body);
    } catch (e) {
      return {
        success: false,
        message: 'Invalid JSON in request body',
        code: 'INVALID_JSON'
      };
    }
  } else if (event.body && typeof event.body === 'object') {
    requestData = event.body;
  }

  const { email, password, displayName, role = 'LEARNER' } = requestData;

  // Validate required fields
  if (!email || !password || !displayName) {
    return {
      success: false,
      message: 'Missing required fields: email, password, displayName',
      code: 'MISSING_FIELDS'
    };
  }

  try {
    // Check if email already exists 
    const existingUser = await db.collection('users').where({
      email: email.toLowerCase()
    }).count();

    if (existingUser.count > 0) {
      return {
        success: false,
        message: '邮箱已存在 \n Email already exists',
        code: 'EMAIL_EXISTS'
      };
    }

    // ===== Hash password =====
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 创建新用户
    const userId = `u_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const registrationDate = new Date().toISOString();
    const userDoc = {
      userId,
      email: email.toLowerCase(),
      passwordHash,
      displayName,
      role,
      registrationDate,
      lastLogin: registrationDate,
      isActive: true,
      preferences: {
        language: 'zh',
        notificationsEnabled: true
      }
    };
    // ===== Save to database =====
    await db.collection('users').add({
      data: userDoc
    });

    // 初始化用户学习进度
    await db.collection('user_progress').add({
      data: {
        userId,
        letterCompleted: false,
        debugSkipLetter: false,
        letterProgress: 0.0,
        wordProgress: 0.0,
        sentenceProgress: 0.0,
        totalStudyDays: 0,
        streakDays: 0,
        lastStudyDate: null,
        createdAt: registrationDate,
        updatedAt: registrationDate
      }
    });

    // ===== Generate JWT token =====
    const token = jwt.sign(
      {
        userId,
        email: email.toLowerCase(),
        role
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    // ===== Return user data (exclude password hash) =====
    const { passwordHash: _, ...userResponse } = userDoc;

    return {
      success: true,
      data: {
        user: userResponse,
        token,
        expiresIn: 604800 // 7 days in seconds
      }
    };

  } catch (error) {
    console.error('注册失败:', error);
    return {
      success: false,
      message: '注册失败: ' + error.message
    };
  }
};
```

======================
【Part 5】CloudBase 错误日志
> ⚠️ **注意**: 无法直接访问 CloudBase 控制台实时日志。以下为基于代码逻辑推断的潜在错误点，或请在控制台查看实际日志。

(No local error logs found in workspace)

======================
【Part 6】模块解锁逻辑逐行定位

### 1. cloudbase/functions/memory-engine/index.js
```javascript
// Line 75: 路由分发，将 'checkModuleAccess' 请求转发给 handler
if (action === 'checkModuleAccess') {
    return await checkModuleAccessHandler(db, data);
}
```

### 2. cloudbase/functions/memory-engine/handlers/checkModuleAccess.js
```javascript
// Line 13: 打印当前环境变量，用于调试
console.log('🔥 当前 NODE_ENV =', process.env.NODE_ENV);

// Line 16: 【关键逻辑】检查是否为非生产环境 (Dev Mode)
if (env !== 'production') {
    // Line 17: 【关键逻辑】如果是开发环境，直接返回 allowed: true (强制解锁)
    return createResponse(true, {
      allowed: true,
      // ...
    }, '【开发模式】模块已强制放行');
}

// Line 47: 【关键逻辑】调用 shared 模块的 checkModuleAccess 进行正式校验
const accessResult = await checkModuleAccess(db, userId, moduleType);

// Line 49: 检查校验结果
if (!accessResult.allowed) {
    // Line 50: 如果不允许，返回失败信息
    return createResponse(false, accessResult, accessResult.message, accessResult.errorCode);
}

// Line 54: 【关键逻辑】校验通过，返回 allowed: true
return createResponse(true, {
    allowed: true,
    // ...
}, '模块已解锁,可以访问');
```

### 3. (补充) cloudbase/functions/shared/memoryEngine.js
> ⚠️ 核心逻辑实际位于此处

```javascript
// Line 362: 【关键逻辑】检查 FORCE_UNLOCK 环境变量
if (process.env.FORCE_UNLOCK === 'true') {
    // Line 365: 如果开启，强制返回 allowed: true
    return { allowed: true, ... };
}

// Line 400: 【关键逻辑】判断 letterCompleted 字段
if (!progress.letterCompleted) {
    // Line 402: 如果未完成字母学习，返回 allowed: false
    return { allowed: false, ... };
}

// Line 411: 【关键逻辑】字母学习已完成，返回 allowed: true (解锁所有模块)
return { allowed: true, progress };
```
