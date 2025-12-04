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
import { callCloudFunction } from '@/src/utils/cloudFunctionAdapter';
import { useUserStore } from './userStore';

// ==================== 类型定义 ====================

/**
 * 模块类型
 */
export type ModuleType = 'alphabet' | 'word' | 'sentence' | 'article';

/**
 * 用户进度数据
 */
export interface UserProgress {
    // 字母学习进度
    letterProgress: number;           // 0-100
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
            return moduleType === 'alphabet';
        }

        switch (moduleType) {
            case 'alphabet':
                // 字母模块始终可访问
                return true;

            case 'word':
                // 单词模块需要字母进度达到 95% 或明确解锁
                return userProgress.wordUnlocked || userProgress.letterProgress >= 95;

            case 'sentence':
                // 句子模块需要单词进度达到 80% 或明确解锁
                return userProgress.sentenceUnlocked || userProgress.wordProgress >= 80;

            case 'article':
                // 文章模块需要句子进度达到 80% 或明确解锁
                return userProgress.articleUnlocked || userProgress.sentenceProgress >= 80;

            default:
                return false;
        }
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
                { userId }
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
}));
