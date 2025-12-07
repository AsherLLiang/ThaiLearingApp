// app/alphabet/lesson/[lessonId].tsx

import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';

import { useAlphabetLearningEngine } from '@/src/hooks/useAlphabetLearningEngine';
import { AlphabetLearningEngineView } from '@/src/components/learning/alphabet/AlphabetLearningEngineView';

export default function AlphabetLessonFlow() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const router = useRouter();

  const {
    phase,
    initialized,
    currentItem,
    currentQuestionType,
    letterPool,
    onAnswer,
    next,
    skipYesterdayReview,
  } = useAlphabetLearningEngine(lessonId);

  const handleBack = () => {
    router.back();
  };

  return (
    <AlphabetLearningEngineView
      phase={phase}
      initialized={initialized}
      currentItem={currentItem}
      currentQuestionType={currentQuestionType}
      letterPool={letterPool}
      onAnswer={onAnswer}
      onNext={next}
      onSkipYesterdayReview={skipYesterdayReview}
      onBack={handleBack}
    />
  );
}
