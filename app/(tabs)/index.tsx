// app/(tabs)/index.tsx
import React, { useState, useEffect } from 'react';
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

const MOCK_REVIEWS: ReviewItem[] = [
  { id: '1', char: 'ข', phonetic: 'Khor Khai', type: 'Review', dueIn: 'Today' },
  { id: '2', char: 'ค', phonetic: 'Khor Khwai', type: 'Hard', dueIn: 'Today' },
  { id: '3', char: 'ง', phonetic: 'Ngor Ngu', type: 'New', dueIn: 'Today' },
  { id: '4', char: 'จ', phonetic: 'Jor Jan', type: 'Review', dueIn: 'Today' },
];

export default function HomeScreen() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => setReviews(MOCK_REVIEWS), 800);
  }, []);

  const handleBubbleClick = () => {
    router.push('/review-modal');
    setTimeout(() => setReviews([]), 500);
  };

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
                <Text style={styles.greetingText}>ສະບາຍດີ, Liang.</Text>
                <Text style={styles.greetingDot}>.</Text>
              </View>
              <Text style={styles.subtitleText}>今日学习目标已完成 85%</Text>
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
            <Pressable style={styles.heroCard}>
              <View style={styles.heroContent}>
                <View style={styles.heroTopRow}>
                  <View>
                    <Text style={styles.courseLabel}>当前课程</Text>
                    <Text style={styles.courseName}>点餐用语</Text>
                  </View>
                  <View style={styles.levelBadge}>
                    <Text style={styles.levelText}>中级 1</Text>
                  </View>
                </View>

                <View style={styles.heroBottomRow}>
                  <View style={styles.heroTextContainer}>
                    <Text style={styles.thaiText}>ชานมไข่มุก</Text>
                    <Text style={styles.translationText}>"我想要一杯珍珠奶茶"</Text>
                  </View>
                  
                  <View style={styles.playButtonLarge}>
                    <Play size={20} fill={Colors.ink} color={Colors.ink} />
                  </View>
                </View>
              </View>

              <View style={styles.heroGradient1} />
              <View style={styles.heroGradient2} />
            </Pressable>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={styles.statTopRow}>
                <View style={styles.statIconContainer}>
                  <TrendingUp size={20} color={Colors.ink} />
                </View>
                <Text style={styles.statLabel}>坚持天数</Text>
              </View>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statUnit}>连续打卡</Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statTopRow}>
                <View style={styles.statIconContainer}>
                  <Clock size={20} color={Colors.ink} />
                </View>
                <Text style={styles.statLabel}>学习时长</Text>
              </View>
              <Text style={styles.statValue}>4.5</Text>
              <Text style={styles.statUnit}>本周小时数</Text>
            </View>
          </View>

          {/* Recent Achievements */}
          <View style={styles.achievementsSection}>
            <View style={styles.achievementsHeader}>
              <Star size={16} color={Colors.thaiGold} fill={Colors.thaiGold} />
              <Text style={styles.achievementsTitle}>最近掌握</Text>
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