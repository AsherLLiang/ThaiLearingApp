'use strict';

/**
 * 获取字母课程元数据列表
 *
 * 设计目标：
 * - 作为前端「字母课程总览」页的数据源；
 * - 优先从 DB 集合 alphabet_lessons 读取，失败时回退到本地 LESSON_METADATA；
 * - 返回结构与前端 LessonMetadata 类型兼容。
 */

const { createResponse } = require('../utils/response');
const { LESSON_METADATA } = require('../config/alphabetLessonConfig');

/**
 * @param {object} db    cloud.database()
 * @param {object} params 目前未使用，预留过滤/分页
 */
async function getAlphabetLessons(db, params) {
  try {
    let lessons = [];

    try {
      const col = db.collection('alphabet_lessons');
      const res = await col.orderBy('order', 'asc').get();
      if (res && Array.isArray(res.data) && res.data.length > 0) {
        lessons = res.data;
      }
    } catch (err) {
      console.warn('[getAlphabetLessons] DB 查询失败，将使用本地 LESSON_METADATA 作为回退:', err.message);
    }

    if (!lessons.length) {
      lessons = Object.values(LESSON_METADATA).sort(
        (a, b) => (a.order || 0) - (b.order || 0),
      );
    }

    return createResponse(true, { lessons }, '获取字母课程列表成功');
  } catch (error) {
    console.error('[getAlphabetLessons] error:', error);
    return createResponse(
      false,
      null,
      error.message || '服务器内部错误',
      'SERVER_ERROR',
    );
  }
}

module.exports = getAlphabetLessons;

