import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Course, LearningProgress, Level } from '../entities/types/entities';

interface LearningState {
  currentCourse: Course | null;
  progress: LearningProgress | null;
  completedContent: string[];
  
  setCourse: (course: Course) => void;
  updateProgress: (contentType: string, score: number) => void;
  getCompletionRate: () => number;
  resetLearning: () => void;
}

export const useLearningStore = create<LearningState>()(
  persist(
    (set, get) => ({
      currentCourse: null,
      progress: null,
      completedContent: [],

      setCourse: (course: Course) => {
        set({ currentCourse: course });
        
        if (!get().progress) {
          const newProgress: LearningProgress = {
            progressId: 'progress_' + Date.now(),
            userId: 'user_1',
            courseId: course.courseId,
            currentLevel: Level.BEGINNER_A,
            completedAlphabets: 30,
            completedVocabulary: 150,
            completedSentences: 20,
            completedArticles: 5,
            totalScore: 0,
            totalStudyTime: 1200,
            streakDays: 7,
            lastUpdated: new Date(),
          };
          set({ progress: newProgress });
        }
      },

      updateProgress: (contentType: string, score: number) => {
        const progress = get().progress;
        if (!progress) return;

        const updatedProgress = { ...progress };
        
        switch (contentType) {
          case 'alphabet':
            updatedProgress.completedAlphabets += 1;
            break;
          case 'vocabulary':
            updatedProgress.completedVocabulary += 1;
            break;
          case 'sentence':
            updatedProgress.completedSentences += 1;
            break;
          case 'article':
            updatedProgress.completedArticles += 1;
            break;
        }
        
        updatedProgress.totalScore += score;
        updatedProgress.lastUpdated = new Date();
        
        set({ progress: updatedProgress });
      },

      getCompletionRate: () => {
        const progress = get().progress;
        if (!progress) return 0;
        
        const total = 76 + 500 + 100 + 20;
        const completed = 
          progress.completedAlphabets +
          progress.completedVocabulary +
          progress.completedSentences +
          progress.completedArticles;
        
        return (completed / total) * 100;
      },

      resetLearning: () => {
        set({
          currentCourse: null,
          progress: null,
          completedContent: [],
        });
      },
    }),
    {
      name: 'learning-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);