// app/alphabet/lesson/[lessonId].tsx

import { useLocalSearchParams } from 'expo-router';
import React from 'react';

import { useAlphabetLearningEngine } from '@/src/hooks/useAlphabetLearningEngine';
import { AlphabetLearningEngineView } from '@/src/components/learning/alphabet/AlphabetLearningEngineView';

export default function AlphabetLessonFlow() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();

  const {
    phase,
    initialized,
    currentItem,
    currentQuestionType,
    onAnswer,
    next,
  } = useAlphabetLearningEngine(lessonId);

  return (
    <AlphabetLearningEngineView
      phase={phase}
      initialized={initialized}
      currentItem={currentItem}
      currentQuestionType={currentQuestionType}
      onAnswer={onAnswer}
      onNext={next}
    />
  );
}
