/**
 * 发音分析 handler
 *
 * Action: analyzePronunciation
 *
 * 使用 Qwen2-Audio (DashScope) 分析用户录音，对比参考原文给出发音反馈。
 * 通过 OpenAI 兼容接口调用，复用已安装的 openai SDK。
 *
 * 环境变量：
 *   DASHSCOPE_API_KEY — 阿里云百炼平台 API Key
 */

const { OpenAI } = require('openai');
const { createResponse } = require('../utils/response');

const DASHSCOPE_BASE_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1';
const MODEL = 'qwen2-audio-instruct';

function buildDashScopeClient() {
    const apiKey = process.env.DASHSCOPE_API_KEY;
    if (!apiKey) {
        throw new Error('缺少 DASHSCOPE_API_KEY 环境变量');
    }
    return new OpenAI({ apiKey, baseURL: DASHSCOPE_BASE_URL });
}

function buildPrompt(referenceText, language) {
    const lang = language === 'en' ? 'English' : '中文';

    return `You are a professional Thai language pronunciation coach.

The student is practicing reading the following Thai text aloud:

"""
${referenceText}
"""

Listen to the student's recording and evaluate their pronunciation.
Respond in ${lang}.

Return ONLY valid JSON in this exact format (no markdown, no explanation outside JSON):
{
  "overallScore": <number 1-10>,
  "dimensions": [
    { "name": "<dimension name>", "score": <number 1-10>, "comment": "<brief feedback>" }
  ],
  "suggestions": ["<suggestion 1>", "<suggestion 2>", ...],
  "transcription": "<what you heard the student say>"
}

Evaluate these 4 dimensions:
1. Tone accuracy (声调准确性)
2. Consonant & vowel clarity (辅音元音清晰度)
3. Speaking pace & rhythm (语速节奏)
4. Fluency & linking (流利度与连读)

Keep each comment under 30 words. Provide 2-4 actionable suggestions.`;
}

async function analyzePronunciation(client, data) {
    const { audioBase64, referenceText, language = 'zh' } = data;

    if (!audioBase64 || !audioBase64.trim()) {
        return createResponse(false, null, '缺少录音数据', 'ERR_NO_AUDIO');
    }
    if (!referenceText || !referenceText.trim()) {
        return createResponse(false, null, '缺少参考原文', 'ERR_NO_TEXT');
    }

    const audioDataUri = audioBase64.startsWith('data:')
        ? audioBase64
        : `data:audio/m4a;base64,${audioBase64}`;

    try {
        const dashScope = buildDashScopeClient();
        const prompt = buildPrompt(referenceText.trim(), language);

        const completion = await dashScope.chat.completions.create({
            model: MODEL,
            messages: [
                {
                    role: 'user',
                    content: [
                        { type: 'input_audio', input_audio: { data: audioDataUri } },
                        { type: 'text', text: prompt },
                    ],
                },
            ],
        });

        const raw = completion.choices?.[0]?.message?.content || '';

        let parsed;
        try {
            const jsonMatch = raw.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error('AI 未返回 JSON');
            parsed = JSON.parse(jsonMatch[0]);
        } catch {
            console.warn('[analyzePronunciation] JSON 解析失败，返回原始文本:', raw.substring(0, 300));
            parsed = {
                overallScore: 0,
                dimensions: [],
                suggestions: [raw.substring(0, 500)],
                transcription: '',
            };
        }

        return createResponse(true, parsed, '发音分析完成');
    } catch (err) {
        console.error('[analyzePronunciation] 分析失败:', err.message || err);
        return createResponse(false, null,
            `发音分析失败: ${err.message || '未知错误'}`, 'ERR_ANALYZE_FAILED');
    }
}

module.exports = analyzePronunciation;
