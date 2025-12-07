// src/stores/moduleAccessStore.ts

/**
 * 模块访问控制 Store
 * 
 * 功能：
 * 1. 检查用户是否有权限访问某个模块
 * 2. 缓存访问权限结果
 * 3. 提供全局进度数据
 */

import { create } from 'zustand';
import { callCloudFunction } from '@/src/utils/apiClient';
import { API_ENDPOINTS } from '@/src/config/api.endpoints';
import { useUserStore } from './userStore';
import { SEQUENCE_LESSONS } from '@/src/config/alphabet/lettersSequence';

// ==================== 类型定义 ====================

/**
 * 模块类型
 * 
 * 注意：
 * - 与后端 memory-engine.checkModuleAccess 保持一致，字母模块使用 'letter'
 */
export type ModuleType = 'letter' | 'word' | 'sentence' | 'article';

/**
 * 用户进度数据
 */
export interface UserProgress {
    // 字母学习进度
    letterProgress: number;           // 0-1 (后端存储为比例值)
    letterCompleted: boolean;         // Added: Whether letter learning is completed
    letterMasteredCount: number;      // 已掌握字母数
    letterTotalCount: number;         // 总字母数

    // 单词学习进度
    wordProgress: number;             // 0-100
    wordMasteredCount: number;        // 已掌握单词数
    wordTotalCount: number;           // 总单词数

    // 句子学习进度
    sentenceProgress: number;         // 0-100
    sentenceMasteredCount: number;    // 已掌握句子数
    sentenceTotalCount: number;       // 总句子数

    // 文章学习进度
    articleProgress: number;          // 0-100
    articleMasteredCount: number;     // 已掌握文章数
    articleTotalCount: number;        // 总文章数

    // 解锁状态
    wordUnlocked: boolean;            // 单词模块是否解锁
    sentenceUnlocked: boolean;        // 句子模块是否解锁
    articleUnlocked: boolean;         // 文章模块是否解锁

    /**
     * 字母课程完成情况（仅前端使用）
     * 例如: ['lesson1','lesson2',...]
     */
    completedAlphabetLessons?: string[];

    // 设置
    dailyLimit?: number;              // 每日学习数量设置
}

/**
 * 访问检查响应
 */
interface CheckAccessResponse {
    allowed: boolean;
    reason?: string;
    requiredProgress?: number;
    currentProgress?: number;
}

/**
 * 用户进度响应
 */
interface UserProgressResponse {
    progress: UserProgress;
}

// ==================== Store 定义 ====================

interface ModuleAccessStore {
    // ===== 状态 =====
    userProgress: UserProgress | null;
    accessCache: Map<ModuleType, boolean>;
    isLoading: boolean;
    error: string | null;

    // ===== 方法 =====
    checkAccess: (moduleType: ModuleType) => Promise<boolean>;
    checkAccessLocally: (moduleType: ModuleType) => boolean;
    getUserProgress: () => Promise<void>;
    clearCache: () => void;
    setError: (error: string | null) => void;
    setDailyLimit: (moduleType: ModuleType, limit: number) => void;
    /**
     * 标记某个字母课程已完成（仅用于字母模块解锁链路）
     */
    markAlphabetLessonCompleted: (lessonId: string) => void;
}

// ==================== 默认进度数据 ====================

const defaultProgress: UserProgress = {
    letterProgress: 0,
    letterCompleted: false,
    letterMasteredCount: 0,
    letterTotalCount: 44,
    wordProgress: 0,
    wordMasteredCount: 0,
    wordTotalCount: 0,
    sentenceProgress: 0,
    sentenceMasteredCount: 0,
    sentenceTotalCount: 0,
    articleProgress: 0,
    articleMasteredCount: 0,
    articleTotalCount: 0,
    wordUnlocked: false,
    sentenceUnlocked: false,
    articleUnlocked: false,
};

// ==================== Store 实现 ====================

export const useModuleAccessStore = create<ModuleAccessStore>()((set, get) => ({
    // ===== 初始状态 =====
    userProgress: null,
    accessCache: new Map<ModuleType, boolean>(),
    isLoading: false,
    error: null,

    // ===== 检查模块访问权限 =====
    /**
     * 检查用户是否有权限访问某个模块
     * 
     * @param moduleType 模块类型
     * @returns 是否有权限访问
     */
    checkAccess: async (moduleType: ModuleType): Promise<boolean> => {
        const { accessCache } = get();
        const userId = useUserStore.getState().currentUser?.userId;

        if (!userId) {
            console.warn('⚠️ 用户未登录，无法检查模块访问权限');
            return false;
        }

        // 1. 检查缓存
        if (accessCache.has(moduleType)) {
            const cachedResult = accessCache.get(moduleType);
            console.log(`✅ 从缓存获取 ${moduleType} 访问权限:`, cachedResult);
            return cachedResult!;
        }

        try {
            set({ isLoading: true, error: null });

            // 2. 调用云函数检查权限
            const result = await callCloudFunction<CheckAccessResponse>(
                'checkModuleAccess',
                {
                    userId,
                    moduleType,
                },
                {
                    endpoint: API_ENDPOINTS.MEMORY.GET_TODAY_MEMORIES.cloudbase,
                }
            );

            if (result.success && result.data) {
                const allowed = result.data.allowed;

                // 3. 缓存结果
                const newCache = new Map(accessCache);
                newCache.set(moduleType, allowed);
                set({ accessCache: newCache, isLoading: false });

                console.log(`✅ ${moduleType} 访问权限检查完成:`, allowed);

                // 如果不允许，记录原因
                if (!allowed && result.data.reason) {
                    console.log(`📌 拒绝原因: ${result.data.reason}`);
                }

                return allowed;
            } else {
                // 请求失败，降级处理
                console.warn('⚠️ 云函数调用失败，使用本地逻辑判断');
                const localAllowed = get().checkAccessLocally(moduleType);

                // 缓存本地判断结果
                const newCache = new Map(accessCache);
                newCache.set(moduleType, localAllowed);
                set({ accessCache: newCache, isLoading: false });

                return localAllowed;
            }
        } catch (error: any) {
            console.error('❌ checkAccess error:', error);
            set({ error: error.message || '检查权限失败', isLoading: false });

            // 降级到本地逻辑
            const localAllowed = get().checkAccessLocally(moduleType);

            // 缓存本地判断结果
            const newCache = new Map(get().accessCache);
            newCache.set(moduleType, localAllowed);
            set({ accessCache: newCache });

            return localAllowed;
        }
    },

    // ===== 本地权限检查逻辑（降级方案）=====
    /**
     * 本地权限检查逻辑（降级方案）
     * 
     * @param moduleType 模块类型
     * @returns 是否有权限访问
     */
    checkAccessLocally: (moduleType: ModuleType): boolean => {
        const { userProgress } = get();

        if (!userProgress) {
            // 如果没有进度数据，允许访问字母模块，其他模块不允许
            return moduleType === 'letter';
        }

        // 与后端 memory-engine.checkModuleAccess 的意图保持一致：
        // - 字母模块始终可访问
        // - 只要 letterCompleted 为 true，或 letterProgress ≥ 0.8，所有非字母模块统一解锁
        if (moduleType === 'letter') {
            return true;
        }

        const finishedByTest = !!userProgress.letterCompleted;
        const finishedByProgress = (userProgress.letterProgress ?? 0) >= 0.8;

        return finishedByTest || finishedByProgress;
    },

    // ===== 获取用户进度 =====
    /**
     * 从后端获取用户进度数据
     */
    getUserProgress: async (): Promise<void> => {
        const userId = useUserStore.getState().currentUser?.userId;

        if (!userId) {
            console.warn('⚠️ 用户未登录，无法获取进度数据');
            set({ userProgress: defaultProgress });
            return;
        }

        try {
            set({ isLoading: true, error: null });

            const result = await callCloudFunction<UserProgressResponse>(
                'getUserProgress',
                { userId },
                {
                    endpoint: API_ENDPOINTS.MEMORY.GET_TODAY_MEMORIES.cloudbase,
                }
            );

            if (result.success && result.data) {
                set({
                    userProgress: result.data.progress,
                    isLoading: false,
                });

                console.log('✅ 用户进度数据已更新:', result.data.progress);
            } else {
                console.warn('⚠️ 获取用户进度失败，使用默认数据');
                set({
                    userProgress: defaultProgress,
                    isLoading: false,
                });
            }
        } catch (error: any) {
            console.error('❌ getUserProgress error:', error);
            set({
                error: error.message || '获取进度失败',
                userProgress: defaultProgress,
                isLoading: false,
            });
        }
    },

    // ===== 清除缓存 =====
    /**
     * 清除访问权限缓存
     * 用于：用户完成学习后需要重新检查权限
     */
    clearCache: (): void => {
        set({ accessCache: new Map<ModuleType, boolean>() });
        console.log('🗑️ 访问权限缓存已清除');
    },

    // ===== 设置错误 =====
    setError: (error: string | null): void => {
        set({ error });
    },

    // ===== 更新每日学习量（前端缓存）=====
    setDailyLimit: (moduleType: ModuleType, limit: number) => {
        set((state) => ({
            userProgress: {
                ...(state.userProgress || { ...defaultProgress }),
                dailyLimit: limit,
            },
        }));

        console.log(`📌 已更新 ${moduleType} dailyLimit 为 ${limit}`);
    },

    // ===== 标记字母课程完成（前端本地）=====
    markAlphabetLessonCompleted: (lessonId: string) => {
        const totalLessons = Object.keys(SEQUENCE_LESSONS).length;

        set((state) => {
            const prev = state.userProgress || { ...defaultProgress };

            const prevCompleted = new Set(prev.completedAlphabetLessons ?? []);
            prevCompleted.add(lessonId);
            const completedAlphabetLessons = Array.from(prevCompleted);

            const completedCount = completedAlphabetLessons.length;
            const allLessonsDone = completedCount >= totalLessons;

            // 进度：完成 lesson1-4 即视为 0.8，全部 5 课完成视为 1.0
            let nextLetterProgress = prev.letterProgress;
            if (completedCount >= 4 && nextLetterProgress < 0.8) {
                nextLetterProgress = 0.8;
            }
            if (completedCount >= totalLessons && nextLetterProgress < 1) {
                nextLetterProgress = 1;
            }

            // 只有全部课程完成时，才在前端标记 letterCompleted，
            // 或保留后端已有的 true 状态（例如通过测试题）
            const nextLetterCompleted =
                prev.letterCompleted || allLessonsDone;

            const updated: UserProgress = {
                ...prev,
                completedAlphabetLessons,
                letterCompleted: nextLetterCompleted,
                letterProgress: nextLetterProgress,
            };

            return {
                userProgress: updated,
                accessCache: allLessonsDone
                    ? new Map<ModuleType, boolean>()
                    : state.accessCache,
            };
        });

        console.log(`✅ 字母课程已完成: ${lessonId}`);
    },
}));
