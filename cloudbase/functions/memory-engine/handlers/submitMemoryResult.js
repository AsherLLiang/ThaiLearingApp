/**
 * 统一提交学习结果 (字母/单词/句子)
 * Action: submitMemoryResult
 */

const { updateMemoryAfterReview } = require('../utils/memoryEngine');
const { validateParams } = require('../utils/validators');
const { createResponse } = require('../utils/response');

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