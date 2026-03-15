import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';
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
import { useModuleAccessStore } from '@/src/stores/moduleAccessStore';
import { LearningPhase } from '@/src/entities/enums/LearningPhase.enum';
import { useUserStore } from '@/src/stores/userStore';
import { useVocabularyLearningEngine } from '@/src/hooks/useVocabularyLearningEngine';
import { VocabSessionPhase } from '@/src/entities/types/vocabulary.types';


type SessionMode = 'REVIEW' | 'LEARN_NEW';
type ModuleVariant = 'letter' | 'word';

export default function LearningSession() {
    const { t } = useTranslation();
    const router = useRouter();
    const params = useLocalSearchParams();
    const moduleParam = typeof params.module === 'string' ? params.module : 'word';
    const moduleType: ModuleVariant = moduleParam === 'letter' ? 'letter' : 'word';
    const courseSource = typeof params.source === 'string' ? params.source : undefined;
    const rawLimit = params.limit ? parseInt(params.limit as string, 10) : undefined;
    const limit = (typeof rawLimit === 'number' && isFinite(rawLimit)) ? rawLimit : undefined;
    const { startCourse, currentCourseSource, phase, queue } = useVocabularyStore();
    const { currentUser } = useUserStore();
    const { dailyLimits } = useLearningPreferenceStore();
    const { userProgress } = useModuleAccessStore();
    // 用于判断是否是本次 mount 后的第一次初始化
    // 每次组件重新挂载（新实例），useRef(true) 会重置为 true
    const isFirstMountRef = useRef(true);

    useEffect(() => {
        // 确保有课程来源且用户信息已加载（startCourse 内部依赖 userId）
        if (!courseSource || !currentUser?.userId) return;

        // ⭐ 1. 字母模块：不在这里自动 startCourse
        if (moduleType === 'letter') {
            return;
        }

        // ⭐ 2. 核心初始化逻辑（单一数据源）
        // 触发条件：
        // A. 本次 mount 后首次运行（替代原来的 isIdle，避免依赖 phase 引发竞态）
        // B. 课程来源不一致（切换课程）
        // C. 虽然处于 LEARNING 状态但内存中无数据（处理异常重启/热重载后的状态不一致）
        const isFirstMount = isFirstMountRef.current;
        const isDifferentSource = !currentCourseSource || currentCourseSource !== courseSource;
        const isDataMissing = phase === VocabSessionPhase.LEARNING && (!queue || queue.length === 0);

        if (isFirstMount || isDifferentSource || isDataMissing) {
            isFirstMountRef.current = false;
            console.log(`🔄 Init Session: Phase[${phase}] Queue[${queue.length}] Source[${currentCourseSource} -> ${courseSource}]`);

            // 🔥 CRITICAL: Trust store only. Do not use URL params for limit.
            const effectiveLimit = userProgress?.dailyLimit || limit || 20;
            console.log(`有效限制: ${effectiveLimit}`);

            startCourse(courseSource, effectiveLimit, moduleType as any);
        }
    }, [
        moduleType,
        courseSource,
        currentCourseSource,
        // phase 不放入依赖数组：WordSession.cleanup 调 resetSession() 会改变 phase，
        // 若 phase 在依赖里，卸载过程中会意外触发 startCourse → getTodayMemories
        queue.length,
        currentUser?.userId,
        startCourse,
        dailyLimits.word,
        userProgress?.dailyLimit
    ]);

    // 学习时长追踪：进入页面开始计时，离开时累加到当日
    const { startStudySession, stopStudySession } = useLearningPreferenceStore();
    useFocusEffect(
        React.useCallback(() => {
            startStudySession();
            return () => stopStudySession();
        }, [startStudySession, stopStudySession])
    );

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

    const handleBackToCourses = () => {
        router.replace('/(tabs)/courses');
    };

    useEffect(() => {
        return () => {
            if (useVocabularyStore.getState().phase === VocabSessionPhase.COMPLETED) {
                useVocabularyStore.getState().resetSession();
            }
        };
    }, []);

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
                        <Pressable style={styles.completeButton} onPress={() => router.push('/learning/session-summary')}>
                            <Text style={styles.completeButtonText}>{t('microReading.title', '微阅读')}</Text>
                        </Pressable>
                        <Pressable style={styles.completeButton} onPress={handleBackToCourses}>
                            <Text style={styles.completeButtonText}>{t('learning.backToHome', '返回首页')}</Text>
                        </Pressable>
                    </View>
                );
            case 'vocab-new':
                return <NewWordView key={currentItem!.entity._id} vocabulary={currentItem!.entity} onNext={() => handleAnswer(true)} />;
            case 'vocab-review':
                return <ReviewWordView key={currentItem!.entity._id} vocabulary={currentItem!.entity} onNext={() => handleAnswer(true)} />;
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
                <Pressable onPress={handleClose} style={styles.closeButton}>
                    <X size={24} color={Colors.taupe} />
                </Pressable>

                <View style={styles.progressBarContainer}>
                    <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
                </View>

                {/* 跳过按钮 (置于进度条右侧) */}
                {(componentType === 'vocab-new' || componentType === 'vocab-review') && currentItem?.entity?._id ? (
                    <Pressable
                        onPress={() => useVocabularyStore.getState().skipWord(currentItem.entity._id)}
                        style={styles.headerSkipButton}
                    >
                        <Text style={styles.headerSkipText}>{t('learning.skip')}</Text>
                        <X size={14} color={Colors.taupe} />
                    </Pressable>
                ) : (
                    <View style={{ width: 44 }} />
                )}
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
                    <Pressable style={styles.microReadingButton} onPress={() => router.push('/learning/session-summary')}>
                        <Text style={styles.completeButtonText}>{t('microReading.title', '微阅读')}</Text>
                    </Pressable>
                    <Pressable style={styles.completeButton} onPress={() => router.push('/courses')}>
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
    headerSkipButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 12,
        gap: 2,
        marginRight: 4,
    },
    headerSkipText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 12,
        color: Colors.taupe,
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
    microReadingButton: {
        backgroundColor: Colors.ink,
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    completeButton: {
        backgroundColor: Colors.ink,
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 12,
        marginTop: 12,
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
