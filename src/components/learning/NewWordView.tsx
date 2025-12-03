import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, Pressable, ScrollView, Dimensions } from 'react-native';
import { Volume2 } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';

// Define types for the word data
export interface WordData {
    id: string;
    thai: string;
    phonetic: string;
    type: string;
    meaning: string;
    definitions: {
        basic: string;
        examples: { thai: string; meaning: string }[];
        usage: {
            grammar: { label: string; content: string; example?: string }[];
            diff: string;
            mistakes: string;
            similar: string;
        };
    };
}

interface NewWordViewProps {
    word: WordData;
    onNext: () => void;
}

type TabType = 'basic' | 'examples' | 'usage';

export const NewWordView: React.FC<NewWordViewProps> = ({ word, onNext }) => {
    const { t } = useTranslation();
    const [isRevealed, setIsRevealed] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>('basic');

    const handleViewDefinition = () => {
        setIsRevealed(true);
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {/* Top Section: Word Display */}
                <View style={styles.cardContainer}>
                    <View style={styles.wordCard}>
                        <Text style={styles.thaiWord}>{word.thai}</Text>

                        <View style={styles.phoneticRow}>
                            <Pressable style={styles.audioButton}>
                                <Volume2 size={20} color={Colors.thaiGold} />
                            </Pressable>
                            <Text style={styles.phoneticText}>{word.phonetic}</Text>
                        </View>
                    </View>
                </View>

                {/* Middle Section: Details */}
                <View style={styles.detailsContainer}>
                    {/* Meaning Header */}
                    <View style={styles.meaningHeader}>
                        <Text style={styles.mainMeaning}>{word.meaning}</Text>
                        <View style={styles.typeTag}>
                            <Text style={styles.typeText}>{word.type}</Text>
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

                    {/* Content Area */}
                    <View style={styles.scrollAreaWrapper}>
                        <ScrollView
                            style={styles.scrollArea}
                            contentContainerStyle={styles.scrollContent}
                            showsVerticalScrollIndicator={false}
                        >
                            {activeTab === 'basic' && (
                                <Text style={styles.bodyText}>{word.definitions.basic}</Text>
                            )}

                            {activeTab === 'examples' && (
                                <View style={styles.examplesList}>
                                    {word.definitions.examples.map((ex, index) => (
                                        <View key={index} style={styles.exampleItem}>
                                            <Text style={styles.exampleThai}>{ex.thai}</Text>
                                            <Text style={styles.exampleMeaning}>{ex.meaning}</Text>
                                        </View>
                                    ))}
                                </View>
                            )}

                            {activeTab === 'usage' && (
                                <View style={styles.usageContent}>
                                    <Text style={styles.sectionTitle}>{t('learning.grammarExamples')}</Text>
                                    {word.definitions.usage.grammar.map((g, i) => (
                                        <View key={i} style={styles.grammarItem}>
                                            <Text style={styles.grammarLabel}>{g.label}:</Text>
                                            <Text style={styles.grammarContent}>{g.content}</Text>
                                            {g.example && <Text style={styles.grammarExample}>{g.example}</Text>}
                                        </View>
                                    ))}

                                    <Text style={[styles.sectionTitle, styles.mt4]}>{t('learning.diffWithChinese')}</Text>
                                    <Text style={styles.bodyText}>{word.definitions.usage.diff}</Text>

                                    <Text style={[styles.sectionTitle, styles.mt4]}>{t('learning.commonMistakes')}</Text>
                                    <Text style={styles.bodyText}>{word.definitions.usage.mistakes}</Text>

                                    <Text style={[styles.sectionTitle, styles.mt4]}>{t('learning.similarWordsDiff')}</Text>
                                    <Text style={styles.bodyText}>{word.definitions.usage.similar}</Text>
                                </View>
                            )}
                            <View style={{ height: 100 }} />
                        </ScrollView>

                        {/* Blur Overlay */}
                        {!isRevealed && (
                            <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="light">
                                <View style={styles.blurOverlayContent} />
                            </BlurView>
                        )}
                    </View>
                </View>
            </View>

            {/* Bottom Buttons */}
            <View style={styles.bottomBar}>
                {!isRevealed ? (
                    <Pressable style={styles.mainButton} onPress={handleViewDefinition}>
                        <Text style={styles.mainButtonText}>{t('learning.viewDefinition')}</Text>
                    </Pressable>
                ) : (
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
    blurOverlayContent: {
        flex: 1,
        backgroundColor: 'rgba(250, 249, 246, 0.6)', // Colors.paper with opacity
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
