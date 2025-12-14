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


// ✅ 修复: Phase 类型定义
export type Phase = AlphabetQueueSource | 'finished' | 'new-learning' | 'round-completed';

const SESSION_STORAGE_KEY = '@alphabet_learning_session';

interface SessionRecoveryState {
  lessonId: string;
  round: 1 | 2 | 3;
  phase: Phase;
  answeredCount: number;
}


// ===== Hook 主体 =====

export function useAlphabetLearningEngine(lessonId: string) {
  const {
    queue,
    currentItem,
    currentIndex,
    lessonMetadata,
    phonicsRule,
    initializeSession,
    submitRoundEvaluation: submitRoundToStore,
    next: nextInQueue,
    appendQueue,
  } = useAlphabetStore();

  const { currentUser } = useUserStore();
  const { markAlphabetLessonCompleted } = useModuleAccessStore();
  const userId = currentUser?.userId ?? 'test-user';

  const [initialized, setInitialized] = useState(false);
  // REMOVED explicit phase state. Phase is now derived.
  // const [phase, setPhase] = useState<Phase>('finished'); 

  // Internal state to track if we explicitly finished the lesson (all rounds done)
  const [isLessonFinished, setIsLessonFinished] = useState(false);

  // Explicit phase overrides everything (e.g. 'round-completed')
  const [explicitPhase, setExplicitPhase] = useState<Phase | null>(null);

  // ===== Phase Logic (Derived) =====
  const derivedPhase: Phase = useMemo(() => {
    if (explicitPhase) return explicitPhase;
    if (isLessonFinished) return 'finished';
    if (!currentItem) return 'finished';

    if (currentItem.source === 'new') return 'new-learning';
    return currentItem.source;
  }, [currentItem, isLessonFinished, explicitPhase]);

  const [phonicsRuleShown, setPhonicsRuleShown] = useState(false);
  const [showPhonicsRuleCard, setShowPhonicsRuleCard] = useState(false);

  const [learnedCount, setLearnedCount] = useState(0);
  const [todayList, setTodayList] = useState<AlphabetLearningState[]>([]);
  const [wrongAnswers, setWrongAnswers] = useState<Set<string>>(new Set());

  // ✅ 修复: currentRound 类型为 1 | 2 | 3
  const [currentRound, setCurrentRound] = useState<1 | 2 | 3>(1);
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
    if (!lessonId || !initialized || derivedPhase === 'finished') {
      await writeSessionState(null);
      return;
    }

    await writeSessionState({
      lessonId,
      round: currentRound,
      phase: isLessonFinished ? 'finished' : (currentItem?.source || 'new'), // Fallback for session storage
      answeredCount,
    });
  }, [lessonId, initialized, isLessonFinished, currentItem, currentRound, answeredCount, writeSessionState]);

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
  }, []);

  const handleRestartStoredSession = useCallback((session?: SessionRecoveryState) => {
    setCurrentRound(session?.round ?? 1);
    setCurrentRound(session?.round ?? 1);
    // setPhase('today-learning'); // Phase derived
    setAnsweredCount(0);
    setTodayList([]);
    setWrongAnswers(new Set());
    setRecoveryPrompted(true);
    void clearStoredSessionState();
  }, [clearStoredSessionState]);

  // ===== 初始化 =====
  useEffect(() => {
    let cancelled = false;

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
    if (!initialized || recoveryPrompted || !lessonId) return;

    let cancelled = false;
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(SESSION_STORAGE_KEY);
        if (!stored) return;

        const parsed: SessionRecoveryState = JSON.parse(stored);
        if (parsed.lessonId !== lessonId) {
          await clearStoredSessionState();
          return;
        }

        if (cancelled) return;

        // 替换 Alert.alert 为 UI 状态
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
    const isNew = currentItem?.source === 'new';
    if (isNew && !phonicsRuleShown && phonicsRule && learnedCount === 0) {
      setShowPhonicsRuleCard(true);
    }
    if (isNew && !phonicsRuleShown && phonicsRule && learnedCount === 0) {
      setShowPhonicsRuleCard(true);
    }
  }, [derivedPhase, phonicsRuleShown, phonicsRule, learnedCount, currentItem]);

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
    [currentItem, recordMemoryResult]
  );

  // REMOVED DUPLICATE derivedPhase definition from here (moved to top)


  // ===== Question Type Logic (Engine Driven) =====

  // We determine the question type based on Phase and potentially history.
  // This ensures specific phases have specific types.
  const currentQuestionType = useMemo<QuestionType | null>(() => {
    if (!currentItem) return null;

    // 1. New Learning / Mini Review: ALLOW Simple Types
    if (derivedPhase === 'new-learning') {
      return QuestionType.SOUND_TO_LETTER;
    }

    if (derivedPhase === 'mini-review') {
      return Math.random() > 0.5 ? QuestionType.SOUND_TO_LETTER : QuestionType.LETTER_TO_SOUND;
    }

    // 2. Strict Review Phases: FORBID Simple Types (where possible)
    if (derivedPhase === 'previous-round-review' || derivedPhase === 'final-review') {
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

    if (derivedPhase === 'error-review') {
      // Error Review: Retry what they failed.
      // If we don't know what they failed, default to SOUND_TO_LETTER for safety?
      // Or make it strict if it was a strict phase failure?
      // For now, allow simple types to ensure they at least get the basics.
      return QuestionType.SOUND_TO_LETTER;
    }

    return QuestionType.SOUND_TO_LETTER;
  }, [derivedPhase, currentItem]);


  // ===== 下一题 =====
  const handleNext = useCallback(async () => {
    // 🐛 P0-2 FIX: 防止重复点击
    if (isProcessingNext) {
      console.log('🚫 防止重复点击 handleNext');
      return;
    }

    if (explicitPhase === 'round-completed') {
      console.warn('⚠️ Already in round-completed, wait for manual transition.');
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

    const isCurrentNew = currentItem?.source === 'new';
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
  }, [derivedPhase, currentItem, learnedCount, nextInQueue, queue, currentRound, isProcessingNext, currentIndex, wrongAnswers, appendQueue, explicitPhase]); // Removed recursive submitRoundResults dep if possible, but it's needed.

  // ✅ 修复: submitRoundResults 
  const submitRoundResults = useCallback(async () => {
    console.log(`🚀 Submitting Round ${currentRound} Results...`);

    const totalQuestions = queue.length; // Note: includes error retries
    const correctCount = Math.max(0, totalQuestions - wrongAnswers.size); // Rough calc

    const accuracy = totalQuestions > 0 ? correctCount / totalQuestions : 0;

    // 1. Submit to Backend
    await submitRoundToStore({
      userId,
      lessonId,
      roundNumber: currentRound,
      totalQuestions,
      correctCount,
      accuracy: 1, // Hack: If they cleared error queue, they technically "passed".
    });

    // 2. Log
    console.log(`✅ Round ${currentRound} Submit Success.`);

    // 3. ENTER 'round-completed' PHASE
    // DO NOT Auto Increment Round Here.
    setExplicitPhase('round-completed');

  }, [currentRound, queue.length, wrongAnswers, userId, lessonId, submitRoundToStore]);

  // REMOVED: handleStartNextRound. 
  // User must exit to Lesson page and restart to trigger next round init.
  /*
  const handleStartNextRound = useCallback(async () => { ... });
  */



  const letterPool = useMemo(() => queue.map((item) => item.letter), [queue]);

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
  };
}
