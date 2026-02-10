import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Audio } from 'expo-av';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { BlurRevealer } from '@/src/components/common/BlurRevealer';
import { Vocabulary } from '@/src/entities/types/vocabulary.types';
import { getVocabAudioUrl } from '@/src/utils/vocab/vocabAudioHelper';

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
    const phoneticAssociation = vocabulary.analysis?.phonetic_association;
    const exampleSentences = vocabulary.exampleSentences || {};
    const examples = Object.values(exampleSentences);
    const dialogue = vocabulary.dialogue;
    const dialogueEntries = dialogue ? Object.entries(dialogue.对话内容) : [];

    // If blurDetails is true, we want IS_REVEALED = false.
    const isRevealed = !blurDetails;

    const soundRef = useRef<Audio.Sound | null>(null);
    const audioModeConfigured = useRef(false);

    useEffect(() => {
        return () => {
            if (soundRef.current) {
                soundRef.current.unloadAsync().catch(() => { });
                soundRef.current = null;
            }
        };
    }, []);

    const playAudio = async (path?: string) => {
        if (!path) return;
        try {
            const url = await getVocabAudioUrl(path, vocabulary.source);
            if (!url) return;
            console.log('🔊 [DetailView] Playing:', url);

            // 配置音频模式（仅一次）
            if (!audioModeConfigured.current) {
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: false,
                    playsInSilentModeIOS: true,
                    staysActiveInBackground: false,
                    shouldDuckAndroid: true,
                });
                audioModeConfigured.current = true;
            }

            // 清理旧 sound
            if (soundRef.current) {
                await soundRef.current.unloadAsync().catch(() => { });
                soundRef.current = null;
            }

            // 创建并播放
            const { sound } = await Audio.Sound.createAsync(
                { uri: url },
                { shouldPlay: true }
            );
            soundRef.current = sound;
        } catch (error) {
            console.warn('❌ [DetailView] Playback failed:', error);
        }
    };

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
                        {/* 后端返回字段: vocabulary.meaning (中文意思) */}
                        <Text style={styles.mainMeaning}>{vocabulary.meaning}</Text>
                        <View style={styles.typeTag}>
                            {/* 后端返回字段: vocabulary.partOfSpeech (词性) */}
                            <Text style={styles.typeText}>{analysis?.part_of_speech}</Text>
                        </View>
                    </View>

                    {/* Tabs */}
                    <View style={styles.tabs}>
                        <Pressable
                            style={[styles.tab, activeTab === 'basic' && styles.activeTab]}
                            onPress={() => setActiveTab('basic')}
                        >
                            <Text style={[styles.tabText, activeTab === 'basic' && styles.activeTabText]}>
                                {/* 基本释义 */}
                                {t('learning.basicDefinition')}
                            </Text>
                        </Pressable>
                        <Pressable
                            style={[styles.tab, activeTab === 'examples' && styles.activeTab]}
                            onPress={() => setActiveTab('examples')}
                        >
                            <Text style={[styles.tabText, activeTab === 'examples' && styles.activeTabText]}>
                                {/* 例句 */}
                                {t('learning.exampleSentences')}
                            </Text>
                        </Pressable>
                        <Pressable
                            style={[styles.tab, activeTab === 'usage' && styles.activeTab]}
                            onPress={() => setActiveTab('usage')}
                        >
                            <Text style={[styles.tabText, activeTab === 'usage' && styles.activeTabText]}>
                                {/* 用法 */}
                                {t('learning.usageDetails')}
                            </Text>
                        </Pressable>
                    </View>

                    {/* Tab Content 1: 基本释义 */}
                    {activeTab === 'basic' && (
                        <View style={styles.tabContent}>
                            {vocabulary.cognates && vocabulary.cognates.length > 0 && (
                                <>
                                    <Text style={styles.sectionTitle}>{t('learning.cognates')}</Text>
                                    <View style={styles.cognatesList}>
                                        {vocabulary.cognates.map((item, idx) => (
                                            <Pressable
                                                key={idx}
                                                style={styles.cognateItem}
                                                onPress={() => playAudio(item.audioPath)}
                                            >

                                                <Text style={styles.bodyText}>{item.text}</Text>
                                            </Pressable>
                                        ))}
                                    </View>
                                </>
                            )}

                            {phoneticAssociation && (
                                <>
                                    <Text style={[styles.sectionTitle, { marginTop: 16 }]}>{t('learning.memoryTips')}</Text>
                                    <View style={styles.memoryItem}>
                                        <Text style={styles.bodyText}>
                                            <Text style={styles.subSectionTitle}>{t('learning.split')}: </Text>
                                            {phoneticAssociation.拆分}
                                        </Text>
                                        <Text style={[styles.bodyText, { marginTop: 4 }]}>
                                            <Text style={styles.subSectionTitle}>{t('learning.memoryPhrase')}: </Text>
                                            {phoneticAssociation.记忆句}
                                        </Text>
                                    </View>
                                </>
                            )}
                        </View>
                    )}

                    {/* Tab Content 2: 例句 */}
                    {activeTab === 'examples' && (
                        <View style={styles.examplesList}>
                            {dialogue && <Text style={styles.sectionTitle}>{t('learning.dialogueExample')}</Text>}
                            {/* 对话示例 (微信聊天风格) */}
                            {dialogue && (
                                <View style={styles.dialogueContainer}>
                                    {dialogue.场景描述 && (
                                        <Text style={styles.sceneDesc}>— {dialogue.场景描述} —</Text>
                                    )}
                                    {dialogueEntries.map(([speaker, content], index) => {
                                        const isRight = speaker === 'B' || speaker.includes('2') || index % 2 === 1;
                                        return (
                                            <View
                                                key={index}
                                                style={[
                                                    styles.chatRow,
                                                    isRight ? styles.rightRow : styles.leftRow
                                                ]}
                                            >
                                                <Pressable
                                                    style={[
                                                        styles.bubble,
                                                        isRight ? styles.rightBubble : styles.leftBubble,
                                                        styles.dialogueBubble
                                                    ]}
                                                    onPress={() => playAudio(content.audioPath)}
                                                >
                                                    <View style={styles.dialogueHeader}>
                                                        <Text style={styles.exampleThai}>{content.泰语}</Text>
                                                    </View>
                                                    <Text style={styles.exampleMeaning}>{content.中文}</Text>
                                                </Pressable>
                                            </View>
                                        );
                                    })}
                                </View>
                            )}
                            {examples.length > 0 && <Text style={styles.sectionTitle}>{t('learning.individualSentences')}</Text>}
                            {/* 普通例句列表 */}
                            {examples.map((ex, index) => (
                                <Pressable
                                    key={index}
                                    style={styles.exampleItem}
                                    onPress={() => playAudio(ex.audioPath)}
                                >
                                    <View style={styles.exampleHeader}>
                                        <Text style={styles.exampleThai}>{ex.泰语}</Text>
                                    </View>
                                    <Text style={styles.exampleMeaning}>{ex.中文}</Text>
                                </Pressable>
                            ))}
                            {(examples.length === 0 && !dialogue) && (
                                <Text style={styles.bodyText}>{t('learning.noExamples')}</Text>
                            )}
                        </View>
                    )}

                    {/* Tab Content 3: 用法 */}
                    {activeTab === 'usage' && (
                        <View style={styles.usageContent}>
                            <View style={styles.exampleItem}>
                                {vocabulary.usage?.语法示例 && (
                                    <>

                                        <Text style={styles.sectionTitle}>{t('learning.grammarExamples')}</Text>
                                        <View style={styles.grammarItem}>
                                            {/* 后端返回字段: vocabulary.usage.语法示例.结构 */}
                                            <Text style={styles.grammarLabel}>
                                                <Text style={{ color: Colors.thaiGold }}>{t('learning.structure')}: </Text>
                                                <Text>{vocabulary.usage.语法示例.结构}</Text>
                                            </Text>
                                            {/* 后端返回字段: vocabulary.usage.语法示例.解释 */}
                                            <Text style={styles.grammarContent}>
                                                <Text style={{ color: Colors.thaiGold }}>
                                                    {t('learning.explain')}:{" "}
                                                </Text>
                                                {vocabulary.usage.语法示例.解释}
                                            </Text>
                                            {/* 后端返回字段: vocabulary.usage.语法示例.使用技巧 */}
                                            {vocabulary.usage.语法示例.使用技巧 && <Text style={styles.grammarExample}>
                                                <Text style={{ color: Colors.thaiGold }}>
                                                    {t('learning.usageTip')}:{" "}
                                                </Text>
                                                {vocabulary.usage.语法示例.使用技巧}
                                            </Text>}
                                        </View>

                                    </>
                                )}

                                {vocabulary.usage?.与中文差异 && (
                                    <>
                                        <Text style={[styles.sectionTitle, styles.mt4]}>{t('learning.diffWithChinese')}</Text>
                                        {/* 后端返回字段: vocabulary.usage.与中文差异 */}
                                        <Text style={styles.bodyText}>{vocabulary.usage.与中文差异}</Text>
                                    </>
                                )}
                            </View>
                            <View style={styles.exampleItem}>
                                <Text style={[styles.sectionTitle, styles.mt4]}>{t('learning.commonMistakes')}</Text>
                                {analysis?.common_mistakes?.相似词汇区别 && (
                                    <>
                                        <Text style={styles.subSectionTitle}>{t('learning.similarWordsDiff')}</Text>
                                        {/* 后端返回字段: analysis.common_mistakes.相似词汇区别 */}
                                        <Text style={styles.bodyText}>{analysis.common_mistakes.相似词汇区别}</Text>
                                    </>
                                )}
                                {analysis?.common_mistakes?.发音易错点 && (
                                    <>
                                        <Text style={[styles.subSectionTitle, styles.mt4]}>{t('learning.pronunciationPitfalls')}</Text>
                                        {/* 后端返回字段: analysis.common_mistakes.发音易错点 */}
                                        <Text style={styles.bodyText}>{analysis.common_mistakes.发音易错点}</Text>
                                    </>
                                )}

                                {analysis?.common_mistakes?.使用场合 && (
                                    <>
                                        <Text style={[styles.subSectionTitle, styles.mt4]}>{t('learning.usageScenarios')}</Text>
                                        {/* 后端返回字段: analysis.common_mistakes.使用场合 */}
                                        <Text style={styles.bodyText}>{analysis.common_mistakes.使用场合}</Text>
                                    </>
                                )}
                                {(!vocabulary.usage && !analysis?.common_mistakes) && <Text style={styles.bodyText}>{t('learning.noUsage')}</Text>}
                            </View>
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
        width: '95%',
        alignSelf: 'center',
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
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        overflow: 'hidden',
        backgroundColor: Colors.white, // Ensure background is white so blur looks correct over it
        borderWidth: 1,
        borderBottomWidth: 0,
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
    subSectionTitle: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 14,
        color: Colors.accent, // Use a slightly different color or shade
        marginBottom: 4,
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
        color: Colors.ink,
        marginTop: 2,
        fontStyle: 'italic',
    },
    mt4: {
        marginTop: 16,
    },
    // 对话 (微信风格) 样式
    dialogueContainer: {
        backgroundColor: '#F3F3F3',
        padding: 16,
        borderRadius: 16,
        marginBottom: 8,
    },
    sceneDesc: {
        textAlign: 'center',
        fontSize: 12,
        color: Colors.taupe,
        marginBottom: 20,
        fontFamily: Typography.notoSerifRegular,
    },
    chatRow: {
        marginBottom: 12,
        maxWidth: '90%',
        flexDirection: 'row',
    },
    leftRow: {
        alignSelf: 'flex-start',
    },
    rightRow: {
        alignSelf: 'flex-end',
        flexDirection: 'row-reverse',
    },
    bubble: {
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 10,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    leftBubble: {
        backgroundColor: Colors.white,
        borderTopLeftRadius: 2,
    },
    rightBubble: {
        backgroundColor: '#95EC69', // 典型的微信绿
        borderTopRightRadius: 2,
    },
    // Audio specific styles
    tabContent: {
        paddingTop: 8,
    },
    cognatesList: {
        gap: 8,
    },
    cognateItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: 'rgba(0,0,0,0.02)',
        padding: 12,
        borderRadius: 10,
    },
    memoryItem: {
        backgroundColor: 'rgba(212, 175, 55, 0.05)',
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.1)',
    },
    exampleHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    dialogueBubble: {
        minWidth: 80,
    },
    dialogueHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
        marginBottom: 2,
    },
});
