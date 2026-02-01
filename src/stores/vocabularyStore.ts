// src/stores/vocabularyStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient, callCloudFunction } from '@/src/utils/apiClient';
import { API_ENDPOINTS } from '@/src/config/api.endpoints';
import { useUserStore } from './userStore';
import { useModuleAccessStore, type ModuleType } from './moduleAccessStore';
import { VOCAB_CONFIG } from '@/src/entities/types/vocabulary.types';
import type {
    SessionWord,
    TodayVocabularyResponse,
    VocabularyProgress,
} from '@/src/entities/types/vocabulary.types';
import { LearningPhase } from '@/src/entities/enums/LearningPhase.enum';
import { QualityScore } from '@/src/entities/enums/QualityScore.enum';
import { resolveVocabPath } from '@/src/utils/vocab/vocabAudioHelper';
import { downloadAudioBatch } from '@/src/utils/audioCache';



interface VocabularyStore {
    // ===== 学习会话状态 =====
    phase: LearningPhase;  // 全局 UI 状态 (Loading / Idle / Learning...)
    currentCourseSource: string | null; // Added: Track current course source
    reviewQueue: SessionWord[]; // 复习队列
    newVocabQueue: SessionWord[]; // 新词队列

    // --- Chunk 管理 ---
    currentChunk: SessionWord[]; // 当前正在处理的词 (max: 5 )
    chunkPhase: 'ASSESSMENT' | 'QUIZ'; // 当前处于 "自评" 还是 "测验" 阶段
    currentIndex: number; // 当前指向 Chunk 中的第几个词

    // --- 统计 ---
    totalSessionWords: number;
    completedCount: number;

    // ===== 本地进度 =====
    progress: VocabularyProgress;
    courseProgressMap: Record<string, VocabularyProgress>;

    // ===== 学习会话操作 =====
    initSession: (userId: string, options?: { limit?: number, source?: string }) => Promise<void>;
    startCourse: (source: string, moduleType?: ModuleType) => Promise<void>; // Modified: Accept moduleType for access check
    rateCurrentWord: (score: QualityScore) => Promise<void>;
    submitQuizResult: (isCorrect: boolean) => Promise<void>;
    loadNextChunk: () => void;
    finishSession: () => void;

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
            // ===== 初始状态 =====
            phase: LearningPhase.VOCAB_IDLE,
            currentCourseSource: null,
            progress: defaultProgress,
            courseProgressMap: {},

            // [NEW] 新的队列状态
            reviewQueue: [],
            newVocabQueue: [],
            currentChunk: [],
            chunkPhase: 'ASSESSMENT',
            currentIndex: 0,

            totalSessionWords: 0,
            completedCount: 0,

            // ===== 初始化学习会话 =====
            initSession: async (userId: string, options: { limit?: number, source?: string } = {}) => {
                try {
                    const { limit, source } = options;
                    console.log('🔍 开始获取今日单词，userId:', userId, 'limit:', limit, 'source:', source);

                    // Set loading state
                    set({ phase: LearningPhase.VOCAB_LOADING });

                    const { currentCourseSource } = get();
                    const targetSource = source || currentCourseSource;

                    const result = await callCloudFunction<TodayVocabularyResponse>(
                        "getTodayMemories",
                        {
                            userId,
                            limit,
                            entityType: 'word',
                            source: targetSource
                        },
                        { endpoint: API_ENDPOINTS.MEMORY.GET_TODAY_MEMORIES.cloudbase }
                    );

                    console.log('🔍 API 响应:', result);

                    if (result.success && (result.data as any)?.items?.length > 0) {
                        const data = result.data as any;
                        // 1. 转换数据为 SessionWord
                        const allItems: SessionWord[] = data.items.map(
                            (item: any) => ({
                                id: item._id,
                                entity: item.entity,
                                isNew: (item.memoryState?.repetitions || 0) === 0,
                                masteryLevel: item.memoryState?.masteryLevel || 0,
                                //Initialize runtime state
                                phase: 'ASSESSMENT',
                                mistakeCount: 0,
                                selfRating: undefined
                            })
                        )

                        // 2. 分流到队列
                        // 筛选出复习词 (isNew = false) 和 新词 (isNew = true)
                        const reviewQueue = allItems.filter(w => !w.isNew);
                        const newVocabQueue = allItems.filter(w => w.isNew);
                        //静默预加载逻辑
                        const audioUrls = allItems.map(w => w.entity.audioPath
                            ? resolveVocabPath(w.entity.audioPath)
                            : null
                        ).filter((url): url is string => !!url && url.length > 0);
                        downloadAudioBatch(audioUrls).catch(e => console.error('Silent download failed', e));

                        // 4. 更新 Store，准备加载第一个 Chunk
                        set({
                            reviewQueue,
                            newVocabQueue,
                            currentChunk: [],    // 先清空
                            currentIndex: 0,
                            totalSessionWords: allItems.length,
                            completedCount: 0,
                            // 注意：这里先不设置 phase 为 LEARNING，loadNextChunk 会设置
                        });

                        // 5. 立即启动引擎
                        console.log(`✅ Loaded ${reviewQueue.length} review + ${newVocabQueue.length} new words. Starting engine...`);
                        // 立即加载第一个 Chunk
                        get().loadNextChunk();
                    } else {
                        console.log('ℹ️ 今日没有需要复习的单词');
                        set({
                            phase: LearningPhase.VOCAB_COMPLETED, // 如果没词，直接标记完成或空闲
                            reviewQueue: [],
                            newVocabQueue: [],
                            currentChunk: [],
                        });
                    }
                } catch (error) {
                    console.error('❌ initSession error:', error);
                    // set({
                    //     phase: LearningPhase.VOCAB_IDLE,
                    //     reviewQueue: [],
                    //     currentVocabulary: null,
                    // });
                    throw error;
                }
            },

            // ===== 核心引擎：加载下一个 Chunk =====
            /**
             * 加载下一个 Chunk
             * 优先把复习队列清空，如果复习队列为空，则加载新词队列
             * 
             */
            loadNextChunk: () => {
                const { reviewQueue, newVocabQueue, currentChunk } = get();

                // 1. Safety check，检查桌子是不是空的，不是空的不能上菜
                if (currentChunk.length > 0) {
                    console.warn('⚠️ Current chunk not finished, skipping load.');
                    return;
                }
                // 2. 取词策略: 优先把复习队列清空
                let nextBatch: SessionWord[] = [];
                let newReviewQueue = reviewQueue;
                let newNewVocabQueue = newVocabQueue;
                if (reviewQueue.length > 0) {
                    // Take from review
                    nextBatch = reviewQueue.slice(0, VOCAB_CONFIG.VOCAB_CHUNK_SIZE);
                    newReviewQueue = reviewQueue.slice(VOCAB_CONFIG.VOCAB_CHUNK_SIZE);
                } else if (newVocabQueue.length > 0) {
                    // Take from new
                    nextBatch = newVocabQueue.slice(0, VOCAB_CONFIG.VOCAB_CHUNK_SIZE);
                    newNewVocabQueue = newVocabQueue.slice(VOCAB_CONFIG.VOCAB_CHUNK_SIZE);
                }
                // 3. Update Store
                if (nextBatch.length > 0) {
                    console.log(`📦 Loaded chunk: ${nextBatch.length} words. (Review left: ${newReviewQueue.length}, New left: ${newNewVocabQueue.length})`);
                    //上菜，并告诉 UI：“开始显示第一个词的自评界面”
                    set({
                        currentChunk: nextBatch,
                        reviewQueue: newReviewQueue,
                        newVocabQueue: newNewVocabQueue,

                        // Reset chunk state
                        chunkPhase: 'ASSESSMENT',
                        currentIndex: 0,

                        // Ensure UI is in learning mode
                        phase: LearningPhase.VOCAB_LEARNING // 确保 UI 显示单词卡片
                    });
                } else {
                    console.log('🎉 Session finished! No more words.');
                    get().finishSession();
                }
            },
            // ===== Action: 用户评分 (Phase 1) =====
            rateCurrentWord: async (score: QualityScore) => {
                const { currentChunk, currentIndex } = get();
                const word = currentChunk[currentIndex];

                if (!word) return;

                // 1. 记录评分 (用于后续算法计算)
                // 我们不修改 currentChunk 引用，而是修改副本
                const newChunk = [...currentChunk];
                newChunk[currentIndex] = {
                    ...word,
                    selfRating: score
                };

                // 2. 移动指针
                const nextIndex = currentIndex + 1;

                // 3. 判断阶段流转
                if (nextIndex >= newChunk.length) {
                    // 自评结束 -> 进入测验阶段
                    console.log('🔄 Assessment done, switching to QUIZ phase (Sorting shuffled)');

                    // Simple Fisher-Yates shuffle
                    for (let i = newChunk.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [newChunk[i], newChunk[j]] = [newChunk[j], newChunk[i]];
                    }

                    set({
                        currentChunk: newChunk,
                        chunkPhase: 'QUIZ',
                        currentIndex: 0 // 重置指针，从头开始测验
                    });
                } else {
                    // 继续自评下一个
                    set({
                        currentChunk: newChunk,
                        currentIndex: nextIndex
                    });
                }
            },
            // ===== Action: 提交测试结果 (Phase 2) =====
            submitQuizResult: async (isCorrect: boolean) => {
                const { currentChunk, currentIndex } = get(); // 假设 store 里存了 userId 或者从 UserStore 取
                // 修正: userId 最好从 useUserStore 获取，或者 initSession 时存下来。这里先假设能取到
                const currentUserId = useUserStore.getState().currentUser?.userId;

                const word = currentChunk[currentIndex];
                if (!word) return;

                const newChunk = [...currentChunk];

                if (isCorrect) {
                    // 1. 答对了: 记录状态 (IsQuizPassed = true 逻辑隐含在不被追加到队尾)
                    // 其实这里不需要做特殊处理，只需移动指针
                } else {
                    // 2. 答错了: 惩罚
                    // 增加错误计数
                    newChunk[currentIndex] = {
                        ...word,
                        mistakeCount: word.mistakeCount + 1
                    };
                    // 💀 把这个词复制一份追加到队尾，强制一会再测一次
                    // 注意：这里我们其实是往 Chunk 尾部加，这样 currentIndex 往后走时还会遇到它
                    newChunk.push(newChunk[currentIndex]);
                }

                const nextIndex = currentIndex + 1;

                // 3. 检查 Chunk 是否彻底完成
                if (nextIndex >= newChunk.length) {
                    // 🎉 Chunk Clear! 结算当前 5 个词（注意要去除重复的错题记录，只结算原始的那 5 个 ID）
                    // 这里的逻辑稍微复杂：newChunk 里可能有重复的词（因为错题追加）。
                    // 我们只需要对 *原始* 的那 5 个词提交结果。

                    const uniqueWords = new Map();
                    newChunk.forEach(w => uniqueWords.set(w.id, w)); // 后面的会覆盖前面的，保留最新的 mistakeCount

                    console.log('🎉 Chunk completed. Submitting results...');

                    // 批量提交或逐个提交 (这里简化为逐个)
                    for (const w of uniqueWords.values()) {
                        // 计算最终得分: 自评(1-5) - 错误惩罚
                        // 简单算法示例: 
                        // SelfRating [1..5]
                        // Mistakes [0..N] -> 每个错误扣 1 分，最低 1 分
                        let finalScore = (w.selfRating || 3) - w.mistakeCount;
                        if (finalScore < 1) finalScore = 1;

                        // API Call
                        apiClient.post(API_ENDPOINTS.MEMORY.SUBMIT_MEMORY_RESULT, {
                            userId: currentUserId,
                            vocabularyId: w.id,
                            quality: finalScore
                        }).catch(err => console.error('Submit failed', err));

                        // 本地 Update: 标记已掌握 (如果分高)
                        // if (finalScore >= 4) get().markAsMastered(w.id);
                    }

                    // 加载下一组
                    get().loadNextChunk();

                } else {
                    // 继续测试下一个
                    set({
                        currentChunk: newChunk,
                        currentIndex: nextIndex
                    });
                }
            },

            // ===== 开始课程 =====
            startCourse: async (source: string, moduleType: ModuleType = 'word') => {
                // 🔒 Strict Safety Net: 验证是否有权限访问该模块
                const allowed = useModuleAccessStore.getState().checkAccessLocally(moduleType);
                // if (!allowed) {
                //     console.warn(`🚫 Access Denied: Module '${moduleType}' is locked. Cannot start course '${source}'.`);
                //     return; // ⛔️ 强制中断，不执行任何切换逻辑
                // }

                const { currentCourseSource, progress, courseProgressMap } = get();
                const userId = useUserStore.getState().currentUser?.userId;

                if (!userId) {
                    console.error("No user ID found, cannot start course");
                    return; // ⛔️ 强制中断，不执行任何切换逻辑
                }

                // If switching to a different course, reset progress
                if (currentCourseSource !== source) {
                    console.log(`🔄 Switching course from ${currentCourseSource} to ${source}.`);

                    const cachedProgress = courseProgressMap[source];
                    const updatedCache = currentCourseSource
                        ? { ...courseProgressMap, [currentCourseSource]: progress }
                        : { ...courseProgressMap };

                    // 1. Update local state & Cache
                    set({
                        courseProgressMap: updatedCache,
                        currentCourseSource: source,
                        progress: cachedProgress || defaultProgress,
                        reviewQueue: [],
                        newVocabQueue: [],
                        currentChunk: [],
                        currentIndex: 0,
                        phase: LearningPhase.VOCAB_IDLE
                    });

                    // 2. 自动触发初始化 (Risk 5 fix)
                    console.log('🚀 Auto-initializing session for new course...');
                    await get().initSession(userId, { source, limit: 10 });

                } else {
                    console.log(`▶️ Continuing course ${source}`);
                    // 如果是继续课程，且队列为空，也尝试重新初始化?
                    if (get().reviewQueue.length === 0) {
                        await get().initSession(userId, { source, limit: 10 });
                    }
                }
            },

            // ===== 提交答案 =====


            // ===== 完成会话 =====
            finishSession: () => {
                set({ phase: LearningPhase.VOCAB_COMPLETED });
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
