// app/(tabs)/index.tsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Play, TrendingUp, Clock, Award, AlertCircle, Wrench } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { ThaiPatternBackground } from '@/src/components/common/ThaiPatternBackground';
// import { FloatingBubbles } from '@/src/components/common/FloatingBubbles';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { ReviewItem } from '@/src/entities/types/entities';
import { useUserStore } from '@/src/stores/userStore';
import { useModuleAccessStore } from '@/src/stores/moduleAccessStore';
import { useVocabularyStore } from '@/src/stores/vocabularyStore';
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

export default function HomeScreen({ vocabulary }: { vocabulary: Vocabulary }) {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const router = useRouter();

  // Stores
  const { currentUser } = useUserStore();
  const { userProgress } = useModuleAccessStore();
  const recentWrongWords = useVocabularyStore(s => s.recentWrongWords);
  
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
        module: 'word' as const,
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
        module: 'sentence' as const,
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
      module: 'article' as const,
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

                    router.push({
                      pathname: currentCourse.route,
                      params: { module: currentCourse.module }
                    });
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
