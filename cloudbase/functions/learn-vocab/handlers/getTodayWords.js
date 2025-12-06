/**
 * 获取今日单词处理器
 * 
 * 返回用户今日需要学习/复习的单词列表
 * 
 * @action getTodayWords
 */

'use strict';

const { createResponse } = require('../utils/response');
const {
  COLLECTIONS,
  MasteryLevel,
  SM2_PARAMS,
  EARLY_INTERVALS,
  DAILY_LEARNING_CONFIG
} = require('../utils/constants');

/**
 * 格式化词汇为列表项 (精简版)
 */
function formatVocabularyForList(vocab) {
  return {
    vocabularyId: vocab._id || vocab.vocabularyId,
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
 * 1. 检查用户是否完成字母学习
 * 2. 获取用户所有未划掉的进度记录
 * 3. 筛选今日需复习的单词和新词
 * 4. 按优先级排序: 陌生 > 模糊 > 记得 > 新词
 * 5. 应用分页返回
 */
async function getTodayWords(db, params) {
  const { userId, limit = 30, offset = 0, level = null } = params;

  // 验证参数
  if (!userId) {
    return createResponse(false, null, '缺少用户ID', 'INVALID_PARAMS');
  }

  try {
    // ===== Step 1: 检查用户是否存在 =====
    const userResult = await db.collection('users')
      .where({ userId })
      .get();

    if (!userResult.data || userResult.data.length === 0) {
      return createResponse(false, null, '用户不存在', 'USER_NOT_FOUND');
    }

    // ===== Step 2: 检查用户是否完成字母学习（权限检查）=====
    const { checkModuleAccess } = require('../utils/memoryEngine');
    const accessResult = await checkModuleAccess(db, userId, 'word');

    if (!accessResult.allowed) {
      return createResponse(
        false,
        null,
        accessResult.message,
        accessResult.errorCode
      );
    }

    // ===== Step 3: 获取用户所有未划掉的进度记录 =====
    const allProgressResult = await db.collection('user_vocabulary_progress')
      .where({
        userId,
        skipped: db.command.neq(true)
      })
      .get();

    const allProgress = allProgressResult.data || [];

    // ===== Step 4: 分离需要复习的词和已学习的词 =====
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

    // ===== Step 5: 获取新词 (用户从未学过的词汇) =====
    const maxNewWords = DAILY_LEARNING_CONFIG?.MAX_NEW_WORDS || 10;

    let newWordsQuery = db.collection('vocabulary');

    if (learnedVocabIds.size > 0) {
      newWordsQuery = newWordsQuery.where({
        _id: db.command.nin([...learnedVocabIds])
      });
    }

    if (level) {
      newWordsQuery = newWordsQuery.where({ level });
    }

    const newVocabsResult = await newWordsQuery
      .orderBy('lessonNumber', 'asc')
      .limit(maxNewWords)
      .get();

    const newVocabularies = newVocabsResult.data || [];

    // ===== Step 6: 按优先级排序复习词 (陌生 > 模糊 > 记得) =====
    const priorityOrder = {
      [MasteryLevel.UNFAMILIAR]: 0,
      [MasteryLevel.FUZZY]: 1,
      [MasteryLevel.REMEMBERED]: 2,
    };

    dueForReview.sort((a, b) => {
      return (priorityOrder[a.mastery] ?? 3) - (priorityOrder[b.mastery] ?? 3);
    });

    // ===== Step 7: 组合今日单词列表 =====
    const todayList = [];

    // 添加需要复习的词
    if (dueForReview.length > 0) {
      const reviewVocabIds = dueForReview.map(p => p.vocabularyId);
      const reviewVocabsResult = await db.collection('vocabulary')
        .where({ _id: db.command.in(reviewVocabIds) })
        .get();

      const vocabMap = new Map(
        (reviewVocabsResult.data || []).map(v => [v._id, v])
      );

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

    // ===== Step 8: 应用分页 =====
    const totalCount = todayList.length;
    const validOffset = Math.max(0, offset);
    const validLimit = Math.max(1, Math.min(limit, 100));

    const paginatedList = todayList.slice(validOffset, validOffset + validLimit);

    return createResponse(true, {
      words: paginatedList,
      pagination: {
        total: totalCount,
        limit: validLimit,
        offset: validOffset,
        hasMore: validOffset + validLimit < totalCount,
      },
      summary: {
        reviewCount: dueForReview.length,
        newCount: newVocabularies.length,
        totalToday: totalCount,
      },
    }, '获取今日单词成功');

  } catch (error) {
    console.error('getTodayWords error:', error);
    return createResponse(false, null, error.message || '服务器错误', 'SERVER_ERROR');
  }
}

module.exports = getTodayWords;