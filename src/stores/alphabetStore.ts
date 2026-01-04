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
// 使用 expo-file-system 的 legacy API，避免 v54 新 File API
// 抛出的 getInfoAsync 等方法废弃错误。
import * as FileSystem from 'expo-file-system/legacy';

import { callCloudFunction } from '@/src/utils/apiClient';
import { API_ENDPOINTS, MODULE_ENDPOINTS } from '@/src/config/api.endpoints';

import type { Letter } from '@/src/entities/types/letter.types';
import { buildAlphabetQueue } from '@/src/utils/alphabet/buildAlphabetQueue';
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

export type AlphabetLearningMode = 'learning' | 'free-play';

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

// ==================== 队列项（前端构建） ====================

// 🔥 TODO-03: 统一 source 命名，与 ALPHABET_MODULE_IMPLEMENTATION_SKELETON.md 对齐
export type AlphabetQueueSource =
  | 'previous-review'      // 之前轮次的复习
  | 'new-learning'         // 新字母学习
  | 'mini-review'          // 迷你复习（每3个字母）
  | 'final-review'         // 最终复习
  | 'error-review';        // 错题复习

export interface AlphabetQueueItem extends AlphabetLearningState {
  source: AlphabetQueueSource;
  round: number;
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

  queue: AlphabetQueueItem[];
  currentIndex: number;
  currentItem: AlphabetQueueItem | null;

  completedCount: number;
  totalCount: number;

  isLoading: boolean;
  error: string | null;

  // 已缓存的音频 URL（用于避免重复预下载）
  cachedAudioKeys: string[];

  // 当前课程元数据 / 拼读规则（由后端返回）
  lessonMetadata: LessonMetadata | null;
  phonicsRule: PhonicsRule | null;

  // 🔥 Bug 2 修复：添加 currentRound 字段
  currentRound: 1 | 2 | 3;

  // Actions
  initializeSession: (
    userId: string,
    options?: {
      limit?: number;
      lessonId?: string;
      round?: number;
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
  appendQueue: (items: AlphabetQueueItem[]) => void;
  previous: () => void;
  // 🔥 Bug 3 修复：添加 setCurrentIndex 方法
  setCurrentIndex: (index: number) => void;
  // 🔥 Bug 2 修复：添加 setCurrentRound 方法
  setCurrentRound: (round: 1 | 2 | 3) => void;

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
      // 🔥 Bug 2 修复：添加初始值
      currentRound: 1,

      // 获取今日字母学习/复习队列
      initializeSession: async (
        userId: string,
        options?: { limit?: number; lessonId?: string; round?: number }
      ) => {
        set({ isLoading: true, error: null });

        const limit = options?.limit ?? 30;
        const lessonId = options?.lessonId;

        // 🔥 从后端读取当前轮次（如果未显式传入）
        let round = options?.round ?? 1;
        let mode: AlphabetLearningMode = 'learning';

        try {
          // 读取 user_alphabet_progress，统一判定 currentRound 与 mode
          const progressCol = await callCloudFunction<any>(
            'getUserProgress',
            { userId, entityType: 'letter' },
            { endpoint: MODULE_ENDPOINTS.GET_USER_PROGRESS.cloudbase }
          );

          if (progressCol.success && progressCol.data?.progress) {
            const progress = progressCol.data.progress;

            // 🔥 P0-A: lesson-scoped round 推导（不再使用全局 currentRound）
            if (!options?.round && lessonId) {
              const roundHistory = progress.roundHistory || [];

              // 过滤出当前课程且 passed 的 round 记录
              const lessonHistoryRounds = roundHistory
                .filter((r: any) => r.lessonId === lessonId && r.passed === true)
                .map((r: any) => r.roundNumber);

              const lastPassedRound = lessonHistoryRounds.length > 0
                ? Math.max(...lessonHistoryRounds)
                : 0;

              const computedRound = Math.min(Math.max(lastPassedRound + 1, 1), 3);
              round = computedRound;

              console.log(`🔍 [P0-A] lessonId: ${lessonId}, backendCurrentRound: ${progress.currentRound || 'N/A'}, computedRound: ${computedRound}, lessonHistoryRounds: [${lessonHistoryRounds.join(',')}]`);
            }

            mode = progress.letterCompleted ? 'free-play' : 'learning';
            console.log(`✅ AlphabetLearningMode: ${mode}`);
          } else {
            console.log('⚠️ 未获取到 progress，默认使用 learning 模式');
          }
        } catch (e) {
          console.warn('⚠️ 读取 user_alphabet_progress 失败，使用默认值:', e);
        }

        try {
          const response = await callCloudFunction<TodayLettersResponse>(
            'getTodayMemories',
            {
              userId,
              entityType: 'letter',
              limit,
              includeNew: true,
              lessonId,
              roundNumber: round, // 🔥 传递 roundNumber
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

          const learningItems = items.map((item) =>
            mapLetterToState(item, item.memoryState)
          );

          // 🔥 P0-D: 按 lessonId 切分（不依赖 isNew）
          // 确保四段结构永远存在，且符合产品规则
          const currentLessonLetters = learningItems.filter(
            (item) => lessonId && item.letter.curriculumLessonIds?.includes(lessonId)
          );

          const nonCurrentLessonLetters = learningItems.filter(
            (item) => lessonId && !item.letter.curriculumLessonIds?.includes(lessonId)
          );

          let reviewLetters: AlphabetLearningState[];
          let newLetters: AlphabetLearningState[];

          if (round === 1) {
            // Round1: previous = 非本课字母（跨课），new = 本课字母
            reviewLetters = nonCurrentLessonLetters;
            newLetters = currentLessonLetters;
          } else {
            // Round2/3: previous = 本课字母（同课复习），new = 本课字母（保证 new-learning/mini/final 存在）
            reviewLetters = currentLessonLetters;
            newLetters = currentLessonLetters;
          }

          const queue = buildAlphabetQueue({
            lessonLetters: newLetters,           // 🔥 保证 new-learning/mini/final 永远有内容
            round,
            mode,
            previousRoundLetters: reviewLetters, // 🔥 Round1=跨课，Round2/3=本课
          });

          // 🔥 开发环境日志 + 四段结构验证（在构建后统计）
          if (__DEV__) {
            const sourceCounts = queue.reduce((acc, item) => {
              acc[item.source] = (acc[item.source] || 0) + 1;
              return acc;
            }, {} as Record<string, number>);

            console.log('📊 [buildQueue] 队列分析:', {
              round,
              mode,
              lessonId,
              total: learningItems.length,
              currentLessonCount: currentLessonLetters.length,
              nonCurrentLessonCount: nonCurrentLessonLetters.length,
              reviewCount: reviewLetters.length,
              newCount: newLetters.length,
              queueTotal: queue.length,
              sourceCounts,  // 🔥 四段统计 {'previous-review': 5, 'new-learning': 12, ...}
              reviewIds: reviewLetters.map(l => l.thaiChar).slice(0, 5),
              newIds: newLetters.map(l => l.thaiChar).slice(0, 5),
            });
          }

          // 🐛 P0-3 DEBUG: 检查后端返回的队列是否包含三新一复逻辑
          console.log('=== 后端返回的队列分析 ===');
          console.log('总字母数:', queue.length);
          console.log(
            'todayQueue:',
            queue.map((item, index) => ({
              index,
              letterId: item.alphabetId,
              thaiChar: item.thaiChar,
              isNew: item.memoryState?.isNew ?? null,
              reviewStage: item.memoryState?.reviewStage ?? null,
              source: item.source,
              round: item.round,
            }))
          );

          // 统计新字母和复习字母的分布
          // 🔥 TODO-03: 统一使用 'new-learning'
          const newLettersInQueue = queue.filter((item) => item.source === 'new-learning');
          const reviewLettersInQueue = queue.filter((item) => item.source !== 'new-learning');
          console.log('新字母数量:', newLettersInQueue.length);
          console.log('复习字母数量:', reviewLettersInQueue.length);

          set({
            phase: LearningPhase.IDLE,
            queue,
            currentItem: queue[0],
            currentIndex: 0,
            completedCount: 0,
            totalCount: queue.length,
            currentRound: round as 1 | 2 | 3, // 🔥 Bug 2 修复：保存 currentRound
            isLoading: false,
            lessonMetadata: lessonMetadata ?? null,
            phonicsRule: phonicsRule ?? null,
          });

          // 预下载本课所有字母音频到本地文件系统（首次进入该课时）
          (async () => {
            try {
              const cacheDir = `${
                // expo-file-system 在类型定义里没有暴露 cacheDirectory，
                // 这里通过 any 访问以避免 TS 报错。
                (FileSystem as any).cacheDirectory ??
                (FileSystem as any).documentDirectory ??
                ''
                }alphabet-audio/`;
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
                            `📥 下载音频(第 ${attempt + 1} 次):`
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

      // 复习提交：只更新本地会话状态，记忆写入由 round 完成时统一处理
      submitResult: async (userId: string, isCorrect: boolean) => {
        const { currentItem, currentIndex, queue } = get();
        if (!currentItem) return;

        // 自动映射为质量枚举
        const quality: QualityButton = isCorrect
          ? QualityButton.KNOW
          : QualityButton.FORGET;

        try {
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

      // 追加队列（用于错题回顾等动态插入）
      appendQueue: (items: AlphabetQueueItem[]) => {
        const { queue, currentIndex } = get();
        const newQueue = [...queue, ...items];
        set({
          queue: newQueue,
          totalCount: newQueue.length,
          currentItem: newQueue[currentIndex] ?? null,
        });
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

      // 🔥 Bug 3 修复：设置队列位置
      setCurrentIndex: (index: number) => {
        const { queue } = get();
        set({
          currentIndex: index,
          currentItem: queue[index] ?? null,
        });
      },

      // 🔥 Bug 2 修复：设置当前轮次
      setCurrentRound: (round: 1 | 2 | 3) => {
        set({ currentRound: round });
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
