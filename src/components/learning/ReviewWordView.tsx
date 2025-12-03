import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Volume2 } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { WordData } from './NewWordView';

interface ReviewWordViewProps {
    word: WordData;
    onAnswer: (quality: 'know' | 'unsure' | 'forgot') => void;
    onNext: () => void;
}

export const ReviewWordView: React.FC<ReviewWordViewProps> = ({ word, onAnswer, onNext }) => {
    const { t } = useTranslation();
    const [isRevealed, setIsRevealed] = useState(false);

    const handleReveal = (quality: 'know' | 'unsure' | 'forgot') => {
        setIsRevealed(true);
        onAnswer(quality);
    };

    // Extract the first example sentence for the context view
    const exampleSentence = word.definitions.examples[0];

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {/* Top Section: Word & Phonetic */}
                <View style={styles.topSection}>
                    <Text style={styles.thaiWord}>{word.thai}</Text>

                    <View style={styles.phoneticRow}>
                        <Pressable style={styles.audioButton}>
                            <Volume2 size={20} color={Colors.thaiGold} />
                        </Pressable>
                        <Text style={styles.phoneticText}>{word.phonetic}</Text>
                    </View>
                </View>

                {/* Context Sentence */}
                {exampleSentence && (
                    <View style={styles.contextContainer}>
                        <Text style={styles.contextThai}>
                            {/* Simple logic to bold the word in the sentence if possible, otherwise just show sentence */}
                            {exampleSentence.thai}
                        </Text>
                        <Text style={styles.contextMeaning}>{exampleSentence.meaning}</Text>
                    </View>
                )}

                {/* Blurred Content Area */}
                <View style={styles.blurredAreaContainer}>
                    <View style={styles.blurredContent}>
                        <View style={styles.meaningHeader}>
                            <Text style={styles.mainMeaning}>{word.meaning}</Text>
                            <View style={styles.typeTag}>
                                <Text style={styles.typeText}>{word.type}</Text>
                            </View>
                        </View>
                        <Text style={styles.definitionText}>{word.definitions.basic}</Text>
                    </View>

                    {!isRevealed && (
                        <BlurView intensity={60} style={StyleSheet.absoluteFill} tint="dark">
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
                            onPress={() => handleReveal('forgot')}
                        >
                            <Text style={[styles.btnText, styles.textForgot]}>{t('learning.forgot')}</Text>
                        </Pressable>

                        <Pressable
                            style={[styles.actionButton, styles.btnUnsure]}
                            onPress={() => handleReveal('unsure')}
                        >
                            <Text style={[styles.btnText, styles.textUnsure]}>{t('learning.unsure')}</Text>
                        </Pressable>

                        <Pressable
                            style={[styles.actionButton, styles.btnKnow]}
                            onPress={() => handleReveal('know')}
                        >
                            <Text style={[styles.btnText, styles.textKnow]}>{t('learning.know')}</Text>
                        </Pressable>
                    </View>
                ) : (
                    <Pressable style={styles.nextButton} onPress={onNext}>
                        <Text style={styles.nextButtonText}>{t('learning.next')}</Text>
                    </Pressable>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 40,
        paddingBottom: 100,
        alignItems: 'center',
    },
    topSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    thaiWord: {
        fontFamily: Typography.sarabunBold,
        fontSize: 64,
        color: Colors.ink,
        marginBottom: 12,
    },
    phoneticRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    audioButton: {
        padding: 8,
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        borderRadius: 20,
    },
    phoneticText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 20,
        color: Colors.taupe,
    },
    contextContainer: {
        width: '100%',
        backgroundColor: Colors.white,
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.sand,
        marginBottom: 32,
    },
    contextThai: {
        fontFamily: Typography.sarabunRegular,
        fontSize: 18,
        color: Colors.ink,
        marginBottom: 8,
        lineHeight: 28,
    },
    contextMeaning: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 14,
        color: Colors.taupe,
    },
    blurredAreaContainer: {
        width: '100%',
        minHeight: 200,
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.sand,
    },
    blurredContent: {
        padding: 24,
        alignItems: 'center',
    },
    blurOverlay: {
        flex: 1,
        backgroundColor: 'rgba(26, 26, 26, 0.8)', // Dark overlay for better contrast with white text if needed, or match design
    },
    meaningHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    mainMeaning: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 24,
        color: Colors.ink,
    },
    typeTag: {
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    typeText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 12,
        color: Colors.thaiGold,
    },
    definitionText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 16,
        color: Colors.ink,
        textAlign: 'center',
        lineHeight: 24,
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
        gap: 16,
    },
    actionButton: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnForgot: {
        backgroundColor: '#FEF2F2',
        borderWidth: 1,
        borderColor: '#FCA5A5',
    },
    textForgot: {
        color: '#DC2626',
    },
    btnUnsure: {
        backgroundColor: '#FFFBEB',
        borderWidth: 1,
        borderColor: '#FCD34D',
    },
    textUnsure: {
        color: '#D97706',
    },
    btnKnow: {
        backgroundColor: '#ECFDF5',
        borderWidth: 1,
        borderColor: '#6EE7B7',
    },
    textKnow: {
        color: '#059669',
    },
    btnText: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 16,
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
