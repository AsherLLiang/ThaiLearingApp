import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  Dimensions,
  StatusBar
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '@/src/stores/userStore';
import { useLearningStore } from '@/src/stores/learningStore';
import GlassCard from '@/src/components/common/GlassCard';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

/**
 * Home Screen
 * Redesigned with a winter aesthetic.
 * - Removes top-left avatar.
 * - Centers a prominent "Start Learning" card.
 * - Displays styled progress stats and tasks.
 */
export default function HomePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const currentUser = useUserStore(state => state.currentUser);
  const progress = useLearningStore(state => state.progress);

  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', weekday: 'short' });

  // Using a winter-themed background image
  const backgroundImage = { uri: 'https://images.unsplash.com/photo-1486496146582-9ffcd0b2b2b7?q=80&w=1000&auto=format&fit=crop' };

  return (
    <ImageBackground source={backgroundImage} style={styles.container} resizeMode="cover">
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header: Date Only (No Avatar) */}
          <View style={styles.header}>
            <Text style={styles.dateText}>{dateString}</Text>
            <Text style={styles.greetingText}>
              {t('home.greeting', 'Hello')}, {currentUser?.displayName || 'Student'}!
            </Text>
          </View>

          {/* Center Action: Start Learning */}
          <View style={styles.heroContainer}>
            <GlassCard style={styles.startLearningCard}>
              <TouchableOpacity 
                style={styles.touchableArea}
                onPress={() => router.push('/(tabs)/courses')}
                activeOpacity={0.8}
              >
                <View style={styles.playButtonIcon}>
                  <Ionicons name="play" size={36} color="#FFF" style={{ marginLeft: 4 }} />
                </View>
                <Text style={styles.startText}>{t('home.startLearning', 'Start Learning')}</Text>
                <Text style={styles.startSubtext}>{t('home.subtitle', 'Continue your journey')}</Text>
              </TouchableOpacity>
            </GlassCard>
          </View>

          {/* Progress Stats Row */}
          <GlassCard style={styles.statsCard}>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{progress?.completedAlphabets || 0}</Text>
                <Text style={styles.statLabel}>Alphabets</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{progress?.completedVocabulary || 0}</Text>
                <Text style={styles.statLabel}>Vocab</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, styles.streakValue]}>{progress?.streakDays || 0}</Text>
                <Text style={styles.statLabel}>Streak</Text>
              </View>
            </View>
          </GlassCard>

          {/* Today's Tasks */}
          <View style={styles.tasksSection}>
            <Text style={styles.sectionTitle}>{t('home.todayTasks', "Today's Tasks")}</Text>
            
            <GlassCard style={styles.taskCard}>
              <TouchableOpacity style={styles.taskRow}>
                <View style={styles.taskContent}>
                  <Text style={styles.taskTitle}>{t('home.reviewVocabulary', 'Review Vocabulary')}</Text>
                  <Text style={styles.taskSubtitle}>5 mins • 20 words</Text>
                </View>
                <Ionicons name="checkmark-circle" size={28} color="#4CD964" />
              </TouchableOpacity>
            </GlassCard>

            <GlassCard style={styles.taskCard}>
              <TouchableOpacity style={styles.taskRow}>
                <View style={styles.taskContent}>
                  <Text style={styles.taskTitle}>{t('home.learnAlphabet', 'Learn Alphabet')}</Text>
                  <Text style={styles.taskSubtitle}>10 mins • New Lesson</Text>
                </View>
                <Ionicons name="ellipse-outline" size={28} color="#8E8E93" />
              </TouchableOpacity>
            </GlassCard>
          </View>
          
          {/* Bottom Spacer for Tab Bar */}
          <View style={{ height: 80 }} />

        </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    marginTop: 10,
    marginBottom: 40,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  greetingText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  startLearningCard: {
    width: width * 0.55,
    aspectRatio: 1,
    padding: 0, // Remove default padding to let touchable fill
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 40,
  },
  touchableArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  playButtonIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  startText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 4,
    textAlign: 'center',
  },
  startSubtext: {
    fontSize: 12,
    color: '#718096',
    textAlign: 'center',
  },
  statsCard: {
    marginBottom: 30,
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 4,
  },
  streakValue: {
    color: '#F5A623',
  },
  statLabel: {
    fontSize: 12,
    color: '#718096',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: '#CBD5E0',
  },
  tasksSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    marginLeft: 4,
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  taskCard: {
    marginBottom: 12,
    padding: 16,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 4,
  },
  taskSubtitle: {
    fontSize: 13,
    color: '#718096',
  },
});