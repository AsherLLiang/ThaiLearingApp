/**
 * 获取词汇列表处理器
 * @action getVocabularyList
 */
'use strict';

const { createResponse } = require('../utils/response');

/**
 * 格式化词汇为列表项
 */
function formatVocabularyForList(vocab) {
  return {
    vocabularyId: vocab.vocabularyId || vocab._id,
    thaiWord: vocab.thaiWord,
    meaning: vocab.meaning,
    pronunciation: vocab.pronunciation,
    audioPath: vocab.audioPath,
    partOfSpeech: vocab.partOfSpeech,
    level: vocab.level,
    lessonNumber: vocab.lessonNumber,
  };
}

/**
 * 获取词汇列表
 * @param {Object} db - 数据库实例
 * @param {Object} params - 参数
 */
async function getVocabularyList(db, params) {
  const { filters = {}, limit = 20, offset = 0, userId } = params;

  try {
    // 1. 检查用户权限 (如果传了 userId)
    if (userId) {
      const progressResult = await db.collection("user_progress")
        .where({ userId })
        .get();
        
      if (progressResult.data && progressResult.data.length > 0) {
        const p = progressResult.data[0];
        if (!p.wordUnlocked) {
          return createResponse(false, null, "请先完成字母学习", "MODULE_LOCKED");
        }
      }
    }

    // 2. 验证分页参数
    const validLimit = Math.max(1, Math.min(limit, 100));
    const validOffset = Math.max(0, offset);
    
    // 3. 构建查询条件
    const query = db.collection('vocabularies');
    const whereConditions = {};
    
    if (filters.level) whereConditions.level = filters.level;
    if (filters.lessonNumber) whereConditions.lessonNumber = filters.lessonNumber;
    if (filters.startingLetter) whereConditions.startingLetter = filters.startingLetter;
    if (filters.partOfSpeech) whereConditions.partOfSpeech = filters.partOfSpeech;
    
    let dbQuery = query;
    if (Object.keys(whereConditions).length > 0) {
      dbQuery = dbQuery.where(whereConditions);
    }
    
    // 4. 获取总数
    const countResult = await dbQuery.count();
    const total = countResult.total;
    
    // 5. 获取分页数据
    // 注意：orderBy 字段需要确保有索引，否则可能报错或慢
    const dataResult = await dbQuery
      .orderBy('lessonNumber', 'asc')
      .skip(validOffset)
      .limit(validLimit)
      .get();
    
    const vocabularies = dataResult.data.map(formatVocabularyForList);
    
    return createResponse(true, {
      vocabularies,
      pagination: {
        total,
        limit: validLimit,
        offset: validOffset,
        hasMore: validOffset + validLimit < total,
      },
    }, '获取词汇列表成功');

  } catch (error) {
    console.error('getVocabularyList error:', error);
    return createResponse(false, null, error.message, 'SERVER_ERROR');
  }
}

module.exports = getVocabularyList;