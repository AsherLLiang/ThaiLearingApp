// ✅ 获取所有字母（用于前端生成测试题）
const { createResponse } = require('../utils/response');

/**
 * 获取所有字母数据
 * @param {Object} db - 数据库实例
 * @returns {Promise} 返回所有字母数据
 */
async function getAllLetters(db) {
    try {
        // 从 letters 集合获取所有字母
        const res = await db.collection('letters')
            .limit(1000) // 设置一个足够大的限制（字母总数约 80 个）
            .get();

        return createResponse(true, {
            total: res.data.length,
            letters: res.data
        }, '获取字母成功');
    } catch (error) {
        console.error('[getAllLetters] 查询失败:', error);
        return createResponse(false, null, '获取字母失败', 'DB_ERROR');
    }
}

module.exports = getAllLetters;
