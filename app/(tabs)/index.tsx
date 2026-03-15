// app/(tabs)/index.tsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Play, TrendingUp, Clock, Award, AlertCircle, Wrench, BookOpen } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { ThaiPatternBackground } from '@/src/components/common/ThaiPatternBackground';
// import { FloatingBubbles } from '@/src/components/common/FloatingBubbles';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { ReviewItem } from '@/src/entities/types/entities';
import { useUserStore } from '@/src/stores/userStore';
import { useModuleAccessStore } from '@/src/stores/moduleAccessStore';
import { useVocabularyStore } from '@/src/stores/vocabularyStore';
import { useLearningPreferenceStore } from '@/src/stores/learningPreferenceStore';
import { useTodayStudyTime } from '@/src/hooks/useTodayStudyTime';
import { CourseSelectionModal } from '@/src/components/courses/CourseSelectionModal';
import coursesData from '@/assets/courses/courses.json';
import alphabetCourses from '@/assets/courses/alphabetCourses.json';
import type { ModuleType } from '@/src/stores/moduleAccessStore';
import type { ImageSourcePropType } from 'react-native';
// === AI Dictionary Imports ===
import { TextInput, ActivityIndicator, Modal } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { AiService } from '@/src/services/aiService';
import { AiExplanationView } from '@/src/components/ai/AiExplanationView';
import type { ExplainVocabularyResponse } from '@/src/entities/types/ai.types';
import { Vocabulary } from '@/src/entities/types/vocabulary.types';
import i18n from '@/src/i18n';

const MOCK_REVIEWS: ReviewItem[] = [
  { id: '1', char: 'ข', phonetic: 'Khor Khai', type: 'Review', dueIn: 'Today' },
  { id: '2', char: 'ค', phonetic: 'Khor Khwai', type: 'Hard', dueIn: 'Today' },
  { id: '3', char: 'ง', phonetic: 'Ngor Ngu', type: 'New', dueIn: 'Today' },
  { id: '4', char: 'จ', phonetic: 'Jor Jan', type: 'Review', dueIn: 'Today' },
];

type CourseItem = {
  id: string;
  source: string;
  title: string;
  description: string;
  level: string;
  image: string;
  category: string;
  lessons: number;
};

type CourseWithImage = CourseItem & { imageSource: ImageSourcePropType };

const COURSE_IMAGE_MAP: Record<string, ImageSourcePropType> = {
  'ThaiBase_1.png': require('@/assets/images/courses/ThaiBase_1.png'),
  'ThaiBase_2.png': require('@/assets/images/courses/ThaiBase_2.png'),
  'ThaiBase_3.png': require('@/assets/images/courses/ThaiBase_3.png'),
  'ThaiBase_4.png': require('@/assets/images/courses/ThaiBase_4.png'),
  'thai_alphabet.png': require('@/assets/images/courses/thai_alphabet.png'),
  default: require('@/assets/images/courses/ThaiBase_1.png'),
};

const COURSES: CourseWithImage[] = [
  ...(alphabetCourses as CourseItem[]),
  ...(coursesData as CourseItem[]),
].map((c) => ({ ...c, imageSource: COURSE_IMAGE_MAP[c.image] || COURSE_IMAGE_MAP.default }));

function getModuleType(course: CourseWithImage): ModuleType {
  switch (course.category) {
    case 'letter': return 'letter';
    case 'sentence': return 'sentence';
    case 'article': return 'article';
    default: return 'word';
  }
}

export default function HomeScreen({ vocabulary }: { vocabulary: Vocabulary }) {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const router = useRouter();

  // Stores
  const { currentUser } = useUserStore();
  const { currentCourseSource, startCourse } = useVocabularyStore();
  const recentWrongWords = useVocabularyStore(s => s.recentWrongWords);
  const { streakDays, checkIn, hasCheckedInToday } = useLearningPreferenceStore();
  const { value: studyTimeValue, unit: studyTimeUnit } = useTodayStudyTime();

  // 英雄卡：切换课程确认弹窗
  const [modalVisible, setModalVisible] = useState(false);
  const [pendingCourse, setPendingCourse] = useState<CourseWithImage | null>(null);
  
  //=========================================================================
  // === AI Dictionary State ===
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<ExplainVocabularyResponse | null>(null);
  const [showAiModal, setShowAiModal] = useState(false);

  // === AI Dictionary Action ===
  const handleAiSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setSearchError(null);
    setShowAiModal(true); // Open modal early to show loading state
    
    // 将当前 UI 语言一并传给 AI，让它用对应语言回应
    const response = await AiService.explainVocabulary(searchQuery.trim(), currentUser?.userId || 'guest', i18n.language);
    
    setIsSearching(false);

    if (!response.success || !response.data) {
      setSearchError(response.error || t('home.aiError'));
      return;
    }

    // Now we can set the much cleaner response directly!
    setAiResult(response.data);
  };

  const closeAiModal = () => {
    setShowAiModal(false);
    setAiResult(null);
    setSearchError(null);
    setSearchQuery('');
  };
  //=========================================================================

  useEffect(() => {
    setTimeout(() => setReviews(MOCK_REVIEWS), 800);
  }, []);

  const handleBubbleClick = () => {
    router.push('/review-modal');
    setTimeout(() => setReviews([]), 500);
  };

  // 英雄卡：根据 currentCourseSource 获取当前课程，无则默认第一个（字母课）
  const heroCourse = COURSES.find((c) => c.source === currentCourseSource) ?? COURSES[0];
  const isHeroCurrent = currentCourseSource === heroCourse.source;

  // 英雄卡：与 courses 页一致的 Start/Continue 逻辑
  const handleHeroStartLearning = (course: CourseWithImage) => {
    const moduleType = getModuleType(course);
    const { checkAccessLocally, accessCache: cachedAccess } = useModuleAccessStore.getState();
    const devOverrideUnlocked = __DEV__ && cachedAccess.get(moduleType) === true;
    const isLocked = moduleType !== 'letter' && !devOverrideUnlocked && !checkAccessLocally(moduleType);
    if (isLocked) return;

    // 当前课或尚未选课：直接跳转
    if (!currentCourseSource || currentCourseSource === course.source) {
      if (moduleType === 'letter') {
        router.push('/alphabet');
      } else {
        router.push({
          pathname: '/learning',
          params: { module: moduleType, source: course.source },
        });
      }
      return;
    }

    // 切换课程：弹确认框
    setPendingCourse(course);
    setModalVisible(true);
  };

  const confirmSwitchCourse = async () => {
    if (!pendingCourse) return;
    const moduleType = getModuleType(pendingCourse);
    setModalVisible(false);
    setPendingCourse(null);
    if (moduleType === 'letter') {
      router.push('/alphabet');
      startCourse(pendingCourse.source, 200, 'letter');
    } else {
      router.push({
        pathname: '/learning',
        params: { module: moduleType, source: pendingCourse.source },
      });
    }
  };

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
            </View>

            <View style={styles.awardBadge}>
              {/* 右上角荣誉图标 */}
              <Award size={18} color={Colors.ink} />
            </View>
          </View>
        </View>

        <View style={styles.contentContainer}>
          
          {/* AI Dictionary Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchInputWrapper}>
              <Search size={20} color={Colors.taupe} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder={t('home.typeThaiOrChinese') || "搜你遇见的纯正泰语..."}
                placeholderTextColor={Colors.taupe}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleAiSearch}
                returnKeyType="search"
                editable={!isSearching}
              />
              {searchQuery.length > 0 && !isSearching && (
                <Pressable onPress={() => setSearchQuery('')} style={styles.clearSearchButton}>
                  <X size={16} color={Colors.taupe} />
                </Pressable>
              )}
            </View>
          </View>
          {/* ========================================= */}

          {/* Floating Bubbles */}
          {/* <FloatingBubbles reviews={reviews} onOpenReview={handleBubbleClick} /> */}

          {/* Hero Progress Card：根据 currentCourseSource 显示课程，与 courses 页一致的 Start/Continue 逻辑 */}
          <View>
            {(() => {
              const moduleType = getModuleType(heroCourse);
              const { checkAccessLocally } = useModuleAccessStore.getState();
              const isHeroLocked = moduleType !== 'letter' && !checkAccessLocally(moduleType);

              return (
                <Pressable
                  style={[styles.heroCard, isHeroLocked && { opacity: 0.8, backgroundColor: '#333' }]}
                  disabled={isHeroLocked}
                  onPress={() => handleHeroStartLearning(heroCourse)}
                >
                  <View style={styles.heroContent}>
                    <View style={styles.heroTopRow}>
                      <View>
                        <Text style={styles.courseLabel}>{t('home.currentCourse')}</Text>
                        <Text style={styles.courseName}>
                          {t(heroCourse.title)} {isHeroLocked ? '(Locked)' : ''}
                        </Text>
                      </View>
                      <View style={styles.levelBadge}>
                        <Text style={styles.levelText}>{t(heroCourse.level)}</Text>
                      </View>
                    </View>

                    <View style={styles.heroBottomRow}>
                      <View style={styles.heroTextContainer}>
                        {heroCourse.category !== 'letter' && (
                          <Text style={styles.heroProgressText}>
                            {heroCourse.lessons} {t('courses.lessons')}
                          </Text>
                        )}
                        <Text style={styles.translationText} numberOfLines={2}>
                          {t(heroCourse.description)}
                        </Text>
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

          <CourseSelectionModal
            visible={modalVisible}
            courseTitle={pendingCourse ? t(pendingCourse.title) : ''}
            onConfirm={confirmSwitchCourse}
            onCancel={() => {
              setModalVisible(false);
              setPendingCourse(null);
            }}
          />

          {/* Reading Practice Entry */}
          <Pressable
            style={styles.readingPracticeButton}
            onPress={() => router.push('/learning/article-practice-list')}
          >
            <View style={styles.readingPracticeLeft}>
              <View style={styles.readingPracticeIcon}>
                <BookOpen size={18} color={Colors.thaiGold} />
              </View>
              <View>
                <Text style={styles.readingPracticeTitle}>{t('articlePractice.listTitle')}</Text>
                <Text style={styles.readingPracticeHint}>{t('articlePractice.tapWordHint')}</Text>
              </View>
            </View>
            <Play size={16} fill={Colors.taupe} color={Colors.taupe} />
          </Pressable>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <Pressable
              style={[styles.statCard, !hasCheckedInToday() && styles.statCardCheckedIn]}
              onPress={() => {
                if (hasCheckedInToday()) return;
                const success = checkIn();
                if (success) {
                  // 可选：轻触反馈
                }
              }}
              disabled={hasCheckedInToday()}
            >
              <View style={styles.statTopRow}>
                <View style={styles.statIconContainer}>
                  <TrendingUp size={20} color={!hasCheckedInToday() ? Colors.taupe : Colors.ink} />
                </View>
                <Text style={styles.statLabel}>
                  {hasCheckedInToday() ? t('home.checkInToday') : t('profile.streakDays')}
                </Text>
              </View>
              <Text style={styles.statValue}>{streakDays ?? 0}</Text>
              <Text style={styles.statUnit}>{t('home.streak')}</Text>
            </Pressable>

            <View style={styles.statCard}>
              <View style={styles.statTopRow}>
                <View style={styles.statIconContainer}>
                  <Clock size={20} color={Colors.ink} />
                </View>
                <Text style={styles.statLabel}>{t('profile.studyTime')}</Text>
              </View>
              <Text style={styles.statValue}>{studyTimeValue}</Text>
              <Text style={styles.statUnit}>{studyTimeUnit === 'hrs' ? t('home.hoursToday') : t('home.minutesToday')}</Text>
            </View>
          </View>

          {/* Recent Wrong Words */}
          <View style={styles.achievementsSection}>
            <View style={styles.achievementsHeader}>
              <AlertCircle size={16} color={Colors.thaiGold} />
              <Text style={styles.achievementsTitle}>{t('home.recentWrong')}</Text>
            </View>

            <View style={styles.achievementsList}>
              {recentWrongWords.length === 0 ? (
                <Text style={styles.emptyHint}>{t('home.noWrongWords')}</Text>
              ) : (
                recentWrongWords.map((w, i) => (
                  <View key={w.id}>
                    {i > 0 && <View style={styles.divider} />}
                    <AchievementItem
                      char={w.entity.thaiWord}
                      meaning={w.entity.meaning}
                      category={`×${w.mistakeCount}`}
                    />
                  </View>
                ))
              )}
            </View>
          </View>
          {/* Dev Playground Entry - Only visible in DEV */}
          {__DEV__ && (
            <Pressable
              style={{
                marginTop: 20,
                padding: 12,
                backgroundColor: Colors.ink,
                borderRadius: 16,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 8,
              }}
              onPress={() => router.push('/(dev)/playground')}
            >
              <Wrench size={16} color={Colors.thaiGold} />
              <Text style={{ color: Colors.white, fontFamily: Typography.notoSerifBold, fontSize: 12 }}>
                Open Dev Playground
              </Text>
            </Pressable>
          )}
        </View>
      </ScrollView>

      {/* AI Search Result Modal */}
      <Modal
        visible={showAiModal}
        transparent={true}
        animationType="slide"
        onRequestClose={closeAiModal}
      >
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                   <Text style={styles.modalTitle}>{t('ai.title')}</Text>
                   <Pressable onPress={closeAiModal} style={styles.closeModalBtn}>
                       <X size={24} color={Colors.ink} />
                   </Pressable>
                </View>

                {isSearching ? (
                   <View style={styles.modalLoadingState}>
                      <ActivityIndicator size="large" color={Colors.thaiGold} />
                      <Text style={styles.modalLoadingText}>{t('common.loading')}</Text>
                   </View>
                ) : searchError ? (
                   <View style={styles.modalErrorState}>
                      <Text style={styles.modalErrorText}>{searchError}</Text>
                      <Pressable style={styles.retryBtn} onPress={handleAiSearch}>
                         <Text style={styles.retryBtnText}>{t('common.confirm')}</Text>
                      </Pressable>
                   </View>
                ) : aiResult ? (
                   <View style={styles.aiResultWrapper}>
                       <AiExplanationView data={aiResult} />
                   </View>
                ) : null}
            </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

interface AchievementItemProps {
  char: string;
  meaning: string;
  category: string;
}

const AchievementItem: React.FC<AchievementItemProps> = ({ char, meaning, category }) => (
  <Pressable style={styles.achievementItem}>
    <View style={styles.achievementLeft}>
      <View style={styles.achievementIconBox}>
        <Text style={styles.achievementChar}>{char}</Text>
      </View>
      <View>
        <Text style={styles.achievementName}>{meaning}</Text>
      </View>
    </View>
    <View style={styles.masteredBadge}>
      <Text style={styles.masteredText}>{category}</Text>
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
  heroProgressText: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 18,
    color: Colors.white,
    marginBottom: 6,
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
  readingPracticeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.sand,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  readingPracticeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  readingPracticeIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  readingPracticeTitle: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 14,
    color: Colors.ink,
  },
  readingPracticeHint: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 11,
    color: Colors.taupe,
    marginTop: 2,
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
  statCardCheckedIn: {
    opacity: 0.85,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    backgroundColor: 'rgba(212, 175, 55, 0.06)',
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
  emptyHint: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 13,
    color: Colors.ink,
    opacity: 0.5,
    textAlign: 'center',
    paddingVertical: 16,
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
  // AI Dictionary Styles
  searchContainer: {
    marginBottom: 24,
    marginTop: -8, // Pull slightly up towards header
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.sand,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    height: 56,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontFamily: Typography.notoSerifRegular,
    fontSize: 16,
    color: Colors.ink,
    height: '100%',
  },
  clearSearchButton: {
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.paper,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '85%',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.sand,
  },
  modalTitle: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 18,
    color: Colors.ink,
  },
  closeModalBtn: {
    padding: 4,
  },
  modalLoadingState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  modalLoadingText: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 14,
    color: Colors.taupe,
  },
  modalErrorState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  modalErrorText: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 16,
    color: '#D32F2F',
    textAlign: 'center',
  },
  retryBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: Colors.ink,
    borderRadius: 12,
  },
  retryBtnText: {
    color: Colors.white,
    fontFamily: Typography.notoSerifBold,
    fontSize: 16,
  },
  aiResultWrapper: {
    flex: 1,
    paddingTop: 16,
  }
});
