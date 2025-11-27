// src/config/constants.ts

/**
 * 应用常量配置
 */

// ==================== 数据库集合名称 ====================
export const COLLECTIONS = {
  USERS: 'users',
  COURSES: 'courses',
  LESSONS: 'lessons',
  EXERCISES: 'exercises',
  ALPHABETS: 'alphabets',
  VOCABULARY: 'vocabulary',
  SENTENCES: 'sentences',
  ARTICLES: 'articles',
  PRONUNCIATION_RECORDS: 'pronunciationRecords',
  PROGRESS: 'progress',
  REVIEW_SCHEDULES: 'reviewSchedules',
  LEARNING_RECORDS: 'learningRecords',
};

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