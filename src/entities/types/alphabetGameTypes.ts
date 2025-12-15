// src/entities/enum/alphabetGameTypes.ts

/**
 * Alphabet Game Type Enum
 *
 * 定义字母模块的统一题型协议
 * 按照 alphabet-module-spec.md 第6章和 PROJECT_OVERVIEW_SPEC.md 4.3节 Phase 2 要求
 *
 * 题型分为两类:
 * - 基础题型(LIGHT_GAME_TYPES): 用于三新一复(THREE_NEW_ONE_REVIEW)阶段
 * - 进阶题型(ADVANCED_GAME_TYPES): 用于 Final Review 阶段
 */
export enum AlphabetGameType {
  // ===== 基础题型 (用于三新一复) =====

  /** 听音选字 - 播放字母发音,用户从选项中选择正确的泰文字母 */
  SOUND_TO_LETTER = 'SOUND_TO_LETTER',

  /** 看字选音 - 显示泰文字母,用户从选项中选择正确的发音 */
  LETTER_TO_SOUND = 'LETTER_TO_SOUND',

  // ===== 进阶题型 (用于 Final Review) =====

  /** 辅音类别判断 - 判断字母属于高/中/低辅音 */
  CONSONANT_CLASS = 'CONSONANT_CLASS',

  /** 首辅音判断 - 判断字母的首辅音发音 */
  INITIAL_SOUND = 'INITIAL_SOUND',

  /** 尾辅音判断 - 判断字母作为尾音时的发音 */
  FINAL_SOUND = 'FINAL_SOUND',

  /** 声调计算 - 根据辅音类别+元音+声调符号计算最终声调 (占位实现) */
  TONE_CALCULATION = 'TONE_CALCULATION',

  /** 拼读数学 - 辅音+元音的拼读组合练习 (占位实现) */
  PHONICS_MATH = 'PHONICS_MATH',
}

/**
 * 题型显示名称映射
 */
export const ALPHABET_GAME_TYPE_LABELS: Record<AlphabetGameType, string> = {
  [AlphabetGameType.SOUND_TO_LETTER]: '听音选字',
  [AlphabetGameType.LETTER_TO_SOUND]: '看字选音',
  [AlphabetGameType.CONSONANT_CLASS]: '辅音类别',
  [AlphabetGameType.INITIAL_SOUND]: '首音判断',
  [AlphabetGameType.FINAL_SOUND]: '尾音判断',
  [AlphabetGameType.TONE_CALCULATION]: '声调计算',
  [AlphabetGameType.PHONICS_MATH]: '拼读数学',
};

/**
 * 题型难度等级 (1-5)
 */
export const ALPHABET_GAME_TYPE_DIFFICULTY: Record<AlphabetGameType, number> = {
  [AlphabetGameType.SOUND_TO_LETTER]: 1,
  [AlphabetGameType.LETTER_TO_SOUND]: 1,
  [AlphabetGameType.CONSONANT_CLASS]: 2,
  [AlphabetGameType.INITIAL_SOUND]: 2,
  [AlphabetGameType.FINAL_SOUND]: 3,
  [AlphabetGameType.TONE_CALCULATION]: 4,
  [AlphabetGameType.PHONICS_MATH]: 4,
};
