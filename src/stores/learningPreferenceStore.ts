import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ModuleType } from './moduleAccessStore';

type DailyLimitMap = Partial<Record<ModuleType, number>>;

// 系统默认每日学习上限，与后端 getTodayMemories 默认值保持一致
export const DEFAULT_DAILY_LIMIT = 20;

/** 获取本地日期 YYYY-MM-DD */
function getTodayLocal(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** 获取昨天本地日期 YYYY-MM-DD */
function getYesterdayLocal(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** 每日学习时长（秒），按日期 YYYY-MM-DD 存储 */
type DailyStudyTimeMap = Record<string, number>;

/** 每日提醒时间，格式 HH:mm，默认 09:00 */
export const DEFAULT_DAILY_REMINDER_TIME = '09:00';

interface LearningPreferenceStore {
    streakDays: number;
    lastCheckInDate: string | null; // YYYY-MM-DD，上次打卡日期
    /** 每日提醒开关 */
    dailyReminderEnabled: boolean;
    /** 每日提醒时间 HH:mm */
    dailyReminderTime: string;
    updateStreak: (days: number) => void;
    /** 每日打卡：每天可点击一次，返回 true 表示打卡成功，false 表示今日已打卡 */
    checkIn: () => boolean;
    /** 今日是否已打卡 */
    hasCheckedInToday: () => boolean;
    dailyLimits: DailyLimitMap;
    setDailyLimit: (module: ModuleType, limit: number) => void;
    hasDailyLimit: (module: ModuleType) => boolean;
    /** 当日学习时长（秒），按日期持久化 */
    dailyStudyTimeByDate: DailyStudyTimeMap;
    /** 当前学习会话开始时间戳（毫秒），进入字母/单词学习页时设置，离开时清除 */
    activeSessionStart: number | null;
    /** 进入学习页时调用，开始计时 */
    startStudySession: () => void;
    /** 离开学习页时调用，将本次时长累加到当日 */
    stopStudySession: () => void;
    /** 获取当日学习总时长（秒），含当前进行中的会话 */
    getTodayStudyTimeSeconds: () => number;
    /** 设置每日提醒开关与时间 */
    setDailyReminder: (enabled: boolean, time?: string) => void;
    clearForLogout: () => void; // 登出时清除所有用户专属偏好
}

export const useLearningPreferenceStore = create<LearningPreferenceStore>()(
    persist(
        (set, get) => ({
            streakDays: 0,
            lastCheckInDate: null,
            dailyReminderEnabled: false,
            dailyReminderTime: DEFAULT_DAILY_REMINDER_TIME,
            updateStreak: (days) => set({ streakDays: days }),
            setDailyReminder: (enabled, time) =>
                set((state) => ({
                    dailyReminderEnabled: enabled,
                    dailyReminderTime: time ?? state.dailyReminderTime,
                })),
            checkIn: () => {
                const today = getTodayLocal();
                const yesterday = getYesterdayLocal();
                const { lastCheckInDate, streakDays } = get();
                if (lastCheckInDate === today) return false;
                const newStreak = lastCheckInDate === yesterday ? streakDays + 1 : 0;
                set({ lastCheckInDate: today, streakDays: newStreak });
                return true;
            },
            hasCheckedInToday: () => get().lastCheckInDate === getTodayLocal(),
            dailyLimits: {},
            setDailyLimit: (module, limit) =>
                set((state) => ({
                    dailyLimits: {
                        ...state.dailyLimits,
                        [module]: limit,
                    },
                })),
            hasDailyLimit: (module) => get().dailyLimits[module] !== undefined,
            dailyStudyTimeByDate: {},
            activeSessionStart: null,
            startStudySession: () => set({ activeSessionStart: Date.now() }),
            stopStudySession: () => {
                const { activeSessionStart, dailyStudyTimeByDate } = get();
                if (activeSessionStart == null) return;
                const elapsed = Math.floor((Date.now() - activeSessionStart) / 1000);
                const today = getTodayLocal();
                const prev = dailyStudyTimeByDate[today] ?? 0;
                set({
                    activeSessionStart: null,
                    dailyStudyTimeByDate: {
                        ...dailyStudyTimeByDate,
                        [today]: prev + elapsed,
                    },
                });
            },
            getTodayStudyTimeSeconds: () => {
                const { dailyStudyTimeByDate, activeSessionStart } = get();
                const today = getTodayLocal();
                const stored = dailyStudyTimeByDate[today] ?? 0;
                if (activeSessionStart == null) return stored;
                return stored + Math.floor((Date.now() - activeSessionStart) / 1000);
            },
            // 登出时调用：重置所有用户专属偏好，防止跨用户继承
            clearForLogout: () =>
                set({
                    streakDays: 0,
                    lastCheckInDate: null,
                    dailyLimits: {},
                    dailyStudyTimeByDate: {},
                    activeSessionStart: null,
                    dailyReminderEnabled: false,
                    dailyReminderTime: DEFAULT_DAILY_REMINDER_TIME,
                }),
        }),
        {
            name: 'learning-preferences',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                streakDays: state.streakDays,
                lastCheckInDate: state.lastCheckInDate,
                dailyLimits: state.dailyLimits,
                dailyStudyTimeByDate: state.dailyStudyTimeByDate,
                dailyReminderEnabled: state.dailyReminderEnabled,
                dailyReminderTime: state.dailyReminderTime,
            }),
        }
    )
);
