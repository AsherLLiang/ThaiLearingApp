/**
 * 常量定义模块
 * 
 * 与前端 src/config/constants.ts 保持一致的设计风格
 * 集中管理所有云函数常量
 */

'use strict';

// ==================== 数据库集合名称 ====================
// 与前端 COLLECTIONS 保持一致
const COLLECTIONS = {
  USERS: 'users',
  LETTERS: 'letters',
  USER_ALPHABET_PROGRESS: 'user_alphabet_progress',
  COURSES: 'courses',
  LESSONS: 'lessons',
  PROGRESS: 'progress',
  LETTER_TEST_BANK: 'letter_test_bank',
};

// ==================== 掌握程度 ====================
// 使用中文值，便于前端直接显示
const MasteryLevel = Object.freeze({
  UNFAMILIAR: '陌生',
  FUZZY: '模糊',
  REMEMBERED: '记得',
});

// ==================== 学习等级 ====================
// 与前端 LEVELS 保持一致
// const LEVELS = Object.freeze({
//   BEGINNER_A: 'BEGINNER_A',
//   BEGINNER_B: 'BEGINNER_B',
//   INTERMEDIATE: 'INTERMEDIATE',
//   ADVANCED: 'ADVANCED',
// });

// ==================== SM-2 算法参数 ====================
// 优化版参数，基于艾宾浩斯遗忘曲线
const SM2_PARAMS = Object.freeze({
  INITIAL_EASINESS_FACTOR: 2.5,   // 初始简易度
  MIN_EASINESS_FACTOR: 1.3,       // 最小简易度
  MAX_INTERVAL_DAYS: 180,         // 最大间隔（天）
  FUZZY_MULTIPLIER: 0.8,          // "模糊"时间隔缩短比例
});

// ==================== 早期复习间隔序列 ====================
// 基于艾宾浩斯遗忘曲线优化: 1→2→4→7→14 天
const EARLY_INTERVALS = Object.freeze([1, 2, 4, 7, 14]);

// ==================== 每日学习配置 ====================
const DAILY_LEARNING_CONFIG = Object.freeze({
  MAX_NEW_WORDS: 10,              // 每日新词上限
  MAX_REVIEW_WORDS: 20,           // 每日复习上限
  TOTAL_WORDS_LIMIT: 30,          // 每日总词数上限
});

// ==================== 错误码 ====================
// 统一错误码定义
const ErrorCodes = Object.freeze({
  SUCCESS: 'SUCCESS',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  VOCABULARY_NOT_FOUND: 'VOCABULARY_NOT_FOUND',
  INVALID_PARAMS: 'INVALID_PARAMS',
  INVALID_MASTERY: 'INVALID_MASTERY',
  UNKNOWN_ACTION: 'UNKNOWN_ACTION',
  SERVER_ERROR: 'SERVER_ERROR',
});

// ==================== 错误消息 ====================
// 与前端 ERROR_MESSAGES 风格一致
const ERROR_MESSAGES = Object.freeze({
  USER_NOT_FOUND: '用户不存在，请检查用户ID或重新登录',
  VOCABULARY_NOT_FOUND: '词汇不存在，请检查词汇ID',
  INVALID_PARAMS: '参数格式错误，请检查输入',
  INVALID_MASTERY: '无效的掌握程度，允许值: 陌生/模糊/记得',
  UNKNOWN_ACTION: '未知操作类型',
  SERVER_ERROR: '服务器内部错误，请稍后重试',
});

// ==================== 支持的 Actions ====================
const SUPPORTED_ACTIONS = Object.freeze([
  'getLetterTest',
  'submitLetterTest',
  'passLetterTest',
]);

module.exports = {
  // 集合
  COLLECTIONS,

  // 枚举
  MasteryLevel,
  LEVELS,
  ErrorCodes,

  // 算法参数
  SM2_PARAMS,
  EARLY_INTERVALS,

  // 配置
  DAILY_LEARNING_CONFIG,

  // 消息
  ERROR_MESSAGES,
  SUPPORTED_ACTIONS,
};
