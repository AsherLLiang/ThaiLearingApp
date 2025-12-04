// src/components/learning/ModuleLockedScreen.tsx

/**
 * 模块锁定界面
 * 
 * 功能：
 * 1. 显示模块被锁定的提示
 * 2. 显示当前进度和解锁要求
 * 3. 提供返回按钮
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { Lock, ArrowLeft } from 'lucide-react-native';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { useModuleAccessStore, type ModuleType } from '@/src/stores/moduleAccessStore';

// ==================== 类型定义 ====================

interface ModuleLockedScreenProps {
    moduleType: ModuleType;
}

// ==================== 辅助函数 ====================

/**
 * 获取模块的显示名称
 */
const getModuleName = (moduleType: ModuleType, t: any): string => {
    const moduleNames = {
        alphabet: t('modules.alphabet'),
        word: t('modules.word'),
        sentence: t('modules.sentence'),
        article: t('modules.article'),
    };
    return moduleNames[moduleType] || moduleType;
};

/**
 * 获取锁定原因和解锁要求
 */
const getUnlockRequirement = (
    moduleType: ModuleType,
    userProgress: any,
    t: any
): { prerequisite: string; currentProgress: number; requiredProgress: number } => {
    if (!userProgress) {
        return {
            prerequisite: t('moduleAccess.noProgress'),
            currentProgress: 0,
            requiredProgress: 95,
        };
    }

    switch (moduleType) {
        case 'word':
            return {
                prerequisite: t('moduleAccess.prerequisite.word'),
                currentProgress: userProgress.letterProgress || 0,
                requiredProgress: 95,
            };
        case 'sentence':
            return {
                prerequisite: t('moduleAccess.prerequisite.sentence'),
                currentProgress: userProgress.wordProgress || 0,
                requiredProgress: 80,
            };
        case 'article':
            return {
                prerequisite: t('moduleAccess.prerequisite.article'),
                currentProgress: userProgress.sentenceProgress || 0,
                requiredProgress: 80,
            };
        default:
            return {
                prerequisite: t('moduleAccess.unknownModule'),
                currentProgress: 0,
                requiredProgress: 100,
            };
    }
};

// ==================== 组件 ====================

export default function ModuleLockedScreen({ moduleType }: ModuleLockedScreenProps) {
    const { t } = useTranslation();
    const router = useRouter();
    const { userProgress } = useModuleAccessStore();

    const moduleName = getModuleName(moduleType, t);
    const { prerequisite, currentProgress, requiredProgress } = getUnlockRequirement(
        moduleType,
        userProgress,
        t
    );

    const progressPercentage = Math.min(currentProgress, requiredProgress);

    const handleBack = () => {
        router.back();
    };

    return (
        <View style={styles.container}>
            {/* 锁定图标 */}
            <View style={styles.iconContainer}>
                <View style={styles.iconCircle}>
                    <Lock size={64} color={Colors.taupe} strokeWidth={1.5} />
                </View>
            </View>

            {/* 标题 */}
            <Text style={styles.title}>{t('moduleAccess.locked')}</Text>

            {/* 提示文字 */}
            <Text style={styles.message}>
                {t('moduleAccess.lockedMessage', { module: moduleName })}
            </Text>

            {/* 前置要求 */}
            <View style={styles.requirementCard}>
                <Text style={styles.requirementTitle}>{t('moduleAccess.requirement')}</Text>
                <Text style={styles.requirementText}>{prerequisite}</Text>
            </View>

            {/* 进度条 */}
            <View style={styles.progressContainer}>
                <View style={styles.progressHeader}>
                    <Text style={styles.progressLabel}>{t('moduleAccess.currentProgress')}</Text>
                    <Text style={styles.progressValue}>
                        {currentProgress}% / {requiredProgress}%
                    </Text>
                </View>

                <View style={styles.progressBarContainer}>
                    <View style={styles.progressBarBackground}>
                        <View
                            style={[
                                styles.progressBarFill,
                                {
                                    width: `${(progressPercentage / requiredProgress) * 100}%`,
                                },
                            ]}
                        />
                    </View>
                </View>

                {/* 进度提示 */}
                {currentProgress < requiredProgress ? (
                    <Text style={styles.progressHint}>
                        {t('moduleAccess.remainingProgress', {
                            remaining: requiredProgress - currentProgress,
                        })}
                    </Text>
                ) : (
                    <Text style={styles.progressComplete}>
                        {t('moduleAccess.progressComplete')}
                    </Text>
                )}
            </View>

            {/* 返回按钮 */}
            <Pressable style={styles.backButton} onPress={handleBack}>
                <ArrowLeft size={20} color={Colors.white} />
                <Text style={styles.backButtonText}>{t('moduleAccess.goBack')}</Text>
            </Pressable>
        </View>
    );
}

// ==================== 样式 ====================

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.paper,
        paddingHorizontal: 24,
        paddingTop: 80,
        paddingBottom: 40,
        alignItems: 'center',
    },
    iconContainer: {
        marginBottom: 32,
    },
    iconCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: Colors.sand,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: Colors.taupe,
        opacity: 0.8,
    },
    title: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 28,
        color: Colors.ink,
        marginBottom: 12,
        textAlign: 'center',
    },
    message: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 16,
        color: Colors.taupe,
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 24,
    },
    requirementCard: {
        width: '100%',
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 20,
        marginBottom: 32,
        borderWidth: 1,
        borderColor: Colors.sand,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    requirementTitle: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 14,
        color: Colors.thaiGold,
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    requirementText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 16,
        color: Colors.ink,
        lineHeight: 24,
    },
    progressContainer: {
        width: '100%',
        marginBottom: 40,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    progressLabel: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 14,
        color: Colors.taupe,
    },
    progressValue: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 14,
        color: Colors.ink,
    },
    progressBarContainer: {
        marginBottom: 8,
    },
    progressBarBackground: {
        width: '100%',
        height: 12,
        backgroundColor: Colors.sand,
        borderRadius: 6,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: Colors.thaiGold,
        borderRadius: 6,
    },
    progressHint: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 13,
        color: Colors.taupe,
        fontStyle: 'italic',
    },
    progressComplete: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 13,
        color: Colors.thaiGold,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.ink,
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 12,
        gap: 8,
        shadowColor: Colors.thaiGold,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    backButtonText: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 16,
        color: Colors.white,
    },
});
