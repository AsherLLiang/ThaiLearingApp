// src/entities/enums/QuestionType.enum.ts

/**
 * 字母复习题型枚举
 * 
 * 基于泰语语音学优化的12种题型系统
 * 包含送气音对比、元音长短对比、声调听辨等核心训练
 * 
 * @version 3.0.0
 * @see lettersQuestionGenerator.ts
 */
export enum QuestionType {
    // ===== 基础题型(Lesson 1-2) =====
    /** 听音选字母 */
    SOUND_TO_LETTER = 'sound-to-letter',
    /** 看字母选发音 */
    LETTER_TO_SOUND = 'letter-to-sound',

    // ===== 拼读题型(Lesson 2-3) =====
    /** 拼读组合: 辅音+元音 */
    SYLLABLE = 'syllable',
    /** 音素分离: 发音→辅音 */
    REVERSE_SYLLABLE = 'reverse-syllable',
    /** 缺字填空 */
    MISSING_LETTER = 'missing-letter',

    // ===== 🔴 核心对比题型(Lesson 2-4) =====
    /** 送气音对比(最小对立组训练) - ก/ข/ค */
    ASPIRATED_CONTRAST = 'aspirated-contrast',
    /** 元音长短对比 - า/ะ */
    VOWEL_LENGTH_CONTRAST = 'vowel-length-contrast',

    // ===== 进阶题型(Lesson 3-5) =====
    /** 尾辅音规则 */
    FINAL_CONSONANT = 'final-consonant',
    /** 声调听辨(含音高可视化) */
    TONE_PERCEPTION = 'tone-perception',

    // ===== 高级题型(Lesson 4-6) =====
    /** 辅音分类(高/中/低) */
    CLASS_CHOICE = 'class-choice',
    /** 字母名称识别 */
    LETTER_NAME = 'letter-name',
    /** 首音判断 */
    INITIAL_SOUND = 'initial-sound',
}

/**
 * 题型显示名称映射
 */
export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
    [QuestionType.SOUND_TO_LETTER]: '听音选字母',
    [QuestionType.LETTER_TO_SOUND]: '看字母选发音',
    [QuestionType.SYLLABLE]: '拼读组合',
    [QuestionType.REVERSE_SYLLABLE]: '音素分离',
    [QuestionType.MISSING_LETTER]: '缺字填空',
    [QuestionType.ASPIRATED_CONTRAST]: '送气音对比',
    [QuestionType.VOWEL_LENGTH_CONTRAST]: '元音长短对比',
    [QuestionType.FINAL_CONSONANT]: '尾音规则',
    [QuestionType.TONE_PERCEPTION]: '声调听辨',
    [QuestionType.CLASS_CHOICE]: '辅音分类',
    [QuestionType.LETTER_NAME]: '字母名称',
    [QuestionType.INITIAL_SOUND]: '首音判断',
};

/**
 * 题型难度等级(1-5)
 */
export const QUESTION_TYPE_DIFFICULTY: Record<QuestionType, 1 | 2 | 3 | 4 | 5> = {
    [QuestionType.SOUND_TO_LETTER]: 1,
    [QuestionType.LETTER_TO_SOUND]: 1,
    [QuestionType.SYLLABLE]: 2,
    [QuestionType.REVERSE_SYLLABLE]: 3,
    [QuestionType.MISSING_LETTER]: 2,
    [QuestionType.ASPIRATED_CONTRAST]: 3,
    [QuestionType.VOWEL_LENGTH_CONTRAST]: 2,
    [QuestionType.FINAL_CONSONANT]: 4,
    [QuestionType.TONE_PERCEPTION]: 4,
    [QuestionType.CLASS_CHOICE]: 3,
    [QuestionType.LETTER_NAME]: 2,
    [QuestionType.INITIAL_SOUND]: 2,
};

/**
 * 音频需求类型定义
 */
export type AudioRequirementType =
    | 'letter'        // 单字母发音
    | 'syllable'      // 音节发音
    | 'minimal-pair'  // 最小对立组(需动态生成)
    | 'tone-set';     // 5个声调变体(需TTS生成)

/**
 * 题型所需的音频类型
 */
export const QUESTION_TYPE_AUDIO_REQUIREMENTS: Record<
    QuestionType,
    AudioRequirementType
> = {
    [QuestionType.SOUND_TO_LETTER]: 'letter',
    [QuestionType.LETTER_TO_SOUND]: 'letter',
    [QuestionType.SYLLABLE]: 'syllable',
    [QuestionType.REVERSE_SYLLABLE]: 'syllable',
    [QuestionType.MISSING_LETTER]: 'syllable',
    [QuestionType.ASPIRATED_CONTRAST]: 'minimal-pair',
    [QuestionType.VOWEL_LENGTH_CONTRAST]: 'minimal-pair',
    [QuestionType.FINAL_CONSONANT]: 'syllable',
    [QuestionType.TONE_PERCEPTION]: 'tone-set',
    [QuestionType.CLASS_CHOICE]: 'letter',
    [QuestionType.LETTER_NAME]: 'letter',
    [QuestionType.INITIAL_SOUND]: 'letter',
};

/**
 * 根据课程阶段获取推荐题型权重
 * 
 * @param lessonId - 课程ID (lesson1-lesson6)
 * @returns 题型权重映射 (权重总和为1)
 */
export function getQuestionTypeWeights(
    lessonId: string
): Partial<Record<QuestionType, number>> {
    switch (lessonId) {
        case 'lesson1':
            // 基础听辨+拼读
            return {
                [QuestionType.SOUND_TO_LETTER]: 0.4,
                [QuestionType.LETTER_TO_SOUND]: 0.4,
                [QuestionType.SYLLABLE]: 0.2,
            };

        case 'lesson2':
            // 引入元音长短对比
            return {
                [QuestionType.SOUND_TO_LETTER]: 0.25,
                [QuestionType.SYLLABLE]: 0.3,
                [QuestionType.VOWEL_LENGTH_CONTRAST]: 0.25,
                [QuestionType.REVERSE_SYLLABLE]: 0.2,
            };

        case 'lesson3':
            // 🔴 重点:送气音对比训练
            return {
                [QuestionType.ASPIRATED_CONTRAST]: 0.35,
                [QuestionType.SYLLABLE]: 0.25,
                [QuestionType.MISSING_LETTER]: 0.2,
                [QuestionType.VOWEL_LENGTH_CONTRAST]: 0.2,
            };

        case 'lesson4':
            // 🔴 重点:声调系统训练
            return {
                [QuestionType.TONE_PERCEPTION]: 0.4,
                [QuestionType.CLASS_CHOICE]: 0.25,
                [QuestionType.ASPIRATED_CONTRAST]: 0.2,
                [QuestionType.FINAL_CONSONANT]: 0.15,
            };

        case 'lesson5':
            // 综合复习,声调为主
            return {
                [QuestionType.TONE_PERCEPTION]: 0.3,
                [QuestionType.CLASS_CHOICE]: 0.2,
                [QuestionType.REVERSE_SYLLABLE]: 0.25,
                [QuestionType.LETTER_NAME]: 0.15,
                [QuestionType.ASPIRATED_CONTRAST]: 0.1,
            };

        case 'lesson6':
            // 全题型综合测试
            return {
                [QuestionType.SOUND_TO_LETTER]: 0.1,
                [QuestionType.ASPIRATED_CONTRAST]: 0.15,
                [QuestionType.VOWEL_LENGTH_CONTRAST]: 0.15,
                [QuestionType.SYLLABLE]: 0.15,
                [QuestionType.TONE_PERCEPTION]: 0.25,
                [QuestionType.CLASS_CHOICE]: 0.1,
                [QuestionType.LETTER_NAME]: 0.1,
            };

        default:
            // 默认均匀分布(基础题)
            return {
                [QuestionType.SOUND_TO_LETTER]: 0.33,
                [QuestionType.LETTER_TO_SOUND]: 0.33,
                [QuestionType.SYLLABLE]: 0.34,
            };
    }
}

/**
 * 根据权重随机选择题型
 * 
 * @param weights - 题型权重映射
 * @returns 选中的题型
 */
export function selectQuestionTypeByWeight(
    weights: Partial<Record<QuestionType, number>>
): QuestionType {
    const types = Object.keys(weights) as QuestionType[];
    const weightValues = types.map(t => weights[t] || 0);

    // 计算累积权重
    const cumulativeWeights: number[] = [];
    let sum = 0;
    for (const weight of weightValues) {
        sum += weight;
        cumulativeWeights.push(sum);
    }

    // 随机选择
    const random = Math.random() * sum;
    const index = cumulativeWeights.findIndex(w => random <= w);

    return types[index] || types[0];
}

/**
 * 获取题型图标(用于UI显示)
 */
export const QUESTION_TYPE_ICONS: Record<QuestionType, string> = {
    [QuestionType.SOUND_TO_LETTER]: '🔊',
    [QuestionType.LETTER_TO_SOUND]: '👁️',
    [QuestionType.SYLLABLE]: '🔤',
    [QuestionType.REVERSE_SYLLABLE]: '🔄',
    [QuestionType.MISSING_LETTER]: '❓',
    [QuestionType.ASPIRATED_CONTRAST]: '💨',
    [QuestionType.VOWEL_LENGTH_CONTRAST]: '⏱️',
    [QuestionType.FINAL_CONSONANT]: '🔚',
    [QuestionType.TONE_PERCEPTION]: '🎵',
    [QuestionType.CLASS_CHOICE]: '📊',
    [QuestionType.LETTER_NAME]: '📝',
    [QuestionType.INITIAL_SOUND]: '👂',
};