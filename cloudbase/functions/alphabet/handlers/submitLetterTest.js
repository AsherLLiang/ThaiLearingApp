// ✅ 提交字母测试结果（Route A：前端判分）
const { createResponse } = require('../utils/response');
const passLetterTest = require('./passLetterTest');

/**
 * 提交字母测试结果
 * @param {Object} db - 数据库实例
 * @param {Object} data - 请求数据 { userId, passed }
 */
async function submitLetterTest(db, data) {
    // 1. 校验参数
    const { userId, passed } = data || {};

    if (!userId) {
        return createResponse(false, null, 'userId 参数缺失', 'INVALID_PARAMS');
    }

    if (typeof passed !== 'boolean') {
        return createResponse(false, null, 'passed 参数必须为布尔值', 'INVALID_PARAMS');
    }

    // 2. 如果未通过，直接返回（不写数据库）
    if (!passed) {
        return createResponse(true, {
            passed: false,
            message: '未通过测试，不记录进度'
        }, '测试未通过');
    }

    // 3. 如果通过，调用 passLetterTest 写入解锁记录
    try {
        await passLetterTest(db, { userId });

        return createResponse(true, {
            passed: true,
            message: '恭喜通过字母测试！所有模块已解锁。'
        }, '测试通过');
    } catch (error) {
        console.error('[submitLetterTest] passLetterTest 失败：', error);
        return createResponse(false, null, '写入进度失败', 'DB_ERROR');
    }
}

module.exports = submitLetterTest;