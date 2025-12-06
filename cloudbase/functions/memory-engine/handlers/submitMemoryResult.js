/**
 * 提交学习结果（支持单条 + 批量）
 * 
 * 支持两种请求格式：
 * 1）旧版单条：
 * {
 *   userId,
 *   entityType,
 *   entityId,
 *   quality
 * }
 * 
 * 2）新版批量：
 * {
 *   userId,
 *   results: [
 *     { entityType, entityId, quality },
 *     ...
 *   ]
 * }
 */

'use strict';

const { createResponse } = require('../utils/response');
const { updateMemoryAfterReview } = require('../utils/memoryEngine');

/**
 * @param {Object} db     - cloud.database()
 * @param {Object} params - 请求参数（来自 index.js 中的 data）
 */
async function submitMemoryResult(db, params) {
  const {
    userId,
    entityType,
    entityId,
    quality,
    results
  } = params || {};

  // 1. 基本校验：必须有 userId
  if (!userId) {
    return createResponse(
      false,
      null,
      '缺少必填参数: userId',
      'INVALID_PARAMS'
    );
  }

  // 2. 规范化为统一的数组格式 items[]
  let items = [];

  // 2.1 新版：data.results 是数组
  if (Array.isArray(results) && results.length > 0) {
    items = results.map((r) => ({
      entityType: r.entityType,
      entityId: r.entityId,
      quality: r.quality
    }));
  }
  // 2.2 兼容旧版：单条参数
  else if (entityType && entityId && quality) {
    items = [{ entityType, entityId, quality }];
  } else {
    // 两种格式都不满足
    return createResponse(
      false,
      null,
      '缺少必填参数: entityType, entityId, quality 或 results[]',
      'INVALID_PARAMS'
    );
  }

  try {
    const updatedMemories = [];

    // 3. 逐条更新记忆状态
    for (const item of items) {
      const { entityType, entityId, quality } = item;

      // 防御性校验，避免 results 里混入空对象
      if (!entityType || !entityId || !quality) continue;

      const memoryState = await updateMemoryAfterReview(
        db,
        userId,
        entityType,
        entityId,
        quality
      );

      updatedMemories.push({
        entityType,
        entityId,
        quality,
        memoryState
      });
    }

    if (updatedMemories.length === 0) {
      return createResponse(
        false,
        null,
        'results 中没有有效的记录',
        'INVALID_PARAMS'
      );
    }

    // 4. 返回统一结构
    return createResponse(
      true,
      { updatedMemories },
      '提交学习结果成功'
    );

  } catch (error) {
    console.error('[submitMemoryResult] error:', error);

    return createResponse(
      false,
      null,
      error.message || '服务器内部错误',
      'SERVER_ERROR'
    );
  }
}

module.exports = submitMemoryResult;
