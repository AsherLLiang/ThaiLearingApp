// src/config/alphabet/lessonMetadata.config.ts

import type { LessonMetadata } from '@/src/entities/types/phonicsRule.types';

/**
 * 6课元数据完整配置
 * 
 * 定义每课的字母组成、拼读规则关联、通过率要求等
 * 
 * @version 1.0.0
 * @see SEQUENCE_LESSONS
 */
export const LESSON_METADATA: Record<string, LessonMetadata> = {
  /**
   * Lesson 1: 基础拼读能力(5辅音+3元音)
   */
  lesson1: {
    lessonId: 'lesson1',
    title: '第一课:基础拼读能力',
    description: '掌握最基础的中辅音和常见长元音,建立CV拼读概念',
    consonants: ['ก', 'ด', 'ต', 'น', 'ม'],
    vowels: ['า', 'ี', 'ู','ี'],
    tones: [],
    phonicsRuleId: 'rule_1_cv_structure',
    totalCount: 9,
    minPassRate: 0.95,
    miniReviewInterval: 3,
    order: 1,
  },

  /**
   * Lesson 2: 前置元音系统(6辅音+4元音)
   */
  lesson2: {
    lessonId: 'lesson2',
    title: '第二课:前置元音系统',
    description: '学习前置元音(เ แ โ)和更多高频辅音',
    consonants: ['บ', 'ป', 'ร', 'ล', 'ว', 'ย'],
    vowels: ['เ', 'แ', 'โ', 'อ'],
    tones: [],
    phonicsRuleId: 'rule_2_leading_vowel',
    totalCount: 10,
    minPassRate: 0.90,
    miniReviewInterval: 3,
    order: 2,
  },

  /**
   * Lesson 3: 声调入门+送气对比(5辅音+3元音+2声调)
   */
  lesson3: {
    lessonId: 'lesson3',
    title: '第三课:声调入门',
    description: '掌握送气/不送气对比,引入基础声调系统',
    consonants: ['ข', 'ถ', 'ผ', 'ส', 'ห'],
    vowels: ['ะ', 'ุ', 'ึ'],
    tones: ['่', '้'],
    phonicsRuleId: 'rule_3_tone_basics',
    totalCount: 10,
    minPassRate: 0.90,
    miniReviewInterval: 3,
    order: 3,
  },

  /**
   * Lesson 4: 辅音类与声调规则(6辅音+4元音+2声调)
   */
  lesson4: {
    lessonId: 'lesson4',
    title: '第四课:辅音类与声调',
    description: '理解高/中/低辅音对声调的影响,掌握完整声调系统',
    consonants: ['ค', 'ท', 'พ', 'ช', 'จ', 'ง'],
    vowels: ['ไ', 'ใ', 'เอา', 'อำ'],
    tones: ['๊', '๋'],
    phonicsRuleId: 'rule_4_consonant_class_tones',
    totalCount: 12,
    minPassRate: 0.85,
    miniReviewInterval: 3,
    order: 4,
  },

  /**
   * Lesson 5: 复合元音系统(8辅音+6元音)
   */
  lesson5: {
    lessonId: 'lesson5',
    title: '第五课:复合元音系统',
    description: '掌握三合元音(เอีย เอือ อัว)等复杂元音组合',
    consonants: ['ซ', 'ฉ', 'ฝ', 'ฟ', 'ศ', 'ษ', 'ฮ', 'อ'],
    vowels: ['เอีย', 'เอือ', 'อัว', 'เออ', 'ื', 'อ'],
    tones: [],
    phonicsRuleId: 'rule_5_compound_vowels',
    totalCount: 14,
    minPassRate: 0.85,
    miniReviewInterval: 3,
    order: 5,
  },

  /**
   * Lesson 6: 完整覆盖+特殊规则(14辅音+12元音)
   * 说明:
   * - 此课元音组用于训练「短元音变形」与 Dead Syllable 规则；
   * - 其中 'อัว' 在这里代表实际拼写模式「ัวะ」(短 ua)，
   *   由于 letters 数据集中不存在独立字形「ัวะ」，故用 'อัว' 作为代表符号。
   */
  lesson6: {
    lessonId: 'lesson6',
    title: '第六课:完整覆盖(常用进阶)',
    description: '补充常用进阶辅音与复合元音,掌握特殊规则(如 ห นำ 等)',
    consonants: [
      // 低辅音清音(梵文借词) + 常用进阶辅音
      'ฑ', 'ฒ', 'ณ', 'ภ', 'ธ', 'ฌ', 'ญ', 'ฬ', 'ฎ', 'ฏ', 'ฐ',
    ],
    vowels: [
      // 核心变形短元音组
      'โอะ', 'เอะ', 'แอะ', 'เอาะ', 'อัว',
    ],
    tones: [],
    phonicsRuleId: 'rule_6_special_cases',
    totalCount: 16,
    minPassRate: 0.90,
    miniReviewInterval: 4,
    order: 6,
  },

  /**
   * Lesson 7: 罕用/古体字母与复杂元音
   * 仅作为补充课程,不参与其他模块解锁
   */
  lesson7: {
    lessonId: 'lesson7',
    title: '第七课:罕用字母与特殊元音',
    description: '集中学习现代泰语中较少使用的辅音与复杂元音,用于阅读古文与特殊专有名词',
    consonants: [
      // 已弃用或极少使用的辅音
      'ฃ', 'ฅ',
    ],
    vowels: [
      // 梵文/巴利借词中的特殊元音
      'ฤ', 'ฤๅ', 'ฦ', 'ฦๅ',
    ],
    tones: [],
    phonicsRuleId: 'rule_6_special_cases',
    totalCount: 6,
    minPassRate: 0.80,
    miniReviewInterval: 4,
    order: 7,
  },
};

/**
 * 根据课程ID获取元数据
 */
export function getLessonMetadata(lessonId: string): LessonMetadata | null {
  return LESSON_METADATA[lessonId] || null;
}

/**
 * 获取所有课程元数据(按顺序)
 */
export function getAllLessons(): LessonMetadata[] {
  return Object.values(LESSON_METADATA).sort((a, b) => a.order - b.order);
}

/**
 * 根据字母获取所属课程
 */
export function getLessonByLetter(thaiChar: string): LessonMetadata | null {
  for (const lesson of Object.values(LESSON_METADATA)) {
    const allLetters = [
      ...lesson.consonants,
      ...lesson.vowels,
      ...lesson.tones,
    ];
    
    if (allLetters.includes(thaiChar)) {
      return lesson;
    }
  }
  
  return null;
}

/**
 * 获取课程统计
 */
export function getLessonStatistics() {
  const lessons = Object.values(LESSON_METADATA);
  
  return {
    totalLessons: lessons.length,
    totalConsonants: lessons.reduce((sum, l) => sum + l.consonants.length, 0),
    totalVowels: lessons.reduce((sum, l) => sum + l.vowels.length, 0),
    totalTones: lessons.reduce((sum, l) => sum + l.tones.length, 0),
    totalLetters: lessons.reduce((sum, l) => sum + l.totalCount, 0),
  };
}
