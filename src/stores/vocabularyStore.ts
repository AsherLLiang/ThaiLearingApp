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
import { resolveVocabPath, getAllVocabAudioPaths } from '@/src/utils/vocab/vocabAudioHelper';
import { downloadAudioBatch } from '@/src/utils/audioCache';
import { buildVocabQueue } from '@/src/utils/vocab/buildVocabQueue';
import { ModuleType } from './moduleAccessStore';



interface VocabularyStore {
    phase: VocabSessionPhase;
    currentCourseSource: string | null;
    queue: SessionWord[];
    currentIndex: number;
    totalSessionWords: number;
    completedCount: number;
    pendingResults: Array<{ userId: string, entityId: string, entityType: string, quality: number, vId?: number, source?: string }>;
    skippedIds: string[]; // Track skipped word IDs
    sessionPool: SessionWord[]; // 原始完整词列表快照，不受 skipWord 影响，用于干扰项生成
    recentWrongWords: SessionWord[]; // 本轮 mistakeCount > 2 的词，会话结束时填充，下次开始时清空
    initSession: (userId: string, options?: { limit?: number, source?: string }) => Promise<void>;
    startCourse: (source: string, limit?: number, moduleType?: ModuleType) => Promise<void>;
    submitResult: (isCorrect: boolean, score?: number) => Promise<void>;
    markSelfRating: (rating: number) => void;
    skipWord: (id: string) => void;
    submitSkippedWords: () => Promise<void>;
    next: () => void;
    finishSession: () => void;
    resetSession: () => void;
    flushResults: () => Promise<void>;
    clearForLogout: () => void; // 登出时完整清除所有状态（含持久化字段）
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
            pendingResults: [],
            skippedIds: [],
            sessionPool: [], // 原始词列表快照
            recentWrongWords: [], // 本轮错词（完成后填充）
            //Above are the variables that are used to store the state of the vocabulary store

            //================= 下面是函数=================
            initSession: async (userId: string, options: { limit?: number, source?: string } = {}) => {
                try {
                    set({ 
                        phase: VocabSessionPhase.LOADING, 
                        pendingResults: [], 
                        skippedIds: [] ,
                        recentWrongWords: []
                    }); // Clear pending, skipped & wrong words
                    
                    const { limit, source } = options;
                    // 确保 limit 是合法整数且不是 NaN
                    const finalLimit = typeof limit === 'string' ? parseInt(limit, 10) : limit;
                    const safeLimit = (typeof finalLimit === 'number' && isFinite(finalLimit)) ? finalLimit : 5;
                    console.log(`🚀 开始获取单词学习任务，限制为${safeLimit}`);
                    console.log(`🚀 initSession params: source=${source}, limit=${limit}`);
                    const result: any = await callCloudFunction<VocabularyResponse>(
                        "getTodayMemories",
                        { userId, limit: safeLimit, entityType: 'word', source: source || get().currentCourseSource },
                        { endpoint: API_ENDPOINTS.MEMORY.GET_TODAY_MEMORIES.cloudbase }
                    );
                    if (result.success && result.data?.items?.length > 0) {
                        const queue = buildVocabQueue(result.data);

                        // DEBUG: Inspect data structure
                        console.log('🔍 [Debug] First item fields:', Object.keys(result.data.items[0]));
                        if (result.data.items[0].audioPath) {
                            console.log('🔍 [Debug] audioPath found:', result.data.items[0].audioPath);
                        }

                        // Extract ALL associated audio (main, example, dialogue, cognates)
                        const audioUrls = (result.data.items || []).flatMap((item: any) =>
                            getAllVocabAudioPaths(item)
                                .map((path: string) => resolveVocabPath(path, item.source))
                                .filter(Boolean)
                        );

                        console.log(`📦 [Audio] Found ${audioUrls.length} total URLs to check`);
                        if (audioUrls.length > 0) {
                            downloadAudioBatch(audioUrls).catch(console.error);
                        }

                        set({
                            queue,
                            sessionPool: queue, // 保存原始快照，skipWord 不修改此字段
                            currentIndex: 0,
                            totalSessionWords: result.data.summary?.total || result.data.items.length,
                            completedCount: 0,
                            phase: VocabSessionPhase.LEARNING,
                            pendingResults: [] // Reset buffer
                        });
                    } else {
                        set({ phase: VocabSessionPhase.COMPLETED });
                    }
                } catch (error) {
                    console.error('❌ initSession failed:', error);
                    set({ phase: VocabSessionPhase.IDLE });
                }
            },
            markSelfRating: (rating: number) => {
                const { queue, currentIndex } = get();
                const currentItem = queue[currentIndex];
                if (!currentItem) return;

                // 1. Update current item's rating
                const updatedQueue = [...queue];
                updatedQueue[currentIndex] = { ...currentItem, selfRating: rating };

                // 2. State Sync: Find the corresponding Quiz item and sync the rating
                // Search forward from current index
                for (let i = currentIndex + 1; i < updatedQueue.length; i++) {
                    const nextItem = updatedQueue[i];
                    // Correct Sync Logic: Same ID, and is a Quiz Phase
                    if (nextItem.id === currentItem.id &&
                        (nextItem.source === 'vocab-rev-quiz' || nextItem.source === 'vocab-new-quiz')) {
                        updatedQueue[i] = { ...nextItem, selfRating: rating };
                        break; // Found the match, stop sync
                    }
                }

                set({ queue: updatedQueue });
                // Do NOT call next() here. We wait for manual "Next" button in UI.
            },
            submitResult: async (isCorrect: boolean, score?: number) => {
                const { queue, currentIndex, completedCount, pendingResults } = get();
                const currentItem = queue[currentIndex];
                if (!currentItem) return;

                const userId = useUserStore.getState().currentUser?.userId;

                // === Case 1: Wrong Answer ===
                // Immediate Retry (Stay on card) + Increment Mistake Count
                if (!isCorrect) {
                    // Counter Logic: Increment mistakeCount ONLY IF NOT in retry phase
                    const shouldIncrement = currentItem.source !== 'vocab-error-retry';
                    const newMistakeCount = shouldIncrement ? currentItem.mistakeCount + 1 : currentItem.mistakeCount;

                    const updatedQueue = [...queue];
                    updatedQueue[currentIndex] = { ...currentItem, mistakeCount: newMistakeCount };

                    set({ queue: updatedQueue });
                    // DO NOT call next(). Wait for user to retry.
                    return;
                }

                // === Case 2: Correct Answer ===
                // Determine if we are finishing the interaction with this word
                const isFinalStep = currentItem.source === 'vocab-rev-quiz' ||
                    currentItem.source === 'vocab-new-quiz' ||
                    currentItem.source === 'vocab-error-retry';

                if (isCorrect && isFinalStep) {
                    set({ completedCount: completedCount + 1 });

                    // --- Scoring Matrix Calculation ---
                    const R = currentItem.selfRating || 3; // Default to 3 (Pass) if missing
                    const M = currentItem.mistakeCount;
                    let finalQuality = R;

                    if (R === 5) { // Remembered / Know
                        if (M === 0) finalQuality = 5;       // Perfect
                        else if (M === 1) finalQuality = 4;  // Good (Remembered + 1 Slip)
                        else finalQuality = 3;               // Pass (Remembered + Many Errors)
                    } else if (R === 3) { // Fuzzy / Don't Know
                        if (M === 0) finalQuality = 3;       // Pass
                        else finalQuality = 2;               // Weak
                    } else if (R === 1) { // Forgot
                        finalQuality = 1;                    // Fail
                    } else {
                        // Default fallback (e.g. R=2/4 if ever supported)
                        finalQuality = Math.max(1, R - (M > 0 ? 1 : 0));
                    }

                    // --- Deferred Submission (Buffer) ---
                    // Refinement: vocab-error-retry does NOT re-submit scores.
                    const shouldSubmitScore = currentItem.source !== 'vocab-error-retry';

                    if (userId && shouldSubmitScore) {
                        const payload = {
                            userId,
                            entityId: currentItem.id,
                            entityType: 'word',
                            quality: finalQuality,
                            vId: currentItem.entity.vId,
                            source: currentItem.entity.source
                        };
                        set({ pendingResults: [...pendingResults, payload] });
                    }

                    // --- Retry Queue Logic ---
                    // If word had mistakes, it needs a dedicated Retry Phase later
                    if (M > 0) {
                        // Check if this item is already a retry item logic? 
                        // "into the queue end"
                        // We always push a new Retry Item if M > 0, UNLESS it's already a retry item?
                        // Plan: "如果是第一次在测验中做错...进入后续的 Retry Phase"
                        // Actually, if I am in vocab-error-retry and I initially got it wrong (Stay) and then right,
                        // do I need to push it AGAIN?
                        // User said: "Retry Phase: Wrong answers do NOT increment mistakeCount".
                        // Usually Retry Phase assumes "Iterate until correct". Once correct, it's done. 
                        // We don't loop retry-items forever unless they fail *again*?
                        // But here we implement "Immediate Retry" (Stay). So once they pass, they pass.
                        // So we ONLY push to retry queue if `source !== 'vocab-error-retry'`.
                        if (currentItem.source !== 'vocab-error-retry') {
                            const retryItem: SessionWord = {
                                ...currentItem,
                                source: 'vocab-error-retry',
                                // Keep mistake count for history, or reset?
                                // Actually, keep it so we know it was a problem.
                                // But for the NEW retry item, should we reset mistakeCount?
                                // No, keep it.
                            };
                            set({ queue: [...queue, retryItem] });
                        }
                    }
                }

                // Proceed to next
                get().next();
            },
            skipWord: (id: string) => {
                const { queue, skippedIds, currentIndex } = get();
                // 1. Add to skippedIds
                if (!skippedIds.includes(id)) {
                    set({ skippedIds: [...skippedIds, id] });
                }

                // 2. Remove from queue (all instances of this word)
                const newQueue = queue.filter(w => w.id !== id);

                set({ queue: newQueue });

                // Check bounds
                if (currentIndex >= newQueue.length) {
                    if (newQueue.length === 0) {
                        // 先跳转完成页，网络请求后台静默执行，不阻塞 UI
                        get().finishSession();
                        get().submitSkippedWords().catch(e => console.error('\u274c submitSkippedWords failed:', e));
                        get().flushResults().catch(e => console.error('\u274c flushResults failed:', e));
                    }
                }
            },

            submitSkippedWords: async () => {
                const { skippedIds } = get();
                const userId = useUserStore.getState().currentUser?.userId;

                if (!userId || skippedIds.length === 0) return;

                console.log(`🚀 Submitting ${skippedIds.length} skipped words...`);
                try {
                    const results = skippedIds.map(id => ({
                        entityType: 'word',
                        entityId: id,
                        quality: 0, // Ignored by backend when isSkipped is true
                        isSkipped: true
                    }));

                    // Use batch submission
                    await callCloudFunction(
                        "submitMemoryResult",
                        { userId, results },
                        { endpoint: API_ENDPOINTS.MEMORY.SUBMIT_MEMORY_RESULT.cloudbase }
                    );

                    console.log("✅ Skipped words submitted.");
                    // 不在这里清空 skippedIds，避免用户进入 session-summary 时丢失“跳过词”展示。
                    // skippedIds 会在下一次 initSession/startCourse 时被重置。
                } catch (e) {
                    console.error("❌ Failed to submit skipped words:", e);
                }
            },
            next: async () => {
                const { currentIndex, queue } = get();
                if (currentIndex + 1 < queue.length) {
                    set({ currentIndex: currentIndex + 1 });
                } else {
                    // 先跳转完成页，网络请求后台静默执行，不阻塞 UI
                    get().finishSession();
                    get().submitSkippedWords().catch(e => console.error('\u274c submitSkippedWords failed:', e));
                    get().flushResults().catch(e => console.error('\u274c flushResults failed:', e));
                }
            },
            flushResults: async () => {
                const { pendingResults } = get();
                if (pendingResults.length === 0) return;

                console.log(`🚀 Flushing ${pendingResults.length} vocabulary results...`);

                // Batch/Parallel processing could be implemented here if API supports batch
                // For now, parallel clean requests
                try {
                    await Promise.all(pendingResults.map(p =>
                        callCloudFunction("submitMemoryResult", p, { endpoint: API_ENDPOINTS.MEMORY.SUBMIT_MEMORY_RESULT.cloudbase })
                    ));
                    console.log("✅ Results flushed successfully.");
                    set({ pendingResults: [] });
                } catch (e) {
                    console.error("❌ Failed to flush results:", e);
                    // Strategy: Keep them in pending? Or fail silent? 
                    // For now, log error. SM2 is resilient to missed updates (just reviewing again sooner/later).
                    // But ideally we might want to retry? keeping it simple for now.
                }
            },
            startCourse: async (source: string, limit?: number, moduleType: ModuleType = 'word') => {
                console.log(`🚀 开始课程：${source}，限制为${limit}`);
                const userId = useUserStore.getState().currentUser?.userId;
                if (!userId) return;
                set(
                    {
                        currentCourseSource: source,
                        currentIndex: 0,
                        queue: [],
                        pendingResults: [],
                        phase: VocabSessionPhase.IDLE
                    }
                );//Reset state of vocabulary session

                if (moduleType === 'letter') {
                    set({ phase: VocabSessionPhase.IDLE });
                    return;
                }

                await get().initSession(userId, { source, limit });
            },

            finishSession: () => {
                const { queue } = get();
                // 去重：同一个词可以在 queue 里出现多次（原始项 + retry 副本）
                // mistakeCount 只在非 retry 项上自增，所以只取 source !== 'vocab-error-retry' 的项
                const seen = new Set<string>();
                const wrongWords = queue
                    .filter(w => w.source !== 'vocab-error-retry' && w.mistakeCount > 1)
                    .filter(w => { const ok = !seen.has(w.id); seen.add(w.id); return ok; });

                // 只有本轮有错词时才覆盖，否则保留上次的错词列表
                if (wrongWords.length > 0) {
                    set({ phase: VocabSessionPhase.COMPLETED, recentWrongWords: wrongWords });
                } else {
                    set({ phase: VocabSessionPhase.COMPLETED });
                }
            },
            resetSession: () => {
                set({ phase: VocabSessionPhase.IDLE });
            },
            // 登出时调用：完整清除所有状态，包含持久化字段 currentCourseSource
            // 防止不同用户在同一设备上共享学习进度
            clearForLogout: () => {
                set({
                    phase: VocabSessionPhase.IDLE,
                    currentCourseSource: null,
                    queue: [],
                    sessionPool: [],
                    currentIndex: 0,
                    totalSessionWords: 0,
                    completedCount: 0,
                    pendingResults: [],
                    skippedIds: [],
                    recentWrongWords: [],
                });
            }
        }),
        {
            name: 'vocabulary-learning-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                currentCourseSource: state.currentCourseSource,
                recentWrongWords: state.recentWrongWords,
            }),
        }
    )
);
