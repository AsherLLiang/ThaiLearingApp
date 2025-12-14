// src/components/learning/alphabet/AlphabetLearningEngineView.tsx

import React from 'react';
import { View, ActivityIndicator, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';

import { AlphabetLearningView } from '@/src/components/learning/alphabet/AlphabetLearningView';
import { AlphabetReviewView } from '@/src/components/learning/alphabet/AlphabetReviewView';
import { PhonicsRuleCard } from '@/src/components/learning/alphabet/PhonicsRuleCard';
import { SessionRecoveryCard } from '@/src/components/learning/alphabet/SessionRecoveryCard';
import { AlphabetCompletionView } from '@/src/components/learning/alphabet/AlphabetCompletionView';
import { RoundCompletionView } from '@/src/components/learning/alphabet/RoundCompletionView';
import type { AlphabetQueueItem } from '@/src/stores/alphabetStore';

import type { Phase } from '@/src/hooks/useAlphabetLearningEngine';
import type { QuestionType } from '@/src/entities/enums/QuestionType.enum';
import type { Letter } from '@/src/entities/types/letter.types';
import type {
  PhonicsRule,
  RoundEvaluationState,
} from '@/src/entities/types/phonicsRule.types';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';

interface AlphabetLearningEngineViewProps {
  phase: Phase;
  initialized: boolean;
  currentRound: number;
  roundEvaluation?: RoundEvaluationState;
  currentItem: AlphabetQueueItem | null;
  currentQuestionType: QuestionType | null;
  letterPool?: Letter[];
  onAnswer: (isCorrect: boolean, questionType: QuestionType) => void;
  onNext: () => void;
  // REMOVED: onStartNextRound (Manual start happens in Lesson Page now)
  onBack?: () => void;
  phonicsRule?: PhonicsRule | null;
  showPhonicsRuleCard?: boolean;
  onCompletePhonicsRule?: () => void;

  // Recovery
  pendingRecoverySession?: any;
  resolveRecovery?: (choice: 'continue' | 'restart') => void;

  // New props for Observability
  queueIndex?: number;
  totalQueue?: number;

  onSkipYesterdayReview?: () => void;
}

// Helper to get friendly phase name
const getPhaseLabel = (phase: Phase) => {
  switch (phase) {
    case 'new-learning': return 'New Letters';
    case 'mini-review': return 'Quick Review';
    case 'final-review': return 'Final Review';
    case 'error-review': return 'Fix Mistakes';
    case 'previous-round-review': return 'Warm Up';
    case 'round-completed': return 'Round Done';
    case 'finished': return 'Finished';
    default: return phase;
  }
};

function RoundHeader({
  currentRound,
  phase,
  queueIndex,
  totalQueue,
  onBack,
}: {
  currentRound: number;
  phase: Phase;
  queueIndex?: number;
  totalQueue?: number;
  onBack?: () => void;
}) {
  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 4,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
        {/* Left: Back Button or Spacer */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {onBack && (
            <TouchableOpacity onPress={onBack} hitSlop={12}>
              <ChevronLeft size={24} color={Colors.taupe} />
            </TouchableOpacity>
          )}
          <Text
            style={{
              fontFamily: Typography.notoSerifRegular,
              fontSize: 14,
              color: Colors.taupe,
            }}
          >
            Round {currentRound} / 3
          </Text>
        </View>

        {/* Visible Phase Label */}
        <View style={{
          backgroundColor: '#F0F0F0',
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 4
        }}>
          <Text style={{
            fontFamily: Typography.notoSerifBold,
            fontSize: 12,
            color: Colors.ink
          }}>
            {getPhaseLabel(phase)}
          </Text>
        </View>
      </View>
    </View>
  );
}

function DebugBanner({
  phase,
  round,
  queueIndex,
  total
}: {
  phase: Phase,
  round: number,
  queueIndex: number,
  total: number
}) {
  if (!__DEV__) return null;
  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: 'rgba(255, 0, 0, 0.1)', padding: 4, zIndex: 999, alignItems: 'center' }}>
      <Text style={{ fontSize: 10, color: 'red', fontWeight: 'bold' }}>
        [DEBUG] Round: {round} | Phase: {phase} | Q: {(queueIndex ?? 0) + 1}/{total ?? '?'}
      </Text>
    </View>
  );
}

export function AlphabetLearningEngineView({
  phase,
  initialized,
  currentRound,
  roundEvaluation,
  currentItem,
  currentQuestionType,
  letterPool,
  onAnswer,
  onNext,
  // onStartNextRound, // Removed
  onBack,
  phonicsRule,
  showPhonicsRuleCard,
  onCompletePhonicsRule,

  pendingRecoverySession,
  resolveRecovery,

  queueIndex,
  totalQueue,
}: AlphabetLearningEngineViewProps) {

  // 加载状态
  if (!initialized || !currentItem) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (phase === 'finished') {
    return (
      <AlphabetCompletionView
        roundEvaluation={roundEvaluation}
        onFinish={onBack || (() => { })} // Fallback to no-op if onBack missing, but it handles router.back
      />
    );
  }

  if (phase === 'round-completed') {
    return (
      <RoundCompletionView
        roundNumber={currentRound}
        onFinish={onBack || (() => { console.warn('No Back Handler'); })}
      />
    );
  }

  const source = (currentItem as any)?.source;
  const isNewLetter = source === 'new';

  const hasValidRule = !!(phonicsRule && phonicsRule.title && phonicsRule.content?.length > 0);

  const shouldShowPhonicsRule =
    isNewLetter &&
    showPhonicsRuleCard &&
    hasValidRule &&
    onCompletePhonicsRule;

  const renderMainView = () => {

    if (shouldShowPhonicsRule) {
      return <PhonicsRuleCard rule={phonicsRule} onComplete={onCompletePhonicsRule} />;
    }

    if (!isNewLetter) {
      // Use currentQuestionType provided by engine, fallback to SoundToLetter if null
      return (
        <AlphabetReviewView
          alphabet={currentItem}
          letterPool={letterPool}
          preferredType={currentQuestionType ?? undefined}
          onAnswer={onAnswer}
          onNext={onNext}
          onBack={onBack}
        />
      );
    }

    return <AlphabetLearningView alphabet={currentItem} onNext={onNext} onBack={onBack} />;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <DebugBanner phase={phase} round={currentRound} queueIndex={queueIndex ?? 0} total={totalQueue ?? 0} />

      {/* 优先显示恢复弹窗 */}
      {pendingRecoverySession && resolveRecovery && (
        <SessionRecoveryCard
          onContinue={() => resolveRecovery('continue')}
          onRestart={() => resolveRecovery('restart')}
        />
      )}

      <RoundHeader currentRound={currentRound} phase={phase} queueIndex={queueIndex} totalQueue={totalQueue} />

      {renderMainView()}
    </SafeAreaView>
  );
}
