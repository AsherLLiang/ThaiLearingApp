// app/alphabet/index.tsx
// 字母课程总览页（课程入口 → Lesson 1~5）

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';

import { useAlphabetStore } from '@/src/stores/alphabetStore';
import { SEQUENCE_LESSONS } from '@/src/config/alphabet/lettersSequence';
import { ThaiPatternBackground } from '@/src/components/common/ThaiPatternBackground';


interface LessonCardProps {
  id: string;
  title: string;
  description: string;
  letterKeys: string[];
  isCurrent: boolean;
  progress?: {
    completed: number;
    total: number;
  };
}

const LESSONS: LessonCardProps[] = [
  {
    id: 'lesson1',
    title: '第一课：基础辅音 + 基础元音',
    description: '掌握最基础的中辅音和常见元音，是所有泰语拼读的核心。',
    letterKeys: SEQUENCE_LESSONS.lesson1,
    isCurrent: false,
    progress: {
      completed: 0,
      total: 16,
    },
  },
  {
    id: 'lesson2',
    title: '第二课：前置元音 + 高频辅音',
    description: '学习前置元音和更多高频辅音，扩展拼读能力。',
    letterKeys: SEQUENCE_LESSONS.lesson2,
    isCurrent: false,
    progress: {
      completed: 0,
      total: SEQUENCE_LESSONS.lesson2.length,
    },
  },
  {
    id: 'lesson3',
    title: '第三课：送气辅音 + 特殊元音',
    description: '掌握送气辅音与特殊元音，是语音区分的关键。',
    letterKeys: SEQUENCE_LESSONS.lesson3,
    isCurrent: false,
    progress: {
      completed: 0,
      total: SEQUENCE_LESSONS.lesson3.length,
    },
  },
  {
    id: 'lesson4',
    title: '第四课：高频辅音 + 尾音规则',
    description: '理解尾音规则与高频辅音，用于真实阅读与会话。',
    letterKeys: SEQUENCE_LESSONS.lesson4,
    isCurrent: false,
    progress: {
      completed: 0,
      total: SEQUENCE_LESSONS.lesson4.length,
    },
  },
  {
    id: 'lesson5',
    title: '第五课：复合元音 + 难辅音组合',
    description: '掌握高级元音组合，是自然阅读泰语段落的关键能力。',
    letterKeys: SEQUENCE_LESSONS.lesson5,
    isCurrent: false,
    progress: {
      completed: 0,
      total: SEQUENCE_LESSONS.lesson5.length,
    },
  },
];

export default function AlphabetCoursesScreen({ }) {
  const router = useRouter();

  const { completedCount, totalCount } = useAlphabetStore();
  const overallProgressPercent =
    totalCount > 0 ? Math.min(100, Math.round((completedCount / totalCount) * 100)) : 0;

  // 按课程累积字母数量，用于解锁和当前课程判断
  const cumulativeCounts = LESSONS.reduce<number[]>((acc, lesson, index) => {
    const prev = index === 0 ? 0 : acc[index - 1];
    acc.push(prev + lesson.letterKeys.length);
    return acc;
  }, []);

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      
        <View style={styles.backRow}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={Colors.taupe} />
            <Text style={styles.backText}>返回</Text>
          </Pressable>
        </View>
        {/* Header */}
        <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>泰语字母课程</Text>
        <Text style={styles.headerSubtitle}>
          共 5 个课程 · {overallProgressPercent}% 完成
        </Text>
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.inner}>
        <ThaiPatternBackground opacity={0.12} />
        {/* Back Button Row */}


        {/* Lesson Cards */}
        {LESSONS.map((lesson, index) => {
          const unlocked =
            index === 0 || completedCount >= cumulativeCounts[index - 1];

          const isCurrent =
            completedCount < cumulativeCounts[index] &&
            (index === 0 || completedCount >= cumulativeCounts[index - 1]);

          return (
            <View key={lesson.id} style={[styles.card, isCurrent && styles.activeCard]}>
              <View style={styles.cardPressable}>
                <View style={styles.info}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.title} numberOfLines={1}>
                      {lesson.title}
                    </Text>
                  </View>

                  <Text style={styles.description} numberOfLines={2}>
                    {lesson.description}
                  </Text>

                  <Text style={styles.lessonMeta}>
                    本课包含 {lesson.letterKeys.length} 个字母
                  </Text>

                  <View style={styles.footer}>
                    <View style={styles.metaColumn}>
                      {totalCount > 0 ? (
                        <>
                          <View style={styles.progressBar}>
                            <View
                              style={[
                                styles.progressFill,
                                { width: `${overallProgressPercent}%` },
                              ]}
                            />
                          </View>
                          <Text style={styles.metaText}>
                            {completedCount}/{totalCount} ({overallProgressPercent}
                            %)
                          </Text>
                        </>
                      ) : (
                        <Text style={styles.metaText}>尚未开始学习</Text>
                      )}
                    </View>

                    {/* Start Learning 按钮 */}
                    <Pressable
                      disabled={!unlocked}
                      style={[
                        styles.startBtn,
                        isCurrent && styles.activeStartBtn,
                        !unlocked && styles.disabledStartBtn,
                      ]}
                      onPress={() => router.push(`/alphabet/${lesson.id}`)}
                    >
                      <Text
                        style={[
                          styles.startBtnText,
                          isCurrent && styles.activeStartBtnText,
                        ]}
                      >
                        {unlocked ? '开始学习' : '未解锁'}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
          );
        })}
        {/* ========================================解锁全部课程 =============================================*/}

      </ScrollView>
      <View style={styles.unlockALLBtnContainer}>
        <Pressable
          style={styles.unlockAllBtn}
          onPress={() => router.push('/alphabet/test')}
        >
          <Text style={styles.unlockAllText}>
            通过测试 → 解锁全部课程
          </Text>
        </Pressable>
      </View>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.paper,
  },
  headerContainer:{
    alignItems:"center"
  },
  scroll: {
    flex: 1,
  },
  inner: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    gap: 16,
  },
  backRow: {
    width: '150%',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  backText: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 20,
    color: Colors.taupe,
    marginLeft: 4,
  },
  headerTitle: {
    fontFamily: Typography.playfairBold,
    fontSize: 28,
    color: Colors.ink,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 14,
    color: Colors.taupe,
    marginTop:5
  },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.sand,
    height: 136,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  activeCard: {
    borderColor: Colors.thaiGold,
    borderWidth: 2,
    backgroundColor: '#FFFCF5',
  },
  cardPressable: {
    flex: 1,
    flexDirection: 'row',
  },
  image: {
    width: 110,
    height: '100%',
    resizeMode: 'cover',
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
    gap: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  title: {
    flex: 1,
    fontFamily: Typography.notoSerifBold,
    fontSize: 16,
    color: Colors.ink,
  },
  levelBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  levelText: {
    fontSize: 10,
    color: Colors.thaiGold,
    fontFamily: Typography.notoSerifRegular,
  },
  description: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 12,
    color: Colors.taupe,
    lineHeight: 16,
  },
  lessonMeta: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 12,
    color: Colors.taupe,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  metaColumn: {
    flex: 1,
    gap: 6,
  },
  metaText: {
    fontSize: 11,
    color: Colors.taupe,
    fontFamily: Typography.notoSerifRegular,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.thaiGold,
    borderRadius: 3,
  },
  startBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: Colors.ink,
    borderRadius: 12,
  },
  activeStartBtn: {
    backgroundColor: Colors.thaiGold,
  },
  startBtnText: {
    fontSize: 12,
    color: Colors.white,
    fontFamily: Typography.notoSerifRegular,
  },
  activeStartBtnText: {
    color: Colors.white,
    fontWeight: '600',
  },
  disabledStartBtn: {
    backgroundColor: Colors.sand,
  },
  unlockALLBtnContainer: {
    marginLeft: 20,
    marginRight: 20
  },
  unlockAllBtn: {
    marginTop: 12,
    paddingVertical: 12,
    backgroundColor: Colors.ink,
    borderRadius: 999,
  },
  unlockAllText: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 15,
    color: Colors.white,
    textAlign: 'center',
  },
});
