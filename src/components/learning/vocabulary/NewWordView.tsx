import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, Pressable, ScrollView, Dimensions } from 'react-native';
import { Volume2 } from 'lucide-react-native';

import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { BlurRevealer } from '@/src/components/common/BlurRevealer';

// 定义单词数据的接口结构
// 包含了单词的ID、泰语原文、发音、词性、含义以及详细的定义（基础定义、例句、用法等）
import { Vocabulary } from '@/src/entities/types/vocabulary.types';

interface NewWordViewProps {
    vocabulary: Vocabulary;   // 当前要学习的单词数据
    onNext: () => void; // 点击“下一步”时的回调函数
}

// 定义选项卡类型：基础定义、例句、用法详解
type TabType = 'basic' | 'examples' | 'usage';

/**
 * NewWordView 组件
 * 
 * 这是一个用于“新词学习”环节的视图组件。
 * 
 * 主要逻辑流程：
 * 1. 初始状态下，单词的详细释义是被模糊遮盖的（isRevealed = false）。
 * 2. 用户只能看到单词卡片（泰语+发音）。
 * 3. 用户点击“查看释义”按钮后，模糊层消失，展示详细内容。
 * 4. 用户可以通过底部的 Tabs 切换查看：基础定义、例句、用法。
 * 5. 学习完成后，点击“下一个”继续。
 */
export const NewWordView: React.FC<NewWordViewProps> = ({ vocabulary, onNext }) => {
    const { t } = useTranslation();
    // 控制释义内容是否已揭示。false=模糊遮盖, true=清晰显示
    const [isRevealed, setIsRevealed] = useState(false);
    // 控制当前选中的详情标签页 (默认为基础定义)
    const [activeTab, setActiveTab] = useState<TabType>('basic');

    // 处理“查看释义”按钮点击事件
    const handleViewDefinition = () => {
        setIsRevealed(true);
    };

    // 辅助数据获取
    const analysis = vocabulary.analysis;
    const exampleSentences = vocabulary.exampleSentences || {};
    const examples = Object.values(exampleSentences);

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {/* 顶部区域：单词卡片展示 */}
                <View style={styles.cardContainer}>
                    <View style={styles.wordCard}>
                        {/* 泰语单词大字展示 */}
                        <Text style={styles.thaiWord}>{vocabulary.thaiWord}</Text>

                        {/* 发音区域：喇叭图标 + 音标 */}
                        <View style={styles.phoneticRow}>
                            <Pressable style={styles.audioButton}>
                                <Volume2 size={20} color={Colors.thaiGold} />
                            </Pressable>
                            <Text style={styles.phoneticText}>{vocabulary.pronunciation}</Text>
                        </View>
                    </View>
                </View>

                {/* 中间区域：详细信息展示 (含义、词性、多Tab内容) */}
                <View style={styles.detailsContainer}>
                    {/* 含义头部：主要中文义项 + 词性标签 */}
                    <View style={styles.meaningHeader}>
                        <Text style={styles.mainMeaning}>{vocabulary.meaning}</Text>
                        <View style={styles.typeTag}>
                            <Text style={styles.typeText}>{vocabulary.partOfSpeech}</Text>
                        </View>
                    </View>

                    {/* 选项卡切换栏：基础 / 例句 / 用法 */}
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

                    {/* 可滚动的内容区域 */}
                    <BlurRevealer
                        style={styles.scrollAreaWrapper}
                        isRevealed={isRevealed}
                        intensity={20}
                        tint="light"
                        overlayColor="rgba(250, 249, 246, 0.6)" // 对应原 styles.blurOverlayContent 的背景色
                    >
                        <ScrollView
                            style={styles.scrollArea}
                            contentContainerStyle={styles.scrollContent}
                            showsVerticalScrollIndicator={false}
                        >
                            {/* Tab内容 1: 基础定义 */}
                            {activeTab === 'basic' && (
                                <Text style={styles.bodyText}>{analysis?.part_of_speech || vocabulary.meaning}</Text>
                            )}

                            {/* Tab内容 2: 例句列表 */}
                            {activeTab === 'examples' && (
                                <View style={styles.examplesList}>
                                    {examples.map((ex, index) => (
                                        <View key={index} style={styles.exampleItem}>
                                            <Text style={styles.exampleThai}>{ex.泰语}</Text>
                                            <Text style={styles.exampleMeaning}>{ex.中文}</Text>
                                        </View>
                                    ))}
                                    {examples.length === 0 && <Text style={styles.bodyText}>暂无例句</Text>}
                                </View>
                            )}

                            {/* Tab内容 3: 用法详解 (语法、中泰差异、易错点、近义词) */}
                            {activeTab === 'usage' && (
                                <View style={styles.usageContent}>
                                    {/* 语法部分 */}
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

                                    {/* 区别部分 */}
                                    {vocabulary.usage?.与中文差异 && (
                                        <>
                                            <Text style={[styles.sectionTitle, styles.mt4]}>{t('learning.diffWithChinese')}</Text>
                                            <Text style={styles.bodyText}>{vocabulary.usage.与中文差异}</Text>
                                        </>
                                    )}

                                    {/* 易错点 */}
                                    {analysis?.common_mistakes?.发音易错点 && (
                                        <>
                                            <Text style={[styles.sectionTitle, styles.mt4]}>{t('learning.commonMistakes')}</Text>
                                            <Text style={styles.bodyText}>{analysis.common_mistakes.发音易错点}</Text>
                                        </>
                                    )}

                                    {/* 近义词辨析 */}
                                    {analysis?.common_mistakes?.相似词汇区别 && (
                                        <>
                                            <Text style={[styles.sectionTitle, styles.mt4]}>{t('learning.similarWordsDiff')}</Text>
                                            <Text style={styles.bodyText}>{analysis.common_mistakes.相似词汇区别}</Text>
                                        </>
                                    )}

                                    {(!vocabulary.usage && !analysis?.common_mistakes) && <Text style={styles.bodyText}>暂无用法详解</Text>}
                                </View>
                            )}
                            {/* 底部留白，防止内容被按钮遮挡 */}
                            <View style={{ height: 100 }} />
                        </ScrollView>
                    </BlurRevealer>
                </View>
            </View>

            {/* 底部操作栏 */}
            <View style={styles.bottomBar}>
                {!isRevealed ? (
                    // 未揭示时：显示“查看释义”按钮
                    <Pressable style={styles.mainButton} onPress={handleViewDefinition}>
                        <Text style={styles.mainButtonText}>{t('learning.viewDefinition')}</Text>
                    </Pressable>
                ) : (
                    // 已揭示时：显示“下一个”按钮，进入下一个流程
                    <Pressable style={styles.mainButton} onPress={onNext}>
                        <Text style={styles.mainButtonText}>{t('learning.nextEnter')}</Text>
                    </Pressable>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    cardContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    wordCard: {
        width: '100%',
        backgroundColor: Colors.white,
        borderRadius: 16,
        paddingVertical: 24,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors.sand,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    thaiWord: {
        fontFamily: Typography.sarabunBold,
        fontSize: 56,
        color: Colors.ink,
        marginBottom: 8,
    },
    phoneticRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    audioButton: {
        padding: 6,
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        borderRadius: 20,
    },
    phoneticText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 18,
        color: Colors.taupe,
    },
    detailsContainer: {
        flex: 1,
    },
    meaningHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        gap: 12,
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
    },
    scrollArea: {
        flex: 1,
    },
    scrollContent: {
        padding: 4,
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
    bottomBar: {
        flexDirection: 'row',
        padding: 20,
        gap: 16,
        backgroundColor: Colors.paper,
        borderTopWidth: 1,
        borderTopColor: Colors.sand,
    },
    mainButton: {
        flex: 1,
        backgroundColor: Colors.ink,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        shadowColor: Colors.thaiGold,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    mainButtonText: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 16,
        color: Colors.white,
    },
});

