import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Volume2 } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { WordData } from './NewWordView';

interface ReviewWordViewProps {
    word: WordData; // 复习的单词数据
    // 用户回答结果的回调函数。
    // quality 参数代表掌握程度: 'know' (认识), 'unsure' (模糊), 'forgot' (忘记)
    // 这个回调通常用于更新后台的 SRS (Spaced Repetition System) 数据
    onAnswer: (quality: 'know' | 'unsure' | 'forgot') => void;
    onNext: () => void; // 进入下一个单词的回调
}

/**
 * ReviewWordView 组件
 * 
 * 这是一个用于“旧词复习”环节的视图组件。
 * 
 * 主要逻辑流程：
 * 1. 初始状态下（isRevealed=false），只显示单词本身（泰语+发音）和一个辅助例句。
 * 2. 单词的详细释义被模糊处理，强制用户进行回忆。
 * 3. 底部提供三个按钮：忘记、模糊、认识，供用户自评。
 * 4. 用户点击任一评分按钮后：
 *    - 调用 onAnswer 提交评分结果。
 *    - 设置 isRevealed=true，揭示被模糊的释义内容。
 *    - 底部按钮变为“下一个”。
 * 5. 用户阅读释义确认后，点击“下一个”继续。
 */
export const ReviewWordView: React.FC<ReviewWordViewProps> = ({ word, onAnswer, onNext }) => {
    const { t } = useTranslation();
    // 控制释义内容是否已揭示
    const [isRevealed, setIsRevealed] = useState(false);

    // 处理用户点击评分按钮
    const handleReveal = (quality: 'know' | 'unsure' | 'forgot') => {
        setIsRevealed(true); // 揭示答案
        onAnswer(quality);   // 提交评分结果 (SRS算法会根据此调整下次复习时间)
    };

    // 提取第一个例句作为上下文提示
    // 在这里我们只取数组中的第一个用于展示
    const exampleSentence = word.definitions.examples[0];

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {/* 顶部区域：单词卡片与发音 */}
                <View style={styles.topSection}>
                    <Text style={styles.thaiWord}>{word.thai}</Text>

                    <View style={styles.phoneticRow}>
                        <Pressable style={styles.audioButton}>
                            <Volume2 size={20} color={Colors.thaiGold} />
                        </Pressable>
                        <Text style={styles.phoneticText}>{word.phonetic}</Text>
                    </View>
                </View>

                {/* 上下文提示区域：展示例句 */}
                {/* 如果存在例句，显示在此处帮助用户根据上下文回忆 */}
                {exampleSentence && (
                    <View style={styles.contextContainer}>
                        <Text style={styles.contextThai}>
                            {/* 暂时简单展示泰语整句，后续可优化为高亮关键词 */}
                            {exampleSentence.thai}
                        </Text>
                        <Text style={styles.contextMeaning}>{exampleSentence.meaning}</Text>
                    </View>
                )}

                {/* 模糊内容区域：答案与详细释义 */}
                <View style={styles.blurredAreaContainer}>
                    {/* 实际内容层 */}
                    <View style={styles.blurredContent}>
                        {/* 含义头部 */}
                        <View style={styles.meaningHeader}>
                            <Text style={styles.mainMeaning}>{word.meaning}</Text>
                            <View style={styles.typeTag}>
                                <Text style={styles.typeText}>{word.type}</Text>
                            </View>
                        </View>
                        {/* 基础英文/详细定义 */}
                        <Text style={styles.definitionText}>{word.definitions.basic}</Text>
                    </View>

                    {/* 模糊遮罩层：仅在 isRevealed 为 false 时覆盖 */}
                    {!isRevealed && (
                        <BlurView intensity={60} style={StyleSheet.absoluteFill} tint="dark">
                            <View style={styles.blurOverlay} />
                        </BlurView>
                    )}
                </View>
            </ScrollView>

            {/* 底部操作栏 */}
            <View style={styles.bottomBar}>
                {!isRevealed ? (
                    // 未揭示时：展示三个自评按钮 (忘记 / 模糊 / 认识)
                    <View style={styles.buttonGrid}>
                        <Pressable
                            style={[styles.actionButton, styles.btnForgot]}
                            onPress={() => handleReveal('forgot')}
                        >
                            <Text style={[styles.btnText, styles.textForgot]}>{t('learning.forgot')}</Text>
                        </Pressable>

                        <Pressable
                            style={[styles.actionButton, styles.btnUnsure]}
                            onPress={() => handleReveal('unsure')}
                        >
                            <Text style={[styles.btnText, styles.textUnsure]}>{t('learning.unsure')}</Text>
                        </Pressable>

                        <Pressable
                            style={[styles.actionButton, styles.btnKnow]}
                            onPress={() => handleReveal('know')}
                        >
                            <Text style={[styles.btnText, styles.textKnow]}>{t('learning.know')}</Text>
                        </Pressable>
                    </View>
                ) : (
                    // 已揭示时：展示“下一个”按钮
                    <Pressable style={styles.nextButton} onPress={onNext}>
                        <Text style={styles.nextButtonText}>{t('learning.next')}</Text>
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
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 40,
        paddingBottom: 100,
        alignItems: 'center',
    },
    topSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    thaiWord: {
        fontFamily: Typography.sarabunBold,
        fontSize: 64,
        color: Colors.ink,
        marginBottom: 12,
    },
    phoneticRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    audioButton: {
        padding: 8,
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        borderRadius: 20,
    },
    phoneticText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 20,
        color: Colors.taupe,
    },
    contextContainer: {
        width: '100%',
        backgroundColor: Colors.white,
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.sand,
        marginBottom: 32,
    },
    contextThai: {
        fontFamily: Typography.sarabunRegular,
        fontSize: 18,
        color: Colors.ink,
        marginBottom: 8,
        lineHeight: 28,
    },
    contextMeaning: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 14,
        color: Colors.taupe,
    },
    blurredAreaContainer: {
        width: '100%',
        minHeight: 200,
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.sand,
    },
    blurredContent: {
        padding: 24,
        alignItems: 'center',
    },
    blurOverlay: {
        flex: 1,
        backgroundColor: 'rgba(26, 26, 26, 0.8)', // Dark overlay for better contrast with white text if needed, or match design
    },
    meaningHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
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
    definitionText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 16,
        color: Colors.ink,
        textAlign: 'center',
        lineHeight: 24,
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 24,
        backgroundColor: Colors.paper,
        borderTopWidth: 1,
        borderTopColor: Colors.sand,
    },
    buttonGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 16,
    },
    actionButton: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnForgot: {
        backgroundColor: '#FEF2F2',
        borderWidth: 1,
        borderColor: '#FCA5A5',
    },
    textForgot: {
        color: '#DC2626',
    },
    btnUnsure: {
        backgroundColor: '#FFFBEB',
        borderWidth: 1,
        borderColor: '#FCD34D',
    },
    textUnsure: {
        color: '#D97706',
    },
    btnKnow: {
        backgroundColor: '#ECFDF5',
        borderWidth: 1,
        borderColor: '#6EE7B7',
    },
    textKnow: {
        color: '#059669',
    },
    btnText: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 16,
    },
    nextButton: {
        backgroundColor: Colors.ink,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    nextButtonText: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 16,
        color: Colors.white,
    },
});

