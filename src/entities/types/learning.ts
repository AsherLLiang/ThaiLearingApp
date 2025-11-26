import { Level } from './course';

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
    progressId: string;
    userId: string;
    courseId: string;
    currentLevel: Level;
    completedAlphabets: number;
    completedVocabulary: number;
    completedSentences: number;
    completedArticles: number;
    totalScore: number;
    totalStudyTime: number;
    streakDays: number;
    lastUpdated: Date;
}
