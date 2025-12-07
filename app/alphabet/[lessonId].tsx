// app/alphabet/lesson/[lessonId].tsx

import { useLocalSearchParams } from 'expo-router';
import React from 'react';

import { useAlphabetLearningEngine } from '@/src/hooks/useAlphabetLearningEngine';

export default function AlphabetLessonFlow() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();

  const { view } = useAlphabetLearningEngine(lessonId);

  return view;
}
