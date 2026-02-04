import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ModuleType } from './moduleAccessStore';

type DailyLimitMap = Partial<Record<ModuleType, number>>;

interface LearningPreferenceStore {
    streakDays: number;
    updateStreak: (days: number) => void;
    dailyLimits: DailyLimitMap;
    setDailyLimit: (module: ModuleType, limit: number) => void;
    hasDailyLimit: (module: ModuleType) => boolean;
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
        }),
        {
            name: 'learning-preferences',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
