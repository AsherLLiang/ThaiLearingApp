/**
 * 获取复习统计处理器
 * 
 * 返回用户的学习进度统计数据
 * 
 * @action getReviewStatistics
 */

'use strict';

const { createResponse } = require('../utils/response');
const { MasteryLevel, DAILY_LEARNING_CONFIG } = require('../utils/constants');

/**
 * 计算连续学习天数
 */
async function calculateStreak(db, userId) {
  const recentProgress = await db.collection('user_vocabulary_progress')
    .where({ userId })
    .orderBy('lastReviewed', 'desc')
    .limit(100)
    .get();
  
  if (!recentProgress.data || recentProgress.data.length === 0) {
    return 0;
  }
  
  const reviewDates = new Set();
  recentProgress.data.forEach(p => {
    if (p.lastReviewed) {
      const dateStr = new Date(p.lastReviewed).toISOString().split('T')[0];
      reviewDates.add(dateStr);
    }
  });
  
  let streak = 0;
  const checkDate = new Date();
  
  for (let i = 0; i < 365; i++) {
    const dateStr = checkDate.toISOString().split('T')[0];
    if (reviewDates.has(dateStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (i === 0) {
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
}

/**
 * 获取复习进度统计
 */
async function getReviewStatistics(db, params) {
  const { userId } = params;
  
  if (!userId) {
    return createResponse(false, null, '缺少用户ID', 'INVALID_PARAMS');
  }
  
  try {
    // 验证用户
    const userResult = await db.collection('users')
      .where({ userId })
      .get();
    
    if (!userResult.data || userResult.data.length === 0) {
      return createResponse(false, null, '用户不存在', 'USER_NOT_FOUND');
    }
    
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    
    // 获取用户所有进度记录
    const allProgress = await db.collection('user_vocabulary_progress')
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
    
    (allProgress.data || []).forEach(progress => {
      if (progress.lastReviewed &&
          new Date(progress.lastReviewed) >= startOfDay &&
          new Date(progress.lastReviewed) < endOfDay) {
        todayReviewedCount++;
      }
      
      if (progress.skipped) {
        skippedCount++;
        return;
      }
      
      if (progress.mastery && masteryDistribution.hasOwnProperty(progress.mastery)) {
        masteryDistribution[progress.mastery]++;
        totalLearned++;
      }
      
      if (progress.nextReviewDate && new Date(progress.nextReviewDate) <= now) {
        dueForReviewNow.push(progress);
      }
    });
    
    // 获取词汇总数
    const totalVocabResult = await db.collection('vocabulary').count();
    const totalVocabulary = totalVocabResult.total || 0;
    
    // 计算掌握率
    const masteryRate = totalLearned > 0
      ? ((masteryDistribution[MasteryLevel.REMEMBERED] / totalLearned) * 100).toFixed(1)
      : 0;
    
    // 获取下一个建议复习的单词
    let nextRecommendedWord = null;
    if (dueForReviewNow.length > 0) {
      const priorityOrder = {
        [MasteryLevel.UNFAMILIAR]: 0,
        [MasteryLevel.FUZZY]: 1,
        [MasteryLevel.REMEMBERED]: 2,
      };
      
      dueForReviewNow.sort((a, b) => {
        return (priorityOrder[a.mastery] ?? 3) - (priorityOrder[b.mastery] ?? 3);
      });
      
      const nextProgress = dueForReviewNow[0];
      const vocabResult = await db.collection('vocabulary')
        .where({ _id: nextProgress.vocabularyId })
        .limit(1)
        .get();
      
      if (vocabResult.data && vocabResult.data.length > 0) {
        const vocab = vocabResult.data[0];
        nextRecommendedWord = {
          vocabularyId: vocab._id,
          thaiWord: vocab.thaiWord,
          meaning: vocab.meaning,
          mastery: nextProgress.mastery,
          lastReviewed: nextProgress.lastReviewed,
          reviewCount: nextProgress.reviewCount,
        };
      }
    }
    
    // 计算连续学习天数
    const streakDays = await calculateStreak(db, userId);
    
    // 计算平均复习次数
    const avgReviewCount = totalLearned > 0
      ? ((allProgress.data || []).reduce((sum, p) => sum + (p.reviewCount || 0), 0) / totalLearned).toFixed(1)
      : 0;
    
    return createResponse(true, {
      today: {
        reviewed: todayReviewedCount,
        remaining: dueForReviewNow.length,
        target: DAILY_LEARNING_CONFIG.TOTAL_WORDS_LIMIT,
      },
      overall: {
        totalLearned,
        totalVocabulary,
        progressPercentage: totalVocabulary > 0 ? ((totalLearned / totalVocabulary) * 100).toFixed(1) : 0,
        skipped: skippedCount,
        avgReviewCount: parseFloat(avgReviewCount),
      },
      masteryDistribution,
      masteryRate: parseFloat(masteryRate),
      nextRecommendedWord,
      streakDays,
    }, '获取统计数据成功');
    
  } catch (error) {
    console.error('getReviewStatistics error:', error);
    return createResponse(false, null, error.message, 'SERVER_ERROR');
  }
}

module.exports = getReviewStatistics;