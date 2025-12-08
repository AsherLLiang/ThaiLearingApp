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
import * as FileSystem from 'expo-file-system';

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

import type {
  LessonMetadata,
  PhonicsRule,
} from '@/src/entities/types/phonicsRule.types';

interface TodayLettersResponse {
  items: Array<Letter & { memoryState?: MemoryStatus }>;
  summary: {
    total: number;
    newCount: number;
    reviewCount: number;
    entityType: string;
  };
  unlockInfo?: Record<string, any>;
  lessonMetadata?: LessonMetadata | null;
  phonicsRule?: PhonicsRule | null;
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

  // 已缓存的音频 URL（用于避免重复预下载）
  cachedAudioKeys: string[];

  // 当前课程元数据 / 拼读规则（由后端返回）
  lessonMetadata: LessonMetadata | null;
  phonicsRule: PhonicsRule | null;

  // Actions
  initializeSession: (
    userId: string,
    options?: {
      limit?: number;
      lessonId?: string;
    }
  ) => Promise<void>;
  /**
   * 前端组件只告诉我这题「对/错」
   * 这里自动映射为 QualityButton 并调用 submitMemoryResult
   */
  submitResult: (userId: string, isCorrect: boolean) => Promise<void>;
  submitRoundEvaluation: (params: {
    userId: string;
    lessonId: string;
    roundNumber: number;
    totalQuestions: number;
    correctCount: number;
    accuracy: number;
  }) => Promise<void>;

  next: () => void;
  previous: () => void;

  reset: () => void;
  clearError: () => void;
}

// ==================== 音频 URL 解析 ====================


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

  const rawAudioKey =
    letter.fullSoundLocalPath ||
    letter.fullSoundUrl ||
    letter.letterPronunciationLocalPath ||
    letter.letterPronunciationUrl ||
    letter.syllableSoundLocalPath ||
    letter.syllableSoundUrl ||
    letter.audioPath ||
    '';

  // 为满足「播放只从本地读取」的目标，audioUrl 仅在预下载阶段被设置为 file:// 路径。
  // 这里如果已经有本地路径（*_LocalPath），就使用；否则先置空，等待预下载任务填充。
  const initialAudioUrl =
    (rawAudioKey.startsWith('file://') ? rawAudioKey : '');

  return {
    alphabetId: letter._id,
    _id: letter._id,
    letter,
    thaiChar: letter.thaiChar,
    pronunciation,
    example,
    audioUrl: initialAudioUrl,
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
      phase: LearningPhase.IDLE,
      queue: [],
      currentIndex: 0,
      currentItem: null,
      completedCount: 0,
      totalCount: 0,
      isLoading: false,
      error: null,
      cachedAudioKeys: [],
      lessonMetadata: null,
      phonicsRule: null,

      // 获取今日字母学习/复习队列
      initializeSession: async (
        userId: string,
        options?: { limit?: number; lessonId?: string }
      ) => {
        set({ isLoading: true, error: null });

        const limit = options?.limit ?? 30;
        const lessonId = options?.lessonId;

        try {
          const response = await callCloudFunction<TodayLettersResponse>(
            'getTodayMemories',
            {
              userId,
              entityType: 'letter',
              limit,
              includeNew: true,
              lessonId,
            },
            {
              endpoint: API_ENDPOINTS.MEMORY.GET_TODAY_MEMORIES.cloudbase,
            }
          );

          if (!response.success || !response.data) {
            throw new Error(response.error ?? '获取今日字母失败');
          }

          const { items, lessonMetadata, phonicsRule } = response.data;

          if (!items || items.length === 0) {
            set({
              phase: LearningPhase.COMPLETED,
              queue: [],
              currentItem: null,
              currentIndex: 0,
              completedCount: 0,
            totalCount: 0,
            isLoading: false,
            lessonMetadata: lessonMetadata ?? null,
            phonicsRule: phonicsRule ?? null,
          });
          return;
        }

          const queue = items.map((item) =>
            mapLetterToState(item, item.memoryState)
          );

          set({
            phase: LearningPhase.IDLE,
            queue,
            currentItem: queue[0],
            currentIndex: 0,
            completedCount: 0,
            totalCount: queue.length,
            isLoading: false,
            lessonMetadata: lessonMetadata ?? null,
            phonicsRule: phonicsRule ?? null,
          });

          // 预下载本课所有字母音频到本地文件系统（首次进入该课时）
          (async () => {
            try {
              const cacheDir = `${FileSystem.documentDirectory}alphabet-audio/`;
              const dirInfo = await FileSystem.getInfoAsync(cacheDir);
              if (!dirInfo.exists) {
                await FileSystem.makeDirectoryAsync(cacheDir, {
                  intermediates: true,
                });
              }

              const updatedQueue = [...queue];
              const urlToLocalPath = new Map<string, string>();

              const toHttpUrl = (path?: string | null): string => {
                if (!path) return '';
                if (path.startsWith('http://') || path.startsWith('https://')) {
                  return path;
                }
                let finalPath = path;
                if (!/\.mp3($|\?)/.test(finalPath)) {
                  finalPath = `${finalPath}.mp3`;
                }
                return `https://636c-cloud1-1gjcyrdd7ab927c6-1387301748.tcb.qcloud.la/alphabet/${finalPath}`;
              };

              // eslint-disable-next-line no-console
              console.log(
                '🎧 开始预下载本课字母音频, 队列长度:',
                updatedQueue.length,
              );

              for (let index = 0; index < updatedQueue.length; index += 1) {
                const current = updatedQueue[index];
                const letter = { ...current.letter };

                const fieldEntries: Array<{
                  key: 'full' | 'syllable' | 'end' | 'letter';
                  raw?: string;
                }> = [
                  { key: 'full', raw: letter.fullSoundUrl },
                  { key: 'syllable', raw: letter.syllableSoundUrl },
                  { key: 'end', raw: letter.endSyllableSoundUrl },
                  { key: 'letter', raw: letter.letterPronunciationUrl },
                ];

                for (const entry of fieldEntries) {
                  if (!entry.raw) continue;
                  const httpUrl = toHttpUrl(entry.raw);
                  if (!httpUrl) continue;

                  let localPath = urlToLocalPath.get(httpUrl);
                  if (!localPath) {
                    const fileName = encodeURIComponent(httpUrl);
                    localPath = `${cacheDir}${fileName}`;

                    let success = false;
                    for (
                      let attempt = 0;
                      attempt < 3 && !success;
                      attempt += 1
                    ) {
                      try {
                        const info = await FileSystem.getInfoAsync(localPath);
                        if (!info.exists) {
                          // eslint-disable-next-line no-console
                          console.log(
                            `📥 下载音频(第 ${attempt + 1} 次):`,
                            httpUrl,
                            '→',
                            localPath,
                          );
                          await FileSystem.downloadAsync(httpUrl, localPath);
                        }
                        success = true;
                      } catch (err) {
                        console.warn(
                          `⚠️ 下载字母音频失败(第 ${attempt + 1} 次):`,
                          httpUrl,
                          err,
                        );
                        await new Promise((resolve) =>
                          setTimeout(resolve, 500 * (attempt + 1)),
                        );
                      }
                    }

                    if (!success) {
                      // eslint-disable-next-line no-console
                      console.warn('❌ 多次下载失败,放弃该音频:', httpUrl);
                      continue;
                    }

                    urlToLocalPath.set(httpUrl, localPath);
                  }

                  if (entry.key === 'full') {
                    letter.fullSoundLocalPath = localPath;
                  } else if (entry.key === 'syllable') {
                    letter.syllableSoundLocalPath = localPath;
                  } else if (entry.key === 'end') {
                    letter.endSyllableSoundLocalPath = localPath;
                  } else if (entry.key === 'letter') {
                    letter.letterPronunciationLocalPath = localPath;
                  }
                }

                const primaryAudio =
                  letter.fullSoundLocalPath ||
                  letter.letterPronunciationLocalPath ||
                  letter.syllableSoundLocalPath ||
                  letter.endSyllableSoundLocalPath ||
                  current.audioUrl;

                // eslint-disable-next-line no-console
                console.log('✅ 预下载结果(letter):', {
                  id: letter._id,
                  thaiChar: letter.thaiChar,
                  fullSoundLocalPath: letter.fullSoundLocalPath,
                  syllableSoundLocalPath: letter.syllableSoundLocalPath,
                  endSyllableSoundLocalPath: letter.endSyllableSoundLocalPath,
                  letterPronunciationLocalPath:
                    letter.letterPronunciationLocalPath,
                  primaryAudio,
                });

                updatedQueue[index] = {
                  ...current,
                  letter,
                  audioUrl: primaryAudio && primaryAudio.startsWith('file://')
                    ? primaryAudio
                    : primaryAudio,
                };
              }

              set((state) => {
                const { currentIndex } = state;
                const currentItem = updatedQueue[currentIndex] ?? state.currentItem;

                // 调试：当前项在预下载后的音频情况
                if (currentItem) {
                  // eslint-disable-next-line no-console
                  console.log('🎯 预下载后当前字母状态:', {
                    id: currentItem.letter._id,
                    thaiChar: currentItem.letter.thaiChar,
                    fullSoundLocalPath: currentItem.letter.fullSoundLocalPath,
                    syllableSoundLocalPath:
                      currentItem.letter.syllableSoundLocalPath,
                    endSyllableSoundLocalPath:
                      currentItem.letter.endSyllableSoundLocalPath,
                    letterPronunciationLocalPath:
                      currentItem.letter.letterPronunciationLocalPath,
                    audioUrl: currentItem.audioUrl,
                  });
                }

                return {
                  queue: updatedQueue,
                  currentItem,
                };
              });
              // eslint-disable-next-line no-console
              console.log('🎧 预下载全部完成, 队列更新成功');
            } catch (err) {
              console.warn('⚠️ 预下载字母音频任务失败:', err);
            }
          })();
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

      // 提交字母模块三轮评估结果（仅记录统计信息，不影响记忆算法）
      submitRoundEvaluation: async ({
        userId,
        lessonId,
        roundNumber,
        totalQuestions,
        correctCount,
        accuracy,
      }) => {
        try {
          await callCloudFunction(
            'submitRoundEvaluation',
            {
              userId,
              entityType: 'letter',
              lessonId,
              roundNumber,
              totalQuestions,
              correctCount,
              accuracy,
            },
            {
              endpoint: API_ENDPOINTS.MEMORY.SUBMIT_ROUND_EVALUATION.cloudbase,
            },
          );
        } catch (e: any) {
          console.error('❌ submitRoundEvaluation error:', e);
          // 不影响前端流程，出错时只记录日志
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
          phase: LearningPhase.IDLE,
          queue: [],
          currentIndex: 0,
          currentItem: null,
          completedCount: 0,
          totalCount: 0,
          isLoading: false,
          error: null,
          cachedAudioKeys: [],
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
        cachedAudioKeys: state.cachedAudioKeys,
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
