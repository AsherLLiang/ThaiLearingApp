const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.SYMBOL_CURRENT_ENV });
const db = cloud.database();


// ✅ 处理函数
const { createResponse } = require('./utils/response');
const getLetterTest = require('./handlers/getLetterTest');
const submitLetterTest = require('./handlers/submitLetterTest');
const passLetterTest = require('./handlers/passLetterTest');

exports.main = async (event, context) => {

    // ===== 解析 HTTP 请求 =====
    let requestData = event;

    // HTTP 触发器：body 可能是字符串或对象
    if (event.body) {
        if (typeof event.body === 'string') {
            try {
                requestData = JSON.parse(event.body);
            } catch (e) {
                console.error('[alphabet] JSON 解析失败:', e.message);
                return createResponse(false, null, 'Invalid JSON in request body', 'INVALID_JSON');
            }
        } else if (typeof event.body === 'object') {
            requestData = event.body;
        }
    }

    const { action, userId, answers } = requestData;

    try {
        switch (action) {

            // ✅ 1️⃣ 获取字母测试题（固定题）
            case 'getLetterTest':
                return await getLetterTest(db);

            // ✅ 2️⃣ 提交字母测试并判定
            case 'submitLetterTest':
                return await submitLetterTest(db, userId, answers);

            // ✅ 3️⃣ 直接通过字母测试（调试/特殊逻辑用）
            case 'passLetterTest':
                return await passLetterTest(db, userId);

            default:
                return createResponse(false, null, '未知 action', 'INVALID_ACTION');
        }
    } catch (err) {
        console.error('learn-alphabet error:', err);
        return createResponse(false, null, err.message || '服务器错误', 'SERVER_ERROR');
    }
};
