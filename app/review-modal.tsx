// app/review-modal.tsx
import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { X, Check, ArrowRight } from 'lucide-react-native';
import { ThaiPatternBackground } from '@/src/components/common/ThaiPatternBackground';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { ReviewItem } from '@/src/types/entities';

const MOCK_ITEMS: ReviewItem[] = [
  { id: '1', char: 'ข', phonetic: 'Khor Khai', meaning: '蛋 (Egg)', type: 'Review' },
  { id: '2', char: 'ค', phonetic: 'Khor Khwai', meaning: '水牛 (Buffalo)', type: 'Hard' },
  { id: '3', char: 'ง', phonetic: 'Ngor Ngu', meaning: '蛇 (Snake)', type: 'New' },
];

export default function ReviewModal() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [completed, setCompleted] = useState(false);

  const currentItem = MOCK_ITEMS[currentIndex];

  const handleNext = () => {
    if (currentIndex < MOCK_ITEMS.length - 1) {
      setIsRevealed(false);
      setTimeout(() => setCurrentIndex(prev => prev + 1), 300);
    } else {
      setCompleted(true);
    }
  };

  if (completed) {
    return (
      <SafeAreaView edges={['top', 'bottom']} style={styles.completedContainer}>
        <ThaiPatternBackground opacity={0.05} />

        <View style={styles.completedCard}>
          <View style={styles.completedIconContainer}>
            <Check size={40} color={Colors.thaiGold} />
          </View>
          <Text style={styles.completedTitle}>完成复习</Text>
          <Text style={styles.completedText}>
            你已经完成了今天的复习任务。继续保持!
          </Text>
          <Pressable
            onPress={() => router.back()}
            style={styles.completedButton}
          >
            <Text style={styles.completedButtonText}>返回主页</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <ThaiPatternBackground opacity={0.04} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerLabel}>Daily Review</Text>
          <Text style={styles.headerProgress}>
            {currentIndex + 1}{' '}
            <Text style={styles.headerProgressTotal}>/ {MOCK_ITEMS.length}</Text>
          </Text>
        </View>
        <Pressable
          onPress={() => router.back()}
          style={styles.closeButton}
        >
          <X size={20} color={Colors.ink} />
        </Pressable>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Character Display */}
        <View
          style={[
            styles.characterContainer,
            isRevealed && styles.characterContainerRevealed,
          ]}
        >
          <View style={styles.characterWrapper}>
            <Text style={styles.characterText}>{currentItem.char}</Text>
            <View style={styles.decorativeCircle} />
          </View>

          {/* Hint */}
          {!isRevealed && (
            <View style={styles.hintContainer}>
              <Text style={styles.hintText}>Do you remember this?</Text>
              <Pressable
                onPress={() => setIsRevealed(true)}
                style={styles.revealButton}
              >
                <Text style={styles.revealButtonText}>查看详情</Text>
                <ArrowRight size={16} color={Colors.ink} />
              </Pressable>
            </View>
          )}
        </View>

        {/* Revealed Content */}
        {isRevealed && (
          <View style={styles.revealedContent}>
            <View style={styles.detailsContainer}>
              <View>
                <Text style={styles.phoneticText}>{currentItem.phonetic}</Text>
                <Text style={styles.meaningText}>{currentItem.meaning}</Text>
              </View>

              <View style={styles.detailsDivider} />

              <View style={styles.metadataGrid}>
                <View style={styles.metadataCard}>
                  <Text style={styles.metadataLabel}>Tone Class</Text>
                  <Text style={styles.metadataValue}>低辅音</Text>
                </View>
                <View style={styles.metadataCard}>
                  <Text style={styles.metadataLabel}>Category</Text>
                  <Text style={styles.metadataValue}>Consonant</Text>
                </View>
              </View>

              <Text style={styles.descriptionText}>
                "Ngor Ngu" 是泰语低辅音之一。发音时,舌根后缩,气流从鼻腔出来,类似于英语单词 "Sing" 结尾的 "ng" 音。
              </Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <Pressable
                onPress={handleNext}
                style={[styles.actionButton, styles.actionButtonWeak]}
              >
                <Text style={styles.actionButtonTextWeak}>模糊</Text>
              </Pressable>
              <Pressable
                onPress={handleNext}
                style={[styles.actionButton, styles.actionButtonMedium]}
              >
                <Text style={styles.actionButtonTextMedium}>记得</Text>
              </Pressable>
              <Pressable
                onPress={handleNext}
                style={[styles.actionButton, styles.actionButtonStrong]}
              >
                <Text style={styles.actionButtonTextStrong}>简单</Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.paper,
  },
  completedContainer: {
    flex: 1,
    backgroundColor: Colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedCard: {
    width: '90%',
    maxWidth: 384,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 40,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.sand,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    zIndex: 10,
  },
  completedIconContainer: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    marginBottom: 24,
  },
  completedTitle: {
    fontFamily: Typography.playfairRegular,
    fontSize: 30,
    color: Colors.ink,
    marginBottom: 12,
  },
  completedText: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 16,
    lineHeight: 24,
    color: Colors.taupe,
    textAlign: 'center',
    marginBottom: 32,
  },
  completedButton: {
    width: '100%',
    paddingVertical: 16,
    backgroundColor: Colors.ink,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  completedButtonText: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.white,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    zIndex: 20,
  },
  headerLabel: {
    fontFamily: Typography.playfairRegular,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: Colors.taupe,
    textTransform: 'uppercase',
  },
  headerProgress: {
    fontFamily: Typography.playfairRegular,
    fontSize: 18,
    color: Colors.ink,
  },
  headerProgressTotal: {
    fontSize: 14,
    color: Colors.taupe,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.sand,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 32,
    paddingBottom: 32,
  },
  characterContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  characterContainerRevealed: {
    marginTop: 16,
    transform: [{ scale: 0.75 }],
  },
  characterWrapper: {
    position: 'relative',
  },
  characterText: {
    fontFamily: Typography.sarabunRegular,
    fontSize: 160,
    lineHeight: 160,
    color: Colors.ink,
  },
  decorativeCircle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 256,
    height: 256,
    marginTop: -128,
    marginLeft: -128,
    borderRadius: 128,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    opacity: 0.5,
    transform: [{ scale: 1.5 }],
    zIndex: -10,
  },
  hintContainer: {
    marginTop: 48,
    alignItems: 'center',
  },
  hintText: {
    fontFamily: Typography.playfairRegular,
    fontSize: 16,
    fontStyle: 'italic',
    color: Colors.taupe,
    marginBottom: 16,
  },
  revealButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  revealButtonText: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.ink,
  },
  revealedContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  detailsContainer: {
    width: '100%',
    maxWidth: 448,
    alignSelf: 'center',
  },
  phoneticText: {
    fontFamily: Typography.playfairRegular,
    fontSize: 36,
    color: Colors.ink,
    marginBottom: 4,
  },
  meaningText: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 18,
    fontWeight: '500',
    color: Colors.thaiGold,
  },
  detailsDivider: {
    width: 64,
    height: 1,
    backgroundColor: Colors.sand,
    marginVertical: 24,
    alignSelf: 'center',
  },
  metadataGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  metadataCard: {
    flex: 1,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 1,
    borderColor: Colors.sand,
    borderRadius: 12,
  },
  metadataLabel: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 10,
    letterSpacing: 1.5,
    color: Colors.taupe,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  metadataValue: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 16,
    color: Colors.ink,
  },
  descriptionText: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 14,
    lineHeight: 22,
    color: Colors.taupe,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    width: '100%',
    maxWidth: 448,
    alignSelf: 'center',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonWeak: {
    borderWidth: 1,
    borderColor: '#FECACA',
    backgroundColor: 'rgba(254, 202, 202, 0.5)',
  },
  actionButtonTextWeak: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 14,
    color: '#991B1B',
  },
  actionButtonMedium: {
    borderWidth: 1,
    borderColor: Colors.sand,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  actionButtonTextMedium: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 14,
    color: Colors.ink,
  },
  actionButtonStrong: {
    backgroundColor: Colors.ink,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonTextStrong: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 14,
    color: Colors.white,
  },
});