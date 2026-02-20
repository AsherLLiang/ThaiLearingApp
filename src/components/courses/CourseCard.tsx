import React from 'react';
import { View, Text, StyleSheet, Pressable, Image, ImageSourcePropType } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';

export interface CourseCardData {
    id: string;
    source: string;
    title: string;
    description: string;
    level: string;
    imageSource: ImageSourcePropType;
    category: string;
    lessons: number;
}

interface CourseCardProps {
    course: CourseCardData;
    isCurrent: boolean;
    onStart: () => void;
    onCardPress?: () => void;
    progress?: {
        completed: number;
        total: number;
    };
    isLocked?: boolean; // Added: Locked state prop
}

export function CourseCard(
    {
        course,
        isCurrent,
        onStart,
        onCardPress,
        progress,
        isLocked = false, // Default to unlocked
    }: CourseCardProps
) {
    const { t } = useTranslation();

    const progressPercent = progress && progress.total > 0
        ? Math.min(100, Math.round((progress.completed / progress.total) * 100))
        : null;

    return (
        <Pressable
            key={course.id}
            style={[
                styles.card,
                (isCurrent && !isLocked) && styles.activeCard,
                // Removed: isLocked && styles.lockedCard (User requested normal look)
            ]}
            onPress={isLocked ? undefined : (onCardPress || onStart)} // Still disable press if locked
            disabled={isLocked}
        >
            <Image
                source={course.imageSource}
                style={styles.image} // Removed: isLocked && styles.lockedImage
            />
            <View style={styles.info}>
                <View style={styles.header}>
                    <Text style={styles.title} numberOfLines={1}>
                        {t(course.title)}
                    </Text>
                    {!isLocked && (
                        <View style={styles.levelBadge}>
                            <Text style={styles.levelText}>{t(course.level)}</Text>
                        </View>
                    )}
                </View>

                <Text style={styles.description} numberOfLines={2}>
                    {t(course.description)}
                </Text>

                <View style={styles.footer}>
                    {/* Meta Info (Hidden or dimmed when locked) */}
                    <View style={styles.metaColumn}>
                        {!isLocked && (
                            progressPercent !== null ? (
                                <>
                                    <View style={styles.progressBar}>
                                        <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
                                    </View>
                                    <Text style={styles.metaText}>
                                        {progress?.completed}/{progress?.total} ({progressPercent}%)
                                    </Text>
                                </>
                            ) : (
                                <Text style={styles.metaText}>{course.lessons} 课时</Text>
                            )
                        )}
                    </View>

                    <Pressable
                        style={[
                            styles.startBtn,
                            isCurrent && styles.activeStartBtn,
                            isLocked && styles.lockedBtn // Locked button style
                        ]}
                        onPress={(e) => {
                            if (isLocked) return;
                            e.stopPropagation();
                            onStart(); // <--- This calls the handler from courses.tsx
                        }}
                        disabled={isLocked}
                    >

                        <Text style={[
                            styles.startBtnText,
                            isCurrent && styles.activeStartBtnText,
                            isLocked && styles.lockedBtnText // Locked text style
                        ]}>
                            {isLocked
                                ? t('courses.locked', '未解锁')
                                : (isCurrent ? t('courses.continue', '继续学习') : t('courses.startBtnText', '开始学习'))
                            }
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
    activeCard: {
        borderColor: Colors.thaiGold,
        borderWidth: 2,
        backgroundColor: '#FFFCF5',
    },
    lockedCard: {
        backgroundColor: '#F5F5F5',
        borderColor: '#E0E0E0',
        elevation: 0,
        shadowOpacity: 0,
    },
    image: {
        width: 110,
        height: '100%',
        resizeMode: 'cover',
    },
    lockedImage: {
        opacity: 0.5,
        tintColor: 'gray', // Grayscale effect
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
    lockedText: {
        color: '#A0A0A0',
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
    activeStartBtn: {
        backgroundColor: Colors.thaiGold,
    },
    lockedBtn: {
        backgroundColor: '#E0E0E0',
    },
    startBtnText: {
        fontSize: 12,
        color: Colors.white,
        fontFamily: Typography.notoSerifRegular,
    },
    activeStartBtnText: {
        color: Colors.white,
        fontWeight: '600',
    },
    lockedBtnText: {
        color: '#9E9E9E',
    },
});
