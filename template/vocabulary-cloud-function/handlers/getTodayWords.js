/**
 * 获取今日单词处理器
 * 
 * 返回用户今日需要学习/复习的单词列表
 * 
 * @action getTodayWords
 */

'use strict';

const { _, vocabularyCollection, progressCollection } = require('../utils/database');
const { MasteryLevel, DAILY_LEARNING_CONFIG } = require('../utils/constants');
const { successResponse, userNotFoundResponse } = require('../utils/response');
const { validateUser, validatePagination } = require('../utils/validators');

/**
 * 格式化词汇为列表项 (精简版)
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
 * 获取今日单词列表
 * 
 * 业务逻辑:
 * 1. 获取用户所有未划掉的进度记录
 * 2. 筛选今日需复习的单词和新词
 * 3. 按优先级排序: 陌生 > 模糊 > 记得 > 新词
 * 4. 应用分页返回
 * 
 * @param {Object} params
 * @param {string} params.userId - 用户ID (必填)
 * @param {number} params.limit - 返回数量 (默认30)
 * @param {number} params.offset - 分页偏移 (默认0)
 * @param {string} params.level - 难度筛选 (可选)
 */
async function getTodayWords({ userId, limit = 30, offset = 0, level = null }) {
  // 验证用户
  const user = await validateUser(userId);
  if (!user) {
    return userNotFoundResponse();
  }
  
  // 验证分页
  const pagination = validatePagination(limit, offset);
  
  // Step 1: 获取用户所有未划掉的进度记录
  const { data: allProgress } = await progressCollection
    .where({
      userId,
      skipped: _.neq(true),
    })
    .get();
  
  // Step 2: 分离需要复习的词和已学习的词
  const dueForReview = [];
  const learnedVocabIds = new Set();
  const now = new Date();
  
  allProgress.forEach(progress => {
    learnedVocabIds.add(progress.vocabularyId);
    
    // 检查是否今日需要复习
    if (progress.nextReviewDate && new Date(progress.nextReviewDate) <= now) {
      dueForReview.push(progress);
    }
  });
  
  // Step 3: 获取新词 (用户从未学过的词汇)
  let newWordsQuery = vocabularyCollection.where({
    vocabularyId: _.nin([...learnedVocabIds]),
  });
  
  if (level) {
    newWordsQuery = newWordsQuery.where({ level });
  }
  
  const { data: newVocabularies } = await newWordsQuery
    .orderBy('lessonNumber', 'asc')
    .limit(DAILY_LEARNING_CONFIG.MAX_NEW_WORDS)
    .get();
  
  // Step 4: 按优先级排序复习词 (陌生 > 模糊 > 记得)
  const priorityOrder = {
    [MasteryLevel.UNFAMILIAR]: 0,
    [MasteryLevel.FUZZY]: 1,
    [MasteryLevel.REMEMBERED]: 2,
  };
  
  dueForReview.sort((a, b) => {
    return (priorityOrder[a.mastery] ?? 3) - (priorityOrder[b.mastery] ?? 3);
  });
  
  // Step 5: 组合今日单词列表
  const todayList = [];
  
  // 添加需要复习的词
  if (dueForReview.length > 0) {
    const reviewVocabIds = dueForReview.map(p => p.vocabularyId);
    const { data: reviewVocabs } = await vocabularyCollection
      .where({ vocabularyId: _.in(reviewVocabIds) })
      .get();
    
    const vocabMap = new Map(reviewVocabs.map(v => [v.vocabularyId, v]));
    
    dueForReview.forEach(progress => {
      const vocab = vocabMap.get(progress.vocabularyId);
      if (vocab) {
        todayList.push({
          ...formatVocabularyForList(vocab),
          learningStatus: {
            mastery: progress.mastery,
            reviewCount: progress.reviewCount,
            lastReviewed: progress.lastReviewed,
            nextReviewDate: progress.nextReviewDate,
            intervalDays: progress.intervalDays,
            isReview: true,
            isNew: false,
          },
        });
      }
    });
  }
  
  // 添加新词
  newVocabularies.forEach(vocab => {
    todayList.push({
      ...formatVocabularyForList(vocab),
      learningStatus: {
        mastery: null,
        reviewCount: 0,
        lastReviewed: null,
        nextReviewDate: null,
        intervalDays: 0,
        isReview: false,
        isNew: true,
      },
    });
  });
  
  // Step 6: 应用分页
  const paginatedList = todayList.slice(pagination.offset, pagination.offset + pagination.limit);
  
  return successResponse({
    words: paginatedList,
    pagination: {
      total: todayList.length,
      limit: pagination.limit,
      offset: pagination.offset,
      hasMore: pagination.offset + pagination.limit < todayList.length,
    },
    summary: {
      reviewCount: dueForReview.length,
      newCount: newVocabularies.length,
      totalToday: todayList.length,
    },
  }, '获取今日单词成功');
}

module.exports = { getTodayWords };
