// src/config/alphabet/phonicsRules.config.ts

import type { PhonicsRule, PhonicsRuleId } from '@/src/entities/types/phonicsRule.types';

/**
 * 6课拼读规则完整配置
 * 
 * 每课一个拼读规则,在Today Learning首次进入时显示
 * 
 * @version 1.0.0
 * @see PhonicsRuleCard.tsx
 */
export const PHONICS_RULES: Record<PhonicsRuleId, PhonicsRule> = {
  /**
   * Lesson 1: 基础拼读 - CV结构
   */
  rule_1_cv_structure: {
    id: 'rule_1_cv_structure',
    lessonId: 'lesson1',
    title: '拼读规则 1: 辅音+元音',
    content: [
      '✅ 泰语音节 = 辅音(C) + 元音(V)',
      '✅ 元音可在辅音前/后/上/下',
      '✅ 例: ก + า = กา [ka:] (乌鸦)',
      '',
      '🎯 记忆口诀: 先读辅音,再读元音',
    ],
    interactiveExample: {
      consonant: 'ก',
      vowel: 'า',
      syllable: 'กา',
      pronunciation: 'ka:',
      audioUrl: 'https://636c-cloud1-1gjcyrdd7ab927c6-1387301748.tcb.qcloud.la/alphabet/word-ka.mp3',
    },
    duration: 30,
    order: 1,
  },

  /**
   * Lesson 2: 前置元音系统
   */
  rule_2_leading_vowel: {
    id: 'rule_2_leading_vowel',
    lessonId: 'lesson2',
    title: '拼读规则 2: 前置元音',
    content: [
      '⚠️ 写在辅音前,读在辅音后',
      '',
      '✅ เก = [ke:] 不是 [ek]',
      '✅ แม = [mɛ:] 不是 [ɛm]',
      '✅ โร = [ro:] 不是 [or]',
      '',
      '🎯 记忆口诀: 看到 เ แ โ,先读辅音再读元音',
    ],
    interactiveExample: {
      consonant: 'ก',
      vowel: 'เ',
      syllable: 'เก',
      pronunciation: 'ke:',
      audioUrl: 'https://636c-cloud1-1gjcyrdd7ab927c6-1387301748.tcb.qcloud.la/alphabet/syllable-ke.mp3',
    },
    duration: 30,
    order: 2,
  },

  /**
   * Lesson 3: 声调系统入门
   */
  rule_3_tone_basics: {
    id: 'rule_3_tone_basics',
    lessonId: 'lesson3',
    title: '拼读规则 3: 声调入门',
    content: [
      '🎵 泰语5个声调:',
      '  1. 中平调 ¯ (如: กา [ka:¯])',
      '  2. 低降调 ` (如: ก่า [kà:])',
      '  3. 降调 ˆ (如: ก้า [kâ:])',
      '  4. 高调 ´ (如: ก๊า [ká:])',
      '  5. 升调 ˇ (如: ก๋า [kǎ:])',
      '',
      '📌 声调由4个因素决定:',
      '  • 辅音类(高/中/低)',
      '  • 元音长短',
      '  • 声调符号(่ ้ ๊ ๋)',
      '  • 音节类型(Live/Dead)',
    ],
    visualChart: {
      columns: ['辅音类', '长+无', '短+无', '่', '้'],
      rows: [
        ['中辅音', '¯', '`', '`', 'ˆ'],
        ['高辅音', '´', '`', '`', 'ˆ'],
      ],
      interactive: true,
    },
    duration: 45,
    order: 3,
  },

  /**
   * Lesson 4: 辅音类与声调规则
   */
  rule_4_consonant_class_tones: {
    id: 'rule_4_consonant_class_tones',
    lessonId: 'lesson4',
    title: '拼读规则 4: 辅音类与声调',
    content: [
      '🔑 核心概念: 同样的元音+符号,不同辅音类 → 不同声调',
      '',
      '例: า + 无符号',
      '  • ก + า = กา [中平¯] (中辅音)',
      '  • ข + า = ขา [升调´] (高辅音)',
      '  • ค + า = คา [中平¯] (低辅音)',
      '',
      '🎯 学习策略:',
      '  1. 先记辅音类(高/中/低)',
      '  2. 再查声调表',
      '  3. 多听多练,形成直觉',
    ],
    visualChart: {
      columns: ['辅音类', '长+无', '短+无', '่', '้', '๊', '๋'],
      rows: [
        ['中辅音', '¯', '`', '`', 'ˆ', '´', 'ˇ'],
        ['高辅音', '´', '`', '`', 'ˆ', '-', '-'],
        ['低辅音', '¯', '´', 'ˆ', '´', '-', '-'],
      ],
      interactive: true,
    },
    duration: 45,
    order: 4,
  },

  /**
   * Lesson 5: 复合元音拼读
   */
  rule_5_compound_vowels: {
    id: 'rule_5_compound_vowels',
    lessonId: 'lesson5',
    title: '拼读规则 5: 复合元音',
    content: [
      '🔗 复合元音 = 2-3个元音符号组合',
      '',
      '✅ เอีย [ia]: เ + ี + ย',
      '   例: เมีย [mia] (妻子)',
      '',
      '✅ เอือ [ɯa]: เ + ื + อ',
      '   例: เมือง [mɯaŋ] (城市)',
      '',
      '✅ อัว [ua]: ั + ว',
      '   例: ควาย [khwaːy] (水牛)',
      '',
      '📌 拼读技巧: 先读辅音,再滑过整个复合元音',
    ],
    interactiveExample: {
      consonant: 'ม',
      vowel: 'เอีย',
      syllable: 'เมีย',
      pronunciation: 'mia',
      audioUrl: 'https://636c-cloud1-1gjcyrdd7ab927c6-1387301748.tcb.qcloud.la/alphabet/word-mia.mp3',
    },
    duration: 30,
    order: 5,
  },

  /**
   * Lesson 6: 特殊规则汇总
   */
  rule_6_special_cases: {
    id: 'rule_6_special_cases',
    lessonId: 'lesson6',
    title: '拼读规则 6: 特殊规则',
    content: [
      '🔸 ญ: 作声母读 [y],作尾音读 [n]',
      '   例: ญาติ [yâːt] (亲戚), หญิง [yǐŋ] (女人)',
      '',
      '🔸 ฤ/ฦ: 梵文专用,现代泰语少见',
      '   例: ฤดู [rɯ́dùː] (季节)',
      '',
      '🔸 ห + 低辅音: 变高调规则',
      '   例: หนู [nǔː] = ห(静音) + นู (变高调)',
      '',
      '🔸 ไ/ใ: 同音不同形,ใ仅28个词',
      '   例: ใกล้ [klây] (近), ไกล [klay] (远)',
    ],
    duration: 40,
    order: 6,
  },
};

/**
 * 根据课程ID获取拼读规则
 */
export function getPhonicsRuleByLesson(lessonId: string): PhonicsRule | null {
  const ruleId = `rule_${lessonId.replace('lesson', '')}_` as PhonicsRuleId;
  
  const ruleMap: Record<string, PhonicsRuleId> = {
    lesson1: 'rule_1_cv_structure',
    lesson2: 'rule_2_leading_vowel',
    lesson3: 'rule_3_tone_basics',
    lesson4: 'rule_4_consonant_class_tones',
    lesson5: 'rule_5_compound_vowels',
    lesson6: 'rule_6_special_cases',
  };
  
  const actualRuleId = ruleMap[lessonId];
  return actualRuleId ? PHONICS_RULES[actualRuleId] : null;
}

/**
 * 获取所有拼读规则(按顺序)
 */
export function getAllPhonicsRules(): PhonicsRule[] {
  return Object.values(PHONICS_RULES).sort((a, b) => a.order - b.order);
}