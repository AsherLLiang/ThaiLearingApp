// cloudbase/functions/ai-engine/index.js

/**
 * 云函数的主入口
 * @param {object} event - 包含了客户端（前端）发来的所有数据
 * @param {object} context - 包含了运行环境的信息（如当前用户的鉴权信息等）
 */

const { OpenAI } = require('openai');
const { createResponse, aiErrorResponse } = require('./utils/response');
const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com/v1', // 这里的魔法在于，不管是什么模型，只要兼容，改个 URL 即可
});
const explainVocab = require('./handlers/explainVocab');
const generateMicroReading = require('./handlers/generateMicroReading');
    

exports.main = async (event, context) => {
    // ===== 解析 HTTP 请求 (API网关触发时数据在 body 里) =====
    let requestData = event;
    if (event.body) {
        if (typeof event.body === 'string') {
            try {
                requestData = JSON.parse(event.body);
            } catch (e) {
                console.error('[ai-engine] JSON 解析失败:', e.message);
                return createResponse(false, null, 'Invalid JSON body', 'INVALID_JSON');
            }
        } else if (typeof event.body === 'object') {
            requestData = event.body;
        }
    }

    const { action, data } = requestData;

    // 🛡️ 初级防御大门：检查约定的暗号 (AppSecret)
    // 只有正确带上我们前端约定钥匙的请求才能进入，防止别人拿我们的 URL 刷额度
    const EXPECTED_SECRET = 'ThaiApp_2026_Secure';
    if (!data || data.appSecret !== EXPECTED_SECRET) {
        console.warn(`[ai-engine] 🚨 拦截了非法访问尝试! Action: ${action}`);
        return createResponse(false, null, 'Unauthorized access: Invalid App Secret', 'ERR_UNAUTHORIZED');
    }

    // 防御通过，为了安全起见，在打印日志前把密码从包裹里拿掉
    const safeData = { ...data };
    delete safeData.appSecret;
    
    console.log(`[ai-engine] received action: ${action}`, safeData);

    if(!action) {
        return createResponse(false, null, 'Missing action parameter', 'ERR_MISSING_ACTION');
    };

    try{
        switch(action){
            case 'explainVocab':
                return await explainVocab(client, data);
            case 'generateMicroReading':
                return await generateMicroReading(client, data);
            default:
                return createResponse(false, null, 'Unknown action', 'ERR_UNKNOWN_ACTION');
        }
    }catch(err){
        console.error('[ai-engine] error:', err);
        return aiErrorResponse(err);
    }
}
    