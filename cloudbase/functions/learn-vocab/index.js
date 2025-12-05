/**
 * learn-vocab 云函数 - 统一记忆引擎版本
 * 支持字母/单词/句子的统一学习管理
 * 版本: 2.0.0 (UME - Unified Memory Engine)
 * 
 * 触发方式: HTTP 触发器
 */

const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.SYMBOL_CURRENT_ENV });
const db = cloud.database();

// ===== 原有handlers (保留) =====
const getTodayWords = require('./handlers/getTodayWords');
const updateMastery = require('./handlers/updateMastery');
const toggleSkipWord = require('./handlers/toggleSkipWord');
const getVocabularyDetail = require('./handlers/getVocabularyDetail');
const getReviewStatistics = require('./handlers/getReviewStatistics');
const getVocabularyList = require('./handlers/getVocabularyList');
const getSkippedWords = require('./handlers/getSkippedWords');

// ===== 新增handlers (统一记忆引擎) =====
// (已迁移至 memory-engine 云函数)

// ===== 工具函数 =====
const { createResponse } = require('@thai-app/shared').response;

/**
 * 云函数主入口
 * 支持 HTTP 触发器调用
 * 
 * @param {Object} event - 请求事件
 * @param {Object} context - 上下文
 */
exports.main = async (event, context) => {
  // ===== 解析 HTTP 请求 =====
  let requestData = event;

  // HTTP 触发器：body 可能是字符串或对象
  if (event.body) {
    if (typeof event.body === 'string') {
      try {
        requestData = JSON.parse(event.body);
      } catch (e) {
        console.error('[learn-vocab] JSON 解析失败:', e.message);
        return createResponse(false, null, 'Invalid JSON in request body', 'INVALID_JSON');
      }
    } else if (typeof event.body === 'object') {
      requestData = event.body;
    }
  }

  const { action, data = {} } = requestData;

  console.log(`[learn-vocab] Action: ${action}`, JSON.stringify(data));

  // 验证 action 参数
  if (!action) {
    return createResponse(
      false,
      null,
      '缺少必填参数: action',
      'MISSING_ACTION'
    );
  }

  try {
    // ===== 原有API路由 (7个) =====
    if (action === 'getTodayWords') {
      return await getTodayWords(db, data);
    }

    if (action === 'updateMastery') {
      return await updateMastery(data);
    }

    if (action === 'toggleSkipWord') {
      return await toggleSkipWord(db, data);
    }

    if (action === 'getVocabularyDetail') {
      return await getVocabularyDetail(db, data);
    }

    if (action === 'getReviewStatistics') {
      return await getReviewStatistics(db, data);
    }

    if (action === 'getVocabularyList') {
      return await getVocabularyList(db, data);
    }

    if (action === 'getSkippedWords') {
      return await getSkippedWords(db, data);
    }

    // ===== 已迁移至 memory-engine 的路由 =====
    if (['getTodayMemories', 'submitMemoryResult', 'checkModuleAccess', 'getUserProgress'].includes(action)) {
      return createResponse(
        false,
        null,
        `Action '${action}' has been moved to 'memory-engine' cloud function. Please update your client.`,
        'MOVED_PERMANENTLY'
      );
    }

    // ===== 未知Action =====
    const supportedActions = [
      'getTodayWords',
      'updateMastery',
      'toggleSkipWord',
      'getVocabularyDetail',
      'getReviewStatistics',
      'getVocabularyList',
      'getSkippedWords'
    ];

    return createResponse(
      false,
      { supportedActions },
      `未知的操作类型: ${action}`,
      'UNKNOWN_ACTION'
    );

  } catch (error) {
    console.error(`[learn-vocab] 云函数错误:`, error);
    console.error('错误堆栈:', error.stack);

    return createResponse(
      false,
      null,
      error.message || '服务器内部错误',
      'SERVER_ERROR'
    );
  }
};

