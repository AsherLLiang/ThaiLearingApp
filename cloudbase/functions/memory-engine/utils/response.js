/**
 * 响应格式化模块
 * 
 * 统一 API 响应格式
 * 与前端 ApiResponse<T> 类型定义保持一致
 */

'use strict';

const { ErrorCodes, ERROR_MESSAGES } = require('./constants');

/**
 * 创建标准化 API 响应
 * 
 * 对应前端类型:
 * interface ApiResponse<T> {
 *   success: boolean;
 *   data?: T;
 *   message?: string;
 *   errorCode?: string;
 *   timestamp: string;
 * }
 * 
 * @param {boolean} success - 是否成功
 * @param {Object} data - 返回数据
 * @param {string} message - 提示消息
 * @param {string} errorCode - 错误码
 * @returns {Object} success, data, message, errorCode,timestamp: new Date().toISOString() 
 */
function createResponse(success, data = null, message = '', errorCode = null) {
  return {
    success,
    data,
    message,
    errorCode,
    timestamp: new Date().toISOString(),
  };
}

/**
 * 创建成功响应
 * 
 * @param {Object} data - 返回数据
 * @param {string} message - 成功消息
 * @returns {Object} -成功相应对象：（调用）createResponse(true, data, message, null);
 */
function successResponse(data, message = '操作成功') {
  return createResponse(true, data, message, null);
}

/**
 * 创建错误响应
 * 
 * @param {string} errorCode - 错误码 (来自 ErrorCodes)
 * @param {string} customMessage - 自定义消息 (可选)
 * @returns {Object} -错误响应对象：（调用）createResponse(false, null, message, errorCode);
 */
function errorResponse(errorCode, customMessage = null) {
  const message = customMessage || ERROR_MESSAGES[errorCode] || '未知错误';
  return createResponse(false, null, message, errorCode);
}

/**
 * 创建参数错误响应
 * 
 * @param {string} detail - 错误详情
 * @returns {Object} -错误响应对象：（调用）errorResponse(ErrorCodes.INVALID_PARAMS, detail);
 */
function invalidParamsResponse(detail) {
  return errorResponse(ErrorCodes.INVALID_PARAMS, detail);
}

/**
 * 创建用户不存在响应
 * 
 * @returns {Object} -错误响应对象：（调用）errorResponse(ErrorCodes.USER_NOT_FOUND);
 */
function userNotFoundResponse() {
  return errorResponse(ErrorCodes.USER_NOT_FOUND);
}

/**
 * 创建词汇不存在响应
 * 
 * @returns {Object} 错误响应对象：（调用）errorResponse(ErrorCodes.VOCABULARY_NOT_FOUND);
 */
function vocabularyNotFoundResponse() {
  return errorResponse(ErrorCodes.VOCABULARY_NOT_FOUND);
}

/**
 * 创建服务器错误响应
 * 
 * @param {Error} error - 错误对象
 * @returns {Object} -错误响应对象：（调用）errorResponse(ErrorCodes.SERVER_ERROR, message);
 */
function serverErrorResponse(error) {
  // 生产环境不暴露错误详情
  const message = process.env.NODE_ENV === 'development' 
    ? `服务器错误: ${error.message}`
    : ERROR_MESSAGES.SERVER_ERROR;
  
  return errorResponse(ErrorCodes.SERVER_ERROR, message);
}

module.exports = {
  createResponse,
  successResponse,
  errorResponse,
  invalidParamsResponse,
  userNotFoundResponse,
  vocabularyNotFoundResponse,
  serverErrorResponse,
};
