// app/(tabs)/courses.tsx
import React, { useEffect, useMemo, useState } from 'react';
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
  { id: 'all', label: '全部', icon: Grid },
  { id: 'letter', label: '字母', icon: Type },
  { id: 'word', label: '单词', icon: BookOpen },
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
  const { hasDailyLimit } = useLearningPreferenceStore();
  const { userProgress, getUserProgress } = useModuleAccessStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [pendingCourse, setPendingCourse] = useState<CourseWithImage | null>(null);

  useEffect(() => {
    if (!userProgress) {
      getUserProgress().catch((err) => console.warn('Failed to fetch user progress', err));
    }
  }, [userProgress, getUserProgress]);

  const getModuleType = (course: CourseWithImage): ModuleType => {
    switch (course.category) {
      case 'letter':
        return 'alphabet';
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
    if (moduleType === 'alphabet') {
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

  const filteredCourses = useMemo(() => {
    return COURSES.filter(course => {
      const matchesCategory = activeCategory === 'all' || course.category === activeCategory;
      const matchesSearch =
        course.title.includes(searchQuery) || course.description.includes(searchQuery);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const proceedToCourse = async (course: CourseWithImage) => {
    const moduleType = getModuleType(course);
    const needsDailySetup = !hasDailyLimit(moduleType);

    await startCourse(course.source);
    setModalVisible(false);
    setPendingCourse(null);

    router.push({
      pathname: needsDailySetup ? '/learning/setup' : '/learning',
      params: {
        module: moduleType,
        source: course.source,
      },
    });
  };

  // ⭐ 统一的 Start Learning 逻辑：接收 course，返回一个点击 handler
const handleStartLearning = (course: CourseWithImage) => {
  return () => {
    const moduleType = getModuleType(course);
    const needsDailySetup = !hasDailyLimit(moduleType);

    // ✅ 同一个课程：直接按照是否已设置日计划进行跳转
    if (currentCourseSource === course.source) {
      router.push({
        pathname: needsDailySetup ? '/learning/setup' : '/learning',
        params: {
          module: moduleType,      // 字母时就是 'alphabet'
          source: course.source,
        },
      });
      return;
    }

    // ✅ 切换课程：弹确认框
    setPendingCourse(course);
    setModalVisible(true);
  };
};

  const confirmSwitchCourse = async () => {
    if (pendingCourse) {
      await proceedToCourse(pendingCourse);
    }
  };

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
                  {cat.label}
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
        {filteredCourses.map((course) => {
          const isCurrent = currentCourseSource === course.source;
          const moduleType = getModuleType(course);
          const progress = getCourseProgress(course);

          if (moduleType === 'alphabet') {
            return (
              <AlphabetCourseCard
                key={course.id}
                course={course}
                isCurrent={isCurrent}
                progress={progress}
                onStart={handleStartLearning(course)}
              />
            );
          }

          return (
            <CourseCard
              key={course.id}
              course={course as CourseCardData}
              isCurrent={isCurrent}
              progress={progress}
              onStart={handleStartLearning(course)}
            />
          );
        })}
        <View style={{ height: 100 }} />
      </ScrollView>

      <CourseSelectionModal
        visible={modalVisible}
        courseTitle={pendingCourse?.title || ''}
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
