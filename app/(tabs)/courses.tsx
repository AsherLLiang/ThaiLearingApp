// app/(tabs)/courses.tsx
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Image, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, BookOpen, Video, Mic, Type, Grid } from 'lucide-react-native';
import { ThaiPatternBackground } from '@/src/components/common/ThaiPatternBackground';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { useTranslation } from 'react-i18next';
import { AlphabetCourseCard } from '@/src/components/courses/AlphabetCourseCard';
import { useVocabularyStore } from '@/src/stores/vocabularyStore';
import { CourseSelectionModal } from '@/src/components/courses/CourseSelectionModal';

// Course Data
const CATEGORIES = [
  { id: 'all', label: '全部', icon: Grid },
  { id: 'letter', label: '字母', icon: Type },
  { id: 'word', label: '单词', icon: BookOpen },
  // { id: 'sentence', label: '句子', icon: Mic },
  // { id: 'video', label: '视频', icon: Video },
];

const COURSES = [
  {
    id: 'thai_1',
    source: 'Thai_1',
    title: '基础泰语1',
    description: '从零开始学习泰语，掌握一点点词汇。',
    level: '入门',
    image: require('@/assets/images/courses/ThaiBase_1.png'), // Assuming image exists, or reuse placeholder
    category: 'word',
    lessons: 20,
  },
  {
    id: 'thai_2',
    source: 'Thai_2',
    title: '基础泰语2',
    description: '掌握更多词汇，开始对话。',
    level: '初级',
    image: require('@/assets/images/courses/ThaiBase_2.png'),
    category: 'word',
    lessons: 25,
  },
  {
    id: 'thai_3',
    source: 'Thai_3',
    title: '基础泰语3',
    description: '掌握更多词汇，比较熟料的对话。',
    level: '中级',
    image: require('@/assets/images/courses/ThaiBase_3.png'),
    category: 'word',
    lessons: 30,
  },
  {
    id: 'thai_4',
    source: 'Thai_4',
    title: '基础泰语4',
    description: '熟料掌握大部分泰语词汇。',
    level: '高级',
    image: require('@/assets/images/courses/ThaiBase_4.png'),
    category: 'word',
    lessons: 35,
  },
];

export default function CoursesScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Store & Modal State
  const { currentCourseSource, startCourse } = useVocabularyStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [pendingCourse, setPendingCourse] = useState<typeof COURSES[0] | null>(null);

  const filteredCourses = COURSES.filter(course => {
    const matchesCategory = activeCategory === 'all' || course.category === activeCategory;
    const matchesSearch = course.title.includes(searchQuery) || course.description.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  const handleStartLearning = (course: typeof COURSES[0]) => {
    // If it's the same course, just navigate
    if (currentCourseSource === course.source) {
      router.push('/learning/vocab'); // Navigate to vocabulary learning page
      return;
    }

    // If switching courses, show confirmation
    setPendingCourse(course);
    setModalVisible(true);
  };

  const confirmSwitchCourse = async () => {
    if (pendingCourse) {
      await startCourse(pendingCourse.source);
      setModalVisible(false);
      setPendingCourse(null);
      router.push('/learning/vocab');
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
        {/* Alphabet Learning - Always available */}
        <AlphabetCourseCard />

        {/* Course List */}
        {filteredCourses.map((course) => {
          // Check if this is the active course
          const isCurrent = currentCourseSource === course.source;

          return (
            <Pressable
              key={course.id}
              style={[styles.courseCard, isCurrent && styles.activeCourseCard]}
              onPress={() => handleStartLearning(course)}
            >
              <Image source={course.image} style={styles.courseImage} />
              <View style={styles.courseInfo}>
                <View style={styles.courseHeader}>
                  <Text style={styles.courseTitle} numberOfLines={1}>{course.title}</Text>
                  <View style={styles.levelBadge}>
                    <Text style={styles.levelText}>{course.level}</Text>
                  </View>
                </View>
                <Text style={styles.courseDescription} numberOfLines={2}>
                  {course.description}
                </Text>
                <View style={styles.courseFooter}>
                  <Text style={styles.lessonCount}>{course.lessons} 课时</Text>
                  <View style={[styles.startBtn, isCurrent && styles.activeStartBtn]}>
                    <Text style={[styles.startBtnText, isCurrent && styles.activeStartBtnText]}>
                      {isCurrent ? t('courses.continue', '继续学习') : t('courses.startBtnText', '开始学习')}
                    </Text>
                  </View>
                </View>
              </View>
            </Pressable>
          );
        })}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Confirmation Modal */}
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
  courseCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.sand,
    height: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  activeCourseCard: {
    borderColor: Colors.thaiGold,
    borderWidth: 2,
    backgroundColor: '#FFFCF5', // Very light gold tint
  },
  courseImage: {
    width: 100,
    height: '100%',
    resizeMode: 'cover',
  },
  courseInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  courseTitle: {
    flex: 1,
    fontFamily: Typography.notoSerifBold,
    fontSize: 16,
    color: Colors.ink,
    marginRight: 8,
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
  courseDescription: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 12,
    color: Colors.taupe,
    lineHeight: 16,
    marginBottom: 8,
  },
  courseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lessonCount: {
    fontSize: 11,
    color: Colors.taupe,
    fontFamily: Typography.notoSerifRegular,
  },
  startBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.ink,
    borderRadius: 12,
  },
  activeStartBtn: {
    backgroundColor: Colors.thaiGold,
  },
  startBtnText: {
    fontSize: 11,
    color: Colors.white,
    fontFamily: Typography.notoSerifRegular,
  },
  activeStartBtnText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
});