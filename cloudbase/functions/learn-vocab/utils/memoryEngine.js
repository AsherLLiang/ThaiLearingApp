/**
 * 统一记忆引擎核心模块
 * 支持字母/单词/句子的统一记忆管理
 */

const { calculateSM2 } = require('./sm2');

/**
 * 创建新的记忆记录
 * @param {Object} db - 数据库实例
 * @param {string} userId - 用户ID
 * @param {string} entityType - 实体类型: 'letter' | 'word' | 'sentence'
 * @param {string} entityId - 实体ID
 * @param {boolean} isLocked - 是否锁定
 * @returns {Promise<Object>} 创建的记忆记录
 */
async function createMemoryRecord(db, userId, entityType, entityId, isLocked = false) {
  const now = new Date();
  const nextReviewAt = isLocked ? null : new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24小时后

  const memoryRecord = {
    userId,
    entityType,
    entityId,
    masteryLevel: 0.0,
    reviewStage: 0,
    easinessFactor: 2.5, // SM-2标准初始值
    intervalDays: 1,
    lastReviewAt: null,
    nextReviewAt,
    correctCount: 0,
    wrongCount: 0,
    streakCorrect: 0,
    isLocked,
    createdAt: now,
    updatedAt: now
  };

  const result = await db.collection('memory_status').add(memoryRecord);
  
  return {
    _id: result.id,
    ...memoryRecord
  };
}

/**
 * 获取或创建记忆记录
 * @param {Object} db - 数据库实例
 * @param {string} userId - 用户ID
 * @param {string} entityType - 实体类型
 * @param {string} entityId - 实体ID
 * @param {boolean} isLocked - 是否锁定(仅用于创建时)
 * @returns {Promise<Object>} 记忆记录
 */
async function getOrCreateMemory(db, userId, entityType, entityId, isLocked = false) {
  // 1. 尝试查询现有记录
  const existingMemory = await db.collection('memory_status')
    .where({
      userId,
      entityType,
      entityId
    })
    .getOne();

  // 2. 如果存在,直接返回
  if (existingMemory.data) {
    return existingMemory.data;
  }

  // 3. 不存在则创建新记录
  return await createMemoryRecord(db, userId, entityType, entityId, isLocked);
}

/**
 * 更新记忆状态(答题后调用)
 * @param {Object} db - 数据库实例
 * @param {string} userId - 用户ID
 * @param {string} entityType - 实体类型
 * @param {string} entityId - 实体ID
 * @param {string} quality - 答题质量: '陌生' | '模糊' | '记得'
 * @returns {Promise<Object>} 更新后的记忆状态
 */
async function updateMemoryAfterReview(db, userId, entityType, entityId, quality) {
  // 1. 获取当前记忆记录
  const memory = await getOrCreateMemory(db, userId, entityType, entityId);

  // 2. 映射质量到SM-2评分 (0-5)
  const qualityMap = {
    '陌生': 1,  // 完全不记得
    '模糊': 3,  // 有印象但不确定
    '记得': 5   // 完全记得
  };
  const sm2Quality = qualityMap[quality] || 3;

  // 3. 计算新的SM-2参数
  const sm2Result = calculateSM2({
    quality: sm2Quality,
    easinessFactor: memory.easinessFactor,
    interval: memory.intervalDays,
    repetitions: memory.reviewStage
  });

  // 4. 更新掌握度
  let newMasteryLevel = memory.masteryLevel;
  if (quality === '记得') {
    newMasteryLevel = Math.min(1.0, memory.masteryLevel + 0.15);
  } else if (quality === '模糊') {
    newMasteryLevel = Math.max(0.0, memory.masteryLevel + 0.05);
  } else { // 陌生
    newMasteryLevel = Math.max(0.0, memory.masteryLevel - 0.2);
  }

  // 5. 更新连胜和计数
  const newStreakCorrect = quality === '记得' ? memory.streakCorrect + 1 : 0;
  const newCorrectCount = quality === '记得' ? memory.correctCount + 1 : memory.correctCount;
  const newWrongCount = quality === '陌生' ? memory.wrongCount + 1 : memory.wrongCount;

  // 6. 计算下次复习时间
  const now = new Date();
  const nextReviewAt = new Date(now.getTime() + sm2Result.interval * 24 * 60 * 60 * 1000);

  // 7. 更新数据库
  await db.collection('memory_status')
    .where({
      userId,
      entityType,
      entityId
    })
    .update({
      masteryLevel: newMasteryLevel,
      reviewStage: sm2Result.repetitions,
      easinessFactor: sm2Result.easinessFactor,
      intervalDays: sm2Result.interval,
      lastReviewAt: now,
      nextReviewAt,
      correctCount: newCorrectCount,
      wrongCount: newWrongCount,
      streakCorrect: newStreakCorrect,
      updatedAt: now
    });

  // 8. 返回更新后的状态
  return {
    entityId,
    entityType,
    masteryLevel: newMasteryLevel,
    reviewStage: sm2Result.repetitions,
    easinessFactor: sm2Result.easinessFactor,
    intervalDays: sm2Result.interval,
    nextReviewAt: nextReviewAt.toISOString(),
    correctCount: newCorrectCount,
    wrongCount: newWrongCount,
    streakCorrect: newStreakCorrect
  };
}

/**
 * 获取今日待复习的实体
 * @param {Object} db - 数据库实例
 * @param {string} userId - 用户ID
 * @param {string} entityType - 实体类型
 * @param {number} limit - 返回数量限制
 * @returns {Promise<Array>} 待复习实体ID列表
 */
async function getTodayReviewEntities(db, userId, entityType, limit = 20) {
  const now = new Date();

  // 查询今日需要复习的实体
  const result = await db.collection('memory_status')
    .where({
      userId,
      entityType,
      isLocked: false,
      nextReviewAt: db.command.lte(now)
    })
    .orderBy('nextReviewAt', 'asc') // 最早该复习的优先
    .limit(limit)
    .get();

  return result.data || [];
}

/**
 * 检查并解锁下一阶段学习
 * @param {Object} db - 数据库实例
 * @param {string} userId - 用户ID
 * @returns {Promise<Object>} 解锁结果
 */
async function checkAndUnlockNextStage(db, userId) {
  // 1. 获取用户进度
  const progressResult = await db.collection('user_progress')
    .where({ userId })
    .getOne();

  if (!progressResult.data) {
    throw new Error('用户进度记录不存在');
  }

  const progress = progressResult.data;

  // 2. 检查字母学习完成度
  if (!progress.letterCompleted) {
    const letterMemories = await db.collection('memory_status')
      .where({
        userId,
        entityType: 'letter'
      })
      .get();

    const totalLetters = 44; // 泰语字母总数
    const masteredLetters = letterMemories.data.filter(m => m.masteryLevel >= 0.7).length;
    const letterProgress = masteredLetters / totalLetters;

    if (letterProgress >= 0.95) {
      // 解锁单词学习
      await db.collection('user_progress').where({ userId }).update({
        letterCompleted: true,
        letterProgress: 1.0,
        wordUnlocked: true,
        currentStage: 'word',
        updatedAt: new Date()
      });

      // 解锁所有单词的isLocked状态
      await db.collection('memory_status')
        .where({
          userId,
          entityType: 'word',
          isLocked: true
        })
        .update({
          isLocked: false,
          nextReviewAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
        });

      return {
        unlocked: true,
        stage: 'word',
        message: '恭喜!字母学习完成,单词学习已解锁!'
      };
    }

    return {
      unlocked: false,
      stage: 'letter',
      progress: letterProgress,
      remaining: Math.ceil((0.95 - letterProgress) * totalLetters),
      message: `还需掌握 ${Math.ceil((0.95 - letterProgress) * totalLetters)} 个字母`
    };
  }

  // 3. 检查单词学习完成度(未来扩展)
  // ... 类似字母的逻辑

  return {
    unlocked: false,
    stage: progress.currentStage,
    message: '继续加油!'
  };
}

/**
 * 初始化用户的学习进度记录
 * @param {Object} db - 数据库实例
 * @param {string} userId - 用户ID
 * @returns {Promise<Object>} 创建的进度记录
 */
async function initUserProgress(db, userId) {
  const now = new Date();

  const progressRecord = {
    userId,
    letterCompleted: false,
    letterProgress: 0.0,
    wordUnlocked: false,
    wordProgress: 0.0,
    sentenceUnlocked: false,
    sentenceProgress: 0.0,
    articleUnlocked: false,
    currentStage: 'letter',
    totalStudyDays: 0,
    streakDays: 0,
    lastStudyDate: null,
    createdAt: now,
    updatedAt: now
  };

  await db.collection('user_progress').add(progressRecord);
  return progressRecord;
}

/**
 * 检查模块访问权限
 * @param {Object} db - 数据库实例
 * @param {string} userId - 用户ID
 * @param {string} moduleType - 模块类型: 'letter' | 'word' | 'sentence' | 'article'
 * @returns {Promise<Object>} 权限检查结果
 */
async function checkModuleAccess(db, userId, moduleType) {
  const progressResult = await db.collection('user_progress')
    .where({ userId })
    .getOne();

  if (!progressResult.data) {
    return {
      allowed: false,
      errorCode: 'USER_PROGRESS_NOT_FOUND',
      message: '用户学习进度不存在,请联系管理员'
    };
  }

  const progress = progressResult.data;

  // 访问规则
  const accessRules = {
    letter: () => true, // 字母始终可访问
    word: () => progress.wordUnlocked,
    sentence: () => progress.sentenceUnlocked,
    article: () => progress.articleUnlocked
  };

  const allowed = accessRules[moduleType]?.() ?? false;

  if (!allowed) {
    const messages = {
      word: `请先完成字母学习 (当前进度: ${Math.round(progress.letterProgress * 100)}%)`,
      sentence: '请先掌握至少300个单词',
      article: '请先完成句子练习'
    };

    return {
      allowed: false,
      errorCode: 'MODULE_LOCKED',
      message: messages[moduleType],
      currentStage: progress.currentStage,
      progress
    };
  }

  return {
    allowed: true,
    progress
  };
}

module.exports = {
  createMemoryRecord,
  getOrCreateMemory,
  updateMemoryAfterReview,
  getTodayReviewEntities,
  checkAndUnlockNextStage,
  initUserProgress,
  checkModuleAccess
};