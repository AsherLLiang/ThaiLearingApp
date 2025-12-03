/**
 * 获取已划掉单词处理器
 * 
 * 返回用户已划掉的单词列表
 * 
 * @action getSkippedWords
 */

'use strict';

const { _, vocabularyCollection, progressCollection } = require('../utils/database');
const { successResponse, userNotFoundResponse } = require('../utils/response');
const { validateUser, validatePagination } = require('../utils/validators');

/**
 * 格式化词汇为列表项
 */
function formatVocabularyForList(vocab) {
  return {
    vocabularyId: vocab.vocabularyId,
    thaiWord: vocab.thaiWord,
    meaning: vocab.meaning,
    pronunciation: vocab.pronunciation,
    audioPath: vocab.audioPath,
    partOfSpeech: vocab.partOfSpeech,
    level: vocab.level,
    lessonNumber: vocab.lessonNumber,
  };
}

/**
 * 获取已划掉的单词列表
 * 
 * @param {Object} params
 * @param {string} params.userId - 用户ID
 * @param {number} params.limit - 返回数量
 * @param {number} params.offset - 分页偏移
 */
async function getSkippedWords({ userId, limit = 20, offset = 0 }) {
  // 验证用户
  const user = await validateUser(userId);
  if (!user) {
    return userNotFoundResponse();
  }
  
  // 验证分页
  const pagination = validatePagination(limit, offset);
  
  // 获取总数
  const { total } = await progressCollection
    .where({ userId, skipped: true })
    .count();
  
  // 查询已划掉的进度记录
  const { data: skippedProgress } = await progressCollection
    .where({ userId, skipped: true })
    .skip(pagination.offset)
    .limit(pagination.limit)
    .get();
  
  if (skippedProgress.length === 0) {
    return successResponse({
      words: [],
      pagination: {
        total: 0,
        limit: pagination.limit,
        offset: pagination.offset,
        hasMore: false,
      },
    }, '没有已划掉的单词');
  }
  
  // 获取对应的词汇信息
  const vocabIds = skippedProgress.map(p => p.vocabularyId);
  const { data: vocabularies } = await vocabularyCollection
    .where({ vocabularyId: _.in(vocabIds) })
    .get();
  
  // 合并数据
  const vocabMap = new Map(vocabularies.map(v => [v.vocabularyId, v]));
  const words = skippedProgress
    .map(progress => {
      const vocab = vocabMap.get(progress.vocabularyId);
      if (!vocab) return null;
      
      return {
        ...formatVocabularyForList(vocab),
        skippedAt: progress.updatedAt,
        previousMastery: progress.mastery,
        previousReviewCount: progress.reviewCount,
      };
    })
    .filter(Boolean);
  
  return successResponse({
    words,
    pagination: {
      total,
      limit: pagination.limit,
      offset: pagination.offset,
      hasMore: pagination.offset + pagination.limit < total,
    },
  }, '获取已划掉单词成功');
}

module.exports = { getSkippedWords };
