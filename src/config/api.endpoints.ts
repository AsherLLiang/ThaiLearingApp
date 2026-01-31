// src/config/api.endpoints.ts

/*
 * API 端点配置
 *
 * 作用：
 * 1. 统一管理所有 API 路径，支持多后端切换
 * 2. 显式标记“CloudBase 实际存在的云函数”和“仅占位/仅 Java 后端可用”的端点
 *
 * 当前 CloudBase 已部署的函数（来自 cloudbase/cloudbaserc.json）：
 * - user-register
 * - user-login
 * - user-reset-password
 * - user-update-profile
 * - learn-vocab          （多 action：词汇学习 / 模块解锁 等）
 * - memory-engine        （多 action：getTodayMemories / submitMemoryResult / submitRoundEvaluation 等）
 * - alphabet             （字母测试等单独功能）
 *
 * 除上述云函数名以外的 cloudbase 字段，均视为“未实现的云函数名称占位”，
 * 目前前端代码不应调用这些占位端点。
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
  // ✅ CloudBase: 已实现 user-login 云函数
  LOGIN: {
    cloudbase: '/user-login',
    java: '/api/auth/login'
  } as EndpointMap, /*
                    as EndpointMap 表示类型断言
                    作用是告诉TypeScript编译器，这个对象的类型是EndpointMap
                    */

  // 用户注册
  // ✅ CloudBase: 已实现 user-register 云函数
  REGISTER: {
    cloudbase: '/user-register',
    java: '/api/auth/register'
  } as EndpointMap,

  // 重置密码
  // ✅ CloudBase: 已实现 user-reset-password 云函数
  RESET_PASSWORD: {
    cloudbase: '/user-reset-password',
    java: '/api/auth/reset-password'
  } as EndpointMap,

  // 更新个人资料
  // ✅ CloudBase: 已实现 user-update-profile 云函数
  UPDATE_PROFILE: {
    cloudbase: '/user-update-profile',
    java: '/api/user/profile'
  } as EndpointMap,

  // 登出
  // ⚠️ CloudBase: 目前没有 user-logout 云函数，前端仅本地登出，不会调用该 cloudbase 端点
  LOGOUT: {
    cloudbase: '/user-logout',
    java: '/api/auth/logout'
  } as EndpointMap,
};

// ==================== 课程管理 API ====================
// ⚠️ 说明：
// - 下列 cloudbase 字段（/course-get-*）目前没有对应的云函数，仅作为未来扩展的占位。
// - 如需在 CloudBase 上实现课程管理，请新增对应云函数后，再正式启用这些端点。
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
// ⚠️ 说明：
// - 下列 cloudbase 字段（/learning-*）目前没有对应的云函数，仅作为占位；
// - 当前实际的字母 / 单词学习统一走 memory-engine / learn-vocab 多 action 云函数。
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
// ⚠️ 说明：
// - 下列 cloudbase 字段（/pronunciation-*）目前没有对应云函数，仅 Java 端或未来扩展使用。
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
// ⚠️ 说明：
// - 下列 cloudbase 字段（/progress-*）目前没有对应云函数；
// - 进度相关逻辑暂由 memory-engine / learn-vocab 内部更新 user_progress。
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
// ⚠️ 说明：
// - 下列 cloudbase 字段（/review-*）目前没有对应云函数，仅作为未来复习中心化服务的占位。
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
// ⚠️ 说明：
// - 当前字母学习主流程走 memory-engine + getTodayMemories。
// - 这里的 /vocabulary-get-* 云函数名在 CloudBase 中并不存在，仅为最早版本设计的占位。
// - 与字母测试相关的实际云函数为 `alphabet`（多 action），后续如需对接可在此重新映射。
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
    cloudbase: '/alphabet',  // ✅ 修复：添加前导斜杠
    java: '/api/vocabulary/alphabets/test'
  } as EndpointMap,

  SUBMIT_TEST: {
    cloudbase: '/alphabet',  // ✅ 修复：添加前导斜杠
    java: '/api/vocabulary/alphabets/test/submit'
  } as EndpointMap,
};

// ==================== 模块权限 API ====================
export const MODULE_ENDPOINTS = {
  // ✅ CloudBase: 使用 learn-vocab 多 action 云函数（CHECK_ACCESS）
  // DEPRECATED: Migrated to memory-engine
  // CHECK_ACCESS: {
  //   cloudbase: '/learn-vocab',
  //   java: '/api/modules/access'
  // } as EndpointMap,
  // 🔥 修复: GET_USER_PROGRESS 已迁移到 memory-engine
  GET_USER_PROGRESS: {
    cloudbase: '/memory-engine',
    java: '/api/modules/progress'
  } as EndpointMap,
};

// ==================== 单词学习 API ====================
export const VOCABULARY_ENDPOINTS = {
  // /*
  //  * DEPRECATED: Learn-Vocab cloud function has been removed.
  //  * All vocabulary learning logic should now use memory-engine.
  //  */
  // // ✅ CloudBase: 使用 learn-vocab 多 action 云函数（getTodayWords / updateMastery / getVocabularyList 等）
  // GET_TODAY_WORDS: {
  //   cloudbase: '/learn-vocab',
  //   java: '/api/vocabulary/today'
  // } as EndpointMap,
  // UPDATE_MASTERY: {
  //   cloudbase: '/learn-vocab',
  //   java: '/api/vocabulary/mastery'
  // } as EndpointMap,
  // GET_VOCABULARY_LIST: {
  //   cloudbase: '/learn-vocab',
  //   java: '/api/vocabulary/list'
  // } as EndpointMap,
  // TOGGLE_SKIP_WORD: {
  //   cloudbase: '/learn-vocab',
  //   java: '/api/vocabulary/skip'
  // } as EndpointMap,
  // GET_SKIPPED_WORDS: {
  //   cloudbase: '/learn-vocab',
  //   java: '/api/vocabulary/skipped'
  // } as EndpointMap,
  // GET_VOCABULARY_DETAIL: {
  //   cloudbase: '/learn-vocab',
  //   java: '/api/vocabulary/:id'
  // } as EndpointMap,
  // GET_REVIEW_STATISTICS: {
  //   cloudbase: '/learn-vocab',
  //   java: '/api/vocabulary/statistics'
  // } as EndpointMap,
};

// ==================== 统一记忆引擎 API ====================
export const MEMORY_ENDPOINTS = {
  // ✅ CloudBase: 使用 memory-engine 多 action 云函数
  GET_TODAY_MEMORIES: {
    cloudbase: '/memory-engine',  // 云函数名
    java: '/api/memory/today'
  } as EndpointMap,
  SUBMIT_MEMORY_RESULT: {
    cloudbase: '/memory-engine',
    java: '/api/memory/result'
  } as EndpointMap,
  SUBMIT_ROUND_EVALUATION: {
    cloudbase: '/memory-engine',
    java: '/api/memory/round-evaluation'
  } as EndpointMap,
};

// ==================== 下载云存储 API ====================
export const STORAGE_ENDPOINTS = {
  GET_DOWNLOAD_URL: {
    cloudbase: '/storage-download',
    java: '/api/storage/get-download-url', // 预留
  } as EndpointMap,
  BATCH_GET_DOWNLOAD_URLS: {
    cloudbase: '/storage-download',
    java: '/api/storage/batch-get-download-urls',
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
  STORAGE: STORAGE_ENDPOINTS,
};
