/**
 * 解释词汇
 * 
 * Action: explainVocab
 */

const { createResponse } = require('../utils/response');

async function explainVocab(client, data) {
    const { userId, vocabularyId, thaiWord, language = 'zh' } = data;

    // 将前端语言代码映射为 AI 可识别的语言名称
    const languageMap = { zh: '中文', en: 'English' };
    const targetLanguage = languageMap[language] || '中文';

    // 一句话搞定语言切换：AI 会用 targetLanguage 回应整个 prompt 中的所有内容
    const systemPrompt = `You are a senior linguistics professor specializing in Thai and ${targetLanguage}. Always respond in ${targetLanguage}.`;

    const userPrompt = `
    Deeply analyze the Thai vocabulary: "${thaiWord}".

    For Thai beginners, standard tone rules (high-class consonants, leading ห tone shift, etc.) are too complex to decode.
    Provide an [Explicit Thai Phonetic Spelling] and its romanization.

    [Phonetic Spelling Rules]
    1. Drop all leading tone helpers (ห, อ). Use the raw base consonant only.
    2. Apply Thai tone marks directly onto the base consonant to show the actual tone:
       - Tone 1 (mid/flat): no mark
       - Tone 2 (falling): ไม้เอก ( ่ )
       - Tone 3 (high-falling): ไม้โท ( ้ )
       - Tone 4 (high): ไม้ตรี ( ๊ )
       - Tone 5 (rising): ไม้จัตวา ( ๋ )
    3. Examples:
       - "หวัง" -> "วั๋ง [wang5]"
       - "อยาก" -> "ย่าก [yaak2]"
       - "สามารถ" -> "ส๋า-ม่าด [saa5-maat3]"
       - "ใหญ่" -> "ไย่ [yai2]"

    IMPORTANT: All text values in the JSON below MUST be in ${targetLanguage}, except for the Thai word and phonetic fields.

    Strictly return this exact JSON structure, no Markdown:
    {
      "vocabularyId": "${vocabularyId || ''}",
      "thaiWord": "${thaiWord}",
      "pronunciation": "Explicit Thai phonetic spelling [romanization], e.g.: วั๋ง [wang5]",
      "meaning": "Meaning in ${targetLanguage}",
      "breakdown": "Pronunciation breakdown or memory aid (max 20 words, in ${targetLanguage})",
      "extraExamples": [
        {
          "scene": "Short scene description in ${targetLanguage}",
          "thai": "Thai example sentence (1 sentence)",
          "chinese": "${targetLanguage} translation"
        }
      ]
    }
    `;

    // 发起网络请求并设置硬中断防御机制
    try {
        // 创建一个定时器 Promise，如果规定时间内触发，就抛出错误
        const TIMEOUT_MS = 20000; // 设定 20 秒为生死线
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error(`AI_TIMEOUT: 请求超过 ${TIMEOUT_MS}ms 未响应`));
            }, TIMEOUT_MS);
        });

        // 这是真正的 AI 请求 Promise
        const aiRequestPromise = client.chat.completions.create({
            model: "deepseek-chat", 
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            // 限制最大吐出单词数，强行缩短时间 (深度防御)
            max_tokens: 300, 
            temperature: 0.7 
        });

        // Promise.race 就像一场赛跑，AI 返回和倒计时谁先完成，就以谁的结果为准
        const completion = await Promise.race([aiRequestPromise, timeoutPromise]);
        
        // 获取大模型返回的文本并解析
        const rawResult = completion.choices[0].message.content;

        let parsedData;
        try {
            parsedData = JSON.parse(rawResult);
        } catch (err) {
            throw new Error(`AI 响应非 JSON 格式: ${rawResult}`);
        }

        // 按照约定的成功响应格式包装后返回
        return createResponse(true, parsedData, '解析成功');
        
    } catch (error) {
        // 如果是赛跑输了触发的超时错误，或者大模型本身崩了，都会被这里接住，扔给外层的 index.js
        console.error("[explainVocab] 请求失败或超时:", error.message);
        throw error;
    }
}

module.exports = explainVocab;