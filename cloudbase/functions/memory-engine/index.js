/**
 * memory-engine 云函数
 * 统一记忆引擎服务
 * 版本: 1.0.0
 * 
 * 触发方式: HTTP 触发器
 */

const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.SYMBOL_CURRENT_ENV });
const db = cloud.database();

// ===== Handlers =====
const getTodayMemories = require('./handlers/getTodayMemories');
const submitMemoryResult = require('./handlers/submitMemoryResult');
const submitRoundEvaluation = require('./handlers/submitRoundEvaluation');
const checkModuleAccessHandler = require('./handlers/checkModuleAccess');
const getUserProgress = require('./handlers/getUserProgress');
const getAlphabetLessons = require('./handlers/getAlphabetLessons');
const setDailyLimit = require('./handlers/setDailyLimit');

// ===== Utils =====
const { createResponse } = require('./utils/response');

/**
 * 云函数主入口
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
                console.error('[memory-engine] JSON 解析失败:', e.message);
                return createResponse(false, null, 'Invalid JSON in request body', 'INVALID_JSON');
            }
        } else if (typeof event.body === 'object') {
            requestData = event.body;
        }
    }

    const { action, data = {} } = requestData;

    console.log(`[memory-engine] Action: ${action}`, JSON.stringify(data));

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
        /**
         * 获取今日学习内容 (统一接口)
         */
        if (action === 'getTodayMemories') {
            return await getTodayMemories(db, data);
        }

        /**
         * 提交学习结果 (统一接口)
         */
        if (action === 'submitMemoryResult') {
            return await submitMemoryResult(db, data);
        }

        /**
         * 提交三轮评估结果（字母模块）
         */
        if (action === 'submitRoundEvaluation') {
            return await submitRoundEvaluation(db, data);
        }

        /**
         * 检查模块访问权限
         */
        if (action === 'checkModuleAccess') {
            return await checkModuleAccessHandler(db, data);
        }

        /**
         * 获取用户学习进度
         */
        if (action === 'getUserProgress') {
            return await getUserProgress(db, data);
        }

        /**
         * 获取字母课程列表（用于前端课程总览）
         */
        if (action === 'getAlphabetLessons') {
            return await getAlphabetLessons(db, data);
        }
        if (action === 'setDailyLimit') {
            return await setDailyLimit(db, data);
        }

        // ===== 支持的操作类型 =====
        const supportedActions = [
            'getTodayMemories',
            'submitMemoryResult',
            'submitRoundEvaluation',
            'checkModuleAccess',
            'getUserProgress',
            'getAlphabetLessons',
            'setDailyLimit',
        ];

        return createResponse(
            false,
            { supportedActions },
            `未知的操作类型: ${action}`,
            'UNKNOWN_ACTION'
        );

    } catch (error) {
        console.error(`[memory-engine] 云函数错误:`, error);
        console.error('错误堆栈:', error.stack);

        return createResponse(
            false,
            null,
            error.message || '服务器内部错误',
            'SERVER_ERROR'
        );
    }
};
