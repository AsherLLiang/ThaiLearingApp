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

const MAX_RESULTS = 30;
const BATCH_SIZE = 5;

/**
 * @param {Object} db     - cloud.database()
 * @param {Object} params - 请求参数（来自 index.js 中的 data）
 */
async function submitMemoryResult(db, params) {
  const start = Date.now();
  const { userId, entityType, entityId, quality, results } = params || {};

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
    if (results.length > MAX_RESULTS) {
      return createResponse(
        false,
        null,
        `单次最多提交 ${MAX_RESULTS} 条结果，请分批提交`,
        'RESULTS_TOO_MANY'
      );
    }
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

    // 3. 分批并发更新记忆状态（防止超时）
    for (let i = 0; i < items.length; i += BATCH_SIZE) {
      const batch = items.slice(i, i + BATCH_SIZE);

      const batchResults = await Promise.all(
        batch.map(async (item) => {
          const { entityType, entityId, quality } = item;

          // 防御性校验，避免 results 里混入空对象
          if (!entityType || !entityId || !quality) return null;

          const memoryState = await updateMemoryAfterReview(
            db,
            userId,
            entityType,
            entityId,
            quality
          );

          return {
            entityType,
            entityId,
            quality,
            memoryState
          };
        })
      );

      batchResults
        .filter(Boolean)
        .forEach((res) => updatedMemories.push(res));//<--- res 的全称为 result，这里是将 res push 到 updatedMemories 数组中
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
    const response = createResponse(
      true,
      { updatedMemories },
      '提交学习结果成功'
    );
    console.log('[FunctionCost] submitMemoryResult', Date.now() - start, 'ms');
    return response;

  } catch (error) {
    console.error('[submitMemoryResult] error:', error);
    console.log('[FunctionCost] submitMemoryResult', Date.now() - start, 'ms');

    return createResponse(
      false,
      null,
      error.message || '服务器内部错误',
      'SERVER_ERROR'
    );
  }
}

module.exports = submitMemoryResult;
