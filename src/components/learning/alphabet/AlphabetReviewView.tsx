// src/components/learning/alphabet/AlphabetReviewView.tsx

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Audio } from 'expo-av';

import type { AlphabetLearningState } from '@/src/stores/alphabetStore';
import type { Letter } from '@/src/entities/types/letter.types';
import { QuestionType } from '@/src/entities/enums/QuestionType.enum'; // ✅ 统一导入
import { generateAlphabetQuestion } from '@/src/utils/lettersQuestionGenerator';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';

interface AlphabetReviewViewProps {
  alphabet: AlphabetLearningState;
  letterPool?: Letter[];
  preferredType?: QuestionType;
  onAnswer: (isCorrect: boolean, questionType: QuestionType) => void;
  onNext: () => void;
  onBack?: () => void;
}

export function AlphabetReviewView({
  alphabet,
  letterPool,
  preferredType,
  onAnswer,
  onNext,
  onBack,
}: AlphabetReviewViewProps) {
  const [answered, setAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);

  // ✅ 生成题目
  const question = generateAlphabetQuestion(
    alphabet.letter,
    letterPool || [],
    preferredType
  );

  // ✅ 修复: 获取音频URL
  const audioUrl = question.audioUrl || alphabet.audioUrl;

  // ✅ 清理音频
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
        soundRef.current = null;
      }
    };
  }, []);

  // ✅ 播放音频
  const handlePlayAudio = useCallback(async () => {
    if (!audioUrl) return;

    try {
      setIsPlaying(true);

      if (soundRef.current) {
        await soundRef.current.replayAsync();
        setIsPlaying(false);
        return;
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true }
      );

      soundRef.current = sound;

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    } catch (error) {
      console.warn('[AlphabetReview] 播放失败:', error);
      setIsPlaying(false);
    }
  }, [audioUrl]);

  // ✅ 选择答案
  const handleSelectOption = useCallback(
    (option: string) => {
      if (answered) return;

      setSelectedOption(option);
      setAnswered(true);

      const isCorrect = option === question.correct;
      onAnswer(isCorrect, question.type);
    },
    [answered, question.correct, question.type, onAnswer]
  );

  // ✅ 渲染题目标题
  const renderQuestionTitle = (type: QuestionType) => {
    const titles: Record<QuestionType, string> = {
      [QuestionType.SOUND_TO_LETTER]: '🔊 听音选字母',
      [QuestionType.LETTER_TO_SOUND]: '👁️ 看字母选发音',
      [QuestionType.SYLLABLE]: '🔤 拼读组合',
      [QuestionType.REVERSE_SYLLABLE]: '🔄 音素分离',
      [QuestionType.MISSING_LETTER]: '❓ 缺字填空',
      [QuestionType.ASPIRATED_CONTRAST]: '💨 送气音对比',
      [QuestionType.VOWEL_LENGTH_CONTRAST]: '⏱️ 元音长短对比',
      [QuestionType.FINAL_CONSONANT]: '🔚 尾音规则',
      [QuestionType.TONE_PERCEPTION]: '🎵 声调听辨',
      [QuestionType.CLASS_CHOICE]: '📊 辅音分类',
      [QuestionType.LETTER_NAME]: '📝 字母名称',
    };

    return titles[type] || '❓ 题目';
  };

  // ✅ 判断是否需要音频
  const needsAudio = [
    QuestionType.SOUND_TO_LETTER,
    QuestionType.LETTER_TO_SOUND,
    QuestionType.SYLLABLE,
  ].includes(question.type);

  return (
    <View style={styles.container}>
      {/* 题型标题 */}
      <Text style={styles.typeLabel}>{renderQuestionTitle(question.type)}</Text>

      {/* 题干 */}
      <Text style={styles.question}>{question.stem}</Text>

      {/* 音频按钮 */}
      {needsAudio && audioUrl && (
        <TouchableOpacity
          style={styles.audioButton}
          onPress={handlePlayAudio}
          disabled={isPlaying}
        >
          {isPlaying ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <Text style={styles.audioButtonText}>🔊 播放发音</Text>
          )}
        </TouchableOpacity>
      )}

      {/* 选项 */}
      <View style={styles.optionsContainer}>
        {question.options.map((option, index) => {
          const isSelected = selectedOption === option;
          const isCorrect = answered && option === question.correct;
          const isWrong = answered && isSelected && option !== question.correct;

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                isSelected && styles.optionSelected,
                isCorrect && styles.optionCorrect,
                isWrong && styles.optionWrong,
              ]}
              onPress={() => handleSelectOption(option)}
              disabled={answered}
            >
              <Text style={styles.optionText}>{option}</Text>
              {answered && (
                <Text style={styles.feedbackIcon}>
                  {isCorrect ? '✓' : isWrong ? '✗' : ''}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 下一题按钮 */}
      {answered && (
        <TouchableOpacity style={styles.nextButton} onPress={onNext}>
          <Text style={styles.nextButtonText}>下一题 →</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: Colors.paper,
  },
  typeLabel: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 16,
    color: Colors.taupe,
    marginBottom: 12,
    textAlign: 'center',
  },
  question: {
    fontFamily: Typography.playfairBold,
    fontSize: 24,
    color: Colors.ink,
    marginBottom: 24,
    textAlign: 'center',
  },
  audioButton: {
    backgroundColor: Colors.thaiGold,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  audioButtonText: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 16,
    color: Colors.white,
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
  optionText: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 18,
    color: Colors.ink,
  },
  feedbackIcon: {
    fontSize: 24,
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