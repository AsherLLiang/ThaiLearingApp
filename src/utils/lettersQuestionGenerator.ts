// src/utils/lettersQuestionGenerator.ts

/**
 * Letters Question Generator
 *
 * 字母题目生成器 - Phase 2 重构版本
 * 按照 alphabet-module-spec.md 第6章和统一 Question Engine 协议实现
 *
 * 变更说明:
 * - 移除了 LETTER_NAME_TO_THAI 和 THAI_TO_LETTER_NAME 题型
 * - 使用新的 AlphabetGameType 枚举
 * - 函数签名改为 generateQuestion(queueItem, allLetters)
 * - 添加 TONE_CALCULATION 和 PHONICS_MATH 占位实现
 */

import type { Letter } from '@/src/entities/types/letter.types';
import type {
  AlphabetQueueItem,
  AlphabetQuestion,
} from '@/src/entities/types/alphabet.types';
import { AlphabetGameType } from '@/src/entities/types/alphabetGameTypes';
import { generateLetterDistractors } from './lettersDistractorEngine';
import { getLetterAudioUrl } from './alphabet/audioHelper';

/**
 * 生成字母题目
 *
 * @param queueItem - 队列项,包含目标字母和题型信息
 * @param allLetters - 所有字母池,用于生成干扰项
 * @returns 生成的题目对象
 */
export function generateQuestion(
  queueItem: AlphabetQueueItem,
  allLetters: Letter[]
): AlphabetQuestion {
  const { letter, gameType } = queueItem;

  // 🐛 P0-1 FIX: 生成干扰项 (3个) + 防御性检查
  const distractorLetters =
    allLetters && allLetters.length > 1
      ? generateLetterDistractors({ pool: allLetters, correct: letter, count: 3 })
      : [];

  // 🐛 P0-1 FIX: 确保有足够的干扰项
  if (distractorLetters.length < 3) {
    console.warn('⚠️ 干扰项不足！', {
      expected: 3,
      actual: distractorLetters.length,
      poolSize: allLetters?.length || 0,
      letterId: letter._id,
      gameType
    });

    // 如果池子太小，用正确字母复制填充（临时方案）
    while (distractorLetters.length < 3) {
      distractorLetters.push({ ...letter, _id: `dummy-${distractorLetters.length}` });
    }
  }

  // 根据题型生成题目
  switch (gameType) {
    case AlphabetGameType.SOUND_TO_LETTER:
      return generateSoundToLetterQuestion(letter, distractorLetters);

    case AlphabetGameType.LETTER_TO_SOUND:
      return generateLetterToSoundQuestion(letter, distractorLetters);

    case AlphabetGameType.CONSONANT_CLASS:
      return generateConsonantClassQuestion(letter);

    case AlphabetGameType.INITIAL_SOUND:
      return generateInitialSoundQuestion(letter, distractorLetters);

    case AlphabetGameType.FINAL_SOUND:
      return generateFinalSoundQuestion(letter, distractorLetters);

    case AlphabetGameType.TONE_CALCULATION:
      return generateToneCalculationQuestion(letter);

    case AlphabetGameType.PHONICS_MATH:
      return generatePhonicsMathQuestion(letter);

    default:
      // STRICT MODE: Do not fallback to simple questions for unknown types.
      // If we get here, it means we requested a type that isn't handled.
      console.error('❌ Unknown Game Type requested:', gameType);
      // We must return *something* to avoid crash, but let's log loudly.
      // Ideally this should trigger a "Content Error" state in UI.
      // For now, return a placeholder valid object but log error.
      // BUT for strict requirement: "不允许 fallback 为简单题". 
      // This implies if we asked for Unknown/Complex, we shouldn't get Simple.
      // But if the code asked for it, it's a bug in the engine.
      // The Engine asked for `CONSONANT_CLASS`, we are in case `CONSONANT_CLASS`.

      // If the case is handled, we are good.
      // The only risk is if `generateConsonantClassQuestion` fails?
      // It currently always returns a question (options are fixed).

      // So this default block is only for truly unknown enum values.
      throw new Error(`[Generator] Unsupported Game Type: ${gameType}`);
  }
}

// ===== 各题型的具体实现 =====

/**
 * 听音选字 - 播放字母发音,选择正确的字母
 */
function generateSoundToLetterQuestion(
  letter: Letter,
  distractors: Letter[]
): AlphabetQuestion {
  const options = shuffle([letter, ...distractors]);

  return {
    id: `sound-to-letter-${letter._id}-${Date.now()}`,
    gameType: AlphabetGameType.SOUND_TO_LETTER,
    targetLetter: letter,
    options,
    correctAnswer: letter.thaiChar,
    audioUrl: getLetterAudioUrl(letter, 'letter'),
  };
}

/**
 * 看字选音 - 显示字母,选择正确的发音
 */
function generateLetterToSoundQuestion(
  letter: Letter,
  distractors: Letter[]
): AlphabetQuestion {
  const options = shuffle([letter, ...distractors]);

  return {
    id: `letter-to-sound-${letter._id}-${Date.now()}`,
    gameType: AlphabetGameType.LETTER_TO_SOUND,
    targetLetter: letter,
    options,
    correctAnswer: letter.initialSound || letter.fullSoundUrl || letter._id,
    audioUrl: getLetterAudioUrl(letter, 'letter'),
  };
}

/**
 * 辅音类别判断 - 判断字母属于高/中/低辅音
 */
function generateConsonantClassQuestion(letter: Letter): AlphabetQuestion {
  // 固定的三个选项: 高辅音、中辅音、低辅音
  const classOptions: Letter[] = [
    { ...letter, thaiChar: 'components.miniReview.highClass', class: 'high' } as Letter,
    { ...letter, thaiChar: 'components.miniReview.midClass', class: 'mid' } as Letter,
    { ...letter, thaiChar: 'components.miniReview.lowClass', class: 'low' } as Letter,
  ];

  return {
    id: `consonant-class-${letter._id}-${Date.now()}`,
    gameType: AlphabetGameType.CONSONANT_CLASS,
    targetLetter: letter,
    options: classOptions,
    correctAnswer: mapClassToLabel(letter.class || 'low'),
    audioUrl: getLetterAudioUrl(letter, 'letter'),
  };
}

/**
 * 首音判断 - 判断字母的首辅音发音
 */
function generateInitialSoundQuestion(
  letter: Letter,
  distractors: Letter[]
): AlphabetQuestion {
  const options = shuffle([letter, ...distractors]);

  return {
    id: `initial-sound-${letter._id}-${Date.now()}`,
    gameType: AlphabetGameType.INITIAL_SOUND,
    targetLetter: letter,
    options,
    correctAnswer: letter.initialSound,
    audioUrl: getLetterAudioUrl(letter, 'letter'),
  };
}

/**
 * 尾音判断 - 判断字母作为尾音时的发音
 */
function generateFinalSoundQuestion(
  letter: Letter,
  distractors: Letter[]
): AlphabetQuestion {
  const options = shuffle([letter, ...distractors]);

  return {
    id: `final-sound-${letter._id}-${Date.now()}`,
    gameType: AlphabetGameType.FINAL_SOUND,
    targetLetter: letter,
    options,
    correctAnswer: letter.finalSound || letter.initialSound,
    audioUrl: getLetterAudioUrl(letter, 'letter'),
  };
}

/**
 * 声调计算 - 占位实现
 *
 * TODO: 在后续迭代中实现完整的声调计算逻辑
 * 需要考虑: 辅音类别 + 元音长短 + 声调符号 → 最终声调
 */
function generateToneCalculationQuestion(letter: Letter): AlphabetQuestion {
  // 占位实现: 返回一个简单的固定题目
  const placeholderOptions: Letter[] = [
    { ...letter, thaiChar: '第1声(平声)' } as Letter,
    { ...letter, thaiChar: '第2声(低声)' } as Letter,
    { ...letter, thaiChar: '第3声(降声)' } as Letter,
  ];

  return {
    id: `tone-calculation-${letter._id}-${Date.now()}`,
    gameType: AlphabetGameType.TONE_CALCULATION,
    targetLetter: letter,
    options: placeholderOptions,
    correctAnswer: '第1声(平声)', // 占位答案
    audioUrl: getLetterAudioUrl(letter, 'letter'),
  };
}

/**
 * 拼读数学 - 占位实现
 *
 * TODO: 在后续迭代中实现完整的拼读逻辑
 * 需要考虑: 辅音 + 元音的组合发音
 */
function generatePhonicsMathQuestion(letter: Letter): AlphabetQuestion {
  // 占位实现: 返回一个简单的拼读题
  const syllable = `${letter.thaiChar}า`; // 辅音 + 长元音 า
  const placeholderOptions: Letter[] = [
    { ...letter, thaiChar: syllable } as Letter,
    { ...letter, thaiChar: `${letter.thaiChar}ิ` } as Letter,
    { ...letter, thaiChar: `${letter.thaiChar}ุ` } as Letter,
  ];

  return {
    id: `phonics-math-${letter._id}-${Date.now()}`,
    gameType: AlphabetGameType.PHONICS_MATH,
    targetLetter: letter,
    options: placeholderOptions,
    correctAnswer: syllable, // 占位答案
    audioUrl: getLetterAudioUrl(letter, 'syllable'),
  };
}

// ===== 辅助函数 =====

/**
 * 随机打乱数组
 */
function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

/**
 * 将辅音类别映射为中文标签
 */
function mapClassToLabel(cls: string): string {
  if (cls === 'mid') return 'components.miniReview.midClass';
  if (cls === 'high') return 'components.miniReview.highClass';
  return 'components.miniReview.lowClass';
}

// ===== 向后兼容的导出 =====

/**
 * @deprecated 请使用新的 generateQuestion 函数
 *
 * 为了向后兼容,保留旧的函数签名
 * 会在后续版本中移除
 */
export function generateAlphabetQuestion(
  letter: Letter,
  pool: Letter[],
  preferredType?: any // 使用 any 避免导入旧的 QuestionType
): any {
  // 将旧的调用转换为新的格式
  const queueItem: AlphabetQueueItem = {
    letterId: letter._id,
    gameType: AlphabetGameType.SOUND_TO_LETTER, // 默认使用听音选字
    letter,
  };

  return generateQuestion(queueItem, pool);
}
