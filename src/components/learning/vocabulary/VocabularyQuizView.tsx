import React, { useState, useMemo, useEffect } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { Vocabulary } from '@/src/entities/types/vocabulary.types';
import { useVocabularyStore } from '@/src/stores/vocabularyStore';
import { VocabMultipleQuiz, QuizOption } from '@/src/components/learning/vocabulary/VocabMultipleQuiz';
import { VocabularyDetailView } from '@/src/components/learning/vocabulary/VocabularyDetailView';
import { useTranslation } from 'react-i18next';

interface VocabularyQuizViewProps {
    vocabulary: Vocabulary;
}

export const VocabularyQuizView: React.FC<VocabularyQuizViewProps> = ({ vocabulary }) => {
    const { t } = useTranslation();
    const [viewMode, setViewMode] = useState<'QUIZ' | 'DETAILS'>('QUIZ');

    const queue = useVocabularyStore(state => state.queue);
    const submitResult = useVocabularyStore(state => state.submitResult);

    // Reset mode when vocabulary changes
    useEffect(() => {
        setViewMode('QUIZ');
    }, [vocabulary._id]);

    // Generate Options
    const options = useMemo<QuizOption[]>(() => {
        // 1. Current word is correct option
        const correctOption: QuizOption = {
            id: vocabulary._id,
            definition: vocabulary.meaning, // Question is Thai, Answer is Meaning
            isCorrect: true
        };

        // 2. Pick distractors
        // Filter out current word
        const otherWords = queue.filter(w => w.id !== vocabulary._id);

        // Shuffle others
        const shuffledOthers = [...otherWords].sort(() => 0.5 - Math.random());

        // Take top 3
        const distributers = shuffledOthers.slice(0, 3).map(w => ({
            id: w.id,
            definition: w.entity.meaning,
            isCorrect: false
        }));

        // 3. Combine and shuffle
        const combined = [correctOption, ...distributers];
        return combined.sort(() => 0.5 - Math.random());
    }, [vocabulary._id, queue]); // Re-generate if ID or queue changes

    const handleCorrect = () => {
        // Transition to Details view
        setViewMode('DETAILS');
    };

    const handleWrong = () => {
        // Record mistake, stay in QUIZ mode
        submitResult(false);
    };

    const handleNext = () => {
        // Submit correct (finally) and advance
        // Note: submitResult logic handles scoring based on mistakeCount accumulated during handleWrong
        submitResult(true);
    };

    return (
        <View style={styles.container}>
            {viewMode === 'QUIZ' ? (
                <VocabMultipleQuiz
                    vocabulary={vocabulary}
                    options={options}
                    onCorrect={handleCorrect}
                    onWrong={handleWrong}
                />
            ) : (
                <View style={styles.detailsWrapper}>
                    {/* Reuse VocabularyDetailView (without blur) */}
                    <VocabularyDetailView
                        vocabulary={vocabulary}
                        blurDetails={false}
                    />

                    {/* Bottom Next Button */}
                    <View style={styles.bottomBar}>
                        <Pressable style={styles.nextButton} onPress={handleNext}>
                            <Text style={styles.nextButtonText}>{t('learning.next')}</Text>
                        </Pressable>
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.paper,
    },
    detailsWrapper: {
        flex: 1,
        paddingTop: 40,
        paddingHorizontal: 20,
    },
    bottomBar: {
        paddingVertical: 20,
        backgroundColor: Colors.paper,
        borderTopWidth: 1,
        borderTopColor: Colors.sand,
    },
    nextButton: {
        backgroundColor: Colors.ink,
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
