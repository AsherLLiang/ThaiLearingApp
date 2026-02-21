/**
 * 统一记忆引擎核心模块
 * 支持字母/单词/句子的统一记忆管理
 * 
 */

const { calculateSM2, masteryToQuality } = require('./sm2');

/**
 * 创建新的记忆记录,并写入 memory_status 集合,不做导出
 * @param {Object} db - 数据库实例
 * @param {string} userId - 用户ID
 * @param {string} entityType - 实体类型
 * @param {string} entityId - 实体ID
 * @param {boolean} isLocked - 是否锁定
 * @param {number} vId - 词汇ID(可选)
 * @returns {Promise<Object>} - 记忆记录
 */
async function createMemoryRecord(db, userId, entityType, entityId, vId, isLocked = false) {

    // 验证参数
    if (!userId || !entityType || !entityId) {
        console.error('[createMemoryRecord] 参数缺失:', { userId, entityType, entityId });
        throw new Error('userId, entityType, entityId 都是必需参数');
    }

    const now = new Date();
    const nextReviewDate = isLocked ? null : now.getTime() + 24 * 60 * 60 * 1000;

    const memoryRecord = {
        userId,               // 用户ID
        entityType,           // 实体类型
        entityId,             // 实体ID
        vId,                  // 词汇ID(可选)
        masteryLevel: 0.0,    // 掌握度
        repetition: 0,        // 0: 初始状态，1: 已复习
        easinessFactor: 2.5,  // 易度因子,SM-2 算法的标准初始难度（2.5表示中等难度）
        interval: 1,          // 间隔天数
        lastReviewAt: null,   // 上次复习时间
        nextReviewDate,       // 下次复习时间 (数字)
        correctCount: 0,      // 正确次数
        wrongCount: 0,        // 错误次数
        streakCorrect: 0,     // 连续正确次数
        isLocked: isLocked,   // 修复：必须显式写入，否则缺失字段导致 isLocked: false 查询无法匹配
        isSkipped: false,     // 是否跳过
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
    };

    try {
        // 数据库写入记忆状态到 memory_status 集合
        const result = await db.collection('memory_status').add({ data: memoryRecord });// 入记忆状态到 memory_status 集合

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
 * 更新用户在特定课程的进度指针 (vId)
 * @param {Object} db
 * @param {string} userId
 * @param {string} source - e.g. "BaseThai_1"
 * @param {number} vId - 当前学完的单词vId
 */
async function updateUserWordProgress(db, userId, source, vId) {
    if (!source || !vId) return;
    const progressRes = await db.collection('user_progress').where({ userId }).get();

    if (progressRes.data.length === 0) return; // Should not happen
    const progressDoc = progressRes.data[0];
    const progressId = progressDoc._id;

    // 1. 获取当前 wordProgress，统一转为以 source 为 key 的 Map 对象
    let wordProgress = progressDoc.wordProgress || {};

    // 兼容迁移：旧数据可能是数组格式，自动转为 Map
    if (Array.isArray(wordProgress)) {
        const converted = {};
        wordProgress.forEach(item => {
            if (item.source) {
                converted[item.source] = { lastVId: item.lastVId, updatedAt: item.updatedAt };
            }
        });
        wordProgress = converted;
    }

    // 2. 只在 vId 更大时更新
    const existing = wordProgress[source];
    if (existing && vId <= (existing.lastVId || 0)) {
        return; // 无需更新
    }

    // 3. 写入新值
    wordProgress[source] = {
        lastVId: vId,
        updatedAt: new Date().toISOString()
    };

    // 4. 使用 db.command.set 强制整体替换，防止 CloudBase 将对象拆解为数字 key
    await db.collection('user_progress').doc(progressId).update({
        data: { wordProgress: db.command.set(wordProgress) }
    });
    console.log(`[Progress] Updated ${source} -> vId: ${vId}`);
}

/**
 * 获取已有的memory_status记录，若没有则调用 createMemoryRecord 创建新记录
 * @param {Object} db - 数据库实例
 * @param {string} userId - 用户ID
 * @param {string} entityType - 实体类型
 * @param {string} entityId - 实体ID
 * @param {number} vId - 词汇ID(可选)
 * @param {boolean} isLocked - 是否锁定
 * @returns {Promise<Object>} - 记忆记录
 */
async function getOrCreateMemory(db, userId, entityType, entityId, vId, isLocked = false) {
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
    return await createMemoryRecord(db, userId, entityType, entityId, vId);
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
/**
 * 更新记忆状态(答题后调用)
 * @param {Object} db - 数据库实例
 * @param {string} userId - 用户ID
 * @param {string} entityType - 实体类型
 * @param {string} entityId - 实体ID
 * @param {string} quality - 答题质量
 * @param {boolean} isSkipped - 是否跳过 (新增参数)
 * @returns {Promise<Object>} - 更新后的记忆记录
 */
async function updateMemoryAfterReview(db, userId, entityType, entityId, quality, isSkipped = false, vId) {
    console.log('【测试】updateMemoryAfterReview 被调用了！', { userId, quality, isSkipped });
    console.log('=== [updateMemoryAfterReview] 开始 ===');
    console.log('参数:', JSON.stringify({ userId, entityType, entityId, quality, isSkipped }));

    try {
        // 1. 获取当前记忆记录
        console.log('步骤1: 获取记忆记录');
        const memory = await getOrCreateMemory(db, userId, entityType, entityId, vId);
        console.log('记忆记录:', JSON.stringify(memory));

        let newMasteryLevel, nextReviewAt, updateData;
        let sm2Result = {};
        let newCorrectCount = memory.correctCount;
        let newWrongCount = memory.wrongCount;
        let newStreakCorrect = memory.streakCorrect;

        const now = new Date();

        // === 处理跳过逻辑 ===
        if (isSkipped) {
            console.log('步骤2 (SKIP): 处理跳过逻辑');
            newMasteryLevel = 1.0;
            // 设置为 100 年后，相当于永久移出复习队列
            const nextReviewDate = now.getTime() + 100 * 365 * 24 * 60 * 60 * 1000;

            updateData = {
                masteryLevel: newMasteryLevel,
                nextReviewDate: nextReviewDate,
                updatedAt: now.toISOString(),
                isSkipped: true,
                // 跳过不影响 correct/wrong 计数，也不影响 streak
                // 但为了保持字段完整性，可以选择保留原值或重置某些状态
                // 这里选择仅更新调度相关的核心字段
            };
        } else {
            // === 原有 SM-2 逻辑 ===
            console.log('步骤2: 映射质量');

            const sm2Quality = masteryToQuality(quality);
            console.log('SM-2质量:', sm2Quality);

            // 3. 计算新的SM-2参数
            const oldInterval = memory.interval !== undefined ? memory.interval : (memory.intervalDays || 1);
            const oldRepetition = memory.repetition !== undefined ? memory.repetition : (memory.reviewStage || 0);

            console.log('步骤3: 调用 calculateSM2');
            console.log('调用参数:', {
                quality,
                interval: oldInterval,
                easinessFactor: memory.easinessFactor,
                repetition: oldRepetition
            });
            sm2Result = calculateSM2(
                quality,
                oldInterval,
                memory.easinessFactor,
                oldRepetition
            );

            console.log('SM-2结果:', JSON.stringify(sm2Result));

            // 4. 更新掌握度
            console.log('步骤4: 计算新掌握度');
            newMasteryLevel = memory.masteryLevel;
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
            newStreakCorrect = sm2Quality >= 4 ? memory.streakCorrect + 1 : 0;
            newCorrectCount = sm2Quality >= 4 ? memory.correctCount + 1 : memory.correctCount;
            newWrongCount = sm2Quality < 2 ? memory.wrongCount + 1 : memory.wrongCount;

            // 6. 计算下次复习时间
            console.log('步骤6: 计算下次复习时间');
            const nextReviewDate = now.getTime() + sm2Result.interval * 24 * 60 * 60 * 1000;
            console.log('下次复习时间:', nextReviewDate);

            // 7. 准备更新数据
            updateData = {
                isSkipped: false,
                masteryLevel: newMasteryLevel,
                repetition: sm2Result.repetitions,
                easinessFactor: sm2Result.easinessFactor,
                interval: sm2Result.interval,
                lastReviewAt: now.toISOString(),
                nextReviewDate: nextReviewDate,
                correctCount: newCorrectCount,
                wrongCount: newWrongCount,
                streakCorrect: newStreakCorrect,
                updatedAt: now.toISOString()
            };
            console.log('更新数据对象:', 'correctCount:', updateData.correctCount, 'nextReviewDate:', updateData.nextReviewDate);
        }

        console.log('步骤7: 准备更新数据库');
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

        // 返回结果增加 isSkipped 标识 (虽然不是必须，但方便调试)
        // 如果是 skipped，返回的部分 SM-2 字段可能是 undefined 或旧值，这取决于是否需要前端处理
        // 前端通常只关心是否成功
        return {
            entityId,
            entityType,
            masteryLevel: newMasteryLevel,
            repetition: sm2Result.repetitions || (memory.repetition !== undefined ? memory.repetition : memory.reviewStage),
            easinessFactor: sm2Result.easinessFactor || memory.easinessFactor,
            interval: sm2Result.interval || (memory.interval !== undefined ? memory.interval : memory.intervalDays),
            nextReviewDate: updateData.nextReviewDate,
            correctCount: newCorrectCount,
            wrongCount: newWrongCount,
            streakCorrect: newStreakCorrect,
            isSkipped
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
    const cmd = db.command;

    const result = await db.collection('memory_status')
        .where({
            userId,
            entityType,
            isLocked: cmd.neq(true),    // neq(true) 兼容：字段不存在的旧记录 + 显式 false 的新记录
            isSkipped: cmd.neq(true),   // 防御性过滤：跳过的词不进复习队列
            nextReviewDate: cmd.lte(now.getTime())
        })
        .orderBy('nextReviewDate', 'asc')
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
        wordProgress: {},  // Map 结构，以 source 为 key，如 { "BaseThai_1": { lastVId: 5, updatedAt: ... } }
        sentenceUnlocked: false,
        sentenceProgress: [],
        articleUnlocked: false,
        articleProgress: [],
        currentStage: 'letter',
        totalStudyDays: 0,
        streakDays: 0,
        lastStudyDate: null,
        createdAt: now,
        updatedAt: now
    };

    await db.collection('user_progress').add({ data: progressRecord });
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
    checkModuleAccess,
    updateUserWordProgress
};
