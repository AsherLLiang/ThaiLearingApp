import React, { useEffect, useState, useCallback } from 'react';
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
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { CheckSquare, Square, ChevronRight, AlertCircle } from 'lucide-react-native';
import { ThaiPatternBackground } from '@/src/components/common/ThaiPatternBackground';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { useVocabularyStore } from '@/src/stores/vocabularyStore';
import { AiService } from '@/src/services/aiService';
import type { SessionWord } from '@/src/entities/types/vocabulary.types';
import type { MicroReadingWord } from '@/src/entities/types/ai.types';

// 每个可勾选词条的本地状态
interface SelectableWord {
    sessionWord: SessionWord;
    checked: boolean;
}

export default function SessionSummaryScreen() {
    const { t, i18n } = useTranslation();
    const router = useRouter();

    // ── 从 Store 快照数据（仅在 mount 时读取一次，防止 resetSession 后丢失）──
    const [wrongWords, setWrongWords] = useState<SelectableWord[]>([]);
    const [newWords, setNewWords] = useState<SelectableWord[]>([]);
    const [skippedWords, setSkippedWords] = useState<SelectableWord[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        const { recentWrongWords, sessionPool, skippedIds } = useVocabularyStore.getState();

        // 错词：默认全选（finishSession 内已去重）
        setWrongWords(
            recentWrongWords.map(w => ({ sessionWord: w, checked: true }))
        );

        // 新学词：isNew === true，按 entity._id 去重（sessionPool 中同一词可能有多条 source）
        const seenNew = new Set<string>();
        const newWordItems = sessionPool.filter(w => {
            if (!w.isNew) return false;
            if (seenNew.has(w.entity._id)) return false;
            seenNew.add(w.entity._id);
            return true;
        });
        setNewWords(newWordItems.map(w => ({ sessionWord: w, checked: false })));

        // 跳过词：skippedIds 存储 entity._id（即 SessionWord.id），按 id 去重后关联 sessionPool
        const seenSkip = new Set<string>();
        const skippedItems = sessionPool.filter(w => {
            if (!skippedIds.includes(w.id)) return false;
            if (seenSkip.has(w.id)) return false;
            seenSkip.add(w.id);
            return true;
        });
        setSkippedWords(skippedItems.map(w => ({ sessionWord: w, checked: false })));
    }, []);

    // ── 勾选/取消勾选 ──────────────────────────────────────────────────────────
    const toggleWrong = useCallback((index: number) => {
        setWrongWords(prev =>
            prev.map((item, i) => i === index ? { ...item, checked: !item.checked } : item)
        );
    }, []);

    const toggleNew = useCallback((index: number) => {
        setNewWords(prev =>
            prev.map((item, i) => i === index ? { ...item, checked: !item.checked } : item)
        );
    }, []);

    const toggleSkipped = useCallback((index: number) => {
        setSkippedWords(prev =>
            prev.map((item, i) => i === index ? { ...item, checked: !item.checked } : item)
        );
    }, []);

    // 取消跳过：从跳过列表中移除该词条（本地 state 操作，不写回 Store）
    const cancelSkip = useCallback((index: number) => {
        setSkippedWords(prev => prev.filter((_, i) => i !== index));
    }, []);

    // ── 计算已选词汇 ───────────────────────────────────────────────────────────
    const selectedWords: MicroReadingWord[] = [
        ...wrongWords.filter(item => item.checked),
        ...newWords.filter(item => item.checked),
        ...skippedWords.filter(item => item.checked),
    ].map(item => ({
        thaiWord: item.sessionWord.entity.thaiWord,
        meaning: item.sessionWord.entity.meaning,
    }));

    const selectedCount = selectedWords.length;

    // ── 生成微阅读 ─────────────────────────────────────────────────────────────
    const handleGenerate = async () => {
        if (selectedCount === 0) return;

        setIsGenerating(true);
        try {
            const response = await AiService.generateMicroReading(
                selectedWords,
                i18n.language
            );

            if (response.success && response.data) {
                router.push({
                    pathname: '/learning/micro-reading',
                    params: { result: JSON.stringify(response.data) },
                });
            } else {
                Alert.alert(
                    t('sessionSummary.errorTitle'),
                    response.error || t('sessionSummary.errorMessage'),
                    [{ text: t('sessionSummary.retry'), onPress: () => setIsGenerating(false) }]
                );
                return;
            }
        } catch {
            Alert.alert(
                t('sessionSummary.errorTitle'),
                t('sessionSummary.errorMessage'),
                [{ text: t('sessionSummary.retry'), onPress: () => setIsGenerating(false) }]
            );
            return;
        }
        setIsGenerating(false);
    };

    // ── 判断是否有任何词可展示 ─────────────────────────────────────────────────
    const hasAnyWords =
        wrongWords.length > 0 || newWords.length > 0 || skippedWords.length > 0;

    return (
        <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
            <ThaiPatternBackground opacity={0.05} />

            {/* 标题栏 */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{t('sessionSummary.title')}</Text>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {!hasAnyWords && (
                    <View style={styles.emptyContainer}>
                        <AlertCircle size={40} color={Colors.taupe} />
                        <Text style={styles.emptyText}>{t('sessionSummary.noWords')}</Text>
                    </View>
                )}

                {/* 错词区（置顶，默认全选） */}
                {wrongWords.length > 0 && (
                    <SectionBlock
                        label={t('sessionSummary.wrongWords')}
                        accentColor={Colors.error}
                        badgeText="×"
                    >
                        {wrongWords.map((item, index) => (
                            <WordRow
                                key={item.sessionWord.entity._id + '-wrong'}
                                thaiWord={item.sessionWord.entity.thaiWord}
                                meaning={item.sessionWord.entity.meaning}
                                badge={`×${item.sessionWord.mistakeCount}`}
                                badgeColor={Colors.error}
                                checked={item.checked}
                                onToggle={() => toggleWrong(index)}
                            />
                        ))}
                    </SectionBlock>
                )}

                {/* 新学词区 */}
                {newWords.length > 0 && (
                    <SectionBlock
                        label={t('sessionSummary.newWords')}
                        accentColor={Colors.success}
                    >
                        {newWords.map((item, index) => (
                            <WordRow
                                key={item.sessionWord.entity._id + '-new'}
                                thaiWord={item.sessionWord.entity.thaiWord}
                                meaning={item.sessionWord.entity.meaning}
                                badge="新"
                                badgeColor={Colors.success}
                                checked={item.checked}
                                onToggle={() => toggleNew(index)}
                            />
                        ))}
                    </SectionBlock>
                )}

                {/* 跳过词区 */}
                {skippedWords.length > 0 && (
                    <SectionBlock
                        label={t('sessionSummary.skippedWords')}
                        accentColor={Colors.taupe}
                    >
                        {skippedWords.map((item, index) => (
                            <WordRow
                                key={item.sessionWord.entity._id + '-skip'}
                                thaiWord={item.sessionWord.entity.thaiWord}
                                meaning={item.sessionWord.entity.meaning}
                                badge="跳"
                                badgeColor={Colors.taupe}
                                checked={item.checked}
                                onToggle={() => toggleSkipped(index)}
                                actionLabel={t('sessionSummary.cancelSkip')}
                                onAction={() => cancelSkip(index)}
                            />
                        ))}
                    </SectionBlock>
                )}

                {/* 底部占位，防止按钮遮挡最后一行 */}
                <View style={{ height: 100 }} />
            </ScrollView>

            {/* 底部按钮区（固定）*/}
            <View style={styles.footer}>
                <Pressable
                    style={[
                        styles.generateButton,
                        (selectedCount === 0 || isGenerating) && styles.generateButtonDisabled,
                    ]}
                    onPress={handleGenerate}
                    disabled={selectedCount === 0 || isGenerating}
                >
                    {isGenerating ? (
                        <ActivityIndicator color={Colors.white} />
                    ) : (
                        <>
                            <Text style={styles.generateButtonText}>
                                {t('sessionSummary.generateBtn', { count: selectedCount })}
                            </Text>
                            <ChevronRight size={18} color={Colors.white} />
                        </>
                    )}
                </Pressable>
                <Pressable
                    style={styles.homeButton}
                    onPress={() => router.dismissAll()}
                    disabled={isGenerating}
                >
                    <Text style={styles.homeButtonText}>{t('microReading.backToHome')}</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

// ── 子组件：分区容器 ──────────────────────────────────────────────────────────
interface SectionBlockProps {
    label: string;
    accentColor: string;
    badgeText?: string;
    children: React.ReactNode;
}

function SectionBlock({ label, accentColor, children }: SectionBlockProps) {
    return (
        <View style={styles.section}>
            <View style={[styles.sectionLabelBar, { borderLeftColor: accentColor }]}>
                <Text style={[styles.sectionLabel, { color: accentColor }]}>{label}</Text>
            </View>
            <View style={styles.sectionBody}>{children}</View>
        </View>
    );
}

// ── 子组件：单词行 ─────────────────────────────────────────────────────────────
interface WordRowProps {
    thaiWord: string;
    meaning: string;
    badge: string;
    badgeColor: string;
    checked: boolean;
    onToggle: () => void;
    actionLabel?: string;
    onAction?: () => void;
}

function WordRow({
    thaiWord,
    meaning,
    badge,
    badgeColor,
    checked,
    onToggle,
    actionLabel,
    onAction,
}: WordRowProps) {
    return (
        <View style={styles.wordRow}>
            {/* 勾选框 */}
            <Pressable onPress={onToggle} style={styles.checkboxArea} hitSlop={8}>
                {checked ? (
                    <CheckSquare size={22} color={Colors.ink} />
                ) : (
                    <Square size={22} color={Colors.taupe} />
                )}
            </Pressable>

            {/* 词语内容 */}
            <Pressable onPress={onToggle} style={styles.wordContent}>
                <Text style={styles.thaiWord}>{thaiWord}</Text>
                <Text style={styles.meaning}>{meaning}</Text>
            </Pressable>

            {/* 错误次数徽章 / 分类标签 */}
            <View style={[styles.badge, { backgroundColor: badgeColor + '20' }]}>
                <Text style={[styles.badgeText, { color: badgeColor }]}>{badge}</Text>
            </View>

            {/* 取消跳过操作（仅跳过词区有） */}
            {actionLabel && onAction && (
                <Pressable onPress={onAction} style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>{actionLabel}</Text>
                </Pressable>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.paper,
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.sand,
    },
    headerTitle: {
        fontFamily: Typography.playfairBold,
        fontSize: Typography.h2,
        color: Colors.ink,
        textAlign: 'center',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        gap: 12,
    },
    emptyText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: Typography.body,
        color: Colors.taupe,
    },
    section: {
        marginBottom: 20,
        backgroundColor: Colors.white,
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: Colors.ink,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },
    sectionLabelBar: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderLeftWidth: 4,
        backgroundColor: 'rgba(0,0,0,0.02)',
    },
    sectionLabel: {
        fontFamily: Typography.notoSerifBold,
        fontSize: Typography.caption,
        letterSpacing: 0.5,
    },
    sectionBody: {
        paddingHorizontal: 4,
        paddingBottom: 4,
    },
    wordRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: Colors.sand,
        gap: 10,
    },
    checkboxArea: {
        width: 28,
        alignItems: 'center',
    },
    wordContent: {
        flex: 1,
        gap: 2,
    },
    thaiWord: {
        fontFamily: Typography.sarabunBold,
        fontSize: 18,
        color: Colors.ink,
    },
    meaning: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: Typography.caption,
        color: Colors.taupe,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
        minWidth: 32,
        alignItems: 'center',
    },
    badgeText: {
        fontFamily: Typography.notoSerifBold,
        fontSize: Typography.small,
    },
    actionButton: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: Colors.sand,
        borderRadius: 8,
    },
    actionButtonText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: Typography.small,
        color: Colors.taupe,
    },
    footer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: Colors.sand,
        backgroundColor: Colors.paper,
    },
    generateButton: {
        backgroundColor: Colors.ink,
        borderRadius: 14,
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    generateButtonDisabled: {
        backgroundColor: Colors.taupe,
        opacity: 0.5,
    },
    generateButtonText: {
        fontFamily: Typography.notoSerifBold,
        fontSize: Typography.body,
        color: Colors.white,
    },
    homeButton: {
        marginTop: 10,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    homeButtonText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: Typography.caption,
        color: Colors.taupe,
    },
});
