// src/engines/useAlphabetLearningEngine.ts

import { useState, useEffect, useCallback } from 'react';

import { useAlphabetStore } from '@/src/stores/alphabetStore';
import { useUserStore } from '@/src/stores/userStore';
import { useModuleAccessStore } from '@/src/stores/moduleAccessStore';
import { SEQUENCE_LESSONS } from '@/src/config/alphabet/lettersSequence';
import { QualityButton } from '@/src/entities/enums/QualityScore.enum';

// 题型类型（预留给后续扩展）
export type QuestionType =
  | 'sound-to-letter'
  | 'letter-to-sound'
  | 'syllable'
  | 'reverse-syllable'
  | 'missing-letter'
  | 'final-consonant'
  | 'tone-choice'
  | 'class-choice'
  | 'keyboard-key'
  | 'letter-name';

export type Phase =
  | 'yesterday-review'
  | 'yesterday-remedy'
  | 'today-learning'
  | 'today-mini-review'
  | 'today-final-review'
  | 'today-remedy'
  | 'finished';

type QuestionTypeWeightMap = Record<QuestionType, number>;

const DEFAULT_QUESTION_TYPE_WEIGHTS: QuestionTypeWeightMap = {
  'sound-to-letter': 1,
  'letter-to-sound': 1,
  'syllable': 1,
  'reverse-syllable': 1,
  'missing-letter': 1,
  'final-consonant': 1,
  'tone-choice': 1,
  'class-choice': 1,
  'keyboard-key': 1,
  'letter-name': 1,
};

function pickWeightedQuestionType(
  weights: QuestionTypeWeightMap,
): QuestionType {
  const entries = Object.entries(weights) as [QuestionType, number][];
  const total = entries.reduce((sum, [, w]) => sum + w, 0);
  const r = Math.random() * total;

  let acc = 0;
  for (const [type, w] of entries) {
    acc += w;
    if (r <= acc) return type;
  }
  return entries[0][0];
}

interface WrongItem {
  letterId: string;
  questionType: QuestionType;
}

const MAX_ROUNDS = 3;
// 假设 final review 阶段为"每个字母 3 道题"（听音/看字母/拼读）
// 如果你之后改成 4/5 题，只要改这个常量即可
const QUESTIONS_PER_LETTER_IN_FINAL = 3;

// -------------------------
// Hook 主体（课程引擎）
// -------------------------
export function useAlphabetLearningEngine(lessonId?: string) {
  const { currentUser } = useUserStore();
  const userId = currentUser?.userId || 'mock-user';

  const {
    queue: reviewQueueYesterday,
    currentItem,
    currentIndex,
    initializeSession,
    submitResult,
    next,
    isLoading,
  } = useAlphabetStore();

  const { markAlphabetLessonCompleted } = useModuleAccessStore();

  // -------------------------
  // 三轮机制状态
  // -------------------------
  const [currentRound, setCurrentRound] = useState<number>(1);

  // 课程阶段状态机
  const [phase, setPhase] = useState<Phase>('yesterday-review');
  const [initialized, setInitialized] = useState(false);

  // 今日课程字母（来自 lessonId 对应的配置）
  const [todayList, setTodayList] = useState<string[]>([]);
  const [todayLearnedCount, setTodayLearnedCount] = useState<number>(0);

  // 错题池（本轮）
  const [wrongYesterday, setWrongYesterday] = useState<WrongItem[]>([]);
  const [wrongTodayMini, setWrongTodayMini] = useState<WrongItem[]>([]);
  const [wrongTodayFinal, setWrongTodayFinal] = useState<WrongItem[]>([]);

  // 题型权重（自适应出题）
  const [questionTypeWeights, setQuestionTypeWeights] =
    useState<QuestionTypeWeightMap>(DEFAULT_QUESTION_TYPE_WEIGHTS);

  // UI 相关（预留：目前只在 resetLearningState 中用到）
  const [hasViewedIntro, setHasViewedIntro] = useState(false);
  const [currentQuestionType, setCurrentQuestionType] = useState<QuestionType | null>(null);

  // =========================
  // 初始化课程（只在首次进入本 lesson 时执行）
  // =========================
  useEffect(() => {
    if (!lessonId) return;

    const letters = SEQUENCE_LESSONS[lessonId as keyof typeof SEQUENCE_LESSONS];
    if (letters) {
      setTodayList(letters);
    }

    // 初始化后端今日记忆队列（字母复习 + 新字母）
    initializeSession(userId, 50).then(() => {
      setPhase('yesterday-review'); // 第 1 轮从昨日复习开始
      setInitialized(true);
    });
  }, [lessonId, userId, initializeSession]);

  // =========================
  // 错题池加入工具函数
  // =========================
  const pushWrong = useCallback(
    (
      setter: (data: WrongItem[]) => void,
      pool: WrongItem[],
      letterId: string,
      questionType: QuestionType,
    ) => {
      const exists = pool.some(
        (w) => w.letterId === letterId && w.questionType === questionType,
      );
      if (!exists) {
        setter([...pool, { letterId, questionType }]);
      }
    },
    [],
  );

  // =========================
  // 用户作答回调（由 Review 组件调用）
  // =========================
  const onAnswer = useCallback(
    (isCorrect: boolean, questionType: QuestionType) => {
      if (!currentItem) return;
      const letterId = currentItem.alphabetId;

      if (!isCorrect) {
        if (phase === 'yesterday-review' || phase === 'yesterday-remedy') {
          pushWrong(setWrongYesterday, wrongYesterday, letterId, questionType);
        } else if (phase === 'today-mini-review') {
          pushWrong(setWrongTodayMini, wrongTodayMini, letterId, questionType);
        } else if (phase === 'today-final-review') {
          pushWrong(setWrongTodayFinal, wrongTodayFinal, letterId, questionType);
        }
      }
      // 更新题型权重（错题权重提高，正确轻微衰减）
      setQuestionTypeWeights((prev) => {
        const next: QuestionTypeWeightMap = { ...prev };
        const t = questionType;
        if (isCorrect) {
          next[t] = Math.max(0.5, next[t] * 0.9);
        } else {
          next[t] = next[t] + 2;
        }
        return next;
      });
      // 正确 / 错误目前都只影响统计和权重
    },
    [
      currentItem,
      phase,
      wrongYesterday,
      wrongTodayMini,
      wrongTodayFinal,
      pushWrong,
    ],
  );

  // =========================
  // 计算本轮最终正确率（只看今天 final + mini 的错题）
  // =========================
  const computeFinalCorrectRate = useCallback(() => {
    if (todayList.length === 0) return 1;

    const totalQuestions = todayList.length * QUESTIONS_PER_LETTER_IN_FINAL;
    const wrongTotal = wrongTodayMini.length + wrongTodayFinal.length;

    const correct = Math.max(totalQuestions - wrongTotal, 0);
    return correct / totalQuestions;
  }, [todayList, wrongTodayMini.length, wrongTodayFinal.length]);

  // =========================
  // 按错题次数给每个字母打一个 Quality（FORGET/FUZZY/KNOW）
  // =========================
  const classifyLetterQuality = useCallback(
    (letterId: string): QualityButton => {
      const wrongCount =
        wrongYesterday.filter((w) => w.letterId === letterId).length +
        wrongTodayMini.filter((w) => w.letterId === letterId).length +
        wrongTodayFinal.filter((w) => w.letterId === letterId).length;

      if (wrongCount >= 3) return QualityButton.FORGET;
      if (wrongCount >= 1) return QualityButton.FUZZY;
      return QualityButton.KNOW;
    },
    [wrongYesterday, wrongTodayMini, wrongTodayFinal],
  );

  // =========================
  // 提交本轮结果到后端（每轮结束调用一次）
  // =========================
  const submitRoundResults = useCallback(async () => {
    // 这里按 todayList 中的字母顺序提交
    for (const char of todayList) {
      const letter = reviewQueueYesterday.find((x) => x.thaiChar === char);
      if (!letter) continue;

      const quality = classifyLetterQuality(letter.alphabetId);
      await submitResult(userId, quality);
    }
  }, [todayList, reviewQueueYesterday, classifyLetterQuality, submitResult, userId]);

  // =========================
  // 重置本轮前端状态（不影响后端 memoryState）
  // =========================
  const resetRoundState = useCallback(() => {
    // 清空本轮错题池
    setWrongYesterday([]);
    setWrongTodayMini([]);
    setWrongTodayFinal([]);

    // 清空本轮学习计数
    setTodayLearnedCount(0);

    // 不重置后端 queue，只是让阶段从"今日学习"开始
    setPhase('today-learning');
  }, []);

  // =========================
  // 重置 UI 相关状态（optional）
  // =========================
  const resetLearningState = useCallback(() => {
    setHasViewedIntro(false);
    setCurrentQuestionType(null);
    // 如果之后 AlphabetLearningView / ReviewView 有更多本地 UI 状态，
    // 可以在这里统一重置
  }, []);

  // =========================
  // 每当进入新题目 / 新阶段，为当前题目选择题型
  // =========================
  useEffect(() => {
    setCurrentQuestionType(
      pickWeightedQuestionType(questionTypeWeights),
    );
  }, [phase, currentItem?.alphabetId, currentRound, questionTypeWeights]);

  // =========================
  // 阶段推进（状态机核心）
  // =========================
  const nextStep = useCallback(() => {
    if (isLoading) return;

    // 1. 昨日复习
    if (phase === 'yesterday-review') {
      if (currentIndex < reviewQueueYesterday.length - 1) {
        next();
        return;
      }
      setPhase('yesterday-remedy');
      return;
    }

    // 2. 昨日错题补救
    if (phase === 'yesterday-remedy') {
      if (wrongYesterday.length > 0) {
        // 这里你可以之后做"从错题池中出题"的逻辑，目前只做统计
        return;
      }
      setPhase('today-learning');
      return;
    }

    // 3. 今日学习（每学 3 个字母 → minireview）
    if (phase === 'today-learning') {
      const nextLearnedCount = todayLearnedCount + 1;
      setTodayLearnedCount(nextLearnedCount);

      // 学完 3 个 → mini review
      if (nextLearnedCount % 3 === 0 && nextLearnedCount < todayList.length) {
        setPhase('today-mini-review');
        return;
      }

      // 今日全部学完 → final review
      if (nextLearnedCount >= todayList.length) {
        setPhase('today-final-review');
        return;
      }

      next();
      return;
    }

    // 4. mini review
    if (phase === 'today-mini-review') {
      if (wrongTodayMini.length > 0) {
        // 之后可以做"错题优先"的逻辑，目前只统计
        return;
      }
      setPhase('today-learning');
      next();
      return;
    }

    // 5. final review
    if (phase === 'today-final-review') {
      if (wrongTodayFinal.length > 0) {
        // 同样可以做错题优先，目前只统计
        return;
      }
      // 进入今日补救阶段
      setPhase('today-remedy');
      return;
    }

    // 6. 今日补救 + 三轮判定
    if (phase === 'today-remedy') {
      // 若仍有错题 → 理论上应继续出题，目前只是停留在该阶段
      if (
        wrongTodayMini.length > 0 ||
        wrongTodayFinal.length > 0
      ) {
        return;
      }

      // 所有错题池已清空 → 本轮结束，计算正确率
      const finalCorrectRate = computeFinalCorrectRate();

      if (finalCorrectRate >= 0.9) {
        // ✅ 一轮达标
        if (currentRound < MAX_ROUNDS) {
          // 进入下一轮：先提交本轮成绩，再重置前端轮次状态
          (async () => {
            await submitRoundResults();
            setCurrentRound((prev) => prev + 1);
            resetRoundState();
            resetLearningState();
          })();
          return;
        }

        // 第三轮也完成 → 提交最后一轮并结束课程
        (async () => {
          await submitRoundResults();

          // 标记当前字母课程已完成（仅适用于字母模块）
          if (lessonId) {
            try {
              markAlphabetLessonCompleted(lessonId);
            } catch (e) {
              console.error('❌ 标记字母课程完成失败:', e);
            }
          }

          setPhase('finished');
        })();
        return;
      } else {
        // 正确率不足 90%：
        // 你可以选择：
        // 1）仍然提交本轮结果，但不给算一轮（当前逻辑）；
        // 2）或直接让用户强制再做一轮错题（此处预留扩展）
        return;
      }
    }
  }, [
    phase,
    isLoading,
    currentIndex,
    reviewQueueYesterday,
    todayLearnedCount,
    todayList,
    wrongYesterday,
    wrongTodayMini,
    wrongTodayFinal,
    currentRound,
    computeFinalCorrectRate,
    submitRoundResults,
    resetRoundState,
    resetLearningState,
    next,
  ]);

  // =========================
  // 返回状态数据（不包含 JSX）
  // =========================
  return {
    phase,
    currentRound,
    initialized,
    currentItem,
    currentQuestionType,
    onAnswer,
    next: nextStep,
  };
}

