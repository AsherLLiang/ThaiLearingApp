// src/utils/alphabetQuestionGenerator.ts

import type { Letter } from '@/src/entities/types/letter.types';
import type { QuestionType } from '@/src/hooks/useAlphabetLearningEngine';
import { generateLetterDistractors } from './lettersDistractorEngine';

export interface AlphabetQuestion {
    type: QuestionType;
    stem: string;       // 题干显示文案
    options: string[];  // 选项文本
    correct: string;    // 正确选项文本（与 options 中某个一致）
}

const ALL_QUESTION_TYPES: QuestionType[] = [
    'sound-to-letter',
    'letter-to-sound',
    'syllable',
    'reverse-syllable',
    'missing-letter',
    'final-consonant',
    'tone-choice',
    'class-choice',
    'letter-name',
];

export function generateAlphabetQuestion(
    letter: Letter,
    pool: Letter[],
    preferredType?: QuestionType,
): AlphabetQuestion {
    const type =
        preferredType ??
        ALL_QUESTION_TYPES[Math.floor(Math.random() * ALL_QUESTION_TYPES.length)];

    // 默认：用 pool 做干扰项，若 pool 太小就退化为只用正确项
    const distractorLetters =
        pool && pool.length > 1
            ? generateLetterDistractors({ pool, correct: letter, count: 3 })
            : [];

    const correctChar = letter.thaiChar;

    switch (type) {
        case 'sound-to-letter':
            return {
                type,
                stem: '🔊 听音，选择正确的字母',
                options: shuffle([
                    correctChar,
                    ...distractorLetters.map((l) => l.thaiChar),
                ]),
                correct: correctChar,
            };

        case 'letter-to-sound':
            return {
                type,
                stem: letter.thaiChar,
                options: shuffle([
                    letter.initialSound,
                    ...distractorLetters
                        .map((l) => l.initialSound)
                        .filter(Boolean),
                ]),
                correct: letter.initialSound,
            };

        case 'syllable':
            return {
                type,
                stem: `${letter.thaiChar} + 元音 = ?`,
                options: shuffle([
                    correctChar,
                    ...distractorLetters.map((l) => l.thaiChar),
                ]),
                correct: correctChar,
            };

        case 'reverse-syllable':
            return {
                type,
                stem: `读音：${letter.initialSound || '?'}-a，对应的辅音是？`,
                options: shuffle([
                    correctChar,
                    ...distractorLetters.map((l) => l.thaiChar),
                ]),
                correct: correctChar,
            };

        case 'missing-letter':
            return {
                type,
                stem: `_ + า = ${letter.thaiChar}า，应该填入哪个字母？`,
                options: shuffle([
                    correctChar,
                    ...distractorLetters.map((l) => l.thaiChar),
                ]),
                correct: correctChar,
            };

        case 'final-consonant':
            return {
                type,
                stem: '哪个字母作为尾音时读成 [-k]？（简化示例）',
                options: shuffle([
                    correctChar,
                    ...distractorLetters.map((l) => l.thaiChar),
                ]),
                correct: correctChar,
            };

        case 'tone-choice':
            return {
                type,
                stem: `请选择 ${letter.thaiChar} 的声调（简化版，下阶段可按规则改真实）`,
                options: ['平调', '升调', '降调', '高调'],
                correct: '平调',
            };

        case 'class-choice':
            return {
                type,
                stem: `${letter.thaiChar} 属于哪一类辅音？`,
                options: ['高辅音', '中辅音', '低辅音'],
                correct: mapClassToLabel(letter.class),
            };

        case 'letter-name':
            return {
                type,
                stem: `以下哪个字母叫做 “${letter.nameThai}”？`,
                options: shuffle([
                    correctChar,
                    ...distractorLetters.map((l) => l.thaiChar),
                ]),
                correct: correctChar,
            };

        default:
            return {
                type: 'letter-to-sound',
                stem: letter.thaiChar,
                options: [letter.initialSound],
                correct: letter.initialSound,
            };
    }
}

// ------------- 工具函数 -------------

function shuffle<T>(arr: T[]): T[] {
    return [...arr].sort(() => Math.random() - 0.5);
}

function mapClassToLabel(cls: string): string {
    if (cls === 'mid') return '中辅音';
    if (cls === 'high') return '高辅音';
    return '低辅音';
}
