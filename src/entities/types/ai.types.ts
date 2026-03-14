// src/entities/types/ai.types.ts

// 这说明了一句泰语例句长什么样
export interface AiExample {
    scene: string;    // 这个例句的使用场景
    thai: string;     // 泰文句子内容
    chinese: string;  // 中文翻译
}

// 这说明了云端返回的“整个词汇解析报告”长什么样，
// 注意这里所有的字段名字，必须和刚才云端代码里 DeepSeek 吐出来的 JSON 名字一模一样！
export interface ExplainVocabularyResponse {
    vocabularyId: string;
    thaiWord: string;
    pronunciation: string; // ✅新增的发音字段
    meaning: string;
    breakdown: string;
    extraExamples: AiExample[];
}

/**
 * AI 微阅读生成结果
 * 字段名称与 generateMicroReading.js 中 Prompt 要求的 JSON 完全一致
 */
export interface MicroReadingResponse {
    title: string;         // AI 生成的泰文短文标题
    thaiText: string;      // AI 生成的泰文短文（80-150 词）
    translation: string;   // 中文逐段辅助翻译
    wordsUsed: string[];   // AI 确认用到的目标词列表（用于校验）
}

/** 发给 AI 的单个词汇条目 */
export interface MicroReadingWord {
    thaiWord: string;
    meaning: string;
}
