const { createResponse } = require('../utils/response');

async function setDailyLimit(db, params) {
    const { userId, dailyLimit } = params;

    if (!userId || !dailyLimit) {
        return createResponse(false, null, '缺失userID或dailyLimit', 'MISSING_PARAMS');
    }

    try {
        const result = await db.collection('user_progress')
        .where({ userId })
        .update({
            data:{
                dailyLimit: Number(dailyLimit),
                updatedAt: new Date().toISOString()
            }
        });
        return createResponse(true, result, '设置每日学习上限成功');
    } catch (error) {
        console.error('设置每日学习上限失败:', error);
        return createResponse(false, null, '设置每日学习上限失败', 'SERVER_ERROR');
    }
}
module.exports = setDailyLimit;