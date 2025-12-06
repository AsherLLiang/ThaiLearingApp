/**
 * SM-2 间隔重复算法模块（优化版）
 * 
 * 基于艾宾浩斯遗忘曲线优化:
 * - 早期复习间隔更密集: 1→2→4→7→14 天
 * - "模糊"状态缩短间隔而非维持不变
 * - "陌生"状态重置复习进度
 * 
 * 算法论文: https://www.supermemo.com/en/archives1990-2015/english/ol/sm2
 */

'use strict';

const { MasteryLevel, SM2_PARAMS, EARLY_INTERVALS } = require('./constants');

/**
 * 将掌握程度映射到 SM-2 Quality 值
 * 
 * SM-2 Quality 定义:
 * 0 - 完全不记得
 * 1 - 错误回答，但看到正确答案后想起
 * 2 - 错误回答，正确答案看起来很熟悉
 * 3 - 正确回答，但困难较大
 * 4 - 正确回答，有些犹豫
 * 5 - 正确回答，毫无困难
 * 
 * @param {string} mastery - 掌握程度
 * @returns {number} Quality值 (1-5)
 */
function masteryToQuality(mastery) {
    switch (mastery) {
        case MasteryLevel.UNFAMILIAR:
            return 1;  // 完全不记得
        case MasteryLevel.FUZZY:
            return 3;  // 有印象但不确定
        case MasteryLevel.REMEMBERED:
            return 5;  // 完全记得
        default:
            return 1;
    }
}

/**
 * 计算下次复习日期（优化版 SM-2 算法）
 * 
 * 改进点:
 * 1. 早期阶段（前5次）使用固定的渐进间隔 [1,2,4,7,14]
 * 2. "模糊"时缩短间隔而非维持不变
 * 3. "陌生"时完全重置复习进度
 * 
 * @param {string} mastery - 掌握程度: 忘记/模糊/认识
 * @param {number} currentInterval - 当前复习间隔（天）
 * @param {number} easinessFactor - 简易度因子（1.3-2.5+）
 * @param {number} reviewCount - 已复习次数
 * @returns {Object} 算法计算结果
 * 
 * @example
 * const result = calculateSM2Optimized('认识', 2, 2.5, 1);
 * // {
 * //   nextInterval: 4,
 * //   nextEasinessFactor: 2.6,
 * //   nextReviewDate: "2025-12-01T10:00:00Z",
 * //   shouldResetCount: false
 * // }
 * */
function calculateSM2Optimized(
    mastery,
    currentInterval = 1,
    easinessFactor = SM2_PARAMS.INITIAL_EASINESS_FACTOR,
    reviewCount = 0
) {
    let nextInterval = currentInterval;
    let nextEF = easinessFactor;
    let shouldResetCount = false;

    const quality = masteryToQuality(mastery);

    // ==================== 核心算法逻辑 ====================

    if (quality < 3) {
        // ========== 忘记: 完全重置 ==========
        // 用户完全不记得，需要从头开始学习
        nextInterval = 1;
        nextEF = Math.max(SM2_PARAMS.MIN_EASINESS_FACTOR, nextEF - 0.2);
        shouldResetCount = true;

    } else if (quality === 3) {
        // ========== 模糊: 缩短间隔，加强复习 ==========
        // 改进: 不是维持不变，而是缩短20%
        nextInterval = Math.max(1, Math.round(currentInterval * SM2_PARAMS.FUZZY_MULTIPLIER));
        nextEF = Math.max(SM2_PARAMS.MIN_EASINESS_FACTOR, nextEF - 0.1);

    } else {
        // ========== 记得: 使用优化的间隔序列 ==========
        if (reviewCount < EARLY_INTERVALS.length) {
            // 早期阶段: 使用预定义的渐进间隔
            // 这是关键改进: 1→2→4→7→14 而非原版的 1→6
            nextInterval = EARLY_INTERVALS[reviewCount];
        } else {
            // 后期阶段: 使用 EF 计算指数增长
            nextInterval = Math.round(currentInterval * nextEF);
        }

        // 提高简易度 (标准 SM-2 公式)
        nextEF = nextEF + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
        nextEF = Math.max(SM2_PARAMS.MIN_EASINESS_FACTOR, nextEF);
    }

    // 限制最大间隔
    nextInterval = Math.min(nextInterval, SM2_PARAMS.MAX_INTERVAL_DAYS);

    // 计算下次复习日期
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + nextInterval);

    // 计算新的复习次数
    const newRepetitions = shouldResetCount ? 0 : reviewCount + 1;

    return {
        // === 兼容 memoryEngine.js 的旧接口 ===
        interval: nextInterval,
        easinessFactor: parseFloat(nextEF.toFixed(2)),
        repetitions: newRepetitions,

        // === 新接口（保留供未来使用）===
        nextInterval,
        nextEasinessFactor: parseFloat(nextEF.toFixed(2)),
        nextReviewDate: nextReviewDate.toISOString(),
        shouldResetCount,
    };
}

/**
 * 生成预计复习时间线
 * 
 * 用于前端展示未来的复习计划
 * 
 * @param {number} currentReviewCount - 当前复习次数
 * @param {number} maxItems - 返回的时间线项数 (默认5)
 * @returns {Array} 未来复习计划
 * 
 * @example
 * generateReviewTimeline(2);
 * // [
 * //   { reviewNumber: 3, intervalDays: 4 },
 * //   { reviewNumber: 4, intervalDays: 7 },
 * //   { reviewNumber: 5, intervalDays: 14 },
 * //   ...
 * // ]
 */
function generateReviewTimeline(currentReviewCount, maxItems = 5) {
    const timeline = [];
    let interval = 1;
    let ef = SM2_PARAMS.INITIAL_EASINESS_FACTOR;

    for (let i = currentReviewCount; i < currentReviewCount + maxItems; i++) {
        if (i < EARLY_INTERVALS.length) {
            interval = EARLY_INTERVALS[i];
        } else {
            interval = Math.round(interval * ef);
        }
        interval = Math.min(interval, SM2_PARAMS.MAX_INTERVAL_DAYS);

        timeline.push({
            reviewNumber: i + 1,
            intervalDays: interval,
        });
    }

    return timeline;
}

/**
 * 获取今天的时间范围 (UTC)
 * 
 * @returns {Object} { startOfDay, endOfDay, timestamp }
 */
function getTodayRange() {
    const now = new Date();
    const startOfDay = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        0, 0, 0, 0
    ));
    const endOfDay = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() + 1,
        0, 0, 0, 0
    ));

    return {
        startOfDay: startOfDay.toISOString(),
        endOfDay: endOfDay.toISOString(),
        timestamp: now.toISOString(),
    };
}

/**
 * 获取算法信息 (用于前端展示)
 * 
 * @returns {Object} 算法元信息
 */
function getAlgorithmInfo() {
    return {
        name: 'Optimized SM-2',
        version: '1.1.0',
        earlyIntervals: EARLY_INTERVALS,
        maxInterval: SM2_PARAMS.MAX_INTERVAL_DAYS,
        description: '基于艾宾浩斯遗忘曲线优化的间隔重复算法',
    };
}

module.exports = {
    calculateSM2Optimized,
    generateReviewTimeline,
    getTodayRange,
    getAlgorithmInfo,
    masteryToQuality,
};
