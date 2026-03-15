/**
 * 半挖空提示词提取
 *
 * Action: extractClozeHints
 *
 * 从泰语文章中提取 20-30% 的提示性关键词（主题词、关键名词/动词），
 * 用于半挖空模式：这些词保留可见，其余遮盖。
 */

const { createResponse } = require('../utils/response');

const PROMPT = `你是一位泰语教学专家。请分析下面的泰语文章，选出 50% 的「提示性关键词」。

选词原则：
- 优先保留：主题词、关键名词、重要动词、能帮助回忆整句的锚点词
- 避免保留：虚词、助词、连词（如 กับ ที่ มี คือ นี้ เป็น 等，除非在句中有关键语义）

请将原文按空格拆分为词，从这些词中选出应保留的提示词,至少保留原文 50% 的词作为提示词。
返回格式：仅返回一个 JSON 数组，元素为要保留的泰语词（字符串），与原文中出现的完全一致。

示例：若原文有 "เช้าวันเสาร์กับน้า" 拆成 ["เช้า","วันเสาร์","กับ","น้า"]，可返回 ["เช้า","วันเสาร์","น้า"]

原文：
"""
{{THAI_TEXT}}
"""

直接返回 JSON 数组，不要其他说明。`;

async function extractClozeHints(client, data) {
    const { thaiText } = data;

    if (!thaiText || !thaiText.trim()) {
        return createResponse(false, null, '缺少泰语原文', 'ERR_NO_TEXT');
    }

    const text = thaiText.trim();
    if (text.length > 8000) {
        return createResponse(false, null, '文章过长', 'ERR_TEXT_TOO_LONG');
    }

    try {
        const prompt = PROMPT.replace('{{THAI_TEXT}}', text);

        const completion = await client.chat.completions.create({
            model: 'deepseek-chat',
            messages: [
                { role: 'system', content: '你只返回有效的 JSON 数组，不包含任何其他文字。' },
                { role: 'user', content: prompt },
            ],
            temperature: 0.3,
        });

        const raw = completion.choices?.[0]?.message?.content || '';

        let keywords = [];
        try {
            const jsonMatch = raw.match(/\[[\s\S]*\]/);
            if (!jsonMatch) throw new Error('AI 未返回数组');
            keywords = JSON.parse(jsonMatch[0]);
            if (!Array.isArray(keywords)) keywords = [];
            keywords = keywords.filter((k) => typeof k === 'string' && k.trim()).map((k) => k.trim());
        } catch {
            console.warn('[extractClozeHints] JSON 解析失败，返回空数组:', raw.substring(0, 200));
        }

        return createResponse(true, { keywords }, '提示词提取完成');
    } catch (err) {
        console.error('[extractClozeHints] 提取失败:', err.message || err);
        return createResponse(false, null, `提取失败: ${err.message || '未知错误'}`, 'ERR_EXTRACT_FAILED');
    }
}

module.exports = extractClozeHints;
