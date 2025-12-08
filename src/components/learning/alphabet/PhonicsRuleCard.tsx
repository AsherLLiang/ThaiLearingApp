// src/components/learning/alphabet/PhonicsRuleCard.tsx

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { Audio } from 'expo-av';
import { X } from 'lucide-react-native';

import type { PhonicsRule } from '@/src/entities/types/phonicsRule.types';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';

// ==================== Props 接口 ====================

interface PhonicsRuleCardProps {
  /** 拼读规则数据 */
  rule: PhonicsRule;
  
  /** 完成回调(倒计时结束或用户点击继续) */
  onComplete: () => void;
  
  /** 是否显示关闭按钮(可选,默认false) */
  showCloseButton?: boolean;
  
  /** 关闭回调(可选) */
  onClose?: () => void;
}

// ==================== 主组件 ====================

export function PhonicsRuleCard({
  rule,
  onComplete,
  showCloseButton = false,
  onClose,
}: PhonicsRuleCardProps) {
  const [timeLeft, setTimeLeft] = useState(rule.duration);
  const [isPlaying, setIsPlaying] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);

  // ===== 倒计时逻辑 =====
  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  // ===== 音频播放 =====
  const handlePlayExample = useCallback(async () => {
    if (!rule.interactiveExample?.audioUrl) return;

    try {
      setIsPlaying(true);

      // 如果已有音频实例,直接重播
      if (soundRef.current) {
        await soundRef.current.replayAsync();
        setIsPlaying(false);
        return;
      }

      // 创建新音频实例
      const { sound } = await Audio.Sound.createAsync(
        { uri: rule.interactiveExample.audioUrl },
        { shouldPlay: true }
      );

      soundRef.current = sound;

      // 监听播放完成
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    } catch (error) {
      console.warn('[PhonicsRuleCard] 播放音频失败:', error);
      setIsPlaying(false);
    }
  }, [rule.interactiveExample]);

  // ===== 清理音频资源 =====
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
        soundRef.current = null;
      }
    };
  }, []);

  // ===== 渲染可视化图表 =====
  const renderVisualChart = () => {
    if (!rule.visualChart) return null;

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>声调规则表</Text>
        
        {/* 表头 */}
        <View style={styles.chartRow}>
          {rule.visualChart.columns.map((col, index) => (
            <View
              key={index}
              style={[
                styles.chartCell,
                styles.chartHeaderCell,
                index === 0 && styles.chartFirstColumn,
              ]}
            >
              <Text style={styles.chartHeaderText}>{col}</Text>
            </View>
          ))}
        </View>

        {/* 数据行 */}
        {rule.visualChart.rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.chartRow}>
            {row.map((cell, cellIndex) => {
              const isFirstColumn = cellIndex === 0;
              const isInteractive = rule.visualChart?.interactive && !isFirstColumn;

              return (
                <Pressable
                  key={cellIndex}
                  style={[
                    styles.chartCell,
                    isFirstColumn && styles.chartFirstColumn,
                    isInteractive && styles.chartInteractiveCell,
                  ]}
                  disabled={!isInteractive}
                  onPress={() => {
                    if (isInteractive) {
                      // 未来可扩展:点击单元格播放对应声调示例
                      console.log('Play tone example:', row[0], cell);
                    }
                  }}
                >
                  <Text
                    style={[
                      styles.chartCellText,
                      isFirstColumn && styles.chartFirstColumnText,
                      !isFirstColumn && styles.chartToneText,
                    ]}
                  >
                    {cell}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        {/* 关闭按钮 */}
        {showCloseButton && (
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="关闭规则卡片"
          >
            <X size={24} color={Colors.taupe} />
          </TouchableOpacity>
        )}

        {/* 倒计时显示 */}
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{timeLeft}秒</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
        >
          {/* 标题 */}
          <Text style={styles.title}>{rule.title}</Text>

          {/* 规则内容 */}
          <View style={styles.contentContainer}>
            {rule.content.map((line, index) => (
              <Text
                key={index}
                style={[
                  styles.contentLine,
                  line === '' && styles.emptyLine,
                ]}
              >
                {line}
              </Text>
            ))}
          </View>

          {/* 交互式示例 */}
          {rule.interactiveExample && (
            <View style={styles.exampleContainer}>
              <Text style={styles.exampleLabel}>📌 交互示例</Text>
              <Pressable
                style={styles.exampleButton}
                onPress={handlePlayExample}
                disabled={isPlaying}
                accessibilityRole="button"
                accessibilityLabel={`播放示例: ${rule.interactiveExample.syllable}`}
              >
                {isPlaying ? (
                  <ActivityIndicator size="small" color={Colors.white} />
                ) : (
                  <>
                    <View style={styles.exampleParts}>
                      <Text style={styles.exampleConsonant}>
                        {rule.interactiveExample.consonant}
                      </Text>
                      <Text style={styles.examplePlus}>+</Text>
                      <Text style={styles.exampleVowel}>
                        {rule.interactiveExample.vowel}
                      </Text>
                      <Text style={styles.exampleEquals}>=</Text>
                      <Text style={styles.exampleSyllable}>
                        {rule.interactiveExample.syllable}
                      </Text>
                    </View>
                    <Text style={styles.examplePronunciation}>
                      [{rule.interactiveExample.pronunciation}]
                    </Text>
                  </>
                )}
              </Pressable>
            </View>
          )}

          {/* 可视化图表 */}
          {renderVisualChart()}
        </ScrollView>

        {/* 继续按钮 */}
        <TouchableOpacity
          style={styles.continueButton}
          onPress={onComplete}
          accessibilityRole="button"
          accessibilityLabel="明白了,继续学习"
        >
          <Text style={styles.continueText}>明白了,继续学习 →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ==================== 样式 ====================

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  card: {
    width: '90%',
    maxWidth: 500,
    maxHeight: '85%',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    padding: 8,
  },
  timerContainer: {
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  timerText: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 14,
    color: Colors.taupe,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  title: {
    fontFamily: Typography.playfairBold,
    fontSize: 22,
    color: Colors.thaiGold,
    marginBottom: 20,
    textAlign: 'center',
  },
  contentContainer: {
    marginBottom: 20,
  },
  contentLine: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 16,
    lineHeight: 24,
    color: Colors.ink,
    marginBottom: 4,
  },
  emptyLine: {
    height: 8,
  },
  exampleContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  exampleLabel: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 14,
    color: Colors.taupe,
    marginBottom: 12,
  },
  exampleButton: {
    backgroundColor: Colors.thaiGold,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    minHeight: 60,
    justifyContent: 'center',
  },
  exampleParts: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  exampleConsonant: {
    fontFamily: Typography.playfairBold,
    fontSize: 32,
    color: Colors.white,
  },
  examplePlus: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 24,
    color: 'rgba(255, 255, 255, 0.7)',
    marginHorizontal: 8,
  },
  exampleVowel: {
    fontFamily: Typography.playfairBold,
    fontSize: 32,
    color: Colors.white,
  },
  exampleEquals: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 24,
    color: 'rgba(255, 255, 255, 0.7)',
    marginHorizontal: 8,
  },
  exampleSyllable: {
    fontFamily: Typography.playfairBold,
    fontSize: 36,
    color: Colors.white,
  },
  examplePronunciation: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  chartContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.sand,
    borderRadius: 8,
    overflow: 'hidden',
  },
  chartTitle: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 16,
    color: Colors.ink,
    padding: 12,
    backgroundColor: '#F5F5F5',
    textAlign: 'center',
  },
  chartRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.sand,
  },
  chartCell: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 48,
  },
  chartHeaderCell: {
    backgroundColor: '#FFF9E6',
  },
  chartFirstColumn: {
    backgroundColor: '#F5F5F5',
    flex: 1.2,
  },
  chartInteractiveCell: {
    backgroundColor: '#F0F8FF',
  },
  chartHeaderText: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 14,
    color: Colors.ink,
    textAlign: 'center',
  },
  chartCellText: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 14,
    color: Colors.ink,
    textAlign: 'center',
  },
  chartFirstColumnText: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 14,
    color: Colors.thaiGold,
  },
  chartToneText: {
    fontFamily: Typography.playfairBold,
    fontSize: 24,
    color: Colors.ink,
  },
  continueButton: {
    backgroundColor: Colors.thaiGold,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  continueText: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 16,
    color: Colors.white,
  },
});