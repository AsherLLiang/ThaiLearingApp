// ✅ 记录字母测试通过状态
async function passLetterTest(db, userId) {
    const now = new Date().toISOString();

    // 更新用户进度
    await db.collection('user_progress')
        .where({ userId })
        .update({
            data: {
                letterCompleted: true,
                letterProgress: 1,
                updatedAt: now
            }
        });

    // 如果记录不存在，可能需要创建（取决于业务逻辑，这里假设用户记录已存在）
    // 也可以使用 set() 或 upsert 逻辑，但 update 更安全，避免覆盖其他字段

    return {
        success: true,
        message: '已通过字母测试，字母模块已跳过，所有模块已解锁'
    };
}

module.exports = passLetterTest;
