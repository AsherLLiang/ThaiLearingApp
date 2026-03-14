import React, { useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, Mic } from 'lucide-react-native';
import { ThaiPatternBackground } from '@/src/components/common/ThaiPatternBackground';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import type { MicroReadingResponse } from '@/src/entities/types/ai.types';


export default function MicroReadingScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const params = useLocalSearchParams<{ result: string }>();

    // 从 Expo Router params 解析 AI 返回结果
    const reading = useMemo<MicroReadingResponse | null>(() => {
        try {
            return params.result ? JSON.parse(params.result) : null;
        } catch {
            return null;
        }
    }, [params.result]);


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

                        {/* 语音占位符 */}
                        <View style={styles.voicePlaceholder}>
                            <Mic size={20} color={Colors.taupe} />
                            <Text style={styles.voicePlaceholderText}>
                                {t('microReading.voicePlaceholder')}
                            </Text>
                        </View>

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
    voicePlaceholder: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: Colors.sand,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderWidth: 1,
        borderColor: Colors.taupe + '30',
        borderStyle: 'dashed',
    },
    voicePlaceholderText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: Typography.caption,
        color: Colors.taupe,
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
