/**
 * Thai Learning App - 词汇学习云函数
 * 
 * @version 1.2.0
 * @description 模块化架构，支持7个Action
 * @author Thai Learning App Team
 * 
 * 目录结构:
 * vocabulary/
 * ├── index.js           # 主入口 (路由分发)
 * ├── package.json
 * ├── handlers/          # Action处理器
 * │   ├── getTodayWords.js
 * │   ├── updateMastery.js
 * │   ├── toggleSkipWord.js
 * │   ├── getVocabularyDetail.js
 * │   ├── getReviewStatistics.js
 * │   ├── getVocabularyList.js
 * │   └── getSkippedWords.js
 * └── utils/             # 工具模块
 *     ├── constants.js   # 常量定义
 *     ├── database.js    # 数据库初始化
 *     ├── response.js    # 响应格式化
 *     ├── validators.js  # 参数验证
 *     └── sm2.js         # SM-2算法
 */

'use strict';

// ==================== 导入处理器 ====================
const { getTodayWords } = require('./handlers/getTodayWords');
const { updateMastery } = require('./handlers/updateMastery');
const { toggleSkipWord } = require('./handlers/toggleSkipWord');
const { getVocabularyDetail } = require('./handlers/getVocabularyDetail');
const { getReviewStatistics } = require('./handlers/getReviewStatistics');
const { getVocabularyList } = require('./handlers/getVocabularyList');
const { getSkippedWords } = require('./handlers/getSkippedWords');

// ==================== 导入工具 ====================
const { errorResponse, serverErrorResponse } = require('./utils/response');
const { ErrorCodes, SUPPORTED_ACTIONS } = require('./utils/constants');

// ==================== Action 路由表 ====================
const actionHandlers = {
  getTodayWords,
  updateMastery,
  toggleSkipWord,
  getVocabularyDetail,
  getReviewStatistics,
  getVocabularyList,
  getSkippedWords,
};

// ==================== 云函数入口 ====================

/**
 * 云函数主入口
 * 
 * @description
 * 单函数多Action模式，通过 event.action 路由到对应处理器
 * 
 * @example
 * // 前端调用方式
 * cloud.callFunction({
 *   name: 'vocabulary',
 *   data: {
 *     action: 'getTodayWords',
 *     data: { userId: 'xxx', limit: 20 }
 *   }
 * })
 * 
 * @param {Object} event - 请求事件
 * @param {string} event.action - 操作类型 (见 SUPPORTED_ACTIONS)
 * @param {Object} event.data - 请求参数
 * @param {Object} context - 云函数上下文
 * @returns {Promise<ApiResponse>} 统一响应格式
 */
exports.main = async (event, context) => {
  const { action, data = {} } = event;
  const startTime = Date.now();
  
  // 日志: 请求开始
  console.log(`[Vocabulary] ▶ Action: ${action}`);
  console.log(`[Vocabulary] ▶ Params:`, JSON.stringify(data).slice(0, 500));
  
  try {
    // 查找对应的处理器
    const handler = actionHandlers[action];
    
    if (!handler) {
      console.warn(`[Vocabulary] ✗ Unknown action: ${action}`);
      return errorResponse(
        ErrorCodes.UNKNOWN_ACTION,
        `未知操作: ${action}。支持的操作: ${SUPPORTED_ACTIONS.join(', ')}`
      );
    }
    
    // 执行处理器
    const result = await handler(data);
    
    // 日志: 请求完成
    const duration = Date.now() - startTime;
    console.log(`[Vocabulary] ✓ ${action} completed in ${duration}ms`);
    console.log(`[Vocabulary] ✓ Success: ${result.success}`);
    
    return result;
    
  } catch (error) {
    // 错误处理
    const duration = Date.now() - startTime;
    console.error(`[Vocabulary] ✗ ${action} failed in ${duration}ms`);
    console.error(`[Vocabulary] ✗ Error:`, error);
    
    return serverErrorResponse(error);
  }
};

// ==================== 导出 (用于单元测试) ====================
module.exports.handlers = actionHandlers;
module.exports.SUPPORTED_ACTIONS = SUPPORTED_ACTIONS;
