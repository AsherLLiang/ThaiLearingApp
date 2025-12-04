// src/entities/types/alphabet.types.ts

export interface AlphabetData {
  alphabetId: string;
  thaiChar: string;
  category: 'consonant' | 'vowel';
  pronunciation: string;
  romanization: string;
  example: string;
  audioPath: string;
  strokeOrder: string[];
  difficulty: 'basic' | 'intermediate' | 'advanced';
  lessonNumber: string;
}

export interface AlphabetLearningState {
  alphabetId: string;
  thaiChar: string;
  category: 'consonant' | 'vowel';
  pronunciation: string;
  example: string;
  audioPath: string;
  // 记忆状态
  currentAttempts: number;
  requiredAttempts: number;
  qualityHistory: number[];
  isCompleted: boolean;
  timestamp: string;
}

/**
 * 解锁信息（用于统一记忆引擎）
 */
export interface UnlockInfo {
  letterProgress: number;      // 字母学习进度 (0-100)
  wordUnlocked: boolean;        // 是否解锁单词学习
  unlocked?: boolean;           // 是否刚刚解锁
}