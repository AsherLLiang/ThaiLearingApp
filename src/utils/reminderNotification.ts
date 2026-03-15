/**
 * 每日提醒通知服务（基于 Notifee）
 * 用于在指定时间弹出学习提醒
 * 注：Notifee 需 development build，Expo Go 下会静默降级
 */
import { Platform } from 'react-native';

/** 每日提醒通知固定 ID，用于更新/取消 */
export const DAILY_REMINDER_NOTIFICATION_ID = 'daily-learning-reminder';

/** 获取 Notifee 实例，Expo Go 下返回 null */
function getNotifee(): typeof import('@notifee/react-native').default | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('@notifee/react-native').default;
  } catch {
    return null;
  }
}

/** 当前环境是否支持 Notifee（需 development build，Expo Go 下为 false） */
export function isReminderSupported(): boolean {
  return getNotifee() != null;
}

/**
 * 请求通知权限（iOS 必需）
 */
export async function requestReminderPermission(): Promise<boolean> {
  const notifee = getNotifee();
  if (!notifee) return false;
  if (Platform.OS !== 'ios') return true;
  try {
    const settings = await notifee.requestPermission();
    return settings.authorizationStatus >= 2; // 2 = authorized
  } catch {
    return false;
  }
}

/**
 * 创建/更新每日定时提醒
 * @param time 提醒时间 HH:mm
 * @param title 通知标题
 * @param body 通知正文
 */
export async function scheduleDailyReminder(
  time: string,
  title: string,
  body: string
): Promise<void> {
  const notifee = getNotifee();
  if (!notifee) return;

  try {
    const { TimestampTrigger, TriggerType, RepeatFrequency, AndroidImportance } =
      require('@notifee/react-native');

    await notifee.createChannel({
      id: 'daily-reminder',
      name: '学习提醒',
      importance: AndroidImportance.HIGH,
    });

    const hasPermission = await requestReminderPermission();
    if (!hasPermission) {
      throw new Error('未获得通知权限');
    }

    const [hour, minute] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hour, minute, 0, 0);
    let triggerTimestamp = date.getTime();
    if (triggerTimestamp <= Date.now()) {
      date.setDate(date.getDate() + 1);
      triggerTimestamp = date.getTime();
    }

    const trigger: typeof TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: triggerTimestamp,
      repeatFrequency: RepeatFrequency.DAILY,
    };

    await notifee.createTriggerNotification(
      {
        id: DAILY_REMINDER_NOTIFICATION_ID,
        title,
        body,
        android: {
          channelId: 'daily-reminder',
          pressAction: { id: 'default' },
        },
      },
      trigger
    );
  } catch (e) {
    if (String(e).includes('native module not found')) return;
    throw e;
  }
}

/**
 * 取消每日提醒
 */
export async function cancelDailyReminder(): Promise<void> {
  const notifee = getNotifee();
  if (!notifee) return;
  try {
    await notifee.cancelNotification(DAILY_REMINDER_NOTIFICATION_ID);
  } catch {
    // 静默忽略（如 Expo Go 下无原生模块）
  }
}
