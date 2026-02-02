// 前端权威队列构建器（首发冻结版）
// 仅按课程内三新一复 + mini-review + final-review 生成 deterministic 队列

import type {
  AlphabetLearningMode,
  AlphabetLearningState,
  AlphabetQueueItem,
  AlphabetQueueSource,
} from '@/src/stores/alphabetStore';

interface BuildAlphabetQueueParams {
  lessonLetters: AlphabetLearningState[];
  round: number;
  mode: AlphabetLearningMode;
  previousRoundLetters?: AlphabetLearningState[];
}

const MINI_REVIEW_CHUNK = 3;

export function buildAlphabetQueue(params: BuildAlphabetQueueParams): AlphabetQueueItem[] {
  const { lessonLetters, round, mode, previousRoundLetters = [] } = params;
  const queue: AlphabetQueueItem[] = [];

  const pushWithSource = (item: AlphabetLearningState, source: AlphabetQueueSource) => {
    queue.push({
      ...item,
      source,
      round,
    });
  };

  const previousLetters = mode === 'learning' ? previousRoundLetters : [];

  // Phase 1: 上一轮复习
  // 🔥 TODO-03: 统一使用 'previous-review' 而不是 'previous-round-review'
  previousLetters.forEach((letter) => pushWithSource(letter, 'previous-review'));

  // Phase 2: 今日学习 + mini-review (三新一复)
  for (let i = 0; i < lessonLetters.length; i += 1) {
    const letter = lessonLetters[i];
    // 🔥 TODO-03: 统一使用 'new-learning' 而不是 'new'
    pushWithSource(letter, 'new-learning');

    const hasCompletedChunk = (i + 1) % MINI_REVIEW_CHUNK === 0;
    if (hasCompletedChunk) {
      const chunkStart = i + 1 - MINI_REVIEW_CHUNK;
      const chunk = lessonLetters.slice(chunkStart, i + 1);
      chunk.forEach((l) => pushWithSource(l, 'mini-review'));
    }
  }

  // Phase 3: 总复习（本轮全部字母）
  lessonLetters.forEach((letter) => pushWithSource(letter, 'final-review'));

  return queue;
}
