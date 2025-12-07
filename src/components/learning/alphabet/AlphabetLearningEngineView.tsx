// src/components/learning/alphabet/AlphabetLearningEngineView.tsx

import React from 'react';
import { View, ActivityIndicator } from 'react-native';

import { AlphabetLearningView } from '@/src/components/learning/alphabet/AlphabetLearningView';
import { AlphabetReviewView } from '@/src/components/learning/alphabet/AlphabetReviewView';
import type { AlphabetLearningState } from '@/src/stores/alphabetStore';
import type { QuestionType, Phase } from '@/src/hooks/useAlphabetLearningEngine';

interface AlphabetLearningEngineViewProps {
  phase: Phase;
  initialized: boolean;
  currentItem: AlphabetLearningState | null;
  currentQuestionType: QuestionType | null;
  onAnswer: (isCorrect: boolean, questionType: QuestionType) => void;
  onNext: () => void;
}

export function AlphabetLearningEngineView({
  phase,
  initialized,
  currentItem,
  currentQuestionType,
  onAnswer,
  onNext,
}: AlphabetLearningEngineViewProps) {
  // 加载状态
  if (!initialized || !currentItem) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // 复习阶段（昨日复习、昨日补救、mini review、final review、今日补救）
  if (
    phase === 'yesterday-review' ||
    phase === 'yesterday-remedy' ||
    phase === 'today-mini-review' ||
    phase === 'today-final-review' ||
    phase === 'today-remedy'
  ) {
    return (
      <AlphabetReviewView
        alphabet={currentItem}
        preferredType={currentQuestionType ?? undefined}
        onAnswer={onAnswer}
        onNext={onNext}
      />
    );
  }

  // 今日学习阶段
  if (phase === 'today-learning') {
    return (
      <AlphabetLearningView
        alphabet={currentItem}
        onNext={onNext}
      />
    );
  }

  // 完成阶段
  if (phase === 'finished') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="small" />
      </View>
    );
  }

  // 默认加载状态
  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}

