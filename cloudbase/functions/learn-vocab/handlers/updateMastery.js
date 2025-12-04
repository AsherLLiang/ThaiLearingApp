/**
 * 更新掌握状态处理器
 * 
 * 记录用户对单词的掌握程度，使用 SM-2 算法计算下次复习时间
 * 
 * @action updateMastery
 */

'use strict';

const { progressCollection } = require('../utils/database');
const { SM2_PARAMS, ErrorCodes } = require('../utils/constants');
const { successResponse, errorResponse, userNotFoundResponse, vocabularyNotFoundResponse } = require('../utils/response');
const { validateUser, validateVocabulary, isValidMastery } = require('../utils/validators');
const { calculateSM2Optimized, generateReviewTimeline } = require('../utils/sm2');

/**
 * 更新单词掌握状态
 * 
 * 业务逻辑:
 * 1. 验证用户和词汇存在
 * 2. 验证掌握程度有效性
 * 3. 使用 SM-2 算法计算下次复习日期
 * 4. 创建或更新进度记录
 * 
 * @param {Object} params
 * @param {string} params.userId - 用户ID
 * @param {string} params.vocabularyId - 词汇ID
 * @param {string} params.mastery - 掌握程度: 陌生/模糊/记得
 */
async function updateMastery({ userId, vocabularyId, mastery }) {
  // 验证掌握程度
  if (!isValidMastery(mastery)) {
    return errorResponse(ErrorCodes.INVALID_MASTERY);
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
  
  // 查找现有进度记录
  const { data: existingProgress } = await progressCollection
    .where({ userId, vocabularyId })
    .limit(1)
    .get();
  
  const now = new Date().toISOString();
  let progressData;
  let isNewRecord = false;
  let newReviewCount;
  
  if (existingProgress.length > 0) {
    // ========== 更新现有记录 ==========
    const current = existingProgress[0];
    
    const sm2Result = calculateSM2Optimized(
      mastery,
      current.intervalDays || 1,
      current.easinessFactor || SM2_PARAMS.INITIAL_EASINESS_FACTOR,
      current.reviewCount || 0
    );
    
    // 计算新的复习次数
    newReviewCount = sm2Result.shouldResetCount ? 1 : (current.reviewCount || 0) + 1;
    
    progressData = {
      mastery,
      lastReviewed: now,
      reviewCount: newReviewCount,
      intervalDays: sm2Result.nextInterval,
      easinessFactor: sm2Result.nextEasinessFactor,
      nextReviewDate: sm2Result.nextReviewDate,
      updatedAt: now,
    };
    
    await progressCollection.doc(current._id).update(progressData);
    
  } else {
    // ========== 创建新记录 ==========
    isNewRecord = true;
    newReviewCount = 1;
    
    const sm2Result = calculateSM2Optimized(
      mastery,
      1,
      SM2_PARAMS.INITIAL_EASINESS_FACTOR,
      0
    );
    
    progressData = {
      userId,
      vocabularyId,
      mastery,
      skipped: false,
      lastReviewed: now,
      reviewCount: 1,
      intervalDays: sm2Result.nextInterval,
      easinessFactor: sm2Result.nextEasinessFactor,
      nextReviewDate: sm2Result.nextReviewDate,
      createdAt: now,
      updatedAt: now,
    };
    
    await progressCollection.add(progressData);
  }
  
  return successResponse({
    vocabularyId,
    mastery,
    reviewCount: newReviewCount,
    nextReviewDate: progressData.nextReviewDate,
    intervalDays: progressData.intervalDays,
    easinessFactor: progressData.easinessFactor,
    isNewRecord,
    reviewTimeline: generateReviewTimeline(newReviewCount),
  }, '更新掌握状态成功');
}

module.exports = { updateMastery };
