// app/(tabs)/index.tsx
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '@/src/stores/userStore';
import { useLearningStore } from '@/src/stores/learningStore';
import Card from '@/src/components/common/Card';
import Button from '@/src/components/common/Button';

/**
 * 首页组件
 * 显示:
 * 1. 欢迎语
 * 2. 学习进度
 * 3. 今日任务
 * 4. 快捷入口
 */
export default function HomePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const currentUser = useUserStore(state => state.currentUser);
  const progress = useLearningStore(state => state.progress);

  return (
    <ScrollView style={styles.container}>
      {/* 欢迎卡片 */}
      <Card style={styles.welcomeCard}>
        <Text style={styles.greeting}>
          {t('home.greeting')}, {currentUser?.displayName}!
        </Text>
        <Text style={styles.subtitle}>{t('home.subtitle')}</Text>
      </Card>

      {/* 学习进度 */}
      <Card style={styles.progressCard}>
        <Text style={styles.cardTitle}>学习进度</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {progress?.completedAlphabets || 0}
            </Text>
            <Text style={styles.statLabel}>字母</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {progress?.completedVocabulary || 0}
            </Text>
            <Text style={styles.statLabel}>词汇</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {progress?.streakDays || 0}
            </Text>
            <Text style={styles.statLabel}>连续天数</Text>
          </View>
        </View>
      </Card>

      {/* 今日任务 */}
      <Card style={styles.tasksCard}>
        <Text style={styles.cardTitle}>{t('home.todayTasks')}</Text>
        
        <TouchableOpacity style={styles.taskItem}>
          <Text style={styles.taskText}>
            {t('home.reviewVocabulary')}
          </Text>
          <Text style={styles.taskStatus}>✓</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.taskItem}>
          <Text style={styles.taskText}>
            {t('home.learnAlphabet')}
          </Text>
          <Text style={styles.taskStatus}>○</Text>
        </TouchableOpacity>
      </Card>

      {/* 开始学习按钮 */}
      <Button
        title={t('home.startLearning')}
        onPress={() => router.push('/(tabs)/courses')}
        style={styles.startButton}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    padding: 16,
  },
  welcomeCard: {
    marginBottom: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  progressCard: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  tasksCard: {
    marginBottom: 16,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  taskText: {
    fontSize: 14,
    color: '#1A1A1A',
  },
  taskStatus: {
    fontSize: 18,
  },
  startButton: {
    marginBottom: 32,
  },
});