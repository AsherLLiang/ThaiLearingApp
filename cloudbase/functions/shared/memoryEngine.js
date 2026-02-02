/**
 * 统一记忆引擎核心模块
 * 支持字母/单词/句子的统一记忆管理
 * 
 * 修复：wx-server-sdk 不支持 getOne()，改用 get() + data[0]
 */

const { calculateSM2 } = require('./sm2');

/**
 * 创建新的记忆记录
 */
async function createMemoryRecord(db, userId, entityType, entityId, isLocked = false) {

    // 验证参数
    if (!userId || !entityType || !entityId) {
        console.error('[createMemoryRecord] 参数缺失:', { userId, entityType, entityId });
        throw new Error('userId, entityType, entityId 都是必需参数');
    }

    const now = new Date();
    const nextReviewAt = isLocked ? null : new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();

    const memoryRecord = {
        userId,
        entityType,
        entityId,
        masteryLevel: 0.0,
        reviewStage: 0,
        easinessFactor: 2.5,
        intervalDays: 1,
        lastReviewAt: null,
        nextReviewAt,
        correctCount: 0,
        wrongCount: 0,
        streakCorrect: 0,
        isLocked,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
    };

    try {
        // 尝试插入
        const result = await db.collection('memory_status').add(memoryRecord);

        console.log('[createMemoryRecord] 创建成功:', { userId, entityType, entityId });

        return {
            _id: result._id,
            ...memoryRecord
        };
    } catch (error) {
        // 如果是重复键错误，查询并返回现有记录
        if (error.errCode === -502001 || error.message.includes('duplicate key')) {
            console.log('[createMemoryRecord] 记录已存在，查询返回:', { userId, entityType, entityId });

            const existingResult = await db.collection('memory_status')
                .where({ userId, entityType, entityId })
                .get();

            if (existingResult.data && existingResult.data.length > 0) {
                return existingResult.data[0];
            }
        }

        // 其他错误继续抛出
        console.error('[createMemoryRecord] 创建失败:', error);
        throw error;
    }
}

/**
 * 获取或创建记忆记录
 * 修复：使用 get() 代替 getOne()
 */
async function getOrCreateMemory(db, userId, entityType, entityId, isLocked = false) {
    // 1. 尝试查询现有记录
    const existingMemory = await db.collection('memory_status')
        .where({
            userId,
            entityType,
            entityId
        })
        .get();

    // 2. 如果存在,直接返回第一条
    if (existingMemory.data && existingMemory.data.length > 0) {
        return existingMemory.data[0];
    }

    // 3. 不存在则创建新记录
    return await createMemoryRecord(db, userId, entityType, entityId, isLocked);
}

/**
 * 更新记忆状态(答题后调用)
 */
async function updateMemoryAfterReview(db, userId, entityType, entityId, quality) {
    console.log('【测试】updateMemoryAfterReview 被调用了！', { userId, quality });
    console.log('=== [updateMemoryAfterReview] 开始 ===');
    console.log('参数:', JSON.stringify({ userId, entityType, entityId, quality }));

    try {
        // 1. 获取当前记忆记录
        console.log('步骤1: 获取记忆记录');
        const memory = await getOrCreateMemory(db, userId, entityType, entityId);
        console.log('记忆记录:', JSON.stringify(memory));

        // 2. 映射质量到SM-2评分
        console.log('步骤2: 映射质量');
        const qualityMap = {
            '陌生': 1,
            '模糊': 3,
            '记得': 5
        };
        const sm2Quality = qualityMap[quality] || 3;
        console.log('SM-2质量:', sm2Quality);

        // 3. 计算新的SM-2参数
        console.log('步骤3: 调用 calculateSM2');
        console.log('调用参数:', {
            quality,
            intervalDays: memory.intervalDays,
            easinessFactor: memory.easinessFactor,
            reviewStage: memory.reviewStage
        });

        const sm2Result = calculateSM2(
            quality,
            memory.intervalDays,
            memory.easinessFactor,
            memory.reviewStage
        );

        console.log('SM-2结果:', JSON.stringify(sm2Result));

        // 4. 更新掌握度
        console.log('步骤4: 计算新掌握度');
        let newMasteryLevel = memory.masteryLevel;
        if (quality === '记得') {
            newMasteryLevel = Math.min(1.0, memory.masteryLevel + 0.15);
        } else if (quality === '模糊') {
            newMasteryLevel = Math.max(0.0, memory.masteryLevel + 0.05);
        } else {
            newMasteryLevel = Math.max(0.0, memory.masteryLevel - 0.2);
        }
        console.log('新掌握度:', newMasteryLevel);

        // 5. 更新连胜和计数
        console.log('步骤5: 计算连胜');
        const newStreakCorrect = quality === '记得' ? memory.streakCorrect + 1 : 0;
        const newCorrectCount = quality === '记得' ? memory.correctCount + 1 : memory.correctCount;
        const newWrongCount = quality === '陌生' ? memory.wrongCount + 1 : memory.wrongCount;

        // 6. 计算下次复习时间
        console.log('步骤6: 计算下次复习时间');
        const now = new Date();
        const nextReviewAt = new Date(now.getTime() + sm2Result.interval * 24 * 60 * 60 * 1000);
        console.log('下次复习时间:', nextReviewAt);

        // 7. 准备更新数据
        console.log('步骤7: 准备更新数据库');
        const updateData = {
            masteryLevel: newMasteryLevel,
            reviewStage: sm2Result.repetitions,
            easinessFactor: sm2Result.easinessFactor,
            intervalDays: sm2Result.interval,
            lastReviewAt: now.toISOString(),
            nextReviewAt: nextReviewAt.toISOString(),
            correctCount: newCorrectCount,
            wrongCount: newWrongCount,
            streakCorrect: newStreakCorrect,
            updatedAt: now.toISOString()
        };

        console.log('更新数据对象:', JSON.stringify(updateData));

        // 检查是否有 undefined
        for (const [key, value] of Object.entries(updateData)) {
            if (value === undefined) {
                console.error(`❌ 发现 undefined 值: ${key}`);
            }
        }

        // 8. 执行更新
        console.log('步骤8: 执行数据库更新');
        await db.collection('memory_status')
            .where({
                userId,
                entityType,
                entityId
            })
            .update({
                data: updateData   // ✅ CloudBase 必须这样写
            });

        console.log('✅ 更新成功');

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

    } catch (error) {
        console.error('❌ [updateMemoryAfterReview] 错误:', error);
        console.error('错误堆栈:', error.stack);
        throw error;
    }
}

/**
 * 获取今日待复习的实体
 */
async function getTodayReviewEntities(db, userId, entityType, limit = 20) {
    const now = new Date();

    const result = await db.collection('memory_status')
        .where({
            userId,
            entityType,
            isLocked: false,
            nextReviewAt: db.command.lte(now)
        })
        .orderBy('nextReviewAt', 'asc')
        .limit(limit)
        .get();

    return result.data || [];
}

/**
 * 检查并解锁下一阶段学习
 */
// async function checkAndUnlockNextStage(db, userId) {

//   if (process.env.FORCE_UNLOCK === 'true') {
//     return {
//       allowed: true,
//       progress: 100,
//       stage: "all",
//       message: '【调试模式】强制解锁'
//     };
//   }

//   // 修复：使用 get() + data[0]
//   const progressResult = await db.collection('user_progress')
//     .where({ userId })
//     .get();

//   if (!progressResult.data || progressResult.data.length === 0) {
//     await initUserProgress(db, userId);
//     return {
//       unlocked: false,
//       stage: 'letter',
//       message: '初始化学习进度成功'
//     };
//   }

//   const progress = progressResult.data[0];

//   if (!progress.letterCompleted) {
//     const letterMemories = await db.collection('memory_status')
//       .where({
//         userId,
//         entityType: 'letter'
//       })
//       .get();

//     const totalLetters = 44;
//     const masteredLetters = letterMemories.data.filter(m => m.masteryLevel >= 0.7).length;
//     const letterProgress = masteredLetters / totalLetters;

//     if (letterProgress >= 0.95) {
//       await db.collection('user_progress').where({ userId }).update({
//         data: {
//           letterCompleted: true,
//           letterProgress: 1.0,
//           wordUnlocked: true,
//           currentStage: 'word',
//           updatedAt: new Date().toISOString()
//         }
//       });

//       await db.collection('memory_status')
//         .where({
//           userId,
//           entityType: 'word',
//           isLocked: true
//         })
//         .update({
//           data: {
//             isLocked: false,
//             nextReviewAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
//           }
//         });

//       return {
//         unlocked: true,
//         stage: 'word',
//         message: '恭喜!字母学习完成,单词学习已解锁!'
//       };
//     }

//     return {
//       unlocked: false,
//       stage: 'letter',
//       progress: letterProgress,
//       remaining: Math.ceil((0.95 - letterProgress) * totalLetters),
//       message: `还需掌握 ${Math.ceil((0.95 - letterProgress) * totalLetters)} 个字母`
//     };
//   }

//   return {
//     unlocked: false,
//     stage: progress.currentStage,
//     message: '继续加油!'
//   };
// }

/**
 * 初始化用户的学习进度记录
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
 * 修复：使用 get() + data[0]
 */
async function checkModuleAccess(db, userId, moduleType) {

    // ✅✅✅【调试总开关：跳过所有学习锁】
    if (process.env.FORCE_UNLOCK === 'true') {
        console.warn('⚠️ FORCE_UNLOCK 已开启, 强制放行模块:', moduleType);
        return {
            allowed: true,
            progress: {
                letterCompleted: true,
                letterProgress: 1,
                wordUnlocked: true,
                sentenceUnlocked: true,
                articleUnlocked: true,
                currentStage: moduleType
            }
        };
    }

    const progressResult = await db.collection('user_progress')
        .where({ userId })
        .get();

    if (!progressResult.data || progressResult.data.length === 0) {
        return {
            allowed: false,
            errorCode: 'USER_PROGRESS_NOT_FOUND',
            message: '用户学习进度不存在,请联系管理员'
        };
    }

    const progress = progressResult.data[0];

    // ✅ 字母模块永远允许访问
    if (moduleType === 'letter') {
        return {
            allowed: true,
            progress
        };
    }

    // ✅ 其他所有模块只依赖 letterCompleted
    if (!progress.letterCompleted) {
        return {
            allowed: false,
            errorCode: 'MODULE_LOCKED',
            message: `请先完成字母学习（当前进度：${Math.round(progress.letterProgress * 100)}%）`,
            progress
        };
    }

    // ✅ 字母完成 → 全部模块放行
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
    // checkAndUnlockNextStage,
    initUserProgress,
    checkModuleAccess
};
