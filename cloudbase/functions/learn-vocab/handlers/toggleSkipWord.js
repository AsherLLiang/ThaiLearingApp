/**
 * 划掉/恢复单词处理器
 * 
 * 将单词从复习队列中移除或重新加入
 * 
 * @action toggleSkipWord
 */

'use strict';

const { createResponse } = require('../utils/response');

/**
 * 划掉或恢复单词
 */
async function toggleSkipWord(db, params) {
  const { userId, vocabularyId, skipped } = params;
  
  // 参数验证
  if (!userId || !vocabularyId || typeof skipped !== 'boolean') {
    return createResponse(false, null, '缺少必填参数或参数类型错误', 'INVALID_PARAMS');
  }
  
  try {
    // 验证用户
    const userResult = await db.collection('users')
      .where({ userId })
      .get();
    
    if (!userResult.data || userResult.data.length === 0) {
      return createResponse(false, null, '用户不存在', 'USER_NOT_FOUND');
    }
    
    // 验证词汇
    const vocabResult = await db.collection('vocabulary')
      .where({ _id: vocabularyId })
      .get();
    
    if (!vocabResult.data || vocabResult.data.length === 0) {
      return createResponse(false, null, '词汇不存在', 'VOCABULARY_NOT_FOUND');
    }
    
    const now = new Date();
    
    // 查找现有进度记录
    const existingProgress = await db.collection('user_vocabulary_progress')
      .where({ userId, vocabularyId })
      .limit(1)
      .get();
    
    if (existingProgress.data && existingProgress.data.length > 0) {
      // 更新现有记录
      await db.collection('user_vocabulary_progress')
        .doc(existingProgress.data[0]._id)
        .update({
          skipped,
          updatedAt: now
        });
    } else {
      // 创建新记录
      await db.collection('user_vocabulary_progress').add({
        userId,
        vocabularyId,
        mastery: null,
        skipped,
        lastReviewed: null,
        reviewCount: 0,
        intervalDays: 1,
        easinessFactor: 2.5,
        nextReviewDate: null,
        createdAt: now,
        updatedAt: now,
      });
    }
    
    const message = skipped ? '已从复习队列移除' : '已加入复习队列';
    
    return createResponse(true, {
      vocabularyId,
      skipped,
      message,
    }, skipped ? '单词已划掉' : '单词已恢复');
    
  } catch (error) {
    console.error('toggleSkipWord error:', error);
    return createResponse(false, null, error.message, 'SERVER_ERROR');
  }
}

module.exports = toggleSkipWord;