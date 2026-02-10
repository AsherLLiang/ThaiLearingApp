// app/(tabs)/courses.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, TextInput, ImageSourcePropType, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, BookOpen, Type, Grid } from 'lucide-react-native';
import { ThaiPatternBackground } from '@/src/components/common/ThaiPatternBackground';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { useTranslation } from 'react-i18next';
import { useVocabularyStore } from '@/src/stores/vocabularyStore';
import { CourseSelectionModal } from '@/src/components/courses/CourseSelectionModal';
import coursesData from '@/assets/courses/courses.json';
import alphabetCourses from '@/assets/courses/alphabetCourses.json';
import { CourseCard, type CourseCardData } from '@/src/components/courses/CourseCard';
import { AlphabetCourseCard } from '@/src/components/courses/AlphabetCourseCard';
import { useLearningPreferenceStore } from '@/src/stores/learningPreferenceStore';
import { useModuleAccessStore, type ModuleType } from '@/src/stores/moduleAccessStore';

const CATEGORIES = [
  { id: 'all', label: 'common.all', icon: Grid },
  { id: 'letter', label: 'modules.alphabet', icon: Type },
  { id: 'word', label: 'modules.word', icon: BookOpen },
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

type CourseWithImage = CourseItem & {
  imageSource: ImageSourcePropType;
};

const COURSE_IMAGE_MAP: Record<string, ImageSourcePropType> = {
  'ThaiBase_1.png': require('@/assets/images/courses/ThaiBase_1.png'),
  'ThaiBase_2.png': require('@/assets/images/courses/ThaiBase_2.png'),
  'ThaiBase_3.png': require('@/assets/images/courses/ThaiBase_3.png'),
  'ThaiBase_4.png': require('@/assets/images/courses/ThaiBase_4.png'),
  'thai_alphabet.png': require('@/assets/images/courses/thai_alphabet.png'),
  default: require('@/assets/images/courses/ThaiBase_1.png'),
};

// 包含字母课程和单词课程
const COURSES: CourseWithImage[] = (
  [
    ...(alphabetCourses as CourseItem[]),
    ...(coursesData as CourseItem[]),
  ]
).map((course) => ({
  ...course,
  imageSource: COURSE_IMAGE_MAP[course.image] || COURSE_IMAGE_MAP.default,
}));

export default function CoursesScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { currentCourseSource, startCourse } = useVocabularyStore();
  const { userProgress, getUserProgress, checkAccess, accessCache } = useModuleAccessStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [pendingCourse, setPendingCourse] = useState<CourseWithImage | null>(null);
  const didDevAccessCheckRef = useRef(false);

  useEffect(() => {
    //页面一加载，如果发现没有 userProgress，就赶紧去后端拉取。这是为了让课程卡片能显示 "12/50" 这样的进度条。
    if (!userProgress) {
      getUserProgress().catch((err) => console.warn('Failed to fetch user progress', err));
    }
  }, [userProgress, getUserProgress]);

  useEffect(() => {
    //这是一个只在开发模式 (__DEV__) 跑的逻辑。它会遍历所有模块自动检查一遍权限。这是为了方便开发者调试解锁逻辑，生产环境不会运行。
    if (!__DEV__) return;
    if (didDevAccessCheckRef.current) return;
    didDevAccessCheckRef.current = true;

    const uniqueModules = Array.from(new Set(COURSES.map(getModuleType)))
      .filter((moduleType) => moduleType !== 'letter');

    uniqueModules.forEach((moduleType) => {
      checkAccess(moduleType).catch((error) => {
        console.warn('⚠️ Dev module access check failed:', moduleType, error);
      });
    });
  }, [checkAccess]);

  const getModuleType = (course: CourseWithImage): ModuleType => {
    switch (course.category) {
      case 'letter':
        return 'letter';
      case 'sentence':
        return 'sentence';
      case 'article':
        return 'article';
      default:
        return 'word';
    }
  };

  const getCourseProgress = (course: CourseWithImage) => {
    if (!userProgress) return undefined;
    const moduleType = getModuleType(course);
    if (moduleType === 'letter') {
      return {
        completed: userProgress.letterMasteredCount,
        total: userProgress.letterTotalCount || course.lessons,
      };
    }
    if (moduleType === 'word') {
      return {
        completed: userProgress.wordMasteredCount,
        total: userProgress.wordTotalCount || course.lessons,
      };
    }
    return undefined;
  };

  // ⭐ 过滤课程
  const filteredCourses = useMemo(() => {
    return COURSES.filter(course => {
      const matchesCategory = activeCategory === 'all' || course.category === activeCategory;
      const translatedTitle = t(course.title);
      const translatedDescription = t(course.description);
      const matchesSearch =
        translatedTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        translatedDescription.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, t]);



  // ⭐ 统一的 Start Learning 逻辑：接收 course，返回一个点击 handler
  /**
   * 说明：当用户点击课程卡片时触发
   * 逻辑流:
   * 1. 查锁: 先看这个课是不是锁住的 (isLocked)。如果锁了，直接拦截。
   * 2. 判重: 检查用户点的是不是当前正在学的课。
   *   - 是当前课: 直接跳转。但在跳转前，会检查 needsDailySetup。如果没设过每日计划，先跳到 setup 页；否则直接跳 learning 页。(注意：这里就是刚才那个 Bug 发生的地方，传参传错了)
   *   - 是新课: 不直接跳，而是唤起弹窗 (setModalVisible(true))，问用户“确定要切换课程吗？”。
   * @param course 
   * @returns 
   */
  const handleStartLearning = (course: CourseWithImage) => {
    return () => {
      // ⭐ 1. 查锁
      const moduleType = getModuleType(course);
      // 🔒 Double Check: UI Should be disabled, but logic must be safe
      const { checkAccessLocally, accessCache: cachedAccess } = useModuleAccessStore.getState();
      const devOverrideUnlocked = __DEV__ && cachedAccess.get(moduleType) === true;
      const isLocked = moduleType !== 'letter' && !devOverrideUnlocked && !checkAccessLocally(moduleType);
      if (isLocked) {
        console.warn('Course locked, double-check start prevented');
        return;
      }

      // ⭐ 2. 判重
      // ⭐ 3. 同一个课程：直接跳转
      if (currentCourseSource === course.source) {
        if (moduleType === 'letter') {
          router.push('/alphabet');
        } else {
          router.push({
            pathname: '/learning',
            params: {
              module: moduleType,
              source: course.source,
            },
          });
        }
        return;
      }

      // ⭐ 4. 是新课，切换课程：弹确认框
      setPendingCourse(course);
      setModalVisible(true);
    };
  };

  const confirmSwitchCourse = async () => {
    if (pendingCourse) {
      // ✅ 切换课程：直接跳转，让 learning 页面负责初始化
      const moduleType = getModuleType(pendingCourse);

      setModalVisible(false);
      setPendingCourse(null);

      // Notify store about course switch (even for letters to show golden box)


      // Special routing for Alphabet
      if (moduleType === 'letter') {
        router.push('/alphabet');
        startCourse(pendingCourse.source, 200, 'letter');
      } else {
        router.push({
          pathname: '/learning',
          params: {
            module: moduleType,
            source: pendingCourse.source,
          },
        });
      }
    }
  };

  // Clean up unused proceedToCourse if no longer needed, or redefine it as above. 
  // But strictly following the plan to modify handleStartLearning first.
  // Actually, confirmSwitchCourse calls proceedToCourse. Let's make confirmSwitchCourse do the work directly 
  // or update proceedToCourse.
  // Let's remove proceedToCourse and inline the logic into confirmSwitchCourse for simplicity as per "pure navigator" goal.



  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ThaiPatternBackground opacity={0.12} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('courses.title')}</Text>
        <Text style={styles.headerSubtitle}>{t('courses.subtitle')}</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={Colors.taupe} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('courses.searchPlaceholder')}
            placeholderTextColor={Colors.taupe}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.categoryContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryContent}
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            const Icon = cat.icon;
            return (
              <Pressable
                key={cat.id}
                style={[styles.categoryChip, isActive && styles.categoryChipActive]}
                onPress={() => setActiveCategory(cat.id)}
              >
                <Icon size={14} color={isActive ? Colors.white : Colors.taupe} />
                <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>
                  {t(cat.label)}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 所有课程（包括AlphabetCourseCard和单词课程） */}
        {filteredCourses.map((course) => {
          const isCurrent = currentCourseSource === course.source;
          const moduleType = getModuleType(course);
          const progress = getCourseProgress(course);

          // 🔒 Calculation: Alphabet always unlocked, others check store
          const { checkAccessLocally, accessCache: cachedAccess } = useModuleAccessStore.getState();
          const devOverrideUnlocked = __DEV__ && cachedAccess.get(moduleType) === true;
          const isLocked = moduleType !== 'letter' && !devOverrideUnlocked && !checkAccessLocally(moduleType);

          // 字母课程：使用 AlphabetCourseCard，直接进入 /alphabet 流程
          if (course.category === 'letter') {
            return (
              <AlphabetCourseCard
                key={course.id}
                course={course}
                isCurrent={isCurrent}
                progress={progress}
                onStart={handleStartLearning(course)} // Connected handleStartLearning
              />
            );
          }

          // 单词课程：使用标准 CourseCard
          return (
            <CourseCard
              key={course.id}
              course={course as CourseCardData}
              isCurrent={isCurrent}
              progress={progress}
              onStart={handleStartLearning(course)}
              isLocked={isLocked} // Pass locked state
            />
          );
        })}
        <View style={{ height: 100 }} />
      </ScrollView>

      <CourseSelectionModal
        visible={modalVisible}
        courseTitle={pendingCourse ? t(pendingCourse.title) : ''}
        onConfirm={confirmSwitchCourse}
        onCancel={() => {
          setModalVisible(false);
          setPendingCourse(null);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.paper,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
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
  searchContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: Colors.sand,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontFamily: Typography.notoSerifRegular,
    fontSize: 14,
    color: Colors.ink,
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryContent: {
    paddingHorizontal: 24,
    gap: 20,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.sand,
    gap: 6,
  },
  categoryChipActive: {
    backgroundColor: Colors.thaiGold,
    borderColor: Colors.thaiGold,
  },
  categoryText: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 13,
    color: Colors.taupe,
  },
  categoryTextActive: {
    color: Colors.white,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 16,
  },
});
