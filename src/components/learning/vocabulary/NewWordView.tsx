import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { VocabularyDetailView } from '@/src/components/learning/vocabulary/VocabularyDetailView';
import { WordCard } from '@/src/components/learning/vocabulary/WordCard';
import { useVocabularyStore } from '@/src/stores/vocabularyStore';
import { Vocabulary } from '@/src/entities/types/vocabulary.types';
import { X } from 'lucide-react-native';


interface NewWordViewProps {
    vocabulary: Vocabulary;
    onNext: () => void;
}

export const NewWordView: React.FC<NewWordViewProps> = ({ vocabulary, onNext }) => {
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

    return (
        <View style={styles.container}>
            {/* Top Right Skip Button */}
            <Pressable style={styles.skipButton} onPress={handleSkip}>
                <Text style={styles.skipText}>{t('learning.skip')}</Text>
                <X size={16} color={Colors.taupe} />
            </Pressable>

            <View style={styles.content}>
                <WordCard vocabulary={vocabulary} autoPlay={true} />
                <VocabularyDetailView
                    vocabulary={vocabulary}
                    blurDetails={!isRevealed}
                />
            </View>

            {/* Bottom Action Bar */}
            <View style={styles.bottomBar}>
                {!isRevealed ? (
                    <View style={styles.buttonRow}>
                        {/* Don't Know / Unfamiliar -> Score 1 */}
                        <Pressable
                            style={[styles.actionButton, styles.weakButton]}
                            onPress={() => handleRate(1)}
                        >
                            <Text style={[styles.actionButtonText, styles.weakButtonText]}>
                                {t('learning.dontKnow')}
                            </Text>
                        </Pressable>

                        {/* Know / Familiar -> Score 5 */}
                        <Pressable
                            style={[styles.actionButton, styles.strongButton]}
                            onPress={() => handleRate(5)}
                        >
                            <Text style={[styles.actionButtonText, styles.strongButtonText]}>
                                {t('learning.know')}
                            </Text>
                        </Pressable>
                    </View>
                ) : (
                    <Pressable style={styles.nextButton} onPress={onNext}>
                        <Text style={styles.nextButtonText}>{t('learning.nextEnter')}</Text>
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
        marginTop: 40, // Space for skip button
    },
    bottomBar: {
        padding: 20,
        backgroundColor: Colors.paper,
        borderTopWidth: 1,
        borderTopColor: Colors.sand,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 16,
    },
    actionButton: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    actionButtonText: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 16,
    },
    weakButton: {
        backgroundColor: Colors.white,
        borderColor: Colors.sand,
    },
    weakButtonText: {
        color: Colors.taupe,
    },
    strongButton: {
        backgroundColor: Colors.ink,
        borderColor: Colors.ink,
    },
    strongButtonText: {
        color: Colors.white,
    },
    nextButton: {
        backgroundColor: Colors.thaiGold,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.thaiGold,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    nextButtonText: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 18,
        color: Colors.white,
    },
});
