import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { X, CheckCircle, XCircle, RotateCcw } from 'lucide-react-native';
import { ThaiPatternBackground } from '@/src/components/common/ThaiPatternBackground';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { getAllLetters } from '@/src/utils/letterData';
import type { Letter } from '@/src/entities/types/letter.types';

interface ReviewItem {
    target: Letter;
    options: string[]; // Phonetic sounds
    correctIndex: number;
}

export default function AlphabetReviewScreen() {
    const router = useRouter();
    const [items, setItems] = useState<ReviewItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [isStarted, setIsStarted] = useState(false);

    useEffect(() => {
        generateReviewItems();
    }, []);

    const generateReviewItems = () => {
        const allLetters = getAllLetters();
        const newItems: ReviewItem[] = [];

        // Mock: Select 8 random letters for review
        for (let i = 0; i < 8; i++) {
            const targetIndex = Math.floor(Math.random() * allLetters.length);
            const target = allLetters[targetIndex];

            // Generate options (sounds)
            const options = [target.initialSound];
            while (options.length < 3) {
                const random = allLetters[Math.floor(Math.random() * allLetters.length)];
                if (!options.includes(random.initialSound)) {
                    options.push(random.initialSound);
                }
            }

            // Shuffle
            const shuffledOptions = options.sort(() => Math.random() - 0.5);
            const correctIndex = shuffledOptions.indexOf(target.initialSound);

            newItems.push({
                target,
                options: shuffledOptions,
                correctIndex
            });
        }

        setItems(newItems);
    };

    const handleOptionSelect = (index: number) => {
        if (selectedOption !== null) return;

        setSelectedOption(index);
        const correct = index === items[currentIndex].correctIndex;
        setIsCorrect(correct);

        setTimeout(() => {
            if (currentIndex < items.length - 1) {
                setCurrentIndex(prev => prev + 1);
                setSelectedOption(null);
                setIsCorrect(null);
            } else {
                Alert.alert(
                    '复习完成',
                    '你已完成今日的字母复习！',
                    [{ text: '确定', onPress: () => router.back() }]
                );
            }
        }, 1000);
    };

    if (!isStarted) {
        return (
            <SafeAreaView edges={['top']} style={styles.container}>
                <ThaiPatternBackground opacity={0.08} />
                <View style={styles.startContainer}>
                    <View style={styles.iconCircle}>
                        <RotateCcw size={48} color={Colors.thaiGold} />
                    </View>
                    <Text style={styles.startTitle}>今日字母复习</Text>
                    <Text style={styles.startSubtitle}>待复习字母: {items.length} 个</Text>

                    <Pressable style={styles.startButton} onPress={() => setIsStarted(true)}>
                        <Text style={styles.startButtonText}>开始复习</Text>
                    </Pressable>

                    <Pressable style={styles.backButton} onPress={() => router.back()}>
                        <Text style={styles.backButtonText}>稍后再说</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        );
    }

    const currentItem = items[currentIndex];

    return (
        <SafeAreaView edges={['top']} style={styles.container}>
            <ThaiPatternBackground opacity={0.08} />

            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.closeButton}>
                    <X size={24} color={Colors.taupe} />
                </Pressable>
                <Text style={styles.progressText}>{currentIndex + 1} / {items.length}</Text>
            </View>

            <View style={styles.content}>
                <View style={styles.card}>
                    <Text style={styles.thaiChar}>{currentItem.target.thaiChar}</Text>
                </View>

                <Text style={styles.questionText}>这个字母的发音是？</Text>

                <View style={styles.optionsContainer}>
                    {currentItem.options.map((option, index) => {
                        const isCorrect = selectedOption !== null && index === currentItem.correctIndex;
                        const isWrong = selectedOption !== null && index === selectedOption && index !== currentItem.correctIndex;

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
                                <Text style={[
                                    styles.optionText,
                                    (isCorrect || isWrong) && styles.optionTextCorrect
                                ]}>/{option}/</Text>
                                {isCorrect && (
                                    <CheckCircle size={20} color={Colors.white} style={styles.feedbackIcon} />
                                )}
                                {isWrong && (
                                    <XCircle size={20} color={Colors.white} style={styles.feedbackIcon} />
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
    startContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
    },
    iconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#FFF8E1',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    startTitle: {
        fontFamily: Typography.playfairBold,
        fontSize: 28,
        color: Colors.ink,
        marginBottom: 8,
    },
    startSubtitle: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 16,
        color: Colors.taupe,
        marginBottom: 48,
    },
    startButton: {
        width: '100%',
        backgroundColor: Colors.ink,
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: Colors.ink,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    startButtonText: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 16,
        color: Colors.white,
    },
    backButton: {
        padding: 12,
    },
    backButtonText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 14,
        color: Colors.taupe,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    closeButton: {
        padding: 4,
    },
    progressText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 14,
        color: Colors.taupe,
    },
    content: {
        flex: 1,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        width: 160,
        height: 160,
        backgroundColor: Colors.white,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
        borderWidth: 1,
        borderColor: Colors.sand,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 3,
    },
    thaiChar: {
        fontFamily: Typography.playfairBold,
        fontSize: 80,
        color: Colors.ink,
    },
    questionText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 18,
        color: Colors.ink,
        marginBottom: 32,
    },
    optionsContainer: {
        width: '100%',
        gap: 12,
    },
    optionButton: {
        backgroundColor: Colors.white,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.sand,
        alignItems: 'center',
        justifyContent: 'center',
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
        fontSize: 18,
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
        right: 16,
    },
});
