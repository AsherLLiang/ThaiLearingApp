// ✅ 提交字母测试并判定是否通过
const { createResponse } = require('@thai-app/shared').response;
const passLetterTest = require('./passLetterTest');

async function submitLetterTest(db, userId, answers) {

    if (!userId || !Array.isArray(answers)) {
        return createResponse(false, null, '参数错误', 'INVALID_PARAMS');
    }

    // ✅ 取出标准答案（按 _id 对应）
    const ids = answers.map(a => a._id);

    const res = await db.collection('letter_test_bank')
        .where({
            _id: db.command.in(ids)
        })
        .get();

    const answerMap = {};
    res.data.forEach(q => {
        answerMap[q._id] = q.initialSound;
    });

    // ✅ 判分
    let correct = 0;
    const total = answers.length;

    answers.forEach(item => {
        if (answerMap[item._id] === item.answer) {
            correct++;
        }
    });

    const score = correct / total;

    // ✅ ✅ ✅ 通过条件：80%
    if (score >= 0.8) {
        const passResult = await passLetterTest(db, userId);

        return createResponse(true, {
            passed: true,
            score,
            correct,
            total
        }, '字母测试通过，已解锁');
    }

    // ❌ 未通过
    return createResponse(false, {
        passed: false,
        score,
        correct,
        total
    }, '测试未通过，请继续学习', 'LETTER_TEST_FAILED');
}

module.exports = submitLetterTest;