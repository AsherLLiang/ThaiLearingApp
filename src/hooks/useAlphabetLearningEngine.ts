// src/hooks/useAlphabetLearningEngine.ts

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useAlphabetStore } from '@/src/stores/alphabetStore';
import { useModuleAccessStore } from '@/src/stores/moduleAccessStore';
import { useUserStore } from '@/src/stores/userStore';
import type { AlphabetLearningState } from '@/src/stores/alphabetStore';
import type { Letter } from '@/src/entities/types/letter.types';
import type {
  PhonicsRule,
  MiniReviewQuestion as MiniReviewQuestionType,
  RoundEvaluationState,
} from '@/src/entities/types/phonicsRule.types';

// ✅ 修复: 统一使用 enum 中的 QuestionType
import { QuestionType } from '@/src/entities/enums/QuestionType.enum';
import { getLetterAudioUrl } from '@/src/utils/alphabet/audioHelper';


// ✅ 修复: Phase 类型定义
export type Phase =
  | 'yesterday-review'
  | 'yesterday-remedy'
  | 'today-learning'
  | 'today-mini-review'
  | 'today-final-review'
  | 'today-remedy'
  | 'round-evaluation'
  | 'finished';

const MINI_REVIEW_INTERVAL = 3;

// ✅ 修复: QuestionTypeWeightMap 使用 enum
type QuestionTypeWeightMap = Partial<Record<QuestionType, number>>;

const DEFAULT_WEIGHTS: QuestionTypeWeightMap = {
  [QuestionType.SOUND_TO_LETTER]: 0.5,
  [QuestionType.LETTER_TO_SOUND]: 0.3,
  [QuestionType.SYLLABLE]: 0.2,
};

// ===== 辅助函数 =====

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

// ✅ 修复: buildMiniReviewQuestionsFromLetters
function buildMiniReviewQuestionsFromLetters(
  letters: Letter[],
  maxQuestions: number = 3
): MiniReviewQuestionType[] {
  const questions: MiniReviewQuestionType[] = [];

  if (letters.length === 0) return questions;

  // 1. 为每个字母生成 SOUND_TO_LETTER 题
  for (const letter of letters) {
    const distractors = letters
      .filter((l) => l._id !== letter._id)
      .slice(0, 2);

    questions.push({
      id: `mini-${letter._id}-sound`,
      type: QuestionType.SOUND_TO_LETTER,
      question: '🔊 听音，选择刚才学过的字母',
      options: shuffle([
        { label: letter.thaiChar, value: letter.thaiChar },
        ...distractors.map((l) => ({
          label: l.thaiChar,
          value: l.thaiChar,
        })),
      ]),
      correct: letter.thaiChar,
      audioUrl: getLetterAudioUrl(letter, 'letter'),
    });
  }

  // 2. 生成 LETTER_TO_SOUND 题
  if (letters.length > 0 && letters[0].initialSound) {
    const base = letters[0];
    const soundDistractors = letters
      .filter((l) => l._id !== base._id && l.initialSound)
      .slice(0, 2);

    if (soundDistractors.length >= 2) {
      questions.push({
        id: `mini-${base._id}-sound-choice`,
        type: QuestionType.LETTER_TO_SOUND,
        question: `字母「${base.thaiChar}」的首音是？`,
        options: shuffle([
          { label: base.initialSound, value: base.initialSound },
          ...soundDistractors.map((l) => ({
            label: l.initialSound,
            value: l.initialSound,
          })),
        ]),
        correct: base.initialSound,
        audioUrl: getLetterAudioUrl(base, 'letter'),
      });
    }
  }

  // 3. 尝试生成 SYLLABLE 题
  if (letters.length > 1) {
    const syllableBase = letters[1];
    const syllableDistractors = letters
      .filter((l) => l._id !== syllableBase._id)
      .slice(0, 2);

    questions.push({
      id: `mini-${syllableBase._id}-syllable`,
      type: QuestionType.SYLLABLE,
      question: `${syllableBase.thaiChar} + า = ?`,
      options: shuffle([
        {
          label: `${syllableBase.thaiChar}า`,
          value: `${syllableBase.thaiChar}า`,
        },
        ...syllableDistractors.map((l) => ({
          label: `${l.thaiChar}า`,
          value: `${l.thaiChar}า`,
        })),
      ]),
      correct: `${syllableBase.thaiChar}า`,
      audioUrl: getLetterAudioUrl(syllableBase, 'syllable'),
    });
  }

  return questions.slice(0, maxQuestions);
}

// ===== Hook 主体 =====

export function useAlphabetLearningEngine(lessonId: string) {
  const {
    queue,
    currentItem,
    lessonMetadata,
    phonicsRule,
    initializeSession,
    submitResult,
    submitRoundEvaluation: submitRoundToStore,
    next: nextInQueue,
  } = useAlphabetStore();

  const { currentUser } = useUserStore();
  const { markAlphabetLessonCompleted } = useModuleAccessStore();
  const userId = currentUser?.userId ?? 'test-user';

  const [initialized, setInitialized] = useState(false);
  const [phase, setPhase] = useState<Phase>('yesterday-review');
  const [currentQuestionType, setCurrentQuestionType] = useState<QuestionType | null>(null);

  const [showPhonicsRuleCard, setShowPhonicsRuleCard] = useState(false);
  const [phonicsRuleShown, setPhonicsRuleShown] = useState(false);

  const [learnedCount, setLearnedCount] = useState(0);
  const [miniReviewQuestion, setMiniReviewQuestion] = useState<MiniReviewQuestionType | null>(null);
  const [miniReviewQuestions, setMiniReviewQuestions] = useState<MiniReviewQuestionType[]>([]);
  const [miniReviewIndex, setMiniReviewIndex] = useState(0);

  const [todayList, setTodayList] = useState<AlphabetLearningState[]>([]);
  const [wrongAnswers, setWrongAnswers] = useState<Set<string>>(new Set());

  // ✅ 修复: currentRound 类型为 1 | 2 | 3
  const [currentRound, setCurrentRound] = useState<1 | 2 | 3>(1);
  const [roundEvaluation, setRoundEvaluation] = useState<RoundEvaluationState>({
    currentRound: 1,
    rounds: [],
    allRoundsPassed: false,
  });

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
        setPhase('finished');
        return;
      }

      if (cancelled) return;
      setInitialized(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [lessonId, userId, initializeSession]);

  // ===== 首次进入：如果没有任何“旧字母”，自动跳过昨日复习 =====
  useEffect(() => {
    if (!initialized) return;
    if (phase !== 'yesterday-review') return;

    // 只要队列里全部都是 isNew === true，就认为没有“昨日复习”，直接进入今日学习
    const hasNonNew = queue.some(
      (item) => item.memoryState && item.memoryState.isNew === false,
    );

    if (!hasNonNew) {
      setPhase('today-learning');
    }
  }, [initialized, phase, queue]);

  // ===== Today Learning 首次显示拼读规则 =====
  useEffect(() => {
    if (
      phase === 'today-learning' &&
      !phonicsRuleShown &&
      phonicsRule &&
      learnedCount === 0
    ) {
      setShowPhonicsRuleCard(true);
    }
  }, [phase, phonicsRuleShown, phonicsRule, learnedCount]);

  const handleCompletePhonicsRule = useCallback(() => {
    setShowPhonicsRuleCard(false);
    setPhonicsRuleShown(true);
  }, []);

  // ===== Mini Review 逻辑 =====
  const triggerMiniReview = useCallback(() => {
    if (todayList.length < MINI_REVIEW_INTERVAL) return;

    const recentLetters = todayList.slice(-MINI_REVIEW_INTERVAL).map((item) => item.letter);
    const questions = buildMiniReviewQuestionsFromLetters(recentLetters, 3);

    setMiniReviewQuestions(questions);
    setMiniReviewIndex(0);
    setMiniReviewQuestion(questions[0] || null);
    setPhase('today-mini-review');
  }, [todayList]);

  const handleMiniReviewAnswer = useCallback(
    (isCorrect: boolean, type: QuestionType) => {
      console.log('[Mini Review]', isCorrect ? '✅ 正确' : '❌ 错误', type);
    },
    []
  );

  const handleMiniReviewNext = useCallback(() => {
    const nextIndex = miniReviewIndex + 1;

    if (nextIndex < miniReviewQuestions.length) {
      setMiniReviewIndex(nextIndex);
      setMiniReviewQuestion(miniReviewQuestions[nextIndex]);
    } else {
      setMiniReviewQuestions([]);
      setMiniReviewIndex(0);
      setMiniReviewQuestion(null);
      setPhase('today-learning');
    }
  }, [miniReviewIndex, miniReviewQuestions]);

  // ===== 答题回调 =====
  const handleAnswer = useCallback(
    async (isCorrect: boolean, questionType: QuestionType) => {
      if (!currentItem) return;

      await submitResult(userId, isCorrect);

      if (!isCorrect) {
        setWrongAnswers((prev) => new Set(prev).add(currentItem.alphabetId));
      }
    },
    [currentItem, userId, submitResult]
  );

  // ===== 下一题 =====
  const handleNext = useCallback(() => {
    if (phase === 'today-learning') {
      setTodayList((prev) => [...prev, currentItem!]);
      setLearnedCount((prev) => prev + 1);

      const newCount = learnedCount + 1;
      if (newCount % MINI_REVIEW_INTERVAL === 0) {
        triggerMiniReview();
        return;
      }
    }

    nextInQueue();
  }, [phase, currentItem, learnedCount, triggerMiniReview, nextInQueue]);

  // ✅ 修复: submitRoundResults 返回类型明确
  const submitRoundResults = useCallback(async () => {
    const roundData = {
      roundNumber: currentRound,
      totalQuestions: todayList.length,
      correctCount: todayList.length - wrongAnswers.size,
      accuracy: (todayList.length - wrongAnswers.size) / todayList.length,
      passed: wrongAnswers.size / todayList.length <= 0.1,
    };

    // ✅ 修复: 类型安全的 setRoundEvaluation
    setRoundEvaluation((prev) => ({
      ...prev,
      currentRound: currentRound,
      rounds: [...prev.rounds, roundData],
    }));

    await submitRoundToStore({
      userId,
      lessonId,
      ...roundData,
    });

    if (currentRound < 3) {
      // ✅ 修复: 类型断言
      setCurrentRound((currentRound + 1) as 1 | 2 | 3);
      setWrongAnswers(new Set());
      setPhase('yesterday-review');
    } else {
      markAlphabetLessonCompleted(lessonId);
      setPhase('finished');
    }
  }, [
    currentRound,
    todayList,
    wrongAnswers,
    userId,
    lessonId,
    submitRoundToStore,
    markAlphabetLessonCompleted,
  ]);

  const letterPool = useMemo(() => queue.map((item) => item.letter), [queue]);

  return {
    initialized,
    phase,
    currentRound,
    roundEvaluation,
    currentItem,
    currentQuestionType,
    letterPool,
    onAnswer: handleAnswer,
    onNext: handleNext,
    onSkipYesterdayReview: () => setPhase('today-learning'), // ✅ 新增
    phonicsRule,
    showPhonicsRuleCard,
    onCompletePhonicsRule: handleCompletePhonicsRule,
    miniReviewQuestion,
    onMiniReviewAnswer: handleMiniReviewAnswer,
    onMiniReviewNext: handleMiniReviewNext,
  };
}
