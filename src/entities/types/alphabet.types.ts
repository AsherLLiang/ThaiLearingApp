// src/entities/types/alphabet.types.ts

/**
 * 字母学习相关类型
 * 
 * 说明: 此文件定义字母学习会话(Session)相关的类型
 * 不要与letter.types.ts重复定义Letter基础结构
 */

import type { Letter } from './letter.types';

// ==================== 学习会话相关 ====================

/**
 * AlphabetLearningState - 字母学习状态
 *
 * 用于学习会话中追踪单个字母的学习进度
 */
export interface AlphabetLearningState {
    // 基础信息
    alphabetId: string;             // 字母ID (对应Letter._id)
    thaiChar: string;               // 泰文字符
    category: string;               // 类别
    pronunciation: string;          // 发音
    example: string;                // 例词 (已包含中文)
    audioPath: string;              // 音频URL

    // 学习进度
    currentAttempts: number;        // 当前尝试次数
    requiredAttempts: number;       // 需要达到的次数 (默认3)
    qualityHistory: number[];       // 质量评分历史 (1-5)
    isCompleted: boolean;           // 是否完成
    timestamp: string;              // 最后更新时间 (ISO格式)

    // 后端记忆状态 (可选,来自后端getTodayMemories)
    memoryState?: MemoryStatus;

    // ⭐ 新增: 保留完整Letter对象,方便访问所有字段
    letterData?: Letter;
}

// ==================== Phase 2 统一题型协议 ====================

import type { AlphabetGameType } from '@/src/entities/types/alphabetGameTypes';

/**
 * AlphabetQueueItem - 题目队列项
 *
 * 用于 Question Engine 的统一队列项协议
 * 包含字母信息和题型信息
 */
export interface AlphabetQueueItem {
    /** 字母ID */
    letterId: string;

    /** 题型 */
    gameType: AlphabetGameType;

    /** 完整的字母对象,供题目生成器使用 */
    letter: Letter;
}

/**
 * AlphabetQuestion - 统一题目协议
 *
 * 由 lettersQuestionGenerator 生成的标准题目结构
 */
export interface AlphabetQuestion {
    /** 题目ID (可用于追踪) */
    id: string;

    /** 题型 */
    gameType: AlphabetGameType;

    /** 目标字母 (正确答案对应的字母对象) */
    targetLetter: Letter;

    /** 选项 (选择题使用,拼写题可为空) */
    options?: Letter[];

    /** 正确答案 (字母的 thaiChar 或其他属性值) */
    correctAnswer: string;

    /** 音频URL (如果题目需要播放音频) */
    audioUrl?: string;
}

/**
 * MemoryStatus - 后端记忆状态
 * 
 * 来自统一记忆引擎的记忆状态
 */
export interface MemoryStatus {
    easinessFactor: number;         // 难度因子 (1.3-2.5)
    interval: number;               // 复习间隔(天)
    repetitions: number;            // 重复次数
    nextReviewDate: string;         // 下次复习日期 (ISO格式)
    lastReviewDate?: string;        // 最后复习日期
}

/**
 * UnlockInfo - 解锁信息
 * 
 * 用于统一记忆引擎的解锁系统
 */
export interface UnlockInfo {
    letterProgress: number;         // 字母学习进度 (0-1 比例值)
    wordUnlocked: boolean;          // 是否解锁单词学习
    unlocked?: boolean;             // 是否刚刚解锁 (用于弹窗提示)
}

/**
 * TodayLettersResponse - 今日字母学习响应
 * 
 * 后端getTodayMemories返回的数据结构
 */
export interface TodayLettersResponse {
    items: Array<{
        entityId: string;           // 字母ID
        memoryState: MemoryStatus;
    }>;
    unlockInfo: UnlockInfo;
}

/**
 * SubmitLetterResultRequest - 提交字母学习结果
 * 
 * 提交到后端记忆引擎的数据结构
 */
export interface SubmitLetterResultRequest {
    userId: string;
    entityType: 'letter';
    entityId: string;
    quality: number;                // 1-5的质量评分
}

/**
 * SubmitLetterResultResponse - 提交结果响应
 */
export interface SubmitLetterResultResponse {
    success: boolean;
    data?: {
        nextReviewDate: string;
        interval: number;
        repetitions: number;
        unlockInfo?: UnlockInfo;
    };
    message?: string;
    errorCode?: string;
}

// ==================== 测试相关 ====================

/**
 * AlphabetTest - 字母测试数据
 */
export interface AlphabetTest {
    testId: string;
    userId: string;
    questions: AlphabetTestQuestion[];
    totalQuestions: number;
    passingScore: number;           // 及格分数 (默认80)
    createdAt: string;
}

/**
 * AlphabetTestQuestion - 测试题目
 */
export interface AlphabetTestQuestion {
    questionId: string;
    type: 'recognition' | 'pronunciation' | 'writing';
    letterId: string;
    thaiChar: string;
    options?: string[];             // 选项 (选择题)
    correctAnswer: string;
}

/**
 * AlphabetTestResult - 测试结果
 */
export interface AlphabetTestResult {
    testId: string;
    userId: string;
    score: number;                  // 得分 (0-100)
    correctCount: number;
    totalQuestions: number;
    passed: boolean;                // 是否通过
    answers: Array<{
        questionId: string;
        userAnswer: string;
        correctAnswer: string;
        isCorrect: boolean;
    }>;
    unlocked?: boolean;             // 是否解锁了下一模块
    completedAt: string;
}

// ==================== 学习会话控制 ====================

/**
 * LearningSessionState - 学习会话状态
 * 
 * 用于AlphabetStore管理整个学习流程
 */
export interface LearningSessionState {
    phase: LearningPhase;
    reviewQueue: AlphabetLearningState[];
    currentAlphabet: AlphabetLearningState | null;
    completedCount: number;
    totalCount: number;
}

/**
 * LearningPhase - 学习阶段枚举
 */
export enum LearningPhase {
    IDLE = 'IDLE',                  // 空闲
    LOADING = 'LOADING',            // 加载中
    REVIEW = 'REVIEW',              // 复习中
    TEST_PROMPT = 'TEST_PROMPT',    // 测试提示
    TESTING = 'TESTING',            // 测试中
    TEST_RESULT = 'TEST_RESULT',    // 测试结果
    COMPLETED = 'COMPLETED'         // 完成
}

/**
 * QualityScore - 质量评分映射
 */
export enum QualityButton {
    AGAIN = 'AGAIN',                // 完全忘记
    HARD = 'HARD',                  // 困难
    GOOD = 'GOOD',                  // 良好
    EASY = 'EASY'                   // 简单
}

/**
 * 质量评分映射表
 */
export const QUALITY_SCORE_MAP: Record<QualityButton, number> = {
    [QualityButton.AGAIN]: 1,
    [QualityButton.HARD]: 3,
    [QualityButton.GOOD]: 4,
    [QualityButton.EASY]: 5,
};

/**
 * 尝试次数增量映射表
 */
export const ATTEMPTS_INCREMENT_MAP: Record<QualityButton, number> = {
    [QualityButton.AGAIN]: 0,       // 不增加
    [QualityButton.HARD]: 1,        // +1
    [QualityButton.GOOD]: 1,        // +1
    [QualityButton.EASY]: 2,        // +2 (跳过一次)
};

// ==================== Phase 2 错题统计 ====================

/**
 * RoundErrorSummary - 轮次错题统计
 *
 * 用于在 Round 结果页展示错误最多的字母
 */
export interface RoundErrorSummary {
    /** 字母ID */
    letterId: string;

    /** 完整的字母对象 */
    letter: Letter;

    /** 错误次数 */
    wrongCount: number;

    /** 总尝试次数 */
    totalAttempts: number;

    /** 错误率 (wrongCount / totalAttempts) */
    errorRate?: number;
}
