// src/components/common/FloatingBubbles.tsx
import React from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import { Sparkles, PlayCircle } from 'lucide-react-native';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { ReviewItem } from '../../entities/types/entities';

interface FloatingBubblesProps {
  reviews: ReviewItem[];
  onOpenReview: () => void;
}

const { width } = Dimensions.get('window');

export const FloatingBubbles: React.FC<FloatingBubblesProps> = ({
  reviews,
  onOpenReview,
}) => {
  if (reviews.length === 0) return null;

  return (
    <View style={styles.container}>
      {/* Floating Title */}
      <View style={styles.titleContainer}>
        <View style={styles.titleBadge}>
          <Sparkles size={12} color={Colors.thaiGold} />
          <Text style={styles.titleText}>待复习内容</Text>
        </View>
      </View>

      {/* Card Stack */}
      <View>
        <Pressable
          onPress={onOpenReview}
          style={styles.cardStackContainer}
        >
          {reviews.slice(0, 3).reverse().map((review, index) => (
            <Card key={review.id} review={review} index={index} />
          ))}

          {/* Notification Badge */}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{reviews.length}</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
};

interface CardProps {
  review: ReviewItem;
  index: number;
}

const Card: React.FC<CardProps> = ({ review, index }) => {
  const offsetY = index * 10;
  const scale = 1 - index * 0.04;
  const cardOpacity = 1 - index * 0.1;
  const rotate = index % 2 === 0 ? '-1.5deg' : '1.5deg';

  return (
    <View
      style={[
        styles.card,
        {
          transform: [
            { translateY: offsetY },
            { scale },
            { rotate },
          ],
          zIndex: 30 - index,
          opacity: cardOpacity,
        },
      ]}
    >
      {/* Content */}
      <View style={styles.cardContent}>
        {/* Top Row */}
        <View style={styles.cardTopRow}>
          <View style={styles.typeTag}>
            <Text style={styles.typeTagText}>
              {review.type === 'New' ? '新词' : '复习'}
            </Text>
          </View>
          <View style={styles.statusDot} />
        </View>

        {/* Middle */}
        <View style={styles.cardMiddleRow}>
          <View>
            <Text style={styles.charText}>{review.char}</Text>
            <Text style={styles.phoneticText}>{review.phonetic}</Text>
          </View>
          <View style={styles.playButton}>
            <PlayCircle size={20} color={Colors.white} />
          </View>
        </View>

        {/* Bottom Progress */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar} />
        </View>
      </View>

      {/* Background Gradient */}
      <View style={styles.backgroundGradient} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 340,
    marginBottom: 32,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  titleContainer: {
    position: 'absolute',
    top: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  titleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(26, 26, 26, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  titleText: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: Colors.white,
  },
  cardStackContainer: {
    width: Math.min(320, width - 48),
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    position: 'absolute',
    width: 256,
    height: 176,
    backgroundColor: Colors.ink,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.2,
    shadowRadius: 40,
    elevation: 10,
  },
  cardContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
    zIndex: 10,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  typeTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  typeTagText: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: Colors.thaiGold,
    textTransform: 'uppercase',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.thaiGold,
  },
  cardMiddleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  charText: {
    fontFamily: Typography.sarabunRegular,
    fontSize: 36,
    lineHeight: 40,
    color: Colors.white,
    marginBottom: 4,
  },
  phoneticText: {
    fontFamily: Typography.playfairRegular,
    fontSize: 14,
    fontStyle: 'italic',
    color: 'rgba(229, 226, 219, 0.8)',
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBarContainer: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 8,
  },
  progressBar: {
    width: '66%',
    height: '100%',
    backgroundColor: Colors.thaiGold,
  },
  backgroundGradient: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },
  badge: {
    position: 'absolute',
    top: -1,
    right: 1,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#DC2626',
    borderWidth: 2,
    borderColor: Colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.white,
  },
});