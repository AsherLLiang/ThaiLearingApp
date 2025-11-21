import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import GlassCard from '@/src/components/common/GlassCard';
import { Level } from '@/src/types/entities';

/**
 * Courses Page
 * Displays available courses with difficulty filtering.
 */
export default function CoursesPage() {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState('All');

  // Mock Data
  const courses = [
    { id: '1', name: 'Thai Alphabet 101', level: Level.BEGINNER_A, progress: 30, lessons: 12 },
    { id: '2', name: 'Essential Vocabulary', level: Level.BEGINNER_A, progress: 50, lessons: 20 },
    { id: '3', name: 'Basic Sentence Structure', level: Level.BEGINNER_B, progress: 0, lessons: 15 },
    { id: '4', name: 'Conversation Basics', level: Level.INTERMEDIATE, progress: 10, lessons: 18 },
  ];

  const filters = ['All', 'Beginner', 'Intermediate'];

  const filteredCourses = activeFilter === 'All' 
    ? courses 
    : activeFilter === 'Beginner' 
      ? courses.filter(c => c.level === Level.BEGINNER_A || c.level === Level.BEGINNER_B)
      : courses.filter(c => c.level === Level.INTERMEDIATE);

  const renderCourse = ({ item }: { item: any }) => (
    <GlassCard style={styles.courseCard}>
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <Ionicons name="book" size={20} color="#4A90E2" />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.courseName}>{item.name}</Text>
          <Text style={styles.lessonCount}>{item.lessons} Lessons</Text>
        </View>
      </View>
      
      <View style={styles.progressSection}>
        <View style={styles.progressRow}>
          <Text style={styles.progressLabel}>Progress</Text>
          <Text style={styles.progressPercent}>{item.progress}%</Text>
        </View>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${item.progress}%` }]} />
        </View>
      </View>
    </GlassCard>
  );

  const backgroundImage = { uri: 'https://images.unsplash.com/photo-1486496146582-9ffcd0b2b2b7?q=80&w=1000&auto=format&fit=crop' };

  return (
    <ImageBackground source={backgroundImage} style={styles.container} resizeMode="cover">
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.pageTitle}>{t('courses.title', 'Courses')}</Text>
        </View>

        {/* Filter Pills */}
        <View style={styles.filterContainer}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterPill,
                activeFilter === filter && styles.activeFilterPill
              ]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text style={[
                styles.filterText,
                activeFilter === filter && styles.activeFilterText
              ]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={filteredCourses}
          renderItem={renderCourse}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterPill: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  activeFilterPill: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  filterText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  activeFilterText: {
    color: '#FFF',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  courseCard: {
    marginBottom: 16,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(74, 144, 226, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  courseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 2,
  },
  lessonCount: {
    fontSize: 12,
    color: '#718096',
  },
  progressSection: {
    marginTop: 4,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 12,
    color: '#718096',
    fontWeight: '600',
  },
  progressPercent: {
    fontSize: 12,
    color: '#4A90E2',
    fontWeight: 'bold',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4A90E2',
    borderRadius: 3,
  },
});