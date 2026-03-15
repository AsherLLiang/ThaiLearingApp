// src/components/ai/AiExplanationView.tsx
import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import * as Speech from 'expo-speech';
import { Volume2 } from 'lucide-react-native';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import type { ExplainVocabularyResponse } from '@/src/entities/types/ai.types';

interface AiExplanationViewProps {
  data: ExplainVocabularyResponse;
}

export const AiExplanationView: React.FC<AiExplanationViewProps> = ({ data }) => {
  const { t } = useTranslation();

  const speakWord = useCallback((text: string) => {
    Speech.stop();
    Speech.speak(text, { language: 'th-TH', rate: 0.85 });
  }, []);

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* 头部区域：单词和释义 */}
      <View style={styles.header}>
        <Pressable onPress={() => speakWord(data.thaiWord)} style={styles.wordRow}>
          <Text style={styles.thaiWord}>{data.thaiWord}</Text>
          <View style={styles.speakerIcon}>
            <Volume2 size={20} color={Colors.thaiGold} />
          </View>
        </Pressable>
        {data.pronunciation ? (
          <View style={styles.pronunciationBadge}>
            <Text style={styles.pronunciationText}>{data.pronunciation}</Text>
          </View>
        ) : null}
      </View>
      
      <Text style={styles.meaningText}>{data.meaning}</Text>

      {/* 记忆卡片区域 */}
      {data.breakdown ? (
         <View style={styles.card}>
            <Text style={styles.cardTitle}>{t('ai.analysis')}</Text>
            <Text style={styles.cardContent}>{data.breakdown}</Text>
         </View>
      ) : null}

      {/* 场景例句区域 */}
      {data.extraExamples && data.extraExamples.length > 0 ? (
         <View style={styles.card}>
            <Text style={styles.cardTitle}>{t('ai.examples')}</Text>
            {data.extraExamples.map((ex, index) => (
              <View key={index} style={styles.exampleItem}>
                 <Text style={styles.exampleScene}>【{ex.scene}】</Text>
                 <Pressable onPress={() => speakWord(ex.thai)} style={styles.exampleThaiRow}>
                   <Text style={styles.exampleThai}>{ex.thai}</Text>
                   <Volume2 size={14} color={Colors.taupe} />
                 </Pressable>
                 <Text style={styles.exampleChinese}>{ex.chinese}</Text>
              </View>
            ))}
         </View>
      ) : null}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.paper,
  },
  contentContainer: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
  },
  wordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  thaiWord: {
    fontFamily: Typography.sarabunBold,
    fontSize: 50,
    color: Colors.ink,
  },
  speakerIcon: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },
  pronunciationBadge: {
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  pronunciationText: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 32,
    color: Colors.thaiGold,
  },
  meaningText: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 18,
    color: Colors.taupe,
    marginBottom: 32,
  },
  card: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.sand,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTitle: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 14,
    color: Colors.thaiGold,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  cardContent: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 15,
    lineHeight: 24,
    color: Colors.ink,
  },
  exampleItem: {
    marginBottom: 16,
  },
  exampleScene: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 12,
    color: Colors.taupe,
    marginBottom: 4,
  },
  exampleThaiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  exampleThai: {
    fontFamily: Typography.sarabunRegular,
    fontSize: 18,
    color: Colors.ink,
  },
  exampleChinese: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 14,
    color: Colors.taupe,
  }
});
