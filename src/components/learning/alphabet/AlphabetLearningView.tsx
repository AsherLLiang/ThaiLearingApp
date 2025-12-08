// src/components/learning/alphabet/AlphabetLearningView.tsx

import React, { memo, useCallback, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { Audio } from 'expo-av';

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
  const soundRef = useRef<Audio.Sound | null>(null);
  const audioModeConfiguredRef = useRef(false);

  const letter = alphabet.letter;

  const lessonOrder = letter.primaryCurriculumLessonOrder;

  const thaiChar = letter.thaiChar;
  const nameEnglish = letter.nameEnglish;

  const syllableSoundName = letter.syllableSoundName;

  const initialSound = letter.initialSound;
  const finalSound = letter.finalSound;

  const exampleWord = letter.exampleWord;
  const exampleMeaning = letter.exampleMeaning;
  const keyboardKey = letter.keyboardKey;

  const fullSoundLocalPath = letter.fullSoundLocalPath;
  const coreSyllableLocalPath = letter.syllableSoundLocalPath;
  const endSyllableSoundLocalPath = letter.endSyllableSoundLocalPath;
  const exampleWordLocalPath = letter.letterPronunciationLocalPath;

  useEffect(() => {
    // 调试：首屏打印当前字母的音频相关字段
    // 便于确认本地路径是否已经写入
    // eslint-disable-next-line no-console
    console.log('🔍 AlphabetLearningView mounted for letter:', {
      id: letter._id,
      thaiChar,
      fullSoundUrl: letter.fullSoundUrl,
      fullSoundLocalPath,
      syllableSoundUrl: letter.syllableSoundUrl,
      syllableSoundLocalPath: coreSyllableLocalPath,
      endSyllableSoundUrl: letter.endSyllableSoundUrl,
      endSyllableSoundLocalPath,
      letterPronunciationUrl: letter.letterPronunciationUrl,
      letterPronunciationLocalPath: exampleWordLocalPath,
      alphabetAudioUrl: alphabet.audioUrl,
    });

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
        soundRef.current = null;
      }
    };
  }, []);

  const playLocalAudio = useCallback(async (localPath?: string | null) => {
    if (!localPath || !localPath.startsWith('file://')) {
      // eslint-disable-next-line no-console
      console.warn('⚠️ playLocalAudio 被调用，但本地路径无效:', localPath);
      return;
    }

    try {
      if (!audioModeConfiguredRef.current) {
        try {
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            playsInSilentModeIOS: true,
            staysActiveInBackground: false,
            shouldDuckAndroid: true,
            playThroughEarpieceAndroid: false,
          });
          audioModeConfiguredRef.current = true;
          // eslint-disable-next-line no-console
          console.log('🎚 已配置音频模式');
        } catch (modeError) {
          console.warn('⚠️ 配置音频模式失败:', modeError);
        }
      }

      // eslint-disable-next-line no-console
      console.log('▶ 播放本地音频:', localPath);
      if (soundRef.current) {
        await soundRef.current.unloadAsync().catch(() => {});
        soundRef.current = null;
      }

      const { sound } = await Audio.Sound.createAsync({ uri: localPath });
      soundRef.current = sound;
      await sound.playAsync();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('❌ 播放字母音频失败:', e);
    }
  }, []);

  const resolveAudioPath = useCallback(
    (primary?: string | null) => {
      if (primary && primary.startsWith('file://')) {
        // eslint-disable-next-line no-console
        console.log('✅ resolveAudioPath 使用 primary 本地路径:', primary);
        return primary;
      }

      if (alphabet.audioUrl && alphabet.audioUrl.startsWith('file://')) {
        // eslint-disable-next-line no-console
        console.log(
          '✅ resolveAudioPath 回退使用 alphabet.audioUrl:',
          alphabet.audioUrl,
        );
        return alphabet.audioUrl;
      }

      // eslint-disable-next-line no-console
      console.warn('⚠️ resolveAudioPath 未找到可用本地路径', {
        primary,
        audioUrl: alphabet.audioUrl,
      });
      return null;
    },
    [alphabet.audioUrl],
  );

  const handlePlayFullLetter = useCallback(() => {
    // eslint-disable-next-line no-console
    console.log('👆 点击：播放字母完整发音');
    const path = resolveAudioPath(fullSoundLocalPath);
    // eslint-disable-next-line no-console
    console.log('   ▶ 计算得到路径(full):', path);
    void playLocalAudio(path);
  }, [fullSoundLocalPath, resolveAudioPath, playLocalAudio]);

  const handlePlayCoreSyllable = useCallback(() => {
    // eslint-disable-next-line no-console
    console.log('👆 点击：播放音节核心音');
    const path = resolveAudioPath(coreSyllableLocalPath);
    // eslint-disable-next-line no-console
    console.log('   ▶ 计算得到路径(core syllable):', path);
    void playLocalAudio(path);
  }, [coreSyllableLocalPath, resolveAudioPath, playLocalAudio]);

  const handlePlayEndSyllable = useCallback(() => {
    // eslint-disable-next-line no-console
    console.log('👆 点击：播放尾音节');
    const path = resolveAudioPath(
      endSyllableSoundLocalPath || coreSyllableLocalPath,
    );
    // eslint-disable-next-line no-console
    console.log('   ▶ 计算得到路径(end syllable):', path);
    void playLocalAudio(path);
  }, [
    endSyllableSoundLocalPath,
    coreSyllableLocalPath,
    resolveAudioPath,
    playLocalAudio,
  ]);

  const handlePlayExampleWord = useCallback(() => {
    // eslint-disable-next-line no-console
    console.log('👆 点击：播放示例单词');
    const path = resolveAudioPath(
      exampleWordLocalPath || fullSoundLocalPath || coreSyllableLocalPath,
    );
    // eslint-disable-next-line no-console
    console.log('   ▶ 计算得到路径(example word):', path);
    void playLocalAudio(path);
  }, [
    exampleWordLocalPath,
    fullSoundLocalPath,
    coreSyllableLocalPath,
    resolveAudioPath,
    playLocalAudio,
  ]);

  const renderLessonHeader = () => {
    if (!lessonOrder) {
      return null;
    }

    return (
      <View style={styles.lessonHeader}>
        <Text style={styles.lessonHeaderText}>Lesson {lessonOrder}</Text>
      </View>
    );
  };

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

      {/* 顶部标题栏：课程 + 字母 */}
      {renderLessonHeader()}
      <View style={styles.topHeader}>
        <Text style={styles.topHeaderText}>学习字母：{thaiChar}</Text>
      </View>

      {/* 中心内容 */}
      <View style={styles.content}>
        {/* 字母主展示区域 */}
        <View style={styles.mainLetterBlock}>
          <Text style={styles.letter}>{thaiChar}</Text>

          {(nameEnglish || exampleWord) && (
            <View style={styles.nameBlock}>
              {nameEnglish && (
                <Text style={styles.nameEnglish}>{nameEnglish}</Text>
              )}
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.audioButton,
              !resolveAudioPath(fullSoundLocalPath) && styles.audioButtonDisabled,
            ]}
            disabled={!resolveAudioPath(fullSoundLocalPath)}
            onPress={handlePlayFullLetter}
          >
            <Text style={styles.audioButtonText}>▶ 播放字母完整发音</Text>
          </TouchableOpacity>
        </View>

        {/* 音节核心发音 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔊 音节核心发音</Text>
          <Text style={styles.sectionBody}>
            {syllableSoundName ? `/${syllableSoundName}/` : '—'}
          </Text>

          <TouchableOpacity
            style={[
              styles.audioButtonOutline,
              !resolveAudioPath(coreSyllableLocalPath) &&
                styles.audioButtonDisabled,
            ]}
            disabled={!resolveAudioPath(coreSyllableLocalPath)}
            onPress={handlePlayCoreSyllable}
          >
            <Text style={styles.audioButtonOutlineText}>▶ 播放音节核心音</Text>
          </TouchableOpacity>
        </View>

        {/* 音节属性：首音 / 尾音 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>音节属性</Text>
          <Text style={styles.sectionBody}>
            起首辅音：{initialSound ? `/${initialSound}/ (Initial)` : '—'}
          </Text>
          <Text style={styles.sectionBody}>
            尾音：{finalSound ? `/${finalSound}/ (Final)` : '—'}
          </Text>

          <View style={styles.inlineButtonsRow}>
            <TouchableOpacity
              style={[
                styles.smallAudioButton,
                !resolveAudioPath(coreSyllableLocalPath) &&
                  styles.audioButtonDisabled,
              ]}
              disabled={!resolveAudioPath(coreSyllableLocalPath)}
              onPress={handlePlayCoreSyllable}
            >
              <Text style={styles.smallAudioButtonText}>▶ 起首音节</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.smallAudioButton,
                !resolveAudioPath(
                  endSyllableSoundLocalPath || coreSyllableLocalPath,
                ) && styles.audioButtonDisabled,
              ]}
              disabled={
                !resolveAudioPath(
                  endSyllableSoundLocalPath || coreSyllableLocalPath,
                )
              }
              onPress={handlePlayEndSyllable}
            >
              <Text style={styles.smallAudioButtonText}>▶ 尾音节</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 示例单词 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📌 示例单词</Text>
          {(exampleWord || exampleMeaning) && (
            <Text style={styles.sectionBody}>
              {exampleWord || '—'}
              {exampleMeaning ? ` · ${exampleMeaning}` : ''}
            </Text>
          )}

          <TouchableOpacity
            style={[
              styles.audioButtonOutline,
              !resolveAudioPath(
                exampleWordLocalPath || fullSoundLocalPath || coreSyllableLocalPath,
              ) && styles.audioButtonDisabled,
            ]}
            disabled={
              !resolveAudioPath(
                exampleWordLocalPath || fullSoundLocalPath || coreSyllableLocalPath,
              )
            }
            onPress={handlePlayExampleWord}
          >
            <Text style={styles.audioButtonOutlineText}>▶ 播放示例单词</Text>
          </TouchableOpacity>

          {keyboardKey && (
            <Text style={styles.sectionSubNote}>
              键盘对应按键：{keyboardKey}
            </Text>
          )}
        </View>
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
  lessonHeader: {
    paddingTop: 24,
    paddingBottom: 8,
    alignItems: 'center',
  },
  lessonHeaderText: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 14,
    color: Colors.taupe,
  },
  topHeader: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.sand,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  topHeaderText: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 18,
    color: Colors.ink,
  },
  content: {
    flex: 1,
    paddingTop: 8,
  },
  mainLetterBlock: {
    alignItems: 'center',
    marginBottom: 24,
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
  nameBlock: {
    alignItems: 'center',
    marginBottom: 8,
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
    alignItems: 'center',
  },
  audioButtonText: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 14,
    color: Colors.white,
  },
  audioButtonDisabled: {
    opacity: 0.4,
  },
  section: {
    borderTopWidth: 1,
    borderColor: Colors.sand,
    paddingTop: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 16,
    color: Colors.ink,
    marginBottom: 4,
  },
  sectionBody: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 14,
    color: Colors.ink,
    marginBottom: 4,
  },
  sectionSubNote: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 12,
    color: Colors.taupe,
    marginTop: 4,
  },
  audioButtonOutline: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.ink,
    alignItems: 'center',
  },
  audioButtonOutlineText: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 14,
    color: Colors.ink,
  },
  inlineButtonsRow: {
    flexDirection: 'row',
    marginTop: 8,
    columnGap: 12,
  },
  smallAudioButton: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.ink,
    alignItems: 'center',
  },
  smallAudioButtonText: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 12,
    color: Colors.ink,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: Colors.thaiGold,
    minWidth: 160,
    alignItems: 'center',
  },
  nextButtonText: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 16,
    color: Colors.white,
  },
});
