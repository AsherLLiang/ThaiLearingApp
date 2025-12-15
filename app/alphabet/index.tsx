// app/alphabet/index.tsx
// 字母课程总览页（课程入口 → Lesson 1~5）

import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Modal,
  Animated,
  Dimensions,
  TouchableWithoutFeedback
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, X, BookOpen, ChevronRight } from 'lucide-react-native';

import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';

import { ThaiPatternBackground } from '@/src/components/common/ThaiPatternBackground';
import { getAllLessons } from '@/src/config/alphabet/lessonMetadata.config';
import type { LessonMetadata } from '@/src/entities/types/phonicsRule.types';
import { callCloudFunction } from '@/src/utils/apiClient';
import { API_ENDPOINTS } from '@/src/config/api.endpoints';
import { useModuleAccessStore } from '@/src/stores/moduleAccessStore';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface LessonCardProps {
  id: string;
  title: string;
  description: string;
  letterKeys: string[];
  lessonData: LessonMetadata; // Store full metadata for drawer
  isCurrent: boolean;
  progress?: {
    completed: number;
    total: number;
  };
}

// --- Drawer Component ---

interface LessonDrawerProps {
  visible: boolean;
  lesson: LessonCardProps | null;
  onClose: () => void;
  onStart: () => void;
  unlocked: boolean;
}

const LessonDrawer = ({ visible, lesson, onClose, onStart, unlocked }: LessonDrawerProps) => {
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideAnim, fadeAnim]);

  if (!lesson) return null;

  const { lessonData } = lesson;
  const allLetters = [
    ...lessonData.consonants,
    ...lessonData.vowels,
    ...lessonData.tones
  ];

  return (
    <Modal transparent visible={visible} onRequestClose={onClose}>
      <View style={drawerStyles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View style={[drawerStyles.backdrop, { opacity: fadeAnim }]} />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[
            drawerStyles.sheet,
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          <View style={drawerStyles.handle} />

          {/* Header */}
          <View style={drawerStyles.header}>
            <View style={{ flex: 1 }}>
              <Text style={drawerStyles.title}>{lesson.title}</Text>
              <Text style={drawerStyles.subtitle}>Expected time: 15 mins</Text>
            </View>
            <Pressable onPress={onClose} style={drawerStyles.closeButton}>
              <X size={24} color={Colors.taupe} />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={drawerStyles.content}>
            <Text style={drawerStyles.sectionTitle}>Description</Text>
            <Text style={drawerStyles.description}>{lesson.description}</Text>

            <Text style={drawerStyles.sectionTitle}>Content Preview ({allLetters.length} items)</Text>
            <View style={drawerStyles.grid}>
              {allLetters.map((char, index) => (
                <View key={index} style={drawerStyles.gridItem}>
                  <Text style={drawerStyles.gridChar}>{char}</Text>
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Footer Action */}
          <View style={drawerStyles.footer}>
            <Pressable
              style={[drawerStyles.startButton, !unlocked && drawerStyles.disabledBtn]}
              onPress={onStart}
              disabled={!unlocked}
            >
              <Text style={drawerStyles.startButtonText}>
                {unlocked ? 'Start Learning' : 'Locked'}
              </Text>
              {unlocked && <ChevronRight size={20} color={Colors.white} />}
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

// --- Main Screen ---

export default function AlphabetCoursesScreen() {
  const router = useRouter();

  const [lessons, setLessons] = useState<LessonCardProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Drawer State
  const [selectedLesson, setSelectedLesson] = useState<LessonCardProps | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  // 🔥 TODO-07: 使用 moduleAccessStore 读取已完成课程列表
  const { userProgress, getUserProgress } = useModuleAccessStore();
  const completedLessons = userProgress?.completedAlphabetLessons ?? [];

  // 🔥 TODO-07: 确保进入页面时加载用户进度
  useEffect(() => {
    getUserProgress();
  }, [getUserProgress]);

  useEffect(() => {
    let mounted = true;

    const mapLessons = (list: LessonMetadata[]): LessonCardProps[] =>
      list.map((lesson) => {
        const letterKeys = [
          ...lesson.consonants,
          ...lesson.vowels,
          ...lesson.tones,
        ];

        return {
          id: lesson.lessonId,
          title: lesson.title,
          description: lesson.description,
          letterKeys,
          lessonData: lesson,
          isCurrent: false,
          progress: {
            completed: 0,
            total: lesson.totalCount,
          },
        };
      });

    (async () => {
      try {
        const res = await callCloudFunction<{ lessons: LessonMetadata[] }>(
          'getAlphabetLessons',
          {},
          {
            endpoint: API_ENDPOINTS.MEMORY.GET_TODAY_MEMORIES.cloudbase,
          },
        );

        const list: LessonMetadata[] =
          (res.success && res.data?.lessons) || getAllLessons();

        if (!mounted) return;
        setLessons(mapLessons(list));
      } catch {
        if (!mounted) return;
        setLessons(mapLessons(getAllLessons()));
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // 🔥 TODO-07: 进度百分比基于已完成课程数,而非字母数
  const totalLessons = lessons.length;
  const overallProgressPercent =
    totalLessons > 0
      ? Math.min(100, Math.round((completedLessons.length / totalLessons) * 100))
      : 0;

  const handleCardPress = (lesson: LessonCardProps) => {
    setSelectedLesson(lesson);
    setDrawerVisible(true);
  };

  const handleStartLesson = (lessonId: string) => {
    setDrawerVisible(false);
    router.push(`/alphabet/${lessonId}`);
  };

  // 🔥 TODO-07: 课程解锁逻辑只依赖 completedAlphabetLessons
  // 规则: lesson1 永远解锁, lessonN 需要 lesson(N-1) 已完成
  const isLessonUnlocked = useCallback((lessonIndex: number): boolean => {
    if (lessonIndex === 0) return true; // lesson1 永远解锁
    const prevLessonId = lessons[lessonIndex - 1]?.id;
    return prevLessonId ? completedLessons.includes(prevLessonId) : false;
  }, [lessons, completedLessons]);

  // Helper to check unlocked status for modal
  const isSelectedUnlocked = useMemo(() => {
    if (!selectedLesson) return false;
    const index = lessons.findIndex(l => l.id === selectedLesson.id);
    if (index === -1) return false;
    return isLessonUnlocked(index);
  }, [selectedLesson, lessons, isLessonUnlocked]);


  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>

      <View style={styles.backRow}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.taupe} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
      </View>

      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Alphabet Course</Text>
        <Text style={styles.headerSubtitle}>
          {lessons.length} Lessons · {overallProgressPercent}% Completed
        </Text>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={Colors.thaiGold} />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <ScrollView style={styles.scroll} contentContainerStyle={styles.inner}>
            <ThaiPatternBackground opacity={0.12} />

            {lessons.map((lesson, index) => {
              // 🔥 TODO-07: 解锁逻辑统一为 completedAlphabetLessons
              const unlocked = isLessonUnlocked(index);

              // 🔥 TODO-07: "当前课程" = 第一个已解锁但未完成的课程
              const isCompleted = completedLessons.includes(lesson.id);
              const isCurrent = unlocked && !isCompleted;

              return (
                <Pressable
                  key={lesson.id}
                  style={[styles.card, isCurrent && styles.activeCard]}
                  onPress={() => handleCardPress(lesson)}
                >
                  <View style={styles.cardPressable}>
                    <View style={styles.info}>
                      <View style={styles.cardHeader}>
                        <Text style={styles.title} numberOfLines={1}>
                          {lesson.title}
                        </Text>
                        {isCurrent && (
                          <View style={styles.currentBadge}>
                            <Text style={styles.currentBadgeText}>Current</Text>
                          </View>
                        )}
                      </View>

                      <Text style={styles.description} numberOfLines={2}>
                        {lesson.description}
                      </Text>

                      <View style={styles.footer}>
                        <View style={styles.metaColumn}>
                          <Text style={styles.lessonMeta}>
                            {lesson.letterKeys.length} letters
                          </Text>
                        </View>

                        {/* Start Learning Button - Direct Access */}
                        <Pressable
                          disabled={!unlocked}
                          style={[
                            styles.startBtn,
                            isCurrent && styles.activeStartBtn,
                            !unlocked && styles.disabledStartBtn,
                          ]}
                          // Stop propagation to prevent opening drawer when clicking Start directly
                          onPress={(e) => {
                            e.stopPropagation();
                            router.push(`/alphabet/${lesson.id}`);
                          }}
                        >
                          <Text
                            style={[
                              styles.startBtnText,
                              isCurrent && styles.activeStartBtnText,
                            ]}
                          >
                            {unlocked ? 'Start' : 'Locked'}
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                </Pressable>
              );
            })}

            <View style={{ height: 100 }} />
          </ScrollView>

          {/* Fixed Footer for Test Entry */}
          <View style={styles.footerContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.unlockAllBtn,
                pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }
              ]}
              onPress={() => router.push('/alphabet/test')}
            >
              <Text style={styles.unlockAllText}>
                Take Test to Unlock All
              </Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Detail Drawer */}
      <LessonDrawer
        visible={drawerVisible}
        lesson={selectedLesson}
        unlocked={isSelectedUnlocked}
        onClose={() => setDrawerVisible(false)}
        onStart={() => selectedLesson && handleStartLesson(selectedLesson.id)}
      />

    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.paper,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 8,
  },
  scroll: {
    flex: 1,
  },
  inner: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 16,
    paddingBottom: 48,
  },
  backRow: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'flex-start',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
  },
  backText: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 16,
    color: Colors.taupe,
    marginLeft: 4,
  },
  headerTitle: {
    fontFamily: Typography.playfairBold,
    fontSize: 28,
    color: Colors.ink,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 14,
    color: Colors.taupe,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    minHeight: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  activeCard: {
    borderColor: Colors.thaiGold,
    borderWidth: 1.5,
    backgroundColor: '#FFFCF5',
  },
  cardPressable: {
    flex: 1,
    flexDirection: 'row',
  },
  info: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
    gap: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    flex: 1,
    fontFamily: Typography.notoSerifBold,
    fontSize: 16,
    color: Colors.ink,
  },
  currentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderRadius: 4,
  },
  currentBadgeText: {
    fontSize: 10,
    color: Colors.thaiGold,
    fontFamily: Typography.notoSerifBold,
    textTransform: 'uppercase',
  },
  description: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 13,
    color: Colors.taupe,
    lineHeight: 18,
  },
  lessonMeta: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 12,
    color: Colors.taupe,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  metaColumn: {
    flex: 1,
  },
  startBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.ink,
    borderRadius: 20,
  },
  activeStartBtn: {
    backgroundColor: Colors.thaiGold,
  },
  startBtnText: {
    fontSize: 12,
    color: Colors.white,
    fontFamily: Typography.notoSerifBold,
  },
  activeStartBtnText: {
    color: Colors.white,
  },
  disabledStartBtn: {
    backgroundColor: '#E0E0E0',
  },
  // Footer Button Styles
  footerContainer: {
    padding: 24,
    paddingBottom: 34, // Extra padding for safe area
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.sand,
  },
  unlockAllBtn: {
    width: '100%',
    backgroundColor: Colors.ink,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  unlockAllText: {
    fontFamily: Typography.playfairBold,
    fontSize: 16,
    color: Colors.white,
    letterSpacing: 0.5,
  },
});

const drawerStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
  },
  sheet: {
    backgroundColor: Colors.paper,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    minHeight: '50%',
    paddingBottom: 34,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    fontFamily: Typography.playfairBold,
    fontSize: 24,
    color: Colors.ink,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 14,
    color: Colors.taupe,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 24,
  },
  sectionTitle: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 16,
    color: Colors.ink,
    marginBottom: 12,
    marginTop: 8,
  },
  description: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 15,
    color: Colors.taupe,
    lineHeight: 22,
    marginBottom: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridItem: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  gridChar: {
    fontFamily: Typography.playfairBold,
    fontSize: 20,
    color: Colors.ink,
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  startButton: {
    backgroundColor: Colors.thaiGold,
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: Colors.thaiGold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  startButtonText: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 18,
    color: Colors.white,
  },
  disabledBtn: {
    backgroundColor: '#E0E0E0',
    shadowOpacity: 0,
  }
});
