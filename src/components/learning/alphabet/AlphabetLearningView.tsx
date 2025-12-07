// src/components/learning/alphabet/AlphabetLearningView.tsx

import React, { memo, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import type { AlphabetLearningState } from '@/src/stores/alphabetStore';

interface AlphabetLearningViewProps {
  alphabet: AlphabetLearningState;
  onNext: () => void;
}

export const AlphabetLearningView = memo(function AlphabetLearningView({
  alphabet,
  onNext,
}: AlphabetLearningViewProps) {
  const handlePlay = useCallback(() => {
    // 播放音频（后续你会改成 expo-av 或后端真实 url）
    console.log('Playing audio for:', alphabet.audioPath);
  }, [alphabet.audioPath]);

  return (
    <View style={styles.container}>
      {/* 主字母 */}
      <Text style={styles.letter}>{alphabet.thaiChar}</Text>

      {/* 字母发音 */}
      <Text style={styles.pronunciation}>{alphabet.pronunciation}</Text>

      {/* 例词 */}
      {alphabet.example ? (
        <Text style={styles.example}>例词：{alphabet.example}</Text>
      ) : null}

      {/* 播音按钮 */}
      <TouchableOpacity style={styles.audioButton} onPress={handlePlay}>
        <Text style={styles.audioText}>🔊 播放发音</Text>
      </TouchableOpacity>

      {/* 下一题 */}
      <TouchableOpacity style={styles.nextButton} onPress={onNext}>
        <Text style={styles.nextText}>继续</Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  letter: {
    fontSize: 100,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  pronunciation: {
    fontSize: 28,
    marginBottom: 8,
  },
  example: {
    fontSize: 18,
    color: '#666',
    marginBottom: 24,
  },
  audioButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    marginBottom: 20,
  },
  audioText: {
    color: 'white',
    fontSize: 18,
  },
  nextButton: {
    paddingVertical: 14,
    paddingHorizontal: 26,
    backgroundColor: '#333',
    borderRadius: 8,
  },
  nextText: {
    color: 'white',
    fontSize: 20,
  },
});
