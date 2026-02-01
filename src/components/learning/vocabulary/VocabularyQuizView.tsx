import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Volume2, CheckCircle2, XCircle, Eye } from 'lucide-react-native';
import { Audio } from 'expo-av';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import type { Vocabulary } from '@/src/entities/types/vocabulary.types';
import { getVocabAudioUrl } from '@/src/utils/vocab/vocabAudioHelper';

interface VocabularyQuizViewProps {
    vocabulary: Vocabulary;
    onResult: (isCorrect: boolean) => void;
}

export const VocabularyQuizView: React.FC<VocabularyQuizViewProps> = ({
    vocabulary,
    onResult
}) => {
    const [isRevealed, setIsRevealed] = useState(false);
    const soundRef = React.useRef<Audio.Sound | null>(null);

    // 处理发音播放
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

    React.useEffect(() => {
        // 进入时播放
        playAudio();
        return () => {
            if (soundRef.current) {
                soundRef.current.unloadAsync().catch(() => { });
            }
        };
    }, [vocabulary._id]);

    return (
        <View style={styles.container}>
            <View style={styles.quizCard}>
                <Text style={styles.label}>请回忆这个词的含义</Text>

                <View style={styles.questionSection}>
                    <Text style={styles.thaiWord}>{vocabulary.thaiWord}</Text>
                    <Pressable style={styles.audioButton} onPress={playAudio}>
                        <Volume2 size={32} color={Colors.thaiGold} />
                    </Pressable>
                </View>

                {!isRevealed ? (
                    <Pressable style={styles.revealButton} onPress={() => setIsRevealed(true)}>
                        <Eye size={20} color={Colors.white} />
                        <Text style={styles.revealButtonText}>查看答案</Text>
                    </Pressable>
                ) : (
                    <View style={styles.answerSection}>
                        <View style={styles.divider} />
                        <Text style={styles.meaningText}>{vocabulary.meaning}</Text>
                        <Text style={styles.phoneticText}>{vocabulary.pronunciation}</Text>

                        <View style={styles.feedbackButtons}>
                            <Pressable
                                style={[styles.feedbackButton, styles.wrongButton]}
                                onPress={() => onResult(false)}
                            >
                                <XCircle size={24} color="#EF4444" />
                                <Text style={styles.wrongButtonText}>答错了</Text>
                            </Pressable>

                            <Pressable
                                style={[styles.feedbackButton, styles.correctButton]}
                                onPress={() => onResult(true)}
                            >
                                <CheckCircle2 size={24} color="#10B981" />
                                <Text style={styles.correctButtonText}>答对了</Text>
                            </Pressable>
                        </View>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.paper,
        padding: 24,
        justifyContent: 'center',
    },
    quizCard: {
        backgroundColor: Colors.white,
        borderRadius: 24,
        padding: 32,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.sand,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 3,
    },
    label: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 16,
        color: Colors.taupe,
        marginBottom: 24,
    },
    questionSection: {
        alignItems: 'center',
        marginBottom: 40,
    },
    thaiWord: {
        fontFamily: Typography.sarabunBold,
        fontSize: 64,
        color: Colors.ink,
        marginBottom: 16,
    },
    audioButton: {
        padding: 12,
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        borderRadius: 30,
    },
    revealButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.ink,
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 100,
        gap: 8,
    },
    revealButtonText: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 16,
        color: Colors.white,
    },
    answerSection: {
        width: '100%',
        alignItems: 'center',
    },
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: Colors.sand,
        marginBottom: 32,
    },
    meaningText: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 32,
        color: Colors.ink,
        marginBottom: 8,
    },
    phoneticText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 18,
        color: Colors.taupe,
        marginBottom: 40,
    },
    feedbackButtons: {
        flexDirection: 'row',
        gap: 16,
        width: '100%',
    },
    feedbackButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 16,
        borderWidth: 1,
        gap: 8,
    },
    wrongButton: {
        borderColor: '#FCA5A5',
        backgroundColor: '#FEF2F2',
    },
    wrongButtonText: {
        fontFamily: Typography.notoSerifBold,
        color: '#DC2626',
        fontSize: 16,
    },
    correctButton: {
        borderColor: '#6EE7B7',
        backgroundColor: '#ECFDF5',
    },
    correctButtonText: {
        fontFamily: Typography.notoSerifBold,
        color: '#059669',
        fontSize: 16,
    },
});
