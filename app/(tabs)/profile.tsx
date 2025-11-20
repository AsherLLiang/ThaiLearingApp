import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore } from '../../src/stores/userStore';
import { useLearningStore } from '../../src/stores/learningStore';
import Card from '../../src/components/common/Card';

/**
 * 个人中心页面
 * 显示用户信息和统计数据
 */
export default function ProfilePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { currentUser, logout } = useUserStore();
  const progress = useLearningStore(state => state.progress);

  const handleLogout = () => {
    Alert.alert(
      t('auth.logout'),
      '确定要退出登录吗?',
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.confirm'),
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* 用户信息卡片 */}
      <Card style={styles.userCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {currentUser?.displayName?.charAt(0) || 'U'}
          </Text>
        </View>
        <Text style={styles.userName}>{currentUser?.displayName}</Text>
        <Text style={styles.userEmail}>{currentUser?.email}</Text>
      </Card>

      {/* 统计数据 */}
      <Card style={styles.statsCard}>
        <Text style={styles.cardTitle}>学习统计</Text>
        
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>
            {t('profile.completedAlphabets')}
          </Text>
          <Text style={styles.statValue}>
            {progress?.completedAlphabets || 0}
          </Text>
        </View>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>
            {t('profile.completedVocabulary')}
          </Text>
          <Text style={styles.statValue}>
            {progress?.completedVocabulary || 0}
          </Text>
        </View>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>
            {t('profile.studyHours')}
          </Text>
          <Text style={styles.statValue}>
            {Math.floor((progress?.totalStudyTime || 0) / 3600)}
          </Text>
        </View>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>
            {t('profile.streakDays')}
          </Text>
          <Text style={styles.statValue}>
            {progress?.streakDays || 0}
          </Text>
        </View>
      </Card>

      {/* 设置选项 */}
      <Card style={styles.settingsCard}>
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => router.push('/settings')}
        >
          <View style={styles.settingLeft}>
            <Ionicons name="settings-outline" size={20} color="#666" />
            <Text style={styles.settingText}>
              {t('profile.settings')}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#CCC" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={handleLogout}
        >
          <View style={styles.settingLeft}>
            <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
            <Text style={[styles.settingText, styles.logoutText]}>
              {t('auth.logout')}
            </Text>
          </View>
        </TouchableOpacity>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    padding: 16,
  },
  userCard: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  statsCard: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A90E2',
  },
  settingsCard: {
    marginBottom: 32,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 14,
    color: '#1A1A1A',
    marginLeft: 12,
  },
  logoutText: {
    color: '#FF3B30',
  },
});