// src/utils/alphabetQuestionTypeAssigner.ts

/**
 * Alphabet Question Type Assigner
 *
 * 题型分配器 - 根据学习阶段(Phase)分配合适的题型
 * 按照 alphabet-module-spec.md 第6章要求实现
 *
 * 核心策略:
 * - 三新一复阶段: 使用轻量题型(听音选字、看字选音)
 * - Final Review 阶段: 使用整合题型(辅音类别、首音、尾音、声调、拼读)
 */

import { AlphabetGameType } from '@/src/entities/types/alphabetGameTypes';

/**
 * 三新一复阶段使用的轻量题型
 *
 * 这些题型专注于基础的字母识别,不涉及复杂的语音学规则
 */
export const LIGHT_GAME_TYPES: AlphabetGameType[] = [
  AlphabetGameType.SOUND_TO_LETTER,
  AlphabetGameType.LETTER_TO_SOUND,
];

/**
 * Final Review 阶段使用的整合题型
 *
 * 这些题型要求学生综合运用辅音类别、发音规则等知识
 */
export const ADVANCED_GAME_TYPES: AlphabetGameType[] = [
  AlphabetGameType.CONSONANT_CLASS,
  AlphabetGameType.INITIAL_SOUND,
  AlphabetGameType.FINAL_SOUND,
  AlphabetGameType.TONE_CALCULATION,
  AlphabetGameType.PHONICS_MATH,
];

/**
 * 学习阶段类型
 */
export type LearningPhase = 'THREE_NEW_ONE_REVIEW' | 'FINAL_REVIEW';

/**
 * 根据学习阶段分配题型
 *
 * @param phase - 学习阶段 ('THREE_NEW_ONE_REVIEW' 或 'FINAL_REVIEW')
 * @returns 随机选择的题型
 *
 * @example
 * // 三新一复阶段
 * const gameType = assignGameTypeForPhase('THREE_NEW_ONE_REVIEW');
 * // 返回 SOUND_TO_LETTER 或 LETTER_TO_SOUND
 *
 * @example
 * // Final Review 阶段
 * const gameType = assignGameTypeForPhase('FINAL_REVIEW');
 * // 返回 CONSONANT_CLASS, INITIAL_SOUND, FINAL_SOUND, TONE_CALCULATION, 或 PHONICS_MATH
 */
export function assignGameTypeForPhase(
  phase: LearningPhase
): AlphabetGameType {
  const pool =
    phase === 'THREE_NEW_ONE_REVIEW' ? LIGHT_GAME_TYPES : ADVANCED_GAME_TYPES;

  // 从题型池中随机选择
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * 根据学习阶段和权重分配题型
 *
 * @param phase - 学习阶段
 * @param weights - 可选的题型权重映射,用于微调题型分布
 * @returns 根据权重随机选择的题型
 *
 * @example
 * // 指定权重: 70% SOUND_TO_LETTER, 30% LETTER_TO_SOUND
 * const gameType = assignGameTypeWithWeights('THREE_NEW_ONE_REVIEW', {
 *   [AlphabetGameType.SOUND_TO_LETTER]: 0.7,
 *   [AlphabetGameType.LETTER_TO_SOUND]: 0.3,
 * });
 */
export function assignGameTypeWithWeights(
  phase: LearningPhase,
  weights?: Partial<Record<AlphabetGameType, number>>
): AlphabetGameType {
  // 如果没有提供权重,使用默认均匀分布
  if (!weights || Object.keys(weights).length === 0) {
    return assignGameTypeForPhase(phase);
  }

  const pool =
    phase === 'THREE_NEW_ONE_REVIEW' ? LIGHT_GAME_TYPES : ADVANCED_GAME_TYPES;

  // 只保留属于当前阶段题型池的权重
  const filteredWeights: Record<AlphabetGameType, number> = {} as any;
  let totalWeight = 0;

  for (const gameType of pool) {
    const weight = weights[gameType] ?? 1; // 默认权重为 1
    filteredWeights[gameType] = weight;
    totalWeight += weight;
  }

  // 归一化权重并根据随机数选择
  const random = Math.random() * totalWeight;
  let cumulativeWeight = 0;

  for (const gameType of pool) {
    cumulativeWeight += filteredWeights[gameType];
    if (random <= cumulativeWeight) {
      return gameType;
    }
  }

  // 兜底: 返回池中第一个题型
  return pool[0];
}
