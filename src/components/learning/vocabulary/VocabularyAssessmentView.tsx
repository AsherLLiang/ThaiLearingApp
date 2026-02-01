import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Volume2 } from 'lucide-react-native';
import { Audio } from 'expo-av';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import type { Vocabulary } from '@/src/entities/types/vocabulary.types';
import { getVocabAudioUrl } from '@/src/utils/vocab/vocabAudioHelper';

interface VocabularyAssessmentViewProps {
    vocabulary: Vocabulary;
    onRate: (score: number) => void;
}

type TabType = 'meaning' | 'examples' | 'analysis';

export const VocabularyAssessmentView: React.FC<VocabularyAssessmentViewProps> = ({
    vocabulary,
    onRate
}) => {
    const [activeTab, setActiveTab] = useState<TabType>('meaning');
    const soundRef = React.useRef<Audio.Sound | null>(null);

    // 处理发音播放
    const playAudio = async () => {
        try {
            const url = await getVocabAudioUrl({ audioPath: vocabulary.audioPath });
            if (!url) return;

            if (soundRef.current) {
                await soundRef.current.unloadAsync().catch(() => { });
            }

            const { sound } = await Audio.Sound.createAsync(
                { uri: url },
                { shouldPlay: true }
            );
            soundRef.current = sound;
        } catch (error) {
            console.warn('Playback failed:', error);
        }
    };

    React.useEffect(() => {
        playAudio();
        return () => {
            if (soundRef.current) {
                soundRef.current.unloadAsync().catch(() => { });
            }
        };
    }, [vocabulary._id]);

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {/* 顶部单词展示 */}
                <View style={styles.header}>
                    <Text style={styles.thaiWord}>{vocabulary.thaiWord}</Text>
                    <View style={styles.phoneticRow}>
                        <Pressable style={styles.audioButton} onPress={playAudio}>
                            <Volume2 size={24} color={Colors.thaiGold} />
                        </Pressable>
                        <Text style={styles.phoneticText}>{vocabulary.pronunciation}</Text>
                    </View>
                </View>

                {/* 选项卡切换 */}
                <View style={styles.tabBar}>
                    <Pressable
                        style={[styles.tab, activeTab === 'meaning' && styles.activeTab]}
                        onPress={() => setActiveTab('meaning')}
                    >
                        <Text style={[styles.tabText, activeTab === 'meaning' && styles.activeTabText]}>释义</Text>
                    </Pressable>
                    <Pressable
                        style={[styles.tab, activeTab === 'examples' && styles.activeTab]}
                        onPress={() => setActiveTab('examples')}
                    >
                        <Text style={[styles.tabText, activeTab === 'examples' && styles.activeTabText]}>例句</Text>
                    </Pressable>
                    <Pressable
                        style={[styles.tab, activeTab === 'analysis' && styles.activeTab]}
                        onPress={() => setActiveTab('analysis')}
                    >
                        <Text style={[styles.tabText, activeTab === 'analysis' && styles.activeTabText]}>解析</Text>
                    </Pressable>
                </View>

                {/* 内容区域 */}
                <View style={styles.contentCard}>
                    {activeTab === 'meaning' && (
                        <View>
                            <View style={styles.meaningHeader}>
                                <Text style={styles.mainMeaning}>{vocabulary.meaning}</Text>
                                <View style={styles.typeTag}>
                                    <Text style={styles.typeText}>{vocabulary.partOfSpeech}</Text>
                                </View>
                            </View>
                            {vocabulary.usage?.语法示例 && (
                                <View style={styles.usageBox}>
                                    <Text style={styles.usageLabel}>使用结构:</Text>
                                    <Text style={styles.usageText}>{vocabulary.usage.语法示例.结构}</Text>
                                    <Text style={styles.usageDesc}>{vocabulary.usage.语法示例.解释}</Text>
                                </View>
                            )}
                        </View>
                    )}

                    {activeTab === 'examples' && (
                        <View>
                            {/* 兼容两种结构的例句 */}
                            {vocabulary.exampleSentences && Object.entries(vocabulary.exampleSentences).map(([key, ex]) => (
                                <View key={key} style={styles.exampleItem}>
                                    <Text style={styles.exampleThai}>{ex.泰语}</Text>
                                    <Text style={styles.examplePhonetic}>{ex.发音}</Text>
                                    <Text style={styles.exampleMeaning}>{ex.中文}</Text>
                                </View>
                            ))}
                            {!vocabulary.exampleSentences && vocabulary.analysis?.example_sentences && (
                                // TODO: Handle legacy format if needed
                                <Text style={styles.bodyText}>暂无语境示例</Text>
                            )}
                        </View>
                    )}

                    {activeTab === 'analysis' && (
                        <View>
                            {vocabulary.analysis?.letter_pron_analysis && (
                                <View style={styles.analysisItem}>
                                    <Text style={styles.sectionTitle}>发音拆解</Text>
                                    <Text style={styles.bodyText}>{vocabulary.analysis.letter_pron_analysis}</Text>
                                </View>
                            )}
                            {vocabulary.analysis?.phonetic_association && (
                                <View style={styles.analysisItem}>
                                    <Text style={styles.sectionTitle}>联想记忆</Text>
                                    <Text style={styles.bodyText}>拆分: {vocabulary.analysis.phonetic_association.拆分}</Text>
                                    <Text style={styles.bodyText}>记忆句: {vocabulary.analysis.phonetic_association.记忆句}</Text>
                                </View>
                            )}
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* 底部评分区域 */}
            <View style={styles.ratingBar}>
                <Text style={styles.ratingTitle}>你对这个词的熟悉程度是？</Text>
                <View style={styles.ratingButtons}>
                    <RatingButton label="陌生" score={1} color="#EF4444" onPress={() => onRate(1)} />
                    <RatingButton label="困难" score={2} color="#F59E0B" onPress={() => onRate(2)} />
                    <RatingButton label="模糊" score={3} color="#FBBF24" onPress={() => onRate(3)} />
                    <RatingButton label="良好" score={4} color="#10B981" onPress={() => onRate(4)} />
                    <RatingButton label="熟练" score={5} color="#059669" onPress={() => onRate(5)} />
                </View>
            </View>
        </View>
    );
};

const RatingButton = ({ label, score, color, onPress }: { label: string, score: number, color: string, onPress: () => void }) => (
    <Pressable style={styles.ratingButton} onPress={onPress}>
        <View style={[styles.ratingIcon, { backgroundColor: color }]}>
            <Text style={styles.ratingScoreText}>{score}</Text>
        </View>
        <Text style={[styles.ratingLabel, { color }]}>{label}</Text>
    </Pressable>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.paper,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 160, // 增加底部边距，为评分栏留出空间
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
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
        gap: 12,
    },
    audioButton: {
        padding: 10,
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        borderRadius: 25,
    },
    phoneticText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 20,
        color: Colors.taupe,
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: 4,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: Colors.sand,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 8,
    },
    activeTab: {
        backgroundColor: 'rgba(212, 175, 55, 0.15)',
    },
    tabText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 14,
        color: Colors.taupe,
    },
    activeTabText: {
        color: Colors.ink,
        fontFamily: Typography.notoSerifBold,
    },
    contentCard: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 24,
        minHeight: 200,
        borderWidth: 1,
        borderColor: Colors.sand,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 1,
    },
    meaningHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 20,
    },
    mainMeaning: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 28,
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
    bodyText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 16,
        lineHeight: 26,
        color: Colors.ink,
    },
    usageBox: {
        backgroundColor: 'rgba(212, 175, 55, 0.05)',
        padding: 16,
        borderRadius: 12,
        marginTop: 16,
    },
    usageLabel: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 14,
        color: Colors.thaiGold,
        marginBottom: 4,
    },
    usageText: {
        fontFamily: Typography.sarabunBold,
        fontSize: 18,
        color: Colors.ink,
        marginBottom: 4,
    },
    usageDesc: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 14,
        color: Colors.taupe,
    },
    exampleItem: {
        marginBottom: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.sand,
    },
    exampleThai: {
        fontFamily: Typography.sarabunRegular,
        fontSize: 18,
        color: Colors.ink,
        marginBottom: 4,
    },
    examplePhonetic: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 14,
        color: Colors.taupe,
        marginBottom: 4,
    },
    exampleMeaning: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 15,
        color: Colors.ink,
    },
    sectionTitle: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 16,
        color: Colors.thaiGold,
        marginBottom: 8,
    },
    analysisItem: {
        marginBottom: 20,
    },
    ratingBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: Colors.white,
        padding: 20,
        paddingBottom: 40,
        borderTopWidth: 1,
        borderTopColor: Colors.sand,
        alignItems: 'center',
    },
    ratingTitle: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 14,
        color: Colors.taupe,
        marginBottom: 16,
    },
    ratingButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    ratingButton: {
        alignItems: 'center',
        flex: 1,
    },
    ratingIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    ratingScoreText: {
        color: Colors.white,
        fontFamily: Typography.notoSerifBold,
        fontSize: 18,
    },
    ratingLabel: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 12,
    },
});
