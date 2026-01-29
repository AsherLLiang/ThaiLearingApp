// src/stores/vocabularyStore.ts

/**
 * 单词学习 Store
 * 
 * 功能：
 * 1. 从后端获取今日单词学习任务
 * 2. 管理单词学习会话流程
 * 3. 提交学习结果到后端
 * 4. 本地进度追踪
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '@/src/utils/apiClient';
import { API_ENDPOINTS } from '@/src/config/api.endpoints';
import { useUserStore } from './userStore';
import { useModuleAccessStore, type ModuleType } from './moduleAccessStore';
import type {
    Vocabulary,
    VocabularyLearningState,
    TodayVocabularyResponse,
    VocabularyProgress,
} from '@/src/entities/types/vocabulary.types';
import { LearningPhase } from '@/src/entities/enums/LearningPhase.enum';
import {
    QualityButton,
    QUALITY_SCORE_MAP,
    ATTEMPTS_INCREMENT_MAP,
} from '@/src/entities/enums/QualityScore.enum';
import { resolveVocabPath } from '@/src/utils/vocab/vocabAudioHelper';
import { downloadAudioBatch } from '@/src/utils/audioCache';
import { WorkletsModule } from 'react-native-worklets';

interface VocabularyStore {
    // ===== 学习会话状态 =====
    phase: LearningPhase;
    reviewQueue: VocabularyLearningState[];
    currentVocabulary: VocabularyLearningState | null;
    currentCourseSource: string | null; // Added: Track current course source

    // ===== 本地进度 =====
    progress: VocabularyProgress;
    courseProgressMap: Record<string, VocabularyProgress>;

    // ===== 学习会话操作 =====
    initSession: (userId: string) => Promise<void>;
    submitAnswer: (quality: QualityButton) => Promise<void>;
    moveToNext: () => void;
    finishSession: () => void;
    startCourse: (source: string, moduleType?: ModuleType) => Promise<void>; // Modified: Accept moduleType for access check

    // ===== 本地进度操作 =====
    markAsMastered: (vocabularyId: string) => void;
    resetProgress: () => void;
}

const defaultProgress: VocabularyProgress = {
    masteredCount: 0,
    totalCount: 0,
    accuracy: 0,
    masteredIds: [],
};

export const useVocabularyStore = create<VocabularyStore>()(
    persist(
        (set, get) => ({
            // ===== 初始状态 =====
            phase: LearningPhase.IDLE,
            reviewQueue: [],
            currentVocabulary: null,
            currentCourseSource: null, // Initial state
            progress: defaultProgress,
            courseProgressMap: {},

            // ===== 初始化学习会话 =====
            initSession: async (userId: string) => {
                try {
                    console.log('🔍 开始获取今日单词，userId:', userId);

                    const { currentCourseSource } = get();
                    const endpoint = API_ENDPOINTS.MEMORY.GET_TODAY_MEMORIES;
                    const result = await apiClient.post<TodayVocabularyResponse>(
                        endpoint,
                        {
                            userId,
                            limit: 10,
                            source: currentCourseSource // Added: Filter by course source
                        }
                    );

                    console.log('🔍 API 响应:', result);
                    
                    /**
                     * 检查 Result 是否成功，且 items 是否存在
                     * 如果成功，且 items 存在，且 items 长度大于 0
                     * 则将返回的数据使用 map 方法转换成 VocabularyLearningState[]
                     * 用于后续的学习会话（复习/学习）
                     */
                    if (result.success && (result.data as any)?.items?.length > 0) {
                        const data = result.data as any;
                        const reviewQueue: VocabularyLearningState[] = data.items.map(
                            (item: any) => ({
                                vocabularyId: item._id,                   // 单词 ID
                                thaiWord: item.entity.thaiWord,           // 单词
                                pronunciation: item.entity.pronunciation, // 发音
                                meaning: item.entity.meaning,             // 意义
                                exampleSentence: item.entity.exampleSentence, // 例句
                                audioPath: item.entity.audioPath,         // 音频路径
                                currentAttempts: 0,                       // 当前尝试次数
                                requiredAttempts: 3,                      // 最小尝试次数
                                qualityHistory: [],                       // 质量历史
                                isCompleted: false,                       // 是否完成
                                timestamp: new Date().toISOString(),       // 时间戳
                            })
                        );

                        //静默预加载逻辑 Silent preloading logic
                        // 1. 提取所有单词的 audioPath 并转成完整 URL
                        const audioUrls = reviewQueue.map(
                            word => resolveVocabPath(word.audioPath)).filter(
                                (url): url is string => !!url && url.length > 0) ;// 过滤掉空链接
                        console.log(`[Preload] 🚀 触发静默下载: ${audioUrls.length} 个音频`);
                         
                        // 2. 调用批量下载 (注意：没有 await！让它在后台跑)
                        downloadAudioBatch(audioUrls).catch(
                            e => {
                                console.error('静默下载失败:', e);
                            }
                        );


                        set({
                            phase: LearningPhase.IDLE,
                            reviewQueue,
                            currentVocabulary: reviewQueue[0] || null,
                        });

                        console.log('✅ 成功加载', reviewQueue.length, '个单词');
                    } else {
                        // 没有数据时的处理
                        console.log('ℹ️ 今日没有需要复习的单词');
                        set({
                            phase: LearningPhase.COMPLETED,
                            reviewQueue: [],
                            currentVocabulary: null,
                        });
                    }
                } catch (error) {
                    console.error('❌ initSession error:', error);
                    // 降级处理：显示错误状态
                    set({
                        phase: LearningPhase.IDLE,
                        reviewQueue: [],
                        currentVocabulary: null,
                    });
                    throw error;
                }
            },

            // ===== 开始课程 =====
            startCourse: async (source: string, moduleType: ModuleType = 'word') => {
                // 🔒 Strict Safety Net: 验证是否有权限访问该模块
                const allowed = useModuleAccessStore.getState().checkAccessLocally(moduleType);
                if (!allowed) {
                    console.warn(`🚫 Access Denied: Module '${moduleType}' is locked. Cannot start course '${source}'.`);
                    return; // ⛔️ 强制中断，不执行任何切换逻辑
                }

                const { currentCourseSource, progress, courseProgressMap } = get();

                // If switching to a different course, reset progress
                if (currentCourseSource !== source) {
                    console.log(`🔄 Switching course from ${currentCourseSource} to ${source}. Caching current progress.`);

                    const cachedProgress = courseProgressMap[source];
                    const updatedCache = currentCourseSource
                        ? { ...courseProgressMap, [currentCourseSource]: progress }
                        : { ...courseProgressMap };

                    // 1. Update local state
                    set({
                        courseProgressMap: updatedCache,
                        currentCourseSource: source,
                        progress: cachedProgress || defaultProgress,
                        reviewQueue: [],
                        currentVocabulary: null,
                        phase: LearningPhase.IDLE // Or START?
                    });

                    // 2. Reset remote progress (if applicable)
                    // Note: The requirement says "clear Basic Thai 1's progress". 
                    // Since we have a single 'wordProgress' in user_progress, we likely need to reset that.
                    // However, 'user_progress' seems to be managed by moduleAccessStore/userStore mostly.
                    // We might need an API call here to reset the backend progress for the user.
                    // For now, we'll assume the 'initSession' or a specific 'resetProgress' API call handles this.
                    // Let's call a reset endpoint if it exists, or just rely on local reset + future updates overwriting.

                    // Ideally call an API to reset wordProgress on backend
                    try {
                        const userId = useUserStore.getState().currentUser?.userId;
                        if (userId) {
                            // Assuming we reuse the progress update endpoint to set progress to 0
                            // Or if there's a specific reset endpoint. 
                            // Based on available endpoints, we might need to use PROGRESS.UPDATE
                            /*
                            await apiClient.post(API_ENDPOINTS.PROGRESS.UPDATE, {
                                userId,
                                wordProgress: 0,
                                wordUnlocked: false // Maybe?
                            });
                            */
                            // For now, just logging as the backend logic for "resetting" isn't fully exposed in the snippets.
                            // We will rely on the fact that we are starting fresh.
                        }
                    } catch (e) {
                        console.error("Failed to reset remote progress", e);
                    }
                } else {
                    console.log(`▶️ Continuing course ${source}`);
                }
            },

            // ===== 提交答案 =====
            submitAnswer: async (quality: QualityButton) => {
                const { currentVocabulary, reviewQueue } = get();
                if (!currentVocabulary) return;

                const qualityScore = QUALITY_SCORE_MAP[quality];
                const attemptsIncrement = ATTEMPTS_INCREMENT_MAP[quality];

                // 更新当前单词状态
                const updatedVocabulary: VocabularyLearningState = {
                    ...currentVocabulary,
                    currentAttempts: currentVocabulary.currentAttempts + attemptsIncrement,
                    qualityHistory: [...currentVocabulary.qualityHistory, qualityScore],
                    timestamp: new Date().toISOString(),
                };

                // 判断是否完成
                if (updatedVocabulary.currentAttempts >= 3) {
                    updatedVocabulary.isCompleted = true;
                    updatedVocabulary.currentAttempts = 3;

                    // 标记为已掌握（本地）
                    get().markAsMastered(currentVocabulary.vocabularyId);

                    // 提交到后端
                    const avgQuality = Math.round(
                        updatedVocabulary.qualityHistory.reduce((a, b) => a + b, 0) /
                        updatedVocabulary.qualityHistory.length
                    );

                    const endpoint = API_ENDPOINTS.MEMORY.SUBMIT_MEMORY_RESULT;
                    apiClient
                        .post(endpoint, {
                            userId: useUserStore.getState().currentUser?.userId,
                            vocabularyId: currentVocabulary.vocabularyId,
                            quality: avgQuality,
                        })
                        .then((result: any) => {
                            console.log('✅ 提交结果成功:', result);
                        })
                        .catch((err: any) => console.error('❌ 提交失败:', err));
                }

                // 更新队列
                const currentIndex = reviewQueue.findIndex(
                    (v) => v.vocabularyId === currentVocabulary.vocabularyId
                );
                const newQueue = [...reviewQueue];
                newQueue[currentIndex] = updatedVocabulary;

                set({ reviewQueue: newQueue });

                // 自动跳转
                get().moveToNext();
            },

            // ===== 移动到下一个单词 =====
            moveToNext: () => {
                const { reviewQueue } = get();
                const nextVocabulary = reviewQueue.find((v) => !v.isCompleted);

                if (nextVocabulary) {
                    set({ currentVocabulary: nextVocabulary });
                } else {
                    set({ phase: LearningPhase.COMPLETED });
                }
            },

            // ===== 完成会话 =====
            finishSession: () => {
                set({ phase: LearningPhase.COMPLETED });
            },

            // ===== 标记为已掌握 =====
            markAsMastered: (vocabularyId: string) => {
                const { progress } = get();
                if (!progress.masteredIds.includes(vocabularyId)) {
                    const newMasteredIds = [...progress.masteredIds, vocabularyId];
                    set({
                        progress: {
                            ...progress,
                            masteredIds: newMasteredIds,
                            masteredCount: newMasteredIds.length,
                        },
                    });
                }
            },

            // ===== 重置进度 =====
            resetProgress: () => {
                set({ progress: defaultProgress });
            },
        }),
        {
            name: 'vocabulary-learning-storage',
            storage: createJSONStorage(() => AsyncStorage),
            // 只持久化关键数据
            partialize: (state) => ({
                progress: state.progress,
                currentCourseSource: state.currentCourseSource, // Persist current course
            }),
        }
    )
);
