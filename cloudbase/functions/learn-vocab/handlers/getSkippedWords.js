/**
 * 获取已划掉单词处理器
 * @action getSkippedWords
 */
'use strict';

const { createResponse } = require('../utils/response'); 

/**
 * 格式化词汇为列表项
 */
function formatVocabularyForList(vocab) {
  return {
    vocabularyId: vocab.vocabularyId || vocab._id, // 兼容字段名
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
 * 获取已划掉的单词列表
 * @param {Object} db - 数据库实例 (由 index.js 传入)
 * @param {Object} params - 请求参数
 * @param {string} params.userId - 用户ID
 * @param {number} params.limit - 返回数量
 * @param {number} params.offset - 分页偏移
 */
async function getSkippedWords(db, params) {
  // 1. 解构参数 (注意：这里 params 是第二个参数)
  const { userId, limit = 20, offset = 0 } = params;

  if (!userId) {
    return createResponse(false, null, '缺少用户ID', 'INVALID_PARAMS');
  }

  try {
    // 2. 检查用户是否完成字母学习
    const progressResult = await db.collection("user_progress")
      .where({ userId })
      .get();

    // 如果找不到用户进度，通常视为未解锁或新用户
    if (!progressResult.data || progressResult.data.length === 0) {
       return createResponse(false, null, '未找到用户进度', 'USER_NOT_FOUND');
    }

    const p = progressResult.data[0];

    if (!p.wordUnlocked) {
      return createResponse(false, null, "请先完成字母学习", "MODULE_LOCKED");
    }

    // 3. 获取已划掉单词总数
    const countResult = await db.collection('user_vocabulary_progress')
      .where({ userId, skipped: true })
      .count();
    const total = countResult.total;

    // 4. 查询分页进度
    const skippedProgressResult = await db.collection('user_vocabulary_progress')
      .where({ userId, skipped: true })
      .skip(offset)
      .limit(limit)
      .get();
    
    const skippedProgress = skippedProgressResult.data || [];

    if (skippedProgress.length === 0) {
      return createResponse(true, {
        words: [],
        pagination: { total, limit, offset, hasMore: false }
      }, '没有已划掉的单词');
    }

    // 5. 获取对应的词汇详情
    const vocabIds = skippedProgress.map(p => p.vocabularyId);
    
    // 注意：这里假设 vocabularies 表的主键是 _id 或者 vocabularyId
    // 如果你的词汇表主键是 _id，请使用 db.command.in(vocabIds) 查询 _id
    const vocabResult = await db.collection('vocabularies')
      .where({ 
        // 假设 vocabularyId 字段存储的是词汇的 _id
        _id: db.command.in(vocabIds) 
      }) 
      .get();

    const vocabMap = new Map(vocabResult.data.map(v => [v._id, v]));

    // 6. 组装数据
    const words = skippedProgress.map(progress => {
      const vocab = vocabMap.get(progress.vocabularyId); 
      if (!vocab) return null;
      
      return {
        ...formatVocabularyForList(vocab),
        skippedAt: progress.updatedAt,
      };
    }).filter(Boolean);

    return createResponse(true, {
      words,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      }
    }, '获取已划掉单词成功');

  } catch (error) {
    console.error('getSkippedWords error:', error);
    return createResponse(false, null, `服务器内部错误: ${error.message}`, 'SERVER_ERROR');
  }
}

module.exports = getSkippedWords;