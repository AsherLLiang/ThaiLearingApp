/**
 * TTS 语音合成 handler（provider 无关）
 *
 * Action: textToSpeech
 *
 * 职责：参数校验 → 委托给当前 provider → 统一响应格式。
 * 切换 TTS 服务商只需修改下方 provider 引用。
 *
 * Provider 接口约定：
 *   synthesize(text, options?) → { audio: string, subtitles: TtsSubtitle[] }
 */

const { createResponse } = require('../utils/response');

// ─── 切换 TTS 服务商只改这一行 ───
const provider = require('./ttsProviders/googleTts');
// ─────────────────────────────────

async function textToSpeech(data) {
    const { text, voiceName } = data;

    if (!text || text.trim().length === 0) {
        return createResponse(false, null, '缺少合成文本', 'ERR_NO_TEXT');
    }

    try {
        const result = await provider.synthesize(text.trim(), { voiceName });
        return createResponse(true, result, '语音合成成功');
    } catch (err) {
        console.error('[textToSpeech] 合成失败:', err.message || err);
        return createResponse(false, null,
            `语音合成失败: ${err.message || '未知错误'}`, 'ERR_TTS_FAILED');
    }
}

module.exports = textToSpeech;
