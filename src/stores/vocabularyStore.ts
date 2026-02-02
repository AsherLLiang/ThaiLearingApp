// src/stores/vocabularyStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { callCloudFunction } from '@/src/utils/apiClient';
import { API_ENDPOINTS } from '@/src/config/api.endpoints';
import { useUserStore } from './userStore';
import {
    SessionWord,
    VocabSessionPhase,
    VocabularyResponse,
    VOCAB_SCORES,
} from '@/src/entities/types/vocabulary.types';
import { resolveVocabPath } from '@/src/utils/vocab/vocabAudioHelper';
import { downloadAudioBatch } from '@/src/utils/audioCache';
import { buildVocabQueue } from '@/src/utils/vocab/buildVocabQueue';



interface VocabularyStore {
    phase: VocabSessionPhase;
    currentCourseSource: string | null;
    queue: SessionWord[];
    currentIndex: number;
    totalSessionWords: number;
    completedCount: number;
    initSession: (userId: string, options?: { limit?: number, source?: string }) => Promise<void>;
    startCourse: (source: string, limit?: number) => Promise<void>;
    submitResult: (isCorrect: boolean, score?: number) => Promise<void>;
    next: () => void;
    finishSession: () => void;
}

/**
 * 单词学习 Store
 * 
 * 功能：
 * 1. 从后端获取今日单词学习任务
 * 2. 管理单词学习会话流程
 * 3. 提交学习结果到后端
 * 4. 本地进度追踪
 * 
 */
export const useVocabularyStore = create<VocabularyStore>()(
    persist(
        (set, get) => ({
            phase: VocabSessionPhase.IDLE,
            currentCourseSource: null,
            queue: [],
            currentIndex: 0,
            totalSessionWords: 0,
            completedCount: 0,
            initSession: async (userId: string, options: { limit?: number, source?: string } = {}) => {
                try {
                    set({ phase: VocabSessionPhase.LOADING });
                    const { limit, source } = options;
                    // 确保 limit 是合法整数且不是 NaN
                    const finalLimit = typeof limit === 'string' ? parseInt(limit, 10) : limit;
                    const safeLimit = (typeof finalLimit === 'number' && isFinite(finalLimit)) ? finalLimit : 20;

                    const result: any = await callCloudFunction<VocabularyResponse>(
                        "getTodayMemories",
                        { userId, limit: safeLimit, entityType: 'word', source: source || get().currentCourseSource },
                        { endpoint: API_ENDPOINTS.MEMORY.GET_TODAY_MEMORIES.cloudbase }
                    );
                    if (result.success && result.data?.items?.length > 0) {
                        const queue = buildVocabQueue(result.data);
                        // Extract audio directly from the original items to avoid iterating over the doubled queue
                        const audioUrls = result.data.items
                            .map((item: any) => item.audioPath ? resolveVocabPath(item.audioPath) : null)
                            .filter((url: any): url is string => !!url);

                        downloadAudioBatch(audioUrls).catch(console.error);

                        set({
                            queue,
                            currentIndex: 0,
                            // ⭐ 关键修复：进度条应基于单词数而非 queue 长度
                            totalSessionWords: result.data.summary?.total || result.data.items.length,
                            completedCount: 0,
                            phase: VocabSessionPhase.LEARNING
                        });
                    } else {
                        set({ phase: VocabSessionPhase.COMPLETED });
                    }
                } catch (error) {
                    console.error('❌ initSession failed:', error);
                    set({ phase: VocabSessionPhase.IDLE });
                }
            },
            submitResult: async (isCorrect: boolean, score?: number) => {
                const { queue, currentIndex, completedCount } = get();
                const currentItem = queue[currentIndex];
                if (!currentItem) return;

                const userId = useUserStore.getState().currentUser?.userId;

                // 如果回答错误，将该词加入队列末尾重练
                if (!isCorrect) {
                    const retryItem: SessionWord = {
                        ...currentItem,
                        source: 'vocab-error-retry',
                        mistakeCount: currentItem.mistakeCount + 1
                    };
                    set({ queue: [...queue, retryItem] });
                }

                // 判断是否为该单词的最后一个环节（测验环节或错题重练环节）
                const isFinalStep = currentItem.source === 'vocab-rev-quiz' ||
                    currentItem.source === 'vocab-new-quiz' ||
                    currentItem.source === 'vocab-error-retry';

                if (isCorrect && isFinalStep) {
                    set({ completedCount: completedCount + 1 });

                    if (userId) {
                        // ⭐ 逻辑优化：如果中途有过错误，质量评分自动降级
                        const finalQuality = currentItem.mistakeCount > 0
                            ? VOCAB_SCORES.PASS
                            : (score || VOCAB_SCORES.PERFECT);

                        callCloudFunction("submitMemoryResult", {
                            userId,
                            vocabularyId: currentItem.id,
                            quality: finalQuality
                        }, { endpoint: API_ENDPOINTS.MEMORY.SUBMIT_MEMORY_RESULT.cloudbase });
                    }
                }
                get().next();
            },
            next: () => {
                const { currentIndex, queue } = get();
                if (currentIndex + 1 < queue.length) {
                    set({ currentIndex: currentIndex + 1 });
                } else {
                    get().finishSession();
                }
            },
            startCourse: async (source: string, limit?: number) => {
                const userId = useUserStore.getState().currentUser?.userId;
                if (!userId) return;
                set({ currentCourseSource: source, currentIndex: 0, queue: [] });
                await get().initSession(userId, { source, limit });
            },
            finishSession: () => {
                set({ phase: VocabSessionPhase.COMPLETED });
            }
        }),
        {
            name: 'vocabulary-learning-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                currentCourseSource: state.currentCourseSource
            }),
        }
    )
);
