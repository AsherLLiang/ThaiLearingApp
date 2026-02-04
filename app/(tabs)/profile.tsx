// app/(tabs)/profile.tsx
import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Settings, Award, LogOut, ChevronRight } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LanguageSwitcher } from '@/src/components/common/LanguageSwitcher';
import { useModuleAccessStore } from '@/src/stores/moduleAccessStore';
import { useUserStore } from '@/src/stores/userStore';

import { useLearningPreferenceStore } from '@/src/stores/learningPreferenceStore';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';

export default function ProfileScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { currentUser, logout } = useUserStore();
  const { streakDays } = useLearningPreferenceStore();
  const { userProgress } = useModuleAccessStore();

  const [dailyReminder, setDailyReminder] = React.useState(true);



  const handleLogout = () => {
    Alert.alert(
      t('auth.logout'),
      'Are you sure you want to logout?',
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

  const achievements = [
    {
      id: 'streak7',
      icon: '🔥',
      label: t('profile.achievementBadges.streak7'),
      unlocked: (streakDays || 0) >= 7,
    },
    {
      id: 'master',
      icon: '🗣️',
      label: t('profile.achievementBadges.master'),
      unlocked: false,
    },
    {
      id: 'vocab100',
      icon: '📚',
      label: t('profile.achievementBadges.vocab100'),
      unlocked: false,
    },
  ];

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('profile.title')}</Text>
          <Pressable style={styles.settingsButton}>
            <Settings size={24} color={Colors.ink} />
          </Pressable>
        </View>

        {/* Profile Card */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>L</Text>
            </View>
          </View>
          <Text style={styles.displayName}>{currentUser?.displayName || 'Unknow'}</Text>
          <Text style={styles.subtitle}>显示当前登录邮箱</Text>
        </Animated.View>

        {/* Achievements Section */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Award size={20} color={Colors.ink} />
            <Text style={styles.sectionTitle}>{t('profile.achievements')}</Text>
          </View>

          <View style={styles.achievementsContainer}>
            <View style={styles.achievementsGrid}>
              {achievements.map((achievement, index) => (
                <View
                  key={achievement.id}
                  style={[
                    styles.achievementBadge,
                    !achievement.unlocked && styles.achievementBadgeLocked,
                  ]}
                >
                  <View style={styles.achievementIcon}>
                    <Text style={styles.achievementEmoji}>{achievement.icon}</Text>
                  </View>
                  <Text style={styles.achievementLabel}>{achievement.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </Animated.View>

        {/* Settings Section */}
        <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.settings')}</Text>

          <View style={styles.settingsCard}>
            {/* Daily Reminder */}
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>{t('profile.dailyReminder')}</Text>
              <Switch
                value={dailyReminder}
                onValueChange={setDailyReminder}
                trackColor={{ false: Colors.sand, true: Colors.ink }}
                thumbColor={Colors.white}
              />
            </View>

            {/* Daily Learning Limit */}
            <View style={styles.divider} />
            <Pressable
              style={styles.settingItem}
              onPress={() => router.push('/learning/dailyLimit')}
            >
              <Text style={styles.settingLabel}>{t('profile.limit')}</Text>
              <View style={styles.settingRight}>
                <Text style={styles.settingValue}>
                  {useLearningPreferenceStore(state => state.dailyLimits['word']) || userProgress?.dailyLimit || 20}
                </Text>
                <ChevronRight size={20} color={Colors.taupe} />
              </View>
            </Pressable>

            {/* TTS Engine */}
            <View style={styles.divider} />
            <Pressable style={styles.settingItem}>
              <Text style={styles.settingLabel}>{t('profile.ttsEngine')}</Text>
              <View style={styles.settingRight}>
                <Text style={styles.settingValue}>Tencent TTS</Text>
                <ChevronRight size={20} color={Colors.taupe} />
              </View>
            </Pressable>

            {/* Language Switcher */}
            <View style={styles.divider} />
            <View style={styles.languageSection}>
              <LanguageSwitcher variant="full" />
            </View>
          </View>
        </Animated.View>

        {/* Logout Button */}
        <Animated.View entering={FadeInDown.delay(400).duration(500)}>
          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={16} color="#DC2626" />
            <Text style={styles.logoutText}>{t('auth.logout')}</Text>
          </Pressable>
        </Animated.View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerTitle: {
    fontFamily: Typography.playfairBold,
    fontSize: 28,
    fontWeight: '700',
    color: Colors.ink,
  },
  settingsButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: 24,
    marginHorizontal: 24,
    marginBottom: 32,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.sand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: Typography.playfairBold,
    fontSize: 36,
    fontWeight: '700',
    color: Colors.ink,
  },
  displayName: {
    fontFamily: Typography.playfairRegular,
    fontSize: 24,
    color: Colors.ink,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 14,
    color: Colors.taupe,
  },
  section: {
    marginHorizontal: 24,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.ink,
  },
  achievementsContainer: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.sand,
    padding: 24,
  },
  achievementsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  achievementBadge: {
    alignItems: 'center',
    opacity: 1,
  },
  achievementBadgeLocked: {
    opacity: 0.5,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  achievementEmoji: {
    fontSize: 24,
  },
  achievementLabel: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.ink,
    textAlign: 'center',
  },
  settingsCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.sand,
    padding: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingLabel: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 16,
    color: Colors.ink,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingValue: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 14,
    color: Colors.taupe,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(229, 226, 219, 0.5)',
    marginVertical: 4,
  },
  languageSection: {
    paddingTop: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  logoutText: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 14,
    fontWeight: '500',
    color: '#DC2626',
  },
});