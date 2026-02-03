import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { WordCard } from '@/src/components/learning/vocabulary/WordCard';
import { VocabularyDetailView } from '@/src/components/learning/vocabulary/VocabularyDetailView';
import { useVocabularyStore } from '@/src/stores/vocabularyStore';
import { Vocabulary } from '@/src/entities/types/vocabulary.types';
import { X } from 'lucide-react-native';

interface ReviewWordViewProps {
    vocabulary: Vocabulary;
    onNext: () => void;
}

export const ReviewWordView: React.FC<ReviewWordViewProps> = ({ vocabulary, onNext }) => {
    const { t } = useTranslation();
    const [isRevealed, setIsRevealed] = useState(false);
    const skipWord = useVocabularyStore(state => state.skipWord);
    const markSelfRating = useVocabularyStore(state => state.markSelfRating);

    const handleRate = (score: number) => {
        markSelfRating(score);
        setIsRevealed(true);
    };

    const handleSkip = () => {
        skipWord(vocabulary._id);
    };

    // Extract first example sentence as context hint
    const exampleSentences = vocabulary.exampleSentences || {};
    const firstExample = Object.values(exampleSentences)[0];

    return (
        <View style={styles.container}>
            {/* Top Right Skip Button */}
            <Pressable style={styles.skipButton} onPress={handleSkip}>
                <Text style={styles.skipText}>{t('learning.skip')}</Text>
                <X size={16} color={Colors.taupe} />
            </Pressable>

            <View style={styles.content}>
                <WordCard vocabulary={vocabulary} autoPlay={true} />

                {/* Context Hint */}
                {firstExample && (
                    <View style={styles.contextContainer}>
                        <Text style={styles.contextThai}>{firstExample.泰语}</Text>
                        <Text style={styles.contextMeaning}>{firstExample.中文}</Text>
                    </View>
                )}

                <VocabularyDetailView
                    vocabulary={vocabulary}
                    blurDetails={!isRevealed}
                />
            </View>

            {/* Bottom Action Bar */}
            <View style={styles.bottomBar}>
                {!isRevealed ? (
                    <View style={styles.buttonGrid}>
                        {/* Forgot -> Score 1 */}
                        <Pressable
                            style={[styles.actionButton, styles.btnForgot]}
                            onPress={() => handleRate(1)}
                        >
                            <Text style={[styles.btnText, styles.textForgot]}>{t('learning.forgot')}</Text>
                        </Pressable>

                        {/* Unsure -> Score 3 */}
                        <Pressable
                            style={[styles.actionButton, styles.btnUnsure]}
                            onPress={() => handleRate(3)}
                        >
                            <Text style={[styles.btnText, styles.textUnsure]}>{t('learning.unsure')}</Text>
                        </Pressable>

                        {/* Know -> Score 5 */}
                        <Pressable
                            style={[styles.actionButton, styles.btnKnow]}
                            onPress={() => handleRate(5)}
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
        backgroundColor: Colors.paper,
        position: 'relative',
    },
    skipButton: {
        position: 'absolute',
        top: 10,
        right: 20,
        zIndex: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.05)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        gap: 4,
    },
    skipText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 12,
        color: Colors.taupe,
    },
    content: {
        flex: 1,
        marginTop: 40,
        paddingHorizontal: 20,
    },
    contextContainer: {
        backgroundColor: Colors.white,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.sand,
        marginBottom: 16,
    },
    contextThai: {
        fontFamily: Typography.sarabunRegular,
        fontSize: 16,
        color: Colors.ink,
        marginBottom: 4,
    },
    contextMeaning: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 14,
        color: Colors.taupe,
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
        gap: 12,
    },
    actionButton: {
        flex: 1,
        paddingVertical: 14,
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
        fontSize: 14,
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
