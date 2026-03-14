/**
 * 生成微阅读短文
 *
 * Action: generateMicroReading
 *
 * 接收用户本轮勾选的词汇列表，
 * 让 AI 把这些词自然编织进一段泰文短文，附上中文辅助翻译。
 */

const { createResponse } = require('../utils/response');

async function generateMicroReading(client, data) {
    // ── 1. 解包入参 ──────────────────────────────────────────────────
    // words: [{ thaiWord: "กะปิ", meaning: "虾酱" }, ...]
    // language: 'zh' | 'en'
    const { words = [], language = 'zh' } = data;

    // 防御：没有词就不调 AI，直接报错
    if (!words || words.length === 0) {
        return createResponse(false, null, '没有选中的词汇', 'ERR_NO_WORDS');
    }

    // ── 2. 语言映射（与 explainVocab 保持一致） ───────────────────────
    const languageMap = { zh: '中文', en: 'English' };
    const targetLanguage = languageMap[language] || '中文';

    // ── 3. 把词汇列表格式化成 Prompt 可读的字符串 ──────────────────────
    // 例：["กะปิ（虾酱）", "สวัสดี（你好）"]
    const wordList = words
        .map(w => `${w.thaiWord}（${w.meaning}）`)
        .join('、');

    // ── 4. System Prompt：告诉 AI 它的角色 ────────────────────────────
    const systemPrompt = `You are a creative Thai language teacher who writes vivid, 
natural short stories for language learners. 
Always respond in JSON format only (no markdown, no code fences).`;

    // ── 5. User Prompt：精确描述任务和输出格式 ────────────────────────
    const userPrompt = `
Create a short Thai reading passage that naturally incorporates ALL of these vocabulary words:
${wordList}

Requirements:
1. Length: 80-150 Thai words (a full paragraph, NOT just 1-2 sentences)
2. Story type: a vivid everyday scene (market, restaurant, travel, etc.)
3. ALL vocabulary words listed above MUST appear in the passage naturally
4. After the Thai passage, provide a ${targetLanguage} translation paragraph by paragraph

Return ONLY valid JSON in this exact format:
{
  "thaiText": "<the full Thai passage here>",
  "translation": "<the full ${targetLanguage} translation here>",
  "wordsUsed": ["<thaiWord1>", "<thaiWord2>"]
}
    `;

    // ── 6. 调用 AI，与 explainVocab 完全相同的防超时机制 ──────────────
    try {
        const TIMEOUT_MS = 200000; // 软超时 200 秒

        // Promise.race：AI 响应 和 倒计时 赛跑，谁先到用谁的结果
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error(`AI_TIMEOUT: Request timed out after ${TIMEOUT_MS / 1000}s`));
            }, TIMEOUT_MS);
        });

        const aiRequestPromise = client.chat.completions.create({
            model: 'deepseek-chat',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
            max_tokens: 1200,   // 短文比词汇解析长，需要更多 token
            temperature: 1.3,   // 高随机性：同样的词每次生成不一样的故事
        });

        const completion = await Promise.race([aiRequestPromise, timeoutPromise]);

        const rawResult = completion.choices[0].message.content;

        // 防御：从响应中提取 JSON，防止 AI 偷偷加 Markdown 代码块
        const jsonMatch = rawResult.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error(`AI response did not contain valid JSON: ${rawResult}`);
        }

        let parsedData;
        try {
            parsedData = JSON.parse(jsonMatch[0]);
        } catch (err) {
            throw new Error(`JSON parse failed: ${jsonMatch[0]}`);
        }

        return createResponse(true, parsedData, '微阅读生成成功');

    } catch (error) {
        console.error('[generateMicroReading] 请求失败或超时:', error.message);
        throw error;
    }
}

module.exports = generateMicroReading;
