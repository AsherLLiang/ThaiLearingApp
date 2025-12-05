/**
 * 统一获取今日学习内容 (字母/单词/句子)
 * Action: getTodayMemories
 */
'use strict';

// 假设 memoryEngine 内部没有严重的全局副作用，如果有问题，可能需要检查 memoryEngine
const { getTodayReviewEntities, getOrCreateMemory, checkModuleAccess } = require('../utils/memoryEngine');
const { createResponse } = require('../utils/response');

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

    // 3. 获取今日复习实体
    const reviewMemories = await getTodayReviewEntities(db, userId, entityType, limit);

    // 4. 获取新学习内容
    let newMemories = [];
    if (includeNew && reviewMemories.length < limit) {
      const remainingSlots = limit - reviewMemories.length;

      const collectionMap = {
        letter: 'letters',
        word: 'vocabulary',
        sentence: 'sentences'
      };

      const collectionName = collectionMap[entityType];
      if (!collectionName) {
        return createResponse(false, null, `不支持的实体类型: ${entityType}`, 'INVALID_ENTITY_TYPE');
      }

      const existingEntityIds = reviewMemories.map(m => m.entityId);

      // 这里的逻辑有点简单，实际可能需要随机获取或按顺序获取
      // 为简化，这里演示基本逻辑
      const newEntitiesResult = await db.collection(collectionName)
        .limit(remainingSlots + existingEntityIds.length + 10) // 多取一些以防重复
        .get();

      const newEntities = newEntitiesResult.data.filter(entity => {
        return !existingEntityIds.includes(entity._id);
      }).slice(0, remainingSlots);

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

    // 5. 合并
    const allMemories = [...reviewMemories, ...newMemories];

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