// src/components/learning/alphabet/MiniReviewQuestion.tsx

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Audio } from 'expo-av';
import { Volume2 } from 'lucide-react-native';

import type { MiniReviewQuestion as MiniReviewQuestionType } from '@/src/entities/types/phonicsRule.types';
import type { QuestionType } from '@/src/entities/enums/QuestionType.enum';
import {
  QUESTION_TYPE_LABELS,
  QUESTION_TYPE_ICONS,
} from '@/src/entities/enums/QuestionType.enum';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';

// ==================== Props 接口 ====================

interface MiniReviewQuestionProps {
  /** 题目数据 */
  question: MiniReviewQuestionType;

  /** 答题回调(isCorrect, questionType) */
  onAnswer: (isCorrect: boolean, type: QuestionType) => void;

  /** 下一题回调 */
  onNext: () => void;

  /** 返回回调(可选) */
  onBack?: () => void;
}

// ==================== 主组件 ====================

export function MiniReviewQuestion({
  question,
  onAnswer,
  onNext,
  onBack,
}: MiniReviewQuestionProps) {
  const { t } = useTranslation();
  const [answered, setAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);

  // ===== 清理音频资源 =====
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => { });
        soundRef.current = null;
      }
    };
  }, [question.id]); // 题目切换时清理

  // ===== 播放音频 =====
  const handlePlayAudio = useCallback(async () => {
    if (!question.audioUrl) return;

    try {
      setIsPlaying(true);

      if (soundRef.current) {
        await soundRef.current.replayAsync();
        setIsPlaying(false);
        return;
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: question.audioUrl },
        { shouldPlay: true }
      );

      soundRef.current = sound;

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    } catch (error) {
      console.warn('[MiniReviewQuestion] 播放音频失败:', error);
      setIsPlaying(false);
    }
  }, [question.audioUrl]);

  // ===== 选择答案 =====
  const handleSelectOption = useCallback(
    (optionValue: string) => {
      if (answered) return;

      setSelectedOption(optionValue);
      setAnswered(true);

      const isCorrect = optionValue === question.correct;
      onAnswer(isCorrect, question.type);
    },
    [answered, question.correct, question.type, onAnswer]
  );

  // ===== 渲染声学提示 =====
  const renderAcousticHint = () => {
    if (!question.acousticHint) return null;

    const { aspirated, voiceless, class: consonantClass } = question.acousticHint;

    return (
      <View style={styles.hintContainer}>
        <Text style={styles.hintTitle}>{t('components.miniReview.hint', '💡 提示:')}</Text>
        {aspirated !== undefined && (
          <Text style={styles.hintText}>
            • {aspirated ? t('components.miniReview.aspirated', '送气音 (aspirated)') : t('components.miniReview.unaspirated', '不送气音 (unaspirated)')}
          </Text>
        )}
        {voiceless !== undefined && (
          <Text style={styles.hintText}>
            • {voiceless ? t('components.miniReview.voiceless', '清音 (voiceless)') : t('components.miniReview.voiced', '浊音 (voiced)')}
          </Text>
        )}
        {consonantClass && (
          <Text style={styles.hintText}>
            • {t('components.miniReview.consonantClass', '辅音类')}: {
              consonantClass === 'high' ? t('components.miniReview.highClass', '高辅音') :
                consonantClass === 'mid' ? t('components.miniReview.midClass', '中辅音') :
                  t('components.miniReview.lowClass', '低辅音')
            }
          </Text>
        )}
      </View>
    );
  };

  // ===== 渲染音高可视化 =====
  const renderPitchVisualization = () => {
    if (!question.pitchVisualization?.enable) return null;
    if (!answered && !question.pitchVisualization.showAfterAnswer) return null;

    const { curve } = question.pitchVisualization;

    return (
      <View style={styles.pitchContainer}>
        <Text style={styles.pitchTitle}>{t('components.miniReview.pitchCurve', '🎵 音高曲线')}</Text>
        <View style={styles.pitchChart}>
          {curve.map((height, index) => (
            <View
              key={index}
              style={[
                styles.pitchBar,
                { height: `${(height / 5) * 100}%` },
              ]}
            />
          ))}
        </View>
      </View>
    );
  };

  // ===== 判断题型是否需要音频 =====
  const needsAudio = [
    'sound-to-letter',
    'aspirated-contrast',
    'vowel-length-contrast',
    'tone-perception',
  ].includes(question.type);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* 题型标题 */}
      <View style={styles.header}>
        <Text style={styles.typeIcon}>
          {QUESTION_TYPE_ICONS[question.type] || '📝'}
        </Text>
        <Text style={styles.typeLabel}>
          {t(QUESTION_TYPE_LABELS[question.type])}
        </Text>
      </View>

      {/* 题干 */}
      <Text style={styles.question}>{t(question.question)}</Text>

      {/* 副标题 */}
      {question.subtitle && (
        <Text style={styles.subtitle}>{t(question.subtitle)}</Text>
      )}

      {/* 音频播放按钮 */}
      {needsAudio && question.audioUrl && (
        <TouchableOpacity
          style={styles.audioButton}
          onPress={handlePlayAudio}
          disabled={isPlaying}
          accessibilityRole="button"
          accessibilityLabel="播放发音"
        >
          {isPlaying ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <>
              <Volume2 size={20} color={Colors.white} />
              <Text style={styles.audioButtonText}>{t('components.miniReview.playSound', '播放发音')}</Text>
            </>
          )}
        </TouchableOpacity>
      )}

      {/* 声学提示(答题前显示) */}
      {!answered && renderAcousticHint()}

      {/* 选项 */}
      <View style={styles.optionsContainer}>
        {question.options.map((option, index) => {
          const isSelected = selectedOption === option.value;
          const isCorrect = answered && option.value === question.correct;
          const isWrong = answered && isSelected && option.value !== question.correct;

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                isSelected && styles.optionSelected,
                isCorrect && styles.optionCorrect,
                isWrong && styles.optionWrong,
              ]}
              onPress={() => handleSelectOption(option.value)}
              disabled={answered}
              accessibilityRole="radio"
              accessibilityLabel={option.label}
              accessibilityState={{ selected: isSelected }}
            >
              <View style={styles.optionContent}>
                <Text
                  style={[
                    styles.optionLabel,
                    isSelected && styles.optionLabelSelected,
                  ]}
                >
                  {t(option.label)}
                </Text>
                {option.example && (
                  <Text style={styles.optionExample}>{t(option.example)}</Text>
                )}
              </View>
              {answered && (
                <Text style={styles.feedbackIcon}>
                  {isCorrect ? '✓' : isWrong ? '✗' : ''}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 解释(答题后显示) */}
      {answered && question.explanation && (
        <View style={styles.explanationContainer}>
          <Text style={styles.explanationText}>
            💡 {t(question.explanation)}
          </Text>
        </View>
      )}

      {/* 音高可视化(答题后显示) */}
      {answered && renderPitchVisualization()}

      {/* 下一题按钮 */}
      {answered && (
        <TouchableOpacity
          style={styles.nextButton}
          onPress={onNext}
          accessibilityRole="button"
          accessibilityLabel={t('alphabet.nextQuestion', '下一题 →')}
        >
          <Text style={styles.nextButtonText}>{t('alphabet.nextQuestion', '下一题 →')}</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

// ==================== 样式 ====================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.paper,
  },
  contentContainer: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  typeIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  typeLabel: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 18,
    color: Colors.ink,
  },
  question: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 20,
    color: Colors.ink,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 14,
    color: Colors.taupe,
    textAlign: 'center',
    marginBottom: 20,
  },
  audioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.thaiGold,
    borderRadius: 12,
    padding: 14,
    marginBottom: 24,
    minHeight: 50,
  },
  audioButtonText: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 16,
    color: Colors.white,
    marginLeft: 8,
  },
  hintContainer: {
    backgroundColor: '#FFF9E6',
    borderLeftWidth: 4,
    borderLeftColor: Colors.thaiGold,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  hintTitle: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 14,
    color: Colors.ink,
    marginBottom: 8,
  },
  hintText: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 13,
    color: Colors.taupe,
    marginBottom: 4,
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.sand,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 60,
  },
  optionSelected: {
    borderColor: Colors.thaiGold,
    backgroundColor: '#FFF9E6',
  },
  optionCorrect: {
    borderColor: '#2A9D8F',
    backgroundColor: '#E8F5F3',
  },
  optionWrong: {
    borderColor: '#E63946',
    backgroundColor: '#FFE8EA',
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 18,
    color: Colors.ink,
  },
  optionLabelSelected: {
    color: Colors.thaiGold,
  },
  optionExample: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 12,
    color: Colors.taupe,
    marginTop: 4,
  },
  feedbackIcon: {
    fontSize: 24,
    marginLeft: 12,
  },
  explanationContainer: {
    backgroundColor: '#F0F8FF',
    borderLeftWidth: 4,
    borderLeftColor: '#457B9D',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  explanationText: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.ink,
  },
  pitchContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  pitchTitle: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 14,
    color: Colors.ink,
    marginBottom: 12,
    textAlign: 'center',
  },
  pitchChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 100,
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 12,
  },
  pitchBar: {
    width: 40,
    backgroundColor: Colors.thaiGold,
    borderRadius: 4,
  },
  nextButton: {
    backgroundColor: Colors.thaiGold,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  nextButtonText: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 16,
    color: Colors.white,
  },
});