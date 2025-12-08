// src/entities/types/phonicsRule.types.ts

/**
 * 拼读规则类型定义
 * 
 * 用于V3.0课程方案的拼读规则卡片系统
 * 对应PhonicsRuleCard组件
 * 
 * @version 1.0.0
 * @see thai_letter_curriculum_SRS_integrated.md
 */

import type { QuestionType } from '../enums/QuestionType.enum';

/**
 * 拼读规则ID (对应6课)
 */
export type PhonicsRuleId = 
  | 'rule_1_cv_structure'
  | 'rule_2_leading_vowel'
  | 'rule_3_tone_basics'
  | 'rule_4_consonant_class_tones'
  | 'rule_5_compound_vowels'
  | 'rule_6_special_cases';

/**
 * 拼读规则完整定义
 */
export interface PhonicsRule {
  /** 规则ID */
  id: PhonicsRuleId;
  
  /** 对应课程ID */
  lessonId: string;
  
  /** 规则标题 */
  title: string;
  
  /** 规则内容(数组,每项为一行文本) */
  content: string[];
  
  /** 交互式示例(可选) */
  interactiveExample?: {
    /** 辅音 */
    consonant: string;
    /** 元音 */
    vowel: string;
    /** 组合后的音节 */
    syllable: string;
    /** 发音 */
    pronunciation: string;
    /** 音频URL */
    audioUrl: string;
  };
  
  /** 可视化图表(可选,用于声调规则等) */
  visualChart?: {
    /** 表头 */
    columns: string[];
    /** 数据行 */
    rows: string[][];
    /** 是否可交互(点击播放音频) */
    interactive?: boolean;
  };
  
  /** 显示时长(秒) */
  duration: number;
  
  /** 排序序号 */
  order: number;
}

/**
 * 课程元数据(含拼读规则关联)
 */
export interface LessonMetadata {
  /** 课程ID */
  lessonId: string;
  
  /** 课程标题 */
  title: string;
  
  /** 课程描述 */
  description: string;
  
  /** 辅音列表 */
  consonants: string[];
  
  /** 元音列表 */
  vowels: string[];
  
  /** 声调符号列表 */
  tones: string[];
  
  /** 关联的拼读规则ID */
  phonicsRuleId: PhonicsRuleId;
  
  /** 总字母数 */
  totalCount: number;
  
  /** 最低通过率(0-1) */
  minPassRate: number;
  
  /** Mini Review触发间隔(每N个字母) */
  miniReviewInterval: number;
  
  /** 排序序号 */
  order: number;
}

/**
 * Mini Review 题目定义
 */
export interface MiniReviewQuestion {
  /** 题目ID */
  id: string;
  
  /** 题型 */
  type: QuestionType;
  
  /** 题干 */
  question: string;
  
  /** 副标题(可选) */
  subtitle?: string;
  
  /** 选项 */
  options: Array<{
    /** 选项文本 */
    label: string;
    /** 选项值 */
    value: string;
    /** 示例(可选) */
    example?: string;
  }>;
  
  /** 正确答案 */
  correct: string;
  
  /** 解释(答题后显示) */
  explanation?: string;
  
  /** 音频URL(可选) */
  audioUrl?: string;
  
  /** 声学提示(用于送气音对比等) */
  acousticHint?: {
    /** 是否送气 */
    aspirated?: boolean;
    /** 是否清音 */
    voiceless?: boolean;
    /** 辅音类 */
    class?: 'high' | 'mid' | 'low';
  };
  
  /** 音高可视化(用于声调题) */
  pitchVisualization?: {
    /** 是否启用 */
    enable: boolean;
    /** 答题后显示 */
    showAfterAnswer: boolean;
    /** 音高曲线数据 */
    curve: number[];
  };
}

/**
 * 三轮评估配置
 */
export interface RoundConfig {
  /** 总轮数 */
  totalRounds: 3;
  
  /** 通过率要求(0-1) */
  passRate: 0.90;
  
  /** 每轮最多允许的错误次数 */
  maxErrors: number;
}

/**
 * 三轮评估状态
 */
export interface RoundEvaluationState {
  /** 当前轮数(1/2/3) */
  currentRound: 1 | 2 | 3;
  
  /** 每轮的统计 */
  rounds: Array<{
    /** 轮次编号 */
    roundNumber: number;
    /** 总题数 */
    totalQuestions: number;
    /** 正确数 */
    correctCount: number;
    /** 准确率(0-1) */
    accuracy: number;
    /** 是否通过 */
    passed: boolean;
  }>;
  
  /** 是否完成所有轮次 */
  allRoundsPassed: boolean;
}

/**
 * getTodayMemories 返回的扩展数据
 * (后端需新增此字段)
 */
export interface TodayMemoriesWithMetadata {
  /** 字母列表 */
  items: any[];
  
  /** 统计信息 */
  summary: {
    total: number;
    newCount: number;
    reviewCount: number;
    entityType: string;
  };
  
  /** 新增: 课程元数据 */
  lessonMetadata?: LessonMetadata;
  
  /** 新增: 拼读规则 */
  phonicsRule?: PhonicsRule;
}

/**
 * 最小对立组(Minimal Pair)定义
 * 用于送气音对比题型
 */
export interface MinimalPairGroup {
  /** 核心字母 */
  target: string;
  
  /** 对比字母组 */
  contrasts: Array<{
    /** 字母 */
    char: string;
    /** 对比维度 */
    dimension: 'aspiration' | 'class' | 'voicing';
    /** 说明 */
    label: string;
  }>;
}

/**
 * 元音长短对(Vowel Length Pair)定义
 */
export interface VowelLengthPair {
  /** 短元音 */
  short: {
    char: string;
    duration: number; // ms
    example: string;
  };
  
  /** 长元音 */
  long: {
    char: string;
    duration: number; // ms
    example: string;
  };
}