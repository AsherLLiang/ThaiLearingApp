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
import { LESSON_METADATA } from '@/src/config/alphabet/lessonMetadata.config';
import AsyncStorage from '@react-native-async-storage/async-storage';


const getCompletedLessonsStorageKey = (userId: string): string =>
    `@alphabet_completed_lessons_${userId}`;



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
 * 用户进度响应（后端返回）
 */
interface UserProgressResponse {
    progress: UserProgress & {
        completedLessons?: string[];  // 🔥 后端返回字段（user_alphabet_progress.completedLessons）
    };
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
            const oldKey = '@alphabet_completed_lessons';
            const oldData = await AsyncStorage.getItem(oldKey);
            if (oldData) {
                await AsyncStorage.removeItem(oldKey);
                console.log('Old key has been delete.');
            }
        } catch (e) {
            console.warn('删除旧key失败：', e)
        }

        set({ isLoading: true, error: null });

        // Helper to try fetch
        const fetchProgress = async (endpoint: string) => {
            return await callCloudFunction<UserProgressResponse>(
                'getUserProgress',
                { userId, entityType: 'letter' },  // 添加 entityType 参数
                { endpoint }
            );
        };

        try {
            // 1. Try Primary Endpoint (memory-engine)
            let result = await fetchProgress(API_ENDPOINTS.MEMORY.GET_TODAY_MEMORIES.cloudbase);

            if (result.success && result.data) {
                console.log(`🌐 后端返回的每日限额: ${result.data.progress.dailyLimit}`);
                // 🔥 Step 3: 以后端数据为准，本地仅作缓存
                const remoteCompleted = result.data.progress.completedLessons || [];

                // 🔥 更新本地缓存（用于离线时加速）
                const storageKey = getCompletedLessonsStorageKey(userId);
                AsyncStorage.setItem(storageKey, JSON.stringify(remoteCompleted)).catch(err => {
                    console.warn('⚠️ Failed to cache completed lessons:', err);
                });

                set({
                    userProgress: {
                        ...result.data.progress,
                        completedAlphabetLessons: remoteCompleted  // 🔥 字段映射
                    },
                    isLoading: false,
                });
                console.log('✅ 用户进度数据已更新 (Backend-first):', {
                    ...result.data.progress,
                    completedAlphabetLessons: remoteCompleted
                });
            } else {
                // 🔥 后端失败时，尝试从本地缓存加载（降级方案）
                console.warn('⚠️ 获取用户进度失败 (Primary & Fallback)，尝试从本地缓存加载');
                try {
                    const storageKey = getCompletedLessonsStorageKey(userId);
                    const cached = await AsyncStorage.getItem(storageKey);
                    const cachedCompleted = cached ? JSON.parse(cached) : [];

                    set({
                        userProgress: {
                            ...defaultProgress,
                            completedAlphabetLessons: cachedCompleted
                        },
                        isLoading: false,
                        error: result.error || 'Failed to fetch progress'
                    });
                    console.log('⚠️ 使用本地缓存数据:', cachedCompleted);
                } catch (cacheError) {
                    set({
                        userProgress: defaultProgress,
                        isLoading: false,
                        error: result.error || 'Failed to fetch progress'
                    });
                }
            }
        } catch (error: any) {
            console.error('❌ getUserProgress error:', error);

            // 🔥 异常时，尝试从本地缓存加载（降级方案）
            try {
                const storageKey = getCompletedLessonsStorageKey(userId);
                const cached = await AsyncStorage.getItem(storageKey);
                const cachedCompleted = cached ? JSON.parse(cached) : [];

                set({
                    error: error.message || '获取进度失败',
                    userProgress: {
                        ...defaultProgress,
                        completedAlphabetLessons: cachedCompleted
                    },
                    isLoading: false,
                });
                console.log('⚠️ 异常时使用本地缓存:', cachedCompleted);
            } catch (cacheError) {
                set({
                    error: error.message || '获取进度失败',
                    userProgress: defaultProgress,
                    isLoading: false,
                });
            }
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
    setDailyLimit: async (moduleType: ModuleType, limit: number) => {
        // 1. 先更新本地 UI（保证响应速度）
        set((state) => ({
            userProgress: {
                ...(state.userProgress || { ...defaultProgress }),
                dailyLimit: limit,
            },
        }));
        // 2. 立即推送到后端持久化
        const userId = useUserStore.getState().currentUser?.userId;
        if (userId) {
            try {
                await callCloudFunction(
                    'setDailyLimit',
                    {
                        userId,
                        dailyLimit: limit
                    },
                    { endpoint: API_ENDPOINTS.MEMORY.SET_DAILY_LIMIT.cloudbase }
                );
                console.log(`✅ 已成功同步 ${moduleType} 限额 ${limit} 到云端`);
            } catch (error) {
                console.error('❌ 更新每日学习量失败:', error);
            }
        };

        console.log(`📌 已更新 ${moduleType} dailyLimit 为 ${limit}`);
    },

    // ===== 标记字母课程完成（前端本地）=====
    markAlphabetLessonCompleted: (lessonId: string) => {
        const userId = useUserStore.getState().currentUser?.userId;
        if (!userId) {
            console.warn('⚠️ 用户未登录，无法标记课程完成');
            return;
        }

        const totalLessons = Object.keys(LESSON_METADATA).length;
        const coreLessons = 6; // 完成前 6 课视为“核心字母已学完”

        set((state) => {
            const prev = state.userProgress || { ...defaultProgress };

            const prevCompleted = new Set(prev.completedAlphabetLessons ?? []);
            prevCompleted.add(lessonId);
            const completedAlphabetLessons = Array.from(prevCompleted);

            const completedCount = completedAlphabetLessons.length;
            const allLessonsDone = completedCount >= totalLessons;

            // 进度：
            // - 完成 lesson1-4 视为 0.8
            // - 完成 lesson1-6 视为 0.9（核心字母全部完成）
            // - 完成全部 7 课视为 1.0（含罕用/古体字母）
            let nextLetterProgress = prev.letterProgress;
            if (completedCount >= 4 && nextLetterProgress < 0.8) {
                nextLetterProgress = 0.8;
            }
            if (completedCount >= coreLessons && nextLetterProgress < 0.9) {
                nextLetterProgress = 0.9;
            }
            if (completedCount >= totalLessons && nextLetterProgress < 1) {
                nextLetterProgress = 1;
            }

            // 完成前 6 课即视为核心字母学习完成，
            // lesson7 作为补充课程不影响其他模块解锁
            const coreLessonsDone = completedCount >= coreLessons;
            const nextLetterCompleted =
                prev.letterCompleted || coreLessonsDone;

            const updated: UserProgress = {
                ...prev,
                completedAlphabetLessons,
                letterCompleted: nextLetterCompleted,
                letterProgress: nextLetterProgress,
            };

            // 🔥 Persist to AsyncStorage (Fire and forget)
            const storageKey = getCompletedLessonsStorageKey(userId);
            AsyncStorage.setItem(storageKey, JSON.stringify(completedAlphabetLessons)).catch(err => {
                console.error('❌ Failed to persist completed alphabet lessons:', err);
            });

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
