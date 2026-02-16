// src/entities/types/memory.types.ts

export interface MemoryStatus {
  userId: string;
  entityType: 'word' | 'sentence' | 'article';
  entityId: string;
  vId?: number; // 词汇ID(可选)
  masteryLevel: number;
  reviewStage: number;
  easinessFactor: number;
  intervalDays: number;
  lastReviewAt: string;
  nextReviewAt: string;
  correctCount: number;
  wrongCount: number;
  streakCorrect: number;
  updatedAt: string;
  isSkipped: boolean;
}

export interface UnlockInfo {
  unlocked: boolean;
  stage?: 'word' | 'sentence' | 'article';
  message: string;
  letterProgress: number; // 0-1 比例值
}
