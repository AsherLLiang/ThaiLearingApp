/**
 * 划掉/恢复单词处理器
 * 
 * 将单词从复习队列中移除或重新加入
 * 
 * @action toggleSkipWord
 */

'use strict';

const { progressCollection } = require('../utils/database');
const { SM2_PARAMS, ErrorCodes } = require('../utils/constants');
const { successResponse, errorResponse, userNotFoundResponse, vocabularyNotFoundResponse } = require('../utils/response');
const { validateUser, validateVocabulary, validateBoolean } = require('../utils/validators');

/**
 * 划掉或恢复单词
 * 
 * @param {Object} params
 * @param {string} params.userId - 用户ID
 * @param {string} params.vocabularyId - 词汇ID
 * @param {boolean} params.skipped - true=划掉, false=恢复
 */
async function toggleSkipWord({ userId, vocabularyId, skipped }) {
  // 参数验证
  const boolValidation = validateBoolean(skipped, 'skipped');
  if (!boolValidation.valid) {
    return errorResponse(ErrorCodes.INVALID_PARAMS, boolValidation.error);
  }
  
  // 验证用户
  const user = await validateUser(userId);
  if (!user) {
    return userNotFoundResponse();
  }
  
  // 验证词汇
  const vocabulary = await validateVocabulary(vocabularyId);
  if (!vocabulary) {
    return vocabularyNotFoundResponse();
  }
  
  const now = new Date().toISOString();
  
  // 查找现有进度记录
  const { data: existingProgress } = await progressCollection
    .where({ userId, vocabularyId })
    .limit(1)
    .get();
  
  if (existingProgress.length > 0) {
    // 更新现有记录
    await progressCollection.doc(existingProgress[0]._id).update({
      skipped,
      updatedAt: now,
    });
  } else {
    // 创建新记录 (仅标记跳过状态)
    await progressCollection.add({
      userId,
      vocabularyId,
      mastery: null,
      skipped,
      lastReviewed: null,
      reviewCount: 0,
      intervalDays: 1,
      easinessFactor: SM2_PARAMS.INITIAL_EASINESS_FACTOR,
      nextReviewDate: null,
      createdAt: now,
      updatedAt: now,
    });
  }
  
  const message = skipped ? '已从复习队列移除' : '已加入复习队列';
  
  return successResponse({
    vocabularyId,
    skipped,
    message,
  }, skipped ? '单词已划掉' : '单词已恢复');
}

module.exports = { toggleSkipWord };
