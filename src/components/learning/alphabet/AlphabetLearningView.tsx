// src/components/learning/alphabet/AlphabetLearningView.tsx

import React, { memo, useCallback, useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { Audio } from 'expo-av';
import { Volume2, Play } from 'lucide-react-native';

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
  const autoPlayCounter = useRef(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const letter = alphabet.letter;
  const lessonOrder = letter.primaryCurriculumLessonOrder;

  const thaiChar = letter.thaiChar;
  const nameEnglish = letter.nameEnglish;

  const syllableSoundName = letter.syllableSoundName;

  const initialSound = letter.initialSound;
  const finalSound = letter.finalSound;

  const exampleWord = letter.exampleWord;
  const exampleMeaning = letter.exampleMeaning;
  const syllableSoundUrl = letter.syllableSoundUrl;
  const endSyllableSoundUrl = letter.endSyllableSoundUrl;

  const fullSoundLocalPath = letter.fullSoundLocalPath;
  const coreSyllableLocalPath = letter.syllableSoundLocalPath;
  const endSyllableSoundLocalPath = letter.endSyllableSoundLocalPath;
  const exampleWordLocalPath = letter.letterPronunciationLocalPath;

  // --- Audio Logic ---

  const resolveAudioPath = useCallback(
    (primary?: string | null) => {
      //  relaxes strict file:// check, allowing any valid path string
      if (primary && primary.length > 0) return primary;
      if (alphabet.audioUrl && alphabet.audioUrl.length > 0)
        return alphabet.audioUrl;
      return null;
    },
    [alphabet.audioUrl]
  );


  const playLocalAudio = useCallback(async (localPath?: string | null) => {
    // Relaxes check: allow any string path
    if (!localPath) return;


    try {
      setIsPlaying(true);
      if (!audioModeConfiguredRef.current) {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
        audioModeConfiguredRef.current = true;
      }

      if (soundRef.current) {
        await soundRef.current.unloadAsync().catch(() => { });
        soundRef.current = null;
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: localPath },
        { shouldPlay: true }
      );
      soundRef.current = sound;

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    } catch (e) {
      console.warn('❌ Playback failed:', e);
      setIsPlaying(false);
    }
  }, []);

  const handlePlayFullLetter = useCallback(() => {
    const path = resolveAudioPath(fullSoundLocalPath);
    void playLocalAudio(path);
  }, [fullSoundLocalPath, resolveAudioPath, playLocalAudio]);

  const handlePlayCoreSyllable = useCallback(() => {
    const path = resolveAudioPath(coreSyllableLocalPath);
    void playLocalAudio(path);
  }, [coreSyllableLocalPath, resolveAudioPath, playLocalAudio]);

  const handlePlayEndSyllable = useCallback(() => {
    const path = resolveAudioPath(
      endSyllableSoundLocalPath || coreSyllableLocalPath
    );
    void playLocalAudio(path);
  }, [endSyllableSoundLocalPath, coreSyllableLocalPath, resolveAudioPath, playLocalAudio]);

  // Position Sound Handlers
  const handlePlayInitialSound = useCallback(() => {
    // Priority: Local Cache -> Remote Specific URL -> (resolveAudioPath Fallback to Full)
    const path = resolveAudioPath(coreSyllableLocalPath || syllableSoundUrl);
    void playLocalAudio(path);
  }, [coreSyllableLocalPath, syllableSoundUrl, resolveAudioPath, playLocalAudio]);

  const handlePlayFinalSound = useCallback(() => {
    // Priority: Local Final -> Remote Final -> Local Syllable -> Remote Syllable
    const path = resolveAudioPath(
      endSyllableSoundLocalPath || endSyllableSoundUrl || coreSyllableLocalPath || syllableSoundUrl
    );
    void playLocalAudio(path);
  }, [endSyllableSoundLocalPath, endSyllableSoundUrl, coreSyllableLocalPath, syllableSoundUrl, resolveAudioPath, playLocalAudio]);

  const handlePlayExampleWord = useCallback(() => {
    const path = resolveAudioPath(
      exampleWordLocalPath || fullSoundLocalPath || coreSyllableLocalPath
    );
    void playLocalAudio(path);
  }, [exampleWordLocalPath, fullSoundLocalPath, coreSyllableLocalPath, resolveAudioPath, playLocalAudio]);


  // --- Auto-Play Logic ---

  useEffect(() => {

    const playTwice = async () => {
      const path = resolveAudioPath(fullSoundLocalPath);
      if (!path) return;

      // First play
      await playLocalAudio(path);
    };

    void playTwice();

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => { });
      }
    };
  }, [letter._id, resolveAudioPath, fullSoundLocalPath, playLocalAudio]);


  // --- Render ---

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Header Label */}
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {lessonOrder ? `Lesson ${lessonOrder} · ` : ''}Learning Letter
        </Text>
      </View>

      {/* Hero Card */}
      <View style={styles.heroCard}>
        <View style={styles.heroInner}>
          <Text style={styles.thaiChar}>{thaiChar}</Text>
          {nameEnglish && <Text style={styles.englishName}>{nameEnglish}</Text>}

          <TouchableOpacity
            style={[styles.mainPlayButton, isPlaying && styles.buttonActive]}
            onPress={handlePlayFullLetter}
            disabled={!resolveAudioPath(fullSoundLocalPath)}
          >
            <Volume2 size={24} color={Colors.white} />
            <Text style={styles.mainPlayText}>Play Full Sound</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Details Card */}
      <View style={styles.detailsCard}>

        {/* Row 1: Syllable Sound */}
        <View style={styles.detailRow}>
          <View style={styles.detailLabelContainer}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>🔊</Text>
            </View>
            <Text style={styles.detailLabel}>Core Sound</Text>
          </View>
          <TouchableOpacity
            style={styles.detailAction}
            onPress={handlePlayCoreSyllable}
            disabled={!resolveAudioPath(coreSyllableLocalPath)}
          >
            <Text style={styles.detailValue}>/{syllableSoundName || '-'}/</Text>
            <Play size={16} color={Colors.thaiGold} fill={Colors.thaiGold} />
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Row 2: Initial / Final */}
        <View style={styles.detailRow}>
          <View style={styles.detailLabelContainer}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>🧩</Text>
            </View>
            <Text style={styles.detailLabel}>Position</Text>
          </View>
          <View style={styles.positionContainer}>
            <TouchableOpacity
              style={styles.positionBlock}
              onPress={handlePlayInitialSound}
              disabled={!resolveAudioPath(coreSyllableLocalPath || syllableSoundUrl)}
            >
              <Text style={styles.positionLabel}>Initial</Text>
              <View style={styles.positionValueRow}>
                <Text style={styles.positionValue}>/{initialSound || '-'}/</Text>
                <Play size={12} color={Colors.thaiGold} fill={Colors.thaiGold} style={{ marginLeft: 4 }} />
              </View>
            </TouchableOpacity>

            <View style={styles.verticalDivider} />

            <TouchableOpacity
              style={styles.positionBlock}
              onPress={handlePlayFinalSound}
              disabled={!resolveAudioPath(endSyllableSoundLocalPath || endSyllableSoundUrl || coreSyllableLocalPath || syllableSoundUrl)}
            >
              <Text style={styles.positionLabel}>Final</Text>
              <View style={styles.positionValueRow}>
                <Text style={styles.positionValue}>/{finalSound || '-'}/</Text>
                <Play size={12} color={Colors.thaiGold} fill={Colors.thaiGold} style={{ marginLeft: 4 }} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Row 3: Example Word */}
        <View style={styles.detailRow}>
          <View style={styles.detailLabelContainer}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>📌</Text>
            </View>
            <Text style={styles.detailLabel}>Example</Text>
          </View>
          <TouchableOpacity
            style={styles.detailAction}
            onPress={handlePlayExampleWord}
            disabled={!resolveAudioPath(exampleWordLocalPath || fullSoundLocalPath)}
          >
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.exampleWord}>{exampleWord || '-'}</Text>
              {exampleMeaning && <Text style={styles.exampleMeaning}>{exampleMeaning}</Text>}
            </View>
            <Play size={16} color={Colors.thaiGold} fill={Colors.thaiGold} />
          </TouchableOpacity>
        </View>

      </View>

      {/* Footer Navigation */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.continueButton} onPress={onNext}>
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 48,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  headerText: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 14,
    color: Colors.taupe,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  heroCard: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  heroInner: {
    alignItems: 'center',
    width: '100%',
  },
  thaiChar: {
    fontFamily: Typography.playfairBold,
    fontSize: 96,
    color: Colors.ink,
    lineHeight: 110,
    marginBottom: 8,
  },
  englishName: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 18,
    color: Colors.taupe,
    marginBottom: 24,
  },
  mainPlayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.thaiGold,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 100,
    gap: 8,
    width: '100%',
    justifyContent: 'center',
  },
  buttonActive: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }]
  },
  mainPlayText: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 16,
    color: Colors.white,
  },
  detailsCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 4,
  },
  detailLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 16,
  },
  detailLabel: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 15,
    color: Colors.ink,
  },
  detailAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFCF5', // Light gold bg
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  detailValue: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 16,
    color: Colors.ink,
  },
  positionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  positionBlock: {
    alignItems: 'center',
  },
  positionLabel: {
    fontSize: 10,
    color: Colors.taupe,
    textTransform: 'uppercase',
    marginBottom: 2,
    fontFamily: Typography.notoSerifRegular,
  },
  positionValue: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 15,
    color: Colors.ink,
  },
  verticalDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E0E0E0',
  },
  exampleWord: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 16,
    color: Colors.ink,
  },
  exampleMeaning: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 12,
    color: Colors.taupe,
  },
  positionValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  footer: {
    alignItems: 'center',
  },
  continueButton: {
    width: '100%',
    backgroundColor: Colors.ink,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  continueText: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 16,
    color: Colors.white,
  },
});
