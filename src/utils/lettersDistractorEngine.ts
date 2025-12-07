// src/utils/alphabet/distractorEngine.ts

import type { Letter } from '@/src/entities/types/letter.types';

export interface DistractorOptions {
  count: number;      // 干扰项数量
  pool: Letter[];     // 可用字母池（从 store 或父组件传入）
  correct: Letter;    // 正确字母
}

/**
 * 按优先级生成干扰项：
 * 1. 与正确字母 class 相同（高/中/低辅音）
 * 2. 与正确字母 initialSound 相同
 * 3. 其余字母
 */
export function generateLetterDistractors(opts: DistractorOptions): Letter[] {
  const { pool, correct, count } = opts;

  if (!pool || pool.length === 0) return [];

  const sameClass = pool.filter(
    (l) => l.class === correct.class && l._id !== correct._id,
  );

  const sameSound = pool.filter(
    (l) => l.initialSound === correct.initialSound && l._id !== correct._id,
  );

  const others = pool.filter((l) => l._id !== correct._id);

  const merged: Letter[] = [...sameClass, ...sameSound, ...others];

  // 去重
  const uniqueMap = new Map<string, Letter>();
  merged.forEach((l) => uniqueMap.set(l._id, l));

  const unique = Array.from(uniqueMap.values());

  return unique.slice(0, count);
}
