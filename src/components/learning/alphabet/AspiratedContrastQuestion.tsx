// src/components/learning/alphabet/AspiratedContrastQuestion.tsx

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Audio } from 'expo-av';
import { Wind } from 'lucide-react-native';

import type { Letter } from '@/src/entities/types/letter.types';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';

// ==================== Props 接口 ====================

interface AspiratedContrastQuestionProps {
  /** 目标字母 */
  target: Letter;

  /** 对比字母组(最小对立组) */
  contrasts: Letter[];

  /** 答题回调 */
  onAnswer: (isCorrect: boolean) => void;

  /** 下一题回调 */
  onNext: () => void;
}

// ==================== 主组件 ====================

export function AspiratedContrastQuestion({
  target,
  contrasts,
  onAnswer,
  onNext,
}: AspiratedContrastQuestionProps) {
  const { t } = useTranslation();
  const [answered, setAnswered] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [isPlayingTarget, setIsPlayingTarget] = useState(false);
  const [isPlayingContrast, setIsPlayingContrast] = useState<string | null>(null);

  const soundRef = useRef<Audio.Sound | null>(null);

  // 所有选项(目标字母+对比字母)
  const allOptions = [target, ...contrasts];

  // ===== 清理音频 =====
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => { });
        soundRef.current = null;
      }
    };
  }, []);

  // ===== 播放音频 =====
  const playAudio = useCallback(async (audioUrl: string, letterId: string) => {
    try {
      if (letterId === target._id) {
        setIsPlayingTarget(true);
      } else {
        setIsPlayingContrast(letterId);
      }

      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true }
      );

      soundRef.current = sound;

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlayingTarget(false);
          setIsPlayingContrast(null);
        }
      });
    } catch (error) {
      console.warn('[AspiratedContrast] 播放失败:', error);
      setIsPlayingTarget(false);
      setIsPlayingContrast(null);
    }
  }, [target._id]);

  // ===== 选择答案 =====
  const handleSelectLetter = useCallback(
    (letter: Letter) => {
      if (answered) return;

      setSelectedLetter(letter._id);
      setAnswered(true);

      const isCorrect = letter._id === target._id;
      onAnswer(isCorrect);
    },
    [answered, target._id, onAnswer]
  );

  // ===== 判断是否送气 =====
  const isAspirated = (letter: Letter): boolean => {
    return letter.initialSound.includes('h');
  };

  return (
    <View style={styles.container}>
      {/* 题型标题 */}
      <View style={styles.header}>
        <Wind size={24} color={Colors.thaiGold} />
        <Text style={styles.title}>{t('components.aspirated.title', '送气音对比训练')}</Text>
      </View>

      {/* 说明 */}
      <Text style={styles.instruction}>
        {t('components.aspirated.instruction', '🔊 先播放目标音频,然后从下方选项中选择对应的字母')}
      </Text>

      {/* 目标音频播放 */}
      <TouchableOpacity
        style={styles.targetAudioButton}
        onPress={() => {
          const audioUrl =
            target.fullSoundUrl ||
            target.letterPronunciationUrl ||
            target.audioPath ||
            '';
          playAudio(audioUrl, target._id);
        }}
        disabled={isPlayingTarget}
        accessibilityRole="button"
        accessibilityLabel={t('components.aspirated.playTarget', '播放目标发音')}
      >
        {isPlayingTarget ? (
          <ActivityIndicator size="small" color={Colors.white} />
        ) : (
          <>
            <Text style={styles.targetAudioIcon}>🔊</Text>
            <Text style={styles.targetAudioText}>{t('components.aspirated.playTarget', '播放目标发音')}</Text>
          </>
        )}
      </TouchableOpacity>

      {/* 提示卡片 */}
      <View style={styles.hintCard}>
        <Text style={styles.hintTitle}>{t('components.aspirated.tipsTitle', '💡 区分技巧')}</Text>
        <Text style={styles.hintText}>
          • {t('components.aspirated.aspiratedDesc', '送气音: 发音时有明显气流')} (如 ข ถ ผ)
        </Text>
        <Text style={styles.hintText}>
          • {t('components.aspirated.unaspiratedDesc', '不送气音: 发音时气流较弱')} (如 ก ด บ)
        </Text>
        <Text style={styles.hintText}>
          • 用手放在嘴前感受气流强度!
        </Text>
      </View>

      {/* 选项(最小对立组) */}
      <View style={styles.optionsContainer}>
        {allOptions.map((letter) => {
          const isSelected = selectedLetter === letter._id;
          const isCorrect = answered && letter._id === target._id;
          const isWrong = answered && isSelected && letter._id !== target._id;
          const isPlaying = isPlayingContrast === letter._id;

          return (
            <View key={letter._id} style={styles.optionWrapper}>
              {/* 字母卡片 */}
              <TouchableOpacity
                style={[
                  styles.optionCard,
                  isSelected && styles.optionSelected,
                  isCorrect && styles.optionCorrect,
                  isWrong && styles.optionWrong,
                ]}
                onPress={() => handleSelectLetter(letter)}
                disabled={answered}
                accessibilityRole="radio"
                accessibilityLabel={`字母 ${letter.thaiChar}`}
                accessibilityState={{ selected: isSelected }}
              >
                <Text style={styles.optionChar}>{letter.thaiChar}</Text>
                <Text style={styles.optionName}>{letter.nameThai}</Text>

                {/* 送气标识 */}
                {isAspirated(letter) && (
                  <View style={styles.aspiratedBadge}>
                    <Wind size={12} color={Colors.thaiGold} />
                    <Text style={styles.aspiratedText}>{t('components.aspirated.aspirated', '送气')}</Text>
                  </View>
                )}

                {/* 反馈图标 */}
                {answered && (
                  <View style={styles.feedbackIcon}>
                    {isCorrect && <Text style={styles.correctIcon}>✓</Text>}
                    {isWrong && <Text style={styles.wrongIcon}>✗</Text>}
                  </View>
                )}
              </TouchableOpacity>

              {/* 播放对比音频按钮 */}
              <TouchableOpacity
                style={styles.playContrastButton}
                onPress={() => {
                  const audioUrl =
                    letter.fullSoundUrl ||
                    letter.letterPronunciationUrl ||
                    letter.audioPath ||
                    '';
                  playAudio(audioUrl, letter._id);
                }}
                disabled={isPlaying}
                accessibilityRole="button"
                accessibilityLabel={`播放 ${letter.thaiChar} 的发音`}
              >
                {isPlaying ? (
                  <ActivityIndicator size="small" color={Colors.thaiGold} />
                ) : (
                  <Text style={styles.playContrastIcon}>▶</Text>
                )}
              </TouchableOpacity>
            </View>
          );
        })}
      </View>

      {/* 解释(答题后) */}
      {answered && (
        <View style={styles.explanationCard}>
          <Text style={styles.explanationText}>
            {t('components.aspirated.correctAns', '✅ 正确答案')}: {target.thaiChar} ({target.nameThai})
            {'\n'}
            {isAspirated(target)
              ? t('components.aspirated.aspiratedDesc', '这是一个送气音,发音时有明显气流')
              : t('components.aspirated.unaspiratedDesc', '这是一个不送气音,发音时气流较弱')}
          </Text>
        </View>
      )}

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
    </View>
  );
}

// ==================== 样式 ====================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: Colors.paper,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: Typography.playfairBold,
    fontSize: 22,
    color: Colors.ink,
    marginLeft: 12,
  },
  instruction: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 14,
    color: Colors.taupe,
    textAlign: 'center',
    marginBottom: 20,
  },
  targetAudioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.thaiGold,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    minHeight: 56,
  },
  targetAudioIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  targetAudioText: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 16,
    color: Colors.white,
  },
  hintCard: {
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
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
    gap: 16,
    marginBottom: 20,
  },
  optionWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.sand,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    minHeight: 100,
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
  optionChar: {
    fontFamily: Typography.playfairBold,
    fontSize: 48,
    color: Colors.ink,
    marginBottom: 8,
  },
  optionName: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 14,
    color: Colors.taupe,
  },
  aspiratedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 8,
  },
  aspiratedText: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 10,
    color: Colors.thaiGold,
    marginLeft: 4,
  },
  feedbackIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  correctIcon: {
    fontSize: 24,
    color: '#2A9D8F',
  },
  wrongIcon: {
    fontSize: 24,
    color: '#E63946',
  },
  playContrastButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.thaiGold,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playContrastIcon: {
    fontSize: 16,
    color: Colors.thaiGold,
  },
  explanationCard: {
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  explanationText: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.ink,
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