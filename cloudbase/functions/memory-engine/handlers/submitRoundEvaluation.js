'use strict';

/**
 * 提交字母模块的三轮评估结果（每轮一个总分）
 *
 * 设计目标：
 * - 字母用户前端只有“对/错”按钮，不选择 AGAIN/HARD/GOOD/EASY；
 * - 每轮结束时前端计算整体正确率 accuracy，并上传到此 handler，
 *   仅用于记录到 user_alphabet_progress.roundHistory，不改变 SM-2 记忆算法；
 * - 这样可以在不修改 updateMemoryAfterReview 的前提下，保留轮次级别的统计数据。
 */

const { createResponse } = require('../utils/response');

/**
 * @param {Object} db     - cloud.database()
 * @param {Object} params - { userId, entityType, lessonId, roundNumber, totalQuestions, correctCount, accuracy }
 */
async function submitRoundEvaluation(db, params) {
  const {
    userId,
    entityType,
    lessonId,
    roundNumber,
    totalQuestions,
    correctCount,
    accuracy,
  } = params || {};

  if (!userId || !entityType || !lessonId || !roundNumber) {
    return createResponse(
      false,
      null,
      '缺少必填参数: userId, entityType, lessonId, roundNumber',
      'INVALID_PARAMS',
    );
  }

  if (entityType !== 'letter') {
    return createResponse(
      false,
      null,
      'submitRoundEvaluation 目前仅支持 entityType = letter',
      'INVALID_ENTITY_TYPE',
    );
  }

  const total = typeof totalQuestions === 'number' ? totalQuestions : 0;
  const correct = typeof correctCount === 'number' ? correctCount : 0;
  const acc = typeof accuracy === 'number' && !Number.isNaN(accuracy)
    ? accuracy
    : total > 0
      ? correct / total
      : 0;

  const passed = acc >= 0.9;
  const now = new Date().toISOString();

  const col = db.collection('user_alphabet_progress');

  try {
    const existing = await col.where({ userId }).limit(1).get();

    const roundEntry = {
      lessonId,
      roundNumber,
      totalQuestions: total,
      correctCount: correct,
      accuracy: acc,
      passed,
      updatedAt: now,
    };

    if (!existing.data || existing.data.length === 0) {
      // 🔥 修正：首次创建时的 nextRound 计算（防止跨课污染）
      const nextRound = passed
        ? (roundNumber < 3 ? roundNumber + 1 : 1)
        : 1;

      // 🔥 P0-B: 首次创建时也要判定 completedLessons
      const initialCompletedLessons = (passed && roundNumber === 3 && lessonId)
        ? [lessonId]
        : [];

      console.log(`🔍 [P0-B-init] roundNumber: ${roundNumber}, passed: ${passed}, lessonId: ${lessonId || 'N/A'}, initialCompleted: [${initialCompletedLessons.join(',')}], nextRound: ${nextRound}`);

      // 没有进度记录时，插入一条带有 roundHistory 的默认记录
      await col.add({
        data: {
          userId,
          letterProgress: 0.0,
          letterCompleted: false,
          completedLessons: initialCompletedLessons, // 🔥 P0-B: 初始值
          masteredLetterCount: 0,
          totalLetterCount: 80,
          currentRound: nextRound, // 🔥 使用修正后的 nextRound
          roundHistory: [roundEntry],
          createdAt: now,
          updatedAt: now,
        },
      });
    } else {
      const doc = existing.data[0];
      const docId = doc._id;
      const history = Array.isArray(doc.roundHistory) ? doc.roundHistory : [];

      // 替换同一 lessonId + roundNumber 的旧记录
      const filtered = history.filter(
        (r) => !(r.lessonId === lessonId && r.roundNumber === roundNumber),
      );
      filtered.push(roundEntry);

      // 🔥 P0-B: Round3 passed 时写入 completedLessons
      let updatedCompletedLessons = Array.isArray(doc.completedLessons)
        ? [...doc.completedLessons]
        : [];

      const completedLessonsBefore = [...updatedCompletedLessons];

      if (passed && roundNumber === 3 && lessonId) {
        if (!updatedCompletedLessons.includes(lessonId)) {
          updatedCompletedLessons.push(lessonId);
        }
      }

      console.log(`🔍 [P0-B] roundNumber: ${roundNumber}, passed: ${passed}, lessonId: ${lessonId || 'N/A'}, completedBefore: [${completedLessonsBefore.join(',')}], completedAfter: [${updatedCompletedLessons.join(',')}]`);

      // 🔥 修正：nextRound 重置防止跨课污染
      const nextRound = passed
        ? (roundNumber < 3 ? roundNumber + 1 : 1)
        : 1;

      await col.doc(docId).update({
        data: {
          currentRound: nextRound,
          roundHistory: filtered,
          completedLessons: updatedCompletedLessons, // 🔥 P0-B: 写入 completedLessons
          updatedAt: now,
        },
      });
    }

    return createResponse(true, { round: roundEntry }, '提交轮次评估成功');
  } catch (err) {
    console.error('[submitRoundEvaluation] error:', err);
    return createResponse(
      false,
      null,
      err.message || '服务器内部错误',
      'SERVER_ERROR',
    );
  }
}

module.exports = submitRoundEvaluation;

