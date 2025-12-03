/**
 * 获取复习统计处理器
 * 
 * 返回用户的学习进度统计数据
 * 
 * @action getReviewStatistics
 */

'use strict';

const { _, vocabularyCollection, progressCollection } = require('../utils/database');
const { MasteryLevel, DAILY_LEARNING_CONFIG } = require('../utils/constants');
const { successResponse, userNotFoundResponse } = require('../utils/response');
const { validateUser } = require('../utils/validators');
const { getTodayRange, getAlgorithmInfo } = require('../utils/sm2');

/**
 * 计算连续学习天数
 * 
 * @param {string} userId - 用户ID
 * @returns {Promise<number>} 连续天数
 */
async function calculateStreak(userId) {
  const { data: recentProgress } = await progressCollection
    .where({ userId })
    .orderBy('lastReviewed', 'desc')
    .limit(100)
    .get();
  
  if (recentProgress.length === 0) {
    return 0;
  }
  
  // 提取有复习记录的日期
  const reviewDates = new Set();
  recentProgress.forEach(p => {
    if (p.lastReviewed) {
      const dateStr = new Date(p.lastReviewed).toISOString().split('T')[0];
      reviewDates.add(dateStr);
    }
  });
  
  // 从今天开始往回数连续天数
  let streak = 0;
  const checkDate = new Date();
  
  for (let i = 0; i < 365; i++) {
    const dateStr = checkDate.toISOString().split('T')[0];
    if (reviewDates.has(dateStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (i === 0) {
      // 今天还没学习，检查昨天
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
}

/**
 * 获取复习进度统计
 * 
 * @param {Object} params
 * @param {string} params.userId - 用户ID
 */
async function getReviewStatistics({ userId }) {
  // 验证用户
  const user = await validateUser(userId);
  if (!user) {
    return userNotFoundResponse();
  }
  
  const { startOfDay, endOfDay } = getTodayRange();
  
  // 获取用户所有进度记录
  const { data: allProgress } = await progressCollection
    .where({ userId })
    .get();
  
  // 统计分析
  let todayReviewedCount = 0;
  let totalLearned = 0;
  let skippedCount = 0;
  const masteryDistribution = {
    [MasteryLevel.UNFAMILIAR]: 0,
    [MasteryLevel.FUZZY]: 0,
    [MasteryLevel.REMEMBERED]: 0,
  };
  
  const dueForReviewNow = [];
  
  allProgress.forEach(progress => {
    // 今日已复习
    if (progress.lastReviewed &&
        progress.lastReviewed >= startOfDay &&
        progress.lastReviewed < endOfDay) {
      todayReviewedCount++;
    }
    
    // 跳过统计
    if (progress.skipped) {
      skippedCount++;
      return;
    }
    
    // 掌握程度分布
    if (progress.mastery && masteryDistribution.hasOwnProperty(progress.mastery)) {
      masteryDistribution[progress.mastery]++;
      totalLearned++;
    }
    
    // 当前需要复习的
    if (progress.nextReviewDate && new Date(progress.nextReviewDate) <= new Date()) {
      dueForReviewNow.push(progress);
    }
  });
  
  // 获取词汇总数
  const { total: totalVocabulary } = await vocabularyCollection.count();
  
  // 计算掌握率
  const masteryRate = totalLearned > 0
    ? ((masteryDistribution[MasteryLevel.REMEMBERED] / totalLearned) * 100).toFixed(1)
    : 0;
  
  // 获取下一个建议复习的单词
  let nextRecommendedWord = null;
  if (dueForReviewNow.length > 0) {
    // 按优先级排序
    const priorityOrder = {
      [MasteryLevel.UNFAMILIAR]: 0,
      [MasteryLevel.FUZZY]: 1,
      [MasteryLevel.REMEMBERED]: 2,
    };
    
    dueForReviewNow.sort((a, b) => {
      return (priorityOrder[a.mastery] ?? 3) - (priorityOrder[b.mastery] ?? 3);
    });
    
    const nextProgress = dueForReviewNow[0];
    const { data: vocabData } = await vocabularyCollection
      .where({ vocabularyId: nextProgress.vocabularyId })
      .limit(1)
      .get();
    
    if (vocabData.length > 0) {
      nextRecommendedWord = {
        vocabularyId: vocabData[0].vocabularyId,
        thaiWord: vocabData[0].thaiWord,
        meaning: vocabData[0].meaning,
        mastery: nextProgress.mastery,
        lastReviewed: nextProgress.lastReviewed,
        reviewCount: nextProgress.reviewCount,
      };
    }
  }
  
  // 计算连续学习天数
  const streakDays = await calculateStreak(userId);
  
  // 计算平均复习次数
  const avgReviewCount = totalLearned > 0
    ? (allProgress.reduce((sum, p) => sum + (p.reviewCount || 0), 0) / totalLearned).toFixed(1)
    : 0;
  
  return successResponse({
    today: {
      reviewed: todayReviewedCount,
      remaining: dueForReviewNow.length,
      target: DAILY_LEARNING_CONFIG.TOTAL_WORDS_LIMIT,
    },
    overall: {
      totalLearned,
      totalVocabulary,
      progressPercentage: ((totalLearned / totalVocabulary) * 100).toFixed(1),
      skipped: skippedCount,
      avgReviewCount: parseFloat(avgReviewCount),
    },
    masteryDistribution,
    masteryRate: parseFloat(masteryRate),
    nextRecommendedWord,
    streakDays,
    algorithmInfo: getAlgorithmInfo(),
  }, '获取统计数据成功');
}

module.exports = { getReviewStatistics };
