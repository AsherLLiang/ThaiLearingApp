// src/stores/alphabetStore.ts

/**
 * 统一字母学习 Store
 * 
 * 设计理念：
 * 1. 合并本地进度追踪和学习会话管理
 * 2. 字母数据存储在本地 JSON，无需云端获取
 * 3. 学习结果提交到统一记忆引擎（后端）
 * 4. 强制完成字母学习才能解锁单词模块
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '@/src/utils/apiClient';
import { API_ENDPOINTS } from '@/src/config/api.endpoints';
import { useUserStore } from './userStore';
import { getAllLetters, getLetterById } from '@/src/utils/letterData';
import type { Letter } from '@/src/entities/types/letter.types';
import type { MemoryStatus } from '@/src/entities/types/memory.types';
import type {
    AlphabetLearningState,
    UnlockInfo
} from '@/src/entities/types/alphabet.types';
import { LearningPhase } from '@/src/entities/enums/LearningPhase.enum';
import {
    QualityButton,
    QUALITY_SCORE_MAP,
    ATTEMPTS_INCREMENT_MAP,
} from '@/src/entities/enums/QualityScore.enum';
import { callCloudFunction } from '@/src/utils/cloudFunctionAdapter';

interface AlphabetStore {
    // ===== 本地进度数据 =====
    masteredIds: string[];              // 已掌握的字母 ID
    accuracy: number;                   // 正确率

    // ===== 学习会话数据 =====
    phase: LearningPhase;               // 当前学习阶段
    reviewQueue: AlphabetLearningState[]; // 学习队列
    currentAlphabet: AlphabetLearningState | null; // 当前字母

    // ===== 解锁状态 =====
    letterProgress: number;             // 字母学习进度 (0-100)
    wordUnlocked: boolean;              // 是否解锁单词学习

    // ===== 测试相关 =====
    testData: any | null;
    testAnswers: string[];
    testResult: any | null;

    // ===== 计算属性（Getters）=====
    getMasteredCount: () => number;
    getTotalCount: () => number;
    getProgressPercentage: () => number;
    isLetterMastered: (letterId: string) => boolean;

    // ===== 本地进度操作 =====
    markAsMastered: (letterId: string) => void;
    updateAccuracy: (accuracy: number) => void;
    resetProgress: () => void;

    // ===== 学习会话操作 =====
    initSession: (userId: string) => Promise<void>;
    submitAnswer: (quality: QualityButton) => Promise<void>;
    moveToNext: () => void;
    requestSkip: () => void;

    // ===== 测试操作 =====
    startTest: () => Promise<void>;
    submitTest: (answers: string[]) => Promise<void>;
    finishSession: () => void;
}

export const useAlphabetStore = create<AlphabetStore>()(
    persist(
        (set, get) => ({
            // ===== 初始状态 =====
            masteredIds: [],
            accuracy: 0,
            phase: LearningPhase.REVIEW,
            reviewQueue: [],
            currentAlphabet: null,
            letterProgress: 0,
            wordUnlocked: false,
            testData: null,
            testAnswers: [],
            testResult: null,

            // ===== 计算属性 =====
            getMasteredCount: () => get().masteredIds.length,

            getTotalCount: () => getAllLetters().length,

            getProgressPercentage: () => {
                const total = get().getTotalCount();
                const mastered = get().getMasteredCount();
                return total > 0 ? Math.round((mastered / total) * 100) : 0;
            },

            isLetterMastered: (letterId: string) => {
                return get().masteredIds.includes(letterId);
            },

            // ===== 本地进度操作 =====
            markAsMastered: (letterId: string) => {
                const { masteredIds } = get();
                if (!masteredIds.includes(letterId)) {
                    set({
                        masteredIds: [...masteredIds, letterId],
                        letterProgress: get().getProgressPercentage()
                    });
                }
            },

            updateAccuracy: (accuracy: number) => {
                set({ accuracy });
            },

            resetProgress: () => {
                set({
                    masteredIds: [],
                    accuracy: 0,
                    letterProgress: 0,
                    wordUnlocked: false,
                });
            },

            // ===== 初始化学习会话 =====
            initSession: async (userId: string) => {
                try {
                    // 方案 1: 从后端获取今日任务（使用统一记忆引擎）
                    // 后端会根据记忆曲线返回今天需要复习的字母
                    const result = await callCloudFunction<{
                        items: Array<{
                            _id: string;
                            thaiChar: string;
                            pronunciation: string;
                            audioPath?: string;
                            memoryState: MemoryStatus;
                        }>;
                        unlockInfo: { wordUnlocked: boolean };
                    }>(
                        'getTodayMemories',
                        {
                            userId,
                            entityType: 'letter',
                            limit: 10,
                        }
                    );

                    if (result.success && result.data?.items?.length) {
                        // 从后端返回的数据构建学习队列
                        const reviewQueue: AlphabetLearningState[] = result.data.items.map(
                            (item: any) => {
                                const letter = getLetterById(item.entityId);
                                return {
                                    alphabetId: item.entityId,
                                    thaiChar: letter?.thaiChar || '',
                                    category: letter?.type === 'vowel' ? 'vowel' : 'consonant',
                                    pronunciation: letter?.initialSound || '',
                                    example: letter?.exampleWord || '',
                                    audioPath: letter?.audioPath || '',
                                    currentAttempts: 0,
                                    requiredAttempts: 3,
                                    qualityHistory: [],
                                    isCompleted: false,
                                    timestamp: new Date().toISOString(),
                                    memoryState: item.memoryState,
                                };
                            }
                        );

                        set({
                            phase: LearningPhase.REVIEW,
                            reviewQueue,
                            currentAlphabet: reviewQueue[0] || null,
                            wordUnlocked: (result.data as any).unlockInfo?.wordUnlocked || false,
                        });
                    } else {
                        // 方案 2: 如果后端没有数据，使用本地逻辑
                        // 选择未掌握的字母作为今日任务
                        const allLetters = getAllLetters();
                        const { masteredIds } = get();
                        const unmasteredLetters = allLetters.filter(
                            (letter) => !masteredIds.includes(letter._id)
                        );

                        // 随机选择 10 个未掌握的字母
                        const selectedLetters = unmasteredLetters
                            .sort(() => Math.random() - 0.5)
                            .slice(0, 10);

                        const reviewQueue: AlphabetLearningState[] = selectedLetters.map(
                            (letter) => ({
                                alphabetId: letter._id,
                                thaiChar: letter.thaiChar,
                                category: letter.type === 'vowel' ? 'vowel' : 'consonant',
                                pronunciation: letter.initialSound,
                                example: letter.exampleWord,
                                audioPath: letter.audioPath,
                                currentAttempts: 0,
                                requiredAttempts: 3,
                                qualityHistory: [],
                                isCompleted: false,
                                timestamp: new Date().toISOString(),
                            })
                        );

                        set({
                            phase: LearningPhase.REVIEW,
                            reviewQueue,
                            currentAlphabet: reviewQueue[0] || null,
                        });
                    }
                } catch (error) {
                    console.error('initSession error:', error);
                    // 降级到本地模式
                    const allLetters = getAllLetters();
                    const { masteredIds } = get();
                    const unmasteredLetters = allLetters.filter(
                        (letter) => !masteredIds.includes(letter._id)
                    );

                    const selectedLetters = unmasteredLetters.slice(0, 10);
                    const reviewQueue: AlphabetLearningState[] = selectedLetters.map(
                        (letter) => ({
                            alphabetId: letter._id,
                            thaiChar: letter.thaiChar,
                            category: letter.type === 'vowel' ? 'vowel' : 'consonant',
                            pronunciation: letter.initialSound,
                            example: letter.exampleWord,
                            audioPath: letter.audioPath,
                            currentAttempts: 0,
                            requiredAttempts: 3,
                            qualityHistory: [],
                            isCompleted: false,
                            timestamp: new Date().toISOString(),
                        })
                    );

                    set({
                        phase: LearningPhase.REVIEW,
                        reviewQueue,
                        currentAlphabet: reviewQueue[0] || null,
                    });
                }
            },

            // ===== 提交答案 =====
            submitAnswer: async (quality: QualityButton) => {
                const { currentAlphabet, reviewQueue } = get();
                if (!currentAlphabet) return;

                const qualityScore = QUALITY_SCORE_MAP[quality];
                const attemptsIncrement = ATTEMPTS_INCREMENT_MAP[quality];

                // 更新当前字母状态
                const updatedAlphabet: AlphabetLearningState = {
                    ...currentAlphabet,
                    currentAttempts: currentAlphabet.currentAttempts + attemptsIncrement,
                    qualityHistory: [...currentAlphabet.qualityHistory, qualityScore],
                    timestamp: new Date().toISOString(),
                };

                // 判断是否完成
                if (updatedAlphabet.currentAttempts >= 3) {
                    updatedAlphabet.isCompleted = true;
                    updatedAlphabet.currentAttempts = 3;

                    // 标记为已掌握（本地）
                    get().markAsMastered(currentAlphabet.alphabetId);

                    // 提交到后端记忆引擎
                    const avgQuality = Math.round(
                        updatedAlphabet.qualityHistory.reduce((a, b) => a + b, 0) /
                        updatedAlphabet.qualityHistory.length
                    );

                    const endpoint = API_ENDPOINTS.MEMORY.SUBMIT_MEMORY_RESULT;
                    apiClient
                        .post(endpoint, {
                            userId: useUserStore.getState().currentUser?.userId,
                            entityType: 'alphabet',
                            entityId: currentAlphabet.alphabetId,
                            quality: avgQuality,
                        })
                        .then((result: any) => {
                            if (result.data?.unlockInfo?.unlocked) {
                                set({ wordUnlocked: true });
                                alert('🎉 恭喜！字母学习完成，单词模块已解锁！');
                            }
                        })
                        .catch((err: any) => console.error('提交失败:', err));
                }

                // 更新队列
                const currentIndex = reviewQueue.findIndex(
                    (a) => a.alphabetId === currentAlphabet.alphabetId
                );
                const newQueue = [...reviewQueue];
                newQueue[currentIndex] = updatedAlphabet;

                set({ reviewQueue: newQueue });

                // 自动跳转
                get().moveToNext();
            },

            // ===== 移动到下一个字母 =====
            moveToNext: () => {
                const { reviewQueue, letterProgress, wordUnlocked } = get();
                const nextAlphabet = reviewQueue.find((a) => !a.isCompleted);

                if (nextAlphabet) {
                    set({ currentAlphabet: nextAlphabet });
                } else {
                    if (letterProgress >= 95 || wordUnlocked) {
                        set({ phase: LearningPhase.COMPLETED });
                    } else {
                        set({ phase: LearningPhase.TEST_PROMPT });
                    }
                }
            },

            // ===== 请求跳过 =====
            requestSkip: () => {
                set({ phase: LearningPhase.TEST_PROMPT });
            },

            // ===== 开始测试 =====
            startTest: async () => {
                try {
                    const userId = useUserStore.getState().currentUser?.userId;
                    const endpoint = API_ENDPOINTS.ALPHABET.GET_TEST;
                    const result = await apiClient.post(endpoint, { userId });

                    if (!result.success) {
                        throw new Error(result.error || '获取测试题失败');
                    }

                    set({
                        phase: LearningPhase.TESTING,
                        testData: result.data,
                        testAnswers: new Array((result.data as any).questions?.length || 0).fill(''),
                    });
                } catch (error) {
                    console.error('startTest error:', error);
                }
            },

            // ===== 提交测试 =====
            submitTest: async (answers: string[]) => {
                try {
                    const userId = useUserStore.getState().currentUser?.userId;
                    const { testData } = get();

                    const endpoint = API_ENDPOINTS.ALPHABET.SUBMIT_TEST;
                    const result = await apiClient.post(endpoint, {
                        userId,
                        testId: testData.testId,
                        answers,
                    });

                    if (!result.success) {
                        throw new Error(result.error || '提交测试失败');
                    }

                    set({
                        phase: LearningPhase.TEST_RESULT,
                        testResult: result.data,
                        wordUnlocked: (result.data as any).unlocked || false,
                    });
                } catch (error) {
                    console.error('submitTest error:', error);
                }
            },

            // ===== 完成会话 =====
            finishSession: () => {
                set({ phase: LearningPhase.COMPLETED });
            },
        }),
        {
            name: 'alphabet-storage',
            storage: createJSONStorage(() => AsyncStorage),
            // 只持久化关键数据
            partialize: (state) => ({
                masteredIds: state.masteredIds,
                accuracy: state.accuracy,
                letterProgress: state.letterProgress,
                wordUnlocked: state.wordUnlocked,
            }),
        }
    )
);
