/**
 * 检查模块访问权限
 * Action: checkModuleAccess
 */

const { checkModuleAccess } = require('../utils/memoryEngine');
const { validateParams } = require('../utils/validators');
const { createResponse } = require('../utils/response');

async function checkModuleAccessHandler(db, params) {

  // ✅ ✅ ✅ 正确的开发模式强制放行写法
  console.log('🔥 当前 NODE_ENV =', process.env.NODE_ENV);
  const env = process.env.NODE_ENV || 'development';

  if (env !== 'production') {
    return createResponse(true, {
      allowed: true,
      moduleType: params?.moduleType || 'unknown',
      progress: 100
    }, '【开发模式】模块已强制放行');
  }

  // ================== 以下为正式生产逻辑 ==================

  // 1️⃣ 参数验证
  const validation = validateParams(params, ['userId', 'moduleType']);
  if (!validation.isValid) {
    return createResponse(false, null, validation.message, 'INVALID_PARAMS');
  }

  const { userId, moduleType } = params;

  // 2️⃣ 验证 moduleType 合法性
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
    // 3️⃣ 正式校验模块权限
    const accessResult = await checkModuleAccess(db, userId, moduleType);

    if (!accessResult.allowed) {
      return createResponse(false, accessResult, accessResult.message, accessResult.errorCode);
    }

    // 4️⃣ 允许访问
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
