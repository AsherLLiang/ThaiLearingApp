/**
 * 检查模块访问权限
 * Action: checkModuleAccess
 */

const { checkModuleAccess } = require('../utils/memoryEngine');
const { validateParams } = require('../utils/validators');
const { createResponse } = require('../utils/response');

/**
 * @param {Object} db - 数据库实例
 * @param {Object} params - 请求参数
 * @param {string} params.userId - 用户ID
 * @param {string} params.moduleType - 模块类型: 'letter' | 'word' | 'sentence' | 'article'
 */
async function checkModuleAccessHandler(db, params) {
  // 1. 参数验证
  const validation = validateParams(params, ['userId', 'moduleType']);
  if (!validation.isValid) {
    return createResponse(false, null, validation.message, 'INVALID_PARAMS');
  }

  const { userId, moduleType } = params;

  // 2. 验证moduleType
  const validModules = ['letter', 'word', 'sentence', 'article'];
  if (!validModules.includes(moduleType)) {
    return createResponse(
      false, 
      null, 
      `无效的模块类型: ${moduleType}`, 
      'INVALID_MODULE_TYPE'
    );
  }

  try {
    // 3. 检查访问权限
    const accessResult = await checkModuleAccess(db, userId, moduleType);

    if (!accessResult.allowed) {
      return createResponse(false, accessResult, accessResult.message, accessResult.errorCode);
    }

    // 4. 返回允许访问
    return createResponse(true, {
      allowed: true,
      moduleType,
      progress: accessResult.progress
    }, '模块已解锁,可以访问');

  } catch (error) {
    console.error('checkModuleAccess 错误:', error);
    return createResponse(false, null, error.message || '服务器错误', 'SERVER_ERROR');
  }
}

module.exports = checkModuleAccessHandler;