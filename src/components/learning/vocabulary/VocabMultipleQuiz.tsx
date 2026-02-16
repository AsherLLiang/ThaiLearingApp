import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, Pressable, Vibration, Animated, Easing } from 'react-native';
import { Volume2 } from 'lucide-react-native';
import { Audio } from 'expo-av';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { Vocabulary } from '@/src/entities/types/vocabulary.types';
import { getVocabAudioUrl } from '@/src/utils/vocab/vocabAudioHelper';
import { ConfettiEffect } from '@/src/components/common/ConfettiEffect';

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
    const [showConfetti, setShowConfetti] = useState(false);
    const [confettiPos, setConfettiPos] = useState({ x: 0, y: 0 });
    const soundRef = useRef<Audio.Sound | null>(null);
    const audioModeConfigured = useRef(false);
    const containerRef = useRef<View>(null);
    // 容器在屏幕上的偏移量
    const containerOffset = useRef({ x: 0, y: 0 });

    // Auto-play audio on mount
    useEffect(() => {
        playAudio();
        setShowConfetti(false);
        return () => {
            if (soundRef.current) {
                soundRef.current.unloadAsync().catch(() => { });
                soundRef.current = null;
            }
        };
    }, [vocabulary._id]);

    const playAudio = async () => {
        try {
            const url = await getVocabAudioUrl(vocabulary.audioPath || '', vocabulary.source);
            if (!url) return;

            // 配置音频模式（仅一次）
            if (!audioModeConfigured.current) {
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: false,
                    playsInSilentModeIOS: true,
                    staysActiveInBackground: false,
                    shouldDuckAndroid: true,
                });
                audioModeConfigured.current = true;
            }

            // 清理旧 sound
            if (soundRef.current) {
                await soundRef.current.unloadAsync().catch(() => { });
                soundRef.current = null;
            }

            // 创建并播放
            const { sound } = await Audio.Sound.createAsync(
                { uri: url },
                { shouldPlay: true }
            );
            soundRef.current = sound;
        } catch (error) {
            console.warn('❌ [Quiz] Playback failed:', error);
        }
    };

    const handleOptionPress = (option: QuizOption, touchPos?: { x: number; y: number }) => {
        if (isProcessing) return; // Prevent double taps during transition

        // 将屏幕绝对坐标转为相对于容器的坐标
        if (touchPos) {
            containerRef.current?.measure((_x, _y, _w, _h, pageX, pageY) => {
                setConfettiPos({
                    x: touchPos.x - (pageX || 0),
                    y: touchPos.y - (pageY || 0),
                });
            });
        }

        setSelectedOptionId(option.id);
        console.log('[VocabQuiz] Option selected:', { wordId: vocabulary._id, optionId: option.id, isCorrect: option.isCorrect });

        if (option.isCorrect) {
            // Correct handling
            setIsProcessing(true); // Lock input
            setShowConfetti(true);
            setTimeout(() => {
                onCorrect();
                setIsProcessing(false);
                setSelectedOptionId(null);
                setShowConfetti(false);
            }, 800);

        } else {
            // Wrong handling
            Vibration.vibrate();
            onWrong();
        }
    };

    return (
        <View ref={containerRef} style={styles.container}>
            {showConfetti && <ConfettiEffect x={confettiPos.x} y={confettiPos.y} />}
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
                            onPress={(e) => handleOptionPress(option, e)}
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
    onPress: (touchPos?: { x: number; y: number }) => void
}) => {
    const shakeAnim = React.useRef(new Animated.Value(0)).current;
    // 用 ref 存储 onPressIn 时的精确触摸坐标
    const touchPosRef = React.useRef<{ x: number; y: number } | undefined>(undefined);

    React.useEffect(() => {
        if (isSelected && !option.isCorrect) {
            shake();
        }
    }, [isSelected, option.isCorrect]);

    const shake = () => {
        Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
        ]).start();
    };

    // Style logic
    let backgroundColor: string = Colors.white;
    let borderColor: string = Colors.sand;
    let textColor: string = Colors.ink;

    if (isSelected) {
        if (option.isCorrect) {
            backgroundColor = '#ECFDF5';
            borderColor = '#10B981';
            textColor = '#047857';
        } else {
            backgroundColor = '#FEF2F2';
            borderColor = '#EF4444';
            textColor = '#B91C1C';
        }
    }

    return (
        <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
            <Pressable
                style={[styles.optionButton, { backgroundColor, borderColor }]}
                onPressIn={(e) => {
                    // onPressIn 在触摸瞬间触发，坐标最精确
                    touchPosRef.current = {
                        x: e.nativeEvent.pageX,
                        y: e.nativeEvent.pageY,
                    };
                }}
                onPress={() => onPress(touchPosRef.current)}
                disabled={isSelected && !option.isCorrect}
            >
                <Text style={[styles.optionText, { color: textColor }]}>{option.definition}</Text>
            </Pressable>
        </Animated.View>
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
