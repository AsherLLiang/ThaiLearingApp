// app/alphabet/lesson/[lessonId].tsx

import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Lock } from 'lucide-react-native'; // Assuming Lock icon exists or use fallback

import { useAlphabetLearningEngine } from '@/src/hooks/useAlphabetLearningEngine';
import { AlphabetLearningEngineView } from '@/src/components/learning/alphabet/AlphabetLearningEngineView';
import { useModuleAccessStore } from '@/src/stores/moduleAccessStore';
import { getLessonMetadata, getAllLessons } from '@/src/config/alphabet/lessonMetadata.config';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { ThaiPatternBackground } from '@/src/components/common/ThaiPatternBackground';

export default function AlphabetLessonFlow() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const router = useRouter();

  // Access Control & Progress
  const { userProgress, getUserProgress } = useModuleAccessStore();
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      await getUserProgress();
      if (mounted) setIsCheckingAccess(false);
    })();
    return () => { mounted = false; };
  }, [getUserProgress]);

  // Unlock Logic
  const isUnlocked = useMemo(() => {
    if (!lessonId) return false;
    // Always load progress before deciding (unless lesson1, but let's be consistent)
    if (isCheckingAccess && !userProgress) return false;

    const currentMetadata = getLessonMetadata(lessonId);
    if (!currentMetadata) return false; // Invalid lesson ID

    // Rule 1: Lesson 1 always unlocked
    if (currentMetadata.order === 1) return true;

    // Rule 2: Lesson N requires Lesson N-1 completed
    const allLessons = getAllLessons();
    const prevLesson = allLessons.find(l => l.order === currentMetadata.order - 1);

    // Safety: If no prev lesson found (logic error?), default to locked or unlocked? 
    // Strict default: Locked.
    if (!prevLesson) return false;

    const completed = userProgress?.completedAlphabetLessons ?? [];
    return completed.includes(prevLesson.lessonId);
  }, [lessonId, userProgress, isCheckingAccess]);


  // Engine Hook - Only initialize if unlocked to prevent side effects
  // We conditionally call the hook? No, hooks must be unconditional.
  // But we can prevent it from doing work by passing a null or invalid ID if locked,
  // OR we rely on the component returning early before `useAlphabetLearningEngine` has side effects that matter.
  // Actually, `useAlphabetLearningEngine` has `initializeSession` in `useEffect`. 
  // We MUST prevent that useEffect if locked.
  // Easy way: pass `null` or `undefined` as lessonId to the hook if locked, but hook expects string.
  // Better way: The hook takes `lessonId`. If we pass a dummy or keep it as is, it's fine 
  // AS LONG AS we don't render the view that triggers start.
  // BUT the hook starts auto-initialization. 
  // Let's modify the hook call to key off `isUnlocked`.

  // Wait, I cannot conditionally call a hook. I must call it.
  // I will pass `isUnlocked ? lessonId : ''` to the hook? 
  // If I access `app/alphabet/lessonX`, lessonId is 'lessonX'.
  // If I early return NOT in the component body but RENDER a different component, the hook still runs.

  // Strict requirement: "点击不得触发导航 / 初始化 session" => "不允许触发学习引擎".
  // If the hook runs `initializeSession`, it touches the backend.
  // I should check `isUnlocked` BEFORE calling the hook? No, I can't.

  // Solution: I will split the component? 
  // Or I can just verify that `useAlphabetLearningEngine` doesn't explode if I don't use the result?
  // It DOES `initializeSession`.

  // Best approach: A Guard Wrapper Component.
  // The default export will be the Guard. 
  // If unlocked, it renders the Engine Component (which calls the hook).

  if (isCheckingAccess) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.paper }}>
        <ActivityIndicator size="large" color={Colors.thaiGold} />
      </View>
    );
  }

  if (!isUnlocked) {
    return (
      <SafeAreaView style={styles.lockedContainer}>
        <ThaiPatternBackground opacity={0.1} />
        <View style={styles.lockedContent}>
          <Lock size={64} color={Colors.taupe} style={{ marginBottom: 24 }} />
          <Text style={styles.lockedTitle}>Lesson Locked</Text>
          <Text style={styles.lockedText}>
            Please complete the previous lesson to unlock this content.
          </Text>
          <Pressable onPress={() => router.replace('/alphabet')} style={styles.backButton}>
            <ArrowLeft size={20} color={Colors.white} />
            <Text style={styles.backButtonText}>Back to Courses</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // Only render the Engine (and trigger the hook) if verified unlocked
  return <AuthenticatedLessonFlow lessonId={lessonId!} />;
}

// Inner component that actually invokes the engine hook
function AuthenticatedLessonFlow({ lessonId }: { lessonId: string }) {
  const router = useRouter();

  const {
    phase,
    initialized,
    currentRound,
    roundEvaluation,
    currentItem,
    currentQuestionType,
    letterPool,
    onAnswer,
    onNext,
    phonicsRule,
    showPhonicsRuleCard,
    onCompletePhonicsRule,
    pendingRecoverySession,
    resolveRecovery,
    onFinishRound,
    onSkipYesterdayReview,
  } = useAlphabetLearningEngine(lessonId);

  const handleBack = async () => {
    // 🔥 在离开页面前清除 session
    await onFinishRound();
    router.back();
  };

  return (
    <AlphabetLearningEngineView
      phase={phase}
      initialized={initialized}
      currentRound={currentRound}
      roundEvaluation={roundEvaluation}
      currentItem={currentItem}
      currentQuestionType={currentQuestionType}
      letterPool={letterPool}
      onAnswer={onAnswer}
      onNext={onNext}
      onBack={handleBack}
      phonicsRule={phonicsRule}
      showPhonicsRuleCard={showPhonicsRuleCard}
      onCompletePhonicsRule={onCompletePhonicsRule}
      pendingRecoverySession={pendingRecoverySession}
      resolveRecovery={resolveRecovery}
      onSkipYesterdayReview={onSkipYesterdayReview}
    />
  );
}

const styles = StyleSheet.create({
  lockedContainer: {
    flex: 1,
    backgroundColor: Colors.paper,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockedContent: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: Colors.white,
    borderRadius: 24,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  lockedTitle: {
    fontFamily: Typography.playfairBold,
    fontSize: 24,
    color: Colors.ink,
    marginBottom: 12,
  },
  lockedText: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 16,
    color: Colors.taupe,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.thaiGold,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    gap: 8,
  },
  backButtonText: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 16,
    color: Colors.white,
  },
});

