import { useState, useEffect, useMemo, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    ActivityIndicator,
    Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import {
    ChevronLeft,
    Eye,
    EyeOff,
    Mic,
    Volume2,
    VolumeX,
    X,
} from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { ThaiPatternBackground } from '@/src/components/common/ThaiPatternBackground';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { AiService } from '@/src/services/aiService';
import { AiExplanationView } from '@/src/components/ai/AiExplanationView';
import { getArticleById } from '@/src/utils/articleStorage';
import { useTtsPlayer } from '@/src/hooks/useTtsPlayer';
import type { SavedArticle, ExplainVocabularyResponse } from '@/src/entities/types/ai.types';
import { useUserStore } from '@/src/stores/userStore';
import i18n from '@/src/i18n';

type ClozeLevel = 'full' | 'partial' | 'blind';

export default function ArticlePracticeScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const { articleId } = useLocalSearchParams<{ articleId: string }>();

    const [article, setArticle] = useState<SavedArticle | null>(null);
    const [loading, setLoading] = useState(true);
    const [isBlind, setIsBlind] = useState(true);
    const [clozeLevel, setClozeLevel] = useState<ClozeLevel>('full');

    // Word lookup state
    const [selectedWord, setSelectedWord] = useState<string | null>(null);
    const [wordLoading, setWordLoading] = useState(false);
    const [wordResult, setWordResult] = useState<ExplainVocabularyResponse | null>(null);
    const [wordError, setWordError] = useState<string | null>(null);
    const [showWordModal, setShowWordModal] = useState(false);

    const { currentUser } = useUserStore();
    const { ttsLoading, isPlaying: ttsPlaying, playTts, stopTts } = useTtsPlayer();

    useEffect(() => {
        (async () => {
            try {
                setArticle(await getArticleById(articleId!));
            } catch { /* noop */ }
            setLoading(false);
        })();
    }, [articleId]);

    const thaiWords = useMemo(() => {
        if (!article) return [];
        return article.thaiText.split(/(\s+)/);
    }, [article]);

    const handleWordTap = useCallback(async (word: string) => {
        const cleaned = word.trim().replace(/[.,;:!?'"()[\]{}]/g, '');
        if (!cleaned) return;

        setSelectedWord(cleaned);
        setWordLoading(true);
        setWordError(null);
        setWordResult(null);
        setShowWordModal(true);

        const response = await AiService.explainVocabulary(
            cleaned,
            currentUser?.userId || 'guest',
            i18n.language
        );

        setWordLoading(false);
        if (!response.success || !response.data) {
            setWordError(response.error || t('home.aiError'));
            return;
        }
        setWordResult(response.data);
    }, [currentUser, t]);

    const closeWordModal = () => {
        setShowWordModal(false);
        setSelectedWord(null);
        setWordResult(null);
        setWordError(null);
    };

    const shouldMask = (word: string, level: ClozeLevel): boolean => {
        const cleaned = word.trim();
        if (!cleaned || /^\s+$/.test(word)) return false;
        if (level === 'full') return false;
        if (level === 'blind') return true;
        // partial: mask longer content words, keep short function words
        return cleaned.length > 2;
    };

    const renderMaskedWord = (word: string, idx: number) => {
        if (/^\s+$/.test(word)) {
            return <Text key={idx}>{word}</Text>;
        }

        const masked = shouldMask(word, clozeLevel);

        return (
            <Pressable key={idx} onPress={() => !isBlind && handleWordTap(word)}>
                <Text
                    style={[
                        styles.thaiWord,
                        masked && styles.maskedWord,
                        !isBlind && styles.tappableWord,
                    ]}
                >
                    {masked ? '▁'.repeat(Math.min(word.length, 6)) : word}
                </Text>
            </Pressable>
        );
    };

    const handleTtsToggle = () => {
        if (ttsPlaying) {
            stopTts();
        } else if (article) {
            playTts(article.thaiText);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centerFull}>
                    <ActivityIndicator size="large" color={Colors.thaiGold} />
                </View>
            </SafeAreaView>
        );
    }

    if (!article) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()} style={styles.backButton}>
                        <ChevronLeft size={22} color={Colors.ink} />
                    </Pressable>
                    <Text style={styles.headerTitle}>{t('articlePractice.practiceTitle')}</Text>
                    <View style={styles.backButton} />
                </View>
                <View style={styles.centerFull}>
                    <Text style={styles.errorText}>{t('sessionSummary.errorMessage')}</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
            <ThaiPatternBackground opacity={0.05} />

            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <ChevronLeft size={22} color={Colors.ink} />
                </Pressable>
                <Text style={styles.headerTitle} numberOfLines={1}>
                    {article.title}
                </Text>
                <View style={styles.backButton} />
            </View>

            {/* Mode Controls */}
            <View style={styles.controlBar}>
                <Pressable
                    style={[styles.controlBtn, !isBlind && styles.controlBtnActive]}
                    onPress={() => setIsBlind(!isBlind)}
                >
                    {isBlind ? (
                        <EyeOff size={16} color={Colors.taupe} />
                    ) : (
                        <Eye size={16} color={Colors.thaiGold} />
                    )}
                    <Text style={[styles.controlBtnText, !isBlind && styles.controlBtnTextActive]}>
                        {isBlind ? t('articlePractice.blindMode') : t('articlePractice.revealMode')}
                    </Text>
                </Pressable>

                <Pressable
                    style={[styles.controlBtn, ttsPlaying && styles.controlBtnActive]}
                    onPress={handleTtsToggle}
                    disabled={ttsLoading}
                >
                    {ttsLoading ? (
                        <ActivityIndicator size={14} color={Colors.thaiGold} />
                    ) : ttsPlaying ? (
                        <VolumeX size={16} color={Colors.thaiGold} />
                    ) : (
                        <Volume2 size={16} color={Colors.taupe} />
                    )}
                    <Text style={[styles.controlBtnText, ttsPlaying && styles.controlBtnTextActive]}>
                        {ttsLoading
                            ? t('articlePractice.ttsLoading')
                            : ttsPlaying
                            ? t('articlePractice.stopPlaying')
                            : t('articlePractice.playOriginal')}
                    </Text>
                </Pressable>

            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Thai Text */}
                <View style={[styles.textCard, isBlind && styles.textCardBlind]}>
                    {isBlind ? (
                        <>
                            <Text style={styles.thaiTextBlock}>
                                {article.thaiText}
                            </Text>
                            <BlurView
                                intensity={10}
                                tint="light"
                                style={[StyleSheet.absoluteFill, styles.blurOverlay]}
                            />
                        </>
                    ) : (
                        <>
                            <View style={styles.wordsContainer}>
                                {thaiWords.map((word, idx) => renderMaskedWord(word, idx))}
                            </View>
                            {clozeLevel === 'full' && (
                                <Text style={styles.tapHint}>{t('articlePractice.tapWordHint')}</Text>
                            )}
                        </>
                    )}
                </View>

                {/* Translation */}
                {!isBlind && (
                    <View style={styles.translationCard}>
                        <Text style={styles.translationLabel}>
                            {t('microReading.translationLabel')}
                        </Text>
                        <Text style={styles.translationText}>{article.translation}</Text>
                    </View>
                )}

                {/* Words Used */}
                {!isBlind && article.wordsUsed.length > 0 && (
                    <View style={styles.wordsUsedCard}>
                        <Text style={styles.wordsUsedLabel}>{t('microReading.wordsUsed')}</Text>
                        <View style={styles.wordsUsedRow}>
                            {article.wordsUsed.map((word, idx) => (
                                <Pressable
                                    key={idx}
                                    style={styles.wordChip}
                                    onPress={() => handleWordTap(word)}
                                >
                                    <Text style={styles.wordChipText}>{word}</Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                )}

                {/* Shadowing Entry */}
                <Pressable
                    style={styles.shadowingEntry}
                    onPress={() =>
                        router.push({
                            pathname: '/learning/article-practice-shadowing',
                            params: { articleId: article.id },
                        })
                    }
                >
                    <Mic size={18} color={Colors.thaiGold} />
                    <Text style={styles.shadowingEntryText}>
                        {t('articlePractice.shadowingTitle')}
                    </Text>
                </Pressable>

                <View style={{ height: 32 }} />
            </ScrollView>

            {/* Word Lookup Modal */}
            <Modal
                visible={showWordModal}
                transparent
                animationType="slide"
                onRequestClose={closeWordModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {selectedWord || t('ai.title')}
                            </Text>
                            <Pressable onPress={closeWordModal} style={styles.modalClose}>
                                <X size={22} color={Colors.ink} />
                            </Pressable>
                        </View>

                        {wordLoading ? (
                            <View style={styles.modalCenter}>
                                <ActivityIndicator size="large" color={Colors.thaiGold} />
                                <Text style={styles.modalLoadingText}>{t('common.loading')}</Text>
                            </View>
                        ) : wordError ? (
                            <View style={styles.modalCenter}>
                                <Text style={styles.modalErrorText}>{wordError}</Text>
                            </View>
                        ) : wordResult ? (
                            <View style={styles.modalResultWrapper}>
                                <AiExplanationView data={wordResult} />
                            </View>
                        ) : null}
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.paper,
    },
    centerFull: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.sand,
    },
    backButton: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        flex: 1,
        fontFamily: Typography.playfairBold,
        fontSize: Typography.h3,
        color: Colors.ink,
        textAlign: 'center',
    },
    controlBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.sand,
        flexWrap: 'wrap',
        gap: 8,
    },
    controlBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.04)',
    },
    controlBtnActive: {
        backgroundColor: 'rgba(212, 175, 55, 0.12)',
    },
    controlBtnText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: Typography.small,
        color: Colors.taupe,
    },
    controlBtnTextActive: {
        color: Colors.accent,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        gap: 16,
    },
    textCard: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 20,
        shadowColor: Colors.ink,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    thaiTextBlock: {
        fontFamily: Typography.sarabunRegular,
        fontSize: 22,
        color: Colors.ink,
        lineHeight: 38,
    },
    textCardBlind: {
        overflow: 'hidden',
    },
    blurOverlay: {
        borderRadius: 16,
    },
    wordsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    thaiWord: {
        fontFamily: Typography.sarabunRegular,
        fontSize: 22,
        color: Colors.ink,
        lineHeight: 38,
    },
    maskedWord: {
        color: Colors.sand,
        backgroundColor: Colors.sand,
        borderRadius: 4,
        overflow: 'hidden',
    },
    tappableWord: {
        textDecorationLine: 'underline',
        textDecorationColor: 'rgba(212, 175, 55, 0.3)',
        textDecorationStyle: 'dotted',
    },
    tapHint: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: Typography.small,
        color: Colors.taupe,
        marginTop: 12,
        textAlign: 'center',
    },
    translationCard: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 20,
        gap: 10,
        shadowColor: Colors.ink,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    translationLabel: {
        fontFamily: Typography.notoSerifBold,
        fontSize: Typography.small,
        color: Colors.taupe,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    translationText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: Typography.body,
        color: Colors.ink,
        lineHeight: 28,
    },
    wordsUsedCard: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 16,
        gap: 10,
        shadowColor: Colors.ink,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    wordsUsedLabel: {
        fontFamily: Typography.notoSerifBold,
        fontSize: Typography.small,
        color: Colors.taupe,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    wordsUsedRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    wordChip: {
        backgroundColor: Colors.thaiGold + '20',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 5,
    },
    wordChipText: {
        fontFamily: Typography.sarabunRegular,
        fontSize: Typography.caption,
        color: Colors.accent,
    },
    shadowingEntry: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: Colors.ink,
        borderRadius: 14,
        paddingVertical: 16,
    },
    shadowingEntryText: {
        fontFamily: Typography.notoSerifBold,
        fontSize: Typography.body,
        color: Colors.white,
    },
    errorText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: Typography.body,
        color: Colors.taupe,
        textAlign: 'center',
    },
    // Word modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: Colors.paper,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        height: '70%',
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 18,
        borderBottomWidth: 1,
        borderBottomColor: Colors.sand,
    },
    modalTitle: {
        fontFamily: Typography.sarabunBold,
        fontSize: Typography.h2,
        color: Colors.ink,
    },
    modalClose: {
        padding: 4,
    },
    modalCenter: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    modalLoadingText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: Typography.caption,
        color: Colors.taupe,
    },
    modalErrorText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: Typography.body,
        color: Colors.error,
        textAlign: 'center',
        paddingHorizontal: 24,
    },
    modalResultWrapper: {
        flex: 1,
        paddingTop: 12,
    },
});
