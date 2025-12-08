// src/components/learning/alphabet/AlphabetLearningEngineView.tsx

import React from 'react';
import { View, ActivityIndicator, TouchableOpacity, Text, SafeAreaView } from 'react-native';

import { AlphabetLearningView } from '@/src/components/learning/alphabet/AlphabetLearningView';
import { AlphabetReviewView } from '@/src/components/learning/alphabet/AlphabetReviewView';
import { PhonicsRuleCard } from '@/src/components/learning/alphabet/PhonicsRuleCard';
import { MiniReviewQuestion as MiniReviewQuestionComponent } from '@/src/components/learning/alphabet/MiniReviewQuestion';
import type { AlphabetLearningState } from '@/src/stores/alphabetStore';
import type { QuestionType, Phase } from '@/src/hooks/useAlphabetLearningEngine';
import type { Letter } from '@/src/entities/types/letter.types';
import type {
  PhonicsRule,
  MiniReviewQuestion as MiniReviewQuestionType,
  RoundEvaluationState,
} from '@/src/entities/types/phonicsRule.types';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';

interface AlphabetLearningEngineViewProps {
  phase: Phase;
  initialized: boolean;
  currentRound: number;
  roundEvaluation?: RoundEvaluationState;
  currentItem: AlphabetLearningState | null;
  currentQuestionType: QuestionType | null;
  letterPool?: Letter[];
  onAnswer: (isCorrect: boolean, questionType: QuestionType) => void;
  onNext: () => void;
  onSkipYesterdayReview?: () => void;
  onBack?: () => void;
  phonicsRule?: PhonicsRule | null;
  showPhonicsRuleCard?: boolean;
  onCompletePhonicsRule?: () => void;
  miniReviewQuestion?: MiniReviewQuestionType | null;
  onMiniReviewAnswer?: (isCorrect: boolean, type: any) => void;
  onMiniReviewNext?: () => void;
}

function RoundHeader({
  currentRound,
}: {
  currentRound: number;
}) {
  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 4,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Text
        style={{
          fontFamily: Typography.notoSerifRegular,
          fontSize: 14,
          color: Colors.taupe,
        }}
      >
        第 {currentRound} 轮 / 共 3 轮
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
  onSkipYesterdayReview,
  onBack,
  phonicsRule,
  showPhonicsRuleCard,
  onCompletePhonicsRule,
  miniReviewQuestion,
  onMiniReviewAnswer,
  onMiniReviewNext,
}: AlphabetLearningEngineViewProps) {
  // 加载状态
  if (!initialized || !currentItem) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  // 复习阶段（昨日复习、昨日补救、mini review、final review、今日补救）
  if (
    phase === 'yesterday-review' ||
    phase === 'yesterday-remedy' ||
    phase === 'today-final-review' ||
    phase === 'today-remedy'
  ) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <RoundHeader currentRound={currentRound} />
        {phase === 'yesterday-review' && onSkipYesterdayReview && (
          <View
            style={{
              paddingHorizontal: 16,
              paddingTop: 12,
              paddingBottom: 4,
              alignItems: 'flex-end',
            }}
          >
            <TouchableOpacity onPress={onSkipYesterdayReview}>
              <Text
                style={{
                  fontFamily: Typography.notoSerifRegular,
                  fontSize: 13,
                  color: Colors.taupe,
                }}
              >
                跳过昨日复习 →
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <AlphabetReviewView
          alphabet={currentItem}
          letterPool={letterPool}
          preferredType={currentQuestionType ?? undefined}
          onAnswer={onAnswer}
          onNext={onNext}
          onBack={onBack}
        />
      </SafeAreaView>
    );
  }

  // 今日 Mini Review 阶段：使用 MiniReviewQuestion 组件
  if (phase === 'today-mini-review') {
    if (miniReviewQuestion && onMiniReviewAnswer && onMiniReviewNext) {
      return (
        <SafeAreaView style={{ flex: 1 }}>
          <RoundHeader currentRound={currentRound} />
          <MiniReviewQuestionComponent
            question={miniReviewQuestion}
            onAnswer={onMiniReviewAnswer}
            onNext={onMiniReviewNext}
            onBack={onBack}
          />
        </SafeAreaView>
      );
    }

    // 回退：若题目未准备好，降级为普通复习视图
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <AlphabetReviewView
          alphabet={currentItem}
          letterPool={letterPool}
          preferredType={currentQuestionType ?? undefined}
          onAnswer={onAnswer}
          onNext={onNext}
          onBack={onBack}
        />
      </SafeAreaView>
    );
  }

  // 今日学习阶段
  if (phase === 'today-learning') {
    if (showPhonicsRuleCard && phonicsRule && onCompletePhonicsRule) {
      return (
        <SafeAreaView style={{ flex: 1 }}>
          <RoundHeader currentRound={currentRound} />
          <PhonicsRuleCard rule={phonicsRule} onComplete={onCompletePhonicsRule} />
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <RoundHeader currentRound={currentRound} />
        <AlphabetLearningView
          alphabet={currentItem}
          onNext={onNext}
          onBack={onBack}
        />
      </SafeAreaView>
    );
  }

  // 完成阶段
  if (phase === 'finished') {
    const rounds = roundEvaluation?.rounds ?? [];

    return (
      <SafeAreaView style={{ flex: 1, padding: 24 }}>
        <Text
          style={{
            fontFamily: Typography.notoSerifRegular,
            fontSize: 18,
            marginBottom: 16,
            textAlign: 'center',
            color: Colors.taupe,
          }}
        >
          本课三轮评估已完成
        </Text>

        {rounds.length > 0 && (
          <View style={{ marginBottom: 24 }}>
            {rounds
              .sort((a, b) => a.roundNumber - b.roundNumber)
              .map((round) => (
                <View
                  key={round.roundNumber}
                  style={{
                    paddingVertical: 8,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text
                    style={{
                      fontFamily: Typography.notoSerifRegular,
                      fontSize: 16,
                      color: Colors.taupe,
                    }}
                  >
                    第 {round.roundNumber} 轮
                  </Text>
                  <Text
                    style={{
                      fontFamily: Typography.notoSerifRegular,
                      fontSize: 16,
                      color: round.passed ? Colors.success : Colors.error,
                    }}
                  >
                    {(round.accuracy * 100).toFixed(0)}%{' '}
                    {round.passed ? '通过' : '未达标'}
                  </Text>
                </View>
              ))}
          </View>
        )}

        <Text
          style={{
            fontFamily: Typography.notoSerifRegular,
            fontSize: 14,
            textAlign: 'center',
            color: Colors.taupe,
          }}
        >
          你可以返回课程列表继续下一课学习。
        </Text>
      </SafeAreaView>
    );
  }

  // 默认加载状态
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
      <ActivityIndicator size="large" />
    </SafeAreaView>
  );
}
