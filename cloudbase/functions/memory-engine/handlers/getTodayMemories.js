/**
 * 统一获取今日学习内容 (字母/单词/句子)
 * Action: getTodayMemories
 */
'use strict';

// 假设 memoryEngine 内部没有严重的全局副作用，如果有问题，可能需要检查 memoryEngine
const { getTodayReviewEntities, getOrCreateMemory, checkModuleAccess } = require('../utils/memoryEngine');
const { createResponse } = require('../utils/response');
const {
  getLessonMetadataFromDb,
  getPhonicsRuleByLessonFromDb,
} = require('../config/alphabetLessonConfig');

const MAX_NEW_LETTERS = 12; // 单课安全上限，防止 3s 超时
const MAX_LETTER_DAILY_LIMIT = 20; // 字母模块每日学习硬上限（稳定模式）
const MAX_GENERIC_DAILY_LIMIT = 200; // 其他模块的兜底上限，防止无界请求

/**
 * 懒初始化：字母进度表
 * 兼容旧用户：如果 user_alphabet_progress 中没有记录，则插入一条默认记录
 * 给字母模块提供进度表
 * col.add({
      data: {
        userId,
        letterProgress: 0.0,
        letterCompleted: false,
        completedLessons: [],
        masteredLetterCount: 0,
        totalLetterCount: 80,
        currentRound: 1,          
        roundHistory: [],        
        createdAt: now,
        updatedAt: now,
      },
 * @param {Object} db
 * @param {string} userId
 * 
 */
async function ensureUserAlphabetProgress(db, userId) {
  const col = db.collection('user_alphabet_progress');
  const existing = await col.where({ userId }).limit(1).get();

  if (!existing.data || existing.data.length === 0) {
    const now = new Date().toISOString();

    // 🔥 并发保护：二次检查防止重复记录
    const checkAgain = await col.where({ userId }).limit(1).get();
    if (checkAgain.data && checkAgain.data.length > 0) {
      console.log('⚠️ [ensureUserAlphabetProgress] 记录已被并发创建, 跳过');
      return;
    }

    await col.add({
      data: {
        userId,
        letterProgress: 0.0,
        letterCompleted: false,
        completedLessons: [],
        masteredLetterCount: 0,
        totalLetterCount: 80,
        currentRound: 1,          // 🔥 新增：默认从第1轮开始
        roundHistory: [],         // 🔥 新增：轮次历史记录
        createdAt: now,
        updatedAt: now,
      },
    });
    console.log('✅ [ensureUserAlphabetProgress] 已创建默认进度记录');
  }
}

/**
 * 懒初始化：用户词汇进度表（传统进度表）
 * 说明：
 * 给单词模块提供进度表
 * col.add({
      data: {
        userId,
        vocabularyId: null,
        mastery: null,
        reviewCount: 0,
        lastReviewed: null,
        nextReviewDate: null,
        intervalDays: 0,
        // 占位记录默认标记为 skipped，避免影响 getTodayWords 等查询逻辑
        skipped: true,
        easinessFactor: 2.5,
        createdAt: now,
        updatedAt: now,
      },
    });
 * - 该集合原本按单词一条记录，这里只为旧用户插入一条「占位记录」
 * - 使用 skipped: true，避免影响 getTodayWords 等查询逻辑
 *
 * @param {Object} db
 * @param {string} userId
 */
async function ensureUserVocabularyProgress(db, userId) {
  const col = db.collection('user_vocabulary_progress');
  const existing = await col.where({ userId }).limit(1).get();

  if (!existing.data || existing.data.length === 0) {
    const now = new Date().toISOString();
    await col.add({
      data: {
        userId,
        vocabularyId: null,
        mastery: null,
        reviewCount: 0,
        lastReviewed: null,
        nextReviewDate: null,
        intervalDays: 0,
        // 占位记录默认标记为 skipped，避免被当成真实复习数据
        skipped: true,
        easinessFactor: 2.5,
        createdAt: now,
        updatedAt: now,
      },
    });
  }
}

/**
 * @param {Object} db - 数据库实例
 * @param {Object} params - 请求参数
 * @returns {Promise<Object>} - 响应对象
 */
async function getTodayMemories(db, params) {
  const start = Date.now();
  const { userId, entityType, limit = 30, includeNew = true, roundNumber } = params;

  // 🔍 调试日志：打印收到的 userId
  console.log('📥 [getTodayMemories] 收到请求，userId:', userId, ', entityType:', entityType);

  if (!userId || !entityType) {
    return createResponse(false, null, 'Missing userId or entityType', 'INVALID_PARAMS');
  }

  try {
    // 0. 懒初始化用户相关进度表（兼容在新增注册逻辑之前的老用户）
    if (entityType === 'letter') {
      await ensureUserAlphabetProgress(db, userId);
    } else if (entityType === 'word') {
      await ensureUserVocabularyProgress(db, userId);
    }

    // 1. 检查模块访问权限
    // 使用 memoryEngine 中的统一权限检查
    const accessCheck = await checkModuleAccess(db, userId, entityType);
    if (!accessCheck.allowed) {
      return createResponse(false, null, accessCheck.message, accessCheck.errorCode);
    }

    // 1.5 获取/更新用户每日学习量设置
    // 注意：
    // - 字母模块（entityType === 'letter'）不再允许前端通过 limit 动态调整每日新字母数量，
    //   只使用服务器端存储的 dailyLimit（如果有），否则退回默认值；
    // - 其他实体类型仍沿用原有逻辑。
    let effectiveLimit = limit;
    const userProgress = accessCheck.progress; // checkModuleAccess returns progress

    if (userProgress) {
      if (entityType === 'letter') {
        // 字母模块：忽略前端传入的 limit，只使用存储的 dailyLimit（如果有）
        if (userProgress.dailyLimit) {
          effectiveLimit = Math.min(userProgress.dailyLimit, MAX_LETTER_DAILY_LIMIT);
        }
        effectiveLimit = Math.min(effectiveLimit, MAX_LETTER_DAILY_LIMIT);
      } else {
        // 其他模块：保留原有行为
        if (params.limit && params.limit !== userProgress.dailyLimit) {
          await db.collection('user_progress').where({ userId }).update({
            data: {
              dailyLimit: params.limit,
              updatedAt: new Date().toISOString()
            }
          });
          effectiveLimit = Math.min(params.limit, MAX_GENERIC_DAILY_LIMIT);
        } else if (!params.limit && userProgress.dailyLimit) {
          effectiveLimit = Math.min(userProgress.dailyLimit, MAX_GENERIC_DAILY_LIMIT);
        }
      }
    }
    if (entityType !== 'letter') {
      effectiveLimit = Math.min(effectiveLimit, MAX_GENERIC_DAILY_LIMIT);
    }

    // 3. 获取今日复习实体
    let reviewMemories = await getTodayReviewEntities(db, userId, entityType, effectiveLimit);

    // 🔥 P0-C: 显式获取 Round1 跨课程 previous-review（只做 round==1 且 lesson>1）
    let explicitPreviousCount = 0;

    if (entityType === 'letter' && roundNumber === 1 && params.lessonId && params.lessonId !== 'lesson1') {
      try {
        const currentLessonMeta = await getLessonMetadataFromDb(db, params.lessonId);
        if (currentLessonMeta && currentLessonMeta.order && currentLessonMeta.order > 1) {
          const prevLessonId = `lesson${currentLessonMeta.order - 1}`;

          // 查询上一课的字母
          const prevLettersResult = await db.collection('letters')
            .where({ curriculumLessonIds: db.command.in([prevLessonId]) })
            .limit(20)
            .get();

          const explicitPrevMemories = [];

          // 获取这些字母的记忆状态
          for (const letter of prevLettersResult.data) {
            const mem = await getOrCreateMemory(db, userId, entityType, letter._id, false);
            if (mem) {
              // 浅拷贝避免副作用
              const patched = {
                ...mem,
                reviewStage: Math.max(mem.reviewStage || 0, 1)
              };
              explicitPrevMemories.push(patched);
            }
          }

          explicitPreviousCount = explicitPrevMemories.length;

          // 合并到 reviewMemories（去重）
          const existingIds = new Set(reviewMemories.map(m => m.entityId));
          const uniquePrev = explicitPrevMemories.filter(m => !existingIds.has(m.entityId));
          reviewMemories = [...uniquePrev, ...reviewMemories];

          console.log(`🔍 [P0-C] lessonId: ${params.lessonId}, prevLessonId: ${prevLessonId}, explicitPrevCount: ${explicitPreviousCount}`);
        }
      } catch (err) {
        console.warn('⚠️ [P0-C] 获取上一课程字母失败:', err);
      }
    }

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

      const query = db.collection(collectionName);
      let newEntities = [];

      // 获取已存在的实体ID (包括复习队列中的)
      const existingEntityIds = reviewMemories.map(m => m.entityId);

      if (entityType === 'letter' && params.lessonId) {
        // 字母模块：根据课程一次性取出该课需要的全部字母（不受 limit 限制）
        const { lessonId } = params;
        const cmd = db.command;

        const whereCondition = {
          curriculumLessonIds: cmd.in([lessonId]),
        };

        // 🔥 Round2/3 时不过滤已有记忆的字母（用于复习）
        if (roundNumber === 1 && existingEntityIds.length > 0) {
          whereCondition._id = cmd.nin(existingEntityIds);
        }
        // Round2/3 时返回该课程的全部字母

        const newEntitiesResult = await query
          .where(whereCondition)
          // 为了安全起见，仍加一个较大的上限（远大于实际字母总数）
          .limit(MAX_NEW_LETTERS)
          .get();

        newEntities = newEntitiesResult.data;
      } else {
        // 其他模块或未指定 lessonId：沿用原逻辑，按剩余名额和 lessonNumber 顺序获取
        let queryRef = query;
        const cmd = db.command;

        if (existingEntityIds.length > 0) {
          queryRef = queryRef.where({
            _id: cmd.nin(existingEntityIds)
          });
        }

        const newEntitiesResult = await queryRef
          .orderBy('lessonNumber', 'asc')
          .orderBy('_id', 'asc')
          .limit(Math.min(remainingSlots, MAX_GENERIC_DAILY_LIMIT))
          .get();

        newEntities = newEntitiesResult.data;
      }

      const cappedNewEntities =
        entityType === 'letter'
          ? newEntities.slice(0, MAX_NEW_LETTERS)
          : newEntities.slice(0, Math.min(remainingSlots, MAX_GENERIC_DAILY_LIMIT));

      const memoryTasks = cappedNewEntities.map((entity) =>
        getOrCreateMemory(db, userId, entityType, entity._id, false)
      );
      const memoryResults = await Promise.all(memoryTasks);
      newMemories = memoryResults.filter(Boolean);
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
      entityType,
    };

    // 8. 附加课程元数据 & 拼读规则（真实配置）
    let lessonMetadata = null;
    let phonicsRule = null;

    if (entityType === 'letter' && data.length > 0) {
      // 优先使用前端传入的 lessonId，其次尝试从实体字段推导
      const firstEntity = data[0];
      const lessonIdFromParam = params.lessonId;
      const lessonIdFromField = firstEntity.lessonId || null;
      const lessonIdFromCurriculum =
        (firstEntity.curriculumLessonIds &&
          firstEntity.curriculumLessonIds[0]) ||
        null;
      const lessonIdFromLegacy =
        typeof firstEntity.lessonNumber === 'number' &&
          firstEntity.lessonNumber > 0
          ? `lesson${firstEntity.lessonNumber}`
          : null;

      const resolvedLessonId =
        lessonIdFromParam ||
        lessonIdFromCurriculum ||
        lessonIdFromField ||
        lessonIdFromLegacy;

      if (resolvedLessonId) {
        lessonMetadata = await getLessonMetadataFromDb(db, resolvedLessonId);
        phonicsRule = await getPhonicsRuleByLessonFromDb(db, resolvedLessonId);
      }
    }

    return createResponse(
      true,
      {
        items: data,
        summary,
        lessonMetadata,
        phonicsRule,
      },
      '获取今日学习内容成功',
    );

  } catch (error) {
    console.error('getTodayMemories error:', error);
    return createResponse(false, null, error.message, 'SERVER_ERROR');
  } finally {
    console.log('[FunctionCost] getTodayMemories', Date.now() - start, 'ms');
  }
}

module.exports = getTodayMemories;
