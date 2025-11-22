// src/types/entities.ts
export interface ReviewItem {
    id: string;
    char: string;
    phonetic: string;
    type: 'New' | 'Review' | 'Hard';
    dueIn: string;
    meaning?: string;
    category?: string;
  }
  
  export interface LearningProgress {
    currentLevel: string;
    completedAlphabets: number;
    completedVocabulary: number;
    completedSentences: number;
    completedArticles: number;
    totalScore: number;
    totalStudyTime: number;
    streakDays: number;
  }
  
  export interface Course {
    id: string;
    name: string;
    nameZh: string;
    level: string;
    progress: number;
  }