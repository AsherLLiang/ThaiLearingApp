// 前端权威队列构建器（首发冻结版）
// 仅按课程内三新一复 + mini-review + final-review 生成 deterministic 队列

import type { AlphabetLearningState, AlphabetQueueItem, AlphabetQueueSource } from '@/src/stores/alphabetStore';

export interface BuildQueueOptions {
  round: number;
  previousRoundLetters?: AlphabetLearningState[];
}

const MINI_REVIEW_CHUNK = 3;

export function buildAlphabetQueue(
  letters: AlphabetLearningState[],
  options: BuildQueueOptions
): AlphabetQueueItem[] {
  const { round, previousRoundLetters = [] } = options;
  const queue: AlphabetQueueItem[] = [];

  const pushWithSource = (item: AlphabetLearningState, source: AlphabetQueueSource) => {
    queue.push({
      ...item,
      source,
      round,
    });
  };

  // Phase 1: 上一轮复习
  previousRoundLetters.forEach((letter) => pushWithSource(letter, 'previous-round-review'));

  // Phase 2: 今日学习 + mini-review (三新一复)
  for (let i = 0; i < letters.length; i += 1) {
    const letter = letters[i];
    pushWithSource(letter, 'new');

    const hasCompletedChunk = (i + 1) % MINI_REVIEW_CHUNK === 0;
    if (hasCompletedChunk) {
      const chunkStart = i + 1 - MINI_REVIEW_CHUNK;
      const chunk = letters.slice(chunkStart, i + 1);
      chunk.forEach((l) => pushWithSource(l, 'mini-review'));
    }
  }

  // Phase 3: 总复习（本轮全部字母）
  letters.forEach((letter) => pushWithSource(letter, 'final-review'));

  return queue;
}
