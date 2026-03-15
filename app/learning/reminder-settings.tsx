import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Switch,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { ThaiPatternBackground } from '@/src/components/common/ThaiPatternBackground';
import { useLearningPreferenceStore } from '@/src/stores/learningPreferenceStore';
import {
  scheduleDailyReminder,
  cancelDailyReminder,
  requestReminderPermission,
  isReminderSupported,
} from '@/src/utils/reminderNotification';

/** 将 HH:mm 解析为 Date（今日） */
function parseTimeToDate(timeStr: string): Date {
  const [hour, minute] = timeStr.split(':').map(Number);
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  return d;
}

/** 将 Date 格式化为 HH:mm */
function formatTime(d: Date): string {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export default function ReminderSettingsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    dailyReminderEnabled,
    dailyReminderTime,
    setDailyReminder,
  } = useLearningPreferenceStore();

  const [enabled, setEnabled] = useState(dailyReminderEnabled);
  const [time, setTime] = useState(() => parseTimeToDate(dailyReminderTime));
  const [showPicker, setShowPicker] = useState(false);

  const timeStr = useMemo(() => formatTime(time), [time]);

  // 进入页面时，若已启用则确保提醒已调度（应对应用重启等场景）
  useEffect(() => {
    if (!dailyReminderEnabled) return;
    scheduleDailyReminder(
      dailyReminderTime,
      t('profile.reminder.notificationTitle'),
      t('profile.reminder.notificationBody')
    ).catch(console.warn);
  }, [dailyReminderEnabled, dailyReminderTime, t]);

  const handleToggle = async (value: boolean) => {
    if (value) {
      if (!isReminderSupported()) {
        Alert.alert(
          t('profile.reminder.title'),
          t('profile.reminder.unsupportedEnv')
        );
        return;
      }
      const hasPermission = await requestReminderPermission();
      if (!hasPermission) {
        Alert.alert(
          t('profile.reminder.permissionTitle'),
          t('profile.reminder.permissionMessage')
        );
        return;
      }
      setEnabled(true);
      setDailyReminder(true, formatTime(time));
      try {
        await scheduleDailyReminder(
          formatTime(time),
          t('profile.reminder.notificationTitle'),
          t('profile.reminder.notificationBody')
        );
      } catch (e) {
        console.warn('Schedule reminder failed:', e);
        setEnabled(false);
        setDailyReminder(false);
      }
    } else {
      setEnabled(false);
      setDailyReminder(false);
      await cancelDailyReminder();
    }
  };

  const handleTimeChange = (_: unknown, selectedDate?: Date) => {
    if (Platform.OS === 'android') setShowPicker(false);
    if (selectedDate != null) {
      setTime(selectedDate);
      const newTimeStr = formatTime(selectedDate);
      setDailyReminder(enabled, newTimeStr);
      if (enabled) {
        scheduleDailyReminder(
          newTimeStr,
          t('profile.reminder.notificationTitle'),
          t('profile.reminder.notificationBody')
        ).catch(console.warn);
      }
    }
  };

  const handleConfirm = async () => {
    setDailyReminder(enabled, timeStr);
    if (enabled) {
      try {
        await scheduleDailyReminder(
          timeStr,
          t('profile.reminder.notificationTitle'),
          t('profile.reminder.notificationBody')
        );
      } catch (e) {
        console.warn('Schedule reminder failed:', e);
      }
    } else {
      await cancelDailyReminder();
    }
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ThaiPatternBackground opacity={0.1} />
      <View style={styles.header}>
        <Text style={styles.title}>{t('profile.reminder.title')}</Text>
        <Text style={styles.subtitle}>{t('profile.reminder.subtitle')}</Text>
      </View>

      <View style={styles.card}>
        {/* 开关 */}
        <View style={styles.row}>
          <Text style={styles.label}>{t('profile.dailyReminder')}</Text>
          <Switch
            value={enabled}
            onValueChange={handleToggle}
            trackColor={{ false: Colors.sand, true: Colors.ink }}
            thumbColor={Colors.white}
          />
        </View>

        {/* 时间选择 */}
        {enabled && (
          <View style={styles.timeSection}>
            <Text style={styles.label}>{t('profile.reminder.timeLabel')}</Text>
            <Pressable
              style={styles.timeButton}
              onPress={() => setShowPicker(true)}
            >
              <Text style={styles.timeText}>{timeStr}</Text>
            </Pressable>
            {showPicker && (
              <View style={styles.pickerContainer}>
                <DateTimePicker
                  value={time}
                  mode="time"
                  is24Hour
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleTimeChange}
                />
                {Platform.OS === 'ios' && (
                  <Pressable
                    style={styles.doneButton}
                    onPress={() => setShowPicker(false)}
                  >
                    <Text style={styles.doneButtonText}>{t('common.confirm')}</Text>
                  </Pressable>
                )}
              </View>
            )}
          </View>
        )}

        <Pressable style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>{t('common.save')}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.paper,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  header: {
    marginBottom: 24,
    gap: 8,
  },
  title: {
    fontFamily: Typography.playfairBold,
    fontSize: 26,
    color: Colors.ink,
  },
  subtitle: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 14,
    color: Colors.taupe,
    lineHeight: 20,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.sand,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  label: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 16,
    color: Colors.ink,
  },
  timeSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.sand,
  },
  timeButton: {
    marginTop: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: Colors.paper,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  timeText: {
    fontFamily: Typography.playfairBold,
    fontSize: 24,
    color: Colors.ink,
  },
  confirmButton: {
    marginTop: 24,
    backgroundColor: Colors.ink,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: Colors.white,
    fontFamily: Typography.notoSerifBold,
    fontSize: 16,
  },
  pickerContainer: {
    marginTop: 8,
  },
  doneButton: {
    marginTop: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  doneButtonText: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 16,
    color: Colors.ink,
  },
});
