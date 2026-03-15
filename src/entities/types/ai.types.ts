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

/* SHELVED: cursor-tracking TTS — 因 GFW 封存，参见 git 历史
export interface TtsSubtitle {
    Text: string;
    BeginTime: number;
    EndTime: number;
    BeginIndex: number;
    EndIndex: number;
    Phoneme: string | null;
}

export interface TtsResponse {
    audio: string;
    subtitles: TtsSubtitle[];
}
*/

/** 发音分析 — 单维度评分 */
export interface PronunciationDimension {
    name: string;
    score: number;       // 1-10
    comment: string;
}

/** 发音分析 — AI 返回的完整反馈 */
export interface PronunciationFeedbackResponse {
    overallScore: number;
    dimensions: PronunciationDimension[];
    suggestions: string[];
    transcription: string;
}

/** 半挖空提示词提取 — AI 返回的关键词列表 */
export interface ExtractClozeHintsResponse {
    keywords: string[];
}

/** 持久化到 AsyncStorage 的文章对象 */
export interface SavedArticle {
    id: string;
    title: string;
    thaiText: string;
    translation: string;
    wordsUsed: string[];
    createdAt: number;
    wordCount: number;
}
