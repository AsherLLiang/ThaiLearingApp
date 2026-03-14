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

    // 一句话搞定语言切换：AI 会用 targetLanguage 回应所有内容
    const systemPrompt = `You are a senior linguistics professor specializing in Thai and ${targetLanguage}. Always respond in ${targetLanguage}.`;

    const userPrompt = `
    Analyze the Thai word: "${thaiWord}"

    === STEP 1: SYLLABLE TONE ANALYSIS (do this first, silently) ===
    For EACH syllable, strictly apply the tone_determination_matrix below (derived from full_rule.json):

    A) Consonant class:
       Mid:  ก จ ฎ ฏ ด ต บ ป อ
       High: ข ฃ ฉ ฐ ถ ผ ฝ ศ ษ ส ห
       Low:  all others (ค ง ช ซ ท ธ น พ ฟ ม ย ร ล ว ฮ etc.)
       SPECIAL RULE: ห before Low Unpaired consonant (ง ญ ณ น ม ย ร ล ฬ ว) → treat as HIGH class

    B) Vowel length: SHORT (-ะ -ิ -ึ -ุ เ-ะ etc. and contracted forms -ั -็) vs LONG (-า -ี -ื etc.)

    C) Syllable type:
       Open = long vowel alone, or sonorant final (ง น ม ย ว). Sonorant finals follow OPEN rules.
       Closed(short) = short vowel with no final consonant → use SHORT column of Open matrix
       Closed(stop) = ends in stop final (ก ด บ or any letter mapped to k/t/p stop)

    D) Tone matrix — NO tone mark present:
       | Class | Open, LONG vowel | Open, SHORT vowel | Stop-final, LONG | Stop-final, SHORT |
       |-------|------------------|-------------------|------------------|-------------------|
       | Mid   | T1               | T2                | T2               | T2                |
       | High  | T5               | T2                | T2               | T2                |
       | Low   | T1               | T4                | T3               | T4                |

    E) Tone matrix — WITH tone mark (mark overrides the default above):
       | Class | ่ (mai ek) | ้ (mai tho) | ๊ (mai tri) | ๋ (mai jattawa) |
       |-------|-----------|------------|------------|----------------|
       | Mid   | T2        | T3         | T4         | T5             |
       | High  | T2        | T3         | INVALID    | INVALID        |
       | Low   | T2*       | T3         | INVALID    | INVALID        |
       (*Low + ่ valid with LONG vowels only; INVALID with short)

    === STEP 2: WRITE EXPLICIT PHONETIC SPELLING ===
    Now write each syllable using ONLY base consonants + exact tone needed, using this rule:
    - Drop ALL leading tone helpers (ห นำ, อนำ). Use the raw base consonant only.
    - Apply tone mark of the ACTUAL SPOKEN TONE directly onto the base consonant:
      · Tone 1 (mid/flat): NO mark
      · Tone 2 (falling): ไม้เอก ่
      · Tone 3 (high-falling): ไม้โท ้
      · Tone 4 (high/level): ไม้ตรี ๊
      · Tone 5 (rising): ไม้จัตวา ๋
    - Verified examples (apply the matrix above to check):
      · กา:    Mid + LONG อา + no final → Open LONG → T1 → no mark → กา [gaa1]
      · ขา:    High + LONG อา + no final → Open LONG → T5 → ๋ on ข → ข๋า [khaa5]
      · กะปิ:  ก(Mid+SHORT อะ+no final→Open SHORT→T2) + ปิ(Mid+SHORT อิ+no final→T2) → ก่ะ-ปิ่ [ga2-bi2]
      · หวัง:  ห+ว(LOW Unpaired)→ว treated as HIGH, SHORT อั (contracted อะ), sonorant ง → Open SHORT → T2 → วั่ง [wang2]

    === STEP 3: OUTPUT JSON ===
    IMPORTANT: All text values MUST be in ${targetLanguage}, except Thai word and phonetic fields.

    Return ONLY valid JSON (no Markdown, no code fences):
    {
      "vocabularyId": "${vocabularyId || ''}",
      "thaiWord": "${thaiWord}",
      "pronunciation": "<explicit phonetic spelling> [romanization with tone numbers]",
      "meaning": "<meaning in ${targetLanguage}>",
      "breakdown": "<pronunciation tone reasoning or memory aid, max 25 words, in ${targetLanguage}>",
      "extraExamples": [
        {
          "scene": "<brief scene in ${targetLanguage}>",
          "thai": "<1 Thai example sentence>",
          "chinese": "<${targetLanguage} translation>"
        }
      ]
    }
    `;

    // 发起网络请求并设置硬中断防御机制
    // 注意：JS 软超时必须 < cloudbaserc.json 里配置的函数硬超时（当前 60s）
    try {
        const TIMEOUT_MS = 50000; // 软超时 50 秒，留 10 秒余量给云函数基础设施
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error(`AI_TIMEOUT: Request timed out after ${TIMEOUT_MS / 1000}s`));
            }, TIMEOUT_MS);
        });

        const aiRequestPromise = client.chat.completions.create({
            model: "deepseek-chat", 
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            max_tokens: 600,  // 增大 token 上限，确保 JSON 不被截断
            temperature: 0.3  // 降低随机性，提升事实准确度
        });

        // Race: AI 返回 vs 超时，谁先触发就用谁的结果
        const completion = await Promise.race([aiRequestPromise, timeoutPromise]);
        
        const rawResult = completion.choices[0].message.content;

        // 尝试从响应中提取 JSON（防止 AI 意外包了 Markdown 代码块）
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

        return createResponse(true, parsedData, '解析成功');
        
    } catch (error) {
        console.error("[explainVocab] 请求失败或超时:", error.message);
        throw error;
    }
}

module.exports = explainVocab;