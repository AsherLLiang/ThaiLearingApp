// src/utils/letterData.ts

import lettersData from '@/assets/data/thai_letters_full.json';
import type { Letter, LetterCategory } from '@/src/entities/types/letter.types';

/**
 * Get all letters from JSON data
 */
export function getAllLetters(): Letter[] {
    return lettersData as Letter[];
}

/**
 * Get letters by category
 */
export function getLettersByCategory(category: LetterCategory): Letter[] {
    const letters = getAllLetters();

    if (category === 'vowel') {
        return letters.filter(l => l.type === 'vowel');
    }

    return letters.filter(l => l.class === category && l.type === 'consonant');
}

/**
 * Get letter by ID
 */
export function getLetterById(id: string): Letter | undefined {
    const letters = getAllLetters();
    return letters.find(l => l._id === id);
}

/**
 * Get total letter count
 */
export function getTotalLetterCount(): number {
    return getAllLetters().length;
}
