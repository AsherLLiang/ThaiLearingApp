// src/components/courses/LettersCard.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';

interface LettersCardProps {
    progress?: {
        completed: number;
        total: number;
    };
}

/**
 * 完全独立的字母学习课程卡片组件
 * 功能：点击卡片任何位置（包括按钮）都直接导航到 /learning/alphabet
 * 样式：与其他课程卡片完全一致
 * 特点：作为独立课程显示，不依赖JSON数据
 */
export function LettersCard({ progress }: LettersCardProps) {
    const router = useRouter();
    const { t } = useTranslation();

    const progressPercent =
        progress && progress.total > 0
            ? Math.min(100, Math.round((progress.completed / progress.total) * 100))
            : null;

    // 统一的导航逻辑：直接跳转到字母学习页面（新位置：app/alphabet）
    const handleNavigate = () => {
        router.push('/alphabet');
    };

    // 课程数据（硬编码）
    const courseData = {
        title: '泰语字母表',
        description: '从44个辅音到元音与声调，逐步掌握泰语读写基础。',
        level: '入门',
        imageSource: require('@/assets/images/courses/thai_alphabet.png'),
        lessons: 44,
    };

    return (
        <Pressable style={styles.card} onPress={handleNavigate}>
            <Image source={courseData.imageSource} style={styles.image} />
            <View style={styles.info}>
                <View style={styles.header}>
                    <Text style={styles.title} numberOfLines={1}>
                        {courseData.title}
                    </Text>
                    <View style={styles.levelBadge}>
                        <Text style={styles.levelText}>{courseData.level}</Text>
                    </View>
                </View>

                <Text style={styles.description} numberOfLines={2}>
                    {courseData.description}
                </Text>

                <View style={styles.footer}>
                    <View style={styles.metaColumn}>
                        {progressPercent !== null ? (
                            <>
                                <View style={styles.progressBar}>
                                    <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
                                </View>
                                <Text style={styles.metaText}>
                                    {progress?.completed}/{progress?.total} ({progressPercent}%)
                                </Text>
                            </>
                        ) : (
                            <Text style={styles.metaText}>{courseData.lessons} 课时</Text>
                        )}
                    </View>

                    {/* 按钮点击也触发导航，但阻止冒泡以避免双重触发 */}
                    <Pressable
                        style={styles.startBtn}
                        onPress={(e) => {
                            e.stopPropagation();
                            handleNavigate();
                        }}
                    >
                        <Text style={styles.startBtnText}>
                            {progressPercent !== null ? t('courses.continue', '继续学习') : t('courses.startBtnText', '开始学习')}
                        </Text>
                    </Pressable>
                </View>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: Colors.white,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: Colors.sand,
        height: 136,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    image: {
        width: 110,
        height: '100%',
        resizeMode: 'cover',
    },
    info: {
        flex: 1,
        padding: 12,
        justifyContent: 'space-between',
        gap: 8,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 8,
    },
    title: {
        flex: 1,
        fontFamily: Typography.notoSerifBold,
        fontSize: 16,
        color: Colors.ink,
    },
    levelBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.3)',
    },
    levelText: {
        fontSize: 10,
        color: Colors.thaiGold,
        fontFamily: Typography.notoSerifRegular,
    },
    description: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 12,
        color: Colors.taupe,
        lineHeight: 16,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
    },
    metaColumn: {
        flex: 1,
        gap: 6,
    },
    metaText: {
        fontSize: 11,
        color: Colors.taupe,
        fontFamily: Typography.notoSerifRegular,
    },
    progressBar: {
        height: 6,
        backgroundColor: '#F0F0F0',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: Colors.thaiGold,
        borderRadius: 3,
    },
    startBtn: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        backgroundColor: Colors.ink,
        borderRadius: 12,
    },
    startBtnText: {
        fontSize: 12,
        color: Colors.white,
        fontFamily: Typography.notoSerifRegular,
    },
});
