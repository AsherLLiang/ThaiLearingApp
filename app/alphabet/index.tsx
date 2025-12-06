import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, Pressable, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { X, Settings } from 'lucide-react-native';
import Slider from '@react-native-community/slider';
import { ThaiPatternBackground } from '@/src/components/common/ThaiPatternBackground';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { useAlphabetStore } from '@/src/stores/alphabetStore';
import { AlphabetLearningView } from '@/src/components/learning/AlphabetLearningView';
import { AlphabetReviewView } from '@/src/components/learning/AlphabetReviewView';
import { LearningPhase } from '@/src/entities/enums/LearningPhase.enum';

import { useUserStore } from '@/src/stores/userStore';

import { useModuleAccessStore } from '@/src/stores/moduleAccessStore';

export default function AlphabetLearningScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const { currentUser } = useUserStore();
    const { userProgress } = useModuleAccessStore(); // Get user progress
    const {
        currentAlphabet,
        reviewQueue,
        phase,
        isLoading,
        initSession,
        submitResult,
        resetSession,
        completedCount,
        totalCount
    } = useAlphabetStore();

    // Local state for setup
    // Use stored dailyLimit if available, otherwise default to 20
    const [dailyLimit, setDailyLimit] = useState(userProgress?.dailyLimit || 20);
    const [isSetupMode, setIsSetupMode] = useState(true);

    // Local state for learning flow
    const [hasViewedIntro, setHasViewedIntro] = useState(false);

    // Reset intro state when alphabet changes
    useEffect(() => {
        setHasViewedIntro(false);
    }, [currentAlphabet?.alphabetId]);

    // Check if we need to show setup
    useEffect(() => {
        const checkAndStart = async () => {
            // If we have a stored limit and no queue, auto-start
            if (reviewQueue.length === 0 && !isLoading && phase !== LearningPhase.COMPLETED) {
                if (userProgress?.dailyLimit) {
                    setIsSetupMode(false);
                    const userId = currentUser?.userId || 'user_123';
                    // Auto-start with stored limit
                    await initSession(userId, userProgress.dailyLimit);
                } else {
                    setIsSetupMode(true);
                }
            } else if (reviewQueue.length > 0) {
                setIsSetupMode(false);
            }
        };

        checkAndStart();
    }, [reviewQueue.length, phase, isLoading, userProgress?.dailyLimit]);

    const handleStart = async () => {
        const userId = currentUser?.userId || 'user_123';
        await initSession(userId, dailyLimit);
        setIsSetupMode(false);
    };

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
                        resetSession();
                        router.back();
                    }
                }
            ]
        );
    };

    const handleLimitChange = (value: number) => {
        setDailyLimit(Math.round(value));
    };

    // Render Loading
    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centerContent}>
                    <Text>{t('common.loading', '加载中...')}</Text>
                </View>
            </SafeAreaView>
        );
    }

    // Render Setup Mode
    if (isSetupMode) {
        return (
            <SafeAreaView style={styles.container}>
                <ThaiPatternBackground opacity={0.1} />
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()} style={styles.closeButton}>
                        <X size={24} color={Colors.taupe} />
                    </Pressable>
                </View>

                <View style={styles.setupContainer}>
                    <Text style={styles.setupTitle}>{t('learning.setupTitle', '今日学习计划')}</Text>
                    <Text style={styles.setupSubtitle}>{t('learning.setupSubtitle', '选择今天要学习/复习的字母数量')}</Text>

                    <View style={styles.limitControl}>
                        <Text style={styles.limitValue}>{dailyLimit}</Text>
                        <Slider
                            style={styles.slider}
                            minimumValue={5}
                            maximumValue={500}
                            step={5}
                            value={dailyLimit}
                            onValueChange={handleLimitChange}
                            minimumTrackTintColor={Colors.thaiGold}
                            maximumTrackTintColor={Colors.sand}
                            thumbTintColor={Colors.ink}
                        />
                        <View style={styles.limitLabels}>
                            <Text style={styles.limitLabel}>5</Text>
                            <Text style={styles.limitLabel}>500</Text>
                        </View>
                    </View>

                    <Pressable style={styles.startButton} onPress={handleStart}>
                        <Text style={styles.startButtonText}>{t('learning.start', '开始学习')}</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        );
    }

    // Render Completion
    if (phase === LearningPhase.COMPLETED) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centerContent}>
                    <Text style={styles.completeTitle}>{t('learning.sessionComplete', '今日学习完成!')}</Text>
                    <Pressable style={styles.startButton} onPress={() => router.back()}>
                        <Text style={styles.startButtonText}>{t('learning.backToHome', '返回首页')}</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        );
    }

    if (!currentAlphabet) return null;

    // Determine which view to show
    // Show Intro if: It's a new letter (or treated as new) AND hasn't been viewed yet AND it's the first attempt
    // Note: We might want to show intro for "Review" items too if they are "New" in terms of "First time seeing today"? 
    // But usually Review items are just reviewed.
    // The prompt says: "If there are letters to review, review first... New letters... enter review component"
    // So Review items -> Review View directly.
    // New items -> Learning View -> Review View.

    const isNew = !currentAlphabet.memoryState || currentAlphabet.memoryState.isNew;
    const showIntro = isNew && !hasViewedIntro && currentAlphabet.currentAttempts === 0;

    // Progress Calculation
    const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

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

                <View style={{ width: 40 }} />
            </View>

            {/* Content */}
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

// Wrapper to handle the logic of ReviewView calling onAnswer then onNext
// Actually, I need to modify how I use AlphabetReviewView because the store combines "Submit" and "Next".
// I will wrap it here.
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
    centerContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
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
    setupContainer: {
        flex: 1,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    setupTitle: {
        fontFamily: Typography.playfairBold,
        fontSize: 28,
        color: Colors.ink,
        marginBottom: 12,
    },
    setupSubtitle: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 16,
        color: Colors.taupe,
        marginBottom: 48,
        textAlign: 'center',
    },
    limitControl: {
        width: '100%',
        marginBottom: 48,
        alignItems: 'center',
    },
    limitValue: {
        fontFamily: Typography.sarabunBold,
        fontSize: 48,
        color: Colors.thaiGold,
        marginBottom: 24,
    },
    slider: {
        width: '100%',
        height: 40,
    },
    limitLabels: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    limitLabel: {
        fontFamily: Typography.notoSerifRegular,
        color: Colors.taupe,
    },
    startButton: {
        backgroundColor: Colors.ink,
        paddingHorizontal: 48,
        paddingVertical: 16,
        borderRadius: 12,
        width: '100%',
        alignItems: 'center',
    },
    startButtonText: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 18,
        color: Colors.white,
    },
    completeTitle: {
        fontFamily: Typography.playfairBold,
        fontSize: 24,
        color: Colors.ink,
        marginBottom: 24,
    },
});
