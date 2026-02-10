// src/components/courses/AlphabetCourseCard.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable, Image, ImageSourcePropType } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';

interface AlphabetCourseCardProps {
  course: {
    id: string;
    source: string;
    title: string;
    description: string;
    level: string;
    imageSource: ImageSourcePropType;
    lessons: number;
  };
  isCurrent: boolean;
  progress?: {
    completed: number;
    total: number;
  };
  onStart: () => void;
}

export function AlphabetCourseCard({ course, isCurrent, progress, onStart }: AlphabetCourseCardProps) {
  const router = useRouter();
  const { t } = useTranslation();

  const progressPercent = (() => {
    if (!progress) {
      return null;
    }
    const completed = progress.completed || 0;
    const total = progress.total || 44; // Default total if not provided
    if (total === 0) {
      return 0; // Or null, depending on desired behavior for 0 total
    }
    return Math.min(100, Math.round((completed / total) * 100));
  })();

  return (
    <View style={[styles.card, isCurrent && styles.activeCard]}>
      <Pressable style={styles.cardPressable} onPress={onStart}>
        <Image source={course.imageSource} style={styles.image} />
        <View style={styles.info}>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={1}>
              {t(course.title)}
            </Text>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>{t(course.level)}</Text>
            </View>
          </View>

          <Text style={styles.description} numberOfLines={2}>
            {t(course.description)}
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
                <Text style={styles.metaText}>{course.lessons} 课时</Text>
              )}
            </View>

            {/* Start Learning 按钮 */}
            <Pressable
              style={[styles.startBtn, isCurrent && styles.activeStartBtn]}
              onPress={(e) => {
                e.stopPropagation();
                onStart();
              }}
            >
              <Text style={[styles.startBtnText, isCurrent && styles.activeStartBtnText]}>
                {isCurrent ? t('courses.continue') : t('courses.startBtnText')}
              </Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </View>
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
  cardPressable: {
    flex: 1,
    flexDirection: 'row',
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
  activeStartBtn: {
    backgroundColor: Colors.thaiGold,
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
});
