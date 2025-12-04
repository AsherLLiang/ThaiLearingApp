/**
 * 参数验证模块
 * 
 * 用户、词汇验证及通用验证工具
 */

'use strict';

const { userCollection, vocabularyCollection } = require('./database');
const { MasteryLevel } = require('./constants');

/**
 * 验证用户是否存在
 * 
 * @param {string} userId - 用户ID
 * @returns {Promise<Object|null>} 用户对象或 null
 */
async function validateUser(userId) {
  if (!userId || typeof userId !== 'string') {
    return null;
  }
  
  try {
    const { data } = await userCollection
      .where({ userId })
      .limit(1)
      .get();
    
    return data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('[validateUser] Error:', error);
    return null;
  }
}

/**
 * 验证词汇是否存在
 * 
 * @param {string} vocabularyId - 词汇ID
 * @returns {Promise<Object|null>} 词汇对象或 null
 */
async function validateVocabulary(vocabularyId) {
  if (!vocabularyId || typeof vocabularyId !== 'string') {
    return null;
  }
  
  try {
    const { data } = await vocabularyCollection
      .where({ vocabularyId })
      .limit(1)
      .get();
    
    return data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('[validateVocabulary] Error:', error);
    return null;
  }
}

/**
 * 验证掌握程度是否有效
 * 
 * @param {string} mastery - 掌握程度
 * @returns {boolean} 是否有效
 */
function isValidMastery(mastery) {
  const validValues = Object.values(MasteryLevel);
  return validValues.includes(mastery);
}

/**
 * 验证并规范化分页参数
 * 
 * @param {number} limit - 限制数量
 * @param {number} offset - 偏移量
 * @param {number} maxLimit - 最大限制 (默认100)
 * @returns {Object} 验证后的分页参数
 */
function validatePagination(limit, offset, maxLimit = 100) {
  return {
    limit: Math.min(Math.max(1, parseInt(limit) || 20), maxLimit),
    offset: Math.max(0, parseInt(offset) || 0),
  };
}

/**
 * 验证必填字符串参数
 * 
 * @param {string} value - 参数值
 * @param {string} name - 参数名 (用于错误消息)
 * @returns {Object} { valid: boolean, error?: string }
 */
function validateRequiredString(value, name) {
  if (!value || typeof value !== 'string' || value.trim() === '') {
    return {
      valid: false,
      error: `${name} 是必填参数且不能为空`,
    };
  }
  return { valid: true };
}

/**
 * 验证布尔参数
 * 
 * @param {any} value - 参数值
 * @param {string} name - 参数名
 * @returns {Object} { valid: boolean, error?: string }
 */
function validateBoolean(value, name) {
  if (typeof value !== 'boolean') {
    return {
      valid: false,
      error: `${name} 必须是布尔值`,
    };
  }
  return { valid: true };
}

module.exports = {
  validateUser,
  validateVocabulary,
  isValidMastery,
  validatePagination,
  validateRequiredString,
  validateBoolean,
};
