// ✅ 获取固定字母测试题
const { createResponse } = require('@thai-app/shared').response;

async function getLetterTest(db) {
    const res = await db.collection('letter_test_bank')
        .limit(20) // 你说是固定题，不需要随机
        .get();

    return createResponse(true, {
        total: res.data.length,
        questions: res.data
    }, '获取字母测试题成功');
}

module.exports = getLetterTest;
