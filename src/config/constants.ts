// src/config/constants.ts

/**
 * 应用常量配置
 *
 * 目标：
 * 1. 统一管理全局常量（集合名 / 超时 / 文本等），避免在代码中散落硬编码字符串；
 * 2. COLLECTIONS 中只放“真实存在或规划中的集合名”，并通过注释区分「已使用」与「预留/废弃」。
 */

// ==================== 数据库集合名称 ====================
export const COLLECTIONS = {
  // ===== 核心用户与进度集合（CloudBase 已实际使用） =====
  USERS: 'users',
  USER_PROGRESS: 'user_progress',
  USER_ALPHABET_PROGRESS: 'user_alphabet_progress',
  USER_VOCABULARY_PROGRESS: 'user_vocabulary_progress',

  // ===== 学习实体集合（CloudBase 已实际使用） =====
  LETTERS: 'letters',
  VOCABULARY: 'vocabulary',
  VOCABULARIES: 'vocabularies', // 特定 handler（getSkippedWords）使用的词汇集合
  SENTENCES: 'sentences',
  MEMORY_STATUS: 'memory_status',

  // ===== 字母课程与拼读规则（已迁移的课程配置） =====
  ALPHABET_LESSONS: 'alphabet_lessons',
  PHONICS_RULES: 'phonics_rules',

  // ===== 字母测试相关 =====
  LETTER_TEST_BANK: 'letter_test_bank',

  // ===== 预留 / 规划中的集合（当前代码中未实际使用） =====
  COURSES: 'courses',
  LESSONS: 'lessons',
  EXERCISES: 'exercises',
  ARTICLES: 'articles',
  PRONUNCIATION_RECORDS: 'pronunciationRecords',
  PROGRESS: 'progress',
  REVIEW_SCHEDULES: 'reviewSchedules',
  LEARNING_RECORDS: 'learningRecords',

  // ===== 已废弃命名（仅兼容旧版本，不推荐再使用） =====
  // 旧版字母集合，现已统一使用 LETTERS: 'letters'
  ALPHABETS: 'alphabets',
} as const;

// ==================== API 超时配置 ====================
export const API_TIMEOUT = {
  DEFAULT: 10000,   // 10 秒 - 一般请求
  UPLOAD: 30000,    // 30 秒 - 文件上传
  LONG: 60000,      // 60 秒 - 长时间操作（如发音评估）
};

// ==================== 错误消息 ====================
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接失败，请检查您的网络。',
  TIMEOUT_ERROR: '请求超时，请稍后重试。',
  AUTH_ERROR: '身份验证失败，请重新登录。',
  TOKEN_EXPIRED: '登录已过期，请重新登录。',
  SERVER_ERROR: '服务器错误，请稍后重试。',
  INVALID_INPUT: '输入信息不完整或格式错误。',
  UNKNOWN_ERROR: '未知错误，请联系客服。',
};

// ==================== 用户角色 ====================
export const USER_ROLES = {
  LEARNER: 'LEARNER',
  ADMIN: 'ADMIN',
} as const;

// ==================== 学习等级 ====================
export const LEVELS = {
  BEGINNER_A: 'BEGINNER_A',
  BEGINNER_B: 'BEGINNER_B',
  INTERMEDIATE: 'INTERMEDIATE',
  ADVANCED: 'ADVANCED',
} as const;

// ==================== 掌握程度 ====================
export const MASTER_LEVELS = {
  NOT_LEARNED: 'NOT_LEARNED',
  LEARNING: 'LEARNING',
  REVIEWING: 'REVIEWING',
  MASTERED: 'MASTERED',
} as const;

// ==================== 内容类型 ====================
export const CONTENT_TYPES = {
  ALPHABET: 'alphabet',
  VOCABULARY: 'vocabulary',
  SENTENCE: 'sentence',
  ARTICLE: 'article',
} as const;
