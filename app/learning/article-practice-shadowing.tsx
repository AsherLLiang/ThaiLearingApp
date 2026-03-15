import { useState, useEffect, useRef, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, Layers, Mic, Square, Play, Pause, Volume2, VolumeX, MessageSquareText } from 'lucide-react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system/legacy';
import { ThaiPatternBackground } from '@/src/components/common/ThaiPatternBackground';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { getArticleById, getClozeHints, setClozeHints } from '@/src/utils/articleStorage';
import { useTtsPlayer } from '@/src/hooks/useTtsPlayer';
import { AiService } from '@/src/services/aiService';
import type { SavedArticle, PronunciationFeedbackResponse } from '@/src/entities/types/ai.types';
import i18n from '@/src/i18n';

type ClozeLevel = 'full' | 'partial' | 'blind';

export default function ArticlePracticeShadowingScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const { articleId } = useLocalSearchParams<{ articleId: string }>();

    const [article, setArticle] = useState<SavedArticle | null>(null);
    const [loading, setLoading] = useState(true);
    const [clozeLevel, setClozeLevel] = useState<ClozeLevel>('full');
    /** AI 返回的半挖空提示词，null 表示未获取或失败，使用规则兜底 */
    const [aiClozeKeywords, setAiClozeKeywords] = useState<string[] | null>(null);

    // Recording state
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingUri, setRecordingUri] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const soundRef = useRef<Audio.Sound | null>(null);

    // AI feedback
    const [feedbackLoading, setFeedbackLoading] = useState(false);
    const [feedbackData, setFeedbackData] = useState<PronunciationFeedbackResponse | null>(null);
    const [feedbackError, setFeedbackError] = useState<string | null>(null);

    const { ttsLoading, isPlaying: ttsPlaying, playTts, stopTts } = useTtsPlayer();

    useEffect(() => {
        (async () => {
            try {
                setArticle(await getArticleById(articleId!));
            } catch { /* noop */ }
            setLoading(false);
        })();

        return () => {
            soundRef.current?.unloadAsync();
        };
    }, [articleId]);

    /** 半挖空模式：优先从缓存/AI 获取提示词，失败则用规则兜底 */
    useEffect(() => {
        if (!article || clozeLevel !== 'partial') {
            setAiClozeKeywords(null);
            return;
        }
        let cancelled = false;
        (async () => {
            try {
                const cached = await getClozeHints(article.id);
                if (cancelled) return;
                if (cached && cached.length > 0) {
                    setAiClozeKeywords(cached);
                    return;
                }
                const res = await AiService.extractClozeHints(article.thaiText);
                if (cancelled) return;
                if (res.success && res.data?.keywords?.length) {
                    setAiClozeKeywords(res.data.keywords);
                    await setClozeHints(article.id, res.data.keywords);
                } else {
                    setAiClozeKeywords(null);
                }
            } catch {
                if (!cancelled) setAiClozeKeywords(null);
            }
        })();
        return () => { cancelled = true; };
    }, [article?.id, article?.thaiText, clozeLevel]);

    const thaiWords = useMemo(() => {
        if (!article) return [];
        return article.thaiText.split(/(\s+)/);
    }, [article]);

    /** 半挖空时保留的提示词索引：AI 关键词优先，否则每 4 个内容词保留 1 个 */
    const partialHintIndices = useMemo(() => {
        const indices = new Set<number>();
        const keywordsSet = aiClozeKeywords && aiClozeKeywords.length > 0
            ? new Set(aiClozeKeywords)
            : null;

        let contentIdx = 0;
        thaiWords.forEach((w, i) => {
            const cleaned = w.trim();
            if (!cleaned || /^\s+$/.test(w)) return;
            if (keywordsSet) {
                if (keywordsSet.has(cleaned)) indices.add(i);
            } else {
                if (contentIdx % 4 === 0) indices.add(i);
            }
            contentIdx++;
        });
        return indices;
    }, [thaiWords, aiClozeKeywords]);

    const shouldMask = (word: string, level: ClozeLevel, wordIdx: number): boolean => {
        const cleaned = word.trim();
        if (!cleaned || /^\s+$/.test(word)) return false;
        if (level === 'full') return false;
        if (level === 'blind') return true;
        if (level === 'partial') return !partialHintIndices.has(wordIdx);
        return false;
    };

    const renderMaskedWord = (word: string, idx: number) => {
        if (/^\s+$/.test(word)) {
            return <Text key={idx}>{word}</Text>;
        }
        const masked = shouldMask(word, clozeLevel, idx);
        if (masked) {
            const placeholder = '_'.repeat(Math.min(word.length, 8));
            return (
                <Text
                    key={idx}
                    style={[styles.thaiWord, styles.maskedPlaceholderText]}
                >
                    {placeholder}
                </Text>
            );
        }
        return (
            <Text key={idx} style={styles.thaiWord}>
                {word}
            </Text>
        );
    };

    const startRecording = async () => {
        try {
            const { status } = await Audio.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(t('common.error'), 'Microphone permission is required');
                return;
            }

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const { recording: rec } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            setRecording(rec);
            setIsRecording(true);
            setRecordingUri(null);
            setFeedbackData(null);
            setFeedbackError(null);
        } catch {
            Alert.alert(t('common.error'), 'Failed to start recording');
        }
    };

    const stopRecording = async () => {
        if (!recording) return;
        try {
            setIsRecording(false);
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();
            setRecordingUri(uri);
            setRecording(null);

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                playsInSilentModeIOS: true,
            });
        } catch {
            setIsRecording(false);
            setRecording(null);
        }
    };

    const playRecording = async () => {
        if (!recordingUri) return;
        try {
            if (soundRef.current) {
                await soundRef.current.unloadAsync();
            }
            const { sound } = await Audio.Sound.createAsync({ uri: recordingUri });
            soundRef.current = sound;
            setIsPlaying(true);
            sound.setOnPlaybackStatusUpdate(status => {
                if (status.isLoaded && status.didJustFinish) {
                    setIsPlaying(false);
                }
            });
            await sound.playAsync();
        } catch {
            setIsPlaying(false);
        }
    };

    const stopPlayback = async () => {
        try {
            await soundRef.current?.stopAsync();
            setIsPlaying(false);
        } catch {
            setIsPlaying(false);
        }
    };

    const getAiFeedback = async () => {
        if (!article || !recordingUri) return;
        setFeedbackLoading(true);
        setFeedbackData(null);
        setFeedbackError(null);
        try {
            const base64 = await FileSystem.readAsStringAsync(recordingUri, {
                encoding: FileSystem.EncodingType.Base64,
            });

            const response = await AiService.analyzePronunciation(
                base64,
                article.thaiText,
                i18n.language
            );

            if (!response.success || !response.data) {
                setFeedbackError(response.error || t('articlePractice.analyzeError'));
                return;
            }
            setFeedbackData(response.data);
        } catch {
            setFeedbackError(t('articlePractice.analyzeError'));
        } finally {
            setFeedbackLoading(false);
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
                    <Text style={styles.headerTitle}>{t('articlePractice.shadowingTitle')}</Text>
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

            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <ChevronLeft size={22} color={Colors.ink} />
                </Pressable>
                <Text style={styles.headerTitle} numberOfLines={1}>
                    {t('articlePractice.shadowingTitle')}
                </Text>
                <View style={styles.backButton} />
            </View>

            {/* Cloze Mode */}
            <View style={styles.controlBar}>
                <Layers size={14} color={Colors.taupe} />
                {(['full', 'partial', 'blind'] as ClozeLevel[]).map(level => (
                    <Pressable
                        key={level}
                        style={[
                            styles.clozePill,
                            clozeLevel === level && styles.clozePillActive,
                        ]}
                        onPress={() => setClozeLevel(level)}
                    >
                        <Text
                            style={[
                                styles.clozePillText,
                                clozeLevel === level && styles.clozePillTextActive,
                            ]}
                        >
                            {t(`articlePractice.cloze${level.charAt(0).toUpperCase() + level.slice(1)}` as any)}
                        </Text>
                    </Pressable>
                ))}
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Reference Text */}
                <View style={styles.textCard}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardLabel}>{article.title}</Text>
                        <Pressable
                            style={[styles.ttsBtn, ttsPlaying && styles.ttsBtnActive]}
                            onPress={() => ttsPlaying ? stopTts() : playTts(article.thaiText)}
                            disabled={ttsLoading}
                        >
                            {ttsLoading ? (
                                <ActivityIndicator size={14} color={Colors.thaiGold} />
                            ) : ttsPlaying ? (
                                <VolumeX size={16} color={Colors.thaiGold} />
                            ) : (
                                <Volume2 size={16} color={Colors.taupe} />
                            )}
                        </Pressable>
                    </View>
                    <View style={styles.wordsContainer}>
                        {thaiWords.map((word, idx) => renderMaskedWord(word, idx))}
                    </View>
                </View>

                {/* Recording Controls */}
                <View style={styles.recordSection}>
                    {!isRecording && !recordingUri && (
                        <Pressable style={styles.recordButton} onPress={startRecording}>
                            <Mic size={28} color={Colors.white} />
                            <Text style={styles.recordButtonText}>
                                {t('articlePractice.startRecording')}
                            </Text>
                        </Pressable>
                    )}

                    {isRecording && (
                        <Pressable style={styles.stopButton} onPress={stopRecording}>
                            <Square size={24} color={Colors.white} />
                            <Text style={styles.recordButtonText}>
                                {t('articlePractice.stopRecording')}
                            </Text>
                        </Pressable>
                    )}

                    {recordingUri && !isRecording && (
                        <View style={styles.playbackRow}>
                            <Pressable
                                style={styles.playbackBtn}
                                onPress={isPlaying ? stopPlayback : playRecording}
                            >
                                {isPlaying ? (
                                    <Pause size={20} color={Colors.ink} />
                                ) : (
                                    <Play size={20} fill={Colors.ink} color={Colors.ink} />
                                )}
                                <Text style={styles.playbackBtnText}>
                                    {t('articlePractice.playback')}
                                </Text>
                            </Pressable>

                            <Pressable style={styles.reRecordBtn} onPress={startRecording}>
                                <Mic size={18} color={Colors.thaiGold} />
                            </Pressable>
                        </View>
                    )}
                </View>

                {/* AI Feedback — 已屏蔽 */}
                {false && recordingUri && (
                    <Pressable
                        style={styles.feedbackButton}
                        onPress={getAiFeedback}
                        disabled={feedbackLoading}
                    >
                        {feedbackLoading ? (
                            <ActivityIndicator size="small" color={Colors.white} />
                        ) : (
                            <MessageSquareText size={18} color={Colors.white} />
                        )}
                        <Text style={styles.feedbackButtonText}>
                            {feedbackLoading
                                ? t('articlePractice.analyzing')
                                : t('articlePractice.getAiFeedback')}
                        </Text>
                    </Pressable>
                )}

                {false && feedbackError && (
                    <View style={styles.feedbackCard}>
                        <Text style={styles.feedbackErrorText}>{feedbackError}</Text>
                    </View>
                )}

                {false && feedbackData && (
                    <View style={styles.feedbackCard}>
                        {/* Overall Score */}
                        <View style={styles.scoreRow}>
                            <Text style={styles.scoreLabel}>{t('articlePractice.overallScore')}</Text>
                            <Text style={styles.scoreValue}>{feedbackData.overallScore}/10</Text>
                        </View>

                        {/* Dimensions */}
                        {feedbackData.dimensions.map((dim, idx) => (
                            <View key={idx} style={styles.dimensionRow}>
                                <View style={styles.dimensionHeader}>
                                    <Text style={styles.dimensionName}>{dim.name}</Text>
                                    <Text style={styles.dimensionScore}>{dim.score}/10</Text>
                                </View>
                                <View style={styles.scoreBarBg}>
                                    <View style={[styles.scoreBarFill, { width: `${dim.score * 10}%` }]} />
                                </View>
                                <Text style={styles.dimensionComment}>{dim.comment}</Text>
                            </View>
                        ))}

                        {/* Transcription */}
                        {feedbackData.transcription ? (
                            <View style={styles.transcriptionSection}>
                                <Text style={styles.sectionLabel}>
                                    {i18n.language === 'zh' ? 'AI 听到的内容' : 'What AI heard'}
                                </Text>
                                <Text style={styles.transcriptionText}>{feedbackData.transcription}</Text>
                            </View>
                        ) : null}

                        {/* Suggestions */}
                        {feedbackData.suggestions.length > 0 && (
                            <View style={styles.suggestionsSection}>
                                <Text style={styles.sectionLabel}>{t('articlePractice.pronunciationSuggestions')}</Text>
                                {feedbackData.suggestions.map((s, idx) => (
                                    <Text key={idx} style={styles.suggestionItem}>• {s}</Text>
                                ))}
                            </View>
                        )}
                    </View>
                )}

                <View style={{ height: 32 }} />
            </ScrollView>
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
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.sand,
        gap: 8,
    },
    clozePill: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 14,
        backgroundColor: 'rgba(0,0,0,0.04)',
    },
    clozePillActive: {
        backgroundColor: Colors.ink,
    },
    clozePillText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 11,
        color: Colors.taupe,
    },
    clozePillTextActive: {
        color: Colors.white,
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
        gap: 12,
        shadowColor: Colors.ink,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    cardLabel: {
        flex: 1,
        fontFamily: Typography.notoSerifBold,
        fontSize: Typography.body,
        color: Colors.ink,
    },
    ttsBtn: {
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 18,
        backgroundColor: 'rgba(0,0,0,0.04)',
    },
    ttsBtnActive: {
        backgroundColor: 'rgba(212, 175, 55, 0.12)',
    },
    wordsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    thaiWord: {
        fontFamily: Typography.sarabunRegular,
        fontSize: 20,
        color: Colors.ink,
        lineHeight: 34,
    },
    maskedPlaceholderText: {
        color: Colors.taupe,
        textDecorationLine: 'underline',
        textDecorationStyle: 'dashed',
        textDecorationColor: Colors.ink,
    },
    recordSection: {
        alignItems: 'center',
        gap: 12,
    },
    recordButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        backgroundColor: Colors.thaiGold,
        borderRadius: 28,
        paddingVertical: 16,
        paddingHorizontal: 32,
        shadowColor: Colors.thaiGold,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    stopButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        backgroundColor: Colors.error,
        borderRadius: 28,
        paddingVertical: 16,
        paddingHorizontal: 32,
    },
    recordButtonText: {
        fontFamily: Typography.notoSerifBold,
        fontSize: Typography.body,
        color: Colors.white,
    },
    playbackRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    playbackBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: Colors.white,
        borderRadius: 20,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: Colors.sand,
    },
    playbackBtnText: {
        fontFamily: Typography.notoSerifBold,
        fontSize: Typography.caption,
        color: Colors.ink,
    },
    reRecordBtn: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 22,
        backgroundColor: 'rgba(212, 175, 55, 0.12)',
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.25)',
    },
    feedbackButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: Colors.ink,
        borderRadius: 14,
        paddingVertical: 14,
    },
    feedbackButtonText: {
        fontFamily: Typography.notoSerifBold,
        fontSize: Typography.caption,
        color: Colors.white,
    },
    feedbackCard: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 20,
        gap: 16,
        shadowColor: Colors.ink,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    feedbackErrorText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: Typography.caption,
        color: Colors.error,
        textAlign: 'center',
    },
    scoreRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    scoreLabel: {
        fontFamily: Typography.notoSerifBold,
        fontSize: Typography.body,
        color: Colors.ink,
    },
    scoreValue: {
        fontFamily: Typography.playfairBold,
        fontSize: Typography.h2,
        color: Colors.thaiGold,
    },
    dimensionRow: {
        gap: 4,
    },
    dimensionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dimensionName: {
        fontFamily: Typography.notoSerifBold,
        fontSize: Typography.small,
        color: Colors.ink,
    },
    dimensionScore: {
        fontFamily: Typography.notoSerifBold,
        fontSize: Typography.small,
        color: Colors.taupe,
    },
    scoreBarBg: {
        height: 6,
        borderRadius: 3,
        backgroundColor: Colors.sand,
        overflow: 'hidden',
    },
    scoreBarFill: {
        height: '100%',
        borderRadius: 3,
        backgroundColor: Colors.thaiGold,
    },
    dimensionComment: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 12,
        color: Colors.taupe,
        lineHeight: 18,
    },
    transcriptionSection: {
        gap: 4,
        paddingTop: 4,
        borderTopWidth: 1,
        borderTopColor: Colors.sand,
    },
    transcriptionText: {
        fontFamily: Typography.sarabunRegular,
        fontSize: Typography.caption,
        color: Colors.ink,
        lineHeight: 24,
    },
    suggestionsSection: {
        gap: 6,
        paddingTop: 4,
        borderTopWidth: 1,
        borderTopColor: Colors.sand,
    },
    sectionLabel: {
        fontFamily: Typography.notoSerifBold,
        fontSize: Typography.small,
        color: Colors.taupe,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    suggestionItem: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: Typography.caption,
        color: Colors.ink,
        lineHeight: 22,
    },
    errorText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: Typography.body,
        color: Colors.taupe,
        textAlign: 'center',
    },
});
