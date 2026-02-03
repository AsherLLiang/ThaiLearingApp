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
import { VocabularyQuizView } from '@/src/components/learning/vocabulary/VocabularyQuizView';
import { NewWordView } from '@/src/components/learning/vocabulary/NewWordView';
import { ReviewWordView } from '@/src/components/learning/vocabulary/ReviewWordView';
import { useVocabularyStore } from '@/src/stores/vocabularyStore';
import { useLearningPreferenceStore } from '@/src/stores/learningPreferenceStore';
import { useAlphabetStore } from '@/src/stores/alphabetStore';
import { LearningPhase } from '@/src/entities/enums/LearningPhase.enum';
import { useUserStore } from '@/src/stores/userStore';
import { useVocabularyLearningEngine } from '@/src/hooks/useVocabularyLearningEngine';

type SessionMode = 'REVIEW' | 'LEARN_NEW';
type ModuleVariant = 'letter' | 'word';


export default function LearningSession() {
    const params = useLocalSearchParams();
    const moduleParam = typeof params.module === 'string' ? params.module : 'word';
    const moduleType: ModuleVariant = moduleParam === 'letter' ? 'letter' : 'word';
    const courseSource = typeof params.source === 'string' ? params.source : undefined;
    const rawLimit = params.limit ? parseInt(params.limit as string, 10) : undefined;
    const limit = (typeof rawLimit === 'number' && isFinite(rawLimit)) ? rawLimit : undefined;
    const { startCourse, currentCourseSource } = useVocabularyStore();
    const { dailyLimits } = useLearningPreferenceStore();

    useEffect(() => {
        if (!courseSource) return;

        // ⭐ 1. 字母模块：不在这里自动 startCourse
        if (moduleType === 'letter') {
            return;
        }

        // ⭐ 2. 核心初始化逻辑（单一数据源）
        // 只有当：
        // A. 当前 Store 里没有加载任何课程
        // B. 或者 Store 里的课程跟 URL 参数不一致（用户切换了课程）
        // 才触发 startCourse。
        // 且 limit 必须强制使用 store 中的 dailyLimits (用户设置)，如果没有则兜底 20
        if (!currentCourseSource || currentCourseSource !== courseSource) {
            console.log(`🔄 Init Session: Switching from [${currentCourseSource}] to [${courseSource}]`);

            // 🔥 CRITICAL: Trust store only. Do not use URL params for limit.
            const effectiveLimit = dailyLimits.word || 20;

            startCourse(courseSource, effectiveLimit);
        }
    }, [moduleType, courseSource, currentCourseSource, startCourse, dailyLimits.word]);

    if (moduleType === 'letter') {
        return <AlphabetSession />;
    }

    return <WordSession />;
}

function WordSession() {
    const { t } = useTranslation();
    const router = useRouter();
    const {
        currentItem,
        componentType,
        progress,
        handleAnswer
    } = useVocabularyLearningEngine();

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


    // 分发渲染容器
    const renderContent = () => {
        switch (componentType) {
            case 'loading':
                return <View style={styles.centerContent}><Text>{t('common.loading')}</Text></View>;
            case 'completed':
                return (
                    <View style={styles.completeContainer}>
                        <Text style={styles.completeTitle}>{t('learning.sessionComplete')}</Text>
                        <Pressable style={styles.completeButton} onPress={() => router.back()}>
                            <Text style={styles.completeButtonText}>{t('learning.backToHome')}</Text>
                        </Pressable>
                    </View>
                );
            case 'vocab-new':
                return <NewWordView vocabulary={currentItem!.entity} onNext={() => handleAnswer(true)} />;
            case 'vocab-review':
                return <ReviewWordView vocabulary={currentItem!.entity} onNext={() => handleAnswer(true)} />;
            case 'vocab-new-quiz':
            case 'vocab-rev-quiz':
            case 'vocab-error-retry':
                return <VocabularyQuizView vocabulary={currentItem!.entity} />;
            default:
                return null;
        }
    };
    return (
        <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
            <ThaiPatternBackground opacity={0.05} />
            <View style={styles.header}>
                <Pressable onPress={handleClose} style={styles.closeButton}><X size={24} color={Colors.taupe} /></Pressable>
                <View style={styles.progressBarContainer}>
                    <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
                </View>
                <View style={{ width: 44 }} />
            </View>
            <View style={styles.content}>
                {renderContent()}
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
