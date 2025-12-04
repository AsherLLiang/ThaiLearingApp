import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { X, Volume2, CheckCircle, XCircle } from 'lucide-react-native';
import { ThaiPatternBackground } from '@/src/components/common/ThaiPatternBackground';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { getAllLetters } from '@/src/utils/letterData';
import type { Letter } from '@/src/entities/types/letter.types';
import { Audio } from 'expo-av';

type QuestionType = 'audio_to_char' | 'char_to_sound';

interface Question {
    type: QuestionType;
    target: Letter;
    options: Letter[];
    correctIndex: number;
}

export default function AlphabetTrainingScreen() {
    const router = useRouter();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [score, setScore] = useState(0);

    useEffect(() => {
        generateQuestions();
    }, []);

    const generateQuestions = () => {
        const allLetters = getAllLetters();
        const newQuestions: Question[] = [];

        // Generate 10 random questions
        for (let i = 0; i < 10; i++) {
            const targetIndex = Math.floor(Math.random() * allLetters.length);
            const target = allLetters[targetIndex];

            // Generate 2 distractors
            const options = [target];
            while (options.length < 3) {
                const random = allLetters[Math.floor(Math.random() * allLetters.length)];
                if (!options.find(o => o._id === random._id)) {
                    options.push(random);
                }
            }

            // Shuffle options
            const shuffledOptions = options.sort(() => Math.random() - 0.5);
            const correctIndex = shuffledOptions.findIndex(o => o._id === target._id);

            newQuestions.push({
                type: Math.random() > 0.5 ? 'audio_to_char' : 'char_to_sound',
                target,
                options: shuffledOptions,
                correctIndex
            });
        }

        setQuestions(newQuestions);
    };

    const handleOptionSelect = (index: number) => {
        if (selectedOption !== null) return; // Prevent changing answer

        setSelectedOption(index);
        const correct = index === questions[currentIndex].correctIndex;
        setIsCorrect(correct);

        if (correct) {
            setScore(prev => prev + 1);
            // Play success sound
        } else {
            // Play error sound
        }

        // Auto advance after delay
        setTimeout(() => {
            if (currentIndex < questions.length - 1) {
                setCurrentIndex(prev => prev + 1);
                setSelectedOption(null);
                setIsCorrect(null);
            } else {
                // Finish
                Alert.alert(
                    '训练完成',
                    `你的得分: ${correct ? score + 1 : score} / ${questions.length}`,
                    [
                        { text: '确定', onPress: () => router.back() }
                    ]
                );
            }
        }, 1500);
    };

    const playSound = async () => {
        console.log('Playing sound for:', questions[currentIndex].target.thaiChar);
    };

    if (questions.length === 0) return null;

    const currentQ = questions[currentIndex];

    return (
        <SafeAreaView edges={['top']} style={styles.container}>
            <ThaiPatternBackground opacity={0.08} />

            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.closeButton}>
                    <X size={24} color={Colors.taupe} />
                </Pressable>
                <View style={styles.progressContainer}>
                    <View style={[styles.progressBar, { width: `${((currentIndex + 1) / questions.length) * 100}%` }]} />
                </View>
                <Text style={styles.progressText}>{currentIndex + 1}/{questions.length}</Text>
            </View>

            <View style={styles.content}>
                {/* Question Area */}
                <View style={styles.questionCard}>
                    {currentQ.type === 'audio_to_char' ? (
                        <Pressable style={styles.audioButtonBig} onPress={playSound}>
                            <Volume2 size={48} color={Colors.thaiGold} />
                            <Text style={styles.audioHint}>点击播放发音</Text>
                        </Pressable>
                    ) : (
                        <Text style={styles.questionChar}>{currentQ.target.thaiChar}</Text>
                    )}
                </View>

                {/* Options */}
                <View style={styles.optionsContainer}>
                    {currentQ.options.map((option, index) => {
                        const isCorrect = selectedOption !== null && index === currentQ.correctIndex;
                        const isWrong = selectedOption !== null && index === selectedOption && index !== currentQ.correctIndex;

                        return (
                            <Pressable
                                key={index}
                                style={[
                                    styles.optionButton,
                                    isCorrect && styles.optionCorrect,
                                    isWrong && styles.optionWrong
                                ]}
                                onPress={() => handleOptionSelect(index)}
                                disabled={selectedOption !== null}
                            >
                                {currentQ.type === 'audio_to_char' ? (
                                    <Text style={[
                                        styles.optionText,
                                        (isCorrect || isWrong) && styles.optionTextCorrect
                                    ]}>{option.thaiChar}</Text>
                                ) : (
                                    <Text style={[
                                        styles.optionText,
                                        { fontSize: 18 },
                                        (isCorrect || isWrong) && styles.optionTextCorrect
                                    ]}>/{option.initialSound}/</Text>
                                )}

                                {isCorrect && (
                                    <CheckCircle size={24} color={Colors.white} style={styles.feedbackIcon} />
                                )}
                                {isWrong && (
                                    <XCircle size={24} color={Colors.white} style={styles.feedbackIcon} />
                                )}
                            </Pressable>
                        );
                    })}
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.paper,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 12,
    },
    closeButton: {
        padding: 4,
    },
    progressContainer: {
        flex: 1,
        height: 8,
        backgroundColor: '#E0E0E0',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: Colors.thaiGold,
    },
    progressText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 14,
        color: Colors.taupe,
    },
    content: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    questionCard: {
        alignItems: 'center',
        marginBottom: 48,
    },
    audioButtonBig: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors.sand,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
    },
    audioHint: {
        marginTop: 12,
        fontFamily: Typography.notoSerifRegular,
        fontSize: 12,
        color: Colors.taupe,
    },
    questionChar: {
        fontFamily: Typography.playfairBold,
        fontSize: 100,
        color: Colors.ink,
    },
    optionsContainer: {
        gap: 16,
    },
    optionButton: {
        backgroundColor: Colors.white,
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.sand,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 2,
    },
    optionCorrect: {
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
    },
    optionWrong: {
        backgroundColor: '#F44336',
        borderColor: '#F44336',
    },
    optionText: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 24,
        color: Colors.ink,
    },
    optionTextCorrect: {
        color: Colors.white,
    },
    optionTextWrong: {
        color: Colors.white,
    },
    feedbackIcon: {
        position: 'absolute',
        right: 20,
    },
});
