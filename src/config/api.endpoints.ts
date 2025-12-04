// src/config/api.endpoints.ts

/*
 * API 端点配置
 * 
 * 作用：统一管理所有 API 路径，支持多后端切换
 */

// ==================== 后端类型定义 ====================
export type BackendType = 'cloudbase' | 'java';

// ==================== 端点映射接口 ====================
export interface EndpointMap {
  cloudbase: string;  // CloudBase 云函数名
  java: string;       // Java Spring Boot 路径
}

// ==================== 认证 API ====================
export const AUTH_ENDPOINTS = {
  // 用户登录
  LOGIN: {
    cloudbase: '/user-login',
    java: '/api/auth/login'
  } as EndpointMap, /*
                    as EndpointMap 表示类型断言
                    作用是告诉TypeScript编译器，这个对象的类型是EndpointMap
                    */

  // 用户注册
  REGISTER: {
    cloudbase: '/user-register',
    java: '/api/auth/register'
  } as EndpointMap,

  // 重置密码
  RESET_PASSWORD: {
    cloudbase: '/user-reset-password',
    java: '/api/auth/reset-password'
  } as EndpointMap,

  // 更新个人资料
  UPDATE_PROFILE: {
    cloudbase: '/user-update-profile',
    java: '/api/user/profile'
  } as EndpointMap,

  // 登出
  LOGOUT: {
    cloudbase: '/user-logout',
    java: '/api/auth/logout'
  } as EndpointMap,
};

// ==================== 课程管理 API ====================
export const COURSE_ENDPOINTS = {
  // 获取所有课程
  GET_ALL: {
    cloudbase: '/course-get-all',
    java: '/api/courses'
  } as EndpointMap,

  // 获取课程详情
  GET_DETAIL: {
    cloudbase: '/course-get-detail',
    java: '/api/courses/:id'
  } as EndpointMap,

  // 获取课程内容
  GET_CONTENT: {
    cloudbase: '/course-get-content',
    java: '/api/courses/:id/content'
  } as EndpointMap,
};

// ==================== 学习功能 API ====================
export const LEARNING_ENDPOINTS = {
  // 获取字母表
  GET_ALPHABETS: {
    cloudbase: '/learning-get-alphabets',
    java: '/api/learning/alphabets'
  } as EndpointMap,

  // 获取词汇
  GET_VOCABULARY: {
    cloudbase: '/learning-get-vocabulary',
    java: '/api/learning/vocabulary'
  } as EndpointMap,

  // 获取句子
  GET_SENTENCES: {
    cloudbase: '/learning-get-sentences',
    java: '/api/learning/sentences'
  } as EndpointMap,

  // 获取文章
  GET_ARTICLES: {
    cloudbase: '/learning-get-articles',
    java: '/api/learning/articles'
  } as EndpointMap,

  // 记录学习完成
  RECORD_COMPLETION: {
    cloudbase: '/learning-record-completion',
    java: '/api/learning/record'
  } as EndpointMap,
};

// ==================== 发音评估 API ====================
export const PRONUNCIATION_ENDPOINTS = {
  // 发音评估
  ASSESS: {
    cloudbase: '/pronunciation-assess',
    java: '/api/pronunciation/assess'
  } as EndpointMap,

  // 获取评估历史
  GET_HISTORY: {
    cloudbase: '/pronunciation-get-history',
    java: '/api/pronunciation/history'
  } as EndpointMap,
};

// ==================== 进度管理 API ====================
export const PROGRESS_ENDPOINTS = {
  // 获取进度
  GET: {
    cloudbase: '/progress-get',
    java: '/api/progress'
  } as EndpointMap,

  // 更新进度
  UPDATE: {
    cloudbase: '/progress-update',
    java: '/api/progress'
  } as EndpointMap,

  // 获取统计数据
  GET_STATISTICS: {
    cloudbase: '/progress-get-statistics',
    java: '/api/progress/statistics'
  } as EndpointMap,
};

// ==================== 复习系统 API ====================
export const REVIEW_ENDPOINTS = {
  // 获取到期复习
  GET_DUE: {
    cloudbase: '/review-get-due',
    java: '/api/reviews/due'
  } as EndpointMap,

  // 更新复习记录
  UPDATE: {
    cloudbase: '/review-update',
    java: '/api/reviews/:id'
  } as EndpointMap,

  // 获取复习历史
  GET_HISTORY: {
    cloudbase: '/review-get-history',
    java: '/api/reviews/history'
  } as EndpointMap,
};

// ==================== 汇总所有端点 ====================


// ==================== 辅助函数：获取端点 ====================
export function getEndpoint(
  endpoint: EndpointMap,
  backendType: BackendType
): string {
  return endpoint[backendType];
}

// ==================== 辅助函数：替换路径参数 ====================
/**
 * 替换路径中的参数
 * 
 * @example
 * replacePathParams('/api/courses/:id', { id: '123' })
 * // 返回: '/api/courses/123'
 */
export function replacePathParams(
  path: string,
  params: Record<string, string>
): string {
  let result = path;

  for (const [key, value] of Object.entries(params)) {
    result = result.replace(`:${key}`, value);
    result = result.replace(`{${key}}`, value);
  }

  return result;
}
// === 字母学习 API ===
// ==================== 字母学习 API ====================
export const ALPHABET_ENDPOINTS = {
  GET_TODAY: {
    cloudbase: '/vocabulary-get-today-alphabets',
    java: '/api/vocabulary/alphabets/today'
  } as EndpointMap,

  SUBMIT_RESULT: {
    cloudbase: '/vocabulary-submit-alphabet-result',
    java: '/api/vocabulary/alphabets/result'
  } as EndpointMap,

  GET_TEST: {
    cloudbase: '/vocabulary-get-alphabet-test',
    java: '/api/vocabulary/alphabets/test'
  } as EndpointMap,

  SUBMIT_TEST: {
    cloudbase: '/vocabulary-submit-alphabet-test',
    java: '/api/vocabulary/alphabets/test/submit'
  } as EndpointMap,
};

// ==================== 模块权限 API ====================
export const MODULE_ENDPOINTS = {
  CHECK_ACCESS: {
    cloudbase: '/learn-vocab',
    java: '/api/modules/access'
  } as EndpointMap,
  GET_USER_PROGRESS: {
    cloudbase: '/learn-vocab',
    java: '/api/modules/progress'
  } as EndpointMap,
};

// ==================== 单词学习 API ====================
export const VOCABULARY_ENDPOINTS = {
  GET_TODAY_WORDS: {
    cloudbase: '/learn-vocab',
    java: '/api/vocabulary/today'
  } as EndpointMap,
  UPDATE_MASTERY: {
    cloudbase: '/learn-vocab',
    java: '/api/vocabulary/mastery'
  } as EndpointMap,
  GET_VOCABULARY_LIST: {
    cloudbase: '/learn-vocab',
    java: '/api/vocabulary/list'
  } as EndpointMap,
  TOGGLE_SKIP_WORD: {
    cloudbase: '/learn-vocab',
    java: '/api/vocabulary/skip'
  } as EndpointMap,
  GET_SKIPPED_WORDS: {
    cloudbase: '/learn-vocab',
    java: '/api/vocabulary/skipped'
  } as EndpointMap,
  GET_VOCABULARY_DETAIL: {
    cloudbase: '/learn-vocab',
    java: '/api/vocabulary/:id'
  } as EndpointMap,
  GET_REVIEW_STATISTICS: {
    cloudbase: '/learn-vocab',
    java: '/api/vocabulary/statistics'
  } as EndpointMap,
};

// ==================== 统一记忆引擎 API ====================
export const MEMORY_ENDPOINTS = {
  GET_TODAY_MEMORIES: {
    cloudbase: '/learn-vocab',  // 云函数名
    java: '/api/memory/today'
  } as EndpointMap,
  SUBMIT_MEMORY_RESULT: {
    cloudbase: '/learn-vocab',
    java: '/api/memory/result'
  } as EndpointMap,
};

// ==================== 汇总所有端点 ====================
export const API_ENDPOINTS = {
  AUTH: AUTH_ENDPOINTS,
  COURSE: COURSE_ENDPOINTS,
  LEARNING: LEARNING_ENDPOINTS,
  PRONUNCIATION: PRONUNCIATION_ENDPOINTS,
  PROGRESS: PROGRESS_ENDPOINTS,
  REVIEW: REVIEW_ENDPOINTS,
  ALPHABET: ALPHABET_ENDPOINTS,
  VOCABULARY: VOCABULARY_ENDPOINTS,
  MODULE: MODULE_ENDPOINTS,
  MEMORY: MEMORY_ENDPOINTS,
};