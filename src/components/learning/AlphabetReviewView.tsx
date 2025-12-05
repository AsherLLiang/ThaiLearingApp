import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Volume2 } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { AlphabetLearningState } from '@/src/stores/alphabetStore';
import { QualityButton } from '@/src/entities/enums/QualityScore.enum';
import { Audio } from 'expo-av';

interface AlphabetReviewViewProps {
    alphabet: AlphabetLearningState;
    onAnswer: (quality: QualityButton) => void;
    onNext: () => void;
}

export const AlphabetReviewView: React.FC<AlphabetReviewViewProps> = ({ alphabet, onAnswer, onNext }) => {
    const { t } = useTranslation();
    const [isRevealed, setIsRevealed] = useState(false);

    const playAudio = async () => {
        if (alphabet.audioPath) {
            try {
                const { sound } = await Audio.Sound.createAsync({ uri: alphabet.audioPath });
                await sound.playAsync();
            } catch (error) {
                console.error('Failed to play audio', error);
            }
        }
    };

    const handleReveal = (quality: QualityButton) => {
        setIsRevealed(true);
        onAnswer(quality);
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {/* Character Card */}
                <View style={styles.cardContainer}>
                    <View style={styles.charCard}>
                        <Text style={styles.thaiChar}>{alphabet.thaiChar}</Text>

                        {/* Audio button is always visible for help? Or should be hidden? 
                            Usually in review, audio might be a hint. Let's keep it visible but maybe optional.
                            For strict review, maybe hide it. But for alphabet, hearing it is part of the "Front" of card sometimes.
                            Assuming visual recognition is key here.
                        */}
                        <Pressable style={styles.audioButton} onPress={playAudio}>
                            <Volume2 size={24} color={Colors.thaiGold} />
                        </Pressable>
                    </View>
                </View>

                {/* Hidden Details */}
                <View style={styles.hiddenContainer}>
                    <View style={styles.hiddenContent}>
                        <Text style={styles.pronunciationText}>{alphabet.pronunciation}</Text>
                        <View style={styles.divider} />
                        <Text style={styles.exampleText}>{alphabet.example}</Text>
                    </View>

                    {!isRevealed && (
                        <BlurView intensity={80} style={StyleSheet.absoluteFill} tint="light">
                            <View style={styles.blurOverlay} />
                        </BlurView>
                    )}
                </View>
            </ScrollView>

            {/* Bottom Buttons */}
            <View style={styles.bottomBar}>
                {!isRevealed ? (
                    <View style={styles.buttonGrid}>
                        <Pressable
                            style={[styles.actionButton, styles.btnForgot]}
                            onPress={() => handleReveal(QualityButton.FORGET)}
                        >
                            <Text style={[styles.btnText, styles.textForgot]}>{t('learning.stranger', '陌生')}</Text>
                        </Pressable>

                        <Pressable
                            style={[styles.actionButton, styles.btnUnsure]}
                            onPress={() => handleReveal(QualityButton.FUZZY)}
                        >
                            <Text style={[styles.btnText, styles.textUnsure]}>{t('learning.vague', '模糊')}</Text>
                        </Pressable>

                        <Pressable
                            style={[styles.actionButton, styles.btnKnow]}
                            onPress={() => handleReveal(QualityButton.KNOW)}
                        >
                            <Text style={[styles.btnText, styles.textKnow]}>{t('learning.remember', '记得')}</Text>
                        </Pressable>
                    </View>
                ) : (
                    <Pressable style={styles.nextButton} onPress={onNext}>
                        <Text style={styles.nextButtonText}>{t('learning.next', '下一个')}</Text>
                    </Pressable>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.paper,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 100,
    },
    cardContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    charCard: {
        width: '100%',
        aspectRatio: 1,
        maxHeight: 240,
        backgroundColor: Colors.white,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors.sand,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 4,
        position: 'relative',
    },
    thaiChar: {
        fontFamily: Typography.sarabunBold,
        fontSize: 100,
        color: Colors.ink,
    },
    audioButton: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        padding: 8,
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        borderRadius: 20,
    },
    hiddenContainer: {
        width: '100%',
        minHeight: 160,
        backgroundColor: Colors.white,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.sand,
        overflow: 'hidden',
        position: 'relative',
    },
    hiddenContent: {
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    pronunciationText: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 24,
        color: Colors.ink,
        marginBottom: 16,
    },
    divider: {
        width: 40,
        height: 2,
        backgroundColor: Colors.sand,
        marginBottom: 16,
    },
    exampleText: {
        fontFamily: Typography.sarabunRegular,
        fontSize: 18,
        color: Colors.taupe,
        textAlign: 'center',
    },
    blurOverlay: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 24,
        backgroundColor: Colors.paper,
        borderTopWidth: 1,
        borderTopColor: Colors.sand,
    },
    buttonGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    actionButton: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    btnForgot: {
        backgroundColor: '#FEF2F2',
        borderColor: '#FCA5A5',
    },
    textForgot: {
        color: '#DC2626',
    },
    btnUnsure: {
        backgroundColor: '#FFFBEB',
        borderColor: '#FCD34D',
    },
    textUnsure: {
        color: '#D97706',
    },
    btnKnow: {
        backgroundColor: '#ECFDF5',
        borderColor: '#6EE7B7',
    },
    textKnow: {
        color: '#059669',
    },
    btnText: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 15,
    },
    nextButton: {
        backgroundColor: Colors.ink,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    nextButtonText: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 16,
        color: Colors.white,
    },
});
