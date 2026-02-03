import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, Pressable, Vibration } from 'react-native';
import { Volume2 } from 'lucide-react-native';
import { Audio } from 'expo-av';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { Vocabulary } from '@/src/entities/types/vocabulary.types';
import { getVocabAudioUrl } from '@/src/utils/vocab/vocabAudioHelper';

export interface QuizOption {
    id: string;
    definition: string;
    isCorrect: boolean;
}

interface VocabMultipleQuizProps {
    vocabulary: Vocabulary;
    options: QuizOption[];
    onCorrect: () => void;
    onWrong: () => void;
}

export const VocabMultipleQuiz: React.FC<VocabMultipleQuizProps> = ({
    vocabulary,
    options,
    onCorrect,
    onWrong
}) => {
    const { t } = useTranslation();
    const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const soundRef = React.useRef<Audio.Sound | null>(null);

    // Auto-play audio on mount
    useEffect(() => {
        playAudio();
        return () => {
            if (soundRef.current) {
                soundRef.current.unloadAsync().catch(() => { });
            }
        };
    }, [vocabulary._id]);

    const playAudio = async () => {
        try {
            const url = await getVocabAudioUrl({ audioPath: vocabulary.audioPath });
            if (!url) return;

            if (soundRef.current) {
                await soundRef.current.unloadAsync().catch(() => { });
            }

            const { sound } = await Audio.Sound.createAsync(
                { uri: url },
                { shouldPlay: true }
            );
            soundRef.current = sound;
        } catch (error) {
            console.warn('Playback failed:', error);
        }
    };

    const handleOptionPress = (option: QuizOption) => {
        if (isProcessing) return; // Prevent double taps during transition

        setSelectedOptionId(option.id);
        console.log('[VocabQuiz] Option selected:', { wordId: vocabulary._id, optionId: option.id, isCorrect: option.isCorrect });

        if (option.isCorrect) {
            // Correct handling
            setIsProcessing(true); // Lock input
            setTimeout(() => {
                onCorrect();
                setIsProcessing(false);
                setSelectedOptionId(null);
            }, 600);

        } else {
            // Wrong handling
            Vibration.vibrate();
            onWrong();
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.cardContainer}>
                <View style={styles.wordCard}>
                    <Text style={styles.thaiWord}>{vocabulary.thaiWord}</Text>
                    <View style={styles.phoneticRow}>
                        <Pressable style={styles.audioButton} onPress={playAudio}>
                            <Volume2 size={24} color={Colors.thaiGold} />
                        </Pressable>
                        <Text style={styles.phoneticText}>{vocabulary.pronunciation}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.optionsContainer}>
                <Text style={styles.instructionText}>{t('learning.quizInstruction', '请选择正确的含义')}</Text>
                {options.map((option) => {
                    const isSelected = selectedOptionId === option.id;
                    return (
                        <QuizOptionButton
                            key={option.id}
                            option={option}
                            isSelected={isSelected}
                            onPress={() => handleOptionPress(option)}
                        />
                    );
                })}
            </View>
        </View>
    );
};

const QuizOptionButton = ({ option, isSelected, onPress }: {
    option: QuizOption,
    isSelected: boolean,
    onPress: () => void
}) => {
    // Style logic
    let backgroundColor: string = Colors.white;
    let borderColor: string = Colors.sand;
    let textColor: string = Colors.ink;

    if (isSelected) {
        if (option.isCorrect) {
            backgroundColor = '#ECFDF5'; // Green-50
            borderColor = '#10B981';     // Green-500
            textColor = '#047857';       // Green-700
        } else {
            backgroundColor = '#FEF2F2'; // Red-50
            borderColor = '#EF4444';     // Red-500
            textColor = '#B91C1C';       // Red-700
        }
    }

    return (
        <Pressable
            style={[styles.optionButton, { backgroundColor, borderColor }]}
            onPress={onPress}
            disabled={isSelected && !option.isCorrect}
        >
            <Text style={[styles.optionText, { color: textColor }]}>{option.definition}</Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: 'center',
    },
    cardContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    wordCard: {
        width: '100%',
        backgroundColor: Colors.white,
        borderRadius: 20,
        paddingVertical: 32,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors.sand,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    thaiWord: {
        fontFamily: Typography.sarabunBold,
        fontSize: 64,
        color: Colors.ink,
        marginBottom: 16,
    },
    phoneticRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    audioButton: {
        padding: 8,
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        borderRadius: 25,
    },
    phoneticText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 20,
        color: Colors.taupe,
    },
    optionsContainer: {
        gap: 16,
        width: '100%',
    },
    instructionText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 14,
        color: Colors.taupe,
        textAlign: 'center',
        marginBottom: 8,
    },
    optionButton: {
        width: '100%',
        paddingVertical: 18,
        paddingHorizontal: 24,
        borderRadius: 14,
        borderWidth: 1,
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    optionText: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 16,
        color: Colors.ink,
        textAlign: 'center',
    },
});
