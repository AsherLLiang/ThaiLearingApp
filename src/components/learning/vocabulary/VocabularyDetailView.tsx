import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { BlurRevealer } from '@/src/components/common/BlurRevealer';
import { Vocabulary } from '@/src/entities/types/vocabulary.types';

interface VocabularyDetailViewProps {
    vocabulary: Vocabulary;
    blurDetails: boolean; // Controls if the details section is blurred
}

type TabType = 'basic' | 'examples' | 'usage';

export const VocabularyDetailView: React.FC<VocabularyDetailViewProps> = ({
    vocabulary,
    blurDetails
}) => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<TabType>('basic');

    const analysis = vocabulary.analysis;
    const exampleSentences = vocabulary.exampleSentences || {};
    const examples = Object.values(exampleSentences);

    // If blurDetails is true, we want IS_REVEALED = false.
    const isRevealed = !blurDetails;

    return (
        <View style={styles.detailsContainer}>
            <BlurRevealer
                style={styles.scrollAreaWrapper}
                isRevealed={isRevealed}
                intensity={60} // Higher intensity for hiding meaning
                tint="light" // Or 'default'
                overlayColor="rgba(255, 255, 255, 0.8)"
            >
                <ScrollView
                    style={styles.scrollArea}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Meaning Header - INSIDE BlurRevealer to hide answer */}
                    <View style={styles.meaningHeader}>
                        <Text style={styles.mainMeaning}>{vocabulary.meaning}</Text>
                        <View style={styles.typeTag}>
                            <Text style={styles.typeText}>{vocabulary.partOfSpeech}</Text>
                        </View>
                    </View>

                    {/* Tabs */}
                    <View style={styles.tabs}>
                        <Pressable
                            style={[styles.tab, activeTab === 'basic' && styles.activeTab]}
                            onPress={() => setActiveTab('basic')}
                        >
                            <Text style={[styles.tabText, activeTab === 'basic' && styles.activeTabText]}>{t('learning.basicDefinition')}</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.tab, activeTab === 'examples' && styles.activeTab]}
                            onPress={() => setActiveTab('examples')}
                        >
                            <Text style={[styles.tabText, activeTab === 'examples' && styles.activeTabText]}>{t('learning.exampleSentences')}</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.tab, activeTab === 'usage' && styles.activeTab]}
                            onPress={() => setActiveTab('usage')}
                        >
                            <Text style={[styles.tabText, activeTab === 'usage' && styles.activeTabText]}>{t('learning.usageDetails')}</Text>
                        </Pressable>
                    </View>

                    {/* Tab Content 1: Basic */}
                    {activeTab === 'basic' && (
                        <Text style={styles.bodyText}>{analysis?.part_of_speech || vocabulary.meaning}</Text>
                    )}

                    {/* Tab Content 2: Examples */}
                    {activeTab === 'examples' && (
                        <View style={styles.examplesList}>
                            {examples.map((ex, index) => (
                                <View key={index} style={styles.exampleItem}>
                                    <Text style={styles.exampleThai}>{ex.泰语}</Text>
                                    <Text style={styles.exampleMeaning}>{ex.中文}</Text>
                                </View>
                            ))}
                            {examples.length === 0 && <Text style={styles.bodyText}>{t('learning.noExamples', '暂无例句')}</Text>}
                        </View>
                    )}

                    {/* Tab Content 3: Usage */}
                    {activeTab === 'usage' && (
                        <View style={styles.usageContent}>
                            {vocabulary.usage?.语法示例 && (
                                <>
                                    <Text style={styles.sectionTitle}>{t('learning.grammarExamples')}</Text>
                                    <View style={styles.grammarItem}>
                                        <Text style={styles.grammarLabel}>{vocabulary.usage.语法示例.结构}:</Text>
                                        <Text style={styles.grammarContent}>{vocabulary.usage.语法示例.解释}</Text>
                                        {vocabulary.usage.语法示例.使用技巧 && <Text style={styles.grammarExample}>{vocabulary.usage.语法示例.使用技巧}</Text>}
                                    </View>
                                </>
                            )}

                            {vocabulary.usage?.与中文差异 && (
                                <>
                                    <Text style={[styles.sectionTitle, styles.mt4]}>{t('learning.diffWithChinese')}</Text>
                                    <Text style={styles.bodyText}>{vocabulary.usage.与中文差异}</Text>
                                </>
                            )}

                            {analysis?.common_mistakes?.发音易错点 && (
                                <>
                                    <Text style={[styles.sectionTitle, styles.mt4]}>{t('learning.commonMistakes')}</Text>
                                    <Text style={styles.bodyText}>{analysis.common_mistakes.发音易错点}</Text>
                                </>
                            )}

                            {analysis?.common_mistakes?.相似词汇区别 && (
                                <>
                                    <Text style={[styles.sectionTitle, styles.mt4]}>{t('learning.similarWordsDiff')}</Text>
                                    <Text style={styles.bodyText}>{analysis.common_mistakes.相似词汇区别}</Text>
                                </>
                            )}

                            {(!vocabulary.usage && !analysis?.common_mistakes) && <Text style={styles.bodyText}>{t('learning.noUsage', '暂无用法详解')}</Text>}
                        </View>
                    )}

                    <View style={{ height: 100 }} />
                </ScrollView>
            </BlurRevealer>
        </View>
    );
};

const styles = StyleSheet.create({
    detailsContainer: {
        flex: 1,
        // No padding here, assume parent handles
    },
    meaningHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        gap: 12,
        marginTop: 10,
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
    tabs: {
        flexDirection: 'row',
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: 4,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: Colors.sand,
    },
    tab: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 8,
    },
    activeTab: {
        backgroundColor: 'rgba(212, 175, 55, 0.15)',
    },
    tabText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 13,
        color: Colors.taupe,
    },
    activeTabText: {
        color: Colors.ink,
        fontWeight: '600',
    },
    scrollAreaWrapper: {
        flex: 1,
        position: 'relative',
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: Colors.white, // Ensure background is white so blur looks correct over it
        borderWidth: 1,
        borderColor: Colors.sand,
    },
    scrollArea: {
        flex: 1,
    },
    scrollContent: {
        padding: 16, // Add padding inside ScrollView
    },
    bodyText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 15,
        lineHeight: 24,
        color: Colors.ink,
    },
    examplesList: {
        gap: 16,
    },
    exampleItem: {
        backgroundColor: Colors.white,
        padding: 16,
        borderRadius: 12,
        borderLeftWidth: 3,
        borderLeftColor: Colors.thaiGold,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.03)',
    },
    exampleThai: {
        fontFamily: Typography.sarabunRegular,
        fontSize: 16,
        color: Colors.ink,
        marginBottom: 4,
    },
    exampleMeaning: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 14,
        color: Colors.taupe,
    },
    usageContent: {
        gap: 12,
    },
    sectionTitle: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 16,
        color: Colors.thaiGold,
        marginBottom: 8,
    },
    grammarItem: {
        marginBottom: 8,
    },
    grammarLabel: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 14,
        color: Colors.ink,
    },
    grammarContent: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 14,
        color: Colors.ink,
        marginTop: 2,
    },
    grammarExample: {
        fontFamily: Typography.sarabunRegular,
        fontSize: 14,
        color: Colors.taupe,
        marginTop: 2,
        fontStyle: 'italic',
    },
    mt4: {
        marginTop: 16,
    },
});
