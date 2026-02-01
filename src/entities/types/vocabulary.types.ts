// src/entities/types/vocabulary.types.ts


/**
 * 单词基础信息（严格匹配数据库实际字段）
 */
export interface Vocabulary {
    _id: string;
    vocabularyId: string;        // 如 "BaseThai_1_218"
    thaiWord: string;            // 泰语单词
    pronunciation: string;       // 发音
    meaning: string;             // 中文意思
    partOfSpeech: string;        // 词性
    level: string;               // 级别
    lessonNumber: string;        // 课程编号 "7.2"
    startingLetter: string;      // 起始字母
    source: string;              // 来源 "BaseThai_1"
    audioPath?: string;          // 主音频 "218.mp3"

    // 深度解析
    analysis?: {
        letter_pron_analysis?: string; // 字母发音解析
        part_of_speech?: string;       // 词性说明
        phonetic_association?: {       // 联想记忆
            拆分: string;
            记忆句: string;
        };
        common_mistakes?: {            // 常见错误
            使用场合?: string;
            发音易错点?: string;
            相似词汇区别?: string;
        };
        example_dialogue?: {           // 对话示例 (Text only legacy?)
            场景描述: string;
            对话内容: Record<string, { 中文: string; 泰语: string }>;
        };
        example_sentences?: Record<string, { // 例句 (Text only legacy?)
            中文: string;
            发音: string;
            泰语: string;
        }>;
    };

    // 结构化对话 (Audio supported)
    dialogue?: {
        场景描述: string;
        对话内容: {
            [speaker: string]: {
                audioPath: string; // "218_dia_A.mp3"
                中文: string;
                泰语: string;
            };
        };
    };

    // 结构化例句 (Audio supported)
    exampleSentences?: {
        [key: string]: {
            audioPath: string;     // "218_sen_实用场景1.mp3"
            中文: string;
            发音: string;
            泰语: string;
        };
    };

    // 用法说明
    usage?: {
        与中文差异?: string;
        语法示例?: {
            使用技巧?: string;
            结构: string;
            解释: string;
        };
    };

    // 常见错误 (Top level legacy or override?)
    mistakes?: {
        使用场合?: string;
        发音易错点?: string;
        相似词汇区别?: string;
    };

    // 同根词 (Array with audio)
    cognates?: Array<{
        audioPath: string;         // "218_cog_1.mp3"
        text: string;              // "เมื่อก่อน (mʉ̄a gròn) - 以前，从前"
    }>;

    // 时间戳
    createdAt?: Date | string | null;
}
// ==============================================================
/**
 * 单词配置
 */
export const VOCAB_CONFIG = {
    VOCAB_CHUNK_SIZE: 5,
    VOCAB_SCORES: {
        PERFECT: 5,
        GOOD: 4,
        PASS: 3,
        WEAK: 2,
        FAIL: 1,
    },
    VocabularyCategory: {
        daily: 'daily',      // 日常用语
        food: 'food',       // 食物
        travel: 'travel',     // 旅游
        business: 'business',   // 商务
        family: 'family',     // 家庭
        number: 'number',     // 数字
        time: 'time',      // 时间
    },
    //AIP 延用已经定义好的 api Endpoint
}
// ==============================================================
// 运行时单词状态（仅在内存中存在）
export interface SessionWord {
    // 核心数据
    id: string;              // 方便索引
    entity: Vocabulary;      // 原始数据
    
    // 学习进度状态
    isNew: boolean;          // 是否为新词
    masteryLevel: number;    // 当前掌握度 (0-5)
    
    // 当前 Session 动态状态
    phase: 'ASSESSMENT' | 'QUIZ'; // 当前处于评估还是测试阶段
    mistakeCount: number;         // 本轮错了多少次 (用于计算扣分)
    selfRating?: number;          // 用户自评的分数 (1-5)
}

/**
 * 单词学习状态
 */
export interface VocabularyLearningState {
    vocabularyId: string;
    thaiWord: string;
    pronunciation: string;
    meaning: string;
    exampleSentences?: Vocabulary['exampleSentences'];
    audioPath?: string;
    // 记忆引擎相关
    currentAttempts: number;    // 当前尝试次数
    requiredAttempts: number;   // 需要尝试次数
    qualityHistory: number[];   // 质量历史
    isCompleted: boolean;       // 是否完成
    timestamp: string;          // 时间戳

    // ⭐ 完整实体数据 (Single Source of Truth)
    // 前端展示组件应优先使用 entity 中的数据
    entity: Vocabulary;
    
    // 运行时单词状态（仅在内存中存在）
    sessionWord: SessionWord;
}

export const VOCABULARY_CONFIG = {
    CHUNK_SIZE: 5,           // 每组学习 5 个词
    SCORES: {
        PERFECT: 5,   // 记得 + 0错
        GOOD: 4,      // 模糊 + 0错
        PASS: 3,      // 记得 + 有错
        WEAK: 2,      // 模糊 + 有错
        FAIL: 1       // 陌生
    }
};

/**
 * 今日单词响应
 */
export interface TodayVocabularyResponse {
    items: Array<{
        _id: string; // Document ID (usually same as entity._id or memory ID)
        entity: Vocabulary;
        isNew?: boolean; // Derivable from memoryState but backend might simplify? No, we derive in frontend.
        memoryState: {
            masteryLevel: number;    // 0-5? or enum
            reviewStage: number;
            correctCount: number;
            wrongCount: number;
            streakCorrect: number;
            nextReviewAt: string;
            isNew: boolean;          // Backend calculated field from getTodayMemories
        };
    }>;
    summary: {
        total: number;
        reviewCount: number;
        newCount: number;
        entityType: string;
    };
    lessonMetadata?: any; // For letter module
    phonicsRule?: any;    // For letter module
}

/**
 * 提交结果请求
 */
export interface SubmitVocabularyResultRequest {
    userId: string;
    vocabularyId: string;
    quality: number;  // 1-5 的质量评分
}

/**
 * 单词进度
 */
export interface VocabularyProgress {
    masteredCount: number;
    totalCount: number;
    accuracy: number;
    masteredIds: string[];
}

