import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore } from '@/src/stores/userStore';
import { useLearningStore } from '@/src/stores/learningStore';
import GlassCard from '@/src/components/common/GlassCard';

export default function ProfilePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { currentUser, logout } = useUserStore();
  const progress = useLearningStore(state => state.progress);

  const handleLogout = () => {
    Alert.alert(
      t('auth.logout', 'Logout'),
      t('auth.logoutConfirm', 'Are you sure you want to logout?'),
      [
        { text: t('common.cancel', 'Cancel'), style: 'cancel' },
        {
          text: t('common.confirm', 'Confirm'),
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  const backgroundImage = { uri: 'https://images.unsplash.com/photo-1486496146582-9ffcd0b2b2b7?q=80&w=1000&auto=format&fit=crop' };

  return (
    <ImageBackground source={backgroundImage} style={styles.container} resizeMode="cover">
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
          
          {/* Profile Header */}
          <View style={styles.header}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {currentUser?.displayName?.charAt(0) || 'A'}
              </Text>
            </View>
            <Text style={styles.userName}>{currentUser?.displayName || 'Alex Chen'}</Text>
            <Text style={styles.userEmail}>{currentUser?.email || 'alex@example.com'}</Text>
          </View>

          {/* Statistics Grid */}
          <Text style={styles.sectionTitle}>{t('profile.stats', 'Statistics')}</Text>
          <GlassCard style={styles.statsCard}>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{progress?.completedAlphabets || 26}</Text>
                <Text style={styles.statLabel}>{t('profile.alphabets', 'Alphabets')}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{progress?.completedVocabulary || 142}</Text>
                <Text style={styles.statLabel}>{t('profile.vocab', 'Words')}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>12</Text>
                <Text style={styles.statLabel}>{t('profile.hours', 'Hours')}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, styles.streakValue]}>{progress?.streakDays || 43}</Text>
                <Text style={styles.statLabel}>{t('profile.streak', 'Day Streak')}</Text>
              </View>
            </View>
          </GlassCard>

          {/* Settings Section */}
          <Text style={styles.sectionTitle}>{t('profile.settings', 'Settings')}</Text>
          <GlassCard style={styles.settingsCard}>
            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => router.push('/settings')}
            >
              <View style={styles.settingLeft}>
                <View style={[styles.iconBox, { backgroundColor: '#E3F2FD' }]}>
                  <Ionicons name="settings-outline" size={20} color="#4A90E2" />
                </View>
                <Text style={styles.settingText}>
                  {t('profile.general', 'General Settings')}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#CBD5E0" />
            </TouchableOpacity>

            <View style={styles.separator} />

            <TouchableOpacity
              style={styles.settingItem}
              onPress={handleLogout}
            >
              <View style={styles.settingLeft}>
                <View style={[styles.iconBox, { backgroundColor: '#FEE2E2' }]}>
                  <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                </View>
                <Text style={[styles.settingText, styles.logoutText]}>
                  {t('auth.logout', 'Logout')}
                </Text>
              </View>
            </TouchableOpacity>
          </GlassCard>

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
  contentContainer: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 12,
    marginLeft: 4,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  statsCard: {
    padding: 20,
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statItem: {
    width: '50%',
    alignItems: 'center',
    paddingVertical: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 4,
  },
  streakValue: {
    color: '#F5A623',
  },
  statLabel: {
    fontSize: 13,
    color: '#718096',
  },
  settingsCard: {
    padding: 0, // Custom padding for list items
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D3748',
  },
  logoutText: {
    color: '#EF4444',
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginLeft: 64,
  },
});