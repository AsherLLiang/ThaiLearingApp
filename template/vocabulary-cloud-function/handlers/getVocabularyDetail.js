/**
 * 获取词汇详情处理器
 * 
 * 返回单词的完整学习内容
 * 
 * @action getVocabularyDetail
 */

'use strict';

const { progressCollection } = require('../utils/database');
const { successResponse, vocabularyNotFoundResponse } = require('../utils/response');
const { validateVocabulary } = require('../utils/validators');

/**
 * 获取词汇详细信息
 * 
 * @param {Object} params
 * @param {string} params.vocabularyId - 词汇ID (必填)
 * @param {string} params.userId - 用户ID (可选，用于获取学习状态)
 */
async function getVocabularyDetail({ vocabularyId, userId = null }) {
  // 验证词汇
  const vocabulary = await validateVocabulary(vocabularyId);
  if (!vocabulary) {
    return vocabularyNotFoundResponse();
  }
  
  // 构建详细响应
  const detail = {
    // 基本信息
    vocabularyId: vocabulary.vocabularyId,
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
  
  // 如果提供了 userId，附加学习状态
  if (userId) {
    const { data: progress } = await progressCollection
      .where({ userId, vocabularyId })
      .limit(1)
      .get();
    
    if (progress.length > 0) {
      const p = progress[0];
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
  
  return successResponse(detail, '获取词汇详情成功');
}

module.exports = { getVocabularyDetail };
