// src/hooks/useAlphabetLearningEngine.ts

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useAlphabetStore } from '@/src/stores/alphabetStore';
import { useModuleAccessStore } from '@/src/stores/moduleAccessStore';
import { useUserStore } from '@/src/stores/userStore';
import type { AlphabetLearningState, AlphabetQueueItem, AlphabetQueueSource } from '@/src/stores/alphabetStore';
import type {
  PhonicsRule,
  RoundEvaluationState,
} from '@/src/entities/types/phonicsRule.types';

// ✅ 修复: 统一使用 enum 中的 QuestionType
import { QuestionType } from '@/src/entities/enums/QuestionType.enum';
import { QualityButton } from '@/src/entities/enums/QualityScore.enum';
import { callCloudFunction } from '@/src/utils/apiClient';
import { API_ENDPOINTS } from '@/src/config/api.endpoints';
import { Alert, AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


// 🔥 TODO-03: Phase = AlphabetQueueSource + 特殊状态
// Phase 仅用于 UI 展示，不参与执行决策
export type Phase = AlphabetQueueSource | 'finished' | 'round-completed';

const SESSION_STORAGE_KEY = '@alphabet_learning_session';

interface SessionRecoveryState {
  lessonId: string;
  round: 1 | 2 | 3;
  phase: Phase;
  answeredCount: number;
  currentIndex: number; // 🔥 Bug 3 修复：添加 currentIndex
  status: 'in-progress' | 'completed';
}


// ===== Hook 主体 =====

export function useAlphabetLearningEngine(lessonId: string) {
  const {
    queue,
    currentItem,
    currentIndex,
    currentRound: storeCurrentRound, // 从 Store 读取 currentRound
    lessonMetadata,
    phonicsRule,
    initializeSession,
    submitRoundEvaluation: submitRoundToStore,
    next: nextInQueue,
    appendQueue,
    setCurrentIndex, // 引入 setCurrentIndex 方法
    setCurrentRound: setStoreCurrentRound, // 引入 setCurrentRound 方法
  } = useAlphabetStore();

  const { currentUser } = useUserStore();
  const { userProgress } = useModuleAccessStore();
  const userId = currentUser?.userId ?? 'test-user';

  const [initialized, setInitialized] = useState(false);
  // REMOVED explicit phase state. Phase is now derived.
  // const [phase, setPhase] = useState<Phase>('finished'); 

  // 🔥 TODO-03: 以下状态仅用于 UI 展示，不参与执行决策 (legacy UI only)
  const [isLessonFinished, setIsLessonFinished] = useState(false);
  const [explicitPhase, setExplicitPhase] = useState<Phase | null>(null);

  // ===== Phase Logic (Derived) =====
  // 🔥 TODO-03: derivedPhase 仅用于 UI 展示，不参与执行决策 (legacy UI only)
  const derivedPhase: Phase = useMemo(() => {
    if (explicitPhase) return explicitPhase;
    if (isLessonFinished) return 'finished';
    if (!currentItem) return 'finished';

    // 直接返回 source，不再进行映射转换
    return currentItem.source;
  }, [currentItem, isLessonFinished, explicitPhase]);

  const [phonicsRuleShown, setPhonicsRuleShown] = useState(false);
  const [showPhonicsRuleCard, setShowPhonicsRuleCard] = useState(false);

  const [learnedCount, setLearnedCount] = useState(0);
  const [todayList, setTodayList] = useState<AlphabetLearningState[]>([]);
  const [wrongAnswers, setWrongAnswers] = useState<Set<string>>(new Set());

  // ✅ 修复: currentRound 类型为 1 | 2 | 3
  // 🔥 Bug 2 修复：初始化时从 Store 读取 currentRound
  const [currentRound, setCurrentRound] = useState<1 | 2 | 3>(storeCurrentRound || 1);
  const [roundEvaluation, setRoundEvaluation] = useState<RoundEvaluationState>({
    currentRound: 1,
    rounds: [],
    allRoundsPassed: false,
  });

  const roundMemoryResultsRef = useRef<Record<string, QualityButton>>({});
  const [answeredCount, setAnsweredCount] = useState(0);
  const [recoveryPrompted, setRecoveryPrompted] = useState(false);
  // 新增: 将恢复状态暴露给 UI
  const [pendingRecoverySession, setPendingRecoverySession] = useState<SessionRecoveryState | null>(null);

  // 🔥 新增: 标记用户是否已经开始答题（用于延迟 session 保存时机）
  const [hasStartedAnswering, setHasStartedAnswering] = useState(false);

  const prevRoundRef = useRef<1 | 2 | 3>(currentRound);


  // 🐛 P0-2 FIX: 防止重复点击
  const [isProcessingNext, setIsProcessingNext] = useState(false);

  const writeSessionState = useCallback(async (state: SessionRecoveryState | null) => {
    try {
      if (state) {
        await AsyncStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(state));
      } else {
        await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
      }
    } catch (error) {
      console.error('⚠️ 字母学习会话状态持久化失败:', error);
    }
  }, []);

  const persistSessionState = useCallback(async () => {
    // 🔥 TODO-03: 不依赖 derivedPhase，改为判断 isLessonFinished 和 currentItem
    // 当课程结束或没有当前题目时，清除 session
    if (!lessonId || !initialized || isLessonFinished || !currentItem) {
      console.log('💾 [Persist] Clearing session (finished or no item)');
      await writeSessionState(null);
      return;
    }

    // 🔥 新增：只有用户开始答题后，才保存 session
    if (!hasStartedAnswering) {
      console.log('💾 [Persist] User has not started answering, skip persisting');
      return;
    }

    const sessionData: SessionRecoveryState = {
      lessonId,
      round: currentRound,
      phase: currentItem.source, // 🔥 TODO-03: 直接使用 source，不再映射
      answeredCount,
      currentIndex, // 🔥 Bug 3 修复：保存 currentIndex
      status: 'in-progress', // 默认状态为 in-progress
    };
    console.log('💾 [Persist] Writing session:', sessionData);
    await writeSessionState(sessionData);
  }, [lessonId, initialized, isLessonFinished, currentItem, currentRound, answeredCount, currentIndex, writeSessionState, hasStartedAnswering]);

  const clearStoredSessionState = useCallback(async () => {
    await writeSessionState(null);
  }, [writeSessionState]);

  const handleContinueStoredSession = useCallback((session: SessionRecoveryState) => {
    setCurrentRound(session.round);
    // setPhase(session.phase); // Phase derived from queue restoration
    setAnsweredCount(session.answeredCount ?? 0);
    setTodayList([]);
    setWrongAnswers(new Set());
    setRecoveryPrompted(true);

    // 🔥 恢复学习时，标记为已经开始答题（因为是中断后恢复）
    setHasStartedAnswering(true);

    // 🔥 Bug 3 修复：恢复队列位置
    if (session.currentIndex !== undefined && session.currentIndex >= 0) {
      setCurrentIndex(session.currentIndex);
      console.log(`🔄 恢复队列位置: currentIndex = ${session.currentIndex}`);
    }
  }, [setCurrentIndex]);

  const handleRestartStoredSession = useCallback(async (session?: SessionRecoveryState) => {
    // 🔥 Bug 4 修复：重新开始本轮时，需要调用 initializeSession 重新加载队列
    // 从 Round1 的第一个阶段开始（previous-round-review 或 new-learning）
    const targetRound = session?.round ?? 1;

    setCurrentRound(targetRound);
    setAnsweredCount(0);
    setTodayList([]);
    setWrongAnswers(new Set());
    setRecoveryPrompted(true);

    // 🔥 重新开始时，重置答题标记
    setHasStartedAnswering(false);

    // 🔥 清除旧 session
    await clearStoredSessionState();

    // 🔥 重新初始化队列，指定 round
    try {
      await initializeSession(userId, { lessonId, round: targetRound });
      console.log(`🔄 重新加载队列: Round ${targetRound}`);
    } catch (error) {
      console.error('❌ handleRestartStoredSession: initializeSession 失败:', error);
    }
  }, [clearStoredSessionState, initializeSession, userId, lessonId]);

  // ===== 初始化 =====
  useEffect(() => {
    let cancelled = false;

    // 🔥 每次重新初始化时，重置答题标记
    setHasStartedAnswering(false);

    (async () => {
      try {
        await initializeSession(userId, { lessonId });
      } catch (e) {
        console.error('[useAlphabetLearningEngine] initializeSession 失败:', e);
        if (cancelled) return;
        // 后端失败时也不能永远停留在 loading
        setInitialized(true);
        // setPhase('finished');
        return;
      }

      if (cancelled) return;
      setInitialized(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [lessonId, userId, initializeSession]);

  useEffect(() => {
    void persistSessionState();
  }, [persistSessionState]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'background' || nextState === 'inactive') {
        void persistSessionState();
      }
    });

    return () => {
      void persistSessionState();
      subscription.remove();
    };
  }, [persistSessionState]);

  useEffect(() => {
    if (!initialized || recoveryPrompted || !lessonId) {
      console.log('🔍 [Recovery Check] Skipped:', { initialized, recoveryPrompted, lessonId });
      return;
    }

    console.log('🔍 [Recovery Check] Starting check...');

    let cancelled = false;
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(SESSION_STORAGE_KEY);
        console.log('🔍 [Recovery Check] Stored session:', stored ? 'Found' : 'Not found');

        if (!stored) return;

        const parsed: SessionRecoveryState = JSON.parse(stored);
        console.log('🔍 [Recovery Check] Parsed session:', {
          lessonId: parsed.lessonId,
          round: parsed.round,
          phase: parsed.phase,
          status: parsed.status,
          currentIndex: parsed.currentIndex
        });

        // 验证 lessonId 匹配
        if (parsed.lessonId !== lessonId) {
          console.log('🔍 [Recovery Check] LessonId mismatch, clearing...');
          await clearStoredSessionState();
          return;
        }

        // 🔥 关键修复：仅当 status === 'in-progress' 时才弹出恢复提示
        if (parsed.status !== 'in-progress') {
          console.log('🔍 [Recovery Check] Status not in-progress, clearing...', parsed.status);
          await clearStoredSessionState();
          return;
        }

        if (cancelled) return;

        // 替换 Alert.alert 为 UI 状态
        console.log('🔍 [Recovery Check] Showing recovery dialog');
        setPendingRecoverySession(parsed);
        setRecoveryPrompted(true);

      } catch (error) {
        console.error('⚠️ 读取字母学习会话状态失败:', error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    initialized,
    lessonId,
    recoveryPrompted,
    clearStoredSessionState,
  ]);

  // 新增: 处理用户的恢复选择
  const handleResolveRecovery = useCallback((choice: 'continue' | 'restart') => {
    if (!pendingRecoverySession) return;

    if (choice === 'continue') {
      handleContinueStoredSession(pendingRecoverySession);
    } else {
      handleRestartStoredSession(pendingRecoverySession);
    }
    setPendingRecoverySession(null);
  }, [pendingRecoverySession, handleContinueStoredSession, handleRestartStoredSession]);

  // 🔥 Bug 2 修复：从 Store 同步 currentRound 到 Hook 本地状态
  useEffect(() => {
    if (storeCurrentRound && storeCurrentRound !== currentRound) {
      console.log(`🔄 Syncing currentRound from Store: ${storeCurrentRound}`);
      setCurrentRound(storeCurrentRound);
    }
  }, [storeCurrentRound, currentRound]);

  useEffect(() => {
    if (prevRoundRef.current !== currentRound) {
      prevRoundRef.current = currentRound;
      setAnsweredCount(0);
    }
  }, [currentRound]);

  // ===== 首次进入：如果没有任何“旧字母”，自动跳过昨日复习 =====
  useEffect(() => {
    if (!initialized) return;
    if (!currentItem) return;
    // setPhase(currentItem.source); // REMOVED: Phase is derived
  }, [initialized, currentItem, queue]);

  // ===== Today Learning 首次显示拼读规则 =====
  useEffect(() => {
    // 🔥 TODO-03: 统一使用 'new-learning'
    const isNew = currentItem?.source === 'new-learning';
    if (isNew && !phonicsRuleShown && phonicsRule && learnedCount === 0) {
      setShowPhonicsRuleCard(true);
    }
  }, [phonicsRuleShown, phonicsRule, learnedCount, currentItem]);

  const handleCompletePhonicsRule = useCallback(() => {
    setShowPhonicsRuleCard(false);
    setPhonicsRuleShown(true);
  }, []);

  const recordMemoryResult = useCallback((letterId: string, quality: QualityButton) => {
    roundMemoryResultsRef.current[letterId] = quality;
  }, []);

  const submitAlphabetMemoryResults = useCallback(
    async (roundNumber: number) => {
      const entries = Object.entries(roundMemoryResultsRef.current);
      if (entries.length === 0) return;

      const results = entries.map(([entityId, quality]) => ({
        entityType: 'letter' as const,
        entityId,
        quality,
      }));

      try {
        await callCloudFunction(
          'submitMemoryResult',
          {
            userId,
            lessonId,
            roundNumber,
            results,
          },
          {
            endpoint: API_ENDPOINTS.MEMORY.SUBMIT_MEMORY_RESULT.cloudbase,
          }
        );
      } catch (error) {
        console.error('❌ submitAlphabetMemoryResults error:', error);
      }
    },
    [lessonId, userId]
  );

  // ===== 答题回调 =====
  const handleAnswer = useCallback(
    async (isCorrect: boolean, questionType: QuestionType) => {
      if (!currentItem) return;

      // 🔥 标记用户已经开始答题（触发 session 保存）
      if (!hasStartedAnswering) {
        setHasStartedAnswering(true);
        console.log('🎯 User started answering, session will now persist');
      }

      const quality = isCorrect ? QualityButton.KNOW : QualityButton.FORGET;
      recordMemoryResult(currentItem.alphabetId, quality);
      setAnsweredCount((prev) => prev + 1);

      const wrongKey = currentItem.alphabetId;

      setWrongAnswers((prev) => {
        const next = new Set(prev);
        if (isCorrect && currentItem.source === 'error-review') {
          next.delete(wrongKey);
        } else if (!isCorrect) {
          next.add(wrongKey);
        }
        return next;
      });
    },
    [currentItem, recordMemoryResult, hasStartedAnswering]
  );

  // REMOVED DUPLICATE derivedPhase definition from here (moved to top)


  // ===== Question Type Logic (Engine Driven) =====

  // 🔥 TODO-03: 题型选择只能基于 currentItem.source，不依赖 Phase
  const currentQuestionType = useMemo<QuestionType | null>(() => {
    if (!currentItem) return null;

    const source = currentItem.source;

    // 1. New Learning / Mini Review: ALLOW Simple Types
    if (source === 'new-learning') {
      return QuestionType.SOUND_TO_LETTER;
    }

    if (source === 'mini-review') {
      return Math.random() > 0.5 ? QuestionType.SOUND_TO_LETTER : QuestionType.LETTER_TO_SOUND;
    }

    // 2. Strict Review Phases: FORBID Simple Types (where possible)
    // 🔥 TODO-03: 统一使用 'previous-review'
    if (source === 'previous-review' || source === 'final-review') {
      const complexTypes = [];

      // Only allow CONSONANT_CLASS for Consonants
      if (currentItem.letter.type === 'consonant') {
        complexTypes.push(QuestionType.CLASS_CHOICE); // CONSONANT_CLASS
        // Initial/Final sound usually applies to consonants acting as such
        if (currentItem.letter.initialSound) complexTypes.push(QuestionType.INITIAL_SOUND);
        if (currentItem.letter.finalSound) complexTypes.push(QuestionType.FINAL_CONSONANT);
      } else {
        // Vowels / Tones:
        // Currently we lack "Complex" types for vowels (Tone Calculation is TODO).
        // Fallback to LETTER_TO_SOUND (Reading) which is harder than Sound-to-Letter.
        // We cannot use CONSONANT_CLASS.
      }

      // TODO: Enable these when data/logic is ready
      // complexTypes.push(QuestionType.TONE_CALCULATION);

      if (complexTypes.length === 0) {
        // Fallback for Vowels in Strict Phase
        // Prefer LETTER_TO_SOUND (Reading)
        return QuestionType.LETTER_TO_SOUND;
      }

      const hash = currentItem.alphabetId.charCodeAt(0) + (currentItem.round || 0) + Date.now();
      return complexTypes[hash % complexTypes.length];
    }

    if (source === 'error-review') {
      // Error Review: Retry what they failed.
      // If we don't know what they failed, default to SOUND_TO_LETTER for safety?
      // Or make it strict if it was a strict phase failure?
      // For now, allow simple types to ensure they at least get the basics.
      return QuestionType.SOUND_TO_LETTER;
    }

    return QuestionType.SOUND_TO_LETTER;
  }, [currentItem]);


  // ===== 下一题 =====
  const handleNext = useCallback(async () => {
    // 🐛 P0-2 FIX: 防止重复点击
    if (isProcessingNext) {
      console.log('🚫 防止重复点击 handleNext');
      return;
    }

    // 🔥 TODO-03: 不依赖 explicitPhase，改为判断 currentItem
    // 当轮次完成后，currentItem 为 null，无法继续答题
    if (!currentItem) {
      console.warn('⚠️ No current item, round may be completed.');
      return;
    }

    console.log('=== handleNext 调用 ===');
    console.log('调用前状态:', {
      phase: derivedPhase,
      currentRound,
      learnedCount,
      queueLength: queue.length,
      currentLetter: currentItem?.letter?.thaiChar || 'unknown',
      source: currentItem?.source,
      errorQueueSize: wrongAnswers.size, // Approximation of potential error queue
    });

    setIsProcessingNext(true);

    // 🔥 TODO-03: 统一使用 'new-learning'
    const isCurrentNew = currentItem?.source === 'new-learning';
    // STRICT Condition: End of Queue
    const atEnd = currentIndex >= queue.length - 1;

    try {
      if (currentItem && isCurrentNew) {
        setTodayList((prev) => [...prev, currentItem]);
        setLearnedCount((prev) => prev + 1);
      }

      if (atEnd) {
        // 1. Check if we have pending errors
        if (wrongAnswers.size > 0) {
          const errorItems: AlphabetQueueItem[] = [];
          const wrongArray = Array.from(wrongAnswers);

          wrongArray.forEach((letterId) => {
            const target = queue.find((q) => q.alphabetId === letterId);
            if (target) {
              errorItems.push({ ...target, source: 'error-review', round: currentRound });
            }
          });

          if (errorItems.length > 0) {
            appendQueue(errorItems);
            console.log('🔁 追加错题回顾队列:', errorItems.map((i) => i.alphabetId));
            // Just move next to start error review
            nextInQueue();
            return;
          }
        }

        // 2. Strict Round Completion Check
        // Condition: End of Queue AND No Errors allowed
        if (wrongAnswers.size === 0) {
          console.log('✅ Round Completed Check Passed.');
          await submitRoundResults();
          // DO NOT call nextInQueue, just stop here.
          return;
        }
      }

      nextInQueue();
    } finally {
      setTimeout(() => {
        setIsProcessingNext(false);
      }, 300);
    }
  }, [currentItem, learnedCount, nextInQueue, queue, currentRound, isProcessingNext, currentIndex, wrongAnswers, appendQueue]); // 🔥 TODO-03: 移除 derivedPhase 和 explicitPhase 依赖

  // ✅ 修复: submitRoundResults
  const submitRoundResults = useCallback(async () => {
    console.log(`🚀 Submitting Round ${currentRound} Results...`);

    const totalQuestions = queue.length; // Note: includes error retries
    const correctCount = Math.max(0, totalQuestions - wrongAnswers.size); // Rough calc

    const accuracy = totalQuestions > 0 ? correctCount / totalQuestions : 0;
    const passed = wrongAnswers.size === 0; // Round passes only if no errors

    // 🔥 TODO-05: 判定 mode，free-play 模式下禁止任何写入
    const mode = userProgress?.letterCompleted ? 'free-play' : 'learning';

    if (mode === 'learning') {
      // ===== learning 模式：正常写入进度 =====

      // 1. Submit to Backend（失败时不得推进本地轮次，否则 roundHistory 未写入会导致下次 initializeSession 仍从 round1 起算）
      const roundEvalRes = await submitRoundToStore({
        userId,
        lessonId,
        roundNumber: currentRound,
        totalQuestions,
        correctCount,
        accuracy: 1, // Hack: If they cleared error queue, they technically "passed".
      });

      if (!roundEvalRes.success) {
        Alert.alert(
          '同步失败',
          roundEvalRes.error || '无法保存轮次成绩，请检查网络后重试。',
        );
        return;
      }

      // 2. Log
      console.log(`✅ Round ${currentRound} Submit Success.`);

      // 🔥 Step 5: Round3 完成后刷新用户进度（从后端获取最新 completedLessons）
      if (currentRound === 3 && passed) {
        console.log('📚 Round3 completed! Refreshing user progress from backend...');

        // 🔥 刷新进度（会从后端获取最新的 completedLessons）
        await useModuleAccessStore.getState().getUserProgress();

        console.log('✅ User progress refreshed from backend');
      }

      // 3. 🔥 推进到下一轮（Round1 → Round2 → Round3）
      const nextRound = Math.min(currentRound + 1, 3) as 1 | 2 | 3;

      // 🔥 先更新 Store 的 currentRound (避免 useEffect 同步时覆盖)
      setStoreCurrentRound(nextRound);
      console.log(`🔄 Store currentRound updated: ${nextRound}`);

      // 🔥 再更新 Hook 的本地状态
      setCurrentRound(nextRound);

      // 4. 🔥 显式清除 session（避免下次进入时弹出恢复弹窗）
      await clearStoredSessionState();
      console.log('🗑️ Round completed, session cleared');

      // 5. ENTER 'round-completed' PHASE
      setExplicitPhase('round-completed');
    } else {
      // ===== free-play 模式：只读学习，不写入任何进度 =====
      console.log(`🎮 free-play 模式：Round 完成，但不写入进度`);

      // 仅清除 session，不推进 round
      await clearStoredSessionState();

      // 显示完成 UI
      setExplicitPhase('round-completed');
    }

  }, [currentRound, queue.length, wrongAnswers, userId, lessonId, submitRoundToStore, clearStoredSessionState, setStoreCurrentRound, userProgress, setCurrentRound, setExplicitPhase]);

  // REMOVED: handleStartNextRound. 
  // User must exit to Lesson page and restart to trigger next round init.
  /*
  const handleStartNextRound = useCallback(async () => { ... });
  */



  const letterPool = useMemo(() => queue.map((item) => item.letter), [queue]);

  // 🔥 新增: 在 RoundCompleted 或课程完成时调用，清除 session
  const handleFinishRound = useCallback(async () => {
    await clearStoredSessionState();
  }, [clearStoredSessionState]);

  // 🔥 新增: Skip (Bury) functionality for previous-review
  const handleSkipYesterdayReview = useCallback(async () => {
    // Only valid in previous-review phase
    // 🔥 TODO-03: derivedPhase is legacy, check source directly
    if (currentItem?.source !== 'previous-review') {
      console.warn('⚠️ handleSkipYesterdayReview called outside of previous-review phase');
      return;
    }

    console.log('⏭️ Skipping (Burying) review item:', currentItem.alphabetId);

    // 1. Mark as Known (Correct) to "bury" it for this session quality-wise
    // Using currentQuestionType or fallback to SOUND_TO_LETTER
    await handleAnswer(true, currentQuestionType ?? QuestionType.SOUND_TO_LETTER);

    // 2. Advance to next item immediately
    console.log('⏭️ Item skipped, advancing...');
    await handleNext();
  }, [currentItem, currentQuestionType, handleAnswer, handleNext]);

  return {
    initialized,
    phase: derivedPhase,
    currentRound,
    queueIndex: currentIndex,
    totalQueue: queue.length,
    roundEvaluation,
    currentItem,
    currentQuestionType,
    letterPool,
    onAnswer: handleAnswer,
    onNext: handleNext,
    // onStartNextRound: handleStartNextRound, // REMOVED
    phonicsRule,
    showPhonicsRuleCard,
    onCompletePhonicsRule: handleCompletePhonicsRule,
    // 透出给 UI
    pendingRecoverySession,
    resolveRecovery: handleResolveRecovery,
    onFinishRound: handleFinishRound,
    onSkipYesterdayReview: handleSkipYesterdayReview,
  };
}
