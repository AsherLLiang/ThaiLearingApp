// app/(tabs)/index.tsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Play, TrendingUp, Clock, Award, Star } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { ThaiPatternBackground } from '@/src/components/common/ThaiPatternBackground';
import { FloatingBubbles } from '@/src/components/common/FloatingBubbles';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { ReviewItem } from '@/src/entities/types/entities';
import { useUserStore } from '@/src/stores/userStore';
import { useModuleAccessStore } from '@/src/stores/moduleAccessStore';

const MOCK_REVIEWS: ReviewItem[] = [
  { id: '1', char: 'ข', phonetic: 'Khor Khai', type: 'Review', dueIn: 'Today' },
  { id: '2', char: 'ค', phonetic: 'Khor Khwai', type: 'Hard', dueIn: 'Today' },
  { id: '3', char: 'ง', phonetic: 'Ngor Ngu', type: 'New', dueIn: 'Today' },
  { id: '4', char: 'จ', phonetic: 'Jor Jan', type: 'Review', dueIn: 'Today' },
];

export default function HomeScreen() {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const router = useRouter();

  // Stores
  const { currentUser } = useUserStore();
  const { userProgress } = useModuleAccessStore();

  useEffect(() => {
    setTimeout(() => setReviews(MOCK_REVIEWS), 800);
  }, []);

  const handleBubbleClick = () => {
    router.push('/review-modal');
    setTimeout(() => setReviews([]), 500);
  };

  // Helper to determine current course based on progress
  const getCurrentCourse = () => {
    if (!userProgress) {
      return {
        name: t('modules.alphabet'),
        level: t('alphabet.level'),
        progress: 0,
        route: '/learning' as const,
        module: 'letter' as const,
        thaiText: 'กขฃค',
        translation: t('alphabet.description'),
      };
    }

    const { letterProgress, wordProgress, sentenceProgress } = userProgress;

    // 1. Alphabet Phase
    // 后端 letterProgress 为 0-1，这里用 80% 作为阶段切换阈值
    if (letterProgress < 0.8) {
      return {
        name: t('modules.alphabet'),
        level: t('alphabet.level'),
        progress: Math.round(letterProgress * 100),
        route: '/learning' as const,
        module: 'letter' as const,
        thaiText: 'ก ข ฃ ค',
        translation: t('alphabet.description'),
      };
    }

    // 2. Vocabulary Phase
    if (wordProgress < 80) {
      return {
        name: t('modules.word'),
        level: 'Intermediate 1', // TODO: Add to i18n
        progress: wordProgress,
        route: '/learning' as const, // Points to app/learning/index.tsx
        thaiText: 'คำศัพท์',
        translation: 'Expand your vocabulary',
      };
    }

    // 3. Sentence Phase
    if (sentenceProgress < 80) {
      return {
        name: t('modules.sentence'),
        level: 'Intermediate 2',
        progress: sentenceProgress,
        route: '/learning' as const, // Placeholder
        thaiText: 'ประโยค',
        translation: 'Master sentence structures',
      };
    }

    // 4. Article Phase
    return {
      name: t('modules.article'),
      level: 'Advanced',
      progress: userProgress.articleProgress || 0,
      route: '/learning' as const, // Placeholder
      thaiText: 'บทความ',
      translation: 'Read authentic articles',
    };
  };

  const currentCourse = getCurrentCourse();
  const displayName = currentUser?.displayName || 'Student';

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ThaiPatternBackground opacity={0.15} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />

          <View style={styles.headerContent}>
            <View>
              <View style={styles.greetingContainer}>
                <Text style={styles.greetingText}>ສະບາຍດີ, {displayName}</Text>
                <Text style={styles.greetingDot}>.</Text>
              </View>
              <Text style={styles.subtitleText}>
                {t('home.todayProgress')} {currentCourse.progress}%
              </Text>
            </View>

            <View style={styles.awardBadge}>
              {/* 右上角荣誉图标 */}
              <Award size={18} color={Colors.ink} />
            </View>
          </View>
        </View>

        <View style={styles.contentContainer}>
          {/* Floating Bubbles */}
          <FloatingBubbles reviews={reviews} onOpenReview={handleBubbleClick} />

          {/* Hero Progress Card */}
          <View>
            {(() => {
              // 🔒 Lock Check for Hero Card
              const { checkAccessLocally } = useModuleAccessStore.getState();
              const isHeroLocked = currentCourse.module !== 'letter' && !checkAccessLocally(currentCourse.module);

              return (
                <Pressable
                  style={[styles.heroCard, isHeroLocked && { opacity: 0.8, backgroundColor: '#333' }]} // Visual feedback
                  disabled={isHeroLocked}
                  onPress={() => {
                    if (isHeroLocked) return;

                    if (currentCourse.module) {
                      router.push({
                        pathname: currentCourse.route,
                        params: { module: currentCourse.module }
                      });
                    } else {
                      router.push(currentCourse.route);
                    }
                  }}
                >
                  <View style={styles.heroContent}>
                    <View style={styles.heroTopRow}>
                      <View>
                        <Text style={styles.courseLabel}>{t('home.currentCourse')}</Text>
                        <Text style={styles.courseName}>
                          {currentCourse.name} {isHeroLocked ? '(Locked)' : ''}
                        </Text>
                      </View>
                      <View style={styles.levelBadge}>
                        <Text style={styles.levelText}>{currentCourse.level}</Text>
                      </View>
                    </View>

                    <View style={styles.heroBottomRow}>
                      <View style={styles.heroTextContainer}>
                        <Text style={styles.thaiText}>{currentCourse.thaiText}</Text>
                        <Text style={styles.translationText}>{currentCourse.translation}</Text>
                      </View>

                      <View style={[styles.playButtonLarge, isHeroLocked && { backgroundColor: '#666' }]}>
                        <Play size={20} fill={isHeroLocked ? '#999' : Colors.ink} color={isHeroLocked ? '#999' : Colors.ink} />
                      </View>
                    </View>
                  </View>

                  <View style={styles.heroGradient1} />
                  <View style={styles.heroGradient2} />
                </Pressable>
              );
            })()}
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={styles.statTopRow}>
                <View style={styles.statIconContainer}>
                  <TrendingUp size={20} color={Colors.ink} />
                </View>
                <Text style={styles.statLabel}>{t('profile.streakDays')}</Text>
              </View>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statUnit}>{t('home.streak')}</Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statTopRow}>
                <View style={styles.statIconContainer}>
                  <Clock size={20} color={Colors.ink} />
                </View>
                <Text style={styles.statLabel}>{t('profile.studyTime')}</Text>
              </View>
              <Text style={styles.statValue}>4.5</Text>
              <Text style={styles.statUnit}>{t('home.hoursThisWeek')}</Text>
            </View>
          </View>

          {/* Recent Achievements */}
          <View style={styles.achievementsSection}>
            <View style={styles.achievementsHeader}>
              <Star size={16} color={Colors.thaiGold} fill={Colors.thaiGold} />
              <Text style={styles.achievementsTitle}>{t('home.recentMastered')}</Text>
            </View>

            <View style={styles.achievementsList}>
              <AchievementItem
                char="ข"
                name="Khor Khai (蛋)"
                category="高辅音"
              />
              <View style={styles.divider} />
              <AchievementItem
                char="สี"
                name="Sii (颜色)"
                category="上声"
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

interface AchievementItemProps {
  char: string;
  name: string;
  category: string;
}

const AchievementItem: React.FC<AchievementItemProps> = ({ char, name, category }) => (
  <Pressable style={styles.achievementItem}>
    <View style={styles.achievementLeft}>
      <View style={styles.achievementIconBox}>
        <Text style={styles.achievementChar}>{char}</Text>
      </View>
      <View>
        <Text style={styles.achievementName}>{name}</Text>
        <Text style={styles.achievementCategory}>{category}</Text>
      </View>
    </View>
    <View style={styles.masteredBadge}>
      <Text style={styles.masteredText}>已掌握</Text>
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.paper,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 48,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    position: 'relative',
  },
  greetingText: {
    fontFamily: Typography.playfairRegular,
    fontSize: 30,
    letterSpacing: -0.5,
    color: Colors.ink,
  },
  greetingDot: {
    fontFamily: Typography.playfairRegular,
    position: 'absolute',
    right: -12,
    top: -4,
    fontSize: 20,
    color: Colors.thaiGold,
  },
  subtitleText: {
    fontFamily: Typography.notoSerifRegular,
    marginTop: 4,
    fontSize: 14,
    letterSpacing: 0.5,
    color: Colors.taupe,
  },
  awardBadge: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    width: '100%',
    maxWidth: 672,
    alignSelf: 'center',
  },
  heroCard: {
    backgroundColor: Colors.ink,
    padding: 32,
    borderRadius: 32,
    marginBottom: 32,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  heroContent: {
    zIndex: 10,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 48,
  },
  courseLabel: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: Colors.thaiGold,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  courseName: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 20,
    color: Colors.white,
  },
  levelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  levelText: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 10,
    color: Colors.sand,
  },
  heroBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  heroTextContainer: {
    flex: 1,
  },
  thaiText: {
    fontFamily: Typography.sarabunRegular,
    fontSize: 48,
    letterSpacing: 1,
    color: Colors.white,
    marginBottom: 8,
  },
  translationText: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 14,
    fontWeight: '300',
    color: Colors.sand,
    opacity: 0.6,
  },
  playButtonLarge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.thaiGold,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(212, 175, 55, 0.4)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 8,
  },
  heroGradient1: {
    position: 'absolute',
    right: -48,
    top: -48,
    width: 192,
    height: 192,
    borderRadius: 96,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    opacity: 0.5,
  },
  heroGradient2: {
    position: 'absolute',
    left: -40,
    bottom: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(184, 149, 106, 0.2)',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.sand,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  statIconContainer: {
    padding: 8,
    backgroundColor: Colors.paper,
    borderRadius: 12,
  },
  statLabel: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 10,
    letterSpacing: 1.5,
    color: Colors.taupe,
    textTransform: 'uppercase',
  },
  statValue: {
    fontFamily: Typography.playfairRegular,
    fontSize: 36,
    color: Colors.ink,
  },
  statUnit: {
    fontFamily: Typography.notoSerifRegular,
    marginTop: 4,
    fontSize: 12,
    color: Colors.taupe,
  },
  achievementsSection: {
    paddingBottom: 24,
  },
  achievementsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  achievementsTitle: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.ink,
  },
  achievementsList: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.sand,
    padding: 8,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
  },
  achievementLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  achievementIconBox: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.sand,
    backgroundColor: Colors.paper,
  },
  achievementChar: {
    fontFamily: Typography.sarabunRegular,
    fontSize: 20,
    color: Colors.ink,
  },
  achievementName: {
    fontFamily: Typography.playfairRegular,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.ink,
  },
  achievementCategory: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 10,
    letterSpacing: 1,
    color: Colors.taupe,
    textTransform: 'uppercase',
  },
  masteredBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.sand,
    backgroundColor: Colors.paper,
  },
  masteredText: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 12,
    color: 'rgba(26, 26, 26, 0.6)',
  },
  divider: {
    width: '90%',
    height: 1,
    backgroundColor: 'rgba(229, 226, 219, 0.5)',
    alignSelf: 'center',
    marginVertical: 4,
  },
});
