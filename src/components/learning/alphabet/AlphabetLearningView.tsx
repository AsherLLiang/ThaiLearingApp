// src/components/learning/alphabet/AlphabetLearningView.tsx

import React, { memo, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';

import type { AlphabetLearningState } from '@/src/stores/alphabetStore';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';

interface AlphabetLearningViewProps {
  alphabet: AlphabetLearningState;
  onNext: () => void;
  onBack?: () => void;
}

export const AlphabetLearningView = memo(function AlphabetLearningView({
  alphabet,
  onNext,
  onBack,
}: AlphabetLearningViewProps) {
  const handlePlay = useCallback(() => {
    // 播放音频（后续你会改成 expo-av 或后端真实 url）
    console.log('Playing audio for:', alphabet.audioUrl);
  }, [alphabet.audioUrl]);

  const nameEnglish = alphabet.letter?.nameEnglish;
  const nameThai = alphabet.letter?.nameThai;

  return (
    <View style={styles.container}>
      {/* 返回按钮 */}
      {onBack && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
        >
          <ArrowLeft size={24} color={Colors.ink} />
        </TouchableOpacity>
      )}

      {/* 顶部标题栏 */}
      <View style={styles.topHeader}>
        <Text style={styles.topHeaderText}>
          学习字母：{alphabet.thaiChar}
        </Text>
      </View>

      {/* 中心内容 */}
      <View style={styles.content}>
        {/* 超大字母 */}
        <Text style={styles.letter}>{alphabet.thaiChar}</Text>

        {/* 英文名 / 泰文名 */}
        {nameEnglish ? (
          <Text style={styles.nameEnglish}>{nameEnglish}</Text>
        ) : null}
        {nameThai ? (
          <Text style={styles.nameThai}>{nameThai}</Text>
        ) : null}

        {/* 发音行 */}
        {alphabet.pronunciation ? (
          <View style={styles.pronunciationBlock}>
            <Text style={styles.pronunciationText}>
              /{alphabet.pronunciation}/
              <Text style={styles.pronunciationHint}>（发音）</Text>
            </Text>

            <TouchableOpacity style={styles.audioButton} onPress={handlePlay}>
              <Text style={styles.audioButtonText}>🔊 播放发音</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* 例词 */}
        {alphabet.example ? (
          <Text style={styles.exampleText}>例词：{alphabet.example}</Text>
        ) : null}
      </View>

      {/* 底部分割线 + 继续按钮 */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomDivider} />
        <View style={styles.bottomButtonRow}>
          <View style={{ flex: 1 }} />
          <TouchableOpacity style={styles.nextButton} onPress={onNext}>
            <Text style={styles.nextButtonText}>继续 →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
    backgroundColor: Colors.paper,
  },
  backButton: {
    position: 'absolute',
    top: 24,
    left: 24,
    zIndex: 10,
    padding: 8,
  },
  topHeader: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.sand,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 32,
  },
  topHeaderText: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 18,
    color: Colors.ink,
  },
  content: {
    flex: 1,
    alignItems: 'center',
  },
  letter: {
    fontFamily: Typography.playfairBold,
    fontSize: 88,
    color: Colors.ink,
    marginBottom: 12,
  },
  nameEnglish: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 16,
    color: Colors.taupe,
    marginBottom: 4,
  },
  nameThai: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 18,
    color: Colors.ink,
    marginBottom: 16,
  },
  pronunciationBlock: {
    alignItems: 'center',
    marginBottom: 20,
  },
  pronunciationText: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 18,
    color: Colors.ink,
    marginBottom: 8,
  },
  pronunciationHint: {
    fontSize: 14,
    color: Colors.taupe,
  },
  audioButton: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 999,
    backgroundColor: Colors.ink,
  },
  audioButtonText: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 14,
    color: Colors.white,
  },
  exampleText: {
    marginTop: 8,
    fontFamily: Typography.notoSerifRegular,
    fontSize: 16,
    color: Colors.ink,
  },
  bottomBar: {
    marginTop: 32,
  },
  bottomDivider: {
    height: 1,
    backgroundColor: Colors.sand,
    marginBottom: 16,
  },
  bottomButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: Colors.thaiGold,
  },
  nextButtonText: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 16,
    color: Colors.white,
  },
});
