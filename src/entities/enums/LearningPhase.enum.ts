// src/entities/enums/LearningPhase.enum.ts

/**
 * 学习阶段枚举
 * 
 * 用于字母学习的7阶段流程 + 测试相关阶段
 * 对应V3.0课程方案的完整流程
 * 
 * @version 2.0.0
 * @see project-snapshot-v2.0.0-V10.md 第7节 学习流程
 */
export enum LearningPhase {
  // ===== 初始状态 =====
  IDLE = 'IDLE',
  LOADING = 'LOADING',

  // ===== 7阶段学习流程 =====
  YESTERDAY_REVIEW = 'yesterday-review',
  YESTERDAY_REMEDY = 'yesterday-remedy',
  TODAY_LEARNING = 'today-learning',
  TODAY_MINI_REVIEW = 'today-mini-review',
  TODAY_FINAL_REVIEW = 'today-final-review',
  TODAY_REMEDY = 'today-remedy',
  ROUND_EVALUATION = 'round-evaluation',

  // ===== 测试相关(用于课程测试) =====
  TEST_PROMPT = 'test-prompt',
  TESTING = 'testing',
  TEST_RESULT = 'test-result',

  // ===== 单词模块专用 =====
  VOCAB_IDLE = 'vocab-idle',
  VOCAB_LOADING = 'vocab-loading',
  VOCAB_LEARNING = 'vocab-learning', // 学习中
  VOCAB_REVIEW = 'vocab-review',     // 复习中  
  VOCAB_COMPLETED = 'vocab-completed',

  // ===== 完成状态 =====
  FINISHED = 'finished',
  COMPLETED = 'COMPLETED',
}

/**
 * Phase 类型(用于类型守卫)
 * 对应AlphabetLearningEngineView中使用的字符串字面量
 */
export type Phase =
  | 'yesterday-review'
  | 'yesterday-remedy'
  | 'today-learning'
  | 'today-mini-review'
  | 'today-final-review'
  | 'today-remedy'
  | 'round-evaluation'
  | 'finished';

/**
 * Phase 显示文案映射
 */
export const PHASE_LABELS: Record<Phase, string> = {
  'yesterday-review': '昨日复习',
  'yesterday-remedy': '昨日补救',
  'today-learning': '今日学习',
  'today-mini-review': '小复习',
  'today-final-review': '末尾复习',
  'today-remedy': '今日补救',
  'round-evaluation': '轮次评估',
  'finished': '完成',
};

/**
 * Phase 图标映射(用于UI显示)
 */
export const PHASE_ICONS: Record<Phase, string> = {
  'yesterday-review': '🔄',
  'yesterday-remedy': '🔧',
  'today-learning': '📚',
  'today-mini-review': '✨',
  'today-final-review': '🎯',
  'today-remedy': '💪',
  'round-evaluation': '📊',
  'finished': '🎉',
};

/**
 * Phase 进度权重(用于进度条计算)
 */
export const PHASE_PROGRESS_WEIGHTS: Record<Phase, number> = {
  'yesterday-review': 0.1,
  'yesterday-remedy': 0.15,
  'today-learning': 0.4,
  'today-mini-review': 0.5,
  'today-final-review': 0.7,
  'today-remedy': 0.85,
  'round-evaluation': 0.95,
  'finished': 1.0,
};

/**
 * 判断是否为复习阶段
 */
export function isReviewPhase(phase: Phase): boolean {
  return [
    'yesterday-review',
    'yesterday-remedy',
    'today-mini-review',
    'today-final-review',
    'today-remedy',
  ].includes(phase);
}

/**
 * 判断是否为学习阶段
 */
export function isLearningPhase(phase: Phase): boolean {
  return phase === 'today-learning';
}

/**
 * 判断是否为补救阶段
 */
export function isRemedyPhase(phase: Phase): boolean {
  return ['yesterday-remedy', 'today-remedy'].includes(phase);
}

/**
 * 获取下一个阶段
 */
export function getNextPhase(currentPhase: Phase): Phase | null {
  const phaseSequence: Phase[] = [
    'yesterday-review',
    'yesterday-remedy',
    'today-learning',
    'today-mini-review',
    'today-final-review',
    'today-remedy',
    'round-evaluation',
    'finished',
  ];

  const currentIndex = phaseSequence.indexOf(currentPhase);
  if (currentIndex === -1 || currentIndex === phaseSequence.length - 1) {
    return null;
  }

  return phaseSequence[currentIndex + 1];
}