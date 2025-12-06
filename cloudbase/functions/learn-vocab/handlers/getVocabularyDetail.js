/**
 * 获取词汇详情处理器
 * @action getVocabularyDetail
 */
'use strict';

const { createResponse } = require('../utils/response');

/**
 * 获取词汇详细信息
 * @param {Object} db - 数据库实例
 * @param {Object} params
 * @param {string} params.vocabularyId - 词汇ID (必填)
 * @param {string} params.userId - 用户ID (可选，用于获取学习状态)
 */
async function getVocabularyDetail(db, params) {
  const { vocabularyId, userId } = params;

  if (!vocabularyId) {
    return createResponse(false, null, '缺少词汇ID', 'INVALID_PARAMS');
  }

  try {
    // 1. 检查权限 (如果有 userId)
    if (userId) {
      const { checkModuleAccess } = require('../utils/memoryEngine');
      const accessResult = await checkModuleAccess(db, userId, 'word');

      if (!accessResult.allowed) {
        return createResponse(false, null, accessResult.message, accessResult.errorCode);
      }
    }

    // 2. 获取词汇详情
    // 注意：根据你的数据库结构，如果主键是 _id，请使用 doc(id)；如果是 vocabularyId 字段，使用 where
    // 假设 vocabularyId 字段存储的是业务ID
    const vocabResult = await db.collection('vocabulary')
      .where({ vocabularyId: vocabularyId }) // 或者 .doc(vocabularyId) 如果它是 _id
      .get();

    if (!vocabResult.data || vocabResult.data.length === 0) {
      // 尝试用 _id 再查一次，兼容不同传参
      const vocabByIdResult = await db.collection('vocabulary').doc(vocabularyId).get().catch(() => ({ data: [] }));
      if (!vocabByIdResult.data) {
        return createResponse(false, null, '未找到该词汇', 'VOCABULARY_NOT_FOUND');
      }
      vocabResult.data = [vocabByIdResult.data];
    }

    const vocabulary = vocabResult.data[0];

    // 3. 构建详细响应
    const detail = {
      // 基本信息
      vocabularyId: vocabulary.vocabularyId || vocabulary._id,
      thaiWord: vocabulary.thaiWord,
      meaning: vocabulary.meaning,
      pronunciation: vocabulary.pronunciation,
      audioPath: vocabulary.audioPath,
      partOfSpeech: vocabulary.partOfSpeech,
      level: vocabulary.level,
      lessonNumber: vocabulary.lessonNumber,
      startingLetter: vocabulary.startingLetter,

      // 扩展学习内容
      cognates: vocabulary.cognates || [],
      dialogue: vocabulary.dialogue || null,
      exampleSentences: vocabulary.exampleSentences || {},
      usage: vocabulary.usage || {},
      mistakes: vocabulary.mistakes || {},

      // 元数据
      source: vocabulary.source,
      createdAt: vocabulary.createdAt,
    };

    // 4. 如果提供了 userId，附加学习状态
    if (userId) {
      const progressResult = await db.collection('user_vocabulary_progress')
        .where({ userId, vocabularyId: detail.vocabularyId }) // 确保ID匹配
        .limit(1)
        .get();

      if (progressResult.data.length > 0) {
        const p = progressResult.data[0];
        detail.learningStatus = {
          mastery: p.mastery,
          skipped: p.skipped,
          reviewCount: p.reviewCount,
          lastReviewed: p.lastReviewed,
          nextReviewDate: p.nextReviewDate,
          intervalDays: p.intervalDays,
          easinessFactor: p.easinessFactor,
          isNew: false,
        };
      } else {
        detail.learningStatus = {
          mastery: null,
          skipped: false,
          reviewCount: 0,
          lastReviewed: null,
          nextReviewDate: null,
          intervalDays: 0,
          isNew: true,
        };
      }
    }

    return createResponse(true, detail, '获取词汇详情成功');

  } catch (error) {
    console.error('getVocabularyDetail error:', error);
    return createResponse(false, null, error.message, 'SERVER_ERROR');
  }
}

module.exports = getVocabularyDetail;