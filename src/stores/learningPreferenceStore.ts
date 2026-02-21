import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ModuleType } from './moduleAccessStore';

type DailyLimitMap = Partial<Record<ModuleType, number>>;

// 系统默认每日学习上限，与后端 getTodayMemories 默认值保持一致
export const DEFAULT_DAILY_LIMIT = 20;

interface LearningPreferenceStore {
    streakDays: number;
    updateStreak: (days: number) => void;
    dailyLimits: DailyLimitMap;
    setDailyLimit: (module: ModuleType, limit: number) => void;
    hasDailyLimit: (module: ModuleType) => boolean;
    clearForLogout: () => void; // 登出时清除所有用户专属偏好
}

export const useLearningPreferenceStore = create<LearningPreferenceStore>()(
    persist(
        (set, get) => ({
            streakDays: 0,
            updateStreak: (days) => set({ streakDays: days }),
            dailyLimits: {},
            setDailyLimit: (module, limit) =>
                set((state) => ({
                    dailyLimits: {
                        ...state.dailyLimits,
                        [module]: limit,
                    },
                })),
            hasDailyLimit: (module) => get().dailyLimits[module] !== undefined,
            // 登出时调用：重置所有用户专属偏好，防止跨用户继承
            clearForLogout: () =>
                set({
                    streakDays: 0,
                    dailyLimits: {},
                }),
        }),
        {
            name: 'learning-preferences',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
