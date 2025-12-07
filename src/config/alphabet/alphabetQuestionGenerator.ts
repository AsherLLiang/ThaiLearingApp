// src/components/alphabet/alphabetQuestionGenerator.ts

import { AlphabetLearningState } from '@/src/stores/alphabetStore';
import {
  AlphabetQuestionType,
  AlphabetReviewQuestion,
  AlphabetQuestionOption,
} from '@/src/config/alphabet/alphabetQuestionTypes';

// 可选：让外层控制题型比例
export interface QuestionGenerationOptions {
  preferredType?: AlphabetQuestionType;
  // 题目 ID 前缀，方便调试 / 日志
  idPrefix?: string;
  // 选项数量（3~6 比较合理）
  optionCount?: number;
}

export interface QuestionGenerationContext {
  current: AlphabetLearningState;          // 当前要复习的字母
  pool: AlphabetLearningState[];          // 今日 session 的所有字母
  options?: QuestionGenerationOptions;
}

// 工具函数：从数组中取随机若干个不同元素
function pickRandomDistinct<T>(items: T[], count: number, exclude?: T): T[] {
  const pool = exclude ? items.filter((i) => i !== exclude) : [...items];
  const result: T[] = [];
  const max = Math.min(count, pool.length);

  while (result.length < max && pool.length > 0) {
    const index = Math.floor(Math.random() * pool.length);
    const [picked] = pool.splice(index, 1);
    result.push(picked);
  }

  return result;
}

// 决定题型：如果外层不传，就做一个简单轮盘（不做复杂 stage 逻辑）
function decideQuestionType(
  preferredType?: AlphabetQuestionType,
): AlphabetQuestionType {
  if (preferredType) return preferredType;

  const r = Math.random();
  if (r < 0.33) return 'soundToLetter';
  if (r < 0.66) return 'letterToSound';
  return 'reading';
}

// 构造选项：字母→选项对象
function buildLetterOptions(
  correct: AlphabetLearningState,
  distractors: AlphabetLearningState[],
): AlphabetQuestionOption[] {
  const all = [correct, ...distractors];
  return all.map((letter, idx) => ({
    id: letter._id ?? letter.thaiChar ?? String(idx),
    label: letter.thaiChar,
  }));
}

// 构造选项：发音→选项对象（使用 syllableSoundName / initialSound / pronunciation）
function buildSoundOptions(
  correct: AlphabetLearningState,
  distractors: AlphabetLearningState[],
): AlphabetQuestionOption[] {
  const getSoundLabel = (item: AlphabetLearningState): string => {
    return (
      item.syllableSoundName ||
      item.initialSound ||
      item.pronunciation ||
      item.thaiChar
    );
  };

  const all = [correct, ...distractors];
  return all.map((item, idx) => ({
    id: item._id ?? `${getSoundLabel(item)}-${idx}`,
    label: getSoundLabel(item),
  }));
}

// 轻量解释文案（不实现完整规则，只做友好提示）
function buildPhonicsExplanation(
  questionType: AlphabetQuestionType,
  current: AlphabetLearningState,
): string | undefined {
  const baseChar = current.thaiChar;
  const example = current.example;

  if (questionType === 'soundToLetter') {
    return example
      ? `你听到的发音来自字母「${baseChar}」及其在单词「${example}」中的读法。`
      : `你听到的发音来自字母「${baseChar}」的读音。`;
  }

  if (questionType === 'letterToSound') {
    return `注意字母「${baseChar}」的起始音（initial sound），在不同元音组合中会保持相同的辅音音值。`;
  }

  if (questionType === 'reading') {
    return example
      ? `尝试将单词拆成「辅音 + 元音」再合成发音，例如：${example}。`
      : `尝试在脑中先读出辅音，再加上元音，最后合成一个整体音节。`;
  }

  return undefined;
}

// 👇 核心导出函数：根据当前字母 + 今日字母池生成一道题
export function generateAlphabetQuestion(
  ctx: QuestionGenerationContext,
): AlphabetReviewQuestion {
  const { current, pool, options } = ctx;
  const {
    preferredType,
    idPrefix = 'qa',
    optionCount = 4,
  } = options || {};

  const type = decideQuestionType(preferredType);

  // 为了避免拿不到字段时崩掉，做一些兜底
  const mainChar = current.thaiChar ?? '';
  const example = current.example ?? '';
  const audioUrl =
    current.syllableSoundUrl ||
    current.letterPronunciationUrl ||
    current.audioPath;

  const distractorCount = Math.max(optionCount - 1, 1);
  const otherLetters = pool.filter((l) => l !== current);

  let question: AlphabetReviewQuestion;

  if (type === 'soundToLetter') {
    // 听音 → 选字母
    const distractors = pickRandomDistinct(otherLetters, distractorCount);
    const optionsArr = buildLetterOptions(current, distractors);

    question = {
      id: `${idPrefix}-sound-${current._id ?? mainChar}`,
      type: 'soundToLetter',
      prompt: '听发音，选择对应的泰文字母。',
      audioUrl: audioUrl,
      options: optionsArr,
      correctOptionId: optionsArr[0].id, // 第一个是正确项（buildLetterOptions 保证）
      explanation: buildPhonicsExplanation('soundToLetter', current),
    };
  } else if (type === 'letterToSound') {
    // 看字母 → 选发音
    const distractors = pickRandomDistinct(otherLetters, distractorCount);
    const optionsArr = buildSoundOptions(current, distractors);

    question = {
      id: `${idPrefix}-letter-${current._id ?? mainChar}`,
      type: 'letterToSound',
      prompt: '观察这个字母，选择它的读音。',
      mainText: mainChar,
      options: optionsArr,
      correctOptionId: optionsArr[0].id,
      explanation: buildPhonicsExplanation('letterToSound', current),
    };
  } else {
    // reading：拼读题（尽量使用例词，不生成新音节）
    const distractors = pickRandomDistinct(otherLetters, distractorCount);
    const optionsArr = buildSoundOptions(current, distractors);

    question = {
      id: `${idPrefix}-reading-${current._id ?? mainChar}`,
      type: 'reading',
      prompt: example
        ? '尝试读出这个词的发音。'
        : '尝试读出这个音节/字母的发音。',
      mainText: example || mainChar,
      audioUrl: audioUrl,
      options: optionsArr,
      correctOptionId: optionsArr[0].id,
      explanation: buildPhonicsExplanation('reading', current),
    };
  }

  // 打乱选项顺序（避免正确项一直在第一位）
  const shuffledOptions = [...question.options];
  for (let i = shuffledOptions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledOptions[i], shuffledOptions[j]] = [
      shuffledOptions[j],
      shuffledOptions[i],
    ];
  }

  // 找到打乱后正确选项的 id
  const correct = question.options[0];
  const correctInShuffled = shuffledOptions.find(
    (opt) => opt.id === correct.id,
  )!;
  question.options = shuffledOptions;
  question.correctOptionId = correctInShuffled.id;

  return question;
}
