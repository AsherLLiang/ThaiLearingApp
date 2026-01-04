/**
 * 获取用户学习进度
 * Action: getUserProgress
 */
'use strict';

const { createResponse } = require('../utils/response');

/**
 * @param {Object} db - 数据库实例
 * @param {Object} params - 请求参数
 */
async function getUserProgress(db, params) {
  const { userId } = params;

  // 🔍 调试日志：打印收到的 userId
  console.log('📥 [getUserProgress] 收到请求，userId:', userId);

  if (!userId) {
    return createResponse(false, null, 'Missing userId', 'INVALID_PARAMS');
  }

  try {
    // 2. 获取用户进度记录
    // ❌ 修正: 不要用 getOne(), 用 limit(1).get()
    const progressResult = await db.collection('user_progress')
      .where({ userId })
      .limit(1)
      .get();

    if (!progressResult.data || progressResult.data.length === 0) {
      return createResponse(false, null, '用户进度记录不存在', 'USER_PROGRESS_NOT_FOUND');
    }

    const progress = progressResult.data[0];

    // 🔥 获取字母模块专属进度（包含 currentRound）
    let alphabetProgress = null;
    if (params.entityType === 'letter') {
      const alphabetProgressResult = await db.collection('user_alphabet_progress')
        .where({ userId })
        .limit(1)
        .get();

      console.log('📊 [getUserProgress] alphabetProgressResult:', {
        found: alphabetProgressResult.data?.length > 0,
        data: alphabetProgressResult.data?.[0]
      });

      if (alphabetProgressResult.data && alphabetProgressResult.data.length > 0) {
        alphabetProgress = alphabetProgressResult.data[0];
        console.log('📊 [getUserProgress] alphabetProgress.currentRound:', alphabetProgress.currentRound);
      } else {
        console.log('⚠️ [getUserProgress] No alphabet progress found for user:', userId);
      }
    }

    // 3. 统计各模块学习数据
    // 注意: 如果数据量很大，count() 比 get() 更高效
    const letterCountResult = await db.collection('memory_status')
      .where({ userId, entityType: 'letter' })
      .count();

    const letterMasteredResult = await db.collection('memory_status')
      .where({ userId, entityType: 'letter', masteryLevel: db.command.gte(0.7) })
      .count();

    const wordCountResult = await db.collection('memory_status')
      .where({ userId, entityType: 'word' })
      .count();

    const wordMasteredResult = await db.collection('memory_status')
      .where({ userId, entityType: 'word', masteryLevel: db.command.gte(0.7) })
      .count();

    // 4. 组装
    const result = {
      ...progress,
      // 🔥 合并字母模块专属字段（currentRound）
      ...(alphabetProgress ? { currentRound: alphabetProgress.currentRound } : {}),
      statistics: {
        letter: {
          total: 44,
          learned: letterCountResult.total,
          mastered: letterMasteredResult.total,
          progress: letterCountResult.total > 0 ? (letterMasteredResult.total / 44).toFixed(2) : 0
        },
        word: {
          total: 3500,
          learned: wordCountResult.total,
          mastered: wordMasteredResult.total,
          progress: wordCountResult.total > 0 ? (wordMasteredResult.total / 3500).toFixed(2) : 0
        }
      },
      unlockStatus: {
        letter: true,
        word: progress.wordUnlocked,
        sentence: progress.sentenceUnlocked,
        article: progress.articleUnlocked
      }
    };

    // 与前端约定：data.progress 为进度对象
    return createResponse(true, { progress: result }, '获取用户进度成功');

  } catch (error) {
    console.error('getUserProgress error:', error);
    return createResponse(false, null, error.message, 'SERVER_ERROR');
  }
}

module.exports = getUserProgress;
