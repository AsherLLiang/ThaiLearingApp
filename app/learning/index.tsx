import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { X } from 'lucide-react-native';
import { ThaiPatternBackground } from '@/src/components/common/ThaiPatternBackground';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { AlphabetLearningView } from '@/src/components/learning/alphabet/AlphabetLearningView';
import { AlphabetReviewView } from '@/src/components/learning/alphabet/AlphabetReviewView';
import { VocabularyAssessmentView } from '@/src/components/learning/vocabulary/VocabularyAssessmentView';
import { VocabularyQuizView } from '@/src/components/learning/vocabulary/VocabularyQuizView';
import { useVocabularyStore } from '@/src/stores/vocabularyStore';
import { useLearningPreferenceStore } from '@/src/stores/learningPreferenceStore';
import { useAlphabetStore } from '@/src/stores/alphabetStore';
import { LearningPhase } from '@/src/entities/enums/LearningPhase.enum';
import { useUserStore } from '@/src/stores/userStore';

type SessionMode = 'REVIEW' | 'LEARN_NEW';
type ModuleVariant = 'letter' | 'word';


export default function LearningSession() {
    const params = useLocalSearchParams();
    const moduleParam = typeof params.module === 'string' ? params.module : 'word';
    const moduleType: ModuleVariant = moduleParam === 'letter' ? 'letter' : 'word';
    const courseSource = typeof params.source === 'string' ? params.source : undefined;
    const { startCourse, currentCourseSource } = useVocabularyStore();

    useEffect(() => {
        if (!courseSource) return;

        // ⭐ 1. 字母模块：不在这里自动 startCourse
        if (moduleType === 'letter') {
            return;
        }

        // ⭐ 2. 只有当当前没有课程时，才初始化一次
        if (!currentCourseSource) {
            startCourse(courseSource);
        }
    }, [moduleType, courseSource, currentCourseSource, startCourse]);

    if (moduleType === 'letter') {
        return <AlphabetSession />;
    }

    return <WordSession />;
}

function WordSession() {
    const { t } = useTranslation();
    const router = useRouter();

    // ⭐ 使用真正的 Store 状态
    const {
        phase,
        currentChunk,
        currentIndex,
        chunkPhase,
        totalSessionWords,
        completedCount,
        rateCurrentWord,
        submitQuizResult
    } = useVocabularyStore();

    const currentItem = currentChunk[currentIndex];

    // 处理退出
    const handleClose = () => {
        Alert.alert(
            t('learning.endSessionTitle'),
            t('learning.endSessionMessage'),
            [
                { text: t('common.cancel'), style: "cancel" },
                { text: t('learning.quit'), style: "destructive", onPress: () => router.back() }
            ]
        );
    };

    // 1. 加载中状态
    if (phase === LearningPhase.VOCAB_LOADING || (!currentItem && phase !== LearningPhase.VOCAB_COMPLETED)) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centerContent}>
                    <Text>{t('common.loading')}</Text>
                </View>
            </SafeAreaView>
        );
    }

    // 2. 完成状态
    if (phase === LearningPhase.VOCAB_COMPLETED) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.completeContainer}>
                    <Text style={styles.completeTitle}>{t('learning.sessionComplete')}</Text>
                    <Pressable style={styles.completeButton} onPress={() => router.back()}>
                        <Text style={styles.completeButtonText}>{t('learning.backToHome')}</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        );
    }

    // 计算总进度 (基于已完成的单词总数)
    const progress = totalSessionWords > 0 ? Math.round((completedCount / totalSessionWords) * 100) : 0;

    return (
        <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
            <ThaiPatternBackground opacity={0.05} />

            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={handleClose} style={styles.closeButton}>
                    <X size={24} color={Colors.taupe} />
                </Pressable>

                <View style={styles.progressBarContainer}>
                    <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
                </View>

                {/* 右侧占位，保持进度条居中 */}
                <View style={{ width: 44 }} />
            </View>

            {/* Main Content */}
            <View style={styles.content}>
                {chunkPhase === 'ASSESSMENT' ? (
                    <VocabularyAssessmentView
                        key={`assess-${currentItem.id}`}
                        vocabulary={currentItem.entity}
                        onRate={rateCurrentWord}
                    />
                ) : (
                    <VocabularyQuizView
                        key={`quiz-${currentItem.id}`}
                        vocabulary={currentItem.entity}
                        onResult={submitQuizResult}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

function AlphabetSession() {
    const { t } = useTranslation();
    const router = useRouter();
    const { currentUser } = useUserStore();
    const { dailyLimits } = useLearningPreferenceStore();
    const [hasViewedIntro, setHasViewedIntro] = useState(false);
    const [sessionStarted, setSessionStarted] = useState(false);

    const {
        phase,
        isLoading,
        initializeSession,
        submitResult,
        reset,
        completedCount,
        totalCount,
        currentItem,
    } = useAlphabetStore();

    const currentAlphabet = currentItem;

    useEffect(() => {
        setHasViewedIntro(false);
    }, [currentAlphabet?.alphabetId]);

    useEffect(() => {
        const start = async () => {
            if (sessionStarted || isLoading) return;
            const userId = currentUser?.userId || 'user_123';
            await initializeSession(userId, {
                limit: dailyLimits.letter || 30,
            });
            setSessionStarted(true);
        };

        start();
    }, [sessionStarted, isLoading, initializeSession, currentUser?.userId, dailyLimits.letter]);

    const handleClose = () => {
        Alert.alert(
            t('learning.endSessionTitle', '结束学习?'),
            t('learning.endSessionMessage', '当前进度将不会保存'),
            [
                { text: t('common.cancel', '取消'), style: "cancel" },
                {
                    text: t('learning.quit', '退出'),
                    style: "destructive",
                    onPress: () => {
                        reset();
                        router.back();
                    }
                }
            ]
        );
    };

    if (isLoading && !sessionStarted) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centerContent}>
                    <Text>{t('common.loading', '加载中...')}</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (phase === LearningPhase.COMPLETED) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centerContent}>
                    <Text style={styles.completeTitle}>{t('learning.sessionComplete', '今日学习完成!')}</Text>
                    <Pressable style={styles.completeButton} onPress={() => router.back()}>
                        <Text style={styles.completeButtonText}>{t('learning.backToHome', '返回首页')}</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        );
    }

    if (!currentAlphabet) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centerContent}>
                    <Text>{t('common.loading', '加载中...')}</Text>
                </View>
            </SafeAreaView>
        );
    }

    const isNew = !currentAlphabet.memoryState || currentAlphabet.memoryState.isNew;
    const showIntro = isNew && !hasViewedIntro && currentAlphabet.currentAttempts === 0;
    const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    return (
        <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
            <ThaiPatternBackground opacity={0.05} />

            <View style={styles.header}>
                <Pressable onPress={handleClose} style={styles.closeButton}>
                    <X size={24} color={Colors.taupe} />
                </Pressable>

                <View style={styles.progressBarContainer}>
                    <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
                </View>

                <View style={{ width: 60 }} />
            </View>

            <View style={styles.content}>
                {showIntro ? (
                    <AlphabetLearningView
                        alphabet={currentAlphabet}
                        onNext={() => setHasViewedIntro(true)}
                    />
                ) : (
                    <AlphabetReviewViewWrapper
                        key={currentAlphabet.alphabetId}
                        alphabet={currentAlphabet}
                        onSubmit={(quality) => {
                            const userId = currentUser?.userId || 'user_123';
                            submitResult(userId, quality);
                        }}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

function AlphabetReviewViewWrapper({ alphabet, onSubmit }: { alphabet: any, onSubmit: (q: any) => void }) {
    const [quality, setQuality] = useState<any>(null);

    return (
        <AlphabetReviewView
            alphabet={alphabet}
            onAnswer={(q) => setQuality(q)}
            onNext={() => {
                if (quality) onSubmit(quality);
            }}
        />
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
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    closeButton: {
        padding: 8,
    },
    progressBarContainer: {
        flex: 1,
        height: 6,
        backgroundColor: 'rgba(229, 226, 219, 0.5)',
        borderRadius: 3,
        marginHorizontal: 16,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: Colors.thaiGold,
        borderRadius: 3,
    },
    content: {
        flex: 1,
    },
    completeContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    completeTitle: {
        fontFamily: Typography.playfairBold,
        fontSize: 24,
        color: Colors.ink,
        marginBottom: 24,
    },
    completeButton: {
        backgroundColor: Colors.ink,
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 12,
    },
    completeButtonText: {
        color: Colors.white,
        fontFamily: Typography.notoSerifBold,
    },
    centerContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    skipText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 14,
        color: Colors.taupe,
    },
});
