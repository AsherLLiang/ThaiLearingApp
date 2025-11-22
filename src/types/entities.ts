export enum UserRole {
  LEARNER = 'LEARNER',
  ADMIN = 'ADMIN',
}

export enum Level {
  BEGINNER_A = 'BEGINNER_A',
  BEGINNER_B = 'BEGINNER_B',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

export interface User {
  userId: string;
  email: string;
  password: string;
  displayName: string;
  role: UserRole;
  registrationDate: Date;
  lastLoginDate: Date;
}

export interface Course {
  courseId: string;
  courseName: string;
  description: string;
  level: Level;
  isActive: boolean;
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

export interface ReviewItem {
  id: string;
  char: string;
  phonetic: string;
  meaning?: string;
  type: 'Review' | 'Hard' | 'New';
  dueIn?: string;
}