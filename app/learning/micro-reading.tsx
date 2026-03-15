import React, { useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, BookmarkPlus, Check } from 'lucide-react-native';
import { ThaiPatternBackground } from '@/src/components/common/ThaiPatternBackground';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { saveArticle } from '@/src/utils/articleStorage';
import type { MicroReadingResponse, SavedArticle } from '@/src/entities/types/ai.types';


export default function MicroReadingScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const params = useLocalSearchParams<{ result: string }>();

    const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

    // 从 Expo Router params 解析 AI 返回结果
    const reading = useMemo<MicroReadingResponse | null>(() => {
        try {
            return params.result ? JSON.parse(params.result) : null;
        } catch {
            return null;
        }
    }, [params.result]);

    const handleSaveArticle = async () => {
        if (!reading || saveState === 'saving' || saveState === 'saved') return;

        setSaveState('saving');
        try {
            const thaiWords = reading.thaiText.trim().split(/\s+/);
            const newArticle: SavedArticle = {
                id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
                title: reading.title,
                thaiText: reading.thaiText,
                translation: reading.translation,
                wordsUsed: reading.wordsUsed || [],
                createdAt: Date.now(),
                wordCount: thaiWords.length,
            };

            await saveArticle(newArticle);
            setSaveState('saved');
        } catch {
            setSaveState('error');
        }
    };

    return (
        <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
            <ThaiPatternBackground opacity={0.05} />

            {/* 顶部导航栏 */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <ChevronLeft size={22} color={Colors.ink} />
                </Pressable>
                <Text style={styles.headerTitle}>{t('microReading.title')}</Text>
                {/* 占位，使标题居中 */}
                <View style={styles.backButton} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {reading ? (
                    <>
                        {/* 泰文短文主体 */}
                        <View style={styles.thaiCard}>
                            <Text style={styles.thaiTitle}>{reading.title}</Text> 
                            <View style={styles.thaiTitleLine} />
                            <Text style={styles.thaiText}>{reading.thaiText}</Text>
                        </View>

                        {/* 保存到练习库 */}
                        <Pressable
                            style={[
                                styles.saveArticleButton,
                                saveState === 'saved' && styles.saveArticleButtonDone,
                            ]}
                            onPress={handleSaveArticle}
                            disabled={saveState === 'saving' || saveState === 'saved'}
                        >
                            {saveState === 'saving' ? (
                                <ActivityIndicator size="small" color={Colors.thaiGold} />
                            ) : saveState === 'saved' ? (
                                <Check size={18} color={Colors.success} />
                            ) : (
                                <BookmarkPlus size={18} color={Colors.thaiGold} />
                            )}
                            <Text
                                style={[
                                    styles.saveArticleText,
                                    saveState === 'saved' && { color: Colors.success },
                                    saveState === 'error' && { color: Colors.error },
                                ]}
                            >
                                {saveState === 'saving'
                                    ? t('microReading.saving')
                                    : saveState === 'saved'
                                    ? t('microReading.saveSuccess')
                                    : saveState === 'error'
                                    ? t('microReading.saveError')
                                    : t('microReading.saveArticle')}
                            </Text>
                        </Pressable>

                        {/* 中文辅助翻译 */}
                        <View style={styles.translationCard}>
                            <Text style={styles.translationLabel}>
                                {t('microReading.translationLabel')}
                            </Text>
                            <Text style={styles.translationText}>{reading.translation}</Text>
                        </View>

                        {/* 涉及词汇标签（可选，仅当云端返回时展示） */}
                        {reading.wordsUsed && reading.wordsUsed.length > 0 && (
                            <View style={styles.wordsUsedCard}>
                                <Text style={styles.wordsUsedLabel}>
                                    {t('microReading.wordsUsed')}
                                </Text>
                                <View style={styles.wordsUsedRow}>
                                    {reading.wordsUsed.map((word, idx) => (
                                        <View key={idx} style={styles.wordChip}>
                                            <Text style={styles.wordChipText}>{word}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}
                    </>
                ) : (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{t('sessionSummary.errorMessage')}</Text>
                    </View>
                )}

                <View style={{ height: 24 }} />
            </ScrollView>

            {/* 返回首页按钮 */}
            <View style={styles.footer}>
                <Pressable
                    style={styles.homeButton}
                    onPress={() => router.dismissAll()}
                >
                    <Text style={styles.homeButtonText}>{t('microReading.backToHome')}</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.paper,
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
        fontFamily: Typography.playfairBold,
        fontSize: Typography.h3,
        color: Colors.ink,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 20,
        gap: 16,
    },
    thaiCard: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 20,
        shadowColor: Colors.ink,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    thaiTitle: {
        fontFamily: Typography.notoSerifBold,
        fontSize: Typography.h1,
        color: Colors.ink,
        marginBottom: 10,
    },
    thaiTitleLine: {
        height: 2,
        backgroundColor: Colors.ink,
        marginBottom: 10,
    },
    thaiText: {
        fontFamily: Typography.sarabunRegular,
        fontSize: 22,
        color: Colors.ink,
        lineHeight: 38,
    },
    saveArticleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.25)',
    },
    saveArticleButtonDone: {
        backgroundColor: 'rgba(42, 157, 143, 0.08)',
        borderColor: 'rgba(42, 157, 143, 0.2)',
    },
    saveArticleText: {
        fontFamily: Typography.notoSerifBold,
        fontSize: Typography.caption,
        color: Colors.accent,
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
    errorContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    errorText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: Typography.body,
        color: Colors.taupe,
        textAlign: 'center',
    },
    footer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: Colors.sand,
        backgroundColor: Colors.paper,
    },
    homeButton: {
        backgroundColor: Colors.ink,
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    homeButtonText: {
        fontFamily: Typography.notoSerifBold,
        fontSize: Typography.body,
        color: Colors.white,
    },
});
