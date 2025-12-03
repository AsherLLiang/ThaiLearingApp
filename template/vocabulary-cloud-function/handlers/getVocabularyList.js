/**
 * 获取词汇列表处理器
 * 
 * 返回词汇库列表，支持筛选和分页
 * 
 * @action getVocabularyList
 */

'use strict';

const { vocabularyCollection } = require('../utils/database');
const { successResponse } = require('../utils/response');
const { validatePagination } = require('../utils/validators');

/**
 * 格式化词汇为列表项
 */
function formatVocabularyForList(vocab) {
  return {
    vocabularyId: vocab.vocabularyId,
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
 * 
 * @param {Object} params
 * @param {Object} params.filters - 筛选条件
 * @param {string} params.filters.level - 难度等级
 * @param {string} params.filters.lessonNumber - 课程编号
 * @param {string} params.filters.startingLetter - 首字母
 * @param {string} params.filters.partOfSpeech - 词性
 * @param {number} params.limit - 返回数量
 * @param {number} params.offset - 分页偏移
 */
async function getVocabularyList({ filters = {}, limit = 20, offset = 0 }) {
  // 验证分页
  const pagination = validatePagination(limit, offset);
  
  // 构建查询条件
  let query = vocabularyCollection;
  const whereConditions = {};
  
  if (filters.level) {
    whereConditions.level = filters.level;
  }
  
  if (filters.lessonNumber) {
    whereConditions.lessonNumber = filters.lessonNumber;
  }
  
  if (filters.startingLetter) {
    whereConditions.startingLetter = filters.startingLetter;
  }
  
  if (filters.partOfSpeech) {
    whereConditions.partOfSpeech = filters.partOfSpeech;
  }
  
  if (Object.keys(whereConditions).length > 0) {
    query = query.where(whereConditions);
  }
  
  // 获取总数
  const { total } = await query.count();
  
  // 获取分页数据
  const { data } = await query
    .orderBy('lessonNumber', 'asc')
    .skip(pagination.offset)
    .limit(pagination.limit)
    .get();
  
  const vocabularies = data.map(formatVocabularyForList);
  
  return successResponse({
    vocabularies,
    pagination: {
      total,
      limit: pagination.limit,
      offset: pagination.offset,
      hasMore: pagination.offset + pagination.limit < total,
    },
  }, '获取词汇列表成功');
}

module.exports = { getVocabularyList };
