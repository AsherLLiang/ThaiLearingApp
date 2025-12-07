// src/entities/types/memory.types.ts

export interface MemoryStatus {
  userId: string;
  entityType: 'letter' | 'word' | 'sentence';
  entityId: string;
  masteryLevel: number;
  reviewStage: number;
  easinessFactor: number;
  intervalDays: number;
  nextReviewAt: string;
  correctCount: number;
  wrongCount: number;
  streakCorrect: number;
  isLocked: boolean;
}

export interface UnlockInfo {
  unlocked: boolean;
  stage?: 'word' | 'sentence' | 'article';
  message: string;
  letterProgress: number; // 0-1 比例值
}
