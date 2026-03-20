const { createResponse } = require('../utils/response');

/** 与 alphabetLessonConfig / 前端课表一致：测试通过视为全部课结业解锁 */
const ALL_ALPHABET_LESSON_IDS = [
    'lesson1',
    'lesson2',
    'lesson3',
    'lesson4',
    'lesson5',
    'lesson6',
    'lesson7',
];

/**
 * 标记字母测试通过
 * @param {Object} db - 数据库实例
 * @param {Object} data - 请求数据 { userId }
 */
// ✅ 记录字母测试通过状态
async function passLetterTest(db, data) {
    const { userId } = data || {};

    if (!userId) {
        return createResponse(false, null, 'userId 参数缺失', 'INVALID_PARAMS');
    }

    const now = new Date().toISOString();

    try {
        const updateResult = await db.collection('user_progress')
            .where({ userId })
            .update({
                data: {
                    letterCompleted: true,
                    letterProgress: 1,
                    updatedAt: now
                }
            });
        // 2. 如果 update 返回 0（记录不存在），则 add
        if (updateResult.stats.updated === 0) {
            console.log(`[passLetterTest] 记录不存在，正在创建...`);
            await db.collection('user_progress').add({
                data: {
                    userId,
                    letterCompleted: true,
                    letterProgress: 1,
                    letterMasteredCount: 0,
                    letterTotalCount: 44,
                    wordProgress: 0,
                    wordMasteredCount: 0,
                    wordTotalCount: 0,
                    sentenceProgress: 0,
                    sentenceMasteredCount: 0,
                    sentenceTotalCount: 0,
                    articleProgress: 0,
                    articleMasteredCount: 0,
                    articleTotalCount: 0,
                    wordUnlocked: false,
                    sentenceUnlocked: false,
                    articleUnlocked: false,
                    createdAt: now,
                    updatedAt: now
                }
            });
        }

        // 同步 user_alphabet_progress：写满 completedLessons，字母课列表页按链式解锁即可全开
        const alphabetCol = db.collection('user_alphabet_progress');
        const alphabetSnap = await alphabetCol.where({ userId }).limit(1).get();

        if (!alphabetSnap.data || alphabetSnap.data.length === 0) {
            // 与 memory-engine submitRoundEvaluation 首次 add 字段对齐；无轮次记录则 roundHistory 为空
            await alphabetCol.add({
                data: {
                    userId,
                    letterProgress: 1,
                    letterCompleted: false,
                    completedLessons: [...ALL_ALPHABET_LESSON_IDS],
                    masteredLetterCount: 0,
                    totalLetterCount: 80,
                    currentRound: 1,
                    roundHistory: [],
                    createdAt: now,
                    updatedAt: now,
                },
            });
        } else {
            const docId = alphabetSnap.data[0]._id;
            await alphabetCol.doc(docId).update({
                data: {
                    completedLessons: [...ALL_ALPHABET_LESSON_IDS],
                    letterProgress: 1,
                    updatedAt: now,
                },
            });
        }

        return createResponse(true, {
            letterCompleted: true,
            letterProgress: 1,
        }, '字母测试通过，所有模块已解锁')
    } catch (error) {
        console.error('[passLetterTest] 写入进度失败：', error);
        return createResponse(false, null, '写入进度失败', 'DB_ERROR');
    }
}

module.exports = passLetterTest;
