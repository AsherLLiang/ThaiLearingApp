// src/entities/types/letter.types.ts

/**
 * Letter data structure from JSON
 */
export interface Letter {
    _id: string;
    type: 'consonant' | 'vowel';
    thaiChar: string;
    nameThai: string;
    nameEnglish: string;
    initialSound: string;
    finalSound: string;
    class: 'mid' | 'high' | 'low' | null;
    audioPath: string;
    exampleWord: string;
    exampleMeaning: string;
    strokeCount: number;
    learningLevel: string;
    createdAt: string;
}

/**
 * Letter category type
 */
export type LetterCategory = 'mid' | 'high' | 'low' | 'vowel';

/**
 * Letter progress tracking
 */
export interface LetterProgress {
    masteredCount: number;
    totalCount: number;
    accuracy: number;
    masteredIds: string[];
}
