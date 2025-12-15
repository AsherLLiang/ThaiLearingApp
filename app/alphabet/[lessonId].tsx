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
    onNext,
    phonicsRule,
    showPhonicsRuleCard,
    onCompletePhonicsRule,
    pendingRecoverySession,
    resolveRecovery,
    onFinishRound,
  } = useAlphabetLearningEngine(lessonId);


  const handleBack = async () => {
    // 🔥 在离开页面前清除 session
    await onFinishRound();
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
      onNext={onNext}
      onBack={handleBack}
      phonicsRule={phonicsRule}
      showPhonicsRuleCard={showPhonicsRuleCard}
      onCompletePhonicsRule={onCompletePhonicsRule}
      pendingRecoverySession={pendingRecoverySession}
      resolveRecovery={resolveRecovery}
    />

  );
}
