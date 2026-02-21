import React, { useState, useMemo, useEffect } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { Vocabulary } from '@/src/entities/types/vocabulary.types';
import { useVocabularyStore } from '@/src/stores/vocabularyStore';
import { VocabMultipleQuiz, QuizOption } from '@/src/components/learning/vocabulary/VocabMultipleQuiz';
import { VocabularyDetailView } from '@/src/components/learning/vocabulary/VocabularyDetailView';
import { WordCard } from '@/src/components/learning/vocabulary/WordCard';
import { useTranslation } from 'react-i18next';

interface VocabularyQuizViewProps {
    vocabulary: Vocabulary;
}

export const VocabularyQuizView: React.FC<VocabularyQuizViewProps> = ({ vocabulary }) => {
    const { t } = useTranslation();
    const [viewMode, setViewMode] = useState<'QUIZ' | 'DETAILS'>('QUIZ');
    const [options, setOptions] = useState<QuizOption[]>([]);

    const sessionPool = useVocabularyStore(state => state.sessionPool);
    const submitResult = useVocabularyStore(state => state.submitResult);

    // Generate Options only when vocabulary changes
    useEffect(() => {
        setViewMode('QUIZ');

        const correctOption: QuizOption = {
            id: vocabulary._id,
            definition: vocabulary.meaning,
            isCorrect: true
        };

        // 从 sessionPool （原始完整词列表快照）取干扰项，不受 skipWord 影响
        // sessionPool 中同一 id 可能出现多次（learn + quiz 两阶段），先去重
        const seenIds = new Set<string>();
        const uniquePool = sessionPool.filter(item => {
            if (seenIds.has(item.id)) return false;
            seenIds.add(item.id);
            return true;
        });
        const shuffledPool = uniquePool.sort(() => 0.5 - Math.random());

        const distractorPool = new Map<string, QuizOption>();
        for (const item of shuffledPool) {
            if (item.id !== vocabulary._id && !distractorPool.has(item.id)) {
                distractorPool.set(item.id, {
                    id: item.id,
                    definition: item.entity.meaning,
                    isCorrect: false
                });
            }
            if (distractorPool.size >= 3) break;
        }

        const distractors = Array.from(distractorPool.values());
        const combined = [correctOption, ...distractors];
        setOptions(combined.sort(() => 0.5 - Math.random()));
    }, [vocabulary._id]); // Only re-run when word changes

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
                    <WordCard
                        vocabulary={vocabulary}
                    />
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
