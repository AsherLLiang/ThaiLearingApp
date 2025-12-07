// src/components/learning/alphabet/AlphabetLearningEngineView.tsx

import React from 'react';
import { View, ActivityIndicator, TouchableOpacity, Text, SafeAreaView } from 'react-native';

import { AlphabetLearningView } from '@/src/components/learning/alphabet/AlphabetLearningView';
import { AlphabetReviewView } from '@/src/components/learning/alphabet/AlphabetReviewView';
import type { AlphabetLearningState } from '@/src/stores/alphabetStore';
import type { QuestionType, Phase } from '@/src/hooks/useAlphabetLearningEngine';
import type { Letter } from '@/src/entities/types/letter.types';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';

interface AlphabetLearningEngineViewProps {
  phase: Phase;
  initialized: boolean;
  currentItem: AlphabetLearningState | null;
  currentQuestionType: QuestionType | null;
  letterPool?: Letter[];
  onAnswer: (isCorrect: boolean, questionType: QuestionType) => void;
  onNext: () => void;
  onSkipYesterdayReview?: () => void;
  onBack?: () => void;
}

export function AlphabetLearningEngineView({
  phase,
  initialized,
  currentItem,
  currentQuestionType,
  letterPool,
  onAnswer,
  onNext,
  onSkipYesterdayReview,
  onBack,
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
    phase === 'today-mini-review' ||
    phase === 'today-final-review' ||
    phase === 'today-remedy'
  ) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
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

  // 今日学习阶段
  if (phase === 'today-learning') {
    return (
      <SafeAreaView style={{ flex: 1 }}>
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
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="small" />
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
