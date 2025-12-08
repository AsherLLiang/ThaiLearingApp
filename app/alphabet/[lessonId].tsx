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
    currentRound,
    roundEvaluation,
    currentItem,
    currentQuestionType,
    letterPool,
    onAnswer,
    next,
    skipYesterdayReview,
    phonicsRule,
    showPhonicsRuleCard,
    onCompletePhonicsRule,
    miniReviewQuestion,
    onMiniReviewAnswer,
    onMiniReviewNext,
  } = useAlphabetLearningEngine(lessonId);

  const handleBack = () => {
    router.back();
  };

  return (
    <AlphabetLearningEngineView
      phase={phase}
      initialized={initialized}
      currentRound={currentRound}
      roundEvaluation={roundEvaluation}
      currentItem={currentItem}
      currentQuestionType={currentQuestionType}
      letterPool={letterPool}
      onAnswer={onAnswer}
      onNext={next}
      onSkipYesterdayReview={skipYesterdayReview}
      onBack={handleBack}
      phonicsRule={phonicsRule}
      showPhonicsRuleCard={showPhonicsRuleCard}
      onCompletePhonicsRule={onCompletePhonicsRule}
      miniReviewQuestion={miniReviewQuestion}
      onMiniReviewAnswer={onMiniReviewAnswer}
      onMiniReviewNext={onMiniReviewNext}
    />
  );
}
