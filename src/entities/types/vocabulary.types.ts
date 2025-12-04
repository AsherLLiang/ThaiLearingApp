// src/entities/types/vocabulary.types.ts

/**
 * 单词基础信息（匹配数据库实际字段）
 */
export interface Vocabulary {
    _id: string;
    vocabularyId: string;        // 如 "BEGINNER_A_7"
    thaiWord: string;            // 泰语单词，如 "กะ"
    pronunciation: string;        // 发音，如 "gà"
    meaning: string;             // 中文意思，如 "估计"
    partOfSpeech: string;        // 词性，如 "动词"
    level: string;               // 级别，如 "BEGINNER_A"
    lessonNumber: string;        // 课程编号
    startingLetter: string;      // 起始字母
    source: string;              // 来源，如 "Thai_1"
    audioPath?: string;          // 音频路径，如 "7.mp3"

    // 例句（包含多个实用场景）
    exampleSentences?: {
        [key: string]: {
            泰语: string;
            发音: string;
            中文: string;
        };
    };

    // 对话场景
    dialogue?: {
        场景描述: string;
        对话内容: {
            [speaker: string]: {
                泰语: string;
                中文: string;
            };
        };
    };

    // 用法说明
    usage?: {
        语法示例?: {
            结构: string;
            解释: string;
            使用技巧?: string;
        };
        与中文差异?: string;
    };

    // 常见错误
    mistakes?: {
        发音易错点?: string;
        使用场合?: string;
        相似词汇区别?: string;
    };

    // 同根词
    cognates?: string[];

    // 时间戳
    createdAt?: Date | string;
}

/**
 * 单词分类
 */
export type VocabularyCategory =
    | 'daily'      // 日常用语
    | 'food'       // 食物
    | 'travel'     // 旅游
    | 'business'   // 商务
    | 'family'     // 家庭
    | 'number'     // 数字
    | 'time';      // 时间

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
}

/**
 * 今日单词响应
 */
export interface TodayVocabularyResponse {
    items: Array<{
        _id: string;
        entity: Vocabulary;
        memoryState: {
            nextReviewDate: string;
            repetitions: number;
            easeFactor: number;
        };
    }>;
    unlockInfo?: {
        vocabularyProgress: number;
        nextModuleUnlocked: boolean;
    };
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
