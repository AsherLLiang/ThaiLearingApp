import { useState, useEffect } from 'react';
import { useLearningPreferenceStore } from '@/src/stores/learningPreferenceStore';

/**
 * 当日学习时长（秒）→ 展示用文案
 * - < 60 分钟：显示 "X min"
 * - >= 60 分钟：显示 "X.X hrs"
 */
export function formatStudyTimeDisplay(seconds: number): { value: string; unit: string } {
  const mins = Math.floor(seconds / 60);
  if (mins < 60) {
    return { value: String(mins), unit: 'min' };
  }
  const hrs = mins / 60;
  return { value: hrs.toFixed(1), unit: 'hrs' };
}

/**
 * 返回当日学习时长，支持实时刷新（当用户在学习页时每秒更新）
 */
export function useTodayStudyTime() {
  const getTodayStudyTimeSeconds = useLearningPreferenceStore((s) => s.getTodayStudyTimeSeconds);
  const activeSessionStart = useLearningPreferenceStore((s) => s.activeSessionStart);
  useLearningPreferenceStore((s) => s.dailyStudyTimeByDate); // 订阅：离开学习页时触发重渲染

  const [, forceUpdate] = useState(0);

  useEffect(() => {
    if (activeSessionStart == null) return;
    const id = setInterval(() => forceUpdate((x) => x + 1), 1000);
    return () => clearInterval(id);
  }, [activeSessionStart]);

  const seconds = getTodayStudyTimeSeconds();
  return { seconds, ...formatStudyTimeDisplay(seconds) };
}
