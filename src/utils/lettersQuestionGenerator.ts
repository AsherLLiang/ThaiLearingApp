// src/utils/lettersQuestionGenerator.ts

import type { Letter } from '@/src/entities/types/letter.types';
import { QuestionType } from '@/src/entities/enums/QuestionType.enum';
import { generateLetterDistractors } from './lettersDistractorEngine';
import { getLetterAudioUrl } from './alphabet/audioHelper';

// ✅ 修复: 增加 audioUrl 字段
export interface AlphabetQuestion {
    type: QuestionType;
    stem: string;
    options: string[];
    correct: string;
    audioUrl?: string; // ✅ 新增
}

export function generateAlphabetQuestion(
    letter: Letter,
    pool: Letter[],
    preferredType?: QuestionType,
): AlphabetQuestion {
    const type = preferredType ?? selectRandomType();

    const distractorLetters =
        pool && pool.length > 1
            ? generateLetterDistractors({ pool, correct: letter, count: 3 })
            : [];

    const correctChar = letter.thaiChar;

    switch (type) {
        case QuestionType.SOUND_TO_LETTER:
            return {
                type,
                stem: '🔊 听音，选择正确的字母',
                options: shuffle([
                    correctChar,
                    ...distractorLetters.map((l) => l.thaiChar),
                ]),
                correct: correctChar,
                audioUrl: getLetterAudioUrl(letter, 'letter'), // ✅ 使用工具类
            };

        case QuestionType.LETTER_TO_SOUND:
            return {
                type,
                stem: `字母 ${letter.thaiChar} 的发音是？`,
                options: shuffle([
                    letter.initialSound,
                    ...distractorLetters
                        .map((l) => l.initialSound)
                        .filter(Boolean),
                ]),
                correct: letter.initialSound,
                audioUrl: getLetterAudioUrl(letter, 'letter'), // ✅ 使用工具类
            };

        case QuestionType.SYLLABLE:
            return {
                type,
                stem: `${letter.thaiChar} + า = ?`,
                options: shuffle([
                    `${correctChar}า`,
                    ...distractorLetters.map((l) => `${l.thaiChar}า`),
                ]),
                correct: `${correctChar}า`,
                audioUrl: getLetterAudioUrl(letter, 'syllable'), // ✅ 使用音节音频
            };

        case QuestionType.REVERSE_SYLLABLE:
            return {
                type,
                stem: `读音 [${letter.initialSound || '?'}a]，对应的辅音是？`,
                options: shuffle([
                    correctChar,
                    ...distractorLetters.map((l) => l.thaiChar),
                ]),
                correct: correctChar,
                audioUrl: getLetterAudioUrl(letter, 'syllable'), // ✅ 音节音频
            };

        case QuestionType.MISSING_LETTER:
            return {
                type,
                stem: `_ + า = ${letter.thaiChar}า，应该填入哪个字母？`,
                options: shuffle([
                    correctChar,
                    ...distractorLetters.map((l) => l.thaiChar),
                ]),
                correct: correctChar,
                audioUrl: getLetterAudioUrl(letter, 'syllable'), // ✅ 音节音频
            };

        case QuestionType.FINAL_CONSONANT:
            return {
                type,
                stem: '哪个字母作为尾音时读成 [-k]？',
                options: shuffle([
                    correctChar,
                    ...distractorLetters.map((l) => l.thaiChar),
                ]),
                correct: correctChar,
                audioUrl: getLetterAudioUrl(letter, 'letter'), // ✅ 字母音频
            };

        case QuestionType.CLASS_CHOICE:
            return {
                type,
                stem: `${letter.thaiChar} 属于哪一类辅音？`,
                options: ['高辅音', '中辅音', '低辅音'],
                correct: mapClassToLabel(letter.class || 'low'), // ✅ 提供默认值
                audioUrl: getLetterAudioUrl(letter, 'letter'),
            };

        case QuestionType.LETTER_NAME:
            return {
                type,
                stem: `以下哪个字母叫做 "${letter.nameThai}"？`,
                options: shuffle([
                    correctChar,
                    ...distractorLetters.map((l) => l.thaiChar),
                ]),
                correct: correctChar,
                audioUrl: getLetterAudioUrl(letter, 'letter'), // ✅ 字母音频
            };

        default:
            return {
                type: QuestionType.LETTER_TO_SOUND,
                stem: letter.thaiChar,
                options: [letter.initialSound],
                correct: letter.initialSound,
                audioUrl: getLetterAudioUrl(letter, 'letter'), // ✅ 字母音频
            };
    }
}

// ===== 工具函数 =====

function selectRandomType(): QuestionType {
    const types: QuestionType[] = [
        QuestionType.SOUND_TO_LETTER,
        QuestionType.LETTER_TO_SOUND,
        QuestionType.SYLLABLE,
    ];
    return types[Math.floor(Math.random() * types.length)];
}

function shuffle<T>(arr: T[]): T[] {
    return [...arr].sort(() => Math.random() - 0.5);
}

function mapClassToLabel(cls: string): string {
    if (cls === 'mid') return '中辅音';
    if (cls === 'high') return '高辅音';
    return '低辅音';
}