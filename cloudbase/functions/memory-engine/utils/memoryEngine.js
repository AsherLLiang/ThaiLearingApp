/**
 * 统一记忆引擎核心模块
 * 支持字母/单词/句子的统一记忆管理
 * 
 */

const { calculateSM2Optimized, masteryToQuality } = require('./sm2');

/**
 * 创建新的记忆记录,并写入 memory_status 集合,不做导出
 * @param {Object} db - 数据库实例
 * @param {string} userId - 用户ID
 * @param {string} entityType - 实体类型
 * @param {string} entityId - 实体ID
 * @param {boolean} isLocked - 是否锁定
 * @returns {Promise<Object>} - 记忆记录
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
        userId,               // 用户ID
        entityType,           // 实体类型
        entityId,             // 实体ID
        masteryLevel: 0.0,    // 掌握度
        reviewStage: 0,       // 0: 初始状态，1: 已复习
        easinessFactor: 2.5,  // 易度因子,SM-2 算法的标准初始难度（2.5表示中等难度）
        intervalDays: 1,      // 间隔天数
        lastReviewAt: null,   // 上次复习时间
        nextReviewAt,         // 下次复习时间
        correctCount: 0,      // 正确次数
        wrongCount: 0,        // 错误次数
        streakCorrect: 0,     // 连续正确次数
        isLocked,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
    };

    try {
        // 数据库写入记忆状态到 memory_status 集合
        const result = await db.collection('memory_status').add(memoryRecord);// 入记忆状态到 memory_status 集合

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
 * 获取已有的memory_status记录，若没有则调用 createMemoryRecord 创建新记录
 * @param {Object} db - 数据库实例
 * @param {string} userId - 用户ID
 * @param {string} entityType - 实体类型
 * @param {string} entityId - 实体ID
 * @param {boolean} isLocked - 是否锁定
 * @returns {Promise<Object>} - 记忆记录
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
 * @param {Object} db - 数据库实例
 * @param {string} userId - 用户ID
 * @param {string} entityType - 实体类型
 * @param {string} entityId - 实体ID
 * @param {string} quality - 答题质量
 * @returns {Promise<Object>} - 更新后的记忆记录
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

        const sm2Quality = masteryToQuality(quality);
        console.log('SM-2质量:', sm2Quality);

        // 3. 计算新的SM-2参数
        console.log('步骤3: 调用 calculateSM2Optimized');
        console.log('调用参数:', {
            quality,
            intervalDays: memory.intervalDays,
            easinessFactor: memory.easinessFactor,
            reviewStage: memory.reviewStage
        });
        const sm2Result = calculateSM2Optimized(
            quality,
            memory.intervalDays,
            memory.easinessFactor,
            memory.reviewStage
        );

        console.log('SM-2结果:', JSON.stringify(sm2Result));

        // 4. 更新掌握度
        console.log('步骤4: 计算新掌握度');
        let newMasteryLevel = memory.masteryLevel;
        if (sm2Quality >= 4) {
            newMasteryLevel = Math.min(1.0, memory.masteryLevel + 0.15);
        } else if (sm2Quality >= 2) {
            newMasteryLevel = Math.max(0.0, memory.masteryLevel + 0.05);
        } else {
            newMasteryLevel = Math.max(0.0, memory.masteryLevel - 0.2);
        }
        console.log('新掌握度:', newMasteryLevel);

        // 5. 更新连胜和计数
        console.log('步骤5: 计算连胜');
        const newStreakCorrect = sm2Quality >= 4 ? memory.streakCorrect + 1 : 0;
        const newCorrectCount = sm2Quality >= 4 ? memory.correctCount + 1 : memory.correctCount;
        const newWrongCount = sm2Quality < 2 ? memory.wrongCount + 1 : memory.wrongCount;

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
 * @param {Object} db - 数据库实例
 * @param {string} userId - 用户ID
 * @param {string} entityType - 实体类型
 * @param {number} limit - 限制数量
 * @returns {Promise<Array>} - 待复习实体列表
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
 * 初始化用户的学习进度记录
 * @param {Object} db - 数据库实例
 * @param {string} userId - 用户ID
 * @returns {progressRecord} - 初始化后的学习进度记录
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
 * @param {string} moduleType - 模块类型
 * @returns {Promise<Object>} - 检查结果
 */
async function checkModuleAccess(db, userId, moduleType) {
    const forceUnlock = process.env.FORCE_UNLOCK === 'true';

    // 特殊处理：开发阶段的本地测试用户
    // 前端在未登录情况下会使用 userId = 'test-user' 进入字母模块，
    // 此时 CloudBase 中并不存在对应的 user / user_progress 记录，
    // 如果直接访问数据库会触发各种约束错误（例如唯一索引）。
    //
    // 这里直接放行该用户，并返回一个最小化的进度对象，仅用于本地调试。
    if (userId === 'test-user') {
        console.warn('ℹ️ checkModuleAccess: 使用开发测试用户 test-user, 直接放行模块:', moduleType);
        const progress = {
            userId,
            letterCompleted: false,
            letterProgress: 0,
            wordUnlocked: false,
            wordProgress: 0,
            sentenceUnlocked: false,
            sentenceProgress: 0,
            articleUnlocked: false,
            articleProgress: 0,
            currentStage: moduleType,
        };
        return {
            allowed: true,
            progress,
        };
    }

    // 1. 获取用户进度记录
    const progressResult = await db.collection('user_progress')
        .where({ userId })
        .limit(1)
        .get();

    if (!progressResult.data || progressResult.data.length === 0) {
        // 没有进度记录：
        // - 如果开启 FORCE_UNLOCK，仍然放行并返回一个默认进度对象；
        // - 如果是字母模块，则自动初始化 user_progress 后放行；
        // - 其他模块保持原有行为（拒绝访问）。
        if (forceUnlock) {
            console.warn('⚠️ FORCE_UNLOCK 已开启, 但未找到 user_progress 记录, 使用默认进度:', moduleType);
            const progress = {
                userId,
                letterCompleted: true,
                letterProgress: 1,
                wordUnlocked: true,
                wordProgress: 1,
                sentenceUnlocked: true,
                sentenceProgress: 1,
                articleUnlocked: true,
                articleProgress: 1,
                currentStage: moduleType,
            };
            return {
                allowed: true,
                progress,
            };
        }

        // 字母模块：自动初始化进度记录，避免第一次进入字母模块就被拒绝
        if (moduleType === 'letter') {
            console.warn('ℹ️ 未找到 user_progress 记录, 为字母模块自动初始化进度:', userId);
            const progress = await initUserProgress(db, userId);
            return {
                allowed: true,
                progress,
            };
        }

        // 非字母模块：仍然要求先有进度记录
        return {
            allowed: false,
            errorCode: 'USER_PROGRESS_NOT_FOUND',
            message: '用户学习进度不存在,请联系管理员',
        };
    }

    const progress = progressResult.data[0];
    const letterProgress = typeof progress.letterProgress === 'number'
        ? progress.letterProgress
        : 0;

    // 2. 调试总开关：一键解锁所有模块
    if (forceUnlock) {
        console.warn('⚠️ FORCE_UNLOCK 已开启, 强制放行模块:', moduleType);
        return {
            allowed: true,
            progress: {
                ...progress,
                letterCompleted: true,
                letterProgress: 1,
                wordUnlocked: true,
                sentenceUnlocked: true,
                articleUnlocked: true,
                currentStage: moduleType,
            },
        };
    }

    // 3. 字母模块永远允许访问
    if (moduleType === 'letter') {
        return {
            allowed: true,
            progress,
        };
    }

    // 4. 其他模块：统一使用「二选一」规则
    // - letterCompleted === true
    // - 或 letterProgress >= 0.8 (即 80%)
    const finishedByTest = !!progress.letterCompleted;
    const finishedByProgress = letterProgress >= 0.8;

    if (!finishedByTest && !finishedByProgress) {
        return {
            allowed: false,
            errorCode: 'MODULE_LOCKED',
            message: `请先完成字母学习（当前进度：${Math.round(letterProgress * 100)}%）`,
            progress,
        };
    }

    return {
        allowed: true,
        progress,
    };
}

module.exports = {
    //createMemoryRecord,
    getOrCreateMemory,
    updateMemoryAfterReview,
    getTodayReviewEntities,
    // checkAndUnlockNextStage,
    initUserProgress,
    checkModuleAccess
};
