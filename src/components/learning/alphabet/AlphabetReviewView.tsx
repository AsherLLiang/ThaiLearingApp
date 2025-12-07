// src/components/learning/alphabet/AlphabetReviewView.tsx

import React, {
  memo,
  useCallback,
  useState,
  useEffect,
  useRef,
} from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { Audio } from 'expo-av';

import type { AlphabetLearningState } from '@/src/stores/alphabetStore';
import type { Letter } from '@/src/entities/types/letter.types';
import type { QuestionType } from '@/src/hooks/useAlphabetLearningEngine';

import {
  generateAlphabetQuestion,
  type AlphabetQuestion,
} from '@/src/utils/lettersQuestionGenerator';
  
  interface AlphabetReviewViewProps {
    alphabet: AlphabetLearningState;
    /**
     * 可选：全部字母池，用于生成干扰项
     * 如果不传，组件会自动降级为简单题目（选项较少）
     */
    letterPool?: Letter[];
    /**
     * 可选：由引擎传入的优先题型（带权重）
     * 如果不传，则退化为 questionGenerator 内部的随机题型
     */
    preferredType?: QuestionType;
    onAnswer: (isCorrect: boolean, type: QuestionType) => void;
    onNext: () => void;
    onBack?: () => void;
  }
  
export const AlphabetReviewView = memo(function AlphabetReviewView({
  alphabet,
  letterPool,
  preferredType,
  onAnswer,
  onNext,
  onBack,
}: AlphabetReviewViewProps) {
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  // 当前题目（AlphabetQuestion）
  const [question, setQuestion] = useState<AlphabetQuestion | null>(null);

  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
        soundRef.current = null;
      }
    };
  }, []);

  // 每当 alphabet 变化时，重新生成一题
  useEffect(() => {
    const letter = alphabet.letter;

    if (!letter) {
      // 降级策略：只用当前字母做一个简单的 letter-to-sound 题
      const simpleQuestion: AlphabetQuestion = {
        type: 'letter-to-sound',
        stem: alphabet.thaiChar,
        options: [alphabet.pronunciation],
        correct: alphabet.pronunciation,
      };
      setQuestion(simpleQuestion);
      setAnswered(false);
      setSelected(null);
      return;
    }

    const pool = letterPool || [];
    const q = generateAlphabetQuestion(letter, pool, preferredType);
    setQuestion(q);
    setAnswered(false);
    setSelected(null);
  }, [
    alphabet.alphabetId,
    alphabet.letter,
    alphabet.thaiChar,
    alphabet.pronunciation,
    letterPool,
    preferredType,
  ]);
  
  const handlePlay = useCallback(async () => {
    if (!alphabet.audioUrl) return;

    try {
      if (soundRef.current) {
        await soundRef.current.replayAsync();
        return;
      }
      const { sound } = await Audio.Sound.createAsync(
        { uri: alphabet.audioUrl },
        { shouldPlay: true },
      );
      soundRef.current = sound;
    } catch (e) {
      console.warn('播放字母音频失败:', e);
    }
  }, [alphabet.audioUrl]);

  const handleSelect = useCallback(
    (option: string) => {
      if (!question || answered) return;

      setSelected(option);
      setAnswered(true);

      const isCorrect = option === question.correct;

      // 通知引擎：这一题是否正确，属于哪一种题型
      onAnswer(isCorrect, question.type);
    },
    [answered, onAnswer, question],
  );

  const handleNext = useCallback(() => {
    setSelected(null);
    setAnswered(false);
    onNext();
  }, [onNext]);

  if (!question) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>加载题目中...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 返回按钮 */}
      {onBack && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
        >
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
      )}

      {/* 题型标题 */}
      <Text style={styles.title}>
        {renderQuestionTitle(question.type)}
      </Text>

      {/* 题干 + 听音按钮（仅 sound-to-letter 时显示） */}
      <Text style={styles.stem}>{question.stem}</Text>
      {question.type === 'sound-to-letter' && !!alphabet.audioUrl && (
        <TouchableOpacity style={styles.audioButton} onPress={handlePlay}>
          <Text style={styles.audioText}>🔊 播放发音</Text>
        </TouchableOpacity>
      )}

      {/* 选项 */}
      <View style={styles.optionsContainer}>
        {question.options.map((op) => {
          const isSelected = selected === op;
          const isCorrect = answered && op === question.correct;
          const isWrong = answered && op === selected && op !== question.correct;

          return (
            <TouchableOpacity
              key={op}
              style={[
                styles.optionButton,
                isSelected && styles.optionSelected,
                isCorrect && styles.optionCorrect,
                isWrong && styles.optionWrong,
              ]}
              onPress={() => handleSelect(op)}
              disabled={answered}
            >
              <Text style={styles.optionText}>{op}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 下一题按钮 */}
      {answered && (
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextText}>下一题</Text>
        </TouchableOpacity>
      )}
    </View>
  );
});
  
  // --------- UI 文案辅助 ---------
  
  function renderQuestionTitle(type: QuestionType): string {
    switch (type) {
      case 'sound-to-letter':
        return '听音选字母';
      case 'letter-to-sound':
        return '看字母选发音';
      case 'syllable':
        return '拼读题';
      case 'reverse-syllable':
        return '反向拼读题';
      case 'missing-letter':
        return '缺字填空';
      case 'final-consonant':
        return '尾辅音规则';
      case 'tone-choice':
        return '声调选择';
      case 'class-choice':
        return '辅音分类';
      case 'keyboard-key':
        return '键盘位置题';
      case 'letter-name':
        return '字母名称识别';
      default:
        return '复习题';
    }
  }
  
  // --------- 样式 ---------
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    backButton: {
      position: 'absolute',
      top: 24,
      left: 24,
      zIndex: 10,
      padding: 8,
    },
    title: {
      fontSize: 24,
      marginBottom: 12,
    },
    stem: {
      fontSize: 22,
      marginBottom: 20,
      textAlign: 'center',
    },
    optionsContainer: {
      width: '100%',
      marginTop: 12,
    },
    audioButton: {
      marginTop: 8,
      marginBottom: 4,
      paddingVertical: 8,
      paddingHorizontal: 18,
      borderRadius: 999,
      backgroundColor: '#333',
    },
    audioText: {
      color: '#fff',
      fontSize: 14,
    },
    optionButton: {
      paddingVertical: 14,
      paddingHorizontal: 20,
      backgroundColor: '#eee',
      borderRadius: 8,
      marginBottom: 12,
    },
    optionSelected: {
      borderWidth: 1,
      borderColor: '#4A90E2',
    },
    optionCorrect: {
      backgroundColor: '#4CAF50',
    },
    optionWrong: {
      backgroundColor: '#E53935',
    },
    optionText: {
      fontSize: 20,
    },
    nextButton: {
      marginTop: 24,
      paddingVertical: 14,
      paddingHorizontal: 28,
      backgroundColor: '#333',
      borderRadius: 8,
    },
    nextText: {
      color: '#fff',
      fontSize: 20,
    },
  });
  
