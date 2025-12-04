// src/entities/types/test.types.ts

export interface TestQuestion {
  questionId: string;
  type: 'multiple_choice' | 'audio_match' | 'sequence';
  content: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface AlphabetTest {
  testId: string;
  type: 'skip_test' | 'progress_test';
  difficulty: 'basic' | 'intermediate' | 'advanced';
  questions: TestQuestion[];
  passingScore: number;
  timeLimit: number;
}

export interface TestResult {
  score: number;
  passed: boolean;
  correctCount: number;
  totalQuestions: number;
  results: {
    questionId: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  unlocked: boolean;
  message: string;
}