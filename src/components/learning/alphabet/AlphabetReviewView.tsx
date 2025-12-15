// src/components/learning/alphabet/AlphabetReviewView.tsx

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Vibration,
  Platform,
} from 'react-native';
import { Audio } from 'expo-av';
import { Volume2, Check, X, AudioLines } from 'lucide-react-native';

import type { AlphabetLearningState } from '@/src/stores/alphabetStore';
import type { Letter } from '@/src/entities/types/letter.types';
import type { AlphabetQueueItem, AlphabetQuestion } from '@/src/entities/types/alphabet.types';

// Use strict new types
import { AlphabetGameType, ALPHABET_GAME_TYPE_LABELS } from '@/src/entities/types/alphabetGameTypes';
import { generateQuestion } from '@/src/utils/lettersQuestionGenerator';
import { getLetterAudioUrl } from '@/src/utils/alphabet/audioHelper';
// Legacy type for prop compatibility (mapped internally)
import { QuestionType } from '@/src/entities/enums/QuestionType.enum';

import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';

type AnswerState = 'idle' | 'correct' | 'wrong' | 'locked';

interface AlphabetReviewViewProps {
  alphabet: AlphabetLearningState;
  letterPool?: Letter[];
  preferredType?: QuestionType; // Legacy prop
  onAnswer: (isCorrect: boolean, questionType: any) => void;
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
  const [answerState, setAnswerState] = useState<AnswerState>('idle');
  // use index to track selection to avoid duplicate value issues
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const soundRef = useRef<Audio.Sound | null>(null);
  const shakeX = useRef(new Animated.Value(0)).current;
  const wrongResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const correctLockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pool = letterPool || [];

  // --- 1. Question Generation & Type Mapping ---

  const mapLegacyType = (legacyType?: QuestionType): AlphabetGameType => {
    switch (legacyType) {
      case QuestionType.SOUND_TO_LETTER: return AlphabetGameType.SOUND_TO_LETTER;
      case QuestionType.LETTER_TO_SOUND: return AlphabetGameType.LETTER_TO_SOUND;
      case QuestionType.CLASS_CHOICE: return AlphabetGameType.CONSONANT_CLASS;
      case QuestionType.FINAL_CONSONANT: return AlphabetGameType.FINAL_SOUND;
      case QuestionType.SYLLABLE: return AlphabetGameType.SOUND_TO_LETTER;
      case QuestionType.ASPIRATED_CONTRAST: return AlphabetGameType.SOUND_TO_LETTER;
      case QuestionType.TONE_PERCEPTION: return AlphabetGameType.TONE_CALCULATION;
      case QuestionType.INITIAL_SOUND: return AlphabetGameType.INITIAL_SOUND;
      default: return AlphabetGameType.SOUND_TO_LETTER;
    }
  };

  const createQuestion = (): AlphabetQuestion => {
    const queueItem: AlphabetQueueItem = {
      letterId: alphabet.alphabetId,
      letter: alphabet.letter,
      gameType: mapLegacyType(preferredType),
    };
    return generateQuestion(queueItem, pool);
  };

  const [question, setQuestion] = useState<AlphabetQuestion>(createQuestion);
  const questionKey = question.id;

  // Debug Log
  useEffect(() => {
    // CONSONANT_CLASS has 3 options. Others usually 4.
    const minOptions = question.gameType === AlphabetGameType.CONSONANT_CLASS ? 3 : 4;
    // TONE_CALCULATION / PHONICS_MATH placeholders might also have fewer?
    // Let's safe guard.
    if (!question?.options || question.options.length < minOptions) {
      console.warn('⚠️ Options count low:', question?.options?.length || 0, 'Type:', question.gameType);
    }
  }, [question]);

  useEffect(() => {
    setQuestion(createQuestion());
    resetForNewQuestion();
  }, [alphabet.alphabetId, preferredType]);


  // --- 2. Audio Logic ---

  const stopAudio = useCallback(async () => {
    if (!soundRef.current) return;
    try {
      await soundRef.current.stopAsync().catch(() => { });
      await soundRef.current.unloadAsync().catch(() => { });
    } finally {
      soundRef.current = null;
    }
  }, []);

  const playAudio = useCallback(
    async (uri?: string | null) => {
      if (!uri) return;

      try {
        setIsPlaying(true);
        await stopAudio();
        const { sound } = await Audio.Sound.createAsync(
          { uri },
          { shouldPlay: true }
        );

        soundRef.current = sound;
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            setIsPlaying(false);
          }
        });
      } catch (error) {
        console.warn('[AlphabetReview] Playback failed:', error);
        setIsPlaying(false);
      }
    },
    [stopAudio]
  );

  useEffect(() => {
    resetForNewQuestion();

    const shouldAutoPlay = [
      AlphabetGameType.SOUND_TO_LETTER,
      AlphabetGameType.INITIAL_SOUND,
      AlphabetGameType.FINAL_SOUND
    ].includes(question.gameType);

    if (shouldAutoPlay && question.audioUrl) {
      void playAudio(question.audioUrl);
    }

    return () => {
      if (wrongResetTimer.current) clearTimeout(wrongResetTimer.current);
      if (correctLockTimer.current) clearTimeout(correctLockTimer.current);
      void stopAudio();
    };
  }, [questionKey]);


  // --- 3. Interaction Logic ---

  const resetForNewQuestion = useCallback(() => {
    setAnswerState('idle');
    setSelectedOptionIndex(null);
    shakeX.setValue(0);
    if (wrongResetTimer.current) clearTimeout(wrongResetTimer.current);
    if (correctLockTimer.current) clearTimeout(correctLockTimer.current);
  }, [shakeX]);

  const runShake = useCallback(() => {
    shakeX.setValue(0);
    Animated.sequence([
      Animated.timing(shakeX, { toValue: -10, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: 10, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: -6, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: 6, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: 0, duration: 40, useNativeDriver: true }),
    ]).start();
  }, [shakeX]);

  // MOVED checkAnswer UP to resolve hoisting error
  const checkAnswer = useCallback((optionValue: string, index: number) => {
    const isCorrect = optionValue === question.correctAnswer;
    setSelectedOptionIndex(index);

    if (isCorrect) {
      setAnswerState('correct');
      onAnswer(true, question.gameType);

      // Play success sound unless it's LetterToSound (where we already played)
      if (question.audioUrl && (question.gameType !== AlphabetGameType.LETTER_TO_SOUND)) {
        void playAudio(question.audioUrl);
      }

      correctLockTimer.current = setTimeout(() => {
        setAnswerState('locked');
      }, 500);
    } else {
      setAnswerState('wrong');
      onAnswer(false, question.gameType);
      runShake();
      Vibration.vibrate(50);

      wrongResetTimer.current = setTimeout(() => {
        setAnswerState('idle');
        setSelectedOptionIndex(null);
      }, 800);
    }
  }, [question, onAnswer, runShake, playAudio]);

  const handleOptionSelect = useCallback(
    (optionValue: string, index: number) => {
      if (answerState !== 'idle') return;

      const isAudioQuestion = question.gameType === AlphabetGameType.LETTER_TO_SOUND;

      if (isAudioQuestion) {
        // Play First Logic
        const targetLetter = question?.options?.[index];

        if (targetLetter) {
          const url = targetLetter.letterPronunciationUrl || targetLetter.fullSoundUrl || targetLetter.audioPath;
          if (url) {
            void playAudio(url);
          }
        }

        setSelectedOptionIndex(index);
        // Do NOT submit yet
        return;
      }

      // Default Immediate Feedback
      checkAnswer(optionValue, index);
    },
    [answerState, question, checkAnswer, playAudio]
  );

  const handleConfirmAnswer = useCallback(() => {
    if (selectedOptionIndex !== null && question.options) {
      // Get value from index
      const selectedItem = question.options[selectedOptionIndex];
      let val: string | undefined;

      switch (question.gameType) {
        case AlphabetGameType.LETTER_TO_SOUND:
          val = selectedItem.initialSound || selectedItem.fullSoundUrl || selectedItem._id;
          break;
        case AlphabetGameType.INITIAL_SOUND:
          val = selectedItem.initialSound;
          break;
        case AlphabetGameType.FINAL_SOUND:
          val = selectedItem.finalSound || selectedItem.initialSound;
          break;
        default:
          val = selectedItem.thaiChar;
      }

      if (val) checkAnswer(val, selectedOptionIndex);
    }
  }, [selectedOptionIndex, question, checkAnswer]);

  const handleNextQuestion = useCallback(() => {
    if (answerState !== 'locked') return;
    resetForNewQuestion();
    void stopAudio();
    onNext();
  }, [answerState, resetForNewQuestion, stopAudio, onNext]);


  // --- 4. Render Helpers ---

  const renderQuestionHeader = () => {
    const title = ALPHABET_GAME_TYPE_LABELS[question.gameType] || 'Review';
    let instruction = 'Select the correct answer';

    switch (question.gameType) {
      case AlphabetGameType.SOUND_TO_LETTER: instruction = 'Listen and choose the letter'; break;
      case AlphabetGameType.LETTER_TO_SOUND: instruction = 'Match the pronunciation'; break;
      case AlphabetGameType.CONSONANT_CLASS: instruction = 'Select the consonant class'; break;
      case AlphabetGameType.INITIAL_SOUND: instruction = 'Identify the initial sound'; break;
      case AlphabetGameType.FINAL_SOUND: instruction = 'Identify the final sound'; break;
      default: break;
    }

    return (
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{title}</Text>
        <Text style={styles.headerInstruction}>{instruction}</Text>
      </View>
    );
  };

  const renderAudioButton = () => {
    // For Letter-to-Sound, the user must read the letter. Providing central audio defeats the visual recognition task.
    if (!question.audioUrl || question.gameType === AlphabetGameType.LETTER_TO_SOUND) return null;
    return (
      <TouchableOpacity
        style={[styles.audioButton, isPlaying && styles.audioButtonActive]}
        onPress={() => playAudio(question.audioUrl)}
      >
        <Volume2 size={32} color={Colors.white} />
      </TouchableOpacity>
    );
  };

  const renderStem = () => {
    if (question.gameType === AlphabetGameType.LETTER_TO_SOUND ||
      question.gameType === AlphabetGameType.CONSONANT_CLASS) {
      return (
        <View style={styles.stemContainer}>
          <Text style={styles.stemLetter}>{question.targetLetter.thaiChar}</Text>
        </View>
      );
    }
    return null;
  };

  const renderOptions = () => {
    const options = question.options || [];
    const minOptions = question.gameType === AlphabetGameType.CONSONANT_CLASS ? 3 : 4;

    if (!options || options.length < minOptions) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>题目选项加载失败</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setQuestion(createQuestion());
              resetForNewQuestion();
            }}
          >
            <Text style={styles.retryButtonText}>重新生成题目</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <Animated.View
        style={[
          styles.optionsGrid,
          { transform: [{ translateX: shakeX }] }
        ]}
      >
        {options.map((optLetter, index) => {
          let displayValue = '';
          let comparisonValue = '';

          switch (question.gameType) {
            case AlphabetGameType.SOUND_TO_LETTER:
              displayValue = optLetter.thaiChar;
              comparisonValue = optLetter.thaiChar;
              break;
            case AlphabetGameType.LETTER_TO_SOUND:
              displayValue = `/${optLetter.initialSound || '...'} /`;
              comparisonValue = optLetter.initialSound || optLetter.fullSoundUrl || optLetter._id;
              break;
            case AlphabetGameType.INITIAL_SOUND:
              displayValue = `/${optLetter.initialSound}/`;
              comparisonValue = optLetter.initialSound;
              break;
            case AlphabetGameType.FINAL_SOUND:
              displayValue = `/${optLetter.finalSound || optLetter.initialSound}/`;
              comparisonValue = optLetter.finalSound || optLetter.initialSound;
              break;
            default:
              displayValue = optLetter.thaiChar;
              comparisonValue = optLetter.thaiChar;
          }

          const isSelected = selectedOptionIndex === index;
          const isCorrect = (answerState === 'correct' || answerState === 'locked') && comparisonValue === question.correctAnswer;
          const isWrong = answerState === 'wrong' && isSelected && comparisonValue !== question.correctAnswer;
          const isDimmed = (answerState === 'correct' || answerState === 'locked') && !isCorrect;

          return (
            <TouchableOpacity
              key={`${index}-${comparisonValue}`}
              style={[
                styles.optionCard,
                isSelected && styles.optionSelected,
                isCorrect && styles.optionCorrect,
                isWrong && styles.optionWrong,
                isDimmed && styles.optionDimmed,
              ]}
              onPress={() => {
                if (question.gameType === AlphabetGameType.LETTER_TO_SOUND) {
                  // Get normalized audio URL using helper
                  const url = getLetterAudioUrl(optLetter);

                  if (url) {
                    console.log('🔊 Playing Option Sound');
                    void playAudio(url);
                  } else {
                    console.warn('⚠️ No audio URL found for option:', optLetter.thaiChar);
                  }

                  handleOptionSelect(comparisonValue, index);
                } else {
                  handleOptionSelect(comparisonValue, index);
                }
              }}
              disabled={answerState !== 'idle' && answerState !== 'locked'}
            >
              {question.gameType === AlphabetGameType.LETTER_TO_SOUND ? (
                // Use AudioLines for "Voice Wave" style
                <AudioLines size={32} color={isSelected ? Colors.thaiGold : Colors.taupe} />
              ) : (
                <Text style={[
                  styles.optionText,
                  isCorrect && styles.optionTextCorrect,
                  isWrong && styles.optionTextWrong
                ]}>
                  {displayValue}
                </Text>
              )}

              <View style={styles.iconContainer}>
                {isCorrect && <Check size={20} color="#2A9D8F" />}
                {isWrong && <X size={20} color="#E63946" />}
              </View>
            </TouchableOpacity>
          );
        })}
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {renderQuestionHeader()}

      <View style={styles.content}>
        {renderStem()}
        {renderAudioButton()}
        {renderOptions()}
      </View>

      <View style={styles.bottomArea}>
        {/* Confirm Button for Audio Questions */}
        {(question.gameType === AlphabetGameType.LETTER_TO_SOUND) && answerState === 'idle' && selectedOptionIndex !== null && (
          <TouchableOpacity style={styles.nextButton} onPress={handleConfirmAnswer}>
            <Text style={styles.nextButtonText}>Check Answer</Text>
          </TouchableOpacity>
        )}

        {answerState === 'locked' && (
          <TouchableOpacity style={styles.nextButton} onPress={handleNextQuestion}>
            <Text style={styles.nextButtonText}>Next Question →</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: Colors.paper,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  headerTitle: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 16,
    color: Colors.thaiGold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  headerInstruction: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 18,
    color: Colors.ink,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 40,
  },
  stemContainer: {
    marginBottom: 32,
  },
  stemLetter: {
    fontFamily: Typography.playfairBold,
    fontSize: 88,
    color: Colors.ink,
  },
  audioButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.thaiGold,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 60,
    shadowColor: Colors.thaiGold,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  audioButtonActive: {
    transform: [{ scale: 0.95 }],
    opacity: 0.9,
  },
  optionsGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
  optionCard: {
    width: '47%',
    aspectRatio: 1.4,
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#EFEFEF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: { elevation: 2 }
    })
  },
  optionSelected: {
    borderColor: Colors.thaiGold,
    backgroundColor: '#FFFCF5',
  },
  optionCorrect: {
    borderColor: '#2A9D8F',
    backgroundColor: '#E8F5F3',
  },
  optionWrong: {
    borderColor: '#E63946',
    backgroundColor: '#FFE8EA',
  },
  optionDimmed: {
    opacity: 0.3,
  },
  optionText: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 42,
    color: Colors.ink,
    textAlign: 'center',
    lineHeight: 56,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  optionTextCorrect: {
    color: '#2A9D8F',
  },
  optionTextWrong: {
    color: '#E63946',
  },
  iconContainer: {
    position: 'absolute',
    right: 8,
    top: 8,
  },
  bottomArea: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: Colors.ink,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonText: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 16,
    color: Colors.white,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  errorText: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 18,
    color: '#E63946',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubText: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 14,
    color: Colors.taupe,
    marginBottom: 24,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: Colors.thaiGold,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 14,
    color: Colors.white,
  },
});
