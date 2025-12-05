// src/stores/alphabetStore.ts

/**
 * 字母学习Store
 * 
 * 架构说明:
 * - 独立的Store,不与单词/句子Store共用
 * - 但可以与单词/句子Store共用UI组件
 * - 通过entityType区分不同的学习内容
 * 
 * 后端集成:
 * - Cloud Function: /learn-vocab (通过cloudFunctionAdapter调用)
 * - Action: getTodayMemories (entityType: 'letter')
 * - Action: submitMemoryResult (entityType: 'letter')
 * 
 * 数据流:
 * initSession() -> callCloudFunction('getTodayMemories') -> 
 * letters集合 + memory_status -> AlphabetLearningState[]
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS } from '@/src/config/api.endpoints';

// ==================== 类型导入 ====================
import type { Letter } from '@/src/entities/types/letter.types';
import { LearningPhase } from '@/src/entities/enums/LearningPhase.enum';
import {
    QualityButton,
    QUALITY_SCORE_MAP
} from '@/src/entities/enums/QualityScore.enum';

// ==================== 工具函数导入 ====================
import { callCloudFunction } from '@/src/utils/cloudFunctionAdapter';
import {
    getLetterById,
    getLetterDisplayInfo
} from '@/src/utils/letterData';

// ==================== 常量定义 ====================

/**
 * 质量按钮映射到后端质量文本
 * 后端期望: '陌生' | '模糊' | '记得'
 */
const QUALITY_TEXT_MAP: Record<QualityButton, string> = {
    [QualityButton.FORGET]: '陌生',  // 1分
    [QualityButton.FUZZY]: '模糊',   // 3分
    [QualityButton.KNOW]: '记得'     // 5分
};

// ==================== 接口定义 ====================

/**
 * 字母学习状态
 * 对应单个字母在会话中的学习状态
 */
export interface AlphabetLearningState {
    // 基础信息
    alphabetId: string;             // 字母ID (对应Letter._id)
    thaiChar: string;               // 泰文字符
    category: string;               // 类别 (如: "mid_consonant")
    pronunciation: string;          // 发音
    example: string;                // 例词 (包含中文)
    audioPath: string;              // 音频URL

    // 学习进度
    currentAttempts: number;        // 当前尝试次数
    requiredAttempts: number;       // 需要达到的次数 (默认3)
    qualityHistory: number[];       // 质量评分历史
    isCompleted: boolean;           // 是否完成
    timestamp: string;              // 最后更新时间

    // 后端记忆状态 (可选)
    memoryState?: MemoryStatus;

    // 完整Letter对象 (用于访问所有字段)
    letterData?: Letter;
}

/**
 * 后端记忆状态
 */
export interface MemoryStatus {
    masteryLevel: number;           // 掌握级别
    reviewStage: number;            // 复习阶段
    correctCount: number;           // 正确次数
    wrongCount: number;             // 错误次数
    streakCorrect: number;          // 连续正确次数
    nextReviewAt: string;           // 下次复习时间
    isNew: boolean;                 // 是否新内容
}

/**
 * 解锁信息
 */
export interface UnlockInfo {
    letterProgress: number;         // 字母学习进度 (0-100)
    wordUnlocked: boolean;          // 是否解锁单词学习
    unlocked?: boolean;             // 是否刚刚解锁
}

/**
 * 今日字母响应 (后端返回格式)
 */
interface TodayLettersResponse {
    items: Array<{
        _id: string;
        // Letter的所有字段
        thaiChar: string;
        nameThai: string;
        type: string;
        // ...
        memoryState?: MemoryStatus;
    }>;
    summary: {
        total: number;
        reviewCount: number;
        newCount: number;
        entityType: string;
    };
}

// ==================== 辅助函数 ====================

/**
 * 将Letter转换为AlphabetLearningState
 * ⭐ 正确使用新字段
 */
function letterToLearningState(letter: Letter): AlphabetLearningState {
    const displayInfo = getLetterDisplayInfo(letter);

    return {
        alphabetId: letter._id,
        thaiChar: letter.thaiChar,

        // ✅ 使用category而不是简单的type判断
        category: letter.category,

        // ✅ 优先使用letterNamePronunciation
        pronunciation: displayInfo.pronunciation,

        // ✅ 包含中文含义
        example: displayInfo.example,

        // ✅ 优先使用fullSoundUrl
        audioPath: displayInfo.audioUrl,

        // 学习进度
        currentAttempts: 0,
        requiredAttempts: 3,
        qualityHistory: [],
        isCompleted: false,
        timestamp: new Date().toISOString(),

        // ⭐ 保留完整Letter对象
        letterData: letter
    };
}

// ==================== Store接口定义 ====================

interface AlphabetStoreState {
    // ===== 会话状态 =====
    phase: LearningPhase;
    reviewQueue: AlphabetLearningState[];
    currentAlphabet: AlphabetLearningState | null;
    currentIndex: number;

    // ===== 统计信息 =====
    completedCount: number;
    totalCount: number;
    unlockInfo: UnlockInfo | null;

    // ===== 加载状态 =====
    isLoading: boolean;
    error: string | null;

    // ===== Actions =====

    /**
     * 初始化学习会话
     * 调用后端getTodayMemories获取今日学习内容
     */
    initSession: (userId: string, limit?: number) => Promise<void>;

    /**
     * 提交当前字母的学习结果
     * 调用后端submitMemoryResult更新记忆状态
     */
    submitResult: (userId: string, quality: QualityButton) => Promise<void>;

    /**
     * 移动到下一个字母
     */
    nextAlphabet: () => void;

    /**
     * 移动到上一个字母
     */
    previousAlphabet: () => void;

    /**
     * 跳转到指定索引
     */
    goToIndex: (index: number) => void;

    /**
     * 重置会话
     */
    resetSession: () => void;

    /**
     * 清除错误
     */
    clearError: () => void;
}

// ==================== Store实现 ====================

export const useAlphabetStore = create<AlphabetStoreState>()(
    persist(
        (set, get) => ({
            // ===== 初始状态 =====
            phase: LearningPhase.REVIEW,
            reviewQueue: [],
            currentAlphabet: null,
            currentIndex: 0,
            completedCount: 0,
            totalCount: 0,
            unlockInfo: null,
            isLoading: false,
            error: null,

            // ===== Actions实现 =====

            /**
             * 初始化学习会话
             */
            initSession: async (userId: string, limit: number = 20) => {
                set({
                    isLoading: true,
                    error: null
                });

                try {
                    // ⭐ 使用cloudFunctionAdapter调用云函数
                    const response = await callCloudFunction<TodayLettersResponse>(
                        'getTodayMemories',  // action
                        {
                            userId,
                            entityType: 'letter',  // ⭐ 指定为字母
                            limit,
                            includeNew: true
                        },
                        {
                            endpoint: API_ENDPOINTS.MEMORY.GET_TODAY_MEMORIES.cloudbase
                        }
                    );

                    // 检查响应
                    console.log('🔍 initSession response:', JSON.stringify(response, null, 2));
                    if (!response.success) {
                        throw new Error(response.error || '获取学习内容失败');
                    }

                    // Robust data extraction
                    const rawData = response.data || response;
                    // Check for items in various possible locations
                    // 1. response.data.items (Standard)
                    // 2. response.items (Unwrapped)
                    // 3. response.data.data.items (Double wrapped)
                    const items = (rawData as any).items ||
                        ((rawData as any).data && (rawData as any).data.items) ||
                        ((response as any).items);

                    if (!items) {
                        console.error('❌ Invalid data structure. Response:', JSON.stringify(response, null, 2));
                        throw new Error(`响应数据格式错误: Unable to find items in response`);
                    }

                    // 如果没有学习内容
                    if (items.length === 0) {
                        set({
                            phase: LearningPhase.COMPLETED,
                            reviewQueue: [],
                            currentAlphabet: null,
                            totalCount: 0,
                            isLoading: false
                        });
                        return;
                    }

                    // 将后端返回的数据转换为学习状态
                    const reviewQueue: AlphabetLearningState[] = (items as any[])
                        .map((item: any) => {
                            // 从letters集合获取完整的Letter数据
                            const letter = getLetterById(item._id);
                            if (!letter) {
                                console.warn(`Letter not found: ${item._id}`);
                                return null;
                            }

                            // 转换为学习状态
                            const state = letterToLearningState(letter);

                            // 保存后端返回的记忆状态
                            if (item.memoryState) {
                                state.memoryState = item.memoryState;
                            }

                            return state;
                        })
                        .filter((item: any): item is AlphabetLearningState => item !== null);

                    // 更新store状态
                    set({
                        phase: LearningPhase.REVIEW,
                        reviewQueue,
                        currentAlphabet: reviewQueue[0] || null,
                        currentIndex: 0,
                        totalCount: reviewQueue.length,
                        completedCount: 0,
                        isLoading: false
                    });

                } catch (error) {
                    console.error('❌ initSession error:', error);
                    set({
                        error: error instanceof Error ? error.message : '加载失败',
                        isLoading: false
                    });
                }
            },

            /**
             * 提交学习结果
             */
            submitResult: async (userId: string, quality: QualityButton) => {
                const { currentAlphabet, currentIndex, reviewQueue } = get();

                if (!currentAlphabet) {
                    console.warn('No current alphabet to submit');
                    return;
                }

                set({ isLoading: true, error: null });

                try {
                    // 准备提交数据
                    const qualityText = QUALITY_TEXT_MAP[quality];  // '陌生'/'模糊'/'记得'

                    // ⭐ 使用cloudFunctionAdapter调用云函数
                    const response = await callCloudFunction(
                        'submitMemoryResult',  // action
                        {
                            userId,
                            entityType: 'letter',  // ⭐ 指定为字母
                            entityId: currentAlphabet.alphabetId,
                            quality: qualityText  // 后端期望文本,不是数字
                        },
                        {
                            endpoint: API_ENDPOINTS.MEMORY.SUBMIT_MEMORY_RESULT.cloudbase
                        }
                    );

                    if (!response.success) {
                        throw new Error(response.error || '提交失败');
                    }

                    // 更新当前字母的学习状态
                    const updatedQueue = [...reviewQueue];
                    const currentItem = updatedQueue[currentIndex];

                    if (currentItem) {
                        // 获取质量分数 (用于本地统计)
                        const qualityScore = QUALITY_SCORE_MAP[quality];

                        // 更新尝试次数 (根据质量不同增量)
                        const incrementMap: Record<QualityButton, number> = {
                            [QualityButton.KNOW]: 3,    // 记得: +3 (直接完成)
                            [QualityButton.FUZZY]: 1,   // 模糊: +1
                            [QualityButton.FORGET]: 2   // 陌生: +2
                        };
                        currentItem.currentAttempts += incrementMap[quality];

                        // 更新质量历史
                        currentItem.qualityHistory.push(qualityScore);

                        // 检查是否完成
                        if (currentItem.currentAttempts >= currentItem.requiredAttempts) {
                            currentItem.isCompleted = true;
                        }

                        // 更新时间戳
                        currentItem.timestamp = new Date().toISOString();
                    }

                    // 计算已完成数量
                    const completedCount = updatedQueue.filter(item => item.isCompleted).length;

                    // 自动移动到下一个
                    const nextIndex = currentIndex + 1;
                    const hasNext = nextIndex < updatedQueue.length;

                    set({
                        reviewQueue: updatedQueue,
                        completedCount,
                        currentIndex: hasNext ? nextIndex : currentIndex,
                        currentAlphabet: hasNext ? updatedQueue[nextIndex] : currentAlphabet,
                        phase: !hasNext && completedCount === updatedQueue.length
                            ? LearningPhase.COMPLETED
                            : LearningPhase.REVIEW,
                        isLoading: false
                    });

                } catch (error) {
                    console.error('❌ submitResult error:', error);
                    set({
                        error: error instanceof Error ? error.message : '提交失败',
                        isLoading: false
                    });
                }
            },

            /**
             * 下一个字母
             */
            nextAlphabet: () => {
                const { currentIndex, reviewQueue } = get();
                const nextIndex = Math.min(currentIndex + 1, reviewQueue.length - 1);

                set({
                    currentIndex: nextIndex,
                    currentAlphabet: reviewQueue[nextIndex] || null
                });
            },

            /**
             * 上一个字母
             */
            previousAlphabet: () => {
                const { currentIndex, reviewQueue } = get();
                const prevIndex = Math.max(currentIndex - 1, 0);

                set({
                    currentIndex: prevIndex,
                    currentAlphabet: reviewQueue[prevIndex] || null
                });
            },

            /**
             * 跳转到指定索引
             */
            goToIndex: (index: number) => {
                const { reviewQueue } = get();

                if (index >= 0 && index < reviewQueue.length) {
                    set({
                        currentIndex: index,
                        currentAlphabet: reviewQueue[index]
                    });
                }
            },

            /**
             * 重置会话
             */
            resetSession: () => {
                set({
                    phase: LearningPhase.REVIEW,
                    reviewQueue: [],
                    currentAlphabet: null,
                    currentIndex: 0,
                    completedCount: 0,
                    totalCount: 0,
                    unlockInfo: null,
                    isLoading: false,
                    error: null
                });
            },

            /**
             * 清除错误
             */
            clearError: () => {
                set({ error: null });
            }
        }),
        {
            name: 'alphabet-storage',
            storage: createJSONStorage(() => AsyncStorage),
            // 只持久化必要的状态
            partialize: (state) => ({
                completedCount: state.completedCount,
                unlockInfo: state.unlockInfo
            })
        }
    )
);

// ==================== 导出辅助Hooks ====================

/**
 * 获取当前学习进度百分比
 */
export const useAlphabetProgress = () => {
    const { completedCount, totalCount } = useAlphabetStore();
    return totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
};

/**
 * 检查是否还有未完成的字母
 */
export const useHasRemainingLetters = () => {
    const { reviewQueue, currentIndex } = useAlphabetStore();
    return currentIndex < reviewQueue.length - 1;
};

/**
 * 获取当前字母的详细信息
 */
export const useCurrentLetterDetails = () => {
    const { currentAlphabet } = useAlphabetStore();

    if (!currentAlphabet?.letterData) {
        return null;
    }

    return {
        letter: currentAlphabet.letterData,
        displayInfo: getLetterDisplayInfo(currentAlphabet.letterData),
        progress: {
            currentAttempts: currentAlphabet.currentAttempts,
            requiredAttempts: currentAlphabet.requiredAttempts,
            isCompleted: currentAlphabet.isCompleted
        }
    };
};