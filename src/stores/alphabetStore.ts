// src/stores/alphabetStore.ts

/**
 * 字母学习 Store（V9 版本）
 *
 * 职责：
 * - 通过 memory-engine（/memory-engine 云函数）获取今日字母队列
 * - 维护前端会话状态（当前字母、完成数量等）
 * - 接收「对 / 错」结果，自动映射为 记得/陌生 并调用 submitMemoryResult
 *
 * 注意：
 * - 不再依赖本地 letterData.ts，所有字母数据来自后端 Letter 文档
 * - 新字母学习（课程）负责把字母塞进记忆引擎；复习队列完全交给 getTodayMemories
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { callCloudFunction } from '@/src/utils/apiClient';
import { API_ENDPOINTS } from '@/src/config/api.endpoints';

import type { Letter } from '@/src/entities/types/letter.types';
import type { ApiResponse } from '@/src/entities/types/api.types';
import { LearningPhase } from '@/src/entities/enums/LearningPhase.enum';
import {
  QualityButton,
  QUALITY_SCORE_MAP,
  ATTEMPTS_INCREMENT_MAP,
} from '@/src/entities/enums/QualityScore.enum';

// ==================== 后端记忆状态 ====================

export interface MemoryStatus {
  masteryLevel: number;
  reviewStage: number;
  correctCount: number;
  wrongCount: number;
  streakCorrect: number;
  nextReviewAt: string;
  isNew: boolean;
}

// ==================== 会话中的字母状态 ====================

export interface AlphabetLearningState {
  // 基础
  alphabetId: string;
  _id: string; // Letter 的 _id，用于题目生成
  letter: Letter;
  thaiChar: string;
  pronunciation: string;
  example: string;
  audioUrl: string;
  category: string;

  // 发音相关字段（用于题目生成）
  syllableSoundName?: string; // 音节发音名称（如: "d"）
  initialSound?: string; // 首音（如: "d"）
  syllableSoundUrl?: string; // 音节发音URL
  letterPronunciationUrl?: string; // 字母发音URL
  audioPath?: string; // 旧版音频路径

  // 会话进度
  currentAttempts: number;
  requiredAttempts: number;
  qualityHistory: number[];
  isCompleted: boolean;
  timestamp: string;

  // 后端记忆信息（只读）
  memoryState?: MemoryStatus;
}

// ==================== 后端返回结构 ====================

interface TodayLettersResponse {
  items: Array<Letter & { memoryState?: MemoryStatus }>;
  summary: {
    total: number;
    newCount: number;
    reviewCount: number;
    entityType: string;
  };
  unlockInfo?: Record<string, any>;
}

// ==================== Store 状态定义 ====================

interface AlphabetStoreState {
  phase: LearningPhase;

  queue: AlphabetLearningState[];
  currentIndex: number;
  currentItem: AlphabetLearningState | null;

  completedCount: number;
  totalCount: number;

  isLoading: boolean;
  error: string | null;

  // Actions
  initializeSession: (userId: string, limit?: number) => Promise<void>;
  /**
   * 前端组件只告诉我这题「对/错」
   * 这里自动映射为 QualityButton 并调用 submitMemoryResult
   */
  submitResult: (userId: string, isCorrect: boolean) => Promise<void>;

  next: () => void;
  previous: () => void;

  reset: () => void;
  clearError: () => void;
}

// ==================== 辅助：Letter → AlphabetLearningState ====================

function mapLetterToState(
  letter: Letter,
  memoryState?: MemoryStatus
): AlphabetLearningState {
  const pronunciation =
    letter.letterNamePronunciation ||
    letter.syllableSoundName ||
    letter.initialSound ||
    '';

  const example =
    letter.exampleWord && letter.exampleMeaning
      ? `${letter.exampleWord}（${letter.exampleMeaning}）`
      : letter.exampleWord || '';

  const audioUrl =
    letter.fullSoundUrl ||
    letter.letterPronunciationUrl ||
    letter.syllableSoundUrl ||
    letter.audioPath ||
    '';

  return {
    alphabetId: letter._id,
    _id: letter._id,
    letter,
    thaiChar: letter.thaiChar,
    pronunciation,
    example,
    audioUrl,
    category: letter.category,

    // 发音相关字段
    syllableSoundName: letter.syllableSoundName,
    initialSound: letter.initialSound,
    syllableSoundUrl: letter.syllableSoundUrl,
    letterPronunciationUrl: letter.letterPronunciationUrl,
    audioPath: letter.audioPath,

    currentAttempts: 0,
    requiredAttempts: 3,
    qualityHistory: [],
    isCompleted: false,
    timestamp: new Date().toISOString(),

    memoryState,
  };
}

// ==================== Store 实现 ====================

export const useAlphabetStore = create<AlphabetStoreState>()(
  persist(
    (set, get) => ({
      phase: LearningPhase.REVIEW,
      queue: [],
      currentIndex: 0,
      currentItem: null,
      completedCount: 0,
      totalCount: 0,
      isLoading: false,
      error: null,

      // 获取今日字母学习/复习队列
      initializeSession: async (userId: string, limit: number = 20) => {
        set({ isLoading: true, error: null });

        try {
          const response = await callCloudFunction<TodayLettersResponse>(
            'getTodayMemories',
            {
              userId,
              entityType: 'letter',
              limit,
              includeNew: true,
            },
            {
              endpoint: API_ENDPOINTS.MEMORY.GET_TODAY_MEMORIES.cloudbase,
            }
          );

          if (!response.success || !response.data) {
            throw new Error(response.error ?? '获取今日字母失败');
          }

          const { items } = response.data;

          if (!items || items.length === 0) {
            set({
              phase: LearningPhase.COMPLETED,
              queue: [],
              currentItem: null,
              currentIndex: 0,
              completedCount: 0,
              totalCount: 0,
              isLoading: false,
            });
            return;
          }

          const queue = items.map((item) =>
            mapLetterToState(item, item.memoryState)
          );

          set({
            phase: LearningPhase.REVIEW,
            queue,
            currentItem: queue[0],
            currentIndex: 0,
            completedCount: 0,
            totalCount: queue.length,
            isLoading: false,
          });
        } catch (e: any) {
          console.error('❌ initializeSession error:', e);
          set({
            isLoading: false,
            error: e?.message ?? '加载失败',
          });
        }
      },

      // 复习提交：只接受「对/错」
      submitResult: async (userId: string, isCorrect: boolean) => {
        const { currentItem, currentIndex, queue } = get();
        if (!currentItem) return;

        // 自动映射为质量枚举
        const quality: QualityButton = isCorrect
          ? QualityButton.KNOW
          : QualityButton.FORGET;

        try {
          const response = await callCloudFunction(
            'submitMemoryResult',
            {
              userId,
              entityType: 'letter',
              entityId: currentItem.alphabetId,
              quality, // '记得' | '陌生'
            },
            {
              endpoint: API_ENDPOINTS.MEMORY.SUBMIT_MEMORY_RESULT.cloudbase,
            }
          );

          if (!response.success) {
            throw new Error(response.error ?? '提交失败');
          }

          // 更新前端本地会话状态
          const updatedQueue = [...queue];
          const item = updatedQueue[currentIndex];

          if (item) {
            item.currentAttempts += ATTEMPTS_INCREMENT_MAP[quality];
            item.qualityHistory.push(QUALITY_SCORE_MAP[quality]);

            if (item.currentAttempts >= item.requiredAttempts) {
              item.isCompleted = true;
            }

            item.timestamp = new Date().toISOString();
          }

          const completedCount = updatedQueue.filter(
            (it) => it.isCompleted
          ).length;

          set({
            queue: updatedQueue,
            completedCount,
          });

          // 自动跳转下一题
          get().next();
        } catch (e: any) {
          console.error('❌ submitResult error:', e);
          set({
            error: e?.message ?? '提交失败',
          });
        }
      },

      // 下一个字母
      next: () => {
        const { currentIndex, queue } = get();
        const nextIndex = currentIndex + 1;

        if (nextIndex < queue.length) {
          set({
            currentIndex: nextIndex,
            currentItem: queue[nextIndex],
          });
        } else {
          set({
            phase: LearningPhase.COMPLETED,
            currentItem: null,
          });
        }
      },

      // 上一个字母（主要用于调试或某些 UI）
      previous: () => {
        const { currentIndex, queue } = get();
        const prevIndex = Math.max(0, currentIndex - 1);

        set({
          currentIndex: prevIndex,
          currentItem: queue[prevIndex] ?? null,
        });
      },

      // 重置（例如切换用户）
      reset: () =>
        set({
          phase: LearningPhase.REVIEW,
          queue: [],
          currentIndex: 0,
          currentItem: null,
          completedCount: 0,
          totalCount: 0,
          isLoading: false,
          error: null,
        }),

      clearError: () => set({ error: null }),
    }),
    {
      name: 'alphabet-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // 只持久化统计数据，队列保持会话级别
      partialize: (state) => ({
        completedCount: state.completedCount,
        totalCount: state.totalCount,
      }),
    }
  )
);

// ==================== 一些便捷 Hooks ====================

export const useAlphabetProgress = () => {
  const { completedCount, totalCount } = useAlphabetStore();
  if (!totalCount) return 0;
  return (completedCount / totalCount) * 100;
};

export const useCurrentAlphabet = () =>
  useAlphabetStore((s) => s.currentItem);

export const useAlphabetPhase = () => useAlphabetStore((s) => s.phase);
